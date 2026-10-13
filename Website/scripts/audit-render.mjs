#!/usr/bin/env node
/**
 * audit-render.mjs: the deterministic half of the per-topic render audit (BUILD_V1 §9.3).
 *
 * Usage:  node scripts/audit-render.mjs [--topic T04|4|electrochemistry] [--json] [--dist <dir>]
 *
 * For every topic it reads the SOURCE (questions.md and markscheme.md in the content folder,
 * found via env CONTENT_DIR or by walking up from the current directory and from this script to
 * igcse-chem-pipeline/pipeline/04_approved), splits the files into `## Q<n>` blocks, drops the
 * metadata run and the labels (**Question**, **Rationale**, **Worked solution**, `- answer: X`),
 * and tokenises what is left into words. It then reads the BUILT pages
 *   dist/igcse/chemistry-0620/<slug>/index.html           (question + mark scheme, the answer panel is in the HTML even when hidden)
 *   dist/igcse/chemistry-0620/<slug>/print/index.html     (question text only)
 *   dist/igcse/chemistry-0620/<slug>/print-answers/index.html (mark scheme text only)
 * locates each question's element by id="q<n>" (an <article> on the topic page), strips tags,
 * decodes entities, maps the display-only chemistry formatting back to plain text (H₂SO₄ -> H2SO4,
 * cm³ -> cm3, Cu²⁺ -> Cu2+), tokenises the same way and reports, per question id:
 *   - source words missing from the page text
 *   - for MCQs, whether the answer letter is in the page (a data-answer attribute, or the text
 *     "answer is X" / "answer: X") and whether it matches the source
 *   - option count, table-shaped options rendered as a table, .ms-part / .ms-point counts and the
 *     worked solution, all compared with the source
 *   - whether the element exists at all
 *
 * It is a report, not a gate: the exit code is 0 unless a topic page or a question's article is
 * missing entirely (exit 1), or the content folder cannot be found (exit 2).
 *
 * Known benign misses and how the normaliser deals with them:
 *   - Markdown table alignment rows (|---|---|), bullet markers, emphasis asterisks, backticks and
 *     brackets are punctuation and produce no tokens.
 *   - Mark annotations "(1)", "[2]", part labels "(a)", "(b)(i)" and option letters are single
 *     characters and are dropped by the length >= 2 rule. Option letters A-D are kept separately
 *     (from option lines in the source, from the text and data-letter attributes in the page).
 *   - Decimal numbers stay whole ("25.0", "0.5") because a dot between digits is kept.
 *   - Chemistry formatting: the site renders "SO4 2−" as SO₄²⁻, so after mapping back the page has
 *     "so42" where the source has "so4" and "2". A source token that contains a digit is therefore
 *     also accepted when it appears as a substring of the element's letters-and-digits text.
 *   - Words joined by en dashes or slashes ("metal–acid", "lead / Pb") split into separate tokens
 *     on both sides.
 *   - Soft hyphens and zero-width characters are removed before tokenising.
 *   - If a page renders a Markdown link, only its text survives tag stripping, so the URL words in
 *     the source would be reported missing. The content has no links today.
 *   - A word the page shows only through CSS (::before content) or an image would be reported
 *     missing. The content has no images.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SUBJECT_PATH = 'igcse/chemistry-0620';
const BATCH_DIR_RE = /^T\d{2}_/;
const HEADING_RE = /^## Q(\d+)\s*$/gm;
const META_LINE_RE = /^- ([a-z_]+):\s*(.*)$/;
const LABEL_LINE_RE = /^\*\*(Question|Rationale|Worked solution)\*\*\s*$/;
const ANSWER_LINE_RE = /^- answer:\s*([A-D])\s*$/;
const PLAIN_OPTION_RE = /^([A-D])\s+\S/;
const TABLE_OPTION_RE = /^\|\s*([A-D])\s*\|/;
const MS_HEAD_RE = /^\*\*\([a-z]+\)\*\*(?:\s*\*\*\([ivx]+\)\*\*)?|^\*\*\([ivx]+\)\*\*/;
const INVISIBLE_RE = /[­​‌‍﻿]/g;

// ---- Chemistry display formatting -> plain text --------------------------------------------------------
const SUB_DIGITS = '₀₁₂₃₄₅₆₇₈₉';
const SUP_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
/** @type {Map<string, string>} */
const CHEM_MAP = new Map();
for (let i = 0; i < 10; i += 1) {
  CHEM_MAP.set(SUB_DIGITS[i], String(i));
  CHEM_MAP.set(SUP_DIGITS[i], String(i));
}
CHEM_MAP.set('⁺', '+'); // superscript plus
CHEM_MAP.set('⁻', '-'); // superscript minus
CHEM_MAP.set('₊', '+'); // subscript plus
CHEM_MAP.set('₋', '-'); // subscript minus
const CHEM_RE = /[₀-₉⁰¹²³⁴-⁹⁺⁻₊₋]/g;

/** Map Unicode sub/superscript digits and signs back to ASCII. Applied to BOTH sides. */
export function normaliseChem(text) {
  return text.replace(CHEM_RE, (ch) => CHEM_MAP.get(ch) ?? ch);
}

// ---- Tokenising ----------------------------------------------------------------------------------------
/**
 * Lower-case words of letters/digits (a dot between digits is kept), length >= 2.
 * @param {string} text
 * @returns {Set<string>}
 */
export function tokenise(text) {
  const norm = normaliseChem(text.normalize('NFC')).replace(INVISIBLE_RE, '').toLowerCase();
  const out = new Set();
  for (const raw of norm.split(/[^\p{L}\p{N}.]+/u)) {
    const t = raw.replace(/^\.+|\.+$/g, '');
    if (t.length >= 2) out.add(t);
  }
  return out;
}

/** The letters-and-digits of a text with everything else removed, for the digit-token fallback. */
export function squash(text) {
  return normaliseChem(text.normalize('NFC'))
    .replace(INVISIBLE_RE, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '');
}

/** Single letters A-D that appear as stand-alone words. */
function singleLetters(text) {
  const out = new Set();
  for (const m of text.matchAll(/(?<![\p{L}\p{N}])([A-Da-d])(?![\p{L}\p{N}])/gu)) out.add(m[1].toLowerCase());
  return out;
}

// ---- HTML -> text -------------------------------------------------------------------------------------
const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ensp: ' ', emsp: ' ', thinsp: ' ', hairsp: ' ', shy: '',
  ndash: '–', mdash: '—', minus: '−', times: '×', divide: '÷', deg: '°', rarr: '→',
  harr: '↔', hellip: '…', middot: '·', plusmn: '±', Delta: 'Δ', equiv: '≡', ge: '≥',
  le: '≤', micro: 'µ', frac12: '½', sup2: '²', sup3: '³', bull: '•',
};

/** @param {string} s */
export function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/gi, (whole, body) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X' ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : whole;
    }
    return NAMED_ENTITIES[body] ?? whole;
  });
}

/** Tag, tolerant of ">" inside quoted attribute values. */
const TAG_RE = /<\/?[a-zA-Z][^>"']*(?:(?:"[^"]*"|'[^']*')[^>"']*)*>/g;

/** Visible text of an HTML fragment (hidden elements included), whitespace collapsed. */
export function htmlToText(fragment) {
  const withoutCode = fragment
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ');
  return decodeEntities(withoutCode.replace(TAG_RE, ' ')).replace(/\s+/g, ' ').trim();
}

/** @param {string} s */
function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * The outer HTML of the element with the given id (same-name nesting is tracked).
 * @param {string} html
 * @param {string} id
 * @returns {{ tag: string, html: string } | null}
 */
export function extractElementById(html, id) {
  const open = new RegExp(`<([a-zA-Z][\\w-]*)\\b[^>]*\\sid=["']${escapeRe(id)}["'][^>]*>`, 'i');
  const m = open.exec(html);
  if (!m) return null;
  const tag = m[1].toLowerCase();
  const start = m.index;
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi');
  re.lastIndex = m.index + m[0].length;
  let depth = 1;
  let mm;
  while ((mm = re.exec(html))) {
    if (mm[1] === '/') {
      depth -= 1;
      if (depth === 0) return { tag, html: html.slice(start, mm.index + mm[0].length) };
    } else if (!mm[0].endsWith('/>')) {
      depth += 1;
    }
  }
  return { tag, html: html.slice(start) };
}

// ---- Source parsing -----------------------------------------------------------------------------------
/** CONTRACT.md rule: lower-case, letters and digits kept, every other run becomes one hyphen. */
export function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** @param {string} text */
export function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  /** @type {Record<string, string>} */
  const data = {};
  if (!m) return { data, body: text };
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
  }
  return { data, body: text.slice(m[0].length) };
}

/**
 * @param {string} body
 * @returns {Map<number, string>} question number -> block text (without the heading)
 */
export function splitBlocks(body) {
  const matches = [...body.matchAll(HEADING_RE)];
  const blocks = new Map();
  matches.forEach((m, i) => {
    const start = (m.index ?? 0) + m[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : body.length;
    blocks.set(Number(m[1]), body.slice(start, end));
  });
  return blocks;
}

/**
 * Drop the metadata run and the **Question** label; note the option letters.
 * @param {string} block
 */
export function stripQuestionBlock(block) {
  const lines = block.split(/\r?\n/);
  /** @type {Record<string, string>} */
  const meta = {};
  let i = 0;
  while (i < lines.length && lines[i].trim() === '') i += 1;
  for (; i < lines.length; i += 1) {
    const m = lines[i].match(META_LINE_RE);
    if (!m) break;
    meta[m[1]] = m[2].trim().replace(/^"(.*)"$/, '$1');
  }
  const rest = lines.slice(i).filter((l) => !LABEL_LINE_RE.test(l.trim()));
  const optionLetters = [];
  let optionsTable = false;
  let parts = 0;
  for (const l of rest) {
    const plain = l.match(PLAIN_OPTION_RE);
    const table = l.match(TABLE_OPTION_RE);
    if (plain) optionLetters.push(plain[1]);
    if (table) {
      optionLetters.push(table[1]);
      optionsTable = true;
    }
    if (/^\([a-z]\)/.test(l)) parts += 1;
  }
  return { meta, text: rest.join('\n'), optionLetters: [...new Set(optionLetters)], optionsTable, parts };
}

/**
 * Drop `- answer: X` and the labels; note the answer letter and the mark-scheme shape.
 * @param {string} block
 */
export function stripMarkschemeBlock(block) {
  const lines = block.split(/\r?\n/);
  const hasWorkedSolution = lines.some((l) => /^\*\*Worked solution\*\*\s*$/.test(l.trim()));
  let answer = null;
  let heads = 0;
  let headsWithMarks = 0;
  let points = 0;
  /** Which part of the block we are in: marking points / rationale, the rationale, or the worked solution. */
  let section = 'points';
  const kept = [];
  for (const l of lines) {
    const a = l.match(ANSWER_LINE_RE);
    if (a) {
      answer = a[1];
      continue;
    }
    const label = l.trim().match(LABEL_LINE_RE);
    if (label) {
      section = label[1] === 'Worked solution' ? 'worked' : label[1] === 'Rationale' ? 'rationale' : section;
      continue;
    }
    // The site shows an MCQ's worked solution INSTEAD of its rationale when both exist (BUILD_V1 §3),
    // so the rationale's words are not expected on the page in that case.
    if (section === 'rationale' && hasWorkedSolution) continue;
    if (MS_HEAD_RE.test(l)) {
      heads += 1;
      if (/\[\d+\]/.test(l)) headsWithMarks += 1;
    }
    // Bullets inside the worked solution are prose, not marking points.
    if (section === 'points' && /^\s*- \S/.test(l)) points += 1;
    kept.push(l);
  }
  return { answer, text: kept.join('\n'), hasWorkedSolution, heads, headsWithMarks, points };
}

/**
 * Read one batch folder.
 * @param {string} dir
 */
export function readSourceTopic(dir) {
  const q = parseFrontmatter(fs.readFileSync(path.join(dir, 'questions.md'), 'utf8'));
  const ms = parseFrontmatter(fs.readFileSync(path.join(dir, 'markscheme.md'), 'utf8'));
  const topicName = q.data.topic_name ?? path.basename(dir);
  const qBlocks = splitBlocks(q.body);
  const msBlocks = splitBlocks(ms.body);
  const questions = [];
  for (const [n, block] of qBlocks) {
    const sq = stripQuestionBlock(block);
    const sm = msBlocks.has(n) ? stripMarkschemeBlock(msBlocks.get(n) ?? '') : null;
    const questionTokens = tokenise(sq.text);
    for (const letter of sq.optionLetters) questionTokens.add(letter.toLowerCase());
    questions.push({
      n,
      id: sq.meta.id ?? `${q.data.batch_id ?? path.basename(dir)}_Q${n}`,
      type: sq.meta.type ?? (sq.optionLetters.length ? 'mcq' : 'structured'),
      tier: sq.meta.tier ?? '',
      optionLetters: sq.optionLetters,
      optionsTable: sq.optionsTable,
      parts: sq.parts,
      questionTokens,
      markTokens: sm ? tokenise(sm.text) : new Set(),
      hasMarkscheme: sm !== null,
      answer: sm?.answer ?? null,
      hasWorkedSolution: sm?.hasWorkedSolution ?? false,
      msHeads: sm?.heads ?? 0,
      msHeadsWithMarks: sm?.headsWithMarks ?? 0,
      msPoints: sm?.points ?? 0,
    });
  }
  const orphanMarkschemes = [...msBlocks.keys()].filter((n) => !qBlocks.has(n));
  return {
    dir,
    batchId: q.data.batch_id ?? path.basename(dir),
    topicId: q.data.topic_id ?? '',
    topicName,
    slug: slugify(topicName),
    questions,
    orphanMarkschemes,
  };
}

/**
 * Find igcse-chem-pipeline/pipeline/04_approved: env CONTENT_DIR, else walk up from each start dir.
 * @param {string[]} startDirs
 */
export function findContentDir(startDirs) {
  if (process.env.CONTENT_DIR) return path.resolve(process.env.CONTENT_DIR);
  for (const start of startDirs) {
    let dir = path.resolve(start);
    for (;;) {
      const candidate = path.join(dir, 'igcse-chem-pipeline', 'pipeline', '04_approved');
      if (fs.existsSync(candidate)) return candidate;
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }
  return null;
}

/** @param {string} contentDir */
export function listBatchDirs(contentDir) {
  return fs
    .readdirSync(contentDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && BATCH_DIR_RE.test(e.name))
    .map((e) => path.join(contentDir, e.name))
    .sort();
}

// ---- Page audit ----------------------------------------------------------------------------------------
/**
 * @typedef {{
 *   n: number,
 *   id: string,
 *   type: string,
 *   located: string | null,
 *   missing: string[],
 *   problems: string[],
 *   answer?: { source: string, page: string | null, via: string | null, ok: boolean },
 *   options?: { source: number, page: number, table: boolean, tableOnPage: boolean },
 *   markScheme?: { partsSource: number, partsPage: number, pointsSource: number, pointsPage: number, workedSolutionSource: boolean, workedSolutionPage: boolean }
 * }} QuestionAudit
 */
const countMatches = (html, re) => (html.match(re) || []).length;
const OPTION_BUTTON_RE = /<button\b[^>]*\bclass=["'][^"']*\boption\b/gi;
const MS_PART_RE = /<\w+\b[^>]*\bclass=["'][^"']*\bms-part\b/gi;
const MS_POINT_RE = /<li\b[^>]*\bclass=["'][^"']*\bms-point\b/gi;

/**
 * Compare one source question with its element in one page.
 * @param {ReturnType<typeof readSourceTopic>['questions'][number]} q
 * @param {string | null} pageHtml
 * @param {'topic' | 'print' | 'answers'} mode
 * @returns {QuestionAudit}
 */
export function auditQuestion(q, pageHtml, mode) {
  /** @type {string[]} */
  const problems = [];
  if (pageHtml === null) {
    return { n: q.n, id: q.id, type: q.type, located: null, missing: [], problems: ['page missing'] };
  }
  const el = extractElementById(pageHtml, `q${q.n}`);
  let located;
  let scopeHtml;
  if (el) {
    located = el.tag === 'article' ? 'article' : `${el.tag}#q${q.n}`;
    scopeHtml = el.html;
  } else if (mode === 'topic') {
    return { n: q.n, id: q.id, type: q.type, located: null, missing: [], problems: ['article missing'] };
  } else {
    // Print pages do not promise per-question ids; fall back to the whole page.
    located = 'page';
    scopeHtml = pageHtml;
  }

  const text = htmlToText(scopeHtml);
  const pageTokens = tokenise(text);
  for (const l of singleLetters(text)) pageTokens.add(l);
  for (const m of scopeHtml.matchAll(/\bdata-letter=["']([A-Da-d])["']/g)) pageTokens.add(m[1].toLowerCase());
  const squashed = squash(text);

  /** @type {Set<string>} */
  const sourceTokens = new Set();
  if (mode === 'topic' || mode === 'print') for (const t of q.questionTokens) sourceTokens.add(t);
  if (mode === 'topic' || mode === 'answers') for (const t of q.markTokens) sourceTokens.add(t);
  // A formula token with a dot ("Fe2O3.xH2O") is compared with the dot removed, like the page side.
  const missing = [...sourceTokens]
    .filter((t) => !pageTokens.has(t) && !(/\d/.test(t) && squashed.includes(t.replace(/\./g, ''))))
    .sort();
  if (missing.length) problems.push(`missing words: ${missing.join(' ')}`);

  /** @type {QuestionAudit} */
  const result = { n: q.n, id: q.id, type: q.type, located, missing, problems };

  if (q.type === 'mcq' && mode !== 'print' && q.answer) {
    const data = scopeHtml.match(/\bdata-answer=["']([A-D])["']/);
    const viaText = text.match(/\banswer(?:\s+is|:)\s*\(?([A-D])\)?(?![\p{L}\p{N}])/iu);
    const page = data ? data[1] : viaText ? viaText[1].toUpperCase() : null;
    const answer = { source: q.answer, page, via: data ? 'data-answer' : viaText ? 'text' : null, ok: page === q.answer };
    result.answer = answer;
    if (!page) problems.push('answer letter not found in page');
    else if (page !== q.answer) problems.push(`answer letter differs: page ${page}, source ${q.answer}`);
  }

  if (q.type === 'mcq' && mode === 'topic') {
    const buttons = countMatches(scopeHtml, OPTION_BUTTON_RE);
    const tableOnPage = /\boptions-table\b/.test(scopeHtml);
    result.options = { source: q.optionLetters.length, page: buttons, table: q.optionsTable, tableOnPage };
    if (buttons !== q.optionLetters.length) problems.push(`options: ${buttons} button.option on page, ${q.optionLetters.length} in source`);
    if (q.optionsTable && !tableOnPage) problems.push('table-shaped options are not rendered as table.options-table');
  }

  if (mode !== 'print' && (q.type === 'structured' || q.hasWorkedSolution)) {
    const usesComponent = mode === 'topic' || /\bms-part\b|\bworked-solution\b/.test(pageHtml);
    if (usesComponent) {
      const partsPage = countMatches(scopeHtml, MS_PART_RE);
      const pointsPage = countMatches(scopeHtml, MS_POINT_RE);
      const workedPage = /\bworked-solution\b/.test(scopeHtml);
      result.markScheme = {
        partsSource: q.msHeadsWithMarks,
        partsPage,
        pointsSource: q.msPoints,
        pointsPage,
        workedSolutionSource: q.hasWorkedSolution,
        workedSolutionPage: workedPage,
      };
      if (q.type === 'structured' && partsPage < q.msHeadsWithMarks) problems.push(`mark-scheme parts: ${partsPage} .ms-part on page, ${q.msHeadsWithMarks} marked heads in source`);
      if (q.type === 'structured' && pointsPage < q.msPoints) problems.push(`marking points: ${pointsPage} .ms-point on page, ${q.msPoints} bullets in source`);
      if (q.hasWorkedSolution && !workedPage) problems.push('worked solution missing (.worked-solution)');
    }
  }

  return result;
}

/**
 * @param {ReturnType<typeof readSourceTopic>} topic
 * @param {string} distDir
 */
export function auditTopic(topic, distDir) {
  const base = path.join(distDir, ...SUBJECT_PATH.split('/'), topic.slug);
  const pages = {
    topic: { path: `/${SUBJECT_PATH}/${topic.slug}/`, file: path.join(base, 'index.html') },
    print: { path: `/${SUBJECT_PATH}/${topic.slug}/print/`, file: path.join(base, 'print', 'index.html') },
    answers: { path: `/${SUBJECT_PATH}/${topic.slug}/print-answers/`, file: path.join(base, 'print-answers', 'index.html') },
  };
  /** @type {Record<string, string | null>} */
  const html = {};
  for (const [key, p] of Object.entries(pages)) html[key] = fs.existsSync(p.file) ? fs.readFileSync(p.file, 'utf8') : null;

  const questions = topic.questions.map((q) => ({
    n: q.n,
    id: q.id,
    type: q.type,
    tier: q.tier,
    hasMarkscheme: q.hasMarkscheme,
    topic: auditQuestion(q, html.topic, 'topic'),
    print: auditQuestion(q, html.print, 'print'),
    answers: auditQuestion(q, html.answers, 'answers'),
  }));

  const summarise = (key) => {
    const rows = questions.map((r) => r[key]);
    const mcq = rows.filter((r) => r.answer);
    return {
      exists: html[key] !== null,
      checked: rows.length,
      located: rows.filter((r) => r.located).length,
      withMissingWords: rows.filter((r) => r.missing.length).length,
      withProblems: rows.filter((r) => r.problems.length).length,
      mcqAnswersChecked: mcq.length,
      mcqAnswersOk: mcq.filter((r) => r.answer.ok).length,
    };
  };

  return {
    batchId: topic.batchId,
    topicId: topic.topicId,
    topicName: topic.topicName,
    slug: topic.slug,
    pages: { topic: pages.topic.path, print: pages.print.path, answers: pages.answers.path },
    orphanMarkschemes: topic.orphanMarkschemes,
    questionsWithoutMarkscheme: topic.questions.filter((q) => !q.hasMarkscheme).map((q) => q.n),
    summary: { topic: summarise('topic'), print: summarise('print'), answers: summarise('answers') },
    questions,
  };
}

/** Does `--topic` select this batch? Accepts T04, 04, 4, the slug or the name. */
export function matchesTopic(topic, filter) {
  if (!filter) return true;
  const f = filter.trim().toLowerCase();
  const prefix = topic.batchId.slice(0, 3).toLowerCase();
  return (
    f === prefix ||
    f === prefix.slice(1) ||
    f === String(Number(topic.topicId)) ||
    f === topic.topicId.toLowerCase() ||
    f === topic.slug ||
    f === topic.topicName.toLowerCase() ||
    slugify(f) === topic.slug
  );
}

// ---- CLI -----------------------------------------------------------------------------------------------
function isMain() {
  if (!process.argv[1]) return false;
  const a = path.resolve(process.argv[1]);
  const b = fileURLToPath(import.meta.url);
  return process.platform === 'win32' ? a.toLowerCase() === b.toLowerCase() : a === b;
}

function printTopicReport(report) {
  const pageLine = (label, s, showAnswers) => {
    if (!s.exists) return `  ${label.padEnd(14)} PAGE MISSING`;
    const answers = showAnswers && s.mcqAnswersChecked ? `, MCQ answers ok ${s.mcqAnswersOk}/${s.mcqAnswersChecked}` : '';
    return `  ${label.padEnd(14)} located ${s.located}/${s.checked}, with missing words ${s.withMissingWords}, with any problem ${s.withProblems}${answers}`;
  };
  console.log(`== ${report.batchId.slice(0, 3)} ${report.topicName}  ${report.pages.topic} ==`);
  for (const [key, label] of [
    ['topic', 'topic page:'],
    ['print', 'print:'],
    ['answers', 'print-answers:'],
  ]) {
    console.log(pageLine(label, report.summary[key], key !== 'print'));
    if (!report.summary[key].exists) continue;
    for (const q of report.questions) {
      const r = q[key];
      if (r.problems.length) console.log(`    Q${String(q.n).padEnd(3)} ${r.problems.join('; ')}`);
    }
  }
  if (report.questionsWithoutMarkscheme.length) console.log(`  source: questions without a mark scheme entry: ${report.questionsWithoutMarkscheme.join(', ')}`);
  if (report.orphanMarkschemes.length) console.log(`  source: mark scheme entries without a question: ${report.orphanMarkschemes.join(', ')}`);
}

if (isMain()) {
  const args = process.argv.slice(2);
  const argValue = (name) => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const json = args.includes('--json');
  const topicFilter = argValue('--topic');
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const websiteRoot = path.resolve(scriptDir, '..');
  const distDir = path.resolve(argValue('--dist') ?? path.join(websiteRoot, 'dist'));
  const contentDir = findContentDir([process.cwd(), scriptDir]);
  if (!contentDir) {
    console.error('audit-render: cannot find igcse-chem-pipeline/pipeline/04_approved (set CONTENT_DIR)');
    process.exit(2);
  }

  const topics = listBatchDirs(contentDir).map(readSourceTopic).filter((t) => matchesTopic(t, topicFilter));
  if (topics.length === 0) {
    console.error(`audit-render: no topic matches "${topicFilter}"`);
    process.exit(2);
  }
  const reports = topics.map((t) => auditTopic(t, distDir));

  const totals = { topics: reports.length, questions: 0, topicLocated: 0, topicMissingWords: 0, topicProblems: 0, printLocated: 0, printMissingWords: 0, answersLocated: 0, answersMissingWords: 0, pagesMissing: 0 };
  for (const r of reports) {
    totals.questions += r.questions.length;
    totals.topicLocated += r.summary.topic.located;
    totals.topicMissingWords += r.summary.topic.withMissingWords;
    totals.topicProblems += r.summary.topic.withProblems;
    totals.printLocated += r.summary.print.located;
    totals.printMissingWords += r.summary.print.withMissingWords;
    totals.answersLocated += r.summary.answers.located;
    totals.answersMissingWords += r.summary.answers.withMissingWords;
    for (const key of ['topic', 'print', 'answers']) if (!r.summary[key].exists) totals.pagesMissing += 1;
  }
  const articlesMissing = totals.questions - totals.topicLocated;

  if (json) {
    console.log(JSON.stringify({ contentDir, distDir, totals, articlesMissing, topics: reports }, null, 2));
  } else {
    console.log(`audit-render: content ${contentDir.split(path.sep).join('/')}`);
    console.log(`audit-render: dist    ${distDir.split(path.sep).join('/')}`);
    for (const r of reports) printTopicReport(r);
    console.log(
      `audit-render: ${totals.topics} topic(s), ${totals.questions} questions. topic pages: ${totals.topicLocated} articles located, ${totals.topicMissingWords} with missing words, ${totals.topicProblems} with any problem. print: ${totals.printLocated} located, ${totals.printMissingWords} with missing words. print-answers: ${totals.answersLocated} located, ${totals.answersMissingWords} with missing words. ${totals.pagesMissing} page(s) missing.`,
    );
  }
  process.exit(articlesMissing > 0 ? 1 : 0);
}
