import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTopic, parseMarkschemeFile, parseQuestionsFile } from '../../../src/content';
import type { McqQuestion, Question, StructuredQuestion, Topic } from '../../../src/content';

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
