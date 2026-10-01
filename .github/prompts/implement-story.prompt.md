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
