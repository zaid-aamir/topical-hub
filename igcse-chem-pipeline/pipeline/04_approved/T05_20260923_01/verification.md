---
batch_id: T05_20260923_01
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 30, clean: 25, fixed: 5, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues:
  - Model sharing: generator (claude-sonnet-5) and solver A (claude-sonnet-5) share the same model. Solver B (claude-haiku-4-5-20251001) and verifier (claude-fable-5-1) are independent. Information only.

## Q2
- verdict: CLEAN
- agreement: full
- issues: none

## Q3
- verdict: CLEAN
- agreement: full
- issues: none

## Q4
- verdict: FIXED
- agreement: full
- issues:
  - Energies in the stem were given in kJ while the options are in kJ/mol; units made consistent.
- fix_type: wording
- changed_file: questions.md
- before: "have an energy of 0 kJ, and the products (carbon dioxide) have an energy of −394 kJ."
- after:  "have an energy of 0 kJ/mol, and the products (carbon dioxide) have an energy of −394 kJ/mol."
- answers_changed: no

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
- verdict: FIXED
- agreement: full
- issues:
  - One solver reported the results in kJ/mol while the question uses a relative kJ scale; both are acceptable, so the mark scheme now allows either unit.
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- Ea = 160 − 100 = 60 kJ"
- after:  "- Ea = 160 − 100 = 60 kJ
  - ALLOW: kJ/mol as the unit throughout this question"
- answers_changed: no

## Q19
- verdict: CLEAN
- agreement: full
- issues: none

## Q20
- verdict: CLEAN
- agreement: full
- issues: none

## Q21
- verdict: FIXED
- agreement: partial
- issues:
  - Solver B mixed the two counting methods (broke only the bonds that change but formed every bond in the product) and obtained an unrealistically large value; verifier and solver A agree with the mark scheme. This is a solver error, but it is exactly the pitfall students fall into, so the mark scheme now allows the count-every-bond method (same final answer) and explicitly rejects a mixed count.
  - Solver B note about mark allocation in (c) dismissed: 3 marks = method, value, exothermic, as the scheme already shows.
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "(a) 612 + 436 = 1048 kJ (1); (b) 347 + (2 × 413) = 1173 kJ (1); (c) exothermic (1) / ECF from (a) and (b)"
- after:  "added ALLOW lines for counting every bond in (a) [2700 kJ (2)] and (b) [2825 kJ (2), only if (a) counted every bond], ALLOW 2700 − 2825 = −125 kJ/mol in (c), and REJECT for mixing the two methods (method mark only)"
- answers_changed: no

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
- issues:
  - Both solvers noted the bond-energy result differs slightly from the commonly quoted Haber-process value; dismissed, as mean bond energies only give an approximate enthalpy change and the question does not quote an experimental value.

## Q27
- verdict: FIXED
- agreement: partial
- issues:
  - Part (c) asked to "explain what this tells you about the reaction", which is open-ended: solver B answered that the reverse reaction is slower, which the scheme did not credit. Reworded to ask for the explanation in terms of the energies of reactants and products, and the marking point rewritten to match, with an ALLOW for the endothermic-reverse phrasing.
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "(c) ... and explain what this tells you about the reaction. [2] / MS: this shows the reverse (decomposition) reaction must overcome a much higher energy barrier ... consistent with the forward reaction being exothermic ... (1)"
- after:  "(c) ... and explain why, in terms of the energies of the reactants and products. [2] / MS: because the products (SO3) are at a lower energy than the reactants (the forward reaction is exothermic), so the reverse reaction must climb from this lower level to the same peak, i.e. Ea(reverse) = Ea(forward) + 196 (1); ALLOW: the reverse reaction is endothermic, so its activation energy includes the energy needed to raise the products up to the reactant level"
- answers_changed: no

## Q28
- verdict: FIXED
- agreement: full
- issues:
  - Solver B gave the second temperature change without a sign; the scheme already says "a decrease", so an explicit ALLOW for an unsigned fall was added.
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- ammonium chloride: −5.5°C (a decrease) (1)"
- after:  "- ammonium chloride: −5.5°C (a decrease) (1)
  - ALLOW: a fall / decrease of 5.5°C without a minus sign"
- answers_changed: no

## Q29
- verdict: CLEAN
- agreement: full
- issues: none

## Q30
- verdict: CLEAN
- agreement: full
- issues: none
