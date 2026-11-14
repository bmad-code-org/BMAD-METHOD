---
title: "Plan an Epic's Stories"
description: Talk to Sofia to refine an epic, plan its stories in build order, decide which stories a person builds and which run unattended, and see what is ready.
sidebar:
  order: 5
---

Use Sofia, the Product Owner (`bmad-agent-po`), to turn one epic into stories
an agent can build one session at a time. Plan only the epic you will build
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

Sofia reads the epic and the initiative lines it covers, then answers in one
message sized to the initiative. On a small initiative, the message is a single
question: does this epic need anything before its stories? On a larger one,
she says what is already settled for its stories and names each open point
with her pick: settle it with you now, plan a spike when only code can answer
it, or leave it to the stories.

She also reminds you that you can flesh the epic out first: your own notes, a
PRD from John on the epic, a `bmad-ux` or `bmad-architecture` run on the epic,
or research with `bmad-deep-recon`. A run you choose lands in the epic's
folder and becomes its companion.

If the epic still has open screen or flow questions, Sally runs `bmad-ux` on
it first; if it has open technical questions, Winston runs `bmad-architecture`
after her. Ask each to cover only what is new or different, before Sofia
plans the stories.

Sofia then writes the epic's Requirements, each citing the initiative line it
comes from, such as `R1 (parent R3)`, and marks the epic `refined: true`.

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

Each story is one step toward the epic's Done when, sized for one build
session; it need not be something a user sees. Sofia merges a story whose
setup outweighs its work, and splits rather than shrinks: a story that would
leave something for now, as a placeholder, or wired later becomes two.
Stories that touch the same code form one ordered lane, and an interface two
lanes share gets a stub as its own early story. Tests go in every story; the
only test story is a closing end-to-end suite.

The first story is the tracer bullet: the thinnest path through every layer
the epic touches, with its setup as a `hitl` step. The story you are least
sure of comes next. An epic of more than three stories closes with a
"Refactor sweep" story that waits on the others and only cleans up what the
epic deferred; decline it and Sofia records why.

Eight to twelve stories is a typical epic, not a limit. Past that, Sofia
offers to split the epic first, and you decide. A team that sizes epics
differently can change the guideline with `tickets_story_count` under
`[workflow]` in `_bmad/custom/bmad-agent-po.toml`.

The stories become entries in the epic's `tickets/tickets.toml`, in build
order. No story file is written: a build plans each story's acceptance
criteria when it starts, so detail is not written months before it is used.
A story can wait on a story in another epic, or on a whole epic.

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
**Sofia:** 8 stories in build order, every requirement covered, no unknowns.
Story 1.1 is the tracer bullet. It needs a person, since facilities mounts and
pairs the tablets, so I marked it `hitl`. The last, 1.8, is the Refactor
sweep. Approve?

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

### 4. Refine a Story When It Needs It

A story needs no refining before an attended build; the build questions you
itself. Refine it when you want to review a story first or it will run
unattended:

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
