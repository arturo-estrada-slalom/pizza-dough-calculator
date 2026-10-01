# Story 001 — Application Shell and Header

## Status

Ready for Implementation

## User Story

As a user,
I want the Pizza Dough Calculator to have a clear and responsive application
shell and header,
so that the application has a recognizable visual identity and provides a
consistent foundation for the calculator interface.

## Design References

The approved visual references for this story are:

- `docs/designs/desktop-pizza-layout.png`
- `docs/designs/mobile-layout.png`

These mockups define the visual direction for the application.

`docs/COLOR_PALETTE.md` is the authoritative source for exact color
values; use it rather than estimating colors from these mockups.

For this story, use the mockups ONLY as references for:

- The application background
- The page width and outer spacing
- The header
- The application title
- The pizza icon / branding treatment
- The subtitle
- Responsive header behavior
- Typography and spacing required to reproduce those elements, using
  `docs/COLOR_PALETTE.md` for exact color values

Other UI visible in the mockups is outside the scope of this story.

## Header Content

The header contains:

**Title**

Pizza Dough Calculator

**Subtitle**

Baker's percentages for home & professional use

The design also includes a small pizza icon next to the title.

## Implementation Context

The application uses:

- React
- TypeScript
- Material UI

Material UI is the project's primary component library.

The implementation should use the existing application architecture and
coding standards.

## Responsive Intent

The desktop mockup shows the header aligned with the main application content
inside a centered page container.

The mobile mockup shows the same branding adapted to the narrower viewport.

The implementation should preserve the same visual hierarchy across screen
sizes without requiring pixel-perfect reproduction of the mockups.

No specific pixel breakpoint is mandated by this story. The implementation
should use Material UI's responsive breakpoint system to select an
appropriate transition point between the desktop and mobile layouts. At
wider viewport sizes the application should follow the desktop design; at
narrower viewport sizes it should adapt to the mobile design. The
transition must preserve usability and visual hierarchy and must not
introduce horizontal overflow.

## Scope

This story implements ONLY:

1. The global application background.
2. The responsive page/container structure necessary for the application shell.
3. The Pizza Dough Calculator header.
4. The title.
5. The pizza branding/icon treatment.
6. The subtitle.
7. Styling required for these elements.

## Explicitly Out of Scope

Do NOT implement as part of this story:

- Pizza Settings card
- Diameter controls
- Thickness controls
- Number-of-pizzas controls
- Dough Ball card
- Recipe summary
- Ingredient table
- Pizza calculations
- Recipe calculations
- Application business logic
- Interactive calculator behavior

These elements may appear in the design references but belong to later stories.

Do not create placeholder implementations for out-of-scope sections unless
required purely to establish the application shell.

## Design vs. Domain Data

The design mockups are the source of truth for the visual intent of this story.

Any numeric pizza or recipe values visible in the mockups are illustrative
only and must not be interpreted as product requirements.

Domain behavior remains defined by `docs/PROJECT.md`.

---

## Feature Summary

This story establishes the Pizza Dough Calculator's application shell: a
full-page background, a centered/width-constrained responsive page
container, and a header containing a pizza icon/branding element, the
application title, and a subtitle. It reproduces the visual direction of
the desktop and mobile design mockups using the color tokens defined in
`docs/COLOR_PALETTE.md`, and responsively adapts between the two mockups
using Material UI's breakpoint system. It introduces no calculator
functionality (Pizza Settings, Dough Ball, Recipe Summary, Ingredients) —
those remain out of scope for later stories.

## Functional Requirements

1. The application shell shall render a full-page background using the
   "Page background" color token (`#F5F0E8`) from `docs/COLOR_PALETTE.md`.
2. The application shall render a header containing, in visual order: a
   pizza icon/branding element, the title "Pizza Dough Calculator", and
   the subtitle "Baker's percentages for home & professional use".
3. At wider viewport widths (per MUI breakpoints), the header and page
   content shall be rendered inside a centered, width-constrained
   container consistent with `docs/designs/desktop-pizza-layout.png`.
4. At narrower viewport widths (per MUI breakpoints), the header shall
   adapt to the layout shown in `docs/designs/mobile-layout.png` while
   retaining the icon, title, and subtitle without clipping or overlap.
5. Color values used for the background, title, subtitle, and
   icon/branding treatment shall be sourced from `docs/COLOR_PALETTE.md`
   tokens and applied through a single Material UI theme mechanism
   (not duplicated as raw hex values across components), per
   `docs/ARCHITECTURE.md` and `docs/CODING_STANDARDS.md`.
6. The shell shall not render any Pizza Settings, Dough Ball, Recipe
   Summary, or Ingredients UI, nor any placeholder for them.
7. The implementation shall not introduce a new runtime dependency
   (e.g., an icon library) solely to produce the pizza icon/branding
   element; it must be achieved with the currently approved dependencies
   (React, MUI, TypeScript) per `docs/CODING_STANDARDS.md`.
8. The pizza icon/branding element shall be implemented using the pizza
   emoji (🍕), rather than an original inline SVG, an image/icon-font
   asset, or a new icon-library dependency.

## Constraints

- Only `@mui/material`, `@emotion/react`, `@emotion/styled`, `react`, and
  `react-dom` are currently approved runtime dependencies (see
  `package.json`); `@mui/icons-material` is not installed. No pizza icon
  image asset is available. The icon/branding element must be the pizza
  emoji (🍕) character, without adding a new dependency and without
  authoring a custom SVG asset.
- Domain layer and calculation logic (`docs/PROJECT.md`,
  `docs/ARCHITECTURE.md`) are not touched by this story; no new domain
  code should be introduced.
- Color values must come from `docs/COLOR_PALETTE.md` and be defined once
  via the MUI theme, not hardcoded as hex values scattered across
  components (`docs/CODING_STANDARDS.md` §9).
- No specific pixel breakpoint is mandated; the Implementation Agent
  chooses an appropriate MUI breakpoint per the Responsive Intent section
  above.

## Edge Cases

- Ultra-wide viewports: the page container must remain centered and
  width-constrained rather than stretching to the full viewport width.
- Very narrow viewports (e.g., small phones narrower than the mobile
  mockup): the subtitle may wrap onto multiple lines (as shown in
  `docs/designs/mobile-layout.png`) but must not be clipped, truncated,
  or cause horizontal scrolling.
- Viewport resize across the responsive breakpoint (e.g., resizing a
  browser window or rotating a device) must not cause the header to
  disappear, duplicate, or lose its icon/title/subtitle hierarchy.
- Browser zoom or OS text-size scaling should not break the layout,
  though pixel-perfect behavior is not required.

## Acceptance Criteria

- **AC-001-01**: Given the application is loaded, then the header displays
  the title text "Pizza Dough Calculator".
- **AC-001-02**: Given the application is loaded, then the header displays
  the subtitle text "Baker's percentages for home & professional use".
- **AC-001-03**: Given the application is loaded, then a pizza icon/branding
  element is displayed adjacent to the title.
- **AC-001-04**: Given the application is loaded at a wider viewport size
  (per Material UI's responsive breakpoint system), then the header and
  page content are rendered inside a centered, width-constrained page
  container, consistent with `docs/designs/desktop-pizza-layout.png`.
- **AC-001-05**: Given the application is loaded at a narrower viewport
  size (per Material UI's responsive breakpoint system), then the header
  continues to display the icon, title, and subtitle, adapted to the
  mobile layout without clipping or overlapping elements, consistent with
  `docs/designs/mobile-layout.png`.
- **AC-001-06**: Given the application is loaded, then a full-page
  background treatment consistent with the design references is applied
  behind the header.
- **AC-001-07**: Given the application is loaded, then no Pizza Settings
  card, Dough Ball card, Recipe Summary, or Ingredients table is rendered
  (these remain out of scope for this story).
- **AC-001-08**: Given the viewport transitions between wider and narrower
  sizes, then the visual hierarchy (icon, then title, then subtitle) is
  preserved, usability is maintained, and no horizontal overflow or
  scrolling is introduced, without requiring pixel-perfect reproduction of
  the mockups.
- **AC-001-09**: Given the application is loaded, then the page background
  color is the "Page background" token (`#F5F0E8`) from
  `docs/COLOR_PALETTE.md`, applied via a shared Material UI theme rather
  than a component-local hard-coded hex value.
- **AC-001-10**: Given the application is loaded, then the title and
  subtitle text colors use the corresponding text tokens from
  `docs/COLOR_PALETTE.md` (e.g., high-emphasis for the title,
  low/medium-emphasis for the subtitle) rather than colors estimated from
  the design mockups.
- **AC-001-11**: Given the implementation is complete, then no new
  runtime dependency has been added to `package.json` solely to render
  the pizza icon/branding element.
- **AC-001-12**: Given the application is loaded, then the pizza
  icon/branding element is rendered using the pizza emoji (🍕), not a
  custom inline SVG, not an image file, and not an icon-font/icon-library
  glyph.

## Open Questions

Resolved:

- **Responsive breakpoint**: Confirmed non-blocking. No specific pixel
  breakpoint is required; the Implementation Agent retains flexibility to
  choose an appropriate MUI breakpoint, provided the result is responsive
  per AC-001-04, AC-001-05, and AC-001-08.
- **Pizza icon/branding technique**: Resolved — no icon resource is
  available, so the element is implemented using the pizza emoji (🍕)
  (see Functional Requirement 8, updated Constraints, and AC-001-12).
  A custom inline SVG and new icon-library dependencies are explicitly
  not used.

None remaining.