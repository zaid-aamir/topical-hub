# Topical Hub — design plan (v1)

Brief (from BUILD_V1.md §5): *a calm, well-typeset exam booklet that became a fast web app*, not a template. Readability first; one accent colour; light and dark themes; mobile first; WCAG AA.

## Who and what

Students aged 15–16 revising Cambridge IGCSE Chemistry, mostly on phones, often tired, often cramming. The page's one job: let them read a long question comfortably, attempt it, then compare their answer with the mark scheme. Everything else is secondary.

## The memorable thing (spend boldness once)

The typesetting of a real exam paper, done properly on screen: the question **numeral** set in a serif in the left of the card, the **marks in square brackets** flush right at the end of each part exactly as on a paper, and ruled answer lines in print. No illustrations, no gradients, no shadows, no decorative motion. The only motion is what answers a tap (an answer panel opening, an option marking itself right or wrong).

## Colour

Grounded in the subject: the accent is **copper(II) sulfate blue**, the one colour every chemistry student has seen in a beaker. Ink is a blue-black fountain-pen ink, not a tinted near-black. Paper is a cool off-white, deliberately not cream.

Light theme

| token | value | use |
|---|---|---|
| `--paper` | `#F4F5F2` | page background |
| `--surface` | `#FFFFFF` | cards, header, inputs |
| `--ink` | `#15202B` | text |
| `--ink-muted` | `#526069` | secondary text (6.5:1 on white) |
| `--rule` | `#D5DAD7` | borders, table rules |
| `--accent` | `#16628F` | links, primary buttons, selected states (6.6:1 on white) |
| `--on-accent` | `#FFFFFF` | text on accent |
| `--accent-soft` | `#E3EEF6` | selected-option and Supplement-badge background |
| `--ok` | `#1B7A45` | correct (5.4:1 on white) |
| `--ok-soft` | `#E4F3EA` | correct background |
| `--bad` | `#B42318` | wrong (6.6:1 on white) |
| `--bad-soft` | `#FBE9E7` | wrong background |

Dark theme (follows `prefers-color-scheme`, overridable by the toggle via `html[data-theme]`)

| token | value |
|---|---|
| `--paper` | `#0F161D` |
| `--surface` | `#16202A` |
| `--ink` | `#E7ECF0` |
| `--ink-muted` | `#A7B3BD` |
| `--rule` | `#2C3944` |
| `--accent` | `#7CB9E3` (7.8:1 on surface) |
| `--on-accent` | `#0F161D` |
| `--accent-soft` | `#1D3447` |
| `--ok` | `#5BC98A` |
| `--ok-soft` | `#173426` |
| `--bad` | `#F08A80` |
| `--bad-soft` | `#3D1F1D` |

Correct and wrong states never rely on colour alone: a text label ("Correct", "Not quite. The answer is C") and an inline SVG tick or cross accompany the colour.

## Type

Two families, clearly distinct, both self-hosted through `@fontsource` packages (no third-party requests):

- **Newsreader** (serif, weight 600) for the wordmark, page titles, topic names and the question numerals. It gives the booklet its voice.
- **Source Sans 3** (humanist sans, 400/400 italic/600/700) for everything else: body, options, mark schemes, UI. Humanist sans is what exam papers use for body text and it keeps formulae with sub- and superscripts legible. Use `font-variant-numeric: tabular-nums` in tables.

Scale (ratio about 1.2, body first):

| role | size | notes |
|---|---|---|
| body | `clamp(1.0625rem, 1rem + 0.25vw, 1.125rem)` (17–18 px) | line-height 1.6, measure `max-width: 40rem` (60–75 characters) |
| small | `0.9375rem` | badges, meta, footer |
| h1 | `clamp(1.75rem, 1.4rem + 1.5vw, 2.5rem)` | Newsreader 600, line-height 1.15 |
| h2 | `clamp(1.375rem, 1.2rem + 0.8vw, 1.75rem)` | Newsreader 600 |
| question numeral | `1.5rem` | Newsreader 600, tabular |

Don'ts (these are the tells of a generated page): no all-caps eyebrow labels, no single accented word in a headline, no meta strings joined with middle dots, no arrows appended to links or buttons, no monospace for small labels.

## Layout

Single column, left-aligned, mobile first. Content measure 40rem; the page shell can be wider (max 64rem) for the header and the topic-card grid.

```
┌────────────────────────────────────────────┐
│ Topical Hub            IGCSE Chemistry  [◐] │  header: wordmark, subject link, theme toggle
├────────────────────────────────────────────┤
│ Topic 4                                     │  small muted
│ Electrochemistry                            │  h1 Newsreader
│ 30 questions: 15 multiple choice,           │  plain sentence, no dots
│ 15 structured.                              │
│ Tier     [All] [Core only] [Supplement only]│  filter groups: pill buttons, aria-pressed
│ Type     [All] [Multiple choice] [Structured]│
│ Subtopic [All subtopics            v]        │  native <select>
│ Print the questions   Print the mark scheme │  plain links
├────────────────────────────────────────────┤
│ 16   Supplement   Electrolysis         [6]  │  card head: numeral, tier badge, subtopic, marks
│ Question text ..............................│
│ ┌───────────── table scrolls ─────────────┐ │
│ (a) ...................................[2]  │
│ (b) ...................................[4]  │
│ [Show mark scheme]          Report an error │  44 px buttons; report link opens new tab
│ ┌ mark scheme panel (hidden until opened) ┐ │
└────────────────────────────────────────────┘
```

- Cards: `--surface` background, 1px `--rule` border, 6px radius, no shadow. Padding 1rem on phones, 1.5rem from 40rem up.
- Tables: wrapped in `.table-scroll` (`overflow-x: auto`), never wider than the card, never cause page scroll at 360 px.
- Buttons: real `<button>`s, min-height 44px, 4px radius, 1px border; the primary ("Show mark scheme") is outlined in accent, filled accent when active.
- MCQ options: a vertical stack of full-width buttons; letter in a fixed-width slot, text wraps. Table-shaped options render as a table whose each row is one option (the whole row is a tap target).
- Focus: `outline: 3px solid var(--accent); outline-offset: 2px`, always visible.
- Motion: none on load. Panels open instantly; `prefers-reduced-motion` respected for the one 150 ms background transition on option state.

## Navigation and page structure

The home page lists subject cards under `#subjects`; Chemistry is the only enabled subject. Topic cards live on the Chemistry subject page. Counts come from content at build time. The home title is larger than the shared h1 scale (`clamp(2.25rem, 1.75rem + 2.4vw, 3.25rem)`).

The header links to `/#subjects` and `/about/`, with `aria-current="page"` on the current link. Shared CSS keeps the navigation on one row at narrow widths. The footer has the independence disclaimer, About, Privacy, source code and `v<version>` from `package.json`. Topic pages link to both print views and both PDF downloads, including file sizes.

## Print

A4, 18 mm margins. Hide header, footer, filters, buttons and report links. Topic title on the first page only. Each question `break-inside: avoid`. Under every structured part or sub-part, ruled answer lines: 2 lines per mark, minimum 2, 9 mm apart, light grey. MCQs get no lines (answer circled on the paper). The mark-scheme print page lists every question's answer, points and worked solution with the same numbering.

## Review against the generic defaults

- Not cream paper with a terracotta accent; not near-black with acid green; not a hairline broadsheet; not the SaaS card kit (no shadows, no gradient washes, one radius for one purpose).
- Structure encodes information: numerals because questions are numbered on the paper, brackets because marks are shown in brackets, badges only for Core/Supplement because that is a real distinction students filter on.
- The risk taken is restraint: the page should look like it was set by a typesetter, not a theme.

Print pages and downloadable PDFs include a repeating site-name and canonical-host watermark. The normal site footer remains on screen in print previews and is hidden on paper. Regenerate the PDFs if a layout or style change affects printed output, even when the input hash does not change.
