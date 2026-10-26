/**
 * splitPages: a topic listed in a subject's splitPages becomes one page per part; every other
 * topic keeps its single merged page, so existing subjects' routes and PDF names do not change.
 */
import { describe, expect, it } from 'vitest';
import { ContentError, splitTopic } from '../../../src/content';
import type { Question, Topic } from '../../../src/content';
import { SUBJECTS } from '../../../src/config';
import { subjectPages, subjectTopics } from '../../../src/lib/subjects';

function question(part: number, number: number, type: 'mcq' | 'structured', tier: 'core' | 'supplement', subtopicId: string): Question {
  return {
    id: `4BI1_T02_P${part}_20261026_Q${number}`,
    batchId: `4BI1_T02_P${part}_20261026`,
    part,
    number,
    type,
    tier,
    subtopicId,
    subtopicName: `Subtopic ${subtopicId}`,
  } as unknown as Question;
}

/** A merged two-part topic, as the loader builds it. */
function mergedTopic(): Topic {
  const questions = [
    question(1, 1, 'mcq', 'core', '2a'),
    question(1, 2, 'structured', 'supplement', '2b'),
    question(2, 1, 'mcq', 'core', '2e'),
  ];
  return {
    part: 1,
    batchIds: ['4BI1_T02_P1_20261026', '4BI1_T02_P2_20261026'],
    batchId: '4BI1_T02_P1_20261026',
    topicId: '2',
    topicNumber: 2,
    topicName: 'Structure and functions in living organisms',
    slug: 'structure-and-functions-in-living-organisms',
    subtopics: [],
    questions,
    counts: { total: 3, mcq: 2, structured: 1, core: 2, supplement: 1 },
  };
}

describe('splitTopic', () => {
  it('gives one page per part, titled and slugged from splitPages, with its own counts', () => {
    const pages = splitTopic(mergedTopic(), { 1: 'Cells, biological molecules and movement of substances', 2: 'Nutrition' });
    expect(pages.map((p) => [p.part, p.pageTitle, p.slug, p.batchId])).toEqual([
      [1, 'Cells, biological molecules and movement of substances', 'cells-biological-molecules-and-movement-of-substances', '4BI1_T02_P1_20261026'],
      [2, 'Nutrition', 'nutrition', '4BI1_T02_P2_20261026'],
    ]);
    expect(pages[0]!.counts).toEqual({ total: 2, mcq: 1, structured: 1, core: 1, supplement: 1 });
    expect(pages[1]!.questions.map((q) => q.id)).toEqual(['4BI1_T02_P2_20261026_Q1']);
    expect(pages[1]!.subtopics).toEqual([{ id: '2e', name: 'Subtopic 2e' }]);
    for (const page of pages) {
      expect(page.topicNumber).toBe(2);
      expect(page.topicName).toBe('Structure and functions in living organisms');
    }
  });

  it('rejects a part without a title and a title without a part, so no question is dropped', () => {
    expect(() => splitTopic(mergedTopic(), { 1: 'Cells' })).toThrow(ContentError);
    expect(() => splitTopic(mergedTopic(), { 1: 'Cells', 2: 'Nutrition', 3: 'Respiration' })).toThrow(ContentError);
  });
});

describe('subjectPages', () => {
  it('leaves every subject without splitPages unchanged: one page per topic, same slugs', () => {
    for (const subject of SUBJECTS.filter((s) => s.splitPages === undefined)) {
      expect(subjectPages(subject)).toEqual(subjectTopics(subject));
    }
  });
});
