/**
 * Build-time loader: finds a subject's content directory, reads only `questions.md` and
 * `markscheme.md` from every `<prefix>T<NN>_...` batch folder, parses, validates each batch,
 * merges a topic's parts in numeric part order, validates the merged topics, and caches the result
 * per subject for the rest of the process. The only module in src/content/ that touches the file
 * system. Subjects and their content settings come from SUBJECTS in src/config.ts.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, isAbsolute, join, resolve } from 'node:path';
import { ContentError } from './types';
import type { Topic } from './types';
import { parseMarkschemeFile, parseQuestionsFile } from './parse';
import { buildTopic } from './topic';
import { validateTopics } from './validate';
import type { ValidateOptions } from './validate';

/** The content settings of a subject (a Subject from src/config.ts satisfies this). */
export interface ContentSource {
  /** Approved content folder, relative to the repository root. */
  readonly contentSubpath: string;
  /** Environment variable that overrides the folder. */
  readonly contentDirEnv: string;
  /** What comes before "T<NN>_" in batch folder names and batch ids. */
  readonly batchPrefix: string;
}

const MAX_LEVELS_UP = 4;

function isDirectory(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Batch folder names of a source: "<prefix>T<NN>_...". */
export function batchDirPattern(batchPrefix: string): RegExp {
  return new RegExp(`^${escapeRegExp(batchPrefix)}T\\d{2}_`);
}

/**
 * `process.env[source.contentDirEnv]` if set (absolute, or relative to the current directory),
 * otherwise the first `source.contentSubpath` found in the current directory or up to four
 * parents. Works with cwd = Website/ (local dev, Cloudflare Pages root directory) or the
 * repository root.
 */
export function resolveContentDir(source: ContentSource): string {
  const fromEnv = process.env[source.contentDirEnv];
  if (fromEnv) {
    const dir = isAbsolute(fromEnv) ? fromEnv : resolve(process.cwd(), fromEnv);
    if (!isDirectory(dir)) throw new ContentError(`${source.contentDirEnv} is set but is not a directory: ${dir}`);
    return dir;
  }
  let dir = process.cwd();
  for (let level = 0; level <= MAX_LEVELS_UP; level++) {
    const candidate = join(dir, ...source.contentSubpath.split('/'));
    if (isDirectory(candidate)) return candidate;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new ContentError(
    `Could not find ${source.contentSubpath} starting from ${process.cwd()} (looked up to ${MAX_LEVELS_UP} levels up). ` +
      `Set the ${source.contentDirEnv} environment variable to the 04_approved directory.`,
  );
}

/** Absolute paths of the batch directories (`<prefix>T<NN>_...`, directories only), sorted by name. */
export function listBatchDirs(contentDir: string, batchPrefix = ''): string[] {
  const pattern = batchDirPattern(batchPrefix);
  return readdirSync(contentDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && pattern.test(entry.name))
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

  for (const dir of listBatchDirs(contentDir, options?.batchPrefix)) {
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
  topics.sort((a, b) => a.topicNumber - b.topicNumber || (a.part ?? 1) - (b.part ?? 1));
  // Validate every batch before merging so no unmatched entries or source IDs are lost.
  for (const batch of topics) validateTopics([batch], options);
  const merged: Topic[] = [];
  for (const batch of topics) {
    const existing = merged.find((t) => t.topicId === batch.topicId);
    if (!existing) { merged.push(batch); continue; }
    if (existing.topicName !== batch.topicName || existing.part === undefined || batch.part === undefined ||
        existing.questions.some((q) => q.part === batch.part)) {
      throw new ContentError(`Conflicting topic batches: ${existing.batchId}, ${batch.batchId}`);
    }
    existing.batchIds!.push(batch.batchId);
    existing.questions.push(...batch.questions);
    existing.subtopics = [...new Map([...existing.subtopics, ...batch.subtopics].map((s) => [s.id, s])).values()];
    for (const key of ['total', 'mcq', 'structured', 'core', 'supplement'] as const) existing.counts[key] += batch.counts[key];
  }
  validateTopics(merged, options);
  return merged;
}

/** The one-line build summary, e.g. "Content OK: 12 topics, 360 questions (180 MCQ, 180 structured)". */
export function summaryLine(topics: Topic[], label = 'Content'): string {
  let mcq = 0;
  let structured = 0;
  for (const topic of topics) {
    mcq += topic.counts.mcq;
    structured += topic.counts.structured;
  }
  return `${label} OK: ${topics.length} topics, ${mcq + structured} questions (${mcq} MCQ, ${structured} structured)`;
}

const cache = new Map<string, Topic[]>();

/**
 * One subject's topics sorted by topic number, validated, cached for the process (keyed by the
 * content folder). Prints "<label> OK: ..." once per subject. Throws ContentError (failing the
 * build) on any contract violation.
 */
export function loadSubjectTopics(source: ContentSource & { readonly shortName?: string }): Topic[] {
  const cached = cache.get(source.contentSubpath);
  if (cached) return cached;
  const topics = loadTopicsFromDir(resolveContentDir(source), { batchPrefix: source.batchPrefix });
  cache.set(source.contentSubpath, topics);
  console.log(summaryLine(topics, source.shortName ?? 'Content'));
  return topics;
}

/** Forget the cached topics (tests only). */
export function clearTopicCache(): void {
  cache.clear();
}
