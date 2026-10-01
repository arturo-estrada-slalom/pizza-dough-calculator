# Agent Instructions

Before performing work on this repository, consult the relevant
documentation under `/docs`.

## Required Documentation

- `docs/PROJECT.md` — product overview, domain model, requirements, and
  calculation rules.
- `docs/ARCHITECTURE.md` — architectural layers, dependency direction,
  and boundaries between presentation, domain, and domain configuration.
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
  direction, and maintaining a single source of truth for recipe/reference
  constants — in addition to `docs/PROJECT.md` and
  `docs/CODING_STANDARDS.md`.
- Implementation agents must follow `docs/TESTING.md` when adding or
  changing functionality, in addition to `docs/PROJECT.md` and
  `docs/CODING_STANDARDS.md`.
- QA/testing agents must consult `docs/TESTING.md` before creating,
  modifying, or executing tests.
- Every agent must identify which role it is performing (Requirements,
  Implementation, or QA) and follow that role's responsibilities and
  boundaries as defined in `docs/AGENT_WORKFLOW.md` — in particular,
  Implementation agents must not self-certify their own change as
  verified, and QA agents must not silently fix code or weaken tests to
  force a pass.

Do not implement functionality explicitly documented as reserved
for the agent demonstration.