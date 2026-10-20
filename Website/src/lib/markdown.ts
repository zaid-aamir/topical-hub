/**
 * Markdown rendering for content text (question stems, options, parts, mark points,
 * worked solutions). Thin wrapper around `marked` with the settings the content needs:
 *
 * - GFM on (tables, strikethrough), line breaks off, no smart punctuation.
 * - Raw HTML NEVER passes through. Content is plain text, so a literal `<br>` or
 *   `<script>` in a source file is rendered as visible text (`&lt;br&gt;`), and `<`, `>`
 *   and `&` in ordinary text are escaped ("gas &lt; liquid &lt; solid").
 * - No links or images are generated: bare URLs stay text, and `[text](url)`,
 *   `![alt](src)` and `<https://...>` are shown as the literal source text. The content
 *   has no links by design, and this keeps "[1](b)" from turning into an anchor.
 * - Every GFM table is wrapped in `<div class="table-scroll">` so it can scroll inside its
 *   card on narrow screens (see the DOM contract in CONTRACT.md).
 * - When CHEM_FORMATTING (src/config.ts) is true, applyChem() rewrites formulae in the text
 *   nodes of the result: H2SO4 -> H<sub>2</sub>SO<sub>4</sub>. Pass `{ chem: false }` or use
 *   mdBlockRaw / mdInlineRaw to skip it.
 * - With `{ power: true }`, applyPowers() sets caret powers as superscripts in the text nodes:
 *   m^3 -> m<sup>3</sup>, 10^-7 -> 10<sup>−7</sup> (src/lib/power.ts).
 * - subjectFormat(subject) gives the options for a subject from its chemFormatting and
 *   powerFormatting flags (src/config.ts); components pass that object down unchanged.
 * - The content writes one paragraph per line (worked solutions put "(a) ...", "(b) ..." on
 *   consecutive lines, and some follow a list with a plain sentence). mdBlock therefore
 *   treats a single newline before a prose line as a paragraph break; see paragraphize().
 *
 * Output is only ever used through Astro's `set:html` (CONTRACT.md, Conventions).
 */
import { Marked, type Tokens } from 'marked';
import { CHEM_FORMATTING } from '../config';
import type { Subject } from '../config';
import { applyChem } from './chem';
import { applyPowers } from './power';

const ESCAPE_RE = /[&<>"']/g;
const ESCAPE_MAP: Readonly<Record<string, string>> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escape text for safe inclusion in HTML (all five characters, always). */
export function escapeHtml(text: string): string {
  return text.replace(ESCAPE_RE, (c) => ESCAPE_MAP[c] ?? c);
}

const marked = new Marked({
  gfm: true,
  breaks: false,
  pedantic: false,
  async: false,
  renderer: {
    // Any raw HTML in the source, block or inline, becomes visible escaped text.
    html(token: Tokens.HTML | Tokens.Tag): string {
      const text = escapeHtml(token.text.replace(/\s+$/, ''));
      return token.block ? `<p>${text}</p>\n` : text;
    },
    // Links and images are shown as their literal Markdown source, never as <a> or <img>.
    link(token: Tokens.Link): string {
      return escapeHtml(token.raw);
    },
    image(token: Tokens.Image): string {
      return escapeHtml(token.raw);
    },
  },
  tokenizer: {
    // GFM autolinking of bare URLs ("www.example.com") is off: the text stays text.
    url(): undefined {
      return undefined;
    },
  },
});

export interface MarkdownOptions {
  /** Apply chemistry formatting to the text nodes. Defaults to CHEM_FORMATTING from src/config.ts. */
  chem?: boolean;
  /** Set caret powers (m^3, 10^-7) as superscripts. Default false. */
  power?: boolean;
}

/** The display formatting of a subject's content text. */
export function subjectFormat(subject: Subject): MarkdownOptions {
  return { chem: CHEM_FORMATTING && subject.chemFormatting, power: subject.powerFormatting };
}

function wrapTables(html: string): string {
  // Raw HTML is escaped above, so every <table> here is a GFM table rendered by marked.
  // tabindex lets keyboard users scroll a wide table.
  return html
    .replace(/<table>/g, '<div class="table-scroll" tabindex="0"><table>')
    .replace(/<\/table>/g, '</table></div>');
}

function finish(html: string, options: MarkdownOptions): string {
  const chem = (options.chem ?? CHEM_FORMATTING) ? applyChem(html) : html;
  return options.power ? applyPowers(chem) : chem;
}

const LIST_ITEM = /^\s*(?:[-*+]|\d+[.)])\s/;
const TABLE_ROW = /^\s*\|/;
const INDENTED = /^(?: {2,}|\t)/;
const OTHER_BLOCK = /^\s*(?:#{1,6}\s|>|```|~~~|(?:---|\*\*\*|___)\s*$)/;

/** A line of ordinary prose: not blank, not a list item, table row, indented line or other block start. */
function isProse(line: string): boolean {
  return (
    line.trim() !== '' &&
    !LIST_ITEM.test(line) &&
    !TABLE_ROW.test(line) &&
    !INDENTED.test(line) &&
    !OTHER_BLOCK.test(line)
  );
}

/**
 * Make every prose line its own paragraph.
 *
 * The source files write one paragraph per line: 150 worked solutions put "(a) ...", "(b) ..."
 * on consecutive lines, 18 follow a list with a plain sentence, and no line is a soft-wrapped
 * continuation of the one before (checked over all 24 files). CommonMark would join consecutive
 * lines into one paragraph and make a plain line after a list item a lazy continuation of it, so
 * a blank line is inserted before any prose line that directly follows a non-blank line, and
 * before a table that directly follows prose. Lists, nested (indented) items and table rows are
 * left exactly as written.
 */
export function paragraphize(md: string): string {
  const lines = md.split('\n');
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    const prev = i > 0 ? (lines[i - 1] ?? '') : '';
    if (prev.trim() !== '') {
      if (isProse(line) || (TABLE_ROW.test(line) && isProse(prev))) out.push('');
    }
    out.push(line);
  }
  return out.join('\n');
}

/** Block-level Markdown (paragraphs, lists, tables) to HTML. */
export function mdBlock(md: string, options: MarkdownOptions = {}): string {
  const html = marked.parse(paragraphize(md), { async: false });
  return finish(wrapTables(html), options);
}

/** Inline Markdown (bold, italics) to HTML, without a wrapping <p>. */
export function mdInline(md: string, options: MarkdownOptions = {}): string {
  const html = marked.parseInline(md, { async: false });
  return finish(html, options);
}

/** mdBlock without chemistry formatting, whatever the config says. */
export function mdBlockRaw(md: string): string {
  return mdBlock(md, { chem: false });
}

/** mdInline without chemistry formatting, whatever the config says. */
export function mdInlineRaw(md: string): string {
  return mdInline(md, { chem: false });
}
