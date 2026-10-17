---
batch_id: 0610_T10_P1_20261013
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 20, clean: 17, fixed: 3, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues:
  - models: generator claude-opus-5-5, solver claude-sonnet-5-5, verifier claude-fable-5-1; no two roles share a model

## Q2
- verdict: FIXED
- agreement: full
- issues:
  - option A (needle-stick) could be argued as transmission from a contaminated object, making the "direct contact" classification debatable
- fix_type: wording
- changed_file: questions.md
- before: "A a nurse is infected when a needle carrying a patient's blood pricks her skin"
- after:  "A a nurse is infected when a patient's blood gets into a cut on her hand"
- answers_changed: no

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
  - solver queried whether part (c) is Core; phagocytosis and antibody production by white blood cells are Core under 9.4.3, so the question stands

## Q13
- verdict: CLEAN
- agreement: full
- issues: none

## Q14
- verdict: FIXED
- agreement: full
- issues:
  - opening sentence read as if both doses were given on day 0
  - no reading between day 20 and day 40, so the first-dose peak used in the mark scheme comparison was not actually shown by the data (solver note)
- fix_type: data
- changed_file: questions.md
- before: "On day 0, a person was given a first dose of a vaccine and a second dose of the same vaccine on day 60." / table rows 20, 40
- after:  "A person was given a first dose of a vaccine on day 0 and a second dose of the same vaccine on day 60." / added a day-30 row between day 20 and day 40 so the first-dose peak is visible
- answers_changed: no

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
- issues: none

## Q18
- verdict: CLEAN
- agreement: full
- issues: none

## Q19
- verdict: FIXED
- agreement: full
- issues:
  - mark scheme (b) contained an IGNORE line saying a bare prediction scores 0, contradicting the first marking point which awards 1 mark for the prediction
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- IGNORE: a prediction with no explanation, which scores 0"
- after:  (line removed)
- answers_changed: no

## Q20
- verdict: CLEAN
- agreement: full
- issues:
  - solver noted (c) has several defensible answers; the mark scheme already allows any two of four points, which covers them
