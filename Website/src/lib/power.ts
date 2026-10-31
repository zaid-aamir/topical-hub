/**
 * Display-only caret notation for subjects with powerFormatting (src/config.ts): the sources
 * write powers with a caret ("m^3", "m / s^2", "6.0 × 10^24", "10^-7", "I^2R"), and Edexcel
 * Chemistry also writes ion charges that way ("Cu^2+", "H^+", "SO4^2–", "e^–").
 *
 * - Charge: a caret, an optional single digit and a sign (+, hyphen, U+2212 or en dash) that is
 *   not followed by a letter or digit ("Cu^2+", "Cl^–", "OH^–(aq)"). The minus is set as U+2212.
 *   "a^2+b" and "10^-7" are not charges.
 * - Power: a caret followed by an optional minus sign (hyphen or U+2212) and one or more digits.
 * Anything else after a caret ("^A_Z X") is left exactly as written, and nothing else in the text
 * changes.
 *
 * - formatPowers(text): plain text to plain text with Unicode superscripts (m^3 -> m³,
 *   10^-7 -> 10⁻⁷, Cu^2+ -> Cu²⁺), for tests and plain-text uses.
 * - applyPowers(html): the same over the text nodes of an HTML string, set as <sup> holding plain
 *   characters (m<sup>3</sup>, 10<sup>−7</sup>, Cu<sup>2+</sup>), because the bundled font subsets
 *   lack the Unicode superscript block (the same reason applyChem uses <sub>/<sup>).
 */
import { mapTextNodes } from './chem';

const CHARGE = /\^([1-9]?)([+\-−–])(?![A-Za-z0-9])/g;
const POWER = /\^([-−]?)(\d+)/g;

const SUPERSCRIPT_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹';

const superscript = (digits: string) => [...digits].map((d) => SUPERSCRIPT_DIGITS[Number(d)]).join('');
const sign = (s: string) => (s === '+' ? '+' : '−');

/** "m / s^2" -> "m / s²", "10^-7" -> "10⁻⁷", "Cu^2+" -> "Cu²⁺". */
export function formatPowers(text: string): string {
  return text
    .replace(CHARGE, (_, digit: string, s: string) => superscript(digit) + (s === '+' ? '⁺' : '⁻'))
    .replace(POWER, (_, minus: string, digits: string) => (minus ? '⁻' : '') + superscript(digits));
}

/** "m / s^2" -> "m / s<sup>2</sup>", "10^-7" -> "10<sup>−7</sup>", "Cu^2+" -> "Cu<sup>2+</sup>", in text nodes only. */
export function applyPowers(html: string): string {
  if (!html.includes('^')) return html;
  return mapTextNodes(html, (text) =>
    text
      .replace(CHARGE, (_, digit: string, s: string) => `<sup>${digit}${sign(s)}</sup>`)
      .replace(POWER, (_, minus: string, digits: string) => `<sup>${minus ? '−' : ''}${digits}</sup>`),
  );
}
