---
agent: "qa"
description: "Independently verify an implemented story against its approved acceptance criteria"
---

Independently verify story `${input:story:Enter the story number}`.

Locate the story and its approved requirements and acceptance criteria.

Follow the QA Agent workflow defined by the project documentation.

## Mandatory Story Status Gate

Before performing ANY verification work, read the story's current
`## Status`.

The QA Agent may begin work ONLY when the story status is:

    Ready for QA

If the story has any other status, the agent MUST NOT:

- Modify the story file.
- Modify the implementation report.
- Execute verification steps.

Instead, STOP and report:

    QA BLOCKED

    Story: <story>
    Current Status: <status>
    Required Status: Ready for QA

Treat the approved requirements and acceptance criteria as the source of truth.
Do not assume that the implementation is correct because it compiles, because
tests were added, or because the Implementation Agent reported success.

Inspect the implementation and relevant tests.

For each acceptance criterion:

1. Determine how it can be verified.
2. Review existing automated coverage.
3. Execute the relevant tests.
4. Verify important edge cases and regression risks.
5. Record PASS, FAIL, or NOT VERIFIED — identified by its
   `AC-<story-number>-<NN>` ID — with supporting evidence.

When verifying visual/color requirements, check colors against
`docs/COLOR_PALETTE.md` using the two-tier approach defined in
`docs/TESTING.md` Section 17: first diff the theme's palette tokens
against the documented values, then, if the story requires it, run or add
a targeted Playwright spot-check under `e2e/` (`npm run test:e2e`) rather
than estimating colors from screenshots or mockups.

Run the project's configured automated test suite and other relevant
verification commands.

Do not modify production code or silently repair defects.

If a defect is discovered, report:

- The affected acceptance criterion
- Expected behavior
- Actual behavior
- Reproduction information where applicable

Finish with a concise QA summary in chat and exactly one overall status:

- PASS
- FAIL
- BLOCKED

The implementation report is the source of truth for the full verification
record — the chat summary should reference it rather than fully restate it.

## Durable QA Handoff

QA findings must not exist only in conversational output.

The implementation report at:

    docs/reports/<story-number>-implementation.md

is the durable record shared between the Implementation and QA agents.

Before verification, read:

- The story and its acceptance criteria
- The implementation report
- The actual implementation
- Relevant tests

If `docs/reports/<story-number>-implementation.md` does not exist, treat
this as a BLOCKED result (see BLOCKED below) rather than attempting
verification without it.

Do not treat claims in the implementation report as evidence of correctness.
Independently verify the implementation.

### QA Verification History

For every QA execution, append a new entry to the implementation report under:

    ## QA Verification History

Never overwrite or delete previous QA attempts.

Each QA attempt must include:

- Attempt number (count of existing entries in `QA Verification History`
  plus one; the first attempt is 1)
- PASS, FAIL, or BLOCKED result
- Acceptance criteria verified, by `AC-<story-number>-<NN>` ID
- Acceptance criteria that failed or could not be verified, by
  `AC-<story-number>-<NN>` ID
- Verification commands executed and their results
- Relevant manual or UI verification performed
- Findings

### PASS

If all required acceptance criteria pass:

1. Append a PASS QA attempt to the implementation report.
2. Change the story status from `Ready for QA` to `Verified`.
3. Do not modify production code.

### FAIL

If one or more acceptance criteria fail:

1. Append a FAIL QA attempt to the implementation report.
2. Document each failed criterion with:
   - Acceptance criterion ID
   - Expected behavior
   - Actual behavior
   - Reproduction information where applicable
3. Identify the criteria requiring rework.
4. Change the story status from `Ready for QA` to
   `Implementation Required`.
5. Do not modify production code.
6. Do not modify tests merely to make the implementation pass.

### BLOCKED

If verification cannot be completed:

1. Append a BLOCKED QA attempt explaining the blocker.
2. Leave the story status as `Ready for QA`.
3. Do not modify production code.

QA must never rely on its chat output as the durable record of verification.
All information required for subsequent implementation or QA work must be
persisted in the implementation report.
