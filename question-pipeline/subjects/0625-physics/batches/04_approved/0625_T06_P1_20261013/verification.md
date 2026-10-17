---
batch_id: 0625_T06_P1_20261013
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
- issues:
  - solver queried whether the axial tilt is Core; 6.1.1.1 states the axis is tilted and 6.1.1.2 asks for the periodic nature of the seasons, so the question and mark scheme are in scope (dismissed)

## Q17
- verdict: FIXED
- agreement: full
- issues:
  - question uses the command phrase "Write down", which is not a syllabus command word (p. 55)
- fix_type: wording
- changed_file: questions.md
- before: "(a) Write down the equation that defines the average orbital speed v ..."
- after:  "(a) State the equation that defines the average orbital speed v ..."
- answers_changed: no

## Q18
- verdict: CLEAN
- agreement: full
- issues:
  - solver queried the unit for (b); an answer in seconds follows the data given and the mark scheme also allows minutes (dismissed)

## Q19
- verdict: CLEAN
- agreement: full
- issues:
  - solver queried which explanation route (b) expects; the mark scheme is "any four from" six points covering gravity, the rotating cloud, the accretion disc and the temperature argument, matching 6.1.2.2 (dismissed)

## Q20
- verdict: FIXED
- agreement: full
- issues:
  - mark scheme gave no guidance for the common answer "mass and radius" in (a); syllabus 6.1.2.3 names only the mass
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- the mass of the planet (1)"
- after:  "- the mass of the planet (1)\n- IGNORE: additional reference to the radius of the planet"
- answers_changed: no

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
  - question uses the command word "Name", which is not a syllabus command word (p. 55)
- fix_type: wording
- changed_file: questions.md
- before: "(a) Name the two elements that make up most of the Sun. [1]"
- after:  "(a) State the two elements that make up most of the Sun. [1]"
- answers_changed: no

## Q24
- verdict: CLEAN
- agreement: full
- issues: none

## Q25
- verdict: CLEAN
- agreement: full
- issues:
  - solver queried the expected precision in (c) and (d); the mark scheme accepts "many billions" and a qualitative comparison, matching 6.2.2.1 and 6.2.3.1 (dismissed)

## Q26
- verdict: CLEAN
- agreement: full
- issues: none

## Q27
- verdict: CLEAN
- agreement: full
- issues: none

## Q28
- verdict: CLEAN
- agreement: full
- issues: none

## Q29
- verdict: FIXED
- agreement: full
- issues:
  - question uses the command word "Convert", which is not a syllabus command word (p. 55)
- fix_type: wording
- changed_file: questions.md
- before: "(c) Convert your answer to (b) into years. [2]"
- after:  "(c) Calculate the age of the Universe in years. [2]"
- answers_changed: no

## Q30
- verdict: CLEAN
- agreement: full
- issues:
  - solver noted two solution routes for (c); both are credited in the mark scheme and agree (dismissed)
