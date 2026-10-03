# Agent Instructions

Before performing work on this repository, consult the relevant
documentation under `/docs`.

## Required Documentation

- `docs/PROJECT.md` — product overview, domain model, requirements, and
  calculation rules.
- `docs/ARCHITECTURE.md` — architectural layers, dependency direction,
  and boundaries between presentation, domain, and domain configuration.
- `docs/COLOR_PALETTE.md` — the authoritative application color palette
  and intended color usage. Design mockups define layout and visual
  hierarchy; this guide defines exact color values and takes precedence
  when mockup colors are ambiguous or differ from it.
- `docs/CODING_STANDARDS.md` — coding conventions and engineering standards.
- `docs/TESTING.md` — testing strategy, conventions, test organization,
  and verification expectations.
- `docs/AGENT_WORKFLOW.md` — how Requirements, Implementation, and QA
  agents collaborate, their individual responsibilities and boundaries,
  and the defect-resolution loop between implementation and QA.

Agents must follow these documents when analyzing, planning,
implementing, reviewing, or testing changes.

- Implementation agents must follow `docs/ARCHITECTURE.md` when adding or
  changing functionality — keeping domain logic out of React components,
  preserving the presentation → domain → domain configuration dependency
  direction, following its utility and helper organization rules (domain
  layer vs. colocated component-specific helpers vs. `src/utils/`), and
  maintaining a single source of truth for recipe/reference constants — in
  addition to `docs/PROJECT.md` and `docs/CODING_STANDARDS.md`.
- Implementation agents must use `docs/COLOR_PALETTE.md` as the source of
  truth for color values when implementing or styling UI, rather than
  colors estimated from design mockups or screenshots, and apply them
  through a single theme/token mechanism per `docs/CODING_STANDARDS.md`.
- Implementation agents must follow `docs/TESTING.md` when adding or
  changing functionality, in addition to `docs/PROJECT.md` and
  `docs/CODING_STANDARDS.md`. This includes `docs/TESTING.md`'s "E2E
  Regression Coverage Requirement": every story that changes or
  introduces observable application behavior must leave behind automated
  Playwright E2E regression coverage, and a story must not move to
  `Ready for QA` while required coverage is missing.
- QA/testing agents must consult `docs/TESTING.md` before creating,
  modifying, or executing tests, and must independently verify that
  required E2E regression coverage exists per that policy — treating
  missing or insufficient coverage as a FAIL finding rather than adding
  the missing tests themselves.
- QA/testing agents must verify visual/color requirements against
  `docs/COLOR_PALETTE.md` rather than approximating colors from
  screenshots or mockups.
- Every agent must identify which role it is performing (Requirements,
  Implementation, or QA) and follow that role's responsibilities and
  boundaries as defined in `docs/AGENT_WORKFLOW.md` — in particular,
  Implementation agents must not self-certify their own change as
  verified, and QA agents must not silently fix code or weaken tests to
  force a pass.

Do not implement functionality explicitly documented as reserved
for the agent demonstration.