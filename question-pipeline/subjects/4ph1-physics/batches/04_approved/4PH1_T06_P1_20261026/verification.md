---
batch_id: 4PH1_T06_P1_20261026
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 25, clean: 22, fixed: 3, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues: none (models: generator claude-opus-5-5, solver claude-sonnet-5-5, verifier claude-fable-5-1; no two roles share a model)

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
- verdict: FIXED
- agreement: full
- issues:
  - (c) did not say the compass needle has a marked north-seeking end, which the answer relies on (solver note)
- fix_type: wording
- changed_file: questions.md
- before: "(c) The ends of the bar magnet are not labelled."
- after:  "(c) The ends of the bar magnet are not labelled. The north-seeking end of the compass needle is marked."
- answers_changed: no

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
- verdict: FIXED
- agreement: full
- issues:
  - (b) ALLOW "use a soft iron core" contradicts the stem and part (c), which say the electromagnet already has an iron core
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- ALLOW use a soft iron core (if not already given in (a)) for one mark"
- after:  "- ALLOW increase the voltage of the supply as increasing the current / - REJECT use an iron core (the electromagnet already has one)"
- answers_changed: no

## Q19
- verdict: FIXED
- agreement: full
- issues:
  - "downwards" in (b) assumes a vertical screen; stated it so the direction is unambiguous from the words alone (solver note)
- fix_type: wording
- changed_file: questions.md
- before: "across a screen in front of a student"
- after:  "across a vertical screen in front of a student"
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
- issues: none (solver note on I^2R dismissed: mark scheme needs only P = I × V and the heating effect of current, both in scope)

## Q25
- verdict: CLEAN
- agreement: full
- issues: none
