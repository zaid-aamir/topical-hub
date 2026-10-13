/**
 * pdf-manifest.mjs: PDF file names, size labels, the input hash and the stale-PDF guard, against a
 * small fake site and content folder in a temp directory.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  buildManifest,
  checkPdfs,
  computeInputs,
  expectedPdfs,
  fileDigest,
  formatPdfSize,
  listTopics,
  pdfFileName,
} from '../../scripts/pdf-manifest.mjs';

let root = '';
let web = '';
let content = '';
let pdfDir = '';

function write(file: string, text: string): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text, 'utf8');
}

function options() {
  return { contentDir: content, pdfDir, websiteFiles: ['src/styles/print.css'], websiteDirs: [] as string[] };
}

/** What `npm run pdfs` leaves behind: one fake PDF per topic and kind, and the manifest. */
function generate(): void {
  const inputs = computeInputs(web, content, options());
  const pdfs = expectedPdfs(listTopics(content)).map((pdf) => {
    const file = path.join(pdfDir, pdf.file);
    write(file, `%PDF-1.7 fake ${pdf.slug} ${pdf.kind}`);
    return { file: pdf.file, batch: pdf.batch, slug: pdf.slug, kind: pdf.kind, ...fileDigest(file) };
  });
  write(path.join(pdfDir, 'manifest.json'), JSON.stringify(buildManifest(inputs, pdfs)));
}

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'topical-hub-pdfs-'));
  web = path.join(root, 'Website');
  content = path.join(root, 'content');
  pdfDir = path.join(web, 'public', 'pdfs');
  write(path.join(web, 'src', 'config.ts'), "export const SITE_URL = 'https://example.test';\nexport const CHEM_FORMATTING = true;\n");
  write(path.join(web, 'src', 'styles', 'print.css'), '.question { color: #000; }\n');
  write(
    path.join(content, 'T07_20260101_01', 'questions.md'),
    '---\nbatch_id: T07_20260101_01\ntopic_name: "Acids, bases and salts"\n---\n\n## Q1\n',
  );
  write(path.join(content, 'T07_20260101_01', 'markscheme.md'), '---\nbatch_id: T07_20260101_01\n---\n\n## Q1\n- answer: A\n');
});

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

describe('PDF names and sizes', () => {
  it('names the two PDFs of a topic', () => {
    expect(pdfFileName('electrochemistry', 'questions')).toBe('topical-hub-igcse-chemistry-0620-electrochemistry-questions.pdf');
    expect(pdfFileName('electrochemistry', 'mark-scheme')).toBe('topical-hub-igcse-chemistry-0620-electrochemistry-mark-scheme.pdf');
    expect(expectedPdfs(listTopics(content)).map((p) => p.file)).toEqual([
      'topical-hub-igcse-chemistry-0620-acids-bases-and-salts-questions.pdf',
      'topical-hub-igcse-chemistry-0620-acids-bases-and-salts-mark-scheme.pdf',
    ]);
  });

  it('formats sizes in KB and MB', () => {
    expect(formatPdfSize(420 * 1024)).toBe('420 KB');
    expect(formatPdfSize(100)).toBe('1 KB');
    expect(formatPdfSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
  });
});

describe('computeInputs', () => {
  it('gives the same hash for CRLF and LF files', () => {
    const lf = computeInputs(web, content, options()).hash;
    const file = path.join(content, 'T07_20260101_01', 'questions.md');
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace(/\n/g, '\r\n'));
    expect(computeInputs(web, content, options()).hash).toBe(lf);
  });

  it('changes when content, a website input or SITE_URL changes', () => {
    const start = computeInputs(web, content, options()).hash;
    write(path.join(content, 'T07_20260101_01', 'markscheme.md'), '---\nbatch_id: T07_20260101_01\n---\n\n## Q1\n- answer: B\n');
    const afterContent = computeInputs(web, content, options()).hash;
    expect(afterContent).not.toBe(start);
    write(path.join(web, 'src', 'styles', 'print.css'), '.question { color: #111; }\n');
    const afterCss = computeInputs(web, content, options()).hash;
    expect(afterCss).not.toBe(afterContent);
    write(path.join(web, 'src', 'config.ts'), "export const SITE_URL = 'https://topicalhub.test';\nexport const CHEM_FORMATTING = true;\n");
    expect(computeInputs(web, content, options()).hash).not.toBe(afterCss);
  });

  it('fails loudly when a listed input is missing', () => {
    expect(() => computeInputs(web, content, { websiteFiles: ['src/components/Nope.astro'], websiteDirs: [] })).toThrow(/Missing PDF input/);
  });
});

describe('checkPdfs', () => {
  it('passes when the PDFs match their inputs', () => {
    generate();
    expect(checkPdfs(web, options())).toEqual({ ok: true, problems: [], count: 2 });
  });

  it('fails when there is no manifest', () => {
    const result = checkPdfs(web, options());
    expect(result.ok).toBe(false);
    expect(result.problems).toContain('public/pdfs/manifest.json is missing');
  });

  it('fails when a PDF is missing', () => {
    generate();
    fs.rmSync(path.join(pdfDir, pdfFileName('acids-bases-and-salts', 'mark-scheme')));
    const result = checkPdfs(web, options());
    expect(result.ok).toBe(false);
    expect(result.problems.join('\n')).toMatch(/mark-scheme\.pdf is missing/);
  });

  it('fails and names the input when an input changed', () => {
    generate();
    write(path.join(content, 'T07_20260101_01', 'questions.md'), '---\ntopic_name: "Acids, bases and salts"\n---\n\n## Q1\nEdited.\n');
    const result = checkPdfs(web, options());
    expect(result.ok).toBe(false);
    expect(result.problems.join('\n')).toMatch(/inputs changed .*T07_20260101_01\/questions\.md/);
  });

  it('fails when a PDF no longer matches the manifest', () => {
    generate();
    write(path.join(pdfDir, pdfFileName('acids-bases-and-salts', 'questions')), '%PDF-1.7 something else');
    const result = checkPdfs(web, options());
    expect(result.ok).toBe(false);
    expect(result.problems.join('\n')).toMatch(/questions\.pdf does not match manifest\.json/);
  });
});