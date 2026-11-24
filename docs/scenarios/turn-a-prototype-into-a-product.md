---
title: Turn a Prototype into a Product
description: 'Scenario: a quick prototype proved an idea; its lessons become the spec, and the feature is built again properly, with UX and architecture where it needs them.'
sidebar:
  order: 3
---

Use this route when someone built a quick version to see whether an idea
works, people liked it, and you now want to build it properly. The prototype
answers questions; it is not the code you ship.

The example is the [room booker](../start/how-bmad-works.md#the-example-app).
In an afternoon, someone prompted an agent into a floor-plan view: pick a
floor, and see which rooms are free. People used it all week. It has no tests,
knows only one floor, and reads the bookings table directly.

![Turn a Prototype into a Product: in Clarify, the prototype and your notes on what it taught; in Plan, Sofia writes the initiative and cuts epics, UX and architecture are adopted, and Sofia plans the first epic's stories; in Build and verify, bmad-build rebuilds it story by story](/diagrams/scenario-prototype.svg)

## Steps

1. **Decide on purpose what happens to it:** throw the code away and keep
   its lessons, keep the code, or drop the idea. If it came from John's
   prototype plan, built by `bmad-build-auto`, John asks this when the build
   reports back. Here the code goes. See
   [Clarify the Idea](../clarify/clarify-the-idea.md#decide-whether-it-is-worth-building).
2. **Write down what it taught you** in a short file beside the prototype,
   such as `floor-plan-notes.md`. A prototype planned with John records this
   in its plan's Outcome instead.

   ```markdown wrap
   # Floor-plan prototype: what it taught us
   - Worked: people want free rooms at a glance, by floor.
   - Surprised us: people tapped a free room and expected to book it there.
   - Never handled: other floors, rooms that change size, tests.
   - Decision: throw the code away, keep these lessons.
   ```

3. **Have Sofia, the Product Owner, write the initiative,** then cut it into
   epics. Her open questions collect what the prototype never had to answer.
   See [Write and Slice the Initiative](../plan/write-and-slice-the-initiative.md).

   ```text wrap
   /bmad-agent-po write the initiative from floor-plan-notes.md
   ```

   ```text wrap
   /bmad-agent-po split this initiative into epics
   ```

4. **Design what the prototype skipped,** each skill in its own chat, then
   have Sofia adopt both. The spine settles what the prototype dodged, such as
   reading the bookings table directly. See
   [Design UX and Architecture](../plan/design-ux-and-architecture.md).

   ```text wrap
   /bmad-ux design the floor-plan view and its states
   ```

   ```text wrap
   /bmad-agent-architect settle the decisions the floor-plan epics share
   ```

   ```text wrap
   /bmad-agent-po adopt the design and the spine
   ```

5. **Plan the first epic's stories, then build them** one per chat. See
   [Plan an Epic's Stories](../plan/plan-an-epics-stories.md) and
   [Build and Verify](../build/build-and-verify.md).

   ```text wrap
   /bmad-agent-po refine the first epic, then plan its stories
   ```

   ```text wrap
   /bmad-build 1.1
   ```

   ```text wrap
   /bmad-agent-po mark story 1.1 done
   ```

   Repeat for each story. Then run the retrospective on the epic, and have
   Sofia validate and close it, as in
   [Finish an Epic](../learn/finish-an-epic.md). Then repeat this step for each
   remaining epic, naming that epic and its own story numbers.

## What You Have at the End

An initiative whose requirements came from what people actually used, design
files for the screen, the decisions the epics share, tested code built to
them, and a retrospective per epic.

## Skip Ahead When

The prototype's code is worth keeping. Record its rules with
`bmad-project-context`, have Sofia write the initiative from the prototype,
and ask Winston (`bmad-agent-architect`) to record the decisions the kept code already
made in an architecture spine, so Sofia adopts them before she slices the rest. See
[Change an Existing Codebase](./change-an-existing-codebase.md).

New to BMad? Start with [Install BMad](../start/install-bmad.md).
