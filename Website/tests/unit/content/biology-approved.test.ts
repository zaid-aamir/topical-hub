/** Import-readiness contract for owner-approved Biology. This does not publish Biology routes.
 * Reuse the actual website parser; preserve local question numbers across multi-part topics.
 */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseQuestionsFile, parseMarkschemeFile, buildTopic } from '../../../src/content';

const root = fileURLToPath(new URL('../../../../question-pipeline/subjects/0610-biology/', import.meta.url));
interface Plan { key: string; topic_id: string; topic_name: string; part: number; questions: number; mcq: number; structured: number }
const plan: Plan[] = JSON.parse(fs.readFileSync(path.join(root, 'config/batch_plan.json'), 'utf8')).batches;
const approval = JSON.parse(fs.readFileSync(path.join(root, 'owner-approval.json'), 'utf8'));
const folders = fs.readdirSync(path.join(root, 'batches/04_approved'));
const loaded = plan.map((entry) => {
  const matches = folders.filter((folder) => folder.startsWith(`0610_${entry.key}_`));
  if (matches.length !== 1) throw new Error(`${entry.key}: expected exactly one approved batch`);
  const dir = path.join(root, 'batches/04_approved', matches[0]);
  const questions = parseQuestionsFile(fs.readFileSync(path.join(dir, 'questions.md'), 'utf8'));
  const scheme = parseMarkschemeFile(fs.readFileSync(path.join(dir, 'markscheme.md'), 'utf8'));
  return { entry, questions, topic: buildTopic(questions, scheme) };
});

describe('owner-approved Biology is ready for website import', () => {
  it('contains all 24 approved batches, 21 topics and 590 uniquely identified questions', () => {
    expect(approval.approved_by).toBe('owner');
    expect(approval.batches).toHaveLength(24);
    expect(loaded).toHaveLength(24);
    expect(new Set(loaded.map(({ topic }) => topic.topicId)).size).toBe(21);
    const all = loaded.flatMap(({ topic }) => topic.questions);
    expect(all).toHaveLength(590);
    expect(new Set(all.map((q) => q.id)).size).toBe(590);
    expect(all.filter((q) => q.type === 'mcq')).toHaveLength(295);
    expect(all.filter((q) => q.type === 'structured')).toHaveLength(295);
  });

  for (const { entry, questions, topic } of loaded) {
    it(`${entry.key}: parses with matched answers, usable metadata and complete content`, () => {
      expect(topic.unmatched ?? []).toEqual([]);
      expect(topic.questions).toHaveLength(entry.questions);
      expect(topic.topicId).toBe(entry.topic_id);
      expect(topic.topicName).toBe(entry.topic_name);
      expect(Number(questions.frontmatter.part)).toBe(entry.part);
      expect(questions.frontmatter.subject_id).toBe('0610-biology');
      expect(topic.questions.filter((q) => q.type === 'mcq')).toHaveLength(entry.mcq);
      expect(topic.questions.filter((q) => q.type === 'structured')).toHaveLength(entry.structured);
      for (const q of topic.questions) {
        expect(q.id).toBe(`${topic.batchId}_Q${q.number}`);
        expect(['core', 'supplement']).toContain(q.tier);
        expect([1, 2, 3]).toContain(q.difficulty);
        expect(q.needsDiagram).toBe(false);
        expect(q.subtopicId).toMatch(new RegExp(`^${entry.topic_id}\\.`));
        expect(q.subtopicName.trim()).not.toBe('');
        expect(q.syllabusPoints.length).toBeGreaterThan(0);
        expect(q.marks).toBeGreaterThan(0);
        if (q.type === 'mcq') {
          expect(q.stem.trim()).not.toBe('');
          expect(q.options.map((o) => o.letter).join('')).toBe('ABCD');
          expect(q.options.every((o) => o.text.trim())).toBe(true);
          expect(q.answer).toMatch(/^[A-D]$/);
          expect(q.rationale.trim()).not.toBe('');
        } else {
          expect(q.parts.length).toBeGreaterThan(0);
          expect(q.parts.reduce((sum, part) => sum + part.totalMarks, 0)).toBe(q.marks);
          expect(q.markScheme.length).toBeGreaterThan(0);
          expect(q.workedSolution.trim()).not.toBe('');
        }
      }
    });
  }
});
