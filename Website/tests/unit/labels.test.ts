import { describe, expect, it } from 'vitest';
import { tierLabel, tierTitle } from '../../src/components/question/labels';
import { CAMBRIDGE_TIERS, EDEXCEL_TIERS, SUBJECTS } from '../../src/config';

describe('tier labels', () => {
  it('shows Cambridge tiers, not content labels', () => {
    expect(tierLabel('core', CAMBRIDGE_TIERS)).toBe('Core');
    expect(tierLabel('supplement', CAMBRIDGE_TIERS)).toBe('Extended');
    expect(tierTitle('supplement', CAMBRIDGE_TIERS)).toBe('Supplement content: Extended tier only');
    expect(tierTitle('core', CAMBRIDGE_TIERS)).toBeUndefined();
    expect(CAMBRIDGE_TIERS.filters.map((f) => f.label)).toEqual(['Extended', 'Core', 'Extended content only']);
  });

  it('shows Edexcel papers and never Core / Extended', () => {
    expect(tierLabel('core', EDEXCEL_TIERS)).toBe('Paper 1 & 2');
    expect(tierLabel('supplement', EDEXCEL_TIERS)).toBe('Paper 2 only');
    expect(tierTitle('supplement', EDEXCEL_TIERS)).toBe('Paper 2 only: bold content in the specification');
    expect(tierTitle('core', EDEXCEL_TIERS)).toBeUndefined();
    expect(EDEXCEL_TIERS.filters).toEqual([
      { value: 'all', label: 'All questions' },
      { value: 'core', label: 'Paper 1 content' },
    ]);
    const shown = [...Object.values(EDEXCEL_TIERS.badge), ...EDEXCEL_TIERS.filters.map((f) => f.label), EDEXCEL_TIERS.hint];
    for (const text of shown) expect(text).not.toMatch(/\b(Core|Extended|Supplement)\b/);
  });

  it('gives every subject the wording of its board, with the default "all" filter first', () => {
    for (const subject of SUBJECTS) {
      expect(subject.tiers).toBe(subject.board === 'edexcel' ? EDEXCEL_TIERS : CAMBRIDGE_TIERS);
      expect(subject.tiers.filters[0]?.value).toBe('all');
    }
  });
});
