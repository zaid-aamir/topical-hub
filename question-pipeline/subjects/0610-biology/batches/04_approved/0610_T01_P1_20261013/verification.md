---
batch_id: 0610_T01_P1_20261013
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
- issues: none (solver note on the unused tail-fin feature dismissed: it is a legitimate distractor testing that the key is followed in order)

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
- issues: none (solver note dismissed: mark scheme already allows any valid order of features and splits the 4 marks)

## Q13
- verdict: CLEAN
- agreement: full
- issues: none

## Q14
- verdict: FIXED
- agreement: full
- issues:
  - (c) mark scheme had an ALLOW bullet carrying a mark; ALLOW bullets must carry no marks
- fix_type: format
- changed_file: markscheme.md
- before: "- ALLOW organisms that are not closely related can have similar external features, so base sequences give more reliable evidence of how closely related organisms are (1)"
- after:  "- organisms that are not closely related can have similar external features, so base sequences give more reliable evidence of how closely related organisms are (1)"
- answers_changed: no

## Q15
- verdict: CLEAN
- agreement: full
- issues: none

## Q16
- verdict: FIXED
- agreement: full
- issues:
  - (a) mark scheme ignored "can move"; Cambridge credits nervous coordination / moving from place to place and cells having nuclei as animal-kingdom features, so a correct student answer would have been refused
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- IGNORE can move"
- after:  "- ALLOW cells have nuclei; usually have nervous coordination; able to move from place to place"
- answers_changed: no

## Q17
- verdict: CLEAN
- agreement: full
- issues: none

## Q18
- verdict: CLEAN
- agreement: full
- issues: none

## Q19
- verdict: CLEAN
- agreement: full
- issues: none

## Q20
- verdict: CLEAN
- agreement: full
- issues: none (solver note dismissed: petal number in multiples of 3 vs 4 or 5 and the fern features used are standard 1.3.5 content; mark scheme already lists the credited features)
