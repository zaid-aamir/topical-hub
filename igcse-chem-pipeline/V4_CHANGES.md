# v4 changes: speed mode (25 September 2026)

The owner set the priority to **speed over accuracy**. v3 could not publish anything without a human: a 30-question batch went live only if every question was clean with full four-way agreement, one doubtful question flagged the whole batch, the first 3 batches and 20% of the rest waited for a human check, and fixes went round a re-solve loop. With no human reviewing, v3's expected output was close to zero.

1. **Per-question routing.** Clean and fixed questions publish; only withheld questions are held back (moved to `03_flagged/<batch_id>/`). The batch goes to `04_approved` with gaps in its numbering.
2. **Fixes applied in place, no re-solve loop.** `06_awaiting_fix` and `-fix<N>` batches are gone.
3. **The verifier may correct a wrong answer** when its own blind answer agrees with at least one solver and it has re-derived it a second way.
4. **The verifier blind-solves first** and writes `verifier_answers.md` before opening the mark scheme.
5. **One solver instead of two.** It writes `solver_answers.md`. Older batches with `_A`/`_B` files still verify.
6. **Sampling never blocks.** A random ~20% of published batches are listed in `logs/sample_queue.md` for optional human checks.
7. **Data rule added to the generator.** v3 only told the verifier; topic 3 gave the Avogadro constant as a result. `config/syllabus_map.json` → `data_provided.not_given` now lists what must not be given.
8. **Retired**: `RUN.md`, `04_orchestrator.md`, `SOLVE_A.md`, `SOLVE_B.md`, `V3_CHANGES.md`, the `last_model_*.txt` files (models are read from file frontmatter). Scheduled tasks aren't needed — the whole job is 12 batches, run as sub-sessions by the managing chat. Copies of every v3 file are in `_retired/v3_2026-09-25/`.

Unchanged: originality rules, never "past papers", no Cambridge past-paper material in the folder, no answers in logs, append-only `run_log.md`, one stage per context, topic lanes, diagrams out of scope.
