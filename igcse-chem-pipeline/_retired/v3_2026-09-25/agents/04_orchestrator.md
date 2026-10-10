# Agent 04: Scheduled Task Setup (v2)

Each stage runs as a **separate scheduled task**, so each gets a fresh session. If one session generated and then solved, the solver would already know the answers and the check would be worthless.

| Task | Time | Model |
|---|---|---|
| A: Generate | 07:00 | capable model |
| B: Solver A | 08:30 | model X |
| C: Solver B | 10:00 | model Y (different from X if possible) |
| D: Verify + summary | 11:30 | most capable model, highest effort |

Adjust times so each stage finishes before the next starts.

**Each scheduled task needs an assigned topic.** A batch is now one whole topic of 30 questions, and every stage runs in a topic lane: the task prompt must end with "Your assigned topic is: <NN>", and that task then handles only batches whose id starts with `T<NN>`, ignoring all others. Run one set of tasks per topic you want moving, or rotate the topic number between days. Each topic needs only **1 batch of 30 questions** to start, so a lane goes quiet once its batch is approved.

---

## Task A: Generate

```
You are working in the IGCSE Chemistry question pipeline folder.

Your assigned topic is: <NN>

First check the review queue: count batch folders in pipeline/03_flagged and
pipeline/03_sample. If the total is more than 8, don't generate anything. Append
"PAUSED: review backlog" to logs/run_log.md with a single >> shell append and
stop.

Otherwise, read agents/GENERATE.md and follow it exactly for your assigned topic.
One batch of 30 questions per topic. If that topic already has a batch anywhere
outside pipeline/04_approved, report it and stop rather than generating a
second.
```

## Task B: Solver A

```
You are working in the IGCSE Chemistry question pipeline folder.

Your assigned topic is: <NN>

Read agents/SOLVE_A.md and follow it exactly. Act only as Solver A: handle every
batch in pipeline/01_drafts/ whose id starts with T<NN> for your topic and that has
no solver_answers_A.md. Never open or read any markscheme.md, verification.md or
solver_answers file, and never anything in pipeline/06_awaiting_fix/.
```

## Task C: Solver B

```
You are working in the IGCSE Chemistry question pipeline folder.

Your assigned topic is: <NN>

Read agents/SOLVE_B.md and follow it exactly. Act only as Solver B: handle every
batch in pipeline/01_drafts/ whose id starts with T<NN> for your topic and that has
no solver_answers_B.md. Solver A may be working the same batch at the same time;
that is expected. Never open or read any markscheme.md, verification.md,
solver_answers_A.md or solver_answers_B.md file, and never anything in
pipeline/06_awaiting_fix/.
```

## Task D: Verify and summarise

```
You are working in the IGCSE Chemistry question pipeline folder.

Your assigned topic is: <NN>

1. Read agents/VERIFY.md and follow it exactly for every batch in
   pipeline/02_solved/ whose id starts with T<NN> for your topic and that has no
   verification.md.

2. Write logs/daily_summary_<YYYY-MM-DD>.md containing:
   - Batches verified today with their route (AUTO_APPROVED / SAMPLED / FLAGGED)
   - For each FLAGGED batch: the flagged question ids and a one-line issue each,
     FAIL first
   - SAMPLED batches waiting for human review
   - Queue sizes: 01_drafts, 02_solved, 03_flagged, 03_sample, 06_awaiting_fix,
     04_approved
   - Total approved questions so far
   - Recurring issue types across the last 7 days, so the prompts can be improved
   - The last 5 lines of logs/sample_results.md, and a warning if any recent
     sampled batch had errors
   Keep it short. It's a to-do list for a human.
```

---

## Your routine (about 20–30 minutes a day)

1. Read today's daily summary.
2. Fix or reject the flagged **questions** in `03_flagged` (not whole batches, just the flagged ones).
3. Check any batch in `03_sample` fully, and log the result in `logs/sample_results.md`.
4. If the queue pauses generation, that's the system telling you review is behind. Catch up or lower N. Don't raise the pause limit.
