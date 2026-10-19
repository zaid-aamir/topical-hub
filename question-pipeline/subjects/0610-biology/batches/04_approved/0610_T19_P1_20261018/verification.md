---
batch_id: 0610_T19_P1_20261018
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 30, clean: 14, fixed: 16, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: FIXED
- agreement: full
- issues:
  - No separate solver (owner decision); verifier blind solve only.
  - models: generator GPT-6 (Codex), no solver, verifier claude-fable-5-1; no two roles share a model
  - batch was published on 2026-10-18 without verification; verified 2026-10-19
  - answer-letter spread over the 15 MCQs is A 4, B 4, C 4, D 3, no letter three in a row; no reorder needed
  - distractors C and D were nonsensical ("decomposers creating new energy", "carbon dioxide alone"), not plausible options
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "A soil minerals / C decomposers creating new energy / D carbon dioxide alone"
- after:  "A mineral ions in the soil / C heat released by decomposers / D carbon dioxide in the air"; rationale updated
- answers_changed: no

## Q2
- verdict: FIXED
- agreement: full
- issues:
  - correct option restated the syllabus definition of a producer, giving the answer away; options described actions rather than organisms
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "A a rabbit eating grass / B a hawk eating a rabbit / C a fungus decomposing dead grass / D grass making organic nutrients by photosynthesis"
- after:  "A a rabbit / B a hawk / C a fungus growing on dead grass / D grass"; rationale updated
- answers_changed: no

## Q3
- verdict: CLEAN
- agreement: full
- issues: none

## Q4
- verdict: FIXED
- agreement: full
- issues:
  - distractor D ("absorbing sunlight without using organic material") was not a plausible feeding description
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "D absorbing sunlight without using organic material"
- after:  "D absorbing mineral ions from the soil"; rationale updated
- answers_changed: no

## Q5
- verdict: FIXED
- agreement: full
- issues:
  - stem line began "A mammal ...", which reads like a fifth option letter line; reworded for safety
- fix_type: format
- changed_file: questions.md
- before: "A mammal eats only other animals. How is it described?"
- after:  "One species of mammal eats only other animals. How is this mammal described?"
- answers_changed: no

## Q6
- verdict: CLEAN
- agreement: full
- issues: none

## Q7
- verdict: FIXED
- agreement: full
- issues:
  - distractors B and D were absurd ("extinction of all producers within a day", "conversion of water fleas into producers")
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "B the extinction of all producers within a day / D conversion of water fleas into producers"
- after:  "B an increase in water fleas / D no change in the number of small fish"; rationale updated to dismiss each distractor
- answers_changed: no

## Q8
- verdict: FIXED
- agreement: full
- issues:
  - stem did not use the syllabus terms "pyramid of biomass" / "pyramid of numbers" (19.2.12)
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "Why can biomass represent this chain better than organism counts?"
- after:  "Why does a pyramid of biomass represent this food chain better than a pyramid of numbers?"; rationale expanded to cover every distractor
- answers_changed: no

## Q9
- verdict: FIXED
- agreement: full
- issues:
  - correct option contained its own explanation ("...ultimately transferred as heat"); distractors C and D were absurd ("creation of new sunlight", "return of all its energy directly to the producer")
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "A photosynthesis in its muscle cells / B respiration releasing energy that is ultimately transferred as heat / C creation of new sunlight / D return of all its energy directly to the producer"
- after:  "Which process in a living consumer transfers energy from the consumer to the environment? A digestion / B respiration / C growth / D photosynthesis"; rationale rewritten
- answers_changed: no

## Q10
- verdict: CLEAN
- agreement: full
- issues: none

## Q11
- verdict: FIXED
- agreement: full
- issues:
  - all three distractors were absurd ("Cattle produce extra energy from nothing", "Humans cannot digest any crop plants", "Crops have no chemical energy until cattle eat them")
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "A Cattle produce extra energy from nothing. / B Humans cannot digest any crop plants. / C Crops have no chemical energy until cattle eat them."
- after:  "A Cattle store all of the energy in the crops they eat. / B Humans digest plant material more efficiently than cattle do. / C Crop plants do not respire, so they lose no energy."; rationale updated
- answers_changed: no

## Q12
- verdict: FIXED
- agreement: full
- issues:
  - distractors C and D were not nitrogen-cycle processes ("evaporation", "combustion of all carbohydrates"); replaced with the other two microorganism roles from 19.3.3 so the item actually tests the point
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "C evaporation / D combustion of all carbohydrates"
- after:  "C nitrification / D decomposition"; rationale rewritten to distinguish all four processes
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
- verdict: FIXED
- agreement: full
- issues:
  - distractors A and D were absurd ("all deer become producers", "unlimited increase in food supply")
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "A an increase because all deer become producers / C no possible effect on survival / D an unlimited increase in food supply"
- after:  "A an increase, because the survivors reproduce faster / C no effect, because disease only affects old deer / D an increase, because the disease kills the deer's predators"; rationale updated
- answers_changed: no

## Q16
- verdict: FIXED
- agreement: full
- issues:
  - part (b) wording was vague ("its movement through animals and its eventual destination")
- fix_type: wording
- changed_file: questions.md
- before: "(b) Describe its movement through animals and its eventual destination. [2]"
- after:  "(b) Describe how this energy moves through the animals in the food chain and where it is eventually transferred. [2]"
- answers_changed: no

## Q17
- verdict: FIXED
- agreement: full
- issues:
  - command word "State" is not appropriate for writing out a food chain; mark scheme split the chain arbitrarily into two halves instead of crediting order and arrow direction
- fix_type: markscheme_allow
- changed_file: questions.md, markscheme.md
- before: "(a) State the food chain in the direction of energy transfer." / MS: "Pondweed → snail. (1) / Snail → fish → heron, completing the chain in this order. (1)"
- after:  "(a) Write out the food chain, using arrows to show the direction of energy transfer." / MS: all four organisms in correct order (1); arrows from eaten to eater (1); REJECT arrows towards producer; worked solution updated
- answers_changed: no

## Q18
- verdict: CLEAN
- agreement: full
- issues: none

## Q19
- verdict: FIXED
- agreement: full
- issues:
  - "trophic role" is not syllabus terminology; the syllabus uses "trophic level" (19.2.13)
- fix_type: wording
- changed_file: questions.md
- before: "state its trophic role in this chain"
- after:  "state its trophic level in this chain"
- answers_changed: no

## Q20
- verdict: CLEAN
- agreement: full
- issues: none

## Q21
- verdict: FIXED
- agreement: full
- issues:
  - mark scheme for (a) did not credit the obvious answer that a pyramid of numbers would be inverted
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "(a) two marking points only"
- after:  "added: ALLOW: a pyramid of numbers would be inverted / top-heavy, suggesting too few producers"
- answers_changed: no

## Q22
- verdict: CLEAN
- agreement: full
- issues: none

## Q23
- verdict: FIXED
- agreement: full
- issues:
  - stem wording was unclear ("energy available in a measured interval", "herbivore production contains 2700 kJ from that input"); calculation re-done and confirmed; mark scheme lacked a correct-answer-only rule
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "Plants contain 18 000 kJ of energy available in a measured interval. Herbivore production contains 2700 kJ from that input."
- after:  "In one year, the plants in a field contain 18 000 kJ of energy. The herbivores that feed on these plants store 2700 kJ of this energy in new tissue."; parts (a) and (b) reworded to match; MS (a) rewritten as method (1) + answer (1) with ALLOW 2 marks for correct answer alone
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
- verdict: FIXED
- agreement: full
- issues:
  - (b) asks for two processes returning carbon dioxide; syllabus 19.3.1 lists decomposition as a process in the carbon cycle but the scheme credited only respiration and combustion
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "(b) respiration (1); combustion (1)"
- after:  "added: ALLOW: decomposition (by decomposers) as one of the two processes"
- answers_changed: no

## Q27
- verdict: CLEAN
- agreement: full
- issues: none

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
