---
batch_id: T06_20260923_01
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 30, clean: 25, fixed: 5, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues:
  - Model sharing: generator (claude-sonnet-5) and solver A (claude-sonnet-5) share a model. Solver B (claude-haiku-4-5-20251001) and verifier (claude-fable-5-1) are independent. Information only.

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
  - Worked solution for (a) told students the question "presumably" varies temperature or concentration and "does not vary the marble"; this is speculation shown to students and does not match the mark scheme, which allows any two of five variables.
- fix_type: wording
- changed_file: markscheme.md
- before: "(a) A fair test keeps everything the same except the one variable being investigated (here, presumably temperature or the acid's concentration is being varied between trials, since the question does not vary the marble). Anything else that could affect rate ... must be kept the same."
- after:  "(a) A fair test keeps everything the same except the one variable being investigated. Anything else that could affect the rate — the concentration and volume of the acid, the mass and size of the marble chips, and the temperature — must be kept the same, so any two of these are acceptable."
- answers_changed: no

## Q7
- verdict: CLEAN
- agreement: full
- issues: none

## Q8
- verdict: FIXED
- agreement: full
- issues:
  - Mark scheme (b) and worked solution said carbon dioxide is "a fairly light gas so the mass loss is small". This is a misconception: CO2 is relatively dense (Mr = 44), which is exactly why the mass-loss method suits this reaction. The real limitation is that the change is small relative to the flask's mass and that acid spray can escape.
  - Solver A noted (b) is open with several defensible comparisons; mark scheme ALLOW list widened (acid spray, syringe capacity, dense-gas advantage). Solver B's (c) suggestion of sealing the flask is not credited: Method 1 relies on gas escaping.
  - (c) did not allow the standard cotton-wool-plug improvement.
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- disadvantage: mass changes are small compared with the mass of the flask, so a very sensitive (and often expensive) balance is needed to detect them accurately / carbon dioxide is a fairly light gas so the mass loss is small (1)"
- after:  "- disadvantage: the mass changes are small compared with the total mass of the flask and contents, so a sensitive (2 or 3 d.p.) balance is needed to detect them accurately / acid spray can escape from the flask and be counted as mass lost (1)" plus ALLOW lines for syringe capacity / dense-gas advantage in (b) and a cotton wool plug (1) + reason (1) in (c); worked solution (b) rewritten to match.
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
- agreement: partial
- issues:
  - Solver B gave atmospheric pressure for (c); the syllabus (6.3.10) states the value used in the mark scheme, so solver B is wrong and the mark scheme stands. Dismissed.

## Q17
- verdict: CLEAN
- agreement: full
- issues: none

## Q18
- verdict: FIXED
- agreement: full
- issues:
  - Stem called the blue paper "hydrated" cobalt(II) chloride; the blue form is anhydrous (the stem's own equation says so). Corrected wording.
  - Mark scheme (b) and (c) labelled the directions the wrong way round relative to the equation as written (hydrated ⇌ anhydrous + water): adding water is the reverse reaction, heating is the forward reaction. The credited observations (pink / blue, hydrated / anhydrous) were correct; only the forward/reverse alternatives were swapped. Both solvers had the directions right.
  - Tagged 6.3.4 but the content is 6.3.2 with supplement-level equilibrium language; left as is, both points are listed.
- fix_type: wording
- changed_file: questions.md and markscheme.md
- before: "Blue hydrated cobalt(II) chloride paper turns pink when water is added to it, and turns back to blue on heating." / MS (b) "the forward reaction (as written) is favoured" / MS (c) "the reverse reaction is favoured"
- after:  "Blue anhydrous cobalt(II) chloride paper turns pink when water is added to it, and the pink paper turns back to blue on heating." / MS (b) "the reverse reaction (as written) is favoured, forming hydrated cobalt(II) chloride" / MS (c) "the forward reaction (as written) is favoured, forming anhydrous cobalt(II) chloride"; worked solution (b) and (c) updated to match.
- answers_changed: no

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
- verdict: CLEAN
- agreement: full
- issues: none

## Q24
- verdict: CLEAN
- agreement: partial
- issues:
  - Solver B wrote that CO "loses oxygen" in (b) while correctly concluding it is oxidised; a slip in the solver, not the question. Mark scheme is correct. Dismissed.

## Q25
- verdict: CLEAN
- agreement: full
- issues: none

## Q26
- verdict: CLEAN
- agreement: full
- issues: none

## Q27
- verdict: CLEAN
- agreement: full
- issues: none

## Q28
- verdict: FIXED
- agreement: partial
- issues:
  - (a): the stem states that brown aqueous iodine forms in excess iodide, so the overall observed change ends brown, but the mark scheme credited only a fade to colourless / pale pink. Both solvers and the verifier included the brown colour. Added ALLOW so either description is credited; worked solution updated.
  - (b), (c): mark scheme used only the syllabus wording of the definitions; solver B used the electron-transfer form, which Cambridge mark schemes also accept. Added ALLOW.
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- purple to (almost) colourless / pale pink (1)" with no allowance for brown; definitions with no electron-transfer alternative.
- after:  added "- ALLOW: purple to brown / purple fades and a brown colour develops (the brown is the iodine formed, and is what is seen with excess iodide)"; added "- ALLOW: a substance that accepts / gains electrons" to (b) and "- ALLOW: a substance that donates / loses electrons" to (c).
- answers_changed: no

## Q29
- verdict: FIXED
- agreement: full
- issues:
  - (a): solver B gave electron-transfer definitions of oxidising and reducing agent, which the mark scheme did not allow. Added ALLOW. (b) reasoning by oxidation number (solver B) is already covered by "because it is reduced / oxidised".
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: (a) marking points with no alternative wording.
- after:  added "- ALLOW: oxidising agent accepts / gains electrons; reducing agent donates / loses electrons".
- answers_changed: no

## Q30
- verdict: CLEAN
- agreement: full
- issues: none
