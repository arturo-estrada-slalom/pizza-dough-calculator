# Story 003 — Results Presentation

## Status

Draft

## User Story

As a user,
I want the calculated dough and recipe information presented clearly,
so that I can quickly understand how much dough and how much of each
ingredient I will need.

## Design References

The approved visual references for this story are:

- `docs/designs/desktop-pizza-layout.png`
- `docs/designs/mobile-layout.png`

For this story, use the mockups as references for the results presentation
only.

`docs/COLOR_PALETTE.md` is the authoritative source for exact color
values, including the Dough Ball hero card's dark surface and warm-gold
number treatment; use it rather than estimating colors from these
mockups.

The application shell and header belong to Story 001.

The Pizza Settings panel belongs to Story 002.

This story implements the visual presentation of results but does NOT
implement the calculations that produce those results.

---

## Results Overview

The results area consists of three primary sections:

1. Dough Ball result
2. Recipe summary
3. Ingredients table

These sections should follow the visual hierarchy established by the
provided design references.

---

## Dough Ball Result

The Dough Ball result is the most visually prominent calculated value in
the application.

It should display:

- "Dough Ball" label
- Dough-ball weight in grams
- Unit of measurement
- Number of pizzas
- Context describing the pizza configuration

The design reference presents this information using a prominent dark card.

For this story, representative placeholder values may be used.

Example:

    Dough Ball
    480 g
    per 16" standard pizza

    × 4

The exact placeholder values are not important.

This story does not calculate dough-ball weight.

---

## Recipe Summary

Below the Dough Ball result, display a summary of the overall recipe.

The summary contains:

- Total Dough
- Total Flour
- Total Water
- Hydration

Each metric should clearly display:

- Its value
- Its unit where applicable
- Its label

Representative placeholder values may be used for this story.

The summary should follow the visual grouping and hierarchy shown in the
design reference.

---

## Ingredients

Display the recipe ingredients in a structured results section.

The ingredients are:

- Bread Flour
- Water
- Yeast
- Salt
- Sugar
- Olive Oil

For each ingredient, display:

- Ingredient name
- Weight in grams
- Baker's percentage

Bread Flour should be visually identifiable as the 100% base ingredient,
consistent with the design reference.

The fixed baker's percentages defined by the project are:

| Ingredient | Baker's % |
|------------|-----------:|
| Bread Flour | 100% |
| Water | 62% |
| Yeast | 0.4% |
| Salt | 2.5% |
| Sugar | 2.0% |
| Olive Oil | 3.3% |

The ingredients section should also display total dough weight as represented
in the design.

Ingredient weights may use representative placeholder values in this story.

---

## Implementation Context

The application uses:

- React
- TypeScript
- Material UI

Material UI is the project's primary component library.

Use Material UI components and layout primitives where appropriate while
preserving the visual intent of the supplied mockups.

Follow the project's architecture and coding standards.

The result presentation should be designed so that static placeholder values
can later be replaced by calculated values without requiring a substantial
redesign of the components.

---

## Responsive Intent

On desktop, the results area appears to the right of the Pizza Settings panel.

The expected visual order is:

    Dough Ball
        ↓
    Recipe Summary
        ↓
    Ingredients

On smaller screens, the results should stack vertically below the Pizza
Settings panel.

The same logical order should be preserved:

    Pizza Settings
        ↓
    Dough Ball
        ↓
    Recipe Summary
        ↓
    Ingredients

The ingredients presentation must remain readable on smaller screens.

The implementation does not need to reproduce the mockups pixel-for-pixel,
but should preserve their visual hierarchy and overall design language.

---

## Scope

This story implements:

1. Dough Ball result card.
2. Recipe summary section.
3. Ingredients results section.
4. Ingredient names.
5. Ingredient weight presentation.
6. Baker's percentage presentation.
7. Total dough presentation.
8. Responsive results layout.
9. Representative placeholder data required to render the components.

---

## Explicitly Out of Scope

Do NOT implement as part of this story:

- Pizza geometry calculations
- Dough-ball weight calculations
- Total dough calculations
- Recipe scaling calculations
- Baker's percentage calculation logic
- Connections between Pizza Settings and result values
- Thin or Thick calculation behavior
- Thickness factors

Changing the settings controls does not need to update the result values
as part of this story.

The purpose of this story is to establish the result presentation components,
not the calculation engine.

---

## Placeholder Data

Placeholder values used by this story exist only to demonstrate the
presentation.

They must not become domain constants or sources of truth.

Where practical, keep placeholder data clearly separated from application
business logic so that Story 004 can replace it with calculated values.

The project's actual mathematical behavior is defined by
`docs/PROJECT.md`.

---

## Design vs. Domain Behavior

The design mockups are the source of truth for visual intent.

`docs/PROJECT.md` is the source of truth for:

- Pizza geometry
- Dough calculations
- Recipe definitions
- Baker's percentages
- Domain constants

If illustrative values in the mockups conflict with the documented domain
model, the documented domain model takes precedence.

---

## Acceptance Criteria

- **AC-003-01**: Given the application loads, then a Dough Ball result
  section is displayed containing a "Dough Ball" label, a numeric weight
  value, a grams unit, a pizza-count indicator, and contextual text
  describing the pizza configuration.
- **AC-003-02**: Given the application loads, then a Recipe Summary
  section is displayed containing four labeled metrics: Total Dough,
  Total Flour, Total Water, and Hydration, each showing a value and its
  appropriate unit.
- **AC-003-03**: Given the application loads, then an Ingredients section
  is displayed listing all six ingredients: Bread Flour, Water, Yeast,
  Salt, Sugar, and Olive Oil.
- **AC-003-04**: Given the application loads, then each ingredient row
  displays the ingredient name, a weight in grams, and a baker's
  percentage value.
- **AC-003-05**: Given the application loads, then Bread Flour is visually
  distinguished from the other ingredient rows as the base ingredient.
- **AC-003-06**: Given the application loads, then the displayed baker's
  percentages are exactly: Bread Flour 100%, Water 62%, Yeast 0.4%, Salt
  2.5%, Sugar 2.0%, and Olive Oil 3.3%.
- **AC-003-07**: Given the application loads, then the Hydration metric in
  the Recipe Summary displays 62%, consistent with the fixed recipe's
  water baker's percentage.
- **AC-003-08**: Given the application loads, then the Ingredients section
  also displays a total dough weight value.
- **AC-003-09**: Given the user changes any Pizza Settings control
  (diameter, thickness, or number of pizzas), then the values displayed in
  the Dough Ball, Recipe Summary, and Ingredients sections do not change as
  a result (calculation wiring is out of scope for this story).
- **AC-003-10**: Given the application loads on a desktop-width viewport,
  then the results area is positioned to the right of the Pizza Settings
  panel, in the vertical order: Dough Ball, Recipe Summary, Ingredients.
- **AC-003-11**: Given the application loads on a narrow/mobile viewport,
  then the results area stacks below the Pizza Settings panel, preserving
  the order: Dough Ball, Recipe Summary, Ingredients.