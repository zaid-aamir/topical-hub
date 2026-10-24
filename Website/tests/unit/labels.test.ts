import { describe, expect, it } from 'vitest';
import { tierLabel, tierTitle } from '../../src/components/question/labels';

describe('tier labels', () => {
  it('shows Cambridge tiers, not content labels', () => {
    expect(tierLabel('core')).toBe('Core');
    expect(tierLabel('supplement')).toBe('Extended');
  });

  it('explains the Extended badge and leaves Core plain', () => {
    expect(tierTitle('supplement')).toBe('Supplement content: Extended tier only');
    expect(tierTitle('core')).toBeUndefined();
  });
});
