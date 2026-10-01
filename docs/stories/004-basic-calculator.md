# Story 004 — Basic Pizza Dough Calculator

## Status

Draft

## User Story

As a pizza maker,
I want the calculator to determine the dough weight and ingredient quantities
for my selected pizza diameter and quantity,
so that I know how much dough and how much of each ingredient I need to make
my pizzas.

## Context

Stories 001–003 establish the application shell, Pizza Settings interface,
and results presentation.

This story connects those existing pieces to a deterministic pizza dough
calculation engine.

The calculator supports Standard thickness only in this story.

Thin and Thick calculation behavior is explicitly reserved for a later story.

---

## Inputs

The calculation uses the existing Pizza Settings values:

- Pizza diameter
- Number of pizzas

Thickness remains fixed at:

    Standard

The calculator should update its results whenever the diameter or number of
pizzas changes.

---

## Reference Pizza

The Standard pizza calculation is based on the following reference:

    Diameter: 16 inches
    Dough Ball Weight: 480 g

A 16-inch Standard pizza therefore requires a 480 g dough ball.

Dough requirements for other diameters are derived from the relative surface
area of the pizza.

---

## Dough Ball Calculation

A pizza is treated as a circle.

The area of a pizza is:

    A = πr²

Because only the ratio between the requested pizza and the reference pizza is
required, π cancels from the calculation.

For a requested diameter `d` and reference diameter `d_ref`:

    areaRatio = (d / d_ref)²

The Standard dough-ball weight is therefore:

    doughBallWeight =
        referenceDoughBallWeight × areaRatio

Using the project's reference values:

    doughBallWeight =
        480 × (diameter / 16)²

Example:

For a 16-inch pizza:

    480 × (16 / 16)² = 480 g

For a 14-inch pizza:

    480 × (14 / 16)² = 367.5 g

---

## Total Dough Calculation

Total dough is determined from the dough-ball weight and number of pizzas:

    totalDoughWeight =
        doughBallWeight × numberOfPizzas

Example:

For four 16-inch pizzas:

    480 × 4 = 1920 g

---

## Pizza Recipe

The calculator uses the following fixed baker's percentage formula:

| Ingredient | Baker's % |
|------------|-----------:|
| Bread Flour | 100% |
| Water | 62% |
| Yeast | 0.4% |
| Salt | 2.5% |
| Sugar | 2.0% |
| Olive Oil | 3.3% |

Bread flour is the 100% base ingredient.

The total baker's percentage is:

    100 + 62 + 0.4 + 2.5 + 2.0 + 3.3 = 170.2%

or, as a multiplier:

    1.702

---

## Flour Calculation

Because total dough weight represents the combined weight of all ingredients,
the required flour weight can be derived from the total formula percentage:

    flourWeight =
        totalDoughWeight / 1.702

Example for 1920 g of total dough:

    flourWeight =
        1920 / 1.702
        ≈ 1128.1 g

---

## Ingredient Calculation

Once flour weight is known, each ingredient is calculated from its baker's
percentage:

    water = flourWeight × 0.62
    yeast = flourWeight × 0.004
    salt = flourWeight × 0.025
    sugar = flourWeight × 0.02
    oliveOil = flourWeight × 0.033

Bread flour remains:

    flour = flourWeight

The ingredient weights should sum to the requested total dough weight, subject
to normal floating-point precision.

---

## Calculation Flow

The calculation can be summarized as:

```text
Diameter
   │
   ▼
Relative Pizza Area
   │
   ▼
Dough Ball Weight
   │
   │ × Number of Pizzas
   ▼
Total Dough Weight
   │
   ▼
Flour Weight
   │
   ▼
Baker's Percentages
   │
   ▼
Ingredient Weights
```

---

## Results

The existing result presentation from Story 003 should display calculated
values rather than placeholder values.

The following values should become dynamic:

### Dough Ball

- Dough-ball weight
- Pizza diameter
- Number of pizzas

### Recipe Summary

- Total Dough
- Total Flour
- Total Water
- Hydration

Hydration remains:

    62%

because the recipe formula is fixed.

### Ingredients

Calculated weights for:

- Bread Flour
- Water
- Yeast
- Salt
- Sugar
- Olive Oil

The baker's percentage column continues to display the fixed percentages
defined by the recipe.

---

## Updating Results

When the user changes the pizza diameter, all calculated weights should update.

When the user changes the number of pizzas, total dough and ingredient
quantities should update.

Changing the number of pizzas must NOT change the dough-ball weight for an
individual pizza.

For example, a 16-inch Standard pizza requires a 480 g dough ball regardless
of whether the user is making one pizza or ten.

---

## Precision and Presentation

Domain calculations should retain sufficient floating-point precision and
should not round intermediate values unnecessarily.

Rounding for display is a presentation concern.

Ingredient quantities may be displayed using sensible gram precision.

Small quantities such as yeast may require decimal precision while larger
ingredient quantities may be displayed as whole grams.

The sum of individually displayed rounded ingredient values is not required
to equal the displayed total dough weight exactly if the difference is caused
only by presentation rounding.

---

## Architecture

Calculation behavior belongs in the domain layer.

The calculation engine should:

- Be implemented in plain TypeScript.
- Use pure functions where practical.
- Have no dependency on React.
- Have no dependency on Material UI.
- Be independently unit-testable.
- Use the project's recipe and reference constants as a single source of truth.

React components should consume the results of the domain calculation rather
than implement the mathematics themselves.

Follow `docs/ARCHITECTURE.md` for architectural boundaries.

---

## Testing

The mathematical behavior introduced by this story should have unit tests.

Tests should include representative calculations and important boundary
conditions.

The existing UI should also be tested where appropriate to verify that user
input results in updated calculated output.

Detailed testing conventions are defined in `docs/TESTING.md`.

---

## Scope

This story implements:

1. Standard pizza dough-ball calculation based on pizza area.
2. Total dough calculation.
3. Flour calculation from total baker's percentage.
4. Ingredient scaling using baker's percentages.
5. Connection between Pizza Settings and calculated results.
6. Dynamic Dough Ball results.
7. Dynamic recipe summary.
8. Dynamic ingredient weights.
9. Unit tests for domain calculations.
10. Relevant integration/UI tests.

---

## Explicitly Out of Scope

Do NOT implement as part of this story:

- Thin pizza calculations
- Thick pizza calculations
- Thickness factors
- Functional thickness selection
- Additional recipes
- User-defined baker's percentages
- Recipe persistence
- Backend services
- External APIs

---

## Acceptance Criteria

- **AC-004-01**: Given the diameter is set to 16 inches, when the Standard
  dough-ball weight is calculated, then it equals 480 g.
- **AC-004-02**: Given the diameter is set to 14 inches, when the Standard
  dough-ball weight is calculated, then it equals 367.5 g (480 ×
  (14/16)²).
- **AC-004-03**: Given the diameter is set to its minimum (10") and
  maximum (20") boundary values, then the Standard dough-ball weight
  equals 187.5 g and 750 g respectively.
- **AC-004-04**: Given a dough-ball weight and a number of pizzas, when
  total dough weight is calculated, then it equals doughBallWeight ×
  numberOfPizzas (e.g., 480 × 4 = 1920 g for four 16-inch Standard
  pizzas).
- **AC-004-05**: Given the canonical reference case of six 16-inch
  Standard pizzas, then total dough weight equals 2880 g, flour ≈
  1692.13 g, water ≈ 1049.12 g, yeast ≈ 6.77 g, salt ≈ 42.30 g, sugar ≈
  33.84 g, and olive oil ≈ 55.84 g, each within normal floating-point/
  display rounding tolerance.
- **AC-004-06**: Given any valid total dough weight, then the sum of the
  calculated ingredient weights (flour, water, yeast, salt, sugar, olive
  oil) equals the total dough weight within normal floating-point
  tolerance.
- **AC-004-07**: Given the application loads, then the Dough Ball, Recipe
  Summary, and Ingredients sections display calculated values derived from
  the current Pizza Settings rather than static placeholder values.
- **AC-004-08**: Given the Recipe Summary is displayed, then the Hydration
  value equals 62%, regardless of the selected diameter or number of
  pizzas.
- **AC-004-09**: Given the user changes the diameter slider, when the
  change is applied, then the Dough Ball weight, Total Dough, Total Flour,
  Total Water, and all ingredient weights update to reflect the new
  diameter.
- **AC-004-10**: Given the user changes the number of pizzas, when the
  change is applied, then Total Dough and all ingredient weights update
  accordingly, but the per-pizza Dough Ball weight does not change (e.g.,
  a 16-inch Standard pizza's dough-ball weight remains 480 g whether 1 or
  10 pizzas are selected).
- **AC-004-11**: Given the Ingredients table is displayed, then the
  baker's percentage column continues to display the fixed percentages
  (Bread Flour 100%, Water 62%, Yeast 0.4%, Salt 2.5%, Sugar 2.0%, Olive
  Oil 3.3%) regardless of the calculated weights.
- **AC-004-12**: Given this story's scope, then only Standard thickness
  produces calculated results; no functional Thin or Thick dough-ball
  calculation is available (reserved for Story 005).
- **AC-004-13**: Given the domain calculation logic, then it is
  implemented as pure, framework-independent TypeScript functions with
  unit tests covering representative calculations and boundary
  conditions, independent of React rendering.

Standard remains the only supported thickness for calculation purposes.

Thickness functionality is reserved for Story 005.

---

## Source of Truth

`docs/PROJECT.md` remains the authoritative source for the application's
overall domain behavior.

This story defines the implementation requirements for the initial Standard
pizza calculator.

The Figma mockups define visual intent only.

Numeric values displayed in the design mockups are illustrative and must not
override the calculation rules defined by the project documentation.