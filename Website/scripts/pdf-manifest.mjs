/** Shared PDF planning and integrity guard for Chemistry and Biology.
 * Both source trees (questions.md / markscheme.md only), shared print templates,
 * rendering code, layout/styles and config are hashed with normalised newlines.
 * The guard runs in plain Node; only explicit generation requires Chromium.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

/** Where the approved content lives, relative to the repository root (same as src/content/load.ts). */
export const CONTENT_SUBPATH = 'igcse-chem-pipeline/pipeline/04_approved';
/** URL path of the subject, as in src/config.ts SUBJECT.path. */
export const SUBJECT_PATH = 'igcse/chemistry-0620';
export const BIOLOGY_CONTENT_SUBPATH = 'question-pipeline/subjects/0610-biology/batches/04_approved';
export const BIOLOGY_SUBJECT_PATH = 'igcse/biology-0610';
/** Folder under public/ (and URL path) of the PDFs. */
export const PDF_URL_DIR = 'pdfs';
export const MANIFEST_NAME = 'manifest.json';
export const STALE_MESSAGE = 'PDFs are out of date: run npm run pdfs and commit the PDFs.';

/** The two PDFs per topic: file-name suffix, the print page they are made from, and a label. */
export const PDF_KINDS = [
  { kind: 'questions', page: 'print', label: 'questions' },
  { kind: 'mark-scheme', page: 'print-answers', label: 'mark scheme' },
];

/** Website files (relative to Website/) that shape the PDFs. A missing one is an error. */
export const WEBSITE_INPUT_FILES = [
  'src/pages/igcse/[subject]/[slug]/print.astro',
  'src/pages/igcse/[subject]/[slug]/print-answers.astro',
  'src/components/PrintWatermark.astro',
  'src/components/question/PrintQuestion.astro',
  'src/components/question/PrintAnswer.astro',
  'src/components/question/QuestionHead.astro',
  'src/components/question/McqOptions.astro',
  'src/components/question/StructuredParts.astro',
  'src/components/question/AnswerPanel.astro',
  'src/components/question/MarkScheme.astro',
  'src/components/question/MarkPoints.astro',
  'src/components/question/labels.ts',
  'src/lib/markdown.ts',
  'src/lib/question-anchor.ts',
  'src/config.ts',
  'src/layouts/BaseLayout.astro',
  'src/styles/tokens.css',
  'src/styles/global.css',
  'scripts/pdf-manifest.mjs',
  'src/styles/print.css',
  'scripts/generate-pdfs.mjs',
];
/** Website folders (relative to Website/) whose source files all shape the PDFs: parser and chemistry formatting. */
export const WEBSITE_INPUT_DIRS = ['src/content', 'src/lib/chem'];
const SOURCE_EXTENSIONS = new Set(['.ts', '.mts', '.js', '.mjs', '.astro', '.css', '.json']);
const BATCH_DIR_RE = /^(?:T\d{2}_|0610_T\d{2}_)/;
const MAX_LEVELS_UP = 4;

/** Same rule as src/content/slug.ts: lower-case, letters and digits kept, every other run becomes one hyphen. */
export function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * @param {string} slug topic slug, e.g. "electrochemistry"
 * @param {string} kind "questions" or "mark-scheme"
 */
export function pdfFileName(slug, kind, subjectPath = SUBJECT_PATH) {
  return `topical-hub-${subjectPath.replace(/\//g, '-')}-${slug}-${kind}.pdf`;
}

/**
 * "420 KB" or "1.3 MB" (1 KB = 1024 bytes, as file managers show it).
 * @param {number} bytes
 */
export function formatPdfSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** @param {string} p */
function isDirectory(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

/**
 * CONTENT_DIR if set, else the first igcse-chem-pipeline/pipeline/04_approved at or above startDir.
 * @param {string} startDir
 */
export function findContentDir(startDir, subpath = CONTENT_SUBPATH) {
  const env = subpath === CONTENT_SUBPATH ? process.env.CONTENT_DIR : process.env.BIOLOGY_CONTENT_DIR;
  if (env) return path.resolve(env);
  let dir = path.resolve(startDir);
  for (let level = 0; level <= MAX_LEVELS_UP; level += 1) {
    const candidate = path.join(dir, ...subpath.split('/'));
    if (isDirectory(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(`Could not find ${CONTENT_SUBPATH} at or above ${startDir}. Set CONTENT_DIR.`);
}

/**
 * The topics, from the batch folders' questions.md frontmatter, sorted by folder name.
 * @param {string} contentDir
 * @returns {{ batch: string, topicName: string, slug: string }[]}
 */
export function listTopics(contentDir, subjectPath = SUBJECT_PATH) {
  const batches = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && BATCH_DIR_RE.test(e.name))
    .map((e) => e.name).sort().map((batch) => {
      const front = readText(path.join(contentDir, batch, 'questions.md')).match(/^---\n([\s\S]*?)\n---/);
      const line = front?.[1].match(/^topic_name:\s*(.+)$/m);
      if (!line) throw new Error(`${batch}/questions.md has no topic_name in its frontmatter`);
      const topicName = line[1].trim().replace(/^("|')(.*)\1$/, '$2');
      const part = Number(front[1].match(/^part:\s*(\d+)/m)?.[1] ?? 1);
      return { batch, topicName, slug: slugify(topicName), part, subjectPath };
    }).sort((a, b) => a.slug.localeCompare(b.slug) || a.part - b.part);
  const topics = new Map();
  for (const batch of batches) {
    const existing = topics.get(batch.slug);
    if (existing) existing.batches.push(batch.batch);
    else topics.set(batch.slug, { ...batch, batches: [batch.batch] });
  }
  return [...topics.values()];
}

/** Explicit contentDir overrides keep fixture callers scoped to their supplied source. */
export function publicationSources(websiteRoot, contentDir, options = {}) {
  const sources = [{ dir: contentDir, subpath: CONTENT_SUBPATH, subjectPath: SUBJECT_PATH }];
  if (!options.contentDir && !options.websiteFiles) sources.push({
    dir: findContentDir(websiteRoot, BIOLOGY_CONTENT_SUBPATH),
    subpath: BIOLOGY_CONTENT_SUBPATH, subjectPath: BIOLOGY_SUBJECT_PATH,
  });
  return sources;
}

export function publicationTopics(websiteRoot, contentDir, options = {}) {
  return publicationSources(websiteRoot, contentDir, options).flatMap((s) => listTopics(s.dir, s.subjectPath));
}

/**
 * Every PDF the site should have: one per topic and kind.
 * @param {{ batch: string, topicName: string, slug: string }[]} topics
 */
export function expectedPdfs(topics) {
  return topics.flatMap((topic) =>
    PDF_KINDS.map(({ kind, page }) => ({ ...topic, kind, page, file: pdfFileName(topic.slug, kind, topic.subjectPath) })),
  );
}

/**
 * File text with any BOM removed and CRLF / CR turned into LF.
 * @param {string} file
 */
function readText(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
}

/** @param {string | Buffer} data */
function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * @param {string} dir
 * @param {string[]} [out]
 */
function walkSources(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkSources(full, out);
    else if (SOURCE_EXTENSIONS.has(path.extname(entry.name)) && !/\.test\.[cm]?[jt]s$/.test(entry.name)) out.push(full);
  }
  return out;
}

/**
 * Read `export const NAME = 'value'` (or true/false) from src/config.ts; the scripts cannot import TypeScript.
 * @param {string} websiteRoot
 * @param {string} name
 */
export function readConfigValue(websiteRoot, name) {
  const text = readText(path.join(websiteRoot, 'src', 'config.ts'));
  const m = text.match(new RegExp(`export\\s+const\\s+${name}\\s*=\\s*(?:['"\`]([^'"\`]*)['"\`]|(true|false))`));
  if (!m) throw new Error(`${name} not found in src/config.ts`);
  return m[1] !== undefined ? m[1].replace(/\/+$/, '') : m[2];
}

/**
 * Hash every input that affects the PDFs.
 * @param {string} websiteRoot absolute path of Website/
 * @param {string} contentDir absolute path of 04_approved
 * @param {{ websiteFiles?: string[], websiteDirs?: string[] }} [options] override the lists (tests)
 * @returns {{ hash: string, values: Record<string, string>, files: Record<string, string> }}
 */
export function computeInputs(websiteRoot, contentDir, options = {}) {
  const websiteFiles = options.websiteFiles ?? WEBSITE_INPUT_FILES;
  const websiteDirs = options.websiteDirs ?? WEBSITE_INPUT_DIRS;
  /** @type {Record<string, string>} */
  const files = {};

  for (const source of publicationSources(websiteRoot, contentDir, options)) {
    for (const topic of listTopics(source.dir, source.subjectPath)) {
      for (const batch of topic.batches) {
        for (const name of ['questions.md', 'markscheme.md']) {
          const file = path.join(source.dir, batch, name);
          if (!fs.existsSync(file)) throw new Error(`Missing PDF input: ${file}`);
          files[`${source.subpath}/${batch}/${name}`] = sha256(readText(file));
        }
      }
    }
  }
  const websitePaths = new Set(websiteFiles.map((rel) => path.join(websiteRoot, ...rel.split('/'))));
  for (const dir of websiteDirs) {
    const full = path.join(websiteRoot, ...dir.split('/'));
    if (!isDirectory(full)) throw new Error(`Missing PDF input folder: Website/${dir}`);
    for (const file of walkSources(full)) websitePaths.add(file);
  }
  for (const file of websitePaths) {
    if (!fs.existsSync(file)) throw new Error(`Missing PDF input: ${file}`);
    const rel = path.relative(websiteRoot, file).split(path.sep).join('/');
    files[`Website/${rel}`] = sha256(readText(file));
  }

  const values = {
    SITE_URL: readConfigValue(websiteRoot, 'SITE_URL'),
    CHEM_FORMATTING: readConfigValue(websiteRoot, 'CHEM_FORMATTING'),
  };
  const keys = Object.keys(files).sort();
  const lines = [...Object.entries(values).map(([k, v]) => `value:${k}\t${v}`), ...keys.map((k) => `file:${k}\t${files[k]}`)];
  return { hash: sha256(lines.join('\n')), values, files: Object.fromEntries(keys.map((k) => [k, files[k]])) };
}

/**
 * The manifest object written next to the PDFs.
 * @param {{ hash: string, values: Record<string, string>, files: Record<string, string> }} inputs
 * @param {{ file: string, batch: string, slug: string, kind: string, bytes: number, sha256: string }[]} pdfs
 */
export function buildManifest(inputs, pdfs) {
  return {
    note: 'Generated by `npm run pdfs`. Do not edit. `npm run build` fails when inputsHash no longer matches the inputs.',
    inputsHash: inputs.hash,
    inputs: { values: inputs.values, files: inputs.files },
    count: pdfs.length,
    totalBytes: pdfs.reduce((n, p) => n + p.bytes, 0),
    pdfs,
  };
}

/** @param {string} pdfDir */
export function readManifest(pdfDir) {
  const file = path.join(pdfDir, MANIFEST_NAME);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/**
 * SHA-256 and size of a file on disk.
 * @param {string} file
 */
export function fileDigest(file) {
  const data = fs.readFileSync(file);
  return { bytes: data.length, sha256: sha256(data) };
}

/**
 * The stale-PDF guard: every expected PDF exists and matches the manifest, and the manifest's
 * inputsHash matches the inputs as they are now.
 * @param {string} websiteRoot
 * @param {{ contentDir?: string, pdfDir?: string, websiteFiles?: string[], websiteDirs?: string[] }} [options]
 * @returns {{ ok: boolean, problems: string[], count: number }}
 */
export function checkPdfs(websiteRoot, options = {}) {
  const contentDir = options.contentDir ?? findContentDir(websiteRoot);
  const pdfDir = options.pdfDir ?? path.join(websiteRoot, 'public', PDF_URL_DIR);
  const expected = expectedPdfs(publicationTopics(websiteRoot, contentDir, options));
  /** @type {string[]} */
  const problems = [];

  const manifest = readManifest(pdfDir);
  if (!manifest) {
    problems.push(`public/${PDF_URL_DIR}/${MANIFEST_NAME} is missing`);
  } else {
    const inputs = computeInputs(websiteRoot, contentDir, options);
    if (manifest.inputsHash !== inputs.hash) {
      const before = manifest.inputs?.files ?? {};
      const changed = [
        ...Object.entries(inputs.values)
          .filter(([k, v]) => manifest.inputs?.values?.[k] !== v)
          .map(([k]) => k),
        ...Object.keys(inputs.files).filter((k) => before[k] !== inputs.files[k]),
        ...Object.keys(before).filter((k) => !(k in inputs.files)),
      ];
      problems.push(`inputs changed since the PDFs were made: ${changed.length ? changed.join(', ') : 'the input list'}`);
    }
  }

  /** @type {Map<string, { bytes: number, sha256: string }>} */
  const listed = new Map((manifest?.pdfs ?? []).map((/** @type {any} */ p) => [p.file, p]));
  for (const pdf of expected) {
    const file = path.join(pdfDir, pdf.file);
    if (!fs.existsSync(file)) {
      problems.push(`${pdf.file} is missing`);
      continue;
    }
    if (!manifest) continue;
    const entry = listed.get(pdf.file);
    if (!entry) {
      problems.push(`${pdf.file} is not listed in ${MANIFEST_NAME}`);
      continue;
    }
    const digest = fileDigest(file);
    if (digest.bytes !== entry.bytes || digest.sha256 !== entry.sha256) problems.push(`${pdf.file} does not match ${MANIFEST_NAME}`);
  }
  return { ok: problems.length === 0, problems, count: expected.length };
}