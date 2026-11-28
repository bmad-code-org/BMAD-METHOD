---
title: Make a Small Change
description: 'Scenario: one clear, self-contained change handed straight to bmad-build with no planning documents.'
sidebar:
  order: 1
---

Use this route when you know what needs to change and the work is one clear, self-contained behavior with no shared decisions across multiple features. Most everyday fixes and small additions fit here and need no planning documents.

The example uses the [room booker](../start/how-bmad-works.md#the-example-app), an office meeting-room app. You want the room list to display each room's seating capacity next to its name.

![Make a Small Change: describe the change to bmad-build, answer what only you know, let it build, review and commit, then check the result. Every step is in Build and verify](/diagrams/scenario-small-change.svg)

## Steps

1. Hand the change to `bmad-build` in a fresh chat inside the repository, starting from a clean Git working tree.

   ```text wrap
   /bmad-build show each room's capacity next to its name in the room list
   ```

2. Answer only the product choices it cannot read from code, such as whether capacity should display as a plain number or alongside an icon; it inspects the repository for everything else.
3. Let it build: very small changes (roughly 100 lines or fewer) go straight to code while the plan file records the run, whereas larger changes pause with a written plan for your approval before editing code.
4. Review what it reports once it writes the change and its tests, reviews its own diff, commits locally, and offers to open a pull request if the repository has a Git remote.
5. Verify the result yourself; because this change has no ticket on a board, there is nothing to mark done afterward.

[Build a Change](../build/build-a-change.md) walks through every step of a run. If you want to change when `bmad-build` pauses for plan approval or always require a plan, invoke `bmad-customize` and describe the rule you want; see [Customize BMad](../customize/customize-bmad.md).

## What You Have at the End

One local commit containing the change and its tests, plus a build plan file recording what was verified. No initiative, epic, or story was created because the change did not need one.

## Skip Ahead When

The edit is a typo, a renamed label, or a minor formatting adjustment. Ask your AI coding tool directly; `bmad-build` stays out of obvious, low-risk edits.

## When It Turns Out Bigger

If the change touches multiple connected features, requires shared UX or technical decisions, or raises open questions only stakeholders can settle, stop before writing code. Switch to [Build from a Conversation](./build-from-a-conversation.md) or [Plan the Work](../plan/plan-the-work.md).

New to BMad? Follow [Build Your First Change](../start/build-your-first-change.md) to run your first build in an empty project.
