# Story 007 — Implementation Report

## Implementation Summary

Added English (`en-US`) / Spanish (`es-MX`) localization to the Pizza Dough
Calculator using `i18next` + `react-i18next`:

- A new `src/i18n/` module resolves the active language at startup
  (localStorage preference → browser language → English default),
  persists explicit user selections, and initializes a single shared
  `i18next` instance with `en-US` as the `fallbackLng`.
- All user-facing strings in `AppHeader`, `PizzaSettings`, `DoughBallResult`,
  `RecipeSummary`, and `Ingredients` now render through `useTranslation()` /
  translation keys instead of hard-coded text.
- A new `LanguageSelector` component (rendered inside `AppHeader`, absolutely
  positioned in the header's top-right corner) offers "🇺🇸 English" and
  "🇲🇽 Español"; selecting an option calls `i18n.changeLanguage()` and
  persists the choice to `localStorage`, with no page reload.
- Ingredient and thickness display names are resolved by the presentation
  layer from the domain's existing stable keys (`flour`, `water`, …,
  `thin`/`standard`/`thick`) via translation keys (`ingredientNames.<key>`,
  `thickness.<key>`), rather than from strings stored in domain
  configuration. The English display `name` field was removed from
  `RECIPE_INGREDIENTS`/`IngredientDefinition` in `src/domain/` (AC-007-14).
- `src/domain/` has no new dependency on `i18next`/`react-i18next` and does
  not branch on the active language; calculation functions and their test
  suites are unchanged, and calculated numeric results are identical
  regardless of the active language (verified by tests).
- `docs/PROJECT.md`, `docs/ARCHITECTURE.md`, `docs/CODING_STANDARDS.md`, and
  `docs/TESTING.md` already documented the `en-US`/`es-MX` localization
  standard (locales, domain/localization independence, translation-key
  parity, English fallback, and the required automated coverage) before
  this story began; verified during implementation that all four documents
  remain accurate and consistent with what was actually built. No edits to
  these four documents were needed.

### Technical Decisions (documented for QA, per the story's deferred
decisions)

- **Localization library**: `i18next` + `react-i18next` (added as new
  runtime dependencies, justified by this story per
  `docs/CODING_STANDARDS.md` §1).
- **localStorage key**: `pizza-dough-calculator.language`
  (`LANGUAGE_STORAGE_KEY` in `src/i18n/languageStorage.ts`).
- **Stored value representation**: the raw supported locale code itself,
  e.g. the string `"en-US"` or `"es-MX"` (no wrapping/serialization).
- **Translation resource organization**: one flat, nested TypeScript object
  per locale under `src/i18n/locales/` (`en-US.ts`, `es-MX.ts`), keyed by
  feature area (`app`, `pizzaSettings`, `thickness`, `doughBall`,
  `recipeSummary`, `ingredients`, `ingredientNames`, `common`,
  `languageSelector`).
- **Header layout**: the language selector is absolutely positioned in the
  header's top-right corner via a new `LanguageSelectorWrapper` styled
  element; the existing centered-on-mobile / left-aligned-on-desktop
  title/subtitle layout from Story 001 is otherwise unchanged (pixel-perfect
  header redesign is out of scope per the story).
- **Thickness context sentence**: the lower-cased translated thickness
  label is interpolated into `doughBall.context` (e.g. "Standard" →
  "standard" / "Estándar" → "estándar") to preserve the existing
  English sentence casing/structure; the `es-MX` sentence re-orders the
  interpolated segments for natural phrasing ("por pizza delgada de 16\"")
  rather than a literal word-for-word translation.

## Files Changed

### Added

- `src/i18n/languages.ts` — supported-locale constants/type and the
  `isSupportedLanguage` guard.
- `src/i18n/languageStorage.ts` — localStorage read/write (with try/catch
  resilience) and the stored-preference → browser-language → default
  resolution priority.
- `src/i18n/locales/en-US.ts` — English translation resource (runtime
  fallback locale).
- `src/i18n/locales/es-MX.ts` — Spanish translation resource.
- `src/i18n/i18n.ts` — `i18next`/`react-i18next` initialization using the
  resolved initial language and `en-US` fallback.
- `src/i18n/translations.test.ts` — bidirectional translation-key-parity
  tests and non-empty-value checks for both locales (AC-007-08).
- `src/i18n/languageStorage.test.ts` — unit tests for language resolution
  priority, Spanish-variant detection, invalid-stored-value fallback, and
  localStorage read/write failure resilience.
- `src/i18n/i18n.test.ts` — isolated-instance test proving the English
  runtime-fallback mechanism (AC-007-07).
- `src/components/LanguageSelector.tsx` — the header language selector
  component.
- `src/components/LanguageSelector.styled.tsx` — its styled MUI
  `Select`/`MenuItem`.
- `src/components/LanguageSelector.test.tsx` — RTL tests for rendering,
  selecting a new language, and the already-active-option no-op case.
- `e2e/localization.spec.ts` — Playwright E2E regression coverage
  (AC-007-13).

### Modified

- `src/main.tsx` — imports `./i18n/i18n` once at startup (side effect).
- `src/test/setup.ts` — imports the i18n module for every test file and
  resets the active language to `en-US` in `afterEach` for test isolation.
- `src/domain/types.ts` — removed the `name` field from
  `IngredientDefinition` (display names are now a presentation/localization
  concern; AC-007-14).
- `src/domain/recipe.ts` — removed `name: "..."` from each
  `RECIPE_INGREDIENTS` entry; calculation values (`bakersPercentage`,
  `bakersPercentageDisplay`, `isBase`) are unchanged.
- `src/components/AppHeader.tsx` / `AppHeader.styled.tsx` — render
  `app.title`/`app.subtitle` via translation keys; render
  `LanguageSelector` absolutely positioned in the top-right corner.
- `src/components/PizzaSettings.tsx` — all labels, units, and thickness
  option text now render via translation keys; the toggle button `value`
  props remain the raw domain thickness keys.
- `src/components/DoughBallResult.tsx` — label, region aria-label,
  pizza-count aria-label, and the contextual sentence now render via
  translation keys/interpolation; formatted numeric weight is unchanged.
- `src/components/RecipeSummary.tsx` — metric labels and the region
  aria-label now render via translation keys; numeric formatting
  unchanged.
- `src/components/Ingredients.tsx` — title, subtitle, table headers,
  ingredient names, and the "BASE"/"Total Dough" labels now render via
  translation keys instead of `RECIPE_INGREDIENTS[key].name`.
- `docs/stories/007-language-localization.md` — status updated
  (`Ready for Implementation` → `In Progress` → `Ready for QA`).

### Dependencies

- Added `i18next` and `react-i18next` to `package.json`/`package-lock.json`.

## Tests

### Added (Vitest/RTL)

- `src/i18n/translations.test.ts` — key parity in both directions and
  non-empty values for `en-US`/`es-MX` (AC-007-08).
- `src/i18n/languageStorage.test.ts` — stored-preference priority,
  Spanish-variant browser detection (`es-ES`, `es-AR`, `es`), non-Spanish
  default, invalid-stored-value fallback, and localStorage
  read/write-failure resilience (AC-007-02, AC-007-03, AC-007-06, Edge
  Cases).
- `src/i18n/i18n.test.ts` — English runtime fallback via an isolated
  instance (AC-007-07).
- `src/components/LanguageSelector.test.tsx` — renders both options with
  flag + native name; selecting a new option changes `i18n.language` and
  persists it; reselecting the active option is a no-op (AC-007-04,
  AC-007-05, AC-007-12, Edge Cases).

### Modified (Vitest/RTL)

- `src/App.test.tsx`, `src/components/AppHeader.test.tsx`,
  `src/components/PizzaSettings.test.tsx`,
  `src/components/DoughBallResult.test.tsx`,
  `src/components/RecipeSummary.test.tsx`,
  `src/components/Ingredients.test.tsx` — assertions now reference the
  `en-US`/`es-MX` translation resources instead of literal hard-coded
  strings, per the story's edge case ("Existing automated tests that
  currently assert specific hard-coded English text must be updated to
  remain locale-aware"). Added: an `AppHeader` test and an `App` test that
  switch to Spanish and verify translated content (and, for `App`,
  unchanged calculated results).

### Added/Modified (Playwright E2E — `e2e/localization.spec.ts`)

New spec covering AC-007-13's required scenarios:

- English display by default (`test.use({ locale: "en-US" })`, no stored
  preference).
- Spanish display from browser-language detection
  (`test.use({ locale: "es-MX" })`, no stored preference).
- A stored English preference taking precedence over a Spanish browser
  locale (`context.addInitScript` seeds `localStorage` before load).
- User language switching via the selector, with content updating without
  a reload.
- Persistence of the selected language across `page.reload()`.
- Representative translated content (an ingredient name, section
  headings).
- Calculated dough-ball weight (`367.5`) remaining identical before and
  after switching from English to Spanish.

Existing E2E specs (`app-shell.spec.ts`, `pizza-settings.spec.ts`,
`results-presentation.spec.ts`, `ingredients-table-layout.spec.ts`) were
left unmodified and continue to pass unchanged (they exercise the
default/English locale).

## Verification

| Command | Result |
|---|---|
| `npm run build` (`tsc -b && vite build`) | Passed, no type errors |
| `npm run lint` | Passed, no errors |
| `npm run test:run` | Passed — 14 test files, 93 tests |
| `npm run test:e2e` | Passed — 16 tests (5 new localization scenarios + 11 pre-existing) |

## Acceptance Criteria Addressed

| AC | Status | Notes |
|---|---|---|
| AC-007-01 | Addressed | Default English when no stored preference and non-Spanish browser language; verified by `languageStorage.test.ts` and `e2e/localization.spec.ts`. |
| AC-007-02 | Addressed | Spanish-variant browser detection (`es-ES`, `es-AR`, bare `es`) → `es-MX`; `languageStorage.test.ts`, `e2e/localization.spec.ts`. |
| AC-007-03 | Addressed | Stored preference wins over browser language; `languageStorage.test.ts`, `e2e/localization.spec.ts`. |
| AC-007-04 | Addressed | `LanguageSelector.test.tsx`, `AppHeader.test.tsx`, `App.test.tsx`, `e2e/localization.spec.ts` — no reload required (SPA state update). |
| AC-007-05 | Addressed | `e2e/localization.spec.ts` reload scenario; persistence via `persistLanguage`. |
| AC-007-06 | Addressed | Invalid stored value falls back to browser/default; `languageStorage.test.ts`. |
| AC-007-07 | Addressed | `src/i18n/i18n.test.ts` (isolated-instance fallback proof); `fallbackLng: "en-US"` in production config. |
| AC-007-08 | Addressed | `src/i18n/translations.test.ts` — bidirectional key parity + non-empty values. |
| AC-007-09 | Addressed | All existing hard-coded strings converted to translation keys across `AppHeader`, `PizzaSettings`, `DoughBallResult`, `RecipeSummary`, `Ingredients`; language-selector option labels are the documented, intentional exemption. |
| AC-007-10 | Addressed | `es-MX` ingredient names use natural Mexican Spanish terminology (e.g. `flour` → "Harina de Fuerza", per the story's own example). |
| AC-007-11 | Addressed | `App.test.tsx` Spanish-switch test and `e2e/localization.spec.ts` assert the dough-ball weight is identical before/after switching language; domain calculation code/tests untouched. |
| AC-007-12 | Addressed | `LanguageSelector` always renders "🇺🇸 English"/"🇲🇽 Español" regardless of active locale; positioned top-right in `AppHeader`. |
| AC-007-13 | Addressed | `e2e/localization.spec.ts` covers English display, Spanish display, switching, persistence after reload, browser detection, stored-preference priority, representative translated content, and unchanged calculated results. |
| AC-007-14 | Addressed | `src/domain/` has no `i18next`/`react-i18next` import; `RECIPE_INGREDIENTS[key].name` removed; presentation resolves display names from `key` via `ingredientNames.<key>` / `thickness.<key>`. |

## Known Issues / Remaining Concerns

- Spanish wording (e.g. "Harina de Fuerza", "Bola de Masa", "Estándar") was
  authored by the Implementation Agent per the story's explicit allowance
  ("exact wording may be refined by a human developer during review; wording
  alone is not a blocking defect unless it is clearly incorrect, misleading,
  or unnatural"). QA/human review of wording is expected, not a defect by
  itself.
- The language selector is absolutely positioned in the header's top-right
  corner; on very narrow viewports with a long rendered title, visual
  overlap has not been exhaustively checked beyond the existing
  `e2e/app-shell.spec.ts` color assertions and the standard viewport sizes
  already covered by `e2e/ingredients-table-layout.spec.ts`-style minimum
  widths. Pixel-perfect header redesign is explicitly out of scope for this
  story.
- The `"ingredients.base"` chip label ("BASE") is passed through the
  localization mechanism but is translated identically in both locales
  (`"BASE"`); this was a deliberate, in-scope decision (short label/
  abbreviation), not an oversight.
