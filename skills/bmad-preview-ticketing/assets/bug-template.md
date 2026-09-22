---
id: [the entry's id in tickets.toml; the next unused one for a ticket with no entry]   # tracker_id and remote are written at publish on a tracker
type: bug
title: "[What is wrong, from the user's view]"
parent: [folder name of the epic, or of the initiative when there are no epics; none for a standalone bug in backlog/]
covers: []
after: []   # prerequisites only: a sibling's id; "<epic id>.<entry id>" in another epic; epic-<slug> for that whole epic
assignee: ""   # blocked_at (date) and blocked_reason are added when waiting on a person or an answer
refined: false   # true once refined and approved
hitl: false   # status is written by the build (draft | ready-for-dev | in-progress | in-review | done | blocked); tracker_status by a tracker sync
risk: [low|medium|high]
severity: [P0|P1|P2|P3]
estimate: ""   # points, when estimation is on
---

# [Title]

## Description

[What the user sees go wrong and what should happen instead, from their side. 2–4 sentences.]

## Reproduction

[Exact steps, environment, and what happens versus what should happen. Logs or errors verbatim.]

## Cause Hypothesis

[Where the defect likely lives and why — a hypothesis, never a prescribed fix.]

## Acceptance Criteria

1. **[The expected behavior holds]**
   **Given** [the state from the reproduction]
   **When** [the reproduction steps are followed]
   **Then** [what should happen, as it should now happen]
2. **Tests cover the condition found and fixed**
   **Given** the test suite
   **When** it runs
   **Then** a test that fails on the defect and passes on the fix covers the reproduction, and one covers each related case the fix touched
3. **Or: no change is needed, with proof**
   **Given** the reproduction
   **When** it is run on the current code
   **Then** the expected behavior already holds, or the report was mistaken, with the evidence recorded in Notes — this supersedes 1 and 2

## References

- parent — [path or url, or none]
- [source — path, section]
- [logs, screenshots, or sample data — location]

## Notes

[Only what is not in the repo or the source, and what is not settled. Cut if empty.]

- Decision: [a choice the user made, dated]
- Assumption: [a choice made while drafting that the user has not confirmed]
- Open question: [what is not settled; answering it is part of the ticket's work]

## Plan

<!-- Filled in by the coding agent; never sent to a tracker. -->

<!-- Example, not part of the ticket: match its level of detail. What is good here: a reproduction someone else can follow, with the actual and expected values; a cause hypothesis that is not a fix; one criterion for the behavior, one for the tests that cover the condition found and fixed, and one that supersedes both when the reproduction shows no change is needed. -->

```markdown
---
id: 7
type: bug
title: "Checkout total ignores an applied discount code after the shopper changes quantity"
parent: none
covers: []
refined: true
hitl: false
risk: medium
severity: P2
---

# Checkout total ignores an applied discount code after the shopper changes quantity

## Description

A shopper applies a valid code, then changes an item's quantity, and the total goes back to full price while the discount line still shows the code. They are charged full price at payment.

## Reproduction

1. Production, Chrome 130, logged out. Add "Canvas tote" (29.00) ×1 to the cart.
2. Apply SAVE10. Total shows 26.10, discount line shows SAVE10 −2.90.
3. Change quantity to 2.
4. Actual: total 58.00, discount line still SAVE10 −2.90. Expected: 52.20, discount line SAVE10 −5.80.
5. Continue to payment: amount charged is 58.00.
Log line at step 3: `pricing.recompute cart=… discount=null`.

## Cause Hypothesis

The quantity-change path recomputes the total without passing the applied code, so the discount is dropped while the UI keeps the stale line. Likely in the recompute call, not in the discount engine, since step 2 is right.

## Acceptance Criteria

1. **The expected behavior holds**
   **Given** a cart with a valid code applied
   **When** the shopper changes an item's quantity
   **Then** the total recomputes with the code still applied and the discount line shows the new amount
2. **Tests cover the condition found and fixed**
   **Given** the pricing test suite
   **When** it runs
   **Then** a test that fails on the defect and passes on the fix covers a quantity change with a code applied, and one covers removing an item with a code applied
3. **Or: no change is needed, with proof**
   **Given** the reproduction
   **When** it is run on the current code
   **Then** the total already recomputes with the code applied, or the report was mistaken, with the evidence recorded in Notes — this supersedes 1 and 2

## References

- parent — none
- logs — support ticket #4471, attachment pricing.log

## Plan

<!-- Filled in by the coding agent; never sent to a tracker. -->
```
