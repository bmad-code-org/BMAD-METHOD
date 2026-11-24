---
title: Learn and Adjust
description: 'The Learn and adjust stage: close a finished epic and judge it, route a change that lands mid-flight through Sofia, and decide what happens to the findings builds set aside.'
sidebar:
  order: 1
---

Use this page when an epic's stories are all built, when a requirement changes
in the middle of the work, or when findings set aside by builds pile up. Learn
and adjust decides what to change. Each story passed its own review, so this
stage judges the epic as a whole and sends what it finds back to the document
or ticket that owns it.

| | Learn and adjust |
| --- | --- |
| **You start with** | An epic whose stories are all built, done, or dropped; a change; or deferred findings |
| **You produce** | `epic-<slug>-retrospective.md` with a verdict and action items, a closed epic, and updated tickets |
| **It is done when** | The verdict is recorded, the epic is closed, and each action item and finding is filed or dropped with a reason |
| **Skip it when** | Rarely at the end of an epic: it is the check no single story's review makes. Mid-epic, only when a change or a finding calls for it |
| **What comes next** | [Plan the Work](../plan/plan-the-work.md), where the findings change requirements, the spine, or the stories; the next epic |

## Finish an Epic

When every story is built, check that the epic's bugs and spikes are finished
too: the retrospective accepts an epic only when none of its tickets is
unfinished. Then check the stories still at `built` and mark them done, with
one command per story:

```text wrap
/bmad-agent-po mark story 1.3 done
```

Then start a fresh chat and run `bmad-retrospective` on the epic,
with its folder, id, or slug. It reads the epic's plans, commits, and diffs rather than
anyone's memory, judges the epic against its own Done when, and reviews the
whole changeset for the problems no single story's review could see. It writes
`epic-<slug>-retrospective.md` in the epic's folder, with a verdict of
`accepted`, `accepted-with-open-items`, or `rejected` and proposed action
items. It creates no tickets and changes no status.

```text wrap
/bmad-retrospective 1
```

Then have Sofia validate and close the epic. She checks it against its
Requirements and Done when, and you confirm:

```text wrap
/bmad-agent-po close the door check-in epic
```

Decide what to do with each action item.
[Finish an Epic](./finish-an-epic.md) covers what the retrospective looks for.
To review the epic's changes yourself, block by block, you can also run
`bmad-walkthrough` on the epic's PR or on one commit at a time.

## A Change Mid-Flight

Tell Sofia "this changed, what now", with what changed and where it came from.
She reads the affected ticket, its history, its breakdown, and the work
already finished, and says whether what is required changed or only how it is
delivered. Then she proposes a way forward: adjust the remaining stories, roll
back built work, or cut scope. You decide.

- When what is required changes, she updates the ticket's requirements first,
  keeping every id, and names the stories whose requirements changed.
- When the breakdown changes, she re-slices the affected epics. Finished work
  is never rewritten; it stays as the record, and a new story carries the
  change.
- She drops work that no longer belongs, records the reason, and clears what
  waited on it.
- When the change reaches the design or the spine, she notes what it
  invalidates and offers `bmad-ux` or Winston (`bmad-agent-architect`); she never edits
  their files.

She records the reason as a dated `Decision:` line in each ticket she touched.
A change that starts upstream goes through the skill that owns that document
first: John updates the PRD, `bmad-ux` the design. Then Sofia updates the
initiative from it. On the organization path, follow the order in
[Plan Inside an Organization](../plan/plan-inside-an-organization.md#when-requirements-change-mid-flight).

:::note[Example: the room booker]
In the [room booker](../start/how-bmad-works.md#the-example-app), an office's meeting-room app, facilities shortens the no-show window to 10
minutes when the second epic is one story in. John updates the PRD first.

**You:**

```text wrap
/bmad-agent-pm update the check-in PRD: facilities set the no-show window to 10 minutes
```

Then Sofia updates the initiative from it.

**You:**

```text wrap
/bmad-agent-po this changed, what now: the no-show window is 10 minutes, see prd-check-in/
```
**Sofia:** What is required changed, not how. The INV-1 constraint keeps its
id and now says 10 minutes. Story 2.1 was built and reviewed with 15,
and its plan records that: keep it, and add a story that changes the value?
Story 2.2 has not started and will be built with 10.

**You:** Yes.

**Sofia:** Added story 2.9, and a dated `Decision:` line to the initiative and
the epic.
:::

## Deferred Findings

Builds stay focused on one goal, so real findings that belong elsewhere are set
aside. `bmad-build` and `bmad-code-review` add them to `deferred-work.md` in
the initiative's folder; `bmad-build-auto` lists them under `deferred` in its
plan instead. Nothing turns them into tickets on its own. Before the next epic
is planned, go through them with Sofia: each becomes a story or a bug in
`backlog/`, or is dropped with the reason recorded.
