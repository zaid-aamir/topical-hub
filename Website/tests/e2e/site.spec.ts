/**
 * Browser checks against the production build served by `astro preview` (see playwright.config.ts).
 *
 *   npm run build && npm run test:e2e
 *
 * Every selector here comes from the DOM contract in CONTRACT.md. Screenshots go to
 * test-results/screenshots/<page-slug>-<width>-<theme>.png (gitignored).
 */
import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SUBJECT = '/igcse/chemistry-0620/';
/** MCQ-heavy, has table-shaped options (T07 Q1, Q5, Q11). */
const TOPIC = `${SUBJECT}acids-bases-and-salts/`;
/** Table-heavy. */
const TABLE_TOPIC = `${SUBJECT}states-of-matter/`;
const PRINT = `${TABLE_TOPIC}print/`;
const PRINT_ANSWERS = `${TABLE_TOPIC}print-answers/`;

const PAGES = [
  { slug: 'home', path: '/' },
  { slug: 'subject', path: SUBJECT },
  { slug: 'acids-bases-and-salts', path: TOPIC },
  { slug: 'states-of-matter', path: TABLE_TOPIC },
  { slug: 'states-of-matter-print', path: PRINT },
] as const;

const WIDTHS = [360, 1280] as const;
const THEMES = ['light', 'dark'] as const;

const SCREENSHOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../test-results/screenshots');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

/** Collect console errors and uncaught exceptions. Attach before navigating. */
function watchErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console.error: ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  return errors;
}

async function open(page: Page, url: string): Promise<string[]> {
  const errors = watchErrors(page);
  const response = await page.goto(url);
  expect(response, `no response for ${url}`).not.toBeNull();
  expect(response?.status(), `status for ${url}`).toBe(200);
  await page.evaluate(() => document.fonts.ready);
  return errors;
}

/**
 * Relative luminance (0 dark .. 1 light) of the page background: the body's, else the root's,
 * else the white canvas that shows through a fully transparent background.
 */
async function bodyLuminance(page: Page): Promise<number> {
  return page.evaluate(() => {
    const parse = (colour: string): number[] | null => {
      const m = colour.match(/\d+(\.\d+)?/g) ?? [];
      if (m.length < 3) return null;
      const alpha = m.length >= 4 ? Number(m[3]) : 1;
      if (alpha === 0) return null;
      return m.slice(0, 3).map((v) => Number(v) / 255);
    };
    const rgb = parse(getComputedStyle(document.body).backgroundColor) ?? parse(getComputedStyle(document.documentElement).backgroundColor) ?? [1, 1, 1];
    const [r, g, b] = rgb;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  });
}

// ---- Screenshots, overflow, console errors, theme following the system -----------------------------------
for (const width of WIDTHS) {
  for (const theme of THEMES) {
    test.describe(`${width}px ${theme}`, () => {
      test.use({ viewport: { width, height: width === 360 ? 740 : 800 }, colorScheme: theme });

      for (const p of PAGES) {
        test(`${p.slug}: renders, screenshot, no overflow, no console errors`, async ({ page }) => {
          const errors = await open(page, p.path);

          await expect(page.locator('h1')).toHaveCount(1);
          await expect(page.locator('html')).toHaveAttribute('lang', 'en');

          await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${p.slug}-${width}-${theme}.png`), fullPage: true });

          if (width === 360) {
            const [scrollWidth, innerWidth] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
            expect(scrollWidth, `horizontal overflow on ${p.path} at 360px`).toBeLessThanOrEqual(innerWidth);
          }

          if (!p.path.endsWith('/print/')) {
            // prefers-color-scheme is honoured without any stored choice.
            const luminance = await bodyLuminance(page);
            if (theme === 'dark') expect(luminance, 'dark scheme should give a dark page background').toBeLessThan(0.4);
            else expect(luminance, 'light scheme should give a light page background').toBeGreaterThan(0.6);
          }

          expect(errors, `console/page errors on ${p.path}`).toEqual([]);
        });
      }
    });
  }
}

// ---- Global contract --------------------------------------------------------------------------------------
test.describe('global', () => {
  test.use({ colorScheme: 'light' });

  test('skip link is the first focusable element and points at main', async ({ page }) => {
    await open(page, TOPIC);
    await expect(page.locator('a.skip-link[href="#main"]')).toHaveCount(1);
    await expect(page.locator('main#main')).toHaveCount(1);
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? `${el.tagName.toLowerCase()}.${el.className}` : null;
    });
    expect(focused).toContain('skip-link');
  });

  test('theme toggle flips html[data-theme] and aria-pressed, and the choice survives a reload', async ({ page }) => {
    await open(page, TOPIC);
    const html = page.locator('html');
    const toggle = page.locator('button#theme-toggle');
    await expect(toggle).toHaveCount(1);
    await expect(toggle).toHaveAttribute('aria-label', /.+/);
    // Following the system (light): no explicit choice yet.
    await expect(html).not.toHaveAttribute('data-theme', /.+/);
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(await bodyLuminance(page), 'toggled dark theme should give a dark background').toBeLessThan(0.4);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'acids-bases-and-salts-toggle-dark.png'), fullPage: false });

    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'light');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    const stored = await page.evaluate(() => {
      try {
        return localStorage.getItem('theme');
      } catch {
        return null;
      }
    });
    expect(stored).toBe('dark');
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });

  test('home page routes to the subject and its topics', async ({ page }) => {
    await open(page, '/');
    const subjectLinks = await page.locator(`a[href="${SUBJECT}"]`).count();
    const topicLinks = await page.$$eval('a[href]', (anchors) =>
      new Set(anchors.map((a) => a.getAttribute('href') ?? '').filter((h) => /^\/igcse\/chemistry-0620\/[a-z0-9-]+\/$/.test(h))).size,
    );
    expect(subjectLinks + topicLinks).toBeGreaterThan(0);
  });

  test('subject page links to all 12 topics', async ({ page }) => {
    await open(page, SUBJECT);
    const topicLinks = await page.$$eval('a[href]', (anchors) =>
      new Set(anchors.map((a) => a.getAttribute('href') ?? '').filter((h) => /^\/igcse\/chemistry-0620\/[a-z0-9-]+\/$/.test(h))).size,
    );
    expect(topicLinks).toBe(12);
  });

  test('unknown URL serves the 404 page', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist/');
    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('a[href="/"]').first()).toBeVisible();
  });
});

test.describe('dark system scheme', () => {
  test.use({ colorScheme: 'dark' });

  test('theme toggle reports dark as active when following a dark system scheme', async ({ page }) => {
    await open(page, TOPIC);
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.+/);
    await expect(page.locator('button#theme-toggle')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('button#theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('button#theme-toggle')).toHaveAttribute('aria-pressed', 'false');
  });
});

// ---- Topic page behaviour --------------------------------------------------------------------------------
test.describe('topic page', () => {
  test.use({ colorScheme: 'light' });

  test('question cards carry the data contract and nothing is hidden before filtering', async ({ page }) => {
    await open(page, TOPIC);
    const cards = page.locator('article.question');
    const total = await cards.count();
    expect(total).toBeGreaterThan(0);
    await expect(page.locator('article.question[hidden]')).toHaveCount(0);
    const attrs = await cards.evaluateAll((els) =>
      els.map((el) => ({
        id: el.id,
        questionId: el.getAttribute('data-question-id'),
        tier: el.getAttribute('data-tier'),
        type: el.getAttribute('data-type'),
        subtopic: el.getAttribute('data-subtopic'),
        number: el.getAttribute('data-number'),
      })),
    );
    for (const a of attrs) {
      expect(a.id).toMatch(/^q\d+$/);
      expect(a.number).toBe(a.id.slice(1));
      expect(a.questionId).toMatch(/_Q\d+$/);
      expect(['core', 'supplement']).toContain(a.tier);
      expect(['mcq', 'structured']).toContain(a.type);
      expect(a.subtopic).toMatch(/\S/);
    }
    expect(new Set(attrs.map((a) => a.id)).size, 'anchors are unique').toBe(total);
  });

  test('clicking an MCQ option marks the card, gives feedback and opens the answer', async ({ page }) => {
    await open(page, TOPIC);
    const card = page.locator('article.question[data-type="mcq"]').first();
    const options = card.locator('button.option');
    await expect(options).toHaveCount(4);
    for (const letter of ['A', 'B', 'C', 'D']) await expect(card.locator(`button.option[data-letter="${letter}"]`)).toHaveCount(1);
    await expect(options.first()).toHaveAttribute('aria-pressed', 'false');
    await expect(card.locator('div.options[role="group"][aria-labelledby], table.options-table')).toHaveCount(1);

    const toggle = card.locator('button.toggle-answer');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveText(/Show answer/);
    const panel = card.locator('div.answer');
    await expect(panel).toBeHidden();

    await options.first().click();

    await expect(card).toHaveAttribute('data-answered', /^(correct|wrong)$/);
    await expect(options.first()).toHaveAttribute('data-state', /^(correct|wrong)$/);
    await expect(card.locator('button.option[data-state="correct"]')).toHaveCount(1);
    await expect(card.locator('button.option:not([disabled])')).toHaveCount(0);
    const feedback = card.locator('p.feedback[role="status"]');
    await expect(feedback).toHaveText(/\S/);
    await expect(feedback).toHaveText(/^(Correct|Not quite)/);
    await expect(panel).toBeVisible();
    await expect(panel).not.toHaveAttribute('hidden', /.*/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle).toHaveText(/Hide/);

    const score = page.locator('p[data-score][role="status"]');
    await expect(score).toHaveCount(1);
    await expect(score).toHaveText(/\b[01]\s*\/\s*1\b/);
    const first = await score.textContent();

    const retry = card.locator('button.try-again');
    await expect(retry).toBeVisible();
    await retry.click();
    await expect(card).not.toHaveAttribute('data-answered', /.*/);
    await expect(card.locator('button.option[disabled]')).toHaveCount(0);
    await expect(panel).toBeHidden();
    await card.locator('button.option').last().click();
    await expect(score).toHaveText(first ?? '');
  });

  test('a table-shaped MCQ row is one tap target', async ({ page }) => {
    await open(page, TOPIC);
    const rows = page.locator('table.options-table tr.option-row[data-letter]');
    expect(await rows.count(), 'the topic has table-shaped options').toBeGreaterThanOrEqual(4);
    const row = rows.first();
    await expect(row.locator('td').first().locator('button.option')).toHaveCount(1);
    await row.locator('td').last().click();
    await expect(row.locator('button.option')).toHaveAttribute('data-state', /^(correct|wrong)$/);
    // The enclosing card: `{ has: row }` would be re-scoped per article and match every table MCQ.
    const card = row.locator('xpath=ancestor::article[1]');
    await expect(card).toHaveAttribute('data-answered', /^(correct|wrong)$/);
  });

  test('"Show mark scheme" sets aria-expanded and un-hides its aria-controls target', async ({ page }) => {
    await open(page, TOPIC);
    const card = page.locator('article.question[data-type="structured"]').first();
    const number = await card.getAttribute('data-number');
    const button = card.locator('button.toggle-answer');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(button).toHaveText(/Show mark scheme/);
    await expect(button).toHaveAttribute('aria-controls', `q${number}-answer`);
    const panel = page.locator(`#q${number}-answer`);
    await expect(panel).toHaveClass(/\banswer\b/);
    await expect(panel).toBeHidden();

    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(button).toHaveText(/Hide/);
    await expect(panel).toBeVisible();
    await expect(panel.locator('section.markscheme div.ms-part').first()).toBeVisible();
    await expect(panel.locator('li.ms-point').first()).toBeVisible();
    await expect(panel.locator('section.worked-solution')).toHaveCount(1);

    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toBeHidden();
  });

  test('tier filter shows only the chosen tier and updates the count', async ({ page }) => {
    await open(page, TOPIC);
    const cards = page.locator('article.question');
    const total = await cards.count();
    const count = page.locator('div.filters[data-filters] p[data-filter-count][role="status"]');
    await expect(count).toHaveCount(1);
    await expect(count).toContainText(String(total));
    const before = (await count.textContent()) ?? '';

    const core = page.locator('fieldset[data-filter-group="tier"] button[data-filter="tier"][data-value="core"]');
    const all = page.locator('fieldset[data-filter-group="tier"] button[data-filter="tier"][data-value="all"]');
    await expect(all).toHaveAttribute('aria-pressed', 'true');
    await core.click();
    await expect(core).toHaveAttribute('aria-pressed', 'true');
    await expect(all).toHaveAttribute('aria-pressed', 'false');

    const coreTotal = await page.locator('article.question[data-tier="core"]').count();
    expect(coreTotal).toBeGreaterThan(0);
    expect(coreTotal, 'the topic has both tiers, so the filter changes something').toBeLessThan(total);
    await expect(page.locator('article.question:not([hidden])')).toHaveCount(coreTotal);
    await expect(page.locator('article.question:not([hidden])[data-tier="supplement"]')).toHaveCount(0);
    await expect(count).toContainText(String(coreTotal));
    expect(await count.textContent()).not.toBe(before);

    await all.click();
    await expect(all).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('article.question:not([hidden])')).toHaveCount(total);
    await expect(page.locator('article.question[hidden]')).toHaveCount(0);
  });

  test('type filter shows only the chosen type, and combines with the tier filter', async ({ page }) => {
    await open(page, TOPIC);
    const total = await page.locator('article.question').count();
    const mcq = page.locator('fieldset[data-filter-group="type"] button[data-filter="type"][data-value="mcq"]');
    const allTypes = page.locator('fieldset[data-filter-group="type"] button[data-filter="type"][data-value="all"]');
    await expect(allTypes).toHaveAttribute('aria-pressed', 'true');
    await mcq.click();
    await expect(mcq).toHaveAttribute('aria-pressed', 'true');
    const mcqTotal = await page.locator('article.question[data-type="mcq"]').count();
    expect(mcqTotal).toBeGreaterThan(0);
    expect(mcqTotal).toBeLessThan(total);
    await expect(page.locator('article.question:not([hidden])')).toHaveCount(mcqTotal);
    await expect(page.locator('article.question:not([hidden])[data-type="structured"]')).toHaveCount(0);

    await page.locator('button[data-filter="tier"][data-value="supplement"]').click();
    const both = await page.locator('article.question[data-type="mcq"][data-tier="supplement"]').count();
    await expect(page.locator('article.question:not([hidden])')).toHaveCount(both);
    await expect(page.locator('p[data-filter-count]')).toContainText(String(both));

    await allTypes.click();
    await page.locator('button[data-filter="tier"][data-value="all"]').click();
    await expect(page.locator('article.question:not([hidden])')).toHaveCount(total);
  });

  test('subtopic select hides the other subtopics', async ({ page }) => {
    await open(page, TOPIC);
    const total = await page.locator('article.question').count();
    const select = page.locator('div.filters select[data-filter="subtopic"]');
    await expect(select).toHaveCount(1);
    const values = await select.locator('option').evaluateAll((opts) => opts.map((o) => (o as HTMLOptionElement).value));
    expect(values[0]).toBe('all');
    expect(values.length, 'one option per subtopic plus "all"').toBeGreaterThanOrEqual(2);
    const subtopicIds = await page.locator('article.question').evaluateAll((els) => [...new Set(els.map((el) => el.getAttribute('data-subtopic')))]);
    for (const id of subtopicIds) expect(values, `select has an option for subtopic ${id}`).toContain(id);

    const chosen = values[1];
    await select.selectOption(chosen);
    const expected = await page.locator(`article.question[data-subtopic="${chosen}"]`).count();
    expect(expected).toBeGreaterThan(0);
    await expect(page.locator('article.question:not([hidden])')).toHaveCount(expected);
    await expect(page.locator(`article.question:not([hidden]):not([data-subtopic="${chosen}"])`)).toHaveCount(0);
    await expect(page.locator('p[data-filter-count]')).toContainText(String(expected));

    await select.selectOption('all');
    await expect(page.locator('article.question:not([hidden])')).toHaveCount(total);
  });

  test('every report link opens a new tab safely and names its question', async ({ page }) => {
    await open(page, TOPIC);
    const total = await page.locator('article.question').count();
    const links = await page.$$eval('a.report-link', (anchors) =>
      anchors.map((a) => ({
        target: a.getAttribute('target'),
        rel: a.getAttribute('rel') ?? '',
        href: a.getAttribute('href') ?? '',
        questionId: a.closest('article.question')?.getAttribute('data-question-id') ?? '',
        anchor: a.closest('article.question')?.id ?? '',
      })),
    );
    expect(links.length).toBe(total);
    for (const l of links) {
      expect(l.target).toBe('_blank');
      expect(l.rel.split(/\s+/)).toContain('noopener');
      expect(l.href.includes(l.questionId) || l.href.includes(encodeURIComponent(l.questionId)), `${l.href} names ${l.questionId}`).toBe(true);
      expect(l.href.includes(`#${l.anchor}`) || l.href.includes(encodeURIComponent(`#${l.anchor}`)), `${l.href} carries the anchor #${l.anchor}`).toBe(true);
    }
  });

  test('every table is inside .table-scroll and the page has exactly one h1', async ({ page }) => {
    await open(page, TABLE_TOPIC);
    const tables = await page.locator('table').count();
    expect(tables, 'the table-heavy topic renders tables').toBeGreaterThan(0);
    const unwrapped = await page.$$eval('table', (els) => els.filter((t) => !t.closest('.table-scroll')).map((t) => t.outerHTML.slice(0, 120)));
    expect(unwrapped).toEqual([]);
    await expect(page.locator('h1')).toHaveCount(1);
  });

  test('question anchors work as deep links', async ({ page }) => {
    await open(page, TOPIC);
    const second = page.locator('article.question').nth(1);
    const id = await second.getAttribute('id');
    await page.goto(`${TOPIC}#${id}`);
    await expect(page.locator(`article.question#${id}`)).toBeInViewport();
  });
});

// ---- Print pages -----------------------------------------------------------------------------------------
test.describe('print pages', () => {
  test.use({ colorScheme: 'light' });

  test('printable questions: noindex, no interactive options, ruled answer lines', async ({ page }) => {
    const errors = await open(page, PRINT);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('body')).toHaveClass(/\bprint-page\b/);
    await expect(page.locator('button.option')).toHaveCount(0);
    await expect(page.locator('button.toggle-answer')).toHaveCount(0);
    await expect(page.locator('section.markscheme')).toHaveCount(0);
    expect(await page.locator('button').count(), 'at most the one "Print this page" button').toBeLessThanOrEqual(1);
    const lines = page.locator('div.answer-lines[data-lines]');
    expect(await lines.count()).toBeGreaterThan(0);
    const values = await lines.evaluateAll((els) => els.map((el) => el.getAttribute('data-lines')));
    for (const v of values) expect(Number(v)).toBeGreaterThan(0);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(errors).toEqual([]);
  });

  test('printable mark scheme: noindex and no interactive options', async ({ page }) => {
    const errors = await open(page, PRINT_ANSWERS);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('body')).toHaveClass(/\bprint-page\b/);
    await expect(page.locator('button.option')).toHaveCount(0);
    expect(await page.locator('button').count()).toBeLessThanOrEqual(1);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(errors).toEqual([]);
  });
});
