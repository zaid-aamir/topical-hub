# RUN: the single entry point

All paths in this file are relative to the `igcse-chem-pipeline` folder.

Work out what the pipeline needs next, do **exactly one stage**, then stop.

## Hard rule: one stage per session

Never run two stages in the same session. If you generate a batch and then solve it, you already know the answers and the independence check is destroyed. After finishing one stage, report what you did and stop, even if other work is waiting.

## Choose the stage, in this order

1. `pipeline/02_solved/` has a batch with no current `verification.md` → **Verifier**: read `agents/03_verifier.md` and follow it exactly. A `-fix<N>` batch is verified the same way; that file says how it merges back into its parent in `pipeline/06_awaiting_fix/`.
2. `pipeline/01_drafts/` has a batch with `solver_answers_A.md` but no `solver_answers_B.md` → **Solver B**: read `agents/02_solver.md` and follow it exactly.
3. `pipeline/01_drafts/` has a batch with no `solver_answers_A.md` → **Solver A**: read `agents/02_solver.md` and follow it exactly.
4. Nothing waiting → **Generator**: read `agents/01_generator.md` and follow it exactly for one batch.

Batches in `pipeline/06_awaiting_fix/` are parked, not waiting. They are never a stage: only their `-fix<N>` batch in `01_drafts/` moves them along.

If `pipeline/03_flagged/` and `pipeline/03_sample/` together hold more than 8 batches, don't generate. Say the review queue is full and stop. Still run stages 1–3, which clear the queue rather than add to it.

## Before you start

Say which stage you're running and why in one line, so the human can stop you if you picked the wrong one. If you're running a solver, confirm you will not open any mark scheme, other solver's answers, `verification.md`, or anything in `pipeline/06_awaiting_fix/`.

## Topic lane

If the session assigns you a topic number, handle only batches whose id starts with `T<NN>` for that topic (e.g. `T04` for topic 4, including its `-fix<N>` batches). Ignore all others completely, including for role detection and queue counts. Each stage updates only that topic's progress file, `logs/progress/topic_<NN>.json`.

## Parallel solving and topic lanes

The router runs one stage and is for sequential use. To run stages in parallel, don't use the router. Open a session per stage, each on its own model and with its own assigned topic, and use the direct commands:

- "Read `agents/GENERATE.md` and follow it exactly."
- "Read `agents/SOLVE_A.md` and follow it exactly."
- "Read `agents/SOLVE_B.md` and follow it exactly."
- "Read `agents/VERIFY.md` and follow it exactly."

Two sessions in **different topic lanes** never touch the same batch or the same progress file. Two solver sessions in the **same** lane are fine as long as one is A and one is B.

## Model note

This router can't choose its own model. For real independence, Solver B should run on a different model from Solver A, and the verifier on the most capable model at the highest effort. Check `logs/last_model_A.txt`, `logs/last_model_B.txt` and `logs/last_model_generator.txt` to see which model last ran as Solver A, as Solver B and as the generator. Treat any of these files being missing as that model being unknown, say so in your first line, and continue. A solver may read only `logs/last_model_A.txt` and `logs/last_model_B.txt`; never open `logs/run_log.md` or any other log to work this out. If you're about to act as Solver B on the same model that ran Solver A, say so in your first line so the human can switch models and restart the session.
