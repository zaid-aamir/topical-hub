---
batch_id: T04_20260923_01
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 30, clean: 25, fixed: 5, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues:
  - Models: generator and solver A share the same model (claude-sonnet-5); verifier is a different model.

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
- issues:
  - Solver note (medium confidence): option B's 'or hydrogen' clause is redundant for molten compounds. Dismissed: B is the syllabus 4.1.4 statement and remains true for every molten ionic compound; no other option is defensible.

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
- verdict: FIXED
- agreement: full
- issues:
  - Mark scheme bullet carried 2 marks for two separable ideas; FORMAT.md wants one marking point per mark.
- fix_type: format
- changed_file: markscheme.md
- before: "(d) first bullet worth (2): "with copper electrodes: Cu2+ ions are removed from solution at the cathode at the same rate as Cu2+ ions are added ... stays roughly constant (2)""
- after:  "Split into two (1) bullets: Cu2+ removed at the cathode (1); replaced at the same rate from the dissolving copper anode so concentration/colour constant (1)"
- answers_changed: no

## Q13
- verdict: CLEAN
- agreement: full
- issues:
  - Solver note (medium confidence) asked for the electron-flow convention to be checked. Checked: electrons leave the anode and travel through the external circuit to the cathode; mark scheme agrees.

## Q14
- verdict: CLEAN
- agreement: full
- issues: none

## Q15
- verdict: FIXED
- agreement: full
- issues:
  - Question stem begins with "A concentrated ...", which a parser (or a student scanning) can mistake for MCQ option A.
- fix_type: wording
- changed_file: questions.md
- before: "A concentrated aqueous solution of potassium bromide is electrolysed using inert electrodes. What is formed at the anode?"
- after:  "Concentrated aqueous potassium bromide is electrolysed using inert electrodes. What is formed at the anode?"
- answers_changed: no

## Q16
- verdict: CLEAN
- agreement: full
- issues: none

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
- agreement: full
- issues: none

## Q25
- verdict: CLEAN
- agreement: full
- issues: none

## Q26
- verdict: CLEAN
- agreement: full
- issues: none

## Q27
- verdict: FIXED
- agreement: full
- issues:
  - Students correctly taught that OH− ions are the anions discharged at the anode would name OH− and were not explicitly allowed.
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "(a) second bullet only credited SO4 2− as the negative ion moving to the anode"
- after:  "Added: ALLOW OH− (from water) as the negative ion moving towards the anode"
- answers_changed: no

## Q28
- verdict: FIXED
- agreement: full
- issues:
  - Question asks students to contrast with a petrol-engine car; the scheme gave no route to credit that contrast.
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "(b) no credit line for the comparison with petrol that the question explicitly asks for"
- after:  "Added: ALLOW petrol is a hydrocarbon / contains carbon, so burning it produces carbon dioxide, whereas hydrogen contains no carbon (1)"
- answers_changed: no

## Q29
- verdict: FIXED
- agreement: full
- issues:
  - Marking points did not map one-per-mark and ALLOW lines carried marks; 'suggest one reason' for 2 marks needs a reason plus a linked consequence.
  - Solver note: open-ended parts. Handled by the marking-point rewrite above.
- fix_type: format
- changed_file: markscheme.md
- before: "(a)/(b) one (1) bullet plus an ALLOW bullet ending in (1) for a 'state two' part; (c) a single (2) bullet for one reason"
- after:  "(a)/(b) rewritten as 'any two from' lists, one mark per bullet; (c) split into reason (1) + linked consequence (1)"
- answers_changed: no

## Q30
- verdict: CLEAN
- agreement: full
- issues: none
