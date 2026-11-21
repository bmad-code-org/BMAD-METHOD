---
title: Plan a Feature as a Team
description: 'Scenario: several people must agree before building. John writes the PRD, Sofia slices it into two epics, Sally and Winston settle what the epics share, and each epic owner plans, builds, closes, and reviews their epic.'
sidebar:
  order: 4
---

Use this route when several people must agree before anyone builds. The
planning is heavier because more people depend on it, not because BMad
requires it.

The example is the same check-in feature as in
[Build from a Conversation](./build-from-a-conversation.md), in the
[room booker](../start/how-bmad-works.md#the-example-app). This time a
product manager, a designer, an architect, and two developers share it, and
the facilities team must approve the rules. You have the call note
`bmad-ingest` wrote and `facilities-email.md`, where facilities set out its
rules.

Each person works through their agent, as in
[Who Does What](../start/how-bmad-works.md#who-does-what). The steps run in
two parts: once for the initiative, then once for each epic.

![Plan a Feature as a Team: for the initiative, John writes and validates the PRD, Sofia writes the initiative and two epics, Sally optionally designs what the epics share, and Winston optionally settles their shared decisions; for each epic, Sofia refines it, Sally and Winston optionally cover only what is new, Sofia puts the stories on the board, Mason builds each story and adds a review for production work unless the build ran a thorough one, Mason runs the retrospective, and Sofia validates and closes the epic](/diagrams/scenario-team.svg)

## For the Initiative

1. **John writes the PRD** with the team in the room: the designer, the
   architect, and the developers. Facilities' approval goes in the PRD's
   Stakeholders, risks and rollout section. See
   [Write a PRD](../plan/write-a-prd.md).

   ```text wrap
   /bmad-agent-pm Help us work out room check-in from the rooms call note and facilities-email.md
   ```

   John proposes the document that fits and says why. For requirements the
   whole team builds from, choose the PRD. With no initiative active, John first offers the `bmad` skill to create
   one: accept, so the PRD and the initiative Sofia writes share one folder.

   Validate it before the meeting where facilities settles the no-show
   window. John gives the findings in the conversation and offers to update
   the PRD from them.

   ```text wrap
   /bmad-agent-pm validate the check-in PRD
   ```

   After the meeting, record facilities' confirmation in the PRD:

   ```text wrap
   /bmad-agent-pm update the check-in PRD: facilities confirmed the 15-minute no-show window
   ```

2. **Sofia turns the PRD into the initiative** and slices it into two epics,
   door check-in and freeing no-show rooms. See
   [Write and Slice the Initiative](../plan/write-and-slice-the-initiative.md).

   ```text wrap
   /bmad-agent-po write the initiative from prd-check-in/
   ```

   Then reply in the same chat:

   ```text wrap
   Split this initiative into epics.
   ```

3. **Sally designs what the epics share,** if they need a shared design
   system, such as the room booker's screens and their states. Sally runs
   `bmad-ux` on the initiative; if the room booker already has a design
   system, this step is lighter, because `DESIGN.md` references its tokens
   and records only your changes. Sofia won't prompt for this, so run it
   deliberately. Then Sofia adopts the design. See
   [Design UX and Architecture](../plan/design-ux-and-architecture.md).

   ```text wrap
   /bmad-agent-ux-designer design the shared screens and states the check-in epics will use
   ```

   ```text wrap
   /bmad-agent-po adopt the design
   ```

4. **Winston settles the decisions the two epics share,** such as where the
   no-show timer runs. Winston runs `bmad-architecture`, and Sofia adopts the
   spine.

   ```text wrap
   /bmad-agent-architect settle the decisions the check-in epics share
   ```

   ```text wrap
   /bmad-agent-po adopt the spine
   ```

UX goes before architecture here and in each epic, so the design can inform
the technical choices. Skip any of these steps when it has no open questions,
and swap them when a technical constraint has to settle what the screens can
do; BMad doesn't enforce the order.

## For Each Epic

Each epic has one owner, and the two run in parallel: you own door check-in,
and Dana owns freeing no-show rooms. BMad does not record who owns an epic,
so agree it as a team or assign it in your tracker. Each owner repeats steps
5 to 12 for their epic.

5. **Sofia refines the epic** and lists what is still open. See
   [Plan an Epic's Stories](../plan/plan-an-epics-stories.md).

   ```text wrap
   /bmad-agent-po refine the door check-in epic
   ```

6. **Only if the epic has open screen or flow questions,** Sally runs
   `bmad-ux` on the epic, covering only what is new or different, such as the
   door tablet's check-in screen.

   ```text wrap
   /bmad-agent-ux-designer design the door check-in epic's check-in screen, only what is new or different for this epic
   ```

7. **Only if the epic has open technical questions,** Winston runs
   `bmad-architecture` on the epic, covering only what is new or different.

   ```text wrap
   /bmad-agent-architect settle the door check-in epic's open technical questions
   ```

8. **Sofia splits the epic into stories.** She
   validates them and publishes them to the board. On the repo store,
   approving them commits them; on a tracker, she publishes them there, as
   [Set Up the Ticket Tree](../plan/set-up-the-ticket-tree.md#configure-where-tickets-are-tracked)
   explains.

   ```text wrap
   /bmad-agent-po finish refining the door check-in epic, then plan its stories
   ```

9. **Mason implements each story** with `bmad-build`, one story per chat.
   Story 1.1 has a person's step, since facilities mounts and pairs the
   tablets: build it, have facilities do their part, check that a tablet
   shows its room, then mark it done. See
   [Build and Verify](../build/build-and-verify.md).

   ```text wrap
   /bmad-agent-dev build story 1.1
   ```

   ```text wrap
   /bmad-agent-po mark story 1.1 done
   ```

   Then build, check, and mark 1.2 and the rest the same way:

   ```text wrap
   /bmad-agent-dev build story 1.2
   ```

   ```text wrap
   /bmad-agent-po mark story 1.2 done
   ```

   Story 2.1 waits on 1.2, so Dana claims it once 1.2 is built:

   ```text wrap
   /bmad-agent-po assign story 2.1 to Dana
   ```

   On a tracker, `start story 2.1` claims it and moves its card instead; see
   [Set Up the Ticket Tree](../plan/set-up-the-ticket-tree.md#use-sofia).

10. **Mason adds a review with `bmad-code-review`,** on top of the quick one
    in `bmad-build`. It is optional for a prototype or internal tool and
    expected for work going to production, unless the build ran a thorough
    review or a PR review bot covers it. Run it on each story that needs it
    right after that story's build, before you mark it done and before the
    next build, so the review covers only that story's changes:

    ```text wrap
    /bmad-agent-dev review the code for story 1.2
    ```

11. **Mason runs `bmad-retrospective`** once every ticket is done or
    dropped. It judges the finished epic. See
    [Finish an Epic](../learn/finish-an-epic.md).

    ```text wrap
    /bmad-agent-dev run the retrospective on epic 1
    ```

12. **Sofia validates and closes the epic.** She checks it against its
    Requirements and Done when, and you confirm.

    ```text wrap
    /bmad-agent-po close the door check-in epic
    ```

    Optionally, to review the epic's changes yourself, block by block, run
    `bmad-walkthrough` on the epic's PR, or one commit at a time.

## When Something Changes

Go back to Sofia to replan. When the change touches the PRD, John updates it
first. Here, one story into the second epic, facilities shortens the window
to 10 minutes. See
[Learn and Adjust](../learn/learn-and-adjust.md#a-change-mid-flight).

```text wrap
/bmad-agent-pm update the check-in PRD: facilities set the no-show window to 10 minutes
```

```text wrap
/bmad-agent-po this changed, what now: the no-show window is 10 minutes, see prd-check-in/
```

If you lose track, ask `/bmad what's next?` or `/bmad-agent-po what's next?`.

## What You Have at the End

A validated PRD, the initiative and its two epic files,
the shared design and the architecture spine, any design or spine an epic
needed of its own, each epic's stories, the code, one plan per story, and a
retrospective per epic. You are done when the last epic's retrospective has
run and Sofia has closed it. Stories the plan fully settles can also run
unattended, with a developer reviewing each result and marking it done.

## Where People Approve

BMad marks five sign-offs. This route passes four: PRD validation in step 1,
the architecture spine review in step 4 (and step 7 when it runs), the
ticket-breakdown approval in step 8, and each epic's retrospective verdict in
step 12. The fifth, the PRFAQ verdict, comes only if Mary tested the concept
first. [Plan Inside an Organization](../plan/plan-inside-an-organization.md)
gives the order they set and what each one blocks.

## Skip Ahead When

- One person decides the rules: the route in
  [Build from a Conversation](./build-from-a-conversation.md) gets the same
  feature built with no PRD.
- The epics need no shared design system: skip step 3.
- The epics share no decisions: skip step 4.
- An epic has no open screen, flow, or technical questions: skip steps 6 and
  7 for it.

New to BMad? Start with [Install BMad](../start/install-bmad.md).
