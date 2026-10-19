---
batch_id: 0610_T14_P2_20261013
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 30, clean: 25, fixed: 5, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues:
  - models: generator claude-opus-5-5, solver claude-sonnet-5-5, verifier claude-fable-5-1; no two roles share a model
  - batch was previously published on owner approval without verification; verified now as a normal batch

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
- verdict: FIXED
- agreement: full
- issues:
  - mark scheme (b): an ALLOW bullet carried a mark, which FORMAT.md forbids
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- ALLOW: blood travels more slowly than impulses along neurones (1)"
- after:  "- ALLOW: blood travels more slowly than impulses along neurones, for either mark"
- answers_changed: no

## Q18
- verdict: CLEAN
- agreement: full
- issues: none

## Q19
- verdict: FIXED
- agreement: full
- issues:
  - mark scheme (c): an ALLOW bullet carried a mark; converted to a plain marking point under the existing max 2
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- ALLOW: more carbon dioxide removed (1)"
- after:  "- more carbon dioxide removed (from the blood / muscles) (1)"
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
- verdict: FIXED
- agreement: full
- issues:
  - mark scheme (a): an ALLOW bullet carried a mark; converted to a plain marking point under the existing max 3
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- ALLOW: adjusting insulin dose or food intake when exercising (1)"
- after:  "- adjusting insulin dose or food intake when exercising (1)"
- answers_changed: no

## Q24
- verdict: CLEAN
- agreement: full
- issues:
  - solver note (brain vs hypothalamus) dismissed: mark scheme already awards brain and only ALLOWs hypothalamus

## Q25
- verdict: CLEAN
- agreement: full
- issues: none

## Q26
- verdict: CLEAN
- agreement: full
- issues: none

## Q27
- verdict: FIXED
- agreement: full
- issues:
  - mark scheme (d) listed light intensity as a variable to keep the same in all three boxes, but box R is dark so it cannot be the same; removed (solver note acted on)
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "time / number of days; light intensity (for P and Q); number of seedlings;"
- after:  "time / number of days; number of seedlings;"
- answers_changed: no

## Q28
- verdict: FIXED
- agreement: full
- issues:
  - stem sentence defining the clinostat was awkwardly punctuated
- fix_type: wording
- changed_file: questions.md
- before: "The clinostat is a piece of apparatus: a disc that turns slowly and continuously."
- after:  "A clinostat is a piece of apparatus with a disc that turns slowly and continuously."
- answers_changed: no

## Q29
- verdict: CLEAN
- agreement: full
- issues: none

## Q30
- verdict: CLEAN
- agreement: full
- issues: none
