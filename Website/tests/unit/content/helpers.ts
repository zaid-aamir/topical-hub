import { readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTopic, listBatchDirs, parseMarkschemeFile, parseQuestionsFile, resolveContentDir } from '../../../src/content';
import type { ContentSource, McqQuestion, Question, StructuredQuestion, Topic } from '../../../src/content';

/** Absolute path of tests/fixtures/content/. */
export const FIXTURES = fileURLToPath(new URL('../../fixtures/content/', import.meta.url));

export function fixturePath(...parts: string[]): string {
  return join(FIXTURES, ...parts);
}

export function readFixture(...parts: string[]): string {
  return readFileSync(fixturePath(...parts), 'utf8');
}

/** Parse and merge one fixture batch without validating it. */
export function loadFixtureBatch(group: string, batch: string) {
  const questionsFile = parseQuestionsFile(readFixture(group, batch, 'questions.md'));
  const markschemeFile = parseMarkschemeFile(readFixture(group, batch, 'markscheme.md'));
  return { questionsFile, markschemeFile, topic: buildTopic(questionsFile, markschemeFile) };
}

export function questionByNumber(topic: Topic, number: number): Question {
  const q = topic.questions.find((x) => x.number === number);
  if (!q) throw new Error(`Q${number} not found in ${topic.batchId}`);
  return q;
}

export function mcq(topic: Topic, number: number): McqQuestion {
  const q = questionByNumber(topic, number);
  if (q.type !== 'mcq') throw new Error(`Q${number} is not an MCQ`);
  return q;
}

export function structured(topic: Topic, number: number): StructuredQuestion {
  const q = questionByNumber(topic, number);
  if (q.type !== 'structured') throw new Error(`Q${number} is not structured`);
  return q;
}

/** Minimal valid frontmatter for inline test strings. */
export const QUESTIONS_FRONTMATTER = `---
batch_id: T95_20260101_01
syllabus: "0620 (2026-2028)"
topic_id: "95"
topic_name: "Inline fixture"
created: 2026-01-01
generator_model: "fixture"
---
`;

export const MARKSCHEME_FRONTMATTER = `---
batch_id: T95_20260101_01
---
`;

/** A metadata block for inline test strings; `overrides` replaces individual lines. */
export function meta(number: number, type: 'mcq' | 'structured', overrides: Record<string, string> = {}): string {
  const fields: Record<string, string> = {
    id: `T95_20260101_01_Q${number}`,
    type,
    tier: 'core',
    subtopic_id: '"95.1"',
    subtopic_name: '"Inline"',
    syllabus_points: '["95.1.1"]',
    difficulty: '1',
    marks: type === 'mcq' ? '1' : '2',
    needs_diagram: 'false',
    ...overrides,
  };
  return Object.entries(fields)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');
}

/**
 * What a subject's approved files contain, counted straight from the text (not through the
 * parser), so tests can compare the loader against the files without pinning any total: the
 * pipeline may withhold questions at any time.
 */
export function sourceCounts(source: ContentSource) {
  const dir = resolveContentDir(source);
  const batches = listBatchDirs(dir, source.batchPrefix);
  let questions = 0;
  let mcq = 0;
  const topicIds = new Set<string>();
  const perBatch = new Map<string, { questions: number[]; markscheme: number[] }>();
  for (const batch of batches) {
    const q = readFileSync(join(batch, 'questions.md'), 'utf8').replace(/\r\n?/g, '\n');
    const ms = readFileSync(join(batch, 'markscheme.md'), 'utf8').replace(/\r\n?/g, '\n');
    const headings = (text: string) => [...text.matchAll(/^## Q(\d+)\s*$/gm)].map((m) => Number(m[1]));
    const numbers = headings(q);
    questions += numbers.length;
    mcq += (q.match(/^- type: mcq\s*$/gm) ?? []).length;
    const topicId = /^topic_id:\s*"?(\d+)"?\s*$/m.exec(q)?.[1];
    if (topicId) topicIds.add(topicId);
    perBatch.set(basename(batch), { questions: numbers, markscheme: headings(ms) });
  }
  return { batches: batches.length, topics: topicIds.size, questions, mcq, structured: questions - mcq, perBatch };
}
