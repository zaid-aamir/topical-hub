---
batch_id: 0625_T04_P3_20261013
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 30, clean: 26, fixed: 4, answer_fixes: 0, withheld: 0 }
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
- verdict: FIXED
- agreement: full
- issues:
  - worked-solution check line wrote 0.6 V, inconsistent with 2 s.f. convention used elsewhere
- fix_type: format
- changed_file: markscheme.md
- before: "the fixed resistor has 0.6 V, and 5.4 / 0.6 = 9"
- after:  "the fixed resistor has 0.60 V, and 5.4 / 0.60 = 9"
- answers_changed: no

## Q24
- verdict: FIXED
- agreement: full
- issues:
  - (c) 'what this fuse protects' also reasonably answered with 'the appliance'; solver flagged this; mark scheme had no ALLOW for it
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- ALLOW: the cable / flex from overheating"
- after:  "- ALLOW: the cable / flex from overheating\n- ALLOW: the appliance (from too large a current)"
- answers_changed: no

## Q25
- verdict: FIXED
- agreement: full
- issues:
  - (a) data 2760 W (3 s.f.) and 230 V permit a 3 s.f. answer; mark scheme only listed the 2 s.f. form
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- 12 A (1)"
- after:  "- 12 A (1)\n- ALLOW: 12.0 A"
- answers_changed: no

## Q26
- verdict: FIXED
- agreement: full
- issues:
  - (c) asked for the three wires in the cable of 'each appliance', but one appliance is a hairdryer, which is typically double-insulated with a two-core cable (and Q24 in this batch says so); solver flagged the inconsistency
- fix_type: context
- changed_file: questions.md
- before: "The mains cable to each appliance contains three wires."
- after:  "The mains cable to the kettle contains three wires."
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
- verdict: CLEAN
- agreement: full
- issues: none

## Q30
- verdict: CLEAN
- agreement: full
- issues: none
