# BUILD_V1 — build Topical Hub v1 in one run

You are building v1 of **Topical Hub**, a static website of original, exam-style topical practice questions for Cambridge IGCSE Chemistry 0620, end to end, in one run. Work through this file as a workflow: phases with parallel agents where the work is independent, then adversarial verification, then a fix loop.

**Nobody will answer questions during this run.** Every decision you'd normally ask about is made below. Where this file is silent, choose the simpler option that ships sooner, write the choice down, and keep going. If something truly needs the owner (logging in to a host, creating an account, buying a domain), skip it, prepare everything around it, and list it in the final report.

---

## 0. Read first

1. `CLAUDE.md` (repo root): legal rules, the content contract, the v1 scope. Everything there still applies; this file adds detail and makes the open decisions.
2. `igcse-chem-pipeline/agents/FORMAT.md`: the file format, especially "Published output".
3. `igcse-chem-pipeline/config/syllabus_map.json`: topic and subtopic names and `tier_notes`.
4. Open at least three real batches in `igcse-chem-pipeline/pipeline/04_approved/` (e.g. T01, T05, T11) before writing the parser. The real files beat the spec.

**`igcse-chem-pipeline/` is read-only for this whole run.** Never edit, move or reformat anything in it. If you find a content defect, list it in the final report with the question id; don't fix it.

---

## 1. Non-negotiable rules

- **Never "past papers".** The phrase must not appear in any `<title>`, meta tag, heading, URL, slug, alt text, button, link text or navigation. The only allowed use is one sentence on the About page saying these are *not* past papers. Enforce this with a build-time check (section 9).
- No Cambridge logos or branding, and nothing implying endorsement. Naming the qualification ("Cambridge IGCSE Chemistry 0620") to say what the questions are for is fine. The footer on every page says: "Topical Hub is independent and is not affiliated with or endorsed by Cambridge University Press & Assessment."
- Never copy or publish the syllabus PDF or any Cambridge document.
- **Honest authorship.** Never claim questions were written or checked by examiners, teachers or humans. The About page says plainly that the questions are original, written and checked with AI tools, and that students should report anything that looks wrong.
- No accounts, no backend, no database, no cookies, no analytics, no ads in v1.

---

## 2. Stack (decided)

- **Astro**, latest stable, static output, TypeScript. The project lives in `Website/`, and the build output is `Website/dist/`.
- No UI framework. Interactivity is small vanilla TypeScript, shipped only where needed, under about 10 KB of JS per page.
- Plain CSS with custom properties, in one design-token file plus component styles. No Tailwind and no CSS framework.
- Markdown rendering: one well-known library with GFM tables (e.g. `marked`, or `remark` + `rehype`), with **raw HTML disabled and all text escaped**. Real content contains `<` as text (e.g. "gas < liquid < solid").
- Tests: `vitest`. Browser checks: Playwright with Chromium (`npx playwright install chromium` is fine).
- npm. Pin the Node version in `Website/.nvmrc` (current LTS) and set `"engines"` in `package.json`.
- Few dependencies. Justify each one in the final report.

---

## 3. Content loading (build time)

Source: `../igcse-chem-pipeline/pipeline/04_approved/*/` relative to `Website/`. Resolve the path from the project root so it works locally on Windows **and** on the Cloudflare Pages build machine, which clones the whole repo. Read only `questions.md` and `markscheme.md`, and ignore every other file there.

Write the parser as its own module (`src/content/`) with unit tests. Facts about the real files:

- 12 batch folders, `T01_…` to `T12_…`. Each file is YAML frontmatter (`batch_id`, `topic_id`, `topic_name`, …) and then `## Q<n>` blocks.
- **Numbering can have gaps.** Pair each question with its mark scheme entry by its `## Q<n>` heading, never by position.
- **Metadata** is the contiguous block of `- key: value` lines directly after the `## Q<n>` heading, ending at the first blank line. The keys are `id`, `type` (`mcq`|`structured`), `tier` (`core`|`supplement`), `subtopic_id`, `subtopic_name`, `syllabus_points` (a JSON-style array), `difficulty` (1–3), `marks`, `needs_diagram`. Values may be quoted strings. **Don't read `- word: value` lines later in the question text as metadata.** T05 has a stem with `- respiration: …` and `- photosynthesis: …` bullet lines.
- The question text is everything after the `**Question**` line.
- **MCQ options come in two shapes** and both must work:
  1. Plain lines `A text` … `D text` on consecutive lines.
  2. A Markdown table whose **first column is the option letter**. The header row's first cell is blank, and the other header cells are attributes. 20 MCQs use this shape (e.g. T01 Q1, T07 Q1/Q5/Q11, T10 Q2/Q3/Q5). Render the table, and make each row a selectable option.
- Structured questions have parts `(a)`, `(b)`, … each ending in `[n]`. Part marks sum to `marks`.
- **`markscheme.md`**:
  - MCQs have `- answer: X`, then `**Rationale**`. 150 of 180 MCQs also have `**Worked solution**`; show it when present, otherwise show the rationale.
  - Structured questions have part heads like `**(a)** [2]`, followed by bullet marking points ending in `(1)` or `(n)`. There may be bullets starting `ALLOW`, `REJECT`, `IGNORE` or `ECF`, which are real mark-scheme conventions; show them, styled distinctly. Every structured question ends with `**Worked solution**`.
- Formulae are plain text: `H2SO4`, `Cu2+`, `SO4 2−`, `cm3`, `dm3`. Tables are GFM. There are no images.

**Build-time validation (fail the build on any violation):** 12 topics; 360 questions in total; every question has a mark scheme entry and vice versa; every MCQ has exactly options A–D and an answer in A–D; every structured question's part marks sum to `marks`; every question has a worked solution or rationale; no `needs_diagram: true` question is published. Print a one-line summary on success.

### Chemistry formatting (display only, behind a kill switch)

Plain `H2SO4` looks amateurish, but a wrong transformation is worse. Implement `formatChem()` as a pure, unit-tested function, applied to rendered text nodes only, never inside code or URLs. Put `CHEM_FORMATTING` in the site config, default `true`:

- Subscript digits that directly follow a real element symbol (validate against the full element list) or a closing `)`, inside a formula-like token: `H2SO4` → H₂SO₄, `Ca(OH)2` → Ca(OH)₂, `C6H12O6`.
- Leading coefficients stay normal: `2H2O` → 2H₂O.
- Ion charges at the end of a formula token become superscripts: `Cu2+`, `Fe3+`, `Na+`, `Cl−`, `SO4 2−` → SO₄²⁻.
- Units: `cm3` → cm³, `dm3` → dm³.
- Must **not** change: question references (`Q16`, `T04`), part labels, mark brackets `[2]`, plain numbers, `pH 7`, temperatures, times, isotope notation already in Unicode, or English words.

Write at least 40 test cases taken from the real content, including tricky ones. If the tests can't be made to pass reliably, ship with `CHEM_FORMATTING = false` and say so in the report.

---

## 4. Pages and URLs

Site name **Topical Hub**. URLs leave room for more subjects later:

| Page | URL |
|---|---|
| Home | `/` |
| Subject home (the 12 topics) | `/igcse/chemistry-0620/` |
| Topic page | `/igcse/chemistry-0620/<topic-slug>/` (slug = kebab-case `topic_name`, e.g. `electrochemistry`, `acids-bases-and-salts`) |
| Printable questions | `/igcse/chemistry-0620/<topic-slug>/print/` |
| Printable mark scheme | `/igcse/chemistry-0620/<topic-slug>/print-answers/` |
| About | `/about/` |
| Privacy | `/privacy/` |
| 404 | `/404` |

Each question has a stable anchor `#q<n>`, e.g. `/igcse/chemistry-0620/electrochemistry/#q16`.

- **Home:** the name, a one-line description ("Free exam-style topical questions for IGCSE Chemistry 0620, with mark schemes and worked solutions"), a clear route to the 12 topics, and an honest short note on what the questions are. With only one subject, the home page can show the 12 topics directly as well as linking to the subject page.
- **Subject home:** 12 topic cards, each with its number, name, question count and MCQ/structured split.
- **Topic page:**
  - Header with the topic name and counts.
  - Filters: **tier** (All / Core only / Extended — note that Extended means Core + Supplement, see `tier_notes`), **type** (All / Multiple choice / Structured) and **subtopic**. Filtering is client-side via data attributes; with JS off, everything shows.
  - Questions in file order, each as a card containing:
    - number, marks, a tier badge (Core / Supplement) and the subtopic name
    - the question text
    - **MCQ:** selectable options. Picking one marks it right or wrong at once and reveals the explanation. There's also a "Show answer" button. A small "x / y correct" counter on the page is kept in memory only (no storage).
    - **Structured:** "Show mark scheme" reveals the marking points per part, then the worked solution. Students try first, so answers are hidden by default.
    - a **"Report an error"** link (section 6)
  - Links to the two print pages.
- **Print pages:** questions without answers, with ruled answer space under each structured part sized by its marks, and a separate mark-scheme page. Print CSS: no navigation or buttons, a question never splits across pages, a topic title on the first page.
- **About:** what the site is; that these are original exam-style questions, not past papers; that they're written and checked with AI tools; how to report an error; that it isn't affiliated with Cambridge.
- **Privacy:** short and true: no accounts, no cookies, no analytics.

---

## 5. Design direction

Read and follow the `frontend-design` skill if it's available. The site should feel like **a calm, well-typeset exam booklet that became a fast web app**, not a template.

- Readability first. Questions are long and full of tables and formulae. Aim for body text of about 17–18 px, line-height 1.6, a line length of 60–75 characters, and strong spacing between parts.
- One distinctive but restrained typographic choice for headings; a highly legible face for body text. Self-host any web font (no third-party requests) or use a good system stack.
- One accent colour. **Avoid the generic AI look:** no purple-blue gradients, glassmorphism, emoji icons, stock illustrations or floating blobs.
- Light and dark themes, following `prefers-color-scheme`, plus a small toggle (the choice may go in `localStorage`, wrapped in try/catch).
- **Mobile first**: most students will be on phones. Tap targets at least 44 px, tables scroll horizontally inside their card and never stretch the page, no horizontal page scroll at 360 px wide.
- Accessibility: WCAG AA contrast in both themes, visible focus states, real `<button>`s, `aria-expanded` on toggles, option groups operable by keyboard, a skip link, proper heading order, `lang="en"`.
- Correct and wrong MCQ states must not rely on colour alone (use an icon or text as well).

---

## 6. Error reporting

All in one place, `src/config.ts`:

- `REPORT_FORM_URL`, empty by default. When it's set (a Google Form the owner will create later), the "Report an error" link opens it with the question id and page URL pre-filled. Document the prefill parameter pattern in a comment.
- **Fallback while it's empty:** link to a pre-filled new GitHub issue on the public repo: `https://github.com/zaid-aamir/topical-hub/issues/new?title=<encoded "Error in <question id>">&body=<encoded page URL + "What's wrong:">`.
- Open in a new tab with `rel="noopener"`.

---

## 7. SEO

- `site` in `astro.config` comes from one config value, defaulting to `https://topical-hub.pages.dev`, and is easy to change when a domain is bought.
- Titles: `Electrochemistry — IGCSE Chemistry 0620 exam-style questions with answers | Topical Hub`, and the same pattern for every topic. A unique meta description per page that names the topic, the question count and that answers and worked solutions are included.
- Canonical URLs, Open Graph and Twitter tags, `@astrojs/sitemap`, `robots.txt` that allows everything and links the sitemap, `noindex` on the print pages.
- One `<h1>` per page and proper heading order. The question text is real HTML in the page source, not injected by JS.

---

## 8. Deployment (prepare only; the owner clicks the buttons)

Host: **Cloudflare Pages**. The free tier allows commercial use, which matters because ads are planned.

- Make the build work with Cloudflare's settings: root directory `Website`, build command `npm run build`, output directory `dist`, Node version from `.nvmrc` (or a `NODE_VERSION` variable, documented). Confirm the content path resolves when the build runs from `Website/` in a fresh clone (simulate this: clone the repo into a temp folder and build there).
- Write `Website/DEPLOY.md`: numbered, click-by-click steps to connect the GitHub repo in the Cloudflare dashboard, the exact settings to enter, how to add a custom domain later, and what to change in `src/config.ts` afterwards.
- **Don't** log in to Cloudflare or run anything that needs credentials.

---

## 9. Verification (none of this is optional)

Run these as independent checks, in parallel where possible, by agents that didn't write the code they're checking. Then fix and re-run until everything passes or two rounds make no progress.

1. `npm run build` succeeds from a clean install, and the content validation prints 360 questions across 12 topics.
2. `npm test` passes: parser tests (both MCQ shapes, metadata edge cases, gaps in numbering, escaping of `<`) and `formatChem()` tests.
3. **Per-topic render audit, 12 agents, one per topic:** compare every question on the built topic page against its source files. Report any missing text, broken tables, wrong or missing options, wrong answer letter, missing marking points, a missing worked solution, or a garbled formula. Zero findings is the goal; each finding gets fixed in the site code, not in the content.
4. **"Past paper" check:** a script over `dist/` fails the build if "past paper" (case-insensitive) appears anywhere except the one allowed sentence on `/about/`.
5. **Browser checks with Playwright** on the preview server:
   - screenshot the home page, the subject page, one MCQ-heavy and one table-heavy topic page, and a print page, at 360 px and 1280 px wide, in light and dark themes
   - check: no horizontal scroll at 360 px; no console errors; clicking an MCQ option reveals the explanation; "Show mark scheme" works and sets `aria-expanded`; filters hide and show the right cards; the theme toggle works
   - save the screenshots to `Website/test-results/screenshots/`, which is gitignored
6. **Accessibility:** run axe (via `@axe-core/playwright`) on the home page, subject page, a topic page and a print page. No serious or critical violations.
7. **Internal link check** over `dist/`: no broken internal links or anchors.
8. **Design review:** one agent looks at the screenshots against section 5 and lists concrete problems (spacing, contrast, overflow, anything that looks templated). Fix the top issues.
9. **Legal and labelling review:** one agent reads every page template and the About, Privacy and footer copy against section 1.

---

## 10. Git

- Work on `main`. Commit in small, working steps with clear messages, e.g. "Add content parser with validation", "Add topic pages", "Add print views". Push to `origin` at milestones and at the end.
- Never commit `node_modules/`, `dist/`, `.astro/`, `test-results/` or any secret. Add the website's own `.gitignore` entries if needed.
- Never touch `igcse-chem-pipeline/`.

---

## 11. Final report (your last message)

Keep it short and concrete:

1. What was built: pages, features, and the URL of every page type.
2. How to run it locally (Windows PowerShell): `cd Website`, `npm install`, `npm run dev`, then open the URL shown.
3. Results of every check in section 9, with numbers.
4. Dependencies added and why.
5. **What the owner has to do next**, as numbered steps: deploy via `DEPLOY.md`, create the Google Form and set `REPORT_FORM_URL`, choose a domain.
6. Content defects found, listed by question id. The site code wasn't at fault for these, and you didn't edit them.
7. Known limitations and the three most valuable improvements for v1.1.
