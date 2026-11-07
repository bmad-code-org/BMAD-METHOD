---
title: 'Break Work into Stories and Track It'
description: Turn intent or a PRD into ticket entries, build them directly, and track progress in joined plans.
sidebar:
  order: 7
---

Ask Sofia, the Product Owner (`bmad-agent-po`), to split and track work. She accepts described intent or a PRD, writes the requirements into the initiative or epic file, and slices from them. One small story or bug can go straight to [Build](../build/build-a-change.md) without ticketing.

## Plan the Work

For several epics, create an initiative and ask Sofia to slice it. Each epic starts as a thin envelope, marked `refined: false`: its outcome, boundaries, and done-when checks as far as they are known, with no requirements yet. Ask Sofia to refine an epic before its stories are planned. She says what is already settled, names each open point with her pick (settle it now, spike it, or leave it to the stories), and writes its requirements. You can flesh it out further with a PRD, UX, architecture, or research run on the epic itself. Then incept the epic to propose its stories and bugs in build order, with requirement coverage, dependencies, and verification. Review the breakdown before accepting it.

The initiative's `tickets/tickets.toml` lists epics, each in its own folder beside that file. Each epic's `tickets/tickets.toml` lists entries with stable ids. A planned entry needs no story file. Standalone tracked stories and bugs have files in `backlog/`; they do not need an invented epic. Work bigger than one initiative goes under a parent initiative, whose `tickets/tickets.toml` lists child initiatives instead of epics.

See [Set Up the Ticket Tree](./set-up-the-ticket-tree.md) for store and tracker configuration.

## Build an Entry

Say “build story 1.2” to `bmad-build`. It reads the entry and epic, plus an existing refined leaf file, and writes acceptance criteria into its plan. Refinement before building is optional unless the work needs it.

The plan sits beside the epic's `tickets.toml`, in its `tickets/` folder, as `story-<slug>-plan.md`. Its numeric `ticket` joins the entry. A backlog plan uses its leaf file stem instead. The plan owns status and records the baseline before changes.

For unattended work, explicitly dispatch a ticket to `bmad-build-auto`, one invocation per ticket. It does not select the next ticket itself. Read [Autonomous Development Loops](../build/autonomous-development-loops.md) before wiring a runner.

## Track Progress

Ask Sofia “what's next?” or “show status.” Plans carry build progress. A build finishes at `built`, shown in the review column; the user or orchestrator decides when to mark it `done`. A tracker card's status remains separate from build status.

Keep completed plans. Deleting one removes the state and evidence later builds, review, and retrospective read.

## Review and Close

`bmad-code-review` reads a ticket's plan and baseline and appends a dated `Code Review` block. It never changes ticket status. When the epic is finished, run [Retrospective](../build/finish-an-epic.md) with its folder, id, or slug. Retrospective writes its evidence and verdict in the epic folder, beside the epic file; Sofia handles confirmed closure.

## Replan

Tell Sofia when a requirement, architecture choice, or dependency changes significantly: “this changed, what now.” She names the change and the ticket it lands on, reads that ticket, its memlog, its breakdown, and the finished children, and says whether what is required changed or only how it is delivered. When what is required changed, she updates the ticket's requirements first, keeping ids stable and naming the entries that went stale. Then she re-slices the affected epics, drops what no longer belongs, and records the reason as a dated `Decision:` line in each container's Notes. There is no proposal file, and nothing already built is rewritten.
