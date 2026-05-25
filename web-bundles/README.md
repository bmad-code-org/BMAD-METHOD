# BMad Web Bundles

V4 shipped web bundles. V6 brings them back, new and improved. Each bundle packages a BMad skill as a self-contained install for **Google Gemini Gems** and **ChatGPT Custom GPTs**, so you can run the planning work in your web LLM subscription before opening your IDE.

## Why use these

- **Cost.** Web LLM subscriptions are flat-rate. Run brainstorming, briefs, PRDs, and research there instead of burning IDE tokens.
- **Right tool for the job.** Planning conversations want Canvas, image generation, and Deep Research. Implementation wants the codebase and a terminal. Use each where it's strongest.
- **Persona swapping.** Every bundle's `INSTRUCTIONS.md` carries a default persona and a contrasting swap example. Change voices without touching the protocol.

## The shelf

| Bundle | Purpose |
| --- | --- |
| [`brainstorming-coach/`](./brainstorming-coach/) | Facilitated ideation across 60 techniques. Defaults to **Carson** (Osborn lineage); swap to **Mary** for analyst rigor. |
| [`product-brief-coach/`](./product-brief-coach/) | Build a one-page product brief through guided discovery. |
| [`prfaq-coach/`](./prfaq-coach/) | Working Backwards PRFAQ challenge (Bezos lineage) to forge and stress-test product concepts. |
| [`prd-coach/`](./prd-coach/) | Product Requirements Document with built-in validation (Cagan lineage). |
| [`ux-coach/`](./ux-coach/) | UX patterns, flows, and design specifications. |
| [`market-and-industry-research/`](./market-and-industry-research/) | Market research, customer JTBD, competitive landscape, regulatory and technical lenses. Deep Research mode integrated. |

## Install

Each bundle has its own `INSTRUCTIONS.md` with platform-specific setup steps. Pattern is the same:

1. Create a Gem (Gemini) or Custom GPT (ChatGPT).
2. Upload the bundle's `SKILL.md` (and any data files) as knowledge.
3. Paste the block below the **PASTE BOUNDARY** into the instructions box.
4. Enable Web Browsing / Deep Research if the bundle's install steps call for it.

Gemini Gems require Gemini Advanced. ChatGPT Custom GPTs require Plus, Pro, Business, or Enterprise; Deep Research has its own plan limits.

## Build your own

Web bundles are generated from BMad skills using the [`bmad-os-skill-to-bundle`](https://github.com/bmad-code-org/bmad-utility-skills) utility skill. Point it at any BMad skill folder and it produces a `SKILL.md`, an `INSTRUCTIONS.md`, and any required data files, with persona inheritance from the owning agent.

## Docs

- [What web bundles are and when to use them](https://docs.bmad-method.org/explanation/web-bundles/)
- [How to install a web bundle](https://docs.bmad-method.org/how-to/use-web-bundles/)
