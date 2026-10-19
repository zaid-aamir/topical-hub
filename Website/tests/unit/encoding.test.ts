/**
 * Guards against a save that replaced special characters with a literal "?" (it once turned
 * "2026–2028" into "2026?2028" and "1 · Part 1" into "1 ? Part 1"). Scans every text file under
 * src/ plus the Website docs for the shapes that corruption leaves; genuine question marks and
 * the TypeScript ?, ??, ?. and ?: operators do not match.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const TEXT_EXTENSIONS = new Set(['.ts', '.mts', '.js', '.mjs', '.astro', '.css', '.json', '.md']);

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path);
    return TEXT_EXTENSIONS.has(extname(entry.name)) ? [path] : [];
  });
}

const DOCS = readdirSync(ROOT)
  .filter((name) => name.endsWith('.md'))
  .map((name) => join(ROOT, name));
const FILES = [...walk(join(ROOT, 'src')), ...DOCS];

const PATTERNS: { name: string; re: RegExp }[] = [
  { name: 'digit?digit (a lost dash, as in 2026?2028)', re: /\d\?\d/ },
  { name: "letter?s word ending (a lost apostrophe, as in Biology?s)", re: /[A-Za-z]\?s\b/ },
  { name: 'U+FFFD replacement character', re: /�/ },
  { name: 'UTF-8 read as Windows-1252 (a-circumflex, euro sign)', re: /â€/ },
];

/** " ? " between words in an .astro file's markup text (a lost separator, as in "1 ? Part 1"). */
const MARKUP_SPACED = /(?<!=)>[^<>{}\n]*\s\?\s\w[^<>{}\n]*[<{]/;

function markupOf(source: string): string {
  return source
    .replace(/^---[\s\S]*?\n---/, '')
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/g, '');
}

describe('no "?" left where a special character was', () => {
  it('finds the files to scan', () => {
    expect(FILES.length).toBeGreaterThan(50);
  });

  it('src/ and the docs contain no corruption patterns', () => {
    const problems: string[] = [];
    for (const file of FILES) {
      const text = readFileSync(file, 'utf8');
      const lines = text.split('\n');
      lines.forEach((line, i) => {
        for (const { name, re } of PATTERNS) {
          if (re.test(line)) problems.push(`${relative(ROOT, file)}:${i + 1} ${name}: ${line.trim()}`);
        }
      });
      if (file.endsWith('.astro')) {
        const match = MARKUP_SPACED.exec(markupOf(text));
        if (match) problems.push(`${relative(ROOT, file)} " ? " in markup text: ${match[0].trim()}`);
      }
    }
    expect(problems).toEqual([]);
  });

  it('the patterns catch the known corruptions', () => {
    expect(PATTERNS[0]!.re.test("syllabusYears: '2026?2028'")).toBe(true);
    expect(PATTERNS[1]!.re.test("Biology?s 21 topics")).toBe(true);
    expect(MARKUP_SPACED.test('<span class="question-part"> ? Part {question.part}</span>')).toBe(true);
    expect(MARKUP_SPACED.test('{items.map((item) => item.ok ? <a /> : <b />)}')).toBe(false);
    expect(MARKUP_SPACED.test('</div>\n  ) : interactive ? (\n    <div>')).toBe(false);
    expect(MARKUP_SPACED.test('<p>Which statement is correct?</p>')).toBe(false);
  });
});
