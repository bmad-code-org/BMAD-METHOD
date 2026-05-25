---
title: 'Use Web Bundles'
description: Install a BMad web bundle as a Google Gemini Gem or ChatGPT Custom GPT
---

Use a **web bundle** to run BMad planning work in your Gemini or ChatGPT subscription instead of your IDE.

## When to Use This

- You want to run brainstorming, product brief, PRFAQ, PRD, UX, or market research in a web LLM.
- You want to save IDE tokens by keeping the planning conversation on a flat-rate subscription.
- You want to share a planning artifact with collaborators who don't have your IDE setup.

## When to Skip This

- The work needs to read or modify code in your repo. Stay in the IDE.
- You don't have a Gemini Advanced or ChatGPT Plus subscription.

:::note[Prerequisites]

- **For Gemini Gems**: Gemini Advanced subscription.
- **For ChatGPT Custom GPTs**: Plus, Pro, Business, or Enterprise plan. Some bundles use Deep Research, which has its own plan availability.
- A bundle from [`web-bundles/`](https://github.com/bmad-code-org/BMAD-METHOD/tree/main/web-bundles).
:::

## Steps

### 1. Pick a Bundle

Browse [`web-bundles/`](https://github.com/bmad-code-org/BMAD-METHOD/tree/main/web-bundles) and pick the one for the work you're doing. Open the bundle folder; you'll see `SKILL.md`, `INSTRUCTIONS.md`, and any data files (CSVs, templates, validation checklists).

### 2. Install in Google Gemini

1. Go to [gemini.google.com](https://gemini.google.com) and create a new Gem.
2. Name the Gem after the bundle (for example, **Market & Industry Research**).
3. Upload the bundle's `SKILL.md` and any data files (`.csv`, `.md` templates, validation files) as knowledge files.
4. Open the bundle's `INSTRUCTIONS.md`, scroll to the **PASTE BOUNDARY** line, and paste everything below it into the Gem's instructions box.
5. Save.

Some bundles call for Deep Research. If yours does, enable it from the Gemini prompt bar (Tools → Deep Research) before starting each session.

### 3. Install in ChatGPT

1. Go to [chatgpt.com](https://chatgpt.com) and create a new Custom GPT under **Explore GPTs → Create**.
2. Name the GPT after the bundle.
3. Under **Configure → Knowledge**, upload the bundle's `SKILL.md` and any data files.
4. Open the bundle's `INSTRUCTIONS.md`, scroll to the **PASTE BOUNDARY** line, and paste everything below it into **Instructions**.
5. Under **Capabilities**, turn on **Web Browsing** if the bundle's install steps call for it.
6. Save.

If the bundle integrates Deep Research, enable it before each session via the composer "+" menu or **Tools → Run deep research**.

### 4. Customize the Persona (Optional)

Each bundle's `INSTRUCTIONS.md` includes a **Persona Swap Example** above the paste boundary. Replace the `[persona]` block in your installed instructions with the swap example to change voice without changing the protocol. You can also write your own persona from scratch; the protocol stays the same.

### 5. Run a Session

Open the Gem or Custom GPT and send your first message. The persona greets you in character and starts the discovery conversation defined in `SKILL.md`. Canvas opens automatically when relevant.

When you're done, export or copy the Canvas document into your repo or hand it off to the next BMad skill in your IDE.

## What You Get

- A reusable Gem or Custom GPT scoped to one BMad planning capability.
- Polished artifacts (briefs, PRDs, research reports, UX specs) ready to drop into your IDE for implementation.
- Planning conversation runs on your existing web LLM subscription instead of metered IDE tokens.

:::caution[Persona drift]
Web LLMs occasionally drop persona partway through long sessions. If the model starts speaking out of character, remind it of its persona or start a fresh session.
:::

## Building Your Own

To turn an existing BMad skill into a web bundle, use the `bmad-os-skill-to-bundle` utility skill from [bmad-utility-skills](https://github.com/bmad-code-org/bmad-utility-skills). It produces the bundle files with persona inheritance from the owning agent and a swap-example contrast voice.
