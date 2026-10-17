---
batch_id: 0610_T05_P1_20261013
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 20, clean: 18, fixed: 2, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues:
  - models: generator claude-opus-5-5, solver claude-sonnet-5-5, verifier claude-fable-5-1; no two roles share a model

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
- verdict: FIXED
- agreement: full
- issues:
  - distractor A ("too large to enter the active site") was arguably defensible (starch is a large molecule); solver flagged it as not clearly false. Rewritten so it is definitely wrong; rationale updated to match.
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "A Starch molecules are too large to enter the active site of lipase."
- after:  "A Starch molecules do not collide with lipase molecules."
- answers_changed: no

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
- issues: none

## Q13
- verdict: FIXED
- agreement: full
- issues:
  - part (d) excluded "time" (the dependent variable) instead of "temperature" (the independent variable), so a student could reasonably answer "temperature", which the mark scheme rejects. Exclusion changed to temperature.
- fix_type: wording
- changed_file: questions.md
- before: "(d) State one variable, other than time, that the student should keep the same in every test-tube. [1]"
- after:  "(d) State one variable, other than temperature, that the student should keep the same in every test-tube. [1]"
- answers_changed: no

## Q14
- verdict: CLEAN
- agreement: full
- issues:
  - solver note on "optimum" only being the best of the values tested dismissed: question says "from these results"

## Q15
- verdict: CLEAN
- agreement: full
- issues: none

## Q16
- verdict: CLEAN
- agreement: full
- issues: none

## Q17
- verdict: CLEAN
- agreement: full
- issues:
  - percentage increase re-calculated; agrees

## Q18
- verdict: CLEAN
- agreement: full
- issues:
  - solver note on low non-zero values counting as "active" dismissed: any activity above 0 is active and the mark scheme matches

## Q19
- verdict: CLEAN
- agreement: full
- issues:
  - solver note on (b) being open dismissed: mark scheme already allows "not broken down / broken down more slowly"

## Q20
- verdict: CLEAN
- agreement: full
- issues:
  - mean rate re-calculated; agrees
