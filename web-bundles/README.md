# BMad Web Bundles

V4 shipped web bundles. V6 brings them back, new and improved. Each bundle packages a BMad skill as a self-contained install for **Google Gemini Gems** and **ChatGPT Custom GPTs**, so you can run the planning work in your web LLM subscription before opening your IDE.

## Install

**Go to [bmadcode.com/web-bundles](https://bmadcode.com/web-bundles/).**

The site lists every bundle in a card grid, walks you through the Gemini and ChatGPT setup inline, and hands you the ZIP download in one click. That is the only supported install path.

Why a single front door:

- One place to keep install steps current as Gemini and ChatGPT evolve.
- Versioned releases. Every shelf update ships as a tagged GitHub Release; the site always points at the newest tag.
- One signup gets you on the list for new bundles as they ship.

## Why use them

- **Cost.** Web LLM subscriptions are flat-rate. Run brainstorming, briefs, PRDs, and research there instead of burning IDE tokens.
- **Right tool for the job.** Planning conversations want Canvas, image generation, and Deep Research. Implementation wants the codebase and a terminal. Use each where it's strongest.
- **Persona swapping.** Every bundle ships a default persona and a contrasting swap example. Change voices without touching the protocol.

## The shelf

| Bundle | Purpose |
| --- | --- |
| Brainstorming Coach | Facilitated ideation across 60 techniques. Defaults to **Carson** (Osborn lineage); swap to **Mary** for analyst rigor. |
| Product Brief Coach | Build a product brief through guided discovery. Create, Update, or Validate modes. |
| PRFAQ Coach | Working Backwards PRFAQ challenge (Bezos lineage) to forge and stress-test product concepts. |
| PRD Coach | Product Requirements Document with built-in validation (Cagan lineage). |
| UX Coach | UX patterns, flows, and design specifications. Pairs with Google Stitch. |
| Market & Industry Research | Market research, customer JTBD, competitive landscape, regulatory and technical lenses. Deep Research mode integrated. |

Requires Gemini Advanced (for Gems) or ChatGPT Plus / Pro / Business / Enterprise (for Custom GPTs). Deep Research has its own plan limits.

## Build your own

Web bundles are generated from BMad skills using the [`bmad-os-skill-to-bundle`](https://github.com/bmad-code-org/bmad-utility-skills) utility skill. Point it at any BMad skill folder and it produces a `SKILL.md`, an `INSTRUCTIONS.md`, and any required data files, with persona inheritance from the owning agent.

## What's in this folder

This folder is the **source** for the shelf, packaged into ZIPs and attached to GitHub Releases. End users do not install from here. If you are a contributor working on a bundle, the bundle directories and `bundles.json` are the files you edit; the [release packager](../tools/bundle-web-bundles.js) zips them and updates the release.

## Concept docs

[What web bundles are and when to use them](https://docs.bmad-method.org/explanation/web-bundles/).
