---
title: "Build"
description: Reduce human-in-the-loop friction without giving up the checkpoints that protect output quality
sidebar:
  order: 7
---

`bmad-build` is the canonical implementation workflow for all development work. It accepts anything from free-form intent or an issue to a fully planned story, and produces code changes with as few human-in-the-loop turns as safety allows.

Upstream planning remains optional and variable. A clear change can enter directly; a larger initiative can arrive with a PRD, UX design, architecture, epics, stories, readiness results, and sprint plan. Those artifacts strengthen the implementation context rather than selecting a different development workflow.

When a planned story enters Build, the story remains the upstream product and acceptance context. Build creates its own execution record for the current run so implementation decisions and review findings stay traceable without replacing the story.

It lets the model run longer between checkpoints, then brings the human back only when the task cannot safely continue without human judgment or when it is time to review the end result.

![Build workflow diagram](/diagrams/build-diagram.png)

## Why This Exists

Human-in-the-loop turns are necessary and expensive.

Current LLMs still fail in predictable ways: they misread intent, fill gaps with confident guesses, drift into unrelated work, and generate noisy review output. At the same time, constant human intervention limits development velocity. Human attention is the bottleneck.

`bmad-build` rebalances that tradeoff. It trusts the model to run unsupervised for longer stretches, but only after the workflow has created a strong enough boundary to make that safe.

## The Core Design

### 1. Resolve intent from evidence

The workflow starts by resolving workflow state and gathering the project evidence relevant to the request. The input can begin as a rough expression of intent, but Build investigates before deciding whether anything material is missing. Clear, evidence-supported requests proceed without a clarification turn.

Intent can come in many forms: a couple of phrases, a bug tracker link, output from plan mode, text copied from a chat session, or a planned story from BMad's own epics and sprint artifacts. The workflow uses the request together with repository and upstream planning evidence. It asks the human only when multiple defensible interpretations would produce observably different outcomes and that evidence cannot select one.

This workflow does not eliminate human control. It relocates it to a small number of high-value moments:

- **Material intent decisions** - choosing between observably different outcomes when project evidence cannot resolve the ambiguity
- **Spec approval** - on the full path, confirming the frozen understanding is the right thing to build before implementation starts
- **Review of the final product** - the primary checkpoint, where the human decides whether the result is acceptable at the end

### 2. Route to the smallest safe path

Once the goal is clear, the workflow decides whether this is a true one-shot change or whether it needs the fuller path. Small, zero-blast-radius changes can go straight to implementation. Everything else goes through planning so the model has a stronger boundary before it runs longer on its own.

### 3. Run longer with less supervision

After that routing decision, the model can carry more of the work on its own. On the fuller path, the approved spec becomes the boundary the model executes against with less supervision, which is the whole point of the design.

### 4. Diagnose failure at the right layer

If the implementation is wrong because the intent was wrong, patching the code is the wrong fix. If the code is wrong because the spec was weak, patching the diff is also the wrong fix. The workflow is designed to diagnose where the failure entered the system, go back to that layer, and regenerate from there.

Review findings are used to decide whether the problem came from intent, spec generation, or local implementation. Only truly local problems get patched locally.

### 5. Bring the human back only when needed

Intent resolution is evidence-first rather than a default interview. The workflow keeps interruptions to the minimum needed for safe progress. The human comes back when evidence cannot resolve a material product decision, when a workflow safety gate needs input — for example, a VCS mismatch, a scope choice, or missing required evidence — at the full-path spec approval boundary, and at the end, when it is time to review the result.

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
