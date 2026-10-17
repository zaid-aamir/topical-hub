---
batch_id: 0610_T12_P1_20261013
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 20, clean: 15, fixed: 5, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues:
  - models: generator claude-opus-5-5, solver claude-sonnet-5-5, verifier claude-fable-5-1; no two roles share a model
  - answer-letter spread over the 10 MCQs is within the scaled range and no letter repeats three in a row; no reorder needed

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
  - stem opened with "One student", which is not Cambridge phrasing
- fix_type: wording
- changed_file: questions.md
- before: "One student investigates the effect of temperature on respiration in yeast."
- after:  "A student investigates the effect of temperature on respiration in yeast."
- answers_changed: no

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
  - stem opened with "One baker"
- fix_type: wording
- changed_file: questions.md
- before: "One baker mixes flour, water, sugar and yeast to make bread dough."
- after:  "A baker mixes flour, water, sugar and yeast to make bread dough."
- answers_changed: no

## Q17
- verdict: CLEAN
- agreement: full
- issues: none

## Q18
- verdict: FIXED
- agreement: full
- issues:
  - stem opened with "One athlete"
- fix_type: wording
- changed_file: questions.md
- before: "One athlete runs as fast as possible on a treadmill from 0 minutes to 10 minutes."
- after:  "An athlete runs as fast as possible on a treadmill from 0 minutes to 10 minutes."
- answers_changed: no

## Q19
- verdict: FIXED
- agreement: full
- issues:
  - (b) had an ALLOW bullet carrying a mark, which FORMAT.md forbids; solver note on extra defensible reasons examined: fewer live yeast cells added as ALLOW; sucrose-vs-glucose note dismissed because (a) asks for the syllabus equation, not an equation for the tank
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- ALLOW: carbon dioxide dissolves and lowers the pH (1)"
- after:  "- ALLOW: the number of living yeast cells has decreased\n- carbon dioxide dissolves and lowers the pH, inhibiting the yeast's enzymes (1)"
- answers_changed: no

## Q20
- verdict: FIXED
- agreement: full
- issues:
  - stem opened with "One scientist"
- fix_type: wording
- changed_file: questions.md
- before: "One scientist sets up two flasks, X and Y."
- after:  "A scientist sets up two flasks, X and Y."
- answers_changed: no
