---
title: 'Winston, System Architect'
description: 'Use Winston (bmad-agent-architect) to choose a tech stack, align shared architecture across features, design AI systems, plan migrations, and review security or repo readiness.'
sidebar:
  order: 6
---

Winston (`bmad-agent-architect`) helps you make sound technical decisions before separate pieces of code collide or grow brittle. You do not need deep architecture experience to work with him: he favors boring, dependable technology over hype, walks through options and trade-offs in plain English, and saves concise architecture documents, decision records, and API contracts under `_bmad-output/`.

Call Winston with `/bmad-agent-architect` in tools that support slash commands (such as Claude Code), or speak to him in plain English in any tool. Ask `"Winston, what can you help me with?"` anytime.

## What Winston Helps You Do

### Choose a stack and set shared architecture guardrails

When several features or teams will build against the same system, Winston writes a short shared architecture document that settles only the decisions where independent choices would clash: tech stack, service boundaries, data ownership, authentication, hosting, and AI safety or cost guardrails. He leaves everyday implementation details to the coding sessions so the document stays lean.

### Design a feature against your live codebase

When you are adding a major capability to an existing project, Winston inspects your current code first, respects the patterns already working in production, and maps out data schemas, API contracts, data transitions, and state flows that fit cleanly.

### Design AI and agent systems

When your product includes LLMs, retrieval pipelines, tool calling, or multi-step agents, Winston helps design prompt and model boundaries, evaluation hooks, safety guardrails, latency budgets, and cost ceilings so AI features behave predictably in production.

### Weigh build-vs-buy and record technical decisions

Comparing databases, auth providers, frameworks, or vendor tools? Winston coaches you through weighted trade-offs, total cost, and lock-in risks, or helps write short ADRs (architecture decision records, brief one-page notes explaining why a technical choice was made and what alternatives were rejected) so future teammates never have to guess.

### Write technical proposals and API contracts

When another team, partner, or client needs to review a technical plan before coding starts, Winston helps draft clear technical proposals (often called RFCs, or Requests for Comments) as well as public API, webhook, and partner integration contracts with versioning and error conventions.

### Plan risky migrations and launches

Before moving data or traffic from an old database, platform, or API to a new one, or before launching a major release, Winston helps plan verification checks, safe rollback steps, reliability targets, capacity checks, and go-live readiness reviews.

### Review security and learn from incidents

Winston coaches practical security reviews, including threat modeling (mapping how an attacker could abuse a system before it ships) and structured checklists like OWASP Top 10. After an outage, he guides blameless postmortems with clear timelines, root causes, follow-up actions, and customer communication drafts when needed.

### Assess agent-readiness and update existing architecture docs

If AI coding tools keep getting confused in an older repository, Winston runs an agent-readiness assessment to find hidden friction, noisy comments, and inconsistent patterns so automated builds become predictable. He can also update an existing architecture document when your system evolves or validate one read-only to spot gaps without editing your files.

:::note[Ways to start]
```text
/bmad-agent-architect Help me choose between Postgres row-level security and application-level tenant checks for our app.
```

```text
Hey Winston, review our codebase and help us plan a zero-downtime migration from our old REST endpoints to v2.
```

```text
Hey Winston, run an agent-readiness check on this repository and tell us what slows coding agents down.
```
:::

## Working with the Rest of the Team

- A single straightforward feature that fits your existing codebase skips Winston and goes straight to [Amelia](amelia-dev.md) (`bmad-build`).
- When a feature has an interface, work with [Sally](sally-ux-designer.md) first so user needs guide the technical design.
- Ask [Sofia](sofia-po.md) to attach Winston's architecture documents and contracts to your project plan so every coding session follows the same decisions.

See [Design UX and Architecture](../plan/design-ux-and-architecture.md) for how architecture fits into project planning.

## Tailoring Winston

To add standing technical standards (like approved cloud services or compliance rules) or extra review templates, invoke `bmad-customize` and describe what you want Winston to enforce.
