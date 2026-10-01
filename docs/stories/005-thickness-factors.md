# Story 005 — Pizza Thickness Factors

## Status

Draft

## User Story

As a pizza maker,
I want to choose between Thin, Standard, and Thick pizza styles,
so that the calculator adjusts the amount of dough required for each pizza
while preserving the selected diameter and recipe proportions.

## Context

Story 004 implements a working pizza dough calculator using Standard thickness.

The Pizza Settings interface already presents three thickness options:

- Thin
- Standard
- Thick

Until this story, Standard is the only functional thickness and uses the
existing dough calculation without modification.

This story activates the thickness selector and incorporates thickness into
the dough calculation.

---

## Thickness Options

The calculator supports exactly three thickness options:

| Thickness | Factor |
|-----------|-------:|
| Thin | 0.80 |
| Standard | 1.00 |
| Thick | 1.20 |

Standard remains the default selection.

Thickness factors represent a multiplier applied to the Standard dough-ball
weight.

These factors are product configuration values and should have a single
source of truth.

---

## Standard Dough Calculation

The existing Standard calculation remains unchanged.

For a requested diameter `d`:

    standardDoughBallWeight =
        referenceDoughBallWeight × (d / referenceDiameter)²

Using the project reference:

    standardDoughBallWeight =
        480 × (diameter / 16)²

For a 16-inch pizza:

    standardDoughBallWeight = 480 g

---

## Thickness Calculation

The selected thickness factor is applied to the Standard dough-ball weight:

    doughBallWeight =
        standardDoughBallWeight × thicknessFactor

Therefore:

### Thin

    doughBallWeight =
        standardDoughBallWeight × 0.80

### Standard

    doughBallWeight =
        standardDoughBallWeight × 1.00

### Thick

    doughBallWeight =
        standardDoughBallWeight × 1.20

---

## Reference Examples

For a 16-inch pizza, the Standard dough-ball weight is:

    480 g

The three thickness options therefore produce:

| Thickness | Calculation | Dough Ball |
|-----------|-------------|-----------:|
| Thin | 480 × 0.80 | 384 g |
| Standard | 480 × 1.00 | 480 g |
| Thick | 480 × 1.20 | 576 g |

These values provide canonical examples for testing.

---

## Relationship to Pizza Diameter

Thickness modifies the dough required for the selected pizza area.

Diameter scaling should continue to use the existing area-based calculation.

Conceptually:

    reference dough weight
            ↓
    diameter / area scaling
            ↓
    Standard dough-ball weight
            ↓
    thickness factor
            ↓
    Final dough-ball weight

Equivalently:

    doughBallWeight =
        480
        × (diameter / 16)²
        × thicknessFactor

Thickness must not change the selected pizza diameter.

---

## Total Dough

Total dough continues to be calculated from the final dough-ball weight:

    totalDoughWeight =
        doughBallWeight × numberOfPizzas

Example:

Four 16-inch Thin pizzas:

    384 × 4 = 1536 g

Four 16-inch Standard pizzas:

    480 × 4 = 1920 g

Four 16-inch Thick pizzas:

    576 × 4 = 2304 g

---

## Recipe Scaling

Changing thickness changes the amount of dough required but does NOT change
the recipe formula.

The baker's percentages remain:

| Ingredient | Baker's % |
|------------|-----------:|
| Bread Flour | 100% |
| Water | 62% |
| Yeast | 0.4% |
| Salt | 2.5% |
| Sugar | 2.0% |
| Olive Oil | 3.3% |

The total formula remains:

    170.2%

Hydration therefore remains:

    62%

Ingredient quantities should scale proportionally with the new total dough
weight.

Changing thickness must not alter any baker's percentage.

---

## Thickness Selector Behavior

The existing thickness control becomes interactive as part of this story.

The user should be able to select:

    Thin | Standard | Thick

Only one thickness may be selected at a time.

Standard should be selected by default when the application first loads.

Visual indication of the selected option should use the colors defined in
`docs/COLOR_PALETTE.md` (e.g. the primary accent used for sliders and
selected toggles).

When the user selects another thickness:

1. The selected option should be visually indicated.
2. Dough-ball weight should update.
3. Total dough weight should update.
4. Total flour should update.
5. Total water should update.
6. All ingredient weights should update.
7. The displayed baker's percentages should remain unchanged.
8. Hydration should remain 62%.

The results should update without requiring a separate Calculate or Submit
action.

---

## Dough Ball Presentation

The Dough Ball result should reflect the selected thickness.

For example:

    384 g
    per 16" thin pizza

or:

    576 g
    per 16" thick pizza

The existing number-of-pizzas indicator should continue to represent the
selected pizza quantity.

---

## State

Thickness becomes part of the calculator's active input state.

The calculator inputs are now:

    diameter
    thickness
    numberOfPizzas

Calculated results should be derived from these inputs.

Thickness should not create an independent copy of calculated result state.

---

## Architecture

Thickness calculation belongs in the domain layer.

React is responsible for:

- Capturing the selected thickness.
- Passing the selected value into the calculation layer.
- Rendering the resulting values.

React components must not contain thickness calculation formulas.

Thickness factors should be defined as domain configuration rather than
duplicated throughout UI components or calculation functions.

Follow `docs/ARCHITECTURE.md`.

---

## Testing

The new thickness behavior should be independently testable.

Domain tests should verify at minimum:

- Thin factor calculation.
- Standard factor calculation.
- Thick factor calculation.
- Standard preserves the existing Story 004 behavior.
- Thickness scales dough weight proportionally.
- Recipe percentages remain unchanged.

UI tests should verify the relevant user interaction and observable result
updates.

Detailed testing conventions are defined in `docs/TESTING.md`.

---

## Acceptance Criteria

- **AC-005-01**: Given the application loads, then the Thickness selector
  allows selecting exactly one of Thin, Standard, or Thick at a time, with
  Standard selected by default.
- **AC-005-02**: Given the diameter is 16 inches and Thin is selected,
  when the dough-ball weight is calculated, then it equals 384 g (480 ×
  0.80).
- **AC-005-03**: Given the diameter is 16 inches and Standard is selected,
  when the dough-ball weight is calculated, then it equals 480 g (480 ×
  1.00), matching Story 004 behavior.
- **AC-005-04**: Given the diameter is 16 inches and Thick is selected,
  when the dough-ball weight is calculated, then it equals 576 g (480 ×
  1.20).
- **AC-005-05**: Given a selected thickness and diameter, then the
  dough-ball weight equals the Standard dough-ball weight (480 ×
  (diameter/16)²) multiplied by the selected thickness factor.
- **AC-005-06**: Given four 16-inch pizzas, then total dough weight equals
  1536 g for Thin, 1920 g for Standard, and 2304 g for Thick.
- **AC-005-07**: Given the user selects a different thickness option, when
  the selection changes, then the newly selected option is visually
  indicated as active and the previously selected option is no longer
  indicated as active.
- **AC-005-08**: Given the user selects a different thickness option, when
  the selection changes, then the Dough Ball weight, Total Dough, Total
  Flour, and Total Water values update without requiring any additional
  confirmation or submit action.
- **AC-005-09**: Given the user selects a different thickness option, when
  the selection changes, then all ingredient weights (Bread Flour, Water,
  Yeast, Salt, Sugar, Olive Oil) update to reflect the new total dough
  weight.
- **AC-005-10**: Given the user selects a different thickness option, when
  the selection changes, then the displayed baker's percentages (100%,
  62%, 0.4%, 2.5%, 2.0%, 3.3%) remain unchanged.
- **AC-005-11**: Given the user selects a different thickness option, when
  the selection changes, then the Hydration value remains 62%.
- **AC-005-12**: Given a thickness other than Standard is selected, then
  the Dough Ball result's contextual text reflects the selected thickness
  (e.g., referencing "thin" or "thick" rather than "standard").
- **AC-005-13**: Given the user changes the pizza diameter while a
  non-Standard thickness is selected, then the selected thickness remains
  selected and continues to be applied to the new diameter's calculation.
- **AC-005-14**: Given the thickness factors (Thin 0.80, Standard 1.00,
  Thick 1.20), then they are defined once as domain configuration values
  and are not duplicated or hard-coded separately within React components
  or other calculation functions.
- **AC-005-15**: Given the domain thickness calculation, then it is
  implemented as a pure, framework-independent function with unit tests
  verifying the Thin, Standard, and Thick factor calculations, that
  Standard preserves existing Story 004 behavior, that scaling is
  proportional, and that baker's percentages remain unchanged.

## Regression Requirements

The implementation must preserve the behavior introduced by previous stories.

In particular:

- Diameter selection must continue to work.
- Number-of-pizzas selection must continue to work.
- Standard thickness must produce the same results as before this story.
- Pizza quantity must not affect individual dough-ball weight.
- Diameter scaling must remain area-based.
- Ingredient proportions must remain unchanged.
- Responsive behavior from previous stories must remain intact.

---

## Scope

This story implements:

1. Functional Thin selection.
2. Functional Standard selection.
3. Functional Thick selection.
4. Thickness factors in the domain model.
5. Thickness-adjusted dough-ball calculations.
6. Thickness-adjusted total dough calculations.
7. Proportional ingredient scaling.
8. Dynamic result updates when thickness changes.
9. Display of the selected thickness in the Dough Ball result.
10. Automated tests for thickness behavior.

---

## Explicitly Out of Scope

Do NOT implement as part of this story:

- Custom user-defined thickness factors
- Continuous thickness adjustment
- Additional pizza styles
- Different recipes per thickness
- Different hydration per thickness
- Different fermentation formulas per thickness
- User-defined baker's percentages
- Recipe persistence
- Backend services
- External APIs

Thin, Standard, and Thick differ only by their dough-weight scaling factor.

---

## Source of Truth

`docs/PROJECT.md` remains the authoritative source for the overall pizza
calculator domain.

This story introduces the thickness configuration:

    Thin     = 0.80
    Standard = 1.00
    Thick    = 1.20

The design mockups remain the source of truth for visual intent.

Values shown in the design mockups must not override the domain calculations
defined by the project documentation and this story.