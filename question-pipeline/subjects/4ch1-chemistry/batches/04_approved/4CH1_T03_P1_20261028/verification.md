---
batch_id: 4CH1_T03_P1_20261028
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 25, clean: 21, fixed: 4, answer_fixes: 0, withheld: 0 }
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
- verdict: FIXED
- agreement: full
- issues:
  - mark scheme (d) credited 'starting temperature of the water' as a variable kept the same, but the table shows it varied (20.0–21.0 °C); worked solution repeated this
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- starting temperature of the water (1)"
- after:  "(bullet removed; worked solution now notes the starting temperatures were not all the same)"
- answers_changed: no

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
- verdict: FIXED
- agreement: full
- issues:
  - (c) asks for one solid that is not a catalyst; zinc oxide at 3 cm^3 vs 1 cm^3 with no solid was a defensible second answer (solver note); data changed so zinc oxide is clearly a weak catalyst and sand is the only non-catalyst
- fix_type: data
- changed_file: questions.md
- before: "| zinc oxide | 3 |"
- after:  "| zinc oxide | 9 |"
- answers_changed: no

## Q15
- verdict: CLEAN
- agreement: full
- issues: none

## Q16
- verdict: FIXED
- agreement: full
- issues:
  - (c) is open; added an ALLOW for reaction occurring during mixing before timing starts (solver note)
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- ALLOW: the mixture cools quickly from 60 °C during the reaction"
- after:  "+ - ALLOW: a noticeable amount of reaction happens while mixing, before timing starts"
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
- issues: none

## Q21
- verdict: CLEAN
- agreement: full
- issues: none

## Q22
- verdict: FIXED
- agreement: full
- issues:
  - (a) is open; added an ALLOW for 'closed system / no substance can enter or leave' wording (solver note)
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- so that none of the gases (reactants or products) can escape (1)"
- after:  "+ - ALLOW: it must be a closed system OR no substance can enter or leave"
- answers_changed: no

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
- issues: none (solver note on exact moment of equilibrium dismissed: the question asks for the earliest time in the table, which is unambiguous)
