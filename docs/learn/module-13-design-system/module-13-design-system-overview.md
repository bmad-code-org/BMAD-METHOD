# Module 13: Design System

**Time: 30 min | Agent: Freya | Phase: Design | Focus: Systems**

---

## What Is a Design System?

A design system is a collection of reusable components — buttons, input fields, cards, navigation elements — that share consistent styling and behavior across your product.

Large organizations spend months building comprehensive design systems with hundreds of components before writing a single line of product code. That works when you have a dedicated team and a long timeline.

Most projects don't.

---

## The WDS Approach: Build As You Go

In WDS, the design system grows naturally from your work.

As you sketch scenarios, write specifications, and define storyboards, you encounter the same elements over and over — a text field here, a button there, a card layout that keeps appearing. Instead of designing each one from scratch every time, you extract it into a shared component.

```
Scenario P01: Homepage
  → You specify a search widget
  → It goes into your component library

Scenario P04: Dashboard
  → You need a search widget again
  → It's already there. Reuse it.

Scenario P07: Settings
  → You need search again, slightly different
  → Add a variant to the existing component
```

Each component you extract becomes a puzzle piece. Over time, your collection grows into a treasure chest of ready-made building blocks. Every new page starts a little better because half the pieces already exist.

---

## Design Stays With the Component

This is the key insight: **as soon as you add visual design to a component, it's saved**.

The next time that component appears on a new page, it already looks right. No re-styling. No guessing. The page looks better out of the box because the pieces are already designed.

---

## All Design Is Code

In WDS, your design system lives as code — not as Figma files collecting dust.

You don't need a separate component library in Figma if you don't want one. Every component is stored as a specification in your project, and the styling is saved alongside it.

When you want to edit a component visually:

```
1. Open the component in Figma
   → Use the html.to.design plugin to import it

2. Make your changes in Figma
   → Adjust colors, spacing, typography

3. Sync back to code
   → Use the Figma MCP to push changes back

4. The WDS agent handles naming
   → Keeps everything connected automatically
```

This means your design system is always in sync with your code. No handoff gaps. No "the Figma file says one thing but the code says another."

---

## Design System Paths

Not every project starts from zero. WDS supports three paths:

### Dynamic (Default)

The default WDS approach. Your design system grows one component at a time as you design. Where the components come from depends on your project:

**A: Build on a raw component library**

You start from an external library like shadcn, Radix, or MUI. When you need a button, you pick one from the library, apply your branding, and it becomes part of your design system. Next page needs a card? Pick one, brand it, done.

**B: Make them as you go**

No library — you design each component from scratch as patterns emerge. When something appears twice, you extract it into a shared component.

Most projects use a mix of both. The source doesn't matter. What matters is that each component is picked up **when you need it**, branded to your project, and stored for reuse.

Freya helps by noticing patterns:

> "This button appears in three specifications. Should we extract it as a component?"

You say yes → it goes into `C-UX-Scenarios/Functional-Components/`

Over time, your components accumulate. And on your next project for the same client? The design system already exists. You import it, reuse it, extend it.

```
Project 1: Dynamic — you pick and build components as you go
    ↓
Project 2: You reuse what you built + add new components
    ↓
Project 3: Your library keeps growing
```

Your work compounds. Each project builds on the last.

### None

No design system at all. Each page is self-contained with inline styling. Best for landing pages, quick prototypes, and tight deadlines.

**Trade-off:** Consistency is manual. Reuse requires copy-paste.

---

## The 5-Activity Workflow

In the WDS workflow (Phase 7), the design system is managed through a menu-driven approach:

```
[C] Create Design System    — Build from scratch or from component library
[I] Import Design System    — Capture an existing system from a live product
[V] View Components         — Preview components in a disposable localhost app
[E] Edit Components         — Open components in Figma for visual refinement
[B] Browse Design System    — Explore tokens, relationships, and components
```

The [B] Browse activity generates a disposable localhost application that lets you search tokens by intent ("I need a calm background color"), view relationships between design tokens, and browse the component catalog — like an Airtable-like interface for your design system.

---

## Lessons

### [Lesson 1: Understanding the Four Modes](lesson-01-understanding-modes.md)
How component management affects your workflow

---

## Tutorial

### [Tutorial 13: Apply Your Mode](tutorial-13.md)
Hands-on guide to working effectively in your design system mode

---

## Next Module

**[Module 14: Agentic Development →](../module-14-agentic-development/module-14-agentic-development-overview.md)**

Generate working prototypes from your specifications.

---

*Part of the WDS Course: From Designer to Linchpin*
