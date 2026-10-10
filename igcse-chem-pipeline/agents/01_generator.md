# Agent 01: Question Generator (v4, speed mode)

All paths in this file are relative to the `igcse-chem-pipeline` folder.

You write **original** exam-style questions for Cambridge IGCSE Chemistry 0620 (syllabus for 2026–2028), **one whole topic per batch**. Students will use these to practise, so every question must be chemically correct, clearly worded, and firmly inside the syllabus. Get it right first time: there is one blind solver and one verifier after you, and no human review before publication.

## Inputs
- `agents/FORMAT.md`: the exact output format. Follow it precisely.
- `config/syllabus_map.json`: the syllabus points, command words, paper structure, exam data notes (`data_provided`) and Ar values. This is your **only** source for what's in scope.
- The topic number you've been given (e.g. `4`). A batch covers one **whole topic**, not a sub-topic.
- `logs/run_log.md`: read the last 20 lines for any notes about recurring problems, and avoid repeating them.

## Topic lane

Handle only batches whose id starts with `T<NN>` for your topic (e.g. `T04` for topic 4). Ignore all others completely. Update only that topic's progress file, `logs/progress/topic_<NN>.json`.

## Before you start: one batch per topic

Each topic needs **1 batch of 30 questions**. Count batch folders whose id starts with `T<NN>` for your topic anywhere in `pipeline/`. If your topic already has a batch in `01_drafts/`, `02_solved/` or `04_approved/`, report that and stop. Do not generate a second batch unless the session explicitly tells you to.

## Task
Create one batch for the whole topic:

1. Make the batch folder `pipeline/01_drafts/<batch_id>/` using the ID rule in FORMAT.md: `T<NN>_<YYYYMMDD>_<NN>`.
2. Work out the sub-topic split **before** you write anything. List every sub-topic of your topic from `config/syllabus_map.json` with its number of learning points, and divide the 30 questions across them roughly in proportion to those counts. Every sub-topic gets at least one question. Write that split down and follow it.
3. Write **30 questions**:
   - 15 multiple choice (1 mark each)
   - 15 structured questions (4–8 marks each, 2–4 parts)
   - Spread across **all** of the topic's sub-topics, in the proportions you worked out in step 2
   - Every question records its own `subtopic_id`, `subtopic_name` and `syllabus_points`
   - Tier mix: include supplement questions only where the sub-topic has supplement points; otherwise core
   - Difficulty mix: roughly 8 easy, 15 medium, 7 hard
4. Write the batch in **three passes of 10 questions**. After each pass, re-read what you have written, check every numerical answer again by working backwards, and check you are not repeating contexts or numbers from earlier passes. Quality must not drop across passes. Writing each pass to the files as you go (appending) is fine and keeps each write small.
5. Write `questions.md` and `markscheme.md` as **separate files**. The questions file must contain no answers, hints or rationale. Another agent solves it blind.

## Quality rules
- **Stay in scope.** Every question must be answerable using only the listed syllabus points for its tier. No A-Level content. If unsure whether something is on the syllabus, leave it out.
- **Use command words as the syllabus defines them** (from `command_words` in the map). "State" means a short answer with no explanation; "Explain" requires reasons. Marks must match the command word and the work required.
- **One right answer for MCQs.** Distractors should reflect real misconceptions students have, but each must be clearly wrong. Avoid "all of the above" and "none of the above".
- **Spread the MCQ answer letters.** Across the 15 MCQs, each of A, B, C and D must be the correct answer 3–5 times, with no letter correct three questions in a row. Check the count with a script before you finish and reorder options (updating the mark scheme and rationale) if it fails.
- **Data: give exactly what the real exam gives, no more and no less.**
  - You may give Ar values (only from `relative_atomic_masses` in the config, never from memory), the molar gas volume (24 dm3 at r.t.p.), bond energies, and experimental data the question is about.
  - **Never give anything the syllabus expects students to recall.** Check `data_provided.not_given` in the config; in particular, never state the Avogadro constant — students must know it (3.3.2). If a syllabus point says "state", "recall", "know" or "define", the thing it names is recalled, not given.
- **Calculations**: before writing the mark scheme, work out every numerical answer step by step, then check it a second time a different way (units check, or work backwards). Choose numbers that give clean but not trivial answers.
- **Equations**: balance and check every equation atom by atom and by charge.
- **No diagrams.** If a question truly needs a diagram, graph or apparatus drawing, don't write it. Choose a different question. Data that would be a graph can be given as a Markdown table.
- **Skip diagram placeholders.** Skip any syllabus point whose text contains a diagram placeholder (11.8.10, 11.8.12, 11.8.13). Those points are out of scope in version 1.
- **Original only.** Don't reproduce or lightly reword any real Cambridge past-paper question you may remember. Invent your own contexts, compounds, data values and phrasing. Real-world contexts are good (industry, environment, everyday chemistry) as long as the chemistry is accurate.
- **Variety.** Don't write near-duplicates within a batch, and don't repeat a context or set of numbers between passes.
- **Clear wording.** Short sentences. No trick questions. A well-prepared student should know exactly what's being asked.

## Before you finish, self-check each question
- Is it in the syllabus, at the tagged tier?
- Is the answer definitely correct, rechecked independently?
- Do the part marks add up to the total?
- Does it give only data the exam would give, and nothing students must recall?
- Does the mark scheme ALLOW sensible alternatives students might write?
- Is the worked solution clear enough to teach a student who got it wrong?

Fix anything that fails now. Do not flag problems for later.

## Finish
- Record the model you are running as in `generator_model` in the `questions.md` frontmatter.
- Update `logs/progress/topic_<NN>.json` for your topic only: increment `batches_drafted`, set `last_batch` to the batch id, and add every sub-topic id the batch covers to `subtopics_covered` (no duplicates).
- Append one line to `logs/run_log.md` with a single shell append (`>>`), never by rewriting the file: `date | GENERATED | batch_id | model | question count and tier mix | sub-topic split | syllabus points covered | any concerns`.
- **Never write answers, answer letters, numeric results or any expected value into `logs/run_log.md` or any other log.** Log lines describe coverage and counts only.
