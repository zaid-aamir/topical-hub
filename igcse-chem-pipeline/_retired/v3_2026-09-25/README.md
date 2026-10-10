# IGCSE Chemistry 0620 (2026–2028): Original Question Pipeline (v2)

A production line for **original, exam-style topical questions** for Cambridge IGCSE Chemistry 0620 (exams in 2026, 2027, 2028). These are NOT past papers and must never be described as past papers.

v2 is designed to run mostly on its own. Humans review only disagreements, a random sample, and anything the AI isn't sure about.

A batch is **one whole topic**: 30 questions, 15 multiple choice and 15 structured, spread across all of that topic's sub-topics roughly in proportion to how many learning points each has. Every question records its own `subtopic_id`, so topic pages can later be split into sub-topic pages.

---

## The pipeline

```
[01 Generator]      one whole TOPIC per batch: 30 questions (15 MCQ + 15 structured)
                    → pipeline/01_drafts/T<NN>_<YYYYMMDD>_<NN>/questions.md + markscheme.md
        │
[02 Solver A]       blind (never sees mark scheme)      → solver_answers_A.md
        │
[02 Solver B]       blind, DIFFERENT model, never sees A → solver_answers_B.md
        │           either solver moves the batch once both files exist → 02_solved
[03 Verifier]       most capable model, highest effort.
                    Solves everything itself, compares all answers, checks everything.
        │
        ├── every question clean + all answers agree ──┬─ 80% → 04_approved  (auto)
        │                                               └─ 20% → 03_sample    (random human check)
        ├── some questions fixed or deleted ────────→ parent parked in 06_awaiting_fix;
        │                                            only the fixed questions go back as
        │                                            01_drafts/<batch_id>-fix<N>
        └── any disagreement, doubt, or problem ────→ 03_flagged   (human fixes)

[YOU]  03_flagged: fix or reject the flagged questions only
       03_sample:  check the whole batch, record what you find in logs/sample_results.md
       → move to 04_approved or 05_rejected
```

A `-fix<N>` batch is solved blind like any other. When every one of its questions comes back clean, the verifier merges them into the parked parent, deletes the fix folder, and routes the completed parent batch. Only the fixed questions are ever re-solved — the whole batch never goes round again.

Only `pipeline/04_approved/` ever goes on the website.

The **first 3 batches ever verified always go to 03_sample**. That's calibration: you need to see real output before trusting auto-approval.

---

## Why the random sample matters

Every AI in this pipeline can share the same blind spot and agree on the same wrong answer. Agreement lowers the error rate. It doesn't measure it. The sample is the only way to know how often a wrong answer is getting through.

Track it in `logs/sample_results.md`:
- 0 errors across the last 10 sampled batches → lower sampling to 10% (edit the number in `agents/03_verifier.md`)
- Any real error found in a sampled batch → raise sampling back to 20%, find the cause, fix the prompt
- 2+ errors in the last 10 sampled batches → stop auto-approval (set sampling to 100%) until fixed

---

## Folder structure

```
README.md        This file.
V3_CHANGES.md    What changed in v3 and why.
agents/          Prompts. FORMAT.md is shared by all.
                 00_syllabus_mapper, 01_generator, 02_solver, 03_verifier, 04_orchestrator
                 RUN.md      the sequential router (one stage per session)
                 GENERATE.md, SOLVE_A.md, SOLVE_B.md, VERIFY.md
                             direct one-stage commands, each with an assigned topic
reference/       ONLY the official 0620 syllabus PDF. Never past papers.
config/          syllabus_map.json (topics, points, command words, Ar values)
pipeline/        01_drafts → 02_solved → 04_approved (auto) / 03_sample / 03_flagged
                 06_awaiting_fix  parent batches parked while their -fix<N> batch is re-solved
                 05_rejected      human-rejected batches
logs/            run_log.md, sample_results.md
                 progress/topic_01.json … topic_12.json   one file per topic
                 last_model_A.txt, last_model_B.txt, last_model_generator.txt
```

Each topic progress file holds `topic_id`, `topic_name`, `batches_drafted`, `batches_approved`, `subtopics_covered` and `last_batch`. `batches_approved` counts AUTO_APPROVED batches only; a SAMPLED or FLAGGED batch isn't approved until a human moves it.

---

## Models

- **Generator**: a capable model.
- **Solver A** and **Solver B**: use **different models** from each other if you can. The more different they are, the more errors disagreement catches. They can run at the same time; each is told its role and never reads the other's file.
- **Verifier**: the most capable model available, at the highest effort setting.
- Every stage runs in a **new session**. Never chain stages in one conversation.

---

## Running it

**Manual (first few batches)**: four new Cowork sessions per batch, each told its topic:
1. "Read agents/GENERATE.md and follow it exactly." (assigned topic N)
2. "Read agents/SOLVE_A.md and follow it exactly." (Solver A)
3. "Read agents/SOLVE_B.md and follow it exactly." (Solver B, different model)
4. "Read agents/VERIFY.md and follow it exactly."

**Scheduled**: see `agents/04_orchestrator.md` for four scheduled tasks. Each task needs an assigned topic too.

---

## Parallel running

Work is split into **topic lanes**. A batch id starts with its topic (`T04_20260923_01`), and every session is told which topic it owns:

> Your assigned topic is: 4

A session in a lane handles only batches whose id starts with `T<NN>` for its topic and ignores all others completely — including for role detection and queue counts — and writes only that topic's progress file. So:

- **Different lanes never collide.** All twelve topics can run at once; they share no batch and no progress file.
- **Within one lane**, Solver A and Solver B can run at the same time on different models. Each is told its role, never infers it, and never reads the other's answers. Whichever finishes second moves the batch to `02_solved`.
- **The only shared file is `logs/run_log.md`**, which every stage appends to with a single `>>` shell append, never a rewrite.
- **The router (`RUN.md`) is sequential** — one stage, then stop. Don't use it for parallel work; use the direct commands above.

One exception to lane isolation: the verifier's calibration count looks at batch folders across *all* topics, because calibration measures whether the pipeline as a whole can be trusted yet, not one lane.

Each topic needs **1 batch of 30 questions** to start. A generator whose topic already has an unapproved batch reports that and stops rather than making a second.

---

## Human review (short version)

**03_flagged**: open `verification.md`, go to the flagged questions only, apply or improve the suggested fix, or delete the question. Then move the batch to `04_approved`. If most of the batch is bad, move it to `05_rejected`.

**03_sample**: solve every question before reading the mark scheme. Check: correct chemistry, in syllabus and tier, one right MCQ answer, marks fit the work, clear wording, not a copy of a real past-paper question. Fix what's wrong, move to `04_approved`, and add one line to `logs/sample_results.md`:

```
2026-09-23 | T03_20260923_01 | errors found: 1 | Q6 mark scheme used wrong Mr for CaCO3
```

---

## Known limits

- No diagrams in v1. Questions needing them are skipped.
- The verifier can't reliably detect copies of real past papers. Your eye in the sample is the last check.
- Structured-question answers are compared by the verifier's judgment, not exact matching, so they're more error-prone than MCQs and numbers.
