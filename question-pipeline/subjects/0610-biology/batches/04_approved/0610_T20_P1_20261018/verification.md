---
batch_id: 0610_T20_P1_20261018
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 30, clean: 16, fixed: 14, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: FIXED
- agreement: full
- issues:
  - No separate solver (owner decision); verifier blind solve only.
  - Models: generator GPT-6 (Codex); verifier claude-fable-5-1; no solver. No two roles share a model.
  - Distractors A, C and D were absurd absolutes ("every mineral ion", "increasing insect damage", "stopping all photosynthesis"), so the item tested reading rather than biology.
- fix_type: wording
- changed_file: questions.md
- before: "A by supplying every mineral ion directly / C by increasing insect damage / D by stopping all photosynthesis in the crop"
- after:  "A by supplying mineral ions to the crop plants / C by killing insect pests that damage the crop / D by supplying extra water to the crop plants (rationale updated to match)"
- answers_changed: no

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
  - Stem referred to "the syllabus definition" and called biodiversity a "measurement"; not exam language.
  - Distractors ("mass of the largest animal", "amount of rainfall alone") were not plausible.
- fix_type: wording
- changed_file: questions.md
- before: "Which measurement is the syllabus definition of biodiversity in an area? A the mass of the largest animal / B the total number of individuals of one species / C the number of different species / D the amount of rainfall alone"
- after:  "Which describes the biodiversity of an area? A the total number of organisms living in the area / B the number of individuals of one species in the area / C the number of different species living in the area / D the number of different habitats in the area (rationale updated)"
- answers_changed: no

## Q5
- verdict: CLEAN
- agreement: full
- issues: none

## Q6
- verdict: FIXED
- agreement: full
- issues:
  - Distractors A, C and D were nonsense ("rainwater converted to wood", "soil impossible to move").
- fix_type: wording
- changed_file: questions.md
- before: "A There are always more roots after clearing. / C All rainwater is immediately converted to wood. / D The soil becomes impossible to move."
- after:  "A The soil contains more mineral ions after clearing. / C Less water evaporates from leaves, so the soil becomes drier. / D Decomposers break down the soil more quickly. (rationale updated)"
- answers_changed: no

## Q7
- verdict: FIXED
- agreement: full
- issues:
  - Distractors A, B and D were nonsense ("photosynthesis by every fish", "conversion of oxygen into sunlight").
- fix_type: wording
- changed_file: questions.md
- before: "A photosynthesis by every fish / B oxygen production by bacteria in all conditions / D conversion of oxygen into sunlight"
- after:  "A photosynthesis by algae in the river / B anaerobic respiration by the fish / D evaporation of oxygen from the river surface (rationale updated)"
- answers_changed: no

## Q8
- verdict: CLEAN
- agreement: full
- issues: none (distractors weak but definitely wrong; difficulty tag of 3 is generous)

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
  - Stem listed machinery, fertiliser and insecticide but part (b) asked about herbicide as well.
  - Mark scheme had no ALLOW alternatives.
- fix_type: context
- changed_file: questions.md, markscheme.md
- before: "A farmer uses machinery, fertiliser and insecticide to increase production."
- after:  "A farmer uses machinery, fertiliser, insecticide and herbicide to increase production." (ALLOW bullets added to each marking point)
- answers_changed: no

## Q17
- verdict: FIXED
- agreement: full
- issues:
  - Question asks for any one advantage and disadvantage but the mark scheme gave a single acceptable answer each, so valid alternatives would be marked wrong.
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "one marking point per advantage/disadvantage, no alternatives"
- after:  "ALLOW lists of acceptable alternative advantages and disadvantages added under each marking point"
- answers_changed: no

## Q18
- verdict: FIXED
- agreement: full
- issues:
  - No ALLOW alternatives for an open "explain two consequences" question.
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "four marking points, no alternatives"
- after:  "ALLOW bullets added (local extinction; predator decline or prey switching; competitor increase and knock-on effects)"
- answers_changed: no

## Q19
- verdict: CLEAN
- agreement: full
- issues: none

## Q20
- verdict: FIXED
- agreement: full
- issues:
  - Calculation re-done and agrees. Part (b) mark scheme lacked ALLOW wording for endemic species.
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "part (b) two marking points, no alternatives"
- after:  "ALLOW bullets added (endemic / very small range; no other populations elsewhere)"
- answers_changed: no

## Q21
- verdict: CLEAN
- agreement: full
- issues: none

## Q22
- verdict: FIXED
- agreement: full
- issues:
  - Part (a) "two ways" limited to entanglement and ingestion; other valid harms not credited.
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "part (a) two marking points only"
- after:  "ALLOW any two: suffocation / toxic chemicals / microplastics in food chains / smothered habitat"
- answers_changed: no

## Q23
- verdict: CLEAN
- agreement: full
- issues: none

## Q24
- verdict: FIXED
- agreement: full
- issues:
  - Tagged core, but part (b) asks for specific management measures for forests and fish stocks, which are Supplement content (20.4.5, 20.4.6); at Core only 20.4.2 (resources can be managed sustainably) applies.
  - Mark scheme part (b) gave one measure each with no alternatives.
- fix_type: format
- changed_file: questions.md, markscheme.md
- before: "tier: core; syllabus_points: [20.4.1, 20.4.2]"
- after:  "tier: supplement; syllabus_points: [20.4.1, 20.4.2, 20.4.5, 20.4.6]; ALLOW lists of forest and fish management measures added to part (b)"
- answers_changed: no

## Q25
- verdict: FIXED
- agreement: full
- issues:
  - Part (b) "two conservation actions" credited only the two listed; monitoring and education (20.4.4) not mentioned.
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "part (b) two marking points only"
- after:  "ALLOW any two of: monitoring / protecting nesting sites / removing the predator / captive breeding and release / education"
- answers_changed: no

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
- agreement: full
- issues:
  - Open "two reasons"/"two benefits" question with a closed mark scheme; the syllabus list in 20.4.7 was not fully credited.
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "two fixed marking points per part"
- after:  "ALLOW bullets covering the 20.4.7 list (biodiversity, vulnerable ecosystems, nutrient cycling, food/drugs/fuel/genes, intact food webs)"
- answers_changed: no

## Q29
- verdict: CLEAN
- agreement: full
- issues: none

## Q30
- verdict: FIXED
- agreement: full
- issues:
  - Inbreeding / reduced ability to adapt by natural selection not credited in part (a).
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "part (a) two marking points, no alternatives"
- after:  "ALLOW: inbreeding expresses harmful recessive alleles / population less able to adapt by natural selection"
- answers_changed: no
