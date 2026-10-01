---
agent: "requirements"
description: "Analyze a project story and produce implementation-ready requirements and acceptance criteria"
---

Analyze story `${input:story:Enter the story number}`.

Locate the corresponding story in the project's stories directory.

Follow the Requirements Agent workflow defined by the project documentation.

Use the story as the requested product change and analyze it against the
existing project requirements and current application behavior.

Produce the standard requirements output defined for this project, including:

- Feature summary
- Functional requirements
- Acceptance criteria
- Edge cases
- Open questions, if any

Do not implement the story or modify application source code.

If a material ambiguity prevents the story from becoming implementation-ready,
identify it clearly rather than inventing a product decision.
