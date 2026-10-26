import { describe, expect, it } from 'vitest';
import { validateTopics } from '../../../src/content';
import { BIOLOGY_0610, CHEMISTRY_0620, PHYSICS_0625, SUBJECTS, REPORT_FORM_FIELDS, REPORT_FORM_URL, reportErrorUrl, SITE_URL } from '../../../src/config';
import { subjectCounts, subjectTopics } from '../../../src/lib/subjects';
import { questionAnchor } from '../../../src/lib/question-anchor';
import { mdBlock, mdInline, subjectFormat } from '../../../src/lib/markdown';
import { expectedPdfs, listTopics, findContentDir, pdfFileName } from '../../../scripts/pdf-manifest.mjs';
import { sourceCounts } from './helpers';

const biology = subjectTopics(BIOLOGY_0610);
const chemistry = subjectTopics(CHEMISTRY_0620);

describe('subject publication', () => {
  for (const subject of SUBJECTS) {
    describe(subject.shortName, () => {
      const topics = subjectTopics(subject);
      const files = sourceCounts(subject);

      it('counts topics and questions from the data, matching the files', () => {
        expect(subjectCounts(subject)).toEqual({ topics: files.topics, questions: files.questions });
        expect(topics.flatMap((t) => t.batchIds ?? [])).toHaveLength(files.batches);
        expect(topics.every((t) => t.questions.every((q) => q.batchId.startsWith(subject.batchPrefix)))).toBe(true);
      });

      it('merges multi-part topics in part order without renumbering or duplicate anchors', () => {
        for (const topic of topics) {
          const parts = topic.questions.map((q) => q.part ?? 1);
          expect(parts, topic.slug).toEqual([...parts].sort((a, b) => a - b));
          expect(topic.counts.total).toBe(topic.questions.length);
          const ids = topic.questions.flatMap((q) => {
            const anchor = questionAnchor(q, subject);
            expect(anchor).toBe(subject.anchor === 'number' ? `q${q.number}` : q.id);
            return [anchor, `${anchor}-stem`, `${anchor}-answer`];
          });
          expect(new Set(ids).size, topic.slug).toBe(ids.length);
        }
      });

      it('plans two distinct PDFs per topic, named after the subject path', () => {
        const planned = listTopics(findContentDir(process.cwd(), subject), subject);
        const pdfs = expectedPdfs(planned);
        expect(planned.map((t) => t.slug).sort()).toEqual(topics.map((t) => t.slug).sort());
        expect(new Set(pdfs.map((p) => p.file)).size).toBe(2 * topics.length);
        const prefix = `topical-hub-${subject.path.replace(/\//g, '-')}-`;
        expect(pdfs.every((p) => p.file.startsWith(prefix))).toBe(true);
        for (const t of planned) expect(t.batches).toEqual(topics.find((x) => x.slug === t.slug)?.batchIds);
      });
    });
  }

  it('rejects a subject that is not in SUBJECTS', () => {
    expect(() => subjectTopics({ ...BIOLOGY_0610, path: 'unknown' })).toThrow(/No content source/);
  });

  it('keeps Chemistry and Biology batches apart', () => {
    expect(chemistry.every((t) => t.questions.every((q) => !/^\d{4}_/.test(q.batchId)))).toBe(true);
    expect(biology.every((t) => t.questions.every((q) => q.batchId.startsWith('0610_')))).toBe(true);
  });

  it('merges Physics topics 1-4 from several parts, keeping source numbers and ids', () => {
    const physics = subjectTopics(PHYSICS_0625);
    expect(physics.map((t) => t.topicName)).toEqual([
      'Motion, forces and energy',
      'Thermal physics',
      'Waves',
      'Electricity and magnetism',
      'Nuclear physics',
      'Space physics',
    ]);
    for (const topic of physics.filter((t) => t.topicNumber <= 4)) {
      expect((topic.batchIds ?? []).length, topic.slug).toBeGreaterThan(1);
      const parts = [...new Set(topic.questions.map((q) => q.part))];
      expect(topic.questions.filter((q) => q.number === 1).map((q) => q.part)).toEqual(parts);
    }
    expect(pdfFileName('waves', 'questions', PHYSICS_0625.path)).toBe('topical-hub-igcse-physics-0625-waves-questions.pdf');
  });

  it('builds pre-filled report form links with the question id and its anchor, or none without a form', () => {
    const topic = biology.find((t) => (t.batchIds ?? []).length > 1)!;
    for (const q of topic.questions) {
      const page = `${SITE_URL}/${BIOLOGY_0610.path}/${topic.slug}/#${questionAnchor(q, BIOLOGY_0610)}`;
      const href = reportErrorUrl(q.id, page);
      if (!REPORT_FORM_URL) {
        expect(href).toBeNull();
        continue;
      }
      const report = new URL(href!);
      expect(`${report.origin}${report.pathname}`).toBe(REPORT_FORM_URL);
      expect(report.hostname).not.toContain('github');
      expect(report.searchParams.get(REPORT_FORM_FIELDS.questionId)).toBe(q.id);
      expect(report.searchParams.get(REPORT_FORM_FIELDS.pageUrl)).toBe(page);
    }
  });

  it('accepts a labelled aggregate scheme but rejects missing labels and wrong totals', () => {
    const topic = biology.find((t) => t.topicNumber === 6)!;
    const q = topic.questions.find((q) => q.number === 20)!;
    if (q.type !== 'structured') throw new Error('Expected structured question');
    const single = { ...topic, questions: [q] };
    expect(() => validateTopics([single], { batchPrefix: BIOLOGY_0610.batchPrefix })).not.toThrow();
    for (const defect of ['label', 'marks']) {
      const broken = structuredClone(single);
      const question = broken.questions[0];
      if (question.type !== 'structured') throw new Error('Expected structured question');
      const parent = question.markScheme.find((p) => p.key === 'b')!;
      if (defect === 'label') parent.points = parent.points.filter((p) => !p.text.startsWith('(iv)'));
      else parent.marks = 3;
      expect(() => validateTopics([broken], { batchPrefix: BIOLOGY_0610.batchPrefix })).toThrow(/mark scheme has no part/);
    }
  });

  it('formats text per subject: chemistry only for Chemistry, powers for Biology and Physics', () => {
    expect(subjectFormat(CHEMISTRY_0620)).toEqual({ chem: true, power: false });
    expect(subjectFormat(BIOLOGY_0610)).toEqual({ chem: false, power: true });
    expect(subjectFormat(PHYSICS_0625)).toEqual({ chem: false, power: true });
    const notation = 'F1 F2 CO2 H2O 2H2O DNA cm3';
    expect(mdInline(notation, subjectFormat(BIOLOGY_0610))).toBe(notation);
    expect(mdBlock(notation, subjectFormat(BIOLOGY_0610))).toContain(notation);
    expect(mdInline('H2O', subjectFormat(CHEMISTRY_0620))).not.toBe('H2O');
    expect(mdInline('m^3', subjectFormat(CHEMISTRY_0620))).toBe('m^3');
  });
});
