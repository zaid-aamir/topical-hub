# question-pipeline — original exam-style questions for any Cambridge IGCSE subject

These are **original exam-style topical questions, not past papers**. Never describe them as past papers. The only Cambridge document allowed in this folder is each subject's official syllabus PDF, kept in `subjects/<subject_id>/reference/` and gitignored.

Chemistry 0620 still lives in `../igcse-chem-pipeline/` (it's live on the site). It moves into `subjects/0620-chemistry/` together with the website's multi-subject update.

## Layout

```
agents/                 shared prompts for every subject
  FORMAT.md             file formats (batch ids include the syllabus code)
  00_syllabus_mapper.md once per subject: syllabus_map.json, diagram_coverage.md, subject.md draft
  01_generator.md       one batch of questions
  02_solver.md          blind solve
  03_verifier.md        blind solve, compare, fix, publish
  MAP.md, GENERATE.md, SOLVE.md, VERIFY.md   one-stage commands
subjects/
  0610-biology/
  0625-physics/
    subject.md          subject rules (data given/recalled, notation, checks) — agents must follow it
    reference/          the syllabus PDF (gitignored)
    config/             syllabus_map.json, diagram_coverage.md, batch_plan.json
    batches/            01_drafts → 02_solved → 04_approved (live) / 03_flagged (withheld)
    logs/               run_log.md (append-only, never answers), progress.json
```

## Running a subject

### Current Biology handoff

The owner's 18 October 2026 scope is Biology topics **1–10 only**, with PDFs before website
integration. Read `subjects/0610-biology/review/README.md` for existing solve/verify provenance,
the PDF export command, and the remaining work. Do not resume all 21 topics from an older chat.

1. **Map** (once): `Read agents/MAP.md and follow it exactly. Your subject is: 0625-physics.`
2. **Owner checks** `config/syllabus_map.json` and `subject.md` against the PDF. Everything else trusts them.
3. **Plan**: the managing chat writes `config/batch_plan.json` (batches of 30 questions; big topics split into parts by sub-topic; about 1.4 questions per in-scope learning point).
4. **Per batch**, three fresh sessions, never two stages in one context:
   - `Read agents/GENERATE.md and follow it exactly. Your subject is: 0625-physics. Your batch key is: T04_P2.`
   - `Read agents/SOLVE.md …` (same subject and key)
   - `Read agents/VERIFY.md …` (same subject and key)

Use three different models where possible (e.g. generator Opus, solver Sonnet, verifier the most capable).

## Rules that never change
- One stage per context. The solver never sees a mark scheme.
- No answers, letters or numeric results in any log. `run_log.md` is append-only (single `>>`).
- Diagrams are out of scope: `essential`-diagram learning points are skipped; `partial` ones are described in words or tables.
