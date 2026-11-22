---
title: Build from a Conversation
description: 'Scenario: a decision made on a call or in a brainstorm becomes a cited note or a summary, then an initiative written by Sofia, then stories built one session at a time, with no PRD.'
sidebar:
  order: 2
---

Use this route when the decision was made in a conversation or a brainstorm
and nobody needs a PRD to agree on it. The transcript, or the brainstorm's
summary, is the input, and the initiative Sofia writes from it is the spec.

The example is the [room booker](../start/how-bmad-works.md#the-example-app).
On a call, the office manager and the facilities lead talked about rooms that
are booked and never used. The office manager decides, and you have the
transcript.

![Build from a Conversation: in Clarify, bmad-ingest turns a call into a cited note, or a brainstorm leaves a summary; Sofia writes the initiative from it, then the epics and the first epic's stories in Plan; bmad-build builds one story per chat and you mark each done; the retrospective judges the finished epic, then Sofia validates and closes it](/diagrams/scenario-conversation.svg)

## Steps

1. **Turn the call into a note.** Each point cites its timestamp, and both
   numbers appear where the two disagreed. See
   [Clarify the Idea](../clarify/clarify-the-idea.md#turn-raw-input-into-notes).

   ```text wrap
   /bmad-ingest ~/Downloads/rooms-call.txt
   ```

   If you start from a brainstorm, the summary `bmad-brainstorming` wrote,
   or the report of an idea `bmad-forge-idea` hardened, is your note. Go to
   step 2.

2. **Have Sofia, the Product Owner, write the initiative** from the note.

   ```text wrap
   /bmad-agent-po write the initiative from the rooms call note
   ```

   From a brainstorm, name its summary instead:

   ```text wrap
   /bmad-agent-po write the initiative from the brainstorm summary
   ```

3. **Settle her open questions** with the office manager, then answer Sofia
   in the same chat.

   ```text wrap
   The office manager says a room counts as unused 15 minutes after its start, and the server frees it.
   ```

4. **Cut it into epics:** door check-in first, then freeing no-show rooms.
   See [Write and Slice the Initiative](../plan/write-and-slice-the-initiative.md).

   ```text wrap
   /bmad-agent-po split this initiative into epics
   ```

   Step 3 settled that the server frees the room, so she has no shared
   decision to send to `bmad-architecture`.

5. **Plan the first epic's stories,** and approve them. Story 1.1, showing
   each room on its door tablet, is marked `hitl` because facilities mounts
   and pairs the tablets. See
   [Plan an Epic's Stories](../plan/plan-an-epics-stories.md).

   ```text wrap
   /bmad-agent-po refine the door check-in epic, then plan its stories
   ```

6. **Build story by story,** each in a fresh chat, and mark each one done
   after you check it. See [Build and Verify](../build/build-and-verify.md).

   Story 1.1 has a person's step. Build it with `bmad-build`, have facilities
   mount and pair the tablets, check that a tablet shows its room, then mark
   it done.

   ```text wrap
   /bmad-build 1.1
   ```

   ```text wrap
   /bmad-agent-po mark story 1.1 done
   ```

   ```text wrap
   /bmad-build 1.2
   ```

   Build and mark each remaining story the same way, then finish the epic in
   step 7. Repeat steps 5 to 7 for the second epic.

7. **Run the retrospective, then close the epic.** The retrospective judges
   the finished epic. Then Sofia validates it against its Requirements and
   Done when, you confirm, and she closes it. See
   [Finish an Epic](../learn/finish-an-epic.md).

   ```text wrap
   /bmad-retrospective 1
   ```

   ```text wrap
   /bmad-agent-po close the door check-in epic
   ```

## What You Have at the End

The note, the initiative and its epic files, each epic's stories in
`tickets.toml`, the code, one plan per story recording its build, and a
retrospective per epic. There is no PRD, UX file, or architecture spine,
because no one needed them.

## Shorter and Longer Routes

- If the note describes one session's work, hand it to `bmad-build`, as in
  [Make a Small Change](./make-a-small-change.md).
- If it is a few stories, ask Sofia to slice the initiative into stories
  directly, with no epics.
- If the decision is already written down, skip step 1 and hand the issue or
  paragraph to Sofia.
- If several people must agree first, take the route in
  [Plan a Feature as a Team](./plan-a-feature-as-a-team.md).

New to BMad? Start with [Install BMad](../start/install-bmad.md).
