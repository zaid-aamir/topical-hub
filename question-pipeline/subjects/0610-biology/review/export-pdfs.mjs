/** Export Biology topics 1-10 from approved source, without publishing them to the website.
 * Run: node question-pipeline/subjects/0610-biology/review/export-pdfs.mjs
 * Uses the website's existing marked and Playwright dependencies. No source files are changed.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const review = path.dirname(fileURLToPath(import.meta.url));
const subject = path.dirname(review);
const repo = path.resolve(subject, '../../..');
const require = createRequire(path.join(repo, 'Website/package.json'));
const { chromium } = require('@playwright/test');
const { Marked } = await import(pathToFileURL(require.resolve('marked')).href);
const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const md = new Marked({ gfm: true, breaks: true, renderer: { html: ({ text }) => esc(text) } });
const out = path.join(review, 'pdfs');
const config = fs.readFileSync(path.join(repo, 'Website/src/config.ts'), 'utf8');
const origin = config.match(/export const SITE_URL\s*=\s*['"]([^'"]+)/)?.[1];
if (!origin) throw new Error('SITE_URL missing');
const host = new URL(origin).host;

function blocks(text) {
  return [...text.matchAll(/^## Q(\d+)\s*\r?\n([\s\S]*?)(?=^## Q\d+\s*$|(?![\s\S]))/gm)]
    .map((m) => ({ number: Number(m[1]), text: m[2].trim() }));
}
function digest(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

const css = `
@page { size: A4; margin: 18mm; }
* { box-sizing: border-box; }
html { background:white; color:#111; font-family:Arial,Helvetica,sans-serif; font-size:10.5pt; line-height:1.45; }
body { margin:0; }
h1 { font-family:Georgia,serif; font-size:23pt; line-height:1.15; margin:3mm 0; }
h2 { font-size:13pt; margin:0 0 2mm; }
p { margin:2mm 0; }
.label,.meta,.notice { color:#555; font-size:9pt; }
.intro { border-bottom:1px solid #bbb; padding-bottom:4mm; margin-bottom:5mm; }
.question { margin:0 0 6mm; break-inside:avoid; }
.structured { break-inside:auto; }
.question h2 { break-after:avoid; }
table { border-collapse:collapse; width:100%; margin:3mm 0; font-size:10pt; }
th,td { border:1px solid #aaa; padding:2mm; text-align:left; overflow-wrap:anywhere; }
tr { break-inside:avoid; }
.option { margin:1mm 0; }
.part { break-inside:avoid; }
.ruled { height:7mm; border-bottom:1px solid #ddd; }
.watermark { position:fixed; left:50%; top:50%; transform:translate(-50%,-50%) rotate(-30deg); z-index:-1; opacity:.10; text-align:center; white-space:nowrap; pointer-events:none; }
.watermark strong { display:block; font-size:64pt; }
.watermark span { font-size:20pt; }
ul { padding-left:6mm; }
`;

function renderQuestion(q, answer) {
  const [meta, body] = q.text.split('**Question**');
  if (body === undefined) throw new Error(`Missing question label: Q${q.number}`);
  const id = meta.match(/^- id:\s*(.+)$/m)?.[1];
  const tier = meta.match(/^- tier:\s*(.+)$/m)?.[1];
  const marks = meta.match(/^- marks:\s*(\d+)/m)?.[1];
  const structured = /^- type:\s*structured$/m.test(meta);
  const text = answer ? answer.text.replace(/^- answer:\s*([A-D])/m, '**Answer: $1**') : body.trim();
  let html;
  if (!answer && structured) {
    const parts = text.split(/(?=^\([a-z]\)\s)/m);
    html = parts.map((part) => {
      const score = part.match(/\[(\d+)\]\s*$/)?.[1];
      return `<div class="part">${md.parse(part)}${score ? '<div class="ruled"></div>'.repeat(Math.max(3, Number(score) + 1)) : ''}</div>`;
    }).join('');
  } else if (!answer) {
    html = md.parse(text.replace(/^([A-D]) (.+)$/gm, (_, l, v) => `\n**${l}** ${v}\n`));
  } else html = md.parse(text);
  return `<article class="question ${structured ? 'structured' : ''}"><h2>Question ${q.number}</h2><p class="meta">${esc(tier)} · ${esc(marks)} mark${marks === '1' ? '' : 's'} · ${esc(id)}</p>${html}</article>`;
}

fs.mkdirSync(out, { recursive: true });
const entries = [];
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  for (let topic = 1; topic <= 10; topic++) {
    const prefix = `0610_T${String(topic).padStart(2, '0')}_P1_`;
    const folders = fs.readdirSync(path.join(subject, 'batches/04_approved')).filter((n) => n.startsWith(prefix));
    if (folders.length !== 1) throw new Error(`Expected one approved batch for topic ${topic}`);
    const dir = path.join(subject, 'batches/04_approved', folders[0]);
    const qPath = path.join(dir, 'questions.md');
    const msPath = path.join(dir, 'markscheme.md');
    const source = fs.readFileSync(qPath, 'utf8');
    const name = source.match(/^topic_name:\s*"?([^"\r\n]+)"?\s*$/m)?.[1];
    if (!name) throw new Error('Missing topic name');
    const questions = blocks(source);
    const answers = new Map(blocks(fs.readFileSync(msPath, 'utf8')).map((a) => [a.number, a]));
    if (!questions.length || questions.length !== answers.size || questions.some((q) => !answers.has(q.number))) throw new Error(`Question/answer headings do not match: ${folders[0]}`);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    for (const kind of ['questions', 'mark-scheme']) {
      const filename = `topical-hub-igcse-biology-0610-${slug}-${kind}.pdf`;
      const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(name)} - ${kind}</title><style>${css}</style></head><body><div class="watermark" aria-hidden="true"><strong>Topical Hub</strong><span>${esc(host)}</span></div><header class="intro"><p class="label">Topical Hub · IGCSE Biology 0610 · syllabus for exams in 2026–2028</p><h1>${esc(name)}</h1><p>${kind === 'questions' ? 'Original exam-style questions' : 'Mark scheme and worked solutions'} · ${questions.length} questions</p><p class="notice">Review export of the existing pipeline-approved batch. Final owner review pending.</p><p class="notice">Original questions written and checked with AI tools. Report anything that looks wrong. Topical Hub is independent and is not affiliated with or endorsed by Cambridge University Press &amp; Assessment.</p></header>${questions.map((q) => renderQuestion(q, kind === 'mark-scheme' ? answers.get(q.number) : null)).join('')}</body></html>`;
      await page.setContent(html, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const file = path.join(out, filename);
      await page.pdf({ path: file, format: 'A4', printBackground: true, displayHeaderFooter: true, margin: { top:'18mm', right:'18mm', bottom:'18mm', left:'18mm' }, headerTemplate:'<span></span>', footerTemplate:'<div style="font-family:Arial;font-size:8pt;color:#555;width:100%;text-align:center">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>' });
      entries.push({ topic, name, batch: folders[0], kind, file: filename, questions: questions.length, bytes: fs.statSync(file).size, sha256: digest(file), questionSourceSha256: digest(qPath), markschemeSourceSha256: digest(msPath) });
    }
    console.log(`Biology topic ${topic}: ${questions.length} questions, two PDFs`);
  }
} finally { await browser.close(); }
const totalBytes = entries.reduce((n, p) => n + p.bytes, 0);
fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify({ note:'Review exports only; not published to the website. Existing pipeline approval is not a fresh Codex verification.', siteUrl: origin, exporterSha256:digest(fileURLToPath(import.meta.url)), totalBytes, pdfs: entries }, null, 2) + '\n');
console.log(`${entries.length} PDFs, ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
