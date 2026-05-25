---
title: 'Web Bundles'
description: BMad skills packaged for Google Gemini Gems and ChatGPT Custom GPTs
---

Run the planning side of BMad in your web LLM subscription, then bring the artifacts into your IDE.

## What is a Web Bundle?

A web bundle is a BMad skill repackaged as a one-click install for **Google Gemini Gems** and **ChatGPT Custom GPTs**. Each bundle is two files (sometimes three): a `SKILL.md` protocol you upload as a knowledge file, and an `INSTRUCTIONS.md` block you paste into the Gem or GPT instructions. The persona lives in the pasted instructions; the protocol lives in the knowledge file. Swap personas without touching the protocol.

V4 of BMad shipped web bundles. V6 brings them back, rewritten for the current Gem and Custom GPT platforms with Canvas, Deep Research, and image generation in mind.

## Why use them

Planning work and implementation work want different tools. Web bundles let each use the right one.

| Concern | Web LLM (Gem or GPT) | IDE (Claude Code, Cursor) |
| --- | --- | --- |
| Cost model | Flat-rate subscription | Metered tokens |
| Strongest at | Conversation, Canvas, Deep Research, images | Files, terminal, codebase context |
| Best for | Brainstorming, briefs, PRDs, research | Implementation, refactoring, code review |

Running a full PRD or market research conversation in an IDE burns tokens that a Gem or Custom GPT handles for the price of your existing subscription. The polished artifact then drops into your repo and Claude Code or Cursor takes it from there.

:::tip[Plan in the web, build in the IDE]
The cost saving compounds on longer engagements. A PRFAQ pass and three rounds of research in a Gem cost zero marginal dollars; the same work in an IDE is real spend.
:::

## What's in the shelf

The current set of bundles covers the analysis and planning phases:

| Bundle | Phase | Persona lineage |
| --- | --- | --- |
| Brainstorming Coach | Analysis | Osborn (default), Minto (swap) |
| Product Brief Coach | Analysis | Mary (BMad analyst) |
| PRFAQ Coach | Analysis | Working Backwards (Bezos) |
| PRD Coach | Planning | Cagan |
| UX Coach | Planning | Norman |
| Market & Industry Research | Analysis | Porter and Christensen |

Each bundle carries a default persona inherited from its owning BMad agent (where one exists) and a contrasting swap example to demonstrate the voice change pattern.

## How a session works

1. **Open the Gem or Custom GPT.** Persona greets in character and opens conversational discovery.
2. **Discover scope.** The persona asks what you're trying to do, what you have on hand, what constraints apply. No form fill.
3. **Do the work in Canvas.** The protocol opens Canvas at session start and updates it continuously. Mermaid diagrams and HTML tables go in alongside the prose.
4. **Hand off.** When you're done, you have a Canvas document you can export, paste into your repo, or feed to a BMad skill in your IDE for the next phase.

For bundles that integrate Deep Research (currently Market & Industry Research), the persona drafts a Deep Research brief mid-session for you to paste into Gemini's or ChatGPT's Deep Research mode, then ingests the returned report.

## When to use a web bundle

- You're doing the upfront thinking for a project and you want a focused tool with persona, Canvas, and Deep Research.
- You want to keep IDE token spend for actual coding.
- You're sharing the planning artifact with collaborators who don't have your IDE setup.

## When to stay in the IDE

- The work needs to read or modify code in your repo.
- You're already mid-implementation and want to keep context.
- You don't have a Gemini Advanced or ChatGPT Plus subscription.

## Building your own

Web bundles are generated from BMad skills using the `bmad-os-skill-to-bundle` utility skill. Point it at any BMad skill folder and it produces the bundle files with persona inheritance from the owning agent.

See the [how-to guide](../how-to/use-web-bundles.md) for installation steps.
