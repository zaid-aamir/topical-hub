---
batch_id: 0610_T16_P1_20261018
verifier_model: "Claude Fable 5.1"
batch_route: PUBLISHED
counts: { published: 30, clean: 18, fixed: 12, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues:
  - No separate solver (owner decision); verifier blind solve only.
  - Models: generator GPT-6 (Codex); verifier Claude Fable 5.1; no shared model.

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
- verdict: FIXED
- agreement: full
- issues:
  - numeric options not in ascending order (exam convention)
- fix_type: format
- changed_file: questions.md, markscheme.md
- before: "A 6 / B 24 / C 12 / D 48; answer letter B"
- after:  "A 6 / B 12 / C 24 / D 48; answer letter updated, same option text confirmed by script"
- answers_changed: no

## Q7
- verdict: CLEAN
- agreement: full
- issues: none

## Q8
- verdict: FIXED
- agreement: full
- issues:
  - distractors B and D were self-eliminating ("prevents attachment", "prevents contact with insects"), giving the answer away
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "B a very smooth surface that prevents attachment / D a shape that prevents contact with insects"
- after:  "B a smooth outer surface / D a very small size; rationale reworded to match"
- answers_changed: no

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
- verdict: FIXED
- agreement: full
- issues:
  - mark scheme (a) too narrow; common correct answers (no pollinator/gametes needed, many offspring quickly) not credited
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "(a) two marking points only"
- after:  "added ALLOW: no pollinator, gametes or fertilisation needed; many offspring produced in a short time"
- answers_changed: no

## Q18
- verdict: CLEAN
- agreement: full
- issues: none

## Q19
- verdict: CLEAN
- agreement: full
- issues: none

## Q20
- verdict: FIXED
- agreement: full
- issues:
  - "Explain two disadvantages" for 2 marks is one mark per disadvantage, so the command word should be State
- fix_type: wording
- changed_file: questions.md
- before: "(b) Explain two disadvantages for producing a uniform crop rapidly. [2]"
- after:  "(b) State two disadvantages of this method for a breeder who wants to produce a uniform crop rapidly. [2]"
- answers_changed: no

## Q21
- verdict: CLEAN
- agreement: full
- issues: none

## Q22
- verdict: FIXED
- agreement: full
- issues:
  - mark scheme (a) lacked acceptable alternatives for stigma and ovary functions
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "(a) two marking points only"
- after:  "added ALLOW: sticky stigma traps pollen; ovary protects ovules / develops into the fruit"
- answers_changed: no

## Q23
- verdict: FIXED
- agreement: full
- issues:
  - mark scheme (b) did not credit pollen number or smoothness, both valid syllabus distinctions
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "(b) sticky/spiky and smaller/lighter only"
- after:  "added ALLOW: B produces larger numbers of pollen grains; A larger grains; B smooth pollen"
- answers_changed: no

## Q24
- verdict: FIXED
- agreement: full
- issues:
  - mark scheme (b) too narrow for a Suggest question
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "(b) incompatibility and failed tube only"
- after:  "added ALLOW: different species; pollen not viable; stigma not receptive/mature; tube fails to reach ovule"
- answers_changed: no

## Q25
- verdict: FIXED
- agreement: full
- issues:
  - mark scheme (b) listed only temperature and oxygen; other valid controls not credited
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "(b) temperature and oxygen only"
- after:  "added ALLOW: same number, species or age of seeds; same light; same time"
- answers_changed: no

## Q26
- verdict: FIXED
- agreement: full
- issues:
  - part (a) gave the result in the stem and then asked for it
  - mark scheme (b) too narrow for a Suggest question
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "(a) State the expected result and the conclusion if only seeds supplied with air germinate. [2]"
- after:  "(a) Predict the result of this investigation and state the conclusion that can be drawn. [2]; (b) added ALLOW: same number of seeds; same light; same time; same container volume"
- answers_changed: no

## Q27
- verdict: FIXED
- agreement: full
- issues:
  - part (b) wording ("starting and receiving structures") unclear
- fix_type: wording
- changed_file: questions.md
- before: "(b) Describe the starting and receiving structures in both transfers. [2]"
- after:  "(b) State the structure from which the pollen is transferred and the structure that receives it in these transfers. [2]"
- answers_changed: no

## Q28
- verdict: CLEAN
- agreement: full
- issues: none

## Q29
- verdict: FIXED
- agreement: full
- issues:
  - mark scheme (a) did not spell out the full route (stigma, style, ovary, ovule) a fuller answer would give
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "(a) two marking points only"
- after:  "added ALLOW: tube grows from the stigma, through the style, into the ovary and enters the ovule"
- answers_changed: no

## Q30
- verdict: FIXED
- agreement: full
- issues:
  - mark scheme (a) did not credit hanging anthers/stigmas on long filaments/styles or abundant light pollen
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "(a) exposed anthers and feathery stigma only"
- after:  "added ALLOW: anthers/stigmas hanging outside the flower; large numbers of small light pollen grains"
- answers_changed: no
