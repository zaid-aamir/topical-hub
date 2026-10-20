# Topical Hub — code contract (v1)

Reference for the implemented modules. The data model is `src/content/types.ts`; the site configuration is `src/config.ts`; the visual language is `DESIGN.md`. Project rules in root `AGENTS.md` and `CLAUDE.md` take precedence. The module labels below describe responsibilities, not agent assignments or permission boundaries.

## Module ownership

| Path | Owner | Exports / purpose |
|---|---|---|
| `src/content/` | parser | `loadSubjectTopics(subject): Topic[]` (cached per subject, sorted by topic number), `resolveContentDir(subject)`, `listBatchDirs(dir, batchPrefix)`, `parseQuestionsFile`, `parseMarkschemeFile`, `validateTopics`, `slugify`. Reads only `questions.md` and `markscheme.md` from the subject's `contentSubpath` (or `process.env[contentDirEnv]`). Validation is structural and never requires a fixed total. Throws `ContentError` on any contract violation so the build fails. Prints one summary line per subject on success. |
| `src/lib/markdown.ts` | chem/markdown | `mdBlock(md: string): string` (block-level Markdown to HTML, GFM tables wrapped in `<div class="table-scroll">`), `mdInline(md: string): string` (inline Markdown to HTML, no `<p>`). Raw HTML is never passed through: `<`, `>` and `&` in text are escaped. Options `{ chem?, power? }`; `subjectFormat(subject)` builds them from the subject's `chemFormatting` (gated by `CHEM_FORMATTING`) and `powerFormatting`, and the question components pass that one `format` object through every nested renderer. `chem` applies `applyChem`; `power` applies `applyPowers` (`src/lib/power.ts`: `^` + optional minus + digits becomes `<sup>`, in text nodes only; any other caret is left as written). |
| `src/lib/chem/` | chem/markdown | `formatChem(text: string): string` pure text to text (Unicode sub/superscripts); `applyChem(html: string): string` applies it to text nodes of an HTML string, skipping the inside of `<code>`, `<pre>`, `<a>`, `<script>`, `<style>` and never touching tags, attributes or entities. `mapTextNodes(html, fn)` is the shared text-node walker. `ELEMENTS` full symbol list. |
| `src/styles/` | design | `tokens.css` (custom properties, light and dark), `global.css` (reset, type, layout primitives, components shared across pages), `print.css` (print-page rules). |
| `src/layouts/BaseLayout.astro` | design | Props: `title`, `description`, `canonicalPath` (e.g. `/about/`), `noindex?: boolean`, `bodyClass?: string`, `ogType?`. Renders `<html lang="en">`, the `<head>` (charset, viewport, title, description, canonical, OG, Twitter, theme-color, favicon, fonts, early theme script), skip link to `#main`, `<SiteHeader>`, `<main id="main">` slot, `<SiteFooter>` with `DISCLAIMER`. |
| `src/components/SiteHeader.astro`, `SiteFooter.astro`, `ThemeToggle.astro` | design | Header: wordmark to `/`, Subjects to `/#subjects`, About and theme toggle; current navigation link gets `aria-current="page"`. Footer: disclaimer, About, Privacy, GitHub and version from `package.json`. |
| `src/pages/about.astro`, `privacy.astro`, `404.astro`, `robots.txt.ts` | design | Static copy per BUILD_V1 §1 and §4. robots.txt allows everything and links `${SITE_URL}/sitemap-index.xml`. |
| `src/pages/index.astro` | home | Home page with `SubjectGrid`, listing `SUBJECTS` under `#subjects`; copy names the subject while `SOLE_SUBJECT` exists. |
| `src/config.ts` | all | `SUBJECTS`: one `Subject` per qualification with `path`, `shortName`, `fullName`, `syllabusYears`, `description` and the content settings `contentSubpath`, `contentDirEnv`, `batchPrefix`, `anchor` (`'number'` or `'id'`), `chemFormatting`, `powerFormatting`. No imports and only erasable TypeScript, so the Node scripts import it directly (Node >= 22.18). Adding a subject is one entry here. |
| `src/lib/subjects.ts`, `src/components/SubjectGrid.astro` | home | `subjectTopics(subject)` loads any subject in `SUBJECTS` from its own settings, merging multi-part topics in numeric part order; `subjectCounts` computes counts. A subject not in `SUBJECTS` throws rather than displaying zero counts. |
| `src/lib/pdfs.ts`, `scripts/pdf-manifest.mjs`, `scripts/check-pdfs.mjs`, `scripts/generate-pdfs.mjs` | ops | Download links and sizes, input hashing, PDF freshness gate and explicit Chromium-based regeneration of two watermarked PDFs per topic of every subject in `SUBJECTS` (78 in v1.1.0). |
| `src/pages/igcse/[subject]/index.astro` | home | Subject home with data-derived topic cards. |
| `src/pages/igcse/[subject]/[slug]/index.astro` | topic | Topic page. |
| `src/pages/igcse/[subject]/[slug]/print.astro`, `print-answers.astro` | topic | Print pages. |
| `src/components/question/*` | topic | `QuestionCard.astro`, `McqOptions.astro`, `StructuredParts.astro`, `MarkScheme.astro`, `AnswerPanel.astro`, plus the client scripts. |
| `scripts/check-dist.mjs` | ops | Post-build checks over `dist/`: "past paper" scan, internal link and anchor check, noindex on print pages, exactly one `<h1>` per page, `lang="en"`. Exits non-zero on failure. |
| `scripts/audit-render.mjs` | ops | Per-topic render audit: compares the words of every source question and mark scheme with the text of the built topic page and print pages; prints missing words per question id. |
| `tests/unit/**` | each module | Vitest. The real-content and subject tests load every subject in `SUBJECTS` and compare it with counts taken from the files themselves (`sourceCounts` in `tests/unit/content/helpers.ts`), never pinned totals. |
| `tests/e2e/**` | ops | Playwright specs: behaviour checks, screenshots to `test-results/screenshots/`, axe scans. |
| `DEPLOY.md`, `README.md` | ops | Cloudflare Pages click-by-click guide; how to run locally. |

Website maintenance may span these modules. Do not edit either pipeline during website work; follow the root briefs for explicitly requested question corrections. The owner commits all changes.

## URLs

| Page | Path |
|---|---|
| Home | `/` |
| Subject home | `/igcse/<subject>/` |
| Topic | `/igcse/<subject>/<slug>/` |
| Printable questions | `/igcse/<subject>/<slug>/print/` |
| Printable mark scheme | `/igcse/<subject>/<slug>/print-answers/` |
| About | `/about/` |
| Privacy | `/privacy/` |
| 404 | `/404` (`dist/404.html`) |

`slug` = `slugify(topicName)`: lower-case, letters and digits kept, every other run of characters becomes one hyphen, no leading or trailing hyphen. "Acids, bases and salts" -> `acids-bases-and-salts`. Subject route values are `chemistry-0620`, `biology-0610` and `physics-0625` (the second segment of `Subject.path`). Chemistry question anchors remain `#q<n>` using the question number (`anchor: 'number'`); Biology and Physics use the full source ID (`anchor: 'id'`), with original numbers preserved. The full source id remains in `data-question-id` and error reports. Preserve existing anchors during routine maintenance.

PDFs are served at `/pdfs/topical-hub-<subject path with / as ->-<slug>-questions.pdf` (e.g. `topical-hub-igcse-physics-0625-waves-questions.pdf`) and the corresponding `-mark-scheme.pdf` path. They are generated assets in `public/pdfs/`, with a freshness and integrity manifest.

Titles: `<Topic name> — <Subject shortName> exam-style questions with answers | Topical Hub`. Never the phrase "past paper" anywhere except one sentence on the About page.

## DOM contract (scripts, styles and tests all depend on this)

Global

- `<html lang="en">`; `data-theme="light" | "dark"` when the user has chosen, absent when following the system.
- Skip link `a.skip-link[href="#main"]` is the first focusable element; `<main id="main">`.
- Theme toggle: `button#theme-toggle` with `aria-pressed="true"` when dark is active and an `aria-label` that says what pressing it will do. Stores the choice under `localStorage["theme"]` inside try/catch.
- Every table produced from Markdown is inside `div.table-scroll`.

Topic page

- Filter bar `div.filters[data-filters]` with:
  - tier group `fieldset[data-filter-group="tier"]` containing `button[data-filter="tier"][data-value="all"|"core"|"supplement"][aria-pressed]`
  - type group `fieldset[data-filter-group="type"]` containing `button[data-filter="type"][data-value="all"|"mcq"|"structured"][aria-pressed]`
  - subtopic `select[data-filter="subtopic"]` with `<option value="all">` plus one option per subtopic id
  - a live count `p[data-filter-count][role="status"]` such as "Showing 12 of 30 questions"
- Each question is `article.question.question-card#<anchor>` (Chemistry `q<n>`, Biology and Physics full source ID) with `data-question-id`, `data-tier`, `data-type`, `data-subtopic`, `data-number`. Filtering sets or removes the `hidden` attribute. With JavaScript off, nothing is hidden.
- Card head `div.question-head`: `h2.question-number` (visually hidden "Question " + number, no part label), `span.badge.badge-core|badge-supplement`, `span.badge.badge-marks` ("1 mark", "4 marks"), `span.subtopic`.
- Merged topics (questions from more than one source part): each part's cards sit in `section.part-group[data-part][aria-labelledby="part-<n>"]` headed by `h2.part-heading#part-<n>` ("Part 2" plus `span.part-range` "Questions 1–30"). A part section whose questions are all filtered out gets `hidden`. Single-part topics have no part sections.
- Score line (MCQ only) `p[data-score][role="status"]` near the filters, e.g. "3 / 5 correct", kept in memory only. It counts each question's first attempt only (`data-first="correct"|"wrong"` on the card, kept across "Try again").
- MCQ options: container `div.options[role="group"][aria-labelledby]`; each option is `button.option[data-letter="A".."D"][aria-pressed="false"]` containing `span.option-letter`, `span.option-text` and an empty `span.option-status`. For table-shaped options the container is a `table.options-table` and each `tr.option-row[data-letter]` contains the `button.option` and its `span.option-status` in its first cell; clicking anywhere in the row activates the button. After answering: the card gets `data-answered="correct"|"wrong"`, the chosen option gets `data-state="correct"|"wrong"`, the right option gets `data-state="correct"` (rows mirror `data-state` and `data-pressed`), all options get `disabled`, the status labels read "Correct" (right choice), "Not quite" (wrong choice) and "Correct answer" (the right option after a wrong choice), and `p.feedback[role="status"][aria-live="polite"]` is filled with "Correct" or "Not quite. The answer is C".
- Try again (MCQ only): `button.try-again[hidden]` in `div.question-actions`, shown after answering. It clears `data-answered`, the option states, labels and feedback, re-enables the options, closes the panel and focuses the first option.
- Answer toggle: `button.toggle-answer[aria-expanded="false"][aria-controls="<anchor>-answer"]` containing `span.toggle-label` ("Show answer" for MCQ, "Show mark scheme" for structured; "Hide …" when open) and an `svg.chevron` that rotates when expanded. The panel is `div.answer#<anchor>-answer[hidden]`. Selecting an MCQ option also opens the panel.
- Report link: `a.report-link[target="_blank"][rel="noopener noreferrer"]` with a decorative flag SVG, built with `reportErrorUrl(id, absoluteUrlWithAnchor)`.
- Mark scheme: `section.markscheme` with one `div.ms-part` per `MarkSchemePart` (heading `(a)` / `(b)(i)` and `[n]` right-aligned), `ul.ms-points` with `li.ms-point[data-kind="point"|"allow"|"reject"|"ignore"|"ecf"]` (keyword in `span.ms-keyword`, styled as a tag on the topic page), and `section.worked-solution` with its own `h3.ws-heading` after the parts.

Print pages

- `<body class="print-page">`, `<meta name="robots" content="noindex">`, no header navigation, no buttons except one "Print this page" button (hidden when printing). Structured parts get `div.answer-lines[data-lines="<n>"]`.

## Conventions

- TypeScript strict. No `any` without a comment.
- No external requests from site code: fonts are bundled, no CDN scripts, no analytics code in the repo. The only third-party script is Cloudflare Web Analytics' cookieless beacon (`static.cloudflareinsights.com`), which Cloudflare injects when analytics is enabled for the Pages project; the privacy page describes it.
- All client JavaScript lives in `<script>` tags inside the owning `.astro` component (Astro bundles them) or in `src/scripts/*.ts` imported from one. Target under 10 KB per page.
- `set:html` is only ever fed by `mdBlock` / `mdInline` output or by `applyChem` / `applyPowers` output. Never by raw content.
- Commit messages: short imperative, e.g. "Add content parser with validation".

## Implementation decisions

- Tier filter: **All / Core only / Supplement only**, with a one-line hint "Extended candidates are examined on Core and Supplement content, so keep All."
- MCQ "x / y correct" counts only questions answered by clicking an option; opening the answer without answering does not count.
- The sub-topic filter is a native `<select>` because some topics have eight sub-topics.
- The syllabus map JSON is not read at build time; topic and sub-topic names come from the content files themselves (they match the map).


## Subjects (v1.1.0)

`SUBJECTS` contains Chemistry 0620, Biology 0610 and Physics 0625. Shared `[subject]` routes call `subjectTopics(subject)` and carry the subject through topic grids, question articles, print articles and PDF downloads. Existing Chemistry and Biology URLs and anchors are unchanged. Every subject receives qualification-specific titles, descriptions, canonical URLs and sitemap entries. Print routes remain noindex and excluded from sitemaps.

The loader reads only approved `questions.md` / `markscheme.md` files from `<contentSubpath>/<batchPrefix>T<NN>_…` folders. Each batch is validated before merging, then the merged collection is validated. Validation is structural: every batch parses, every `## Q<n>` has a mark-scheme entry and vice versa, ids are unique, part marks sum to the question's marks, MCQs have options A–D and an answer. No exact topic or question total is required, because the pipeline may withhold questions. Topic `batchIds` retain all source batches; questions retain `batchId`, `part`, number and stable ID. Multi-part topics (Biology 14, 16, 17; Physics 1–4) merge in numeric part order and get one `section.part-group` per part on the topic page. With `anchor: 'id'` the full source ID creates article IDs and the `-stem` / `-answer` suffix IDs, with matching option labels, answer controls and report URLs.

The mark-scheme parser accepts `**(c)** **(i)** [1]` as the same head as `**(c)(i)** [1]` (one Physics batch, 0625_T03_P2, writes sub-part heads that way).

PDF filenames include each subject's path; Chemistry filenames are unchanged. A shared manifest lists every PDF with subject, batch membership, integrity digests and sizes. The Chromium-free guard hashes every subject's source files, including every part of merged topics. PDFs are generated from final website print pages with watermark and numbered footers. Review PDFs in the pipelines are not copied into public output.
