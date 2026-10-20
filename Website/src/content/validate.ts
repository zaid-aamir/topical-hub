/**
 * Build-time validation of the loaded content. Every check that fails is collected, and one
 * ContentError listing all of them is thrown at the end, so a failed build shows the whole picture.
 *
 * The checks are structural only: the pipeline may withhold questions, so no exact topic or
 * question total is ever required. Every ## Q<n> needs a mark-scheme entry and vice versa, ids are
 * unique, part marks sum to the question's marks, and MCQs have options A-D and an answer.
 */
import { ContentError } from './types';
import type { McqQuestion, Question, StructuredQuestion, Topic } from './types';

const TYPES: ReadonlySet<string> = new Set(['mcq', 'structured']);
const TIERS: ReadonlySet<string> = new Set(['core', 'supplement']);
const DIFFICULTIES: ReadonlySet<number> = new Set([1, 2, 3]);
const LETTERS = 'ABCD';

export interface ValidateOptions {
  /** What comes before "T<NN>_" in the subject's batch ids ('' for Chemistry, '0625_' for Physics). Default ''. */
  batchPrefix?: string;
  /** Receives non-fatal warnings, one call per line. Default console.warn. */
  warn?: (message: string) => void;
}

/** Throws ContentError (listing every violation) when the content breaks the contract. */
export function validateTopics(topics: Topic[], options: ValidateOptions = {}): void {
  const batchPrefix = options.batchPrefix ?? '';
  const escapedPrefix = batchPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const batchIdPattern = new RegExp(`^${escapedPrefix}T(\\d{2})_(?:\\d{8}_\\d{2}|P\\d+_\\d{8})$`);
  const warn = options.warn ?? ((message: string) => console.warn(message));
  const problems: string[] = [];
  const warnings: string[] = [];

  if (topics.length === 0) problems.push('no topics found');

  const seenNumbers = new Map<number, string>();
  const seenSlugs = new Map<string, string>();
  const seenIds = new Map<string, string>();

  for (const topic of topics) {
    const t = topic.batchId || '<missing batch_id>';
    const prefix = batchIdPattern.exec(topic.batchId);
    if (!prefix) problems.push(`${t}: batch_id must look like ${batchPrefix}T04_20260923_01 or ${batchPrefix}T04_P1_20261013`);
    if (!Number.isInteger(topic.topicNumber) || topic.topicNumber < 1) {
      problems.push(`${t}: topic_id "${topic.topicId}" is not a positive integer`);
    } else {
      if (prefix && Number(prefix[1]) !== topic.topicNumber) {
        problems.push(`${t}: topic_id ${topic.topicNumber} does not match the batch prefix T${prefix[1]}`);
      }
      const other = seenNumbers.get(topic.topicNumber);
      if (other) problems.push(`${t}: topic number ${topic.topicNumber} is also used by ${other}`);
      else seenNumbers.set(topic.topicNumber, t);
    }
    if (!topic.topicName.trim()) problems.push(`${t}: topic_name is missing`);
    if (!topic.slug) problems.push(`${t}: slug is empty (topic_name "${topic.topicName}")`);
    else if (seenSlugs.has(topic.slug)) problems.push(`${t}: slug "${topic.slug}" is also used by ${seenSlugs.get(topic.slug)}`);
    else seenSlugs.set(topic.slug, t);

    for (const u of topic.unmatched ?? []) {
      const q = `${t}_Q${u.number}`;
      if (u.problem === 'question-without-entry') problems.push(`${q}: question has no entry in markscheme.md`);
      else if (u.problem === 'entry-without-question') problems.push(`${q}: markscheme.md entry has no question in questions.md`);
      else problems.push(`${q}: question type and mark scheme shape disagree (MCQ entries start with "- answer:")`);
    }
    if (topic.questions.length === 0) problems.push(`${t}: no questions`);

    for (const q of topic.questions) validateQuestion(topic, q, problems, warnings, seenIds);
  }

  for (const w of warnings) warn(w);
  if (problems.length) throw new ContentError(`Content validation failed: ${problems.length} problem(s)`, problems);
}

function validateQuestion(topic: Topic, q: Question, problems: string[], warnings: string[], seenIds: Map<string, string>): void {
  const expectedId = `${q.batchId}_Q${q.number}`;
  const label = q.id || expectedId;
  if (q.id !== expectedId) problems.push(`${label}: id should be "${expectedId}"`);
  const seenIn = seenIds.get(q.id);
  if (seenIn) problems.push(`${label}: duplicate id (also in ${seenIn})`);
  else seenIds.set(q.id, topic.batchId);

  if (!TYPES.has(q.type)) problems.push(`${label}: type must be mcq or structured, got "${q.type}"`);
  if (!TIERS.has(q.tier)) problems.push(`${label}: tier must be core or supplement, got "${q.tier}"`);
  if (!DIFFICULTIES.has(q.difficulty)) problems.push(`${label}: difficulty must be 1, 2 or 3, got ${q.difficulty}`);
  if (!Number.isInteger(q.marks) || q.marks < 1) problems.push(`${label}: marks must be a positive integer, got ${q.marks}`);
  if (q.needsDiagram) problems.push(`${label}: needs_diagram is true; a question that needs a diagram cannot be published`);
  if (!q.subtopicId.trim()) problems.push(`${label}: subtopic_id is missing`);
  if (!q.subtopicName.trim()) problems.push(`${label}: subtopic_name is missing`);
  if (q.syllabusPoints.length === 0) warnings.push(`${label}: syllabus_points is empty`);

  if (q.type === 'mcq') validateMcq(q, label, problems);
  else if (q.type === 'structured') validateStructured(q, label, problems, warnings);
}

function validateMcq(q: McqQuestion, label: string, problems: string[]): void {
  const letters = q.options.map((o) => o.letter);
  if (letters.join('') !== LETTERS) {
    problems.push(`${label}: MCQ options must be exactly A, B, C, D in order; found ${q.options.length} option(s) [${letters.join(', ')}]`);
  }
  for (const o of q.options) {
    if (!o.text.trim()) problems.push(`${label}: option ${o.letter} has no text`);
  }
  if (q.optionTable) {
    const width = q.optionTable.headers.length;
    for (const o of q.options) {
      const cells = o.cells?.length ?? 0;
      if (cells !== width) problems.push(`${label}: option ${o.letter} has ${cells} table cells but the header has ${width}`);
    }
  }
  if (!q.stem.trim()) problems.push(`${label}: MCQ has no question text before the options`);
  if (q.answer.length !== 1 || !LETTERS.includes(q.answer)) problems.push(`${label}: answer must be one of A-D, got "${q.answer}"`);
  if (!q.rationale.trim()) problems.push(`${label}: MCQ has no rationale`);
}

function validateStructured(q: StructuredQuestion, label: string, problems: string[], warnings: string[]): void {
  if (q.parts.length === 0) problems.push(`${label}: structured question has no parts (a), (b), ...`);
  const sum = q.parts.reduce((n, p) => n + p.totalMarks, 0);
  if (sum !== q.marks) problems.push(`${label}: part marks sum to ${sum} but marks is ${q.marks}`);
  for (const p of q.parts) {
    const expectedTotal = (p.marks ?? 0) + p.subparts.reduce((n, s) => n + s.marks, 0);
    if (p.totalMarks !== expectedTotal) problems.push(`${label}: part (${p.label}) totalMarks ${p.totalMarks} should be ${expectedTotal}`);
    if (p.marks === null && p.subparts.length === 0) problems.push(`${label}: part (${p.label}) does not end in "[n]" marks`);
    if (p.marks !== null && p.marks < 1) problems.push(`${label}: part (${p.label}) has [${p.marks}] marks`);
    if (!p.text.trim() && p.subparts.length === 0) problems.push(`${label}: part (${p.label}) has no text`);
    for (const s of p.subparts) {
      if (!s.text.trim()) problems.push(`${label}: part (${p.label})(${s.label}) has no text`);
      if (!Number.isInteger(s.marks) || s.marks < 1) problems.push(`${label}: part (${p.label})(${s.label}) has [${s.marks}] marks`);
    }
  }
  if (!q.workedSolution.trim()) problems.push(`${label}: structured question has no worked solution`);

  const questionKeys = collectQuestionKeys(q);
  const schemeKeys = collectMarkSchemeKeys(q, label, problems);
  // Some schemes group labelled subpart points under one marked parent heading.
  // Keep that source layout; accept it only when every label and the mark total agree.
  for (const part of q.parts) {
    const aggregate = q.markScheme.find((p) => p.key === part.label);
    if (part.marks !== null || !part.subparts.length || !aggregate || aggregate.marks !== part.totalMarks) continue;
    if (part.subparts.some((s) => schemeKeys.has(`${part.label}.${s.label}`))) continue;
    if (!part.subparts.every((s) => aggregate.points.some((p) => p.text.startsWith(`(${s.label})`)))) continue;
    for (const subpart of part.subparts) questionKeys.delete(`${part.label}.${subpart.label}`);
    questionKeys.set(part.label, part.totalMarks);
  }
  const missing = [...questionKeys.keys()].filter((k) => !schemeKeys.has(k));
  const extra = [...schemeKeys.keys()].filter((k) => !questionKeys.has(k));
  if (missing.length) problems.push(`${label}: mark scheme has no part for ${missing.map(formatKey).join(', ')}`);
  if (extra.length) problems.push(`${label}: mark scheme has ${extra.map(formatKey).join(', ')} but the question does not`);
  for (const [key, qMarks] of questionKeys) {
    const msMarks = schemeKeys.get(key);
    if (qMarks !== null && msMarks !== undefined && msMarks !== null && msMarks !== qMarks) {
      problems.push(`${label}: part ${formatKey(key)} is [${qMarks}] in the question but [${msMarks}] in the mark scheme`);
    }
  }
  for (const part of q.markScheme) {
    if (part.points.length === 0 && !isContainer(q, part.key)) warnings.push(`${label}: mark scheme part ${formatKey(part.key)} has no marking points`);
  }
}

/** "a" -> "(a)", "b.i" -> "(b)(i)". */
function formatKey(key: string): string {
  return key.split('.').map((k) => `(${k})`).join('');
}

/** Keys the question defines: "a" for a part with its own marks, "b.i" for each sub-part. */
function collectQuestionKeys(q: StructuredQuestion): Map<string, number | null> {
  const keys = new Map<string, number | null>();
  for (const p of q.parts) {
    if (p.marks !== null || p.subparts.length === 0) keys.set(p.label, p.marks);
    for (const s of p.subparts) keys.set(`${p.label}.${s.label}`, s.marks);
  }
  return keys;
}

/** A bare head such as "**(a)**" with no marks and no bullets that only groups "(i)", "(ii)" heads. */
function isContainer(q: StructuredQuestion, key: string): boolean {
  const part = q.markScheme.find((p) => p.key === key);
  return !!part && part.marks === null && part.points.length === 0 && q.markScheme.some((o) => o.key.startsWith(`${key}.`));
}

/** Keys the mark scheme defines, container heads excluded. Duplicate keys are reported. */
function collectMarkSchemeKeys(q: StructuredQuestion, label: string, problems: string[]): Map<string, number | null> {
  const keys = new Map<string, number | null>();
  for (const part of q.markScheme) {
    if (keys.has(part.key)) problems.push(`${label}: mark scheme part ${formatKey(part.key)} appears twice`);
    if (isContainer(q, part.key)) continue;
    keys.set(part.key, part.marks);
  }
  return keys;
}
