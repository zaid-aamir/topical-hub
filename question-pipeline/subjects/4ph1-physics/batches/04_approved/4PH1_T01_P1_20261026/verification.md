---
batch_id: 4PH1_T01_P1_20261026
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 15, clean: 12, fixed: 3, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues:
  - models: generator claude-opus-5-5, solver claude-sonnet-5-5, verifier claude-fable-5-1 (no two roles share a model)

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
- verdict: FIXED
- agreement: full
- issues:
  - mark scheme (a) had a bullet with no mark value (the unit list) separate from the "all four correct (2)" bullet; FORMAT requires every marking bullet to carry its marks
- fix_type: format
- changed_file: markscheme.md
- before: "- mass: kg; force: N; velocity: m/s; time: s\n- all four correct (2)"
- after:  "- mass: kg; force: N; velocity: m/s; time: s — all four correct (2)"
- answers_changed: no

## Q7
- verdict: FIXED
- agreement: full
- issues:
  - stem stated "Momentum is measured in kilogram metre/second (kg m/s)", which is the recalled unit of 1.2P and must not be given; the parts already name kg m/s so nothing else changes
- fix_type: data
- changed_file: questions.md
- before: "Momentum is measured in kilogram metre/second (kg m/s).\n\nFour students each measure ..."
- after:  "Four students each measure ..."
- answers_changed: no

## Q8
- verdict: CLEAN
- agreement: full
- issues: none

## Q9
- verdict: CLEAN
- agreement: full
- issues:
  - solver medium confidence on the open 6-mark method part: dismissed, the indicative-content scheme (8 points, max 6) and (a)/(b) alternatives cover the solver's answers

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
- issues: none

## Q13
- verdict: CLEAN
- agreement: full
- issues: none

## Q14
- verdict: FIXED
- agreement: full
- issues:
  - solver note acted on: a student who rounds the (a) answer to 2 s.f. (allowed by the scheme) gets 71.4 m in the "show that 72 m" part (c); the scheme only allowed ECF for the first mark, so a correct, allowed method would have lost a mark
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- ALLOW ECF of a value of a from (a) only for the first mark"
- after:  "- ALLOW a = 6.3 m/s^2 from (a) giving s = 900 / 12.6 = 71.4 m, stated as approximately 72 m, for both marks\n- ALLOW ECF of any other value of a from (a) only for the first mark"
- answers_changed: no

## Q15
- verdict: CLEAN
- agreement: full
- issues: none
