# Shared Format Specification

Every agent reads this file. The website will later parse these files automatically, so follow the format **exactly**: same headings, same field names, same order. Do not add extra sections.

---

## Batch IDs

`T<NN>_<YYYYMMDD>_<NN>`, e.g. `T04_20260923_01`

- `T<NN>` is the two-digit **topic** number from `config/syllabus_map.json` (topic 4 → `T04`). A batch covers one whole topic, never a single sub-topic.
- The trailing `NN` is a two-digit counter for batches of that topic made on that date

Each batch lives in its own folder: `pipeline/<stage>/<batch_id>/`

**Fix batches**: when the Verifier recycles part of a batch, the fix folder is `<batch_id>-fix<N>`, e.g. `T04_20260923_01-fix1`, where `N` is the fix round. It holds only the questions being fixed, keeping their original question ids, and its frontmatter carries `fix_of: <batch_id>`. The parent batch waits in `pipeline/06_awaiting_fix/<batch_id>/` meanwhile.

---

## Batch contents

| File | Written by | Read by |
|---|---|---|
| `questions.md` | Generator | Solvers, Verifier, human |
| `markscheme.md` | Generator | Verifier, human. **Never either Solver** |
| `solver_answers_A.md` | Solver A | Verifier, human. **Never Solver B** |
| `solver_answers_B.md` | Solver B | Verifier, human |
| `verification.md` | Verifier | human |

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
# fix_of: T04_20260923_01     # fix batches only; omit otherwise
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
- subtopic_id: "4.2"
- subtopic_name: "Hydrogen fuel cells"
- syllabus_points: ["4.2.1"]
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
- Tables in Markdown table syntax. Any data needed (e.g. Ar values) must be given in the question or come from the syllabus Periodic Table.
- No images, no links.

---

## `markscheme.md`

```markdown
---
batch_id: T04_20260923_01
# fix_of: T04_20260923_01     # fix batches only; omit otherwise
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
- Every question ends with a **Worked solution**. This is what students will see on the site, so it must teach, not just state.

---

## `solver_answers_A.md` / `solver_answers_B.md`

Same format for both. `solver` is A or B.

```markdown
---
batch_id: T04_20260923_01
solver: A
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
batch_route: FIXED       # AUTO_APPROVED | SAMPLED | FIXED | FLAGGED
sample_reason: none      # none | calibration | random
fix_round: 1             # 0 = never fixed; increments each recycle
counts: { clean: 7, flag: 1, fail: 0, fixed: 1, deleted: 0 }
---

## Q1
- verdict: CLEAN         # CLEAN | FLAG | FAIL
- agreement: full        # full | partial | none   (mark scheme vs Solver A vs Solver B vs verifier)
- issues: none

## Q2
- verdict: FLAG
- agreement: partial
- issues:
  - (b) Solver A and verifier agree with mark scheme; Solver B wrote ... because the wording "..." can be read two ways.
- suggested_fix: exact replacement text
```

Fixes applied by the Verifier are recorded per question:

```markdown
## Q6
- verdict: FLAG
- agreement: full
- issues:
  - Context is unrealistic: a drain cleaner solution would be 10-40x more concentrated.
- action: FIXED           # FIXED | DELETED | HUMAN
- fix_type: context       # wording | context | procedure | format | markscheme_allow
- changed_file: questions.md
- before: "A solution taken from a drain cleaner ..."
- after:  "A dilute laboratory solution of sodium hydroxide ..."
- answers_changed: no     # must always be "no" for an auto-fix
```

Routing rules (applied by the Verifier):
- Any FAIL, `possible_copy`, `needs_diagram`, any issue touching a final answer or the chemistry itself, or `fix_round` already 2 → `FLAGGED` (human)
- Otherwise, any FLAG the Verifier fixed or deleted → `FIXED`. The whole batch never goes back. The parent batch is parked in `pipeline/06_awaiting_fix/<batch_id>/` and only the fixed questions go to `pipeline/01_drafts/<batch_id>-fix<N>/` for a fresh solve.
- Every question CLEAN with full agreement → `AUTO_APPROVED` or `SAMPLED` (see the Verifier's sampling rule). For a `-fix<N>` batch, the fixed questions are merged back into the parent first and the completed parent batch is the thing routed.
