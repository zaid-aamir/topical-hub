---
batch_id: 4BI1_T01_P1_20261026
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 10, clean: 7, fixed: 3, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues:
  - models: generator claude-opus-5-5, solver claude-sonnet-5-5, verifier claude-fable-5-1 (no role shares a model)
  - MCQ letters across the 3 MCQs: A 1, B 1, C 0, D 1 (every-letter rule applies only at 4+ MCQs)

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
- agreement: partial
- issues:
  - solver gave "excretion" for the cooling-fan row and flagged it as a second defensible answer; the row describes negative feedback (control of internal conditions), and heat loss is not an excretory product in 4BI1, but the wording "cools the motor down" left room for the excretion reading
  - mark scheme did not explicitly reject excretion for that row
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "| When its motor gets too hot, a fan switches on and cools the motor down. | |"
- after:  "| When its motor gets too hot, a fan switches on and runs until the motor is back at its normal working temperature. | |"  (markscheme: added "- REJECT: excretion" under the fourth row)
- answers_changed: no

## Q5
- verdict: FIXED
- agreement: full
- issues:
  - (b) a valid difference from core 2.2 (plant cells have a permanent vacuole) was not credited
  - (c) a second valid 1.2 answer ("often store carbohydrate as glycogen") was not credited; the question only excludes nervous co-ordination
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "(b) ALLOW: plant cells have a cell wall but human cells do not / (c) ALLOW: they can move around OR locomotion"
- after:  "added (b) ALLOW: plant cells have a (large, permanent) vacuole but human cells do not; (c) ALLOW: they (often) store carbohydrate as glycogen"
- answers_changed: no

## Q6
- verdict: CLEAN
- agreement: full
- issues: none

## Q7
- verdict: FIXED
- agreement: full
- issues:
  - (a) mitochondria is a correct structure yeast has and bacteria lack; not allowed
  - (b)(i) the data fall fastest between 2 and 3 h and the steep phase runs 1–4 h; the scheme only named "between 2 and 4 hours"
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "(a) nucleus (1) / (b)(i) ALLOW: the decrease was slow in the first hour"
- after:  "added (a) ALLOW: mitochondria; (b)(i) ALLOW: fastest between 1 and 4 hours OR fastest between 2 and 3 hours"
- answers_changed: no

## Q8
- verdict: CLEAN
- agreement: full
- issues: none

## Q9
- verdict: CLEAN
- agreement: full
- issues:
  - calculations re-derived: (a) 24 ÷ 200 000 mm then × 1000; (b) ratio checked by multiplying back. Magnification formula and the mm–μm conversion are printed, as required.

## Q10
- verdict: CLEAN
- agreement: full
- issues:
  - solver flagged the open 5-mark part; the scheme already lists seven indicative points (one per group plus a summary) with max 5, which is clear enough. Euglena is not a specification example but every needed feature is supplied in the list.
