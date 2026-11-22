---
id: [the entry's id in tickets.toml; the folder's `next_id` for a ticket with no entry]   # tracker_id and remote are written at publish on a tracker
type: spike
title: "[The question this answers]"
parent: [folder name of the epic, or of the initiative when there are no epics; none for a standalone ticket in backlog/]
covers: []
after: []   # prerequisites only: a sibling's id; "<epic id>.<entry id>" in another epic; epic-<slug> for that whole epic
assignee: ""   # a tracker's assignee, written by `tickets.py mirror`; otherwise assignee, blocked_at, and blocked_reason live in the plan
# status lives in the plan beside this file; tracker_status is written by a tracker sync
refined: false   # true once the user approves its full criteria; a pulled spike has this line only when its entry says `refine = true`
hitl: true
risk: [low|medium|high]
---

<!-- The refined shape. Leave a done or dropped ticket as written. Fill each slot concretely: named people, file paths, numbers. -->

# [Title]

## Description

[The question, why it is open, and which tickets wait on the answer.]

## Approach

[Numbered steps: what to research, design and prototype, and who signs off. The time box. What good enough looks like.]

## Acceptance Criteria

1. **[The candidates are compared on the criteria that decide]**
   Verify: [where the comparison is recorded]
2. **[The prototype shows the chosen answer works for the cases that matter]**
   Verify: [where the prototype and its results live]
3. **[The answer is recorded, with its consequences, where the waiting tickets can find it]**
   Verify: [where]
4. **[The people who must accept it have]**
   Verify: [who, recorded where]

## References

- parent — [path or url]
- [type — path, section]

## Notes

[Assumptions and open questions about the spike itself, each marked. Cut if empty.]
