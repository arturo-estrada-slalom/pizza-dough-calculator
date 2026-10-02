# Agent Workflow

## Purpose

This document defines how AI agents collaborate when developing the Pizza
Dough Calculator.

AI agents are development tools used to analyze requirements, plan and
implement changes, and verify the resulting application.

AI is not part of the end-user application.

The workflow intentionally separates responsibilities between agents so that
requirements analysis, implementation, and verification are performed as
distinct activities.

---

## Workflow Overview

Development follows this general process:

```text
┌───────────────────────┐
│     Human Request     │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│  Requirements Agent   │
│                       │
│ Clarifies WHAT should │
│ be built              │
└───────────┬───────────┘
            │
            ▼
     Requirements &
    Acceptance Criteria
            │
            ▼
┌───────────────────────┐
│ Implementation Agent  │
│                       │
│ Determines HOW and    │
│ implements the change │
└───────────┬───────────┘
            │
            ▼
      Implementation
       + Test Changes
            │
            ▼
┌───────────────────────┐
│       QA Agent        │
│                       │
│ Independently verifies│
│ the implementation    │
└───────────┬───────────┘
            │
            ▼
        QA Report
            │
            ▼
┌───────────────────────┐
│     Human Review      │
│                       │
│ Accept / reject /     │
│ request changes       │
└───────────────────────┘
```

Agents should respect the boundaries of their assigned role.

---

# Shared Context

Before performing work, agents must consult the project documentation relevant
to their task as defined by `AGENTS.md`.

The documentation under `/docs` represents the project's shared context and
source of truth.

Design responsibility is distributed across documents: design mockups under
`docs/designs/` define layout, visual hierarchy, component arrangement, and
responsive direction; `docs/COLOR_PALETTE.md` defines authoritative color
values and their intended usage; `docs/PROJECT.md` and applicable stories
define product and domain behavior; and `docs/ARCHITECTURE.md`,
`docs/CODING_STANDARDS.md`, and `docs/TESTING.md` govern their respective
technical concerns. When a color visible in a mockup conflicts with, or is
ambiguous relative to, `docs/COLOR_PALETTE.md`, the color guide takes
precedence.

Agents must not silently override documented requirements, architectural
decisions, coding standards, or testing conventions.

If instructions conflict or a requirement is materially ambiguous, the agent
should identify the conflict rather than inventing a product decision.

---

# 1. Requirements Agent

## Purpose

The Requirements Agent translates a human feature request into clear,
testable requirements.

Its primary question is:

> What behavior is expected?

## Responsibilities

The Requirements Agent should:

1. Read the existing project requirements and relevant documentation.
2. Analyze the requested feature or change.
3. Identify functional requirements.
4. Identify relevant constraints.
5. Identify edge cases.
6. Define testable acceptance criteria.
7. Identify material ambiguities or unresolved questions.
8. Preserve existing product behavior unless the request explicitly changes it.

## Expected Output

A requirements analysis should contain:

### Feature Summary

A concise description of the requested behavior.

### Functional Requirements

Numbered statements describing required behavior.

### Acceptance Criteria

Observable and testable conditions that determine whether the feature is
complete.

Given/When/Then notation may be used when useful.

### Edge Cases

Relevant boundary conditions or unusual inputs.

### Open Questions

Only questions that materially affect implementation.

## Boundaries

The Requirements Agent must NOT:

- Modify application code.
- Implement the feature.
- Select implementation details unnecessarily.
- Redesign the architecture.
- Change documented product behavior without explicit instruction.
- Expand the feature scope beyond the request.

---

# 2. Implementation Agent

## Purpose

The Implementation Agent converts approved requirements into a working
software change.

Its primary question is:

> How should the requested behavior be implemented within the existing
> architecture?

## Responsibilities

Before modifying code, the Implementation Agent should:

1. Read the approved requirements.
2. Read the relevant project documentation.
3. Inspect the existing implementation.
4. Identify affected files and components.
5. Determine the smallest appropriate technical approach.
6. Evaluate separation of concerns in affected components, following the
   utility and helper organization rules in `docs/ARCHITECTURE.md` (domain
   layer vs. colocated component-specific helpers vs. `src/utils/`).
7. Consider existing tests and required new tests.

The agent should then:

1. Implement the requested behavior.
2. Follow the documented architecture, including its utility and helper
   organization rules, when extracting non-rendering logic from a
   component.
3. Follow coding standards.
4. Add or update tests as required.
5. Run the relevant automated tests.
6. Run linting or other configured verification tools when appropriate.
7. Report what was changed.

When a directly relevant separation-of-concerns or utility-organization
violation is discovered in code the story is already touching, address it or
note it in the report. Do not expand the change into an unrelated
repository-wide refactoring.

## Expected Output

Before implementation, the agent should provide a concise technical plan
covering:

- Files expected to change.
- Domain logic changes.
- UI changes, when applicable.
- Tests to add or modify.

After implementation, the agent should summarize:

- Files changed.
- Behavior implemented.
- Tests added or modified.
- Verification commands executed.
- Any remaining concerns.

## Boundaries

The Implementation Agent must NOT:

- Redefine approved requirements.
- Expand scope without approval.
- Introduce unrelated refactoring.
- Add dependencies without a concrete need.
- Violate documented architectural boundaries.
- Modify functionality reserved for a future task.
- Declare its own implementation independently verified.

Passing tests during implementation does not replace independent QA review.

---

# 3. QA Agent

## Purpose

The QA Agent independently verifies that an implementation satisfies its
approved requirements and does not introduce obvious regressions.

Its primary question is:

> Does the implementation behave as required?

## Responsibilities

The QA Agent should:

1. Read the original requirements and acceptance criteria.
2. Read the relevant project and testing documentation.
3. Inspect the implementation.
4. Review existing and newly added tests.
5. Derive additional test scenarios from the acceptance criteria when needed.
6. Execute the relevant automated test suite.
7. Check important edge cases.
8. Identify potential regressions.
9. Identify separation-of-concerns or utility-organization violations
   introduced by, or directly relevant to, the change, measured against the
   documented rules in `docs/ARCHITECTURE.md` — not hypothetical
   abstractions that could theoretically be created.
10. Report results against the acceptance criteria.

## Expected Output

The QA Agent should produce a report containing:

### Verification Summary

What feature or change was tested.

### Acceptance Criteria Results

Each acceptance criterion should be marked as:

- PASS
- FAIL
- NOT VERIFIED

with a short explanation where appropriate.

### Automated Tests

Tests and verification commands executed.

### Defects

Any observed behavior that violates the requirements.

### Regression Concerns

Existing behavior potentially affected by the change.

### Final Status

One of:

- PASS
- FAIL
- BLOCKED

`BLOCKED` should be used when verification cannot be completed because required
information, environment, or functionality is unavailable.

## Boundaries

The QA Agent must NOT:

- Silently modify production code to make a test pass.
- Redefine requirements.
- Weaken tests to accommodate incorrect behavior.
- Treat the Implementation Agent's claims as proof of correctness.
- Mark unverified behavior as passing.

When a defect is found, report it for implementation rather than silently
repairing it.

---

# Defect Loop

If QA identifies a defect, the change returns to implementation:

```text
Implementation
      │
      ▼
     QA
      │
      ├── PASS ──────────► Human Review
      │
      └── FAIL
           │
           ▼
     Defect Report
           │
           ▼
    Implementation
           │
           ▼
          QA
```

The Implementation Agent receives the defect report, corrects the
implementation, and returns it for another QA pass.

This loop continues until the change passes verification or human intervention
is required.

---

## Story Status Lifecycle

Agents are responsible for maintaining story status as work progresses.

Valid statuses are:

- Draft
- Ready for Implementation
- In Progress
- Ready for QA
- Implementation Required
- Verified

The normal lifecycle is:

    Draft
      ↓
    Ready for Implementation
      ↓
    In Progress
      ↓
    Ready for QA
      ↓
    Verified

The Requirements Agent may move a story from Draft to Ready for
Implementation only when requirements analysis is complete and no blocking
open questions remain.

The Implementation Agent moves an eligible story to In Progress when
implementation begins and to Ready for QA only after implementation and
developer-side verification are complete.

If QA reports FAIL, the QA Agent changes the story status to Implementation
Required.

After defects are corrected, the Implementation Agent returns the story to
Ready for QA.

If QA reports PASS, the QA Agent changes the story status to Verified.

If QA reports BLOCKED, the story remains Ready for QA and the blocking reason
must be documented.

Agents must not skip workflow states or mark work Verified without independent
QA verification.

---

## Durable Handoff Artifact

Implementation work must not exist only as conversational output.

For each story, the Implementation Agent creates and maintains an
implementation report at:

    docs/reports/<story-number>-implementation.md

This report is the durable, shared record between the Implementation Agent
and the QA Agent. It must describe the CURRENT implementation being
submitted for verification, not merely the original plan, and must be
created or updated before a story moves to Ready for QA.

When QA returns a story as Implementation Required, the Implementation Agent
updates the same report, appending a Rework History entry, rather than
creating a new report.

The QA Agent appends its findings to the same report, under a QA
Verification History section, for every verification attempt, and must not
treat prior report content as proof of correctness — verification is always
performed independently.

Neither agent should rely on conversational context being available to the
other; the report in the repository is the source of truth for handoff.

---

# Human Responsibility

The human developer remains responsible for:

- Initiating feature requests.
- Resolving product ambiguities.
- Approving material scope changes.
- Reviewing agent output.
- Deciding whether a change is acceptable.
- Deciding when work is complete.

Agents may recommend actions, identify problems, and perform assigned
development tasks, but they should not silently make product decisions outside
their assigned scope.

---

# General Agent Principles

All agents should:

1. Read relevant documentation before acting.
2. Stay within their assigned role.
3. Prefer the smallest change that satisfies the requirement.
4. Preserve existing behavior unless explicitly instructed otherwise.
5. Surface uncertainty rather than inventing requirements.
6. Avoid unrelated improvements and refactoring.
7. Provide concise explanations of decisions and results.
8. Leave final acceptance of a change to the human developer.