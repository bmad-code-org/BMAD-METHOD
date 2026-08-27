---
title: 'Retrospective'
description: Close out a finished epic by reading the evidence it left — the diff, the commits, the specs — and judging the result instead of trusting memory.
sidebar:
  order: 14
---

Run `bmad-retrospective` directly when an epic is done. It reads what the epic
produced—the specs, story records, full diff, commits, and tracking artifacts—and
uses that evidence instead of anyone's recollection. It produces a written
review, proposed action items, and a verdict on whether the epic met its
acceptance criteria.

## What it does

An epic ships as a stack of stories, each built and reviewed on its own. The retrospective looks at all of it at once and pulls out what no single story could show:

- **Aggregate defects** — the architecture that drifted, the helper written twice, the class that grew past a healthy size a few hundred lines at a time.
- **Diff-scope review** — it hands the epic's diff to `bmad-review` for the code lenses, weighting the seams between stories where no single session saw both sides.
- **Spec reconciliation** — where the built code diverged from what the epic and PRD described.
- **An acceptance verdict** — the epic judged against its own acceptance criteria.

Every finding carries a source reference: a file, a line, a commit, a log. A claim it can't point at doesn't make the report.

## Why run it after an epic

Each story passed its own review in isolation, so the bugs that survive to this point are the ones isolation hides. Nine sessions each add a little to the same file, and none of them ever sees the god class they built together. No session judged the epic as a whole against what it set out to deliver, either. That whole-epic view is the gap this closes, and the end of an epic is the moment to close it: the diff is fresh and the session logs haven't been cleared yet.

:::note[It reads evidence, it doesn't invent it]
The retrospective reports what the diff, the commits, and the specs actually show. It won't manufacture a root cause or a pattern the code doesn't back up.
:::

## Two Epic Inputs

Retrospective accepts either full-flow sprint tracking or the lightweight spec
folder described in [Choose a Development Path](../how-to/choose-a-development-path.md).

| Epic input          | Inventory and completion state                                     | Retrospective output                                                               |
| ------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Sprint-tracked epic | The selected epic in `sprint-status.yaml` and its story artifacts  | A dated document in the implementation artifacts; sprint status is updated         |
| Spec-backed epic    | `SPEC.md`, ordered `stories.yaml`, and `stories/<id>-*.md` records | `RETROSPECTIVE.md` in the spec folder; no sprint-status file is created or changed |

In the spec-backed path, `stories.yaml` defines the epic inventory and each
story record's frontmatter defines its completion state. Retrospective uses the
same rule whether Build or Build Auto produced a record.

## What you get

You receive an evidence report and a decision:

- **A retrospective document** with the evidence inventory, findings grouped with their sources, the verdict, and proposed action items.
- **In sprint mode, an updated sprint status** marks the retrospective as done and links action items to their findings. Spec-backed mode does not use sprint status.
- **A verdict** of `accepted`, `accepted-with-open-items`, or `rejected`, which tells you whether to start the next epic or hold and fix first. Unfinished stories for that epic make the machine verdict **rejected** (a human can still override interactively).

## What to do with the output

The skill proposes; you decide what runs. Nothing touches your code or your specs automatically.

- **Action items** feed the normal dev loop as fix-now work or fresh stories. The retrospective writes them up. It doesn't execute them.
- **Spec reconciliations** arrive with the evidence attached, for you to apply to the project contract by hand. An uncertain interpretation never gets written into a spec on its own.
- **The verdict** is the gate. A rejected epic, or one accepted with open items, tells the next planning step what to carry forward.

A failing epic never closes as quietly accepted. If the criteria aren't met, or any of the epic's stories are still unfinished, and no one overrides the call, it closes as not accepted.

## Running it

Invoke `bmad-retrospective` with the epic number or spec folder. With no input,
it can find the completed epic from sprint status. By default, it stops at the
written report and verdict.

| You want                         | Do this                                                                                                          |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| A standard review                | `/bmad-retrospective`                                                                                            |
| A specific epic                  | `/bmad-retrospective 3`                                                                                          |
| A spec-backed epic               | `/bmad-retrospective _bmad-output/specs/spec-<slug>/`                                                            |
| The team to talk it over         | Ask to "discuss it as a team" — it convenes [party mode](./party-mode.md) over the real findings, off by default |
| An unattended run for automation | `-H <epic>` — headless, verdict on the evidence alone                                                            |
