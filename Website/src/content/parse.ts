/**
 * Pure parsers for `questions.md` and `markscheme.md`. Everything here works on strings and never
 * touches the file system.
 *
 * Two kinds of problem are told apart on purpose:
 * - Structure that the data model cannot hold (no `**Question**` line, a missing metadata key, a
 *   sub-part without `[n]`, a nested bullet with no parent, ...) throws a ContentError. The file
 *   parsers collect these so one error lists every broken block in the file.
 * - Content that is representable but wrong (three options, answer "E", part marks that do not add
 *   up, needs_diagram true, ...) is passed through as written. validateTopics() reports all of it
 *   in one go, so a build failure lists every violation rather than the first one.
 *
 * Text fields are Markdown SOURCE, trimmed of surrounding blank lines, joined with "\n" and never
 * ending in a newline. Characters such as `<`, `>`, `−`, `→` and `°` are preserved exactly.
 */
import { ContentError } from './types';
import type {
  Difficulty,
  MarkPoint,
  MarkPointKind,
  MarkSchemePart,
  McqOption,
  OptionLetter,
  StructuredPart,
  StructuredSubpart,
  Tier,
} from './types';

// ------------------------------------------------------------------------------------------------
// Shared helpers

/** Split into lines. Strips a UTF-8 BOM and CR characters (a CRLF checkout) but changes nothing else. */
function toLines(text: string): string[] {
  return text
    .replace(/^﻿/, '')
    .split('\n')
    .map((line) => (line.endsWith('\r') ? line.slice(0, -1) : line));
}

function isBlank(line: string | undefined): boolean {
  return line === undefined || line.trim() === '';
}

/** Join lines and trim surrounding blank lines/whitespace. */
function joinText(lines: string[]): string {
  return lines.join('\n').trim();
}

/**
 * A YAML-ish scalar as used in the frontmatter and metadata: a double- or single-quoted string
 * (quotes removed, `\"` unescaped) or a bare value with any trailing `# comment` removed.
 */
function parseScalar(raw: string): string {
  const s = raw.trim();
  if (s.startsWith('"')) {
    const m = /^"((?:[^"\\]|\\.)*)"/.exec(s);
    return m ? m[1].replace(/\\(.)/g, '$1') : s.slice(1);
  }
  if (s.startsWith("'")) {
    const m = /^'([^']*)'/.exec(s);
    if (m) return m[1];
  }
  return s.replace(/\s+#.*$/, '').trim();
}

/** An integer scalar; NaN when it is not one (validateTopics reports NaN as out of range). */
function parseInteger(raw: string): number {
  const s = parseScalar(raw);
  return /^-?\d+$/.test(s) ? Number(s) : Number.NaN;
}

function parseBoolean(raw: string, what: string): boolean {
  const s = parseScalar(raw).toLowerCase();
  if (s === 'true') return true;
  if (s === 'false') return false;
  throw new ContentError(`${what} must be true or false, got "${parseScalar(raw)}"`);
}

/** A JSON-style array of strings such as `["4.1.2", "4.1.3"]`. */
function parseStringArray(raw: string, what: string): string[] {
  const s = raw.trim();
  const close = s.lastIndexOf(']');
  if (!s.startsWith('[') || close === -1) {
    throw new ContentError(`${what} must be a JSON-style array like ["1.1.1"], got "${s}"`);
  }
  const inner = s.slice(0, close + 1);
  try {
    const parsed: unknown = JSON.parse(inner);
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) return parsed as string[];
  } catch {
    // fall through to the tolerant split below (single quotes, trailing commas)
  }
  return inner
    .slice(1, -1)
    .split(',')
    .map((x) => parseScalar(x))
    .filter((x) => x !== '');
}

const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];

function isRoman(label: string): boolean {
  return ROMAN.includes(label);
}

function nextLetter(letter: string): string {
  return String.fromCharCode(letter.charCodeAt(0) + 1);
}

/** Re-throw a ContentError with a location prefix; anything else is a bug and propagates untouched. */
function withContext(err: unknown, context: string): never {
  if (err instanceof ContentError) {
    const text = err.details.length ? err.details.join('; ') : err.message;
    throw new ContentError(`${context}: ${text}`);
  }
  throw err;
}

// ------------------------------------------------------------------------------------------------
// Frontmatter

/** Frontmatter values as written (quotes removed), keyed by name. */
export type Frontmatter = Record<string, string>;

export interface ParsedFrontmatter {
  data: Frontmatter;
  /** The text after the closing `---` line. */
  body: string;
  /** 1-based line number, in the original text, of the first body line. */
  bodyLine: number;
}

const FENCE = '---';

/** Parse the leading `---` ... `---` block of simple `key: value` lines. */
export function parseFrontmatter(text: string): ParsedFrontmatter {
  const lines = toLines(text);
  if (lines[0] !== FENCE) throw new ContentError('frontmatter: the file must start with a "---" line');
  const end = lines.indexOf(FENCE, 1);
  if (end === -1) throw new ContentError('frontmatter: the closing "---" line is missing');
  const data: Frontmatter = {};
  for (let i = 1; i < end; i++) {
    const line = lines[i];
    if (isBlank(line)) continue;
    const m = /^([A-Za-z_][\w-]*):(?:\s+(.*))?$/.exec(line);
    if (!m) throw new ContentError(`frontmatter: line ${i + 1} is not "key: value": ${line}`);
    data[m[1]] = parseScalar(m[2] ?? '');
  }
  return { data, body: lines.slice(end + 1).join('\n'), bodyLine: end + 2 };
}

// ------------------------------------------------------------------------------------------------
// `## Q<n>` blocks

export interface QuestionBlock {
  /** The n in `## Q<n>`. */
  number: number;
  /** Everything between this heading and the next one, trailing blank lines removed. */
  body: string;
  /** 1-based line number of the heading (relative to the text given plus `firstLine`). */
  line: number;
}

const HEADING = /^## Q(\d+)\s*$/;

/**
 * Split a file body into its `## Q<n>` blocks, keyed by the number in the heading (never by
 * position: numbering may have gaps). Duplicate numbers and text before the first heading fail.
 */
export function splitQuestionBlocks(text: string, firstLine = 1): QuestionBlock[] {
  const lines = toLines(text);
  const blocks: QuestionBlock[] = [];
  const problems: string[] = [];
  const seen = new Map<number, number>();
  let current: { number: number; line: number; lines: string[] } | null = null;

  const finish = (block: { number: number; line: number; lines: string[] }): QuestionBlock => ({
    number: block.number,
    line: block.line,
    body: block.lines.join('\n').replace(/\s+$/, ''),
  });

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = HEADING.exec(line);
    if (m) {
      if (current) blocks.push(finish(current));
      const number = Number(m[1]);
      const lineNo = firstLine + i;
      const earlier = seen.get(number);
      if (earlier !== undefined) problems.push(`duplicate heading "## Q${number}" at lines ${earlier} and ${lineNo}`);
      else seen.set(number, lineNo);
      current = { number, line: lineNo, lines: [] };
    } else if (current) {
      current.lines.push(line);
    } else if (!isBlank(line)) {
      problems.push(`line ${firstLine + i}: text before the first "## Q<n>" heading: ${line}`);
    }
  }
  if (current) blocks.push(finish(current));
  if (problems.length) throw new ContentError(`${problems.length} heading problem(s)`, problems);
  return blocks;
}

// ------------------------------------------------------------------------------------------------
// questions.md

export interface ParsedQuestionBase {
  number: number;
  id: string;
  type: 'mcq' | 'structured';
  /** As written. validateTopics() reports values outside core | supplement. */
  tier: Tier;
  subtopicId: string;
  subtopicName: string;
  syllabusPoints: string[];
  /** As written. validateTopics() reports values outside 1..3 (NaN when not an integer). */
  difficulty: Difficulty;
  /** As written (NaN when not an integer). */
  marks: number;
  needsDiagram: boolean;
  /** Markdown before the options (MCQ) or before part (a) (structured). */
  stem: string;
}

export interface McqOptionTable {
  /** Header-row cells after the first (letter) cell. */
  headers: string[];
  /** The first header cell when it is not blank, e.g. "Option". */
  letterHeader?: string;
}

export interface ParsedMcqQuestion extends ParsedQuestionBase {
  type: 'mcq';
  /** The options as found; validateTopics() requires exactly A, B, C, D in order. */
  options: McqOption[];
  optionTable?: McqOptionTable;
}

export interface ParsedStructuredQuestion extends ParsedQuestionBase {
  type: 'structured';
  parts: StructuredPart[];
}

export type ParsedQuestion = ParsedMcqQuestion | ParsedStructuredQuestion;

export interface ParsedQuestionsFile {
  frontmatter: Frontmatter;
  /** In file order. */
  questions: ParsedQuestion[];
}

const REQUIRED_META = [
  'id',
  'type',
  'tier',
  'subtopic_id',
  'subtopic_name',
  'syllabus_points',
  'difficulty',
  'marks',
  'needs_diagram',
] as const;

const META_LINE = /^- ([a-z][a-z0-9_]*):(?:\s+(.*))?$/;
const QUESTION_MARKER = '**Question**';

/** Parse one `## Q<n>` block of questions.md. */
export function parseQuestionBlock(block: QuestionBlock): ParsedQuestion {
  const where = `Q${block.number} (line ${block.line})`;
  const lines = toLines(block.body);
  let i = 0;
  while (i < lines.length && isBlank(lines[i])) i++;

  // The metadata block: the contiguous run of "- key: value" lines directly after the heading.
  // Bullet lines later in the question text are never read here because the run stops at the
  // first line that is not "- key: value" (the blank line before **Question**).
  const meta = new Map<string, string>();
  while (i < lines.length) {
    const m = META_LINE.exec(lines[i]);
    if (!m) break;
    meta.set(m[1], m[2] ?? '');
    i++;
  }
  if (meta.size === 0) throw new ContentError(`${where}: no "- key: value" metadata lines after the heading`);
  const missing = REQUIRED_META.filter((key) => !meta.has(key));
  if (missing.length) throw new ContentError(`${where}: metadata is missing ${missing.join(', ')}`);

  while (i < lines.length && isBlank(lines[i])) i++;
  if (i >= lines.length || lines[i].trim() !== QUESTION_MARKER) {
    const found = i < lines.length ? lines[i] : '<end of block>';
    throw new ContentError(`${where}: expected the "${QUESTION_MARKER}" line after the metadata, found: ${found}`);
  }
  const body = joinText(lines.slice(i + 1));

  const get = (key: (typeof REQUIRED_META)[number]): string => meta.get(key) ?? '';
  const type = parseScalar(get('type'));
  if (type !== 'mcq' && type !== 'structured') {
    throw new ContentError(`${where}: type must be "mcq" or "structured", got "${type}"`);
  }

  let base: Omit<ParsedQuestionBase, 'type' | 'stem'>;
  try {
    base = {
      number: block.number,
      id: parseScalar(get('id')),
      // tier and difficulty are passed through as written; validateTopics() reports bad values.
      tier: parseScalar(get('tier')) as Tier,
      subtopicId: parseScalar(get('subtopic_id')),
      subtopicName: parseScalar(get('subtopic_name')),
      syllabusPoints: parseStringArray(get('syllabus_points'), 'syllabus_points'),
      difficulty: parseInteger(get('difficulty')) as Difficulty,
      marks: parseInteger(get('marks')),
      needsDiagram: parseBoolean(get('needs_diagram'), 'needs_diagram'),
    };
  } catch (err) {
    return withContext(err, where);
  }

  try {
    if (type === 'mcq') {
      const { stem, options, optionTable } = parseMcqBody(body);
      const question: ParsedMcqQuestion = { ...base, type: 'mcq', stem, options };
      if (optionTable) question.optionTable = optionTable;
      return question;
    }
    const { stem, parts } = parseStructuredBody(body);
    return { ...base, type: 'structured', stem, parts };
  } catch (err) {
    return withContext(err, where);
  }
}

/** Parse a whole questions.md. Throws one ContentError listing every malformed block. */
export function parseQuestionsFile(text: string): ParsedQuestionsFile {
  const fm = parseFrontmatter(text);
  const blocks = splitQuestionBlocks(fm.body, fm.bodyLine);
  const questions: ParsedQuestion[] = [];
  const problems: string[] = [];
  for (const block of blocks) {
    try {
      questions.push(parseQuestionBlock(block));
    } catch (err) {
      if (!(err instanceof ContentError)) throw err;
      problems.push(...(err.details.length ? err.details : [err.message]));
    }
  }
  if (problems.length) throw new ContentError(`${problems.length} malformed question block(s)`, problems);
  return { frontmatter: fm.data, questions };
}

// ------------------------------------------------------------------------------------------------
// MCQ options

export interface McqBody {
  stem: string;
  options: McqOption[];
  optionTable?: McqOptionTable;
}

/** "A text": a capital letter, whitespace, non-empty text. */
const OPTION_LINE = /^([A-Z])\s+(\S.*)$/;

/**
 * Split an MCQ body into the stem and its options. Two shapes:
 * 1. Plain lines: the trailing run of "X text" lines. Stems often START with a line like
 *    "A student ..." so the run is taken from the END, and if it is longer than four lines the
 *    last window that reads exactly A, B, C, D wins (the rest stays in the stem).
 * 2. A GFM table at the end whose first column holds the letters; header cells after the first
 *    become `optionTable.headers`, and a non-blank first header cell becomes `letterHeader`.
 * A data table in the stem followed by plain options is shape 1 (plain options are tried first).
 * When neither shape matches, `options` is empty and validateTopics() reports it.
 */
export function parseMcqBody(body: string): McqBody {
  const lines = toLines(body.trim());

  let start = lines.length;
  while (start > 0 && OPTION_LINE.test(lines[start - 1])) start--;
  if (start < lines.length) {
    if (lines.length - start > 4) {
      for (let k = lines.length - 4; k >= start; k--) {
        const letters = lines.slice(k, k + 4).map((line) => line[0]).join('');
        if (letters === 'ABCD') {
          start = k;
          break;
        }
      }
    }
    const options: McqOption[] = lines.slice(start).map((line) => {
      const m = OPTION_LINE.exec(line) as RegExpExecArray;
      // The letter is whatever was written; validateTopics() requires A, B, C, D.
      return { letter: m[1] as OptionLetter, text: m[2].trim() };
    });
    return { stem: joinText(lines.slice(0, start)), options };
  }

  let tableStart = lines.length;
  while (tableStart > 0 && lines[tableStart - 1].trim().startsWith('|')) tableStart--;
  const tableLines = lines.slice(tableStart);
  if (tableLines.length >= 3 && isSeparatorRow(splitTableRow(tableLines[1]))) {
    const header = splitTableRow(tableLines[0]);
    const options: McqOption[] = tableLines.slice(2).map((line) => {
      const cells = splitTableRow(line);
      const rest = cells.slice(1);
      return { letter: (cells[0] ?? '') as OptionLetter, text: rest.join(', '), cells: rest };
    });
    const optionTable: McqOptionTable = { headers: header.slice(1) };
    if (header[0]) optionTable.letterHeader = header[0];
    return { stem: joinText(lines.slice(0, tableStart)), options, optionTable };
  }

  return { stem: joinText(lines), options: [] };
}

/** Cells of one GFM table row, trimmed, with `\|` unescaped. Leading/trailing pipes are optional. */
export function splitTableRow(line: string): string[] {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|') && !s.endsWith('\\|')) s = s.slice(0, -1);
  const cells: string[] = [];
  let cell = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '\\' && s[i + 1] === '|') {
      cell += '|';
      i++;
    } else if (ch === '|') {
      cells.push(cell.trim());
      cell = '';
    } else {
      cell += ch;
    }
  }
  cells.push(cell.trim());
  return cells;
}

function isSeparatorRow(cells: string[]): boolean {
  return cells.length > 0 && cells.every((cell) => /^:?-+:?$/.test(cell));
}

// ------------------------------------------------------------------------------------------------
// Structured parts

export interface StructuredBody {
  stem: string;
  parts: StructuredPart[];
}

/** "(a) text", or "(a)" alone. */
const PART_LINE = /^\(([a-z])\)(?:\s+(.*))?$/;
/** "(i) text", or "(i)" alone. */
const SUBPART_LINE = /^\(([ivx]+)\)(?:\s+(.*))?$/;

interface SubpartAccumulator {
  label: string;
  lines: string[];
}

interface PartAccumulator {
  label: string;
  own: string[];
  subparts: SubpartAccumulator[];
}

/**
 * Split a structured body into the stem and parts (a), (b), ... with sub-parts (i), (ii), ...
 *
 * A line starts a new top-level part only when its letter is the next expected one (a, b, c, ...),
 * so "(i)" is a sub-part unless the question really has nine parts. Sub-parts must run i, ii, iii
 * in order. A part's own text is everything up to its first sub-part (it may span paragraphs and
 * hold a table or an equation); its marks are the `[n]` at the very end of that text or at the end
 * of its first line (see splitTrailingMarks), or null when the marks live on the sub-parts.
 * Sub-parts must carry `[n]` in one of those two places too.
 */
export function parseStructuredBody(body: string): StructuredBody {
  const lines = toLines(body.trim());
  const stem: string[] = [];
  const parts: PartAccumulator[] = [];
  let expected = 'a';

  for (const line of lines) {
    const pm = PART_LINE.exec(line);
    if (pm && pm[1] === expected) {
      const part: PartAccumulator = { label: pm[1], own: [], subparts: [] };
      parts.push(part);
      expected = nextLetter(expected);
      const rest = pm[2] ?? '';
      const inline = SUBPART_LINE.exec(rest);
      if (inline && isRoman(inline[1])) startSubpart(part, inline[1], inline[2] ?? '');
      else if (rest !== '') part.own.push(rest);
      continue;
    }
    const current = parts[parts.length - 1];
    if (!current) {
      stem.push(line);
      continue;
    }
    const sm = SUBPART_LINE.exec(line);
    if (sm && isRoman(sm[1])) {
      startSubpart(current, sm[1], sm[2] ?? '');
      continue;
    }
    const sub = current.subparts[current.subparts.length - 1];
    if (sub) sub.lines.push(line);
    else current.own.push(line);
  }

  return { stem: joinText(stem), parts: parts.map(finishPart) };
}

function startSubpart(part: PartAccumulator, label: string, firstLine: string): void {
  const expected = ROMAN[part.subparts.length] ?? '?';
  if (label !== expected) {
    throw new ContentError(`part (${part.label}): expected sub-part (${expected}) but found (${label})`);
  }
  part.subparts.push({ label, lines: firstLine === '' ? [] : [firstLine] });
}

const TRAILING_MARKS = /\s*\[(\d+)\]$/;

/**
 * Take the "[n]" marks off a trimmed part or sub-part text. The marks are normally at the very
 * end ("... Explain why. [2]", or "[Ar: Fe = 56; O = 16] [3]" after a calculation), but when the
 * part asks the student to complete something, they end the instruction line and the material
 * follows: "(b) Complete the table ... [2]" + a table (T02 Q6), "(a) Complete the word equation
 * ... [2]" + the equation (T10 Q17). Returns null marks when neither place has them.
 */
function splitTrailingMarks(text: string): { text: string; marks: number | null } {
  const tail = TRAILING_MARKS.exec(text);
  if (tail) return { text: text.slice(0, tail.index).trimEnd(), marks: Number(tail[1]) };
  const newline = text.indexOf('\n');
  if (newline !== -1) {
    const first = text.slice(0, newline);
    const head = TRAILING_MARKS.exec(first);
    if (head) return { text: first.slice(0, head.index).trimEnd() + text.slice(newline), marks: Number(head[1]) };
  }
  return { text, marks: null };
}

function finishPart(acc: PartAccumulator): StructuredPart {
  const own = splitTrailingMarks(joinText(acc.own));
  const subparts: StructuredSubpart[] = acc.subparts.map((sub) => {
    const { text, marks } = splitTrailingMarks(joinText(sub.lines));
    if (marks === null) {
      throw new ContentError(`part (${acc.label})(${sub.label}) does not end in "[n]" marks`);
    }
    return { label: sub.label, text, marks };
  });
  const totalMarks = (own.marks ?? 0) + subparts.reduce((sum, sub) => sum + sub.marks, 0);
  return { label: acc.label, text: own.text, marks: own.marks, subparts, totalMarks };
}

// ------------------------------------------------------------------------------------------------
// markscheme.md

export interface ParsedMcqMarkscheme {
  kind: 'mcq';
  number: number;
  /** As written after "- answer:"; validateTopics() requires A-D. */
  answer: string;
  /** Markdown. Empty string when the **Rationale** section is missing or empty. */
  rationale: string;
  /** Markdown. Absent when there is no **Worked solution** section (or it is empty). */
  workedSolution?: string;
}

export interface ParsedStructuredMarkscheme {
  kind: 'structured';
  number: number;
  parts: MarkSchemePart[];
  /** Markdown. Empty string when the **Worked solution** section is missing or empty. */
  workedSolution: string;
}

export type ParsedMarkscheme = ParsedMcqMarkscheme | ParsedStructuredMarkscheme;

export interface ParsedMarkschemeFile {
  frontmatter: Frontmatter;
  /** Keyed by the n in `## Q<n>`. */
  entries: Map<number, ParsedMarkscheme>;
}

const ANSWER_LINE = /^- answer:(?:\s+(.*))?$/;
const RATIONALE_MARKER = '**Rationale**';
const WORKED_MARKER = '**Worked solution**';
/** `**(a)** [2]`, `**(b)(i)** [1]`, `**(a)**`, `**(i)** [1]`, `**(c)** [2] any two from:` */
const PART_HEAD = /^\*\*\(([a-z]+)\)(?:\(([ivx]+)\))?\*\*\s*(?:\[(\d+)\])?\s*(.*)$/;
const BULLET = /^(\s*)- (.*)$/;
const KEYWORD = /^(ALLOW|REJECT|IGNORE|ECF)\b/;

/** ALLOW / REJECT / IGNORE / ECF bullets are classified by their leading keyword (colon optional). */
export function classifyMarkPoint(text: string): MarkPointKind {
  const m = KEYWORD.exec(text);
  return m ? (m[1].toLowerCase() as MarkPointKind) : 'point';
}

/** Parse one `## Q<n>` block of markscheme.md. An entry that starts with "- answer:" is an MCQ. */
export function parseMarkschemeBlock(block: QuestionBlock): ParsedMarkscheme {
  const where = `Q${block.number} (line ${block.line})`;
  try {
    const lines = toLines(block.body);
    let i = 0;
    while (i < lines.length && isBlank(lines[i])) i++;
    const answer = i < lines.length ? ANSWER_LINE.exec(lines[i]) : null;
    if (answer) return parseMcqEntry(block.number, (answer[1] ?? '').trim(), lines.slice(i + 1));
    return parseStructuredEntry(block.number, lines.slice(i));
  } catch (err) {
    return withContext(err, where);
  }
}

function parseMcqEntry(number: number, answer: string, rest: string[]): ParsedMcqMarkscheme {
  const rationaleAt = rest.findIndex((line) => line.trim() === RATIONALE_MARKER);
  const workedAt = rest.findIndex((line) => line.trim() === WORKED_MARKER);
  const firstMarker = Math.min(...[rationaleAt, workedAt].filter((x) => x >= 0), rest.length);
  for (const line of rest.slice(0, firstMarker)) {
    if (!isBlank(line)) throw new ContentError(`unexpected line between "- answer:" and "${RATIONALE_MARKER}": ${line}`);
  }
  const section = (from: number, other: number): string =>
    from < 0 ? '' : joinText(rest.slice(from + 1, other > from ? other : undefined));
  const entry: ParsedMcqMarkscheme = {
    kind: 'mcq',
    number,
    answer,
    rationale: section(rationaleAt, workedAt),
  };
  const worked = section(workedAt, rationaleAt);
  if (worked) entry.workedSolution = worked;
  return entry;
}

function parseStructuredEntry(number: number, lines: string[]): ParsedStructuredMarkscheme {
  const parts: MarkSchemePart[] = [];
  let current: MarkSchemePart | null = null;
  let lastTopLevel: string | null = null;
  let worked: string[] | null = null;

  for (const line of lines) {
    if (worked) {
      worked.push(line);
      continue;
    }
    if (line.trim() === WORKED_MARKER) {
      worked = [];
      continue;
    }
    const head = PART_HEAD.exec(line);
    if (head) {
      const [, first, second, marks, note] = head;
      let key: string;
      if (second) {
        key = `${first}.${second}`;
        lastTopLevel = first;
      } else if (isRoman(first) && lastTopLevel !== null && first !== nextLetter(lastTopLevel)) {
        // A bare "**(a)**" followed by "**(i)** [1]": the roman head belongs to the preceding part.
        key = `${lastTopLevel}.${first}`;
      } else {
        key = first;
        lastTopLevel = first;
      }
      current = { key, marks: marks ? Number(marks) : null, note: note.trim(), points: [] };
      parts.push(current);
      continue;
    }
    if (isBlank(line)) continue;
    if (!current) throw new ContentError(`unexpected line before the first part head: ${line}`);

    const bullet = BULLET.exec(line);
    if (bullet) {
      const text = bullet[2].trim();
      const point: MarkPoint = { kind: classifyMarkPoint(text), text, children: [] };
      if (bullet[1].length === 0) {
        current.points.push(point);
      } else {
        // One level of nesting is all the content uses; deeper indents attach to the same parent.
        const parent = current.points[current.points.length - 1];
        if (!parent) throw new ContentError(`nested bullet without a parent bullet: ${line}`);
        parent.children.push(point);
      }
      continue;
    }
    // Plain text inside a part section, e.g. "Any two from:" — a label for the bullets below it.
    current.points.push({ kind: 'point', text: line.trim(), children: [], isLabel: true });
  }

  return { kind: 'structured', number, parts, workedSolution: worked ? joinText(worked) : '' };
}

/** Parse a whole markscheme.md. Throws one ContentError listing every malformed block. */
export function parseMarkschemeFile(text: string): ParsedMarkschemeFile {
  const fm = parseFrontmatter(text);
  const blocks = splitQuestionBlocks(fm.body, fm.bodyLine);
  const entries = new Map<number, ParsedMarkscheme>();
  const problems: string[] = [];
  for (const block of blocks) {
    try {
      entries.set(block.number, parseMarkschemeBlock(block));
    } catch (err) {
      if (!(err instanceof ContentError)) throw err;
      problems.push(...(err.details.length ? err.details : [err.message]));
    }
  }
  if (problems.length) throw new ContentError(`${problems.length} malformed mark scheme block(s)`, problems);
  return { frontmatter: fm.data, entries };
}
