# Coding Standards

These standards apply to all code written in this repository by AI coding
agents and human contributors. They are derived from the technologies and
configuration already present in this project (see `package.json`,
`tsconfig.app.json`, `eslint.config.js`). Do not introduce new tooling,
frameworks, or architectural layers to satisfy these standards — the goal
is consistency with a small, simple React + TypeScript app, not enterprise
architecture.

Testing standards are intentionally not covered here. They will be added
once a test framework is configured (see `docs/PROJECT.md`).

---

## 1. General Principles

- Favor simple, idiomatic React and TypeScript over clever or "enterprise"
  patterns. This is a small single-page app, not a large system.
- Do not add dependencies (state managers, routing libraries, CSS
  frameworks, utility libraries, etc.) unless a requirement explicitly
  calls for them. MUI, React, and TypeScript are the only UI/runtime
  dependencies currently approved.
- Do not introduce a backend, database, authentication, or external API
  unless a requirement explicitly calls for one (see `AGENTS.md`).
- Do not build abstractions (factories, generic wrappers, plugin systems,
  context providers, custom hooks, etc.) for a single use case. Add
  abstraction only when a second real usage justifies it.
- Preserve existing functionality when implementing new features. Read
  `AGENTS.md` and `docs/PROJECT.md` before changing domain/calculation
  logic — some features (e.g. thickness) are intentionally incomplete and
  must not be "fixed" proactively unless explicitly requested.

## 2. TypeScript Conventions & Type Safety

- The project compiles with `strict`-equivalent settings enabled via
  `tsconfig.app.json` (`noUnusedLocals`, `noUnusedParameters`,
  `noFallthroughCasesInSwitch`, `verbatimModuleSyntax`,
  `erasableSyntaxOnly`). Write code that satisfies these without
  suppressing them.
- Do not use `any`. Prefer precise types, `unknown` with narrowing, or
  generics when a value's shape genuinely varies.
- Do not add non-null assertions (`!`) to work around type errors; narrow
  the type properly instead. The one existing exception
  (`document.getElementById('root')!` in `main.tsx`) is an accepted Vite
  template pattern for a known-present DOM node — do not use this pattern
  as license to add other assertions elsewhere.
- Prefer `type` aliases for data shapes (props, domain values, function
  signatures). Use `interface` only if you need declaration merging or are
  extending another interface.
- Because `verbatimModuleSyntax` is enabled, import types explicitly with
  `import type { X } from '...'` (or inline `import { type X, y } from
  '...'`) whenever a symbol is used only as a type.
- Let TypeScript infer types for simple local variables and return values
  where the inference is obvious; add explicit annotations for function
  parameters, exported function return types, and any value whose type
  isn't immediately clear from context.
- Avoid `as` type casting except for narrow, well-understood cases (e.g.
  DOM APIs). Never cast to silence a real type mismatch.
- Unused variables/parameters are treated as compiler errors — do not
  leave dead code or unused destructured values. Prefix an intentionally
  unused parameter with `_` only if the signature requires it.

## 3. React Component Conventions

- Use function components with the `function ComponentName() { ... }` or
  arrow-function form consistently within a file; do not mix class
  components.
- One component per file, with the file name matching the component name
  (e.g. `PizzaSettings.tsx` exports `PizzaSettings`).
- Keep components focused on presentation: accept data and callbacks via
  props, render UI, and forward user interaction. Push calculations and
  business rules into plain functions (see Section 5).
- Type props with a dedicated `type ComponentNameProps = { ... }` above
  the component, not inline function signatures for anything beyond one
  or two trivial props.
- Destructure props in the function signature rather than accessing
  `props.x` throughout the body.
- Keep JSX readable: extract a child component when a render function
  grows large or a section of markup is reused, but don't pre-emptively
  split trivial markup into sub-components.
- Default export the component only when a file exports exactly one
  component (matches current convention in `App.tsx`); prefer named
  exports for everything else (helpers, types, constants).

## 4. Hooks & State Management

- Do not add a state-management library (Redux, Zustand, Jotai, etc.).
  `useState`/`useReducer` plus prop passing is sufficient for this app's
  scope.
- Keep state as local as possible. Lift state up only as far as the
  nearest common ancestor that actually needs it.
- Derive values from existing state/props with plain calculations during
  render instead of duplicating them into additional state. Only use
  `useEffect` to synchronize with something outside React (e.g. the DOM,
  a subscription) — not to compute derived data.
- Follow the Rules of Hooks (enforced by `eslint-plugin-react-hooks` in
  `eslint.config.js`): call hooks unconditionally at the top level of
  components or other hooks, and keep dependency arrays complete and
  accurate rather than suppressing the lint rule.
- Only extract a custom hook when the same stateful logic is reused in
  more than one component. Do not create custom hooks for one-off state.

## 5. Separation of Domain/Business Logic from Presentation

- Domain calculations (dough-ball weight, total dough, recipe/ingredient
  math, baker's percentages) must live in plain, framework-free TypeScript
  functions — not inside component bodies or JSX. See `docs/PROJECT.md`
  for the required functions and formulas (e.g.
  `calculateDoughBallWeight`, `calculateTotalDoughWeight`,
  `calculateRecipe`).
- These functions must be pure: given the same inputs they return the
  same outputs, with no side effects, no DOM access, and no dependency on
  React state.
- Components call these functions and render the results; they must not
  re-implement or duplicate the formulas inline.
- Recipe constants (baker's percentages, reference pizza values) must be
  defined once, in the domain layer, and imported wherever needed — never
  hard-coded again in a component.
- Group domain/calculation code under a clearly named location (e.g.
  `src/domain/`) separate from `src/components/`, so the logic is easy to
  find and unit-test once a test framework is added.

## 6. File & Directory Organization

- Keep the flat `src/` layout used today until complexity genuinely
  requires more structure. As components and domain logic are added,
  organize into clear top-level folders, for example:
  - `src/components/` — presentational React components
  - `src/domain/` — pure calculation functions, types, and constants
  - `src/` root — `App.tsx`, `main.tsx`, global styles
- Do not create deeply nested folder hierarchies (feature folders,
  atomic-design layers, barrel-file trees) for an app this size.
- Avoid barrel files (`index.ts` re-export hubs) unless a directory has
  enough modules that imports genuinely benefit from it. Prefer direct
  imports from the source file.
- Co-locate a component's own styles only if the project's CSS approach
  requires it (currently plain CSS files imported per component, as with
  `App.css`/`index.css`); do not introduce CSS-in-JS or CSS Modules
  without a clear reason, since MUI's `sx` prop and theme already cover
  styling needs.

## 7. Naming Conventions

- Components, component files, and types/interfaces: `PascalCase`
  (`PizzaSettings`, `RecipeResult`, `type IngredientRow`).
- Variables, functions, and props: `camelCase`
  (`doughBallWeight`, `calculateRecipe`, `onDiameterChange`).
- Constants that represent fixed domain values (recipe percentages,
  reference pizza constants): `UPPER_SNAKE_CASE` or a single well-named
  `const` object (e.g. `RECIPE_BAKERS_PERCENTAGES`), defined once in the
  domain layer.
- Boolean variables/props: prefix with `is`/`has`/`should`
  (`isLoading`, `hasError`).
- Event-handler props: prefix with `on` (`onSubmit`); the corresponding
  handler implementation inside a component may be prefixed with `handle`
  (`handleSubmit`).
- Files: match the default export's name exactly (`App.tsx`,
  `main.tsx`); domain modules use descriptive lowerCamelCase or kebab-case
  consistent with existing files in the directory.

## 8. Imports & Exports

- `verbatimModuleSyntax` is enabled — always use `import type` for
  type-only imports and keep value imports separate.
- Prefer named exports for components, functions, types, and constants.
  Use a default export only for the single top-level component in a file
  (matching the existing `App.tsx` pattern).
- Order imports as: external packages (`react`, `@mui/material`, etc.),
  then internal modules, then relative imports, then style imports
  (`.css`) — grouping consistent with the existing files
  (`main.tsx`, `App.tsx`).
- Do not use wildcard imports (`import * as X`) unless required by a
  library's API.
- Avoid deep relative import chains (`../../../`); keep the folder
  structure shallow enough that this isn't necessary (see Section 6).

## 9. Material UI (MUI) Usage

- Use MUI components (`Slider`, `TextField`, `Table`, `Typography`,
  `Box`, etc.) instead of hand-rolled HTML/CSS equivalents wherever MUI
  already provides the control — the project depends on
  `@mui/material`, `@emotion/react`, and `@emotion/styled` specifically
  for this.
- Prefer MUI's `styled()` API over inline `sx` props for styling both
  HTML elements and MUI components. Define styled components (e.g.
  `const Background = styled(Box)({ ... })`) instead of writing `sx={{
  ... }}` inline in JSX. For example, prefer:
  ```tsx
  <Background>
    <AppContainer>...</AppContainer>
  </Background>
  ```
  over:
  ```tsx
  <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>...</Container>
  </Box>
  ```
  Reserve `sx` for genuinely trivial, truly one-off tweaks (e.g. a single
  spacing override) where introducing a styled component would be
  excessive. Do not refactor existing `sx`-based code to this convention
  unless you are already changing that code for another reason.
- Place styled components for a file in a sibling file named
  `<FileName>.styled.tsx` (e.g. `AppHeader.styled.tsx` for
  `AppHeader.tsx`), and import them into the component file rather than
  defining `styled()` components inline.
- Do not introduce a separate CSS framework (Tailwind, Bootstrap, etc.)
  alongside MUI.
- Use MUI layout primitives (`Box`, `Stack`, `Grid`) for layout instead of
  raw `div`s with custom flexbox/grid CSS, to stay consistent once MUI is
  adopted throughout the UI.
- Keep numeric/slider inputs (diameter, thickness, pizza count) as
  controlled components: component state (or state passed via props)
  drives the MUI control's `value`, and the control's `onChange` updates
  that state — do not read values imperatively from the DOM.
- `docs/COLOR_PALETTE.md` is the authoritative source for application
  color values. Do not introduce arbitrary hex/RGB values, and do not
  estimate colors by sampling design mockups or screenshots when an
  equivalent color is already defined by the palette guide.
- Define the application's palette once through MUI's theme (e.g.
  `createTheme({ palette: { ... } })` in `src/theme.ts`), using the
  tokens documented in `docs/COLOR_PALETTE.md`, and apply it via a single
  `ThemeProvider` at the app root — do not hard-code individual color
  values inside component `sx` props/styles or scatter theme overrides
  across components.

## 10. Error & Input Handling

- Validate user input (diameter, pizza count, thickness) at the point it
  enters the system — in the component managing the input — before it
  reaches domain calculation functions. Domain functions can assume valid,
  already-sanitized numeric input.
- Clamp or constrain input using the MUI control's own props (e.g.
  `min`/`max`/`step` on `Slider`/`TextField`) rather than writing manual
  range-checking logic duplicated elsewhere.
- Guard against non-numeric or empty input from text fields before
  passing values into calculations; avoid silent `NaN` propagation into
  displayed results.
- This app has no network or filesystem I/O; do not add `try`/`catch`
  blocks, error boundaries, or loading states for scenarios that cannot
  occur (e.g. network failures). Only handle errors at real boundaries
  (user input, browser APIs actually in use).
- Prefer showing a clear, inline message (e.g. MUI `FormHelperText` or
  `Alert`) for invalid input over throwing exceptions from domain
  functions.

## 11. Code Readability & Maintainability

- Keep functions small and single-purpose. A component or function that
  is handling multiple concerns (validation, calculation, rendering)
  should be split along those lines per Section 5.
- Write comments only to explain *why*, not *what* — the code should be
  self-explanatory for *what* it does. Avoid restating logic in prose.
- Keep JSX indentation and formatting consistent with the existing files;
  rely on ESLint/formatting rather than manual style decisions.
- Avoid magic numbers in components; pull named constants from the domain
  layer (reference diameter, reference dough weight, baker's
  percentages) instead of re-typing literals.
- Keep this document and `docs/PROJECT.md` in sync with the code: if a
  requirement or formula changes, verify both documents still match the
  implementation.

## 12. Linting & Formatting

- All code must pass `npm run lint` (ESLint via `eslint.config.js`) with
  no errors. The current config applies:
  - `@eslint/js` recommended rules
  - `typescript-eslint` recommended rules
  - `eslint-plugin-react-hooks` recommended rules
  - `eslint-plugin-react-refresh` (Vite) rules
- Do not disable lint rules inline (`eslint-disable`) to work around a
  violation — fix the underlying code. If a rule genuinely does not fit a
  specific case, flag it for discussion rather than silently suppressing
  it.
- Do not change `eslint.config.js` or `tsconfig*.json` to loosen strictness
  (e.g. disabling `noUnusedLocals`, downgrading `typescript-eslint` rules)
  without an explicit requirement to do so.
- There is no Prettier or separate formatter configured in this repo;
  match the formatting style already present in `src/` (double quotes in
  `App.tsx`, single quotes in `main.tsx` and `eslint.config.js` — follow
  whichever convention is already used in the file you are editing, and
  do not perform unrelated reformatting).
- Run `npm run build` (which runs `tsc -b` before `vite build`) to confirm
  no type errors before considering a change complete.
