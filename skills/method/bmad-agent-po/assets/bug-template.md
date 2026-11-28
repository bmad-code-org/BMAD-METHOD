---
id: [the entry's id in tickets.toml; the folder's `next_id` if no entry]   # publish to a tracker writes tracker_id and remote
type: bug
title: "[What is wrong, from the user's view]"
parent: [folder name of the epic, or of the initiative when there are no epics; none for a standalone bug in backlog/]
covers: []
after: []   # prerequisites only: a sibling's id; "<epic id>.<entry id>" in another epic; epic-<slug> for that whole epic
assignee: ""   # written by `tickets.py mirror` from a tracker; otherwise assignee, blocked_at, blocked_reason live in the plan
# status lives in the plan beside this file; tracker_status by a tracker sync
refined: false   # true once the user approves its criteria
hitl: false
risk: [low|medium|high]
severity: [P0|P1|P2|P3]   # P0 outage, data loss, security exposure; P1 core function broken, no workaround; P2 impaired, workaround exists; P3 cosmetic
---

<!-- Refined shape. Leave a done or dropped ticket as written. -->

# [Title]

## Description

[What the user sees go wrong and what should happen instead. 2–4 sentences.]

## Reproduction

[Exact steps, environment, actual versus expected. Logs or errors verbatim.]

## Cause Hypothesis

[Where the defect likely lives and why. Never a prescribed fix.]

## Acceptance Criteria

1. **[The expected behavior holds]**
   **Given** [the state from the reproduction]
   **When** [the reproduction steps are followed]
   **Then** [what should now happen]
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
- [type — path, section]
- [logs, screenshots, or sample data — location]

## Notes

[Only what is not in the repo or the source. Cut if empty.]

- Decision: [a choice the user made, dated]
- Assumption: [a choice made while drafting that the user has not confirmed]
- Open question: [what is not settled]
