---
title: 'Sally, UX Designer'
description: 'Use Sally (bmad-agent-ux-designer) to design how your product looks and behaves, build a brand kit, explore visual directions, connect Figma or Stitch, and audit UIs.'
sidebar:
  order: 4
---

Sally (`bmad-agent-ux-designer`) helps you design how a product looks, feels, and works, even if you have never worked with a designer before. Bring a rough idea, screenshots of sites you like, a brand concept, or a live app that feels clunky, and she coaches you step by step with concrete visual options you can react to.

Ask Sally in plain words, or ask "Sally, what can you help me with?" anytime.

## What Sally Helps You Do

### Understand what motivates your users

Before anyone draws a screen, Sally can help map who your users are, what they are trying to accomplish, what excites them, and what makes them hesitate so every design choice serves a real human goal.

### Build a brand identity from scratch

When you want a consistent look for a company, product, or project, Sally coaches you through positioning, aesthetic direction, color palettes with verified accessibility contrast, typography pairings, brand voice, and clean scalable SVG logos that still read clearly at tiny favicon sizes and in monochrome. She generates an interactive HTML Brand Book and helps wire your brand into BMad during `bmad setup` so future visual pages and presentations match automatically.

### Find your visual direction

Not sure what your app should look like? Share websites, apps, or screenshots you love (and hate). Sally helps dissect why they work, tunes visual dials like density and warmth, and generates interactive themes and direction concepts so you can pick and refine what feels right.

### Design an app or feature at any scale

Sally scales to whatever you are building:

- **Quick single-screen flows:** a fast, lightweight spec and wireframe for a small tool or prototype.
- **Feature designs:** detailed user flows, edge cases, loading and empty states, error messages, keyboard accessibility, and interactive HTML screen mockups.
- **Full product design systems:** shared colors, typography, layout navigation, and component behavior that keep multiple features looking and behaving like one coherent product.

### Design a website or landing page

For marketing sites, product landing pages, documentation, or portfolios, Sally helps structure the narrative arc, page-by-page flow, conversion calls to action, responsive layouts, and clear metadata so visitors immediately understand why the product matters.

### Work with Figma, Google Stitch, and Claude Design

If you already sketch or design in **Google Stitch**, **Claude Design**, **Figma**, **Penpot**, or **v0**, Sally works both ways: she helps write sharp design briefs to feed those tools, and turns the designs or tokens you bring back into complete, developer-ready specs with missing edge states and accessibility filled in.

### Audit an existing UI

Point Sally at an existing app, prototype, or frontend codebase for a structured critique covering usability, visual hierarchy, spacing, mobile responsiveness, keyboard and screen-reader accessibility, and missing error or loading states, ending with a clear, prioritized fix plan.

:::note[Ways to start]
```text
/bmad-agent-ux-designer I love Linear's clean feel and Stripe's clarity. Help me pick a visual direction for my scheduling app.
```

```text
/bmad-agent-ux-designer Audit our checkout page for usability, accessibility, and mobile layout issues.
```
:::

## Working with the Rest of the Team

- **Design-first or after planning:** start with Sally before [John](john-pm.md) if the user experience drives the product, or bring her in after John shapes the requirements.
- **Keep code builds faithful:** when Sally finishes a design, ask [Sofia](sofia-po.md) to attach it to your plan so [Amelia](amelia-dev.md) reads your visual tokens, screen states, and mockups directly while writing code.
- **Non-software creative work:** for narrative slide decks, workshops, or non-software experiences, work with [Clio](../creative/creative.md) instead.

See [Design UX and Architecture](../plan/design-ux-and-architecture.md) for how UX fits into a multi-part build.

## Tailoring Sally

To supply your own reference designs, example layouts, or external design-tool preferences, invoke `bmad-customize` and tell it what you want Sally to follow.
