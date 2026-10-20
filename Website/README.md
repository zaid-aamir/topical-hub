# Topical Hub website

Free, original exam-style topical practice questions for Cambridge IGCSE Chemistry 0620, Biology 0610 and Physics 0625 (2026–2028). Topical Hub is independent and is not affiliated with or endorsed by Cambridge University Press & Assessment.

## Published content

Counts as of v1.1.0 (2026-10-19). The site computes them from the loaded content on every build, and validation never requires a fixed total, because the pipeline may withhold questions.

| Subject | Topics | Approved batches | Questions | Downloadable PDFs |
|---|---:|---:|---:|---:|
| Chemistry 0620 | 12 | 12 | 360 | 24 |
| Biology 0610 | 21 | 24 | 590 | 42 |
| Physics 0625 | 6 | 14 | 420 | 12 |

The home page lists every subject in `SUBJECTS` with counts computed from loaded content. Subject pages list topic cards. Every topic reuses tier/type/subtopic filters, MCQ marking, answer panels, worked solutions, breadcrumbs and error reports. Scores last only for the page session. All questions are original, written with AI tools and approved by the owner; Biology and Physics approval does not claim a new independent science review.

Production origin: <https://topical-hub.pages.dev>. This documents the local implementation, not deployment status. See `DEPLOY.md` for hosting.

## Run and verify

Node 24 recommended; engines require >=22.18, because the Node scripts import `src/config.ts` directly (type stripping). From `Website/`:

```powershell
npm install
npm run dev
```

Use `npm.cmd` if PowerShell blocks `npm.ps1`. The whole repository is required because content lives outside `Website/`.

After changes, run `npm run build` and `npm test` once. The build first checks PDF freshness without Chromium, then validates content and builds Astro, then checks output labelling, links, anchors, headings, print noindex and sitemap consistency. Vitest covers the parser, every subject, merging, anchors, formatting, Markdown and PDF guards. Run `npm run check` for explicit type checking when needed. Browser suites, screenshots, axe, link crawls and `audit:render` are opt-in only; do not run them for routine maintenance.

For PDF-affecting changes, run `npm run pdfs` before the normal build and test commands. It builds the final website print routes and uses Playwright Chromium to create 78 A4 PDFs in `public/pdfs/` (two per topic of every subject), with the site watermark and Page X of Y footer. If Chromium is installed but hidden from the shell, set `PLAYWRIGHT_BROWSERS_PATH` to its local installation directory. Missing Chromium can be installed with `npx playwright install chromium`.

The generator writes `public/pdfs/manifest.json`, including source hashes, PDF hashes, byte sizes, subject paths and constituent batches. Download links read file sizes from this manifest. The subsequent normal build refreshes link labels using the generated manifest. `scripts/pdf-manifest.mjs` hashes every subject's approved source, shared print routes/components, parser, formatting, config, layout/styles and generator. Cloudflare's stale-PDF guard uses only Node, not Chromium. Generated PDFs and manifest stay available for the owner to review and commit. Assistants never stage, commit or push.

`npm run preview` serves built output on <http://127.0.0.1:4321/>. Visual layout and generated PDFs should be reviewed by the owner; no screenshot audit is part of routine checks.

## Source boundaries

At build time, read only `questions.md` and `markscheme.md` in:

- `../igcse-chem-pipeline/pipeline/04_approved/`
- `../question-pipeline/subjects/0610-biology/batches/04_approved/`
- `../question-pipeline/subjects/0625-physics/batches/04_approved/`

Each folder can be overridden with its subject's `contentDirEnv` variable (`CONTENT_DIR`, `BIOLOGY_CONTENT_DIR`, `PHYSICS_CONTENT_DIR`). Ignore solver/verifier files and reports. Do not change any pipeline or approval records during website maintenance. Match question and mark scheme blocks by `## Q<n>` within each batch, never by position. Validation is structural: every batch parses, every question has a mark-scheme entry and vice versa, ids are unique, part marks sum to the question's marks, and MCQs have options A–D and an answer. Validate batches before merging. Multi-part topics (Biology 14, 16 and 17; Physics 1, 2, 3 and 4) combine their batches in numeric part order; local question numbers restart and must stay unchanged. The topic page shows a heading per part and retains full source IDs, batch IDs, syllabus tags and subtopics.

Display formatting is per subject: `chemFormatting` (H2SO4 → H₂SO₄, Chemistry only) and `powerFormatting` (a caret followed by an optional minus and digits becomes a superscript: m^3 → m³, 10^-7 → 10⁻⁷; Biology and Physics). A caret followed by anything else, such as nuclide notation `^A_Z X`, stays as written.

Chemistry links retain `/igcse/chemistry-0620/<slug>/#q<n>`. Biology and Physics use `/igcse/<subject>/<slug>/#<full-source-id>`, consistently for question articles, stem/answer IDs and error reports. Print pages use the same question anchor rule and are noindex, excluded from sitemaps. Error reports use prefilled GitHub issues while `REPORT_FORM_URL` is empty.

## Code map

- `src/config.ts`: `SUBJECTS`, one entry per subject with its names, URL path and content settings; public origin, disclaimer, reporting configuration. Node scripts import it directly.
- `src/content/`: parser, structural validation, multi-batch topic merge and the per-subject cached loader `loadSubjectTopics`.
- `src/lib/subjects.ts`: subject lookup and computed counts.
- `src/lib/question-anchor.ts`: stable anchor policy (`Subject.anchor`).
- `src/lib/markdown.ts`, `src/lib/chem/`, `src/lib/power.ts`: safe Markdown and per-subject formatting (`subjectFormat`).
- `src/pages/igcse/[subject]/`: shared subject, topic, print and print-answers routes.
- `src/components/question/`: shared interactive and print question UI; explicit subject/formatting props.
- `src/lib/pdfs.ts`, `scripts/pdf-manifest.mjs`, `scripts/generate-pdfs.mjs`, `scripts/check-pdfs.mjs`: downloads, manifests, generation and freshness.
- `scripts/check-dist.mjs`: post-build output gate.
- `tests/unit/`: proportionate unit checks; `tests/e2e/` and `scripts/audit-render.mjs` are owner-requested tools only.

## Adding a subject

Add one entry to `SUBJECTS` in `src/config.ts` (path, names, syllabus years, description, `contentSubpath`, `contentDirEnv`, `batchPrefix`, `anchor`, `chemFormatting`, `powerFormatting`). Run `npm run pdfs`, then `npm run build` and `npm test`. No other code changes are needed; routes, the home page, sitemap, PDFs and checks loop over `SUBJECTS`.

See `CONTRACT.md` for route and DOM details and root `AGENTS.md` / `CLAUDE.md` for ownership rules.
