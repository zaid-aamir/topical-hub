---
batch_id: 4BI1_T02_P5_20261026
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 15, clean: 13, fixed: 2, answer_fixes: 0, withheld: 0 }
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
- issues: none (recalculated 1350 ÷ 2200 × 100; formula given in the stem as the manager decisions require; faeces correctly excluded as not from an organ of excretion)

## Q7
- verdict: FIXED
- agreement: full
- issues:
  - stem stated that leaf cells produce CO₂ and asked how it leaves the leaf without a time of day; by day respiratory CO₂ is used in photosynthesis and the leaf takes CO₂ in, so the described loss is only accurate at night (solver also flagged this)
  - worked solution (a) said CO₂ is released "all the time" without saying when it is lost
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "Leaf cells produce carbon dioxide as a waste product of metabolism."
- after:  "At night, leaf cells produce carbon dioxide as a waste product of metabolism. This carbon dioxide is lost from the leaf."
- answers_changed: no

## Q8
- verdict: CLEAN
- agreement: full
- issues: none (recalculated 3.8 ÷ 0.04; core content only: lungs as organ of excretion, respiration, alveoli)

## Q9
- verdict: CLEAN
- agreement: full
- issues: none (region names match the specification wording in 2.74B; ALLOW for "(first) convoluted tubule" is appropriate)

## Q10
- verdict: CLEAN
- agreement: full
- issues: none (plasma/filtrate values realistic; protein exclusion explained by size, as 2.75B requires)

## Q11
- verdict: CLEAN
- agreement: full
- issues: none (solver noted active transport is not named in 2.77B; it is core 2.15 in the same topic, parts (b) and (d) are "Suggest", and the mark scheme ALLOWs alternative phrasings; recalculated 450 − 375 and 375 ÷ 450 × 100; glucose data realistic for filtration and reabsorption maximum)

## Q12
- verdict: CLEAN
- agreement: full
- issues: none (recalculated (9.0 − 1.5) ÷ 1.5 × 100; ADH sequence correct, REJECT for "more ADH" sensible)

## Q13
- verdict: CLEAN
- agreement: full
- issues: none (stem gives the concentration difference students need; osmosis and partially permeable membrane are 2.15 terminology)

## Q14
- verdict: CLEAN
- agreement: full
- issues: none (solver noted osmoregulation has no specification definition; the mark scheme accepts water content of blood or body and water/ion balance, which covers the defensible phrasings; recalculated 20.8 ÷ 0.32)

## Q15
- verdict: FIXED
- agreement: full
- issues:
  - solver flagged that "name the structures" was ambiguous (nephron regions only, or the whole urinary system); the end-point "until it leaves the body in urine" was already unambiguous but the structures expected were not
  - mark scheme used "second convoluted tubule" only; "distal convoluted tubule" is the usual textbook name and should be allowed
  - (b): a proximal-convoluted-tubule answer is not defensible in the specification model (protein never enters the filtrate in a healthy person, 2.75B), so the ALLOW of glomerulus OR Bowman's capsule is sufficient
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "In your answer, name the structures the urea passes through and the processes that take place along the way. [6]"
- after:  "In your answer, name the regions of the nephron and the parts of the urinary system that the urea passes through, and the processes that take place along the way. [6]"
- answers_changed: no
