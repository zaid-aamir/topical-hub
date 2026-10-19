---
batch_id: 0610_T21_P1_20261018
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 20, clean: 9, fixed: 11, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: FIXED
- agreement: full
- issues:
  - No separate solver (owner decision); verifier blind solve only.
  - models: generator GPT-6 (Codex), no solver, verifier claude-fable-5-1; no two roles share a model
  - batch was published early on owner approval without a check; this is a retrospective verification
  - answer-letter spread over the 10 MCQs is within the scaled range (A 2, B 3, C 3, D 2) and no letter repeats three in a row; no reorder needed
  - distractors A, C and D were absurd (no genetic information, never need nutrients, every bacterium is a human cell), so the item tested nothing
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "A They contain no genetic information. / C They never need nutrients. / D Every bacterium is a human body cell."
- after:  "A They have a nucleus containing many chromosomes. / C They can only make simple molecules such as glucose. / D They reproduce slowly, so cultures are easy to control." (rationale updated to match)
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
  - options C and D carried a stray "only" that hinted they were distractors
- fix_type: wording
- changed_file: questions.md
- before: "C lipase only / D amylase only"
- after:  "C lipase / D amylase"
- answers_changed: no

## Q7
- verdict: FIXED
- agreement: full
- issues:
  - distractors were absurd absolutes ("always absorb all surrounding heat", "removes all nutrients", "every enzyme works best at boiling temperature")
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "A Microorganisms always absorb all surrounding heat. / B Cooling removes all nutrients. / D Every enzyme works best at boiling temperature."
- after:  "A Microorganisms absorb heat from the surroundings as they grow. / B Cooling removes waste products from the culture. / D Enzymes in the microorganisms work best at low temperatures." (rationale updated to match)
- answers_changed: no

## Q8
- verdict: FIXED
- agreement: full
- issues:
  - option B gave away its own status by stating it does not change genes
- fix_type: wording
- changed_file: questions.md
- before: "B choosing two high-yield parents to breed without changing individual genes directly"
- after:  "B selecting two high-yield parents and breeding them together"
- answers_changed: no

## Q9
- verdict: FIXED
- agreement: full
- issues:
  - distractors were absurd ("every insect species becomes extinct", "no further need for water", "automatic resistance to every disease")
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "A a guarantee that every insect species becomes extinct / C no further need for water / D automatic resistance to every disease"
- after:  "A the crop no longer needs fertiliser / C the crop can be grown without irrigation / D the crop becomes resistant to all plant diseases" (rationale updated to match)
- answers_changed: no

## Q10
- verdict: CLEAN
- agreement: full
- issues: none

## Q11
- verdict: FIXED
- agreement: full
- issues:
  - (a) used "Explain" but the mark scheme (correctly, for a 21.1.1 State point) credits naming the two features; command word did not match the marks
  - (b) second marking point ("each producing cell can contribute") was vague and did not link the second feature to large-scale production
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "(a) Explain two biological features that make bacteria suitable. [2]"
- after:  "(a) State two biological features of bacteria that make them suitable. [2]"; (b) point 2 now links making complex molecules to producing the protein, original wording kept as ALLOW; worked solution updated
- answers_changed: no

## Q12
- verdict: CLEAN
- agreement: full
- issues: none

## Q13
- verdict: CLEAN
- agreement: full
- issues: none

## Q14
- verdict: FIXED
- agreement: full
- issues:
  - (b) mark scheme awarded 1 mark for "mass and type of fruit", but the question states the two samples are equal masses of the same fruit, so those are not variables the student should name; the scheme also bundled two variables per mark
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- The temperature and treatment duration. (1) / - The mass and type of fruit, with the same crushing method. (1)"
- after:  "- Any two of: temperature; time; pH; volume of liquid added; crushing method; ripeness. (1 each, max 2) / - REJECT: mass or type of fruit"; (a) gained ALLOW for clearer juice and the pectin/cell-wall explanation; worked solution updated
- answers_changed: no

## Q15
- verdict: FIXED
- agreement: full
- issues:
  - mark scheme lacked ALLOW for other valid controls (pH, agitation, enzyme-free comparison) and for the soluble-products explanation
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "(no ALLOW lines)"
- after:  "ALLOW: same pH; same agitation; enzyme-free powder as comparison" and "ALLOW: amino acids / soluble products dissolve in the water and are washed away"
- answers_changed: no

## Q16
- verdict: FIXED
- agreement: full
- issues:
  - (b) asked for two advantages but both marking points were the same advantage restated (less undigested lactose; drink more comfortably), so a correct second advantage could not be credited
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- It reduces the lactose that would otherwise remain undigested. (1) / - It allows people with lactose intolerance to consume the treated milk more comfortably. (1)"
- after:  "- lactose-intolerant people can drink the milk without symptoms, because lactose no longer passes undigested into the large intestine (1) / - they still obtain the nutrients in milk such as calcium and protein (1) / ALLOW: sweeter taste"; worked solution rewritten to explain
- answers_changed: no

## Q17
- verdict: CLEAN
- agreement: full
- issues: none

## Q18
- verdict: CLEAN
- agreement: full
- issues: none

## Q19
- verdict: FIXED
- agreement: full
- issues:
  - (b) scheme listed only two specific concerns for an open "Describe two possible disadvantages or concerns"
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "(no ALLOW line)"
- after:  "ALLOW: reduced biodiversity; increased herbicide use; seed cost / dependence on seed company; long-term health concerns; max 2"
- answers_changed: no

## Q20
- verdict: FIXED
- agreement: full
- issues:
  - (b) scheme listed only two issues for an open "Describe two issues"
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "(no ALLOW line)"
- after:  "ALLOW: safety testing for allergens or toxicity; public acceptance and labelling; max 2"
- answers_changed: no
