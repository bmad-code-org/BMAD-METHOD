---
title: 'Mary, Business Analyst'
description: 'Use Mary (bmad-agent-analyst) to explore ideas, research markets, competitors, and codebases, pressure-test concepts, build business cases, and maintain AGENTS.md.'
sidebar:
  order: 2
---

Mary (`bmad-agent-analyst`) is your thinking partner before you commit time or money to building something. You do not need a business or software background to work with her: bring a rough hunch, messy notes, or a tough strategic question, and she helps you test whether the idea holds up and why.

Call Mary with `/bmad-agent-analyst` in tools that support slash commands (such as Claude Code), or speak to her directly in plain English in any tool. Ask `"Mary, what can you help me with?"` at any time to see everything she offers.

## What Mary Helps You Do

### Explore and brainstorm ideas

When you have a broad goal or feel stuck on where to start, Mary guides structured brainstorming sessions to push past the obvious first answers and uncover stronger angles.

### Research markets, competitors, technologies, and codebases

Mary runs live research on markets, competitors, domains, technologies, customer feedback, and your existing repository using current sources rather than guessing from memory. She can trace how a feature or subsystem works across a codebase, or compare competing tools and approaches side by side with clear evidence for each option.

### Pressure-test an idea before building

Before anyone writes a plan or a line of code, Mary helps you test whether a problem is worth solving. She can work backward from a mock launch announcement and tough customer questions (known as a PRFAQ) to spot weak assumptions early, or map out your users' goals, frustrations, and motivations.

### Make the case to stakeholders

When a manager, sponsor, or team needs to sign off on funding or direction, Mary helps you write clear, candid decision documents: short product briefs, financial business cases with costs and expected returns, leadership strategy narratives, program charters, and formal business requirements documents when an outside team or regulated environment needs sign-off. Research reports, briefs, and decision documents save under `_bmad-output/` so teammates and downstream agents can read them later.

### Design small experiments

Instead of betting everything on a big build, Mary helps you design a focused test of one risky assumption with clear pass and fail criteria agreed before you run it.

### Keep your project's AI instructions sharp

Mary maintains your repository's `AGENTS.md`, the short repository instruction file that coding agents read before making changes. Because she verifies real build commands, conventions, and recurring pitfalls against the actual repo, coding agents stay accurate without bloating the file with stale advice.

:::note[Ways to start]
```text
/bmad-agent-analyst Help me research whether small clinics already pay for automated appointment follow-ups.
```

```text
Hey Mary, research how authentication and session refresh currently work in this codebase before we plan changes.
```

```text
Hey Mary, I want to build an internal portal for onboarding partners. Help me write a short brief and business case.
```
:::

## Working with the Rest of the Team

Once you decide an idea is worth pursuing, Mary hands off cleanly depending on what you need next:

- Talk to [John](john-pm.md) for any shape of product planning, from tightening a small idea or planning a quick prototype to writing a full feature or program plan.
- Talk to [Sally](sally-ux-designer.md) to map user psychology, brand identity, or screen flows before locking requirements.
- Take a settled brief or business case straight to [Sofia](sofia-po.md) when you already know what to build and want it broken into work steps.
- If you are starting or funding a company outside a product codebase, work with [Nadia](../founder/founder.md) instead.

See [Clarify the Idea](../clarify/clarify-the-idea.md) and [Plan Inside an Organization](../plan/plan-inside-an-organization.md) for how discovery fits into a project.

## Tailoring Mary

To adjust Mary's tone, standing project context, or extra guidelines, invoke `bmad-customize` and describe what you want changed.
