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
 * Google Search Console HTML-tag verification code (the `content` value only).
 * BaseLayout prints <meta name="google-site-verification"> on every page while this is non-empty.
 */
export const GOOGLE_SITE_VERIFICATION = 'v7HFbGLAKvPVb_B4t7tf4rHXXex1bq5vb43mC3LA4_4';

/** Exam board of a subject. The home page groups subject cards by board. */
export type Board = 'cambridge' | 'edexcel';

/** Heading for each board's group of subject cards, in the order the home page shows them. */
export const BOARDS: readonly { readonly board: Board; readonly name: string }[] = [
  { board: 'cambridge', name: 'Cambridge IGCSE' },
  { board: 'edexcel', name: 'Pearson Edexcel International GCSE' },
];

/** The tier values in the content files (same as Tier in src/content/types.ts; config.ts has no imports). */
export type TierValue = 'core' | 'supplement';

/**
 * How a subject names its tiers. The data is always core | supplement; this is the student-facing
 * wording for badges, the tier filter and the copy that describes them.
 */
export interface TierWording {
  /** Badge text per tier. */
  readonly badge: Readonly<Record<TierValue, string>>;
  /** Badge tooltip and screen-reader text, only where the badge text needs explaining. */
  readonly badgeTitle: Readonly<Partial<Record<TierValue, string>>>;
  /** Tier filter buttons in order. The first must be 'all': it is the default the script starts from. */
  readonly filters: readonly { readonly value: 'all' | TierValue; readonly label: string }[];
  /** One-line explanation under the topic-page filters. */
  readonly hint: string;
  /** Ends "On a topic page you can filter by …": what the tier filter filters by. */
  readonly filterBy: string;
  /** Ends "Free, with …" in the subject page's meta description. */
  readonly filterSummary: string;
}

/** Cambridge: students think in Core / Extended tiers; Supplement content is Extended only. */
export const CAMBRIDGE_TIERS: TierWording = {
  badge: { core: 'Core', supplement: 'Extended' },
  badgeTitle: { supplement: 'Supplement content: Extended tier only' },
  filters: [
    { value: 'all', label: 'Extended' },
    { value: 'core', label: 'Core' },
    { value: 'supplement', label: 'Extended content only' },
  ],
  hint:
    'Core questions are for everyone. Extended questions use Supplement content and are only for students taking the Extended papers (Papers 2 and 4).',
  filterBy: 'Core or Extended tier',
  filterSummary: 'Core and Extended filters',
};

/** Edexcel International GCSE is untiered: core content is on both papers, supplement (bold) on Paper 2 only. */
export const EDEXCEL_TIERS: TierWording = {
  badge: { core: 'Paper 1 & 2', supplement: 'Paper 2 only' },
  badgeTitle: { supplement: 'Paper 2 only: bold content in the specification' },
  filters: [
    { value: 'all', label: 'All questions' },
    { value: 'core', label: 'Paper 1 content' },
  ],
  hint:
    'Paper 1 & 2 questions use content examined on both papers. Paper 2 only questions use the bold content in the specification, which is examined only on Paper 2.',
  filterBy: 'paper',
  filterSummary: 'Paper 1 and Paper 2 filters',
};

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
  /** Exam board, for grouping on the home page. */
  readonly board: Board;
  /**
   * Which syllabus the questions were written for. Cambridge: the exam years ("2026–2028"), printed
   * as "syllabus for exams in 2026–2028". Edexcel: the whole phrase ("current specification (Issue 4)").
   * Print it through syllabusPhrase(), never directly.
   */
  readonly syllabusYears: string;
  /** Badge, filter and hint wording for the tiers. */
  readonly tiers: TierWording;
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
  /**
   * Topics too big for one page: topic_id -> { part -> page title }. A listed topic becomes one page
   * per part (slug from the title, PDFs named from it) instead of one merged page; every part of the
   * topic must be listed. Topics not listed keep one page.
   */
  readonly splitPages?: Readonly<Record<string, Readonly<Record<number, string>>>>;
}

export const CHEMISTRY_0620: Subject = {
  path: 'igcse/chemistry-0620',
  shortName: 'IGCSE Chemistry 0620',
  fullName: 'Cambridge IGCSE Chemistry 0620',
  board: 'cambridge',
  tiers: CAMBRIDGE_TIERS,
  syllabusYears: '2026–2028',
  description: 'Multiple-choice and structured questions on every topic of the syllabus, each tagged Core or Extended.',
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
  board: 'cambridge',
  tiers: CAMBRIDGE_TIERS,
  syllabusYears: '2026–2028',
  description: 'Original multiple-choice and structured questions across all 21 topics, tagged Core or Extended.',
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
  board: 'cambridge',
  tiers: CAMBRIDGE_TIERS,
  syllabusYears: '2026–2028',
  description: 'Original multiple-choice and structured questions on every topic of the syllabus, tagged Core or Extended.',
  contentSubpath: 'question-pipeline/subjects/0625-physics/batches/04_approved',
  contentDirEnv: 'PHYSICS_CONTENT_DIR',
  batchPrefix: '0625_',
  anchor: 'id',
  chemFormatting: false,
  powerFormatting: true,
};

export const EDEXCEL_PHYSICS_4PH1: Subject = {
  path: 'igcse/edexcel-physics-4ph1',
  shortName: 'Edexcel IGCSE Physics 4PH1',
  fullName: 'Pearson Edexcel International GCSE Physics (4PH1)',
  board: 'edexcel',
  tiers: EDEXCEL_TIERS,
  syllabusYears: 'current specification (Issue 4)',
  description: 'Original multiple-choice and structured questions on all 8 topics, labelled Paper 1 & 2 or Paper 2 only.',
  contentSubpath: 'question-pipeline/subjects/4ph1-physics/batches/04_approved',
  contentDirEnv: 'EDEXCEL_PHYSICS_CONTENT_DIR',
  batchPrefix: '4PH1_',
  anchor: 'id',
  chemFormatting: false,
  powerFormatting: true,
};

export const EDEXCEL_BIOLOGY_4BI1: Subject = {
  path: 'igcse/edexcel-biology-4bi1',
  shortName: 'Edexcel IGCSE Biology 4BI1',
  fullName: 'Pearson Edexcel International GCSE Biology (4BI1)',
  board: 'edexcel',
  tiers: EDEXCEL_TIERS,
  syllabusYears: 'current specification (Issue 3)',
  description: 'Original multiple-choice and structured questions on all 5 topics, labelled Paper 1 & 2 or Paper 2 only.',
  contentSubpath: 'question-pipeline/subjects/4bi1-biology/batches/04_approved',
  contentDirEnv: 'EDEXCEL_BIOLOGY_CONTENT_DIR',
  batchPrefix: '4BI1_',
  anchor: 'id',
  chemFormatting: false,
  powerFormatting: true,
  splitPages: {
    '2': {
      1: 'Cells, biological molecules and movement of substances',
      2: 'Nutrition',
      3: 'Respiration and gas exchange',
      4: 'Transport',
      5: 'Excretion',
      6: 'Co-ordination and response',
    },
    '3': { 1: 'Reproduction', 2: 'Inheritance' },
  },
};

export const EDEXCEL_CHEMISTRY_4CH1: Subject = {
  path: 'igcse/edexcel-chemistry-4ch1',
  shortName: 'Edexcel IGCSE Chemistry 4CH1',
  fullName: 'Pearson Edexcel International GCSE Chemistry (4CH1)',
  board: 'edexcel',
  tiers: EDEXCEL_TIERS,
  syllabusYears: 'current specification (Issue 3)',
  description: 'Original multiple-choice and structured questions on all 4 topics, labelled Paper 1 & 2 or Paper 2 only.',
  contentSubpath: 'question-pipeline/subjects/4ch1-chemistry/batches/04_approved',
  contentDirEnv: 'EDEXCEL_CHEMISTRY_CONTENT_DIR',
  batchPrefix: '4CH1_',
  anchor: 'id',
  chemFormatting: true,
  // The sources write units and charges with a caret: cm^3, Cu^2+, SO4^2–, e^–.
  powerFormatting: true,
  splitPages: {
    '1': {
      1: 'States of matter, atoms and the Periodic Table',
      2: 'Formulae, calculations and ionic bonding',
      3: 'Covalent and metallic bonding, and electrolysis',
    },
    '2': { 1: 'Groups 1 and 7, gases in the atmosphere and reactivity', 2: 'Metals, acids, salts and chemical tests' },
    '4': { 1: 'Crude oil, alkanes and alkenes', 2: 'Alcohols, carboxylic acids, esters and polymers' },
  },
};

/** Every subject, in the order the home page lists them (grouped by BOARDS there). */
export const SUBJECTS: readonly Subject[] = [
  CHEMISTRY_0620,
  BIOLOGY_0610,
  PHYSICS_0625,
  EDEXCEL_PHYSICS_4PH1,
  EDEXCEL_BIOLOGY_4BI1,
  EDEXCEL_CHEMISTRY_4CH1,
];

/** "syllabus for exams in 2026–2028" (Cambridge) or "current specification (Issue 4)" (Edexcel), lower case. */
export function syllabusPhrase(subject: Subject): string {
  return subject.board === 'cambridge' ? `syllabus for exams in ${subject.syllabusYears}` : subject.syllabusYears;
}

/** The subject when SUBJECTS has exactly one entry, else undefined. Home-page copy names it while it exists. */
export const SOLE_SUBJECT: Subject | undefined = SUBJECTS.length === 1 ? SUBJECTS[0] : undefined;

/**
 * One-line description for the home page and its meta description. It names the subject while
 * there is only one (better for search) and becomes generic once there are more.
 */
export const SITE_TAGLINE = SOLE_SUBJECT
  ? `Free exam-style topical questions for ${SOLE_SUBJECT.shortName}, with mark schemes and worked solutions`
  : 'Free exam-style topical questions for Cambridge IGCSE and Pearson Edexcel International GCSE, with mark schemes and worked solutions';

/** Footer sentence, required verbatim on every page. */
export const DISCLAIMER =
  'Topical Hub is independent and is not affiliated with or endorsed by Cambridge University Press & Assessment or Pearson Education.';

/**
 * Kill switch for the display-only chemistry formatting (H2SO4 -> H₂SO₄, Cu2+ -> Cu²⁺, cm3 -> cm³)
 * of every subject with chemFormatting. Set to false to serve every formula exactly as the plain
 * text in the source files.
 */
export const CHEM_FORMATTING = true;

/**
 * "Report an error" form.
 *
 * While REPORT_FORM_URL is empty, reportErrorUrl() returns null and no Report an error link is
 * rendered.
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
export const REPORT_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeTEt18tIlRSwIizd27aB8DwPJey_roqdKdbAVHeZEpPMsqLA/viewform';
export const REPORT_FORM_FIELDS = {
  questionId: 'entry.472826419',
  pageUrl: 'entry.1645860244',
} as const;

/**
 * Build the pre-filled "Report an error" form link for one question, or null when no form is set.
 * @param questionId stable question id, e.g. "T04_20260923_01_Q16"
 * @param pageUrl absolute URL of the question, including its #q<n> anchor
 */
export function reportErrorUrl(questionId: string, pageUrl: string): string | null {
  if (!REPORT_FORM_URL) return null;
  const params = new URLSearchParams();
  params.set('usp', 'pp_url');
  params.set(REPORT_FORM_FIELDS.questionId, questionId);
  params.set(REPORT_FORM_FIELDS.pageUrl, pageUrl);
  return `${REPORT_FORM_URL}?${params.toString()}`;
}
