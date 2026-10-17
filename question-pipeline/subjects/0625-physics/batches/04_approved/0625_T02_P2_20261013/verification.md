---
batch_id: 0625_T02_P2_20261013
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 30, clean: 27, fixed: 3, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues: none (models: generator claude-opus-5-5, solver claude-sonnet-5-5, verifier claude-fable-5-1; no two roles share a model)

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
- verdict: FIXED
- agreement: full
- issues:
  - the question sentence came after the option table, so the options were not the last element of the question; moved the sentence above the table so the table reads as the option block (FORMAT: options as a Markdown table with the letter in the first column)
- fix_type: format
- changed_file: questions.md
- before: "...each object.\n\n| | surface area / cm^2 | ... |\n...\n\nWhich object emits infrared radiation at the greatest rate?"
- after:  "...each object.\n\nWhich object emits infrared radiation at the greatest rate?\n\n| | surface area / cm^2 | ... |"
- answers_changed: no

## Q15
- verdict: CLEAN
- agreement: full
- issues: none

## Q16
- verdict: FIXED
- agreement: full
- issues:
  - (b) asks to identify the best conductor AND explain from the results but carried only 1 mark (solver also flagged); marks did not fit the work
  - raised (b) to [2], total marks 4 -> 5, and split the mark scheme into an identification mark and an evidence mark
- fix_type: format
- changed_file: questions.md, markscheme.md
- before: "(b) Identify the best thermal conductor. Use the results to explain your answer. [1]" / "- marks: 4" / "**(b)** [1] - copper, because its pin fell off in the shortest time (1)"
- after:  "(b) Identify the best thermal conductor. Use the results to explain your answer. [2]" / "- marks: 5" / "**(b)** [2] - copper (1) - its pin fell off in the shortest time / thermal energy reached the far end of the copper rod fastest (1)"
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
- issues: none (solver note on diffusion/extent of circulation dismissed: mark scheme awards the rise and the circulation, standard demonstration)

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
- verdict: FIXED
- agreement: full
- issues:
  - part (c) requires c = ΔE / (mΔθ) (point 2.2.2.3, supplement recall) which was not listed in syllabus_points; cross-topic use is allowed and the specific heat capacity is given, but the point list should be complete
- fix_type: format
- changed_file: questions.md
- before: "- syllabus_points: [\"2.3.3.4\", \"2.3.3.5\", \"2.3.3.9\"]"
- after:  "- syllabus_points: [\"2.3.3.4\", \"2.3.3.5\", \"2.3.3.9\", \"2.2.2.3\"]"
- answers_changed: no

## Q25
- verdict: CLEAN
- agreement: full
- issues: none

## Q26
- verdict: CLEAN
- agreement: full
- issues: none (solver note on (b) dismissed: shiny silver as the poorest emitter is the standard 2.3.3.3/2.3.3.7 result)

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
- issues: none (solver low confidence on (b) mark allocation dismissed: mark scheme lists four distinct points plus an ALLOW alternative, which covers the defensible routes)
