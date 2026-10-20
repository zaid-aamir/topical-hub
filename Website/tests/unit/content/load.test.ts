import { basename, sep } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { ContentError, listBatchDirs, loadTopicsFromDir, resolveContentDir, summaryLine } from '../../../src/content';
import { CHEMISTRY_0620, PHYSICS_0625 } from '../../../src/config';
import { fixturePath } from './helpers';

const originalEnv = process.env.CONTENT_DIR;

afterEach(() => {
  if (originalEnv === undefined) delete process.env.CONTENT_DIR;
  else process.env.CONTENT_DIR = originalEnv;
});

describe('resolveContentDir', () => {
  it('finds the real content directory by walking up from Website/', () => {
    delete process.env.CONTENT_DIR;
    const dir = resolveContentDir(CHEMISTRY_0620);
    expect(dir.split(sep).join('/')).toMatch(new RegExp(`/${CHEMISTRY_0620.contentSubpath}$`));
  });

  it('prefers CONTENT_DIR when it is set', () => {
    process.env.CONTENT_DIR = fixturePath('good');
    expect(resolveContentDir(CHEMISTRY_0620)).toBe(fixturePath('good'));
  });

  it('reads each subject from its own folder and its own variable', () => {
    process.env.CONTENT_DIR = fixturePath('good');
    expect(resolveContentDir(PHYSICS_0625).split(sep).join('/')).toMatch(new RegExp(`/${PHYSICS_0625.contentSubpath}$`));
  });

  it('fails clearly when CONTENT_DIR is not a directory', () => {
    process.env.CONTENT_DIR = fixturePath('good', 'nowhere');
    expect(() => resolveContentDir(CHEMISTRY_0620)).toThrow(ContentError);
    expect(() => resolveContentDir(CHEMISTRY_0620)).toThrow(/CONTENT_DIR is set but is not a directory/);
  });
});

describe('listBatchDirs', () => {
  it('returns only directories named T<NN>_..., sorted, ignoring files and other folders', () => {
    const dirs = listBatchDirs(fixturePath('good')).map((d) => basename(d));
    expect(dirs).toEqual(['T90_20260101_01']);
  });

  it('matches only the given batch prefix', () => {
    expect(listBatchDirs(fixturePath('good'), '0625_')).toEqual([]);
  });
});

describe('loadTopicsFromDir', () => {
  it('loads, merges and validates a fixture directory', () => {
    const topics = loadTopicsFromDir(fixturePath('good'));
    expect(topics).toHaveLength(1);
    expect(topics[0].batchId).toBe('T90_20260101_01');
    expect(topics[0].questions).toHaveLength(8);
    expect(summaryLine(topics)).toBe('Content OK: 1 topics, 8 questions (4 MCQ, 4 structured)');
  });

  it('fails when a batch folder is missing markscheme.md', () => {
    let error: ContentError | undefined;
    try {
      loadTopicsFromDir(fixturePath('missing-file'));
    } catch (err) {
      error = err as ContentError;
    }
    expect(error).toBeInstanceOf(ContentError);
    expect(error?.details).toEqual(['T92_20260101_01: missing markscheme.md']);
  });

  it('fails validation for the invalid fixture batch with every problem listed', () => {
    let error: ContentError | undefined;
    try {
      loadTopicsFromDir(fixturePath('invalid'), { warn: () => {} });
    } catch (err) {
      error = err as ContentError;
    }
    expect(error).toBeInstanceOf(ContentError);
    expect(error?.message).toMatch(/^Content validation failed: 17 problem\(s\)/);
    expect(error?.details).toHaveLength(17);
  });
});
