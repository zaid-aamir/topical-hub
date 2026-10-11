import { describe, expect, it } from 'vitest';
import { slugify } from '../../../src/content';

describe('slugify', () => {
  it('lower-cases, keeps letters and digits, collapses everything else to one hyphen', () => {
    expect(slugify('Acids, bases and salts')).toBe('acids-bases-and-salts');
    expect(slugify('  Hydrogen–oxygen fuel cells ')).toBe('hydrogen-oxygen-fuel-cells');
    expect(slugify('Fixture topic, with punctuation & symbols')).toBe('fixture-topic-with-punctuation-symbols');
    expect(slugify('Group VII properties!!')).toBe('group-vii-properties');
    expect(slugify('0620 (2026-2028)')).toBe('0620-2026-2028');
    expect(slugify('---')).toBe('');
    expect(slugify('')).toBe('');
  });

  it('maps the 12 topic names to the expected URL slugs', () => {
    const table: Array<[string, string]> = [
      ['States of matter', 'states-of-matter'],
      ['Atoms, elements and compounds', 'atoms-elements-and-compounds'],
      ['Stoichiometry', 'stoichiometry'],
      ['Electrochemistry', 'electrochemistry'],
      ['Chemical energetics', 'chemical-energetics'],
      ['Chemical reactions', 'chemical-reactions'],
      ['Acids, bases and salts', 'acids-bases-and-salts'],
      ['The Periodic Table', 'the-periodic-table'],
      ['Metals', 'metals'],
      ['Chemistry of the environment', 'chemistry-of-the-environment'],
      ['Organic chemistry', 'organic-chemistry'],
      ['Experimental techniques and chemical analysis', 'experimental-techniques-and-chemical-analysis'],
    ];
    for (const [name, slug] of table) expect(slugify(name)).toBe(slug);
    expect(new Set(table.map(([, slug]) => slug)).size).toBe(12);
  });
});
