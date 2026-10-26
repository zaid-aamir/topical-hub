/**
 * check-dist.mjs against a fake dist built in a temp folder: a deliberate banned phrase and a
 * broken link must be caught; a clean site must pass.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkDist, readSiteUrl } from '../../scripts/check-dist.mjs';

const SITE_URL = 'https://example.test';
const WEBSITE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
/** The banned phrase, assembled at runtime so the literal never appears in the repository. */
const BANNED = ['past', 'papers'].join(' ');
const BANNED_HYPHEN = ['past', 'paper'].join('-');
const BANNED_CAPS = ['Past', 'Papers'].join(' ');

function page(body: string, opts: { title?: string; head?: string; lang?: string } = {}): string {
  const lang = opts.lang === undefined ? ' lang="en"' : opts.lang ? ` lang="${opts.lang}"` : '';
  return `<!doctype html><html${lang}><head><meta charset="utf-8"><title>${opts.title ?? 'Page'}</title>${opts.head ?? ''}</head><body><main id="main">${body}</main></body></html>`;
}

function writeTree(root: string, files: Record<string, string>): void {
  for (const [rel, content] of Object.entries(files)) {
    const full = path.join(root, ...rel.split('/'));
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content, 'utf8');
  }
}

const CLEAN: Record<string, string> = {
  'index.html': page(
    `<h1>Topical Hub</h1><a href="/about/">About</a> <a href="/igcse/chemistry-0620/">Subject</a> <a href="${SITE_URL}/privacy/">Privacy</a>
     <a href="/igcse/chemistry-0620/electrochemistry/#q16">Q16</a> <a href="/404">404</a> <a href="#main">top</a>
     <a href="https://github.com/zaid-aamir/topical-hub/issues/new?title=x" target="_blank" rel="noopener noreferrer">report</a>
     <a href="mailto:someone@example.test">mail</a> <img src="/favicon.svg" alt="">`,
    { head: '<link rel="stylesheet" href="/_astro/site.css"><link rel="canonical" href="https://example.test/"><script type="module" src="/_astro/app.js"></script>' },
  ),
  'about/index.html': page(`<h1>About</h1><p>These are original exam-style questions, not ${BANNED}.</p><p>See <a href="../">home</a>.</p>`),
  'privacy/index.html': page('<h1>Privacy</h1>'),
  '404.html': page('<h1>Not found</h1><a href="/">Home</a>'),
  'igcse/biology-0610/index.html': page('<h1>IGCSE Biology</h1>'),
  'igcse/physics-0625/index.html': page('<h1>IGCSE Physics</h1>'),
  'igcse/edexcel-physics-4ph1/index.html': page('<h1>Edexcel IGCSE Physics</h1>'),
  'igcse/chemistry-0620/index.html': page('<h1>IGCSE Chemistry</h1><a href="electrochemistry/">Electrochemistry</a>'),
  'igcse/chemistry-0620/electrochemistry/index.html': page(
    '<h1>Electrochemistry</h1><article class="question" id="q16"><h2>16</h2><a href="print/">Print</a> <a href="print-answers/">Answers</a></article>',
  ),
  'igcse/chemistry-0620/electrochemistry/print/index.html': page('<h1>Electrochemistry</h1>', { head: '<meta name="robots" content="noindex, nofollow">' }),
  'igcse/chemistry-0620/electrochemistry/print-answers/index.html': page('<h1>Electrochemistry answers</h1>', { head: '<meta content="noindex" name="robots">' }),
  '_astro/site.css': `@font-face{font-family:X;src:url(/_astro/x.woff2) format("woff2")} body{background:url("../bg.svg")}`,
  '_astro/x.woff2': 'not really a font',
  'bg.svg': '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
  '_astro/app.js': 'document.createElementNS("http://www.w3.org/2000/svg","svg");',
  'favicon.svg': '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
  'robots.txt': `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap-index.xml\n`,
  'sitemap-index.xml': `<?xml version="1.0"?><sitemapindex><sitemap><loc>${SITE_URL}/sitemap-0.xml</loc></sitemap></sitemapindex>`,
  'sitemap-0.xml': `<?xml version="1.0"?><urlset><url><loc>${SITE_URL}/</loc></url><url><loc>${SITE_URL}/about/</loc></url><url><loc>${SITE_URL}/igcse/chemistry-0620/electrochemistry/</loc></url></urlset>`,
};

let tmp: string;
beforeAll(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'topical-hub-check-dist-'));
});
afterAll(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
});

function fakeDist(name: string, files: Record<string, string>): string {
  const dir = path.join(tmp, name);
  writeTree(dir, files);
  return dir;
}

describe('check-dist', () => {
  it('reads SITE_URL from src/config.ts', () => {
    expect(readSiteUrl(WEBSITE_ROOT)).toMatch(/^https:\/\/[a-z0-9.-]+$/);
  });

  it('passes a clean site, counting links, anchors and resources', () => {
    const result = checkDist(fakeDist('clean', CLEAN), { siteUrl: SITE_URL });
    expect(result.failures).toEqual([]);
    expect(result.ok).toBe(true);
    expect(result.warnings).toEqual([]);
    expect(result.summary.htmlFiles).toBe(Object.keys(CLEAN).filter((file) => file.endsWith('.html')).length);
    expect(result.summary.phraseMatches).toBe(1);
    expect(result.summary.anchorsChecked).toBeGreaterThanOrEqual(2);
    expect(result.summary.linksChecked).toBeGreaterThan(10);
  });

  it('catches the banned phrase outside the About page, with a context snippet', () => {
    const dir = fakeDist('phrase', {
      ...CLEAN,
      'igcse/biology-0610/index.html': page('<h1>IGCSE Biology</h1>'),
  'igcse/chemistry-0620/index.html': page(`<h1>IGCSE Chemistry</h1><p>Browse our ${BANNED_CAPS} by topic.</p><a href="electrochemistry/">E</a>`),
      '_astro/app.js': `const label = "${BANNED_HYPHEN} mode";`,
      'sitemap-0.xml': CLEAN['sitemap-0.xml'],
    });
    const result = checkDist(dir, { siteUrl: SITE_URL });
    expect(result.ok).toBe(false);
    const phrase = result.failures.filter((f) => f.check === 'phrase');
    expect(phrase.map((f) => f.file).sort()).toEqual(['_astro/app.js', 'igcse/chemistry-0620/index.html']);
    expect(phrase.find((f) => f.file.endsWith('index.html'))?.message).toContain(`Browse our ${BANNED_CAPS} by topic`);
  });

  it('allows one mention on the About page but not two', () => {
    const dir = fakeDist('about-twice', {
      ...CLEAN,
      'about/index.html': page(`<h1>About</h1><p>Not ${BANNED}.</p><p>Really not ${BANNED}.</p>`),
    });
    const result = checkDist(dir, { siteUrl: SITE_URL });
    expect(result.failures.map((f) => f.check)).toEqual(['phrase', 'phrase']);
  });

  it('catches broken internal links, missing anchors and bad SITE_URL links', () => {
    const dir = fakeDist('links', {
      ...CLEAN,
      'index.html': page(
        `<h1>Home</h1><a href="/about/">ok</a><a href="/missing/">broken</a><a href="/igcse/chemistry-0620/electrochemistry/#q99">no anchor</a>
         <a href="${SITE_URL}/nowhere">absolute broken</a><a href="#nope">same-page missing</a><a href="/404">ok</a>`,
      ),
    });
    const result = checkDist(dir, { siteUrl: SITE_URL });
    expect(result.ok).toBe(false);
    const links = result.failures.filter((f) => f.check === 'link').map((f) => f.message);
    expect(links.some((m) => m.includes('/missing/'))).toBe(true);
    expect(links.some((m) => m.includes('/nowhere'))).toBe(true);
    const anchors = result.failures.filter((f) => f.check === 'anchor').map((f) => f.message);
    expect(anchors.some((m) => m.includes('id="q99"'))).toBe(true);
    expect(anchors.some((m) => m.includes('id="nope"'))).toBe(true);
    expect(result.failures).toHaveLength(4);
  });

  it('requires exactly one h1, lang="en", and noindex on print pages', () => {
    const dir = fakeDist('structure', {
      ...CLEAN,
      'privacy/index.html': page('<h1>Privacy</h1><h1>Again</h1>'),
      '404.html': page('<h1>Not found</h1><a href="/">Home</a>', { lang: 'fr' }),
      'igcse/chemistry-0620/electrochemistry/print/index.html': page('<h1>Print</h1>'),
    });
    const result = checkDist(dir, { siteUrl: SITE_URL });
    const byCheck = Object.fromEntries(['h1', 'lang', 'noindex'].map((c) => [c, result.failures.filter((f) => f.check === c).map((f) => f.file)]));
    expect(byCheck.h1).toEqual(['privacy/index.html']);
    expect(byCheck.lang).toEqual(['404.html']);
    expect(byCheck.noindex).toEqual(['igcse/chemistry-0620/electrochemistry/print/index.html']);
  });

  it('rejects resources fetched from another origin, including CSS url() and @import', () => {
    const dir = fakeDist('external', {
      ...CLEAN,
      'privacy/index.html': page('<h1>Privacy</h1><script src="https://cdn.example.com/a.js"></script><img src="//img.example.com/x.png" alt="">', {
        head: '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=X"><link rel="canonical" href="https://example.test/privacy/">',
      }),
      '_astro/site.css': `@import "https://fonts.googleapis.com/css2?family=Y"; body{background:url(https://cdn.example.com/bg.png)}`,
    });
    const result = checkDist(dir, { siteUrl: SITE_URL });
    const external = result.failures.filter((f) => f.check === 'external').map((f) => f.message);
    expect(external).toHaveLength(5);
    expect(result.failures.filter((f) => f.check !== 'external')).toEqual([]);
  });

  it('checks the sitemap and robots.txt', () => {
    const dir = fakeDist('sitemap', {
      ...CLEAN,
      'sitemap-0.xml': `<?xml version="1.0"?><urlset><url><loc>${SITE_URL}/</loc></url><url><loc>${SITE_URL}/gone/</loc></url><url><loc>${SITE_URL}/igcse/chemistry-0620/electrochemistry/print/</loc></url><url><loc>https://other.test/</loc></url></urlset>`,
      'robots.txt': 'User-agent: *\nAllow: /\n',
    });
    const result = checkDist(dir, { siteUrl: SITE_URL });
    const checks = result.failures.map((f) => f.check).sort();
    expect(checks).toEqual(['link', 'robots', 'sitemap', 'sitemap']);
  });

  it('warns about expected pages that are missing instead of failing', () => {
    const dir = fakeDist('placeholder', { 'index.html': page('<h1>Topical Hub</h1>') });
    const result = checkDist(dir, { siteUrl: SITE_URL });
    expect(result.ok).toBe(true);
    expect(result.warnings.length).toBeGreaterThanOrEqual(6);
  });

  it('fails clearly when dist does not exist', () => {
    const result = checkDist(path.join(tmp, 'does-not-exist'), { siteUrl: SITE_URL });
    expect(result.ok).toBe(false);
    expect(result.failures[0]?.message).toMatch(/astro build/);
  });
});
