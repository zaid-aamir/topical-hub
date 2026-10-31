---
batch_id: 4CH1_T02_P1_20261028
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 30, clean: 27, fixed: 3, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues:
  - models: generator claude-opus-5-5, solver claude-sonnet-5-5, verifier claude-fable-5-1 (no role shares a model)

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
  - (d) accepted observations for rubidium in water did not include melting or rapid movement, both of which a student extrapolating from sodium/potassium would reasonably give
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- IGNORE: floats OR sinks"
- after:  "- ALLOW: melts (into a ball) OR moves (very) rapidly on the surface
  - IGNORE: floats OR sinks"
- answers_changed: no

## Q5
- verdict: CLEAN
- agreement: full
- issues: none (estimate in (b) already has an explicit accepted range, 30–60 °C; density data match real values, potassium anomaly handled)

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
- verdict: FIXED
- agreement: full
- issues:
  - (d) is an open 'Suggest' part; the ALLOW list did not cover the practical reasons (easier to measure out / add dropwise; iodine solid is almost insoluble, reaction needs ions in solution)
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- ALLOW: solutions mix more easily with the halide solutions"
- after:  "- ALLOW: solutions mix more easily with the halide solutions OR a solution is easier to measure out OR add drop by drop; ALLOW: iodine is a solid that is almost insoluble in water, so a solution is needed for the ions to react"
- answers_changed: no

## Q10
- verdict: FIXED
- agreement: full
- issues:
  - stem said the table gives data for four halogens but the table has five rows with the astatine row blank; reworded so the blank row is explained
- fix_type: wording
- changed_file: questions.md
- before: "The table gives the melting points and boiling points of four halogens. Astatine is below iodine in Group 7."
- after:  "The table gives the melting points and boiling points of four halogens. The values for astatine, which is below iodine in Group 7, have been left out."
- answers_changed: no

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
- issues: none (solver note on the 1.0 g mass dismissed: the stem fixes the mass only for the first carbonate, so "same mass" is a legitimate control variable; the changed variable is clear)

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
- verdict: CLEAN
- agreement: full
- issues: none

## Q26
- verdict: CLEAN
- agreement: full
- issues: none

## Q27
- verdict: CLEAN
- agreement: full
- issues: none

## Q28
- verdict: CLEAN
- agreement: full
- issues: none (solver note on tube 2 dismissed: boiled water plus an oil layer is the standard design; the mark scheme accepts "air" for oxygen)

## Q29
- verdict: CLEAN
- agreement: full
- issues: none

## Q30
- verdict: CLEAN
- agreement: full
- issues: none (position of M is fixed by the two displacement results; the printed series needs no hydrogen)
