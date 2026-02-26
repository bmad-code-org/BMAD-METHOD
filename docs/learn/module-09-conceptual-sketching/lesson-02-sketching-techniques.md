# Module 09: Conceptual Sketching

## Lesson 2: Sketching Techniques

**Practical methods for visualizing your logical views**

---

## The Goal

Communicate structure and hierarchy quickly.

Not beauty. Not polish. Just enough clarity to:
- Understand what the user sees
- Know where key elements are positioned
- Serve as the foundation for specifications

---

## Paper Sketching

The fastest way to think out loud.

### Materials

- Paper (any kind works)
- Pen or marker
- 5 minutes

### Photograph and Share

Phone camera → send to AI → get feedback.

Freya can analyze hand sketches and suggest refinements.

---

## Digital Sketching

If you prefer tablet or stylus.

### Tools

- iPad + Apple Pencil
- Any drawing app (Notes app works fine)
- Freeform, Concepts, Paper

### Approach

Same as paper, but digital:
- Rough shapes
- Quick text labels
- Multiple variants
- Export and share

### Advantage

Easy to share directly with AI. No photography step.

---

## Wireframe Tools

If you want more structure than freehand.

### Tools

- Figma
- Balsamiq
- Whimsical
- Excalidraw

### Low-Fi Mode

**Black lines only. No colors. No real content.**

The more you reduce, the more you communicate.

```
┌─────────────────────────────────────┐
│ [Logo]                    [Nav] [P] │
├─────────────────────────────────────┤
│                                     │
│           [Hero Image]              │
│                                     │
│         ─────────────────           │
│         Large Headline Here         │
│         ─────────────────           │
│         Supporting text that        │
│         explains the value          │
│                                     │
│         [  Primary CTA  ]           │
│                                     │
└─────────────────────────────────────┘
```

Placeholders force focus on structure, not content. Black lines force focus on layout, not decoration.

---

## AI-Generated Sketches

Let the AI create options for you.

### Prompting for Layouts

**Good prompt:**
> "Show me 3 different layouts for a signup form. The user is Felix who wants to try quickly with minimal friction. Mobile-first."

**Better prompt:**
> "I need a signup form for S01-User-Registration. The persona is Felix who fears complicated onboarding. Show me 3 approaches: minimal, conversational, and wizard-style. ASCII art is fine."

### ASCII Art

AI can generate quick text-based layouts:

```
┌─────────────────────────────────┐
│  Dog Week                 [?]  │
├─────────────────────────────────┤
│                                 │
│     Welcome to Dog Week         │
│                                 │
│   ┌───────────────────────┐     │
│   │ Email                 │     │
│   └───────────────────────┘     │
│                                 │
│   ┌───────────────────────┐     │
│   │ Password              │     │
│   └───────────────────────┘     │
│                                 │
│   [    Create Account    ]      │
│                                 │
│   Already have an account?      │
│   Log in →                      │
│                                 │
└─────────────────────────────────┘
```

Fast to generate. Easy to iterate. Clear enough to discuss.

---

## Screen Dumps as Reference

Using existing products for inspiration.

### The Pattern

1. Find a product you admire
2. Screenshot the relevant screen
3. Share with Freya: "I like how this handles signup"
4. AI extracts the patterns

### What to Share

- "I like this form layout"
- "This navigation feels right"
- "The hierarchy here works"

### What Freya Does

> "I see this uses a single-column form with progressive disclosure. The CTA is high-contrast and fixed at the bottom. Should we apply similar patterns to Felix's signup experience?"

She extracts what works, connects to your context.

---

## Vibe-Coded Prototypes

Quick prototypes that the AI can analyze.

### The Pattern

1. Ask AI to build a quick prototype
2. View it in browser
3. Screenshot the states
4. Use screenshots as sketches

### Example

> "Build me a quick HTML signup form based on our S01-User-Registration scenario. Just the structure, no styling."

Then screenshot the result and use it as your starting point.

---

## Responsive Considerations

Sketch for your primary platform first.

### Mobile-First

If users are primarily on mobile (like Dog Week):
- Sketch mobile layout first
- Everything stacks vertically
- Touch-friendly tap targets

### Desktop-First

If users are primarily on desktop:
- Sketch desktop layout first
- Multiple columns allowed
- Hover states possible

### Then Adapt

Once primary platform is sketched:
- "How does this adapt to secondary platform?"
- Key elements stay, layout adjusts

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Too polished | Keep it rough |
| Only one variant | Explore 3-5 options |
| Designing in isolation | Reference your scenario |
| Starting with edge cases | Focus on default state |
| Using colors | Black lines only—colors distract from structure |

---

## The Sketching Conversation

With Freya:

**You:** "Here's my sketch for the signup form. [share image]"

**Freya:** "I see a two-field form with prominent CTA. This aligns with Felix's need for simplicity. A few questions:
- Where does the user see they can log in instead?
- Is there a way to try before creating an account?
- How prominent should the value proposition be?"

**You:** "Good points. Let me sketch variant B with those addressed..."

The conversation refines the concept.

---

## Output

For each logical view in your scenario:

- **1-3 rough sketches** showing layout options
- **Selected direction** with rationale

The sketches show WHAT appears on screen. The specifications (Module 11) document WHY—explaining decisions, persona connections, and business rationale.

These sketches become the foundation for storyboarding (what changes after load) and specifications (the detailed documentation).

---

## What's Next

In the next lesson, you'll learn why hand sketching (paper or tablet) is still the recommended approach in the AI era—and what makes it superior to other methods.

Then in the tutorial, you'll sketch the default states for your own scenario views with Freya's guidance.

---

**[Continue to Lesson 3: Why Hand Sketching is Still King →](lesson-03-why-hand-sketching.md)**

---

[← Back to Lesson 1](lesson-01-visualize-first.md) | [Back to Module Overview](module-09-conceptual-sketching-overview.md)

*Part of Module 09: Conceptual Sketching*
