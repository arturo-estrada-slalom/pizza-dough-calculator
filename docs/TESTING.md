# Testing Standards

These standards apply to all tests written in this repository by AI coding
and QA agents. They are derived from the tooling already configured in this
project (see `package.json`, `vite.config.ts`, `playwright.config.ts`,
`src/test/setup.ts`). Do not introduce new testing libraries, mocking
frameworks, coverage tools, or additional end-to-end runners beyond what is
already configured here — the goal is straightforward, meaningful tests for
a small deterministic app, not a large test infrastructure.

This document assumes familiarity with `docs/PROJECT.md` (domain model and
calculation rules) and `docs/CODING_STANDARDS.md` (code conventions,
including the separation of domain logic from presentation).

---

## 1. Testing Philosophy

- Tests should verify observable, deterministic behavior: given known
  inputs, domain functions and UI must produce known, correct outputs.
- Favor a small number of clear, meaningful tests over exhaustive
  permutations, snapshot tests, or heavily mocked test doubles.
- Domain/calculation logic and UI behavior are tested separately and
  differently (see Section 2 and Section 3). Do not re-verify the math
  inside component tests, and do not render components to test a pure
  function.
- A test should fail for exactly one reason. If a test's purpose isn't
  obvious from its name and body, it's testing too much or the wrong
  thing.
- A completed story must leave behind automated E2E regression coverage
  for the meaningful observable behavior it introduces or changes, so
  future changes cannot silently regress previously verified behavior.
  This is a completion requirement, not an optional enhancement — see
  Section 18.

## 2. Tooling Actually Configured

This project uses, and only uses:

- **Vitest** (`vitest`) as the test runner, configured in `vite.config.ts`
  via `defineConfig` imported from `vitest/config`, with
  `test.environment: 'jsdom'`.
- **jsdom** as the DOM environment for component tests.
- **React Testing Library** (`@testing-library/react`) for rendering and
  querying components.
- **`@testing-library/dom`** (a transitive dependency of RTL) for query
  utilities.
- **`@testing-library/user-event`** for simulating user interaction.
- **`@testing-library/jest-dom`**, wired up via the `/vitest` subpath
  import in `src/test/setup.ts` (`import
  '@testing-library/jest-dom/vitest'`), which extends Vitest's `expect`
  with DOM matchers.

Vitest's `test.globals` option is **not** enabled. Every test file must
explicitly import what it needs from `'vitest'`:

```ts
import { describe, it, expect } from 'vitest'
```

Do not rely on global `describe`/`it`/`expect` — they are not injected.

There is no coverage tool or mocking library (e.g. MSW) configured. Do not
add test code that depends on them.

**Playwright** (`@playwright/test`) is configured, via `playwright.config.ts`
at the repository root, for two narrowly scoped purposes: the rendered-color
and real-browser layout-invariant verification described in Section 17, and
the meaningful, regression-protecting E2E coverage required by Section 18.
It is not a general-purpose e2e or UI-behavior testing tool for exhaustively
re-verifying behavior already covered by Vitest/RTL (Sections 4–6) — do not
duplicate isolated domain/unit or component-level coverage here. Do not
write full visual-regression screenshot diffing or pixel-perfect assertions
with it, and do not expand it into broad, unscoped e2e coverage beyond what
Sections 17–18 call for; that would exceed this app's testing needs.

## 3. Test File Naming & Location

- Test files use the `*.test.ts` extension for pure TypeScript/domain
  tests, and `*.test.tsx` for anything that renders a React component.
- Co-locate tests next to the code they verify (e.g. a domain module
  `src/domain/recipe.ts` is tested by `src/domain/recipe.test.ts`; a
  component `src/components/PizzaSettings.tsx` is tested by
  `src/components/PizzaSettings.test.tsx`). This matches the project's
  flat, low-ceremony source layout described in
  `docs/CODING_STANDARDS.md`.
- `src/test/setup.ts` is test *infrastructure*, not a test file. It stays
  in `src/test/` and is referenced once from `vite.config.ts`
  (`test.setupFiles`). It applies globally to every test file regardless
  of where that file lives — do not duplicate or re-import it per test
  file.
- Vitest's default file-discovery pattern already matches test files
  anywhere under the project; no additional `include` configuration is
  needed to support co-located tests.

## 4. Unit Testing Domain/Pure TypeScript Functions

- Domain and calculation logic (dough-ball weight, total dough weight,
  recipe/ingredient math, baker's percentages — see `docs/PROJECT.md`)
  must be tested directly as plain function calls. Do not render any
  React component to test this logic.
- Import the function under test and call it with known inputs; assert
  on its return value. No DOM, no `render`, no `screen`.
- Use the canonical values from `docs/PROJECT.md` as known-good test
  cases, for example the reference pizza (16 in → 480 g dough ball) and
  the six-pizza canonical case (6 × 16 in → 2880 g total dough → ≈1692.13 g
  flour, ≈1049.12 g water, ≈6.77 g yeast, ≈42.30 g salt, ≈33.84 g sugar,
  ≈55.84 g olive oil).
- Also test the documented scaling table (10–20 in diameters) where it's
  useful to confirm the area-based scaling formula, not just the single
  reference point.

## 5. React Component Testing (React Testing Library)

- Render components with `render` from `@testing-library/react` and query
  them with `screen`.
- Prefer accessible queries, in this order of preference:
  1. `getByRole` (with an accessible name, e.g.
     `getByRole('slider', { name: /diameter/i })`)
  2. `getByLabelText`
  3. `getByText` / `getByDisplayValue`
  - Avoid `getByTestId` unless no accessible query is feasible; avoid
    querying by CSS class name or DOM structure entirely.
- Do not test Material UI's internals (e.g. its internal DOM structure,
  class names, or animation/transition behavior). Test only the behavior
  your component exposes: the values rendered, the labels shown, and how
  the UI responds to interaction.
- UI tests should verify user-visible behavior (e.g. "changing the
  diameter slider updates the displayed dough-ball weight"), not
  re-derive or re-assert the underlying formula. The formula is already
  covered by domain unit tests (Section 4); UI tests just confirm the
  component correctly wires input to the domain function and renders its
  output.

## 6. User Interaction Testing (`user-event`)

- Use `@testing-library/user-event` for all simulated user interaction
  (clicks, typing, keyboard interaction with sliders) instead of
  `fireEvent`, since `user-event` more closely simulates real browser
  interaction sequences.
- Always create a user instance per test with `userEvent.setup()`, and
  `await` every interaction call:

```ts
const user = userEvent.setup()
await user.click(screen.getByRole('button', { name: /calculate/i }))
```

- Prefer interacting the same way a real user would (typing into a
  `TextField`, dragging/using arrow keys on a `Slider` via its role and
  keyboard) over calling internal handlers or setting state directly.

## 7. DOM Assertions (`@testing-library/jest-dom`)

- Use `jest-dom` matchers for DOM assertions instead of manually
  inspecting node properties: `toBeInTheDocument()`, `toHaveTextContent()`,
  `toBeVisible()`, `toBeDisabled()`, `toHaveValue()`, `toHaveAttribute()`,
  etc.
- These matchers are available automatically in every test file because
  `src/test/setup.ts` extends Vitest's `expect` — no per-file import of
  `@testing-library/jest-dom` is needed.
- Assert on rendered text/values/roles, not on internal component state
  or props.

## 8. `describe` / `it` Organization & Naming

- Group tests with `describe` by the unit under test: the function name
  for domain tests (`describe('calculateDoughBallWeight', ...)`), or the
  component name for UI tests (`describe('<PizzaSettings />', ...)`).
- Nest an inner `describe` only when a unit has genuinely distinct
  scenarios worth grouping (e.g. `describe('calculateRecipe')` >
  `describe('boundary conditions')`). Don't add nesting for its own sake.
- Write `it`/`test` descriptions as a plain-language statement of
  behavior, ideally readable as "it ...":
  - Good: `it('returns 480g for the 16-inch reference pizza')`
  - Good: `it('disables the calculate button when diameter is 0')`
  - Avoid vague names like `it('works')` or `it('test 1')`.
- One logical behavior per `it` block. Multiple related `expect` calls
  are fine within one `it` if they verify the same behavior (e.g. all
  ingredient weights from one calculation call).

## 9. Arrange / Act / Assert

- Structure each test in three clear parts, using blank lines to
  separate them when it aids readability:

```ts
it('returns 2880g total dough for six 16-inch pizzas', () => {
  // Arrange
  const doughBallWeight = calculateDoughBallWeight(16)

  // Act
  const totalDough = calculateTotalDoughWeight(doughBallWeight, 6)

  // Assert
  expect(totalDough).toBeCloseTo(2880, 1)
})
```

- For component tests, "Arrange" is typically `render(...)`, "Act" is a
  `user-event` interaction (or nothing, for a static render), and
  "Assert" is a `screen`/`jest-dom` expectation.
- Do not add the `// Arrange` / `// Act` / `// Assert` comments for
  trivial one-line tests where the structure is already obvious.

## 10. Deterministic Calculations & Floating-Point Values

- All calculations in this app are deterministic (see
  `docs/PROJECT.md`); tests must assert exact, known expected values —
  never a range that merely "looks plausible."
- Because ingredient math involves division (e.g. `flour = W / 1.702`),
  use `toBeCloseTo(expected, precision)` rather than `toBe` for
  non-integer results, matching the precision documented in
  `docs/PROJECT.md` (e.g. two decimal places for gram quantities).
- Use `toBe` (exact equality) only for values that are mathematically
  exact under the given inputs (e.g. whole-number results like the
  16-inch/480g reference point, or integer pizza counts).
- When asserting a full ingredient breakdown, verify that ingredient
  weights sum back to approximately the total dough weight, mirroring the
  canonical-test-case check described in `docs/PROJECT.md`.

## 11. Boundary Conditions & Invalid Input

- Test the documented reference points and scaling table values (10–20
  inch diameters) to confirm the area-based scaling formula holds at
  multiple points, not just one.
- Test boundary/edge inputs relevant to the domain: a diameter or pizza
  count of `0`, and any minimum/maximum bounds enforced by the UI (slider
  `min`/`max`).
- Test invalid input handling at the boundary where it's validated (per
  `docs/CODING_STANDARDS.md` Section 10: input is validated in the
  component before reaching domain functions). Domain functions can be
  tested with assumed-valid numeric input; UI tests should verify that
  invalid/out-of-range input is rejected, clamped, or surfaced as an
  inline message — whichever behavior the component actually implements.
- Do not invent speculative error-handling tests for conditions the app
  cannot encounter (e.g. network failures) — there is no I/O in this
  app.

## 12. What Should and Should Not Be Mocked

- Do not mock domain/calculation functions in component tests. These
  functions are pure, fast, and deterministic — call the real
  implementation so the test verifies real integration between the
  component and the domain logic.
- Do not mock Material UI components. Render and interact with the real
  MUI components through RTL's accessible queries.
- There is currently no network, storage, timer, or other external
  dependency in this app. Do not add mocks, spies, or fake timers for
  infrastructure that doesn't exist. If a future requirement introduces a
  real external boundary, mock only at that boundary — not the
  surrounding application code.
- Use `vi.fn()` (Vitest's built-in mocking, already available with no
  extra dependency) only for simple callback props you need to assert
  were called (e.g. `onDiameterChange`), not as a general-purpose
  mocking strategy.

## 13. Avoiding Implementation-Detail Coupling

- Assert on what a user would see or a caller would receive (rendered
  text, accessible roles/values, function return values) — never on
  component internal state, private variables, CSS class names, or DOM
  structure that isn't part of the component's public/accessible
  contract.
- Do not use shallow rendering or inspect a component's internals
  directly; render fully via RTL and query through the accessible tree.
- Prefer testing a component's props/behavior contract over testing how
  it's implemented internally, so refactors that preserve behavior don't
  break tests.

## 14. Regression Testing

- When fixing a defect, first add a test that reproduces the bug and
  fails against the unfixed code, then implement the fix and confirm the
  test passes.
- Keep that regression test in the suite permanently, co-located with
  the other tests for the affected function/component — do not delete or
  weaken it after the fix lands.
- Name regression tests for the behavior they guarantee (e.g. `it('does
  not divide by zero when diameter is 0')`), not by bug ticket number or
  generic phrasing like `it('bug fix')`.

## 15. Expectations When Adding or Modifying Functionality

- New pure domain function → add direct unit tests covering its normal
  case, the documented canonical example (if applicable), and relevant
  boundary conditions before considering the work complete.
- New or modified interactive UI → add/update an RTL test that exercises
  the interaction a user would perform and asserts the resulting visible
  output, per Sections 5–6.
- Modifying an existing calculation or component's behavior must come
  with updated tests reflecting the new expected behavior — do not leave
  stale assertions that no longer match the documented domain rules in
  `docs/PROJECT.md`.
- Do not implement functionality explicitly documented as reserved for
  the agent demonstration (per the root `AGENTS.md`), and do not write
  tests asserting behavior for such functionality either.

## 16. Commands to Run the Test Suite

- `npm run test` — runs Vitest in watch mode. Useful for interactive
  development; agents should generally avoid this mode since it does not
  exit.
- `npm run test:run` — runs the full Vitest suite once and exits with a
  pass/fail status code. **Agents should use this command** to verify
  domain and component changes, since it terminates on its own and is
  safe for automated workflows.
- `npm run test:e2e` — runs the Playwright suite once (starts the Vite
  dev server automatically per `playwright.config.ts`) and exits with a
  pass/fail status code. Use this when verifying rendered-color or
  real-browser layout-invariant requirements (Section 17), and when adding
  or running the regression-protecting E2E coverage required for story
  completion (Section 18).
- There is no separate lint-for-tests or coverage command configured.
  Test files are still subject to the project's ESLint/TypeScript rules
  (per `docs/CODING_STANDARDS.md`) and must pass `npm run lint` and
  `npm run build` like any other source file.

## 17. Visual, Color, and Layout Verification

Rendered color and real browser layout (wrapping, overlap, clipping,
containment) cannot be verified through Vitest/RTL: `jsdom` does not perform
real layout or paint, so `getComputedStyle` and bounding-rect results there
are unreliable for CSS applied via MUI's theme/emotion engine, and jsdom
cannot reproduce real text wrapping or box layout at all. Do not attempt to
prove real browser layout behavior (wrapping, overlap, clipping, viewport
containment) using Vitest/RTL/jsdom — use the Playwright tiers below instead.

Visual/color and layout requirements are verified using the following
approach:

1. **Theme-token diff (primary, do this first for color).** Once the
   application defines a central MUI theme (see `docs/CODING_STANDARDS.md`
   Section 9), confirm the theme's palette values are copied exactly from
   `docs/COLOR_PALETTE.md` — this is a plain text/value comparison, not a
   rendering check, and catches the most common failure (wrong or drifted
   constant).
2. **Targeted Playwright color spot-check (when a story has a specific
   visual-color requirement).** Write a minimal Playwright spec under
   `e2e/` (e.g. `e2e/dough-ball-card.spec.ts`) that navigates to the running
   app and asserts `getComputedStyle`/`boundingClientRect`-derived color
   values for the *specific* documented element (e.g. the Dough Ball card's
   dark surface, the slider's primary accent) against the exact hex/rgba
   values in `docs/COLOR_PALETTE.md`. Do not screenshot-diff or snapshot
   entire pages — assert only the specific color token(s) the story
   requires.
3. **Targeted Playwright layout-invariant check (when a story has a
   specific requirement that depends on real browser layout, e.g. no
   unintended wrapping, no overlap, no clipping, no horizontal page
   overflow, at a documented viewport width).** Write a minimal Playwright
   spec under `e2e/` that navigates to the running app, sets the viewport
   width the story calls out (e.g. `page.setViewportSize(...)`), and
   asserts objective, behavioral layout invariants using
   `boundingClientRect`/`getClientRects()`/scroll-dimension comparisons,
   for example:
   - An element's content is not split across multiple line boxes (e.g. via
     `element.getClientRects().length === 1`, or comparing rendered height
     against a known single-line height) when the story prohibits wrapping
     for that element.
   - Two elements' bounding rects do not intersect, when the story requires
     they must not overlap.
   - An element's bounding rect stays within its containing element's
     bounds, when the story requires containment.
   - `document.documentElement.scrollWidth` does not exceed the viewport
     width, when the story prohibits page-level horizontal scrolling.

   These checks verify behavioral/layout invariants, not exact visual
   appearance. Do not assert exact pixel positions, exact column widths, or
   exact spacing values unless a future requirement explicitly calls for
   that precision. This tier does not authorize general screenshot-based
   visual-regression testing or pixel-perfect assertions.

Conventions for these spec tiers:

- Location: `e2e/`, file naming `*.spec.ts`.
- Run with `npm run test:e2e` (see Section 16). The dev server starts
  automatically; do not start it manually first.
- Keep specs minimal and few — one spec per visually- or
  layout-significant requirement introduced by a story, not a spec per
  component.
- These specs verify color or objective layout invariants only. Low-level
  logic already covered by Vitest/RTL (Sections 4–6) should not be
  duplicated here. Broader behavioral/regression E2E coverage for
  meaningful observable behavior (interactions, state updates, displayed
  values, critical flows) is a separate requirement — see Section 18.
- Design references under `docs/designs/` remain the basis for human
  evaluation of general visual fidelity; they are not themselves
  automatically verified by any test tier.
- Do not add visual-regression/screenshot-diffing tooling (e.g. Chromatic,
  `toHaveScreenshot`) — that exceeds this app's testing needs.

## 18. E2E Regression Coverage Requirement

### Core Rule

Every story that changes or introduces observable application behavior MUST
include appropriate automated E2E regression coverage (Playwright, under
`e2e/`) before the story is considered complete.

Manual QA verification or a one-time agent verification pass does NOT
replace persistent automated E2E coverage. The purpose is not only to verify
the current story, but to ensure that future changes cannot silently
regress previously verified behavior.

This requirement is enforced by the Developer and QA Agents as described in
`docs/AGENT_WORKFLOW.md`; this section defines the testing policy itself.

### What E2E Tests Should Cover

When implementing a story, identify meaningful observable behavior that
should be protected against future regression, including where applicable:

- User interactions (e.g. changing a slider, selecting a toggle option).
- User-visible state changes resulting from those interactions.
- Calculation results exposed through the UI — the integrated path from
  input to displayed output, not the underlying formula itself (the formula
  is covered by Vitest domain tests per Section 4).
- Responsive behavior that requires a real browser to verify (Section 17).
- Critical application flows (e.g. the calculator's primary
  input-to-result flow).
- Previously reported defects. A bug fix should normally include an E2E
  regression test that reproduces the original defect and demonstrates the
  corrected behavior, named for the behavior it guarantees rather than a
  bug ticket number (consistent with Section 14).
- Acceptance criteria whose correctness depends on integrated application
  behavior across multiple components (e.g. verifying that changing one
  control updates several dependent displayed values together).

### Avoiding Redundant Testing

This requirement does not mean every acceptance criterion needs its own
Playwright test, and it does not change the Vitest/Playwright boundary
described elsewhere in this document:

- Use Vitest/RTL (Sections 4–6) for isolated domain/calculation logic,
  utilities, and component behavior that does not require a real browser.
  Do not re-test this logic in Playwright merely to "add E2E coverage" —
  that duplicates existing unit-level coverage without adding meaningful
  regression protection.
- Use Playwright for observable, integrated behavior worth protecting
  against regression, and for anything that genuinely requires a real
  browser to verify (per Section 17).
- Use both when a story introduces meaningful behavior at both levels.
- Several acceptance criteria may be covered by one well-designed E2E
  scenario. Design for meaningful regression protection, not maximum test
  count.
- Do not expand this requirement into general interaction/navigation
  testing, full visual-regression screenshot diffing, or broad e2e
  coverage beyond what protects meaningful, previously-verified behavior.

### Conventions

- Location: `e2e/`, file naming `*.spec.ts`, generally one spec file per
  component/flow, consistent with the existing `app-shell.spec.ts`,
  `pizza-settings.spec.ts`, and `results-presentation.spec.ts` files.
- Run with `npm run test:e2e` (see Section 16).
- Prefer the same accessible-query style used in Vitest/RTL (`getByRole`,
  `getByLabelText`, `getByText`) over CSS selectors, consistent with
  Section 5.
- A regression test added for a previously reported defect must remain in
  the suite permanently once added, mirroring Section 14's rule for unit
  tests.
- Preserve existing E2E tests when implementing a story unless the
  story's requirements intentionally change the behavior a given test
  verifies.

### Completion Gate

A story is not complete until the meaningful observable behavior it
introduces or changes is protected by E2E coverage per this section. The
Developer Agent must not move a story to `Ready for QA`, and the QA Agent
must not pass a story, while required coverage is missing — see
`docs/AGENT_WORKFLOW.md`.

### Known Testing Debt — Stories 004 and 005

Stories 004 (`docs/stories/004-basic-calculator.md`) and 005
(`docs/stories/005-thickness-factors.md`) were verified before this policy
existed and introduced meaningful observable behavior that currently has
no persistent E2E coverage — only Vitest/RTL coverage (which does not run
in a real browser) and the narrowly-scoped color checks in
`e2e/pizza-settings.spec.ts`/`e2e/results-presentation.spec.ts`. This is
recorded here as known testing debt, to be addressed by a separate,
future story rather than retrofitted as part of unrelated work:

- **Story 004** — the end-to-end flow of changing the diameter and
  number-of-pizzas controls and observing the Dough Ball, Recipe Summary,
  and Ingredients sections recalculate together in a real browser; and
  that changing pizza count alone does not change the per-pizza
  dough-ball weight.
- **Story 005** — selecting Thin/Standard/Thick in a real browser and
  observing the dough-ball weight, total dough, flour, water, ingredient
  weights, and the Dough Ball contextual text ("per 16\" thin/standard/thick
  pizza") update together; that only one thickness option is shown
  selected at a time; and the already-selected-option edge case (MUI's
  exclusive `ToggleButtonGroup` `null` callback) not deselecting the
  current thickness.

Do not implement these tests as a side effect of unrelated work — track
them as a dedicated backlog item.
