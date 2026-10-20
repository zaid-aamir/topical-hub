/**
 * Public API of the content module. Pages and components import from 'src/content' (this file).
 *
 *   import { loadSubjectTopics } from '../content';
 *   import type { Topic, Question, McqQuestion, StructuredQuestion } from '../content';
 */
export {
  loadSubjectTopics,
  loadTopicsFromDir,
  resolveContentDir,
  listBatchDirs,
  summaryLine,
  clearTopicCache,
  batchDirPattern,
} from './load';
export type { ContentSource } from './load';
export {
  parseFrontmatter,
  splitQuestionBlocks,
  parseQuestionsFile,
  parseQuestionBlock,
  parseMcqBody,
  parseStructuredBody,
  splitTableRow,
  parseMarkschemeFile,
  parseMarkschemeBlock,
  classifyMarkPoint,
} from './parse';
export type {
  Frontmatter,
  ParsedFrontmatter,
  QuestionBlock,
  ParsedQuestionBase,
  ParsedMcqQuestion,
  ParsedStructuredQuestion,
  ParsedQuestion,
  ParsedQuestionsFile,
  McqBody,
  McqOptionTable,
  StructuredBody,
  ParsedMcqMarkscheme,
  ParsedStructuredMarkscheme,
  ParsedMarkscheme,
  ParsedMarkschemeFile,
} from './parse';
export { buildTopic } from './topic';
export { validateTopics } from './validate';
export type { ValidateOptions } from './validate';
export { slugify } from './slug';
export { ContentError } from './types';
export type {
  Tier,
  QuestionType,
  OptionLetter,
  Difficulty,
  QuestionBase,
  McqOption,
  McqQuestion,
  StructuredSubpart,
  StructuredPart,
  MarkPointKind,
  MarkPoint,
  MarkSchemePart,
  StructuredQuestion,
  Question,
  Subtopic,
  TopicCounts,
  Topic,
  UnmatchedEntry,
} from './types';
