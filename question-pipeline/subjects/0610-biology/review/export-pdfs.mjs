/** Export all 21 owner-approved Biology topics for website preparation.
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

const plan = JSON.parse(fs.readFileSync(path.join(subject, 'config/batch_plan.json'), 'utf8')).batches;
const stageLabels = { '04_approved':'Approved for publication by the owner' };

// Resolve exactly one approved batch per planned key. Exporting never changes approval status
// or publishes files to Website/public.
function loadBatch(item) {
  const prefix = `0610_${item.key}_`;
  const matches = [];
  for (const stage of Object.keys(stageLabels)) {
    const root = path.join(subject, 'batches', stage);
    if (!fs.existsSync(root)) continue;
    for (const batch of fs.readdirSync(root).filter((name) => name.startsWith(prefix))) matches.push({ stage, batch, dir:path.join(root,batch) });
  }
  if (matches.length !== 1) throw new Error(`Expected exactly one batch for ${item.key}; found ${matches.length}`);
  const result = matches[0];
  const qPath = path.join(result.dir, 'questions.md');
  const msPath = path.join(result.dir, 'markscheme.md');
  const source = fs.readFileSync(qPath, 'utf8');
  const name = source.match(/^topic_name:\s*"?([^"\r\n]+)"?\s*$/m)?.[1];
  if (name !== item.topic_name) throw new Error(`Unexpected topic name in ${result.batch}`);
  const questions = blocks(source);
  const scheme = blocks(fs.readFileSync(msPath, 'utf8'));
  const answers = new Map(scheme.map((a) => [a.number, a]));
  if (questions.length !== item.questions || new Set(questions.map((q) => q.number)).size !== questions.length || answers.size !== scheme.length || questions.length !== answers.size || questions.some((q) => !answers.has(q.number))) throw new Error(`Question/answer headings or count do not match plan: ${result.batch}`);
  return { ...result, part:item.part, questions, answers, provenance:{ batch:result.batch, stage:result.stage, questionSourceSha256:digest(qPath), markschemeSourceSha256:digest(msPath) } };
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

function renderQuestion(q, answer, part, multipart) {
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
  return `<article class="question ${structured ? 'structured' : ''}"><h2>${multipart ? `Part ${part} · ` : ''}Question ${q.number}</h2><p class="meta">${esc(tier)} · ${esc(marks)} mark${marks === '1' ? '' : 's'} · ${esc(id)}</p>${html}</article>`;
}

fs.mkdirSync(out, { recursive: true });
const entries = [];
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const topicIds = [...new Set(plan.map((item) => Number(item.topic_id)))].sort((a,b) => a-b);
  for (const topic of topicIds) {
    const planned = plan.filter((item) => Number(item.topic_id) === topic).sort((a,b) => a.part-b.part);
    const batches = planned.map(loadBatch);
    const name = planned[0].topic_name;
    const questionCount = batches.reduce((n,b) => n+b.questions.length,0);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    for (const kind of ['questions', 'mark-scheme']) {
      const filename = `topical-hub-igcse-biology-0610-${slug}-${kind}.pdf`;
      const body = batches.map((b) => `${batches.length > 1 ? `<h2>Part ${b.part}</h2><p class="notice">${esc(b.batch)}</p>` : ''}${b.questions.map((q) => renderQuestion(q,kind === 'mark-scheme' ? b.answers.get(q.number) : null,b.part,batches.length>1)).join('')}`).join('');
      const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(name)} - ${kind}</title><style>${css}</style></head><body><div class="watermark" aria-hidden="true"><strong>Topical Hub</strong><span>${esc(host)}</span></div><header class="intro"><p class="label">Topical Hub · IGCSE Biology 0610 · syllabus for exams in 2026–2028</p><h1>${esc(name)}</h1><p>${kind === 'questions' ? 'Original exam-style questions' : 'Mark scheme and worked solutions'} · ${questionCount} questions</p><p class="notice">Original questions written with AI tools. Report anything that looks wrong. Topical Hub is independent and is not affiliated with or endorsed by Cambridge University Press &amp; Assessment.</p></header>${body}</body></html>`;
      await page.setContent(html, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const file = path.join(out, filename);
      await page.pdf({ path: file, format: 'A4', printBackground: true, displayHeaderFooter: true, margin: { top:'18mm', right:'18mm', bottom:'18mm', left:'18mm' }, headerTemplate:'<span></span>', footerTemplate:'<div style="font-family:Arial;font-size:8pt;color:#555;width:100%;text-align:center">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>' });
      entries.push({ topic, name, sources:batches.map((b) => b.provenance), kind, file: filename, questions: questionCount, bytes: fs.statSync(file).size, sha256: digest(file) });
    }
    console.log(`Biology topic ${topic}: ${questionCount} questions, two PDFs`);
  }
} finally { await browser.close(); }
const totalBytes = entries.reduce((n, p) => n + p.bytes, 0);
fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify({ note:'All 590 questions approved for publication by the owner on 2026-10-18; see ../owner-approval.json. No new independent AI verification claimed. Website integration is separate.', siteUrl: origin, exporterSha256:digest(fileURLToPath(import.meta.url)), totalBytes, pdfs: entries }, null, 2) + '\n');
console.log(`${entries.length} PDFs, ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
