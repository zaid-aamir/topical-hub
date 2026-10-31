---
batch_id: 4CH1_T01_P1_20261028
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 30, clean: 28, fixed: 2, answer_fixes: 0, withheld: 0 }
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
- issues: none (supplement, 1.5C; solubility arithmetic checked)

## Q4
- verdict: CLEAN
- agreement: full
- issues: none

## Q5
- verdict: CLEAN
- agreement: full
- issues: none (Graham-type ratio 59:41 consistent with Mr 17 and 36.5)

## Q6
- verdict: CLEAN
- agreement: full
- issues: none (solver's note on (c) dismissed: 'solution 1' is explicit, four dilution steps is a single idea for 1 mark; (d) scheme already credits both 'many' and 'small')

## Q7
- verdict: CLEAN
- agreement: full
- issues: none

## Q8
- verdict: CLEAN
- agreement: full
- issues: none (40.2 g per 100 g re-derived; realistic for KCl at 40 °C)

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
- issues: none (Rf values re-derived: 0.20, 0.55, 0.84)

## Q16
- verdict: CLEAN
- agreement: full
- issues: none (method bullet 'Draw a line in ink' is part of the student's flawed method, not a command word)

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
- verdict: FIXED
- agreement: full
- issues:
  - question demands one decimal place but the scheme allowed 24.32 for the final mark
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "ALLOW: 24.32 for the third mark"
- after:  "REJECT: 24.32 for the third mark (the question asks for one decimal place); the first two marks are still awarded"
- answers_changed: no

## Q21
- verdict: CLEAN
- agreement: full
- issues: none (Ar 10.8 is a non-Periodic-Table value but is stated in the question; 20% re-derived two ways)

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
  - (b) data for Z were contradictory by design (good conductor but acidic oxide); 'Deduce metal or non-metal' let a student defend 'metal' from conductivity, which 1.20 lists as a valid classification test, so the part was ambiguous
  - reworded so the question states Z is a non-metal and asks the student to explain the misleading result and identify the decisive one; scheme rewritten to match (same conclusion, no answer change)
- fix_type: wording
- changed_file: questions.md (and matching marking points and worked solution in markscheme.md)
- before: "(b) Deduce whether element Z is a metal or a non-metal. Explain your answer. [2]"
- after:  "(b) Element Z is a non-metal. Explain why the results for Z could lead a student to classify Z wrongly, and state which result shows that Z is a non-metal. [2]"
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
- issues: none (solver's note dismissed: (c) is credited for 'it is a metal', no metallic bonding needed; (a) uses the Periodic Table, no configuration beyond 20 electrons required)
