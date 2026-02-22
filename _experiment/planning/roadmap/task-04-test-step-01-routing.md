# Task 04: Test Step 1 — Routing

## Prerequisite

Task 03 tightening applied.

## Intent

Verify step 1 routing works correctly across different request types.

## Test cases

- Trivial request (e.g., "fix a typo in README") → should route one-shot
- Normal feature request → should route plan-code-review
- Large/ambiguous request → should route full BMM
- Ambiguous between one-shot and plan → should default to plan-code-review
- Existing ready-for-dev spec → should skip to step 3
- Existing WIP file → should offer resume or archive

## Output

Per-test-case pass/fail with observations. Any failures feed back into task 03 (re-tighten).
