---
batch_id: 0610_T09_P1_20261013
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 30, clean: 23, fixed: 7, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues:
  - models: generator claude-opus-5-5, solver claude-sonnet-5-5, verifier claude-fable-5-1; no two roles share a model
  - otherwise none

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
- issues: none (calculation re-done; distractors each map to one specific error)

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
- verdict: FIXED
- agreement: full
- issues:
  - (c) two ALLOW bullets carried marks; FORMAT.md says ALLOW bullets carry no marks. Solver's note (several defensible effects) is already covered by the scheme's max-2 list.
- fix_type: format
- changed_file: markscheme.md
- before: "- ALLOW: heart has to work harder / beat faster to move the same amount of blood (1)"
- after:  "- heart has to work harder / beat faster to move the same amount of blood (1)"
- answers_changed: no

## Q17
- verdict: CLEAN
- agreement: full
- issues: none

## Q18
- verdict: CLEAN
- agreement: full
- issues: none (pressure values plausible; calculation re-done; solver's note dismissed, scheme has six alternatives for four marks)

## Q19
- verdict: FIXED
- agreement: full
- issues:
  - (a) and (c) ALLOW bullets carried marks; (a) is worth 1 so the monitor alternative is now a plain ALLOW, (c) data-quoting alternative is now a plain marking point under max 2
- fix_type: format
- changed_file: markscheme.md
- before: "- ALLOW: use a (digital) pulse or heart rate monitor (1)"
- after:  "- ALLOW: use a (digital) pulse or heart rate monitor"
- answers_changed: no

## Q20
- verdict: FIXED
- agreement: full
- issues:
  - (a) ALLOW bullet carried a mark
- fix_type: format
- changed_file: markscheme.md
- before: "- ALLOW: heart muscle cells cannot respire and may die / heart attack (1)"
- after:  "- heart muscle cells cannot respire (aerobically) and may die / heart attack (1)"
- answers_changed: no

## Q21
- verdict: FIXED
- agreement: full
- issues:
  - (b) ALLOW bullet carried a mark
- fix_type: format
- changed_file: markscheme.md
- before: "- ALLOW: lungs need low pressure to avoid damaging the (lung) capillaries (1)"
- after:  "- lungs need low pressure to avoid damaging the (lung) capillaries (1)"
- answers_changed: no

## Q22
- verdict: CLEAN
- agreement: full
- issues: none (solver's overlap concern dismissed: six distinct points, max 5, tricuspid allowed)

## Q23
- verdict: CLEAN
- agreement: full
- issues: none (cross-topic use of 12.3.6/12.3.7 is permitted application at Supplement tier)

## Q24
- verdict: FIXED
- agreement: full
- issues:
  - solver noted the real shunt direction (left to right) differs from the simple mixing model; the question states the premise and the IGCSE expectation is mixing, but a physiologically accurate answer should also score
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- so less energy is released (so the baby tires easily) (1)\n- max 3"
- after:  "- so less energy is released (so the baby tires easily) (1)\n- ALLOW: some oxygenated blood passes into the right ventricle and is pumped back to the lungs, so less oxygenated blood is pumped to the body\n- max 3"
- answers_changed: no

## Q25
- verdict: FIXED
- agreement: full
- issues:
  - (b) ALLOW bullet carried a mark
  - (d) "two functions" could reasonably be answered with two different exchanges (solver's note); scheme now says so explicitly and has max 2
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- ALLOW: thinner wall and wider lumen than X (1)"
- after:  "- ALLOW: thinner wall than X / wider lumen than X" (plus in (d): "- ALLOW: supply of oxygen and glucose to cells and removal of carbon dioxide and urea from cells, credited as two separate functions" and "- max 2")
- answers_changed: no

## Q26
- verdict: CLEAN
- agreement: full
- issues: none

## Q27
- verdict: FIXED
- agreement: full
- issues:
  - (b) and (c) ALLOW bullets carried marks; solver's overlap concern dismissed, each part has its own distinct points
- fix_type: format
- changed_file: markscheme.md
- before: "- ALLOW: blood flows slowly, so there is more time for exchange (1)"
- after:  "- blood flows slowly (through the narrow lumen), so there is more time for exchange (1)"
- answers_changed: no

## Q28
- verdict: CLEAN
- agreement: full
- issues: none

## Q29
- verdict: CLEAN
- agreement: full
- issues: none (solver suggested plasma/fibrinogen for (a)(ii); dismissed: 9.4.1 lists the four components and 9.4.3(c) assigns clotting to platelets, and fibrinogen is Supplement only)

## Q30
- verdict: CLEAN
- agreement: full
- issues: none
