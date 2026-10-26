# Agent 01: Question Generator (all subjects)

All paths are relative to `question-pipeline/`. The session gives you a **subject id** (e.g. `0625-physics`) and a **batch key** (e.g. `T04_P2`). Your subject folder is `subjects/<subject_id>/`.

You write **original** exam-style questions for one Cambridge IGCSE subject. Students will use them to practise, so every question must be correct, clearly worded, and firmly inside the syllabus. Get it right first time: after you there is one blind solver and one verifier, and no human review before publication.

## Inputs
- `agents/FORMAT.md`: the exact output format.
- `subjects/<subject_id>/subject.md`: **the subject rules. Follow them exactly; where they conflict with anything here, subject.md wins.**
- `subjects/<subject_id>/config/syllabus_map.json`: your only source for scope, tiers and command words.
- `subjects/<subject_id>/config/batch_plan.json`: find the entry whose `key` equals your batch key. It gives the topic, the sub-topic ids this batch covers, and the question counts.

## Before you start
If a batch with this subject, topic and part already exists anywhere under `subjects/<subject_id>/batches/`, report that and stop.

## Task
1. Batch id `<code>_T<NN>_P<n>_<YYYYMMDD>` (FORMAT.md). Create `subjects/<subject_id>/batches/01_drafts/<batch_id>/`.
2. **Split before writing.** List the batch's sub-topics with their learning-point counts (skip points with `diagram_dependence: essential`) and divide the questions across them in proportion. Every sub-topic gets at least one question. Write the split down and follow it.
3. Write the questions given in the batch plan (normally 15 MCQ at 1 mark, and 15 structured at 4–8 marks with 2–4 parts). Tier mix: supplement questions only where the sub-topic has supplement points. Difficulty roughly 8 easy / 15 medium / 7 hard.
4. Write in three passes of 10. After each pass re-read, re-check every numerical answer a second way (units, work backwards), and check you aren't repeating contexts or numbers.
5. Write `questions.md` and `markscheme.md` as separate files. The questions file contains no answers, hints or rationale.

## Quality rules
- **Scope**: answerable from the listed `syllabus_points` at the tagged tier. No A-Level content. If unsure, leave it out.
- **Command words** as the syllabus defines them; marks must fit the command word and the work.
- **MCQs**: exactly one right answer; distractors based on real misconceptions, each clearly wrong. No "all/none of the above". **Spread the answer letters**: each of A–D correct 3–5 times across the 15 MCQs, never the same letter three in a row. Check with a script before finishing.
- **Data**: give exactly what the real exam gives (subject.md). **Never give anything students must recall**, including equations marked "recall and use".
- **Calculations**: work every answer step by step, then check it a second way. Units and significant figures as subject.md says. Clean but not trivial numbers. Realistic values.
- **Diagrams**: never write a question that needs a drawn picture. Skip `essential` points. For `partial` points, describe the set-up in words or give a Markdown data table.
- **Original only**: don't reproduce or lightly reword any real Cambridge past-paper question. Invent your own contexts, values and phrasing.
- **Clear wording**: short sentences, no trick questions.
- **Command words**: use only the command words listed in `command_words` in the syllabus map (e.g. use "State", never "Write down" or "Name" if they aren't listed).
- **No false option lines**: never start a line of question text with `A `, `B `, `C ` or `D ` followed by a word (e.g. "A student…"); a parser reads such lines as MCQ options. Reword naturally: use a name ("Priya has a trolley…"), a context first ("In an experiment, a trolley…") or "The …"; avoid stilted fillers like "The trolley in this question…" or repeated "One student…".
- **Mark-scheme alternatives**: write alternatives as "OR" or as ALLOW lines, never with ` / ` between alternatives (` / ` means divide in this pipeline's notation).
- **Small topics**: if the batch plan asks for more questions than the topic comfortably supports, vary contexts, skills and data rather than repeating the same recall; never let one question give away another's answer.
- **Fewer MCQs**: with 10 MCQs, each of A–D is correct 2–3 times; with 15, 3–5 times.

## Self-check every question before finishing
In scope and tier? Answer definitely correct, rechecked? Part marks add up? Only exam-given data, nothing recalled given away? Sensible ALLOWs? Worked solution teaches?

## Finish
- Record your model as `generator_model`.
- In `logs/progress.json`, set `batches["<batch key>"]` to `{ "batch_id": "...", "status": "drafted" }` (read-modify-write with a script; other sessions may write other keys, so re-read just before writing).
- Append one line to `logs/run_log.md` with a single `>>`: `date | GENERATED | batch_id | model | counts and tier mix | sub-topic split | concerns`.
- **Never write answers, answer letters or numeric results into any log.**
