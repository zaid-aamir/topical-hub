---
batch_id: T01_20260923_01
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 30, clean: 23, fixed: 7, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues:
  - Models: generator (claude-sonnet-5) and solver A (claude-sonnet-5) share a model. Solver B (claude-haiku-4-5-20251001) and verifier (claude-fable-5-1) are distinct. Information only.

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
- verdict: FIXED
- agreement: full
- issues:
  - Interpreting a heating curve (identifying melting from a temperature plateau) is syllabus point 1.1.5, which is Supplement, but the question was tagged core with 1.1.3 only.
- fix_type: format
- changed_file: questions.md
- before: "tier: core / syllabus_points: [\"1.1.3\"]"
- after:  "tier: supplement / syllabus_points: [\"1.1.3\", \"1.1.5\"]"
- answers_changed: no

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
- issues: none (solver B offered "evaporation" as an alternative for the 18–22 min change; the mark scheme's REJECT of "evaporating" alone is correct because the whole liquid changes state at a fixed temperature)

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
  - Mark scheme (a) third marking point credited "move more randomly / with more energetic collisions", which is not a real change (gas particles already move randomly) and overlapped with (b). The ALLOW note also invited "vibrate", which is a solid-particle description.
- fix_type: wording
- changed_file: markscheme.md
- before: "(a) ... they move more randomly / with more energetic collisions (1); ALLOW 'particles vibrate/move more vigorously' for one mark if speed is also mentioned. (b) ... collide with the inside walls more often (1); and with greater force each time, so the total force per unit area (pressure) increases (1)"
- after:  "(a) ... they collide with each other and with the walls of the can more often (1); ALLOW 'move more vigorously' for the second mark; IGNORE 'vibrate more'. (b) hit the walls more often and with greater force each time (1); volume of the can is fixed, so the greater total force per unit area of wall means a higher pressure (1)"
- answers_changed: no

## Q16
- verdict: CLEAN
- agreement: full
- issues: none

## Q17
- verdict: FIXED
- agreement: full
- issues:
  - Part (b) stated the air in the diver's lungs is "at normal atmospheric pressure"; underwater the lungs are at ambient (higher than atmospheric) pressure, and the worked solution itself hedged on this. The tested idea only needs "much lower pressure than the cylinder".
- fix_type: wording
- changed_file: questions.md
- before: "Once in the diver's lungs, this air is at normal atmospheric pressure, much lower than the pressure inside the cylinder."
- after:  "Once in the diver's lungs, this air is at a much lower pressure than the pressure inside the cylinder."
- answers_changed: no

## Q18
- verdict: FIXED
- agreement: full
- issues:
  - Part (b) is worth 3 marks but the mark scheme listed only two marking points plus a vague "any one further correct comparative statement" line, so the allocation of the third mark was undefined (solver A raised this).
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "two compound marking points (surface vs throughout; any temperature vs boiling point) plus 'any one further correct, distinct comparative statement ... may be credited ... up to [3] total'"
- after:  "three explicit marking points: evaporation at any temperature below the boiling point (1); boiling only at the fixed boiling point (1); evaporation only at the surface whereas boiling throughout the liquid (1); ALLOW bubbles forming inside the liquid for the third mark"
- answers_changed: no

## Q19
- verdict: CLEAN
- agreement: full
- issues: none

## Q20
- verdict: FIXED
- agreement: full
- issues:
  - Mark scheme (b) credited "the particles move closer together" as freezing takes place. The substance is water, which expands on freezing, so this point is factually wrong for the context and the question only asks about arrangement and motion anyway.
- fix_type: wording
- changed_file: markscheme.md
- before: "the particles move closer together (1); the particles become arranged in a fixed, regular (ordered) pattern and are no longer free to move past one another, only vibrating about fixed positions (1)"
- after:  "the forces of attraction between the particles hold them in a fixed, regular (ordered) arrangement / lattice (1); the particles are no longer free to move past one another and only vibrate about fixed positions (1); IGNORE statements about particles moving closer together"
- answers_changed: no

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
  - Option C read "evaporation only", which is not exam-style wording and signposts that it is a distractor.
- fix_type: wording
- changed_file: questions.md
- before: "C evaporation only"
- after:  "C evaporation"
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
- verdict: CLEAN
- agreement: full
- issues: none

## Q28
- verdict: FIXED
- agreement: full
- issues:
  - Mark scheme (a) gave the second observation mark for "this spreading happens gradually/slowly, without any stirring", which is a restatement of the stem rather than an observation; the usual second observation (crystal dissolves / water eventually purple throughout) was only an ALLOW.
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "purple colour spreading out slowly from the crystal (1); this spreading happens gradually/slowly, without any stirring (1)"
- after:  "purple colour spreads out (slowly) from the crystal through the water (1); the crystal becomes smaller / dissolves OR the water eventually becomes (pale) purple throughout (1); IGNORE references to rate"
- answers_changed: no

## Q29
- verdict: CLEAN
- agreement: full
- issues: none (classic ammonia / hydrogen chloride tube demonstration, but the wording and parts are generic, not a copy of a specific paper)

## Q30
- verdict: CLEAN
- agreement: full
- issues: none (solver B described the trend as roughly directly proportional, which the mark scheme does not credit or require; solver A's note that no exact time can be calculated in (b) is already handled by the mark scheme's ALLOW line)
