#!/usr/bin/env node
/**
 * generate-pdfs.mjs: `npm run pdfs`. Makes the 24 downloadable PDFs (questions and mark scheme for
 * each topic) and public/pdfs/manifest.json.
 *
 *  1. Hashes the inputs (pdf-manifest.mjs), then runs `astro build` (not `npm run build`, whose
 *     stale-PDF guard would stop it).
 *  2. Serves dist/ on 127.0.0.1 with a tiny static server.
 *  3. Prints each topic's /print/ and /print-answers/ page with Playwright Chromium: A4, print
 *     backgrounds on, 18 mm margins (the same as @page in print.css), "Page X of Y" in the footer.
 *  4. Writes the PDFs and manifest.json to public/pdfs/ and removes PDFs no topic uses any more.
 *
 * Needs Chromium: `npx playwright install chromium` once. Commit public/pdfs/ afterwards.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import {
  MANIFEST_NAME,
  PDF_URL_DIR,
  SUBJECT_PATH,
  buildManifest,
  computeInputs,
  expectedPdfs,
  fileDigest,
  findContentDir,
  formatPdfSize,
  listTopics,
} from './pdf-manifest.mjs';

const websiteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(websiteRoot, 'dist');
const pdfDir = path.join(websiteRoot, 'public', PDF_URL_DIR);

const MARGIN = '18mm';
const FOOTER = `<div style="width:100%;padding:0 ${MARGIN};box-sizing:border-box;font-family:Arial,Helvetica,sans-serif;font-size:8pt;color:#555;text-align:center;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>`;

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
};

/**
 * Serve a directory on a free local port. "/x/" -> x/index.html.
 * @param {string} root
 * @returns {Promise<http.Server>}
 */
function serve(root) {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
    let file = path.resolve(root, `.${urlPath}`);
    if (!file.startsWith(path.resolve(root))) {
      res.writeHead(403).end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) {
      res.writeHead(404).end('Not found');
      return;
    }
    res.writeHead(200, { 'content-type': CONTENT_TYPES[path.extname(file)] ?? 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

async function main() {
  const contentDir = findContentDir(websiteRoot);
  const pdfs = expectedPdfs(listTopics(contentDir));
  const inputs = computeInputs(websiteRoot, contentDir);

  const astroBin = path.join(websiteRoot, 'node_modules', 'astro', 'bin', 'astro.mjs');
  const build = spawnSync(process.execPath, [astroBin, 'build'], { cwd: websiteRoot, stdio: 'inherit' });
  if (build.status !== 0) throw new Error('astro build failed');

  fs.mkdirSync(pdfDir, { recursive: true });
  const wanted = new Set(pdfs.map((p) => p.file));
  for (const name of fs.readdirSync(pdfDir)) {
    if (/^topical-hub-.*\.pdf$/.test(name) && !wanted.has(name)) fs.rmSync(path.join(pdfDir, name));
  }

  const server = await serve(distDir);
  const address = server.address();
  const base = `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}`;
  const browser = await chromium.launch();
  const written = [];
  try {
    const context = await browser.newContext({ colorScheme: 'light' });
    const page = await context.newPage();
    for (const pdf of pdfs) {
      const url = `${base}/${SUBJECT_PATH}/${pdf.slug}/${pdf.page}/`;
      const response = await page.goto(url, { waitUntil: 'networkidle' });
      if (!response || response.status() !== 200) throw new Error(`${url} returned ${response?.status()}`);
      await page.evaluate(() => document.fonts.ready);
      const file = path.join(pdfDir, pdf.file);
      await page.pdf({
        path: file,
        format: 'A4',
        printBackground: true,
        margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
        displayHeaderFooter: true,
        headerTemplate: '<span></span>',
        footerTemplate: FOOTER,
      });
      written.push({ file: pdf.file, batch: pdf.batch, slug: pdf.slug, kind: pdf.kind, ...fileDigest(file) });
    }
  } finally {
    await browser.close();
    server.close();
  }

  const after = computeInputs(websiteRoot, contentDir);
  if (after.hash !== inputs.hash) throw new Error('Inputs changed while the PDFs were being made. Run npm run pdfs again.');

  const manifest = buildManifest(inputs, written);
  fs.writeFileSync(path.join(pdfDir, MANIFEST_NAME), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`pdfs: ${written.length} PDFs, ${formatPdfSize(manifest.totalBytes)} in total, written to public/${PDF_URL_DIR}/`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});