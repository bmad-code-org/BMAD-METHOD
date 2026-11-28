---
title: Autonomous Development Loops
description: Run well-specified stories unattended with Amelia or bmad-build-auto, review results safely, and know when to stay interactive.
sidebar:
  order: 6
---

Once an epic's architecture and code patterns are settled, you do not have to babysit every routine story. `bmad-build-auto` is BMad's unattended worker: each run takes a single story, plans it, implements it, reviews the diff, commits locally, and stops cleanly with a clear status (`built` or `blocked`) that you or an orchestrator can act on.

`bmad-build-auto` never picks the next story on its own or loops across a backlog. You can ask [Amelia, Developer](../agents/amelia-dev.md) (`bmad-agent-dev`) to drive a batch of ready stories one at a time, invoke `bmad-build-auto` on one ticket directly, or plug it into an external orchestrator.

:::note[Building an external orchestrator?]
This page is a practical guide for developers and engineering managers running unattended builds. If you are wiring `bmad-build-auto` into a custom script, CI runner, or orchestrator like `bmad-loop`, see the full machine specification in [Autonomous Loop Contract](../reference/autonomous-loop-contract.md).
:::

## When Unattended Loops Work Well

Unattended runs succeed when the codebase and tickets leave no product guesswork behind:

| Mode | Best fit |
| --- | --- |
| Unattended with `bmad-build-auto` | Follow-on stories after foundational patterns are already in the repository, stories with clear Given/When/Then acceptance criteria written by Sofia, and well-scoped refactors or bug fixes |
| Interactive with `bmad-build` | The opening story of a new epic (which establishes patterns later stories copy), high-risk architectural changes, UI work where you want to steer the visual feel, and any story marked as requiring a human step |

Before starting an unattended batch, ask Sofia to double-check the epic's stories (`/bmad-agent-po review the stories`) so open questions are settled before nobody is at the keyboard.

## Prerequisites and Safety Guardrails

Unattended execution enforces strict safety boundaries so a runaway loop cannot leave a half-broken repository behind:

- Your coding tool must support spawning subagents so the worker can run independent review lenses; without subagents, the run halts immediately as `blocked`.
- Every run requires a clean Git working tree on a branch matching the epic and commits locally on success, never pushing to a remote automatically.
- Tickets must live in the repository ticket store (the default) so status updates record directly in each story's build plan.
- Amelia skips any story Sofia marked as needing a human step, and pauses for your go-ahead at any pre-coding approval pause or post-run pause you set with Sofia.
- `bmad-build-auto` never marks work done; it stops at `built` so human acceptance remains an explicit decision.

## Start an Unattended Run

### Option 1: Let Amelia run ready stories (recommended)

Open a fresh chat on your epic's branch and ask Amelia (`bmad-agent-dev`) to run the ready stories unattended:

```text wrap
/bmad-agent-dev Run the ready stories in this epic unattended and report back when finished or blocked.
```

Amelia checks which stories are ready, skips any story requiring a human step, respects your approval checkpoints, launches one `bmad-build-auto` worker per story in order, and hands you a concise summary of every commit, deferred finding, and blocked story when she stops.

### Option 2: Run a single story directly

To run `bmad-build-auto` yourself on one story from the ticket tree, include the word `ticket` before the story number so it links back to the tree and updates the ticket's plan:

```text wrap
/bmad-build-auto ticket 2.3
```

If you want the run to draft the plan and pause for your review before writing any code, tell it to stop after planning:

```text wrap
/bmad-build-auto ticket 2.3. Halt after planning.
```

Inspect the generated plan, and when it looks right, invoke `/bmad-build-auto ticket 2.3` again to implement and review it.

## Check Results and Handle Blocked Runs

When an unattended batch finishes, review three outputs before merging or moving to the next epic:

1. Check built stories and any follow-up review notes. Each successful story lands at status `built` with its local commit and a summary inside its plan file. By default, `bmad-build-auto` runs a `quick` self-review; if the plan flags that a follow-up review is recommended, run `bmad-code-review` on `thorough` (or run `bmad-build-auto ticket <ref>` once more for another review pass). See [Review a Change](review-a-change.md#choose-the-depth).
2. Review deferred findings with Sofia before planning the next epic. Real pre-existing issues noticed outside the current story are recorded under the plan's deferred list instead of interrupting the run, so each can become a backlog ticket or be intentionally dropped.
3. Resolve any blocked stories. A `blocked` status is a safety stop rather than a failure, usually caused by an unanswered product ambiguity (`intent gap`), failing verification checks, or a review repair loop that did not converge cleanly. Read the blocking reason in Sofia's `what's next?` summary or inside the story's plan, fix the underlying gap (for example, update the story with Sofia), and ask Amelia to clear the block and retry, or finish that story interactively with `bmad-build`.

Once you have verified the finished stories (or walked through them with `bmad-walkthrough`), tell Sofia which stories to mark done.

## Customize Unattended Behavior

By default, `bmad-build-auto` runs `quick` review inside each loop. You can ask for `thorough` review on any single invocation, or invoke `bmad-customize` and tell it to pin thorough review, adjust completion instructions, or add team-specific guardrails for `bmad-build-auto` permanently. For exact override files and settings, see [Configuration](../reference/configuration.md). For full worker contracts, exit states, and patch recovery details for external orchestrators, see [Autonomous Loop Contract](../reference/autonomous-loop-contract.md).
