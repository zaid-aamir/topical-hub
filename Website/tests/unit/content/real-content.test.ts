/**
 * Reads the real Chemistry content (../igcse-chem-pipeline/pipeline/04_approved). Totals are taken
 * from the files themselves (the pipeline may withhold questions), then the test checks that
 * every question loads, pairs with its mark scheme, and keeps the specific tricky shapes found in
 * a survey of the batches.
 */
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { loadSubjectTopics, loadTopicsFromDir, resolveContentDir, summaryLine } from '../../../src/content';
import type { McqQuestion, StructuredQuestion, Topic } from '../../../src/content';
import { CHEMISTRY_0620 } from '../../../src/config';
import { sourceCounts } from './helpers';

const source = sourceCounts(CHEMISTRY_0620);
const loadAllTopics = () => loadSubjectTopics(CHEMISTRY_0620);
const getTopicBySlug = (slug: string) => loadAllTopics().find((t) => t.slug === slug);

let topics: Topic[] = [];
/** Everything console.log printed while loading twice. */
let logged: string[] = [];

beforeAll(() => {
  const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
  try {
    topics = loadAllTopics();
    expect(loadAllTopics()).toBe(topics);
  } finally {
    logged = spy.mock.calls.map((call) => String(call[0]));
    spy.mockRestore();
  }
});

afterAll(() => {
  vi.restoreAllMocks();
});

function topic(prefix: string): Topic {
  const t = topics.find((x) => x.batchId.startsWith(`${prefix}_`));
  if (!t) throw new Error(`no topic ${prefix}`);
  return t;
}

function mcq(prefix: string, number: number): McqQuestion {
  const q = topic(prefix).questions.find((x) => x.number === number);
  if (q?.type !== 'mcq') throw new Error(`${prefix} Q${number} is not an MCQ`);
  return q;
}

function structured(prefix: string, number: number): StructuredQuestion {
  const q = topic(prefix).questions.find((x) => x.number === number);
  if (q?.type !== 'structured') throw new Error(`${prefix} Q${number} is not structured`);
  return q;
}

const TABLE_MCQS = [
  'T01 Q1',
  'T02 Q3',
  'T07 Q1',
  'T07 Q5',
  'T07 Q11',
  'T08 Q14',
  'T08 Q15',
  'T09 Q6',
  'T09 Q15',
  'T09 Q23',
  'T10 Q2',
  'T10 Q3',
  'T10 Q5',
  'T10 Q11',
  'T10 Q21',
  'T11 Q7',
  'T11 Q11',
  'T11 Q16',
  'T11 Q20',
  'T11 Q23',
];

describe('real content', () => {
  it('loads every question in the files, each with its mark scheme', () => {
    expect(topics).toHaveLength(source.topics);
    expect(topics.map((t) => t.topicNumber)).toEqual([...topics.map((t) => t.topicNumber)].sort((a, b) => a - b));
    for (const t of topics) {
      expect(t.counts.total).toBe(t.questions.length);
      expect(t.counts.mcq + t.counts.structured).toBe(t.questions.length);
      expect(t.counts.core + t.counts.supplement).toBe(t.questions.length);
      expect(t.unmatched).toBeUndefined();
      expect(t.topicId).toBe(String(t.topicNumber));
      const files = source.perBatch.get(t.batchId)!;
      expect(t.questions.map((q) => q.number), t.batchId).toEqual(files.questions);
      expect([...files.markscheme].sort((a, b) => a - b), t.batchId).toEqual([...files.questions].sort((a, b) => a - b));
    }
    const all = topics.flatMap((t) => t.questions);
    expect(all).toHaveLength(source.questions);
    expect(all.filter((q) => q.type === 'mcq')).toHaveLength(source.mcq);
    expect(all.filter((q) => q.type === 'structured')).toHaveLength(source.structured);
    expect(new Set(all.map((q) => q.id)).size).toBe(source.questions);
  });

  it('prints the summary line exactly once per process and caches the result', () => {
    expect(logged).toEqual([summaryLine(topics, CHEMISTRY_0620.shortName)]);
    expect(loadAllTopics()).toBe(topics);
  });

  it('every MCQ has four options A-D, an answer in A-D and a rationale', () => {
    for (const t of topics) {
      for (const q of t.questions) {
        if (q.type !== 'mcq') continue;
        expect(q.options.map((o) => o.letter), q.id).toEqual(['A', 'B', 'C', 'D']);
        expect('ABCD'.includes(q.answer), q.id).toBe(true);
        expect(q.rationale.length, q.id).toBeGreaterThan(0);
        expect(q.stem.length, q.id).toBeGreaterThan(0);
      }
    }
  });

  it('exactly the 20 surveyed MCQs are table-shaped; two of them have a non-blank first header cell', () => {
    const found: string[] = [];
    for (const t of topics) {
      for (const q of t.questions) {
        if (q.type === 'mcq' && q.optionTable) {
          found.push(`${t.batchId.slice(0, 3)} Q${q.number}`);
          expect(q.optionTable.headers.length, q.id).toBeGreaterThan(0);
          for (const o of q.options) expect(o.cells?.length, q.id).toBe(q.optionTable.headers.length);
        }
      }
    }
    expect(found).toEqual(TABLE_MCQS);
    expect(mcq('T02', 3).optionTable?.letterHeader).toBe('Option');
    expect(mcq('T10', 11).optionTable?.letterHeader).toBe('sample');
    expect(mcq('T01', 1).optionTable).toEqual({ headers: ['Has a fixed shape?', 'Has a fixed volume?', 'Flows easily?'] });
    expect(mcq('T01', 1).options[2]).toEqual({ letter: 'C', text: 'no, yes, yes', cells: ['no', 'yes', 'yes'] });
  });

  it('MCQs with a data table in the stem keep the table and take the plain options', () => {
    for (const [prefix, number] of [['T01', 8], ['T07', 3], ['T08', 11], ['T09', 12], ['T09', 13], ['T12', 23]] as const) {
      const q = mcq(prefix, number);
      expect(q.optionTable, q.id).toBeUndefined();
      expect(q.stem, q.id).toMatch(/\n\|---/);
      expect(q.options.every((o) => o.cells === undefined), q.id).toBe(true);
    }
    const q = mcq('T09', 12);
    expect(q.stem.startsWith('A student tests four metals, P, R, T and V.')).toBe(true);
    expect(q.options.map((o) => o.text)).toEqual(['R, P, V, T', 'V, R, P, T', 'R, V, P, T', 'T, P, V, R']);
    expect(q.answer).toBe('C');
    expect(q.workedSolution?.startsWith('Work from the most vigorous reaction down.\n1. Only R reacts')).toBe(true);
  });

  it('preserves "<" in options and ">" in mark schemes', () => {
    const q = mcq('T01', 4);
    expect(q.options[0].text).toBe('gas < liquid < solid');
    expect(q.options.map((o) => o.text)).toEqual(['gas < liquid < solid', 'liquid < solid < gas', 'solid < gas < liquid', 'solid < liquid < gas']);
    expect(q.rationale).toContain('So solid < liquid < gas.');
    const all = topics.flatMap((t) => t.questions);
    const text = JSON.stringify(all);
    for (const ch of ['−', '–', '→', '°', '×', '—', '∆', '÷', '⇌']) expect(text, ch).toContain(ch);
  });

  it('150 of the 180 MCQs have a worked solution', () => {
    const mcqs = topics.flatMap((t) => t.questions).filter((q): q is McqQuestion => q.type === 'mcq');
    expect(mcqs.filter((q) => q.workedSolution !== undefined)).toHaveLength(150);
    expect(mcqs.every((q) => q.workedSolution === undefined || q.workedSolution.length > 0)).toBe(true);
  });

  it('T03 Q7: part (a) has no marks of its own and sub-parts (i) [1], (ii) [1]; part (b) is [2]', () => {
    const q = structured('T03', 7);
    expect(q.parts).toEqual([
      {
        label: 'a',
        text: 'Give the formula of each of the following:',
        marks: null,
        subparts: [
          { label: 'i', text: 'sodium hydroxide', marks: 1 },
          { label: 'ii', text: 'hydrogen gas', marks: 1 },
        ],
        totalMarks: 2,
      },
      {
        label: 'b',
        text: 'Write a balanced symbol equation for this reaction, including state symbols.',
        marks: 2,
        subparts: [],
        totalMarks: 2,
      },
    ]);
    expect(q.markScheme.map((p) => [p.key, p.marks, p.points.length])).toEqual([
      ['a', null, 0],
      ['a.i', 1, 1],
      ['a.ii', 1, 1],
      ['b', 2, 3],
    ]);
  });

  it('T04 Q7: "(b) State the name given to:" with (i), (ii); mark scheme keys b.i, b.ii', () => {
    const q = structured('T04', 7);
    expect(q.parts[1].text).toBe('State the name given to:');
    expect(q.parts[1].marks).toBeNull();
    expect(q.parts[1].subparts.map((s) => [s.label, s.marks])).toEqual([
      ['i', 1],
      ['ii', 1],
    ]);
    expect(q.markScheme.map((p) => p.key)).toEqual(['a', 'b.i', 'b.ii']);
  });

  it('T11 Q29: inline "(a) (i)" gives an empty part text; T12 Q9: part (b) holds a table and two sub-parts', () => {
    const q29 = structured('T11', 29);
    expect(q29.parts[0].text).toBe('');
    expect(q29.parts[0].marks).toBeNull();
    expect(q29.parts[0].subparts.map((s) => s.label)).toEqual(['i', 'ii']);
    expect(q29.parts.map((p) => p.label)).toEqual(['a', 'b', 'c', 'd']);
    expect(q29.markScheme.map((p) => p.key)).toEqual(['a.i', 'a.ii', 'b', 'c', 'd']);
    expect(q29.workedSolution.startsWith('(a) Each monomer')).toBe(true);

    const q9 = structured('T12', 9);
    const b = q9.parts[1];
    expect(b.marks).toBeNull();
    expect(b.text).toContain('| Sample | Distance of each spot from the baseline / cm |');
    expect(b.text).toContain('|---|---|');
    expect(b.text.startsWith('The results are shown in the table.')).toBe(true);
    expect(b.subparts).toHaveLength(2);
    expect(b.subparts.map((s) => s.marks)).toEqual([2, 1]);
    expect(b.totalMarks).toBe(3);
    expect(q9.markScheme.map((p) => p.key)).toEqual(['a', 'b.i', 'b.ii']);
    expect(q9.markScheme[0].points[0].children).toHaveLength(5);
    expect(q9.markScheme[0].points[0].text).toBe('any three from (1 each, max 3):');
  });

  it('T09 Q10(c): a multi-paragraph part whose marks sit after "[Ar: ...]"', () => {
    const q = structured('T09', 10);
    const c = q.parts.find((p) => p.label === 'c');
    expect(c?.marks).toBe(3);
    expect(c?.text.endsWith('[Ar: Fe = 56; O = 16]')).toBe(true);
    expect(c?.text).toContain('Calculate the maximum mass of iron');
  });

  it('T02 Q6(b) and T10 Q17(a): marks on the instruction line, material to complete after it', () => {
    const b = structured('T02', 6).parts[1];
    expect(b.marks).toBe(2);
    expect(b.text.startsWith('Complete the table to give the relative charge and the relative mass of each particle.\n\n| Particle |')).toBe(true);
    expect(b.text.endsWith('| electron |  |  |')).toBe(true);
    expect(b.text).not.toContain('[2]');

    const a = structured('T10', 17).parts[0];
    expect(a.marks).toBe(2);
    expect(a.text).toBe('Complete the word equation for photosynthesis.\n\ncarbon dioxide + .................... → .................... + oxygen');
    expect(structured('T10', 17).parts.map((p) => p.totalMarks)).toEqual([2, 1, 1, 2]);
  });

  it('T05 Q19: the stem keeps the two bullet lines and the metadata is untouched', () => {
    const q = structured('T05', 19);
    expect(q.stem).toContain('\n- respiration: C6H12O6 + 6O2 → 6CO2 + 6H2O, which releases energy for the cell to use\n');
    expect(q.stem).toContain('\n- photosynthesis: 6CO2 + 6H2O → C6H12O6 + 6O2, which requires energy absorbed from sunlight');
    expect(q.subtopicId).toBe('5.1');
    expect(q.marks).toBe(5);
    expect(q.parts.map((p) => p.marks)).toEqual([2, 2, 1]);
  });

  it('classifies keyword bullets and keeps label lines and notes', () => {
    const q18 = structured('T05', 18);
    const c = q18.markScheme.find((p) => p.key === 'c');
    expect(c?.points.at(-1)).toEqual({ kind: 'ecf', text: 'ECF from (b)', children: [] });
    const q22 = structured('T11', 22);
    const q22c = q22.markScheme.find((p) => p.key === 'c');
    expect(q22c?.points.filter((p) => p.isLabel).map((p) => p.text)).toEqual([
      'Advantages of method 1 (fermentation), any two from:',
      'Disadvantages of method 1 (fermentation), any two from:',
    ]);
    const kinds = new Set(topics.flatMap((t) => t.questions).flatMap((q) => (q.type === 'structured' ? q.markScheme.flatMap((p) => p.points.map((x) => x.kind)) : [])));
    expect([...kinds].sort()).toEqual(['allow', 'ecf', 'ignore', 'point', 'reject']);
    const notes = topics.flatMap((t) => t.questions).flatMap((q) => (q.type === 'structured' ? q.markScheme.map((p) => p.note).filter(Boolean) : []));
    expect(notes.sort()).toEqual(['any four from:', 'any three from:', 'any two from:']);
  });

  it('every structured question has a worked solution and part marks that sum to its marks', () => {
    for (const t of topics) {
      for (const q of t.questions) {
        if (q.type !== 'structured') continue;
        expect(q.workedSolution.length, q.id).toBeGreaterThan(0);
        expect(q.parts.reduce((n, p) => n + p.totalMarks, 0), q.id).toBe(q.marks);
        expect(q.markScheme.length, q.id).toBeGreaterThan(0);
      }
    }
  });

  it('text fields are trimmed and contain no carriage returns', () => {
    for (const t of topics) {
      for (const q of t.questions) {
        const fields = [q.stem, ...(q.type === 'mcq' ? [q.rationale, q.workedSolution ?? '', ...q.options.map((o) => o.text)] : [q.workedSolution, ...q.parts.flatMap((p) => [p.text, ...p.subparts.map((s) => s.text)])])];
        for (const f of fields) {
          expect(f, q.id).toBe(f.trim());
          expect(f, q.id).not.toContain('\r');
        }
      }
    }
  });

  it('produces no validation warnings for the real content', () => {
    const warnings: string[] = [];
    const again = loadTopicsFromDir(resolveContentDir(CHEMISTRY_0620), { warn: (w) => warnings.push(w) });
    expect(warnings).toEqual([]);
    expect(again).toHaveLength(topics.length);
  });

  it('slugs match the URL list and getTopicBySlug finds them', () => {
    expect(topics.map((t) => t.slug)).toEqual([
      'states-of-matter',
      'atoms-elements-and-compounds',
      'stoichiometry',
      'electrochemistry',
      'chemical-energetics',
      'chemical-reactions',
      'acids-bases-and-salts',
      'the-periodic-table',
      'metals',
      'chemistry-of-the-environment',
      'organic-chemistry',
      'experimental-techniques-and-chemical-analysis',
    ]);
    expect(getTopicBySlug('electrochemistry')?.batchId).toBe('T04_20260923_01');
    expect(getTopicBySlug('nope')).toBeUndefined();
    for (const t of topics) expect(t.subtopics.length, t.batchId).toBeGreaterThan(0);
  });
});
