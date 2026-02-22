# Task 13: Test Step 4 — Review

## Prerequisite

Task 12 tightening applied.

## Intent

Verify the review and classification system works.

## Test cases

- Diff constructed correctly from baseline
- Layer 1 runs in context-free subagent (plan-code-review route)
- Layer 1 skipped for one-shot route
- Layer 2 (adversarial review) runs for all routes, context-free
- One-shot Layer 2 receives user prompt alongside diff
- Findings classified using priority cascade
- Spec-class findings trigger spec amendment and re-derive
- Spec loop respects iteration cap
- Change log populated correctly
- Positive preservation: KEEP instructions extracted and carried forward
- Patch-class findings auto-fixed and committed
- Defer-class findings written to wip.md

## Output

Pass/fail per test case. Failures feed back into task 12.
