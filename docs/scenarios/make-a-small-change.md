---
title: Make a Small Change
description: 'Scenario: a change one session can finish, handed straight to bmad-build with no planning documents.'
sidebar:
  order: 1
---

Use this route when you know what should change and one session can build it.
Most changes are like this and need no planning document.

The example is the [room booker](../start/how-bmad-works.md#the-example-app),
an office's meeting-room app. The room list should show each room's capacity.

![Make a Small Change: describe the change to bmad-build, answer what only you know, let it build, review and commit, then check the result. Every step is in Build and verify](/diagrams/scenario-small-change.svg)

## Steps

1. **Hand the change to `bmad-build`** in a fresh chat in the repository,
   starting from a clean working tree.

   ```text wrap
   /bmad-build show each room's capacity next to its name in the room list
   ```

2. **Answer what only you know.** It may ask whether capacity shows as a
   number or an icon; it reads the code for everything else.
3. **Let it build.** A change this small goes straight to code; its plan file
   only records the run. A larger one gets a plan you approve before any code
   is written.
4. **Read what it reports.** It writes the change and its tests, reviews its
   own work, and commits locally. When the repository has a remote, it offers
   to open a pull request.
5. **Check the result yourself.** A change with no ticket has nothing to mark
   done.

[Build a Change](../build/build-a-change.md) covers each step of the run. By
default a change of about 100 lines or fewer skips plan approval; set
`route_selection` under `[workflow]` in `_bmad/custom/bmad-build.toml` to
change the rule, or `route` to `oneshot` or `full` to force one path.

## What You Have at the End

One local commit with the change and its tests, and the build's plan file
recording the run. No initiative, epic, or story was written, because nothing
needed one.

## Skip Ahead When

The change is a typo, a renamed label, or a formatting fix. Ask your agent
directly; `bmad-build` stays out of obvious, low-risk edits.

## When It Turns Out Bigger

If the change needs several sessions, or raises a question only someone else
can answer, stop before building. Take the route in
[Build from a Conversation](./build-from-a-conversation.md), or see
[Plan the Work](../plan/plan-the-work.md).

New to BMad? [Build Your First Change](../start/build-your-first-change.md)
walks through one build in an empty project.
