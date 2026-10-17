# Topical Hub

Original, exam-style topical practice questions for Cambridge IGCSE Chemistry 0620 (2026–2028). **Not past papers** — never describe them as past papers.

- `igcse-chem-pipeline/` — the question pipeline and the content. Start with `igcse-chem-pipeline/README.md`.
- `Website/` — the website. It reads only `igcse-chem-pipeline/pipeline/04_approved/<batch_id>/questions.md` and `markscheme.md`; the format is in `igcse-chem-pipeline/agents/FORMAT.md` ("Published output").
- `question-pipeline/` — the separate Biology 0610 and Physics 0625 pipeline; not connected to the website yet. Both pipelines are owned by the managing chat and are read-only for website work.
- `AGENTS.md` and `CLAUDE.md` — project rules for coding assistants. The owner reviews and commits changes.

The Astro website is implemented: the home page lists subjects, Chemistry has 12 topics and 360 questions, and each topic includes interactive answers, filters, print pages and downloadable PDFs. Only Chemistry is currently published.

Start with [Website/README.md](Website/README.md) for local commands and the source map, [Website/CONTRACT.md](Website/CONTRACT.md) for implementation details, and [Website/DEPLOY.md](Website/DEPLOY.md) for deployment settings. [Website/BUILD_V1.md](Website/BUILD_V1.md) records the delivered scope and maintenance workflow.

```powershell
cd Website
npm install
npm run dev
```

After changes, run `npm run build` and `npm test` once from `Website/`. Browser suites and render audits are opt-in; see the project briefs.
