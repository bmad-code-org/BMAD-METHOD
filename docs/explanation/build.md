---
title: 'Build'
description: Understand how the attentive Build workflow handles direct intent and planned stories.
sidebar:
  order: 7
---

`bmad-build` is the attentive Build workflow for one coherent,
session-sized unit of software work. It accepts anything from free-form intent
or an issue to a fully planned story, then clarifies, plans, implements, and
reviews that unit with as few human checkpoints as safety allows.

Session-sized means that one implementation session can reasonably understand,
implement, review, and finish the intent. It is a scope boundary, not a time
estimate. A small change may require more planning because of its risk,
ambiguity, or architectural reach.

Invoke the `bmad-build` skill directly. Upstream planning determines the
context Build receives; it does not require a different implementation agent.

When a planned story enters Build, the story remains the product and acceptance
context. Build creates an implementation record for the current run so
decisions, completion state, and review findings remain traceable without
replacing the story.

![Build workflow diagram](/diagrams/build-diagram.png)

## Where Build Fits

Use the smallest planning path that safely produces a session-sized unit, then
give that unit to Build.

| Starting point    | What Build receives                             | What preserves the larger intent                              |
| ----------------- | ----------------------------------------------- | ------------------------------------------------------------- |
| Direct change     | A request, issue, or intent file                | The Build implementation record                               |
| Spec-backed epic  | One entry from the spec folder's `stories.yaml` | `SPEC.md`, its companions, and prior story records            |
| Full BMad project | One selected story                              | PRD, UX, architecture, epics, sprint tracking, and prior work |

An obvious, low-risk edit may not need Build. An epic or project needs more
planning around Build, but each implementation unit still uses the same workflow.
See [Choose a Development Path](../how-to/choose-a-development-path.md) for the
complete routing guide.

## How Larger Work Reaches Build

Larger intent becomes a sequence of session-sized units. That sequence can
change as implementation produces evidence. Later stories may need to absorb a
new constraint, reconcile a decision made by an earlier story, or be divided
differently.

The larger BMad flow reduces the risk of losing information when work is
divided. Parent specs and planning artifacts preserve shared intent; story
records carry decisions and completion state; integration checks judge the
combined behavior; and retrospectives compare the whole epic with its contract.

Build handles one unit in that lifecycle. It does not own the backlog, select
the next story, coordinate several epic streams, or replace integration and
retrospective review.

## Attentive and Unattended Work

Use Build for foundational, risky, or important stories where human decisions
may establish patterns for later work. Once those patterns are stable,
`bmad-build-auto` can execute one unit unattended. An AI coding session or
another orchestrator, such as bmad-loop, must still select and dispatch each
unit.

Both Build workflows write story records under the same spec folder,
so downstream integration and Retrospective can use their status regardless of
which Build workflow produced them. See
[Autonomous Development Loops](../reference/build-auto.md) for that contract.

## Why This Exists

Human-in-the-loop turns are necessary and expensive.

Current LLMs still fail in predictable ways: they misread intent, fill gaps with confident guesses, drift into unrelated work, and generate noisy review output. At the same time, constant human intervention limits development velocity. Human attention is the bottleneck.

`bmad-build` rebalances that tradeoff. It trusts the model to run unsupervised for longer stretches, but only after the workflow has created a strong enough boundary to make that safe.

## The Core Design

### 1. Compress intent first

The workflow starts by having the human and the model compress the request into one coherent goal. The input can begin as a rough expression of intent, but before the workflow runs autonomously it has to become small enough, clear enough, and contradiction-free enough to execute.

Intent can come in many forms: a couple of phrases, a bug tracker link, output from plan mode, text copied from a chat session, or a planned story from BMad's own epics and sprint artifacts. The workflow uses whatever upstream context exists and resolves any gaps it needs to implement safely.

This workflow does not eliminate human control. It relocates it to a small number of high-value moments:

- **Intent clarification** - turning a messy request into one coherent goal without hidden contradictions
- **Spec approval** - confirming that the frozen understanding is the right thing to build
- **Review of the final product** - the primary checkpoint, where the human decides whether the result is acceptable at the end

### 2. Route to the smallest safe path

Once the goal is clear, the workflow decides whether this is a true one-shot change or whether it needs the fuller path. Small, zero-blast-radius changes can go straight to implementation. Everything else goes through planning so the model has a stronger boundary before it runs longer on its own.

### 3. Run longer with less supervision

After that routing decision, the model can carry more of the work on its own. On the fuller path, the approved spec becomes the boundary the model executes against with less supervision, which is the whole point of the design.

### 4. Diagnose failure at the right layer

If the implementation is wrong because the intent was wrong, patching the code is the wrong fix. If the code is wrong because the spec was weak, patching the diff is also the wrong fix. The workflow is designed to diagnose where the failure entered the system, go back to that layer, and regenerate from there.

Review findings are used to decide whether the problem came from intent, spec generation, or local implementation. Only truly local problems get patched locally.

### 5. Bring the human back only when needed

The intent interview is human-in-the-loop, but it is not the same kind of interruption as a recurring checkpoint. The workflow tries to keep those recurring checkpoints to a minimum. After the initial shaping of intent, the human mainly comes back when the workflow cannot safely continue without judgment and at the end, when it is time to review the result.

- **Intent-gap resolution** - stepping back in when review proves the workflow could not safely infer what was meant

Everything else is a candidate for longer autonomous execution. That tradeoff is deliberate. Older patterns spend more human attention on continuous supervision. Build spends more trust on the model, but saves human attention for the moments where human reasoning has the highest leverage.

## Why the Review System Matters

The review phase is not just there to find bugs. It is there to route correction without destroying momentum.

This workflow works best on a platform that can spawn subagents, or at least invoke another LLM through the command line and wait for a result. If your platform does not support that natively, you can add a skill to do it. Context-free subagents are a cornerstone of the review design.

Agentic reviews often go wrong in two ways:

- They generate too many findings, forcing the human to sift through noise.
- They derail the current change by surfacing unrelated issues and turning every run into an ad hoc cleanup project.

Build addresses both by treating review as triage.

Some findings belong to the current change. Some do not. If a finding is incidental rather than causally tied to the current work, the workflow can defer it instead of forcing the human to handle it immediately. That keeps the run focused and prevents random tangents from consuming the budget of attention.

That triage will sometimes be imperfect. That is acceptable. It is usually better to misjudge some findings than to flood the human with thousands of low-value review comments. The system is optimizing for signal quality, not exhaustive recall.
