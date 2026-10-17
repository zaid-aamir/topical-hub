---
batch_id: 0625_T04_P2_20261013
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 30, clean: 26, fixed: 4, answer_fixes: 0, withheld: 0 }
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
- verdict: FIXED
- agreement: full
- issues:
  - stem says "In this circuit" as if a diagram were shown; no diagram exists (solver note acted on)
- fix_type: wording
- changed_file: questions.md
- before: "In this circuit, a length of copper wire is connected across the terminals of a cell"
- after:  "In a circuit, a length of copper wire is connected across the terminals of a cell"
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
- issues:
  - solver note on (b)/(c) dismissed: (b) only concerns the 2.4 V reading; (c) mark scheme already credits off-scale and damage

## Q22
- verdict: FIXED
- agreement: full
- issues:
  - (a) final answer lacked an ALLOW for the standard-form equivalent that the sig-fig rule (2 sf) favours
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- 18 000 J (1)"
- after:  "- 18 000 J (1)\n- ALLOW: 1.8 × 10^4 J"
- answers_changed: no

## Q23
- verdict: CLEAN
- agreement: full
- issues:
  - solver note on (d) dismissed: mark scheme already ALLOWs "inside the battery" alongside the connecting leads

## Q24
- verdict: FIXED
- agreement: full
- issues:
  - (a) is open; a valid similarity (both measured with a voltmeter) was not covered (solver note acted on)
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- any one from: both are measured in volts / both are work (or energy) per unit charge (1)"
- after:  "(same line)\n- ALLOW: both are measured with a voltmeter (connected in parallel)"
- answers_changed: no

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
- verdict: FIXED
- agreement: full
- issues:
  - (c) standard-form equivalent of the final answer not listed as ALLOW
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- ALLOW: 27 kJ"
- after:  "- ALLOW: 27 kJ, 2.7 × 10^4 J"
- answers_changed: no

## Q29
- verdict: CLEAN
- agreement: full
- issues: none

## Q30
- verdict: CLEAN
- agreement: full
- issues: none
