---
title: 'Build a Change'
description: Turn direct intent, an issue, a spec, or a story into an attended implementation with the Build workflow.
sidebar:
  order: 1
---

`bmad-build` is the attentive Build workflow for one coherent, session-sized
unit of software work. It accepts anything from free-form intent or an issue to
a fully planned story, then clarifies, plans, implements, and reviews that unit
with as few human checkpoints as safety allows.

Session-sized means that one implementation session can reasonably understand,
implement, review, and finish the intent. It is a scope boundary, not a time
estimate. A small change may require more planning because of its risk,
ambiguity, or architectural reach.

## Size the Work

Use the smallest amount of BMad that safely fits the change.

| Path               | Use it when                                                                   | Start with                                         |
| ------------------ | ----------------------------------------------------------------------------- | -------------------------------------------------- |
| Trivial edit       | The edit is obvious, low-risk, and does not benefit from structured review    | Make the edit directly                             |
| One-session work   | One coherent intent fits an implementation session                            | `bmad-build`, as described on this page            |
| Spec-backed epic   | One coherent outcome needs several implementation sessions                    | `bmad-spec`, then Story Breakdown, then Build per story |
| Project-sized work | The work spans several epics or needs roughly 20 or more implementation sessions | The [full BMad flow](../reference/workflow-map.md) |

If a tiny change would benefit from explicit planning and review, use
`bmad-build` even though you could edit it directly. If the work no longer fits
one session, see [Choose a Development Path](../how-to/choose-a-development-path.md)
for the epic-sized and project-sized paths.

## Where Build Fits

Every path converges on the same workflow. Upstream planning determines the
context Build receives; it does not require a different implementation agent.

| Starting point    | What Build receives                             | What preserves the larger intent                              |
| ----------------- | ----------------------------------------------- | ------------------------------------------------------------- |
| Direct change     | A request, issue, or intent file                | The Build implementation record                               |
| Spec-backed epic  | One entry from the spec folder's `stories.yaml` | `SPEC.md`, its companions, and prior story records            |
| Full BMad project | One selected story                              | PRD, UX, architecture, epics, sprint tracking, and prior work |

When a planned story enters Build, the story remains the product and acceptance
context. Build creates an implementation record for the current run so
decisions, completion state, and review findings remain traceable without
replacing the story.

![Build workflow diagram](/diagrams/build-diagram.png)

## Run Build

:::note[Prerequisites]

- BMad Method installed (`npx bmad-method install`)
- An AI-powered IDE (Claude Code, Cursor, or similar)
  :::

### 1. Start a Fresh Chat

Open a **fresh chat session** in your AI IDE. Reusing a session from a previous
workflow can cause context conflicts.

### 2. Give It Your Intent

Build accepts free-form intent — before, with, or after the invocation. Plain
text, file paths, GitHub issue URLs, bug tracker links, output from plan mode,
an existing Build spec, or a planned story — anything the LLM can resolve to a
concrete intent.

```text
/bmad-build Fix the login validation bug that allows empty passwords.
```

```text
/bmad-build Fix https://github.com/org/repo/issues/42.
```

```text
/bmad-build Implement the intent in
_bmad-output/implementation-artifacts/my-intent.md.
```

```text
I think the problem is in the auth middleware, it's not checking token expiry.
Let me look at it... yeah, src/auth/middleware.ts line 47 skips
the exp check entirely. /bmad-build
```

```text
/bmad-build
> What would you like to do?
Refactor UserService to use async/await instead of callbacks.
```

### 3. Clarify the Intent

Build starts by compressing the request with you into one coherent goal. The
input can begin as a rough expression of intent, but before Build runs on its
own it has to become small enough, clear enough, and contradiction-free enough
to execute. Build uses whatever upstream context exists and asks about only the
gaps it needs to implement safely.

This is where human judgment has the highest leverage. Answer the questions
rather than skipping them; a wrong answer here is the most expensive kind of
mistake to discover later.

### 4. Let Build Route the Work

Once the goal is clear, Build decides whether this is a true one-shot change or
whether it needs the fuller path. Small, zero-blast-radius changes go straight
to implementation. Everything else goes through planning: Build writes a short
spec and presents it for your approval so the model has a stronger boundary
before it runs longer unsupervised.

Approve the spec when it describes the right thing to build. Push back if it
does not; fixing the spec is cheaper than fixing the code.

### 5. Implementation and Review

After the routing decision, Build carries the work on its own: it implements
the change, reviews its own work with independent reviewers, patches issues,
and commits locally. This works best on a platform that can spawn subagents, or
at least invoke another LLM from the command line and wait for a result.

Review is triage, not a bug list. Findings that belong to the current change
are fixed. Findings that are incidental are deferred rather than forced on you
immediately. Review findings also tell Build where a failure entered the
system: if the code is wrong because the spec was weak, or the spec is wrong
because the intent was wrong, Build goes back to that layer and regenerates
from there instead of patching the diff. Only truly local problems get patched
locally.

### 6. Review the Result

When Build is done, it shows you the completed change and its review spec.
This is the primary checkpoint.

- Skim the diff to confirm the change matches your intent
- If something looks off, tell the agent what to fix — it can iterate in the
  same session

Once satisfied, push the commit. Build will offer to push and create a PR for
you.

:::caution[If Something Breaks]
If a pushed change causes unexpected issues, use `git revert HEAD` to undo the
last commit cleanly. Then start a fresh chat and run Build again to try a
different approach.
:::

## What You Get

- Modified source files with the change applied
- Passing tests (if your project has a test suite)
- A ready-to-push commit with a conventional commit message
- An implementation record for the run, kept beside the parent spec or story
  when there is one

## Deferred Work

Build keeps each run focused on a single goal. If your request contains
multiple independent goals, or if the review surfaces pre-existing issues
unrelated to your change, Build defers them to `deferred-work.md` in your
implementation artifacts directory rather than trying to tackle everything at
once.

Check this file after a run — it is your backlog of things to come back to.
Each deferred item can be fed into a fresh Build run later.

## When to Return to Planning

Add a spec, or PRD, UX, architecture, and story planning, before running the
same Build loop when:

- The change affects multiple systems or requires coordinated updates across
  many files
- You are unsure about the scope and need requirements discovery first
- You need documentation or architectural decisions recorded for the team
- Intent clarification keeps surfacing contradictions that one session cannot
  resolve

Larger intent becomes a sequence of session-sized units, and that sequence can
change as implementation produces evidence. Parent specs and planning artifacts
preserve the shared intent; story records carry decisions and completion state;
integration checks judge the combined behavior; and retrospectives compare the
whole epic with its contract. Build handles one unit in that lifecycle. It does
not own the backlog, select the next story, or replace integration and
retrospective review.

Use attended Build for foundational, risky, or important stories where human
decisions may establish patterns for later work. Once those patterns are
stable, `bmad-build-auto` can execute one unit unattended; see
[Autonomous Development Loops](../reference/build-auto.md) for that contract.

## Why Build Works This Way

Human-in-the-loop turns are necessary and expensive. Current LLMs still fail in
predictable ways: they misread intent, fill gaps with confident guesses, drift
into unrelated work, and generate noisy review output. At the same time,
constant human intervention limits development velocity.

Build rebalances that tradeoff. It relocates human control to a small number of
high-value moments — intent clarification, spec approval, and review of the
final product — and brings you back in between only when review proves it
could not safely infer what you meant. Everything else is a candidate for
longer autonomous execution. Older patterns spend more human attention on
continuous supervision; Build spends more trust on the model and saves human
attention for the moments where human reasoning has the highest leverage.

That triage will sometimes be imperfect. It is usually better to misjudge some
findings than to flood you with low-value review comments. The system is
optimizing for signal quality, not exhaustive recall.
