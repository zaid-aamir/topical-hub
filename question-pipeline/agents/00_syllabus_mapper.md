# Agent 00: Syllabus Mapper (run once per subject)

All paths are relative to `question-pipeline/`. Your subject folder is `subjects/<subject_id>/`, given by the session.

You build the master map for one Cambridge IGCSE subject. **Every later stage trusts your output**, and the owner will check it against the PDF, so exactness matters more than speed. Copy wording exactly. Never invent, paraphrase or "improve" content.

## Input
- `subjects/<subject_id>/reference/<code>_syllabus_2026-2028.pdf`

First confirm the cover says the syllabus is for exams in 2026, 2027 and 2028 and matches the subject code. If not, STOP and log the problem.

## How to read the PDF (it has two columns)

- Extract page by page with `pdftotext -f N -l N -layout <pdf> -`. In the subject content, **Core points are in the left column and Supplement points in the right column**, side by side. Use the column position, and the numbering (Core and Supplement share one number sequence within a heading, e.g. Core 1–8 then Supplement 9–12), to tag each point.
- Points can continue onto the next line or the next page; join them.
- **Equations are often broken across lines** (a fraction prints as three lines). Rebuild them in one-line form, e.g. `ρ = m / V`, `v = f λ`. Keep Greek letters and symbols as Unicode.
- Sub-items like `(a)`, `(b)` belong to their point; keep them in the point text, separated by `; `.
- When the layout is unclear, look at the page itself: render it with `pdftoppm -f N -l N -png -r 110 <pdf> <out>` on the device, or stage the PDF into your container with `mcp__remote-devices__device_stage_files` and view the page with the Read tool (`pages` parameter). Don't guess.

## Output 1: `config/syllabus_map.json`

```json
{
  "subject_id": "0625-physics",
  "subject_name": "Physics",
  "syllabus": "0625",
  "years": "2026-2028",
  "source_file": "subjects/0625-physics/reference/0625_syllabus_2026-2028.pdf",
  "syllabus_version": "Version N (as on the cover)",
  "tier_notes": "Who sits which papers, from the assessment overview",
  "papers": [ { "paper": "1", "name": "...", "type": "mcq|structured|practical|alternative_to_practical", "tier": "core|extended|all", "marks": 0, "duration_minutes": 0, "weighting_percent": 0 } ],
  "command_words": { "State": "definition from syllabus" },
  "data_provided": {
    "given": ["data the syllabus says is provided in the exam, with page ref"],
    "not_given": ["things the syllabus says candidates must recall, e.g. every equation marked 'recall and use', with point ids"],
    "conventions": ["notation, units, symbols, significant figures, naming conventions stated in the syllabus"],
    "appendices": ["short summary of any appendix lists (symbols and units, electrical symbols, safety, mathematical requirements, etc.) with page refs"]
  },
  "topics": [
    {
      "topic_id": "1",
      "topic_name": "Motion, forces and energy",
      "subtopics": [
        {
          "subtopic_id": "1.5.1",
          "subtopic_name": "Effects of forces",
          "parent_id": "1.5",
          "parent_name": "Forces",
          "points": [
            { "point_id": "1.5.1.9", "tier": "supplement", "text": "exact wording", "diagram_dependence": "none", "diagram_note": "" }
          ]
        }
      ]
    }
  ]
}
```

Rules:
- `subtopic_id` is the **finest numbered heading** that has points under it: `1.4` if 1.4 has no deeper headings, `1.5.1` if 1.5 is split into 1.5.1, 1.5.2, … For a deeper heading, set `parent_id` / `parent_name` to the heading above it; otherwise omit both.
- `point_id` is `<subtopic_id>.<number as printed>`. Use the syllabus's own numbers.
- `tier` is `core` (left column) or `supplement` (right column), exactly as the syllabus shows. If unsure, tag `supplement` and list it in the log for checking.
- `diagram_dependence` — judge every point:
  - `none`: fully testable in words, numbers and Markdown tables.
  - `partial`: exam questions often use a diagram or graph, but the point can be tested fairly with a text description or a data table instead.
  - `essential`: cannot be tested without a drawn picture, e.g. draw/label/identify structures on a diagram, draw or complete ray diagrams, draw circuit diagrams, sketch or interpret the shape of a graph. Give a short `diagram_note` saying why.
- Include practical-skills content only if the syllabus lists it as numbered learning points in the subject content.
- Fill every number in `papers` from the syllabus. Never guess.

## Output 2: `config/diagram_coverage.md`

A short report: per topic and in total, the count and percentage of points that are `none`, `partial` and `essential`, split by tier; then the full list of `essential` point ids with their notes.

## Output 3: `subject.md` (draft rules for the generator and verifier)

Write it from the syllabus only, citing page numbers. Sections, in this order:
1. **Exam data given** — exactly what the exam provides (e.g. constants, data sheets, symbols lists), or "none stated".
2. **Must be recalled, never given** — equations and facts the syllabus says candidates recall (list them with point ids).
3. **Notation and units** — how to write quantities, units and symbols in plain text for this subject. Use `^` for powers (`m/s^2`, `3.0 × 10^8 m/s`), Unicode for Greek letters (ρ, λ, Ω, θ) and `×` for multiplication. For biology: standard naming conventions the syllabus states.
4. **Calculation conventions** — significant figures, rounding, units in answers, anything the syllabus states.
5. **Diagrams** — points marked `essential` are out of scope (list ids). For `partial` points, questions describe the diagram in words or give a Markdown data table.
6. **Subject-specific checks for the verifier** — e.g. physics: check units and dimensions of every equation, check that the equation used is on the syllabus; biology: check terminology matches the syllabus wording.
7. **Anything else** the syllabus says about how questions are set.

## Also create
- `logs/progress.json`: `{ "subject_id": "...", "batches": {} }`
- `logs/run_log.md`: a header line if it doesn't exist.

## Finish
Append one line to `logs/run_log.md` with a single shell `>>`: `date | MAPPED | <subject_id> | topics N, sub-topics N, points N (core N, supplement N), diagram essential N | items needing human checking (point ids)`.

Reply with a short report: counts, the % of essential-diagram points, pages that were hard to read, and every point you were unsure about.
