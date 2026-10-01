# Story 001 — Application Shell and Header — Implementation Report

## Implementation Summary

Implemented the application shell: a central MUI theme sourced from
`docs/COLOR_PALETTE.md`, a full-page background, a responsive
centered/width-constrained page container, and an `AppHeader` component
rendering the pizza emoji icon/branding element, the title "Pizza Dough
Calculator", and the subtitle "Baker's percentages for home & professional
use". The header is left-aligned at wider viewports (per
`docs/designs/desktop-pizza-layout.png`) and centered at narrower viewports
(per `docs/designs/mobile-layout.png`), using MUI's default `sm` breakpoint.
No Pizza Settings, Dough Ball, Recipe Summary, or Ingredients UI was
introduced. The removed Vite-template CSS (`App.css`/`index.css`) was
deleted because it hardcoded a fixed-width `#root` and a white background
that directly conflicted with the required full-page background token and
responsive, width-constrained container; MUI's `CssBaseline` plus the new
theme now own global background/reset styling.

## Files Changed

- `src/theme.ts` (new) — single MUI theme definition mapping
  `docs/COLOR_PALETTE.md` tokens (page background, card/paper, primary,
  primary dark, text high/low emphasis, divider) to the MUI palette, plus a
  `pizzaIconBackground` constant (documented "Primary tint" overlay) for the
  icon badge.
- `src/components/AppHeader.tsx` (new) — renders the pizza emoji icon,
  title, and subtitle using the styled components from
  `AppHeader.styled.tsx`; colors consumed from the theme
  (`text.secondary` for the subtitle; title inherits `text.primary` via
  `CssBaseline`'s body color).
- `src/components/AppHeader.styled.tsx` (new) — `styled()` components
  (`HeaderRoot`, `TitleRow`, `IconBadge`, `Title`, `Subtitle`) used by
  `AppHeader.tsx`, per `docs/CODING_STANDARDS.md` §9.
- `src/App.tsx` (modified) — replaced the placeholder welcome text with the
  `Background`/`AppContainer` styled components and `AppHeader`.
- `src/App.styled.tsx` (new) — `styled()` components (`Background`,
  `AppContainer`) used by `App.tsx`, per `docs/CODING_STANDARDS.md` §9.
- `src/main.tsx` (modified) — wraps `App` in MUI `ThemeProvider` (the new
  `theme`) and `CssBaseline`; removed the `index.css` import.
- `src/App.css`, `src/index.css` (deleted) — unused Vite-template styles
  that hardcoded a fixed-width `#root`, a white background, and template
  heading/color rules conflicting with the themed, responsive shell.
- `tsconfig.node.json` (modified) — added `"DOM"` to `lib` so the `e2e/`
  Playwright specs (which already type-check against `document`/
  `getComputedStyle` per `docs/TESTING.md` §17) compile under `tsc -b`.
- `vite.config.ts` (modified) — excluded `e2e/**` from Vitest's test
  discovery (Vitest's default include pattern also matches `*.spec.ts`,
  which collided with the Playwright specs) and added `configDefaults` to
  preserve the standard excludes.
- `src/test/setup.ts` (modified) — added a global
  `afterEach(() => cleanup())` for React Testing Library. This is the first
  component-test suite in the repository; without `test.globals` enabled
  (per `docs/TESTING.md` §2), RTL's automatic cleanup never registers, so
  every test file previously would have leaked DOM between tests.

## Tests

- `src/theme.test.ts` (new) — plain-value diff of `theme.palette.*` and
  `pizzaIconBackground` against the exact tokens in
  `docs/COLOR_PALETTE.md` (Testing §17 tier 1: theme-token diff).
- `src/components/AppHeader.test.tsx` (new) — RTL tests asserting the title
  heading, subtitle text, and pizza emoji render.
- `src/App.test.tsx` (new) — RTL tests asserting the header content renders
  at the `App` level, and that no Pizza Settings/Dough Ball/Recipe
  Summary/Ingredients text is present (AC-001-07).
- `e2e/app-shell.spec.ts` (new; updated in rework) — Playwright spot-checks
  (Testing §17 tier 2) asserting: (1) the rendered `document.body`
  background color equals `rgb(245, 240, 232)` (`#F5F0E8`), and (2) the
  title renders in `rgb(44, 31, 20)` (`#2C1F14`, high emphasis) while the
  subtitle renders in `rgb(122, 100, 85)` (`#7A6455`, low emphasis) —
  added during rework to close the AC-001-10 verification gap (see Rework
  History).

## Verification

- `npm run lint` — passed, no errors.
- `npm run build` (`tsc -b && vite build`) — passed, no type errors.
- `npm run test:run` — 3 test files, 10 tests passed.
- `npm run test:e2e` — 2 tests passed.

## Acceptance Criteria Addressed

- AC-001-01 — Title renders via `AppHeader`; verified by RTL test.
- AC-001-02 — Subtitle renders via `AppHeader`; verified by RTL test.
- AC-001-03 — Pizza emoji renders adjacent to the title; verified by RTL
  test.
- AC-001-04 — `Container maxWidth="lg"` centers/width-constrains the page
  at wider viewports.
- AC-001-05 — Header switches to centered alignment at `xs` (narrower)
  viewports while retaining icon/title/subtitle; no clipping/overlap in
  markup (manual breakpoint review of `sx` values).
- AC-001-06 — Full-page background `Box` with `bgcolor: "background.default"`
  behind the header; verified by Playwright spec.
- AC-001-07 — No out-of-scope sections rendered; verified by `App.test.tsx`.
- AC-001-08 — Single responsive breakpoint (`sm`) preserves icon → title →
  subtitle order at both sizes; `Container` prevents horizontal overflow.
- AC-001-09 — Page background is `#F5F0E8` from the shared theme, not a
  component-local hex value; verified by `theme.test.ts` and the Playwright
  spec.
- AC-001-10 — Title inherits `text.primary` (`#2C1F14`) via `CssBaseline`;
  subtitle's `Subtitle` styled component sets `color:
  theme.palette.text.secondary` (`#7A6455`) directly, rather than via a
  `Typography` `color` prop; verified by `theme.test.ts` (token values)
  and by the `e2e/app-shell.spec.ts` rendered-color spot-check added in
  rework (title `rgb(44, 31, 20)`, subtitle `rgb(122, 100, 85)`).
- AC-001-11 — No new runtime dependency added to `package.json`.
- AC-001-12 — Icon implemented as the literal pizza emoji (🍕) in a `Box`,
  not SVG/image/icon-font.

## Known Issues / Remaining Concerns for QA

- The responsive breakpoint chosen is MUI's default `sm` (600px); no
  specific pixel breakpoint was mandated by the story, but QA should
  confirm this transition point matches the "Responsive Intent" visually
  at common viewport sizes.
- The title font-family (`"Georgia", "Times New Roman", serif`) was chosen
  to approximate the serif display treatment in the mockups using only
  system-available fonts (no new font dependency); this was not a
  pixel-perfect requirement per the story.
## Rework History

### Rework: Coding Standards update — prefer `styled()` over inline `sx`

`docs/CODING_STANDARDS.md` §9 was updated to prefer MUI's `styled()` API
over inline `sx` props, with styled components placed in sibling
`<FileName>.styled.tsx` files. The implementation was refactored to match,
with no functional/behavioral change.

- Corrective action: Replaced all `sx`-prop styling in `src/App.tsx` and
  `src/components/AppHeader.tsx` with `styled()` components defined in new
  sibling files. Responsive breakpoints moved from `sx`'s object-breakpoint
  shorthand (`{ xs: ..., sm: ... }`) to `theme.breakpoints.up("sm")` media
  queries inside the `styled()` callback.
- Files affected:
  - `src/App.styled.tsx` (new) — `Background` (full-page background +
    responsive vertical padding) and `AppContainer` (responsive horizontal
    padding), both wrapping the existing MUI `Box`/`Container` components.
  - `src/components/AppHeader.styled.tsx` (new) — `HeaderRoot` (styled
    `"header"` element; responsive alignment), `TitleRow`, `IconBadge`
    (pizza emoji badge, using the existing `pizzaIconBackground` token),
    `Title`, and `Subtitle` (styled `Typography`).
  - `src/App.tsx` — now composes `Background`/`AppContainer` instead of
    `Box`/`Container` with `sx`.
  - `src/components/AppHeader.tsx` — now composes the styled components
    instead of `Box`/`Typography` with `sx`.
  - Note: `HeaderRoot` is `styled("header")` rather than `styled(Box)`,
    because MUI's `styled()` typing does not preserve `Box`'s polymorphic
    `component` prop, which the original implementation used to render a
    semantic `<header>`. Styling the `"header"` element directly achieves
    the same semantics without that typing issue.
- Tests added or updated: none. `theme.test.ts`, `AppHeader.test.tsx`, and
  `App.test.tsx` assert on rendered text/roles/theme-token values, not
  markup structure, so they required no changes.
- Verification performed: `npm run lint` (pass), `npm run build` (pass,
  after fixing the `styled(Box)`/`component` typing error described
  above), `npm run test:run` (3 files, 10 tests, pass), `npm run test:e2e`
  (1 test, pass — confirms the page background color is unaffected by the
  styling-mechanism change).

### Rework: QA Attempt 1 defect — AC-001-10 subtitle color

QA Attempt 1 reported FAIL: the subtitle rendered in the title's
high-emphasis color (`rgb(44, 31, 20)` / `#2C1F14`) instead of the
documented low-emphasis color (`rgb(122, 100, 85)` / `#7A6455`). Root
cause: `AppHeader.tsx` passed `color="text.secondary"` (dot notation) to
`Subtitle` (a `styled(Typography)` component); MUI `Typography`'s `color`
prop only recognizes camelCase values (e.g. `"textSecondary"`), so the
dot-path string silently matched no color variant and the subtitle fell
back to the inherited body/high-emphasis color.

- Corrective action: Moved the low-emphasis color onto the `Subtitle`
  styled component itself (`color: theme.palette.text.secondary` inside
  its `styled()` callback) instead of passing it as a `Typography` `color`
  prop, and removed the invalid `color="text.secondary"` prop from the
  call site.
- Files affected:
  - `src/components/AppHeader.styled.tsx` — `Subtitle` now sets
    `color: theme.palette.text.secondary` directly.
  - `src/components/AppHeader.tsx` — removed the invalid
    `color="text.secondary"` prop from `<Subtitle>`.
- Tests added or updated:
  - `e2e/app-shell.spec.ts` — added a new Playwright spec asserting the
    title's computed color is `rgb(44, 31, 20)` and the subtitle's
    computed color is `rgb(122, 100, 85)`, closing the verification gap
    QA identified (no prior test could catch this because RTL/jsdom does
    not reliably compute emotion-applied CSS, and the theme-token diff
    only checks the theme's constants, not what's actually applied to the
    subtitle element).
- Verification performed: `npm run lint` (pass), `npm run build` (pass),
  `npm run test:run` (3 files, 10 tests, pass, unchanged), `npm run
  test:e2e` (2 tests, pass — both the pre-existing background check and
  the new title/subtitle color check).

## QA Verification History

### Attempt 1 — FAIL

**Acceptance criteria verified (PASS):**

- AC-001-01 — Title "Pizza Dough Calculator" renders as an `h1` heading.
  Confirmed via `src/components/AppHeader.test.tsx`, `src/App.test.tsx`,
  and a manual render at `http://localhost:5173/` (accessibility snapshot
  showed `heading "Pizza Dough Calculator" [level=1]`).
- AC-001-02 — Subtitle text renders. Confirmed via existing RTL tests and
  manual render.
- AC-001-03 — Pizza emoji (🍕) renders adjacent to the title inside
  `TitleRow`. Confirmed via RTL test and manual render.
- AC-001-04 — At a wide viewport (1440×900, 1920×900), the header/content
  render inside a centered, width-constrained container. Confirmed via
  Playwright: `.MuiContainer-root` computed `max-width: 1200px` (MUI
  `lg`), header `align-items: flex-start` / `text-align: left`, and
  `document.documentElement.scrollWidth === clientWidth` (no horizontal
  overflow) at 1920px.
- AC-001-05 — At narrow viewports (375×667, 599×900), the header centers
  (`align-items: center`, `text-align: center`) and the icon/title/
  subtitle all remain present and unclipped (subtitle
  `getBoundingClientRect()` stayed within the 375px viewport width).
  Confirmed via Playwright.
- AC-001-06 — Full-page background applied. Confirmed via
  `e2e/app-shell.spec.ts` (`npm run test:e2e`, pass) and manually
  re-checked across all tested viewport widths.
- AC-001-07 — No Pizza Settings/Dough Ball/Recipe Summary/Ingredients UI
  rendered. Confirmed via `src/App.test.tsx` and by inspecting
  `src/App.tsx` (renders only `Background` → `AppContainer` →
  `AppHeader`).
- AC-001-08 — Verified the breakpoint transition directly at 599px vs.
  600px vs. 1920px: exactly one `<header>` element at each width (no
  duplication/disappearance), `align-items` switches cleanly from
  `center` to `flex-start` at the `sm` (600px) breakpoint, and
  `document.documentElement.scrollWidth` equalled the configured
  viewport width at all three sizes (no horizontal overflow).
- AC-001-09 — Page background is `#F5F0E8` sourced from
  `theme.palette.background.default` (not a component-local hex).
  Confirmed via `src/theme.test.ts` (token diff) and
  `e2e/app-shell.spec.ts` (rendered `rgb(245, 240, 232)`), both pass.
- AC-001-11 — Reviewed `package.json`: `dependencies` are unchanged
  (`@emotion/react`, `@emotion/styled`, `@mui/material`, `react`,
  `react-dom`) — no new runtime dependency was added.
- AC-001-12 — Pizza icon/branding element is the literal `🍕` emoji
  character inside a `Box`-based `IconBadge`, not an SVG, image, or
  icon-font glyph. Confirmed by reading
  `src/components/AppHeader.tsx`/`AppHeader.styled.tsx` and the rendered
  DOM (`<IconBadge aria-hidden="true">🍕</IconBadge>`).

**Acceptance criteria that failed (FAIL):**

- AC-001-10 — **FAIL.** The title correctly renders in the high-emphasis
  color (`#2C1F14` / `rgb(44, 31, 20)`, inherited from `CssBaseline`'s
  body color). However, the **subtitle does not render in the
  low/medium-emphasis color** required by this criterion. Inspecting the
  rendered app at `http://localhost:5173/` with Playwright
  (`getComputedStyle` on the subtitle element) shows `color: rgb(44, 31,
  20)` — the same high-emphasis color as the title — instead of the
  documented low-emphasis token `#7A6455` (`rgb(122, 100, 85)`).

  Root cause: `src/components/AppHeader.tsx` passes
  `color="text.secondary"` to the `Subtitle` (a `styled(Typography)`
  component). `"text.secondary"` (dot notation) is **not** a valid value
  for MUI `Typography`'s `color` prop — the dot-path form is only
  meaningful inside an `sx` object (e.g. `sx={{ color: 'text.secondary'
  }}`). The `color` prop itself only recognizes camelCase values such as
  `"textSecondary"`/`"textPrimary"`. Because `"text.secondary"` matches
  none of Typography's recognized color keys, MUI silently applies no
  color override class (`MuiTypography-colorTextSecondary` is absent from
  the rendered class list — confirmed via
  `el.className` →
  `"MuiTypography-root MuiTypography-subtitle1 css-1ye6n5u-MuiTypography-root"`),
  so the subtitle falls back to the inherited body/high-emphasis color
  instead of the intended low-emphasis token.

  - Expected: subtitle computed `color` is `rgb(122, 100, 85)` (`#7A6455`,
    the documented low-emphasis token).
  - Actual: subtitle computed `color` is `rgb(44, 31, 20)` (`#2C1F14`,
    the high-emphasis token — visually identical to the title).
  - Reproduction: run `npm run dev`, open `http://localhost:5173/`, select
    the subtitle text, and inspect its computed `color` (or run
    `getComputedStyle(document.querySelector('h6')).color` in the
    console). It returns `rgb(44, 31, 20)`, not `rgb(122, 100, 85)`.
  - Related acceptance criterion: AC-001-10.
  - Note: this defect was not caught by `src/theme.test.ts` (which only
    diffs the theme's *token values*, not what's actually applied to the
    subtitle) nor by `AppHeader.test.tsx`/`App.test.tsx` (RTL/jsdom
    assertions check only text content, not computed color). No
    Playwright color spot-check exists for the subtitle/title text color,
    per the implementation report's own "Known Issues" note — this is the
    exact gap that check would have caught.

**Verification commands executed:**

- `npm run lint` — pass, no errors.
- `npm run build` (`tsc -b && vite build`) — pass, no type errors (the
  `color="text.secondary"` defect is not a type error, since `Typography`'s
  `color` prop type includes a `(string & {})` escape hatch that accepts
  any string).
- `npm run test:run` — 3 files, 10 tests, all pass.
- `npm run test:e2e` — 1 test (`e2e/app-shell.spec.ts`), pass (verifies
  page background color only; does not cover title/subtitle text color).

**Manual/UI verification performed:**

- Started `npm run dev` and opened `http://localhost:5173/` in the
  integrated browser.
- Used Playwright (`run_playwright_code`) against the running dev server
  to inspect rendered `getComputedStyle` values for the title and
  subtitle, confirm the page background color, and resize the viewport to
  375×667, 599×900, 600×900, 1440×900, and 1920×900 to check responsive
  alignment, absence of horizontal overflow, and header duplication/
  disappearance at the breakpoint transition.
- Confirmed via accessibility snapshot that the header renders exactly
  once with the icon, `h1` title, and subtitle present at each tested
  viewport width.

**Findings:** All acceptance criteria pass except AC-001-10, which fails
for the subtitle color specifically (see defect above). The underlying
cause is an invalid MUI `Typography` `color` prop value
(`"text.secondary"` instead of `"textSecondary"`), not a theme-token
error — `src/theme.ts` itself correctly defines `text.secondary` as
`#7A6455`.

**Result: FAIL** — requires rework of `src/components/AppHeader.tsx` (the
`color` prop passed to `Subtitle`) to satisfy AC-001-10.

### Attempt 2 — PASS

**Acceptance criteria verified (PASS):** AC-001-01, AC-001-02, AC-001-03,
AC-001-04, AC-001-05, AC-001-06, AC-001-07, AC-001-08, AC-001-09,
**AC-001-10**, AC-001-11, AC-001-12.

- AC-001-01 through AC-001-09, AC-001-11, AC-001-12 — re-confirmed
  unchanged from Attempt 1 (re-ran the same automated suite and a fresh
  manual/Playwright pass at 375×900, 599×900, 600×900, and 1440×900; no
  regressions found in responsive alignment, overflow, background color,
  out-of-scope-UI absence, dependency list, or the emoji icon).
- **AC-001-10 — now PASS.** Independently re-verified in a live browser
  (`npm run dev` + Playwright `getComputedStyle`, not just reading the
  implementation report or trusting `e2e/app-shell.spec.ts`):
  - Title computed `color`: `rgb(44, 31, 20)` (`#2C1F14`, high emphasis) — correct.
  - Subtitle computed `color`: `rgb(122, 100, 85)` (`#7A6455`, low
    emphasis) — correct, and now distinct from the title as required.
  - Confirmed the corrective change: `Subtitle` (in
    `src/components/AppHeader.styled.tsx`) now sets
    `color: theme.palette.text.secondary` directly inside its `styled()`
    callback, and the invalid `color="text.secondary"` prop was removed
    from the `<Subtitle>` call site in `src/components/AppHeader.tsx`.
    This avoids the invalid-`Typography`-`color`-prop pitfall that caused
    the Attempt 1 defect.

**Acceptance criteria that failed or could not be verified:** None.

**Verification commands executed:**

- `npm run lint` — pass, no errors.
- `npm run build` (`tsc -b && vite build`) — pass, no type errors.
- `npm run test:run` — 3 files, 10 tests, all pass (unchanged from
  Attempt 1).
- `npm run test:e2e` — 2 tests, both pass: the pre-existing page
  background check, and the new
  `renders the title and subtitle in the documented text-emphasis colors`
  spec (`titleColor` → `rgb(44, 31, 20)`, `subtitleColor` →
  `rgb(122, 100, 85)`).

**Manual/UI verification performed:**

- Started `npm run dev`, reloaded the already-open browser page at
  `http://localhost:5173/`, and independently inspected computed styles
  via Playwright (`getComputedStyle`) for the title and subtitle —
  confirming the fix rather than relying on the e2e spec or the
  implementation report alone.
- Re-checked the responsive breakpoint transition (`header`
  `align-items` and `document.documentElement.scrollWidth`) at
  375×900, 599×900, 600×900, and 1440×900 to confirm the color fix
  introduced no layout regression.

**Findings:** The Attempt 1 defect (AC-001-10, subtitle color) is
resolved. The corrective action applied the palette token at the styled-
component level (`theme.palette.text.secondary`) rather than via
`Typography`'s `color` prop, which sidesteps the invalid-dot-notation
pitfall. A new Playwright spot-check now covers both the title and
subtitle text colors, closing the coverage gap identified in Attempt 1.
No regressions found in any previously-passing acceptance criterion.

**Result: PASS** — all acceptance criteria (AC-001-01 through AC-001-12)
verified.
