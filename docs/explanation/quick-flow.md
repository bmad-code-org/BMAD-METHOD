---
title: "Quick Flow"
description: Fast-track for small changes - skip the full methodology
sidebar:
  order: 1
---

Skip the ceremony. Quick Flow takes you from idea to working code in two commands - no Product Brief, no PRD, no Architecture doc.

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
If you start a Quick Flow and realize the scope is bigger than expected, `quick-dev` will detect this and offer to escalate. You can switch to a full PRD workflow at any point without losing your work.
:::

## How It Works

Quick Flow has two commands, each backed by a structured workflow. You can run them together or independently.

### quick-spec: Plan

Run `quick-spec` and Barry (the Quick Flow agent) walks you through a conversational discovery process:

1. **Understand** - You describe what you want to build. Barry scans the codebase to ask informed questions, then captures a problem statement, solution approach, and scope boundaries.
2. **Investigate** - Barry reads relevant files, maps code patterns, identifies files to modify, and documents the technical context.
3. **Generate** - Produces a complete tech-spec with ordered implementation tasks (specific file paths and actions), acceptance criteria in Given/When/Then format, testing strategy, and dependencies.
4. **Review** - Presents the full spec for your sign-off. You can edit, ask questions, run adversarial review, or refine with advanced elicitation before finalizing.

The output is a `tech-spec-{slug}.md` file saved to your project's implementation artifacts folder. It contains everything a fresh agent needs to implement the feature - no conversation history required.

### quick-dev: Build

Run `quick-dev` and Barry implements the work. It operates in two modes:

- **Tech-spec mode** - Point it at a spec file (`quick-dev tech-spec-auth.md`) and it executes every task in order, writes tests, and verifies acceptance criteria.
- **Direct mode** - Give it instructions directly (`quick-dev "refactor the auth middleware"`) and it gathers context, builds a mental plan, and executes.

After implementation, `quick-dev` runs a self-check audit against all tasks and acceptance criteria, then triggers an adversarial code review of the diff. Findings are presented for you to resolve before wrapping up.

:::tip[Fresh Context]
For best results, run `quick-dev` in a new conversation after finishing `quick-spec`. This gives the implementation agent clean context focused solely on building.
:::

## What Quick Flow Skips

The full BMad Method produces a Product Brief, PRD, Architecture doc, and Epic/Story breakdown before any code is written. Quick Flow replaces all of that with a single tech-spec. This works because Quick Flow targets changes where:

- The product direction is already established
- Architecture decisions are already made
- A single developer can reason about the full scope
- Requirements fit in one conversation

## Escalating to Full BMad Method

Quick Flow includes built-in guardrails for scope detection. When you run `quick-dev` with a direct request, it evaluates signals like multi-component mentions, system-level language, and uncertainty about approach. If it detects the work is bigger than a quick flow:

- **Light escalation** - Recommends running `quick-spec` first to create a plan
- **Heavy escalation** - Recommends switching to the full BMad Method PRD process

You can also escalate manually at any time. Your tech-spec work carries forward - it becomes input for the broader planning process rather than being discarded.
