---
batch_id: 0610_T02_P1_20261013
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 20, clean: 15, fixed: 5, answer_fixes: 0, withheld: 0 }
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
- issues: none

## Q7
- verdict: CLEAN
- agreement: full
- issues: none

## Q8
- verdict: CLEAN
- agreement: full
- issues: none (calculation re-done; distractors checked)

## Q9
- verdict: CLEAN
- agreement: full
- issues: none (calculation re-done; distractors checked)

## Q10
- verdict: CLEAN
- agreement: full
- issues: none (calculation re-done both in mm and in μm)

## Q11
- verdict: FIXED
- agreement: full
- issues:
  - unnatural stem wording "One student compares" (exam style is "A student")
  - solver note on (a)/(c): mark scheme already accepts any two structures and states the large/permanent vs small/temporary contrast; dismissed
- fix_type: wording
- changed_file: questions.md
- before: "One student compares a cell from the leaf of a pondweed with a cell from a human liver."
- after:  "A student compares a cell from the leaf of a pondweed with a cell from a human liver."
- answers_changed: no

## Q12
- verdict: FIXED
- agreement: full
- issues:
  - (d) "other than DNA" was a subtle exclusion of plasmids (solver note); made explicit so the only intended answer (cell wall) is unambiguous
  - (c) mark scheme used IGNORE for vacuole, but by the syllabus lists (2.1.1 vs 2.1.2) a small vacuole is a defensible answer (solver note); changed to ALLOW
  - mark scheme (d) REJECT note and worked solution updated to match the new wording
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "(d) State **one** structure, other than DNA, that is found in a bacterial cell but not in a human skin cell. [1]"
- after:  "(d) State **one** structure, other than circular DNA and plasmids, that is found in a bacterial cell but not in a human skin cell. [1]"
- answers_changed: no

## Q13
- verdict: CLEAN
- agreement: full
- issues: none (solver notes on open-ended (a) and (d): mark scheme already allows the alternatives; dismissed)

## Q14
- verdict: CLEAN
- agreement: full
- issues: none (solver note on (a) mark split: scheme already gives the 2/1/0 split; dismissed)

## Q15
- verdict: CLEAN
- agreement: full
- issues: none

## Q16
- verdict: CLEAN
- agreement: full
- issues: none (solver note on (b): scheme already allows any part not exposed to light; dismissed)

## Q17
- verdict: FIXED
- agreement: full
- issues:
  - unnatural stem wording "One student makes"
- fix_type: wording
- changed_file: questions.md
- before: "One student makes a drawing of a human egg cell."
- after:  "A student makes a drawing of a human egg cell."
- answers_changed: no

## Q18
- verdict: CLEAN
- agreement: full
- issues: none (all three calculations re-done)

## Q19
- verdict: FIXED
- agreement: full
- issues:
  - unnatural stem wording "One scientist uses"
  - all calculations re-done; sizes realistic for an electron micrograph
- fix_type: wording
- changed_file: questions.md
- before: "One scientist uses an electron microscope to photograph part of a liver cell."
- after:  "A scientist uses an electron microscope to photograph part of a liver cell."
- answers_changed: no

## Q20
- verdict: FIXED
- agreement: full
- issues:
  - unnatural stem wording "One student draws"
  - all calculations re-done
- fix_type: wording
- changed_file: questions.md
- before: "One student draws the red blood cell with a diameter of 30 mm."
- after:  "A student draws the red blood cell with a diameter of 30 mm."
- answers_changed: no
