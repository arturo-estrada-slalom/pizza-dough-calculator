# Story 005 — Implementation Report

## Implementation Summary

Enabled the previously inert Thickness selector (Thin / Standard / Thick) in
Pizza Settings and incorporated the selected thickness into the dough
calculation:

- Thickness factors (Thin `0.80`, Standard `1.00`, Thick `1.20`) are defined
  once as domain configuration in `src/domain/recipe.ts`
  (`THICKNESS_FACTORS`, plus `DEFAULT_THICKNESS = "standard"`), and a
  `Thickness` type (`"thin" | "standard" | "thick"`) was added to
  `src/domain/types.ts`.
- `calculateDoughBallWeight` (domain layer, pure function) now accepts a
  `thickness` parameter and multiplies the existing diameter/area-scaled
  Standard dough-ball weight by the selected thickness factor:
  `480 × (diameter / 16)² × thicknessFactor`.
- `thickness` was lifted into `App`'s controlled input state (alongside
  `diameter` and `pizzaCount`), defaulting to `DEFAULT_THICKNESS`
  ("standard"). All dependent results (dough ball, total dough, flour,
  water, every ingredient) are derived from this state on every render —
  no separate calculated-result state was introduced.
- `PizzaSettings`'s `ThicknessToggleGroup` is now a controlled component
  driven by the `thickness` prop; all three options are enabled (the
  Story 004 `disabled` attributes were removed). The `onChange` handler
  ignores MUI's `null` callback value (emitted when the already-selected
  option is pressed again in an exclusive `ToggleButtonGroup`), preserving
  the current selection instead of deselecting it.
- `DoughBallResult`'s contextual text now reads the selected thickness
  value directly (e.g. `per 16" thin pizza`, `per 16" thick pizza`).
- Baker's percentages, the recipe formula, and hydration are untouched by
  this story — `calculateRecipe`, `RecipeSummary`, and `Ingredients` were
  not modified, since they already derive solely from total dough weight
  and the fixed, unchanged baker's-percentage constants.

Standard-thickness results remain numerically identical to Story 004
(factor `1.00` is a no-op multiplier), including the canonical 16-inch,
six-pizza reference case.

## Files Changed

- `src/domain/types.ts` — added the `Thickness` domain type.
- `src/domain/recipe.ts` — added `THICKNESS_FACTORS` (single source of
  truth for the three factors) and `DEFAULT_THICKNESS`.
- `src/domain/doughCalculator.ts` — `calculateDoughBallWeight` now accepts
  a `thickness` argument and applies the corresponding factor to the
  Standard (diameter-scaled) dough-ball weight.
- `src/components/PizzaSettings.tsx` — added `thickness` /
  `onThicknessChange` props; removed the hard-coded `"standard"` constant
  and the `disabled` attributes on Thin/Thick; wired the
  `ToggleButtonGroup`'s `onChange` with a guard against the MUI
  already-selected/`null` edge case.
- `src/components/DoughBallResult.tsx` — added a `thickness` prop; the
  contextual text now interpolates the selected thickness instead of the
  hard-coded word "standard".
- `src/App.tsx` — added `thickness` state (default
  `DEFAULT_THICKNESS`), passed it into `calculateDoughBallWeight`,
  `PizzaSettings`, and `DoughBallResult`.
- `src/domain/doughCalculator.test.ts` — updated all existing calls to
  pass a `thickness` argument; added tests for the Thin/Standard/Thick
  factor calculations, diameter+thickness composition at the 10"/Thin and
  20"/Thick boundaries, the four-pizza Thin/Standard/Thick total-dough
  reference values, and the 100-pizza/Thick boundary case.
- `src/components/PizzaSettings.test.tsx` — updated the controlled test
  harness to own `thickness` state; replaced the Story 004
  "Thin/Thick disabled" assertions with tests verifying all three options
  are enabled, Standard is selected by default, selecting Thin/Thick
  updates the pressed state, re-activating the already-selected option
  does not deselect it, and changing diameter does not alter the selected
  thickness.
- `src/components/DoughBallResult.test.tsx` — added a `thickness` prop to
  all existing render calls; added tests asserting the contextual text
  for Thin and Thick.
- `src/App.test.tsx` — replaced the "disabled Thickness options" test
  with an interactive test verifying that selecting Thick recalculates
  the Dough Ball weight and contextual text, while baker's percentages
  and hydration remain unchanged.

## Tests

- `src/domain/doughCalculator.test.ts` — Thin/Standard/Thick factor
  calculations at the 16" reference point; Standard-preserves-Story-004
  regression check; diameter × thickness composition at the 10"/Thin and
  20"/Thick boundaries; four-pizza Thin/Standard/Thick total-dough
  reference values (1536 g / 1920 g / 2304 g); 100-pizza/Thick boundary
  case.
- `src/components/PizzaSettings.test.tsx` — all three thickness options
  enabled; Standard selected by default; selecting Thin/Thick updates
  `aria-pressed`; re-activating the already-selected option keeps it
  selected (MUI exclusive-group `null` edge case); changing diameter
  leaves the selected thickness unchanged.
- `src/components/DoughBallResult.test.tsx` — contextual text reflects
  Thin and Thick selections.
- `src/App.test.tsx` — end-to-end: selecting Thick recalculates the Dough
  Ball weight and contextual text from the current diameter/pizza-count
  state, while baker's percentages and hydration stay fixed.

## Verification

- `npm test -- --run` — 74 tests passed (10 test files).
- `npm run lint` — no errors.
- `npm run build` (`tsc -b && vite build`) — no type errors, build
  succeeded.
- `npx playwright test` — 7 passed, including the existing color
  assertions for the slider and the selected ("Standard") thickness
  option against `docs/COLOR_PALETTE.md`'s primary token.

## Acceptance Criteria Addressed

- AC-005-01 through AC-005-15: all thickness selection, calculation,
  visual-indication, and regression criteria described in the story are
  covered by the domain, component, and integration tests listed above.
- Edge cases covered: re-activating the already-selected toggle option
  (no deselection), minimum diameter (10") + Thin and maximum diameter
  (20") + Thick composition, maximum pizza count (100) + Thick, and
  diameter changes not affecting the selected thickness.

## Known Issues / Remaining Concerns

- None identified. No separation-of-concerns violations were introduced;
  thickness calculation remains a pure domain function, and the
  thickness factors have a single source of truth in
  `src/domain/recipe.ts`.
- This implementation has not been independently verified by QA.

## QA Verification History

### Attempt 1 — PASS

**Result:** PASS

**Acceptance criteria verified:** AC-005-01, AC-005-02, AC-005-03,
AC-005-04, AC-005-05, AC-005-06, AC-005-07, AC-005-08, AC-005-09,
AC-005-10, AC-005-11, AC-005-12, AC-005-13, AC-005-14, AC-005-15,
AC-005-16, AC-005-17.

**Acceptance criteria failed or not verified:** None.

**Verification commands executed:**

- `npm run test:run` — 10 test files, 74 tests passed.
- `npm run lint` — no errors.
- `npm run build` (`tsc -b && vite build`) — no type errors, build
  succeeded.
- `npm run test:e2e` — 7 Playwright tests passed, including the existing
  theme-token spot-check asserting the selected thickness option renders
  `rgb(184, 92, 42)` (`docs/COLOR_PALETTE.md` Primary) and the diameter
  slider thumb matches the same token.

**Manual/UI verification performed (dev server, `http://localhost:5173/`):**

- Confirmed default load state: Standard selected (`aria-pressed=true`),
  14"/4-pizza defaults produce a 367.5 g dough ball, 1470 g total dough,
  863.69 g flour, 535.49 g water, and the full baker's-percentage table
  (100/62/0.4/2.5/2.0/3.3%), matching Story 004 regression expectations
  (AC-005-03, AC-005-13).
- Selected "Thick" and confirmed, without any submit action: Dough Ball
  updated to 441 g, contextual text updated to `per 14" thick pizza`,
  Total Dough updated to 1764 g, Total Flour to 1036.43 g, Total Water to
  642.59 g, and every ingredient row (Yeast 4.15 g, Salt 25.91 g, Sugar
  20.73 g, Olive Oil 34.2 g) recalculated proportionally, while the
  displayed baker's percentages and Hydration (62%) were unchanged
  (AC-005-04, AC-005-05, AC-005-07, AC-005-08, AC-005-09, AC-005-10,
  AC-005-11, AC-005-12). Values independently hand-verified: 367.5 × 1.2
  = 441 g; 441 × 4 = 1764 g; 1764 / 1.702 ≈ 1036.43 g flour;
  1036.43 × 0.62 ≈ 642.59 g water.
- Re-clicked the already-selected "Thick" option (MUI exclusive-toggle
  `null`-callback edge case) and confirmed, via accessibility snapshot
  and screenshot, that "Thick" remained the only pressed option and all
  displayed values were unchanged — no deselection occurred (AC-005-16).
- Screenshot confirmed the selected "Thick" toggle renders in the
  terracotta primary accent color, visually consistent with the
  Playwright-asserted `rgb(184, 92, 42)` token from
  `docs/COLOR_PALETTE.md`, and that exactly one thickness option appears
  selected at a time (AC-005-07, AC-005-10).
- Reviewed `src/domain/recipe.ts`: confirmed `THICKNESS_FACTORS`
  (`thin: 0.8, standard: 1.0, thick: 1.2`) is the sole definition of the
  thickness multipliers, and `grep`-searched `src/` for `0.8`/`1.2`
  literals — the only matches outside `recipe.ts` are test
  names/comments/string literals (e.g. "applies the Thin factor (0.80)")
  and unrelated CSS `fontSize` values; no duplicated calculation
  constants exist in components or other calculation functions
  (AC-005-14).
- Confirmed `src/domain/doughCalculator.ts`'s `calculateDoughBallWeight`
  has no React/MUI/browser imports and is exercised purely as direct
  function calls in `doughCalculator.test.ts` (AC-005-15).
- Confirmed `calculateRecipe` (`src/domain/recipeCalculator.ts`) was not
  modified by this story and derives all six ingredient weights solely
  from `totalDoughWeight` and the fixed `RECIPE_INGREDIENTS` baker's
  percentages — thickness cannot structurally alter baker's percentages
  or hydration, consistent with the displayed values above (AC-005-06,
  AC-005-07, AC-005-11).
- Confirmed `App.tsx` lifts `thickness` into the same `useState`-based
  controlled input state as `diameter`/`pizzaCount`, with
  `doughBallWeightGrams`, `totalDoughWeightGrams`, and `recipe` all
  derived on every render — no independent/duplicated result state was
  introduced (AC-005-08, consistent with `docs/ARCHITECTURE.md`'s
  "derived values over duplicated state" principle).
- Reviewed `PizzaSettings.test.tsx` and `App.test.tsx`: both cover
  changing diameter/pizza-count while a non-default thickness remains
  selected, confirming the selection is not reset by unrelated input
  changes (AC-005-13, AC-005-17).
- Verified no separation-of-concerns violations: thickness calculation
  logic is confined to `src/domain/`, `PizzaSettings.tsx` and
  `DoughBallResult.tsx` only capture/pass/render the selected value, and
  no new `src/utils/` or colocated helper files were warranted by this
  change.

**Findings:** No defects identified. One minor test-coverage observation
(not a defect): `App.test.tsx`'s thickness-change test asserts the Dough
Ball value/context and the unchanged baker's-percentage/hydration display,
but does not assert the literal Total Dough/Total Flour/Total Water
numbers for that scenario. This gap was independently closed via the
manual browser verification above (1764 g / 1036.43 g / 642.59 g), which
confirms AC-005-08 and AC-005-09 hold; it does not block PASS.
