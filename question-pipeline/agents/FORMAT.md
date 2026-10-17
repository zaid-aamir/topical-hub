# Shared Format Specification (question-pipeline v1, all subjects)

Every agent reads this file. The website parses these files automatically, so follow the format **exactly**: same headings, same field names, same order. Do not add extra sections.

All paths are relative to the `question-pipeline/` folder. Each subject lives in `subjects/<subject_id>/`, e.g. `subjects/0625-physics/`.

---

## Subject folder layout

```
subjects/<subject_id>/
  subject.md                  subject rules: data given/not given, notation, conventions (agents MUST follow)
  reference/<code>_syllabus_<years>.pdf   the official syllabus, the ONLY Cambridge document allowed (gitignored)
  config/syllabus_map.json    topics, sub-topics, learning points, papers, command words, data notes
  config/diagram_coverage.md  how many learning points need diagrams
  config/batch_plan.json      the list of batches to generate (written by the managing chat)
  batches/01_drafts/  02_solved/  03_flagged/  04_approved/
  logs/run_log.md             append-only history; never contains answers
  logs/progress.json          per-batch status
```

---

## Batch IDs

`<code>_T<NN>_P<n>_<YYYYMMDD>`, e.g. `0625_T04_P2_20261013`

- `<code>` is the 4-digit syllabus code (`0610`, `0625`).
- `T<NN>` is the two-digit topic number from the syllabus map.
- `P<n>` is the part number within that topic. A topic with many learning points is split into several parts in `config/batch_plan.json`; each part covers a listed set of sub-topics.
- The date is the day the batch was generated.

Each batch lives in its own folder: `subjects/<subject_id>/batches/<stage>/<batch_id>/`

---

## Batch contents

| File | Written by | Read by |
|---|---|---|
| `questions.md` | Generator (Verifier may fix in place) | Solver, Verifier, website |
| `markscheme.md` | Generator (Verifier may fix in place) | Verifier, website. **Never the Solver** |
| `solver_answers.md` | Solver | Verifier |
| `verifier_answers.md` | Verifier (blind solve, written before it opens anything else) | Verifier |
| `verification.md` | Verifier | human |

---

## Published output (what the website reads)

- The website reads **only** `subjects/<subject_id>/batches/04_approved/<batch_id>/questions.md` and `markscheme.md`.
- Every question left in those two files is publishable. Withheld questions have been moved to `batches/03_flagged/<batch_id>/`.
- **Question numbering can have gaps.** Match questions to mark scheme entries by the `## Q<n>` heading, never by position.
- A topic page shows every approved batch with that `topic_id`, in part order.

---

## `questions.md`

```markdown
---
batch_id: 0625_T04_P2_20261013
subject_id: "0625-physics"
syllabus: "0625 (2026-2028)"
topic_id: "4"
topic_name: "Electricity and magnetism"
part: 2
subtopic_ids: ["4.3", "4.4"]
created: 2026-10-13
generator_model: "<model name>"
---

## Q1
- id: 0625_T04_P2_20261013_Q1
- type: mcq            # mcq | structured
- tier: core           # core | supplement
- subtopic_id: "4.3"
- subtopic_name: "Electric circuits"
- syllabus_points: ["4.3.1.2"]
- difficulty: 2        # 1 = easy, 2 = medium, 3 = hard (relative to IGCSE)
- marks: 1
- needs_diagram: false

**Question**

Question text here.

A option text
B option text
C option text
D option text

## Q2
- id: 0625_T04_P2_20261013_Q2
- type: structured
- tier: supplement
- subtopic_id: "4.4"
- subtopic_name: "Electrical safety"
- syllabus_points: ["4.4.3"]
- difficulty: 3
- marks: 6
- needs_diagram: false

**Question**

(Optional shared stem / context here.)

(a) State ... [1]

(b) Calculate ... [3]

(c) Explain why ... [2]
```

Rules:
- Write the metadata list exactly as shown, with no `#` comments in the real files.
- Part marks in square brackets at the end of each part. They must sum to `marks`.
- MCQ options are either plain lines `A text` … `D text` on consecutive lines, or a Markdown table whose first column is the option letter (blank first header cell).
- Tables in Markdown table syntax. No images, no links, no raw HTML.
- **Notation, units and data**: follow `subject.md` exactly. Give exactly what the real exam gives, no more and no less. Never give anything the syllabus expects students to recall.

---

## `markscheme.md`

```markdown
---
batch_id: 0625_T04_P2_20261013
---

## Q1
- answer: C

**Rationale**
One or two sentences on why C is right and why each distractor is wrong.

**Worked solution**
(Optional for MCQs.) A short teaching explanation.

## Q2

**(a)** [1]
- marking point (1)

**(b)** [3]
- method point (1)
- ALLOW: alternative
- final answer with unit (1)

**(c)** [2]
- ...

**Worked solution**
A full student-friendly explanation of the whole question, written for a student who got it wrong.
```

Rules:
- One marking point per bullet, each ending with (1) or the marks it's worth. ALLOW / REJECT / IGNORE / ECF bullets carry no marks.
- Calculations: final answer with unit and sensible significant figures, plus method marks, plus ECF where an earlier error should still earn credit.
- Every structured question ends with a **Worked solution**. MCQs must have a **Rationale** and may also have a **Worked solution**.
- Across a batch's 15 MCQs, each of A–D is the correct answer 3–5 times, never the same letter three questions in a row.

---

## `solver_answers.md` and `verifier_answers.md`

```markdown
---
batch_id: 0625_T04_P2_20261013
solver: S            # S for the solver, verifier for the verifier's blind solve
solver_model: "<model name>"
---

## Q1
- answer: C
- confidence: high     # high | medium | low
- working: brief reasoning

## Q2
**(a)** answer ...
**(b)** answer ...
- final_numeric_answers: ["0.25 A"]   # calculation parts only, else []
- confidence: medium
- notes: anything ambiguous, unclear, or seemingly wrong about the question itself
```

---

## `verification.md`

```markdown
---
batch_id: 0625_T04_P2_20261013
verifier_model: "<model name>"
batch_route: PUBLISHED     # PUBLISHED | ALL_WITHHELD
counts: { published: 28, clean: 22, fixed: 6, answer_fixes: 1, withheld: 2 }
sampled: no
---

## Q1
- verdict: CLEAN          # CLEAN | FIXED | WITHHELD
- agreement: full         # full | partial | none
- issues: none

## Q6
- verdict: FIXED
- agreement: full
- issues:
  - what was wrong
- fix_type: context       # wording | context | procedure | format | markscheme_allow | data | answer
- changed_file: questions.md
- before: "..."
- after:  "..."
- answers_changed: no     # yes only for fix_type: answer

## Q7
- verdict: WITHHELD
- agreement: none
- issues:
  - why it can't be published
- withheld_reason: ambiguous   # wrong_unresolved | ambiguous | out_of_scope | possible_copy | needs_diagram | other
```

Routing: CLEAN and FIXED questions stay and are published (fixes applied in place). WITHHELD questions are moved to `batches/03_flagged/<batch_id>/`. The batch then moves to `batches/04_approved/`, unless every question was withheld.
