---
title: Learn and Adjust
description: 'The Learn and adjust stage: wrap up finished epics, handle mid-flight scope changes, triage deferred findings, and turn recurring lessons into permanent team rules.'
sidebar:
  order: 1
---

Use this page when an epic finishes, when requirements change mid-flight, or when deferred findings build up across runs. Every story already passed its own isolated review, so Learn and adjust evaluates the whole epic together, routes changes back to the right document, and feeds lessons into your team's future runs.

| | Learn and adjust |
| --- | --- |
| **You start with** | A finished epic, a mid-flight change, or deferred findings from builds |
| **You produce** | An epic retrospective with verdict and action items, a closed epic or initiative, updated specs, and sharper project rules |
| **It is done when** | The verdict is recorded, the work is closed, and action items or findings are filed, turned into rules, or explicitly dropped |
| **Skip it when** | Rarely at an epic boundary, since this is the check no single story review performs. Mid-epic, run it only when a change or deferred finding calls for it |
| **What comes next** | Plan the next epic in [Plan the Work](../plan/plan-the-work.md), or close the initiative once its epics finish |

## Finish an Epic (or Initiative)

Before closing an epic, confirm all of its tickets (stories, bugs, and spikes) have finished. Stories left at `built` already count as finished for a retrospective, and you can verify them and ask Sofia to mark several done in one plain-English message:

```text wrap
/bmad-agent-po mark stories 1.1, 1.2, and 1.3 done
```

Next, run `bmad-retrospective` in a fresh chat (or ask [Amelia](../agents/amelia-dev.md) to run it for you):

```text wrap
/bmad-retrospective 1
```

The retrospective inspects the actual commits, diffs, build plans, and epic criteria rather than relying on chat memory. It writes `epic-<slug>-retrospective.md` inside the epic folder with an evidence-backed verdict (`accepted`, `accepted-with-open-items`, or `rejected`) and proposed action items, without modifying ticket statuses on its own. See [Finish an Epic](./finish-an-epic.md) for everything the retrospective checks and how to handle each verdict.

Once you have decided what to do with any action items, ask Sofia to close the epic:

```text wrap
/bmad-agent-po close the door check-in epic
```

Sofia runs a closure check against the epic's requirements and completion criteria and waits for your confirmation. If you ask her to close an epic before running a retrospective, she offers to run `bmad-retrospective` first. To inspect the epic's diff yourself block by block before merging, you can also run `bmad-walkthrough` on the epic's PR or commits.

When every epic inside an initiative finishes (or every child initiative inside a program finishes), ask Sofia to close the initiative or program the same way. Closing every child never closes the parent automatically; Sofia runs the parent's closure check against its overall outcome and asks you to confirm.

## A Change Mid-Flight

Requirements change while code is being built. Tell Sofia "this changed, what now", explaining what shifted and where the decision came from. She reads the affected spec, its history, its stories, and the work already completed, explains whether the underlying requirement changed or only how it is delivered, and proposes options: adjust remaining stories, add a follow-up story, roll back built code, or cut scope. You make the call.

- When requirements change, she updates them in place while keeping existing requirement IDs stable, and tells you which stories are now stale.
- Finished stories are never silently rewritten; they stay as the historical record while a new story carries the change.
- Work that no longer belongs is marked dropped with the reason recorded, and any dependent stories are unblocked.
- When a change invalidates UX designs or shared architecture, Sofia flags what drifted and recommends a fresh chat with Sally (`bmad-agent-ux-designer`) or Winston (`bmad-agent-architect`); she never edits their files herself.

Every adjustment is logged as a dated decision in the touched tickets. If the change started in an upstream document, update that document with its owning agent first (John for a PRD, Sally for UX, Winston for shared architecture), then bring it to Sofia. On a formal team workflow, follow the sequence in [Plan Inside an Organization](../plan/plan-inside-an-organization.md#when-requirements-change-mid-flight).

:::note[Example: the room booker]
In the [room booker](../start/how-bmad-works.md#the-example-app), an office meeting-room app, facilities shortens the no-show window to 10 minutes while epic 2 is one story in. John updates the PRD first:

**You:**

```text wrap
/bmad-agent-pm update the check-in PRD: facilities set the no-show window to 10 minutes
```

Then you bring the update to Sofia:

**You:**

```text wrap
/bmad-agent-po this changed, what now: the no-show window is 10 minutes, see prd-check-in/
```

**Sofia:** The core requirement changed, not just implementation detail. The no-show rule keeps its tracking ID and now says 10 minutes. Story 2.1 was already built with 15 minutes and its plan records that: keep 2.1 as built and add a new story to update the window to 10 minutes? Story 2.2 has not started yet and will use 10 minutes directly.

**You:** Yes.

**Sofia:** Added story 2.3 and logged the dated decision on both the initiative and epic 2.
:::

## Deferred Findings

Builds stay focused on one goal, so real issues spotted outside the current story are set aside rather than derailing the session:

- Interactive `bmad-build` and `bmad-code-review` runs append deferred items to `deferred-work.md` in your active initiative folder (or output folder when no initiative is active).
- Unattended `bmad-build-auto` runs record deferred findings inside each story's build plan (and Amelia collects them into her summary report when a batch finishes).

Nothing turns deferred items into tickets automatically. Before planning your next epic, review `deferred-work.md` and any unattended run summaries with Sofia so every item either becomes a story or backlog bug or gets intentionally dropped with a recorded reason.

## Turning Lessons into Team Rules

A retrospective is most valuable when recurring mistakes stop happening in future epics. When the same pitfall shows up twice across stories or reviews, feed it back into your project's standing rules:

- Run `bmad-project-context` to record repository conventions, build commands, codebase quirks, or concrete agent mistakes in `AGENTS.md` so every future coding and review session reads them automatically.
- Invoke `bmad-customize` to add a custom code-review lens, adjust default review depth, or add team-specific planning checks for Sofia, John, Sally, or Winston.

Taking two minutes to record a recurring lesson after an epic prevents repeating the same fix in the next one.
