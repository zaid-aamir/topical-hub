# Topical Hub v1 — delivered scope and maintenance

This replaces the original one-run build prompt. The site is implemented; do not rebuild it from this document. Root `AGENTS.md` and `CLAUDE.md` govern legal rules, pipeline ownership, Git and verification.

## Delivered scope

- Static Astro output, strict TypeScript, plain CSS and small vanilla client scripts; no UI framework, backend, accounts, database, ads or analytics.
- Original exam-style questions for Cambridge IGCSE Chemistry 0620, syllabus 2026–2028: 12 topics, 360 questions (180 MCQ and 180 structured).
- Home page with subject selection; Chemistry subject page with topic cards. Counts are computed at build time. Biology is also connected: 21 topics, 24 owner-approved batches, 590 questions. Physics remains unconnected.
- Topic pages with tier, type and subtopic filters, one-attempt MCQ marking and a session-only score, hidden answer panels, worked solutions and error-report links.
- Separate question and mark-scheme print pages, ruled structured-answer space and 66 downloadable watermarked PDFs (24 Chemistry, 42 Biology).
- Light/dark themes, locally bundled fonts, skip link, keyboard controls and responsive table wrappers.
- Unique topic metadata, canonical URLs, sitemap and robots.txt; print pages are noindex and excluded from the sitemap.
- About, Privacy and 404 pages; honest AI-authorship copy and the independence disclaimer.

See `CONTRACT.md` for routes, anchors, data model and DOM selectors; `DESIGN.md` for visual rules; `README.md` for the source map and commands.

## Content boundaries

Read only approved Chemistry and Biology `questions.md` and `markscheme.md` files at build time. Match entries by `## Q<n>`, never by position. Preserve source ids, subtopic ids, tiers and marking conventions. Raw Markdown HTML is escaped. Chemistry typography is display-only and controlled by `CHEM_FORMATTING`.

The build validates Chemistry's 12 topics and 360 questions plus Biology's 21 topics and 590 questions, MCQ options and answers, mark-scheme pairing, structured marks, explanations and diagram exclusions. The output gate checks labelling, internal resources and links, anchors, headings, language, print noindex and sitemap consistency.

Neither pipeline is editable as part of website maintenance. Follow the root brief for an explicitly requested question correction.

## Current implementation details and limits

- Question URLs use `#q<n>`; the source id is a data attribute and part of the pre-filled report. Full-id anchors from the original brief have not been implemented. Keep existing links working during any future migration.
- Tier buttons are All, Core only and Supplement only. Extended candidates need both tiers.
- Without JavaScript, questions and answers remain visible and inactive filters/toggles are hidden.
- `REPORT_FORM_URL` is empty, so reporting opens a pre-filled GitHub issue. The owner can configure a Google Form in `src/config.ts`.
- `SUBJECTS` supports the home-page structure, but new subjects also need content dispatch and routes. Chemistry migration is separate work.
- Footer version comes from `package.json`. Production origin is configured as `https://topical-hub.pages.dev`; local checks do not confirm deployment state.

## Maintenance workflow

1. Make changes directly in this working folder, preserving unrelated edits. Never create branches or worktrees, stage, commit or push; the owner handles Git writes.
2. For PDF-affecting changes, run `npm run pdfs` with Playwright Chromium installed. Review generated assets and leave them uncommitted. The freshness hash excludes `BaseLayout`, `tokens.css` and `global.css`; regenerate manually if they affect print output.
3. From `Website/`, run `npm run build` and `npm test` once. Fix reported failures; stop when both pass.
4. Run browser suites, screenshot sweeps, axe scans, render audits or reviewer agents only when the owner explicitly requests them. For visual-only checks, let the owner inspect `npm run dev`.
5. Report changes, verification results, material limitations, changed files and a suggested one-line commit message.

## Deployment

Cloudflare Pages settings: root `Website`, command `npm run build`, output `dist`, Node 24. The repository clone must include the Chemistry content alongside `Website/`. PDF generation is local; hosting only validates the existing assets. See `DEPLOY.md` for the owner's deployment steps and custom-domain configuration.
