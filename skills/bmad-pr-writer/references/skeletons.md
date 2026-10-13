# Skeletons

Replace `<…>`. Drop sections that do not apply.

## A. Feature or UI change

- `## What this changes`: "Before this PR, <what the user saw>. Now
  <what they see>:", then the user's steps as a numbered list, and what
  happens on failure with a real message.
- `## Screenshots (<how captured>)`: a table with columns `Before` and
  `After`, or one column per case for recordings.
- `## Safety`: bold-lead bullets, only if needed.
- `## Verified`: commands with counts, then `**Not verified:** <what,
  and what it needs>`.
- Closing ask.

## B. Fix proven with evidence

- `## Why`: what failed, with the number ("declined after 2094 ms"),
  and the cause in one sentence.
- `## What changed`: numbered changes, each with its files and its
  before → after metric. Say what was not removed or loosened.
- `## Evidence`: a table with columns `Case`, `Before (<base>)`,
  `After (<sha>)`.
- `## Tests`: counts, the new tests, and whether they fail on the old
  code.
- `## Still to check live`: the one path not yet proven, and how.
- Closing ask: which function to review, and what did not change so
  they can skip it.

## C. Incident fix

- `## What happened`: bullets with a bold lead: **Cause**, **Damage**
  ("none: spent 0"), **Already fixed for your run** (with a link).
- `## This PR`: the new behavior, the cases it covers, the fallback when
  a dependency fails, and the test count.
- Closing ask: first, the exact command to retry and its expected
  result; then review, merge, and deploy; then any optional follow-up
  offered as a separate PR.

## D. Fixes from a review

- One line: "Fixes the <n> findings from the review of #<n>."
- `## What was wrong`: one bullet per finding ID with its user-visible
  symptom.
- `## What changed`: a table with columns `ID`, `Change`, `Test`.
- `## Before and after`: one table per finding that shows on screen.
- `## Tests`: counts, and which new tests fail on the old head.
- Closing ask.
