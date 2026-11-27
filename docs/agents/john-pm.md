---
title: 'John, Product Manager'
description: 'Use John (bmad-agent-pm) to shape what to build, plan prototypes or experiments, write product requirements, review existing docs, and coordinate launches.'
sidebar:
  order: 3
---

John (`bmad-agent-pm`) is your product planning partner. Converse with him to plan work at any scale, from a small addition to an existing app or a quick prototype up to a multi-team enterprise application and everything in between. He adapts to the size of your project so you get clear direction without unnecessary paperwork, and saves finished plans under `_bmad-output/` where the rest of the team can read them.

Call John with `/bmad-agent-pm` in tools that support slash commands (such as Claude Code), or speak to him in plain English in any tool. Ask `"John, what can you help me with?"` to see everything he offers.

## What John Helps You Do

### Sharpen a small idea before building

Even if your change only takes a paragraph to describe, John helps you tighten the goal, spot edge cases, and write a crisp summary of what success looks like before you hand it off to get built.

### Plan a quick prototype or experiment

When you want to try an idea out quickly before committing to a full build, John helps you scope a lightweight prototype plan or a measured experiment with clear pass and fail thresholds.

### Shape a focused feature or product plan

For larger features or new products, John coaches you through user journeys, product rules, what is explicitly out of scope, and measurable goals in a PRD (product requirements document). Once the plan takes shape, he pushes you to keep the first version small enough to ship and learn from quickly.

### Pitch a time-boxed cycle

If your team works in fixed cycles (such as Shape Up), John helps write a concise pitch that defines the problem, the fixed time budget you are willing to spend, a rough solution sketch, and the tricky traps to stay out of.

### Coordinate multi-part products and programs

When several connected products or teams need to move together, John maps out shared outcomes, guardrails, and rollout order across the whole effort so individual teams stay aligned without micromanaging every screen.

### Write formal sign-off specs and launch plans

For regulated or contracted work that needs strict traceability, John writes detailed requirements specifications. When built work is ready to ship, he helps plan rollout steps, customer communication, and launch readiness across teams.

### Update or review an existing plan

Bring an existing product document, wiki export, or draft, and John can revise it when scope changes or audit it read-only without modifying your files unless you ask.

:::note[Ways to start]
```text
/bmad-agent-pm I want to add self-serve team billing to our app. Help me work through what the first version should cover.
```

```text
Hey John, let's plan a quick prototype to test two different onboarding flows before we build the real thing.
```

```text
Hey John, review this draft product spec read-only and flag missing edge cases or scope gaps.
```
:::

## Working with the Rest of the Team

- Start with [Mary](mary-analyst.md) when you still need market research or a business case for why to build at all.
- Pair with [Sally](sally-ux-designer.md) whenever visual direction, brand identity, or screen flows help shape the product.
- Hand a small, settled idea straight to [Amelia](amelia-dev.md) (`bmad-build`) to build, or bring a multi-part plan to [Sofia](sofia-po.md) to break down into buildable steps.

See [Write a PRD](../plan/write-a-prd.md) and [Plan Inside an Organization](../plan/plan-inside-an-organization.md) for walkthroughs.

## Tailoring John

To change how John prioritizes scope, add standing product rules, or customize what his documents cover, invoke `bmad-customize` and describe the change you want.
