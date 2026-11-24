---
title: ""
template: ux-quick
version: 1.0.0
category: ux-product
description: "Lightweight single-flow UX spec: compact EXPERIENCE.md, states, and interactive mockup or wireframe."
not_for: "Multi-epic shared design systems (`ux-system`); full multi-screen epic contracts under an initiative (`ux-epic`); public marketing websites (`website-design`); trivial UI edits matching existing patterns (`bmad-build`)."
agents: [bmad-agent-ux-designer]
companions: [EXPERIENCE.md]
mode: fast
facilitation_order: [goal-and-surfaces, key-flow, states-and-microcopy, visual-direction-and-mockups, open-questions]
guidance: guidance-method.md
rubric: rubric-ux.md
lint: uv run "{project-root}/_bmad/method/scripts/lint_ux.py" --project-root "{project-root}" "{doc}"
status: draft
created: ""
updated: ""
---

<!-- purpose: Fast, focused UX contract for a single-flow feature, internal tool, CLI/dashboard panel, or clickable prototype without full system-spine overhead. -->

<!-- stance: Keep the footprint proportional to a single flow and stay light and fluid while exploring prototypes or rough comps. Coach with concrete options and interactive previews; inherit existing app or brand styles (`DESIGN.md` or shipped CSS) rather than inventing a new token system when modifying shipped UI, and offer to harden the settled flow into fuller durable UX contracts once the direction clicks. -->

<!-- opening: Read any ticket, existing UI code, `branding/DESIGN.md`, or user sketch first. Confirm the single primary surface, target device/form-factor, whether existing app styles govern visuals, and whether to explore lo-fi structure/flows first or jump straight to styled interactive screens. -->

<!-- inputs: Ticket or user prompt, existing UI styles/components (if brownfield), `imports/`, and desired flow/state behavior. -->

<!-- companions: Write compact `{run}/EXPERIENCE.md` with clear `#<section>` anchors linkable from a story or `bmad-build`. Add a compact `{run}/DESIGN.md` only if no existing UI exists and custom visual tokens are needed. -->

<!-- writing:
  - Keep `{doc}` brief as a summary pointing to `{run}/EXPERIENCE.md` and any promoted interactive mockup or wireframe.
  - Backtick `{token}` references in prose; keep concrete `mockups/` / `wireframes/` links inline and state once that `EXPERIENCE.md` wins on conflict.
  - Set companion `status: final` and `updated` at Close.
-->

<!-- done when: The primary surface, happy-path flow, critical edge states, copy/accessibility basics, and visual direction or existing-style inheritance are settled so a builder can implement cleanly in one pass. -->

# {title}

## Table of Contents

## Goal and surfaces
<!-- Link `{run}/EXPERIENCE.md` (and optional `DESIGN.md`), name the ticket or prompt, target form-factor, and the 1–3 screens or panels involved. -->

## Key flow
<!-- Primary named-protagonist flow end-to-end with entry trigger, numbered steps, climax beat, and failure branch. -->

## States and microcopy
<!-- Concise table covering empty, loading, error, and success states plus exact microcopy strings (include keyboard/accessibility notes only if requested or inherited). -->

## Visual direction and mockups
<!-- Existing styles inherited (or key visual picks) plus any `{workflow.creative_tools}` interactive prototype or wireframe promoted to `{run}/mockups/` or `{run}/wireframes/`. -->

## Open questions
<!-- optional. Unsettled UX questions with owner. -->
