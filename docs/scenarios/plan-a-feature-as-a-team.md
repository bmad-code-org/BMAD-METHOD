---
title: Plan a Feature as a Team
description: 'Scenario: several people must agree before building. John writes the PRD, Sofia slices it into two epics, Sally and Winston settle what the epics share, and each epic owner plans, builds, reviews, and closes their epic.'
sidebar:
  order: 4
---

Use this route when several people must align before anyone writes code. The planning is more structured because multiple stakeholders and engineers depend on it, rather than because BMad forces extra steps.

The example is the same check-in feature as in [Build from a Conversation](./build-from-a-conversation.md), built for the [room booker](../start/how-bmad-works.md#the-example-app). This time a product manager, a designer, an architect, and two developers share the work, and the facilities team must sign off on the rules. You start with the call note from `bmad-ingest` and `facilities-email.md`, where facilities stated its policies.

Each person works through their specialist agent, as described in [Who Does What](../start/how-bmad-works.md#who-does-what). The steps run in two passes: once across the whole initiative, then once for each epic.

![Plan a Feature as a Team: for the initiative, John writes and validates the PRD, Sofia writes the initiative and two epics, Sally optionally designs what the epics share, and Winston optionally settles their shared decisions; for each epic, Sofia refines it, Sally and Winston optionally cover only what is new, Sofia puts the stories on the board, Amelia builds each story and adds a review for production work unless the build ran a thorough one, Amelia runs the retrospective, and Sofia validates and closes the epic](/diagrams/scenario-team.svg)

## For the Initiative

1. John writes the PRD with the team involved: the designer, the architect, and the developers. Facilities' sign-off requirement goes into the PRD's stakeholders, risks, and rollout section. See [Write a PRD](../plan/write-a-prd.md).

   ```text wrap
   /bmad-agent-pm Help us work out room check-in from the rooms call note and facilities-email.md
   ```

   John proposes the planning document that fits best and explains why; choose a PRD for requirements the whole team builds from. If no initiative is active yet, John first offers to create one via the `bmad` skill so the PRD and Sofia's tickets live together in one folder.

   Validate the PRD before the sign-off meeting where facilities confirms the no-show window. John reports findings in chat and offers to update the document:

   ```text wrap
   /bmad-agent-pm validate the check-in PRD
   ```

   After the meeting, record facilities' confirmation directly in the PRD:

   ```text wrap
   /bmad-agent-pm update the check-in PRD: facilities confirmed the 15-minute no-show window
   ```

2. Sofia turns the PRD into the initiative and slices it into two epics: door check-in and freeing no-show rooms. See [Write and Slice the Initiative](../plan/write-and-slice-the-initiative.md).

   ```text wrap
   /bmad-agent-po write the initiative from prd-check-in/
   ```

   Then reply in the same chat:

   ```text wrap
   Split this initiative into epics.
   ```

   After slicing, Sofia checks whether the initiative still needs a shared UX design system or shared technical architecture and offers fresh chats with Sally and Winston when either is missing.

3. Sally designs what the epics share if they need a shared visual and interaction system across screens and states. If the room booker already has an established design system, this pass stays light because `DESIGN.md` references the existing tokens and records only new additions. Once Sally finishes, Sofia adopts the design into the initiative. See [Design UX and Architecture](../plan/design-ux-and-architecture.md).

   ```text wrap
   /bmad-agent-ux-designer design the shared screens and states the check-in epics will use
   ```

   ```text wrap
   /bmad-agent-po adopt the design
   ```

4. Winston settles the technical decisions the two epics share, such as where the no-show timer runs and how both epics share booking state. Once Winston finishes the shared architecture document, Sofia adopts it into the initiative.

   ```text wrap
   /bmad-agent-architect settle the technical decisions the check-in epics share
   ```

   ```text wrap
   /bmad-agent-po adopt the shared architecture
   ```

UX runs before shared architecture here so user flows inform the technical choices. Skip either step when no cross-epic questions are open, or swap their order when a hard technical constraint determines what the interface can support.

## For Each Epic

Each epic has one owner, and the two epics proceed in parallel: you own door check-in, and Dana owns freeing no-show rooms. BMad leaves epic ownership to your team agreement or external issue tracker. Each owner begins with **epic inception** (steps 5 to 8, where a thin epic outline expands just in time with any needed epic-level PRD, UX, architecture, and approved stories), then builds, reviews, and closes the epic in steps 9 to 12.

5. Sofia refines the epic and identifies what still needs decisions before coding. If open product questions or edge cases remain for this epic, Sofia recommends a fresh chat with John (`bmad-agent-pm`) to write a focused epic-level PRD first; otherwise she fills out the epic's requirements directly from the initiative and its linked documents. Before slicing a UI-bearing or contract-heavy epic, she also offers fresh chats with Sally or Winston if epic-specific UX or technical design is missing. See [Plan an Epic's Stories](../plan/plan-an-epics-stories.md).

   ```text wrap
   /bmad-agent-po refine the door check-in epic
   ```

6. Only if the epic has open screen or flow questions, Sally (`bmad-agent-ux-designer`) designs what is new or different for this epic, such as the door tablet's check-in screen and edge states.

   ```text wrap
   /bmad-agent-ux-designer design the door check-in epic's check-in screen, covering only what is new or different for this epic
   ```

7. Only if the epic has open technical questions, Winston (`bmad-agent-architect`) settles the data models, endpoints, or state transitions specific to this epic against the live codebase.

   ```text wrap
   /bmad-agent-architect settle the door check-in epic's open technical questions
   ```

8. Sofia slices the epic into stories, writes refined story files with clear acceptance criteria by default, validates the breakdown, and puts them on the board. On the default repository board (files stored directly in Git), your approval commits them locally; if your team connected an external tracker such as Jira or Linear, Sofia publishes the approved stories there so each ticket is pushed once and complete. See [Set Up the Ticket Tree](../plan/set-up-the-ticket-tree.md#configure-where-tickets-are-tracked).

   ```text wrap
   /bmad-agent-po finish refining the door check-in epic, then plan its stories
   ```

9. Amelia implements each story with `bmad-build`, starting each story in a fresh chat. Stories use `epic.story` numbering (`1.1` is epic 1, story 1). See [Build and Verify](../build/build-and-verify.md).

   ```text wrap
   /bmad-agent-dev build story 1.1
   ```

   Because story `2.1` depends on `1.2`, Dana claims `2.1` once `1.2` is built. On the default repository board, assigning records ownership in the plan file:

   ```text wrap
   /bmad-agent-po assign story 2.1 to Dana
   ```

   On a connected external tracker, `start story 2.1` claims the ticket and moves its card to in-progress instead; see [Set Up the Ticket Tree](../plan/set-up-the-ticket-tree.md#use-sofia).

10. Review the code, verify the result, and mark the story done. For work going to production, run an independent code review right after each story's build (unless the build already ran a thorough review or a pull request review bot covers it), before marking the story done and before starting the next build so the diff stays isolated to that story:

    ```text wrap
    /bmad-agent-dev review the code for story 1.1
    ```

    Complete any manual verification steps as well. For story `1.1`, facilities mounts and pairs the tablets and you confirm a tablet displays its room. Once review and manual checks pass, tell Sofia to mark the story done:

    ```text wrap
    /bmad-agent-po mark story 1.1 done
    ```

    Repeat steps 9 and 10 for story `1.2` and every remaining story in the epic.

11. Amelia runs the retrospective once every story in the epic is marked done or dropped. The retrospective reviews the full epic's changes against its original goals and produces a verdict and follow-up actions. You can invoke it through Amelia or directly with `/bmad-retrospective 1`. See [Finish an Epic](../learn/finish-an-epic.md).

    ```text wrap
    /bmad-agent-dev run the retrospective on epic 1
    ```

12. Sofia validates and closes the epic. After you accept the retrospective verdict, Sofia checks every requirement and completion criterion with you and closes the epic on your confirmation.

    ```text wrap
    /bmad-agent-po close the door check-in epic
    ```

    Optionally, if you want a guided block-by-block human walkthrough of the epic's pull request or commits, run `bmad-walkthrough`.

## When Something Changes

Bring mid-flight changes back to Sofia to replan. When the change alters agreed product requirements, John updates the PRD first so every downstream document stays consistent. For example, if facilities shortens the no-show window to 10 minutes partway through epic 2, update the PRD and then ask Sofia what needs to change. See [Learn and Adjust](../learn/learn-and-adjust.md#a-change-mid-flight).

```text wrap
/bmad-agent-pm update the check-in PRD: facilities set the no-show window to 10 minutes
```

```text wrap
/bmad-agent-po this changed, what now: the no-show window is 10 minutes, see prd-check-in/
```

Whenever anyone loses track of the current state, ask `/bmad what's next?` or `/bmad-agent-po what's next?`.

## What You Have at the End

You finish with a validated PRD, the initiative and its two epic specifications, the shared UX design and shared architecture (plus any epic-specific UX or technical designs), refined story files, tested and reviewed code, a local build plan per story, and a retrospective per epic. The work is finished once the final epic's retrospective has run and Sofia has closed the epic. Well-settled stories can also run unattended via `bmad-build-auto`, with a developer reviewing each output and marking it done.

## Where People Approve

BMad defines five formal sign-offs across an organization. This route passes four of them: PRD validation in step 1, shared architecture review in step 4 (and epic architecture review in step 7 when it runs), story breakdown approval in step 8, and each epic's retrospective verdict in step 11. The fifth sign-off, the PRFAQ (Press Release and Frequently Asked Questions) verdict, applies only when Mary tests a product concept up front before committing a team. [Plan Inside an Organization](../plan/plan-inside-an-organization.md) explains the sequence and what each sign-off governs.

## Skip Ahead When

- One person owns the product rules: [Build from a Conversation](./build-from-a-conversation.md) delivers the same feature without a PRD.
- The epics need no shared design system: skip step 3.
- The epics share no cross-cutting technical decisions: skip step 4.
- An epic has no open screen, flow, or technical questions: skip steps 6 and 7 for that epic.

New to BMad? Start with [Install BMad](../start/install-bmad.md).
