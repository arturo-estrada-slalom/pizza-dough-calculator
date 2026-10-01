# Story 003 — Results Presentation

## Status

Verified

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

## Feature Summary

This story adds the results-presentation side of the application established
by Stories 001–002: a prominent Dough Ball result card, a Recipe Summary
metrics section, and an Ingredients section, all rendered with representative
placeholder data. It reproduces the visual hierarchy and dark hero-card
treatment of the design mockups using the color tokens defined in
`docs/COLOR_PALETTE.md`, and responsively positions the results area beside
(desktop) or below (mobile) the existing Pizza Settings panel. It introduces
no calculation logic and no wiring between Pizza Settings and the displayed
values — those remain reserved for Story 004.

## Functional Requirements

1. The application shall render a Dough Ball result section containing a
   "Dough Ball" label, a numeric weight value, a "g" unit, a pizza-count
   indicator (e.g. "× 4"), and contextual text describing the pizza
   configuration (e.g. `per 16" standard pizza`), using representative
   placeholder values.
2. The Dough Ball result section shall be rendered as a prominent card
   using the Dark surface color token (`#2C1F14`) from
   `docs/COLOR_PALETTE.md` for its background, with the weight number
   rendered using the Warm gold token (`#F5C896`), both sourced via the
   shared Material UI theme (`src/theme.ts`) rather than hardcoded
   locally.
3. The application shall render a Recipe Summary section containing four
   labeled metrics, in this order: Total Dough, Total Flour, Total Water,
   and Hydration — each displaying a value, its appropriate unit (grams
   for weight metrics, percent for Hydration), and its label, using
   representative placeholder values.
4. The application shall render an Ingredients section listing all six
   ingredients — Bread Flour, Water, Yeast, Salt, Sugar, Olive Oil — each
   row showing the ingredient name, a weight in grams, and a baker's
   percentage.
5. The displayed baker's percentages shall be the fixed, literal values
   defined by `docs/PROJECT.md` and this story (Bread Flour 100%, Water
   62%, Yeast 0.4%, Salt 2.5%, Sugar 2.0%, Olive Oil 3.3%) rather than
   values computed by calculation logic.
6. The Bread Flour row shall be visually distinguished from the other
   ingredient rows as the 100% base ingredient (e.g. a "BASE"-style
   label/chip and/or row highlight), consistent with the design
   reference, using the Primary tint overlay token from
   `docs/COLOR_PALETTE.md` rather than an arbitrary color.
7. The Ingredients section shall also display a total dough weight value,
   consistent with the design reference.
8. The Recipe Summary and Ingredients sections shall be rendered as
   card/panel surfaces using the Card / Paper background token
   (`#FFFCF5`) from `docs/COLOR_PALETTE.md`, applied via the shared
   Material UI theme.
9. The placeholder values used across the Dough Ball, Recipe Summary, and
   Ingredients sections shall come from a single, internally consistent
   representative data set rather than independently invented numbers —
   for example, dough-ball weight × pizza count should approximate the
   displayed total dough weight, and the displayed ingredient weights
   should approximate the displayed total dough weight when summed,
   consistent with the relationships shown in the design mockups. This
   placeholder data set does not need to reflect the live Pizza Settings
   control values, per the Explicitly Out of Scope section.
10. Changing any Pizza Settings control (diameter, thickness, or number of
    pizzas) shall not change any value displayed in the Dough Ball,
    Recipe Summary, or Ingredients sections, because this story introduces
    no calculation wiring (reserved for Story 004).
11. At wider viewport widths (per MUI breakpoints), the results area shall
    be positioned to the right of the Pizza Settings panel, in the
    vertical order Dough Ball → Recipe Summary → Ingredients, consistent
    with `docs/designs/desktop-pizza-layout.png`.
12. At narrower viewport widths (per MUI breakpoints), the results area
    shall stack below the Pizza Settings panel, preserving the order
    Pizza Settings → Dough Ball → Recipe Summary → Ingredients, consistent
    with `docs/designs/mobile-layout.png`, and the Ingredients section
    shall remain readable without clipping or horizontal overflow.
13. This story shall not introduce or call any pizza-geometry,
    dough-ball-weight, total-dough, recipe-scaling, or baker's-percentage
    calculation function; every numeric value rendered by this story is a
    static, representative placeholder.
14. Placeholder data shall be kept clearly separated from
    application/domain logic (e.g. isolated as clearly labeled
    presentation-level constants, not mixed into shared domain code) so
    that Story 004 can later replace it with calculated values without a
    substantial redesign of these components, per
    `docs/ARCHITECTURE.md` and `docs/CODING_STANDARDS.md`.
15. The implementation shall not add a new runtime dependency to render
    these sections; only the currently approved dependencies
    (`@mui/material`, `@emotion/react`, `@emotion/styled`, `react`,
    `react-dom`) may be used.

## Constraints

- No domain layer code (calculation functions, recipe/reference
  constants used for computation) may be introduced or modified by this
  story; all Dough Ball, Recipe Summary, and Ingredients values are
  static presentation-level placeholder data (`docs/ARCHITECTURE.md`,
  `docs/PROJECT.md`).
- Baker's percentage values (100%, 62%, 0.4%, 2.5%, 2.0%, 3.3%) are fixed
  literal display values for this story, not the output of a
  calculation; they must match `docs/PROJECT.md` exactly.
- Styled components must live in sibling `<FileName>.styled.tsx` files
  per the existing convention (e.g. `AppHeader.styled.tsx`,
  `PizzaSettings.styled.tsx`).
- Color values must be sourced from `docs/COLOR_PALETTE.md` through the
  single shared theme in `src/theme.ts` — specifically the Dark surface,
  Warm gold, Card/Paper, and Primary tint tokens needed by this story —
  not re-declared as raw hex/rgba values in component code
  (`docs/CODING_STANDARDS.md` §9). If a required token is not yet present
  in `src/theme.ts`, it should be added to the shared theme rather than
  hard-coded locally.
- No specific pixel breakpoint is mandated; the Implementation Agent
  should use a breakpoint consistent with the approach already
  established by Stories 001 and 002.
- The Pizza Settings controls (diameter, thickness, pizza count) must
  remain exactly as implemented by Story 002; this story must not modify
  their behavior, only ensure interacting with them has no effect on the
  results sections.
- No pizza geometry, dough-ball, total-dough, recipe-scaling, or baker's
  percentage calculation logic may be implemented, per the Explicitly Out
  of Scope section and `docs/PROJECT.md`'s reserved-feature guidance.

## Edge Cases

- Long or multi-digit placeholder numeric values (e.g. a 4-digit total
  dough weight) must not overflow, clip, or wrap awkwardly within the
  Dough Ball card or Recipe Summary metrics on narrow screens.
- The Ingredients section must remain readable on narrow/mobile
  viewports (e.g. via responsive row layout or horizontal scrolling)
  without clipping ingredient names, weights, or baker's-percentage
  values.
- Viewport resize/orientation change across the responsive breakpoint
  while the results area is visible must preserve the displayed
  placeholder values and the Dough Ball → Recipe Summary → Ingredients
  order without resetting or duplicating sections.
- Rapid or repeated interaction with Pizza Settings controls (slider
  drag, rapid increment/decrement, boundary values such as 1 or 100
  pizzas, or 10" or 20" diameter) must leave all displayed results values
  unchanged.
- Very narrow viewports must not cause horizontal overflow of the Dough
  Ball card, Recipe Summary metrics, or Ingredients section.

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
- **AC-003-12**: Given the application loads, then the Dough Ball card
  background uses the Dark surface color token (`#2C1F14`) and the
  dough-ball weight number uses the Warm gold token (`#F5C896`) from
  `docs/COLOR_PALETTE.md`, applied via the shared Material UI theme
  (`src/theme.ts`) rather than a component-local hard-coded color value.
- **AC-003-13**: Given the application loads, then the Recipe Summary and
  Ingredients sections are presented as card/panel surfaces using the
  Card / Paper background token (`#FFFCF5`) from
  `docs/COLOR_PALETTE.md`, applied via the shared Material UI theme.
- **AC-003-14**: Given the application loads, then the Bread Flour row is
  visually distinguished using the Primary tint overlay token from
  `docs/COLOR_PALETTE.md` (e.g. a "BASE" label/chip and/or row
  highlight), applied via the shared Material UI theme rather than an
  arbitrary color.
- **AC-003-15**: Given the application loads, then the placeholder values
  shown across the Dough Ball, Recipe Summary, and Ingredients sections
  are mutually consistent (dough-ball weight × pizza-count indicator
  approximates the displayed total dough weight, and the six ingredient
  weights approximate the displayed total dough weight when summed),
  rather than independently invented, unrelated numbers.
- **AC-003-16**: Given the implementation is complete, then no new
  runtime dependency has been added to `package.json` to render the
  Dough Ball, Recipe Summary, or Ingredients sections.

## Open Questions

None remaining.