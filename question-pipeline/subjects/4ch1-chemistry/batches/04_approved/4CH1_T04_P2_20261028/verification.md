---
batch_id: 4CH1_T04_P2_20261028
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 30, clean: 23, fixed: 7, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues: none (models: generator claude-opus-5-5, solver claude-sonnet-5-5, verifier claude-fable-5-1; no two roles share a model). MCQ answer letters after checks: A 3, B 3, C 2, D 2 of 10; all four used, none more than twice as often as another, none three in a row; no reordering needed.

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
- agreement: full
- issues:
  - (c) ALLOW bullet carried a mark "(1)"; ALLOW bullets must carry no marks
- fix_type: format
- changed_file: markscheme.md
- before: "- ALLOW: with air, yeast respires aerobically and makes carbon dioxide and water instead of ethanol (1) for either mark"
- after:  "- ALLOW: with air, yeast respires aerobically and makes carbon dioxide and water instead of ethanol, for either mark"
- answers_changed: no

## Q5
- verdict: CLEAN
- agreement: full
- issues: none

## Q6
- verdict: FIXED
- agreement: full
- issues:
  - (a) first marking point quoted the fully balanced right-hand side, so it duplicated the balancing mark; it should credit correct formulae only
- fix_type: wording
- changed_file: markscheme.md
- before: "- 3O2 → 2CO2 + 3H2O, correct formulae of O2, CO2 and H2O (1)"
- after:  "- correct formulae of the missing substances: O2, CO2 and H2O (1)"
- answers_changed: no

## Q7
- verdict: FIXED
- agreement: full
- issues:
  - (c) is a Suggest part with no ALLOW list
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- it stops (fresh) air OR oxygen reaching the wine (1)"
- after:  "- it stops (fresh) air OR oxygen reaching the wine (1) / - ALLOW: less oxygen is available for the microbes OR for the oxidation"
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
- issues: none

## Q12
- verdict: FIXED
- agreement: full
- issues:
  - (c) tests the hydrogen test (2.44) but the point was not tagged
- fix_type: format
- changed_file: questions.md
- before: "- syllabus_points: ["4.36C", "1.29", "1.35C"]"
- after:  "- syllabus_points: ["4.36C", "1.29", "1.35C", "2.44"]"
- answers_changed: no

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
  - (b) ALLOW bullet carried a mark "(1)"
  - (d) a visible oily layer is an equally valid sign that an ester has formed; added as ALLOW (solver note on (c) flexibility: existing ALLOW already covers neutralising acid and separating the ester, no change needed)
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- ALLOW: the water bath heats the mixture gently and evenly (1) for the second mark / (d) no ALLOW"
- after:  "- ALLOW: the water bath heats the mixture gently and evenly, for the second mark / (d) - ALLOW: an oily OR insoluble layer forms on top of the solution"
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
- verdict: FIXED
- agreement: full
- issues:
  - (b) is a Suggest part with no ALLOW list
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- recycle it OR reuse the items (1)"
- after:  "- recycle it OR reuse the items (1) / - ALLOW: melt it down to make new items OR use less of it by replacing it with a biodegradable polymer"
- answers_changed: no

## Q26
- verdict: CLEAN
- agreement: full
- issues: none

## Q27
- verdict: FIXED
- agreement: full
- issues:
  - (c) was split over three lines with the [2] on the last line; moved the command sentence and mark onto the (c) line, matching the style of Q6(a), Q11(b) and Q20(b), so the part line ends with its own [n]
- fix_type: format
- changed_file: questions.md
- before: "(c) Part of a molecule of polymer Z is shown. / –CH2–CHF–CH2–CHF–CH2–CHF– / Deduce the repeat unit of polymer Z and the structural formula of its monomer. [2]"
- after:  "(c) Part of a molecule of polymer Z is shown. Deduce the repeat unit of polymer Z and the structural formula of its monomer. [2] / –CH2–CHF–CH2–CHF–CH2–CHF–"
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
