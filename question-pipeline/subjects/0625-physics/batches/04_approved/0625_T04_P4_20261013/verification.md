---
batch_id: 0625_T04_P4_20261013
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
  - MCQ answer-letter spread 4/4/4/3, no letter three in a row; no reorder needed

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
- verdict: FIXED
- agreement: full
- issues:
  - stem wording 'the same electrical power is always transmitted' was clumsy; reworded so the fixed-power condition is explicit
- fix_type: wording
- changed_file: questions.md
- before: "The same electrical power is always transmitted along a pair of cables. The transmission voltage is increased from 50 kV to 250 kV."
- after:  "Electrical power is transmitted along a pair of cables. The transmission voltage is increased from 50 kV to 250 kV, but the power transmitted stays the same."
- answers_changed: no

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
- verdict: FIXED
- agreement: full
- issues:
  - mark scheme part (c) had no mark total and used nested **(i)**/**(ii)**/**(iii)** headings, unlike the (a)/(b) heading pattern in FORMAT.md and the (i)/(ii) bullet style used in Q16 and Q18
- fix_type: format
- changed_file: markscheme.md
- before: "**(c)**\n**(i)** [1] ... **(ii)** [2] ... **(iii)** [1]"
- after:  "**(c)** [4] with (i)/(ii)/(iii) marking points as bullets, same marks and wording"
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
- issues: none

## Q26
- verdict: CLEAN
- agreement: full
- issues: none

## Q27
- verdict: FIXED
- agreement: full
- issues:
  - (b) asks for two advantages but the scheme awarded 'smaller current' and 'less energy wasted' as a chained pair, with thinner cables only as an ALLOW; restructured as 'any two from' so each distinct advantage earns one mark
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "smaller current (1) / so less energy wasted (1) / ALLOW thinner cables"
- after:  "any two from: smaller current (1); less energy wasted as heat (1); thinner / lighter / cheaper cables (1)"
- answers_changed: no

## Q28
- verdict: CLEAN
- agreement: full
- issues: none

## Q29
- verdict: FIXED
- agreement: full
- issues:
  - (c) uses the turns ratio (4.5.6.3) but syllabus_points listed only 4.5.6.7
- fix_type: format
- changed_file: questions.md
- before: "- syllabus_points: ["4.5.6.7"]"
- after:  "- syllabus_points: ["4.5.6.3", "4.5.6.7"]"
- answers_changed: no

## Q30
- verdict: CLEAN
- agreement: full
- issues: none
