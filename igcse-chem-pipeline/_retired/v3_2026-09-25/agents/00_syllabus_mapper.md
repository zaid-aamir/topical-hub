# Agent 00: Syllabus Mapper (run once)

You are building the master topic map for an original-question pipeline for **Cambridge IGCSE Chemistry 0620, syllabus for exams in 2026, 2027 and 2028**. Every other agent relies on your output, so accuracy matters more than speed.

## Input
- `reference/0620_syllabus_2026-2028.pdf`

First, confirm the PDF's cover states it's for exams in 2026, 2027 and 2028. If it doesn't, STOP and write the problem to `logs/run_log.md`. Do not continue with the wrong syllabus.

## Task
Read the **Subject content** section and extract every topic, sub-topic and numbered learning point. Also extract:
- The assessment overview: each paper, its type, marks, duration, and which tier takes it
- The command words list and their definitions
- The notes on the Periodic Table / data provided in the exam, if stated

## Output
Write `config/syllabus_map.json`:

```json
{
  "syllabus": "0620",
  "years": "2026-2028",
  "source_file": "reference/0620_syllabus_2026-2028.pdf",
  "papers": [
    { "paper": "1", "name": "...", "type": "mcq", "tier": "core", "marks": 0, "duration_minutes": 0 }
  ],
  "command_words": { "State": "definition from syllabus", "Explain": "..." },
  "topics": [
    {
      "topic_id": "4",
      "topic_name": "Electrochemistry",
      "subtopics": [
        {
          "subtopic_id": "4.1",
          "subtopic_name": "Electrolysis",
          "points": [
            { "point_id": "4.1.1", "tier": "core", "text": "exact wording from the syllabus" },
            { "point_id": "4.1.5", "tier": "supplement", "text": "..." }
          ]
        }
      ]
    }
  ]
}
```

Also write one progress file per **topic** in `logs/progress/`, named `topic_01.json` … `topic_12.json`. There is no `logs/progress.json`; batches are topic-level, so progress is tracked per topic:

```json
{
  "topic_id": "4",
  "topic_name": "Electrochemistry",
  "batches_drafted": 0,
  "batches_approved": 0,
  "subtopics_covered": [],
  "last_batch": null
}
```

## Rules
- Copy learning-point wording **exactly** from the syllabus. Do not paraphrase, summarize or add content.
- Use the syllabus's own numbering. If a point has no number, create one following the pattern and note it in `logs/run_log.md`.
- Tag every point `core` or `supplement` exactly as the syllabus marks it. If unsure, tag it `supplement` and list it in `logs/run_log.md` for human checking.
- If the PDF is hard to read in places (tables, columns), say which pages and which points may be wrong in `logs/run_log.md`.
- Fill in all numbers in `papers` from the syllabus. Do not guess them.

## Finish
Append to `logs/run_log.md`: date, "Syllabus map created", number of topics, sub-topics and points, and any items needing human checking. Append it with a shell append (`>>`) in a single command, never by rewriting the file, because other sessions may be appending at the same time.
