# Biology 0610 publication handoff — 18 October 2026

## Owner approval

The owner explicitly stated: **They are all approved.** All **590 questions** across **21 topics**
and **24 batches** are approved for publication. Every batch now resides in `../batches/04_approved/`.
This supersedes the previous draft/solved status notes and the old topics-1–10 restriction.

`../owner-approval.json` records the owner's statement, each batch's previous stage, question
count and SHA-256 hashes of both source files. No new independent solver or verifier records
were invented. Historical Claude records are preserved for the batches that already had them.

- 260 questions already had historical pipeline approval.
- 100 questions previously in `02_solved` and 230 previously in `01_drafts` were promoted on
  the owner's explicit approval, without changing question or answer content.
- `../logs/progress.json` now marks all 24 batches approved; the run log records the owner decision.

## Publication files

Read only `questions.md` and `markscheme.md` in each approved batch when importing to the website.
Ignore solver answers, verifier answers and verification reports. Match question and answer blocks
by their `## Q<n>` headings; retain the full stable question ID.

The website unit test `Website/tests/unit/content/biology-approved.test.ts` uses its real parser to
check all 24 approved batches, 590 unique question IDs, matching mark schemes, metadata, MCQ
options and structured part marks. It is a format/import-readiness check, not a new science review.
All 325 website unit tests pass, including these 25 Biology import checks. Two formatting defects
in the historical T03 batch were corrected: four mark-scheme headings and two question subpart
continuation labels. Wording, answers, question numbers and marks were retained. Original approval
hashes remain in the approval record alongside current publication hashes.

Topics 14, 16 and 17 have two parts, with question numbers restarting within each part. A future
website importer must merge parts in numeric part order and use the full question ID for DOM
anchors, avoiding duplicate `q1` anchors across batches. The current live website loader and routes
still support Chemistry only; Biology content preparation is complete, website integration is next.

## PDFs

The `pdfs/` folder contains **42 watermarked A4 PDFs**: questions and mark schemes for all 21 topics.
The former draft/review-pending notices have been removed following owner approval. Each PDF
retains source IDs and part labels; question PDFs include answer space. Host names come from
`Website/src/config.ts` and footers show page numbers.

Regenerate after source changes or approval updates, from the repository root:

```powershell
node question-pipeline/subjects/0610-biology/review/export-pdfs.mjs
```

This exporter now accepts approved batches only and checks that each planned batch exists exactly
once. It does not publish files into the website. `pdfs/manifest.json` records source stages, input
hashes, PDF hashes and file sizes. If Chromium's cache is hidden by a sandbox, set
`PLAYWRIGHT_BROWSERS_PATH` to `C:\Users\zaida\AppData\Local\ms-playwright` on this machine.

The PDFs have not been visually inspected; the owner should open one before adding them to the site.

## Authoring provenance

The eight `_20261018` batches were written by GPT-6 (Codex), totalling 230 questions: 115 MCQ
and 115 structured, with rationales and worked solutions. Their original hand-authored records
are in `source/T*.txt`. `materialise-drafts.py` is a one-time formatting helper that skips existing
batches; approved Markdown is now authoritative. Do not regenerate approved content from these
initial authoring records or create duplicate draft batches.

The original subtopic allocations followed eligible learning-point counts proportionally:
T16_P1 5/7/18; T16_P2 13/8/9; T17_P1 30; T17_P2 6/3/21; T18_P1 16/5/9;
T19_P1 2/19/3/6; T20_P1 5/6/6/13; T21_P1 3/11/6. Essential-diagram points were excluded.

## Next agent

1. Treat the owner's approval as the publication decision; do not reopen approval stages unless asked.
2. Preserve source IDs, syllabus tags, parts and historical provenance during website integration.
3. Keep all question-pipeline files read-only during website work unless the owner requests a content fix.
4. Read `AGENTS.md` or `CLAUDE.md`; work in this folder and leave all changes uncommitted.
