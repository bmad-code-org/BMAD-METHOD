---
title: 'Use Web Bundles'
description: Decide whether to run BMad planning in a Gemini Gem or ChatGPT Custom GPT, install a bundle, keep it updated, and customize it without losing updates.
sidebar:
  order: 4
---

Plan in the web, build in the IDE. A web bundle runs BMad planning on your
Gemini or ChatGPT subscription. You copy the artifact into your repo and
continue in Claude Code or Cursor.

## What a web bundle is

A web bundle is a BMad skill repackaged for installation as a **Google
Gemini Gem** or **ChatGPT Custom GPT**. Once installed, it is a reusable
Gem or Custom GPT scoped to one BMad planning capability. Each bundle
contains:

- `SKILL.md`, the protocol, uploaded as a knowledge file.
- `INSTRUCTIONS.md`, a block you paste into the Gem or GPT instructions. The persona lives here.
- Any data files the skill needs: CSVs, templates, validation checklists, and content loaded as needed.

Swap the persona in the pasted instructions without touching the protocol
in the knowledge file.

## Why use one

Planning and implementation work better in different tools.

| Concern | Web LLM (Gem or GPT) | IDE (Claude Code, Cursor) |
| --- | --- | --- |
| Cost model | Flat-rate subscription | Metered tokens |
| Strongest at | Conversation, Canvas, Deep Research, images | Files, terminal, codebase context |
| Best for | Brainstorming, briefs, PRDs, research | Implementation, refactoring, code review |

A full PRD or market research conversation in an IDE burns tokens that a Gem
or Custom GPT handles for the price of your existing subscription. The
saving grows with every round of planning you do there.

## When to use a bundle, and when to stay in the IDE

Use a web bundle when:

- You are doing the upfront thinking for a project and want a focused tool with persona, Canvas, and Deep Research.
- You want to keep IDE token spend for actual coding.
- You are sharing the planning artifact with collaborators who do not have your IDE setup.

Stay in the IDE when:

- The work needs to read or modify code in your repo.
- You are already mid-implementation and want to keep context.
- You do not have a Gemini Advanced or ChatGPT paid subscription.

## The shelf

The current bundles cover the analysis and planning phases. Each carries a
default persona (from the matching BMad agent, when there is one) and a
contrasting swap persona that shows the voice-change pattern.

| Bundle | Phase | Default persona | Swap persona |
| --- | --- | --- | --- |
| Brainstorming Coach | Analysis | Carson (Osborn lineage) | Mary (BMad analyst) |
| Product Brief Coach | Analysis | Mary (BMad analyst) | Iris (thinking-partner voice) |
| PRFAQ Coach | Analysis | Mary (BMad analyst) | Bezos (Working Backwards) |
| PRD Coach | Planning | John (BMad PM, Cagan lineage) | Ezra (calmer coaching) |
| UX Coach | Planning | Sally (BMad UX designer, Norman method) | Kenji (Rams and Zhuo discipline) |
| Market & Industry Research | Analysis | Mary (Porter and Christensen anchors) | Geoff (Moore and Dunford lineage) |

## How a session works

1. **Open the Gem or Custom GPT.** The persona greets in character and opens conversational discovery.
2. **Discover scope.** The persona asks what you are trying to do, what you have on hand, and what constraints apply. It does not use a form.
3. **Do the work in Canvas.** The protocol opens Canvas at session start and updates it continuously. Mermaid diagrams and HTML tables go in alongside the prose.
4. **Hand off.** You finish with a Canvas document you can export, paste into your repo, or feed to a BMad skill in your IDE for the next phase.

Market & Industry Research is the bundle that uses Deep Research. Its
persona drafts a Deep Research brief mid-session for you to paste into
Gemini's or ChatGPT's Deep Research mode, then ingests the returned report.

## Install a bundle

Install from **[bmadcode.com/web-bundles](https://bmadcode.com/web-bundles/)**.
The site is the only supported install path. It keeps the steps current as
Gemini and ChatGPT change, and it always points at the newest tagged
release. Setup is not one-click, but every bundle follows the same pattern.

On the site you will:

1. Pick a bundle from the card grid.
2. Open the install modal and switch between the **Gemini Gem** and **ChatGPT GPT** tabs for the platform-specific steps.
3. Download the bundle ZIP. The download needs a one-time free signup, and that signup is what puts you on the list for new bundles.
4. Follow the inline steps: create the Gem or Custom GPT, upload the knowledge files, paste the instructions block, save.

:::note[Prerequisites]
- **Gemini Gems**: Gemini Advanced subscription.
- **ChatGPT Custom GPTs**: Plus, Pro, Business, or Enterprise plan.
- **Deep Research** (Market & Industry Research): Deep Research enabled on your plan. It has its own plan limits.
:::

## Customize the persona

Each bundle's `INSTRUCTIONS.md` (inside the ZIP) includes a **Persona Swap
Example** above the paste boundary. Replace the `[persona]` block in your
installed instructions with the swap example to change the voice without
changing the protocol. You can also write your own persona from scratch;
the protocol stays the same.

:::caution[Persona drift]
Web LLMs occasionally drop the persona partway through long sessions. If the
model starts speaking out of character, remind it of its persona or start a
fresh session.
:::

## Update a bundle

When you pull a newer version of a bundle, the typical update is to its
knowledge files: the `SKILL.md` protocol and any attached templates, CSVs,
or validation checklists. Re-upload those into your Gem or Custom GPT to
take the update. The instructions block usually does not change.

Keep your customizations in the **instructions block**, not in the
knowledge files. The instructions block holds the persona, preferences, and
any local overrides; the knowledge files are the protocol the bundle ships
with. If you keep customization in the instructions block, an update is
re-uploading the knowledge files, not merging your edits back into them.

:::tip[Customize the instructions, attach the knowledge]
Persona swaps, default user name, team-specific rules, and preferred
phrasing belong in the pasted instructions block. Leave the knowledge
files as shipped so you can refresh them without losing your changes.
:::

## Build your own

To turn an existing BMad skill into a web bundle, use the
`bmad-os-skill-to-bundle` utility skill from
[bmad-utility-skills](https://github.com/bmad-code-org/bmad-utility-skills).
Point it at any BMad skill folder. It produces the bundle files, using
the skill's agent as the default persona and adding a contrasting swap
example.

To submit your bundle to the shelf, open a PR on
[BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) that adds the
bundle directory and an entry in `web-bundles/bundles.json`.
