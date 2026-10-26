---
batch_id: 4PH1_T08_P1_20261026
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 25, clean: 23, fixed: 2, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues:
  - models: generator claude-opus-5-5, solver claude-sonnet-5-5, verifier claude-fable-5-1 (no role shares a model) (information only)

## Q2
- verdict: CLEAN
- agreement: full
- issues: none

## Q3
- verdict: CLEAN
- agreement: full
- issues: none

## Q4
- verdict: CLEAN
- agreement: full
- issues: none

## Q5
- verdict: CLEAN
- agreement: full
- issues: none

## Q6
- verdict: CLEAN
- agreement: full
- issues: none

## Q7
- verdict: CLEAN
- agreement: full
- issues: none

## Q8
- verdict: CLEAN
- agreement: full
- issues: none

## Q9
- verdict: CLEAN
- agreement: full
- issues: none

## Q10
- verdict: CLEAN
- agreement: full
- issues: none

## Q11
- verdict: CLEAN
- agreement: full
- issues: none

## Q12
- verdict: CLEAN
- agreement: full
- issues:
  - rounding carried from (a) into (b) already allowed (2.9–3.0 × 10^4 range); (c) 690–700 days range covers 6.0 or 6.02 × 10^7 s (information only)

## Q13
- verdict: CLEAN
- agreement: full
- issues:
  - (b) ECF from (a) present; satellite data realistic (geostationary) (information only)

## Q14
- verdict: CLEAN
- agreement: full
- issues: none

## Q15
- verdict: CLEAN
- agreement: full
- issues: none

## Q16
- verdict: CLEAN
- agreement: full
- issues:
  - (b) accepts white / blue-white / blue, so no colour band beyond "hotter is bluer" is required (information only)

## Q17
- verdict: FIXED
- agreement: full
- issues:
  - (c) asked for the colour of a 4300 K star with a single expected answer; the specification (8.7, 8.8) gives no temperature bands, so "orange" vs "red" vs "yellow" could not be settled from spec content (solver also flagged this)
  - part rewritten as a comparative prediction against the Sun (already in the table), which needs only 8.8 (cooler star is redder); mark scheme and worked solution updated to match
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "Predict the colour of Arcturus. [1]"
- after:  "Predict whether Arcturus appears redder or bluer than the Sun. [1]"
- answers_changed: no

## Q18
- verdict: CLEAN
- agreement: full
- issues: none

## Q19
- verdict: FIXED
- agreement: full
- issues:
  - (b) ALLOW bullet carried a "(1)" mark tag, so the part's bullets summed to 3 for a 2-mark part
- fix_type: format
- changed_file: markscheme.md
- before: "- ALLOW only stars with a large mass become supergiants and explode as a supernova (1)"
- after:  "- ALLOW only stars with a large mass become supergiants and explode as a supernova (for the second mark)"
- answers_changed: no

## Q20
- verdict: CLEAN
- agreement: full
- issues: none

## Q21
- verdict: CLEAN
- agreement: full
- issues: none

## Q22
- verdict: CLEAN
- agreement: full
- issues: none

## Q23
- verdict: CLEAN
- agreement: full
- issues: none

## Q24
- verdict: CLEAN
- agreement: full
- issues: none

## Q25
- verdict: CLEAN
- agreement: full
- issues: none
