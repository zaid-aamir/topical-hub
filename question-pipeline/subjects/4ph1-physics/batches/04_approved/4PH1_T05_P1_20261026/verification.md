---
batch_id: 4PH1_T05_P1_20261026
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
- verdict: FIXED
- agreement: full
- issues:
  - (c) conversion mark was worded only for converting g→kg or cm^3→m^3 before dividing; the common g/cm^3 × 1000 route earned only 2 of 3 marks
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- 3200 kg/m^3 (1)\n- ECF from (b)"
- after:  "- 3200 kg/m^3 (1)\n- ALLOW: the conversion mark for converting 3.2 g/cm^3 to kg/m^3 (× 1000) at the end\n- ECF from (b)"
- answers_changed: no

## Q12
- verdict: CLEAN
- agreement: full
- issues: none

## Q13
- verdict: CLEAN
- agreement: full
- issues: 
  - solver rounding note dismissed: mark scheme already allows 2.6/2.58 × 10^5 and 3.6 × 10^5 (via ECF)

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
  - (b) ALLOW line accepted 'between 2 and 7 minutes', but the temperature is still changing at 2 min and 7 min; too lenient and contradicts the table
  - solver note on 'melting point' from a cooling curve dismissed: melting point = freezing point, standard practical wording
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- ALLOW: between 2 and 7 minutes"
- after:  "- ALLOW: 3 to 6 minutes OR 3–6 min in any form\n- REJECT: 2 and 7 minutes (the temperature is still changing at these times)"
- answers_changed: no

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
  - solver note on mark allocation dismissed: mark scheme has 7 indicative points for 5 marks

## Q21
- verdict: CLEAN
- agreement: full
- issues: none

## Q22
- verdict: CLEAN
- agreement: full
- issues: 
  - solver note dismissed: 3rd mark in (b) is the bonds/forces point, within 5.9P

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
  - solver note dismissed: both starting states give the same volume; mark scheme allows either

## Q27
- verdict: CLEAN
- agreement: full
- issues: none

## Q28
- verdict: CLEAN
- agreement: full
- issues: 
  - solver note dismissed: mark scheme allows 136–137 kPa and volume or mass for (a)

## Q29
- verdict: CLEAN
- agreement: full
- issues: none

## Q30
- verdict: CLEAN
- agreement: full
- issues: none
