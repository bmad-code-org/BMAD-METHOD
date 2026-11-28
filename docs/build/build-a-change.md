---
title: 'Build a Change'
description: Use bmad-build to turn a request, issue, spec, or ticket into planned, implemented, and reviewed code.
sidebar:
  order: 2
---

The core implementation skill is `bmad-build`. Give it any expression of what you want (a sentence, an issue link, a spec, or a ticket from your tree) and it investigates your codebase and planning documents, plans the change, implements it, reviews the result, and fixes issues it finds.

## Size the Work

Use the smallest amount of process that safely fits the change. A typical session handles one goal: up to roughly 500 lines of code added or changed (not counting tests) across a small handful of files. If your work fits, hand it to `bmad-build`. If it spans multiple goals or capabilities, plan it first with Sofia or John; see [How BMad Works](../start/how-bmad-works.md). If you are unsure, ask `bmad` or [Amelia](../agents/amelia-dev.md).

For a tiny edit you are comfortable reviewing yourself (like fixing a typo), skip `bmad-build` and ask your coding agent directly. When a mistake could break production or waste review time, `bmad-build` pays for itself.

## Run `bmad-build`

![The bmad-build run](/diagrams/build-run.svg)

### 1. Start a Fresh Chat

Open a **fresh chat** in your AI coding tool. Reusing a long conversation from another task mixes unrelated context and degrades planning and review quality.

### 2. Give It Your Intent

Describe what you want before, with, or after the command. It does not need to be polished: a rough paragraph, a GitHub issue link, a planning file, or a ticket number all work.

```text
/bmad-build Fix the login validation bug that allows empty passwords.
```

```text
/bmad-build Fix https://github.com/org/repo/issues/42.
```

```text
/bmad-build Implement the intent in _bmad-output/initiative-checkout/intent-checkout/intent-checkout.md.
```

```text
I think the problem is in the auth middleware, it's not checking token expiry.
Let me look at it... yeah, src/auth/middleware.ts line 47 skips
the exp check entirely. /bmad-build
```

```text
/bmad-build 2.3
```

Name a ticket by its reference (`2.3` for story 3 of epic 2), its file path, or its title. If your current Git branch name already contains a ticket reference (such as `story/2.3-digest-delivery`), `bmad-build` detects that ticket automatically.

```text
/bmad-build
```

With no arguments and no branch match, `bmad-build` first checks for any unfinished build plans to resume, then picks the next ready story from your active initiative, or asks what you want to build if nothing is queued.

### 3. Clarify Target and Investigate Silently

Step 1 resolves what you are building (your request, branch ticket, or next ready story), checks that your Git working tree is clean and on a sensible branch, and checks whether your request actually packs multiple independent goals. If it detects multiple goals, it offers to split them and log the extras to `deferred-work.md` so the session stays focused. It does **not** run an upfront interview in step 1.

Step 2 then investigates your repository silently, using subagents for deep searches when available so your main chat stays lean. When building from a ticket, it reads the story file, the epic, any linked UX designs (`DESIGN.md`, `EXPERIENCE.md`, mockups), architecture contracts, and plans from earlier prerequisite stories in the same epic. Whenever something looks ambiguous, it searches your docs and code before bothering you with a question.

During investigation, it also scores the change's `risk` (`low`, `medium`, or `high`, based on business impact if wrong) and captures a one-line success signal (what proves the change worked) for standalone requests without a ticket.

### 4. Auto-Route and Approve the Plan

After investigation, `bmad-build` picks the lightest safe route based on estimated change size (unless you tell it to use one route explicitly, or pin a default via `bmad-customize`):

| Route | When it runs and what it does |
| --- | --- |
| One-shot (100 lines or fewer, up to 5 simple files) | Writes a compact plan, moves straight into implementation in the same session, and runs review afterward without stopping for a separate plan-approval gate |
| Full (larger than 100 lines, or more than 5 non-mechanical files) | Writes a full written plan with a code map, design notes, and acceptance criteria |

On the full route, if investigation still left genuine intent gaps that only a human can answer, `bmad-build` presents them as numbered questions with concrete options and waits for your answers before moving on.

Once open questions are settled, you hit Checkpoint 1. `bmad-build` shows a summary with the risk score and a clickable link to the plan file, and offers three choices:

- Choose "Approve and continue" to lock the intent and start implementation in this session.
- Choose "Approve and stop" to save the approved plan at `ready-for-dev` so you can run implementation in a fresh chat with clean context.
- Choose "Review plan" to have a separate reviewer check the plan and discuss revisions with you before approving.

You can also open the plan file in your editor, tweak details directly, or ask for changes right in chat before approving. Fixing a weak plan takes seconds; fixing bad code takes much longer.

### 5. Implementation and Self-Review

Once approved (or directly on the one-shot route), `bmad-build` implements the change, runs verification checks and tests, and launches independent review subagents on the diff. On the full route, implementation runs in a clean subagent that reads only the plan and its linked UX or architecture files.

Review triages findings instead of dumping raw noise:

- Issues caused by this change get fixed right away.
- Real pre-existing issues unrelated to your goal get logged to `deferred-work.md`.
- If review uncovers a flaw in the plan or a missing requirement, `bmad-build` loops back to fix the plan or clarify intent rather than slapping band-aids onto the diff.

When everything passes, `bmad-build` creates a clean local commit with a conventional commit message and sets the plan status to `built`.

For a standalone review of a PR, another branch, or an extra pass, see [Review a Change](review-a-change.md).

### 6. Inspect the Result

When the run finishes, `bmad-build` summarizes what changed, how it was verified, and what to do next: open a pull request, run a guided [Walk Through a Change](walk-through-a-change.md), or start the next task. If anything looks off, tell the agent what to adjust in the same chat before pushing. Once satisfied, push the branch, open your PR, and tell Sofia to mark the ticket done.

:::caution[If Something Breaks]
If a commit causes unexpected problems, use `git revert HEAD` to undo it cleanly, then start a fresh chat and run `bmad-build` again with a revised approach.
:::

## What You Get

- Modified source files implementing the change
- Passing automated tests (when your project has a test suite)
- A clean local Git commit ready to push
- A build plan recording the run (stored beside the epic's `tickets.toml` for a ticket, or as `plan-<slug>.md` in your active initiative or output folder), left at status `built` until you mark the ticket done

To add API or end-to-end tests after implementation, see [Test Completed Work](test-completed-work.md).

## Deferred Work

Each run stays focused on a single goal. When your original prompt bundled multiple independent goals, or when self-review spots pre-existing bugs outside your change, `bmad-build` appends them to `deferred-work.md` in your active initiative folder (or output folder if no initiative is active). Check that file after a run; each entry can be turned into a ticket with Sofia or fed into a fresh `bmad-build` run later.

## When to Plan First

Step up to Sofia, John, Sally, or Winston before running `bmad-build` when:

- The work spans multiple systems or needs coordinated changes across many files
- Scope is still fuzzy and stakeholders need to align on requirements first
- The team needs shared UX specs or technical contracts written down before coding
- Clarifying the request keeps uncovering contradictions one session cannot resolve

Bigger features become an ordered chain of single-session builds. Your ticket tree tracks the shared goal and build order, each story's plan records its decisions and status, and the epic retrospective verifies the combined result. Use `bmad-build` interactively for early, risky, or pattern-setting stories; once patterns are settled, `bmad-build-auto` can run well-specified stories unattended (see [Autonomous Development Loops](./autonomous-development-loops.md)).

## Implementation Skills

| Skill | Purpose | Produces |
| --- | --- | --- |
| `bmad-build` | Plan, implement, and review one change or story interactively (this page) | Plan, code, tests, local commit |
| `bmad-build-auto` | Run one well-specified ticket unattended ([Autonomous Development Loops](./autonomous-development-loops.md)) | Plan, code, local commit, terminal status |
| `bmad-code-review` | Review any diff, PR, or branch with independent lenses ([Review a Change](./review-a-change.md)) | Triaged findings and optional fixes |
| `bmad-agent-po` | Replan after a mid-flight scope change ([Learn and Adjust](../learn/learn-and-adjust.md#a-change-mid-flight)) | Updated requirements and stories |
| `bmad-retrospective` | Judge a finished epic against its diff, plans, and criteria ([Finish an Epic](../learn/finish-an-epic.md)) | Retro report, action items, ADRs, verdict |

## Why Does This Take Longer Than Quick Coding?

Coding directly in plan mode can feel faster for the first ten minutes, because it skips independent review, triage, and automatic fixing. You then pay that time back reviewing unvetted code yourself and sorting real bugs from noise.

Human attention is the tightest bottleneck in AI-assisted software development. For a throwaway prototype or trivial edit, skip `bmad-build` or ask for the one-shot route (and skip review if you prefer). For production code you care about keeping clean, let the full loop run and save your review time for product decisions and architecture.
