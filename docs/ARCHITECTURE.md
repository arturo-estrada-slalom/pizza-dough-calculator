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

React components should consume results produced by the domain layer. See
"Utility and Helper Organization" below for how to handle component-specific
or reusable supporting logic that is not domain behavior.

### Visual Design and Color Source of Truth

Design mockups under `docs/designs/` define layout, visual hierarchy,
component arrangement, spacing intent, and responsive visual direction.

`docs/COLOR_PALETTE.md` is the authoritative source for application color
values and their intended usage. When a color visible in a mockup or
screenshot differs from, or is ambiguous relative to, the color guide, the
color guide takes precedence.

Color values should be defined once, through Material UI's theme
mechanism, rather than duplicated as raw hex values throughout
components. See `docs/CODING_STANDARDS.md` for the required approach.

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

## Localization

The application supports two locales: English (`en-US`, the runtime fallback
locale) and Spanish (`es-MX`). See `docs/stories/007-language-localization.md`
for the behavior this establishes.

Localization is a presentation-layer concern:

- User-facing strings must be rendered through the application's
  localization mechanism (translation keys resolved against per-locale
  translation resources), not hard-coded directly in JSX.
- The domain layer and domain configuration must have no dependency on the
  localization/i18n library. Domain code must not import it, and must not
  branch on the active language.
- Where the domain layer already exposes stable identifiers (ingredient
  keys such as `flour`/`water`/`yeast`, thickness keys such as
  `thin`/`standard`/`thick`), the presentation layer resolves translated
  display text from those identifiers (e.g. an `ingredients.flour`
  translation key) rather than storing display strings in domain
  configuration. Domain configuration remains the single source of truth
  for calculation values (baker's percentages, reference constants,
  thickness factors) — never for translated display text.
- Changing a translated label must never require changing domain logic,
  domain types, or domain configuration, and must never change a
  calculated result (see "Testing Boundaries").
- Translation resources must exist for every supported locale and must
  maintain structural key parity across locales (`keys(en-US) ==
  keys(es-MX)`). A key present in only one locale's resource is a defect.
- New user-facing content introduced by any future feature must be added
  through the localization mechanism, with a translation provided for
  every supported locale, rather than hard-coded.
- Locale-specific numeric, unit-system, currency, and date/time formatting
  are out of scope for this application; localization affects displayed
  text only and must not alter calculator mathematics or numeric results.

The exact localization library and resource file organization are technical
implementation decisions, made following the principles above and the
project's `docs/CODING_STANDARDS.md`.

---

## Utility and Helper Organization

Non-rendering supporting logic in this project falls into three distinct
categories, and they must not be mixed:

1. **Component-specific supporting logic** — validators, mappers,
   formatters, transformers, or other small helpers that exist for one
   component or feature and are not meaningfully reusable elsewhere.
2. **Reusable, general-purpose utilities** — generic, presentation-agnostic
   technical helpers that are used by, or clearly reusable across, multiple
   unrelated components or areas of the application.
3. **Domain/business logic** — the pizza geometry, dough-ball, baker's
   percentage, recipe-scaling, and thickness-factor behavior described
   above, which belongs exclusively in the Domain Layer.

### Decision Rule

When extracting non-rendering logic out of a component, apply this rule:

```text
Does the logic represent business/domain behavior?
    YES -> Domain Layer (src/domain/)

    NO
    │
    ▼
Is the logic specific to one component or feature?
    YES -> Colocate with that component
           <ComponentName>.<utility-type>.ts

    NO
    │
    ▼
Is it genuinely reusable/general-purpose?
    YES -> src/utils/
```

Do not create abstractions solely for hypothetical future reuse. Prefer
colocation until genuine reuse, or clearly general applicability, exists.

### Component-Specific Logic

Supporting logic tightly coupled to a single component's responsibility
(component-specific validators, mappers, formatters, transformers, and
similar small helpers) should remain colocated with that component.

When such logic is extracted into its own file, name it:

    <ComponentName>.<utility-type>.ts

using a descriptive utility type such as `helper`, `validator`, `mapper`,
`formatter`, or `transformer`. For example:

    PizzaSettings.validator.ts
    PizzaSettings.mapper.ts
    RecipeResults.helper.ts

Do not extract trivial logic into a separate file merely to satisfy this
naming convention — extraction should improve readability, testability, or
separation of concerns.

### Reusable Utilities (`src/utils/`)

Logic that is generic enough to be reused by multiple unrelated components
or areas of the application belongs under `src/utils/` (for example,
`src/utils/formatWeight.ts`, `src/utils/clamp.ts`).

Utilities under `src/utils/` should:

- Be independent of individual React components.
- Have a clear, focused responsibility.
- Prefer pure functions where practical.
- Avoid dependencies on presentation components.
- Be reusable without importing component-specific implementation details.

Do not move a helper into `src/utils/` merely because it could theoretically
be reused someday — prefer colocation until genuine reuse or clear general
applicability exists.

### Domain Logic Is Not Utility Logic

Business/domain behavior (pizza geometry, dough-ball calculations, baker's
percentage calculations, recipe scaling, thickness factors, and similar
rules) must remain in the Domain Layer (`src/domain/`). `src/utils/` is for
reusable technical/supporting functions, not a generic location for business
logic. Moving domain behavior into `src/utils/`, or into a component,
violates the dependency direction and layer boundaries defined by this
document.

### Keeping Components Focused

React components should primarily be responsible for presentation,
interaction, and composition. When a component file accumulates
non-rendering logic that obscures that responsibility, evaluate whether the
logic should be:

- Moved into the Domain Layer, if it represents business behavior.
- Extracted into a colocated `<ComponentName>.<utility-type>.ts` file, if it
  is component-specific.
- Moved into `src/utils/`, if it is genuinely generic and reusable.

There is no file-size threshold that triggers extraction. Base the decision
on responsibility and cohesion, not line count.

`docs/CODING_STANDARDS.md` references this section rather than duplicating
the decision rule.

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
├── utils/
│   └── formatWeight.ts
│
├── test/
│   └── setup.ts
│
├── App.tsx
└── main.tsx
```

Do not create directories or abstractions solely to match this example.
Structure should reflect actual application needs. In particular, do not
create `src/utils/` preemptively — add it only once a genuinely reusable
utility exists (see "Utility and Helper Organization" above).

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
- Server-side state
- External API

Do not introduce these systems unless required by a future feature.

The only approved client-side persistence is the browser's `localStorage`,
used solely to persist the user's selected language preference (see
"Localization" above and `docs/stories/007-language-localization.md`). This
is not a general-purpose persistence layer — do not use `localStorage` or
introduce other persistence mechanisms for unrelated application state
without a concrete requirement.

Third-party dependencies should only be added when they solve a concrete
project requirement. A localization/i18n library is an approved dependency
category for implementing the "Localization" section above; the specific
library choice follows `docs/CODING_STANDARDS.md`.

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
11. Apply the "Utility and Helper Organization" decision rule above when
    extracting non-rendering logic from a component, instead of leaving it
    inline or guessing where it belongs.
12. Keep the domain layer independent of the localization mechanism;
    resolve translated display text in the presentation layer from stable
    domain identifiers (see "Localization" above).

When a proposed solution can be implemented cleanly within the existing
architecture, prefer that solution over introducing a new architectural
pattern.