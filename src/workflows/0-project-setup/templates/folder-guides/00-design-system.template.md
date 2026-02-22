# Design System: {{project_name}}

> Components, tokens, and patterns that grow from actual usage — not upfront planning.

**Created:** {{date}}
**Phase:** 7 — Design System (optional)
**Agent:** Freya (Designer)

---

## What Belongs Here

The Design System captures reusable patterns that emerge during UX Design (Phase 4). It is not designed upfront — it crystallizes from real page specifications.

**What goes here:**
- **Design Tokens** — Colors, spacing, typography, shadows
- **Components** — Buttons, inputs, cards, navigation elements
- **Patterns** — Layouts, form structures, content blocks
- **Visual Design** — Mood boards, design concepts, color and typography explorations
- **Assets** — Logos, icons, images, graphics

**What does NOT go here:**
- Page-specific content (that lives in `C-UX-Scenarios/`)
- Business logic or API specs (that's BMM territory)
- Aspirational components nobody uses yet

**When to skip this phase:**
- Using shadcn/ui or Material UI → the library IS your design system
- Simple sites with Tailwind → tokens in `tailwind.config` are enough

**Learn more:**
- WDS Course Module 12: Functional Components — Patterns Emerge
- WDS Course Module 13: Design System

---

## Folder Structure

```
D-Design-System/
├── 00-design-system.md          ← This file (hub + guide)
├── 01-Visual-Design/            [Early design exploration]
│   ├── mood-boards/             [Visual inspiration, style exploration]
│   ├── design-concepts/         [NanoBanana outputs, design explorations]
│   ├── color-exploration/       [Color palette experiments]
│   └── typography-tests/        [Font pairing and hierarchy tests]
├── 02-Assets/                   [Final production assets]
│   ├── logos/                   [Brand logos and variations]
│   ├── icons/                   [Icon sets]
│   ├── images/                  [Photography, illustrations]
│   └── graphics/                [Custom graphics and elements]
└── components/                  [Emerges during Phase 4]
    ├── interactive/             [Buttons, toggles, tabs]
    ├── form/                    [Inputs, selects, checkboxes]
    ├── layout/                  [Containers, grids, sections]
    ├── content/                 [Cards, lists, media blocks]
    ├── feedback/                [Alerts, toasts, progress]
    └── navigation/              [Menus, breadcrumbs, links]
```

**01-Visual-Design/** is used early — before or during scenarios — for exploring visual direction. Mood boards, color palettes, typography tests, and AI-generated design concepts live here.

**02-Assets/** holds final, production-ready assets. Logos, icons, images, and graphics that are referenced from page specifications.

**components/** grows organically during Phase 4 as patterns emerge across page specifications.

---

## For Agents

**Workflow:** `_bmad/wds/workflows/7-design-system/workflow.md`
**Agent trigger:** `DS` (Freya)
**Router:** `_bmad/wds/workflows/7-design-system/design-system-router.md`
**Templates:** `_bmad/wds/workflows/7-design-system/templates/`
**Guide:** `_bmad/wds/data/agent-guides/freya/design-system.md`

**Before creating any component:**
1. Check if it already exists in the chosen component library
2. Look at actual usage in `C-UX-Scenarios/` page specs — extract, don't invent
3. Load the component template from the workflow templates folder

**File naming:** Number all documents with a two-digit prefix: `01-design-tokens.md`, `02-button.md`, etc. Update the sections below as each file is created.

**Harm:** Designing an abstract component library before any pages exist. Components without real usage are decoration. They waste time and create maintenance burden for patterns nobody needs.

**Help:** Extracting patterns from real page specs. When three pages use similar card layouts, that's a component. The design system documents what emerged, making future pages faster and more consistent.

---

## Tokens

_Design tokens will be documented here as they emerge from page specifications._

---

## Components

_Components will be documented here as patterns emerge across scenarios._

---

_Created using Whiteport Design Studio (WDS) methodology_
