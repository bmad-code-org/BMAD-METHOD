---
title: ""
template: ux-system
version: 1.0.0
category: ux-product
description: "Initiative UX system: DESIGN.md visual tokens and EXPERIENCE.md shared IA, components, and accessibility."
not_for: "One epic's screen flows and mockups under an existing design system (`ux-epic`); corporate brand kit and logo (`brand-identity`); public marketing site (`website-design`); single-flow tool (`ux-quick`); single story fitting existing patterns (`bmad-build`)."
agents: [bmad-agent-ux-designer]
companions: [DESIGN.md, EXPERIENCE.md]
facilitation_order: [design-brief-and-foundation, visual-identity-and-tokens, information-architecture, component-and-state-patterns, interaction-and-accessibility, key-system-flows, artifacts-and-handoffs, open-questions]
guidance: guidance-method.md
rubric: rubric-ux.md
lint: uv run "{project-root}/_bmad/method/scripts/lint_ux.py" --project-root "{project-root}" "{doc}"
status: draft
created: ""
updated: ""
---

<!-- purpose: Shared UX contract across epics: DESIGN.md visual identity tokens and EXPERIENCE.md global navigation, behavioral rules, state patterns, accessibility floor, and cross-epic flows. -->

<!-- stance: Elicit and capture the user's design direction — never impose a house style or volunteer colors unless a brand/system is already confirmed. Coach non-UX users by showing concrete options via `{workflow.creative_tools}` or dissecting real examples rather than asking UX theory questions. Read `{skill-root}/references/design-md-spec.md`, `{workflow.design_md_examples}`, `{workflow.experience_md_examples}`, and `{skill-root}/references/external-design-tools.md` when external tools or imports are used. Apply the Coupling Test: system tokens, shared chrome, global interaction primitives, and accessibility floor live here; per-epic screen details, field microcopy, and epic mockups wait for `ux-epic`. -->

<!-- opening: When the user brings an existing `DESIGN.md` or `EXPERIENCE.md`, run `uv run "{project-root}/_bmad/method/scripts/lint_ux.py" --project-root "{project-root}" <path>` upfront so hex, section-order, contrast, or token issues surface early. Read any active ticket (`initiative-*.md` or `program-*.md`), `trigger-map`, `branding/DESIGN.md`, `design-direction`, PRD, or existing codebase/design system before asking anything. Confirm form-factor, whether a brand kit or UI library (such as shadcn or an internal system) is inherited, whether any formal accessibility standard should apply (opt-in — keep only basic human legibility if none is requested), whether to explore lo-fi structure/flows first or go straight to styled visual explorations (`{workflow.creative_tools}`), and where external tools (`{workflow.design_handoffs}`) help. -->

<!-- inputs: Ticket Requirements, `trigger-map` / `design-direction`, PRD journeys and invariants, existing `branding/` kit or `imports/`, and user-confirmed aesthetic, typography, and behavioral trade-offs. -->

<!-- writing:
  - Write the two peer contracts directly into `{run}/DESIGN.md` (Google Labs YAML frontmatter tokens + canonical sections) and `{run}/EXPERIENCE.md` (clean linkable `##` sections so tickets and `bmad-build` cite `EXPERIENCE.md#<section>` directly). Keep `{doc}` concise as the run router/index linking both companions and promoted artifacts rather than duplicating tables.
  - When inheriting a brand package or UI system, record only deltas and references rather than restating inherited defaults.
  - In prose, backtick `{path.to.token}` and UI interpolation tokens such as `` `{name}` ``; inside `DESIGN.md` YAML frontmatter, ensure every `{path.to.token}` points to a key defined in that frontmatter.
  - If starting from Stitch, Claude Design, Figma, or v0 exports, distill visuals into `DESIGN.md` and run a Missing-States & Behavior Pass to settle empty, loading, error, offline, permission, and accessibility rules in `EXPERIENCE.md`.
  - Invoke creative tools into `{run}/.working/`, confirm mock coverage across IA surfaces before Review, promote keepers to `{run}/mockups/` or `{run}/wireframes/`, link inline at the relevant spine section, and state once that `DESIGN.md` and `EXPERIENCE.md` win on conflict with any mock or import.
  - Set `status: final` and `updated` on both `{run}/DESIGN.md` and `{run}/EXPERIENCE.md` alongside `{doc}` at Close.
-->

<!-- done when: Form-factor and UI-system inheritance are settled; every `DESIGN.md` token referenced in components or prose resolves cleanly with verified contrast; every cross-epic surface, state pattern, and stated user need closes through a named-protagonist flow; kept visuals are promoted and linked inline; and `EXPERIENCE.md` headings form stable `#<section>` anchors. -->

# {title}

## Table of Contents

## Design brief and foundation
<!-- Link `DESIGN.md` and `EXPERIENCE.md`, active ticket/PRD/`trigger-map`/`branding/` sources, form-factor, platform scope, and inherited UI system (if any). Confirm whether this system establishes a new brand layer or extends an existing system. -->

## Visual identity and tokens
<!-- Summarize settled brand posture, color roles (light/dark if needed), typography ramp, radius, elevation, and spacing choices captured in `DESIGN.md`. Confirm color theme or design direction picks made with creative tools, `design-direction`, or imports. -->

## Information architecture
<!-- Record top-level surfaces, navigation chrome, route hierarchy, modal stacking limits, and responsive breakpoints in `EXPERIENCE.md#information-architecture`. Every stated system need must map to a surface. -->

## Component and state patterns
<!-- Capture shared component anatomy/tokens (`DESIGN.md#components`), behavioral component rules (`EXPERIENCE.md#component-patterns`), and global empty, loading, error, offline, focus, and permission states (`EXPERIENCE.md#state-patterns`). -->

## Interaction and accessibility
<!-- Lock shared interaction primitives, banned anti-patterns, voice/microcopy posture, and baseline legibility — adding formal accessibility rules (`EXPERIENCE.md#accessibility-floor` — WCAG targets, ARIA traversal, reduced motion) only when opted in or required by stakes. -->

## Key system flows
<!-- Named-protagonist journeys (`EXPERIENCE.md#key-flows`) covering cross-epic navigation and primary end-to-end loops with numbered steps, climax beat, and failure paths, citing ticket/PRD journey IDs verbatim. -->

## Artifacts and handoffs
<!-- Track `.working/` creative renders, user `imports/`, `{workflow.design_handoffs}` prompts/outputs, and promoted `{run}/mockups/` or `{run}/wireframes/` paths linked inline in the spines. -->

## Open questions
<!-- optional. Unsettled UX questions with owner and revisit trigger; log blocking visual/behavioral decisions before Finalize. -->
