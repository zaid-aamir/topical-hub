---
batch_id: 4BI1_T03_P2_20261026
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 30, clean: 28, fixed: 2, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues:
  - models: generator claude-opus-5-5, solver claude-sonnet-5-5, verifier claude-fable-5-1 (no role shares a model); information only

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
- issues: none

## Q13
- verdict: CLEAN
- agreement: full
- issues: none

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
- verdict: CLEAN
- agreement: full
- issues: none

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
- issues:
  - solver medium confidence on (c): mark scheme already lists the alternatives (variation / disease resistance / storage, transport); dismissed

## Q25
- verdict: CLEAN
- agreement: full
- issues: none

## Q26
- verdict: FIXED
- agreement: full
- issues:
  - (c) mark scheme accepted "roughly proportional" but the data have a non-zero value at 0 s, so the relationship is linear, not directly proportional; solver note on this point acted on
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "OR it is roughly proportional (1)"
- after:  "OR the increase is roughly linear (1)" plus "REJECT directly proportional (there are 2 mutant colonies at 0 s)"
- answers_changed: no

## Q27
- verdict: CLEAN
- agreement: full
- issues: none

## Q28
- verdict: CLEAN
- agreement: full
- issues: none

## Q29
- verdict: FIXED
- agreement: full
- issues:
  - stem did not state that fur colour is inherited, an assumption the natural-selection answer needs (solver note acted on)
- fix_type: wording
- changed_file: questions.md
- before: "The fur colour of the mice varies from light to dark. Owls hunt the mice by sight."
- after:  "The fur colour of the mice varies from light to dark. Fur colour is inherited. Owls hunt the mice by sight."
- answers_changed: no

## Q30
- verdict: CLEAN
- agreement: full
- issues: none
