# Edexcel overrides (Pearson Edexcel International GCSE sciences)

Read this file **in addition to** the normal agent file whenever the subject id starts with `4` (`4bi1-biology`, `4ch1-chemistry`, `4ph1-physics`). Where this file and the normal agent file disagree, **this file wins**. Everything not mentioned here stays as the normal agent file says.

These are still **original exam-style topical questions, not past papers**. The only Pearson document allowed in the subject folder is the specification PDF in `reference/` (gitignored).

## The qualification

| Subject id | Specification | Paper 1 | Paper 2 | Paper-2-only marker |
|---|---|---|---|---|
| `4bi1-biology` | 4BI1, Issue 3 | 4BI1/1B | 4BI1/2B | bold statements with a `B` suffix, e.g. `2.40B` |
| `4ch1-chemistry` | 4CH1, Issue 3 | 4CH1/1C | 4CH1/2C | bold statements with a `C` suffix |
| `4ph1-physics` | 4PH1, Issue 4 | 4PH1/1P | 4PH1/2P | bold statements with a `P` suffix |

- The exams are **untiered**. Everyone sits Paper 1 (2 h, 110 marks, content NOT in bold) and Paper 2 (1 h 15 min, 70 marks, ALL content including bold). Check these numbers in the PDF.
- The pipeline keeps its `tier` field so file formats don't change, with this meaning:
  - `core` = Paper 1 and Paper 2 content (statement has no letter suffix)
  - `supplement` = **Paper 2 only** (statement has the B / C / P suffix)
  The website will label these "Paper 1 & 2" and "Paper 2 only", never Core/Extended.
- Specification name in prose: "Pearson Edexcel International GCSE Biology (4BI1)" etc. Never "Cambridge", never "IGCSE 0610/0620/0625".

## Mapping (overrides `00_syllabus_mapper.md`)

- **Input**: `subjects/<subject_id>/reference/<CODE>_specification.pdf` (e.g. `4PH1_specification.pdf`).
- **Cover check**: confirm the title and code match, first examination June 2019, and note the Issue number. There is no 2026–2028 date range; use `"years": "current (first exam 2019)"` and `"syllabus": "4PH1"` (etc.). Do not stop because the dates differ from Cambridge.
- **Layout**: the subject content is ONE column, not Core/Supplement columns. Extract with `pdftotext -layout`. Each topic is numbered (`1 Forces and motion`), divided into lettered sub-sections (`(a) Units`, `(b) Movement and position`), each with numbered statements under "Students should:".
- **Ids**:
  - `topic_id`: the topic number as printed, e.g. `"1"`.
  - `subtopic_id`: topic number + sub-section letter with no punctuation, e.g. `"1b"`; `subtopic_name` is the sub-section title. No `parent_id` unless the specification has a deeper heading level.
  - `point_id`: the statement number **exactly as printed, including any suffix**, e.g. `"1.4"`, `"1.25P"`, `"2.40B"`. (This replaces the Cambridge `<subtopic_id>.<n>` rule; Edexcel numbers are already unique.)
- **Tier**: `supplement` if the statement number has the subject's suffix letter (it is also printed in bold), otherwise `core`. The suffix is the reliable signal; bold is lost in text extraction. If text extraction and the rendered page disagree, check the page image.
- **Practical statements** (`practical: investigate …`) are numbered learning points: include them. They are tested in the written papers through method, variables, results and evaluation, so `diagram_dependence` is usually `partial`, not `essential`.
- **Equations**: the specification prints them across several lines (fractions on three lines, powers as `v2`). Rebuild them on one line with `^` powers (`v^2 = u^2 + (2 × a × s)`).
- **Data given / recalled**: take these from the specification itself, including its appendices (e.g. 4PH1 Appendix 7 lists relationships that are NOT provided; 4CH1 includes a Periodic Table appendix). For physics, statements worded "know and use the relationship" must be recalled; record what the specification says about relationships worded "use the relationship" (check Appendix 7 and the assessment pages — do not assume).
- **papers**: two papers per subject, `type: "structured"` (the assessment describes a mix of multiple-choice, short-answer, calculation and extended open-response questions), `tier: "all"` for both, with the content note in `tier_notes`.
- **command_words**: from the specification's command-word appendix.
- **subject.md** header: name the specification, issue and page numbers; state the Paper 1 / Paper 2 rule above. Section 7 must record the question styles the assessment pages describe (multiple-choice items exist but papers are mostly structured; calculators allowed; any extended open-response / 6-mark questions mentioned).
- Log line: `MAPPED | <subject_id> | topics N, sub-topics N, points N (core N, paper-2-only N), diagram essential N | ...`.

## Generation, solving, verification (for later stages)

- The batch plan for Edexcel subjects says the MCQ/structured mix; follow it instead of the default "15 MCQ + 15 structured".
- "Original only" means not copying or lightly rewording any real Pearson Edexcel (or Cambridge) exam question.
- A `core` question uses only statements without the suffix. A `supplement` question needs at least one suffix statement.
- Use the specification's command words and its recall/given rules from `subject.md`.

### Batch ids and front matter (Edexcel)
- Batch id: `<CODE>_T<NN>_P<n>_<YYYYMMDD>` with the four-character code in capitals, e.g. `4PH1_T02_P1_20261026`; question ids follow it as usual.
- Front matter: `syllabus: "4PH1 (Issue 4)"` (4BI1 / 4CH1 Issue 3). `tier:` is `core` (Paper 1 & 2) or `supplement` (Paper 2 only); `subtopic_id` and `syllabus_points` use the map's ids exactly (e.g. `"1c"`, `["1.25P"]`).

### Question mix and style (Edexcel)
- Counts come from the batch plan (about one third MCQ, two thirds structured).
- MCQ answer letters: spread as evenly as possible across A–D (every letter used when there are 4 or more MCQs; no letter more than twice as often as another), never the same letter three in a row. Check with a script.
- Structured questions follow the Edexcel style: 4–9 marks over 2–4 parts, mixing short recall, calculation (show the equation, substitution and answer with unit), and at least one "Explain"/"Describe" part per question where the content allows. Include a few longer "Explain" parts (4–6 marks, marked by indicative points) across the batch.
- Physics calculations: a part that needs a "use the relationship" equation prints it in the question; a "know and use" equation is never printed.
- About 1 in 3 questions are tagged `supplement` (Paper 2 only) where the batch's sub-topics have P/B/C statements; none where they don't.
