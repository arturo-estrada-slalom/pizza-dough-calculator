# Story 006 — Implementation Report

## Implementation Summary

Fixed the presentation-only defect where sufficiently wide calculated
Weight values (e.g. `446.83 g`) could wrap their numeric value and `g` unit
onto separate lines in the Ingredients table on narrow/mobile viewports.

Root cause: each weight cell rendered its value as two adjacent JSX
expressions (`{formatWeight(...)} g`), which React emits as two separate
DOM text nodes. When the Weight column narrowed below the text's natural
width, the browser could wrap at the space between those two text nodes,
splitting the number and unit onto separate lines and breaking row
alignment.

Fix:

- The weight value and its `g` unit are now built as a single template
  string (`` `${formatWeight(...)} g` `` ) so they render as one DOM text
  node, and that text node is wrapped in a new `WeightValue` styled `span`
  (`white-space: nowrap`) so the value and unit can never be split onto
  separate lines, regardless of how narrow the column becomes. Applied to
  both each ingredient's Weight cell and the Total Dough cell.
- Added a `DataCell` styled `TableCell` (used for the Weight, Baker's %,
  and Total Dough cells) and applied the same responsive padding reduction
  to the existing `IngredientNameCell` and `TotalRow` cells, narrowing
  horizontal cell padding below the existing `sm` breakpoint and restoring
  the original padding at `sm` and above. This gives the Weight column more
  of the available width at narrow widths without introducing a new
  breakpoint, and without changing desktop spacing.
- No domain/calculation code, number-formatting rules, or column structure
  were changed. The existing `IngredientsTableContainer` (`overflow-x:
  auto`) continues to provide contained horizontal scrolling as a fallback
  if a table ever needs more width than its card at a given viewport —
  this was not newly introduced by this story.

This is a presentation-layer-only change confined to `src/components/
Ingredients.tsx` and `src/components/Ingredients.styled.tsx`; no files
under `src/domain/` were touched, and no new raw color values or
application breakpoints were introduced.

## Files Changed

- `src/components/Ingredients.tsx` — Weight and Total Dough values now
  render as a single text node wrapped in the new `WeightValue` component;
  all data/total-row cells now use the new `DataCell` styled component
  instead of the plain MUI `TableCell`.
- `src/components/Ingredients.styled.tsx` — added `DataCell` (responsive
  padding) and `WeightValue` (`white-space: nowrap`) styled components;
  applied the same responsive padding to `HeaderCell`, `IngredientNameCell`,
  and `TotalRow`'s cells.
- `e2e/ingredients-table-layout.spec.ts` (new) — Playwright layout-invariant
  regression coverage for this story (see Tests below).
- `docs/stories/006-fix-mobile-ingredient-table-layout.md` — status updated
  to `Ready for QA`.

No changes were made to `src/domain/`, `src/utils/formatWeight.ts`, or any
existing component test file; `Ingredients.test.tsx` was re-run unmodified
and continues to pass (the rendered text content is unchanged — only how
it's split across DOM text nodes changed).

## Tests

### Vitest / RTL

No existing test files required changes. `src/components/Ingredients.test.tsx`
passes unmodified, confirming rendered text content (e.g. `"1692.13 g"`,
`"2880 g"`) is unchanged.

### Playwright E2E (new — `e2e/ingredients-table-layout.spec.ts`)

Real-browser layout-invariant coverage per `docs/TESTING.md` Section 17/18
(jsdom cannot verify real text wrapping):

1. **"keeps ingredient weights and Total Dough on one line and the table
   structurally intact at the 320px minimum width"** — sets a 320×900
   viewport, configures the calculator to 13", Thick, 2 pizzas (reproducing
   the story's canonical example values: `446.83 g`, `277.03 g`, `14.75 g`,
   `760.5 g` Total Dough), and asserts:
   - each value's element has exactly one `getClientRects()` fragment (no
     wrap),
   - the three column headers (Ingredient/Weight/Baker's %) are visible,
   - the Bread Flour row still contains the BASE chip,
   - `document.documentElement.scrollWidth` does not exceed 320px (no
     page-level horizontal scroll).
   Covers AC-006-01, AC-006-02, AC-006-03, AC-006-04, AC-006-05.

2. **"remains structurally intact at 320px for the maximum supported input
   combination (20in, Thick, 100 pizzas)"** — sets a 320×900 viewport,
   drives the diameter slider to its 20" maximum, selects Thick, and
   increments pizza count to 100, then asserts the resulting `52878.97 g`
   flour weight and `90000 g` Total Dough each render as a single line, and
   there is no page-level horizontal scroll. Covers AC-006-08.

3. **"does not regress the Ingredients table layout at desktop viewport
   widths"** — sets a 1280×800 viewport and asserts the default-settings
   flour (`863.69 g`) and Total Dough (`1470 g`) values remain single-line
   at desktop width. Covers AC-006-06.

All existing Playwright specs (`app-shell.spec.ts`, `pizza-settings.spec.ts`,
`results-presentation.spec.ts`) were preserved unmodified.

## Verification

- `npm run test:run` — 74/74 tests passed (10 test files), no changes
  required to existing suites.
- `npm run test:e2e` — 10/10 tests passed, including the 3 new specs in
  `e2e/ingredients-table-layout.spec.ts`.
- `npm run lint` — no errors.
- `npm run build` (`tsc -b && vite build`) — no type errors, build
  succeeded.
- Manually inspected rendered DOM/layout via a local dev server to confirm
  the Weight value + unit now renders as a single DOM text node with a
  single `getClientRects()` fragment (previously two fragments at the
  space between the number and "g", which is how the original defect
  manifested).

## Acceptance Criteria Addressed

- AC-006-01, AC-006-02 — verified via the 320px canonical-values E2E test.
- AC-006-03, AC-006-04 — verified via the same test (header alignment,
  BASE chip association).
- AC-006-05 — verified via the `scrollWidth` assertion in both 320px
  tests; no page-level horizontal scroll occurs for either the canonical
  or maximum-input scenario, so the existing contained-scroll fallback
  (`overflow-x: auto` on `IngredientsTableContainer`) was not needed to be
  exercised.
- AC-006-06 — verified via the desktop-viewport E2E test.
- AC-006-07 — not re-verified here; no calculation logic was touched, and
  the full Vitest domain/component suite (74 tests, including
  `doughCalculator.test.ts` and `recipeCalculator.test.ts`) passed
  unchanged.
- AC-006-08 — verified via the maximum-input E2E test.

## Remaining Concerns

- The fix narrows cell padding at `xs`/no-breakpoint widths across the
  whole table (`DataCell`, `IngredientNameCell`, `TotalRow`), not just the
  Weight column, to give the Weight column more room without a new
  breakpoint. QA should confirm this reduced padding still reads as
  comfortable/readable at 320px and does not feel cramped, since the
  reference mockup does not mandate exact spacing.
- No scenario encountered during testing (canonical values or maximum
  input combination) actually required the contained horizontal-scroll
  fallback at 320px — both fit without it. QA may want to confirm this
  holds across intermediate values in the documented input range, though
  the single-text-node + `nowrap` fix is unconditional and does not depend
  on the specific value length.
