---
batch_id: 4CH1_T04_P1_20261028
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 30, clean: 25, fixed: 5, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues:
  - models: generator claude-opus-5-5, solver claude-sonnet-5-5, verifier claude-fable-5-1; no role shares a model
  - blind solve, solver and mark scheme agree on all 30 questions; MCQ letters C A D B A C D B C A (A3 B2 C3 D2), no reordering needed

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
- issues:
  - estimate in (c) has an explicit accepted range in the mark scheme; solver's medium confidence dismissed

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
- verdict: FIXED
- agreement: full
- issues:
  - mark scheme (b) had a bare equation bullet with no mark value and no ALLOW/REJECT/IGNORE/ECF prefix, so it could be parsed as a third marking point
- fix_type: format
- changed_file: markscheme.md
- before: "- C3H8 + 5O2 → 3CO2 + 4H2O"
- after:  "- ALLOW: the fully correct equation C3H8 + 5O2 → 3CO2 + 4H2O for both marks"
- answers_changed: no

## Q14
- verdict: CLEAN
- agreement: full
- issues: none

## Q15
- verdict: FIXED
- agreement: full
- issues:
  - mark scheme (c) had a plain note bullet with no prefix and no mark value
- fix_type: format
- changed_file: markscheme.md
- before: "- the reason must refer to less sulfur or less sulfur dioxide"
- after:  "- REJECT: a reason that does not refer to less sulfur or less sulfur dioxide"
- answers_changed: no

## Q16
- verdict: CLEAN
- agreement: full
- issues:
  - solver note on (a) dismissed: mark scheme already credits both the high-temperature and the catalyst reading

## Q17
- verdict: CLEAN
- agreement: full
- issues:
  - solver note on (b) dismissed: indicative points with "any four, max 3 without data" cover the alternative fraction comparisons

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
- verdict: FIXED
- agreement: full
- issues:
  - mark scheme (b) had a plain note bullet with no prefix and no mark value
- fix_type: format
- changed_file: markscheme.md
- before: "- the two formulae can be given in either order"
- after:  "- ALLOW: the two formulae in either order"
- answers_changed: no

## Q23
- verdict: FIXED
- agreement: full
- issues:
  - mark scheme (b) and (c) had plain note bullets with no prefix and no mark value
- fix_type: format
- changed_file: markscheme.md
- before: "- each name must match the correct structure; ECF from (b) for a correctly named incorrect structure only if ..."
- after:  "- REJECT: a name that does not match the structure given in (b) / - ECF: a correct name for an incorrect structure from (b), only if ... (and the (b) note became an ALLOW line)"
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
  - mark scheme (a) and (b) had plain note bullets with no prefix and no mark value
- fix_type: format
- changed_file: markscheme.md
- before: "- each name must match the correct structure in (a)"
- after:  "- REJECT: a name that does not match the structure given in (a) (and the (a) note became an ALLOW line)"
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
