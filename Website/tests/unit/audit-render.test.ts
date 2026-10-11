/**
 * audit-render.mjs: the normaliser, the source parsing and the page comparison, against synthetic
 * HTML that mimics the DOM contract (including the display-only chemistry formatting).
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  normaliseChem,
  tokenise,
  htmlToText,
  extractElementById,
  slugify,
  parseFrontmatter,
  splitBlocks,
  stripQuestionBlock,
  stripMarkschemeBlock,
  readSourceTopic,
  auditQuestion,
  auditTopic,
  matchesTopic,
} from '../../scripts/audit-render.mjs';

const QUESTIONS_MD = `---
batch_id: T99_20260101_01
topic_id: "99"
topic_name: "Acids, bases and salts"
---

## Q1
- id: T99_20260101_01_Q1
- type: mcq
- tier: core
- subtopic_id: "99.1"
- subtopic_name: "Test"
- syllabus_points: ["99.1.1"]
- difficulty: 1
- marks: 1
- needs_diagram: false

**Question**

Which row describes dilute H2SO4 at 25.0 °C?

| | colour of litmus | pH |
|---|---|---|
| A | red | 1 |
| B | blue | 13 |
| C | red | 7 |
| D | blue | 7 |

## Q3
- id: T99_20260101_01_Q3
- type: structured
- tier: supplement
- subtopic_id: "99.2"
- subtopic_name: "Ions"
- syllabus_points: ["99.2.1"]
- difficulty: 2
- marks: 3
- needs_diagram: false

**Question**

Aqueous copper(II) sulfate contains Cu2+ and SO4 2− ions. The volume used was 25 cm3.

- respiration: C6H12O6 + 6O2 → 6CO2 + 6H2O
- photosynthesis: the reverse

(a) Write the ionic half-equation at the cathode. [2]

(b) State the colour change. [1]
`;

const MARKSCHEME_MD = `---
batch_id: T99_20260101_01
---

## Q1
- answer: A

**Rationale**
Dilute sulfuric acid turns litmus red and has a low pH.

**Worked solution**
Acids turn litmus red, so only A or C fit; pH 1 is acidic, so A.

## Q3

**(a)** [2]
- Cu2+ + 2e− → Cu (1)
- ALLOW: electrons on the left (1)

**(b)** [1]
- blue to colourless (1)
- REJECT: clear

**Worked solution**
Copper ions gain two electrons at the cathode, so the blue colour fades.
`;

/** Crude stand-in for the site's chem formatter: subscripts after element letters, cm3, ion charges. */
function fakeChem(text: string): string {
  const sub = (d: string) => d.replace(/\d/g, (c) => '₀₁₂₃₄₅₆₇₈₉'[Number(c)]);
  const sup = (d: string) => d.replace(/[\d+−-]/g, (c) => (c === '+' ? '⁺' : c === '−' || c === '-' ? '⁻' : '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(c)]));
  return text
    .replace(/\b(SO4) 2−/g, (_, f) => sub(f).replace(/\d/g, (c) => '₀₁₂₃₄₅₆₇₈₉'[Number(c)]) + sup('2−'))
    .replace(/\b(Cu)2\+/g, (_, f) => `${f}${sup('2+')}`)
    .replace(/\b(H|SO|CO|O|C|H1|e)(\d+)(?=[A-Za-z\s.,)]|$)/g, (_, el, d) => `${el}${sub(d)}`)
    .replace(/\bcm3\b/g, 'cm³')
    .replace(/2e−/g, '2e⁻');
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Minimal renderer that follows the DOM contract closely enough for the audit. */
function renderTopicPage(src: ReturnType<typeof readSourceTopic>, opts: { dropWord?: string; wrongAnswer?: boolean } = {}): string {
  const articles = src.questions.map((q) => {
    const words = (text: string) => fakeChem(esc(text.replace(/\*\*/g, '').replace(/^\|?[-| ]+\|?$/gm, '')));
    let qText = words(q.questionTokens.size ? [...q.questionTokens].join(' ') : '');
    if (opts.dropWord) qText = qText.replace(new RegExp(`\\b${opts.dropWord}\\b`, 'gi'), '');
    const msText = words([...q.markTokens].join(' '));
    if (q.type === 'mcq') {
      const letter = opts.wrongAnswer ? 'D' : q.answer;
      const options = q.optionLetters.map((l) => `<tr class="option-row" data-letter="${l}"><td><button class="option" data-letter="${l}" aria-pressed="false">${l}</button></td><td>x</td></tr>`).join('');
      return `<article class="question" id="q${q.n}" data-question-id="${q.id}" data-type="mcq" data-answer="${letter}"><h2>${q.n}</h2><div class="stem"><p>${qText}</p></div>
        <table class="options-table">${options}</table><p class="feedback" role="status"></p>
        <button class="toggle-answer" aria-expanded="false" aria-controls="q${q.n}-answer">Show answer</button>
        <div class="answer" id="q${q.n}-answer" hidden><section class="worked-solution"><p>${msText}</p></section></div></article>`;
    }
    return `<article class="question" id="q${q.n}" data-question-id="${q.id}" data-type="structured"><h2>${q.n}</h2><p>${qText}</p>
      <button class="toggle-answer" aria-expanded="false" aria-controls="q${q.n}-answer">Show mark scheme</button>
      <div class="answer" id="q${q.n}-answer" hidden><section class="markscheme">
        <div class="ms-part"><ul class="ms-points"><li class="ms-point" data-kind="point">Cu²⁺ + 2e⁻ → Cu (1)</li><li class="ms-point" data-kind="allow">ALLOW: electrons on the left</li></ul></div>
        <div class="ms-part"><ul class="ms-points"><li class="ms-point" data-kind="point">blue to colourless</li><li class="ms-point" data-kind="reject">REJECT: clear</li></ul></div>
      </section><section class="worked-solution"><p>${msText}</p></section></div></article>`;
  });
  return `<!doctype html><html lang="en"><head><title>t</title><script>const x = "<article>";</script></head><body><main id="main"><h1>${esc(src.topicName)}</h1>${articles.join('\n')}</main></body></html>`;
}

function makeSource(): { dir: string; topic: ReturnType<typeof readSourceTopic> } {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'topical-hub-audit-'));
  const dir = path.join(root, 'T99_20260101_01');
  fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, 'questions.md'), QUESTIONS_MD, 'utf8');
  fs.writeFileSync(path.join(dir, 'markscheme.md'), MARKSCHEME_MD, 'utf8');
  return { dir, topic: readSourceTopic(dir) };
}

describe('normaliser', () => {
  it('maps sub/superscripts back to plain text', () => {
    expect(normaliseChem('H₂SO₄ Cu²⁺ SO₄²⁻ cm³ 2H₂O')).toBe('H2SO4 Cu2+ SO42- cm3 2H2O');
  });

  it('tokenises identically on both sides', () => {
    expect([...tokenise('Dilute **H2SO4** at 25.0 °C | pH 7 → `Cu2+` [2] (a) ...')].sort()).toEqual(['25.0', 'at', 'cu2', 'dilute', 'h2so4', 'ph'].sort());
    expect([...tokenise('H₂SO₄ Cu²⁺ 25.0')].sort()).toEqual(['25.0', 'cu2', 'h2so4'].sort());
    expect(tokenise('metal–acid lead / Pb e.g.').has('e.g')).toBe(true);
  });

  it('strips tags, scripts and entities', () => {
    expect(htmlToText('<p class="x">gas &lt; liquid &amp;<br>solid</p><script>var a = "<b>";</script><style>p{}</style>&#8594; &#x2192;')).toBe(
      'gas < liquid & solid → →',
    );
  });

  it('extracts an element by id, tracking same-name nesting', () => {
    const html = '<div id="a"><div id="q16" class="x"><div>inner</div></div><div id="q17">other</div></div>';
    expect(extractElementById(html, 'q16')?.html).toBe('<div id="q16" class="x"><div>inner</div></div>');
    expect(extractElementById(html, 'q1')).toBeNull();
    expect(extractElementById('<article data-id="q1"><article id="q1">x</article></article>', 'q1')?.html).toBe('<article id="q1">x</article>');
  });

  it('slugifies like CONTRACT.md', () => {
    expect(slugify('Acids, bases and salts')).toBe('acids-bases-and-salts');
    expect(slugify('The Periodic Table')).toBe('the-periodic-table');
    expect(slugify('Experimental techniques and chemical analysis')).toBe('experimental-techniques-and-chemical-analysis');
  });
});

describe('source parsing', () => {
  it('reads frontmatter, blocks, metadata and labels', () => {
    const fm = parseFrontmatter(QUESTIONS_MD);
    expect(fm.data.topic_name).toBe('Acids, bases and salts');
    const blocks = splitBlocks(fm.body);
    expect([...blocks.keys()]).toEqual([1, 3]);
    const q1 = stripQuestionBlock(blocks.get(1) ?? '');
    expect(q1.meta.id).toBe('T99_20260101_01_Q1');
    expect(q1.meta.type).toBe('mcq');
    expect(q1.optionLetters).toEqual(['A', 'B', 'C', 'D']);
    expect(q1.optionsTable).toBe(true);
    expect(q1.text).not.toMatch(/\*\*Question\*\*|^- id:/m);
    const q3 = stripQuestionBlock(blocks.get(3) ?? '');
    expect(q3.meta.type).toBe('structured');
    expect(q3.text).toMatch(/- respiration:/);
    expect(q3.parts).toBe(2);
    const ms = splitBlocks(parseFrontmatter(MARKSCHEME_MD).body);
    const m1 = stripMarkschemeBlock(ms.get(1) ?? '');
    expect(m1.answer).toBe('A');
    expect(m1.hasWorkedSolution).toBe(true);
    expect(m1.text).not.toMatch(/answer:|Rationale|Worked solution/);
    const m3 = stripMarkschemeBlock(ms.get(3) ?? '');
    expect(m3.headsWithMarks).toBe(2);
    expect(m3.points).toBe(4);
  });

  it('reads a batch folder into tokens', () => {
    const { topic } = makeSource();
    expect(topic.slug).toBe('acids-bases-and-salts');
    expect(topic.questions.map((q) => q.n)).toEqual([1, 3]);
    expect(topic.questions[0].questionTokens.has('h2so4')).toBe(true);
    expect(topic.questions[0].questionTokens.has('a')).toBe(true);
    expect(topic.questions[1].markTokens.has('allow')).toBe(true);
    expect(matchesTopic(topic, 'T99')).toBe(true);
    expect(matchesTopic(topic, '99')).toBe(true);
    expect(matchesTopic(topic, 'acids-bases-and-salts')).toBe(true);
    expect(matchesTopic(topic, 'Acids, bases and salts')).toBe(true);
    expect(matchesTopic(topic, 'T04')).toBe(false);
  });
});

describe('page comparison', () => {
  it('finds no missing words on a faithful page, through the chemistry formatting', () => {
    const { topic } = makeSource();
    const html = renderTopicPage(topic);
    for (const q of topic.questions) {
      const r = auditQuestion(q, html, 'topic');
      expect(r.located).toBe('article');
      expect(r.missing, `Q${q.n}`).toEqual([]);
      expect(r.problems, `Q${q.n}`).toEqual([]);
    }
    const mcq = auditQuestion(topic.questions[0], html, 'topic');
    expect(mcq.answer).toMatchObject({ page: 'A', via: 'data-answer', ok: true });
    expect(mcq.options).toMatchObject({ source: 4, page: 4, table: true, tableOnPage: true });
    const structured = auditQuestion(topic.questions[1], html, 'topic');
    expect(structured.markScheme).toMatchObject({ partsSource: 2, partsPage: 2, pointsSource: 4, pointsPage: 4, workedSolutionSource: true, workedSolutionPage: true });
  });

  it('reports a dropped word, a wrong answer letter and a missing article', () => {
    const { topic } = makeSource();
    // "describes" occurs only in the question text (the mark scheme also says "litmus", which stays present).
    const dropped = auditQuestion(topic.questions[0], renderTopicPage(topic, { dropWord: 'describes' }), 'topic');
    expect(dropped.missing).toEqual(['describes']);
    expect(dropped.problems[0]).toMatch(/missing words: describes/);

    const wrong = auditQuestion(topic.questions[0], renderTopicPage(topic, { wrongAnswer: true }), 'topic');
    expect(wrong.problems).toContain('answer letter differs: page D, source A');

    const gone = auditQuestion(topic.questions[1], renderTopicPage(topic).replace('id="q3"', 'id="q33"'), 'topic');
    expect(gone.located).toBeNull();
    expect(gone.problems).toEqual(['article missing']);

    const noPage = auditQuestion(topic.questions[1], null, 'topic');
    expect(noPage.problems).toEqual(['page missing']);
  });

  it('finds the answer letter in text when there is no data-answer, and falls back to the whole print page', () => {
    const { topic } = makeSource();
    const answers = '<html lang="en"><body><h1>x</h1><section id="q1"><p>The answer is A. Dilute sulfuric acid turns litmus red and has a low pH. Acids turn litmus red so only A or C fit pH 1 is acidic so A</p></section></body></html>';
    const r = auditQuestion(topic.questions[0], answers, 'answers');
    expect(r.located).toBe('section#q1');
    expect(r.missing).toEqual([]);
    expect(r.answer).toMatchObject({ via: 'text', ok: true });

    const print = `<html lang="en"><body><h1>x</h1><div>${fakeChem('Which row describes dilute H2SO4 at 25.0 °C colour of litmus pH A red 1 B blue 13 C red 7 D blue 7')}</div></body></html>`;
    const p = auditQuestion(topic.questions[0], print, 'print');
    expect(p.located).toBe('page');
    expect(p.missing).toEqual([]);
  });

  it('audits a whole topic against a fake dist', () => {
    const { topic } = makeSource();
    const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'topical-hub-audit-dist-'));
    const base = path.join(dist, 'igcse', 'chemistry-0620', topic.slug);
    fs.mkdirSync(path.join(base, 'print'), { recursive: true });
    fs.writeFileSync(path.join(base, 'index.html'), renderTopicPage(topic), 'utf8');
    fs.writeFileSync(path.join(base, 'print', 'index.html'), renderTopicPage(topic).replace(/<div class="answer"[\s\S]*?<\/div><\/article>/g, '</article>'), 'utf8');
    const report = auditTopic(topic, dist);
    expect(report.pages.topic).toBe('/igcse/chemistry-0620/acids-bases-and-salts/');
    expect(report.summary.topic).toMatchObject({ exists: true, checked: 2, located: 2, withMissingWords: 0, withProblems: 0, mcqAnswersChecked: 1, mcqAnswersOk: 1 });
    expect(report.summary.print).toMatchObject({ exists: true, located: 2, withMissingWords: 0 });
    expect(report.summary.answers).toMatchObject({ exists: false, located: 0 });
    fs.rmSync(dist, { recursive: true, force: true });
  });
});
