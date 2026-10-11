/**
 * Build-time loader: finds the content directory, reads only `questions.md` and `markscheme.md`
 * from every `T<NN>_...` batch folder, parses, merges and validates, and caches the result for the
 * rest of the process. The only module in src/content/ that touches the file system.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, isAbsolute, join, resolve } from 'node:path';
import { ContentError } from './types';
import type { Topic } from './types';
import { parseMarkschemeFile, parseQuestionsFile } from './parse';
import { buildTopic } from './topic';
import { validateTopics } from './validate';
import type { ValidateOptions } from './validate';

/** Where the approved content lives, relative to the repository root. */
export const CONTENT_SUBPATH = 'igcse-chem-pipeline/pipeline/04_approved';
const BATCH_DIR = /^T\d{2}_/;
const MAX_LEVELS_UP = 4;

function isDirectory(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

/**
 * `CONTENT_DIR` if set (absolute, or relative to the current directory), otherwise the first
 * `igcse-chem-pipeline/pipeline/04_approved` found in the current directory or up to four parents.
 * Works with cwd = Website/ (local dev, Cloudflare Pages root directory) or the repository root.
 */
export function resolveContentDir(): string {
  const fromEnv = process.env.CONTENT_DIR;
  if (fromEnv) {
    const dir = isAbsolute(fromEnv) ? fromEnv : resolve(process.cwd(), fromEnv);
    if (!isDirectory(dir)) throw new ContentError(`CONTENT_DIR is set but is not a directory: ${dir}`);
    return dir;
  }
  let dir = process.cwd();
  for (let level = 0; level <= MAX_LEVELS_UP; level++) {
    const candidate = join(dir, ...CONTENT_SUBPATH.split('/'));
    if (isDirectory(candidate)) return candidate;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new ContentError(
    `Could not find ${CONTENT_SUBPATH} starting from ${process.cwd()} (looked up to ${MAX_LEVELS_UP} levels up). ` +
      'Set the CONTENT_DIR environment variable to the 04_approved directory.',
  );
}

/** Absolute paths of the batch directories (`T<NN>_...`, directories only), sorted by name. */
export function listBatchDirs(contentDir: string): string[] {
  return readdirSync(contentDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && BATCH_DIR.test(entry.name))
    .map((entry) => entry.name)
    .sort()
    .map((name) => join(contentDir, name));
}

function readText(path: string): string {
  return readFileSync(path, 'utf8');
}

/**
 * Load, merge and validate every batch under `contentDir`. Not cached. Throws ContentError with
 * every parse problem across all batches, or (once parsing succeeds) every validation problem.
 */
export function loadTopicsFromDir(contentDir: string, options?: ValidateOptions): Topic[] {
  const topics: Topic[] = [];
  const problems: string[] = [];
  const collect = (prefix: string, err: unknown): void => {
    if (!(err instanceof ContentError)) throw err;
    const details = err.details.length ? err.details : [err.message];
    problems.push(...details.map((d) => `${prefix}: ${d}`));
  };

  for (const dir of listBatchDirs(contentDir)) {
    const name = basename(dir);
    const questionsPath = join(dir, 'questions.md');
    const markschemePath = join(dir, 'markscheme.md');
    let ok = true;
    for (const path of [questionsPath, markschemePath]) {
      if (!existsSync(path)) {
        problems.push(`${name}: missing ${basename(path)}`);
        ok = false;
      }
    }
    if (!ok) continue;

    let questionsFile;
    let markschemeFile;
    try {
      questionsFile = parseQuestionsFile(readText(questionsPath));
    } catch (err) {
      collect(`${name}/questions.md`, err);
    }
    try {
      markschemeFile = parseMarkschemeFile(readText(markschemePath));
    } catch (err) {
      collect(`${name}/markscheme.md`, err);
    }
    if (!questionsFile || !markschemeFile) continue;
    try {
      topics.push(buildTopic(questionsFile, markschemeFile));
    } catch (err) {
      collect(name, err);
    }
  }

  if (problems.length) throw new ContentError(`Content parsing failed: ${problems.length} problem(s)`, problems);
  topics.sort((a, b) => a.topicNumber - b.topicNumber);
  validateTopics(topics, options);
  return topics;
}

/** The one-line build summary, e.g. "Content OK: 12 topics, 360 questions (180 MCQ, 180 structured)". */
export function summaryLine(topics: Topic[]): string {
  let mcq = 0;
  let structured = 0;
  for (const topic of topics) {
    mcq += topic.counts.mcq;
    structured += topic.counts.structured;
  }
  return `Content OK: ${topics.length} topics, ${mcq + structured} questions (${mcq} MCQ, ${structured} structured)`;
}

let cache: Topic[] | undefined;
let printed = false;

/**
 * All topics sorted by topic number, validated, cached for the process. Prints the summary line
 * once. Throws ContentError (failing the build) on any contract violation.
 */
export function loadAllTopics(): Topic[] {
  if (cache) return cache;
  const topics = loadTopicsFromDir(resolveContentDir());
  cache = topics;
  if (!printed) {
    printed = true;
    console.log(summaryLine(topics));
  }
  return topics;
}

export function getTopicBySlug(slug: string): Topic | undefined {
  return loadAllTopics().find((topic) => topic.slug === slug);
}

/** Forget the cached topics (tests only). */
export function clearTopicCache(): void {
  cache = undefined;
}
