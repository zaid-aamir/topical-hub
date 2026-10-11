/**
 * Site-wide configuration. Everything an owner might need to change lives here.
 *
 * Imported by astro.config.ts (for `site`) and by pages/components.
 * Keep this file free of imports so it can be loaded from the Astro config.
 */

/** Public name of the site. */
export const SITE_NAME = 'Topical Hub';

/**
 * Canonical origin of the deployed site, no trailing slash.
 * Change this once when a custom domain is bought; it feeds `site` in astro.config.ts,
 * the canonical URLs, Open Graph tags, the sitemap and robots.txt.
 */
export const SITE_URL = 'https://topical-hub.pages.dev';

/** One-line description used on the home page and as the default meta description. */
export const SITE_TAGLINE =
  'Free exam-style topical questions for IGCSE Chemistry 0620, with mark schemes and worked solutions';

/** The one subject in v1. URLs leave room for more subjects later. */
export const SUBJECT = {
  /** URL path under which everything for this subject lives (no leading or trailing slash). */
  path: 'igcse/chemistry-0620',
  /** Short name for navigation and titles. */
  shortName: 'IGCSE Chemistry 0620',
  /** Full qualification name. Naming the qualification is fine; never imply endorsement. */
  fullName: 'Cambridge IGCSE Chemistry 0620',
  /** Syllabus years the questions were written for. */
  syllabusYears: '2026–2028',
} as const;

/** Footer sentence, required verbatim on every page. */
export const DISCLAIMER =
  'Topical Hub is independent and is not affiliated with or endorsed by Cambridge University Press & Assessment.';

/**
 * Kill switch for the display-only chemistry formatting (H2SO4 -> H₂SO₄, Cu2+ -> Cu²⁺, cm3 -> cm³).
 * Set to false to serve every formula exactly as the plain text in the source files.
 */
export const CHEM_FORMATTING = true;

/** Public GitHub repository, used for the "Report an error" fallback link. */
export const GITHUB_REPO = 'zaid-aamir/topical-hub';

/**
 * "Report an error" form.
 *
 * Leave REPORT_FORM_URL empty until the owner has created a Google Form. While it is empty,
 * reportErrorUrl() links to a pre-filled new GitHub issue on the public repo instead.
 *
 * To wire up a Google Form:
 *  1. Create the form with two short-answer questions, "Question id" and "Page URL"
 *     (plus whatever else you want, e.g. "What's wrong?").
 *  2. In the form editor open the three-dot menu and choose "Get pre-filled link". Type anything
 *     into the two fields and click "Get link". The copied URL looks like
 *     https://docs.google.com/forms/d/e/<FORM_ID>/viewform?usp=pp_url&entry.111111=foo&entry.222222=bar
 *  3. Set REPORT_FORM_URL to the part before the "?", i.e. ".../viewform".
 *  4. Set REPORT_FORM_FIELDS to the two entry.<number> keys from that URL, in the right roles.
 */
export const REPORT_FORM_URL = '';
export const REPORT_FORM_FIELDS = {
  questionId: 'entry.0000000',
  pageUrl: 'entry.0000000',
} as const;

/**
 * Build the "Report an error" link for one question.
 * @param questionId stable question id, e.g. "T04_20260923_01_Q16"
 * @param pageUrl absolute URL of the question, including its #q<n> anchor
 */
export function reportErrorUrl(questionId: string, pageUrl: string): string {
  if (REPORT_FORM_URL) {
    const params = new URLSearchParams();
    params.set('usp', 'pp_url');
    params.set(REPORT_FORM_FIELDS.questionId, questionId);
    params.set(REPORT_FORM_FIELDS.pageUrl, pageUrl);
    return `${REPORT_FORM_URL}?${params.toString()}`;
  }
  const title = `Error in ${questionId}`;
  const body = `${pageUrl}\n\nWhat's wrong:\n`;
  return `https://github.com/${GITHUB_REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}
