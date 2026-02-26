# The Design Loop

**The default path from scenario to implemented page.**

---

## Overview

Design is not a handoff between phases. It's a loop: discuss → visualize → agree → build → review → refine. This guide documents the loop that emerged from real project work and defines how Phase 4 (UX Design) and Phase 5 (Agentic Development) connect.

---

## The 9-Step Loop

```
1. DISCUSS    → Talk about what the page needs to do, who it's for, primary actions
2. SPEC       → Write the page specification (content, structure, object IDs)
3. WIREFRAME  → Generate Excalidraw wireframe from the spec
4. ITERATE    → User reviews wireframe, agent updates — fast loop (seconds)
5. APPROVE    → User exports PNG — the export IS the approval
6. SYNC SPEC  → Spec updates to match agreed wireframe
7. IMPLEMENT  → Build the page in code
8. REFINE     → Browser review via screenshots at real breakpoints
9. TOKENS     → Extract recurring patterns into design tokens
```

Steps 4 and 8 are the iteration loops:
- **Step 4** is fast — Excalidraw JSON manipulation, seconds per change
- **Step 8** is real — actual browser rendering, actual responsive breakpoints

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

### Export = approval

The agent can read and write `.excalidraw` JSON, but it cannot export to PNG — that requires the Excalidraw UI. This limitation is a feature: the manual export becomes an approval gate.

**The pattern:**
1. Agent creates/edits the `.excalidraw` file (JSON)
2. User reviews in Excalidraw, can tweak things directly
3. When agreed → user exports PNG and saves it alongside the `.excalidraw` file
4. PNG becomes the frozen visual reference in the specification
5. `.excalidraw` file stays as the editable source for future revisions

The PNG serves as both a backup and a confirmation. If the user hasn't exported the image, the wireframe isn't approved yet.

### The spec is the contract

The wireframe helps reach agreement. The spec captures what was agreed. The implementation follows the spec. This prevents "I thought we said..." drift.

**Don't skip the spec sync.** If the wireframe changes but the spec doesn't update, they diverge. The spec is the source of truth for implementation.

### Short jump to code

Because the spec has object IDs, responsive breakpoints, and real content, the agent builds the actual page directly. No "translate the mockup into code" step.

### Browser review catches what wireframes can't

Real fonts, real images, real responsive breakpoints. Screenshots at 375px, 768px, 1280px show exactly what users will see. This is where micro-adjustments happen — spacing, font sizes, proportions.

### Spacing discipline — named scale, never arbitrary values

Agents don't have a trained eye for spacing. Without constraints, they'll use arbitrary values — 17px here, 23px there. The fix: a named spacing scale defined per project.

**The scale lives in** `D-Design-System/00-design-system.md` → Spacing Scale. If the project already has a design system (Tailwind, Material, Carbon, custom tokens), use that. If not, WDS provides a default 9-token scale from `space-3xs` to `space-3xl`, symmetric around `space-md`. The user defines what pixel values they represent.

**First design session:** Freya checks if the project has an existing spacing system. If yes, map those tokens into the design system file. If no, Freya proposes values for the default scale and the user confirms. From that point on, every spec uses token names.

```
space-3xs  space-2xs  space-xs  space-sm  space-md  space-lg  space-xl  space-2xl  space-3xl
```

**The rules:**
- Specs always use token names, never raw pixel values
- Every section in a page spec declares its padding and element gap using tokens
- If a spacing value isn't in the scale, it doesn't belong in the spec
- The scale can be adjusted as the project matures — specs stay valid because they reference names, not numbers

**Optical adjustments:** Sometimes the math is right but the eye says it's wrong — a circular image leaves white corners, a light element looks more spaced than it is. Use token math: `space-lg - space-3xs` (not raw pixels). Always annotate the reason. If adjusting by more than one step, the base token is probably wrong.

---

## Tool Roles

| Tool | Role | When |
|------|------|------|
| **Excalidraw** | Wireframes and layout iteration | Steps 3-5 |
| **Puppeteer** | Browser screenshots for visual review | Step 8 |
| **Nano Banana** | Image asset generation (photos, illustrations) | Asset creation only |
| **Design tokens** | Heading scale, spacing scale, component tokens | Step 9 |
| **Page specs** | Source of truth for structure, content, and spacing | Steps 2, 6 |

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

When making spacing or sizing changes during browser review (step 8), state the change in concrete terms:

> "Changed hero top padding from 48px to 64px"

Once design tokens exist (step 9), use token names:

> "Changed hero top padding from **space-2xl** (48px) to **space-3xl** (64px)"

This builds shared vocabulary. Over time, the user learns to say "change from space-md to space-lg" instead of "add more space."

### Pattern recognition — reflect, don't interrogate

When the user requests a spacing adjustment, the agent's job is to **observe and reflect** — not to ask "why?" A trained designer carries spacing patterns unconsciously. Their gut says "more space here" because a pattern is firing in the back of their brain. The agent externalizes that intuition.

**Wrong:** "Why does this need more space?" — breaks the flow, puts the meta-work on the designer.

**Right:** "Got it — large image above a card row needs extra breathing room. I'll use space-xl + space-xs for this relationship going forward."

The designer nods or corrects. The agent records it. The pattern table in the design system builds itself as a byproduct of doing the work.

**The process:**
1. User says "more space between the photo and the cards"
2. Agent fixes it: `space-lg + space-xs`
3. Agent reflects: "So when an image-with-text block sits above a card row, the default gap isn't enough."
4. First time: one-off adjustment noted in the page spec
5. Second time: agent says "this is the same pattern as the homepage about section — applying it"
6. Third time: agent extracts it to `D-Design-System/00-design-system.md` → Patterns

This is how a designer's unconscious expertise becomes a shared, reusable asset. The agent does the tedious classification and recall work. The designer just keeps designing.

---

## When to Use This Loop

**Full loop (all 9 steps):** New pages where layout isn't obvious. Pages with complex information hierarchy. First page of a new scenario.

**Partial loop (skip wireframe):** Pages that follow an established pattern. Second instance of a template page (e.g., vehicle type pages after the first one is done). Simple content pages.

**Discussion only (steps 1-2):** When the user knows exactly what they want. When replicating a reference design.

The loop adapts to the situation. Not every page needs a wireframe. But every page needs a discussion.
