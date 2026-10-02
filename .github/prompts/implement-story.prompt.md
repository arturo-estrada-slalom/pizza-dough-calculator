---
agent: "implementation"
description: "Plan and implement an approved project story"
---

Implement story `${input:story:Enter the story number}`.

Locate the corresponding story and its approved requirements and acceptance
criteria.

Follow the Implementation Agent workflow defined by the project documentation.

Before modifying code:

1. Inspect the current implementation.
2. Review the approved requirements and acceptance criteria.
3. Identify the smallest change that satisfies the story.
4. Produce a concise technical implementation plan.
5. Identify the tests that must be created or updated.

Then implement the approved story.

Follow the project's architecture, coding standards, and testing guidelines.

When extracting non-rendering logic from a component, follow the utility and
helper organization rules in `docs/ARCHITECTURE.md` (domain layer vs. a
colocated `<ComponentName>.<utility-type>.ts` helper vs. `src/utils/`). If a
directly relevant violation already exists in code the story touches, fix or
note it rather than performing unrelated repository-wide refactoring.

When the story includes visual/UI requirements, use documented color values
from `docs/COLOR_PALETTE.md` rather than approximating colors from design
mockups or screenshots.

Do not expand the scope beyond the approved requirements.

After implementation:

- Run the relevant automated tests.
- Run configured linting and type checking where applicable.
- Report the files changed.
- Summarize the implementation.
- Report tests added or modified.
- Report verification commands and their results.
- Identify any remaining concerns for QA.

Do not declare the story independently verified. Final verification belongs
to the QA Agent.

## Mandatory Story Status Gate

Before performing ANY implementation work, read the story's current
`## Status`.

The Implementation Agent may begin work ONLY when the story status is:

    Ready for Implementation

or:

    Implementation Required

These are hard workflow prerequisites.

If the story has any other status, including:

- Draft
- In Progress
- Ready for QA
- Verified

the agent MUST NOT:

- Modify production code.
- Modify tests.
- Create implementation files.
- Refactor code.
- Change dependencies.
- Change project configuration.
- Begin partial or preparatory implementation work.
- Create an implementation plan.

Instead, STOP and report:

    IMPLEMENTATION BLOCKED

    Story: <story>
    Current Status: <status>
    Required Status: Ready for Implementation or Implementation Required

Do not change the story status yourself in order to bypass this gate.

Only the Requirements Agent may promote a Draft story to `Ready for
Implementation`, after requirements analysis is complete and all blocking
questions have been resolved.

`Implementation Required` is the exception used when QA has returned a story
for defect correction.

## Status Transitions

When implementation work begins on an eligible story, change its status to:

    In Progress

Once implementation and developer-side verification are complete and the
implementation report has been created or updated (see below), change the
story status to:

    Ready for QA

Do not move a story to `Ready for QA` without first creating or updating its
implementation report.

## Durable Implementation Handoff

Before moving a story to `Ready for QA`, create or update its implementation
report at:

    docs/reports/<story-number>-implementation.md

The implementation report must reflect the CURRENT implementation being
submitted to QA.

It must contain:

- Implementation summary
- Files created, modified, or deleted
- Purpose of each file change
- Tests created or modified
- Verification commands executed
- Verification results
- Acceptance criteria addressed
- Known issues or remaining concerns

The report must describe work that was actually completed, not merely the
original implementation plan.

Do not rely on conversational context being available to the QA Agent.

A story must not be moved to `Ready for QA` until its implementation report
has been created or updated.

### Rework After QA Failure

When a story has status:

    Implementation Required

the Implementation Agent must review the QA findings before making changes.

After correcting the reported defects, the agent MUST update the existing
implementation report before returning the story to `Ready for QA`.

The updated report must reflect any additional:

- Files created, modified, or deleted
- Production code changes
- Test changes
- Acceptance criteria affected
- Verification commands executed
- Verification results
- Known issues or remaining concerns

Do not create a separate implementation report for each QA attempt.

The existing implementation report is the durable handoff artifact for the
story and must remain accurate as the implementation evolves.

### Rework History

When implementation changes are made in response to QA findings, append a
concise entry to a `Rework History` section.

Each entry should identify:

- The QA issue or failed acceptance criterion
- The corrective action taken
- Files affected
- Tests added or updated
- Verification performed

Do not remove previous rework entries.

The main sections of the implementation report should always describe the
CURRENT implementation. The Rework History records how the implementation
changed in response to QA.
