import { describe, expect, it } from 'vitest';
import { validateTopics } from '../../../src/content';
import { BIOLOGY_0610, CHEMISTRY_0620, reportErrorUrl, SITE_URL } from '../../../src/config';
import { subjectCounts, subjectTopics } from '../../../src/lib/subjects';
import { questionAnchor } from '../../../src/lib/question-anchor';
import { mdBlock, mdInline } from '../../../src/lib/markdown';
import { expectedPdfs, listTopics, findContentDir, BIOLOGY_CONTENT_SUBPATH, BIOLOGY_SUBJECT_PATH } from '../../../scripts/pdf-manifest.mjs';

const biology = subjectTopics(BIOLOGY_0610);
const chemistry = subjectTopics(CHEMISTRY_0620);
describe('subject publication', () => {
  it('keeps content and computed counts separated', () => {
    expect(subjectCounts(CHEMISTRY_0620)).toEqual({ topics: 12, questions: 360 });
    expect(subjectCounts(BIOLOGY_0610)).toEqual({ topics: 21, questions: 590 });
    expect(biology.flatMap((t) => t.batchIds ?? [])).toHaveLength(24);
    expect(biology.every((t) => t.questions.every((q) => q.batchId.startsWith('0610_')))).toBe(true);
    expect(chemistry.every((t) => t.questions.every((q) => !q.batchId.startsWith('0610_')))).toBe(true);
    expect(() => subjectTopics({ ...BIOLOGY_0610, path: 'unknown' })).toThrow(/No content source/);
  });
  for (const number of [14, 16, 17]) {
    it(`merges topic ${number} in part order without renumbering or duplicate anchors`, () => {
      const topic = biology.find((t) => t.topicNumber === number)!;
      expect(topic.batchIds).toHaveLength(2);
      expect(topic.questions.filter((q) => q.number === 1).map((q) => q.part)).toEqual([1, 2]);
      expect(topic.questions.map((q) => q.part)).toEqual([...topic.questions.map((q) => q.part)].sort());
      const ids = topic.questions.flatMap((q) => {
        const anchor = questionAnchor(q, BIOLOGY_0610);
        expect(anchor).toBe(q.id);
        const page = `${SITE_URL}/${BIOLOGY_0610.path}/${topic.slug}/#${anchor}`;
        const report = new URL(reportErrorUrl(q.id, page));
        expect(report.searchParams.get('body')).toContain(page);
        expect(report.searchParams.get('title')).toContain(q.id);
        return [anchor, `${anchor}-stem`, `${anchor}-answer`];
      });
      expect(new Set(ids).size).toBe(ids.length);
      expect(topic.counts.total).toBe(topic.questions.length);
    });
  }
  it('accepts a labelled aggregate scheme but rejects missing labels and wrong totals', () => {
    const topic = biology.find((t) => t.topicNumber === 6)!;
    const q = topic.questions.find((q) => q.number === 20)!;
    if (q.type !== 'structured') throw new Error('Expected structured question');
    const single = { ...topic, questions: [q] };
    expect(() => validateTopics([single], { topicCount: 1, questionCount: 1 })).not.toThrow();
    for (const defect of ['label', 'marks']) {
      const broken = structuredClone(single);
      const question = broken.questions[0];
      if (question.type !== 'structured') throw new Error('Expected structured question');
      const parent = question.markScheme.find((p) => p.key === 'b')!;
      if (defect === 'label') parent.points = parent.points.filter((p) => !p.text.startsWith('(iv)'));
      else parent.marks = 3;
      expect(() => validateTopics([broken], { topicCount: 1, questionCount: 1 })).toThrow(/mark scheme has no part/);
    }
  });
  it('preserves every Chemistry question anchor', () => {
    for (const topic of chemistry) for (const q of topic.questions) expect(questionAnchor(q, CHEMISTRY_0620)).toBe(`q${q.number}`);
  });
  it('leaves Biology notation plain in block and inline rendering', () => {
    const notation = 'F1 F2 CO2 H2O 2H2O DNA cm3';
    expect(mdInline(notation, { chem: false })).toBe(notation);
    expect(mdBlock(notation, { chem: false })).toContain(notation);
    expect(mdInline('H2O', { chem: true })).not.toBe('H2O');
  });
  it('plans 42 distinct Biology PDFs after merging batches', () => {
    const topics = listTopics(findContentDir(process.cwd(), BIOLOGY_CONTENT_SUBPATH), BIOLOGY_SUBJECT_PATH);
    const pdfs = expectedPdfs(topics);
    expect(topics).toHaveLength(21);
    expect(pdfs).toHaveLength(42);
    expect(new Set(pdfs.map((p) => p.file)).size).toBe(42);
    expect(pdfs.every((p) => p.file.includes('igcse-biology-0610-'))).toBe(true);
    expect(topics.find((t) => t.batches.some((b) => b.includes('_T14_')))?.batches.map((b) => b.match(/_P(\d+)_/)?.[1])).toEqual(['1', '2']);
  });
});
