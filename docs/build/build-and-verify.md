---
title: Build and Verify
description: 'The Build and verify stage: build one story or one change per session, review it, and mark it done. The pages in this section cover each skill.'
sidebar:
  order: 1
---

Use this page to see how a story, or a small change with no ticket, becomes
reviewed, committed code. Build and verify checks that the change works as
intended. Every size of work builds the same way, one session at a time.

| | Build and verify |
| --- | --- |
| **You start with** | A change one session can finish, or a story that is ready to start: its prerequisites met and no refinement pending |
| **You produce** | Changed code and tests, one local commit, and a plan recording the run and the story's status |
| **It is done when** | You have checked the result and marked the story done; the build itself stops at `built` |
| **Skip it when** | The edit is obvious and low risk: ask your agent directly |
| **What comes next** | The next ready story. When every ticket is done or dropped, the retrospective runs and Sofia closes the epic: [Learn and Adjust](../learn/learn-and-adjust.md) |

## Build One Story at a Time

In a fresh chat with a clean working tree, name the story, here the first
story of the second epic:

```text wrap
/bmad-build 2.1
```

Named directly, a story is built whether or not it is ready: the build does
not check its `after` or a pending refinement. Ask Sofia `what's next?` first,
or run `bmad-build` with nothing else to take the first ready story.

A story is sized for one session. If the build finds two independent goals
in it, it offers to split, and if you accept it writes the rest to
`deferred-work.md`, as in
[Build a Change](./build-a-change.md#deferred-work).

With nothing else named, it first offers any build you left unfinished. It
reads the story's entry or file and its epic, and opens the documents they
reference when the story needs them. Then it plans, implements, reviews its
own work, and commits locally. A change with no ticket works the
same way: describe it. See [Build a Change](./build-a-change.md).

A small change goes straight from your answers to code. A larger one gets a
written plan that waits for your approval; choose **Approve and stop** to
leave it `ready-for-dev` and build it in a fresh session. As it works, the
plan moves from `draft` to `ready-for-dev` at approval, then to
`in-progress`, `in-review`, and `built`; a small change goes straight to
`in-progress`. Run `bmad-build` on the story again to resume from its status.

The build's review is quick by default. For work with production
consequences, get a thorough review of every change before it ships: ask
`bmad-build` for a thorough review, run `bmad-code-review`, or use your PR
review bot. At the end of an epic, the retrospective is the thorough pass over
the epic's whole diff.

For an independent review before you accept a story, run `bmad-code-review`
in a fresh chat. It offers the stories at `in-review` or `built`, adds its
findings to the plan, and leaves the status alone. For another pass on a
story at `built`, you can also hand `bmad-build` its plan again; for a done
story, a PR, or a branch, use `bmad-code-review`.

When you have checked the result, tell Sofia:

```text wrap
/bmad-agent-po mark story 2.1 done
```

Only you mark a story done: through Sofia, or through a script or AI session
you direct that runs `tickets.py mark` on the repo store. On a tracker, Sofia
moves the card. A story at `built` already unblocks the stories that wait
on it, so builds can follow one another while acceptance stays a deliberate
act. Build a `hitl` story with `bmad-build`, and mark it done when the
person's part is finished. Keep the plans: they hold each story's status and
the evidence the retrospective reads.

:::note[Example: the room booker]
In the [room booker](../start/how-bmad-works.md#the-example-app), an office's meeting-room app:

**You:**

```text wrap
/bmad-build 1.2
```
**`bmad-build`:** Story 1.2, Check in at the door. One question the epic
leaves open: may anyone in the meeting check in, or only the person who
booked?

**You:** Anyone in the meeting.

**`bmad-build`:** This one is larger, so here is the plan. Approve?

**You:** Approve.

**`bmad-build`:** Built, reviewed, and committed locally. Status: `built`.

When the second epic is already planned, as when a teammate owns it, Sofia's
next list now shows story 2.1, which waits on 1.2, as ready to start.

You try a tablet, then tell Sofia:

```text wrap
/bmad-agent-po mark story 1.2 done
```
:::

## Choose the Skill

| You want | Run | Page |
| --- | --- | --- |
| A story or a change built, with you present | `bmad-build` | [Build a Change](./build-a-change.md) |
| An independent review of a built story, a PR, or a branch | `bmad-code-review` | [Review a Change](./review-a-change.md) |
| To understand a change or existing code yourself, block by block, or see it run | `bmad-walkthrough` | [Walk Through a Change](./walk-through-a-change.md) |
| API and end-to-end tests for finished work | `bmad-qa-generate-e2e-tests` | [Test Completed Work](./test-completed-work.md) |
| A story built with nobody watching, one run per story | `bmad-build-auto` | [Autonomous Development Loops](./autonomous-development-loops.md) |

## Run Stories Unattended

Build the early, foundational stories with `bmad-build` and give their
decisions your attention. Once the patterns are stable, `bmad-build-auto` can
build the stories the plan fully settles. It never picks the next story: you,
or an AI coding session you direct, start each run. The optional bmad-loop
orchestrator does not dispatch from the ticket tree yet. Review the stories
with Sofia first, because nobody answers its questions during a run.

Start each run on a clean working tree, on a branch that fits the epic, in a
tool with subagents; otherwise the run halts `blocked`.

`bmad-build-auto` does not read `hitl`, so whoever starts unattended runs
skips those stories. `tickets.py next`, the list behind Sofia's
`what's next?`, flags `hitl` stories and any checkpoints.

For `bmad-build-auto`, name the story as a ticket, as in `ticket 2.3`.
Without the word `ticket`, the run treats the number as a loose description,
and its plan and status never reach the tree. `bmad-build` takes the bare
number, such as `1.2`.

The run never reads checkpoints; whoever starts it honors them. For a
`plan_checkpoint` on a story Sofia has refined, approve its story file before
the run. On one she has not refined, start the run with `Halt after planning.`:

```text wrap
/bmad-build-auto ticket 2.3. Halt after planning.
```

Approve the plan, then start it again:

```text wrap
/bmad-build-auto ticket 2.3
```

For a `done_checkpoint`, pause after that run until a person says to continue.
See [Autonomous Development Loops](./autonomous-development-loops.md#tickets-from-the-tree).

A run on a ticket from the tree that halts `blocked` marks the ticket's plan
`blocked`, creating the plan if the run halted before planning, and Sofia's
next list shows why. A run on a loose description puts the reason under its
plan's `## Auto Run Result`, or, with no plan, in
`bmad-build-auto-result-<slug-or-timestamp>.md` in the initiative folder.
Settle the reason, then follow
[Autonomous Development Loops](./autonomous-development-loops.md#plan-status)
to clear it and run again.
