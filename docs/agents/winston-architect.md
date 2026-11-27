---
title: 'Winston, System Architect'
description: 'Use Winston (bmad-agent-architect) to choose a tech stack, align designs across features, weigh build-vs-buy, plan migrations, and review security or readiness.'
sidebar:
  order: 5
---

Winston (`bmad-agent-architect`) helps you make sound technical decisions before separate pieces of code collide or grow brittle. You do not need deep architecture experience to work with him: he favors boring, dependable technology over hype and walks through options and trade-offs in plain English.

Ask Winston about your technical problem in plain words, or ask "Winston, what can you help me with?" anytime.

## What Winston Helps You Do

### Choose a stack and set shared technical guardrails

When several features or teams will build against the same system, Winston helps settle only the decisions where independent choices would clash: tech stack, service boundaries, data ownership, authentication, hosting, and AI safety or cost guardrails. He keeps documents short by leaving everyday implementation details to the coding sessions.

### Design a feature against your live codebase

When you are adding a major capability to an existing project, Winston inspects your current code first, respects the patterns already working in production, and maps out data schemas, API contracts, migrations, and state flows that fit cleanly.

### Weigh build-vs-buy and technology choices

Comparing databases, auth providers, frameworks, or vendor tools? Winston coaches you through weighted trade-offs, total cost, and lock-in risks, or helps write short decision records so future teammates know why a choice was made.

### Write technical proposals and API contracts

When another team, partner, or client needs to review a technical plan, Winston helps draft clear technical proposals (RFCs) as well as public API, webhook, and partner integration contracts with versioning and error conventions.

### Plan risky migrations and launches

Before cutting over a database, platform, or API, or flipping the switch on a major launch, Winston helps plan parity checks, rollback gates, reliability targets, capacity checks, and go-live readiness reviews.

### Review security and learn from incidents

Winston coaches practical security reviews (against checklists like OWASP Top 10 or STRIDE) and blameless postmortems after an outage, including clear timelines, root causes, follow-up actions, and customer communication drafts when needed.

### Make a codebase friendlier for AI coding agents

If AI coding tools keep getting confused in an older repository, Winston can audit the codebase for hidden friction, noisy comments, and inconsistent patterns so builds become predictable.

:::note[Ways to start]
```text
/bmad-agent-architect Help me choose between Postgres row-level security and application-level tenant checks for our app.
```

```text
Hey Winston, review our codebase and help us plan a zero-downtime migration from our old REST endpoints to v2.
```
:::

## Working with the Rest of the Team

- **Small changes skip Winston:** a single straightforward feature that fits your existing codebase goes straight to [Amelia](amelia-dev.md) (`bmad-build`).
- **Design before plumbing:** when a feature has an interface, work with [Sally](sally-ux-designer.md) first so user needs guide the technical design.
- **Hand off to builds:** ask [Sofia](sofia-po.md) to attach Winston's decisions to your project plan so every coding session follows the same contracts.

See [Design UX and Architecture](../plan/design-ux-and-architecture.md) for how architecture fits into project planning.

## Tailoring Winston

To add standing technical standards (like approved cloud services or compliance rules) or extra review templates, invoke `bmad-customize` and describe what you want Winston to enforce.
