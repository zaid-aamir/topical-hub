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

/**
 * One subject: a qualification with its own topics, everything under /<path>/, and its content
 * source. Adding a subject is one entry in SUBJECTS below: the loader, the pages, the PDFs and
 * the build checks all loop over that list.
 */
export interface Subject {
  /** URL path under which everything for this subject lives (no leading or trailing slash). */
  readonly path: string;
  /** Short name for navigation, breadcrumbs and titles. */
  readonly shortName: string;
  /** Full qualification name. Naming the qualification is fine; never imply endorsement. */
  readonly fullName: string;
  /** Syllabus years the questions were written for. */
  readonly syllabusYears: string;
  /** One sentence for the subject's card on the home page. */
  readonly description: string;
  /** Approved content folder, relative to the repository root. Only questions.md and markscheme.md are read. */
  readonly contentSubpath: string;
  /** Environment variable that overrides the content folder (absolute, or relative to the current directory). */
  readonly contentDirEnv: string;
  /** What comes before "T<NN>_" in a batch folder name and batch_id ('' for Chemistry, '0625_' for Physics). */
  readonly batchPrefix: string;
  /** Question anchors: 'number' gives #q<n> (Chemistry, kept for existing links), 'id' the full source id. */
  readonly anchor: 'number' | 'id';
  /** Display-only chemistry formatting (H2SO4 -> H₂SO₄). Also gated by CHEM_FORMATTING. */
  readonly chemFormatting: boolean;
  /** Display-only power notation: "^" + optional minus + digits becomes a superscript (m^3 -> m³). */
  readonly powerFormatting: boolean;
}

export const CHEMISTRY_0620: Subject = {
  path: 'igcse/chemistry-0620',
  shortName: 'IGCSE Chemistry 0620',
  fullName: 'Cambridge IGCSE Chemistry 0620',
  syllabusYears: '2026–2028',
  description: 'Multiple-choice and structured questions on every topic of the syllabus, each tagged Core or Supplement.',
  contentSubpath: 'igcse-chem-pipeline/pipeline/04_approved',
  contentDirEnv: 'CONTENT_DIR',
  batchPrefix: '',
  anchor: 'number',
  chemFormatting: true,
  powerFormatting: false,
};

export const BIOLOGY_0610: Subject = {
  path: 'igcse/biology-0610',
  shortName: 'IGCSE Biology 0610',
  fullName: 'Cambridge IGCSE Biology 0610',
  syllabusYears: '2026–2028',
  description: 'Original multiple-choice and structured questions across all 21 topics, tagged Core or Supplement.',
  contentSubpath: 'question-pipeline/subjects/0610-biology/batches/04_approved',
  contentDirEnv: 'BIOLOGY_CONTENT_DIR',
  batchPrefix: '0610_',
  anchor: 'id',
  chemFormatting: false,
  powerFormatting: true,
};

export const PHYSICS_0625: Subject = {
  path: 'igcse/physics-0625',
  shortName: 'IGCSE Physics 0625',
  fullName: 'Cambridge IGCSE Physics 0625',
  syllabusYears: '2026–2028',
  description: 'Original multiple-choice and structured questions on every topic of the syllabus, tagged Core or Supplement.',
  contentSubpath: 'question-pipeline/subjects/0625-physics/batches/04_approved',
  contentDirEnv: 'PHYSICS_CONTENT_DIR',
  batchPrefix: '0625_',
  anchor: 'id',
  chemFormatting: false,
  powerFormatting: true,
};

/** Every subject, in the order the home page lists them. */
export const SUBJECTS: readonly Subject[] = [CHEMISTRY_0620, BIOLOGY_0610, PHYSICS_0625];

/** The subject when SUBJECTS has exactly one entry, else undefined. Home-page copy names it while it exists. */
export const SOLE_SUBJECT: Subject | undefined = SUBJECTS.length === 1 ? SUBJECTS[0] : undefined;

/**
 * One-line description for the home page and its meta description. It names the subject while
 * there is only one (better for search) and becomes generic once there are more.
 */
export const SITE_TAGLINE = SOLE_SUBJECT
  ? `Free exam-style topical questions for ${SOLE_SUBJECT.shortName}, with mark schemes and worked solutions`
  : 'Free exam-style topical questions with mark schemes and worked solutions';

/** Footer sentence, required verbatim on every page. */
export const DISCLAIMER =
  'Topical Hub is independent and is not affiliated with or endorsed by Cambridge University Press & Assessment.';

/**
 * Kill switch for the display-only chemistry formatting (H2SO4 -> H₂SO₄, Cu2+ -> Cu²⁺, cm3 -> cm³)
 * of every subject with chemFormatting. Set to false to serve every formula exactly as the plain
 * text in the source files.
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
