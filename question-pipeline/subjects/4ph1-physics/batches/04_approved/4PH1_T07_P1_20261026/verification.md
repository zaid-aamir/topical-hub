---
batch_id: 4PH1_T07_P1_20261026
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 30, clean: 26, fixed: 4, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues:
  - models: generator claude-opus-5-5, solver claude-sonnet-5-5, verifier claude-fable-5-1 (no role shares a model)
  - MCQ letter spread after verification: A 3, B 3, C 2, D 2 over 10 MCQs; no letter three in a row; no reordering needed

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
- issues:
  - solver medium confidence about distractor D dismissed: statement 7.17 names radioactive decay as a source of energy, so the key is unambiguous

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
- verdict: FIXED
- agreement: full
- issues:
  - background-count wording was not explicit: the 30 counts per minute was not named as background and the table did not say the readings were uncorrected detector readings
  - solver note on independent variable (type vs thickness of absorber) dismissed: mark scheme already allows both
- fix_type: wording
- changed_file: questions.md
- before: "With the source removed, the count rate is 30 counts per minute. / The table shows the results."
- after:  "With the source removed, the detector records a background count rate of 30 counts per minute. / The table shows the count rates recorded by the detector with the source in place."
- answers_changed: no

## Q14
- verdict: FIXED
- agreement: full
- issues:
  - mark scheme (b) had the full equation as a bullet carrying no mark, which breaks the one-point-per-bullet rule
- fix_type: format
- changed_file: markscheme.md
- before: "- ^214_83 Bi → ^214_84 Po + ^0_−1 e"
- after:  "Correct equation: ^214_83 Bi → ^214_84 Po + ^0_−1 e"
- answers_changed: no

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
- issues:
  - solver note on open-ended (b) dismissed: indicative points with a problem/risk-reduction balance rule are already in the mark scheme

## Q24
- verdict: CLEAN
- agreement: full
- issues: none

## Q25
- verdict: CLEAN
- agreement: full
- issues:
  - solver note on rounding in (c) dismissed: mark scheme allows 1460 and 1464.1

## Q26
- verdict: FIXED
- agreement: full
- issues:
  - mark scheme (b) first point only restated the stem (mass is lost), so a student could score without linking mass loss to energy
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- some mass has been lost in the reaction (1) / - (the lost mass is) released as energy (1)"
- after:  "- the lost mass has been converted into (released as) energy (1) / - so the reaction releases energy OR is a source of energy (1) / - REJECT: a bare restatement that mass has been lost, with no link to energy"
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
  - solver flagged that a student might name the moderator or shielding for the card in (c); the card removes neutrons from the chain, which is the control-rod role, so a REJECT line was added
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "(no REJECT line under (c))"
- after:  "- REJECT: moderator (it slows neutrons, it does not absorb them) OR shielding (it absorbs radiation leaving the core, not neutrons within the chain reaction)"
- answers_changed: no

## Q30
- verdict: CLEAN
- agreement: full
- issues: none
