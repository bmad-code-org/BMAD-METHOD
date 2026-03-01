# Module 15: Visual Design

**Time: 60 min | Agent: Freya | Phase: Design | Focus: Visual**

---

## The Big Shift

In WDS, visual design lives in the codebase.

There is no ambitious Figma structure or Photoshop file to maintain. WDS is specifications and code centric. Your design artifacts are working prototypes, not static mockups.

This doesn't mean you never open Figma. It means Figma is a tool you reach for when you need it — not where your design lives.

---

## Designing with Soul

LLMs are remarkably good at generating functional, clean, well-structured interfaces. They are remarkably weak at creative, visionary, and emotionally resonant design.

An AI agent can build a signup form that follows every best practice. But it won't dream up the visual language that makes your product feel like *yours*. It won't make the bold typographic choice, the unexpected color palette, the playful micro-interaction that gives a product its soul.

**As of February 2026, we recommend having a visual designer set the visual language as you develop the product.** This doesn't mean you need a designer on every screen. It means someone with a design eye should establish:

- The overall aesthetic direction
- Brand expression in the UI
- Typographic personality
- Color relationships beyond "primary, secondary, error"
- The small details that make good design feel great

Once the visual language is set, the agent can apply it consistently. But the language itself needs a human author.

---

## Visual Design Is Not a Step — It's a Layer

In traditional workflows, visual design is a phase you reach after wireframing. In WDS, visual design can enter the project at any point where it adds value.

Here is the full WDS process. At each step, you can choose to introduce visual design — or not.

```
  WDS Process                        Visual Design Can Enter As...
  ───────────                        ────────────────────────────

  Project Setup ──────────────────── Brand references, mood boards,
       │                             design system inspiration,
       │                             existing visual identity
       ▼
  Outline Scenarios
       │
       ▼
  Conceptual Sketching ──────────── Visual concepts instead of
       │                             wireframe-level sketches,
       │                             AI-generated inspiration
       ▼
  Storyboarding ─────────────────── Designed visualizations with
       │                             visual fidelity from the start,
       │                             styled storyboard frames
       ▼
  Specifications ────────────────── Visual references and inspiration
       │                             images embedded directly in specs,
       │                             color and typography decisions
       ▼
  Components + Design System ────── Component-level visual design,
       │                             design tokens, patterns,
       │                             branded component library
       ▼
  Prototyping ───────────────────── Visual polish applied directly
       │                             to working code, styled
       │                             prototypes from the start
       ▼
  ★ Visual Design Phase ★ ──────── Prototypes opened in Figma or
       │                             refined with design tools,
       │                             soul added to working code,
       │                             final visual refinement
       ▼
  Delivery
```

The more visual design you introduce early, the less you need to do in this phase. Some projects arrive here with prototypes that already look finished. Others arrive with functional wireframes that need a full visual pass. Both are valid.

---

## How Visual Design Works at Each Step

### At project setup

You establish the visual direction before any design work begins. Mood boards, brand guidelines, reference sites, inspiration collections. These inform every decision downstream.

> "Here's our brand. Here's the feeling we want. Here are three sites that nail the aesthetic."

### At conceptual sketching

Instead of rough wireframes, you create visual concepts. AI can generate styled layouts from a description. You use these to explore direction — not as final designs, but as visual thinking.

> "Generate three visual directions for the landing page based on this brief."

### At storyboarding

Your storyboard frames can carry visual fidelity. Instead of gray boxes, the frames show colors, typography, and imagery. This helps stakeholders react to the experience, not just the structure.

### At specifications

You embed visual references directly in your specs. A color note here, a typography decision there, an inspiration screenshot attached. The spec carries visual intent alongside functional requirements.

### At component + design system level

Your design tokens (colors, fonts, spacing) are defined. Your component library carries the visual identity. Everything built from this point inherits the design automatically.

### At prototyping

When the agent builds a prototype using your design system, it already looks designed. You review and refine — adjusting what the agent didn't get right, adding details that need a human eye.

### At the visual design phase (this module)

This is the dedicated pass where you ensure everything has the right soul. Open prototypes in Figma, refine details the agent missed, adjust visual hierarchy, add polish. Then bring it back to code.

---

## Your Level of Control

**You maintain 100% control over the final design.**

AI generates. You direct. The degree to which you intervene is up to you:

| Comfort Level | Approach |
|---------------|----------|
| Full control | Generate → Open in Figma → Refine every detail → Export back to code |
| Collaborative | Generate → Adjust in code → Open specific elements in Figma → Return to code |
| AI-forward | Generate → Review → Refine with AI prompts → Final polish in code |

There is no wrong approach. Use whatever gives you confidence in the result.

---

## Tools

### AI Code Generation

The agent generates HTML/CSS from your specifications. You review the output in your browser and refine through the Design Log process (Module 14).

### Figma

Reach for Figma when you need to:

- Add soul that AI didn't capture
- Fine-tune visual details pixel by pixel
- Work with brand elements that need a designer's eye
- Explore visual directions before committing to code

You interact with Figma through two tools:

**code.to.design** — imports your HTML prototypes directly into Figma as editable layers. Refine in Figma, then export back to code. Round-trip as many times as you need.

**Figma MCP** — connects your AI coding agent directly to Figma. The agent can read your Figma designs, extract styles, and apply them to code — without you manually exporting or copying values.

### AI Visual Tools — What We've Learned

Different AI tools serve different purposes in visual design. Here's what works based on real project testing:

| Tool | Best For | Limitation |
|------|----------|------------|
| **Excalidraw** | Wireframes, layout iteration | Manual, no AI generation |
| **Nano Banana** | Image assets (hero photos, card images, personas) | Cannot render text, output is non-editable |
| **Google Stitch** | Production HTML/CSS mockups | Requires Google Cloud setup |
| **Figma** | Final visual polish, pixel-level refinement | Manual, slower |
| **AI code gen** | Interactive prototypes | May need visual refinement |

**Nano Banana is an asset production tool, not a design tool.** It generates excellent placeholder images but cannot produce wireframes or mockups suitable for iterative design. All text is garbled, output cannot be edited. For the full analysis, see [Module 09, Lesson 6: AI Wireframe Generation](../module-09-conceptual-sketching/lesson-06-ai-wireframe-generation.md).

**Recommended workflow for page design:**
1. **Excalidraw** — Sketch and iterate on layout (editable, user controls)
2. **Nano Banana** — Generate image assets (hero photos, card images, seasonal visuals)
3. **Stitch or code gen** — Generate production HTML/CSS from approved wireframe

### AI Asset Generation (Phase 6 Pipeline)

WDS Phase 6 provides a full **creative production pipeline** for generating visual assets with AI:

```
[W] Wireframes       — Structural layouts from page specs
[P] Page Designs     — Full page compositions
[U] UI Elements      — Buttons, cards, forms, components
[I] Icons            — Icon sets matching your design system
[M] Images           — Photos, illustrations, backgrounds
[V] Videos           — Motion content and animations
[C] Content          — Strategic text (5-model framework)
[E] Export to Figma  — Push assets to Figma
```

Each activity uses **style libraries** — predefined design styles (minimal, corporate, brutalist, organic, playful, editorial) and content styles (photorealistic, illustration, watercolor, isometric, flat design, etc.) with prompt keywords for consistent AI generation.

**Batch mode** generates all assets of a type in one session, using earlier results as reference images for visual consistency across the set.

---

## The Freya Method

Freya connects visuals to strategy:

> "This visual is beautiful, but does it match Felix's need for simplicity?"
> "The color contrast here might cause accessibility issues."
> "Your spec says primary CTA — but visually the secondary button draws more attention."

She keeps visuals aligned with intent — whether you're working in code or Figma.

---

## What to Design

### For Each Page

1. **Layout** — Position of elements
2. **Visual hierarchy** — What draws attention first
3. **Typography** — Font choices, sizes, weights
4. **Colors** — From your palette or brand
5. **Spacing** — Rhythm and breathing room
6. **States** — Hover, active, error, etc.

### Don't Forget

- Empty states
- Loading states
- Error states
- Mobile responsive (if applicable)

---

## Design Tokens

If using Design System (Modes 2-4), extract tokens:

```yaml
colors:
  primary: "#0066FF"
  secondary: "#6B7280"
  error: "#DC2626"

typography:
  heading: "Inter, 24px, 700"
  body: "Inter, 16px, 400"

spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
```

Tokens ensure consistency across all visuals — in code and in Figma.

---

## Output

Visual prototypes for each page, living in the codebase:

```
C-UX-Scenarios/
└── S01-User-Registration/
    ├── scenario-overview.md
    ├── P01-signup-form.md
    ├── P01-signup-form.html    ← Visual prototype
    └── P02-welcome-screen.md
```

---

## What You'll Learn

### Lesson 1: Making It Visible

From specification to visual reality. The visual design loop — generate, review, refine. Working with design tokens, applying visual direction to prototypes, and choosing when to work in code versus Figma.

### Lesson 2: Visual Design Techniques

Three methods for creating visual output: Figma round-trips with code.to.design, AI image generation for concepts and inspiration, and AI UI generation for styled prototypes. How to prompt for visual output, refine generated results, design all states, and maintain consistency.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Design before spec | Spec first, always |
| Living in Figma | Code is home, Figma is a visit |
| Ignoring states | Design all states |
| Inconsistent styling | Use design tokens |
| Forgetting accessibility | Check contrast, sizes |
| Over-designing | Keep it simple |

---

## The Test

Does your visual match your specification exactly?

If there's a difference, update either the spec or the visual. Never leave mismatches.

---

## Practice

Take one specification from Module 11:

1. Generate visual prototype with AI
2. Review against spec
3. Refine — in code or via Figma round-trip
4. Verify all states are designed
5. Confirm: does it match the spec?

---

## Lessons

### [Lesson 1: Making It Visible](lesson-01-making-it-visible.md)
From specification to visual reality

### [Lesson 2: Visual Design Techniques](lesson-02-visual-techniques.md)
Practical methods for generating and refining visuals

---

## Tutorial

### [Tutorial 15: Create Your Visuals](tutorial-15.md)
Hands-on guide to generating and refining visual designs

---

## Next Module

**[Module 16: Design Delivery →](../module-16-design-delivery/module-16-design-delivery-overview.md)**

Package and deliver your design.

---

*Part of the WDS Course: From Designer to Linchpin*
