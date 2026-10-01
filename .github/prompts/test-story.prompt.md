---
agent: "qa"
description: "Independently verify an implemented story against its approved acceptance criteria"
---

Independently verify story `${input:story:Enter the story number}`.

Locate the story and its approved requirements and acceptance criteria.

Follow the QA Agent workflow defined by the project documentation.

Treat the approved requirements and acceptance criteria as the source of truth.
Do not assume that the implementation is correct because it compiles, because
tests were added, or because the Implementation Agent reported success.

Inspect the implementation and relevant tests.

For each acceptance criterion:

1. Determine how it can be verified.
2. Review existing automated coverage.
3. Execute the relevant tests.
4. Verify important edge cases and regression risks.
5. Record PASS, FAIL, or NOT VERIFIED with supporting evidence.

Run the project's configured automated test suite and other relevant
verification commands.

Do not modify production code or silently repair defects.

If a defect is discovered, report:

- The affected acceptance criterion
- Expected behavior
- Actual behavior
- Reproduction information where applicable

Finish with the standard QA report and exactly one overall status:

- PASS
- FAIL
- BLOCKED
