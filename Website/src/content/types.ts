/**
 * The content data model. This is the contract between the parser (src/content/) and
 * every page or component that renders questions. Text fields hold Markdown SOURCE
 * (never HTML); rendering to HTML happens in src/lib/markdown.ts at page render time.
 *
 * Source of truth: ../igcse-chem-pipeline/pipeline/04_approved/<batch>/questions.md and markscheme.md.
 */

export type Tier = 'core' | 'supplement';
export type QuestionType = 'mcq' | 'structured';
export type OptionLetter = 'A' | 'B' | 'C' | 'D';
export type Difficulty = 1 | 2 | 3;

/** Metadata shared by every question, taken from the `- key: value` block under `## Q<n>`. */
export interface QuestionBase {
  /** Stable id, e.g. "T04_20260923_01_Q16". Used in error reports and data attributes. */
  id: string;
  /** The n in `## Q<n>`. Unique within a topic; numbering may have gaps. Page anchor is `#q<n>`. */
  number: number;
  type: QuestionType;
  tier: Tier;
  /** e.g. "4.1" */
  subtopicId: string;
  /** e.g. "Electrolysis" */
  subtopicName: string;
  /** e.g. ["4.1.2", "4.1.3"] */
  syllabusPoints: string[];
  difficulty: Difficulty;
  /** Total marks for the question. For structured questions the part marks sum to this. */
  marks: number;
  needsDiagram: boolean;
  /**
   * Markdown of the question text that comes before the options (MCQ) or before part (a)
   * (structured). May be empty for structured questions. May contain GFM tables and bullet lists.
   */
  stem: string;
  /** Owning topic id, e.g. "4" */
  topicId: string;
  /** Owning batch id, e.g. "T04_20260923_01" */
  batchId: string;
}

/**
 * One MCQ option. For plain options, `text` is the option text after the letter.
 * For table-shaped options, `cells` holds the row's cells after the letter cell and `text` is
 * those cells joined with ", " (a plain-text fallback).
 */
export interface McqOption {
  letter: OptionLetter;
  /** Markdown (inline) source. */
  text: string;
  /** Present only for table-shaped options: the row cells after the letter cell, Markdown inline source. */
  cells?: string[];
}

export interface McqQuestion extends QuestionBase {
  type: 'mcq';
  /** Exactly four options, in order A, B, C, D. */
  options: McqOption[];
  /**
   * Present when the options were a Markdown table whose first column is the letter.
   * `headers` are the header-row cells after the (blank) first cell, Markdown inline source.
   * Render as a table where each row is a selectable option.
   */
  optionTable?: { headers: string[] };
  answer: OptionLetter;
  /** Markdown. Always present for MCQs. */
  rationale: string;
  /** Markdown. Present for most MCQs. Show this when present, otherwise show the rationale. */
  workedSolution?: string;
}

/** A sub-part such as (i), (ii) inside a part. */
export interface StructuredSubpart {
  /** Roman numeral label without brackets, e.g. "i", "ii". */
  label: string;
  /** Markdown source of the sub-part text, without the trailing `[n]`. */
  text: string;
  marks: number;
}

/** A top-level part such as (a), (b). */
export interface StructuredPart {
  /** Letter label without brackets, e.g. "a". */
  label: string;
  /**
   * Markdown source of the part's own text (intro text, possibly a table), without the trailing `[n]`.
   * May be empty when the part consists only of sub-parts (e.g. "(a) (i) ...").
   */
  text: string;
  /** Marks shown on the part's own line, or null when the marks are only on its sub-parts. */
  marks: number | null;
  subparts: StructuredSubpart[];
  /** (marks ?? 0) plus the sum of sub-part marks. The totals across parts sum to the question's `marks`. */
  totalMarks: number;
}

export type MarkPointKind = 'point' | 'allow' | 'reject' | 'ignore' | 'ecf';

/**
 * One bullet in the mark scheme. Keyword bullets (ALLOW / REJECT / IGNORE / ECF) are real
 * mark-scheme conventions and are kept, classified by `kind`.
 */
export interface MarkPoint {
  kind: MarkPointKind;
  /** Markdown inline source of the whole bullet text, including any leading keyword and any trailing "(1)". */
  text: string;
  /** Nested bullets (indented `- ` lines), e.g. under "any three from (1 each, max 3):". */
  children: MarkPoint[];
}

/** The marking points for one part or sub-part, from a head such as `**(a)** [2]` or `**(b)(i)** [1]`. */
export interface MarkSchemePart {
  /** Normalised key: "a" for (a), "b.i" for (b)(i). A head `**(a)**` followed by `**(i)** [1]` yields key "a.i". */
  key: string;
  /** Marks from the head, or null when the head has none (e.g. a bare `**(a)**` whose marks live on its sub-parts). */
  marks: number | null;
  /** Any text after the marks on the head line, e.g. "any four from:". Empty string when none. */
  note: string;
  points: MarkPoint[];
}

export interface StructuredQuestion extends QuestionBase {
  type: 'structured';
  parts: StructuredPart[];
  markScheme: MarkSchemePart[];
  /** Markdown. Always present for structured questions. */
  workedSolution: string;
}

export type Question = McqQuestion | StructuredQuestion;

export interface Subtopic {
  /** e.g. "4.1" */
  id: string;
  /** e.g. "Electrolysis" */
  name: string;
}

export interface TopicCounts {
  total: number;
  mcq: number;
  structured: number;
  core: number;
  supplement: number;
}

export interface Topic {
  /** e.g. "T04_20260923_01" */
  batchId: string;
  /** e.g. "4" (as written in the frontmatter) */
  topicId: string;
  /** e.g. 4 */
  topicNumber: number;
  /** e.g. "Electrochemistry" */
  topicName: string;
  /** kebab-case of topicName, e.g. "acids-bases-and-salts". Used in URLs. */
  slug: string;
  /** Sub-topics in order of first appearance in the file. */
  subtopics: Subtopic[];
  /** Questions in file order. */
  questions: Question[];
  counts: TopicCounts;
}

/** Thrown by the loader/validator when the content violates the contract. Fails the build. */
export class ContentError extends Error {
  readonly details: string[];
  constructor(message: string, details: string[] = []) {
    super(details.length ? `${message}\n  - ${details.join('\n  - ')}` : message);
    this.name = 'ContentError';
    this.details = details;
  }
}
