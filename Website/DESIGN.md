# Topical Hub — design plan (v1)

Brief (from BUILD_V1.md §5): *a calm, well-typeset exam booklet that became a fast web app*, not a template. Readability first; one accent colour plus one tier colour; light and dark themes; mobile first; WCAG AA.

## Who and what

Students aged 15–16 revising Cambridge IGCSE Chemistry, mostly on phones, often tired, often cramming. The page's one job: let them read a long question comfortably, attempt it, then compare their answer with the mark scheme. Everything else is secondary.

## The memorable thing (spend boldness once)

The typesetting of a real exam paper, done properly on screen: the question **numeral** set in a serif in the left of the card, the **marks in square brackets** flush right at the end of each part exactly as on a paper, and ruled answer lines in print. No illustrations, no gradients, no shadows, no decorative motion. The only motion is what answers a tap (an answer panel opening, an option marking itself right or wrong).

## Colour

**Teal and coral.** The accent is a deep teal for links, buttons and selected states; coral is kept for one job, marking the higher-tier badge (Cambridge "Extended", Edexcel "Paper 2 only"). Ink is a deep teal-black, and paper is a cool grey-green off-white, deliberately not cream. Ratios are WCAG contrast; every text colour reaches at least 4.5:1 on paper, on surface and on its own soft background.

Light theme

| token | value | use |
|---|---|---|
| `--paper` | `#F5F7F7` | page background |
| `--surface` | `#FFFFFF` | cards, header, inputs |
| `--ink` | `#102224` | text (15.3:1 on paper) |
| `--ink-muted` | `#4E6466` | secondary text (5.9:1 on paper) |
| `--rule` | `#D9E2E2` | borders, table rules |
| `--accent` | `#0F766E` | links, primary buttons, selected states (5.1:1 on paper, 4.8:1 on accent-soft) |
| `--on-accent` | `#FFFFFF` | text on accent (5.5:1) |
| `--accent-soft` | `#DFF3F0` | selected-option background |
| `--ok` | `#2D7C31` | correct (4.8:1 on paper, 4.6:1 on ok-soft) |
| `--ok-soft` | `#E6F4E3` | correct background |
| `--bad` | `#B3261E` | wrong (6.1:1 on paper) |
| `--bad-soft` | `#FBE7E5` | wrong background |
| `--tier` | `#B4441F` | higher-tier badge text (5.2:1 on paper, 4.8:1 on tier-soft) |
| `--tier-soft` | `#FDEBE5` | higher-tier badge background |

Dark theme (follows `prefers-color-scheme`, overridable by the toggle via `html[data-theme]`; dark teal-grey backgrounds, a lighter teal accent and coral tier)

| token | value |
|---|---|
| `--paper` | `#111A1B` |
| `--surface` | `#1A2627` |
| `--ink` | `#E8F1F1` |
| `--ink-muted` | `#A3B9BB` |
| `--rule` | `#2F4042` |
| `--accent` | `#5CCFC3` (8.3:1 on surface) |
| `--on-accent` | `#111A1B` |
| `--accent-soft` | `#173A38` |
| `--ok` | `#6FCF7A` |
| `--ok-soft` | `#1C3320` |
| `--bad` | `#F2867D` |
| `--bad-soft` | `#3D1F1D` |
| `--tier` | `#F59A7A` |
| `--tier-soft` | `#3D2219` |

Coral (`--tier`) and red (`--bad`) are close in hue, so neither relies on colour alone. The tier badge always carries its text ("Extended", "Paper 2 only"). Correct and wrong states always carry a text label ("Correct", "Not quite. The answer is C") and an inline SVG tick or cross. The Core / Paper 1 & 2 badge and sub-topic text stay muted ink. Print stays black and white (print.css).

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
- Buttons: real `<button>`s, min-height 44px, 4px radius, 1px border. "Show answer" / "Show mark scheme" is outlined in accent with a chevron that rotates when open; "Try again" uses the same outline. "Report an error" is a quiet muted link with a small flag icon.
- MCQ options: a vertical stack of full-width option cards (min-height 48px, 6px radius), the letter in a circular badge on the left, text wraps. Hover tints the card accent-soft. After answering, the marked cards carry a status label with a tick or cross ("Correct", "Not quite", "Correct answer"). Table-shaped options render as a table whose each row is one option (the whole row is a tap target), with the letter button as the circular badge.
- Topic-page card head: large numeral, tier badge, marks badge ("4 marks") flush right, sub-topic underneath. Merged topics get an h2 per part ("Part 2  Questions 1–30"); single-part topics have none. Print pages keep the paper-style head with "[n]".
- Answer panel: paper-coloured card with a 4px accent left rule; ALLOW / REJECT / IGNORE / ECF as small outlined tags.
- Focus: `outline: 3px solid var(--accent); outline-offset: 2px`, always visible.
- Motion: none on load. Option state and hover use a 150 ms background transition, the chevron rotates in 150 ms and the answer panel fades in over about 225 ms; all of it is off under `prefers-reduced-motion`.

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
