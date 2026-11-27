---
title: 'Amelia, Developer'
description: 'Use Amelia (bmad-agent-dev) to build changes, run planned stories unattended, review diffs, walk through code, generate tests, and wrap up finished epics.'
sidebar:
  order: 7
---

Amelia (`bmad-agent-dev`) helps you get working software built, reviewed, tested, and verified. From a solo builder shipping a quick feature to a team working through a planned epic, she matches the right level of planning and review to the risk of the change.

Call Amelia with `/bmad-agent-dev` in tools that support slash commands (such as Claude Code), or speak to her in plain English in any tool. Ask `"Amelia, what can you help me with?"` anytime.

## What Amelia Helps You Do

### Build a change interactively

Describe a change in plain language, paste an issue link, or point to the next story on [Sofia's](sofia-po.md) plan. Amelia investigates the codebase, reads any attached UX designs or technical contracts, confirms a clear plan before editing when risk warrants it, writes the code and tests, runs an independent self-review, fixes issues that review finds, and prepares a clean local commit.

### Run planned work unattended

For stories that are already well specified and need no back-and-forth, Amelia can route work to unattended execution (`bmad-build-auto`) for loops or background runners, stopping cleanly if a human decision is missing.

### Review code independently

Point Amelia at any pull request, branch, commit, or finished story for a multi-lens code review that checks real code paths for bugs, edge cases, and missing tests without drowning you in noisy style nitpicks.

### Walk through code step by step

When you inherit unfamiliar code or need to review a large pull request, ask Amelia for a guided walkthrough that explains how a commit, pull request, or directory works block by block at your pace.

### Generate API and end-to-end tests

Once a feature works, Amelia can add API and end-to-end test coverage that fits your repository's existing test framework.

### Wrap up a finished epic

When every story in an epic (a multi-story capability tracked by Sofia) is built, Amelia runs a retrospective against the original goals and the evidence left behind in the code and build plans before you close the epic with [Sofia](sofia-po.md).

:::note[Ways to start]
```text
/bmad-agent-dev I want to add dark-mode persistence to user settings. Should I build this directly or plan it first?
```

```text
Hey Amelia, review the changes on my current branch for edge cases and missing tests.
```
:::

## Working with the Rest of the Team

- Obvious typos or one-line edits you review yourself need no skill at all.
- If you already know the exact development skill you want (such as `/bmad-build`), run it in a fresh chat; starting a fresh chat keeps the conversation focused on just that story instead of carrying older context from unrelated tasks.
- For bigger multi-part projects, ask [Sofia](sofia-po.md) to break the work into ordered stories first so Amelia builds one focused piece at a time.

See [Build a Change](../build/build-a-change.md), [Review a Change](../build/review-a-change.md), [Walk Through a Change](../build/walk-through-a-change.md), [Test Completed Work](../build/test-completed-work.md), [Autonomous Development Loops](../build/autonomous-development-loops.md), and [Finish an Epic](../learn/finish-an-epic.md).

## Tailoring Amelia

To adjust Amelia's workflow, change how deep code reviews run, configure test expectations, or customize build preferences, invoke `bmad-customize` and describe what you want changed for Amelia (`bmad-agent-dev`), `bmad-build`, or `bmad-code-review`.
