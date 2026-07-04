---
name: bmad-apf-generate-design-system
description: Generate a complete design system with tokens, typography, colors, and component catalog.
---

# Generate Design System — AI Product Factory

## On Activation

1. Load `{apf_artifacts}/design/brand-guidelines.md` (or run brand agent first).
2. Load `{apf_artifacts}/ux/wireframes/` and `{target_platform}`.

## Step 1: Design Tokens

Define:
- Color palette (primary, secondary, semantic, dark mode)
- Typography scale
- Spacing scale (4px/8px grid)
- Border radius, shadows, elevation

Output: `{apf_artifacts}/design/tokens.yaml`

## Step 2: Component Catalog

For each wireframe screen, define reusable components:
- Buttons, inputs, cards, modals
- Navigation components
- Empty states, loading skeletons

Output: `{apf_artifacts}/design/component-catalog.md`

## Step 3: Theme Specification

Light and dark theme definitions.
Output: `{apf_artifacts}/design/design-system.md`

## Step 4: Platform Adaptation

Apply platform guidelines:
- iOS: Apple HIG (`knowledge/apple-hig-summary.md`)
- Android: Material Design (`knowledge/material-design-summary.md`)
- Web: Tailwind/Shadcn conventions

## Handoff

Platform implementation agent or `bmad-apf-build-mvp`.

Run `{workflow.on_complete}`.
