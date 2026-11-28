---
title: 'Sally, UX Designer'
description: 'Use Sally (bmad-agent-ux-designer) to design how your product looks and behaves, build a brand kit, explore visual directions, connect Figma or Stitch, and audit UIs.'
sidebar:
  order: 5
---

Sally (`bmad-agent-ux-designer`) helps you design how a product looks, feels, and works, even if you have never worked with a designer before. Bring a rough idea, screenshots of sites you like, a brand concept, or a live app that feels clunky, and she coaches you step by step with concrete visual options you can react to. She writes durable design files (`DESIGN.md` for visual rules, `EXPERIENCE.md` for flows and interaction states, and `BRAND.md` for brand identity) under `_bmad-output/` or your project's branding folder so coding agents and teammates can build directly from them.

Call Sally with `/bmad-agent-ux-designer` in tools that support slash commands (such as Claude Code), or speak to her in plain English in any tool. Ask `"Sally, what can you help me with?"` anytime.

## What Sally Helps You Do

### Understand what motivates your users

Before anyone draws a screen, Sally can help map who your users are, what they are trying to accomplish, what excites them, and what makes them hesitate so every design choice serves a real human goal.

### Build a brand identity from scratch

When you want a consistent look for a company, product, or project, Sally coaches you through positioning, aesthetic direction, color palettes with verified accessibility contrast, typography pairings, brand voice, and clean scalable SVG logos that still read clearly at tiny favicon sizes and in monochrome. She writes `BRAND.md` and a `DESIGN.md` theme package, generates an interactive HTML Brand Book, and helps wire your brand into BMad during [`bmad setup`](../start/install-bmad.md) so future visual pages and presentations match automatically.

### Find your visual direction

Not sure what your app should look like? Share websites, apps, or screenshots you love (and hate). Sally helps dissect why they work, tunes visual dials like density and warmth, and generates interactive themes and direction concepts so you can pick and refine what feels right.

### Design an app or feature at any scale

Sally scales her output to whatever you are building:

- For a small tool or prototype, she writes a fast, lightweight spec and wireframe for a single screen or flow.
- For a feature or epic, she produces detailed `EXPERIENCE.md` user flows, edge cases, loading and empty states, error messages, keyboard accessibility rules, and interactive HTML screen mockups.
- For a full product, she establishes a shared `DESIGN.md` with reusable design tokens (the shared colors, typography, spacing, and elevation rules) alongside system-wide layout navigation and component behavior so multiple features look and feel like one coherent product.

### Design a website or landing page

For marketing sites, product landing pages, documentation, or portfolios, Sally helps structure the narrative arc, page-by-page flow, conversion calls to action, responsive layouts, and clear metadata so visitors immediately understand why the product matters.

### Work with Figma, Google Stitch, and Claude Design

If you already sketch or design in **Google Stitch**, **Claude Design**, **Figma**, **Penpot**, or **v0**, Sally works both ways: she helps write sharp design briefs to feed those tools, and turns the designs or visual tokens (reusable color, font, and spacing definitions) you bring back into complete, developer-ready `DESIGN.md` and `EXPERIENCE.md` specs with missing edge states and accessibility filled in.

### Audit an existing UI

Point Sally at an existing app, prototype, or frontend codebase for a structured critique covering usability, visual hierarchy, spacing, mobile responsiveness, keyboard and screen-reader accessibility, and missing error or loading states, ending with a clear, prioritized fix plan.

:::note[Ways to start]
```text
/bmad-agent-ux-designer I love Linear's clean feel and Stripe's clarity. Help me pick a visual direction for my scheduling app.
```

```text
Hey Sally, audit our checkout page for usability, accessibility, and mobile layout issues.
```
:::

## Working with the Rest of the Team

- Start with Sally before [John](john-pm.md) if the user experience drives the product, or bring her in after John shapes the requirements.
- When Sally finishes `DESIGN.md` and `EXPERIENCE.md`, ask [Sofia](sofia-po.md) to attach them to your plan so [Amelia](amelia-dev.md) reads your visual tokens, screen states, and mockups directly while writing code.
- For narrative slide decks, workshops, or non-software creative work, talk to [Clio](../creative/creative.md) instead.

See [Design UX and Architecture](../plan/design-ux-and-architecture.md) for how UX fits into a multi-part build.

## Tailoring Sally

To supply your own reference designs, example layouts, or external design-tool preferences, invoke `bmad-customize` and describe what you want Sally to follow.
