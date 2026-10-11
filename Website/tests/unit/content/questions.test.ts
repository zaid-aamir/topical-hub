import { describe, expect, it } from 'vitest';
import { ContentError, parseMcqBody, parseQuestionsFile, parseStructuredBody, splitTableRow } from '../../../src/content';
import { QUESTIONS_FRONTMATTER, loadFixtureBatch, mcq, meta, structured } from './helpers';

const { questionsFile, topic } = loadFixtureBatch('good', 'T90_20260101_01');

describe('parseQuestionsFile (good fixture)', () => {
  it('parses every block with its metadata', () => {
    expect(questionsFile.questions.map((q) => q.number)).toEqual([1, 2, 4, 5, 6, 7, 8, 9]);
    const q1 = questionsFile.questions[0];
    expect(q1).toMatchObject({
      id: 'T90_20260101_01_Q1',
      type: 'mcq',
      tier: 'core',
      subtopicId: '90.1',
      subtopicName: 'Shapes of questions',
      syllabusPoints: ['90.1.1'],
      difficulty: 1,
      marks: 1,
      needsDiagram: false,
    });
    const q2 = questionsFile.questions[1];
    expect(q2.syllabusPoints).toEqual(['90.1.1', '90.1.2']);
    expect(q2.tier).toBe('core');
  });

  it('MCQ shape 1: plain options, stem starting with "A student", "<" preserved', () => {
    const q = mcq(topic, 1);
    expect(q.stem).toBe(
      'A student puts the particles of a pure substance in order of increasing average energy. Which order is correct?',
    );
    expect(q.options.map((o) => o.letter)).toEqual(['A', 'B', 'C', 'D']);
    expect(q.options[0].text).toBe('gas < liquid < solid');
    expect(q.options[3].text).toBe('solid < liquid < gas');
    expect(q.options[0].cells).toBeUndefined();
    expect(q.optionTable).toBeUndefined();
  });

  it('MCQ shape 2: option table with a blank first header cell', () => {
    const q = mcq(topic, 2);
    expect(q.stem).toBe('Which row correctly describes the properties of a liquid?');
    expect(q.optionTable).toEqual({ headers: ['Has a fixed shape?', 'Has a fixed volume?', 'Flows easily?'] });
    expect(q.optionTable?.letterHeader).toBeUndefined();
    expect(q.options).toEqual([
      { letter: 'A', text: 'yes, yes, no', cells: ['yes', 'yes', 'no'] },
      { letter: 'B', text: 'no, no, yes', cells: ['no', 'no', 'yes'] },
      { letter: 'C', text: 'no, yes, yes', cells: ['no', 'yes', 'yes'] },
      { letter: 'D', text: 'yes, no, no', cells: ['yes', 'no', 'no'] },
    ]);
  });

  it('MCQ shape 2 with a non-blank first header cell exposes it as letterHeader', () => {
    const q = mcq(topic, 8);
    expect(q.optionTable).toEqual({ headers: ['Relative charge', 'Relative mass'], letterHeader: 'Option' });
    expect(q.options[1]).toEqual({ letter: 'B', text: '−1, 1/1840', cells: ['−1', '1/1840'] });
  });

  it('MCQ with a data table in the stem keeps the table and takes the plain options after it', () => {
    const q = mcq(topic, 9);
    expect(q.stem.startsWith('A student tests four metals, P, R, T and V.')).toBe(true);
    expect(q.stem).toContain('| metal | observations with cold water | observations with dilute hydrochloric acid |');
    expect(q.stem.endsWith('What is the order of reactivity of the metals, from most reactive to least reactive?')).toBe(true);
    expect(q.optionTable).toBeUndefined();
    expect(q.options.map((o) => o.text)).toEqual(['R, P, V, T', 'V, R, P, T', 'R, V, P, T', 'T, P, V, R']);
  });

  it('does not read bullet lines in the question text as metadata (T05 trap)', () => {
    const q = structured(topic, 4);
    expect(q.subtopicId).toBe('90.2');
    expect(q.marks).toBe(5);
    expect(q.stem).toBe(
      'Living cells constantly carry out two important reactions:\n\n' +
        '- respiration: C6H12O6 + 6O2 → 6CO2 + 6H2O, which releases energy for the cell to use\n' +
        '- photosynthesis: 6CO2 + 6H2O → C6H12O6 + 6O2, which requires energy absorbed from sunlight',
    );
    expect(q.parts).toEqual([
      { label: 'a', text: 'State, with a reason, whether respiration is exothermic or endothermic.', marks: 2, subparts: [], totalMarks: 2 },
      { label: 'b', text: 'Give three features shared by the members of a homologous series.', marks: 3, subparts: [], totalMarks: 3 },
    ]);
  });

  it('sub-part shape 1: part text with no marks, then (i) and (ii) on their own lines (T03 Q7)', () => {
    const q = structured(topic, 5);
    expect(q.stem).toBe('Sodium reacts with water to produce sodium hydroxide and hydrogen gas.');
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
  });

  it('sub-part shape 2: inline "(a) (i) ..." gives an empty part text (T11 Q29)', () => {
    const q = structured(topic, 6);
    expect(q.stem).toContain('- butanedioic acid, HOOC–CH2–CH2–COOH');
    expect(q.parts[0]).toEqual({
      label: 'a',
      text: '',
      marks: null,
      subparts: [
        { label: 'i', text: 'State the type of polymerisation that occurs.', marks: 1 },
        { label: 'ii', text: 'Name the small molecule that is formed at the same time as each linkage.', marks: 1 },
      ],
      totalMarks: 2,
    });
    expect(q.parts[1]).toMatchObject({ label: 'b', marks: 2, totalMarks: 2 });
  });

  it('sub-part shape 3: part with intro text and a table, then sub-parts; and a multi-paragraph part (T12 Q9, T09)', () => {
    const q = structured(topic, 7);
    expect(q.parts.map((p) => p.label)).toEqual(['a', 'b', 'c']);
    const b = q.parts[1];
    expect(b.marks).toBeNull();
    expect(b.text).toBe(
      'The results are shown in the table.\n\n' +
        '| Sample | Distance of each spot from the baseline / cm |\n' +
        '|---|---|\n' +
        '| E | 2.1 and 5.4 |\n' +
        '| P | 2.1 |\n' +
        '| Q | 3.8 |\n' +
        '| R | 5.4 |\n' +
        '| S | 2.1 and 6.7 |',
    );
    expect(b.subparts).toEqual([
      { label: 'i', text: 'Deduce which of the known dyes P, Q, R and S are present in E. Explain your answer.', marks: 2 },
      { label: 'ii', text: 'State which one of the known dyes P, Q, R and S is not a pure substance.', marks: 1 },
    ]);
    expect(b.totalMarks).toBe(3);
    const c = q.parts[2];
    expect(c.marks).toBe(2);
    expect(c.text).toBe(
      'A load of hematite contains 480 kg of iron(III) oxide.\n\n' +
        'Calculate the maximum mass of iron, in kg, that can be produced from this iron(III) oxide.\n\n' +
        '[Ar: Fe = 56; O = 16]',
    );
    expect(q.parts.reduce((n, p) => n + p.totalMarks, 0)).toBe(q.marks);
  });

  it('text fields never end in a newline', () => {
    for (const q of topic.questions) {
      expect(q.stem).toBe(q.stem.trim());
      if (q.type === 'structured') {
        for (const p of q.parts) {
          expect(p.text).toBe(p.text.trim());
          for (const s of p.subparts) expect(s.text).toBe(s.text.trim());
        }
      }
    }
  });
});

describe('parseMcqBody', () => {
  it('takes the last A-D window when the trailing run is longer than four lines', () => {
    const body = 'X is a metal.\nA one\nB two\nC three\nD four';
    const { stem, options } = parseMcqBody(body);
    expect(stem).toBe('X is a metal.');
    expect(options.map((o) => o.letter + ':' + o.text)).toEqual(['A:one', 'B:two', 'C:three', 'D:four']);
  });

  it('passes a three-option run through for validation to reject', () => {
    const { options } = parseMcqBody('Stem?\n\nA one\nB two\nC three');
    expect(options.map((o) => o.letter)).toEqual(['A', 'B', 'C']);
  });

  it('returns no options when neither shape is present', () => {
    const { stem, options, optionTable } = parseMcqBody('Just a stem with no options.');
    expect(stem).toBe('Just a stem with no options.');
    expect(options).toEqual([]);
    expect(optionTable).toBeUndefined();
  });

  it('passes a trailing table with non-letter rows through for validation to reject', () => {
    const { options, optionTable } = parseMcqBody('Stem\n\n| x | y |\n|---|---|\n| P | 1 |\n| Q | 2 |');
    expect(optionTable).toEqual({ headers: ['y'], letterHeader: 'x' });
    expect(options.map((o) => o.letter)).toEqual(['P', 'Q']);
  });
});

describe('splitTableRow', () => {
  it('splits cells, trims them and unescapes \\|', () => {
    expect(splitTableRow('| A | yes | no |')).toEqual(['A', 'yes', 'no']);
    expect(splitTableRow('|---|---|')).toEqual(['---', '---']);
    expect(splitTableRow('| | x |')).toEqual(['', 'x']);
    expect(splitTableRow('a | b \\| c | d')).toEqual(['a', 'b | c', 'd']);
  });
});

describe('parseStructuredBody', () => {
  it('only starts a new part at the next expected letter', () => {
    const { stem, parts } = parseStructuredBody('(b) not a part yet\n\n(a) first [1]\n\n(c) still inside a [1]\n\n(b) second [2]');
    expect(stem).toBe('(b) not a part yet');
    expect(parts.map((p) => p.label)).toEqual(['a', 'b']);
    expect(parts[0].text).toBe('first [1]\n\n(c) still inside a');
    expect(parts[0].marks).toBe(1);
    expect(parts[1]).toMatchObject({ text: 'second', marks: 2 });
  });

  it('a sub-part may span several lines and takes its marks from the end', () => {
    const { parts } = parseStructuredBody('(a) Write the equation.\n\n(i) for ethene\n\nC2H4 + H2O → ....... [2]\n\n(ii) for propene [1]');
    expect(parts[0].subparts[0]).toEqual({ label: 'i', text: 'for ethene\n\nC2H4 + H2O → .......', marks: 2 });
    expect(parts[0].totalMarks).toBe(3);
  });

  it('takes the marks from the first line when material to complete follows (T02 Q6, T10 Q17)', () => {
    const { parts } = parseStructuredBody(
      '(a) Complete the word equation for photosynthesis. [2]\n\ncarbon dioxide + .......... → .......... + oxygen\n\n' +
        '(b) Complete the table. [2]\n\n| Particle | Relative charge |\n|---|---|\n| proton |  |\n\n' +
        '(c) Explain. [1]',
    );
    expect(parts[0]).toEqual({
      label: 'a',
      text: 'Complete the word equation for photosynthesis.\n\ncarbon dioxide + .......... → .......... + oxygen',
      marks: 2,
      subparts: [],
      totalMarks: 2,
    });
    expect(parts[1].marks).toBe(2);
    expect(parts[1].text).toBe('Complete the table.\n\n| Particle | Relative charge |\n|---|---|\n| proton |  |');
    expect(parts[2]).toMatchObject({ text: 'Explain.', marks: 1 });
  });

  it('a sub-part may also carry its marks on its first line', () => {
    const { parts } = parseStructuredBody('(a) Complete:\n\n(i) the equation [1]\n\nC2H4 + H2O → .......\n\n(ii) the name [1]');
    expect(parts[0].subparts[0]).toEqual({ label: 'i', text: 'the equation\n\nC2H4 + H2O → .......', marks: 1 });
    expect(parts[0].totalMarks).toBe(2);
  });

  it('fails when a sub-part has no marks or runs out of order', () => {
    expect(() => parseStructuredBody('(a) Name:\n\n(i) the solvent\n\n(ii) the solute [1]')).toThrow(/\(a\)\(i\) does not end in "\[n\]"/);
    expect(() => parseStructuredBody('(a) Name:\n\n(ii) the solute [1]')).toThrow(/expected sub-part \(i\) but found \(ii\)/);
  });
});

describe('parseQuestionsFile (malformed blocks)', () => {
  const file = (...blocks: string[]) => `${QUESTIONS_FRONTMATTER}\n${blocks.join('\n\n')}\n`;

  it('lists every malformed block in one error', () => {
    const text = file(
      `## Q1\n${meta(1, 'mcq')}\n\nNo question marker here\n\nA a\nB b\nC c\nD d`,
      `## Q2\n${meta(2, 'mcq').replace('- tier: core\n', '')}\n\n**Question**\n\nStem\n\nA a\nB b\nC c\nD d`,
      `## Q3\n${meta(3, 'mcq', { type: 'multiple-choice' })}\n\n**Question**\n\nStem\n\nA a\nB b\nC c\nD d`,
      `## Q4\n${meta(4, 'structured', { needs_diagram: 'maybe' })}\n\n**Question**\n\n(a) x [2]`,
      `## Q5\n${meta(5, 'structured', { syllabus_points: 'nope' })}\n\n**Question**\n\n(a) x [2]`,
      `## Q6\n${meta(6, 'mcq')}\n\n**Question**\n\nStem\n\nA a\nB b\nC c\nD d`,
    );
    let error: ContentError | undefined;
    try {
      parseQuestionsFile(text);
    } catch (err) {
      error = err as ContentError;
    }
    expect(error).toBeInstanceOf(ContentError);
    expect(error?.details).toHaveLength(5);
    expect(error?.details[0]).toMatch(/^Q1 \(line \d+\): expected the "\*\*Question\*\*" line/);
    expect(error?.details[1]).toMatch(/^Q2 .*metadata is missing tier/);
    expect(error?.details[2]).toMatch(/^Q3 .*type must be "mcq" or "structured", got "multiple-choice"/);
    expect(error?.details[3]).toMatch(/^Q4 .*needs_diagram must be true or false/);
    expect(error?.details[4]).toMatch(/^Q5 .*syllabus_points must be a JSON-style array/);
  });

  it('accepts a metadata block followed directly by **Question** and comments after values', () => {
    const text = file(`## Q7\n${meta(7, 'mcq', { type: 'mcq            # mcq | structured', difficulty: '2   # medium' })}\n**Question**\n\nStem\n\nA a\nB b\nC c\nD d`);
    const parsed = parseQuestionsFile(text);
    expect(parsed.questions[0]).toMatchObject({ type: 'mcq', difficulty: 2, stem: 'Stem' });
  });

  it('passes an unknown tier and an out-of-range difficulty through for validation', () => {
    const text = file(`## Q8\n${meta(8, 'mcq', { tier: 'extended', difficulty: '4', marks: 'two' })}\n\n**Question**\n\nStem\n\nA a\nB b\nC c\nD d`);
    const q = parseQuestionsFile(text).questions[0];
    expect(q.tier).toBe('extended');
    expect(q.difficulty).toBe(4);
    expect(Number.isNaN(q.marks)).toBe(true);
  });
});
