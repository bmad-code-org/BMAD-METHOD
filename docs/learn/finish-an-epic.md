---
title: 'Finish an Epic'
description: Judge a finished epic from the evidence it left (the diff, the commits, the plans) instead of trusting memory.
sidebar:
  order: 2
---

Run `bmad-retrospective` when every ticket of an epic (its stories, spikes,
and bugs) is finished, before Sofia closes the epic. It reads
what the epic left in the ticket tree — the epic file, each ticket's plan,
the diff, and the commits — and uses that evidence instead of anyone's
recollection. It produces a written review, proposed action items and
decision records, and a verdict on whether the epic met its Requirements and
Done when checks.

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
- **An acceptance verdict**: the epic judged against its own Requirements and
  Done when checks.

Every finding carries a source reference: a file, a line, a commit, a log. A
claim it can't point at doesn't make the report. Before it reads, it asks
what you want weighted, such as a story that felt rushed; your answer focuses
the review but never becomes a finding without a source.

## What It Reads

The retrospective works on one epic folder in the ticket tree that
Sofia, the Product Owner (`bmad-agent-po`), keeps (see
[The Ticket Tree](../reference/ticket-tree.md)):

- **`tickets/tickets.toml`**: the epic's tickets, in build order.
- **The epic file**: its `Done when` checks, the criteria the verdict judges.
- **The epic's requirements**: what each ticket's `covers` points at, and the
  initiative lines each one cites.
- **Each ticket's plan and story file**: the plan's frozen decisions,
  triage log, verification, plan changes, and any `## Code Review` blocks;
  the story file only when the ticket was refined.
- **The git history**: each plan's diff and commits, from its
  `baseline_revision` to the next plan's.
- **The previous epic's retrospective**: its action items, to check whether
  they landed.

A ticket counts as finished when it is `built`, `done`, or `dropped`. Builds
stop at `built`; you, or a script or AI session you direct, mark a ticket
done. Mark them done before the retrospective; it lists any still at
`built`.

## What You Get

- **A retrospective document**, `epic-<slug>-retrospective.md` in the epic
  folder, with the evidence inventory, findings grouped with their sources,
  the verdict, and proposed action items. Apart from the decision records
  you approve, which go beside the code they govern or in the decisions
  folder when system-wide, it is the only file the skill writes. It does not
  mark the epic or any ticket done.
- **A verdict** of `accepted`, `accepted-with-open-items`, or `rejected`,
  recorded in the document's frontmatter, which tells you whether to start
  the next epic or hold and fix first. When the checks aren't met, or any
  ticket is unfinished, the verdict is `rejected` unless a person overrides
  it. When you then ask Sofia to close the epic, she checks it against its
  Done when; if no retrospective exists yet, she offers one first.

:::note[Example: the room booker]
In the [room booker](../start/how-bmad-works.md#the-example-app), an office's meeting-room app, epic 1 (door check-in) has all 8 stories
built. You mark the last one done, then run the retrospective on the
finished epic:

**You:**

```text wrap
/bmad-agent-po mark story 1.8 done
```

```text wrap
/bmad-retrospective 1
```
**`bmad-retrospective`:** Verdict: `accepted-with-open-items`. All three Done when
checks are met. Open item: nothing tells facilities when a door tablet goes
offline. People at that door cannot check in, and the server still frees the
room. Proposed action: alert facilities when a tablet stops reporting.

It files nothing itself. You tell Sofia, then have her close the epic once
you confirm:

**You:**

```text wrap
/bmad-agent-po File a bug: nothing alerts facilities when a door tablet goes offline.
```

```text wrap
/bmad-agent-po close the door check-in epic
```
:::

## What to Do with the Output

The skill proposes; you decide what runs. Nothing touches your code or your
specs automatically.

- **Action items** feed the normal dev loop as fix-now work or fresh tickets.
  The retrospective writes them up; it doesn't execute them.
- **Spec reconciliations** arrive with the evidence attached. Take each to
  Sofia ("this changed, what now") so she updates the ticket. An uncertain
  interpretation is never written into a spec on its own.
- **Decision records** (ADRs) are written beside the code they govern only
  when you approve each one, and committing them is up to you.
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
