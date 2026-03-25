---
title: "Quick Dev"
description: Reduce human-in-the-loop friction without giving up the checkpoints that protect output quality
sidebar:
  order: 2
---

Intent in, code changes out, with as few human-in-the-loop turns as possible — without sacrificing quality.

It lets the model run longer between checkpoints, then brings the human back only when the task cannot safely continue without human judgment or when it is time to review the end result.

![Quick Dev workflow diagram](/diagrams/quick-dev-diagram.png)

## Why This Exists

Human-in-the-loop turns are necessary and expensive.

Current LLMs still fail in predictable ways: they misread intent, fill gaps with confident guesses, drift into unrelated work, and generate noisy review output. At the same time, constant human intervention limits development velocity. Human attention is the bottleneck.

`bmad-quick-dev` rebalances that tradeoff. It trusts the model to run unsupervised for longer stretches, but only after the workflow has created a strong enough boundary to make that safe.

## The Core Design

### 1. Compress intent first

The workflow starts by having the human and the model compress the request into one coherent goal. The input can begin as a rough expression of intent, but before the workflow runs autonomously it has to become small enough, clear enough, and contradiction-free enough to execute.

Intent can come in many forms: a couple of phrases, a bug tracker link, output from plan mode, text copied from a chat session, or even a story number from BMAD's own `epics.md`. In that last case, the workflow will not understand BMAD story-tracking semantics, but it can still take the story itself and run with it.

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

Everything else is a candidate for longer autonomous execution. That tradeoff is deliberate. Older patterns spend more human attention on continuous supervision. Quick Dev spends more trust on the model, but saves human attention for the moments where human reasoning has the highest leverage.

## Why the Review System Matters

The review phase is not just there to find bugs. It is there to route correction without destroying momentum.

This workflow works best on a platform that can spawn subagents, or at least invoke another LLM through the command line and wait for a result. If your platform does not support that natively, you can add a skill to do it. Context-free subagents are a cornerstone of the review design.

Agentic reviews often go wrong in two ways:

- They generate too many findings, forcing the human to sift through noise.
- They derail the current change by surfacing unrelated issues and turning every run into an ad hoc cleanup project.

Quick Dev addresses both by treating review as triage.

Some findings belong to the current change. Some do not. If a finding is incidental rather than causally tied to the current work, the workflow can defer it instead of forcing the human to handle it immediately. That keeps the run focused and prevents random tangents from consuming the budget of attention.

That triage will sometimes be imperfect. That is acceptable. It is usually better to misjudge some findings than to flood the human with thousands of low-value review comments. The system is optimizing for signal quality, not exhaustive recall.
