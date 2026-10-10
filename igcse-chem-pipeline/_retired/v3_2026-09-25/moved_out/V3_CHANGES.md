# v3 changes: auto-fix and the single RUN prompt

Copy these files into `igcse-chem-pipeline`, replacing the old ones. `01_generator.md`, `config/` and `logs/` are untouched.

## 1. One prompt for every stage

Every session now starts with the same sentence:

> Read agents/RUN.md and follow it exactly.

The router works out what's needed (verify, Solver B, Solver A, or generate), does **one** stage, and stops. It will tell you in its first line which stage it picked, and warn you if it's about to be Solver B on the same model Solver A used, so you can switch models and restart.

## 2. The verifier now fixes what it safely can

**Fixes itself, then recycles**: wording, unrealistic context, a procedure that wouldn't give the stated product, formatting, added ALLOWs or rounding ranges, missing or excess data. Only when no answer changes.

**Sends to you**: anything that would change an answer or the chemistry, any disagreement with the mark scheme about the answer itself, possible copies of real past papers, diagram questions, and every FAIL.

**Fixed batches go back to `01_drafts`** with `fix_round` increased and the old version stored in `history/`. Fresh solvers answer the repaired questions cold, and it comes back for re-verification. If the verifier's fix was wrong, that shows up as a new disagreement. After 2 fix rounds, a batch goes to you no matter what.

This costs no human time, but each fix adds a full solve-and-verify cycle, so batches take longer to clear. If many batches are being fixed for the same reason, fix the generator prompt instead. The daily summary's recurring-issues section is for exactly this.

## 3. New batch route

`AUTO_APPROVED` → live. `SAMPLED` → your random check. `FIXED` → recycled automatically. `FLAGGED` → you.

## Scheduled tasks

Run the RUN prompt as several tasks spaced through the day, each in its own session, rather than one task per stage. Order sorts itself out, since the router always clears the oldest work first. Keep one task per model role: the Solver B slot on a different model, the verifier slot on the most capable model at highest effort.
