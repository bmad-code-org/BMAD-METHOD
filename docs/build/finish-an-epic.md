---
title: 'Finish an Epic'
description: Close out a finished epic by reading the evidence it left — the diff, the commits, the plans — and judging the result instead of trusting memory.
sidebar:
  order: 5
---

Run `bmad-retrospective` when every ticket of an epic is finished. It reads
what the epic left in the ticket tree — the epic file, each ticket's plan,
the diff, and the commits — and uses that evidence instead of anyone's
recollection. It produces a written review, proposed action items, and a
verdict on whether the epic met its acceptance criteria.

## Why Run It After an Epic

An epic ships as a stack of tickets, each built and reviewed on its own. Each
ticket passed its own review in isolation, so the bugs that survive to this
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
  tickets where no single session saw both sides.
- **Spec reconciliation**: where the built code diverged from what the epic
  and the initiative's requirements described.
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
The retrospective reports what the diff, the commits, and the plans actually
show. It won't invent a root cause or a pattern the code doesn't back up.
:::

## What It Reads

The retrospective works on one epic folder in the ticket tree that
`bmad-preview-ticketing` keeps (see
[Break Work into Stories](../plan/break-work-into-stories-and-track-it.md)):

- **`tickets.toml`**: the epic's tickets, in build order.
- **The epic file**: its Done when checks, the criteria the verdict judges.
- **The initiative's requirements**: what each ticket's `covers` points at.
- **Each ticket's plan and story file**: the plan's triage log,
  verification, plan changes, and any `## Code Review` blocks; the story
  file only when the ticket was refined.
- **The git history**: each plan's diff and commits, from its
  `baseline_revision` to the next plan's.
- **The previous epic's retrospective**: its action items, to check whether
  they landed.

A ticket counts as finished when it is `built`, `done`, or `dropped`. Builds
stop at `built`, and only you mark a ticket done, so the retrospective lists
the tickets still at `built` for you to close.

## What You Get

- **A retrospective document**, `epic-<slug>-retrospective.md` in the epic
  folder, with the evidence inventory, findings grouped with their sources,
  the verdict, and proposed action items. It is the only file the skill
  writes. It does not mark the epic or any ticket done.
- **A verdict** of `accepted`, `accepted-with-open-items`, or `rejected`,
  recorded in the document's frontmatter, which tells you whether to start
  the next epic or hold and fix first. Unfinished tickets make the skill's
  verdict `rejected`; a human can still override.

A failing epic never closes as quietly accepted. If the criteria aren't met,
or any of the epic's tickets are still unfinished, and no one overrides the
call, it closes as not accepted.

## What to Do with the Output

The skill proposes; you decide what runs. Nothing touches your code or your
specs automatically.

- **Action items** feed the normal dev loop as fix-now work or fresh tickets.
  The retrospective writes them up; it doesn't execute them.
- **Spec reconciliations** arrive with the evidence attached, for you to apply
  to the project contract by hand. An uncertain interpretation never gets
  written into a spec on its own.
- **The verdict** is the gate. A rejected epic, or one accepted with open
  items, tells the next planning step what to carry forward.

## Running It

Invoke `bmad-retrospective` with the epic folder, or the epic's id or slug in
the active initiative. With no input, it offers the epics whose tickets are
all finished. By default, it stops at the written report and verdict.

| You want                 | Do this                                                                                                                      |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| A standard review        | `/bmad-retrospective`                                                                                                        |
| A specific epic          | `/bmad-retrospective 3`, or the epic's slug or folder                                                                        |
| The team to talk it over | Ask to "discuss it as a team"; it convenes [party mode](../customize/run-multi-agent-discussions.md) over the real findings, off by default |
| An unattended run        | `-H <epic>`: verdict on the evidence alone                                                                                   |
