---
title: 'Finish an Epic'
description: Close out a finished epic by reading the evidence it left — the diff, the commits, the specs — and judging the result instead of trusting memory.
sidebar:
  order: 5
---

Run `bmad-retrospective` when an epic is done. It reads what the epic
produced — the specs, story records, full diff, commits, and tracking
files — and uses that evidence instead of anyone's recollection. It
produces a written review, proposed action items, and a verdict on whether the
epic met its acceptance criteria.

## Why Run It After an Epic

An epic ships as a stack of stories, each built and reviewed on its own. Each
story passed its own review in isolation, so the bugs that survive to this
point are the ones isolation hides. Nine sessions each add a little to the
same file, and none of them ever sees the oversized module they built
together. No session judged the epic as a whole against what it set out to
deliver either. The end of an epic is the moment to close that gap: the diff
is fresh and the session logs have not been cleared.

## What It Looks For

- **Aggregate defects**: the architecture that drifted, the helper written
  twice, the file that grew a little in every session.
- **Diff-scope review**: it hands the epic's diff to
  [`bmad-review`](../reference/skills-and-agents.md#bmad-review), weighting the seams between
  stories where no single session saw both sides.
- **Spec reconciliation**: where the built code diverged from what the epic
  and PRD described.
- **A behavior check**: when the epic changed runtime behavior, it exercises
  the changed flows end to end. Passing tests do not substitute for running
  the system.
- **Follow-through**: whether the previous epic's action items were actually
  done.
- **An acceptance verdict**: the epic judged against its own acceptance
  criteria.

Every finding carries a source reference: a file, a line, a commit, a log. A
claim it can't point at doesn't make the report.

:::note[It reads evidence, it doesn't invent it]
The retrospective reports what the diff, the commits, and the specs actually
show. It won't invent a root cause or a pattern the code doesn't back up.
:::

## Two Epic Inputs

Retrospective accepts either sprint tracking from the project path or the
spec folder from the epic path in
[Choose a Planning Path](../plan/choose-a-planning-path.md).

| Epic input          | Inventory and completion state                                     | Retrospective output                                                               |
| ------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Sprint-tracked epic | The selected epic in `sprint-status.yaml` and its story artifacts  | A dated document in the implementation artifacts; sprint status is updated         |
| Spec-backed epic    | `SPEC.md`, ordered `stories.yaml`, and `stories/<id>-*.md` records | `RETROSPECTIVE.md` in the spec folder; no sprint-status file is created or changed |

In the spec-backed path, `stories.yaml` defines the epic inventory and each
story record defines its completion state. Retrospective uses the same rule
whether Build or Build Auto produced a record.

## What You Get

- **A retrospective document** with the evidence inventory, findings grouped
  with their sources, the verdict, and proposed action items.
- **In sprint mode, an updated sprint status** marks the retrospective as done
  and links action items to their findings. Spec-backed mode does not use
  sprint status.
- **A verdict** of `accepted`, `accepted-with-open-items`, or `rejected`,
  which tells you whether to start the next epic or hold and fix first.
  Unfinished stories for that epic make the skill's verdict `rejected`; a
  human can still override.

A failing epic never closes as quietly accepted. If the criteria aren't met,
or any of the epic's stories are still unfinished, and no one overrides the
call, it closes as not accepted.

## What to Do with the Output

The skill proposes; you decide what runs. Nothing touches your code or your
specs automatically.

- **Action items** feed the normal dev loop as fix-now work or fresh stories.
  The retrospective writes them up; it doesn't execute them.
- **Spec reconciliations** arrive with the evidence attached, for you to apply
  to the project contract by hand. An uncertain interpretation never gets
  written into a spec on its own.
- **The verdict** is the gate. A rejected epic, or one accepted with open
  items, tells the next planning step what to carry forward.

## Running It

Invoke `bmad-retrospective` with the epic number or spec folder. With no input,
it finds the completed epic from sprint status. By default, it stops at the
written report and verdict.

| You want                 | Do this                                                                                                                      |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| A standard review        | `/bmad-retrospective`                                                                                                        |
| A specific epic          | `/bmad-retrospective 3`                                                                                                      |
| A spec-backed epic       | `/bmad-retrospective _bmad-output/specs/spec-<slug>/`                                                                        |
| The team to talk it over | Ask to "discuss it as a team"; it convenes [party mode](../customize/run-multi-agent-discussions.md) over the real findings, off by default |
| An unattended run        | `-H <epic>`: verdict on the evidence alone                                                                                   |
