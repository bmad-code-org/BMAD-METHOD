---
name: bmad-apf-generate-ux
description: Generate UX artifacts — user flows, wireframes, navigation — from PRD and personas.
---

# Generate UX — AI Product Factory

Produce complete UX specifications ready for design system and implementation.

## On Activation

1. Load `{apf_artifacts}/product/` (PRD, MVP features) and `{apf_artifacts}/founder/personas/`.
2. Load UX checklist: `file:{project-root}/expansion-packs/ai-product-factory/checklists/ux-checklist.md`

## Step 1: User Flows

Invoke `bmad-apf-user-flow` logic. For each core persona, map:
- Onboarding flow
- Core value loop
- Settings/account
- Error/empty/loading states
- Paywall (if applicable)

Output: `{apf_artifacts}/ux/user-flows.md`

## Step 2: Navigation Architecture

Invoke `bmad-apf-navigation` logic. Define:
- Primary navigation pattern (tabs, drawer, stack)
- Information architecture
- Deep link map

Output: `{apf_artifacts}/ux/navigation-map.md`

## Step 3: Wireframes

Invoke `bmad-apf-wireframe` logic. For each screen in user flows:
- Layout structure
- Content hierarchy
- Interaction notes

Output: `{apf_artifacts}/ux/wireframes/` (one file per screen group)

## Step 4: Accessibility Review

Invoke `bmad-apf-accessibility` logic. Audit wireframes against WCAG 2.1 AA.

Output: `{apf_artifacts}/ux/accessibility-audit.md`

## Handoff

- **Design:** `bmad-apf-generate-design-system`
- **Implementation:** Platform agent based on `{target_platform}`

Run `{workflow.on_complete}`.
