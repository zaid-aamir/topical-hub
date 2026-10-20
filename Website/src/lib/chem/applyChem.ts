/**
 * applyChem: run formatChem() over the TEXT NODES of an HTML string, then set the resulting
 * Unicode sub/superscripts as <sub>/<sup> elements holding plain characters.
 *
 * formatChem() stays a pure text function (H2SO4 -> H₂SO₄) so it can be tested as text. On the
 * page, though, the bundled font subsets do not include the Unicode sub/superscript block, so
 * those characters would fall back to a system font and look out of place. Converting each run
 * to <sub>2</sub> / <sup>2−</sup> renders the digits in the real web font, keeps copy-paste and
 * find-in-page working on the plain digits ("H2SO4"), and reads naturally in a screen reader.
 * Sub/superscripts already written as Unicode in the source (isotope notation, 10²³) are
 * converted the same way so every formula on a page is set alike.
 *
 * Tags and attributes are copied through untouched (so `data-x="H2O"` keeps its value),
 * HTML entities (`&lt;`, `&amp;`, `&#39;`, ...) are left exactly as they are, and nothing
 * inside <code>, <pre>, <a>, <script> or <style> is changed (nesting is tracked).
 *
 * The input is the HTML produced by src/lib/markdown.ts, which never contains raw HTML from
 * the content, so the walker only needs to be robust, not a full HTML parser: it recognises
 * start tags, end tags, comments and declarations, honours quoted attribute values, and
 * treats a "<" that does not start a tag as ordinary text.
 */
import { formatChem } from './formatChem';

/** Elements whose text content must never be formatted. */
const SKIP_ELEMENTS: ReadonlySet<string> = new Set(['code', 'pre', 'a', 'script', 'style']);

/** A character reference: named, decimal or hexadecimal. */
const ENTITY = /&[a-zA-Z0-9#]+;/g;

interface Tag {
  /** Index just past the closing ">" (or past "-->" for a comment). */
  end: number;
  /** Lower-cased element name, '' for comments and declarations. */
  name: string;
  kind: 'open' | 'close' | 'other';
}

function isNameStart(c: string): boolean {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
}

/** Read the tag starting at html[at] === '<'. Returns null when this "<" is not a tag. */
function readTag(html: string, at: number): Tag | null {
  const next = html.charAt(at + 1);
  if (html.startsWith('<!--', at)) {
    const close = html.indexOf('-->', at + 4);
    return { end: close === -1 ? html.length : close + 3, name: '', kind: 'other' };
  }
  if (next === '!' || next === '?') {
    const close = html.indexOf('>', at + 2);
    return { end: close === -1 ? html.length : close + 1, name: '', kind: 'other' };
  }
  let i = at + 1;
  let kind: Tag['kind'] = 'open';
  if (next === '/') {
    kind = 'close';
    i++;
  }
  if (!isNameStart(html.charAt(i))) return null;
  const nameStart = i;
  while (i < html.length && /[A-Za-z0-9:-]/.test(html.charAt(i))) i++;
  const name = html.slice(nameStart, i).toLowerCase();
  // Find the closing ">", skipping over quoted attribute values.
  let quote = '';
  while (i < html.length) {
    const c = html.charAt(i);
    if (quote) {
      if (c === quote) quote = '';
    } else if (c === '"' || c === "'") {
      quote = c;
    } else if (c === '>') {
      return { end: i + 1, name, kind };
    }
    i++;
  }
  return { end: html.length, name, kind };
}

/** Unicode subscript characters and the plain characters they stand for. */
const SUB_CHARS: Readonly<Record<string, string>> = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
};

/** Unicode superscript characters and the plain characters they stand for (minus is U+2212). */
const SUP_CHARS: Readonly<Record<string, string>> = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
  '⁺': '+', '⁻': '−',
};

const ANY_SCRIPT = /[⁰-₟²³¹]/;
const SUB_RUN = /[₀-₉]+/g;
const SUP_RUN = /[⁰¹²³⁴-⁹⁺⁻]+/g;

/** Replace each run of Unicode sub/superscript characters with a <sub>/<sup> element of plain characters. */
function markupScripts(text: string): string {
  if (!ANY_SCRIPT.test(text)) return text;
  return text
    .replace(SUB_RUN, (run) => `<sub>${[...run].map((c) => SUB_CHARS[c] ?? c).join('')}</sub>`)
    .replace(SUP_RUN, (run) => `<sup>${[...run].map((c) => SUP_CHARS[c] ?? c).join('')}</sup>`);
}

/** Format one entity-free piece of text. */
function formatPiece(text: string): string {
  return markupScripts(formatChem(text));
}

/** Format the pieces of a text node between entities, leaving the entities as written. */
function formatText(text: string): string {
  if (!text.includes('&')) return formatPiece(text);
  let out = '';
  let last = 0;
  ENTITY.lastIndex = 0;
  for (let m = ENTITY.exec(text); m; m = ENTITY.exec(text)) {
    out += formatPiece(text.slice(last, m.index)) + m[0];
    last = m.index + m[0].length;
  }
  return out + formatPiece(text.slice(last));
}

/**
 * Apply formatChem to every text node in `html`. Pure; returns the input unchanged when
 * nothing in it is a formula.
 */
export function applyChem(html: string): string {
  return mapTextNodes(html, formatText);
}

/**
 * Run `format` over every text node of `html` outside <code>, <pre>, <a>, <script> and <style>,
 * copying tags, attributes and comments through untouched. `format` receives raw HTML text
 * (entities included) and returns HTML. Shared with the power formatting in src/lib/power.ts.
 */
export function mapTextNodes(html: string, format: (text: string) => string): string {
  let out = '';
  let i = 0;
  const skipStack: string[] = [];
  const n = html.length;
  while (i < n) {
    const lt = html.indexOf('<', i);
    const textEnd = lt === -1 ? n : lt;
    if (textEnd > i) {
      const text = html.slice(i, textEnd);
      out += skipStack.length ? text : format(text);
    }
    if (lt === -1) break;
    const tag = readTag(html, lt);
    if (!tag) {
      // A stray "<" that is not a tag: treat it as text.
      out += '<';
      i = lt + 1;
      continue;
    }
    out += html.slice(lt, tag.end);
    if (SKIP_ELEMENTS.has(tag.name)) {
      if (tag.kind === 'open') {
        skipStack.push(tag.name);
      } else if (tag.kind === 'close') {
        const idx = skipStack.lastIndexOf(tag.name);
        if (idx !== -1) skipStack.splice(idx, 1);
      }
    }
    i = tag.end;
  }
  return out;
}
