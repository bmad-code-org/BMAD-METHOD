---
title: 'Walk Through a Change'
description: Use bmad-walkthrough to review a commit, PR, file, or directory interactively one block at a time.
sidebar:
  order: 4
---

`bmad-walkthrough` is a guided human code review. It reads a change, organizes it into a readable narrative grouped by concern, and walks you through one block at a time at your own pace. You can pause on any block to ask questions, edit code, run checks, or see the feature live, and a block finishes only when you say so.

:::note[Human review]
This skill helps a human understand and verify code. Automated agentic review happens during [`bmad-build`](build-a-change.md) or via [`bmad-code-review`](review-a-change.md).
:::

## When to Use It

Invoke `/bmad-walkthrough` (or ask [Amelia](../agents/amelia-dev.md) for a walkthrough) and point it at a commit, pull request, branch, file, or directory. Common moments to use it:

- After [`bmad-build`](build-a-change.md) finishes, when you want to verify how the code works before opening a PR
- Reviewing a pull request that spans more than a handful of files
- Onboarding onto unfamiliar code or a branch someone else wrote

## How It Runs

1. During orientation, it reads the target alongside any linked build plan, spec, PR description, and commit messages so it explains why the change exists before moving into code.
2. It writes a structured review narrative grouped by concern (intent, broad strokes, logical slices, then peripheral edits) rather than dumping files alphabetically, placing an append-only review log beside it inside `walkthrough-<slug>/` in your active initiative folder (or your output folder when no initiative is active).
3. It presents one interactive block at a time with a clickable link into the narrative and suggests one to three helpful moves for that block, waiting until you are ready to move on.

## Walkthrough Moves

On any block, you can ask a free-form question, request edits, or pick one of seven built-in moves:

| Move | What it does |
| --- | --- |
| **Second opinion** | Sends a specific question to a fresh subagent with no prior chat bias, useful when you want an unanchored check on a tricky block |
| **Formal review** | Runs a structured code review skill (preferring `bmad-code-review` when installed) on the riskiest block |
| **Test** | Identifies concrete checks for the block, runs automated tests it can execute, and guides you through manual checks while logging what was verified |
| **Drive** | Starts the application and tells you which actions or buttons to try yourself when you want to feel the behavior firsthand |
| **Demo** | Exercises the change on its own and shows you what happened via screenshots or transcripts saved in the walkthrough folder when you prefer to watch rather than drive |
| **Draw** | Renders a class, sequence, or state diagram (with plain-English labels) showing only what the linked code actually does and highlighting what changed |
| **Wrap-up** | Closes the walkthrough session and records your final review summary in the walkthrough log |

Your team can add, replace, or remove walkthrough moves anytime by invoking `bmad-customize` and telling it how you want `bmad-walkthrough` to behave. See [Customize BMad](../customize/customize-bmad.md).

## What It Is Not

`bmad-walkthrough` does not replace [`bmad-code-review`](review-a-change.md) or the self-review inside `bmad-build`. It does not score finding severity or issue a pass/fail verdict; it gives you clear understanding and hands-on control over the code.
