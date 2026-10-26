---
batch_id: 4BI1_T05_P1_20261026
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 25, clean: 20, fixed: 5, answer_fixes: 0, withheld: 0 }
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
- issues: none (solver's "open-ended" note on (a) and (d) dismissed: mark scheme lists the accepted answers and ALLOWs cost and water loss in (d))

## Q10
- verdict: CLEAN
- agreement: full
- issues: none

## Q11
- verdict: CLEAN
- agreement: full
- issues: none (whitefly/parasitic wasp is a standard textbook context; data table and parts are original)

## Q12
- verdict: CLEAN
- agreement: full
- issues: none (solver note on oven expansion dismissed; mark scheme asks for yeast killed / enzymes denatured)

## Q13
- verdict: FIXED
- agreement: full
- issues:
  - method said the water bath was "at 20 °C" although four temperatures are tested
- fix_type: wording
- changed_file: questions.md
- before: "He places the boiling tube in a water bath at 20 °C for 5 minutes."
- after:  "He places the boiling tube in a water bath at the test temperature for 5 minutes."
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
- verdict: FIXED
- agreement: full
- issues:
  - (d) used a bare "- max 3" bullet instead of the "Any three from:" header used elsewhere
- fix_type: format
- changed_file: markscheme.md
- before: "**(d)** [3]\n- select the fastest-growing fish ... - max 3"
- after:  "**(d)** [3]\nAny three from:\n- select the fastest-growing fish ..."
- answers_changed: no

## Q17
- verdict: CLEAN
- agreement: full
- issues: none

## Q18
- verdict: CLEAN
- agreement: full
- issues: none (÷4 vs ÷5 ambiguity already handled: mark scheme gives 1 mark for ÷5 and worked solution explains the 4 intervals)

## Q19
- verdict: CLEAN
- agreement: full
- issues: none

## Q20
- verdict: FIXED
- agreement: full
- issues:
  - no significant-figure instruction, so the exact standard-form value should also be accepted
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- 1.0 × 10^6 OR 1.02 × 10^6 (1)"
- after:  "- 1.0 × 10^6 OR 1.02 × 10^6 OR 1.024 × 10^6 (1)"
- answers_changed: no

## Q21
- verdict: CLEAN
- agreement: full
- issues: none

## Q22
- verdict: FIXED
- agreement: full
- issues:
  - (a) used a bare "- max 3" bullet instead of the "Any three from:" header
- fix_type: format
- changed_file: markscheme.md
- before: "**(a)** [3]\n- weeds compete ... - max 3"
- after:  "**(a)** [3]\nAny three from:\n- weeds compete ..."
- answers_changed: no

## Q23
- verdict: CLEAN
- agreement: full
- issues: none

## Q24
- verdict: FIXED
- agreement: full
- issues:
  - the Finn Dorset / Scottish Blackface stem with "Dolly had a white face. Explain why." is the standard Dolly framing used in real exam papers; too close
  - (c) command word changed to the specification form "State what is meant by"
- fix_type: context
- changed_file: questions.md, markscheme.md
- before: "The mature cell was taken from the udder of a Finn Dorset sheep, which has a white face ... (b) Dolly had a white face. Explain why. [2] ... (c) ... State what diploid means. [1]"
- after:  "The mature cell was taken from the udder of an adult sheep, sheep X ... (b) Scientists compared Dolly's DNA with the DNA of sheep X, Y and Z. Dolly's DNA matched the DNA of sheep X only. Explain why. [2] ... (c) ... State what is meant by diploid. [1]"
- answers_changed: no

## Q25
- verdict: CLEAN
- agreement: full
- issues: none (solver note that a male transgenic goat could be bred dismissed: the mark scheme's point is that sexual reproduction gives only some offspring the gene)
