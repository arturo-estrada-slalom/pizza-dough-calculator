# Story 007 — English and Spanish Localization

## Status

Ready for Implementation

## User Story

As a user of the Pizza Dough Calculator,
I want the application to display its user interface in English or Spanish
based on my language preference,
so that I can use the calculator in my preferred language.

## Context

The application currently displays all user-facing content in English.

Introduce application-level internationalization/localization support for:

- English (`en-US`)
- Spanish (`es-MX`)

This story also establishes localization as an architectural requirement for
future development.

All user-facing application text must use the localization mechanism rather
than being hard-coded directly into components.

Translation resources should use structured translation keys with separate
resources for each supported locale.

English is the application's fallback language.

## Feature Summary

Add English (`en-US`) / Spanish (`es-MX`) localization to the Pizza Dough
Calculator's UI: a language selector in the header, a localStorage-persisted
language preference with browser-language-based fallback, and translation
(via translation keys resolved against per-locale resources) of all existing
user-facing text — headings, labels, buttons, table headings, ingredient
names, and thickness labels — while keeping the domain calculation layer
independent of the localization mechanism and leaving all calculated numeric
results unchanged.

## Functional Requirements

1. The application supports exactly two locales: `en-US` (runtime fallback)
   and `es-MX`.
2. On startup, the active language is resolved in priority order: (a) a
   valid, supported value stored in localStorage; (b) the browser's
   preferred language, where a Spanish language/locale resolves to `es-MX`;
   (c) `en-US` otherwise.
3. An invalid or unsupported value stored in localStorage must not cause the
   application to fail; resolution falls back to (b)/(c) above as if no
   value were stored.
4. A language selector is rendered in the top-right area of the application
   header, offering "🇺🇸 English" and "🇲🇽 Español". Each option always
   displays its own native name regardless of the currently active locale
   (no translation key is required for these two labels).
5. Selecting a language updates all localized, user-visible content
   immediately, without a page reload, and persists the selection to
   localStorage.
6. After a reload or reopen, a previously persisted language selection takes
   priority over browser-language detection.
7. All user-facing strings currently hard-coded in components — page and
   section headings, form/control labels, buttons, helper and validation
   text, table headings, ingredient names, thickness labels, and other
   descriptive text — are rendered through translation keys resolved
   against per-locale translation resources, rather than through
   component-level conditional branching on the active language (e.g.
   `language === "es-MX" ? "Ingredientes" : "Ingredients"`).
8. Translation resources exist for `en-US` and `es-MX` with structural key
   parity verified in both directions; a key present in only one locale's
   resource is a defect regardless of which locale is missing it.
9. If a translation is unexpectedly missing for the active locale, the
   English translation is displayed as a fallback; this fallback is a
   resilience mechanism and is not a substitute for complete translation
   resources.
10. Ingredient display names and thickness display labels are resolved by
    the presentation layer from the domain layer's existing stable
    identifiers (ingredient keys such as `flour`/`water`; thickness keys
    `thin`/`standard`/`thick`), not from new identifiers introduced solely
    for translation, and not from English display strings stored in domain
    configuration.
11. The domain layer and domain configuration (`src/domain/`) have no
    dependency on the localization/i18n library and do not branch on the
    active language.
12. Changing the active language does not alter any calculated numeric
    result (dough-ball weight, total dough weight, ingredient weights,
    baker's percentages, hydration) for identical calculator inputs.
13. Locale-specific numeric or unit-system formatting is out of scope; the
    measurement system (inches for diameter, grams for weights) is
    unaffected by the active language.
14. Spanish translations use natural, commonly understood Mexican Spanish
    terminology rather than literal word-for-word translation, per the
    Spanish Translation Guidelines above.
15. `docs/PROJECT.md`, `docs/ARCHITECTURE.md`, `docs/CODING_STANDARDS.md`,
    and `docs/TESTING.md` document `en-US`/`es-MX` as supported locales, the
    localization mechanism, domain/localization independence, translation
    key parity, and English runtime fallback as project-wide standards. At
    the time of this analysis, these documents already contain this
    content; the Implementation Agent should verify it remains accurate and
    consistent with what is actually implemented, updating it if the
    implementation diverges from what is currently documented.

## Edge Cases

- Browser preferred language is a Spanish variant other than `es-MX` (e.g.
  `es-ES`, `es-AR`, bare `es`) — must still resolve to `es-MX` (AC-007-02).
- Browser preferred language is a non-Spanish locale that is not English
  (e.g. `fr-FR`, `pt-BR`) and no stored preference exists — must resolve to
  the `en-US` default, not fail or display a mixture.
- localStorage is unavailable or throws when read/written (e.g. private
  browsing mode, storage disabled) — the application must still start and
  function, treating the condition the same as "no stored preference"
  rather than crashing.
- The user reselects the language that is already active — a no-op with no
  errors and no unnecessary content flash.
- The user switches languages rapidly — displayed content must not become a
  stale mixture of the previous and newly selected language.
- The user switches languages while calculator inputs are at non-default
  values (e.g. a non-default diameter, pizza count, or thickness) — input
  values/state and calculated results must be preserved; only localized text
  changes (AC-007-11).
- Calculator inputs at boundary values (minimum/maximum diameter, pizza
  count of 1, each thickness option) must still render fully localized
  surrounding text in both locales.
- Existing automated tests that currently assert specific hard-coded English
  text must be updated to remain locale-aware (e.g. asserting against the
  active locale's resource value or explicitly rendering with `en-US`)
  rather than left asserting literal strings that no longer reflect how the
  text is produced.

## Domain and Presentation Separation

Ingredient names, thickness labels, and similar display text are
presentation concerns and must participate in localization the same as any
other user-facing string.

English display text must NOT be the domain model's source of truth.
Translated display values live in locale translation resources, not in
`src/domain/`.

Where the domain layer already exposes stable identifiers (for example the
ingredient keys `flour`, `water`, `yeast`, `salt`, `sugar`, `oliveOil`, and
the thickness keys `thin`, `standard`, `thick`), the presentation layer
should use those identifiers to resolve the corresponding translation key
(conceptually `ingredients.flour`, `thickness.thin`, etc.), rather than
introducing a new identifier solely to support translation.

The domain layer must remain independent of the localization mechanism:

- Domain logic and domain configuration must not import or depend on a
  localization/i18n library.
- Changing a translated display label must not require changing recipe
  calculation logic, domain types, or domain configuration.
- Existing recipe calculation identifiers and behavior should remain stable;
  do not modify domain interfaces solely to support presentation text when
  an existing stable identifier can provide the required mapping.

The exact mechanism for resolving an identifier to a translation key is a
technical implementation decision for the Implementation Agent, consistent
with `docs/ARCHITECTURE.md` ("Localization").

## Language Resolution

When the application initializes, determine the active language using the
following priority:

1. Check for a previously selected language stored in localStorage.
2. If a valid supported language exists in localStorage, use it.
3. Otherwise, inspect the browser's preferred language.
4. If the browser language is Spanish or a Spanish locale, use `es-MX`.
5. Otherwise, use `en-US`.

An unsupported or invalid value stored in localStorage must not cause the
application to fail.

In that situation, fall back to browser-language detection and ultimately
English if necessary.

The exact localStorage key name is a technical implementation decision and is
not prescribed by this story. The Implementation Agent must document the
chosen key and the stored value representation in the implementation report
so QA can verify the persistence mechanism. Stored values must correspond to
the supported locale codes (`en-US` / `es-MX`).

## Language Selector

Add a language selector to the top-right area of the application header.

The selector must provide:

- 🇺🇸 English
- 🇲🇽 Español

Emoji flags are acceptable and preferred for this story. SVG/image assets are
not required.

The selector's own option labels are intentionally exempt from active-locale
translation: each language is always identified by its own native name
("English" / "Español") regardless of which language is currently active.
This is intentional self-identification, not a localization gap, and must not
be treated as an unintended English/Spanish mixture (see AC-007-09). No
translation key or translated-content test is required for these two labels.

Changing the language must update the user-visible application content without
requiring a page reload.

The selected language must be persisted to localStorage.

After refreshing or reopening the application, the persisted selection must
take precedence over browser-language detection.

## Translation Scope

All user-visible application strings must participate in localization.

This includes, where applicable:

- Page headings
- Section headings
- Form labels
- Buttons
- Helper text
- Validation messages
- Error messages
- Table headings
- Ingredient names
- Thickness labels (`Thin` / `Standard` / `Thick`, already implemented by
  Story 005 — only the displayed label text is localized here; thickness
  calculation behavior is unchanged, see "Thickness Functionality" below)
- Descriptive text
- Other text presented to the user

Application/domain identifiers that are not directly displayed to users do not
need translation.

## Thickness Functionality

Thickness selection and calculation were already implemented by
`docs/stories/005-thickness-factors.md` and are no longer reserved or
incomplete (see `docs/PROJECT.md`).

This story localizes only the existing, already-implemented `Thin` /
`Standard` / `Thick` labels. It must NOT reimplement, alter, or otherwise
affect thickness calculation behavior.

## Spanish Translation Guidelines

Spanish translations should target `es-MX`.

Prefer natural, commonly understood Mexican Spanish terminology over overly
literal translations.

For example:

    Bread Flour → Harina de Fuerza

Translations should prioritize clarity to the user over word-for-word
equivalence with English.

This story does not enumerate or pre-approve every Spanish translation. The
Implementation Agent may author the initial `es-MX` translations, prioritizing
natural meaning for a Mexican Spanish speaker over literal wording. Exact
wording may be refined by a human developer during review; wording alone is
not a blocking defect unless it is clearly incorrect, misleading, or
unnatural (see Acceptance Criteria).

## Translation Resources

User-visible strings must be referenced through translation keys.

Translation resources must exist for every supported locale:

- `en-US`
- `es-MX`

Translation resources must maintain structural key parity across all
supported locales: `keys(en-US) == keys(es-MX)`. A translation key existing
in only one locale's resource is a defect regardless of which locale has the
extra or missing key.

Every user-facing string subject to localization must:

1. Be rendered through the localization mechanism rather than hard-coded
   directly in a component.
2. Have a translation key.
3. Have a corresponding value for `en-US`.
4. Have a corresponding value for `es-MX`.

The exact localization library and resource organization are technical
implementation decisions and should follow the project's architecture and
coding standards.

Components should not contain parallel language-selection logic such as:

    language === "es-MX" ? "Ingredientes" : "Ingredients"

Components should consume the application's localization mechanism instead.

## Missing Translation Behavior

English (`en-US`) is the runtime fallback language.

If a translation is unexpectedly unavailable for the active locale, the
corresponding English translation should be displayed when available.

However, runtime fallback is a resilience mechanism and must NOT be used as a
substitute for complete translation resources.

Automated tests must verify translation-resource key parity in BOTH
directions (every `en-US` key has an `es-MX` counterpart, and vice versa) for
every required user-facing translation key.

Missing translations must cause the appropriate automated test to fail.

## Numeric Formatting

Locale-specific numeric formatting is OUT OF SCOPE for this story.

No measurement-system conversion is in scope: the calculator continues using
inches for pizza diameter and grams for dough/ingredient weights in both
languages. Changing language must never convert inches to centimeters, or
grams to another unit.

The user-facing word "inches" may be translated (e.g. `inches` → `pulgadas`).
The `g` weight unit symbol remains `g` in both locales. Other user-facing
unit/noun labels may be localized where appropriate without changing the
underlying measurement system.

Existing formatting of:

- Ingredient weights
- Dough weights
- Diameters
- Baker's percentages
- Other numeric calculator output

must remain unchanged.

Localization must not alter calculator mathematics or numeric results.

## Future Localization Requirement

After this story is completed, localization becomes a project-wide development
standard.

All future features that introduce or modify user-facing text must:

1. Use the established localization mechanism.
2. Provide content for every supported locale.
3. Preserve translation-resource consistency.
4. Include appropriate automated regression coverage.

Hard-coded user-facing strings in application components should be considered
a violation of the project's coding standards unless explicitly justified.

Documentation updates are part of this story's scope. `docs/PROJECT.md`,
`docs/ARCHITECTURE.md`, and `docs/CODING_STANDARDS.md` must establish, at
minimum, that:

- `en-US` and `es-MX` are supported locales.
- User-facing strings use the localization mechanism rather than being
  hard-coded.
- Domain logic remains independent from localization concerns.
- New user-facing content must provide translations for every supported
  locale.
- Translation resources must maintain key parity.
- English is the runtime fallback locale.

`docs/TESTING.md`, `AGENTS.md`, and relevant agent instructions/prompts should
also be reviewed and updated where necessary so the existing workflow knows
how to enforce this standard. Detailed rules should live in the single most
appropriate authoritative document, with other documents referencing it
rather than duplicating the full policy.

## Acceptance Criteria

### AC-007-01 — Default English Language

Given no valid language preference exists in localStorage
and the browser's preferred language is not Spanish,
when the application starts,
then the application displays its user-facing content in English.

### AC-007-02 — Browser Spanish Detection

Given no valid language preference exists in localStorage
and the browser's preferred language is Spanish or a Spanish locale,
when the application starts,
then the application displays its user-facing content in Spanish (`es-MX`).

### AC-007-03 — Persisted Preference Takes Priority

Given a valid supported language preference exists in localStorage,
when the application starts,
then the stored language is used regardless of the browser's preferred
language.

### AC-007-04 — Language Selection

Given the application is running,
when the user selects English or Español from the language selector,
then all applicable user-visible application content changes to the selected
language without requiring a page reload.

### AC-007-05 — Language Persistence

Given the user explicitly selects a language,
when the application is refreshed or reopened,
then the previously selected language remains active.

### AC-007-06 — Invalid Stored Language

Given localStorage contains an unsupported or invalid language preference,
when the application starts,
then the application does not fail and resolves the language using the normal
browser-language/default fallback behavior.

### AC-007-07 — English Runtime Fallback

Given the active locale does not contain a requested translation
and an English translation exists,
when that content is rendered,
then the English translation is displayed.

### AC-007-08 — Complete Translation Resources

Given the application's translation resources,
when automated localization tests run,
then every required user-facing translation key exists for both `en-US` and
`es-MX`, with key parity verified in both directions (a key present in only
one locale's resource fails the test regardless of which locale is missing
it).

A missing required translation must cause the test to fail.

### AC-007-09 — Existing UI Is Fully Localized

Given either supported language is active,
when the user navigates through the calculator,
then user-facing content within the scope of the application is displayed in
the selected language without unintended mixtures of English and Spanish,
except for the language selector's own option labels, which intentionally
always display each language's native name regardless of the active locale
(see Language Selector).

### AC-007-10 — Ingredient Names Are Localized

Given Spanish is selected,
when the Ingredients table is displayed,
then ingredient names are presented using natural, commonly understood
Mexican Spanish terminology (see Spanish Translation Guidelines). Exact
wording is reviewed by a human developer rather than pre-approved by this
story, and is only a defect if it is clearly incorrect, misleading, or
unnatural.

### AC-007-11 — Calculations Are Unchanged

Given identical calculator inputs,
when the application language is changed between English and Spanish,
then calculated numeric results remain identical.

### AC-007-12 — Language Selector Presentation

Given the application header is displayed,
then the language selector appears in the top-right area and identifies the
available languages using a flag emoji and each language's own native name
("English" / "Español"), unaffected by the currently active locale.

### AC-007-13 — E2E Regression Coverage

Automated E2E tests must verify the localization workflow, including at
minimum:

- English display
- Spanish display
- User language switching
- Persistence after reload
- Browser-language selection when no stored preference exists
- Stored preference taking precedence over browser language
- Representative content from the application being translated
- Calculator results remaining unchanged when language changes

### AC-007-14 — Domain Layer Independence from Localization

Given the domain layer (`src/domain/`) and domain configuration,
when the localization mechanism is implemented,
then `src/domain/` contains no import of, or dependency on, the
localization/i18n library, and ingredient and thickness display names
presented to the user are resolved by the presentation layer from existing
stable domain identifiers (e.g. `flour`, `thin`) rather than from English
strings stored in domain configuration (e.g. `RECIPE_INGREDIENTS[key].name`
in `src/domain/recipe.ts`) or from component-level logic that branches on
the active language.

## Open Questions

None. The story resolves the material implementation decisions needed to
proceed (localization library and resource organization, the localStorage
key name and stored-value representation, exact Spanish wording, and header
layout fidelity) by explicitly deferring them to the Implementation Agent as
documented technical decisions, consistent with `docs/ARCHITECTURE.md` and
`docs/CODING_STANDARDS.md`.

## Out of Scope

- Additional languages beyond `en-US` and `es-MX`
- Locale-specific number formatting
- Locale-specific unit formatting
- Currency formatting
- Date/time localization
- Server-side localization
- Translation management services
- SVG or image-based flag assets
- Pixel-perfect redesign of the application header