---
batch_id: 4BI1_T02_P4_20261026
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 25, clean: 22, fixed: 3, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues: none (models: generator claude-opus-5-5, solver claude-sonnet-5-5, verifier claude-fable-5-1; no role shares a model)

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
- issues: none (formulas printed; ratio re-derived as 6 ÷ side length)

## Q10
- verdict: CLEAN
- agreement: full
- issues: none (data consistent with time ∝ distance²; conversion factor given)

## Q11
- verdict: FIXED
- agreement: full
- issues:
  - solver note upheld: the distance the dye travelled was not stated unambiguously (stalk height given, but the cut end stands in the beaker)
- fix_type: data
- changed_file: questions.md
- before: "Sam stands a freshly cut celery stalk, 24 cm tall with leaves at the top, in a beaker of water containing a red dye. ... After 3 hours, red lines appear in the leaves at the top of the stalk."
- after:  "Sam stands a freshly cut celery stalk, with leaves at the top, in a beaker of water containing a red dye. ... After 3 hours, red lines first appear in the leaves at the top of the stalk, 24 cm above the cut end of the stalk."
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
- issues: none (percentage re-calculated; 2 s.f. instruction matches scheme)

## Q15
- verdict: CLEAN
- agreement: full
- issues: none (mean 31.3 allowed; rate re-calculated)

## Q16
- verdict: CLEAN
- agreement: full
- issues: none (solver note dismissed: scheme already allows glucose, amino acids or digested food)

## Q17
- verdict: CLEAN
- agreement: full
- issues: none

## Q18
- verdict: CLEAN
- agreement: full
- issues: none

## Q19
- verdict: FIXED
- agreement: full
- issues:
  - (a) first marking point's example ("about 10 days after the vaccine") did not match the table clearly
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "e.g. a large rise within 3 days compared with about 10 days after the vaccine"
- after:  "e.g. 40 units 3 days after the infection compared with only 2 units 5 days after the vaccine OR the peak was reached 10 days after the infection compared with 15 days after the vaccine"
- answers_changed: no

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
- issues: none (solver note dismissed: control mechanism is an ALLOW, not required)

## Q23
- verdict: CLEAN
- agreement: full
- issues: none (solver note dismissed: (c) scheme already lists six acceptable factors)

## Q24
- verdict: CLEAN
- agreement: full
- issues: none (solver note dismissed: (c) scheme already allows both advantages)

## Q25
- verdict: FIXED
- agreement: full
- issues:
  - solver note upheld: scheme did not say how to treat valves or extra structures named in the sequence
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- each mark only if in the correct position in the sequence"
- after:  "- each mark only if in the correct position in the sequence\n- IGNORE: valves and extra correct structures named in the correct position, e.g. bicuspid valve"
- answers_changed: no
