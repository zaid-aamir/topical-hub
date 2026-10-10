---
batch_id: T03_20260923_01
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 30, clean: 27, fixed: 3, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues:
  - Model sharing (information only): generator claude-sonnet-5 and solver A claude-sonnet-5 share a model. Solver B claude-haiku-4-5-20251001 and verifier claude-fable-5-1 are distinct.

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
- issues:
  - The value of the Avogadro constant appears in the options, but this question tests recall of the constant itself (3.3.2), so it is the answer being tested, not given data; kept.

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
  - Tagged core, but parts (b) and (c) need the mole concept (amount = mass / molar mass, syllabus point 3.3.3, supplement); core candidates do not meet moles.
- fix_type: format
- changed_file: questions.md
- before: "- tier: core"
- after:  "- tier: supplement"
- answers_changed: no

## Q26
- verdict: FIXED
- agreement: full
- issues:
  - The Avogadro constant was stated as given data, which config data_provided.not_given forbids; students must recall it (3.3.2). Removed. Part (b) still works for a student who knows the constant, and the mark scheme's worked solution still shows the value.
- fix_type: data
- changed_file: questions.md
- before: "Ar: Mg = 24. The Avogadro constant is 6.02 × 10^23 per mol."
- after:  "Ar: Mg = 24."
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
  - Data are given to 3 significant figures, so answers to (c) and (d) quoted to 3 s.f. should be explicitly credited alongside the 1 or 2 s.f. values in the mark scheme.
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- 0.09 mol/dm3 (2)" / "- 3.6 g/dm3 (2)"
- after:  "- 0.09 mol/dm3 (2)\n- ALLOW: 0.0900 mol/dm3" / "- 3.6 g/dm3 (2)\n- ALLOW: 3.60 g/dm3"
- answers_changed: no

## Q30
- verdict: CLEAN
- agreement: full
- issues: none
