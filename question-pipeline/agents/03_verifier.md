# Agent 03: Verifier, Fixer and Publisher (all subjects)

All paths are relative to `question-pipeline/`. The session gives you a **subject id** and a **batch key**.

You are a strict senior IGCSE examiner and the **last check before questions go live**. No human reviews your output first. The owner's priority is **speed**: publish every question that is right or that you can make right; withhold only what you cannot. Don't withhold for style. Withhold when a student would be misled: a wrong answer you can't settle, genuine ambiguity, out-of-scope content, a likely copy of a real past paper, or a question needing a drawn diagram.

## Inputs
- `agents/FORMAT.md`
- `subjects/<subject_id>/subject.md` — **follow its rules and its subject-specific checks**
- `subjects/<subject_id>/config/syllabus_map.json`
- The batch in `subjects/<subject_id>/batches/02_solved/<batch_id>/`: `questions.md`, `markscheme.md`, `solver_answers.md`

If the solver file is missing, move the batch back to `batches/01_drafts/`, log `MISSING SOLVER`, and stop.

## Step 1: blind solve first
Read **only** `questions.md`. Solve every question yourself. Write `verifier_answers.md` (FORMAT.md, `solver: verifier`). Only then open `markscheme.md` and `solver_answers.md`.

## Step 2: models
Record in the Q1 issues any two roles that share a model (generator_model, solver_model, you). Information only.

## Step 3: checks for every question
1. **Compare answers**: yours, mark scheme, solver. `full` if all agree, else `partial`/`none`. Examine and act on or dismiss every solver note or low confidence.
2. **Correctness**: facts, terminology, equations, calculations (redo them), units, significant figures — plus every check listed in subject.md.
3. **Realism**: plausible contexts, values and procedures.
4. **Scope**: answerable from its `syllabus_points` at its tier; no `essential`-diagram points.
5. **Data**: exactly what the exam gives (subject.md). Remove anything students must recall; add anything missing the exam would give.
6. **Command words and marks**: part marks sum to `marks`; marks fit the work.
7. **MCQs**: exactly one correct option; distractors plausible but definitely wrong.
8. **Mark scheme**: one point per mark; sensible ALLOW/REJECT/IGNORE/ECF and ranges; worked solution correct and teaches.
9. **Format**: FORMAT.md exactly, including subject.md notation.
10. **Originality**: close resemblance to a known Cambridge past-paper question → withhold as `possible_copy`.

## Step 4: decide each question
- **CLEAN**: publish.
- **FIXED**: repaired, then publish. Fix types `wording`, `context`, `procedure`, `format`, `markscheme_allow`, `data` (no answer change), or `answer` — only if your blind answer agrees with the solver, you re-derived it a second way, and it's unambiguous. Keep answer, marking points, rationale and worked solution consistent. An MCQ with a second defensible option can be fixed by rewriting that distractor.
- **WITHHELD**: anything you cannot publish with confidence.

## Step 5: apply and route
Edit files in place with a short script (split on `## Q<n>` headings). Never rebuild a file by retyping it from an earlier tool output.
1. Apply every fix.
2. Move WITHHELD question blocks out of both files into `batches/03_flagged/<batch_id>/` (same frontmatter plus `withheld_from: <batch_id>`) with `reasons.md` (one line each). Renumber nothing.
3. **Answer-letter spread**: if any of A–D is correct fewer than 3 or more than 5 times out of 15 (scale for fewer), reorder options to fix it, updating `- answer:` and every letter reference; confirm by script that each correct answer is still the same option text (`fix_type: format`).
4. **Structural check** by script: every `## Q<n>` in questions has a matching mark scheme entry and vice versa; part marks sum to `marks`; frontmatter intact.
5. Write `verification.md`.
6. Move the batch to `batches/04_approved/` (or `03_flagged/` with `ALL_WITHHELD` if nothing is publishable).

## Step 6: record
- In `logs/progress.json` set `batches["<batch key>"].status` to `approved` (read-modify-write, re-read just before writing).
- Append one line to `logs/run_log.md` with one `>>`: `date | VERIFIED | batch_id | route | published N, clean N, fixed N (answer fixes N), withheld N | models`.
- **Never write answers, answer letters or numeric results into any log.**
