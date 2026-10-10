---
batch_id: T02_20260923_01
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 30, clean: 25, fixed: 5, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues:
  - Model note: generator (claude-sonnet-5) and solver A (claude-sonnet-5) share a model. Verifier (claude-fable-5-1) is independent. Information only.

## Q2
- verdict: CLEAN
- agreement: full
- issues: none

## Q3
- verdict: CLEAN
- agreement: full
- issues:
  - Solver note on option C being a tempting distractor examined: it is plausible but definitely wrong (it gives the electron's mass), so no change.

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
- verdict: FIXED
- agreement: full
- issues:
  - Ion charges written with Unicode superscripts, against FORMAT.md's plain-text rule (H2SO4, Cu2+ style).
- fix_type: format
- changed_file: questions.md (and the matching worked solution in markscheme.md)
- before: "S²⁻ ... Ca²⁺"
- after:  "S2− ... Ca2+"
- answers_changed: no

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
- issues:
  - Solver note that part (b) is near-trivial because the abundances give exactly the Periodic Table value: dismissed, the question is correct and answerable and the comparison is a legitimate 2-mark check.

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
- verdict: CLEAN
- agreement: full
- issues:
  - Solver note that (a) has many valid answers: mark scheme already carries an ALLOW for any genuine physical property of ionic compounds, so no change.

## Q18
- verdict: FIXED
- agreement: full
- issues:
  - Ion charges written with Unicode superscripts, against FORMAT.md's plain-text rule.
- fix_type: format
- changed_file: questions.md (and markscheme.md)
- before: "Mg²⁺ ion and of the O²⁻ ion"
- after:  "Mg2+ ion and of the O2− ion"
- answers_changed: no

## Q19
- verdict: FIXED
- agreement: full
- issues:
  - Mark scheme and worked solution used Unicode superscript ion charges, against FORMAT.md.
- fix_type: format
- changed_file: markscheme.md
- before: "alternating Ca²⁺ and O²⁻ ions"
- after:  "alternating Ca2+ and O2− ions"
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
- issues: none

## Q23
- verdict: FIXED
- agreement: full
- issues:
  - Part (b) stated the bond type in the stem and then asked the student to name it, giving away one mark.
  - Worked solution contained an abandoned half-sentence ("its own 4, shown as shared, plus... more simply") that would confuse students.
- fix_type: wording
- changed_file: questions.md (part (b) stem) and markscheme.md (worked solution sentence)
- before: "(b) In a molecule of nitrogen, N2, the two nitrogen atoms are joined by a triple covalent bond. State the number of electrons shared between the two nitrogen atoms, and name this type of covalent bond. [2] | Worked solution: 'Counting up: carbon now has 8 outer electrons (its own 4, shown as shared, plus... more simply, each atom counts every electron in every shared pair around it), and each oxygen has 8 outer electrons too - all atoms achieve a full outer shell.'"
- after:  "(b) In a molecule of nitrogen, N2, the two nitrogen atoms share electrons so that each nitrogen atom has a full outer shell. State the number of electrons shared between the two nitrogen atoms, and name the type of covalent bond formed. [2] | Worked solution: 'To count outer electrons, each atom counts every electron in every shared pair around it. Carbon has 2 shared pairs with each oxygen atom, so 4 shared pairs (8 electrons) in total - a full outer shell. Each oxygen atom has 2 shared pairs with carbon (4 electrons) plus its own 4 unshared electrons, giving 8 - also a full outer shell. So all three atoms achieve a noble gas electronic configuration.'"
- answers_changed: no

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
  - Part (c) demanded two uses each linked to a property (four pieces of information) for a single mark; marks did not fit the work.
- fix_type: wording
- changed_file: questions.md (part (c) mark and question marks 5 -> 6) and markscheme.md (part (c) split into one mark per substance, with a REJECT for repeating the lubricant use from (b))
- before: "(c) ... link the use to a property of its structure. [1]  (marks: 5) | MS (c) [1]: one combined marking point requiring both uses"
- after:  "(c) ... link the use to a property of its structure. [2]  (marks: 6) | MS (c) [2]: graphite use + property (1); diamond use + property (1)"
- answers_changed: no

## Q28
- verdict: CLEAN
- agreement: full
- issues: none

## Q29
- verdict: CLEAN
- agreement: full
- issues: none

## Q30
- verdict: CLEAN
- agreement: full
- issues: none
