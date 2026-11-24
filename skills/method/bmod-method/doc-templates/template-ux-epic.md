---
title: ""
template: ux-epic
version: 1.0.0
category: ux-product
description: "Epic UX design: inherits system DESIGN.md; defines epic screens, flows, states, microcopy, and mockups."
not_for: "Initiative-wide design tokens and global IA (`ux-system`); public marketing site (`website-design`); a standalone small tool with no parent system (`ux-quick`); a single story fitting existing screens and tokens (`bmad-build`)."
agents: [bmad-agent-ux-designer]
companions: [EXPERIENCE.md]
facilitation_order: [context-and-inherited-system, screens-and-ia, flows-and-journeys, states-and-edge-cases, component-and-visual-deltas, microcopy-and-accessibility, mockups-and-visual-references, system-impact-and-deferred, open-questions]
guidance: guidance-method.md
rubric: rubric-ux.md
lint: uv run "{project-root}/_bmad/method/scripts/lint_ux.py" --project-root "{project-root}" "{doc}"
status: draft
created: ""
updated: ""
---

<!-- purpose: Concrete screen, flow, state, microcopy, and interactive mockup contract for one epic — inheriting the initiative `DESIGN.md` read-only and giving Sofia (`tickets.toml`) and Amelia (`bmad-build`) exact `EXPERIENCE.md#<section>` and mockup anchors. -->

<!-- stance: Design strictly inside this epic. Inherit parent `DESIGN.md` and `ux-system` rules read-only without copying tokens or restating global IA. Coach non-UX users with interactive visual previews and concrete flow walkthroughs rather than abstract jargon. Keep per-story task lists and implementation code out — `bmad-build` plans those against live code. -->

<!-- opening: Read the epic ticket (`epic-*.md`), `prd-epic` (if any), parent `ux-system` (`DESIGN.md` + `EXPERIENCE.md`, if any), `arch-spine`/`arch-epic` constraints, and affected shipped UI before asking anything. Play back what parent UX and code already settle, then focus on the screens, flows, edge states, and microcopy this epic introduces. -->

<!-- inputs: Epic ticket Requirements (`R<n>`), `prd-epic` (`E0X-FR-xx`, journeys, error paths), parent `DESIGN.md` / `ux-system`, live UI components, `imports/`, and user interaction preferences. -->

<!-- companions: Always write `{run}/EXPERIENCE.md` with clean, linkable `##` sections (`EXPERIENCE.md#<section>`) mapped to epic `E0X-FR-xx` / `R<n>` IDs, naming parent `DESIGN.md` in frontmatter `sources:` when inherited. Add a compact `{run}/DESIGN.md` delta or standalone token spec only when no parent `DESIGN.md` exists or this epic introduces net-new tokens/components. -->

<!-- writing:
  - Keep `{doc}` concise as the epic UX run summary/router linking `{run}/EXPERIENCE.md`, parent or delta `DESIGN.md`, and promoted mockups/wireframes.
  - Cite `E0X-FR-xx` (or `R<n>`) and `{path.to.token}` verbatim inside backticks in prose; keep `DESIGN.md` YAML frontmatter `{path.to.token}` links resolving against declared or parent-linked tokens.
  - Render interactive wireframes or key-screen prototypes via `{workflow.creative_tools}` (or ingest `{workflow.design_handoffs}` exports via `references/external-design-tools.md`) into `{run}/.working/`, verify surface mock coverage before Review, promote keepers to `{run}/mockups/` or `{run}/wireframes/`, link inline at the relevant `EXPERIENCE.md` sections, and state spines-win-on-conflict once.
  - Log any net-new global pattern or token needing parent adoption under `System impact and deferred`, and set companion `status: final` and `updated` at Close.
-->

<!-- done when: Every epic requirement (`E0X-FR-xx` / `R<n>`) maps to concrete screens and flows; every surface covers empty, loading, error, focus, offline, and permission states; microcopy and accessibility specifics are settled; promoted mockups/wireframes and `EXPERIENCE.md#<section>` headings are linkable for story tickets; `lint_ux.py` finds zero broken refs/tokens; and any parent `ux-system` impact is logged. -->

# {title}

## Table of Contents

## Context and inherited system
<!-- Link the epic ticket, `prd-epic` (if any), parent `ux-system` (`DESIGN.md` + `EXPERIENCE.md`), and governing architecture notes. State whether `{run}/DESIGN.md` is omitted (purely inheriting parent tokens) or included for epic deltas/standalone tokens. -->

## Screens and IA
<!-- Inventory every new or changed surface, dialog, drawer, and entry route for this epic (`| Surface | Reached from | Purpose | Covers FR/R |`) mirrored into `{run}/EXPERIENCE.md`. -->

## Flows and journeys
<!-- Named-protagonist epic journeys with numbered steps, climax beat, and recovery/failure branches recorded in `{run}/EXPERIENCE.md#key-flows`, citing `E0X-FR-xx` / `R<n>` verbatim. -->

## States and edge cases
<!-- Matrix across epic surfaces covering cold load, empty, validation/submission error, permission denied, partial/stale data, and offline/retry behavior recorded in `{run}/EXPERIENCE.md#state-patterns`. -->

## Component and visual deltas
<!-- Epic-specific component behaviors (`EXPERIENCE.md#component-patterns`) and any local visual tokens or extensions referencing inherited `{path.to.token}` values (or recorded in local `DESIGN.md` delta). -->

## Microcopy and accessibility
<!-- Specific UI copy Do/Don't examples, empty/error wording, keyboard traversal, ARIA/screen-reader announcements, and target-size/contrast notes beyond parent floor. -->

## Mockups and visual references
<!-- List `{workflow.creative_tools}` renders promoted to `{run}/mockups/` or `{run}/wireframes/`, user `imports/`, or `{workflow.design_handoffs}` outputs, noting which `EXPERIENCE.md` section links each. -->

## System impact and deferred
<!-- `"None"` when parent `ux-system` holds cleanly; otherwise list new shared tokens, patterns, or IA adjustments to fold upstream, plus polish items deferred past this epic. -->

## Open questions
<!-- optional. Blocking or non-blocking epic UX questions naming who decides and which story needs it. -->
