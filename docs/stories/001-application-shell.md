# Story 001 — Application Shell and Header

## Status

Draft

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