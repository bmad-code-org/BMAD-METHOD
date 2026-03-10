---
title: "Quick Dev New Preview"
description: Unified quick workflow that clarifies, plans, implements, reviews, and hands off in one run
sidebar:
  order: 2
---

Use `bmad-quick-dev-new-preview` when you want one workflow to carry a change from raw intent to reviewed code without bouncing between separate planning and implementation skills.

This is the experimental unified version of Quick Flow. Instead of running `bmad-quick-spec` and `bmad-quick-dev` as separate phases, you start once and the workflow decides whether to plan first or go straight to implementation.

## When to Use It

- You have one concrete development goal and want the workflow to manage the handoffs
- You want planning, coding, and review guardrails without manually switching skills
- You are working in an existing codebase and need the workflow to validate assumptions before editing
- You want an adversarial review step before deciding whether to push or open a PR

## When NOT to Use It

- You need full BMad artifacts like a Product Brief, PRD, Architecture doc, or Epic/Story breakdown
- The request contains multiple independently shippable goals and should be split first
- The work needs stakeholder alignment before implementation starts
- You only want a quick implementation pass and do not want spec generation or review checkpoints

:::note[Experimental by Design]
This workflow is intentionally stricter than a casual "just implement it" prompt. It treats your request as input, not truth, and still performs investigation, spec generation, and review when the blast radius is non-zero.
:::

## How It Works

`bmad-quick-dev-new-preview` always runs the same five-step loop:

1. **Clarify and route**. It checks for resumable artifacts, verifies the working state, clarifies unanswered intent gaps, and routes the request into either a one-shot path or a plan-code-review path.
2. **Plan**. For anything with meaningful blast radius, it investigates the codebase and generates a full tech spec from the workflow template. The spec is reviewed at a human checkpoint before implementation starts.
3. **Implement**. The approved spec moves to `in-progress`, a baseline commit is captured for diffing, and implementation happens locally only. The workflow never pushes during this step.
4. **Review**. It runs adversarial review against the change. On the full path, review findings are classified as intent gaps, bad spec, patchable issues, deferred issues, or noise. Spec defects trigger a loopback instead of papering over the problem.
5. **Present**. It creates a local commit if needed, marks the spec `done`, summarizes the work, and offers the next remote step instead of auto-pushing.

## What Makes It Different

### One workflow, not two

Classic Quick Flow separates planning and implementation into `bmad-quick-spec` and `bmad-quick-dev`. Quick Dev New Preview keeps both inside one stateful workflow, so the agent owns routing, artifact management, and review sequencing from start to finish.

### Approval freezes intent

After you approve the spec, everything inside the spec's `<frozen-after-approval>` block becomes human-owned intent. If later review reveals that the original intent was incomplete, the workflow is supposed to stop and bring that gap back to you rather than silently changing scope.

### Review can force re-derivation

This workflow is opinionated about bad planning. If review shows the code drifted because the spec was weak, it updates the spec, preserves the parts that worked, and re-derives the implementation instead of stacking more patches on top of a flawed plan.

## Output Artifacts

On the plan-code-review path, the main artifact is a `tech-spec-{slug}.md` file in your implementation artifacts folder. That file records status transitions such as `ready-for-dev`, `in-progress`, `in-review`, and `done`, and it also stores the baseline commit used for diff-based review.

If the workflow detects extra goals or unrelated issues, it can also append them to `deferred-work.md` so the current run stays focused on one shippable objective.

## Quick Dev New Preview vs Quick Flow

| Need | Better fit |
| --- | --- |
| Small change, but you still want explicit review and artifact state managed for you | `bmad-quick-dev-new-preview` |
| Separate planning and implementation conversations | `bmad-quick-spec` + `bmad-quick-dev` |
| Fastest path for well-understood small work using the established Quick Flow pair | `Quick Flow` |
| Multi-phase product work with broader alignment and architecture decisions | Full BMad Method |

## When to Graduate

If the workflow surfaces multiple top-level goals, major architectural uncertainty, or repeated intent/spec loopbacks, that is usually a signal to move up a level. Use `bmad-quick-spec` for a cleaner planning pass, or escalate fully into the broader BMad Method when the work clearly needs product and architecture artifacts.
