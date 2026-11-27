---
title: "Plan an Epic's Stories"
description: Talk to Sofia to refine an epic, plan its stories in build order, decide which stories a person builds and which run unattended, and see what is ready.
sidebar:
  order: 5
---

Use Sofia, the Product Owner (`bmad-agent-po`), to turn one epic into a few large stories,
each a capability an agent builds and a person verifies. Plan only the epic you will build
next; later epics stay thin until their turn, so what the first one teaches
can still change them.

- The initiative is cut into epics and you are about to start one
- An epic's stories were never planned, or a change made them stale
- You want some stories built with nobody watching

## Steps

### 1. Refine the Epic

Name the epic:

```text wrap
/bmad-agent-po refine the door check-in epic
```

Sofia reads the epic and the initiative lines it covers. When the epic still
has open product questions, such as how it works for the user, its rules, or
what to measure, she hands to John for the epic PRD, which lands in the epic's
folder and becomes its companion. When nothing is open, or when you tell her
to, she fills the epic in from the initiative's lines and what the PRD saved
for the epic.

If the epic still has open screen or flow questions, Sally (`bmad-agent-ux-designer`) runs
`ux-epic` on it; if it has open technical questions, Winston (`bmad-agent-architect`) runs
`arch-epic` after her. Ask each to cover only what is new or different, before Sofia
plans the stories. Research is `bmad-deep-recon`. Each run lands in the
epic's folder the same way.

Sofia then writes the epic's Requirements, each citing the initiative line it
comes from, such as `R1 (parent R1)`, and marks the epic `refined: true`.

### 2. Plan the Stories

Ask for its stories:

```text wrap
/bmad-agent-po plan the door check-in epic's stories
```

Sofia drafts the whole epic, brings you every unknown that must be settled
first, and presents each story with what it delivers, how it will be verified,
the requirement ids it covers, and what it waits on. Before you approve, fresh
agents check that every requirement is covered, that what the stories wait on
has no loops, and that no prerequisite is missing, such as collisions, shared
setup, and handoffs. Adjust size, order, and prerequisites until you approve;
the check runs again when you add, remove, or reorder stories.

Each story is one complete capability a person can see working end to end
and verify in one sitting. It is large on purpose: an epic may have one
story, or a few. The steps inside it are the build's own plan and never
become tickets. Sofia merges a story that cannot be verified as an outcome by
itself, and splits rather than shrinks: a story that would leave something
for now, as a placeholder, or wired later becomes two. Setup is part of the
first story that needs it, and production delivery part of the last. Stories
that touch the same code form one ordered lane. Tests go in every story; the
only test story is a closing end-to-end suite.

The first story proves the riskiest path. Inside a large story the build
usually starts with a tracer bullet, the thinnest path through every layer
the story touches, and widens it from there; that is the build's plan, not a
story. Cleanup the epic deferred is not a story either: the retrospective
Sofia offers when the epic closes reports it.

The stories become entries in the epic's `tickets/tickets.toml` linking any finished design or architecture files, and once the breakdown is agreed Sofia writes each story's detailed acceptance criteria right away by default so coding agents have clear verification checks from the start. If you ask to keep stories thin for later, `bmad-build` clarifies acceptance criteria when it picks each one up. A story can wait on a story in another epic, or on a whole epic.

### 3. Decide Who Builds What

Build the risky and foundational stories yourself, with `bmad-build`: they
settle the patterns later stories follow. Stories the plan fully settles can
go to `bmad-build-auto`, whose questions nobody answers during a run.

- Mark an entry `hitl = true` when a person does part of its work, and name
  that part.
- When the epic will run unattended, Sofia asks for `plan_checkpoint` and
  `done_checkpoint` per entry and proposes one on risky stories.
  [Build and Verify](../build/build-and-verify.md#run-stories-unattended)
  shows how to honor them.

Before any unattended run, have Sofia check each story with you:

```text wrap
/bmad-agent-po review the stories
```

:::note[Example: the room booker]
In the [room booker](../start/how-bmad-works.md#the-example-app), an office's meeting-room app:

**You:**

```text wrap
/bmad-agent-po refine the door check-in epic, then plan its stories
```
**Sofia:** 3 stories in build order, every requirement covered, no unknowns.
Story 1.1 needs a person, since facilities mounts and pairs the tablets, so I
marked it `hitl`. Approve?

**You:** Approve.

Story 1.1's entry in the epic's `tickets.toml` covers the first part of `R2`,
the epic's requirement for the tablet showing its room's bookings; story 1.3
finishes it.

```toml
[[entry]]
id = 1
type = "story"
title = "Show each room on its door tablet"
description = "Each room's tablet is mounted, paired, and shows its room."
verify = "Facilities pairs a tablet, and it shows that room's name."
covers = ["R2"]
after = []
hitl = true   # facilities mounts and pairs the tablets
risk = "medium"
```
:::

### 4. Refine a Thin Story Later

Stories detailed when the epic was sliced already carry their acceptance criteria. If you chose to keep an entry thin or changed scope mid-flight, ask Sofia to refine or refresh it before an unattended run or review:

```text wrap
/bmad-agent-po refine story 2.3
```

Sofia writes a file for it from its entry; from then on, the file is the source
of truth. A bug, a ticket with no epic, and an entry marked
`refine = true` always get full acceptance criteria first.

## What You Get

Ask what is ready, about the epic or the whole initiative:

```text wrap
/bmad-agent-po what's next?
```

Sofia lists what is ready to refine, ready to start, in progress, and blocked,
and why. Then go to [Build and Verify](../build/build-and-verify.md).

The planning leaves:

- The epic file with its Requirements, marked `refined: true`
- `epic-<slug>/tickets/tickets.toml`: every story in build order, each with a
  permanent id, a description, a `verify` check, `covers`, and `after`
- A file only for the stories you refined

Entry fields, ids, and statuses are listed in
[The Ticket Tree](../reference/ticket-tree.md).
