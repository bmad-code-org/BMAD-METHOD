---
title: 'Break Work into Stories and Track It'
description: Turn intent, a spec, or a PRD into ticket entries, build them directly, and track progress in joined plans.
sidebar:
  order: 7
---

Use `bmad-preview-ticketing` to split and track work. It accepts described intent, a spec, or a PRD. One small story or bug can go straight to [Build](../build/build-a-change.md) without ticketing.

## Plan the Work

For several epics, create an initiative and ask the skill to slice it. Each epic gets an envelope with requirements and done-when checks. Incept one epic to propose its stories and bugs in build order, with requirement coverage, dependencies, and verification. Review the breakdown before accepting it.

The initiative's `tickets.toml` lists epics. Each epic's `tickets.toml` lists entries with stable numeric ids. A planned entry needs no story file. Standalone tracked stories and bugs have files in `backlog/`; they do not need an invented epic.

See [Set Up the Ticket Tree](./help-test-v7-previews.md) for store and tracker configuration.

## Build an Entry

Say “build story 1.2” to `bmad-build`. It reads the entry and epic, plus an existing refined leaf file, and writes acceptance criteria into its plan. Refinement before building is optional unless the work needs it.

The plan sits beside `tickets.toml` as `story-<slug>-plan.md`. Its numeric `ticket` joins the entry. A backlog plan uses its leaf file stem instead. The plan owns status and records the baseline before changes.

For unattended work, explicitly dispatch a ticket to `bmad-build-auto`, one invocation per ticket. It does not select the next ticket itself. Read [Autonomous Development Loops](../build/autonomous-development-loops.md) before wiring a runner.

## Track Progress

Ask ticketing “what's next?” or “show status.” Plans carry build progress. A build finishes at `built`, shown in the review column; the user or orchestrator decides when to mark it `done`. A tracker card's status remains separate from build status.

Keep completed plans. Deleting one removes the state and evidence later builds, review, and retrospective read.

## Review and Close

`bmad-code-review` reads a ticket's plan and baseline and appends a dated `Code Review` block. It never changes ticket status. When the epic is finished, run [Retrospective](../build/finish-an-epic.md) with its folder, id, or slug. Retrospective writes its evidence and verdict directly in the epic folder; ticketing handles confirmed closure.

## Correct Course

Run `bmad-correct-course` when a requirement, architecture choice, or dependency changes significantly. It requires a PRD and your description of the affected work and dependencies. For standalone spec work without a PRD, update the spec with `bmad-spec` instead. Correct-course assesses the available planning documents and writes its proposal as `change-<slug>/change-<slug>.md` in the active initiative's folder, or in the output folder when none is active, with the edits and a ticketing handoff. It does not read or edit the ticket tree. Apply the approved changes through the owning skills, then use ticketing to revise the remaining breakdown.
