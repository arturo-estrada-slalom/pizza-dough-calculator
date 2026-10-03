# Story 006 — Fix Mobile Ingredient Table Layout

## Status

Ready for QA

## User Story

As a user viewing the pizza dough calculator on a narrow/mobile viewport,
I want ingredient weights and units to remain properly aligned and readable
when calculated values contain additional digits or decimal places,
so that the ingredient table remains visually consistent regardless of the
calculated recipe quantities.

## Context

The Ingredients table currently renders correctly for many common recipe
quantities. However, on narrow/mobile viewports, sufficiently wide calculated
values can exceed the available width of the Weight column.

When this occurs, the numeric value and its unit may wrap onto separate lines.
This also causes inconsistent row heights and makes the table appear
misaligned.

For example, values such as:

- `446.83 g`
- `277.03 g`
- `14.75 g`
- `760.5 g`

may wrap within the Weight column.

The layout should remain stable as calculated values change.

These example values are the canonical values used to verify this story. Any
verification of "remains on one line" behavior should use these values (or
values of comparable length) rather than the shorter values shown in the
reference image, which would not have exposed the defect.

### Supported Viewport Width

The minimum supported viewport width for this story is 320px. The table must
remain usable and structurally intact at 320px and above.

The existing MUI breakpoints continue to control the application's
responsive layout behavior (see `docs/ARCHITECTURE.md` and the existing
`sm`/`md` breakpoint usage in `src/App.styled.tsx`). The existing `sm`
breakpoint may continue to determine when mobile/stacked layout behavior
applies. Do not introduce a new application breakpoint solely because 320px
is the minimum supported width, unless implementation demonstrates a
concrete technical need for one.

## Feature Summary

Fix a presentation-only layout defect in the Ingredients table on
narrow/mobile viewports (down to 320px) where sufficiently wide calculated
Weight values (e.g. `446.83 g`) wrap the numeric value and the `g` unit onto
separate lines, breaking row alignment and visual consistency. The fix must
preserve the table's three-column structure (Ingredient, Weight, Baker's %),
keep weight values and the Total Dough value visually atomic on one line
wherever reasonably possible across the calculator's full expected input
range, avoid page-level horizontal scrolling, and not regress desktop
layout or any calculation behavior. No new MUI breakpoint should be
introduced solely to support 320px unless implementation demonstrates a
concrete technical need.

## Functional Requirements

1. At supported viewport widths (320px and above), the Ingredients table
   shall preserve structural integrity: no column's content overlaps an
   adjacent column, content is not unintentionally clipped, and wrapping in
   one cell does not cause unrelated cells in the same row to become
   visually misaligned.
2. Each ingredient's numeric weight and its `g` unit shall render together
   on one line wherever reasonably possible, for calculated values across
   the calculator's full expected input range (diameter 10"–20", 1–100
   pizzas, Thin/Standard/Thick thickness — see `src/components/
   PizzaSettings.tsx`), including but not limited to the canonical example
   values (`446.83 g`, `277.03 g`, `14.75 g`, `760.5 g`).
3. The Total Dough value and its `g` unit shall render together on one
   line, across the same expected range of values.
4. The Ingredients table shall maintain three visually distinct columns
   (Ingredient, Weight, Baker's %), with header cells remaining aligned to
   their corresponding data columns at all supported viewport widths.
5. The Weight column shall provide sufficient width for expected calculated
   values without unnecessarily compressing the Ingredient or Baker's %
   columns; no specific column widths or proportions are mandated.
6. Ingredient-name wrapping (e.g. "Bread Flour" onto two lines) is
   permitted at narrow widths, provided it remains readable, does not
   overlap another column, keeps the BASE chip associated with the Bread
   Flour row, and keeps the row structurally coherent.
7. The fix shall apply at all supported viewport widths from 320px upward
   without regressing the existing layout at larger (desktop) viewport
   sizes.
8. The table shall remain contained within its parent card; page-level
   horizontal scrolling is not acceptable at any supported viewport width.
   Contained horizontal scrolling within the table itself is an acceptable
   fallback only if needed to prevent content overlap, unreadable
   compression, clipping, or broken table structure.
9. This change shall not alter dough calculations, ingredient quantities,
   baker's percentages, calculator state, or recipe configuration, and
   shall not change number-formatting rules (`src/utils/formatWeight.ts`)
   beyond what is required to satisfy this story's presentation
   requirements.
10. No new application breakpoint shall be introduced solely because 320px
    is the minimum supported width; the existing `sm`/`md` MUI breakpoints
    (`src/App.styled.tsx`) continue to govern responsive layout behavior
    unless implementation demonstrates a concrete technical need for a new
    one.

## Design References

Current defective behavior:

`docs/designs/ingredient-table-mobile-overflow.png`

Expected visual behavior:

`docs/designs/ingredient-table-mobile-reference.png`

The reference image establishes the intended visual hierarchy, general
column alignment, row structure, readability, and overall presentation on
narrow/mobile viewports. It does NOT establish exact pixel dimensions or
mandatory column proportions, and pixel-perfect correspondence with the
reference is NOT required at 320px or other supported widths.

Exact numeric values in the reference image are illustrative and are not
requirements. Because the reference image's values are shorter than the
defective example values above, it does not by itself demonstrate correct
handling of the longer values — the example values in Context are the basis
for verification.

## Requirements

### Structural Integrity (General Requirement)

At supported viewport widths of 320px and above, table content may adapt or
wrap where appropriate, but the structural integrity of the Ingredients table
must be preserved:

- Content must not overlap adjacent columns.
- Content must not become unintentionally clipped.
- Wrapping in one cell must not cause unrelated cells to become visually
  misaligned.
- Weight values and their units should remain visually atomic (on one line)
  wherever reasonably possible.

This structural-integrity invariant is the primary requirement. The
single-line display of weight values (below) is the preferred outcome, not an
absolute requirement independent of this invariant.

### Ingredient Weight Display

Each ingredient's numeric weight and its `g` unit should remain together on a
single line whenever reasonably possible, for calculated values within the
expected range (see the example values in Context).

For example:

    446.83 g

should not render as:

    446.83
    g

The layout must accommodate the calculator's expected range of ingredient
weights without breaking the visual structure of the table.

### Total Dough Display

The Total Dough value and its `g` unit must also remain together on a single
line.

### Column Layout

The Ingredients table must maintain three visually distinct columns:

1. Ingredient
2. Weight
3. Baker's %

The Weight column must provide sufficient space for expected calculated values
without unnecessarily compressing the Ingredient or Baker's % columns. No
specific column widths or proportions are mandated — see "Design References".

Column alignment should remain visually consistent between the header and data
rows, and no column's content may overlap an adjacent column.

Ingredient-name wrapping (e.g. "Bread Flour" wrapping to two lines) is
acceptable at narrow widths, provided that:

- The content remains readable.
- It does not overlap another column.
- The BASE chip remains associated with the Bread Flour row.
- The resulting row remains structurally coherent, and other cells in the
  row remain correctly aligned.

This story does not require that all ingredient names remain on one line.

### Responsive Behavior

The fix must apply to narrow/mobile layouts, down to the 320px minimum
supported width, without introducing regressions at larger viewport sizes.

The table must remain contained within its parent card. Page-level horizontal
scrolling is NOT acceptable at any supported viewport width.

The preferred outcome is that the table fits within its card without any
horizontal scrollbar at supported viewport widths. However, contained
horizontal scrolling within the table itself (not the page) is an acceptable
fallback if it becomes necessary to prevent content overlap, unreadable
compression, clipping, or broken table structure. Internal scrolling should be
treated as graceful degradation, not the preferred solution.

### Existing Behavior

This story is a presentation/layout fix only.

It must NOT change:

- Dough calculations
- Ingredient quantities
- Baker's percentages
- Number formatting rules unless required to satisfy an explicitly documented
  presentation requirement
- Calculator state
- Recipe configuration

## Acceptance Criteria

### AC-006-01 — Ingredient weights remain on one line for expected values

Given the Ingredients table is displayed at a supported viewport width
(320px or greater),
when an ingredient weight matches one of the example values in Context (e.g.
`446.83 g`, `277.03 g`, `14.75 g`, `760.5 g`) or a value of comparable length,
then the numeric value and `g` unit are displayed together on one line.

### AC-006-02 — Total Dough remains on one line

Given the Ingredients table is displayed at a supported viewport width
(320px or greater),
when Total Dough is rendered,
then the numeric value and `g` unit are displayed together on one line.

### AC-006-03 — Columns do not overlap and remain aligned with headers

Given ingredient values of different lengths,
when the Ingredients table is rendered at a supported viewport width,
then no column's content overlaps an adjacent column, and each header cell
remains aligned with its corresponding data column.

### AC-006-04 — Row structure remains coherent under wrapping

Given ingredient weights or names of different lengths,
when the table is rendered at a supported viewport width,
then any wrapping that occurs (e.g. of an ingredient name) does not cause
cell content to overlap, become clipped, or cause unrelated cells in the same
row to become visually misaligned. The BASE chip remains associated with the
Bread Flour row regardless of wrapping.

### AC-006-05 — Table remains contained without page-level scrolling

Given a supported viewport width (320px or greater),
when the table contains expected recipe values,
then the table remains within its containing card and does not cause
horizontal page-level scrolling. Contained horizontal scrolling within the
table itself is acceptable only as a fallback when needed to prevent content
overlap, unreadable compression, clipping, or broken table structure.

### AC-006-06 — Desktop layout is not regressed

Given a desktop viewport,
when the Ingredients table is rendered,
then its existing desktop layout and alignment remain intact.

### AC-006-07 — Calculation behavior is unchanged

Given the same calculator inputs before and after this change,
when recipe quantities are calculated,
then the calculated ingredient weights, total dough, and baker's percentages
remain unchanged.

### AC-006-08 — Layout remains structurally intact for maximum-length calculated values

Given a 20-inch diameter, Thick thickness, and 100 pizzas (the maximum
supported input combination, producing values such as a ~52879.44 g flour
weight and a 90000 g Total Dough),
when the Ingredients table is rendered at a supported viewport width,
then the same structural-integrity requirements that apply to the
canonical example values also hold: no column overlap, no clipping, and
the numeric value and `g` unit remaining on one line wherever reasonably
possible, even though these values are longer than the canonical examples.

## Constraints

- This is a presentation-layer-only change (`docs/ARCHITECTURE.md`); it must
  not touch `src/domain/` or any calculation logic.
- No new raw color values may be introduced; this story has no documented
  color requirement, so existing theme/token usage (`docs/COLOR_PALETTE.md`,
  `src/theme.ts`) must be preserved unchanged.
- No new application breakpoint may be introduced solely to support the
  320px minimum width unless implementation demonstrates a concrete
  technical need (see Supported Viewport Width, above).
- Per `docs/TESTING.md` Section 17, real-browser layout invariants (no
  unintended wrapping, no overlap, no clipping, no page-level horizontal
  overflow) at the specified viewport widths cannot be proven with
  Vitest/RTL/jsdom and must be verified with targeted Playwright
  layout-invariant checks under `e2e/`.
- No new dependencies should be introduced to implement this fix.
- Existing component tests (e.g. `Ingredients.test.tsx`) must continue to
  pass; only update them if required by an intentional, documented
  presentation change in this story.

## Edge Cases

- The four canonical example values (`446.83 g`, `277.03 g`, `14.75 g`,
  `760.5 g`) are the primary basis for "remains on one line" verification.
- The calculator's maximum input combination (20" diameter, Thick
  thickness, 100 pizzas) produces a total dough weight of 90000 g and a
  flour weight of approximately 52879.44 g — an 8-character value longer
  than any canonical example. The layout must remain structurally intact
  for values at this end of the expected range too, not only the four
  canonical examples (see FR-2 and AC-006-08).
- The calculator's minimum input combination (10" diameter, Thin thickness,
  1 pizza) produces very short values (e.g. Yeast ≈ 0.21 g). Short values
  must also remain correctly aligned and visually unremarkable.
- "Bread Flour" wrapping to two lines at narrow widths, combined with a
  long Weight value in the same row, must not misalign that row's Weight or
  Baker's % cells, and the BASE chip must remain associated with the Bread
  Flour row.
- Exactly at the 320px minimum supported width, the table must remain
  usable and free of page-level horizontal scrolling.
- Desktop/tablet viewport widths (existing `sm`/`md` breakpoints and above)
  must not regress from current behavior.
- As inputs change (diameter, thickness, pizza count) and calculated value
  lengths change (e.g. from `14.75 g` to `446.83 g`), the table must not
  exhibit layout jank or structural breakage at any point.

## Open Questions

None. The only candidate ambiguity identified during analysis — whether
values longer than the four canonical examples (e.g. the ~52879.44 g
maximum-input flour value) are in scope — is resolved by the existing
requirement that the layout "accommodate the calculator's expected range of
ingredient weights," which spans the full documented input range (10"–20"
diameter, 1–100 pizzas, Thin/Standard/Thick). This is reflected in FR-2,
the Edge Cases above, and AC-006-08.

## Out of Scope

- Changing the pizza dough formula
- Changing calculation precision
- Changing baker's percentages
- Redesigning the Ingredients card
- Changing unrelated responsive layouts
- Modifying other calculator components unless required to prevent a direct
  regression caused by this fix