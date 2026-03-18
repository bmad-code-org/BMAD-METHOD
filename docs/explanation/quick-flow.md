---
title: "Quick Flow"
description: Fast-track for small changes - skip the full methodology
sidebar:
  order: 1
---

Skip the ceremony. Quick Flow takes you from intent to working code in a single workflow — no Product Brief, no PRD, no Architecture doc.

## When to Use It

- Bug fixes and patches
- Refactoring existing code
- Small, well-understood features
- Prototyping and spikes
- Single-agent work where one developer can hold the full scope

## When NOT to Use It

- New products or platforms that need stakeholder alignment
- Major features spanning multiple components or teams
- Work that requires architectural decisions (database schema, API contracts, service boundaries)
- Anything where requirements are unclear or contested

:::caution[Scope Creep]
If you start a Quick Flow and realize the scope is bigger than expected, `bmad-quick-dev` will detect this and offer to escalate. You can switch to a full PRD workflow at any point without losing your work.
:::

## How It Works

Run `bmad-quick-dev` and the workflow handles everything — clarifying intent, planning, implementing, reviewing, and presenting results.

### 1. Clarify intent

You describe what you want. The workflow compresses your request into one coherent goal — small enough, clear enough, and contradiction-free enough to execute safely. Intent can come from many sources: a few phrases, a bug tracker link, plan mode output, chat session text, or even a story number from your epics.

### 2. Route to the smallest safe path

Once the goal is clear, the workflow decides whether this is a true one-shot change or needs the fuller path. Small, zero-blast-radius changes go straight to implementation. Everything else goes through planning so the model has a stronger boundary before running autonomously.

### 3. Plan and implement

On the planning path, the workflow produces a complete tech-spec with ordered implementation tasks, acceptance criteria in Given/When/Then format, and testing strategy. After you approve the spec, it becomes the boundary the model executes against with less supervision.

### 4. Review and present

After implementation, the workflow runs a self-check audit and adversarial code review of the diff. Review acts as triage — findings tied to the current change are addressed, while incidental findings are deferred to keep the run focused. Results are presented for your sign-off.

### Human-in-the-loop checkpoints

The workflow relocates human control to a small number of high-value moments:

- **Intent clarification** — turning a messy request into one coherent goal
- **Spec approval** — confirming the frozen understanding is the right thing to build
- **Final review** — deciding whether the result is acceptable

Between these checkpoints, the model runs longer with less supervision. This is deliberate — it trades continuous supervision for focused human attention at moments with the highest leverage.

## What Quick Flow Skips

The full BMad Method produces a Product Brief, PRD, Architecture doc, and Epic/Story breakdown before any code is written. Quick Flow replaces all of that with a single tech-spec. This works because Quick Flow targets changes where:

- The product direction is already established
- Architecture decisions are already made
- A single developer can reason about the full scope
- Requirements fit in one conversation

## Escalating to Full BMad Method

Quick Flow includes built-in guardrails for scope detection. When you run `bmad-quick-dev`, it evaluates signals like multi-component mentions, system-level language, and uncertainty about approach. If it detects the work is bigger than a quick flow:

- **Light escalation** — Recommends creating a plan before implementation
- **Heavy escalation** — Recommends switching to the full BMad Method PRD process

You can also escalate manually at any time. Your tech-spec work carries forward — it becomes input for the broader planning process rather than being discarded.
