# Story 004 — Implementation Report

## Status

Ready for QA

## Implementation Summary

Added a pure, framework-independent domain layer under `src/domain/` that
implements the Standard pizza dough calculation defined in
`docs/PROJECT.md` and story 004: dough-ball weight scaled from the
16"/480g reference pizza by relative pizza area, total dough weight
scaled by pizza count, and the six recipe ingredients (Bread Flour,
Water, Yeast, Salt, Sugar, Olive Oil) derived from total dough weight via
the fixed 170.2% total baker's-percentage formula.

`diameter` and `pizzaCount` state was lifted from `PizzaSettings` into
`App`, turning `PizzaSettings` into a controlled component. `App` now
calls the domain functions on every render and passes the calculated
values as props into `DoughBallResult`, `RecipeSummary`, and
`Ingredients`, replacing the Story 003 placeholder data
(`placeholderResultsData.ts`, now removed) in all three components.
Thickness remains a non-functional, disabled Thin/Thick control with
Standard as the only selectable option — no thickness calculation was
implemented, per scope.

Display rounding (2 decimal places, trailing-zero trimmed) is implemented
as a small shared presentation helper (`formatWeight`) used by all three
result components; domain functions return full, unrounded precision.

## Files Changed

### Added

- `src/domain/types.ts` — shared domain types (`IngredientKey`,
  `IngredientDefinition`, `Recipe`).
- `src/domain/recipe.ts` — single source of truth for the reference pizza
  constants and the six ingredients' baker's percentages (both the
  calculation multiplier and the fixed display string), plus the derived
  `TOTAL_BAKERS_PERCENTAGE` and `HYDRATION_PERCENT_DISPLAY`.
- `src/domain/doughCalculator.ts` — `calculateDoughBallWeight`,
  `calculateTotalDoughWeight`.
- `src/domain/recipeCalculator.ts` — `calculateFlourWeight`,
  `calculateRecipe`.
- `src/domain/doughCalculator.test.ts` — unit tests for dough-ball/total
  dough calculations, including the documented 10–20" scaling table and
  pizza-count boundaries (1, 100).
- `src/domain/recipeCalculator.test.ts` — unit tests for flour/ingredient
  calculations, including the canonical six-16" case and the
  ingredient-sum-equals-total-dough check at pizza-count boundaries.
- `src/components/formatWeight.ts` — shared presentation-only gram
  rounding/formatting helper.
- `src/components/formatWeight.test.ts` — unit tests for the formatting
  helper.

### Modified

- `src/App.tsx` — lifted `diameter`/`pizzaCount` state here, calls the
  domain functions, and passes calculated props into `PizzaSettings`,
  `DoughBallResult`, `RecipeSummary`, and `Ingredients`.
- `src/components/PizzaSettings.tsx` — converted to a controlled
  component (`diameter`, `onDiameterChange`, `pizzaCount`,
  `onPizzaCountChange` props); exported `DIAMETER_MIN/MAX/DEFAULT` and
  `PIZZA_COUNT_MIN/MAX/DEFAULT` for reuse by `App` (single source of
  truth for the Story 002 defaults/ranges, unchanged values).
- `src/components/DoughBallResult.tsx` — now accepts
  `doughBallWeightGrams`, `diameter`, `pizzaCount` props and renders
  calculated/formatted values instead of placeholder data.
- `src/components/RecipeSummary.tsx` — now accepts
  `totalDoughWeightGrams`, `totalFlourGrams`, `totalWaterGrams` props;
  Hydration continues to render the fixed 62% from
  `HYDRATION_PERCENT_DISPLAY`.
- `src/components/Ingredients.tsx` — now accepts `recipe`,
  `totalDoughWeightGrams`, `pizzaCount` props and renders calculated
  ingredient weights alongside the fixed baker's percentages sourced from
  `src/domain/recipe.ts`.
- `src/App.test.tsx`, `src/components/PizzaSettings.test.tsx`,
  `src/components/DoughBallResult.test.tsx`,
  `src/components/RecipeSummary.test.tsx`,
  `src/components/Ingredients.test.tsx` — updated for the new
  prop-based/controlled APIs; `App.test.tsx`'s "no effect" test from
  Story 003 was replaced with tests asserting dynamic recalculation on
  diameter/pizza-count change, no change to dough-ball weight on
  pizza-count-only change, and no effect from the disabled Thickness
  control.
- `e2e/results-presentation.spec.ts` — updated the Dough Ball color
  assertion's expected weight text from the old placeholder "480" to the
  real calculated default-settings value "367.5" (14", 4 pizzas); no
  other e2e specs referenced calculated values.

### Removed

- `src/components/placeholderResultsData.ts` — Story 003 placeholder
  data, superseded by live calculated values per this story's scope.

## Tests

- Added: `src/domain/doughCalculator.test.ts`,
  `src/domain/recipeCalculator.test.ts`, `src/components/formatWeight.test.ts`.
- Modified: `src/App.test.tsx`, `src/components/PizzaSettings.test.tsx`,
  `src/components/DoughBallResult.test.tsx`,
  `src/components/RecipeSummary.test.tsx`,
  `src/components/Ingredients.test.tsx`, `e2e/results-presentation.spec.ts`.

## Verification

- `npm run test:run` — 10 test files, 62 tests passed.
- `npm run lint` — no errors.
- `npm run build` (`tsc -b && vite build`) — no type errors, build
  succeeded.
- `npm run test:e2e` — 7 Playwright tests passed (color/visual
  verification from Stories 001–003, unaffected except the one updated
  weight-text assertion noted above).

## Acceptance Criteria Addressed

All of AC-004-01 through AC-004-16 are addressed:

- AC-004-01–03, 14: covered by `doughCalculator.test.ts` (reference
  point, 14" case, full 10–20" scaling table, pizza-count boundaries).
- AC-004-04–06: covered by `doughCalculator.test.ts` and
  `recipeCalculator.test.ts` (total dough, canonical ingredient
  breakdown, ingredient-sum check).
- AC-004-07–11: covered by component tests (`DoughBallResult`,
  `RecipeSummary`, `Ingredients`) rendering calculated props, and fixed
  Hydration/baker's-percentage display.
- AC-004-09–10: covered by `App.test.tsx` (diameter change recalculates
  everything; pizza-count change recalculates totals/ingredients but not
  dough-ball weight).
- AC-004-12: Thin/Thick remain disabled and non-functional (unchanged
  from Story 002); no thickness calculation was added.
- AC-004-13: domain functions are plain TypeScript with no React/MUI
  imports, tested directly without rendering.
- AC-004-15: reference pizza and baker's percentages are defined once in
  `src/domain/recipe.ts` and imported by both the calculation and
  presentation layers.
- AC-004-16: `diameter`/`pizzaCount` are single pieces of state owned by
  `App` and passed as props to both `PizzaSettings` and the result
  components, so they cannot drift independently.

## Known Issues / Remaining Concerns

- None identified during implementation. QA should independently verify
  the canonical six-16" scenario and the default-settings (14", 4) values
  against the running application, and confirm rounding/display behavior
  reads correctly across the diameter range (10"–20") and pizza-count
  range (1–100).
