# IGCSE Chemistry 0620 (2026–2028): Original Question Pipeline

This folder is a production line for **original, exam-style topical questions** for Cambridge IGCSE Chemistry 0620, syllabus for exams in 2026, 2027 and 2028.

These are NOT past papers. Never describe them as past papers, on the site or anywhere else.

---

## The pipeline at a glance

```
[00 Syllabus Mapper]  (run ONCE)  →  config/syllabus_map.json  → YOU check it
        │
        ▼
[01 Generator]   writes   pipeline/01_drafts/<batch_id>/questions.md
                          pipeline/01_drafts/<batch_id>/markscheme.md
        │
        ▼
[02 Solver]      reads ONLY questions.md, never the mark scheme
                 writes   <batch_id>/solver_answers.md, moves batch → 02_solved
        │
        ▼
[03 Verifier]    compares mark scheme vs solver, checks syllabus scope, originality, format
                 writes   <batch_id>/verification.md
                 moves batch → 03_passed  (every question PASS)
                            → 03_flagged (any question FLAG or FAIL)
        │
        ▼
[YOU]            review 03_flagged first, then spot-check 03_passed
                 move to → 04_approved  or  05_rejected
        │
        ▼
[04 Orchestrator] (the scheduled task) runs 01→03 for the next batches, updates logs/progress.json
```

Only files in `pipeline/04_approved/` ever go on the website.

---

## Folder structure

```
agents/          Prompts for each agent. FORMAT.md is shared by all of them.
reference/       ONLY the official 0620 syllabus PDF (2026–2028). Nothing else.
config/          syllabus_map.json (made by the mapper, checked by you)
pipeline/        01_drafts → 02_solved → 03_passed / 03_flagged → 04_approved / 05_rejected
logs/            progress.json (what's been made) and run_log.md (what each run did)
```

**Never put real past papers, mark schemes, or examiner reports in this folder.** The generator will imitate them too closely and you'll be publishing near-copies of Cambridge's copyrighted questions.

---

## Setup (do once)

1. Download the official Cambridge IGCSE Chemistry 0620 syllabus for 2026, 2027 and 2028 from Cambridge International's website. Check the cover says those years. Save it as `reference/0620_syllabus_2026-2028.pdf`.
2. Run the **Syllabus Mapper** (`agents/00_syllabus_mapper.md`) in a fresh Claude session pointed at this folder.
3. Open `config/syllabus_map.json` next to the PDF and check it properly: every topic and sub-topic present, Core vs Supplement tagged correctly, no invented content. **Every later stage trusts this file, so an error here spreads everywhere.**

---

## Phase 1: Manual runs (do this before scheduling anything)

Run each stage by hand for ONE syllabus sub-topic, each in a **separate, fresh session**:

1. Generator → pick one sub-topic id (e.g. `4.1`).
2. Solver → on that batch. Use a **different model** from the generator if you can; it catches more errors.
3. Verifier → on that batch.
4. Review it yourself using the checklist below.

Repeat for 3–5 different sub-topics across different topic types (a calculation topic like stoichiometry, a descriptive one like the environment, organic chemistry). Track:

- How many questions you had to fix or reject
- What kinds of errors got past the verifier
- How long your review took per batch

Edit the prompts to fix recurring problems. **Only move to Phase 2 when the error rate in `03_passed` is low and stable.** Scheduling a broken pipeline just produces more broken questions faster.

## Phase 2: Scheduled runs

Create a scheduled task in Claude pointed at this folder, using the prompt in `agents/04_orchestrator.md`. Start with a small daily volume (e.g. 2 batches). Increase only if your review keeps up. **Your review speed is the real limit on output, not the AI.** Check how scheduled tasks access folders and what they cost against your usage limits before you rely on them.

---

## Human review checklist

Review `03_flagged` first (read `verification.md` for each), then spot-check at least 1 in 3 batches from `03_passed`. Early on, check every passed batch.

For each question, actually solve it yourself before reading the mark scheme. Then check:

- [ ] Chemistry is correct (equations balanced, state symbols right, numbers right)
- [ ] It's within the 0620 syllabus and the tagged tier (Core / Supplement)
- [ ] Only one correct answer (MCQ); distractors are plausible but clearly wrong
- [ ] Marks match the work required
- [ ] Mark scheme accepts reasonable alternative answers
- [ ] Wording is clear with no ambiguity
- [ ] It doesn't closely resemble a real past-paper question you recognize

Fix small problems directly in the batch files, then move the batch to `04_approved`. If a batch is mostly wrong, move it to `05_rejected` and add one line to `logs/run_log.md` saying why. Those notes are how you improve the prompts.

---

## Known weak spots

- **Diagrams**: apparatus, graphs, energy profiles and structural formula drawings are excluded in version 1. Questions that need them are marked `needs_diagram: true` and skipped. Add them later with a separate process.
- **Correlated errors**: an AI checking AI misses mistakes both share. The independent solver and your own review exist to catch this. Don't skip either.
- **Originality**: the verifier can't reliably detect resemblance to real past papers. Your eye is the last check.
