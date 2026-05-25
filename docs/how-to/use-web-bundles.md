---
title: 'Use Web Bundles'
description: Install a BMad web bundle as a Google Gemini Gem or ChatGPT Custom GPT
---

Web bundles install from **[bmadcode.com/web-bundles](https://bmadcode.com/web-bundles/)**.

## Why a single front door

The site is the only supported install path for the shelf. It keeps the steps current as Gemini and ChatGPT evolve, always points at the newest tagged release, and lets one signup put you on the list for new bundles as they ship.

## What you'll do on the site

1. Pick a bundle from the card grid.
2. Open the install modal. Switch between the **Gemini Gem** and **ChatGPT GPT** tabs for the platform-specific steps.
3. Download the bundle ZIP (one click; one-time free signup for email-only members).
4. Follow the inline steps: create the Gem or Custom GPT, upload the knowledge files, paste the instructions block, save.

## Prerequisites

- **For Gemini Gems**: Gemini Advanced subscription.
- **For ChatGPT Custom GPTs**: Plus, Pro, Business, or Enterprise plan.
- For bundles that use **Deep Research** (currently Market & Industry Research), enable it from the prompt bar (Tools → Deep Research). Deep Research has its own plan limits.

## Customize the persona

Each bundle's `INSTRUCTIONS.md` (inside the ZIP) includes a **Persona Swap Example** above the paste boundary. Replace the `[persona]` block in your installed instructions with the swap example to change voice without changing the protocol. You can also write your own persona from scratch; the protocol stays the same.

## What you get

- A reusable Gem or Custom GPT scoped to one BMad planning capability.
- Polished artifacts (briefs, PRDs, research reports, UX specs) ready to drop into your IDE for implementation.
- Planning conversation runs on your existing web LLM subscription instead of metered IDE tokens.

:::caution[Persona drift]
Web LLMs occasionally drop persona partway through long sessions. If the model starts speaking out of character, remind it of its persona or start a fresh session.
:::

## Building your own

To turn an existing BMad skill into a web bundle, use the `bmad-os-skill-to-bundle` utility skill from [bmad-utility-skills](https://github.com/bmad-code-org/bmad-utility-skills). It produces the bundle files with persona inheritance from the owning agent and a swap-example contrast voice. Submit your bundle to the shelf by opening a PR on [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) that adds the bundle directory and an entry in `web-bundles/bundles.json`.
