# Topical Hub (website)

Topical Hub is a free static website of **original, exam-style topical practice questions** for Cambridge IGCSE Chemistry 0620 (syllabus for exams in 2026–2028), with mark schemes and worked solutions. There are 12 topics with 30 questions each: 180 multiple-choice and 180 structured questions, each tagged Core or Supplement and by sub-topic.

The questions were written and checked with AI tools and are not from any examination board. Topical Hub is independent and is not affiliated with or endorsed by Cambridge University Press & Assessment. Anything that looks wrong can be reported from the "Report an error" link under every question.

Live site: <https://topical-hub.pages.dev> (deployment steps in `DEPLOY.md`).

## Run it locally (Windows PowerShell)

Requires Node 24 (see `.nvmrc`; Node 22.12 or later works) and npm.

```powershell
cd Website
npm install
npm run dev
```

Open the URL that `astro dev` prints (normally <http://localhost:4321/>). Pages reload as you edit. The dev server reads the question content from `../igcse-chem-pipeline/pipeline/04_approved/`, so the whole repository must be cloned, not just `Website/`.

To test the production build locally:

```powershell
npm run build
npm run preview
```

and open <http://127.0.0.1:4321/>.

## npm scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the Astro dev server with live reload. |
| `npm run build` | Production build into `dist/`: `astro build` (which loads and validates all content, failing on any contract violation) followed by `node scripts/check-dist.mjs`, the post-build gate described below. This is the command Cloudflare Pages runs. |
| `npm run preview` | Serve the built `dist/` on <http://127.0.0.1:4321/>, exactly as it will be deployed. Used by the Playwright tests. |
| `npm run check` | `astro check`: type-checks the `.astro` components and TypeScript. |
| `npm test` | Run the Vitest unit tests once (parser, chemistry formatting, Markdown rendering, the post-build checker, the render audit). |
| `npm run test:watch` | Vitest in watch mode. |
| `npm run test:e2e` | Playwright browser tests in Chromium against the preview server (run `npm run build` first; the first time also run `npx playwright install chromium`). Writes screenshots to `test-results/screenshots/`. |
| `npm run audit:render` | Compare every source question and mark scheme with the built pages word by word; see "Guards" below. Options: `-- --topic T04`, `-- --json`. |

## Folder map

```
Website/
  astro.config.ts        Astro config; `site` comes from src/config.ts; sitemap integration
  playwright.config.ts   Playwright: tests/e2e, preview server on 127.0.0.1:4321
  vitest.config.ts       Vitest: tests/unit/**/*.test.ts
  tsconfig.json          TypeScript strict
  BUILD_V1.md            the build plan for v1
  CONTRACT.md            module ownership, URLs, DOM contract, decisions
  DESIGN.md              the visual design plan (colour, type, layout, print)
  DEPLOY.md              click-by-click Cloudflare Pages deployment
  public/                static files copied as-is (favicon)
  scripts/
    check-dist.mjs       post-build gate over dist/ (labelling, links, anchors, h1, lang, noindex, external requests, sitemap)
    audit-render.mjs     per-topic render audit: source words vs built pages
  src/
    config.ts            SITE_NAME, SITE_URL, disclaimer, CHEM_FORMATTING switch, "Report an error" form settings
    content/             content loader: parses questions.md and markscheme.md, validates, exposes Topic[] (types.ts is the data model)
    lib/markdown.ts      Markdown to HTML with raw HTML escaped, tables wrapped for horizontal scrolling
    lib/chem/            display-only chemistry formatting (H2SO4 -> H₂SO₄), pure and unit-tested
    layouts/             BaseLayout: head, skip link, header, footer with disclaimer
    components/          header, footer, theme toggle, question card, options, mark scheme, answer panel
    pages/               routes: index, about, privacy, 404, robots.txt, igcse/chemistry-0620/[slug]/ (+ print, print-answers)
    styles/              tokens.css (light and dark), global.css, print.css
  tests/
    unit/                Vitest tests
    e2e/                 Playwright specs: site.spec.ts (behaviour, screenshots), a11y.spec.ts (axe)
  dist/                  build output (gitignored)
  test-results/          Playwright output and screenshots (gitignored)
```

## Where the content comes from

The questions live outside this folder in `../igcse-chem-pipeline/pipeline/04_approved/`, one folder per topic (`T01_…` to `T12_…`), each with a `questions.md` and a `markscheme.md`. The website reads **only those two files per topic, at build time**, and treats the whole pipeline folder as read-only: nothing in the site ever writes there, and the site code must not be used to "fix" content. Questions and mark schemes are matched by their `## Q<n>` headings (numbering can have gaps), and every question keeps its stable `id` (for example `T04_20260923_01_Q16`), its sub-topic id and its tier, so pages can be reorganised later without touching the content.

If a question is wrong, the owner edits the source file in the pipeline folder; the next build picks it up.

## Guards: build-time validation and post-build checks

Three layers make sure the published site matches the content and keeps its honest labelling.

1. **Build-time validation (`src/content/`)**. While `astro build` loads the content it checks that there are 12 topics and 360 questions, that every question has exactly one mark scheme entry and vice versa, that every MCQ has options A–D and an answer in A–D, that structured part marks add up to the question's marks, that every question has a worked solution or rationale, and that no question needing a diagram is published. Any violation throws and the build fails, so a broken content file can never produce a half-built site. The unit tests load the real content and assert the same numbers.

2. **Post-build gate (`scripts/check-dist.mjs`)**. After the HTML exists, this script walks `dist/` and fails the build if:
   - the phrase that must never describe this site (anything matching `past[\s-]*papers?`, in any case) appears anywhere in the output other than the one sentence on the About page that says what the questions are *not*;
   - any internal link, image, script or stylesheet points at a file that does not exist, or any `#anchor` points at an id that does not exist in its target page;
   - any page has more or fewer than one `<h1>`, or lacks `<html lang="en">`;
   - a print page lacks `<meta name="robots" content="noindex">`;
   - any resource (script, stylesheet, font, image, CSS `url()`) would be fetched from another origin, which would break the no-third-party-requests rule;
   - the sitemap lists a URL that does not exist, is on the wrong origin or is a print page, or `robots.txt` does not link an existing sitemap.
   It prints a summary (files, links, anchors and resources checked) and exits 1 with the list of failures. `tests/unit/check-dist.test.ts` runs it against fake sites with a deliberate banned phrase and a broken link to prove both are caught.

3. **Render audit (`scripts/audit-render.mjs`, `npm run audit:render`)**. A report rather than a gate: for each topic it tokenises the source question and mark scheme text and the text of the built topic page, print page and mark-scheme print page (mapping the display-only sub- and superscripts back to plain text), then lists, per question id, any source words missing from the page, whether the MCQ answer letter in the page matches the source, whether all four options, all mark-scheme parts and the worked solution are present, and whether the question's article exists at all. It exits non-zero only when an article or page is missing. Known benign misses are documented at the top of the script.

On top of these, `npm run test:e2e` drives the built site in Chromium: screenshots at 360 px and 1280 px in light and dark, no horizontal scroll at 360 px, no console errors, MCQ and mark-scheme interactions, filters, theme toggle, report links, print pages, and axe accessibility scans (WCAG 2.1 AA; serious or critical violations fail).
