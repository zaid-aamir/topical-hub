# CLAUDE.md — project brief for Claude Code

## What this is

**Site name: Topical Hub.** Repo: github.com/zaid-aamir/topical-hub (public).

A website of **original, exam-style topical practice questions** for Cambridge IGCSE Chemistry 0620 (syllabus for exams in 2026–2028), with mark schemes and worked solutions. It's free, organised by topic, and will be funded by ads later.

The owner is an IGCSE student building this as a business, and wants **speed**: ship a working site fast, then improve it. Talk to them directly, with no flattery. Push back on weak ideas, and say plainly when something is fine.

## Hard rules (legal: never break these)

- **These are NOT past papers.** Never use "past papers" in page titles, headings, meta tags, URLs, alt text or copy. Use "exam-style questions" or "topical practice questions". Cambridge doesn't license electronic publication of its past papers, and this site's whole legal basis is that every question is original.
- Never add real Cambridge past papers, mark schemes or examiner reports to this repo, and never scrape them.
- Don't use Cambridge's logo or branding, and don't imply the site is endorsed by Cambridge. Naming the qualification ("Cambridge IGCSE Chemistry 0620") to describe what the questions are for is fine.
- **This repo is public.** The syllabus PDF in `igcse-chem-pipeline/reference/` is Cambridge's copyright. It's kept on the owner's computer only and is gitignored. Never commit it, never publish it on the site, and never add any other Cambridge document.

## Implemented website (documentation checked 2026-10-18)

The Astro site is implemented in `Website/`. Start with `Website/README.md` for commands and `Website/CONTRACT.md` for the current routes and DOM. `Website/BUILD_V1.md` now records delivered scope, not an instruction to rebuild the site.

- Home lists subjects under `/#subjects`; Chemistry is the only enabled subject. Its subject page lists all 12 topics and 360 questions.
- Topic pages have tier/type/subtopic filters, MCQ marking, answer toggles, print pages and 24 downloadable watermarked PDFs in total.
- Header: Subjects, About, theme toggle. Footer version comes from `Website/package.json`.
- Existing question anchors are `#q<n>`, while the full source id is stored in `data-question-id` and error reports. This differs from the original id-anchor requirement below; preserve current links unless explicitly migrating them.
- Error reports currently open pre-filled GitHub issues because `REPORT_FORM_URL` is empty.
- Only the Chemistry pipeline feeds the site. Adding a subject needs config, content dispatch and routes; `question-pipeline/` is not integrated.
- `npm run build` checks PDF freshness before Astro content validation and the output gate. PDF-affecting changes require `npm run pdfs` (Playwright Chromium); leave generated PDFs and manifest for the owner to review and commit. See `Website/scripts/pdf-manifest.mjs` for hashed inputs.

## Repo layout

```
CLAUDE.md                  this file
igcse-chem-pipeline/       the question pipeline: content source, read-only for the website
  pipeline/04_approved/    THE CONTENT: 12 topic folders, 30 questions each (360 total)
  agents/FORMAT.md         the file-format spec ("Published output" section)
  config/syllabus_map.json topic/subtopic names, syllabus points, tiers
question-pipeline/        the multi-subject pipeline (Biology 0610, Physics 0625; Chemistry moves here later): read-only for the website, owned by the managing chat
Website/                   the website lives here
```

**Don't modify anything in `igcse-chem-pipeline/` or `question-pipeline/`** unless the owner explicitly asks. A separate managing chat owns the pipeline. If the owner asks you to fix a reported error in a question, edit only that question in `pipeline/04_approved/<batch_id>/questions.md` or `markscheme.md`. Then add one line to `igcse-chem-pipeline/logs/run_log.md` (append only, never rewrite it; never write an answer into the log):
`date | ERROR FIX | <batch_id> Q<n> | what was wrong, without stating the answer`

## The content contract

Read only `igcse-chem-pipeline/pipeline/04_approved/*/questions.md` and `markscheme.md`, at **build time**. Ignore every other file there (`solver_answers*.md`, `verifier_answers.md`, `verification.md` are internal).

- One folder per topic: `T01_…` to `T12_…`. Get topic names from the frontmatter (`topic_id`, `topic_name`) or from `config/syllabus_map.json`.
- Each file is YAML frontmatter followed by `## Q<n>` blocks. **Numbering can have gaps.** Match a question to its mark scheme entry by its `## Q<n>` heading, never by position.
- Each question block has a metadata list (`id`, `type: mcq|structured`, `tier: core|supplement`, `subtopic_id`, `subtopic_name`, `syllabus_points`, `difficulty` 1–3, `marks`, `needs_diagram`), then `**Question**` and the question text.
- MCQ options are either plain lines (`A text` … `D text`) or rows of a Markdown table whose first cell is the letter. Handle both.
- Structured questions have parts `(a)`, `(b)`… each ending in `[marks]`.
- In `markscheme.md`: MCQs have `- answer: X` plus `**Rationale**`, and sometimes a `**Worked solution**`. Show the worked solution if there is one, otherwise the rationale. Structured questions have per-part marking points (ALLOW / REJECT / IGNORE / ECF lines are real mark-scheme conventions, so show them) and always a `**Worked solution**`.
- Formulae are plain text: H2SO4, Cu2+, SO4 2−. Rendering subscripts and superscripts is a nice-to-have. If you do it, it must never break coefficients (2H2O), isotope notation, or numbers in normal text. When in doubt, leave the text plain.
- Tables are Markdown tables. There are no images.
- Write a parser test that loads all 12 files and checks 360 questions parse, each with a matching mark scheme entry. Fail the build if that check fails.

## v1 scope (ship this, nothing more)

1. Home page: what the site is (honest labelling), links to the 12 topics.
2. One page per topic: its questions, filterable by Core/Supplement if cheap. Each question gets a "Show answer" toggle revealing the mark scheme and worked solution, so the student attempts it first.
3. A stable URL and anchor for every question (use its `id`), so error reports and links can point at one question.
4. A "Report an error" link on every question, which opens a form with the question id pre-filled. The owner will supply the form link; until then use a placeholder constant in one place.
5. A print-friendly layout: questions without answers, and optionally a separate answers print.
6. Mobile-first, fast, accessible. Static output, with no backend, accounts or database.
7. SEO basics: a unique `<title>` and meta description per topic page ("IGCSE Chemistry Electrolysis questions with answers"-style, never "past papers"), a sitemap and robots.txt.
8. Keep `subtopic_id` in the data model, so topic pages can later be split into subtopic pages without regenerating content.

Out of scope for v1: accounts, progress tracking, ads, payments, search, other subjects, diagrams.

## Defaults (change only with a reason)

- Static site generator: **Astro**. It's content-first, outputs plain HTML, and has good SEO defaults. Next.js static export is acceptable if there's a concrete reason.
- Hosting: a free static host (Cloudflare Pages, Netlify or Vercel), deploying from this repo with the root directory set to `Website/`, reading content from `../igcse-chem-pipeline/`.
- Keep dependencies few.

## Git: the owner commits, never Claude

- **Never run `git commit`, `git push`, `git add`, `git merge`, `git rebase`, `git reset`, `git revert`, `git stash`, `git tag`, `git worktree`, or create branches.** Don't use worktrees or isolated copies of the repo. Make every change directly in this working folder and leave it uncommitted. The owner reviews and commits everything himself.
- Read-only git is fine: `git status`, `git diff`, `git log`, `git show`.
- These commands are also blocked in `.claude/settings.json`, which also sets `worktree.bgIsolation` to `none` so background sessions edit this folder directly. Don't try to work around either.
- When you finish a piece of work, end with a short list of the files you changed and a suggested commit message (one line, no `Co-Authored-By` or any other trailer). The owner decides whether to use it.
- Line endings are normalised to LF by `.gitattributes`. Never commit `.env` files or secrets (the owner does the committing, but don't create them in tracked places either).

## Verification budget: keep it small

### Biology handoff (18 October 2026)

The latest Biology task covers topics **1–10 only**. The owner confirmed using their existing
approved Claude solve/verify records to make review PDFs; no fresh solve or verification was done.
Read `question-pipeline/subjects/0610-biology/review/README.md` before continuing. Twenty PDFs
covering 220 questions are in its `pdfs/` folder, outside the published website. Topics 11–21 and
website integration remain outside this handoff unless the owner gives a new instruction.

Tokens are limited. Verification must be proportionate, not exhaustive.

- **Default after a change:** run `npm run build` (it includes content validation and the "past paper" check) and `npm test`, once, from `Website/`. If both pass, stop.
- **Don't** run Playwright browser suites, screenshot sweeps, axe audits, the per-topic render audit, link crawls, or reviewer/sub-agents unless the owner explicitly asks for them.
- **Don't** use ultracode, dynamic workflows, agent teams or parallel sub-agents for routine work.
- Fix only what a failing check reports. Don't go looking for extra problems.
- If something can only be checked visually, say so in one line and let the owner look at it in `npm run dev`.
