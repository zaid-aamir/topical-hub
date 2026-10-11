# Topical Hub — code contract (v1)

Shared agreements between the modules so they can be built in parallel. The data model is `src/content/types.ts`; the site configuration is `src/config.ts`; the visual language is `DESIGN.md`. Read all three before writing code.

## Module ownership

| Path | Owner | Exports / purpose |
|---|---|---|
| `src/content/` | parser | `loadAllTopics(): Topic[]` (cached, sorted by topic number), `parseQuestionsFile`, `parseMarkschemeFile`, `validateTopics`, `slugify`. Reads only `questions.md` and `markscheme.md`. Throws `ContentError` on any contract violation so the build fails. Prints one summary line on success. |
| `src/lib/markdown.ts` | chem/markdown | `mdBlock(md: string): string` (block-level Markdown to HTML, GFM tables wrapped in `<div class="table-scroll">`), `mdInline(md: string): string` (inline Markdown to HTML, no `<p>`). Raw HTML is never passed through: `<`, `>` and `&` in text are escaped. Applies `applyChem` to text nodes when `CHEM_FORMATTING` is true. |
| `src/lib/chem/` | chem/markdown | `formatChem(text: string): string` pure text to text (Unicode sub/superscripts); `applyChem(html: string): string` applies it to text nodes of an HTML string, skipping the inside of `<code>`, `<pre>`, `<a>`, `<script>`, `<style>` and never touching tags, attributes or entities. `ELEMENTS` full symbol list. |
| `src/styles/` | design | `tokens.css` (custom properties, light and dark), `global.css` (reset, type, layout primitives, components shared across pages), `print.css` (print-page rules). |
| `src/layouts/BaseLayout.astro` | design | Props: `title`, `description`, `canonicalPath` (e.g. `/about/`), `noindex?: boolean`, `bodyClass?: string`, `ogType?`. Renders `<html lang="en">`, the `<head>` (charset, viewport, title, description, canonical, OG, Twitter, theme-color, favicon, fonts, early theme script), skip link to `#main`, `<SiteHeader>`, `<main id="main">` slot, `<SiteFooter>` with `DISCLAIMER`. |
| `src/components/SiteHeader.astro`, `SiteFooter.astro`, `ThemeToggle.astro` | design | Header: wordmark link to `/`, link to the subject page, theme toggle. Footer: disclaimer sentence, links to About, Privacy and the GitHub repo. |
| `src/pages/about.astro`, `privacy.astro`, `404.astro`, `robots.txt.ts` | design | Static copy per BUILD_V1 §1 and §4. robots.txt allows everything and links `${SITE_URL}/sitemap-index.xml`. |
| `src/pages/index.astro` | home | Home page. |
| `src/pages/igcse/chemistry-0620/index.astro` | home | Subject home with the 12 topic cards. |
| `src/pages/igcse/chemistry-0620/[slug]/index.astro` | topic | Topic page. |
| `src/pages/igcse/chemistry-0620/[slug]/print.astro`, `print-answers.astro` | topic | Print pages. |
| `src/components/question/*` | topic | `QuestionCard.astro`, `McqOptions.astro`, `StructuredParts.astro`, `MarkScheme.astro`, `AnswerPanel.astro`, plus the client scripts. |
| `scripts/check-dist.mjs` | ops | Post-build checks over `dist/`: "past paper" scan, internal link and anchor check, noindex on print pages, exactly one `<h1>` per page, `lang="en"`. Exits non-zero on failure. |
| `scripts/audit-render.mjs` | ops | Per-topic render audit: compares the words of every source question and mark scheme with the text of the built topic page and print pages; prints missing words per question id. |
| `tests/unit/**` | each module | Vitest. The parser's real-content test loads all 12 batches and asserts 360 questions each with a mark scheme entry. |
| `tests/e2e/**` | ops | Playwright specs: behaviour checks, screenshots to `test-results/screenshots/`, axe scans. |
| `DEPLOY.md`, `README.md` | ops | Cloudflare Pages click-by-click guide; how to run locally. |

Nobody edits a file they do not own without saying so in their report. Nobody edits anything in `../igcse-chem-pipeline/`.

## URLs

| Page | Path |
|---|---|
| Home | `/` |
| Subject home | `/igcse/chemistry-0620/` |
| Topic | `/igcse/chemistry-0620/<slug>/` |
| Printable questions | `/igcse/chemistry-0620/<slug>/print/` |
| Printable mark scheme | `/igcse/chemistry-0620/<slug>/print-answers/` |
| About | `/about/` |
| Privacy | `/privacy/` |
| 404 | `/404` (`dist/404.html`) |

`slug` = `slugify(topicName)`: lower-case, letters and digits kept, every other run of characters becomes one hyphen, no leading or trailing hyphen. "Acids, bases and salts" -> `acids-bases-and-salts`. Question anchors are `#q<n>` using the question number.

Titles: `<Topic name> — IGCSE Chemistry 0620 exam-style questions with answers | Topical Hub`. Never the phrase "past paper" anywhere except one sentence on the About page.

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
- Each question is `article.question#q<n>` with `data-question-id`, `data-tier`, `data-type`, `data-subtopic`, `data-number`. Filtering sets or removes the `hidden` attribute. With JavaScript off, nothing is hidden.
- Score line (MCQ only) `p[data-score][role="status"]` near the filters, e.g. "3 / 5 correct", kept in memory only.
- MCQ options: container `div.options[role="group"][aria-labelledby]`; each option is `button.option[data-letter="A".."D"][aria-pressed="false"]`. For table-shaped options the container is a `table.options-table` and each `tr.option-row[data-letter]` contains the `button.option` in its first cell; clicking anywhere in the row activates the button. After answering: the card gets `data-answered="correct"|"wrong"`, the chosen option gets `data-state="correct"|"wrong"`, the right option gets `data-state="correct"`, all options get `disabled`, and `p.feedback[role="status"]` is filled with "Correct" or "Not quite. The answer is C".
- Answer toggle: `button.toggle-answer[aria-expanded="false"][aria-controls="q<n>-answer"]` labelled "Show answer" (MCQ) or "Show mark scheme" (structured); the label flips to "Hide …" when open. The panel is `div.answer#q<n>-answer[hidden]`. Selecting an MCQ option also opens the panel.
- Report link: `a.report-link[target="_blank"][rel="noopener noreferrer"]` built with `reportErrorUrl(id, absoluteUrlWithAnchor)`.
- Mark scheme: `section.markscheme` with one `div.ms-part` per `MarkSchemePart` (heading `(a)` / `(b)(i)` and `[n]`), `ul.ms-points` with `li.ms-point[data-kind="point"|"allow"|"reject"|"ignore"|"ecf"]`, and `section.worked-solution` after the parts.

Print pages

- `<body class="print-page">`, `<meta name="robots" content="noindex">`, no header navigation, no buttons except one "Print this page" button (hidden when printing). Structured parts get `div.answer-lines[data-lines="<n>"]`.

## Conventions

- TypeScript strict. No `any` without a comment.
- No external requests at runtime: fonts are bundled, no analytics, no CDN scripts.
- All client JavaScript lives in `<script>` tags inside the owning `.astro` component (Astro bundles them) or in `src/scripts/*.ts` imported from one. Target under 10 KB per page.
- `set:html` is only ever fed by `mdBlock` / `mdInline` output or by `applyChem` output. Never by raw content.
- Commit messages: short imperative, e.g. "Add content parser with validation".

## Decisions made where BUILD_V1 was silent or weak

- Tier filter: BUILD_V1 lists "All / Core only / Extended" and notes Extended means Core + Supplement, which makes Extended identical to All. We ship **All / Core only / Supplement only**, with a one-line hint "Extended candidates are examined on Core and Supplement content, so keep All." Supplement-only is what Extended students actually want to drill.
- MCQ "x / y correct" counts only questions answered by clicking an option; opening the answer without answering does not count.
- The sub-topic filter is a native `<select>` because some topics have eight sub-topics.
- The syllabus map JSON is not read at build time; topic and sub-topic names come from the content files themselves (they match the map).
