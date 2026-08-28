---
title: 'Review a Change'
description: Use bmad-code-review for a standalone agentic review of a PR, someone else's change, an extra pass, or a review bot.
sidebar:
  order: 2
---

`bmad-code-review` reviews a code change with independent reviewers in
parallel, then triages the findings. See
[how a run works](#run-bmad-code-review).

`bmad-build` already reviewed its own change during implementation. Use
this skill when the review is not part of that run.

## When to Use It

Use `bmad-code-review` for a standalone agentic review:

- **Someone else's change** — a branch or commit you did not just
  implement
- **A pull request** — including one that never went through `bmad-build`
- **An extra pass** — another review after `bmad-build` already reviewed
  the implementation
- **A review bot** — this skill as the prompt behind an automated
  review. The run is still attended: it confirms the target and presents
  findings to a human.

Implementation-time review stays on [Build a Change](build-a-change.md).
`bmad-build` reviews the change it just made, inside that same run.

Invoke it by saying "run code review" or "review this code."

## Run `bmad-code-review`

Start a fresh chat and name the skill. Pass a PR, commit, branch, spec,
or the current git state. You can describe the target before, with, or
after the command.

```text
run code review
```

```text
/bmad-code-review Review https://github.com/org/repo/pull/42
```

The skill writes a unified diff to a file, confirms the target and spec
context with you, then launches the reviewers. This works best on a
platform that can spawn subagents, or at least call another model from
the command line and wait for a result.

## What a Run Does

Active layers review the same diff independently and in parallel. Once
every layer has reported, triage judges each finding on its own:

- **Verify** the claimed consequence at the named location, reading past
  the diff hunk far enough to tell whether that consequence actually
  occurs
- **Assign severity** from the verified consequence (`low`, `medium`,
  `high`)
- **Dismiss** noise, refuted claims, and unsubstantiated claims, with a
  recorded reason — never silently
- **Route** survivors to **patch**, **defer**, or **decision needed**

Patch is an unambiguous code fix. Defer is a real pre-existing issue that
is not this change. Decision needed is an ambiguous choice that requires
you. Without a spec, decision needed is not used — those findings go to
patch or defer.

You get a findings summary. Without a spec, that listing stays in the
chat. You choose whether to apply patches.

## Why Pay for Triage

Reviewer layers and triage cost tokens and minutes. A defect that
escapes costs a report, a reproduction, a context switch, a fix, and a
re-review — orders of magnitude more.

Without triage you pay for every note a layer emitted, including noise.
Triage is what makes you pay for verified findings instead.

## Customize the Layers

Fewer layers is cheaper and catches less. You choose the price for your
situation.

Override `[[workflow.review_layers]]` in
`_bmad/custom/bmad-code-review.toml`. The skill ships four layers:
`blind-hunter`, `edge-case-hunter`, `verification-gap`, and
`acceptance-auditor`. Empty `instruction` on an existing `id` disables
that layer. A `when` field gates a layer. A new `id` appends.
`instruction` may be bash.

```toml
# _bmad/custom/bmad-code-review.toml
[[workflow.review_layers]]
id = "blind-hunter"
instruction = ""
[[workflow.review_layers]]
id = "acceptance-auditor"
when = 'Only when {review_mode} = "full".'
[[workflow.review_layers]]
id = "security-bot"
name = "Security bot"
instruction = """
Run the team reviewer via bash on {diff_file} and return its findings as a Markdown list.
"""
```

For how overrides merge, see [Customize BMad](../how-to/customize-bmad.md).

## What It Is Not

`bmad-code-review` is not a human walkthrough — that is
[Walk Through a Change](walk-through-a-change.md). It is not generated
test coverage — that is [Test Completed Work](test-completed-work.md).
Party Mode's Code Review Crew is a debate among lenses, not a triaged
review; see [Party Mode](../explanation/party-mode.md#the-code-review-crew).
