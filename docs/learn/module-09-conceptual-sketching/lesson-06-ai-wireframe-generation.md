# Module 09: Conceptual Sketching

## Lesson 6: AI Wireframe Generation

**Using Nano Banana for wireframe exploration — what works, what doesn't**

---

## What This Is

AI image generators like Nano Banana (Gemini 2.5 Flash / Gemini 3 Pro) can generate wireframe-style layouts from page specifications. You describe the structure of a page, and the AI creates a grayscale wireframe image.

This lesson covers what we've learned from extensive testing with real projects.

---

## The Promise

In theory, AI wireframe generation is compelling:

1. Describe a page layout in text
2. AI generates a clean wireframe image
3. Transform wireframe into a styled mockup
4. Iterate until satisfied

**The reality is more nuanced.** AI wireframes work well for some things and poorly for others.

---

## What AI Wireframes Are Good At

### Layout Exploration

AI can quickly generate different layout arrangements from a page specification. You can see how sections stack, how the visual hierarchy flows, and whether the proportions feel right.

> "Generate a grayscale wireframe: Header with logo and nav, full-width hero image with overlay text, 3-column feature cards, about section with photo left and text right, footer with 4 columns."

**Result:** A clean layout showing all sections in correct proportion. Useful for validating that the page structure makes sense.

### Section Proportions

AI wireframes are good at showing relative sizes — how much space the hero takes versus the content area, whether the footer feels proportional, whether there's enough breathing room.

### Quick Alternatives

Want to see the same content in a different arrangement? Change "photo left, text right" to "photo right, text left" and regenerate. Faster than redrawing.

### Mood and Direction

Wireframes generated from detailed specs can show the overall feeling of a page — dense vs. airy, image-heavy vs. text-heavy, structured vs. organic.

---

## What AI Wireframes Struggle With

### All Text Is Garbled

AI image generators cannot render readable text. Every word in the wireframe will be gibberish that looks like text from a distance but is unreadable up close.

**This is the single biggest limitation.** You can never trust text in an AI-generated wireframe.

### Wireframe Labels Leak Into Mockups

If you label sections in your wireframe ("HERO SECTION", "TRUST CARDS", "FOOTER"), those labels will bleed through when you transform the wireframe into a styled mockup. The AI treats them as visual elements to preserve.

**Prevention:** Use clean, unlabeled wireframes. Describe structure through layout, not annotations.

### 2x2 Grids Flatten to 1x4 Rows

When you specify "2 rows of 2 cards," the AI often produces a single row of 4 cards instead. Two-dimensional grid layouts are a consistent weak point.

**Workaround:** Explicitly describe "2 rows, 2 columns, stacked vertically" — but even this doesn't always work.

### You Cannot Edit the Result

This is the critical limitation. An AI wireframe is an image. You cannot:

- Move an element
- Resize a section
- Add a missing component
- Adjust spacing

If something is wrong, you must regenerate the entire thing. This makes iteration slow and frustrating compared to tools where you can simply drag and adjust.

### Logos Cannot Be Reproduced

The AI will generate something that looks "inspired by" your logo, but it won't be your actual logo. Wireframes should use a simple placeholder rectangle for logos.

### Structural Changes Require Full Regeneration

If you want to move a section, swap the order of two elements, or change the column count — you must regenerate from scratch. Edit mode (transforming an existing image) cannot restructure layout.

### Broad Edits Cause Section Loss

In edit mode, instructions like "make everything look more premium" can cause entire sections to disappear. The AI struggles with broad changes — targeted, specific edits work much better.

---

## The Two-Step Pipeline

Despite its limitations, AI wireframe generation works best in a two-step pipeline:

### Step 1: Generate Wireframe from Spec

Use **generate mode** with a detailed layout description:

```
Grayscale digital wireframe, clean boxes and placeholder text.

Header bar: logo placeholder left, navigation links center, contact info right.
Hero section: full-width photo area, large heading overlay, subtitle, CTA button.
About section: photo left (40%), text right (60%) with heading and paragraph.
Services section: 3 equal cards in a row, each with icon, heading, description.
Footer: 4 columns with links, contact details, social icons.
```

**Settings:**
- Mode: `generate`
- Model: `pro` (better structural accuracy)
- Aspect ratio: `9:16` (full page scroll) or `16:9` (desktop viewport)
- System instruction: "Clean grayscale wireframe with boxes and shapes. No colors, no photography."

### Step 2: Transform to Mockup (Optional)

Use **edit mode** with the wireframe as input image:

```
Transform this wireframe into a styled web page mockup.
Replace gray boxes with realistic content.
Hero image: Swedish countryside landscape.
Color palette: navy blue headers, white backgrounds, warm gray accents.
```

**Settings:**
- Mode: `edit`
- Input image 1: The wireframe (layout source)
- Input image 2-3: Reference photos for style
- Aspect ratio: **Must match wireframe** (critical — changing it causes content loss)

**Result:** Layout-accurate mockup, but with garbled text and possible wireframe label leakage.

---

## When to Use AI Wireframes

### Good Use Cases

- **Early exploration** — "What would this spec look like as a page?"
- **Stakeholder previews** — Quick visual to discuss layout direction
- **Layout validation** — Does the section order and proportion feel right?
- **Mood visualization** — Getting a sense of how dense or airy the page will be

### Poor Use Cases

- **Iterative refinement** — Can't adjust elements, must regenerate everything
- **Detailed design** — Text is garbled, grids flatten, details get lost
- **Production reference** — Not accurate enough for developers to build from
- **Client presentations** — Garbled text looks unprofessional

---

## AI Wireframes vs. Hand Sketching vs. Excalidraw

| | AI Wireframes | Hand Sketch | Excalidraw |
|---|---|---|---|
| **Speed to first version** | Fast (seconds) | Fast (minutes) | Medium (minutes) |
| **Editability** | None (regenerate) | Redraw | Full (drag, resize) |
| **Text quality** | Garbled | Readable | Readable |
| **Iteration speed** | Slow (regenerate) | Fast (redraw) | Fastest (edit in place) |
| **Layout accuracy** | Approximate | As drawn | As drawn |
| **Collaboration** | View only | Photo + discuss | Share + co-edit |
| **Best for** | Quick preview | Thinking out loud | Iterative design |

**Recommendation:** Use hand sketching or Excalidraw for wireframing. Use AI generation for image assets (hero photos, card images, illustrations).

---

## Critical Rules

If you do use AI wireframe generation:

1. **Always pin `aspect_ratio` in edit mode** — The #1 cause of content loss
2. **One targeted change per edit** — Never combine multiple changes
3. **Regenerate rather than edit for structural changes** — Moving sections, changing column counts
4. **Use `pro` model for wireframes** — Better structural accuracy than `flash`
5. **No section labels in wireframes** — They leak into mockup transforms
6. **Maximum 2-3 edit iterations** — Quality degrades after that; regenerate from wireframe

---

## The Verdict

AI wireframe generation is a **rapid exploration tool**, not a production wireframe tool. It's useful for getting a quick visual sense of a page structure, but it cannot replace editable tools like Excalidraw or hand sketching for iterative design work.

The non-editable nature of AI wireframes is the fundamental problem. In design, you need to move things around, try different arrangements, respond to feedback. An image you can only regenerate from scratch doesn't support this workflow.

**Use AI wireframes for:** Quick layout previews, mood visualization, early exploration.
**Use Excalidraw/hand sketching for:** Iterative wireframing, detailed layout work, collaborative design.
**Use Nano Banana for:** Image asset production (hero photos, card images, seasonal photos, persona illustrations). This is where it truly shines.

---

## What's Next

These wireframes — whether hand-drawn, Excalidraw, or AI-generated — become the foundation for storyboarding (Module 10) and specifications (Module 11). The method doesn't matter. Meeting the standard does: concrete, complete, and rough.

---

[Back to Lesson 5](lesson-05-sketch-text-strategy.md) | [Back to Module Overview](module-09-conceptual-sketching-overview.md)

*Part of Module 09: Conceptual Sketching*
