# Biology 0610 handoff — 18 October 2026

## Current owner scope

Work on topics **1–10 only** for this handoff. Prepare separate question and mark-scheme PDFs.
The owner explicitly confirmed: **use the existing approved versions and make PDFs**. Reuse their
completed solver/verifier stages; a new independent solve or verification is not requested.
Do not generate topics 16–21 or extend this task to topics 11–21 without the owner's instruction.

## Existing evidence, not a new verification

The ten batches `0610_T01_P1_20261013` through `0610_T10_P1_20261013` already reside in
`../batches/04_approved/`. Together they contain **220 questions**: 110 MCQ and 110 structured.
Each includes `solver_answers.md`, `verifier_answers.md` and `verification.md`.

The records identify Claude Sonnet 5.5 as solver and Claude Fable 5.1 as verifier, with
`batch_route: PUBLISHED` and `sampled: no`. This handoff inspected those records; it did **not**
perform a new blind solve or scientific verification. Do not describe exporting PDFs as verifying
their answers. Do not overwrite the original solve/verify records or claim that Codex wrote them.

Topics 1–6, 8 and 10 contain 20 questions each; topics 7 and 9 contain 30 each.

## PDF export

From the repository root, with the website's npm dependencies and Playwright Chromium installed:

```powershell
node question-pipeline/subjects/0610-biology/review/export-pdfs.mjs
```

This reads the approved `questions.md` and `markscheme.md`, retains question numbers and stable
IDs, and creates **20 PDFs** in `pdfs/`: questions and mark scheme for each of topics 1–10.
The export completed on 18 October 2026: 20 PDFs, approximately **2.08 MB** in total.
The questions PDFs include answer lines; mark schemes include all published answer material.
Both have the Topical Hub watermark, host from `Website/src/config.ts`, A4 pages and page numbers.
`pdfs/manifest.json` records source hashes, output hashes and sizes so the export is traceable.
The files say final owner review is pending. Their presence is not website publication or approval
of a new verification pass.

If a sandbox points Playwright at an empty browser cache, set `PLAYWRIGHT_BROWSERS_PATH` to the
existing browser installation before running the command. On this machine it is
`C:\Users\zaida\AppData\Local\ms-playwright`. No browser download is required when that cache exists.

The PDF layout has not been visually inspected; the owner can open the exported files locally.

## Next agent

1. Read the latest owner instructions and this handoff before changing anything. Check that
   another agent is not already editing the same batch.
2. If a **fresh** solve/verify is requested, use independent fresh contexts as required by
   `../../../agents/SOLVE.md` and `../../../agents/VERIFY.md`. A solver must not see the mark scheme;
   someone who already read it cannot claim a blind solve. Do not silently redo stages in the same
   context or invent solver/verifier outputs. Obtain the owner's authorisation for separate agent
   sessions if needed under the repository's agent restrictions.
3. Keep provenance of any new review separate from the historical Claude records. Log no answers,
   answer letters or numerical results. Append to `../logs/run_log.md`; never rewrite it.
4. Regenerate these PDFs if approved questions or mark schemes change.
5. Website integration remains a separate step: Biology is not in `Website/src/config.ts`'s
   `SUBJECTS` or the content loader. These review PDFs are outside `Website/public/` intentionally.

## Remaining subject status (outside this handoff)

- Topics 11–12: already pipeline-approved, 40 questions.
- Topics 13–15: four batches in `02_solved`, 100 questions; progress.json still says drafted.
- Topics 16–21: eight planned batches, 230 questions, not generated.
- Whole subject plan: 24 batches, 21 topics, 590 questions.

No new Biology batch was generated during this handoff. An initial formatter for the superseded
all-topics task was removed before use. No pipeline stage or approval status was changed.
