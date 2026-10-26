---
batch_id: 4PH1_T02_P1_20261026
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 30, clean: 28, fixed: 2, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues:
  - models: generator claude-opus-5-5, solver claude-sonnet-5-5, verifier claude-fable-5-1; no two roles share a model (information only)

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
- issues: none

## Q25
- verdict: FIXED
- agreement: full
- issues:
  - (c) mark scheme credited only the "known positive object" method, but the question gives Omar no known positive object; the two-perspex-rod repulsion argument (test rod is charged, and it is attracted to the negative rod, so it is positive) is equally valid and the solver used it
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- if the two repel, the perspex rod is positively charged (1)"
- after:  "- if the two repel, the perspex rod is positively charged (1) / - ALLOW: rub a second perspex rod in the same way and show that the two perspex rods repel each other (so the test rod is charged) (1); since the charged perspex rod is attracted to the negative hanging rod, its charge must be positive (1)"
- answers_changed: no

## Q26
- verdict: CLEAN
- agreement: full
- issues: none

## Q27
- verdict: FIXED
- agreement: full
- issues:
  - (c) mark scheme said IGNORE lightning, but lightning is a standard textbook example of a dangerous build-up of electrostatic charge and fits 2.27P; a student giving it would have scored zero
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- IGNORE: lightning on its own"
- after:  "- ALLOW: lightning OR charge building up on clouds"
- answers_changed: no

## Q28
- verdict: CLEAN
- agreement: full
- issues: none

## Q29
- verdict: CLEAN
- agreement: full
- issues: none

## Q30
- verdict: CLEAN
- agreement: full
- issues: none
