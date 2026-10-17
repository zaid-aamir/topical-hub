---
batch_id: 0625_T02_P1_20261013
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
- issues:
  - solver note on (b) (evaporation vs boiling) dismissed: mark scheme already allows both; (d) alternatives already allowed

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
- issues:
  - solver note on (d) ("zero" kinetic energy) dismissed: syllabus 2.1.2.2 wording is "least kinetic energy"; allowing "zero" would teach a misconception

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
  - (c) first marking point required the comparison "more than glass" even though the command word is Suggest and the question is a Core-level everyday consequence; a student stating only that the water expands would lose the mark
  - solver note on (d) dismissed: stem is the standard slack-for-winter-contraction context and the mark scheme answer matches it
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- water expands more than glass (when heated) (1)"
- after:  "- water expands more than glass (when heated) (1) / - ALLOW: water expands (when heated) for the first mark"
- answers_changed: no

## Q24
- verdict: CLEAN
- agreement: full
- issues: none

## Q25
- verdict: CLEAN
- agreement: full
- issues: none

## Q26
- verdict: CLEAN
- agreement: full
- issues:
  - solver note (exact start of melting not visible in table) dismissed: does not affect any answer

## Q27
- verdict: CLEAN
- agreement: full
- issues: none

## Q28
- verdict: CLEAN
- agreement: full
- issues: none

## Q29
- verdict: CLEAN
- agreement: full
- issues: none

## Q30
- verdict: FIXED
- agreement: full
- issues:
  - (a) mark scheme contained a bare "- Max 2" bullet that is neither a marking point nor an ALLOW/REJECT/IGNORE/ECF bullet (FORMAT.md); the part heading [2] already caps the marks
- fix_type: format
- changed_file: markscheme.md
- before: "- Max 2"
- after:  "(bullet removed)"
- answers_changed: no
