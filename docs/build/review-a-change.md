---
title: 'Review a Change'
description: Use bmad-code-review for a standalone multi-lens review of a pull request, branch, commit, or built story.
sidebar:
  order: 3
---

Ten seconds of your attention costs more than ten minutes of model compute, and a bug that reaches production costs far more than one caught during development. Code an agent just wrote can and should be reviewed and cleaned up by independent reviewers before any human inspects it.

If you came from [Build a Change](build-a-change.md), you have already seen this in action because `bmad-build` includes a built-in review and triage stage. If you suspect more issues remain after a build, hand `bmad-build` that story's plan (still at `status: built`) to jump straight into another review and triage pass. Once you mark the ticket done, `bmad-build` treats its plan as historical context rather than active review work. Stop running extra passes once findings narrow to low-value exotic edge cases. If a third review pass still uncovers serious problems, the real issue usually sits upstream in weak design or unclear requirements; fix the root cause instead of looping review again.

To review anything outside a single `bmad-build` run (a pull request, another developer's branch, a commit range, or a file), use `bmad-code-review`.

## Run `bmad-code-review`

Start a fresh chat and invoke the skill with whatever target you want checked: a pull request URL, commit, branch, file, or your current uncommitted changes.

If you have a spec, ticket, PR description, or brief explanation of what the change is supposed to accomplish, pass that along too. Review quality depends heavily on knowing the intent, because without it reviewers can only check the diff against itself.

```text
run code review
```

```text
/bmad-code-review Review https://github.com/org/repo/pull/42
```

With no target named, `bmad-code-review` scans your ticket tree for stories awaiting review and lets you pick one. When you pick a ticket (or pass a build plan directly), it diffs every commit since that build started and uses the plan as the intent.

Without a plan, the skill runs in **no-plan mode**. Reviewers still catch real bugs by checking the diff and commit messages, while triage flags any ambiguous fix as needing your decision (listing options and its recommendation) rather than guessing what you meant. Automated PR review bots often land in no-plan mode unless configured carefully; pass the PR description and the build plan whenever available so the intent-alignment check has real claims to verify.

Before launching reviewers, the skill writes a unified diff file and confirms the target and intent context with you. This works best in a tool that supports parallel subagents (or calling another model via CLI).

## What a Run Does

All active **lenses** review the same diff independently and in parallel. Once every lens reports back, triage inspects each finding on its own merits:

- Verify the claimed failure at the exact location, reading surrounding code outside the diff hunk to confirm the bug actually happens.
- Assign severity (`low`, `medium`, or `high`) based on the verified impact.
- Dismiss noise, false positives, and unsupported claims with an explicit recorded reason rather than silently dropping them.
- Route confirmed findings to `patch`, `defer`, or `decision needed`.

A **patch** finding has one clear fix. A **defer** finding is a real pre-existing bug that was already in the codebase before this change; bugs introduced by the current change are never deferred. A **decision needed** finding has multiple reasonable fixes depending on your intent, so triage lays out the options and recommends one for your call.

By default, `bmad-code-review` runs interactively so you can answer decision questions and choose how to apply patches. When nobody is present (such as in CI or a PR bot), tell it not to ask questions when invoking it, or use `bmad-customize` to make it non-interactive permanently; it then applies clear patches automatically and puts open decisions at the top of the report.

Every run presents a triaged summary in chat. When reviewing with a build plan, findings are appended under a dated `## Code Review` block in that plan. In both plan and no-plan runs, every `defer` finding is appended to `deferred-work.md` in your active initiative folder (or output folder if no initiative is active) so pre-existing bugs never vanish. `bmad-code-review` never changes a ticket's status; marking a story done remains your decision.

## Choose the Depth

Two review depths come built in: `quick` and `thorough`.

| Depth | What it runs |
| --- | --- |
| `quick` (default in `bmad-build` and `bmad-build-auto`) | Runs a single context-free reviewer against the plan, project rules, and diff; faster and significantly cheaper |
| `thorough` (default in `bmad-code-review`) | Runs four independent lenses in parallel (Blind Hunter, Edge Case Hunter, Verification Gap Reviewer, and Intent Alignment Auditor); slower and uses more tokens, tuned to catch subtle bugs and missing coverage |

Quick review fits small changes and early prototypes. Thorough review is worth running on any code heading to production. A practical team workflow uses quick review during rapid local iteration (bumping to thorough on high-risk stories) and runs `bmad-code-review` on thorough before merging every PR, such as in a pull request review bot.

Say `thorough` or `quick` in your prompt to override the depth for one run. To change the default permanently for any skill, invoke `bmad-customize` and tell it what default you want.

## Customize the Lenses

You can tailor the review lenses themselves: add team-specific reviewers (such as security or accessibility lenses), replace or disable default lenses, or route specific lenses to a different model. Invoke `bmad-customize` and ask what lens customizations are available.

## Automatic Reviews

To wire `bmad-code-review` into an automated pipeline (such as reviewing every pull request), configure two behaviors:

1. Set non-interactive mode by telling the skill not to ask questions in the prompt, or by using `bmad-customize` to make it non-interactive permanently in that environment.
2. Choose between patching and handoff. By default, the review builds, runs tests, and applies clear fixes; if your review bot should stay read-only and never edit code, include `no-code` in the invocation (or configure handoff mode via `bmad-customize`) so it outputs a clean Markdown handoff block that a coding agent or developer can fix from directly.

You can also ask `bmad-customize` to change what goes into the handoff block, how it is formatted, and where it gets delivered (for example, posting directly as a PR comment).

## Why Does Review Take a Long Time?

Three common causes explain slow review runs:

- [Exhaustive on purpose](#exhaustive-on-purpose)
- [Too many rules, or huge files](#too-many-rules-or-huge-files)
- [Your platform](#your-platform)

### Exhaustive on purpose

Thorough review is designed around the assumption that a production bug costs far more than extra model compute. You can lower the depth (see [Choose the Depth](#choose-the-depth)), skip review on throwaway work, or run thorough reviews asynchronously on PRs. Letting teammates review unvetted AI-generated code, or shipping it straight to production, burns far more time than letting the lenses run.

Try it on a few real diffs yourself: run thorough review, inspect the top one or two findings, and decide whether the token spend beat shipping those defects.

### Too many rules, or huge files

Bloated instruction files (`AGENTS.md` and similar repo rules loaded on every run) or massive source files eat context fast, forcing reviewers to spend extra turns reading around them. Keep `AGENTS.md` lean with `bmad-project-context` and keep large planning specs sharded with `bmad-shard-pro`.

### Your platform

Some coding tools cannot run subagents in parallel, or runtime updates temporarily change how subagents behave. When lenses fall back to running sequentially or inside the main chat session, reviews get both slower and weaker. If a review that normally takes a few minutes suddenly drags or misses obvious bugs, inspect the session to confirm subagents are still launching cleanly.

## Why Use This Alongside Built-In `/code-review` Commands?

Many built-in review commands run a single generic pass with no triage, producing long lists of noisy suggestions that still force you to spend attention sorting signal from noise. Few verify claimed bugs against surrounding code or fix verified issues automatically.

If your platform's built-in review command already catches valuable issues on your codebase, test both on a few real diffs. If the built-in command finds bugs BMad's default lenses miss without adding noise, use `bmad-customize` to add it as an extra lens alongside the rest.
