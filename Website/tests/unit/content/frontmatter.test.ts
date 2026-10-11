import { describe, expect, it } from 'vitest';
import { ContentError, parseFrontmatter, splitQuestionBlocks } from '../../../src/content';
import { readFixture } from './helpers';

describe('parseFrontmatter', () => {
  it('reads simple and quoted values and returns the body with its line number', () => {
    const text = readFixture('good', 'T90_20260101_01', 'questions.md');
    const fm = parseFrontmatter(text);
    expect(fm.data).toEqual({
      batch_id: 'T90_20260101_01',
      syllabus: '0620 (2026-2028)',
      topic_id: '90',
      topic_name: 'Fixture topic, with punctuation & symbols',
      created: '2026-01-01',
      generator_model: 'fixture',
    });
    expect(fm.bodyLine).toBe(9);
    expect(fm.body.startsWith('\n## Q1\n')).toBe(true);
  });

  it('only reads batch_id from a mark scheme file', () => {
    const fm = parseFrontmatter(readFixture('good', 'T90_20260101_01', 'markscheme.md'));
    expect(fm.data).toEqual({ batch_id: 'T90_20260101_01' });
  });

  it('strips a UTF-8 BOM, CRLF line endings and trailing comments', () => {
    const fm = parseFrontmatter('﻿---\r\nbatch_id: T01_20260923_01   # the batch\r\ntopic_id: "1"\r\n---\r\n\r\n## Q1\r\n');
    expect(fm.data).toEqual({ batch_id: 'T01_20260923_01', topic_id: '1' });
    expect(fm.body).toBe('\n## Q1\n');
  });

  it('fails when the fences are missing', () => {
    expect(() => parseFrontmatter('## Q1\n')).toThrow(ContentError);
    expect(() => parseFrontmatter('---\nbatch_id: x\n## Q1\n')).toThrow(/closing/);
    expect(() => parseFrontmatter('---\nnot a key value line\n---\n')).toThrow(/not "key: value"/);
  });
});

describe('splitQuestionBlocks', () => {
  it('keys blocks by the heading number and keeps gaps in the numbering', () => {
    const blocks = splitQuestionBlocks('\n## Q1\nbody one\n\n## Q2\nbody two\n\n## Q4\nbody four\n\n', 9);
    expect(blocks.map((b) => b.number)).toEqual([1, 2, 4]);
    expect(blocks.map((b) => b.line)).toEqual([10, 13, 16]);
    expect(blocks[2].body).toBe('body four');
  });

  it('reads the fixture gap (Q1, Q2, Q4) from the real file layout', () => {
    const fm = parseFrontmatter(readFixture('good', 'T90_20260101_01', 'questions.md'));
    const blocks = splitQuestionBlocks(fm.body, fm.bodyLine);
    expect(blocks.map((b) => b.number)).toEqual([1, 2, 4, 5, 6, 7, 8, 9]);
    expect(blocks[0].line).toBe(10);
  });

  it('ignores headings that are not exactly "## Q<n>"', () => {
    const blocks = splitQuestionBlocks('## Q1\n### Q2\n## Question 3\n## Q 4\n#Q5\n');
    expect(blocks.map((b) => b.number)).toEqual([1]);
    expect(blocks[0].body).toBe('### Q2\n## Question 3\n## Q 4\n#Q5');
  });

  it('fails on duplicate numbers and on text before the first heading, listing all problems', () => {
    let error: ContentError | undefined;
    try {
      splitQuestionBlocks('stray text\n## Q1\na\n## Q1\nb\n## Q2\nc\n## Q2\nd\n');
    } catch (err) {
      error = err as ContentError;
    }
    expect(error).toBeInstanceOf(ContentError);
    expect(error?.details).toHaveLength(3);
    expect(error?.details[0]).toMatch(/text before the first/);
    expect(error?.details[1]).toMatch(/duplicate heading "## Q1" at lines 2 and 4/);
    expect(error?.details[2]).toMatch(/duplicate heading "## Q2"/);
  });
});
