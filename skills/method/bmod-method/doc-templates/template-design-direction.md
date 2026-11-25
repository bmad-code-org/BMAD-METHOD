---
title: ""
template: design-direction
version: 1.0.0
category: ux-strategy
description: "Visual direction workshop: dissect comps and screenshots, set taste dials, explore themes, or bridge Stitch/Claude Design/Figma."
not_for: "Full multi-epic product IA and state specs (`ux-system`); company-wide logo and branding package (`brand-identity`); single-epic screen updates (`ux-epic`)."
agents: [bmad-agent-ux-designer]
companions: [DESIGN.md]
facilitation_order: [context-and-audience, comp-and-inspiration-dissection, taste-dials-and-anti-patterns, visual-explorations, token-foundation, external-tool-bridge, open-questions]
guidance: guidance-method.md
rubric: rubric-ux.md
view: offer
status: draft
created: ""
updated: ""
---

<!-- purpose: Help the user move beyond vague labels like "clean and modern" by dissecting real comps/screenshots, setting concrete taste dials and anti-patterns, exploring interactive HTML visual directions, and optionally prompting or ingesting Google Stitch, Claude Design, Figma, or `awesome-design-md` into a starter `DESIGN.md`. -->

<!-- stance: Never ask the user to design in the abstract or pick hex codes blind. Give concrete visual comparisons, draw out what specifically works or feels wrong in real examples, and reject generic AI clichés (default Inter/purple gradients/identical rounded cards). Use the caller-supplied `external-design-tools.md` reference (or `bmad-agent-ux-designer`'s installed reference if present; otherwise follow the writing rules below directly) whenever working with external generators, and offer to harden the settled direction into fuller UX, website, or brand contracts once it clicks. -->

<!-- opening: When the user brings an existing `DESIGN.md`, read it upfront so broken hexes, missing tokens, or contrast issues surface early. Ask what we are styling, whether an existing `branding/DESIGN.md` or UI system (like shadcn) applies, and ask for 2–4 URLs, screenshots, or visual comps they like or hate (if none, offer to generate contrasting starter directions via creative tools or direct interactive HTML). -->

<!-- inputs: Ticket/Trigger Map (if any), existing `branding/DESIGN.md`, screenshots/URLs/`imports/`, `awesome-design-md` references, or external exports from Stitch/Claude Design/Figma. -->

<!-- writing:
  - Record specific reactions to real comps (`Source`, `Take this`, `Reject this`, `Why`) rather than vague adjectives.
  - Lock explicit Taste Dials (`Visual Density`, `Layout Variance`, `Motion Intensity`, `Surface Temperature`, `Border vs. Shadow`), named `Anti-patterns`, and concrete token values in `{run}/DESIGN.md`.
  - When bridging an external design tool, generate a paste-ready outbound brief OR distill returned screenshots/HTML/`.stitch/DESIGN.md`/Figma tokens cleanly into `{run}/DESIGN.md` (noting contrast/mode gaps directly).
  - Keep `{doc}` as the decision record linking `{run}/DESIGN.md`, promoted `.working/` explorations in `mockups/`, and any `imports/`. Set `DESIGN.md` `status: final` and `updated` at Close.
-->

<!-- done when: Real comps or rendered visual explorations settled the aesthetic direction; taste dials and explicit anti-patterns are locked; `{run}/DESIGN.md` tokens and contrast hold; and any external-tool prompt or imported distillation is verified against `DESIGN.md`. -->

# {title}

## Table of Contents

## Context and audience
<!-- What product, site, or tool this serves, inherited brand kit or UI library (if any), target surfaces, and primary emotional impression from `trigger-map` or user intent. -->

## Comp and inspiration dissection
<!-- Concrete 2–4 sites, apps, screenshots, or reference systems (`imports/`), documenting specific layout, typographic, color, and interaction choices to steal vs. reject and why. -->

## Taste dials and anti-patterns
<!-- Settled positions across Visual Density (1–5), Layout Variance (symmetric vs. editorial asymmetry), Motion Intensity (still vs. expressive), Surface Contrast/Warmth, and an explicit Do-Not-Do anti-slop list. -->

## Visual explorations
<!-- Interactive color-theme and hero design-direction renders (`.working/`, promoted keepers in `mockups/`), recording which elements won or lost during user review. -->

## Token foundation
<!-- Link and summarize `{run}/DESIGN.md`: verified semantic colors (light/dark if needed), heading/body/mono font pairings, scale/radius/elevation rules, and component direction ready for `ux-system`, `website-design`, or `bmad-build`. -->

## External tool bridge
<!-- optional. Outbound paste-ready prompt for Stitch, Claude Design, Figma Make, Penpot, or v0 OR inbound distillation notes linking imported artifacts and naming what stays settled in `DESIGN.md`. -->

## Open questions
<!-- optional. Remaining visual experiments or stakeholder sign-offs needed before product UX or build. -->
