/**
 * Display-only power notation for subjects with powerFormatting (src/config.ts): the sources
 * write powers with a caret ("m^3", "m / s^2", "6.0 × 10^24", "10^-7", "I^2R").
 *
 * Only a caret followed by an optional minus sign (hyphen or U+2212) and one or more digits is
 * a power. Anything else after a caret ("^A_Z X") is left exactly as written, and nothing else in
 * the text changes.
 *
 * - formatPowers(text): plain text to plain text with Unicode superscripts (m^3 -> m³,
 *   10^-7 -> 10⁻⁷), for tests and plain-text uses.
 * - applyPowers(html): the same over the text nodes of an HTML string, set as <sup> holding plain
 *   characters (m<sup>3</sup>, 10<sup>−7</sup>), because the bundled font subsets lack the
 *   Unicode superscript block (the same reason applyChem uses <sub>/<sup>).
 */
import { mapTextNodes } from './chem';

const POWER = /\^([-−]?)(\d+)/g;

const SUPERSCRIPT_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹';

/** "m / s^2" -> "m / s²", "10^-7" -> "10⁻⁷". */
export function formatPowers(text: string): string {
  return text.replace(POWER, (_, minus: string, digits: string) =>
    (minus ? '⁻' : '') + [...digits].map((d) => SUPERSCRIPT_DIGITS[Number(d)]).join(''),
  );
}

/** "m / s^2" -> "m / s<sup>2</sup>", "10^-7" -> "10<sup>−7</sup>", in text nodes only. */
export function applyPowers(html: string): string {
  if (!html.includes('^')) return html;
  return mapTextNodes(html, (text) =>
    text.replace(POWER, (_, minus: string, digits: string) => `<sup>${minus ? '−' : ''}${digits}</sup>`),
  );
}
