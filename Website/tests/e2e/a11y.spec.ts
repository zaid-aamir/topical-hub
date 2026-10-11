/**
 * Accessibility scans with axe-core (WCAG 2.1 A and AA rules) in light and dark schemes.
 * A serious or critical violation fails the test; every violation found is printed in the message.
 */
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

const SUBJECT = '/igcse/chemistry-0620/';
const TOPIC = `${SUBJECT}states-of-matter/`;
const PAGES = [
  { slug: 'home', path: '/' },
  { slug: 'subject', path: SUBJECT },
  { slug: 'topic states-of-matter', path: TOPIC },
  { slug: 'print states-of-matter', path: `${TOPIC}print/` },
] as const;
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

type Violations = Awaited<ReturnType<AxeBuilder['analyze']>>['violations'];

function describeViolations(violations: Violations): string {
  if (violations.length === 0) return 'no violations';
  return violations
    .map((v) => {
      const nodes = v.nodes
        .slice(0, 8)
        .map((n) => `      - ${n.target.join(' ')}${n.failureSummary ? `\n        ${n.failureSummary.replace(/\n/g, '\n        ')}` : ''}`)
        .join('\n');
      const more = v.nodes.length > 8 ? `\n      ... ${v.nodes.length - 8} more node(s)` : '';
      return `  [${v.impact ?? 'n/a'}] ${v.id}: ${v.help}\n    ${v.helpUrl}\n${nodes}${more}`;
    })
    .join('\n');
}

async function expectNoSeriousViolations(violations: Violations, label: string): Promise<void> {
  const blocking = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  const report = describeViolations(violations);
  if (violations.length) test.info().annotations.push({ type: 'axe', description: `${label}\n${report}` });
  expect(
    blocking.map((v) => `${v.impact}: ${v.id}`),
    `${label}: ${blocking.length} serious/critical of ${violations.length} violation(s)\n${report}`,
  ).toEqual([]);
}

for (const theme of ['light', 'dark'] as const) {
  test.describe(`axe ${theme}`, () => {
    test.use({ colorScheme: theme });

    for (const p of PAGES) {
      test(`${p.slug}: no serious or critical WCAG 2.1 AA violations`, async ({ page }) => {
        const response = await page.goto(p.path);
        expect(response?.status()).toBe(200);
        await page.evaluate(() => document.fonts.ready);
        const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
        await expectNoSeriousViolations(results.violations, `${p.path} (${theme})`);
      });
    }

    test('topic page with an answered MCQ and an open mark scheme: no serious or critical violations', async ({ page }) => {
      const response = await page.goto(TOPIC);
      expect(response?.status()).toBe(200);
      await page.locator('article.question[data-type="mcq"] button.option').first().click();
      await page.locator('article.question[data-type="structured"] button.toggle-answer').first().click();
      await expect(page.locator('article.question[data-type="structured"] button.toggle-answer').first()).toHaveAttribute('aria-expanded', 'true');
      const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      await expectNoSeriousViolations(results.violations, `${TOPIC} after interaction (${theme})`);
    });
  });
}
