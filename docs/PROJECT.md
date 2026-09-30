# Pizza Dough Calculator — Agent Context

## Project Overview

Pizza Dough Calculator is a small React application that calculates the
amount of dough and individual ingredients required to make a specified
number of pizzas.

The application is deterministic. AI is NOT part of the end-user product.
AI agents are used only as part of the software-development workflow.

## Technology

- React
- TypeScript
- Vite
- Material UI (MUI)
- Unit-testing framework to be configured

Keep the architecture simple. Do not introduce a backend, database,
authentication, state-management framework, or external API unless a
requirement explicitly calls for one.

---

# Product Requirements

The calculator accepts:

1. Pizza diameter in inches
2. Number of pizzas
3. Pizza thickness

The calculator displays:

- Dough-ball weight
- Total dough weight
- Total flour
- Total water
- Hydration
- Ingredient quantities in grams
- Baker's percentage for every ingredient

## Fixed Recipe

The initial application supports one recipe.

| Ingredient | Baker's Percentage |
|-------------|-------------------:|
| Bread Flour | 100.0% |
| Water | 62.0% |
| Yeast | 0.4% |
| Salt | 2.5% |
| Sugar | 2.0% |
| Olive Oil | 3.3% |

Total baker's percentage:

170.2%

Ingredient percentages are always relative to flour weight.

---

# Domain Model

## Reference Pizza

A standard pizza is defined as:

- Diameter: 16 inches
- Dough-ball weight: 480 grams
- Thickness factor: 1.0

This reference point determines the dough loading used by the calculator.

## Diameter Calculation

Pizza dough requirements scale according to pizza AREA, not diameter.

For diameter D:

    area = π × (D / 2)^2

Using the 16-inch / 480-gram reference pizza, dough-ball weight can be
calculated as:

    doughBallWeight = 480 × (diameter / 16)^2

Examples at standard thickness:

| Diameter | Dough Weight |
|----------|-------------:|
| 10 in | 187.5 g |
| 12 in | 270.0 g |
| 14 in | 367.5 g |
| 16 in | 480.0 g |
| 18 in | 607.5 g |
| 20 in | 750.0 g |

## Total Dough

    totalDoughWeight = doughBallWeight × numberOfPizzas

Example:

Six 16-inch pizzas:

    480 × 6 = 2880 g

---

# Recipe Calculation

The sum of the baker's percentages is:

    100 + 62 + 0.4 + 2.5 + 2 + 3.3 = 170.2%

Therefore:

    recipeMultiplier = 1.702

Given required total dough weight W:

    flour = W / 1.702

Other ingredients are calculated relative to flour:

    water = flour × 0.62
    yeast = flour × 0.004
    salt = flour × 0.025
    sugar = flour × 0.02
    oliveOil = flour × 0.033

## Canonical Test Case

Input:

- Diameter: 16 inches
- Number of pizzas: 6
- Standard thickness

Expected:

- Dough ball: 480 g
- Total dough: 2880 g
- Flour: approximately 1692.13 g
- Water: approximately 1049.12 g
- Yeast: approximately 6.77 g
- Salt: approximately 42.30 g
- Sugar: approximately 33.84 g
- Olive oil: approximately 55.84 g

Ingredient weights should sum to approximately 2880 g before display
rounding.

---

# Architecture Guidelines

Keep domain calculations independent from React.

Prefer pure functions such as:

    calculateDoughBallWeight(diameter)
    calculateTotalDoughWeight(doughBallWeight, pizzaCount)
    calculateRecipe(totalDoughWeight)

React components should consume calculation results rather than implement
the mathematical formulas themselves.

Business/domain logic should be independently unit-testable.

Do not duplicate recipe percentages or calculation constants throughout
the UI.

---

# UI Direction

The application should have two primary sections.

## Pizza Settings

Controls for:

- Diameter
- Thickness
- Number of pizzas

Diameter and thickness should use intuitive slider-style controls.

## Recipe Results

Display:

- Dough-ball weight prominently
- Total flour
- Total water
- Hydration

Follow this with an ingredient table containing:

- Ingredient
- Weight in grams
- Baker's percentage

Use Material UI components where appropriate.

The interface should be simple, clean, responsive, and usable on both
desktop and mobile.

---

# IMPORTANT: Intentionally Incomplete Feature

Thickness adjustment is RESERVED FOR THE AGENT DEMONSTRATION.

DO NOT implement thickness calculations unless a later task explicitly
requests implementation of the thickness feature.

The initial application may display a thickness control, but changing it
must NOT affect the dough calculation.

The pre-demo calculation is:

    doughBallWeight = 480 × (diameter / 16)^2

The eventual intended formula is:

    doughBallWeight =
        480 × (diameter / 16)^2 × thicknessFactor

where:

    thicknessFactor = 1.0

represents standard thickness.

This unfinished feature is intentional and must not be "fixed" proactively.

---

# Development Principles

1. Prefer simple solutions.
2. Keep domain logic separate from presentation logic.
3. Avoid unnecessary abstractions.
4. Do not add dependencies without a clear reason.
5. Add or update tests when changing domain behavior.
6. Preserve existing functionality when implementing new features.
7. Read the requirements before modifying code.
8. Do not implement functionality explicitly marked as reserved for the
   agent demonstration.