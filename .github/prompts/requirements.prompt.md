---
agent: "requirements"
description: "Analyze a project story and produce implementation-ready requirements and acceptance criteria"
---

Analyze story `${input:story:Enter the story number}`.

Locate the corresponding story in the project's stories directory.

Follow the Requirements Agent workflow defined by the project documentation.

## Mandatory Story Status Gate

Before performing ANY requirements analysis, read the story's current
`## Status`.

The Requirements Agent may begin work ONLY when the story status is:

    Draft

If the story has any other status, the agent MUST NOT:

- Modify the story file.
- Produce revised requirements, acceptance criteria, or open questions.
- Change the story status.

Instead, STOP and report:

    REQUIREMENTS BLOCKED

    Story: <story>
    Current Status: <status>
    Required Status: Draft

Use the story as the requested product change and analyze it against the
existing project requirements and current application behavior.

When the story includes visual/UI requirements, recognize
`docs/COLOR_PALETTE.md` as the authoritative reference for color decisions,
distinct from the layout-focused design mockups.

Persist the standard requirements output defined for this project into the
story file, including:

- Feature summary
- Functional requirements
- Constraints
- Edge cases
- Acceptance criteria
- Open questions, if any

When writing acceptance criteria, follow the project's existing numbering
convention, `AC-<story-number>-<NN>` (e.g. `AC-003-07`), continuing the
sequence already used in the story if acceptance criteria already exist.

If the story already contains `## Acceptance Criteria` or `## Open
Questions` sections from a previous analysis pass, append new findings and
update existing entries rather than deleting prior content, unless a prior
entry is explicitly superseded by newly resolved information.

Do not implement the story or modify application source code.

If a material ambiguity prevents the story from becoming implementation-ready,
identify it clearly rather than inventing a product decision.

Your analysis must not exist only as chat output.

Update the story file with the results of the requirements analysis so that
the story becomes a self-contained implementation artifact.

Do not rely on conversational context being available to subsequent agents.

If no blocking open questions remain, change the story status from:

    Draft

to:

    Ready for Implementation

If blocking questions remain, keep the story in Draft status and document
those questions in the story.

The Implementation Agent must be able to understand and implement the story
later using only the repository and project documentation, without access to
this conversation.

In the chat response, provide a concise summary of what changed and the
resulting story status. The story file is the source of truth — do not fully
restate its persisted content in chat.
