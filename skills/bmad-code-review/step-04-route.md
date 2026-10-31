---
---

# Step 4: Route

## INSTRUCTIONS

`{triage_file}`, the triage step's output, is the input here. Work from its `F` findings.

1. **Route** each deduplicated finding: decide which should be fixed right away, and which dealt with in a different manner. Assign each of them to one of [`decision_needed`, `patch`, `defer`], as follows:
   - **decision_needed** -- There is an ambiguous choice that requires human input. The code cannot be correctly patched without knowing the user's intent. You should assign `decision_needed` even when running in a non-interactive mode. Do not guess and patch, even if a human cannot answer during this session. List the options, one line each, and the one you recommend with the reason.
   - **patch** -- Code issue that is fixable without human input. The correct fix is unambiguous, adds no public surface, and guards no state you did not demonstrate; otherwise `decision_needed`.
   - **defer** -- Pre-existing issue not caused by the current change, real but not actionable now; or an entry whose members are all `maybe-false` and the claim, if true, would be `medium` or `high` -- record that severity marked unverified, plus what would settle it (if it would only be `low`, reject it with the same note); or any entry whose fix edits agent-context files (CLAUDE.md, AGENTS.md, rules) or a ticket file.

    An entry this change caused, with a verified `high`, `medium`, or `low` member, is never `defer`, whatever its fix touches: it is `patch` or `decision_needed`. defer is only for what is not this change's problem.

    Write each finding's route into its block in `{triage_file}`, with the options and recommendation for `decision_needed` and the note for `defer`.

2. If `failed_layers` is non-empty, report which lenses failed before announcing results. If zero entries remain after rejections AND `failed_layers` is non-empty, warn the user that the review may be incomplete rather than announcing a clean review.
3. If zero entries remain after triage (all rejected or none raised): state "✅ Clean review — all lenses passed." (Item 2 already warned if any review lenses failed via `failed_layers`.)

## NEXT

Read fully and follow `{{ rendered("step-05-present.md") }}`
