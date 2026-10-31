---
batch_id: 4CH1_T01_P3_20261028
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 20, clean: 16, fixed: 4, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues:
  - models: generator claude-opus-5-5, solver claude-sonnet-5-5, verifier claude-fable-5-1 (no two roles share a model)

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
- verdict: FIXED
- agreement: full
- issues:
  - concentration of the potassium bromide solution was not stated; it decides the anode product (bromine vs oxygen), so option D was defensible for a very dilute solution (solver flagged this)
- fix_type: data
- changed_file: questions.md, markscheme.md
- before: "Aqueous potassium bromide is electrolysed using inert electrodes."
- after:  "Concentrated aqueous potassium bromide is electrolysed using inert electrodes." (rationale and worked solution updated to say the solution is concentrated)
- answers_changed: no

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
- issues: none (estimate in (b) already has a stated range)

## Q10
- verdict: FIXED
- agreement: full
- issues:
  - (a) is an open "Give one reason" with only one creditable answer listed; students may reasonably cite unreactivity or poor heat conduction
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- it has a high melting point (so it does not melt in the furnace) (1)"
- after:  same point plus "ALLOW: it is unreactive OR does not react at high temperatures", "ALLOW: it is a poor conductor of heat", "REJECT: it is a poor conductor of electricity"
- answers_changed: no

## Q11
- verdict: CLEAN
- agreement: full
- issues: none

## Q12
- verdict: FIXED
- agreement: full
- issues:
  - (c) "one similarity in how each carbon atom is bonded" admitted the trivial answer "covalently", which (a) already credits (solver flagged alternatives)
- fix_type: wording
- changed_file: questions.md
- before: "State one similarity in how each carbon atom is bonded in graphite and in C60 fullerene. [1]"
- after:  "State one similarity, other than the type of bond, in how each carbon atom is bonded in graphite and in C60 fullerene. [1]"
- answers_changed: no

## Q13
- verdict: FIXED
- agreement: full
- issues:
  - (c) was awkwardly phrased ("Explain what the fact that the vapour contains ... shows")
- fix_type: wording
- changed_file: questions.md
- before: "(c) Explain what the fact that the vapour contains I2 molecules shows about the strength of the covalent bond in I2 compared with the forces between I2 molecules. [2]"
- after:  "(c) The vapour contains I2 molecules. Explain what this shows about the strength of the covalent bond in I2 compared with the forces between I2 molecules. [2]"
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
- issues: none (gas forms at both electrodes whatever the concentration, so no concentration needed)

## Q17
- verdict: CLEAN
- agreement: full
- issues: none (half-equations balance for atoms and charge)

## Q18
- verdict: CLEAN
- agreement: full
- issues: none (concentrated stated; products correct)

## Q19
- verdict: CLEAN
- agreement: full
- issues: none (solver's note on (d) dismissed: mark scheme already ALLOWs dissolving, electrode reaction and leakage; anode half-equation and 2:1 reasoning correct)

## Q20
- verdict: CLEAN
- agreement: full
- issues: none (recalculated: 0.11 g per 5 min, linear apart from the 15-minute value; prediction confirmed two ways)
