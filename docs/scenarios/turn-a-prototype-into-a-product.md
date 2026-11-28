---
title: Turn a Prototype into a Product
description: 'Scenario: a quick prototype proved an idea; its lessons become the spec, and the feature is built properly with UX and shared architecture where needed.'
sidebar:
  order: 3
---

Use this route when someone built a quick prototype to test whether an idea works, people responded well to it, and you now want to build the production version cleanly. The prototype existed to answer questions, rather than to become production code.

The example uses the [room booker](../start/how-bmad-works.md#the-example-app). In an afternoon, someone prompted an agent to build a floor-plan view where staff pick a floor and see which rooms are free. People used it all week, even though it has no tests, supports only one floor, and queries the bookings table directly.

![Turn a Prototype into a Product: in Clarify, the prototype and your notes on what it taught; in Plan, Sofia writes the initiative and cuts epics, UX and architecture are adopted, and Sofia plans the first epic's stories; in Build and verify, bmad-build rebuilds it story by story](/diagrams/scenario-prototype.svg)

## Steps

1. Decide deliberately what happens to the prototype: discard the code and keep its lessons, keep the code and formalize it, or drop the idea. If you used John's prototype plan (a short plan recording what the prototype tests, built with `bmad-build-auto`), John asks you to make this call as soon as the run reports back. In this example, the throwaway code is discarded. See [Clarify the Idea](../clarify/clarify-the-idea.md#decide-whether-it-is-worth-building).
2. Capture what the prototype taught you in a short note beside the prototype, such as `floor-plan-notes.md`, or read those takeaways from its Outcome section if you planned the prototype with John.

   ```markdown wrap
   # Floor-plan prototype: what it taught us
   - Worked: people want free rooms at a glance, by floor.
   - Surprised us: people tapped a free room and expected to book it there.
   - Never handled: other floors, rooms that change size, tests.
   - Decision: throw the code away, keep these lessons.
   ```

3. Have Sofia, the Product Owner, write the initiative and slice it into epics, letting her open questions surface the edge cases the quick prototype never had to solve. See [Write and Slice the Initiative](../plan/write-and-slice-the-initiative.md).

   ```text wrap
   /bmad-agent-po write the initiative from floor-plan-notes.md
   ```

   ```text wrap
   /bmad-agent-po split this initiative into epics
   ```

4. Design what the prototype skipped by running Sally and Winston in separate fresh chats, then have Sofia adopt both documents so the shared architecture settles the technical boundaries the prototype bypassed (such as reading the bookings table directly instead of going through the booking service). See [Design UX and Architecture](../plan/design-ux-and-architecture.md).

   ```text wrap
   /bmad-agent-ux-designer design the floor-plan view and its states
   ```

   ```text wrap
   /bmad-agent-architect settle the technical decisions the floor-plan epics share
   ```

   ```text wrap
   /bmad-agent-po adopt the UX design and shared architecture
   ```

5. Plan the first epic's stories and build them one story per chat, using `epic.story` numbering where `1.1` is the first story of epic 1. See [Plan an Epic's Stories](../plan/plan-an-epics-stories.md) and [Build and Verify](../build/build-and-verify.md).

   ```text wrap
   /bmad-agent-po refine the first epic, then plan its stories
   ```

   ```text wrap
   /bmad-build 1.1
   ```

   ```text wrap
   /bmad-agent-po mark story 1.1 done
   ```

   Repeat for every story in the epic. Once all stories are done, run the retrospective on the epic and ask Sofia to validate and close it, as described in [Finish an Epic](../learn/finish-an-epic.md). Then repeat this step for each remaining epic using its own story numbers.

## What You Have at the End

You finish with an initiative grounded in real user behavior, UX design files for the screens and states, shared technical decisions across the epics, tested code built to those contracts, and a retrospective for each epic.

## Skip Ahead When

The prototype's code is solid enough to keep. Capture its rules in `AGENTS.md` with `bmad-project-context`, ask Sofia to write the initiative from the prototype, and ask Winston (`bmad-agent-architect`) to record the technical decisions the existing code already makes in a shared architecture document before Sofia slices the remaining work. See [Change an Existing Codebase](./change-an-existing-codebase.md).

New to BMad? Start with [Install BMad](../start/install-bmad.md).
