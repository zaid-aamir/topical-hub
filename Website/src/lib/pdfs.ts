/**
 * "Download (PDF)" links for the topic PDFs. File names come from scripts/pdf-manifest.mjs, which the
 * generator and the stale-PDF guard share; sizes come from public/pdfs/manifest.json at build time.
 * Before the first `npm run pdfs` there is no manifest, and the link text has no size.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { MANIFEST_NAME, PDF_URL_DIR, formatPdfSize, pdfFileName } from '../../scripts/pdf-manifest.mjs';

export type PdfKind = 'questions' | 'mark-scheme';

export interface PdfDownload {
  /** Root-relative URL, e.g. /pdfs/topical-hub-igcse-chemistry-0620-metals-questions.pdf */
  href: string;
  /** Link text, e.g. "Download questions (PDF, 420 KB)" */
  text: string;
}

let sizes: Map<string, number> | undefined;

/** File name -> size in bytes, from the manifest; read once per build. */
function manifestSizes(): Map<string, number> {
  if (sizes) return sizes;
  sizes = new Map();
  // Astro builds with the current directory at Website/ (npm scripts, the Cloudflare root
  // directory); the second candidate covers a build started from the repository root.
  for (const dir of [resolve('public', PDF_URL_DIR), resolve('Website', 'public', PDF_URL_DIR)]) {
    const file = join(dir, MANIFEST_NAME);
    if (!existsSync(file)) continue;
    const manifest = JSON.parse(readFileSync(file, 'utf8')) as { pdfs?: { file: string; bytes: number }[] };
    for (const pdf of manifest.pdfs ?? []) sizes.set(pdf.file, pdf.bytes);
    break;
  }
  return sizes;
}

export function pdfDownload(slug: string, kind: PdfKind, subjectPath: string): PdfDownload {
  const file = pdfFileName(slug, kind, subjectPath);
  const bytes = manifestSizes().get(file);
  const what = kind === 'questions' ? 'questions' : 'mark scheme';
  const size = bytes === undefined ? '' : `, ${formatPdfSize(bytes)}`;
  return { href: `/${PDF_URL_DIR}/${file}`, text: `Download ${what} (PDF${size})` };
}