---
batch_id: 0610_T15_P1_20261013
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 20, clean: 17, fixed: 3, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues:
  - models: generator claude-opus-5-5, solver claude-sonnet-5-5, verifier claude-fable-5-1; no two roles share a model (information only)
  - batch was previously published on owner approval without verification; verified here as a normal batch

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
- issues:
  - solver note (clear-zone diameter may include the disc) dismissed: ranking and answer unaffected, standard IGCSE presentation

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
- issues:
  - answer-letter spread across the 10 MCQs is within the scaled 2–3 range for every letter and no letter repeats three in a row; no reorder needed

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
  - solver note: part (c) "suggest" could be answered via the weakened immune system rather than the bacterial cause; mark scheme only credited the bacterial-cause answer
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- ALLOW: antibiotics are used to treat bacterial infections"
- after:  "- ALLOW: antibiotics are used to treat bacterial infections / - ALLOW: HIV has weakened the immune system so the body cannot fight the bacterial infection without an antibiotic"
- answers_changed: no

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
  - solver note (Core question asking for survival and reproduction of resistant bacteria) dismissed: "suggest" at Core with 15.1.3 is answerable by "some bacteria resistant" + "these multiplied"; the mark scheme already allows "multiplied"

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
  - part (a) [3] listed four 1-mark points plus a bare "max 3" bullet, so marking points summed to 4 and the "max" bullet is not a FORMAT.md bullet type
- fix_type: format
- changed_file: markscheme.md
- before: "four separate (1) bullets + '- max 3'"
- after:  "three (1) bullets: kills non-resistant; resistant survive and reproduce, passing on gene; proportion of resistant increases / population mostly resistant"
- answers_changed: no

## Q20
- verdict: FIXED
- agreement: full
- issues:
  - solver note: part (c) is an open "suggest" drawing on hygiene ideas outside 15.1; the mark scheme list of acceptable measures was closed
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- any one of: more hand washing ... / testing patients for MRSA on arrival (1)"
- after:  "same point + '- ALLOW: any other sensible measure that reduces the spread of bacteria between patients, e.g. sterilising equipment, wearing gloves or aprons'"
- answers_changed: no
