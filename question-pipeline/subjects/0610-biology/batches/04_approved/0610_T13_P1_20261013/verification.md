---
batch_id: 0610_T13_P1_20261013
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 20, clean: 17, fixed: 3, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues:
  - models: generator claude-opus-5-5, solver claude-sonnet-5-5, verifier claude-fable-5-1; no two roles share a model
  - answer-letter spread across the 10 MCQs is within the scaled 2–3 range for every letter; no letter three in a row; no reorder needed

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
- issues: none (percentage recalculated and confirmed)

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
  - solver queried the 2-mark allocation for four substances in (b); the mark scheme already resolves it (all four = 2, two or three = 1) but the first bullet carried no mark value, breaking the one-point-per-bullet format
  - solver's concern about (c) dismissed: both marks sit inside 13.1.5(b) (all of the glucose / reabsorbed into the blood), no process detail required
- fix_type: format
- changed_file: markscheme.md
- before: "- water, glucose, urea, ions / - all four correct (2) / - two or three correct (1)"
- after:  "- water, glucose, urea, ions: all four correct (2) / - two or three of these correct (1)"
- answers_changed: no

## Q16
- verdict: FIXED
- agreement: full
- issues:
  - solver noted the 60-fold urea concentration in (b) is inconsistent with 99.2 % water reabsorption in (d) if no urea were reabsorbed. Checked: the figures are realistic (plasma 0.3 g per dm³, 180 dm³ filtrate, 1.5 dm³ urine, about half the filtered urea is in fact reabsorbed), so the data stand and all answers are unaffected. The marking points already accept "much less urea is reabsorbed than water"; only the worked solution asserted flatly that urea "stays in the nephron", which contradicts the table. Worked solution softened to match
  - all calculations re-derived a second way (60 via 0.3 × 60 = 18.0; 99.2 % via 100 − 1.5/180 × 100)
- fix_type: wording
- changed_file: markscheme.md
- before: "but the urea stays in the nephron. The same urea is dissolved in much less water"
- after:  "but very little of the urea is reabsorbed, so almost all of it stays in the nephron. The same urea is dissolved in much less water"
- answers_changed: no

## Q17
- verdict: CLEAN
- agreement: full
- issues: none (data realistic: roughly 0.3 g urea per g protein, consistent with nitrogen content of protein)

## Q18
- verdict: CLEAN
- agreement: full
- issues: none (percentage recalculated and confirmed)

## Q19
- verdict: CLEAN
- agreement: full
- issues: none (solver's remark on statement 3 wording considered; statement is correct and unambiguous)

## Q20
- verdict: FIXED
- agreement: full
- issues:
  - solver noted the concentration in (b) is given to 1 s.f., so a 1 s.f. answer is defensible; mark scheme allowed only the 3 s.f. and 2 s.f. forms
  - solver's concern about (d) dismissed: both marks follow from 13.1.5(a) filtration plus 13.1.7, no nephron detail needed
  - all calculations re-derived and confirmed
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- ALLOW: 6.8 g"
- after:  "- ALLOW: 6.8 g; 7 g"
- answers_changed: no
