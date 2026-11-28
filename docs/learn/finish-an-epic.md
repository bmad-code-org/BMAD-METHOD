---
title: 'Finish an Epic'
description: Run bmad-retrospective to judge a finished epic from its commits, diffs, and build plans instead of memory, handle rejected verdicts, and approve decision records.
sidebar:
  order: 2
---

Run `bmad-retrospective` when every ticket in an epic (its stories, bugs, and spikes) has finished, before asking Sofia to close the epic. Instead of relying on recollection, it inspects the evidence left behind (the epic spec, story files, build plans, Git commits, and full combined diff) and produces a written report, proposed action items, optional Architecture Decision Records (ADRs), and a clear acceptance verdict.

## Why Run It After an Epic

An epic ships as a sequence of stories, each built and reviewed in isolation. Isolated reviews catch local bugs, while cross-story problems slip through: several sessions each add helper code to the same module until it grows unwieldy, two stories solve similar problems with conflicting patterns, or the combined behavior drifts slightly from the epic's original goal. Running a retrospective at the end of an epic closes that gap while the diff is fresh.

## What It Looks For

- Aggregate defects across stories, including architecture drift, duplicated helpers, oversized modules, and inconsistent patterns that no single story diff exposed.
- A whole-epic diff review that passes the combined epic diff to [`bmad-review`](../reference/skills-and-agents.md#bmad-review), focusing especially on seams between stories where no single coding session saw both sides.
- Spec reconciliation that identifies places where implemented behavior diverged from the epic's or initiative's stated requirements.
- An end-to-end behavior check that exercises changed runtime flows end to end whenever the epic changed runtime behavior, because passing unit tests alone do not prove the live system works together.
- Follow-through on previous action items to check whether commitments agreed in the prior epic's retrospective actually landed.
- An acceptance verdict judging the completed epic directly against its requirements and completion criteria.

Every finding must cite concrete evidence: a file path, line number, commit, or log entry. Claims without direct evidence are dropped. Before analysis starts, the skill invites you to share any going-in concerns (such as a story that felt rushed); your input guides where it looks closely, though nothing enters the report without verified evidence.

## What It Reads

The retrospective inspects one epic folder inside your ticket tree (see [The Ticket Tree](../reference/ticket-tree.md)):

- The epic's story list and spec, including every planned ticket in build order, the epic's requirements and completion checks, and the parent initiative lines they trace back to.
- Each ticket's story file and build plan. Because Sofia writes refined story files by default when an epic is planned, nearly every story provides both its acceptance criteria and its build plan (decisions made during planning, verification notes, review blocks, and plan changes), while entries you chose to keep light supply their build plan and entry details.
- Git history showing each story's exact commits and diffs across the epic.
- The previous epic's retrospective, when one exists, to verify whether earlier action items were completed.

A ticket counts as finished once it reaches `built`, `done`, or `dropped`. Builds stop at `built`, and you mark stories done through Sofia. You can run the retrospective while stories are still at `built` (the report notes which ones have not been marked done yet), or mark them done with Sofia beforehand.

## What You Get

- A retrospective report (`epic-<slug>-retrospective.md`) saved inside the epic folder with the evidence inventory, sourced findings, proposed action items, and verdict. Aside from any Architecture Decision Records (ADRs) you explicitly approve, this report is the only file the retrospective writes, and it never edits the epic spec, story files, or ticket statuses.
- An acceptance verdict recorded in the report as `accepted`, `accepted-with-open-items`, or `rejected`. If completion criteria failed or any ticket remained unfinished, the verdict defaults to `rejected` unless you explicitly override it interactively.

:::note[Example: the room booker]
In the [room booker](../start/how-bmad-works.md#the-example-app), an office meeting-room app, epic 1 (door check-in) has all 3 stories built. You mark them done and run the retrospective:

**You:**

```text wrap
/bmad-agent-po mark stories 1.1, 1.2, and 1.3 done
```

```text wrap
/bmad-retrospective 1
```

**`bmad-retrospective`:** Verdict is `accepted-with-open-items`. All three completion checks passed. Open item: nothing alerts facilities when a door tablet goes offline, so people at that door cannot check in while the server still frees the room. Proposed action: add an offline tablet alert for facilities.

Because the retrospective never files tickets itself, you ask Sofia to log the follow-up and close the epic:

**You:**

```text wrap
/bmad-agent-po File a bug: nothing alerts facilities when a door tablet goes offline.
```

```text wrap
/bmad-agent-po close the door check-in epic
```
:::

## What to Do with the Output

The retrospective proposes; you decide what changes. Nothing alters your codebase or specs automatically:

- Take fix-now action items straight into `bmad-build`, or ask Sofia to file follow-up stories or backlog bugs.
- Bring documented spec reconciliations to Sofia ("this changed, what now") so she updates the spec cleanly instead of letting code and docs drift apart.
- Review any proposed Architecture Decision Records (ADRs), which capture significant technical choices made during implementation. Only the ADRs you approve get written (beside the code they govern or in your decisions folder), and committing them stays up to you.

### When the Verdict Is `rejected`

A `rejected` verdict means either an epic ticket is still unfinished or one or more completion criteria failed verification. Work through the blocking items listed in the report (finish the remaining story, apply fixes with `bmad-build`, or reconcile a changed requirement with Sofia), then run `/bmad-retrospective` on the same epic again.

Re-running `/bmad-retrospective` on an epic that already has a retrospective file automatically loads the existing report, reconciles it against the new commits and answers, and resumes from the first incomplete phase instead of starting over from scratch. Once the updated verdict is `accepted` (or `accepted-with-open-items` with your agreement), ask Sofia to close the epic.

## Running It

Invoke `/bmad-retrospective` with the epic number, slug, or folder path (or ask [Amelia](../agents/amelia-dev.md) to run it). With no argument, it lists every epic whose tickets have finished so you can pick one. By default, it stops after writing the report and verdict.

| You want | Do this |
| --- | --- |
| Pick from finished epics | `/bmad-retrospective` |
| Review a specific epic | `/bmad-retrospective 3` (or the epic's slug or folder) |
| Re-check after fixes or resume an interrupted run | Run `/bmad-retrospective 3` again; it reconciles new commits automatically |
| Hold a multi-agent team discussion on the findings | Ask to "discuss it as a team" to launch [party mode](../customize/run-multi-agent-discussions.md) grounded in the verified findings (off by default) |
| Run unattended in automation | Invoke in non-interactive (headless) mode naming the epic explicitly to get an evidence-only report and verdict with no prompts |
