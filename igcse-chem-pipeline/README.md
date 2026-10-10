# IGCSE Chemistry 0620 (2026–2028): Original Question Pipeline (v4, speed mode)

A production line for **original, exam-style topical questions** for Cambridge IGCSE Chemistry 0620 (exams in 2026, 2027, 2028). These are NOT past papers and must never be described as past papers.

**Priority: speed over accuracy.** Nothing waits for a human. Every question the verifier can confirm or repair is published; the rest are withheld and can be regenerated. Errors found later (via the site's "report an error" button) are fixed by editing or regenerating.

A batch is **one whole topic**: 30 questions (15 multiple choice + 15 structured), spread across the topic's sub-topics in proportion to their learning-point counts. Every question records its own `subtopic_id`, so topic pages can later be split into sub-topic pages without regenerating.

---

## The pipeline

```
[01 Generator]   one whole topic → pipeline/01_drafts/<batch_id>/questions.md + markscheme.md
      │
[02 Solver]      blind (never sees the mark scheme) → solver_answers.md, moves batch → 02_solved
      │
[03 Verifier]    blind-solves first (verifier_answers.md), then compares with mark scheme + solver,
      │          fixes what it can in place (including a wrong answer, when it and the solver agree)
      │
      ├── CLEAN + FIXED questions ─→ stay in the batch → batch moves to 04_approved  (LIVE)
      └── WITHHELD questions ──────→ moved out to 03_flagged/<batch_id>/ with reasons.md
```

Three sessions per topic, each a fresh context: generator, solver, verifier. Never two stages in one context.

**Only `pipeline/04_approved/<batch_id>/questions.md` and `markscheme.md` go on the website.** Question numbering may have gaps where questions were withheld; match by `## Q<n>` heading. See `agents/FORMAT.md` → "Published output".

---

## Running it

Each stage is a fresh session (or a sub-session started by the managing Claude chat), told its topic:

1. `Read agents/GENERATE.md and follow it exactly. Your assigned topic is: N.`
2. `Read agents/SOLVE.md and follow it exactly. Your assigned topic is: N.`
3. `Read agents/VERIFY.md and follow it exactly. Your assigned topic is: N.`

All 12 topics can run in parallel: different topics never share a batch or a progress file. The only shared file is `logs/run_log.md`, which every stage appends to with a single `>>`.

**Models**: three different models if possible — e.g. generator Opus, solver Sonnet, verifier the most capable available.

---

## Folder structure

```
README.md          This file.
V4_CHANGES.md      What changed in v4 and why.
agents/            Prompts. FORMAT.md is shared by all.
                   00_syllabus_mapper (one-off, done), 01_generator, 02_solver, 03_verifier
                   GENERATE.md, SOLVE.md, VERIFY.md   one-stage commands
reference/         ONLY the official 0620 syllabus PDF. Never past papers, mark schemes or examiner reports.
config/            syllabus_map.json (topics, points, command words, data_provided, Ar values)
pipeline/
  01_drafts/       generated, waiting for the solver
  02_solved/       solved, waiting for the verifier
  03_flagged/      withheld questions (<batch_id>/ with reasons.md) — regenerate or fix by hand
  04_approved/     LIVE — the website reads only this
  05_rejected/     anything a human decides to pull
  03_sample/, 06_awaiting_fix/   unused since v4 (kept empty)
logs/
  run_log.md       append-only history. Never write answers here.
  sample_queue.md  optional human-check list (random ~20% of published batches). Never blocks.
  sample_results.md  results of any human checks
  progress/topic_01.json … topic_12.json
_retired/          previous prompt versions, for reference only
```

---

## Optional human checks

Nothing requires them. If you have time, pick a batch from `logs/sample_queue.md`, solve its questions before reading the mark scheme, fix anything wrong in `04_approved`, and add one line to `logs/sample_results.md`:

```
2026-09-23 | T03_20260923_01 | errors found: 1 | Q6 mark scheme used wrong Mr for CaCO3
```

This is the only real measurement of the error rate. A pattern of the same error across batches means a prompt needs fixing.

## Known limits

- No diagrams in v1; three syllabus points (11.8.10, 11.8.12, 11.8.13) excluded.
- AI checking AI misses errors all models share. The report button is the backstop.
- The verifier can't reliably detect copies of real past papers.
