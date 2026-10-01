# Story 002 — Pizza Settings Panel

## Status

Verified

## User Story

As a user,
I want to configure the size and number of pizzas I intend to make,
so that the application can use those settings when calculating my dough
requirements.

## Design References

The approved visual references for this story are:

- `docs/designs/desktop-pizza-layout.png`
- `docs/designs/mobile-layout.png`

For this story, use the mockups as references for the Pizza Settings panel
only.

`docs/COLOR_PALETTE.md` is the authoritative source for exact color
values (e.g. the slider and selected-toggle accent color); use it rather
than estimating colors from these mockups.

The application shell and header are implemented separately by Story 001.

Other result and recipe sections visible in the mockups are outside the scope
of this story.

## Pizza Settings

The settings panel contains three sections:

1. Diameter
2. Thickness
3. Number of Pizzas

The visual organization, spacing, typography, dividers, and control treatment
should follow the supplied design references.

---

## Diameter

The user can select a pizza diameter.

The supported range is:

- Minimum: 10 inches
- Maximum: 20 inches
- Default: 14 inches

The control should use a slider consistent with the design reference.

The currently selected diameter should be clearly displayed in inches.

The minimum and maximum values should also be visible to provide context for
the slider range.

Changing the slider should update the displayed diameter value.

No pizza or dough calculations are required as part of this story.

---

## Thickness

The settings panel should visually include the three thickness options shown
in the design:

- Thin
- Standard
- Thick

For this story, Standard is the fixed/default thickness and the only
selectable option.

Thin and Thick must be visible but disabled, so the user cannot select them.

Thickness selection behavior is NOT implemented as part of this story.

The control exists to establish the final layout and visual design, but
functional thickness selection is reserved for Story 005.

The implementation should make it clear that Standard is the current,
selected option while Thin and Thick remain visibly present but
non-interactive.

---

## Number of Pizzas

The user can configure the number of pizzas.

The default number of pizzas is:

    4

The valid range is:

- Minimum: 1
- Maximum: 100

The control should follow the decrement/value/increment presentation shown in
the design reference.

The user should be able to:

- Increase the number of pizzas, up to the maximum of 100.
- Decrease the number of pizzas, down to the minimum of 1.

The number of pizzas must never fall below:

    1

The number of pizzas must never exceed:

    100

The currently selected quantity should be clearly displayed.

Changing the quantity should update the displayed value.

The decrement control should communicate that it cannot continue below the
minimum, for example by disabling it when the quantity is 1.

The increment control should communicate that it cannot continue beyond the
maximum, for example by disabling it when the quantity is 100.

No dough or ingredient calculations are required as part of this story.

---

## Implementation Context

The application uses:

- React
- TypeScript
- Material UI

Material UI is the project's primary component library.

Use Material UI controls and layout primitives where appropriate while
preserving the visual intent of the supplied mockups.

Follow the architecture and coding standards defined by the project
documentation.

---

## Responsive Intent

On desktop, the Pizza Settings panel should follow the left-side card layout
shown in:

`docs/designs/desktop-pizza-layout.png`

On smaller screens, the panel should adapt to the stacked mobile layout shown
in:

`docs/designs/mobile-layout.png`

Controls should remain usable and readable on touch-sized screens.

The implementation does not need to reproduce the mockups pixel-for-pixel,
but should preserve their visual hierarchy and interaction model.

---

## Scope

This story implements:

1. The Pizza Settings card.
2. Diameter slider and displayed diameter value.
3. Standard thickness selected, with Thin and Thick options visibly
   present but disabled.
4. Pizza quantity decrement control.
5. Pizza quantity display.
6. Pizza quantity increment control.
7. Responsive settings-panel layout.
8. Local UI state necessary for the controls implemented by this story.

---

## Explicitly Out of Scope

Do NOT implement as part of this story:

- Dough-ball calculations
- Total dough calculations
- Baker's percentage calculations
- Ingredient calculations
- Recipe results
- Dough Ball result card
- Recipe summary metrics
- Ingredient table
- Thin or Thick calculation behavior
- Thickness factors
- Domain calculation logic

The diameter and pizza-count controls should manage their values, but those
values do not yet need to drive calculator results.

Thickness functionality is explicitly reserved for a later story.

---

## Design vs. Domain Behavior

The design mockups define the visual intent of this story.

Numeric recipe and dough values visible elsewhere in the mockups are
illustrative and are not requirements for this story.

Product and domain rules defined by `docs/PROJECT.md` take precedence over
illustrative values shown in the design.

---

## Feature Summary

This story adds the Pizza Settings card to the application shell established
by Story 001: a Diameter slider (10–20", default 14"), a visually complete
but mostly non-interactive Thickness control (Thin / Standard / Thick, with
only "Standard" selected and selectable), and a Number of Pizzas
decrement/value/increment stepper (range 1–100, default 4). The panel is
purely presentational/UI-state at this stage — it manages its own control
values but does not read from or write to any dough/recipe calculation, and
it adapts responsively between the desktop left-side card layout and the
stacked mobile layout.

## Functional Requirements

1. The application shall render a "Pizza Settings" panel/card containing
   three sections, in order: Diameter, Thickness, and Number of Pizzas.
2. The Diameter section shall render a slider with minimum 10, maximum 20,
   and default value 14, and shall display the currently selected value
   together with an "inches" unit label.
3. The Diameter section shall display the slider's minimum (10) and
   maximum (20) values for context.
4. Moving the diameter slider shall update the displayed diameter value to
   match the new position, constrained to the 10–20 range; no dough or
   recipe calculation shall be triggered by this change.
5. The Thickness section shall display exactly three options — Thin,
   Standard, Thick — with "Standard" visually indicated as selected.
6. The Thin and Thick options shall be rendered in a visibly disabled
   state and shall not be selectable by the user; only "Standard" is
   selectable, and it is the fixed/default value for this story.
7. Interacting with the Thickness control shall not alter any dough,
   flour, water, or ingredient value, because this story introduces no
   calculation wiring (functional thickness selection is reserved for
   Story 005 per `docs/PROJECT.md` and the story's Explicitly Out of
   Scope section).
8. The Number of Pizzas section shall render a decrement control, a
   numeric display defaulting to 4, and an increment control.
9. Activating the increment control shall increase the displayed quantity
   by 1, up to a maximum of 100; at 100 the increment control shall be
   disabled and the quantity shall not exceed 100.
10. Activating the decrement control shall decrease the displayed quantity
    by 1, down to a minimum of 1; at 1 the decrement control shall be
    disabled and the quantity shall not fall below 1.
11. At wider viewport widths (per MUI breakpoints), the Pizza Settings
    panel shall render as the left-side card consistent with
    `docs/designs/desktop-pizza-layout.png`.
12. At narrower viewport widths (per MUI breakpoints), the Pizza Settings
    panel shall adapt to the stacked layout consistent with
    `docs/designs/mobile-layout.png`, keeping all controls usable and
    readable.
13. This story shall introduce only the local UI state needed to drive the
    Diameter, Thickness-display, and Number-of-Pizzas controls; it shall
    not introduce or call any domain/calculation function, and shall not
    render or update any Dough Ball, Recipe Summary, or Ingredients UI.
14. Colors used for the slider's active track/thumb and the selected
    thickness indicator shall be sourced from `docs/COLOR_PALETTE.md`
    (Primary / terracotta token) and applied through the existing shared
    Material UI theme (`src/theme.ts`), not as component-local hard-coded
    hex values, per `docs/ARCHITECTURE.md` and `docs/CODING_STANDARDS.md`.

## Constraints

- Only the currently approved dependencies (`@mui/material`,
  `@emotion/react`, `@emotion/styled`, `react`, `react-dom`) may be used;
  no new runtime dependency may be added for this story
  (`docs/CODING_STANDARDS.md` §1).
- No domain layer code (calculation functions, recipe/reference
  constants) may be introduced or modified by this story; diameter,
  thickness, and pizza-count values are local UI state only
  (`docs/ARCHITECTURE.md`, `docs/PROJECT.md`).
- Diameter and pizza-count values must be constrained using the MUI
  controls' own `min`/`max`/`step` behavior (e.g. `Slider`, disabled
  `IconButton`s) rather than hand-written range-checking logic duplicated
  elsewhere (`docs/CODING_STANDARDS.md` §10).
- Styled components must live in sibling `<FileName>.styled.tsx` files per
  existing convention (e.g. `AppHeader.styled.tsx`), and color values must
  be sourced from `docs/COLOR_PALETTE.md` through the single shared theme
  in `src/theme.ts` — not re-declared as raw hex values in component code
  (`docs/CODING_STANDARDS.md` §9). If a palette token needed by this story
  (e.g. "Medium emphasis" text, `#4A3728`) is not yet present in
  `src/theme.ts`, it should be added to the shared theme rather than
  hard-coded locally.
- No specific pixel breakpoint is mandated; the Implementation Agent
  chooses an appropriate MUI breakpoint consistent with the responsive
  approach already established by Story 001.
- Thickness functional selection logic (switching the active thickness
  and any resulting calculation impact) must not be implemented; Thin and
  Thick remain permanently disabled until Story 005.
- No Dough Ball card, Recipe Summary, or Ingredients table may be
  rendered or stubbed as part of this story.

## Edge Cases

- Diameter slider at the exact minimum (10) and maximum (20) boundaries:
  the displayed value must match exactly and must not be clamped to a
  value outside the labeled range.
- Keyboard interaction with the diameter slider (e.g. arrow keys) must
  still respect the 10–20 range via the control's own min/max handling.
- Repeated/rapid activation of the increment or decrement control at its
  respective boundary (100 or 1) must leave the displayed quantity
  unchanged and must not disable the opposite control or throw an error.
- The increment and decrement controls must be operable via both pointer
  and keyboard activation (e.g. Enter/Space on a focused button), and
  must reflect their disabled state to assistive technology (e.g. native
  `disabled` semantics) at the 1 and 100 boundaries.
- Viewport resize/orientation change across the responsive breakpoint
  while the panel is visible must preserve the current diameter,
  thickness-display, and pizza-count values without resetting them.
- Very narrow viewports must not clip, truncate, or cause horizontal
  overflow of the Diameter, Thickness, or Number of Pizzas controls.

---

## Acceptance Criteria

- **AC-002-01**: Given the application loads, then a "Pizza Settings" panel
  is displayed containing Diameter, Thickness, and Number of Pizzas
  sections.
- **AC-002-02**: Given the application loads, then the diameter slider
  defaults to 14 inches, with "14" displayed as the current diameter value
  alongside an "inches" unit label.
- **AC-002-03**: Given the application loads, then the diameter slider's
  minimum (10") and maximum (20") values are visibly displayed near the
  slider.
- **AC-002-04**: Given the user moves the diameter slider, when the slider
  value changes, then the displayed diameter value updates to match the
  new slider position, constrained to the 10–20 inch range.
- **AC-002-05**: Given the application loads, then the Thickness section
  displays exactly three options: Thin, Standard, and Thick.
- **AC-002-06**: Given the application loads, then "Standard" is visually
  indicated as the currently selected thickness option.
- **AC-002-07**: Given the application loads, then the Thin and Thick
  thickness options are rendered in a visibly disabled state and cannot be
  selected by the user.
- **AC-002-08**: Given the application loads, then Standard remains the
  only selectable thickness option, and no dough, flour, water, or
  ingredient calculation result changes as a result of interacting with
  the Thickness control (functional thickness selection is reserved for
  Story 005).
- **AC-002-09**: Given the application loads, then the Number of Pizzas
  control displays a default value of "4".
- **AC-002-10**: Given the displayed number of pizzas is less than 100,
  when the user activates the increment control, then the displayed
  number of pizzas increases by one.
- **AC-002-11**: Given the displayed number of pizzas is 100, when the
  user activates the increment control, then the displayed number of
  pizzas remains 100 and does not exceed 100, and the increment control is
  disabled at this value.
- **AC-002-12**: Given the displayed number of pizzas is greater than 1,
  when the user activates the decrement control, then the displayed
  number of pizzas decreases by one.
- **AC-002-13**: Given the displayed number of pizzas is 1, when the user
  activates the decrement control, then the displayed number of pizzas
  remains 1 and does not decrease below 1, and the decrement control is
  disabled at this value.
- **AC-002-14**: Given the application loads on a desktop-width viewport,
  then the Pizza Settings panel is positioned as the left-side card,
  consistent with `docs/designs/desktop-pizza-layout.png`.
- **AC-002-15**: Given the application loads on a narrower viewport, then
  the Pizza Settings panel adapts to a stacked layout consistent with
  `docs/designs/mobile-layout.png`, with the diameter, thickness, and
  number-of-pizzas controls remaining usable and readable.
- **AC-002-16**: Given the application loads, then no Dough Ball card,
  Recipe Summary, or Ingredients table is rendered or updated as a result
  of interacting with the Pizza Settings controls (calculation and results
  presentation remain out of scope for this story).
- **AC-002-17**: Given the application is loaded, then the diameter
  slider's active track/thumb and the "Standard" thickness selected
  indicator use the Primary color token (`#B85C2A`) from
  `docs/COLOR_PALETTE.md`, applied via the shared Material UI theme
  (`src/theme.ts`) rather than a component-local hard-coded hex value.
- **AC-002-18**: Given the application is loaded, then the Pizza Settings
  panel is presented as a card/panel using the "Card / Paper" background
  token (`#FFFCF5`) from `docs/COLOR_PALETTE.md`, applied via the shared
  Material UI theme rather than a component-local hard-coded hex value.

## Open Questions

None remaining. The control implementation details (e.g. exact MUI
component used for the Thickness display — `ToggleButtonGroup` vs. another
construct — and the precise responsive breakpoint) are left to the
Implementation Agent per the Responsive Intent and Implementation Context
sections above, and do not materially affect the acceptance criteria.