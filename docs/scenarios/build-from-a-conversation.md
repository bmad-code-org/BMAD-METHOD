---
title: Build from a Conversation
description: 'Scenario: a decision made on a call or in a brainstorm becomes a cited note or summary, then an initiative written by Sofia, then stories built one by one with no PRD.'
sidebar:
  order: 2
---

Use this route when a decision came out of a conversation or brainstorm and nobody needs a formal PRD to align on it. The call transcript or brainstorm summary is your starting input, and the initiative Sofia writes from it becomes your specification.

The example uses the [room booker](../start/how-bmad-works.md#the-example-app). On a call, the office manager and the facilities lead talked through rooms that are booked and left empty. The office manager has decision authority, and you saved the call transcript.

![Build from a Conversation: in Clarify, bmad-ingest turns a call into a cited note, or a brainstorm leaves a summary; Sofia writes the initiative from it, then the epics and the first epic's stories in Plan; bmad-build builds one story per chat and you mark each done; the retrospective judges the finished epic, then Sofia validates and closes it](/diagrams/scenario-conversation.svg)

## Steps

1. Turn the call into a cited note, where each takeaway links back to its timestamp and any disagreement stays flagged for you to resolve. See [Clarify the Idea](../clarify/clarify-the-idea.md#turn-raw-input-into-notes).

   ```text wrap
   /bmad-ingest ~/Downloads/rooms-call.txt
   ```

   If you are starting from a brainstorm summary from `bmad-brainstorming` or a hardened report from `bmad-forge-idea`, skip directly to step 2.

2. Have Sofia, the Product Owner, write the initiative from the note.

   ```text wrap
   /bmad-agent-po write the initiative from the rooms call note
   ```

   If you started from a brainstorm, point her to its summary instead:

   ```text wrap
   /bmad-agent-po write the initiative from the brainstorm summary
   ```

3. Settle her open questions with the office manager, then reply to Sofia in the same chat.

   ```text wrap
   The office manager says a room counts as unused 15 minutes after its start, and the server frees it.
   ```

4. Slice the initiative into epics: door check-in first, then freeing no-show rooms. See [Write and Slice the Initiative](../plan/write-and-slice-the-initiative.md).

   ```text wrap
   /bmad-agent-po split this initiative into epics
   ```

   Because step 3 settled that the server frees unused rooms, Sofia has no unresolved cross-epic technical question to send to Winston (`bmad-agent-architect`).

5. Plan the first epic's stories and approve them. Stories use `epic.story` numbering, so `1.1` is the first story of epic 1. Story `1.1` (showing each room on its door tablet) is marked `hitl` (human-in-the-loop: a person handles part of the work outside code, confirming before building or when done) because facilities mounts and pairs the physical tablets. Once you approve the split, Sofia writes a full story file with clear acceptance criteria for each story by default. See [Plan an Epic's Stories](../plan/plan-an-epics-stories.md).

   ```text wrap
   /bmad-agent-po refine the door check-in epic, then plan its stories
   ```

6. Build story by story, starting each story in a fresh chat and marking each one done after you verify it. See [Build and Verify](../build/build-and-verify.md).

   Because story `1.1` includes a manual step, run `bmad-build` on it, have facilities mount and pair the tablets, confirm a tablet displays its room, and then ask Sofia to mark it done.

   ```text wrap
   /bmad-build 1.1
   ```

   ```text wrap
   /bmad-agent-po mark story 1.1 done
   ```

   ```text wrap
   /bmad-build 1.2
   ```

   Build, verify, and mark each remaining story done the same way, then close the epic in step 7. Repeat steps 5 through 7 for the second epic.

7. Run the retrospective, then close the epic. The retrospective evaluates the finished epic as a whole against its original goals, and once you accept its verdict, Sofia validates the epic against its requirements and completion criteria, asks you to confirm, and closes it. See [Finish an Epic](../learn/finish-an-epic.md).

   ```text wrap
   /bmad-retrospective 1
   ```

   ```text wrap
   /bmad-agent-po close the door check-in epic
   ```

## What You Have at the End

You finish with the cited call note, the initiative and epic specifications, a refined story file (`story-<slug>.md`) with acceptance criteria for each story, tested code, a local build plan recording each run, and a retrospective for each epic. No PRD, UX document, or shared architecture file was created because nobody needed one.

## Shorter and Longer Routes

- If the note describes a single self-contained change, hand it straight to `bmad-build` as shown in [Make a Small Change](./make-a-small-change.md).
- If the whole effort is only a few stories, ask Sofia to slice the initiative straight into stories without creating epics.
- If the decision is already written clearly in an issue or short paragraph, skip step 1 and hand that text directly to Sofia.
- If several stakeholders need to align before coding starts, use [Plan a Feature as a Team](./plan-a-feature-as-a-team.md).

New to BMad? Start with [Install BMad](../start/install-bmad.md).
