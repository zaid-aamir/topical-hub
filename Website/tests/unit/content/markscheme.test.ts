import { describe, expect, it } from 'vitest';
import { ContentError, classifyMarkPoint, parseMarkschemeFile } from '../../../src/content';
import type { MarkPoint } from '../../../src/content';
import { MARKSCHEME_FRONTMATTER, loadFixtureBatch, mcq, structured } from './helpers';

const { markschemeFile, topic } = loadFixtureBatch('good', 'T90_20260101_01');

const point = (text: string, extra: Partial<MarkPoint> = {}): MarkPoint => ({
  kind: classifyMarkPoint(text),
  text,
  children: [],
  ...extra,
});

describe('parseMarkschemeFile (good fixture)', () => {
  it('keys entries by heading number and tells MCQ from structured entries', () => {
    expect([...markschemeFile.entries.keys()]).toEqual([1, 2, 4, 5, 6, 7, 8, 9]);
    expect(markschemeFile.entries.get(1)?.kind).toBe('mcq');
    expect(markschemeFile.entries.get(4)?.kind).toBe('structured');
  });

  it('MCQ: answer, rationale with "<" and ">" preserved, optional worked solution', () => {
    const q1 = mcq(topic, 1);
    expect(q1.answer).toBe('D');
    expect(q1.rationale).toBe(
      'Particles in a solid have the least energy and particles in a gas the most, so solid < liquid < gas. A reverses the order. The comparison 200 > 115 is irrelevant here.',
    );
    expect(q1.workedSolution).toBe('Put the states in order of particle energy: solid < liquid < gas. That is option D.');

    const q2 = mcq(topic, 2);
    expect(q2.answer).toBe('C');
    expect(q2.workedSolution).toBeUndefined();
    expect('workedSolution' in q2).toBe(false);

    const q9 = mcq(topic, 9);
    expect(q9.workedSolution).toBe(
      'Work from the most vigorous reaction down.\n' +
        '1. Only R reacts with cold water, so R is the most reactive.\n' +
        '2. Compare the others with acid: V (rapid) > P (slow) > T (none).\n' +
        '3. Combined order: R, V, P, T. That is option C.',
    );
  });

  it('classifies ALLOW / REJECT / IGNORE / ECF bullets with and without a colon', () => {
    const q = structured(topic, 4);
    const a = q.markScheme[0];
    expect(a).toMatchObject({ key: 'a', marks: 2, note: '' });
    expect(a.points.map((p) => p.kind)).toEqual([
      'point',
      'point',
      'allow',
      'allow',
      'reject',
      'reject',
      'ignore',
      'ignore',
      'ecf',
      'ecf',
    ]);
    expect(a.points[2].text).toBe('ALLOW: "gives out heat"');
    expect(a.points[3].text).toBe('ALLOW thermal energy transferred to the surroundings');
    expect(a.points[9].text).toBe('ECF from (a)');
    expect(a.points[0].text).toBe('exothermic (1)');
  });

  it('reads "**(c)** **(i)** [1]" as the same head as "**(c)(i)** [1]"', () => {
    const text = `${MARKSCHEME_FRONTMATTER}
## Q1

**(c)** **(i)** [1]

- violet (1)

**(c)(ii)** [1]

- red (1)

**Worked solution**

Violet bends more; red is longer.
`;
    const entry = parseMarkschemeFile(text).entries.get(1);
    if (entry?.kind !== 'structured') throw new Error('expected a structured entry');
    expect(entry.parts.map((p) => [p.key, p.marks])).toEqual([['c.i', 1], ['c.ii', 1]]);
  });

  it('keeps a note after the marks on a head and nests indented bullets under their parent', () => {
    const q = structured(topic, 4);
    const b = q.markScheme[1];
    expect(b.key).toBe('b');
    expect(b.marks).toBe(3);
    expect(b.note).toBe('any three from:');
    expect(b.points).toEqual([
      {
        kind: 'point',
        text: 'any three from (1 each, max 3):',
        children: [
          point('same functional group'),
          point('same general formula'),
          point('each member differs from the next by a –CH2– unit'),
          point('similar chemical properties'),
        ],
      },
      point('max 3'),
    ]);
  });

  it('keeps the worked solution verbatim, including "(a)" paragraph labels and numbered lists', () => {
    const q = structured(topic, 4);
    expect(q.workedSolution).toBe(
      '(a) Respiration releases energy for the cell, so it is exothermic.\n' +
        '(b) Members of a homologous series share:\n' +
        '1. the same functional group\n' +
        '2. the same general formula\n' +
        '3. a gradual trend in physical properties',
    );
    expect(q.markScheme).toHaveLength(2);
  });

  it('a bare bold head followed by roman sub-heads yields keys a, a.i, a.ii (T03 Q7)', () => {
    const q = structured(topic, 5);
    expect(q.markScheme.map((p) => [p.key, p.marks, p.points.length])).toEqual([
      ['a', null, 0],
      ['a.i', 1, 1],
      ['a.ii', 1, 1],
      ['b', 2, 3],
    ]);
    expect(q.markScheme[1].points[0]).toEqual(point('NaOH (1)'));
    expect(q.markScheme[3].points[2]).toEqual(point('ALLOW: 2Na(s) + 2H2O(l) → 2NaOH(aq) + H2(g)'));
    expect(q.markScheme[3].points[2].kind).toBe('allow');
  });

  it('"**(a)(i)**" heads give dotted keys', () => {
    const q = structured(topic, 6);
    expect(q.markScheme.map((p) => p.key)).toEqual(['a.i', 'a.ii', 'b']);
    expect(q.markScheme.map((p) => p.marks)).toEqual([1, 1, 2]);
  });

  it('plain text lines inside a part section become label points', () => {
    const q = structured(topic, 7);
    const a = q.markScheme[0];
    expect(a.points[0]).toEqual({ kind: 'point', text: 'Any three from:', children: [], isLabel: true });
    expect(a.points.slice(1).every((p) => p.isLabel === undefined)).toBe(true);
    const c = q.markScheme[3];
    expect(c.key).toBe('c');
    expect(c.points.map((p) => [p.isLabel ?? false, p.text])).toEqual([
      [true, 'Method, any one from:'],
      [false, 'Mr of Fe2O3 = (2 × 56) + (3 × 16) = 160 (1)'],
      [false, 'moles of Fe2O3 = 480 / 160 = 3 kmol (1)'],
      [true, 'Answer:'],
      [false, 'mass of Fe = 2 × 3 × 56 = 336 kg (1)'],
    ]);
    expect(q.markScheme.map((p) => p.key)).toEqual(['a', 'b.i', 'b.ii', 'c']);
  });
});

describe('classifyMarkPoint', () => {
  it('matches only the four keywords as whole words at the start', () => {
    expect(classifyMarkPoint('ALLOW: x')).toBe('allow');
    expect(classifyMarkPoint('ALLOW x')).toBe('allow');
    expect(classifyMarkPoint('REJECT: x')).toBe('reject');
    expect(classifyMarkPoint('IGNORE x')).toBe('ignore');
    expect(classifyMarkPoint('ECF from (b)')).toBe('ecf');
    expect(classifyMarkPoint('ECF: x')).toBe('ecf');
    expect(classifyMarkPoint('ALLOWED values')).toBe('point');
    expect(classifyMarkPoint('CH3COOH (1)')).toBe('point');
    expect(classifyMarkPoint('max 2')).toBe('point');
    expect(classifyMarkPoint('allow lower case is not the convention')).toBe('point');
  });
});

describe('parseMarkschemeFile (malformed blocks)', () => {
  const file = (...blocks: string[]) => `${MARKSCHEME_FRONTMATTER}\n${blocks.join('\n\n')}\n`;

  it('lists every malformed block in one error', () => {
    const text = file(
      '## Q1\nstray text before the first head\n\n**(a)** [1]\n- x (1)\n\n**Worked solution**\nw',
      '## Q2\n\n**(a)** [1]\n  - nested without a parent\n\n**Worked solution**\nw',
      '## Q3\n- answer: B\n- confidence: high\n\n**Rationale**\nr',
      '## Q4\n- answer: A\n\n**Rationale**\nfine',
    );
    let error: ContentError | undefined;
    try {
      parseMarkschemeFile(text);
    } catch (err) {
      error = err as ContentError;
    }
    expect(error).toBeInstanceOf(ContentError);
    expect(error?.details).toHaveLength(3);
    expect(error?.details[0]).toMatch(/^Q1 .*unexpected line before the first part head/);
    expect(error?.details[1]).toMatch(/^Q2 .*nested bullet without a parent/);
    expect(error?.details[2]).toMatch(/^Q3 .*unexpected line between "- answer:"/);
  });

  it('a structured entry without a worked solution parses with an empty workedSolution (validation rejects it)', () => {
    const parsed = parseMarkschemeFile(file('## Q1\n\n**(a)** [1]\n- x (1)'));
    const entry = parsed.entries.get(1);
    expect(entry?.kind).toBe('structured');
    expect(entry?.kind === 'structured' && entry.workedSolution).toBe('');
  });

  it('an MCQ entry without a rationale parses with an empty rationale (validation rejects it)', () => {
    const parsed = parseMarkschemeFile(file('## Q1\n- answer: E'));
    expect(parsed.entries.get(1)).toEqual({ kind: 'mcq', number: 1, answer: 'E', rationale: '' });
  });

  it('an empty **Worked solution** section on an MCQ counts as absent', () => {
    const parsed = parseMarkschemeFile(file('## Q1\n- answer: A\n\n**Rationale**\nr\n\n**Worked solution**\n\n'));
    expect(parsed.entries.get(1)).toEqual({ kind: 'mcq', number: 1, answer: 'A', rationale: 'r' });
  });
});
