---
title: 'Break Work into Stories and Track It'
description: Turn a spec or PRD into implementable stories, gate readiness, generate sprint tracking, view status, and repair the tracking file when it drifts.
sidebar:
  order: 7
---

Use this page to turn a plan into stories you can build in one session and
keep track of them. The path depends on the plan: a spec-backed epic gets
Story Breakdown; a project with a PRD gets epics and stories, then
`bmad-sprint-planning`.

## Prepare the Units

| Plan                                          | Do this                                                          | Tracking artifact                       |
| --------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------- |
| One epic backed by `SPEC.md`                  | Ask `bmad-spec` for Story Breakdown                              | Ordered `stories.yaml` beside `SPEC.md` |
| A project with a PRD (and UX or architecture) | Run `bmad-create-epics-and-stories`, then `bmad-sprint-planning` | Epic files plus `sprint-status.yaml`    |

For a spec-backed epic, `stories.yaml` is the whole tracking file. Build
creates each story's implementation record under the spec folder, and
[Finish an Epic](../build/finish-an-epic.md) reads `stories.yaml` as the inventory.
No sprint-status file is involved.

For a project, `bmad-create-epics-and-stories` works with you as a product
partner to turn the PRD's requirements and the architecture's decisions into
epic files organized by user value, each story carrying acceptance criteria a
developer can implement against. Everything from here on is about that path.

## Gate Readiness

Run `bmad-sprint-planning` at the boundary between planning and
implementation. Before any tracking exists, it judges the plan like a
skeptical senior developer reading a handoff. It inventories whatever planning
documents the project actually has — briefs, PRFAQs, PRDs, specs, UX output,
architecture, epics — by reading them, not by filename. Then it asks one
question: could a developer implement these epics without inventing decisions
nothing records?

The verdict is `PASS`, `CONCERNS`, or `FAIL`. Concerns are listed and you
choose whether to proceed. A fail stops with findings ordered by severity,
each naming the skill that fixes it. A missing document type is only a finding
if stories depend on it; a project with no UX document and no UI stories is
fine.

Say "check implementation readiness" to run only the gate. The `IR` trigger on
the Product Manager's and Architect's menus does the same.

## Generate Tracking

After the gate passes, the same skill generates `sprint-status.yaml`. Build
syncs story statuses into it, code review moves stories through review, and
the retrospective appends action items to it.

Re-running generation is safe: finished work stays finished, action items and
hand-written comments pass through, and a dry run reports drift without
writing.

## View Status

Say "show sprint status" to skip the gate and see where you are: counts by
status, risk flags (a stale file, orphaned stories, stories waiting in review),
open action items from retrospectives, and one recommended next action with
its story key. There are no time estimates: status, risks, and next steps
only.

The next action follows a fixed priority: resume in-progress work, review what
is waiting, start the next ready story, start the first backlog story, run an
open retrospective, or report done.

## Repair the Tracking File

Say "validate sprint status" to check the file's format without changing it.
Say "fix sprint status" when the file is broken or has drifted from reality.
The skill infers the true state first — from epic files, story files, and git
history — and shows you one proposed state table. Nothing is written until you
confirm it. Then it regenerates a clean file and validates it. Repair is the
only path that can mark a story as less complete than it was, because it
reflects confirmed reality.

Old names still work: `bmad-check-implementation-readiness` and
`bmad-sprint-status` forward here. Move any
`_bmad/custom/bmad-sprint-status.toml` overrides to
`bmad-sprint-planning.toml`.

## Correct Course

Run `bmad-correct-course` when a change is too big for one story to absorb: a
requirement turned out to be wrong, an architecture decision has to change, or
a dependency changed. It reads the PRD, epics, architecture, and UX documents,
assesses the impact, and produces a sprint change proposal — what changes,
what stays, and in what order. Apply the proposal, then re-run Story Breakdown
or `bmad-sprint-planning` for the affected epics. Finished work stays
finished.

## What Comes Next

Implement each story with [`bmad-build`](../build/build-a-change.md), or with
[`bmad-build-auto`](../build/autonomous-development-loops.md) once the decisions are stable.
When the epic's stories are done, close it with
[Finish an Epic](../build/finish-an-epic.md).
