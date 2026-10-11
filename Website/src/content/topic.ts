/**
 * Merge a parsed questions.md with its parsed markscheme.md into one Topic. Pure: no file access.
 * Pairing is by the `## Q<n>` number. Questions without an entry (or whose entry has the wrong
 * shape) are left out and recorded under `topic.unmatched` for validateTopics() to report.
 */
import { ContentError } from './types';
import type {
  McqQuestion,
  OptionLetter,
  Question,
  StructuredQuestion,
  Subtopic,
  Topic,
  TopicCounts,
  UnmatchedEntry,
} from './types';
import type { ParsedMarkscheme, ParsedMarkschemeFile, ParsedQuestion, ParsedQuestionsFile } from './parse';
import { slugify } from './slug';

export function buildTopic(questionsFile: ParsedQuestionsFile, markschemeFile: ParsedMarkschemeFile): Topic {
  const fm = questionsFile.frontmatter;
  const batchId = fm.batch_id ?? '';
  const msBatchId = markschemeFile.frontmatter.batch_id;
  if (msBatchId !== undefined && msBatchId !== batchId) {
    throw new ContentError(`markscheme.md batch_id "${msBatchId}" does not match questions.md batch_id "${batchId}"`);
  }
  const topicId = fm.topic_id ?? '';
  const topicName = fm.topic_name ?? '';
  const topicNumber = /^\d+$/.test(topicId) ? Number(topicId) : Number.NaN;

  const questions: Question[] = [];
  const unmatched: UnmatchedEntry[] = [];
  const questionNumbers = new Set<number>();
  for (const parsed of questionsFile.questions) {
    questionNumbers.add(parsed.number);
    const entry = markschemeFile.entries.get(parsed.number);
    if (!entry) {
      unmatched.push({ number: parsed.number, problem: 'question-without-entry' });
    } else if (entry.kind !== parsed.type) {
      unmatched.push({ number: parsed.number, problem: 'type-mismatch' });
    } else {
      questions.push(mergeQuestion(parsed, entry, topicId, batchId));
    }
  }
  for (const number of markschemeFile.entries.keys()) {
    if (!questionNumbers.has(number)) unmatched.push({ number, problem: 'entry-without-question' });
  }
  unmatched.sort((a, b) => a.number - b.number);

  const topic: Topic = {
    batchId,
    topicId,
    topicNumber,
    topicName,
    slug: slugify(topicName),
    subtopics: collectSubtopics(questions),
    questions,
    counts: countQuestions(questions),
  };
  if (unmatched.length) topic.unmatched = unmatched;
  return topic;
}

function mergeQuestion(q: ParsedQuestion, entry: ParsedMarkscheme, topicId: string, batchId: string): Question {
  const base = {
    id: q.id,
    number: q.number,
    tier: q.tier,
    subtopicId: q.subtopicId,
    subtopicName: q.subtopicName,
    syllabusPoints: q.syllabusPoints,
    difficulty: q.difficulty,
    marks: q.marks,
    needsDiagram: q.needsDiagram,
    stem: q.stem,
    topicId,
    batchId,
  };
  if (q.type === 'mcq' && entry.kind === 'mcq') {
    const mcq: McqQuestion = {
      ...base,
      type: 'mcq',
      options: q.options,
      // As written in the file; validateTopics() rejects anything outside A-D.
      answer: entry.answer as OptionLetter,
      rationale: entry.rationale,
    };
    if (q.optionTable) mcq.optionTable = q.optionTable;
    if (entry.workedSolution !== undefined) mcq.workedSolution = entry.workedSolution;
    return mcq;
  }
  if (q.type === 'structured' && entry.kind === 'structured') {
    const structured: StructuredQuestion = {
      ...base,
      type: 'structured',
      parts: q.parts,
      markScheme: entry.parts,
      workedSolution: entry.workedSolution,
    };
    return structured;
  }
  throw new ContentError(`Q${q.number}: question type "${q.type}" does not match mark scheme shape "${entry.kind}"`);
}

/** Sub-topics in order of first appearance. */
function collectSubtopics(questions: Question[]): Subtopic[] {
  const seen = new Map<string, Subtopic>();
  for (const q of questions) {
    if (!seen.has(q.subtopicId)) seen.set(q.subtopicId, { id: q.subtopicId, name: q.subtopicName });
  }
  return [...seen.values()];
}

function countQuestions(questions: Question[]): TopicCounts {
  const counts: TopicCounts = { total: questions.length, mcq: 0, structured: 0, core: 0, supplement: 0 };
  for (const q of questions) {
    if (q.type === 'mcq') counts.mcq++;
    else if (q.type === 'structured') counts.structured++;
    if (q.tier === 'core') counts.core++;
    else if (q.tier === 'supplement') counts.supplement++;
  }
  return counts;
}
