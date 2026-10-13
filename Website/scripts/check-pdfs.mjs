#!/usr/bin/env node
/**
 * check-pdfs.mjs: the stale-PDF guard, run first by `npm run build`.
 *
 * Recomputes the hash of every input that affects the downloadable PDFs (see pdf-manifest.mjs) and
 * compares it with public/pdfs/manifest.json; also checks that all 24 PDFs exist and match the
 * manifest. Fails the build with "PDFs are out of date: run npm run pdfs and commit the PDFs." when
 * they do not. Plain Node, no Chromium, so it runs on the Cloudflare Pages build machine.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { STALE_MESSAGE, checkPdfs } from './pdf-manifest.mjs';

const websiteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const result = checkPdfs(websiteRoot);
if (result.ok) {
  console.log(`check-pdfs: OK, ${result.count} PDFs match their inputs`);
} else {
  console.error(STALE_MESSAGE);
  for (const problem of result.problems) console.error(`  - ${problem}`);
  process.exit(1);
}