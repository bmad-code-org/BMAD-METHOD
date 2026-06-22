---
title: '{title}'
task_id: '{task_id}'
run_id: '{run_id}'
type: 'feature'
created: '{date}'
status: 'draft'
baseline_commit: ''
review_iterations: 0
context: []
source_refs: []
---

<frozen-after-resolution reason="orchestrator-owned intent boundary">

## Intent

**Problem:** ONE_TO_TWO_SENTENCES

**Approach:** ONE_TO_TWO_SENTENCES

## Boundaries & Constraints

**Always:** INVARIANT_RULES

**Escalate If:** CONDITIONS_REQUIRING_ORCHESTRATOR_DECISION

**Never:** NON_GOALS_AND_FORBIDDEN_APPROACHES

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|---------------|----------------------------|----------------|
| HAPPY_PATH | INPUT | OUTCOME | N/A |
| EDGE_CASE | INPUT | OUTCOME | ERROR_HANDLING |

</frozen-after-resolution>

## Code Map

- `FILE` -- ROLE_OR_RELEVANCE

## Tasks & Acceptance

**Execution:**
- [ ] `FILE` -- ACTION -- RATIONALE

**Acceptance Criteria:**
- Given PRECONDITION, when ACTION, then EXPECTED_RESULT

## Spec Change Log

Append-only. Each entry records the review finding that triggered the change, what was amended, what known-bad state the amendment avoids, and KEEP instructions for behavior that must survive re-implementation.

## Design Notes

DESIGN_RATIONALE_AND_EXAMPLES

## Verification

**Commands:**
- `COMMAND` -- expected: SUCCESS_CRITERIA
