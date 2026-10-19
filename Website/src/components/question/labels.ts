/**
 * Small pure helpers shared by the question components and the topic/print pages.
 * No DOM, no I/O: everything here is also safe to unit test.
 */
import type { Tier, TopicCounts } from '../../content';

/** "(a)" from the key "a", "(b)(i)" from "b.i". */
export function partLabel(key: string): string {
  return key
    .split('.')
    .map((segment) => `(${segment})`)
    .join('');
}

/** Badge text for a tier. */
export function tierLabel(tier: Tier): string {
  return tier === 'core' ? 'Core' : 'Supplement';
}

/** "30 questions: 15 multiple choice, 15 structured" (no full stop, so pages can end it as they like). */
export function countsSentence(counts: TopicCounts): string {
  return `${counts.total} questions: ${counts.mcq} multiple choice, ${counts.structured} structured`;
}

const KEYWORD_RE = /^(ALLOW|REJECT|IGNORE|ECF)\b:?[ \t]*/;

/**
 * Split a leading mark-scheme keyword (ALLOW / REJECT / IGNORE / ECF, optional colon) off a
 * marking point so it can be set in its own <span>. "ALLOW: H2 / hydrogen gas" gives
 * { keyword: "ALLOW", rest: "H2 / hydrogen gas" }; text without a keyword comes back whole.
 */
export function splitKeyword(text: string): { keyword: string | null; rest: string } {
  const match = KEYWORD_RE.exec(text);
  if (!match || match[1] === undefined) return { keyword: null, rest: text };
  return { keyword: match[1], rest: text.slice(match[0].length) };
}

/** Ruled answer lines for a part or sub-part worth `marks`: two per mark, at least two. */
export function answerLineCount(marks: number): number {
  return Math.max(2, 2 * marks);
}

/** "1 mark", "4 marks". */
export function marksLabel(marks: number): string {
  return `${marks} ${marks === 1 ? 'mark' : 'marks'}`;
}
