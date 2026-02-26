# Module 15: Visual Design

## Lesson 1: Making It Visible

**From specification to visual reality**

---

## The Transition

You have specifications. Complete, detailed, unambiguous.

But they're not visible yet.

This is where specifications become something you can see, click, and experience.

---

## Why This Matters

### For You

You can validate your specifications visually. Does it actually look right? Does the hierarchy work? Does it feel good?

### For Stakeholders

They can see what's being built. Visual prototypes are easier to review than documents.

### For Developers

Visual references reduce ambiguity. Code follows the visual more precisely.

### For Users

You can test with real people. Visuals enable usability testing before development.

---

## The Visual Design Loop

```
Spec → Generate → Review → Refine → Generate → Approve
```

It's iterative. Your first visual is rarely final.

1. **Spec** — Start with your complete specification
2. **Generate** — Create a visual version
3. **Review** — Compare to specification
4. **Refine** — Adjust based on feedback
5. **Generate** — Create improved version
6. **Approve** — Lock in the final visual

---

## What You're Designing

For each page:

### Layout

Where elements are positioned. The spatial organization.

### Visual Hierarchy

What draws attention first, second, third. The flow of importance.

### Typography

Font choices, sizes, weights. The text treatment.

### Colors

From your palette or brand guidelines. The emotional impact.

### Spacing

Rhythm and breathing room. The visual cadence.

### States

Hover, active, error — all the behavioral states visualized.

---

## Design Tokens

If you're in Design System Mode 2-4, you're working with tokens:

```yaml
colors:
  primary: "#0066FF"
  primary-hover: "#0052CC"
  secondary: "#6B7280"
  error: "#DC2626"
  success: "#16A34A"

typography:
  heading-1: "Inter, 32px, 700"
  heading-2: "Inter, 24px, 600"
  body: "Inter, 16px, 400"
  small: "Inter, 14px, 400"

spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
```

Tokens ensure consistency. Every blue button uses the same blue.

---

## Tools for Visual Design

### AI Generation (Stitch, html.to.design)

Give your specification to AI. It generates HTML/CSS.

```
"Generate a signup form based on this spec. Use Inter font,
primary color #0066FF, 16px base font size."
```

Output: Working prototype in minutes.

### Figma

Refine AI output. Polish the details.

- Import from generated HTML
- Adjust spacing, colors, typography
- Create component variants
- Export assets for development

### Browser Preview

View your prototypes live. Click through. Test on devices.

---

## Entry Points

Multiple ways to start visual design:

| Starting Point | Approach |
|----------------|----------|
| Specification only | Generate with AI |
| Rough sketch | AI refines into visual |
| Inspiration image | AI extracts and applies style |
| Existing brand | Apply tokens to generated output |

You don't have to start from scratch. Build on what you have.

---

## The Match Test

Your visual must match your specification exactly.

If there's a difference:
- Update the specification to match the visual, OR
- Update the visual to match the specification

**Never leave mismatches.** They create ambiguity.

---

## Design All States

Don't just design the happy path:

- **Default** — Initial state
- **Loading** — While data loads
- **Empty** — When no content exists
- **Error** — When something fails
- **Success** — When action completes
- **Disabled** — When interaction is blocked
- **Hover/Active** — Interactive feedback

Each state needs a visual representation.

---

## Responsive Considerations

Design for your primary platform first.

**If mobile-first:**
- Start with mobile layout
- Elements stack vertically
- Touch targets 44px minimum
- Then adapt for tablet/desktop

**If desktop-first:**
- Start with desktop layout
- Multiple columns allowed
- Then simplify for smaller screens

---

## What's Next

In the next lesson, you'll learn specific techniques for generating and refining visuals — working with AI tools and maintaining consistency.

---

**[Continue to Lesson 2: Visual Design Techniques →](lesson-02-visual-techniques.md)**

---

[← Back to Module Overview](module-15-visual-design-overview.md)

*Part of Module 15: Visual Design*
