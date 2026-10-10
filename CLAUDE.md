# CLAUDE.md — project brief for Claude Code

## What this is

A website of **original, exam-style topical practice questions** for Cambridge IGCSE Chemistry 0620 (syllabus for exams in 2026–2028), with mark schemes and worked solutions. It's free, organised by topic, and will be funded by ads later.

The owner is an IGCSE student building this as a business, and wants **speed**: ship a working site fast, then improve it. Talk to them directly, with no flattery. Push back on weak ideas, and say plainly when something is fine.

## Hard rules (legal: never break these)

- **These are NOT past papers.** Never use "past papers" in page titles, headings, meta tags, URLs, alt text or copy. Use "exam-style questions" or "topical practice questions". Cambridge doesn't license electronic publication of its past papers, and this site's whole legal basis is that every question is original.
- Never add real Cambridge past papers, mark schemes or examiner reports to this repo, and never scrape them.
- Don't use Cambridge's logo or branding, and don't imply the site is endorsed by Cambridge. Naming the qualification ("Cambridge IGCSE Chemistry 0620") to describe what the questions are for is fine.
- **This repo is public.** The syllabus PDF in `igcse-chem-pipeline/reference/` is Cambridge's copyright. It's kept on the owner's computer only and is gitignored. Never commit it, never publish it on the site, and never add any other Cambridge document.

## Repo layout

```
CLAUDE.md                  this file
igcse-chem-pipeline/       the question pipeline: content source, read-only for the website
  pipeline/04_approved/    THE CONTENT: 12 topic folders, 30 questions each (360 total)
  agents/FORMAT.md         the file-format spec ("Published output" section)
  config/syllabus_map.json topic/subtopic names, syllabus points, tiers
Website/                   the website lives here
```

**Don't modify anything in `igcse-chem-pipeline/`** unless the owner explicitly asks. A separate managing chat owns the pipeline. If the owner asks you to fix a reported error in a question, edit only that question in `pipeline/04_approved/<batch_id>/questions.md` or `markscheme.md`. Then add one line to `igcse-chem-pipeline/logs/run_log.md` (append only, never rewrite it; never write an answer into the log):
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

## Git

- Branch `main`. Commit in small, working steps with clear messages. Never commit `.env` files or secrets.
- Line endings are normalised to LF by `.gitattributes`.
