/**
 * formatChem: display-only chemistry formatting, plain text in, plain text out.
 *
 *   H2SO4 -> H₂SO₄    Ca(OH)2 -> Ca(OH)₂    2H2O -> 2H₂O    Cu2+ -> Cu²⁺
 *   NO3− -> NO₃⁻      SO4 2− -> SO₄²⁻       2e− -> 2e⁻      24 dm3 -> 24 dm³
 *
 * The source files keep formulae as plain ASCII-ish text (see CLAUDE.md). This function
 * rewrites digits and charges as Unicode subscript/superscript characters so the page reads
 * like a printed paper. It is pure, idempotent and deliberately strict: a token is only
 * changed when it parses COMPLETELY as a chemical formula built from real element symbols.
 * Anything doubtful is returned unchanged, because a wrong transformation ("Q₁₆", "pH₇",
 * "In ₂₀₂₆") is far worse than a plain "H2O".
 *
 * Algorithm (see BUILD_V1.md §3 "Chemistry formatting"):
 *
 * 1. Tokenise. A token is a maximal run of [A-Za-z0-9()+] plus the minus signs "−" (U+2212)
 *    and "-" (ASCII). Everything else is a boundary: spaces, en/em dashes (bonds), square
 *    brackets, punctuation, "=", "→", and Unicode sub/superscripts that are already there.
 * 2. Unit rule: a token that is exactly "cm3" or "dm3" gets a superscript 3. "m3" and "cm2"
 *    are left alone.
 * 3. Electron rule: "e−" / "e-" with an optional leading coefficient -> "e⁻", "2e⁻".
 * 4. Formula rule: coefficient? body, where body := unit+ charge? state?
 *      unit   := ElementSymbol digits? | "(" unit+ ")" digits?
 *      charge := [1-9]? sign           (only at the very end)
 *      state  := "(s)" | "(l)" | "(g)" | "(aq)"
 *    Element symbols are matched case-sensitively against the full 118-symbol list, longest
 *    first ("Cl" before "C"). Digits after a symbol or a ")" become subscripts; the charge
 *    becomes a superscript; coefficient and state symbol are kept as they are.
 *    Extra strictness, all learned from the real content:
 *      - A digit directly before the sign is the CHARGE when the body is a single element
 *        ("Cu2+" -> Cu²⁺, "O2−" -> O²⁻) and a SUBSCRIPT when the body is polyatomic
 *        ("NO3−" -> NO₃⁻, "NH4+" -> NH₄⁺). Polyatomic ions with a multiple charge are
 *        written with a space in the source ("SO4 2−"), handled by rule 5.
 *      - A lone element with a subscript is only accepted for molecules that exist as such
 *        (H2, N2, O2, F2, Cl2, Br2, I2, O3, P4, S8, C60). "C1", "C2", "C3" in "the C2–C3
 *        bond" are carbon position labels and stay plain.
 *      - A written subscript "1" or a leading "0" is never a formula ("C1" stays plain).
 *      - Subscripts are at most two digits.
 *      - A hypothetical element written as one capital letter that is NOT an element symbol
 *        is accepted only as a charged ion: "X2+" -> X²⁺, "T2−" -> T²⁻, "M2+" -> M²⁺. Plain
 *        "X2" or "XCl2" stay as written, so "Q16" and "T04" are safe.
 * 5. Spaced charge: a token that was formatted with a subscript and is followed by
 *    " <digit><sign>" at a boundary absorbs it as its charge: "SO4 2−" -> SO₄²⁻,
 *    "Cr2O7 2−" -> Cr₂O₇²⁻. A bare "+" after a space is never a charge ("CO2 + H2O"), and a
 *    body without a subscript never merges ("B 6+", an MCQ option, stays as written).
 * 6. Parentheses: unbalanced outer parentheses are stripped and restored ("(H+" -> "(H⁺").
 *    If a balanced token is not a formula as a whole, each parenthesised segment is tried on
 *    its own: "Mr(NH3)" -> Mr(NH₃), "(1)" stays "(1)".
 *
 * The output contains only Unicode sub/superscript digits, "⁺" and "⁻"; since those are
 * boundaries, running formatChem over its own output changes nothing.
 */
import { ELEMENT_SET } from './elements';

const SUB: Readonly<Record<string, string>> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
};

const SUP: Readonly<Record<string, string>> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '−': '⁻', '-': '⁻',
};

/** Lone elements that may carry a subscript. Anything else ("C3", "Cu2") is not a molecule. */
const ELEMENTAL_MOLECULES: ReadonlySet<string> = new Set([
  'H2', 'N2', 'O2', 'F2', 'Cl2', 'Br2', 'I2', 'O3', 'P4', 'S8', 'C60',
]);

/** Characters that can be part of a token. Everything else is a boundary. */
const TOKEN_CHAR = /[A-Za-z0-9()+\-−]/;
/** Longest run of token characters, used from a known start index. */
const TOKEN_RUN = /[A-Za-z0-9()+\-−]+/y;
/** Quick exit: without a digit or a sign nothing can change. */
const COULD_CHANGE = /[0-9+\-−]/;
/** " 2−" directly after a formula, followed by a boundary or the end of the text. */
const SPACED_CHARGE = / ([1-9])([+\-−])(?=$|[^A-Za-z0-9()+\-−])/y;
const STATE_SUFFIX = /\((?:s|l|g|aq)\)$/;
const ELECTRON = /^([0-9]*)e[\-−]$/;
const LEADING_DIGITS = /^[0-9]+/;
const PLACEHOLDER_ION = /^([A-Z])([1-9]?)$/;

type Unit =
  | { kind: 'element'; symbol: string; digits: string }
  | { kind: 'group'; units: Unit[]; digits: string };

interface FormulaResult {
  text: string;
  /** At least one subscript was written (e.g. SO₄). Needed for the spaced-charge rule. */
  hasSubscript: boolean;
  /** The token ended in a charge. */
  hasCharge: boolean;
  /** The token ended in a state symbol such as (aq). */
  hasState: boolean;
}

interface TokenResult {
  text: string;
  /** The token may absorb a following " 2−" as its charge. */
  acceptsSpacedCharge: boolean;
}

function toSub(digits: string): string {
  let out = '';
  for (const d of digits) out += SUB[d] ?? d;
  return out;
}

function toSup(chars: string): string {
  let out = '';
  for (const c of chars) out += SUP[c] ?? c;
  return out;
}

function isSign(c: string): boolean {
  return c === '+' || c === '-' || c === '−';
}

/**
 * Parse `s` as unit+ (element symbols with optional subscripts, and parenthesised groups).
 * Returns null unless the WHOLE string is consumed.
 */
function parseUnits(s: string): Unit[] | null {
  const units: Unit[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s.charAt(i);
    if (c === '(') {
      let depth = 1;
      let j = i + 1;
      while (j < s.length && depth > 0) {
        const d = s.charAt(j);
        if (d === '(') depth++;
        else if (d === ')') depth--;
        j++;
      }
      if (depth !== 0) return null;
      const inner = parseUnits(s.slice(i + 1, j - 1));
      if (!inner || inner.length === 0) return null;
      const digits = LEADING_DIGITS.exec(s.slice(j))?.[0] ?? '';
      units.push({ kind: 'group', units: inner, digits });
      i = j + digits.length;
    } else if (c >= 'A' && c <= 'Z') {
      // Longest match first: a two-letter symbol is Upper+lower, so "Cl" wins over "C" and
      // a lowercase letter that does not complete a symbol fails the whole parse.
      const two = s.slice(i, i + 2);
      let symbol: string;
      if (two.length === 2 && two.charAt(1) >= 'a' && two.charAt(1) <= 'z' && ELEMENT_SET.has(two)) {
        symbol = two;
      } else if (ELEMENT_SET.has(c)) {
        symbol = c;
      } else {
        return null;
      }
      i += symbol.length;
      const digits = LEADING_DIGITS.exec(s.slice(i))?.[0] ?? '';
      units.push({ kind: 'element', symbol, digits });
      i += digits.length;
    } else {
      return null;
    }
  }
  return units;
}

/** Subscripts must look like real subscripts: no "1", no leading "0", at most two digits. */
function subscriptsArePlausible(units: Unit[]): boolean {
  for (const u of units) {
    if (u.digits !== '' && (u.digits === '1' || u.digits.startsWith('0') || u.digits.length > 2)) return false;
    if (u.kind === 'group' && !subscriptsArePlausible(u.units)) return false;
  }
  return true;
}

function anySubscript(units: Unit[]): boolean {
  return units.some((u) => u.digits !== '' || (u.kind === 'group' && anySubscript(u.units)));
}

function renderUnits(units: Unit[]): string {
  let out = '';
  for (const u of units) {
    if (u.kind === 'element') out += u.symbol + toSub(u.digits);
    else out += '(' + renderUnits(u.units) + ')' + toSub(u.digits);
  }
  return out;
}

/**
 * The formula rule on one token (no unbalanced parentheses). Returns null when the token is
 * not, in its entirety, a formula. A valid formula with nothing to transform (e.g. "NaCl",
 * "Cu(s)") is returned unchanged with both flags false.
 */
function formatFormula(token: string): FormulaResult | null {
  const coefficient = LEADING_DIGITS.exec(token)?.[0] ?? '';
  let body = token.slice(coefficient.length);
  if (body === '') return null;

  let state = '';
  const stateMatch = STATE_SUFFIX.exec(body);
  if (stateMatch) {
    state = stateMatch[0];
    body = body.slice(0, -state.length);
    if (body === '') return null;
  }

  let sign = '';
  if (isSign(body.charAt(body.length - 1))) {
    sign = body.charAt(body.length - 1);
    body = body.slice(0, -1);
    if (body === '') return null;
  }

  const units = parseUnits(body);
  if (!units) {
    // Hypothetical element written as one non-element capital letter, charged: "X2+", "T2−".
    if (sign !== '' && coefficient === '' && state === '') {
      const m = PLACEHOLDER_ION.exec(body);
      if (m && !ELEMENT_SET.has(m[1]!)) {
        return { text: m[1]! + toSup(m[2]!) + toSup(sign), hasSubscript: false, hasCharge: true, hasState: false };
      }
    }
    return null;
  }

  // "Cu2+": with a single element the digit before the sign is the charge, not a subscript.
  let chargeDigits = '';
  const only = units.length === 1 ? units[0]! : null;
  if (sign !== '' && only && only.kind === 'element' && /^[1-9]$/.test(only.digits)) {
    chargeDigits = only.digits;
    only.digits = '';
  }

  if (!subscriptsArePlausible(units)) return null;

  // A lone element with a subscript must be a molecule that exists ("O2", not "C3").
  if (only && only.kind === 'element' && only.digits !== '' && !ELEMENTAL_MOLECULES.has(only.symbol + only.digits)) {
    return null;
  }

  const hasSubscript = anySubscript(units);
  const hasCharge = sign !== '';
  if (!hasSubscript && !hasCharge) {
    return { text: token, hasSubscript: false, hasCharge: false, hasState: state !== '' };
  }
  const text = coefficient + renderUnits(units) + toSup(chargeDigits) + toSup(sign) + state;
  return { text, hasSubscript, hasCharge, hasState: state !== '' };
}

/** Unit rule, electron rule and formula rule, on a token or a parenthesis-free segment. */
function formatSimple(token: string): FormulaResult | null {
  if (token === 'cm3' || token === 'dm3') {
    return { text: token.slice(0, 2) + '³', hasSubscript: false, hasCharge: false, hasState: false };
  }
  const e = ELECTRON.exec(token);
  if (e) return { text: e[1] + 'e⁻', hasSubscript: false, hasCharge: true, hasState: false };
  return formatFormula(token);
}

/** One token, including the parenthesis handling of rule 6. */
function formatToken(token: string): TokenResult {
  const whole = formatSimple(token);
  if (whole) {
    return {
      text: whole.text,
      acceptsSpacedCharge: whole.hasSubscript && !whole.hasCharge && !whole.hasState,
    };
  }

  // Strip parentheses that cannot be part of a formula: unbalanced leading "(" and trailing
  // ")", plus any leading ")" or trailing "(".
  let open = 0;
  let close = 0;
  for (const c of token) {
    if (c === '(') open++;
    else if (c === ')') close++;
  }
  let start = 0;
  let end = token.length;
  while (start < end && token.charAt(start) === ')') { start++; close--; }
  while (end > start && token.charAt(end - 1) === '(') { end--; open--; }
  while (start < end && token.charAt(start) === '(' && open > close) { start++; open--; }
  while (end > start && token.charAt(end - 1) === ')' && close > open) { end--; close--; }

  const prefix = token.slice(0, start);
  const suffix = token.slice(end);
  const core = token.slice(start, end);

  if (core !== token) {
    const stripped = formatSimple(core);
    if (stripped) {
      return {
        text: prefix + stripped.text + suffix,
        acceptsSpacedCharge: stripped.hasSubscript && !stripped.hasCharge && !stripped.hasState && suffix === '',
      };
    }
  }

  // Not a formula as a whole. Try each parenthesised segment on its own: "Mr(NH3)".
  if (core.includes('(') || core.includes(')')) {
    let text = '';
    for (const segment of core.split(/([()])/)) {
      if (segment === '' || segment === '(' || segment === ')') text += segment;
      else text += formatSimple(segment)?.text ?? segment;
    }
    return { text: prefix + text + suffix, acceptsSpacedCharge: false };
  }

  return { text: token, acceptsSpacedCharge: false };
}

/**
 * Format every chemistry token in `text`. Pure, idempotent, never throws.
 * See the file comment for the rules.
 */
export function formatChem(text: string): string {
  if (!COULD_CHANGE.test(text)) return text;
  let out = '';
  let i = 0;
  const n = text.length;
  while (i < n) {
    const c = text.charAt(i);
    if (!TOKEN_CHAR.test(c)) {
      out += c;
      i++;
      continue;
    }
    TOKEN_RUN.lastIndex = i;
    const token = TOKEN_RUN.exec(text)![0];
    const result = formatToken(token);
    out += result.text;
    i += token.length;
    if (result.acceptsSpacedCharge) {
      SPACED_CHARGE.lastIndex = i;
      const m = SPACED_CHARGE.exec(text);
      if (m) {
        out += toSup(m[1]!) + toSup(m[2]!);
        i += m[0].length;
      }
    }
  }
  return out;
}
