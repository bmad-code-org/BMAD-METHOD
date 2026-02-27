# Module 12: Functional Components

## Lesson 1: When Patterns Emerge

**Identifying reusable elements across your specifications**

---

## The Natural Progression

You've written specifications for multiple pages. And something happens:

You're specifying a button on page 3... and realize it's identical to the button on page 1.

Same states. Same behavior. Same styling. Different label.

**A pattern has emerged.**

---

## Why Extract Functional Components?

### Consistency

Same Functional Component = same behavior everywhere.

When the button on the signup form works like the button on the settings page, users don't have to relearn anything.

### Efficiency

Specify once, reference many times.

Instead of copying the full button specification to every page, you define it once and reference it.

### Maintainability

Change once, update everywhere.

Need to update the loading state? Change the component definition. Every instance inherits the update.

### Communication

Shared vocabulary with developers.

"Use the primary Button component" is clearer than "make a blue button that does this specific thing."

---

## When to Extract

Not everything should be a component. And **objects and spacing have different extraction timing:**

### Objects: Extract on Second Use

The first time a button or card appears, it's a one-off — it stays inline in the page spec. The second time the same pattern appears (same states, same behavior), it's a real pattern. Extract it to the design system.

First use = one-off. Second use = pattern. Extract.

### Spacing: Extract Immediately

Spacing extracts on **first use** — no waiting for a second occurrence.

Why? Because spacing is relational. When you decide that a heading needs `space-xl` above a card grid, that's a universal design principle — not a page-specific detail. It applies everywhere that pair of object types appears.

### The Decision Checklist

For objects, look for:

**Appears more than once**

Once is an instance. Twice or more is a pattern worth extracting.

**Consistent behavior**

The element behaves the same way everywhere. If behavior differs, they're different elements.

**Worth centralizing**

The extraction provides value. Sometimes inline is simpler.

**Meaningful abstraction**

"Button" is meaningful. "Blue rectangle with text" is not.

---

## What IS a Functional Component?

A **Functional Component** is a reusable widget with defined functionality:

- **Variants** — Different configurations (detailed, compact, minimal)
- **States** — Behavioral states (loading, loaded, error, refreshing)
- **Props** — Configurable options (location, maxResults, onSelect)
- **Behavior** — What the widget does (fetches data, handles input, manages state)

**Key distinction:** Functional Components are specification-level widgets, not implementation-level UI components (React, Vue, etc.).

### Examples

| Functional Component | What It Does |
|---------------------|--------------|
| Weather Widget | Fetches weather, displays forecast, handles location, refresh |
| Search Widget | Accepts input, fetches suggestions, handles selection, keyboard nav |
| Login Form | Validates fields, manages auth flow, handles errors |
| Comment Section | Manages comment input, character count, submission, validation |
| Task Card | Displays task, handles status changes, actions, completion |

---

## What Is NOT a Functional Component

Not everything needs extraction:

| Functional Component | NOT a Functional Component |
|---------------------|---------------------------|
| Weather Widget | A single temperature display |
| Search Widget | A single input field |
| Login Form | A single button |
| Task Card | A checkbox element |
| Comment Section | A color value or margin |

**Functional Components have functionality and behavior.** Simple elements and styles don't.

If the thing doesn't have complex behavior, states, and reusable functionality, it's probably just an element or style token, not a Functional Component.

---

## Functional Component vs. Instance

**Functional Component:** The widget definition

```markdown
## Weather Widget (Functional Component)
Variants: compact, detailed, minimal
States: loading, loaded, error, refreshing
Props: location, variant, autoRefresh, units
```

**Instance:** A specific usage

```markdown
### Homepage Hero Weather
- Functional Component: Weather Widget
- Variant: detailed
- Location: User's city
- AutoRefresh: true
- OnLoad: Fetch forecast data
```

The Functional Component defines the possibilities. The instance applies them.

---

## The Extraction Process

When you notice a pattern:

### 1. Identify the Pattern

"This button appears in signup, settings, and checkout..."

### 2. Document the Variations

- Primary (blue, white text)
- Secondary (white, blue border)
- Ghost (transparent, text only)

### 3. List All States

- Default
- Hover
- Active
- Loading
- Disabled

### 4. Define the Props

| Prop | Type | Default | Options |
|------|------|---------|---------|
| variant | string | primary | primary, secondary, ghost |
| size | string | md | sm, md, lg |
| disabled | boolean | false | |

### 5. Create the Component Document

Goes in `C-UX-Scenarios/Functional-Components/weather-widget.md`

### 6. Update Page Specs

Replace inline definitions with component references.

### Visual Extraction Flow

```
STEP 1: IDENTIFY PATTERN
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│  Signup Page     │   │  Settings Page   │   │  Checkout Page   │
├──────────────────┤   ├──────────────────┤   ├──────────────────┤
│ Button (primary) │   │ Button (primary) │   │ Button (primary) │
│ States: default, │   │ States: default, │   │ States: default, │
│  hover, loading  │   │  hover, loading  │   │  hover, loading  │
└──────────────────┘   └──────────────────┘   └──────────────────┘
        ↓                      ↓                      ↓
        └──────────────────────┴──────────────────────┘
                              ↓
                   PATTERN RECOGNIZED
                              ↓

STEP 2-4: DOCUMENT COMPONENT
┌────────────────────────────────────────────────────────────┐
│ C-UX-Scenarios/Functional-Components/weather-widget.md                       │
├────────────────────────────────────────────────────────────┤
│ Variants: primary, secondary, ghost                        │
│ States: default, hover, active, loading, disabled          │
│ Props: variant, size, disabled, loading                    │
└────────────────────────────────────────────────────────────┘
                              ↓

STEP 5-6: UPDATE PAGE SPECS
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│  Signup Page     │   │  Settings Page   │   │  Checkout Page   │
├──────────────────┤   ├──────────────────┤   ├──────────────────┤
│ Component:       │   │ Component:       │   │ Component:       │
│   Button         │   │   Button         │   │   Button         │
│   (primary, lg)  │   │   (primary, md)  │   │   (primary, lg)  │
│ Label: "Sign Up" │   │ Label: "Save"    │   │ Label: "Pay Now" │
└──────────────────┘   └──────────────────┘   └──────────────────┘
        ↑                      ↑                      ↑
        └──────────────────────┴──────────────────────┘
                              ↑
                 ALL REFERENCE SAME DEFINITION
```

---

## Design System

How you handle components depends on your mode:

| Mode | Component Handling |
|------|-------------------|
| **None** | Keep inline in page specs |
| **Building** | Extract to C-UX-Scenarios/Functional-Components/ |
| **Library** | Reference external (shadcn, etc.) |
| **Existing** | Import from previous project |

If you're in Mode 1 (None), you can still document patterns — just keep them inline rather than extracting to separate files.

---

## What's Next

In the next lesson, you'll learn the component anatomy in detail — how to document variants, states, props, and usage rules.

---

**[Continue to Lesson 2: Component Anatomy →](lesson-02-component-anatomy.md)**

---

[← Back to Module Overview](module-12-functional-components-overview.md)

*Part of Module 12: Functional Components*
