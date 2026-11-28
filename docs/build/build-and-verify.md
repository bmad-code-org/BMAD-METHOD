---
title: Build and Verify
description: 'The Build and verify stage: work with Amelia or individual build skills to turn planned stories and direct requests into reviewed, committed code.'
sidebar:
  order: 1
---

Use this page to see how a planned story, or a direct request with no ticket, becomes reviewed, committed code. Every change follows the same loop, one focused coding session at a time.

| | Build and verify |
| --- | --- |
| **You start with** | A change one session can finish, or a ready story from your ticket tree |
| **You produce** | Updated code and tests, a local Git commit, and a build plan recording the run and status |
| **It is done when** | You check the result and mark the story done; the build itself stops at `built` |
| **Skip it when** | The edit is tiny and low risk: ask your AI coding tool directly |
| **What comes next** | The next ready story, or [Learn and Adjust](../learn/learn-and-adjust.md) when an epic finishes |

## Start with Amelia (or Pick a Skill Directly)

You do not need to memorize separate build commands. Start a chat with [Amelia, Developer](../agents/amelia-dev.md) (`bmad-agent-dev`) and tell her in plain English what you want to build, review, test, or walk through. She picks the right skill, hands it the right files, and explains what comes next.

If you already know the exact step you want, invoke its skill directly in a fresh chat:

| You want | Skill | Page |
| --- | --- | --- |
| Build a story or direct change interactively | `bmad-build` | [Build a Change](./build-a-change.md) |
| Run an independent multi-lens review of a story, PR, or branch | `bmad-code-review` | [Review a Change](./review-a-change.md) |
| Understand a change or unfamiliar code block by block, or see it run | `bmad-walkthrough` | [Walk Through a Change](./walk-through-a-change.md) |
| Generate API and end-to-end tests for finished features | `bmad-qa-generate-e2e-tests` | [Test Completed Work](./test-completed-work.md) |
| Run ready stories unattended | `bmad-build-auto` | [Autonomous Development Loops](./autonomous-development-loops.md) |

## Build One Story at a Time

Start a fresh chat with a clean Git working tree (meaning no uncommitted edits left over from earlier work, so the new commit only holds this story's changes). Then name the story you want to build, such as the first story of epic 2:

```text wrap
/bmad-build 2.1
```

When you name a story directly, `bmad-build` builds it even if an earlier story has not finished yet. Ask Sofia `what's next?` first to see what is ready, or run `/bmad-build` with no arguments so it offers unfinished work first and then picks the next ready story automatically. You can also describe any change without a ticket. See [Build a Change](./build-a-change.md) for how planning, routing, and review work inside a run.

As a story progresses, its build plan records its status so you can pause and resume in a fresh chat anytime:

| Status | Meaning |
| --- | --- |
| `draft` | Plan drafted, waiting on open questions or approval |
| `ready-for-dev` | Plan approved and ready for implementation in this or a fresh chat |
| `in-progress` | Code and tests are being written |
| `in-review` | Self-review and triage are underway |
| `built` | Implementation, self-review, and local commit finished; waiting for your acceptance |

`bmad-build` runs a quick self-review by default. For production changes, ask for a thorough review inside the build, run `bmad-code-review` in a fresh chat, or use your pull request review automation. When an epic finishes, `bmad-retrospective` reviews the entire epic's combined diff.

Once you have verified the result, tell Sofia to mark the story done:

```text wrap
/bmad-agent-po mark story 2.1 done
```

A build never marks its own story done; acceptance stays your call. A story at `built` already unblocks dependent stories so work keeps moving while you review. Keep the build plan files in your store because they hold each story's status and the evidence the epic retrospective reads later.

:::note[Example: the room booker]
In the [room booker](../start/how-bmad-works.md#the-example-app), an office meeting-room app:

**You:**

```text wrap
/bmad-build 1.2
```

**`bmad-build`:** Investigates the codebase for Story 1.2 (Check in at the door) and drafts the plan. One open question the epic did not specify: may anyone invited to the meeting check in, or only the organizer?

**You:** Anyone invited to the meeting.

**`bmad-build`:** Updated the plan (medium risk). Approve and continue, approve and stop for a fresh chat, or review the plan first?

**You:** Approve and continue.

**`bmad-build`:** Implemented, reviewed, and committed locally. Status is now `built`.

After testing on a tablet, you tell Sofia:

```text wrap
/bmad-agent-po mark story 1.2 done
```
:::

## Branches and Pull Requests

`bmad-build` commits locally on your current Git branch and never pushes without your permission, so it fits normal team branching habits cleanly:

| Strategy | How it works |
| --- | --- |
| One branch per epic (most common) | Create a branch for the epic (`epic/door-check-in`), build its stories in order on that branch, and open one pull request per epic (or rebase/cherry-pick) after running the retrospective |
| One branch and PR per story | For larger stories or teams that prefer small PRs, branch per story (`story/1.2-door-check-in`) and open a PR right after each `bmad-build` finishes; when your branch name includes the story number, `bmad-build` detects the ticket automatically |
| Parallel epics with worktrees | When two engineers or two agents work on independent epics at the same time, use separate Git worktrees (one branch per worktree) so each session keeps a clean working tree without colliding |

Once you are happy with a finished build, ask your agent to push the branch and open a pull request, or run `bmad-walkthrough` first to inspect the diff step by step.

## Run Stories Unattended

Build the early, foundational stories interactively with `bmad-build` so you set the code patterns carefully. Once those patterns are settled and the remaining stories have clear acceptance criteria, [Amelia](../agents/amelia-dev.md) (`bmad-agent-dev`) can run ready stories unattended using `bmad-build-auto`, one story per run.

Ask Sofia to review the story set before starting an unattended loop, because nobody answers questions mid-run. Any story marked as needing a human step is skipped automatically, and any pre-coding or post-run checkpoints you set with Sofia pause the loop for your approval. If a run hits an ambiguity or failing check it cannot resolve safely, it stops cleanly, marks the story blocked with the exact reason, and leaves your repository clean so you can fix the gap and resume.

For a practical walkthrough of running unattended loops with Amelia and inspecting their output, see [Autonomous Development Loops](./autonomous-development-loops.md).
