# Story 003 — Results Presentation — Implementation Report

## Implementation Summary

Added the results-presentation side of the application: a `DoughBallResult`
hero card, a `RecipeSummary` metrics panel, and an `Ingredients` table, all
rendered with a single internally-consistent set of static placeholder
values. No calculation logic was introduced — every displayed number is a
literal constant.

- **Dough Ball**: a dark-surface card showing the "Dough Ball" label, a
  pizza-count chip ("× 6"), the dough-ball weight ("480 g") in the Warm gold
  color, and the context text (`per 16" standard pizza`).
- **Recipe Summary**: a Card/Paper-surface panel with four labeled metrics
  in order — Total Dough (2880 g), Total Flour (1692.13 g), Total Water
  (1049.12 g), Hydration (62%).
- **Ingredients**: a Card/Paper-surface panel with an "Ingredients" heading,
  a subtitle, and a table of all six ingredients (name, weight in grams,
  baker's percentage), a "BASE" chip + row highlight on Bread Flour using
  the Primary tint overlay token, and a Total Dough row at the bottom.

All three sections are rendered in `App.tsx` inside a new `ResultsColumn`
(to the right of Pizza Settings at the `md` breakpoint and stacked below it
at narrower widths, reusing the existing `ContentLayout` responsive
wrapper). Changing any Pizza Settings control has no effect on these
sections, since there is no wiring between them (reserved for Story 004).

Placeholder values mirror `docs/PROJECT.md`'s documented canonical test
case (16" reference pizza × 6 → 480 g dough ball, 2880 g total dough,
≈1692.13 g flour, ≈1049.12 g water, ≈6.77 g yeast, ≈42.30 g salt, ≈33.84 g
sugar, ≈55.84 g olive oil), so the numbers are internally consistent and
traceable to the documented domain model rather than invented, and are
isolated in a dedicated, clearly-labeled presentation-only data module
(`src/components/placeholderResultsData.ts`) separate from any domain code.

Five new color tokens were added to the shared theme (`src/theme.ts`): Dark
surface (`doughBallCardBackground`), Warm gold (`doughBallWeightColor`),
Inverted text (`textInverted`), Primary tint overlay (`primaryTint`), and
Strong divider (`strongDivider`) — following the existing pattern already
used for `pizzaIconBackground`/`textMediumEmphasis`. The Recipe Summary and
Ingredients card surfaces reuse the existing `theme.palette.background.paper`
token (same as the Pizza Settings card).

## Files Changed

- `src/components/placeholderResultsData.ts` (new) — the single, clearly
  labeled presentation-only placeholder data set (`PLACEHOLDER_RESULTS`)
  consumed by all three result components, plus its `PlaceholderResults`/
  `PlaceholderIngredient` types.
- `src/components/DoughBallResult.tsx` / `.styled.tsx` (new) — the Dough
  Ball hero card.
- `src/components/RecipeSummary.tsx` / `.styled.tsx` (new) — the four-metric
  Recipe Summary panel.
- `src/components/Ingredients.tsx` / `.styled.tsx` (new) — the Ingredients
  heading, subtitle, and table (including the Bread Flour "BASE" row and
  the Total Dough row).
- `src/components/DoughBallResult.test.tsx`, `RecipeSummary.test.tsx`,
  `Ingredients.test.tsx` (new) — RTL tests for each component.
- `src/theme.ts` (modified) — added `doughBallCardBackground`,
  `doughBallWeightColor`, `textInverted`, `primaryTint`, `strongDivider`.
- `src/theme.test.ts` (modified) — added theme-token diff assertions for
  the five new tokens.
- `src/App.tsx` (modified) — renders `DoughBallResult`, `RecipeSummary`,
  and `Ingredients` inside a new `ResultsColumn`, alongside the existing
  `PizzaSettings` in `SettingsColumn`.
- `src/App.styled.tsx` (modified) — added the `ResultsColumn` styled
  component (full width at `xs`, `flex: 1` at `md`, matching the existing
  `ContentLayout`/`SettingsColumn` responsive pattern from Story 002).
- `src/App.test.tsx` (modified) — replaced the now-obsolete "Dough
  Ball/Recipe Summary/Ingredients do not render" guard test (accurate for
  Story 002, no longer accurate now that this story adds them) with tests
  asserting all three sections render, and that changing Pizza Settings
  controls (diameter slider, pizza-count increment) does not alter the
  displayed result values.
- `e2e/results-presentation.spec.ts` (new) — Playwright color spot-checks
  (per `docs/TESTING.md` §17) for the Dough Ball card's dark-surface/warm-
  gold colors (AC-003-12), the Recipe Summary/Ingredients card/paper
  background (AC-003-13), and the Bread Flour row's primary-tint
  background (AC-003-14).
- `docs/stories/003-results-presentation.md` (modified) — status updated
  to `In Progress`, then `Ready for QA`.

## Tests

- `src/components/DoughBallResult.test.tsx` (new, 2 tests) — renders the
  label, weight, unit, pizza-count indicator, and context text; renders as
  an accessible region named "Dough Ball result".
- `src/components/RecipeSummary.test.tsx` (new, 3 tests) — renders as an
  accessible region named "Recipe Summary"; renders all four metrics with
  correct values/units in the required order; Hydration displays as 62%.
- `src/components/Ingredients.test.tsx` (new, 4 tests) — renders the
  "Ingredients" heading; lists all six ingredients with name/weight/
  baker's %; distinguishes the Bread Flour row with a BASE chip (and
  confirms other rows do not have it); displays the Total Dough row.
- `src/theme.test.ts` (modified, +5 tests) — asserts the exact value of
  each new token against `docs/COLOR_PALETTE.md`.
- `src/App.test.tsx` (modified) — asserts all three new sections render at
  the `App` level, and that interacting with Pizza Settings controls
  (diameter keyboard change, pizza-count increment) leaves the displayed
  Dough Ball/Recipe Summary/Ingredients values unchanged (AC-003-09,
  AC-003-10).
- `e2e/results-presentation.spec.ts` (new, 3 Playwright tests) — rendered-
  color spot-checks for the Dough Ball dark-surface/warm-gold colors, the
  Recipe Summary/Ingredients card/paper background, and the Bread Flour
  row's primary-tint color.

## Verification

- `npm run lint` — passed, no errors.
- `npm run build` (`tsc -b && vite build`) — passed, no type errors.
- `npm run test:run` — 7 test files, 40 tests passed.
- `npm run test:e2e` — 7 tests passed (4 pre-existing + 3 new).
- Manual verification in a real browser (dev server): confirmed the
  rendered Dough Ball/Recipe Summary/Ingredients content and values match
  the accessibility-tree structure asserted by the tests, confirmed visual
  hierarchy against `docs/designs/desktop-pizza-layout.png` at desktop
  width, and confirmed the stacked order (Pizza Settings → Dough Ball →
  Recipe Summary → Ingredients) with no horizontal overflow at a 390px
  mobile viewport against `docs/designs/mobile-layout.png`.

## Acceptance Criteria Addressed

- AC-003-01 — `DoughBallResult` renders the label, weight, unit, pizza-
  count indicator, and context text; verified by RTL test and manual
  browser check.
- AC-003-02 — Dough Ball card uses `doughBallCardBackground` (`#2C1F14`)
  and the weight number uses `doughBallWeightColor` (`#F5C896`), both
  sourced from `src/theme.ts`; verified by `e2e/results-presentation.spec.ts`.
- AC-003-03 — `RecipeSummary` renders the four metrics (Total Dough, Total
  Flour, Total Water, Hydration) in order, each with value/unit/label;
  verified by RTL test.
- AC-003-04 — `Ingredients` lists all six ingredients, each with name,
  weight in grams, and baker's percentage; verified by RTL test.
- AC-003-05 — Bread Flour row is visually distinguished (BASE chip + row
  highlight); verified by RTL test and manual browser check.
- AC-003-06 — Displayed baker's percentages are exactly 100%, 62%, 0.4%,
  2.5%, 2.0%, 3.3% (stored as literal strings to preserve exact
  formatting); verified by RTL test.
- AC-003-07 — Hydration displays 62%; verified by RTL test.
- AC-003-08 — Ingredients section displays a Total Dough weight (2880 g)
  row; verified by RTL test.
- AC-003-09 — Pizza Settings controls are not wired to any result value;
  verified by code inspection (no shared state/props between
  `PizzaSettings` and the result components) and by the `App.test.tsx`
  interaction test.
- AC-003-10 — Changing Pizza Settings controls does not change displayed
  result values; verified by `App.test.tsx`.
- AC-003-11 — `ContentLayout` positions `ResultsColumn` to the right of
  `SettingsColumn` at the `md` breakpoint, in DOM/visual order Dough Ball →
  Recipe Summary → Ingredients; verified by code review (reusing the
  Story 002 `ContentLayout` pattern) and manual browser check at desktop
  width.
- AC-003-12 — At narrow viewports, `ContentLayout` stacks to a column,
  preserving Pizza Settings → Dough Ball → Recipe Summary → Ingredients,
  without horizontal overflow; verified by manual browser check at a
  390px viewport (no automated viewport/layout test exists in this
  project's toolset — Playwright is reserved for color spot-checks per
  `docs/TESTING.md` §17, matching the precedent set by Story 002's
  AC-002-14/15).
- AC-003-13 — Recipe Summary and Ingredients sections use
  `theme.palette.background.paper` (`#FFFCF5`); verified by
  `e2e/results-presentation.spec.ts`.
- AC-003-14 — Bread Flour row uses `primaryTint`
  (`rgba(184, 92, 42, 0.12)`) from `src/theme.ts`; verified by
  `e2e/results-presentation.spec.ts`.
- AC-003-15 — Placeholder values are mutually consistent: 480 g × 6 =
  2880 g total dough; the six ingredient weights
  (1692.13 + 1049.12 + 6.77 + 42.3 + 33.84 + 55.84) sum to 2880.00 g,
  matching the displayed total dough weight exactly; verified by code
  review of `placeholderResultsData.ts` and the Ingredients RTL test.
- AC-003-16 — No new runtime dependency was added; `package.json`'s
  `dependencies` are unchanged (`@mui/material`, `@emotion/react`,
  `@emotion/styled`, `react`, `react-dom`); verified by inspection of the
  diff to `package.json` (none).

## Known Issues / Remaining Concerns

- AC-003-11/12 (responsive right-column vs. stacked layout) are verified
  by code review and manual browser checks rather than an automated
  viewport test, consistent with the precedent set by Story 002
  (`docs/TESTING.md` scopes Playwright strictly to color spot-checks).
  QA should independently confirm the `md` breakpoint transition.
- In the Recipe Summary panel, the `border-right` divider between metrics
  is applied via CSS `:last-of-type` (removing it only from the fourth/
  last metric). At narrow widths where the four metrics wrap onto two
  rows of two, the second metric in the top row (e.g. "Total Flour") still
  shows a trailing divider even though it is visually at the end of its
  row. This is a minor cosmetic artifact, not a clipping/overflow defect —
  confirmed during manual mobile-viewport review — and was left as-is
  since the story's edge cases concern overflow/clipping, not border
  placement on wrap.
- The `pizzaCount` (6) used in the Dough Ball chip and Ingredients
  subtitle is part of the single placeholder data set and is
  intentionally unrelated to the Pizza Settings panel's own default count
  (4), per the story's explicit scope (no wiring between the two).
