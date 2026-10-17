---
batch_id: 0610_T03_P1_20261013
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 20, clean: 17, fixed: 3, answer_fixes: 0, withheld: 0 }
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
- verdict: FIXED
- agreement: full
- issues:
  - stem never said the agar was alkaline, so a careful student could not tell why the cubes were pink before the acid reached them; solver's note on the "identical cubes" control dismissed (cube size is still a valid stated control in real papers and the scheme offers other alternatives)
- fix_type: wording
- changed_file: questions.md
- before: "They made identical cubes of agar containing an indicator. The indicator is pink in alkali and becomes colourless in acid."
- after:  "They made identical cubes of agar containing a dilute alkali and an indicator. The indicator is pink in alkali and becomes colourless in acid, so the cubes were pink at the start."
- answers_changed: no

## Q13
- verdict: CLEAN
- agreement: full
- issues: none

## Q14
- verdict: CLEAN
- agreement: full
- issues: none (solver asked for ALLOW lines; the scheme already lists alternative wordings with slashes for each part)

## Q15
- verdict: CLEAN
- agreement: full
- issues: none

## Q16
- verdict: CLEAN
- agreement: full
- issues: none (solver note on reversibility of plasmolysis dismissed; the expected IGCSE answer is recovery of turgor)

## Q17
- verdict: FIXED
- agreement: full
- issues:
  - scheme rejected a magnitude-only percentage change outright even when the working shows the decrease; too harsh for a core calculation (solver's request for a range in (c) already met by the 2.4-3.0 range)
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- REJECT: 8 % with no indication that it is a decrease"
- after:  "- ALLOW: 8 % if the working shows the decrease (46 − 50)"
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
  - (e) is worth 1 mark but the only marking point bundled two ideas (uptake failure and protein synthesis), leaving it unclear whether either alone earns the mark (solver note acted on)
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "(single marking point with no ALLOW line)"
- after:  "- ALLOW: either idea alone for the mark: cannot absorb nitrate ions from this soil, or cannot make amino acids / proteins for growth"
- answers_changed: no
