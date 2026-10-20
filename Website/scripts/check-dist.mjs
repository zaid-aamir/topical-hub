#!/usr/bin/env node
/**
 * check-dist.mjs: post-build checks over Website/dist. Plain Node, no dependencies.
 *
 * `npm run build` runs this right after `astro build`; the build fails if any check fails.
 * Run alone with:  node scripts/check-dist.mjs [--dist <dir>] [--site-url <origin>]
 *
 * Checks (each failure is listed and the process exits 1):
 *  1. Labelling. The phrase matched by /past[\s-]*papers?/i must not appear in any .html, .xml,
 *     .txt, .json, .js or .css file. The single exception is at most ONE occurrence in
 *     about/index.html (the sentence saying what the questions are NOT).
 *  2. Internal links and anchors. Every href / src / srcset / poster that points inside the site
 *     (root-relative "/x/", page-relative "print/", or absolute on SITE_URL) must resolve to a file
 *     in dist: "/x/" -> x/index.html, "/x" -> x, x.html or x/index.html. Query strings are ignored.
 *     Every #fragment must match an element id in the target document. Paths are matched with the
 *     exact case of the files on disk, because the host's file system is case-sensitive.
 *  3. Every .html has exactly one <h1> and <html lang="en">.
 *  4. Every **\/print/index.html and **\/print-answers/index.html has
 *     <meta name="robots" content="noindex ...">.
 *  5. No resource is fetched from another origin: <script src>, fetching <link href> (stylesheet,
 *     preload, icon, ...), <img>, <iframe>, <source>, <video>, <audio>, <embed>, <object>, srcset,
 *     poster, and CSS url() / @import in .css files and <style> blocks.
 *  6. sitemap*.xml: every <loc> is on SITE_URL, resolves to a page, and is not a print page.
 *     robots.txt (when present) links an existing sitemap on SITE_URL.
 *
 * Warnings are printed but never fail the build: expected pages that are absent, http(s) URLs
 * inside JS bundles (reviewed by eye; SVG namespaces are ignored), an About page with no mention.
 *
 * The unit test imports checkDist(distDir, { siteUrl }) and readSiteUrl(websiteRoot).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SUBJECTS } from '../src/config.ts';

const PHRASE_RE = /past[\s-]*papers?/gi;
const TEXT_EXTENSIONS = new Set(['.html', '.xml', '.txt', '.json', '.js', '.css']);
const ALLOWED_PHRASE_FILE = 'about/index.html';
const PRINT_PAGE_RE = /(^|\/)print(-answers)?\/index\.html$/;
const EXPECTED_FILES = [
  'index.html',
  'about/index.html',
  'privacy/index.html',
  '404.html',
  'robots.txt',
  'sitemap-index.xml',
  ...SUBJECTS.map((subject) => `${subject.path}/index.html`),
];
/** <link rel> values that make the browser fetch the href. */
const FETCHING_LINK_RELS = new Set([
  'stylesheet',
  'preload',
  'modulepreload',
  'prefetch',
  'prerender',
  'icon',
  'shortcut',
  'apple-touch-icon',
  'apple-touch-icon-precomposed',
  'mask-icon',
  'manifest',
  'preconnect',
  'dns-prefetch',
]);
const SKIP_SCHEMES = /^(mailto|tel|sms|javascript|data|blob|about):/i;
/** Tag with attributes; quoted attribute values may contain ">". */
const TAG_RE =
  /<([a-zA-Z][\w:-]*)((?:\s+[^\s"'<>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*\/?>/g;
const ATTR_RE = /([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
const CSS_URL_RE = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)"'\s]+))\s*\)/g;
const CSS_IMPORT_RE = /@import\s+(?:"([^"]*)"|'([^']*)')/g;
const STYLE_BLOCK_RE = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
const JS_URL_RE = /https?:\/\/[^\s"'`)<>\\]+/g;

/**
 * Read SITE_URL from src/config.ts with a regex (the script is plain JS and cannot import TS).
 * @param {string} websiteRoot
 * @returns {string} origin without a trailing slash
 */
export function readSiteUrl(websiteRoot) {
  const configPath = path.join(websiteRoot, 'src', 'config.ts');
  const text = fs.readFileSync(configPath, 'utf8');
  const m = text.match(/export\s+const\s+SITE_URL\s*=\s*['"`]([^'"`]+)['"`]/);
  if (!m) throw new Error(`SITE_URL not found in ${configPath}`);
  return m[1].replace(/\/+$/, '');
}

/**
 * @param {string} dir
 * @returns {string[]} relative POSIX paths of every file under dir, sorted
 */
function walk(dir, base = dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, base, out);
    else if (entry.isFile()) out.push(path.relative(base, full).split(path.sep).join('/'));
  }
  return out;
}

/** @param {string} value */
function decodeBasicEntities(value) {
  return value
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

/** @param {string} attrText */
function parseAttrs(attrText) {
  /** @type {Record<string, string>} */
  const attrs = {};
  for (const m of attrText.matchAll(ATTR_RE)) {
    const name = m[1].toLowerCase();
    if (!(name in attrs)) attrs[name] = decodeBasicEntities(m[2] ?? m[3] ?? m[4] ?? '');
  }
  return attrs;
}

/**
 * One pass over the tags of an HTML document.
 * @param {string} html
 */
function scanHtml(html) {
  const ids = new Set();
  /** @type {{tag: string, attrs: Record<string, string>}[]} */
  const tags = [];
  let h1 = 0;
  let langEn = false;
  for (const m of html.matchAll(TAG_RE)) {
    const tag = m[1].toLowerCase();
    const attrs = parseAttrs(m[2] ?? '');
    if (tag === 'h1') h1 += 1;
    if (tag === 'html' && (attrs.lang ?? '').toLowerCase() === 'en') langEn = true;
    if (attrs.id) ids.add(attrs.id);
    if (tag === 'a' && attrs.name) ids.add(attrs.name);
    tags.push({ tag, attrs });
  }
  return { ids, tags, h1, langEn };
}

/**
 * Decide what a URL-ish attribute value is.
 * @param {string} value
 * @param {string} siteUrl origin without trailing slash, or ''
 * @returns {{kind: 'empty'|'skip'|'external'|'internal', url?: string}}
 */
function classify(value, siteUrl) {
  const v = value.trim();
  if (v === '') return { kind: 'empty' };
  if (v.startsWith('#')) return { kind: 'internal', url: v };
  if (v.startsWith('//')) return { kind: 'external', url: v };
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(v)) {
    if (SKIP_SCHEMES.test(v)) return { kind: 'skip' };
    if (/^https?:/i.test(v) && siteUrl) {
      if (v === siteUrl) return { kind: 'internal', url: '/' };
      if (v.startsWith(siteUrl + '/') || v.startsWith(siteUrl + '#') || v.startsWith(siteUrl + '?')) {
        const rest = v.slice(siteUrl.length);
        return { kind: 'internal', url: rest.startsWith('/') ? rest : '/' + rest };
      }
    }
    return { kind: 'external', url: v };
  }
  return { kind: 'internal', url: v };
}

/** 60-character context around a match, whitespace collapsed. */
function snippet(text, index, length) {
  const pad = Math.max(0, Math.floor((60 - length) / 2));
  const start = Math.max(0, index - pad);
  const end = Math.min(text.length, index + length + pad);
  return (start > 0 ? '…' : '') + text.slice(start, end).replace(/\s+/g, ' ') + (end < text.length ? '…' : '');
}

/**
 * Run every check over a built dist directory.
 * @param {string} distDir
 * @param {{ siteUrl?: string }} [options]
 * @returns {{
 *   ok: boolean,
 *   failures: { check: string, file: string, message: string }[],
 *   warnings: string[],
 *   summary: { filesScanned: number, htmlFiles: number, linksChecked: number, anchorsChecked: number, phraseMatches: number, resourcesChecked: number }
 * }}
 */
export function checkDist(distDir, options = {}) {
  const siteUrl = (options.siteUrl ?? '').replace(/\/+$/, '');
  /** @type {{ check: string, file: string, message: string }[]} */
  const failures = [];
  /** @type {string[]} */
  const warnings = [];
  const summary = { filesScanned: 0, htmlFiles: 0, linksChecked: 0, anchorsChecked: 0, phraseMatches: 0, resourcesChecked: 0 };
  const fail = (check, file, message) => failures.push({ check, file, message });

  if (!fs.existsSync(distDir) || !fs.statSync(distDir).isDirectory()) {
    fail('dist', '', `${distDir} does not exist. Run "npx astro build" first.`);
    return { ok: false, failures, warnings, summary };
  }

  const files = walk(distDir);
  const fileSet = new Set(files);
  summary.filesScanned = files.length;
  const read = (rel) => fs.readFileSync(path.join(distDir, ...rel.split('/')), 'utf8');

  /** @type {Map<string, ReturnType<typeof scanHtml>>} */
  const scanCache = new Map();
  const scanned = (rel) => {
    let s = scanCache.get(rel);
    if (!s) {
      s = scanHtml(read(rel));
      scanCache.set(rel, s);
    }
    return s;
  };

  /**
   * Resolve a site-internal URL (relative or root-relative, may carry ?query and #fragment) against the
   * document it appears in, then check that the target file and the fragment exist.
   * @param {string} url
   * @param {string} fromFile relative path of the document (or stylesheet) the URL appears in
   * @param {string} what description for the failure message
   * @param {boolean} checkFragment
   */
  const checkInternal = (url, fromFile, what, checkFragment) => {
    summary.linksChecked += 1;
    let parsed;
    try {
      parsed = new URL(url, 'http://dist.invalid/' + fromFile);
    } catch {
      fail('link', fromFile, `${what} is not a valid URL: ${url}`);
      return;
    }
    let pathname;
    let fragment;
    try {
      pathname = decodeURIComponent(parsed.pathname);
      fragment = decodeURIComponent(parsed.hash.replace(/^#/, ''));
    } catch {
      fail('link', fromFile, `${what} has malformed percent-encoding: ${url}`);
      return;
    }
    const rel = pathname.replace(/^\/+/, '');
    const candidates = rel === '' || rel.endsWith('/') ? [rel + 'index.html'] : [rel, rel + '.html', rel + '/index.html'];
    const target = candidates.find((c) => fileSet.has(c));
    if (!target) {
      fail('link', fromFile, `${what} points at ${url} but none of ${candidates.map((c) => 'dist/' + c).join(', ')} exists`);
      return;
    }
    if (checkFragment && fragment && fragment !== 'top' && target.endsWith('.html')) {
      summary.anchorsChecked += 1;
      if (!scanned(target).ids.has(fragment)) {
        fail('anchor', fromFile, `${what} points at ${url} but no element with id="${fragment}" exists in dist/${target}`);
      }
    }
  };

  /** A URL that the browser would fetch as a resource (must be same-origin). */
  const checkResource = (value, fromFile, what) => {
    summary.resourcesChecked += 1;
    const c = classify(value, siteUrl);
    if (c.kind === 'external') fail('external', fromFile, `${what} fetches from another origin: ${c.url}`);
    else if (c.kind === 'internal') checkInternal(/** @type {string} */ (c.url), fromFile, what, false);
  };

  /** CSS text from a .css file or a <style> block. */
  const checkCss = (css, fromFile) => {
    for (const m of css.matchAll(CSS_URL_RE)) {
      const value = m[1] ?? m[2] ?? m[3] ?? '';
      if (value.trim() === '' || value.startsWith('#')) continue;
      checkResource(value, fromFile, 'CSS url()');
    }
    for (const m of css.matchAll(CSS_IMPORT_RE)) checkResource(m[1] ?? m[2] ?? '', fromFile, 'CSS @import');
  };

  // ---- 1. Labelling: the banned phrase -------------------------------------------------------------
  let aboutMatches = 0;
  for (const rel of files) {
    if (!TEXT_EXTENSIONS.has(path.extname(rel).toLowerCase())) continue;
    let text = read(rel);
    if (rel.endsWith('.html')) text = text.replace(/&nbsp;|&#160;|&#xa0;/gi, ' ');
    const matches = [...text.matchAll(PHRASE_RE)];
    summary.phraseMatches += matches.length;
    if (rel === ALLOWED_PHRASE_FILE) {
      aboutMatches = matches.length;
      if (matches.length > 1) {
        for (const m of matches) {
          fail('phrase', rel, `only one mention is allowed on the About page, found ${matches.length}: "${snippet(text, m.index ?? 0, m[0].length)}"`);
        }
      }
      continue;
    }
    for (const m of matches) {
      fail('phrase', rel, `banned phrase "${m[0]}": "${snippet(text, m.index ?? 0, m[0].length)}"`);
    }
  }
  if (fileSet.has(ALLOWED_PHRASE_FILE) && aboutMatches === 0) {
    warnings.push(`${ALLOWED_PHRASE_FILE} does not contain the one allowed sentence saying what the questions are not`);
  }

  // ---- 2-5. Per-document checks --------------------------------------------------------------------
  for (const rel of files) {
    if (!rel.endsWith('.html')) continue;
    summary.htmlFiles += 1;
    const html = read(rel);
    const s = scanned(rel);

    if (s.h1 !== 1) fail('h1', rel, `expected exactly one <h1>, found ${s.h1}`);
    if (!s.langEn) fail('lang', rel, 'missing <html lang="en">');

    if (PRINT_PAGE_RE.test(rel)) {
      const noindex = s.tags.some(
        ({ tag, attrs }) => tag === 'meta' && (attrs.name ?? '').toLowerCase() === 'robots' && /\bnoindex\b/i.test(attrs.content ?? ''),
      );
      if (!noindex) fail('noindex', rel, 'print page is missing <meta name="robots" content="noindex">');
    }

    for (const { tag, attrs } of s.tags) {
      if ((tag === 'a' || tag === 'area') && attrs.href !== undefined) {
        const c = classify(attrs.href, siteUrl);
        if (c.kind === 'internal') checkInternal(/** @type {string} */ (c.url), rel, `<${tag} href>`, true);
        continue;
      }
      if (tag === 'link' && attrs.href !== undefined) {
        const rels = (attrs.rel ?? '').toLowerCase().split(/\s+/).filter(Boolean);
        const fetches = rels.length === 0 || rels.some((r) => FETCHING_LINK_RELS.has(r));
        if (fetches) {
          checkResource(attrs.href, rel, `<link rel="${attrs.rel ?? ''}" href>`);
        } else {
          const c = classify(attrs.href, siteUrl);
          if (c.kind === 'internal') checkInternal(/** @type {string} */ (c.url), rel, `<link rel="${attrs.rel ?? ''}" href>`, false);
        }
        continue;
      }
      if (attrs.src !== undefined && ['script', 'img', 'iframe', 'source', 'video', 'audio', 'embed', 'track', 'input'].includes(tag)) {
        checkResource(attrs.src, rel, `<${tag} src>`);
      }
      if (attrs.srcset !== undefined && (tag === 'img' || tag === 'source')) {
        for (const candidate of attrs.srcset.split(',')) {
          const url = candidate.trim().split(/\s+/)[0];
          if (url) checkResource(url, rel, `<${tag} srcset>`);
        }
      }
      if (tag === 'video' && attrs.poster !== undefined) checkResource(attrs.poster, rel, '<video poster>');
      if (tag === 'object' && attrs.data !== undefined) checkResource(attrs.data, rel, '<object data>');
    }

    for (const m of html.matchAll(STYLE_BLOCK_RE)) checkCss(m[1], rel);
  }

  // ---- 5b. Stylesheets and bundles -----------------------------------------------------------------
  for (const rel of files) {
    if (rel.endsWith('.css')) checkCss(read(rel), rel);
    if (rel.endsWith('.js')) {
      const urls = new Set();
      for (const m of read(rel).matchAll(JS_URL_RE)) {
        const u = m[0];
        if (/^https?:\/\/(www\.)?w3\.org\//i.test(u)) continue;
        if (siteUrl && u.startsWith(siteUrl)) continue;
        urls.add(u);
      }
      for (const u of urls) warnings.push(`${rel} contains an absolute URL, check it is not fetched at runtime: ${u}`);
    }
  }

  // ---- 6. Sitemap and robots.txt -------------------------------------------------------------------
  for (const rel of files) {
    if (!/^sitemap[^/]*\.xml$/.test(rel)) continue;
    for (const m of read(rel).matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
      const loc = decodeBasicEntities(m[1]);
      if (siteUrl && !loc.startsWith(siteUrl)) {
        fail('sitemap', rel, `<loc> ${loc} is not on SITE_URL ${siteUrl}`);
        continue;
      }
      if (/\/print(-answers)?\/?$/.test(loc)) fail('sitemap', rel, `print pages are noindex and must not be listed: ${loc}`);
      const c = classify(loc, siteUrl);
      if (c.kind === 'internal') checkInternal(/** @type {string} */ (c.url), rel, '<loc>', false);
    }
  }
  if (fileSet.has('robots.txt')) {
    const lines = read('robots.txt').split(/\r?\n/);
    const sitemaps = lines.filter((l) => /^\s*sitemap\s*:/i.test(l)).map((l) => l.replace(/^\s*sitemap\s*:\s*/i, '').trim());
    if (sitemaps.length === 0) fail('robots', 'robots.txt', 'has no "Sitemap:" line');
    for (const sm of sitemaps) {
      const c = classify(sm, siteUrl);
      if (c.kind === 'internal') checkInternal(/** @type {string} */ (c.url), 'robots.txt', 'Sitemap:', false);
      else fail('robots', 'robots.txt', `Sitemap: ${sm} is not on SITE_URL ${siteUrl}`);
    }
    if (lines.some((l) => /^\s*disallow\s*:\s*\/\s*$/i.test(l))) warnings.push('robots.txt contains "Disallow: /", which blocks every crawler');
  }

  for (const expected of EXPECTED_FILES) {
    if (!fileSet.has(expected)) warnings.push(`${expected} is missing (expected in v1)`);
  }

  return { ok: failures.length === 0, failures, warnings, summary };
}

// ---- CLI ---------------------------------------------------------------------------------------------
function isMain() {
  if (!process.argv[1]) return false;
  const a = path.resolve(process.argv[1]);
  const b = fileURLToPath(import.meta.url);
  return process.platform === 'win32' ? a.toLowerCase() === b.toLowerCase() : a === b;
}

if (isMain()) {
  const websiteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const args = process.argv.slice(2);
  const argValue = (name) => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const distDir = path.resolve(argValue('--dist') ?? path.join(websiteRoot, 'dist'));
  const siteUrl = argValue('--site-url') ?? readSiteUrl(websiteRoot);

  const result = checkDist(distDir, { siteUrl });
  const s = result.summary;
  console.log(`check-dist: ${distDir.split(path.sep).join('/')} (SITE_URL ${siteUrl})`);
  console.log(
    `check-dist: ${s.filesScanned} files scanned (${s.htmlFiles} html), ${s.linksChecked} internal links, ${s.anchorsChecked} anchors, ${s.resourcesChecked} resources, ${s.phraseMatches} banned-phrase mention(s)`,
  );
  for (const w of result.warnings) console.log(`WARN  ${w}`);
  if (result.ok) {
    console.log(`check-dist: OK, all checks passed${result.warnings.length ? ` (${result.warnings.length} warning(s))` : ''}`);
    process.exit(0);
  }
  for (const f of result.failures) console.error(`FAIL  [${f.check}] ${f.file || '(dist)'}: ${f.message}`);
  console.error(`check-dist: ${result.failures.length} failure(s)`);
  process.exit(1);
}
