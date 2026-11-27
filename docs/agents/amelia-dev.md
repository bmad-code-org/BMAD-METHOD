---
title: 'Amelia, Developer'
description: 'Use Amelia (bmad-agent-dev) to build changes, run planned work unattended, review diffs, walk through code, generate tests, and wrap up milestones.'
sidebar:
  order: 6
---

Amelia (`bmad-agent-dev`) helps you get working software built, reviewed, tested, and verified. Whether you are a solo builder shipping a quick feature or a team running through a planned milestone, she helps match the right level of planning and review to the risk of the change.

Tell Amelia what you want to build or check, or ask "Amelia, what can you help me with?" anytime.

## What Amelia Helps You Do

### Build a change interactively

Describe a change in plain language, paste an issue link, or point to the next task on [Sofia's](sofia-po.md) plan. Amelia investigates the codebase, reads any attached UX designs or technical contracts, confirms a clear plan before editing when risk warrants it, writes the code and tests, runs an independent self-review, fixes issues it finds, and prepares a clean local commit.

### Run planned work unattended

For tasks that are already well specified and need no back-and-forth, Amelia can route work to unattended execution (`bmad-build-auto`) for loops or background runners, stopping cleanly if a human decision is missing.

### Review code independently

Point Amelia at any pull request, branch, commit, or finished task for a multi-lens code review that checks real code paths for bugs, edge cases, and missing tests without drowning you in noisy style nitpicks.

### Walk through code step by step

Inherited unfamiliar code or reviewing a big PR? Ask Amelia for a guided walkthrough that explains how a commit, pull request, or directory works block by block at your pace.

### Generate API and end-to-end tests

Once a feature works, Amelia can add API and end-to-end test coverage that fits your repository's existing test framework.

### Wrap up a finished milestone

When all tasks in a milestone are done, Amelia runs a retrospective against the original goals and evidence left behind before you close the milestone with [Sofia](sofia-po.md).

:::note[Ways to start]
```text
/bmad-agent-dev I want to add dark-mode persistence to user settings. Should I build this directly or plan it first?
```

```text
/bmad-agent-dev Review the changes on my current branch for edge cases and missing tests.
```
:::

## Working with the Rest of the Team

- **Tiny edits:** obvious typos or one-line changes you review yourself need no skill at all.
- **Start fresh for big builds:** if you already know the exact skill you want (such as `/bmad-build`), starting it in a fresh chat keeps context clean.
- **Bigger multi-part projects:** ask [Sofia](sofia-po.md) to break large work down first so Amelia builds one focused piece at a time.

See [Build a Change](../build/build-a-change.md), [Review a Change](../build/review-a-change.md), [Walk Through a Change](../build/walk-through-a-change.md), and [Autonomous Development Loops](../build/autonomous-development-loops.md).

## Tailoring Amelia

To adjust how deep reviews run, configure test expectations, or customize build preferences, invoke `bmad-customize` and describe what you want changed.
