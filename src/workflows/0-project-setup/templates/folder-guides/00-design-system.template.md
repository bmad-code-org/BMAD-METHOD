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

## Spacing Scale

> **Bring your own or use ours.** If your project already has a design system with a spacing scale (Tailwind, Material, Carbon, your own tokens), use that. Map your token names below so page specs reference them consistently. If you don't have one yet, WDS provides a default 9-token scale to get started.

### Option A: Use your existing design system

Replace the table below with your system's spacing tokens. Any naming convention works — numbered (`spacing-4`), t-shirt (`sm`/`md`/`lg`), or your own. The only rule: page specs reference token names, never raw pixel values.

### Option B: WDS default scale

Nine tokens, symmetric around `space-md`. Freya will propose pixel values during the first design session.

| Token | Value | Use |
|-------|-------|-----|
| space-3xs | — | Hairline gaps (icon-to-label, inline elements) |
| space-2xs | — | Minimal spacing (badge padding, tight lists) |
| space-xs | — | Tight spacing (within compact groups) |
| space-sm | — | Small gaps (between related elements) |
| space-md | — | Default element spacing |
| space-lg | — | Comfortable spacing (card padding, form fields) |
| space-xl | — | Section padding |
| space-2xl | — | Section gaps |
| space-3xl | — | Page-level breathing room |

<!--
  The pixel values are yours to define. Common starting points:
  2/4/8/12/16/24/32/48/64 (8px grid) or 4/6/12/16/24/32/48/72.
  You can adjust later — specs stay valid because they reference names, not numbers.
-->

---

## Type Scale

> **Bring your own or use ours.** Same principle as spacing — if your project has a type system, map it here. If not, use the WDS default.

The type scale controls **visual size** — how big text looks. This is separate from semantic level (H1, H2, p) which controls **document structure**. An H2 in a sidebar might be `text-sm`. A tagline might be a `<p>` at `text-2xl`. The semantic level is for accessibility and SEO; the type token is for visual hierarchy.

Headings can have different typefaces, weights, and styles on different pages. A landing page H1 might be a serif display font at `text-3xl` italic. An admin page H1 might be clean sans-serif at `text-lg` medium. Each page spec declares its own typographic treatment — the type scale provides the shared sizing vocabulary.

### Option A: Use your existing type system

Replace the table below with your system's type tokens.

### Option B: WDS default scale

Nine tokens, symmetric around `text-md` (body text). Freya will propose sizes during the first design session.

| Token | Value | Use |
|-------|-------|-----|
| text-3xs | — | Fine print, legal text |
| text-2xs | — | Metadata, timestamps |
| text-xs | — | Captions, helper text |
| text-sm | — | Labels, secondary text |
| text-md | — | Body text (the baseline) |
| text-lg | — | Emphasis, lead paragraphs |
| text-xl | — | Subheadings |
| text-2xl | — | Section titles, display text |
| text-3xl | — | Hero headings, page titles |

<!--
  text-md (body text) is typically 16px or 14px — the most common baseline on the web.
  Common starting points: 11/12/13/14/16/18/20/24/32 or 10/11/12/14/16/18/22/30/40.
  Line heights should align to your spacing grid for vertical rhythm.
-->

---

## Tokens

_Additional design tokens (colors, shadows, borders) will be documented here as they emerge from page specifications._

---

## Components

_Components will be documented here as patterns emerge across scenarios._

---

_Created using Whiteport Design Studio (WDS) methodology_
