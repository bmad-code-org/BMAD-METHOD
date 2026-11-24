---
title: ""
template: brand-identity
version: 1.0.0
category: ux-strategy
description: "Reusable corporate branding package: logos, DESIGN.md tokens, BRAND.md rules, and interactive brand book."
not_for: "Single-product UI screens and state flows (`ux-system`, `ux-epic`); marketing website page structure (`website-design`); brownfield UI usability audit (`ux-audit`)."
agents: [bmad-agent-ux-designer]
companions: [DESIGN.md, BRAND.md]
facilitation_order: [brand-essence-and-positioning, comp-and-aesthetic-direction, logo-and-mark-system, color-and-typography-system, voice-and-imagery, brand-applications-and-bmad-reuse, open-questions]
guidance: guidance-method.md
rubric: rubric-ux.md
lint: uv run "{project-root}/_bmad/method/scripts/lint_ux.py" --project-root "{project-root}" "{doc}"
output: "{output_folder}/branding"
view: always
status: draft
created: ""
updated: ""
---

<!-- purpose: Establish a durable, agent-ready corporate brand kit (`DESIGN.md`, `BRAND.md`, vector `logos/`, and an interactive HTML Brand Book) that every product UI, slide deck, report, and website in the org can inherit automatically. -->

<!-- stance: Coach non-designers step by step with concrete choices rather than abstract branding buzzwords. Never impose a generic template aesthetic. Push for distinct visual character, crisp typography, verified contrast, and flat-first scalable marks that survive monochrome and 32x32 favicon rendering. -->

<!-- opening: Ask what the company or brand does, who it wants to look trustworthy or exciting to, and whether any logo, site, screenshots, or colors already exist in `imports/`. If starting fresh, offer to explore real visual comps and interactive color registers before locking anything. -->

<!-- inputs: Company positioning, target audience feel, existing brand files/assets in `{run}/imports/`, visual comps/anti-patterns, and user picks across rendered options. -->

<!-- companions: Write `{run}/DESIGN.md` (Google Labs token spec: colors with verified contrast, typography pairings + fallbacks, radii, spacing, component baselines, Do's/Don'ts) and `{run}/BRAND.md` (brand positioning, voice rules, logo construction, clear space, minimum sizes, misuse rules, imagery posture). Save clean SVG logo marks/lockups under `{run}/logos/` (plus optional image-gen explorations in `.working/`). -->

<!-- layout: Interactive HTML Brand Book rendered with full craft: live light/dark switcher, click-to-copy hex swatches with verified WCAG contrast badges, interactive type ramp specimens, SVG logo lockups tested across light/dark/monochrome/32px favicon frames, and realistic sample document and UI preview cards. -->

<!-- writing:
  - Enforce Flat-First Logo Discipline: craft vector SVG concepts in `{run}/logos/` that hold legibility in single-color monochrome, on dark and light backgrounds, and at 32x32 favicon size; link every kept asset from `BRAND.md` and `DESIGN.md` so none stay orphaned.
  - Populate `{run}/DESIGN.md` so any coding agent or `bmad-facilitate` `workflow.style` config can point at it directly with verified light/dark contrast ratios and zero placeholder hexes.
  - Keep `{doc}` concise as the brand decision index linking `DESIGN.md`, `BRAND.md`, `logos/`, and the wiring instructions.
  - Include a ready-to-paste `bmad-facilitate.toml` (`style = "file:..."`) and `persistent_facts` snippet in `BRAND.md` and `Brand applications and BMad reuse` so every future BMad HTML artifact and build inherits the brand automatically.
  - Set `status: final` and `updated` on `DESIGN.md` and `BRAND.md` alongside `{doc}` at Close.
-->

<!-- done when: Positioning, aesthetic direction, and anti-patterns are settled; vector SVG logo concepts in `logos/` pass monochrome, dark/light, and 32px clarity rules with zero broken or orphaned links; `DESIGN.md` passes `lint_ux.py` contrast and token checks; `BRAND.md` captures voice, logo clear-space, and imagery posture; and the BMad reuse snippet is verified. -->

# {title}

## Table of Contents

## Brand essence and positioning
<!-- Company promise, personality traits (3–4 paired opposites like "direct, not abrupt"), target impression, and what this brand refuses to look like. -->

## Comp and aesthetic direction
<!-- Real brands, sites, or screenshots dissected into specific likes, rejects, and taste dials (density, warmth, motion, variance) captured in `BRAND.md`. -->

## Logo and mark system
<!-- Concept direction, symbol vs. wordmark vs. monogram lockups stored under `logos/`, clear-space ratio, minimum sizes (including 32px favicon), monochrome behavior, and explicit misuse Do/Don'ts recorded in `BRAND.md`. -->

## Color and typography system
<!-- Semantic color roles (`surface`, `ink`, `primary`, `accent`, dark-mode pairings) with verified WCAG contrast ratios, heading/body/mono webfont + system fallback pairings, type scale, radii, and elevation captured cleanly in `DESIGN.md`. -->

## Voice and imagery
<!-- Copy cadence, Do/Don't microcopy table, illustration/photography aesthetic rules, and diagram styling recorded in `BRAND.md`. -->

## Brand applications and BMad reuse
<!-- Concrete starter rules for web UI, docs/reports, and decks, plus copy-paste `_bmad/custom/bmad-facilitate.toml` (`style = "file:..."`) and `persistent_facts` wiring so every BMad HTML view and UI build uses this package automatically. -->

## Open questions
<!-- optional. Trademark checks, custom font licensing, print assets, or photography shoots queued with owners. -->
