# Module 09: Conceptual Sketching

## Lesson 1: Visualize First

**Why seeing comes before specifying**

---

## The Specification Problem

You can't specify what you can't see.

Try writing a detailed specification for a page layout purely in words:

> "The header should contain the logo on the left, navigation in the center, and user profile on the right. Below that, a hero section with a headline, subheadline, and call-to-action button. The button should be prominent..."

How big is prominent? How much space between elements? What's the visual hierarchy?

Words fail at spatial problems. You need to see it.

---

## Keyframe 0

This module is about **keyframe 0** — the default state of each logical view.

What does the user see when the page first loads?

Before any interactions. Before any animations. Before any state changes.

Just: what appears on screen?

---

## Why Default State First?

Everything else is a transformation FROM the default state.

- Loading states → default state
- User interactions → transform from default
- Error states → modify the default
- Success states → change from default

If you don't nail the default state, everything built on top wobbles.

---

## The Conceptual Mindset

### Low Fidelity on Purpose

Rough visuals prevent attachment.

If your sketch looks finished, you'll defend it. You'll argue about it. You'll resist changes.

If your sketch looks rough, you'll iterate freely. You'll explore alternatives. You'll find better solutions.

**Keep it ugly. Keep it fast. Keep it flexible.**

### Quantity Over Quality

Your first idea is rarely your best.

Professional designers know this. They explore 3-5 approaches before picking one. They generate options before converging.

**One perfect sketch = probably wrong.**
**Five rough sketches = probably right (one of them).**

### Think Out Loud

Visualize while talking through the scenario.

- What does the user see first?
- What draws their attention?
- Where do they click?
- What are they trying to accomplish?

Connect every visual decision to the user's journey.

---

## Entry Points

You don't have to start from scratch.

| Entry Point | How It Works |
|-------------|--------------|
| **Workshop** | Talk through the screen together — conversation shapes the concept |
| **Visualize** | Send any visual — AI analyzes and refines |
| **Example** | "I like how this site does it" → AI extracts patterns |
| **Dream it up** | "Show me 3 ways to lay out a signup form" → AI generates options |

Same output. Different starting points. Use whatever feels natural.

---

## Ways to Visualize

You can send anything visual. All methods work.

| Method | When to Use |
|--------|-------------|
| **Pixel-perfect Figma** | You already have detailed designs |
| **Wireframes** | Structure without visual noise |
| **Hand sketch (paper)** | Fastest way to think out loud |
| **Hand sketch (digital)** | iPad, tablet, stylus |
| **Whiteboard concepts** | Rough, collaborative, big picture |
| **Screen dumps** | "This feature from another product" |
| **Generated images** | AI creates options for you |
| **ASCII art** | Quick text-based layouts from AI |
| **Vibe coded example** | Quick prototype → agent screenshots states |

Mix and match. One view might be a polished wireframe, another a napkin sketch.

**What matters is communication, not polish.**

---

## The Great Divide

You can make something amazing with AI.

Beautiful mockups. Working prototypes. Impressive demos.

But then what?

**There's a great divide between conceptualizing and producing.**

In the middle stands the specification — with its static visualization.

```
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│ CONCEPTUALIZE │ ──────► │ SPECIFICATION │ ──────► │   PRODUCTION  │
│               │         │               │         │     CODE      │
│ Cool mockups  │         │ Static visual │         │ Real software │
│ AI demos      │         │ + behavior    │         │               │
│ Prototypes    │         │ + content     │         │               │
└───────────────┘         └───────────────┘         └───────────────┘
    Creative                  The Bridge                Deliverable
```

No matter how cool your concept — you still create a specification.

That's what gets built.

---

## What Sketching Reveals

Sketching isn't just about showing what you know.

It's about discovering what you don't know.

**Common discoveries:**

- "This page needs more content than I thought"
- "These two elements compete for attention"
- "The user's next action isn't obvious"
- "This layout doesn't work on mobile"

Better to discover these with rough sketches than polished mockups.

---

## Connected to Scenarios

Every sketch maps to a logical view in your scenario.

```
Scenario: S01-User-Registration

Logical Views:
1. Landing Page     → [Sketch needed]
2. Signup Form      → [Sketch needed]
3. Welcome Screen   → [Sketch needed]
```

You're not sketching random pages. You're sketching the steps in a user journey.

This keeps your work connected to purpose.

---

## What to Capture

For each logical view, sketch:

### 1. Overall Layout
Where do major elements go?
- Header, main content, footer
- Navigation placement
- Primary action location

### 2. Visual Hierarchy
What's most important?
- Primary element (biggest, boldest)
- Secondary elements
- Supporting content

### 3. User Flow
Where does the eye travel?
- Entry point (where they look first)
- Path through the content
- Call to action

### 4. Key Interactions
What's clickable?
- Primary CTA
- Secondary actions
- Navigation elements

---

## Not Yet

At this stage, don't worry about:

- **Colors** — Too early
- **Final typography** — Too early
- **Exact spacing** — Too early
- **Animations** — Too early (that's Module 10)
- **Edge cases** — That's Module 11

Focus on structure and hierarchy. Everything else comes later.

---

## Quick Visualization Patterns

### Boxes and Labels

```
┌─────────────────────┐
│      HEADER         │
├─────────────────────┤
│                     │
│   [Form Area]       │
│                     │
├─────────────────────┤
│   [ CTA Button ]    │
└─────────────────────┘
```

### Variants

Sketch the same screen 3 different ways. Label them A, B, C.

```
Variant A: Form centered, minimal
Variant B: Form left, benefits right
Variant C: Step-by-step wizard style
```

Pick the best. Or combine elements from multiple.

---

## The Freya Method

Freya helps you explore visually while staying connected to strategy:

> "Based on Felix's fear of complicated signups, what's the simplest layout?"

> "Here are 3 approaches — which resonates with your trigger map?"

> "I notice this sketch has 5 fields. Your scenario mentioned 'quick signup.' Which is right?"

She won't let you sketch in isolation from purpose.

---

## What's Next

In the next lesson, you'll learn specific techniques for sketching effectively — whether you're using paper, digital tools, or AI-generated options.

Then in the tutorial, you'll sketch the default states for your own scenario views with Freya's guidance.

---

**[Continue to Lesson 2: Sketching Techniques →](lesson-02-sketching-techniques.md)**

---

[← Back to Module Overview](module-09-conceptual-sketching-overview.md)

*Part of Module 09: Conceptual Sketching*
