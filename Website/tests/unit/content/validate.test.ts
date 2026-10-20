import { describe, expect, it } from 'vitest';
import { ContentError, validateTopics } from '../../../src/content';
import { loadFixtureBatch } from './helpers';

function problemsOf(fn: () => void): string[] {
  try {
    fn();
  } catch (err) {
    if (err instanceof ContentError) return err.details;
    throw err;
  }
  return [];
}

describe('validateTopics', () => {
  it('accepts the good fixture batch', () => {
    const { topic } = loadFixtureBatch('good', 'T90_20260101_01');
    expect(topic.unmatched).toBeUndefined();
    expect(topic.counts).toEqual({ total: 8, mcq: 4, structured: 4, core: 6, supplement: 2 });
    expect(topic.subtopics).toEqual([
      { id: '90.1', name: 'Shapes of questions' },
      { id: '90.2', name: 'Traps' },
      { id: '90.3', name: 'Sub-parts' },
    ]);
    expect(topic.slug).toBe('fixture-topic-with-punctuation-symbols');
    expect(topic.topicNumber).toBe(90);
    expect(() => validateTopics([topic])).not.toThrow();
  });

  it('never requires a fixed number of topics or questions (the pipeline may withhold questions)', () => {
    const { topic } = loadFixtureBatch('good', 'T90_20260101_01');
    const withheld = { ...topic, questions: topic.questions.slice(1) };
    expect(() => validateTopics([withheld])).not.toThrow();
    expect(problemsOf(() => validateTopics([]))).toEqual(['no topics found']);
  });

  it('checks batch ids against the subject prefix', () => {
    const { topic } = loadFixtureBatch('good', 'T90_20260101_01');
    expect(problemsOf(() => validateTopics([topic], { batchPrefix: '0625_' }))[0]).toMatch(/batch_id must look like 0625_T04/);
  });

  it('lists every violation of the invalid fixture batch in one error', () => {
    const { topic } = loadFixtureBatch('invalid', 'T91_20260101_01');
    expect(topic.unmatched).toEqual([
      { number: 8, problem: 'question-without-entry' },
      { number: 9, problem: 'entry-without-question' },
      { number: 10, problem: 'type-mismatch' },
    ]);
    expect(topic.questions.map((q) => q.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 11, 13, 14]);

    const warnings: string[] = [];
    const problems = problemsOf(() => validateTopics([topic], { warn: (w) => warnings.push(w) }));
    const expectOne = (pattern: RegExp) => {
      const hits = problems.filter((p) => pattern.test(p));
      expect(hits, `expected one problem matching ${pattern}, got ${JSON.stringify(problems)}`).toHaveLength(1);
    };

    expectOne(/^T91_20260101_01_Q1: MCQ options must be exactly A, B, C, D in order; found 3 option\(s\) \[A, B, C\]/);
    expectOne(/^T91_20260101_01_Q2: answer must be one of A-D, got "E"/);
    expectOne(/^T91_20260101_01_Q3: part marks sum to 4 but marks is 5/);
    expectOne(/^T91_20260101_01_Q4: needs_diagram is true/);
    expectOne(/^T91_20260101_01_Q5: structured question has no worked solution/);
    expectOne(/^T91_20260101_01_Q6: mark scheme has no part for \(b\)/);
    expectOne(/^T91_20260101_01_Q6: mark scheme has \(c\) but the question does not/);
    expectOne(/^T91_20260101_01_Q7: MCQ has no rationale/);
    expectOne(/^T91_20260101_01_Q8: question has no entry in markscheme.md/);
    expectOne(/^T91_20260101_01_Q9: markscheme.md entry has no question in questions.md/);
    expectOne(/^T91_20260101_01_Q10: question type and mark scheme shape disagree/);
    expectOne(/^T91_20260101_01_Q12: id should be "T91_20260101_01_Q11"/);
    expectOne(/^T91_20260101_01_Q12: tier must be core or supplement, got "extended"/);
    expectOne(/^T91_20260101_01_Q12: difficulty must be 1, 2 or 3, got 4/);
    expectOne(/^T91_20260101_01_Q13: part \(a\) is \[2\] in the question but \[3\] in the mark scheme/);
    expectOne(/^T91_20260101_01_Q1: duplicate id \(also in T91_20260101_01\)/);
    expectOne(/^T91_20260101_01_Q1: id should be "T91_20260101_01_Q14"/);
    expect(problems).toHaveLength(17);
    expect(warnings).toEqual([]);
  });

  it('warns (does not fail) about a mark scheme part with no marking points', () => {
    const { topic } = loadFixtureBatch('good', 'T90_20260101_01');
    const q = topic.questions.find((x) => x.number === 6);
    if (q?.type !== 'structured') throw new Error('Q6 should be structured');
    q.markScheme[2].points = [];
    const warnings: string[] = [];
    validateTopics([topic], { warn: (w) => warnings.push(w) });
    expect(warnings).toEqual(['T90_20260101_01_Q6: mark scheme part (b) has no marking points']);
  });

  it('rejects topic-level problems: bad topic number, duplicate slugs, duplicate ids across topics', () => {
    const a = loadFixtureBatch('good', 'T90_20260101_01').topic;
    const b = loadFixtureBatch('good', 'T90_20260101_01').topic;
    b.topicNumber = 91;
    const problems = problemsOf(() => validateTopics([a, b]));
    expect(problems).toContain('T90_20260101_01: topic_id 91 does not match the batch prefix T90');
    expect(problems).toContain('T90_20260101_01: slug "fixture-topic-with-punctuation-symbols" is also used by T90_20260101_01');
    expect(problems.filter((p) => /duplicate id/.test(p))).toHaveLength(8);
  });
});
