---
title: 'Break Work into Stories and Track It'
description: Turn a spec or PRD into implementable stories, gate readiness, generate sprint tracking, view status, and repair the tracking file when it drifts.
sidebar:
  order: 7
---

Use this page to turn a plan into stories you can build in one session and
keep track of them. The path depends on the plan: a spec-backed epic goes to
`bmad-preview-ticketing`; a project with a PRD gets epics and stories, then
`bmad-sprint-planning`.

:::note[v7 preview]
`bmad-preview-ticketing` is a preview skill. It breaks a spec-backed epic into stories, and it can stand in for the project path on this page. See [Help Test v7 Previews](./help-test-v7-previews.md).
:::

## Prepare the Units

| Plan                                          | Do this                                                          | Tracking artifact                            |
| --------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------- |
| One epic backed by `SPEC.md`                  | Run `bmad-preview-ticketing` with the spec folder                | Epic `tickets.toml` plus story tickets     |
| A project with a PRD (and UX or architecture) | Run `bmad-create-epics-and-stories`, then `bmad-sprint-planning` | Epic files plus `sprint-status.yaml`         |

For a spec-backed epic, give `bmad-preview-ticketing` the spec folder. It
plans one epic with you and records each planned story as an entry in
`tickets.toml` beside the epic's ticket file. Each story cites the spec's
`CAP-N` ids. A story gets its file when you pull it, and the pulled file goes
to `bmad-build`, which refines it as part of the build. Before an
unattended run, review the entries with the skill first. Full acceptance
criteria are written in ticketing only for a bug, a ticket with no epic, or
when you ask. "What's next?" lists what is ready to pull, refine, or start. See
[Help Test v7 Previews](./help-test-v7-previews.md) for setup and use. No
sprint-status file is involved.

To run the stories unattended, give
[`bmad-build-auto`](../build/autonomous-development-loops.md) the pulled story
file as its intent, one run per story. Dispatch straight from `tickets.toml`
is not available yet. For a spec folder that already has `stories.yaml`,
`bmad-build-auto` and loop runners dispatch by spec folder and story id, and
[Finish an Epic](../build/finish-an-epic.md) reads that file as the inventory.

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
what stays, and in what order. Once you approve it, it updates
`sprint-status.yaml` and hands the document edits off. Apply them, then create
the new or changed stories. For a large restructure, re-run `bmad-preview-ticketing`
or `bmad-sprint-planning` for the affected epics instead. Finished work stays
finished.

## What Comes Next

Implement each story with [`bmad-build`](../build/build-a-change.md), or with
[`bmad-build-auto`](../build/autonomous-development-loops.md) once the decisions are stable.
When the epic's stories are done, close it with
[Finish an Epic](../build/finish-an-epic.md).
