---
id: ""   # set at publish
remote: ""   # the store url, for a tracker
type: spike
title: "[The question this answers]"
parent: [folder name of the epic, or of the initiative when there are no epics; none for a standalone ticket in backlog/]
covers: []
blocked_by: []
blocked_at: ""   # date, when waiting on a person or an answer
blocked_reason: ""
assignee: ""
status: draft
refined: false   # true once refined and approved
hitl: true
risk: [low|medium|high]
estimate: ""   # points, when estimation is on
---

# [Title]

## Description

[Thin: one sentence, the question. Refined: the unknown this resolves — usually a placeholder left at design time — and which tickets wait on the answer, 2–4 sentences.]

## Approach

[The steps, as many as the question needs: what to research, what to design, what to prototype, who signs off. The time box. What a good-enough answer looks like.]

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
- [source — path, section]

## Notes

[Assumptions and open questions about the spike itself, each marked. Cut if empty.]

<!-- Example, not part of the ticket: match its level of detail. What is good here: the unknown was a placeholder in the architecture; the spike names who waits, runs research, design, prototype, and sign-off in a time box, says what good enough is, and records the answer where the stories will find it. hitl because people accept the finding. -->

```markdown
---
id: ""
remote: ""
type: spike
title: "How do field devices merge conflicting observations after days offline?"
parent: epic-field-sync
covers: []
blocked_by: []
blocked_at: ""
blocked_reason: ""
assignee: ""
status: draft
refined: true
hitl: true
risk: low
---

# How do field devices merge conflicting observations after days offline?

## Description

The architecture left sync as a placeholder: "devices reconcile on reconnect." Researchers in the field edit the same observation records on several tablets for days without a link, then sync over a slow satellite connection. Three planned stories in this epic — edit observations offline, sync on reconnect, show merge results to the team lead — cannot be refined for implementation until we know how conflicting edits merge, what that does to the data model, and whether the link can carry it.

## Approach

Time box: four days. At the end, the best answer so far is recorded, not a perfect one.

1. Research: compare three ways to merge — a CRDT library, last-writer-wins per field with a conflict log, and a custom merge on the observation schema — on the criteria that decide: correctness on the six conflict cases the field team listed, payload size over a 2 kbps link, library maturity, and how much of the data model each forces us to change.
2. Design: a one-page note on the chosen approach, its data-model consequences, and the cases it does not resolve automatically.
3. Prototype: two tablets and a simulated link; run the six conflict cases and measure sync payload and time.
4. Sign-off: the lead engineer accepts the design; the field science lead accepts how unresolved conflicts are shown to people.

Good enough: all six cases merge as the field team expects, or the exceptions are listed with how a person resolves them, and a full day's edits sync in under ten minutes on the simulated link.

## Acceptance Criteria

1. **The three approaches are compared on the deciding criteria**
   Verify: the comparison table is in epic-field-sync/spike-04-offline-merge-comparison.md
2. **The prototype merges the six conflict cases on a simulated link**
   Verify: the prototype and its run log are under epic-field-sync/spike-04-offline-merge-prototype/, with payload and time per case
3. **The answer and its data-model consequences are recorded where the stories will find them**
   Verify: the design note is epic-field-sync/spike-04-offline-merge-design.md and the choice is in epic-field-sync.md Notes as a decision
4. **The lead engineer and the field science lead have accepted it**
   Verify: both named in that decision line with the date

## References

- parent — epic-field-sync/epic-field-sync.md
- architecture — docs/architecture.md, section Sync (the placeholder)
- field team conflict cases — docs/research/conflict-cases.md

## Notes

- Assumption: the satellite link is never better than 2 kbps up; confirm with the operations lead.
- Open question: is the conflict log kept forever, or pruned after the lead resolves it? The field science lead answers.
```
