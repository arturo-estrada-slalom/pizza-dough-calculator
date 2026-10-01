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
- `e2e/app-shell.spec.ts` (new) — Playwright spot-check (Testing §17 tier
  2) asserting the rendered `document.body` background color equals
  `rgb(245, 240, 232)` (`#F5F0E8`).

## Verification

- `npm run lint` — passed, no errors.
- `npm run build` (`tsc -b && vite build`) — passed, no type errors.
- `npm run test:run` — 3 test files, 10 tests passed.
- `npm run test:e2e` — 1 test passed.

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
  subtitle explicitly uses `color="text.secondary"` (`#7A6455`); verified by
  `theme.test.ts` (token values) — rendered color not independently
  re-verified via Playwright beyond the background check.
- AC-001-11 — No new runtime dependency added to `package.json`.
- AC-001-12 — Icon implemented as the literal pizza emoji (🍕) in a `Box`,
  not SVG/image/icon-font.

## Known Issues / Remaining Concerns for QA

- AC-001-10's text-color assertion is verified only via the theme-token
  diff (`theme.test.ts`), not an additional Playwright color spot-check on
  the title/subtitle elements themselves; QA may want to add one if a
  stricter rendered-color guarantee is desired.
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
