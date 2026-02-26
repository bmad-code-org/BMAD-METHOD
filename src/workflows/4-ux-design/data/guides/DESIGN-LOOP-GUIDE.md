# The Design Loop

**The default path from scenario to implemented page.**

---

## Overview

Design is not a handoff between phases. It's a loop: discuss → visualize → agree → build → review → refine. This guide documents the loop that emerged from real project work and defines how Phase 4 (UX Design) and Phase 5 (Agentic Development) connect.

---

## The 8-Step Loop

```
1. DISCUSS    → Talk about what the page needs to do, who it's for, primary actions
2. SPEC       → Write the page specification (content, structure, object IDs)
3. WIREFRAME  → Generate Excalidraw wireframe from the spec
4. ITERATE    → User reviews wireframe, agent updates — fast loop (seconds)
5. SYNC SPEC  → Spec updates to match agreed wireframe
6. IMPLEMENT  → Build the page in code
7. REFINE     → Browser review via screenshots at real breakpoints
8. TOKENS     → Extract recurring patterns into design tokens
```

Steps 4 and 7 are the iteration loops:
- **Step 4** is fast — Excalidraw JSON manipulation, seconds per change
- **Step 7** is real — actual browser rendering, actual responsive breakpoints

---

## Why This Works

### Conversation resolves the hard questions first

"What's the primary CTA? What's hidden on mobile? Where do trust signals go?" These are answered in discussion, not by staring at a mockup. The wireframe visualizes decisions that were already made verbally.

**Don't wireframe before discussing.** Producing the wrong thing faster helps nobody.

### Excalidraw is the right fidelity

Nobody argues about 2px of padding in a sketchy wireframe. People focus on the right things: layout, hierarchy, what content goes where. The hand-drawn aesthetic signals "this is a work in progress — push back freely."

**Don't over-detail the wireframe.** It should resolve structure and hierarchy, not typography and color. That's what the browser review phase is for.

### Two-way editing

Excalidraw files are plain JSON. The agent generates wireframes programmatically (creating rectangles, text, groups). The user opens the same file in VS Code's Excalidraw extension and drags elements around visually. Both can modify the same artifact.

No other design tool offers this:
- Figma requires API access
- Pencil uses encrypted files
- AI image generators produce dead images that can't be edited

### The spec is the contract

The wireframe helps reach agreement. The spec captures what was agreed. The implementation follows the spec. This prevents "I thought we said..." drift.

**Don't skip the spec sync.** If the wireframe changes but the spec doesn't update, they diverge. The spec is the source of truth for implementation.

### Short jump to code

Because the spec has object IDs, responsive breakpoints, and real content, the agent builds the actual page directly. No "translate the mockup into code" step.

### Browser review catches what wireframes can't

Real fonts, real images, real responsive breakpoints. Screenshots at 375px, 768px, 1280px show exactly what users will see. This is where micro-adjustments happen — spacing, font sizes, proportions.

### Tokens emerge from usage

Don't design a heading scale and spacing system before building the page. Build the page, notice you're making the same kinds of adjustments ("make this heading bigger," "more space here"), and extract the patterns into tokens. The design system grows from real needs.

**Don't design tokens upfront.** Build pages first. Extract patterns when they recur across 3+ pages.

---

## Tool Roles

| Tool | Role | When |
|------|------|------|
| **Excalidraw** | Wireframes and layout iteration | Steps 3-4 |
| **Puppeteer** | Browser screenshots for visual review | Step 7 |
| **Nano Banana** | Image asset generation (photos, illustrations) | Asset creation only |
| **Design tokens** | Heading scale, spacing scale, component tokens | Step 8 |
| **Page specs** | Source of truth for structure and content | Steps 2, 5 |

### Tool boundaries

- **Excalidraw** = layout and structure. Use it for wireframing.
- **Nano Banana** = image assets. Use it for hero photos, card images, illustrations. NOT for wireframes or mockups — those are dead images nobody can edit.
- **Puppeteer** = reality check. Use it to verify implementation at real breakpoints.

---

## Spec Sync Rule

When the wireframe and spec disagree, the spec must be updated before implementation begins.

**The sequence:**
1. Wireframe changes during iteration (step 4)
2. Agent and user agree on the wireframe
3. Agent updates the spec to match (step 5)
4. Implementation follows the updated spec (step 6)

**Never implement from the wireframe directly.** The spec is the contract. The wireframe is a tool for reaching agreement.

---

## Communication During Refinement

When making spacing or sizing changes during browser review (step 7), state the change in concrete terms:

> "Changed hero top padding from 48px to 64px"

Once design tokens exist (step 8), use token names:

> "Changed hero top padding from **space-2xl** (48px) to **space-3xl** (64px)"

This builds shared vocabulary. Over time, the user learns to say "change from space-md to space-lg" instead of "add more space."

---

## When to Use This Loop

**Full loop (all 8 steps):** New pages where layout isn't obvious. Pages with complex information hierarchy. First page of a new scenario.

**Partial loop (skip wireframe):** Pages that follow an established pattern. Second instance of a template page (e.g., vehicle type pages after the first one is done). Simple content pages.

**Discussion only (steps 1-2):** When the user knows exactly what they want. When replicating a reference design.

The loop adapts to the situation. Not every page needs a wireframe. But every page needs a discussion.
