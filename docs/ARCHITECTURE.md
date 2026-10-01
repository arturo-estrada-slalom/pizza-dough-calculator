# Architecture Guide

## Purpose

This document describes the architecture of the Pizza Dough Calculator and
the boundaries that should be preserved when modifying the application.

The application is intentionally small. Prefer simple solutions and do not
introduce additional architectural layers unless a concrete requirement
justifies them.

---

## Architecture Overview

The application consists of three conceptual areas:

```text
┌──────────────────────────────────────┐
│          Presentation Layer          │
│                                      │
│   React Components + Material UI     │
│                                      │
│   - Pizza settings                   │
│   - User inputs                      │
│   - Recipe results                   │
└──────────────────┬───────────────────┘
                   │
                   │ calls
                   ▼
┌──────────────────────────────────────┐
│             Domain Layer             │
│                                      │
│   Pure TypeScript                    │
│                                      │
│   - Pizza geometry                   │
│   - Dough weight calculation         │
│   - Baker's percentage calculation   │
│   - Recipe scaling                   │
└──────────────────┬───────────────────┘
                   │
                   │ uses
                   ▼
┌──────────────────────────────────────┐
│          Domain Configuration        │
│                                      │
│   - Recipe definitions               │
│   - Reference pizza constants        │
│   - Baker's percentages              │
└──────────────────────────────────────┘
```

The dependency direction is:

    Presentation → Domain → Domain Configuration

Dependencies must not point in the opposite direction.

---

## Presentation Layer

The presentation layer is implemented using React and Material UI.

It is responsible for:

- Displaying application controls.
- Managing UI state.
- Responding to user interaction.
- Calling domain functions when input values change.
- Displaying calculation results.
- Formatting values for presentation.

Typical application state includes:

- Pizza diameter
- Number of pizzas
- Pizza thickness

The presentation layer must not implement pizza geometry, baker's percentage
calculations, or recipe scaling logic.

React components should consume results produced by the domain layer.

---

## Domain Layer

The domain layer contains the application's business logic.

It should be implemented using plain TypeScript and pure functions whenever
practical.

Examples include:

    calculateDoughBallWeight(diameter)
    calculateTotalDoughWeight(doughBallWeight, pizzaCount)
    calculateRecipe(totalDoughWeight)

Domain functions should:

- Accept explicit inputs.
- Return predictable outputs.
- Avoid side effects.
- Be independently unit-testable.
- Have no dependency on React, Material UI, or browser APIs.

The domain layer must not import from the presentation layer.

---

## Domain Configuration

Values defining the pizza formula should be separated from the algorithms
that operate on them.

Examples include the reference pizza:

```ts
export const REFERENCE_PIZZA = {
  diameter: 16,
  doughWeight: 480,
}
```

and the initial recipe:

```ts
export const PIZZA_RECIPE = {
  flour: 1,
  water: 0.62,
  yeast: 0.004,
  salt: 0.025,
  sugar: 0.02,
  oliveOil: 0.033,
}
```

Recipe definitions and reference values should have a single source of truth.
Do not duplicate these constants in React components or calculation functions.

This separation allows calculation behavior to remain independent from the
specific recipe being calculated.

---

## Suggested Project Structure

The exact structure may evolve as requirements change, but the project should
generally follow this organization:

```text
src/
├── components/
│   ├── PizzaSettings.tsx
│   └── RecipeResults.tsx
│
├── domain/
│   ├── doughCalculator.ts
│   ├── recipeCalculator.ts
│   ├── recipe.ts
│   └── types.ts
│
├── test/
│   └── setup.ts
│
├── App.tsx
└── main.tsx
```

Do not create directories or abstractions solely to match this example.
Structure should reflect actual application needs.

---

## State Management

React's built-in state management is sufficient for the current application.

Prefer local state and normal React data flow.

Do not introduce a global state-management library unless application
requirements become complex enough to justify one.

Calculated values should generally be derived from existing state rather than
stored as independent state when possible.

For example:

    diameter + pizzaCount
            ↓
    domain calculations
            ↓
    recipe results

---

## Testing Boundaries

The architecture should allow domain behavior to be tested independently from
the UI.

Domain tests should call calculation functions directly.

UI tests should verify user-visible behavior and interaction rather than
reimplementing or duplicating domain calculation tests.

Detailed testing conventions are defined in `docs/TESTING.md`.

---

## External Dependencies

The application currently requires no:

- Backend
- Database
- Authentication
- Persistence layer
- External API
- Server-side state

Do not introduce these systems unless required by a future feature.

Third-party dependencies should only be added when they solve a concrete
project requirement.

---

## Architectural Principles

When modifying the application:

1. Keep business logic outside React components.
2. Keep domain code independent from React and Material UI.
3. Maintain a single source of truth for recipe and reference constants.
4. Prefer pure functions for calculations.
5. Prefer derived values over duplicated state.
6. Keep dependencies flowing from presentation toward the domain.
7. Avoid unnecessary abstractions.
8. Do not add architectural layers without a concrete need.
9. Follow `docs/CODING_STANDARDS.md` for implementation conventions.
10. Follow `docs/TESTING.md` for testing conventions.

When a proposed solution can be implemented cleanly within the existing
architecture, prefer that solution over introducing a new architectural
pattern.