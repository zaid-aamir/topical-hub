# Shared Format Specification (v4, speed mode)

Every agent reads this file. The website parses these files automatically, so follow the format **exactly**: same headings, same field names, same order. Do not add extra sections.

---

## Batch IDs

`T<NN>_<YYYYMMDD>_<NN>`, e.g. `T04_20260923_01`

- `T<NN>` is the two-digit **topic** number from `config/syllabus_map.json` (topic 4 → `T04`). A batch covers one whole topic, never a single sub-topic.
- The trailing `NN` is a two-digit counter for batches of that topic made on that date.

Each batch lives in its own folder: `pipeline/<stage>/<batch_id>/`

---

## Batch contents

| File | Written by | Read by |
|---|---|---|
| `questions.md` | Generator (Verifier may fix in place) | Solver, Verifier, website |
| `markscheme.md` | Generator (Verifier may fix in place) | Verifier, website. **Never the Solver** |
| `solver_answers.md` | Solver | Verifier, human. **Never another solver** |
| `verifier_answers.md` | Verifier (blind solve, written before it opens anything else) | Verifier, human |
| `verification.md` | Verifier | human |

Older batches may hold `solver_answers_A.md` and `solver_answers_B.md` instead of `solver_answers.md`. Treat every file whose name starts with `solver_answers` as a solver file.

---

## Published output (what the website reads)

- The website reads **only** `pipeline/04_approved/<batch_id>/questions.md` and `markscheme.md`. It ignores every other file and every other folder.
- Every question left in those two files is publishable. Questions the verifier withheld have been moved out to `pipeline/03_flagged/<batch_id>/`.
- **Question numbering can have gaps** (e.g. Q1–Q6, Q8–Q30) because withheld questions are removed and nothing is renumbered. Match questions to mark scheme entries by the `## Q<n>` heading, never by position.

---

## `questions.md`

```markdown
---
batch_id: T04_20260923_01
syllabus: "0620 (2026-2028)"
topic_id: "4"
topic_name: "Electrochemistry"
created: 2026-09-23
generator_model: "<model name>"
---

## Q1
- id: T04_20260923_01_Q1
- type: mcq            # mcq | structured
- tier: core           # core | supplement
- subtopic_id: "4.1"
- subtopic_name: "Electrolysis"
- syllabus_points: ["4.1.2", "4.1.3"]
- difficulty: 2        # 1 = easy, 2 = medium, 3 = hard (relative to IGCSE)
- marks: 1
- needs_diagram: false

**Question**

Which substance is produced at the cathode when molten lead(II) bromide is electrolysed?

A bromine
B hydrogen
C lead
D oxygen

## Q2
- id: T04_20260923_01_Q2
- type: structured
- tier: supplement
- subtopic_id: "4.1"
- subtopic_name: "Electrolysis"
- syllabus_points: ["4.1.1", "4.1.6"]
- difficulty: 3
- marks: 6
- needs_diagram: false

**Question**

(Optional shared stem / context here.)

(a) State what is meant by the term *electrolysis*. [2]

(b) Write the ionic half-equation for the reaction at the anode. [2]

(c) Explain why ... [2]
```

Rules:
- The batch frontmatter is **topic-level**: `topic_id` and `topic_name` only. Sub-topic belongs to each question, as `subtopic_id` and `subtopic_name`, so topic pages can later be split into sub-topic pages.
- Part marks in square brackets at the end of each part. They must sum to `marks`.
- Chemical formulae as plain text with normal numbers: H2SO4, Cu2+, SO4 2−. Use state symbols (s), (l), (g), (aq) where the question requires them.
- Tables in Markdown table syntax. No images, no links.
- **Data**: give exactly what the real exam gives, no more and no less. Ar values (from `config/syllabus_map.json` only), the molar gas volume of 24 dm3 at r.t.p., and any bond-energy or experimental data may be given. **Never give anything the syllabus expects students to recall** — see `data_provided.not_given` in `config/syllabus_map.json` (for example the Avogadro constant).

---

## `markscheme.md`

```markdown
---
batch_id: T04_20260923_01
---

## Q1
- answer: C

**Rationale**
One or two sentences on why C is right and why each distractor is wrong.

## Q2

**(a)** [2]
- decomposition / breakdown of a compound (1)
- by (passing) electricity / electric current (1)
- REJECT: "splitting by electrons"

**(b)** [2]
- 2Br− → Br2 + 2e− (2)
- ALLOW: 2Br− − 2e− → Br2 (2)
- correct species but unbalanced (1)

**(c)** [2]
- ...

**Worked solution**
A full student-friendly explanation of the whole question, written for a student who got it wrong.
```

Rules:
- One marking point per bullet, each ending with (1) or the marks it's worth.
- Use ALLOW for acceptable alternatives, REJECT for common wrong answers, IGNORE for irrelevant extras, ECF where an error carried forward from an earlier part should still earn credit.
- Calculation questions: final answer with units and a sensible number of significant figures, plus method marks for working.
- Every structured question ends with a **Worked solution**. This is what students see on the site, so it must teach, not just state.
- MCQs must have a **Rationale** and may also have a **Worked solution**. The website shows the Worked solution if present, otherwise the Rationale.
- Across a batch's MCQs, each of A–D is the correct answer 3–5 times out of 15.

---

## `solver_answers.md` and `verifier_answers.md`

Same format for both. `solver` is `S` for the solver and `verifier` for the verifier's blind solve.

```markdown
---
batch_id: T04_20260923_01
solver: S
solver_model: "<model name>"
---

## Q1
- answer: C
- confidence: high     # high | medium | low
- working: brief reasoning

## Q2
**(a)** answer ...
**(b)** answer ...
- final_numeric_answers: ["0.25 mol", "6.0 g"]   # only for calculation parts, else []
- confidence: medium
- notes: anything ambiguous, unclear, or seemingly wrong about the question itself
```

---

## `verification.md`

```markdown
---
batch_id: T04_20260923_01
verifier_model: "<model name>"
batch_route: PUBLISHED     # PUBLISHED | ALL_WITHHELD
counts: { published: 28, clean: 22, fixed: 6, answer_fixes: 1, withheld: 2 }
sampled: no                # yes | no  (optional human check list, never blocks)
---

## Q1
- verdict: CLEAN          # CLEAN | FIXED | WITHHELD
- agreement: full         # full | partial | none  (mark scheme vs solver(s) vs verifier)
- issues: none

## Q6
- verdict: FIXED
- agreement: full
- issues:
  - Context is unrealistic: a drain cleaner solution would be 10-40x more concentrated.
- fix_type: context       # wording | context | procedure | format | markscheme_allow | data | answer
- changed_file: questions.md
- before: "A solution taken from a drain cleaner ..."
- after:  "A dilute laboratory solution of sodium hydroxide ..."
- answers_changed: no     # yes only for fix_type: answer

## Q7
- verdict: WITHHELD
- agreement: none
- issues:
  - Two options are defensible and no rewording keeps the tested point.
- withheld_reason: ambiguous   # wrong_unresolved | ambiguous | out_of_scope | possible_copy | needs_diagram | other
```

Routing rules (applied by the Verifier):
- CLEAN and FIXED questions stay in the batch and are published. Fixes are applied in place.
- WITHHELD questions are moved out of `questions.md` and `markscheme.md` into `pipeline/03_flagged/<batch_id>/`.
- The batch folder then moves to `pipeline/04_approved/`, unless every question was withheld (`ALL_WITHHELD`), in which case it moves to `pipeline/03_flagged/`.
