# Module 12: Functional Components

**Time: 45 min | Agent: Freya | Phase: Design | Focus: UX**

---

## From Pages to Patterns

You've specified your pages. You documented every element, every state, every interaction.

And now something happens.

You're writing the specification for your third page... and you notice you're describing the same button again. Same states. Same behavior. Same validation pattern.

**You're repeating yourself.**

This is good. This means patterns have emerged.

---

## What Are Functional Components?

Functional Components are the **reusable building blocks** of your interface.

Not colors. Not fonts. Not individual buttons.

**Widgets with functionality.**

```
NOT a component:           IS a component:
- Blue (#0066FF)           - Login Form (email, password, validation, submit)
- A single button          - Search Widget (input, suggestions, keyboard nav)
- 16px font size           - Comment Section (textarea, submit, character count)
- A margin value           - Task Card (checkbox, title, status, actions)
```

**The difference:** Functional Components are widgets that DO something - they have behavior, validation, state management, and user interactions.

---

## Where You Are in WDS

```
Module 11: Conceptual Specifications
You wrote complete specifications for each page.
You documented every element in detail.
    ↓
Module 12: Functional Components  ← YOU ARE HERE
You identify what's repeated across pages.
You extract patterns into reusable components.
    ↓
Module 13: Visual Design
You apply visual style to your components.
```

**This module is the bridge** between detailed specifications and actual design system.

---

## Why This Matters

When you specify pages across your app, you might write the same widget specification multiple times.

- Homepage: "Weather widget: location, current temp, 5-day forecast, icons..."
- Dashboard: "Weather widget: location, current temp, 5-day forecast, icons..."
- User profile: "Weather widget: location, current temp, 5-day forecast, icons..."

**That's inefficient.** And when something changes (like adding hourly forecast), you update multiple places.

Instead, you extract the pattern:

- **Component:** Weather Widget (defined once with all variants, data sources, states)
- **Page specs:** "Use Weather Widget (compact variant)"

**Define once. Reference everywhere. Change once. Update everywhere.**

### How Functional Components Connect Pages

```
      PAGE                    COMPONENT                    PAGE
┌──────────────────┐   ┌────────────────────┐   ┌──────────────────┐
│ P01: Homepage    │   │    WEATHER         │   │ P04: Dashboard   │
├──────────────────┤   │    WIDGET          │   ├──────────────────┤
│                  │   ├────────────────────┤   │                  │
│ Hero Section:    │   │ Data:              │   │ Sidebar:         │
│ - Component:     │◄──┤  • Current temp    │──►│ - Component:     │
│   WeatherWidget  │   │  • Conditions      │   │   WeatherWidget  │
│   (detailed)     │   │  • Location        │   │   (compact)      │
│ - Location:      │   │  • 5-day forecast  │   │ - Location:      │
│   User's city    │   │  • Hourly (opt.)   │   │   Auto-detect    │
│                  │   │                    │   │                  │
│                  │   │ Variants:          │   │                  │
│                  │   │  • compact         │   │                  │
│                  │   │  • detailed        │   │                  │
│                  │   │  • minimal         │   │                  │
│                  │   │                    │   │                  │
│                  │   │ States:            │   │                  │
│                  │   │  • loading         │   │                  │
│                  │   │  • loaded          │   │                  │
│                  │   │  • error           │   │                  │
│                  │   │  • refreshing      │   │                  │
└──────────────────┘   └────────────────────┘   └──────────────────┘
                               │
                               ▼
                         INTEGRATION
┌──────────────────────────────────────────────────────────────────┐
│ When homepage renders hero weather widget:                      │
│                                                                  │
│ 1. Reads: Component = WeatherWidget (detailed)                  │
│ 2. Looks up: WeatherWidget definition                           │
│ 3. Applies: Detailed variant (current + 5-day + hourly)         │
│ 4. Configures: Location = User's city                           │
│ 5. Inherits: All states, API integration, refresh logic         │
│ 6. Renders: Full weather display with forecast                  │
│                                                                  │
│ Result: Fully-functional weather widget with detailed view      │
└──────────────────────────────────────────────────────────────────┘
```

**The structure:** Multiple pages reference one widget. Change the widget definition, all instances update.

---

## What Happens in This Module

You'll learn to:

1. **Identify patterns** — Spot elements that appear 2+ times
2. **Decide what to extract** — Not everything should be a component
3. **Document components** — Create reusable definitions
4. **Update page specs** — Reference components instead of repeating specs

By the end, your specifications become **modular and maintainable**.

---

## Why Extract Components?

### Consistency

Same component = same behavior everywhere.

### Efficiency

Specify once, reference many times.

### Maintainability

Change once, update everywhere.

### Communication

Shared vocabulary with developers.

---

## When to Extract

A pattern becomes a component when:

- **Appears 2+ times** — More than once signals a pattern worth extracting
- **Consistent behavior** — Same interactions everywhere
- **Worth centralizing** — Benefits from single definition
- **Meaningful abstraction** — Not just "box with text"

---

## Component Anatomy

```markdown
## Search Widget

### Description
Reusable search interface with input, suggestions, and keyboard navigation.
Used in header navigation, content libraries, and admin panels.

### Variants
| Variant | Use Case |
|---------|----------|
| Global | Site-wide search (all content types) |
| Scoped | Category-specific search |
| Instant | Real-time filtering (no submit) |

### States
- Empty (placeholder visible)
- Typing (suggestions appear)
- Loading (fetching results)
- Results (dropdown with matches)
- No Results (helpful message)
- Selected (item chosen from suggestions)
- Error (API failure)

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | string | global | Search scope |
| placeholder | string | "Search..." | Input placeholder |
| minChars | number | 3 | Min chars before search |
| debounce | number | 300 | Delay before API call (ms) |
| maxResults | number | 10 | Max suggestions shown |
| onSelect | function | - | Callback when item selected |

### Usage Rules
- Search triggers after 3 characters typed
- Shows max 10 suggestions
- Escape key clears and closes
- Enter selects first result
- Click outside closes suggestions

### Accessibility
- Role: combobox
- Keyboard: Arrow keys navigate, Enter selects, Escape closes
- Screen reader announces result count
- aria-autocomplete="list"
- aria-expanded when suggestions visible
```

---

## The Freya Method

Freya notices patterns as you specify:

> "This is the third time you've specified a search widget with autocomplete. Should we extract it as a component?"

> "Your comment forms have different validation rules — should we standardize?"

She helps you see what's becoming a pattern.

---

## Component vs. Instance

**Component:** The widget definition (Search Widget)
**Instance:** A specific usage (header-global-search)

In your specs:
- Define components in your Design System
- Reference components in your page specs

```markdown
### Global Search
- Component: Search Widget (global)
- Placeholder: "Search documentation..."
- OnSelect: Navigate to selected page
```

### How Integration Works

```
COMPONENT DEFINITION (C-UX-Scenarios/Functional-Components/search-widget.md)
┌────────────────────────────────────────────────────────────┐
│ Search Widget                                              │
├────────────────────────────────────────────────────────────┤
│ Variants:                                                  │
│   - global: All content types                              │
│   - scoped: Category-specific                              │
│   - instant: Real-time filtering                           │
│                                                            │
│ States:                                                    │
│   - empty, typing, loading, results, no-results, error     │
│                                                            │
│ Props:                                                     │
│   - variant (global|scoped|instant)                        │
│   - placeholder (string)                                   │
│   - minChars (number, default: 3)                          │
│   - onSelect (function)                                    │
└────────────────────────────────────────────────────────────┘
                           ↓
              INHERITS ALL PROPERTIES
                           ↓
┌────────────────────────────────────────────────────────────┐
│ INSTANCE (P01-homepage/specification.md)                   │
├────────────────────────────────────────────────────────────┤
│ header-global-search:                                      │
│   - Component: Search Widget        ← References def       │
│   - variant: global                 ← Selects variant      │
│   - placeholder: "Search docs..."   ← Instance-specific    │
│   - onSelect: Navigate to page      ← Instance-specific    │
│                                                            │
│ INHERITS FROM COMPONENT:                                   │
│   ✓ All global variant behavior (searches all content)    │
│   ✓ All states (typing, loading, results, errors...)      │
│   ✓ All accessibility (keyboard nav, screen reader...)    │
│   ✓ All usage rules (min 3 chars, debounce, max results)  │
└────────────────────────────────────────────────────────────┘
```

**The power:** Change the Search Widget once, all instances update everywhere.

---

## Not Everything Is a Component

Some things are just styled elements:

| Component | Not a Component |
|-----------|-----------------|
| Button | A specific color |
| Card | A specific margin |
| Input | A single label |
| Modal | A page layout |

Components have behavior. Styles have appearance.

---

## Output

Functional Components documented:

```
C-UX-Scenarios/
└── Functional-Components/
    ├── weather-widget.md
    ├── search-widget.md
    ├── login-form.md
    └── task-card.md
```

**Location:** Functional Components live in the UX Scenarios folder, separate from the Design System (which handles visual styling only).

---

## Design System

| Mode | Component Handling |
|------|-------------------|
| **None** | Inline in page specs |
| **Building** | Extract to C-UX-Scenarios/Functional-Components/ |
| **Library** | Reference external (shadcn, etc.) |
| **Existing** | Import from previous project |

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Extracting too early | Wait for 2+ usages |
| Too specific | Keep components generic |
| Too generic | Must have clear purpose |
| Missing states | Document all states |
| Inconsistent naming | Use clear conventions |

---

## Practice

Review your specifications from Module 11:

1. Identify repeated patterns
2. List elements that appear 2+ times
3. Document one as a component
4. Update specs to reference it

---

## Lessons

### [Lesson 1: When Patterns Emerge](lesson-01-patterns-emerge.md)
Identifying reusable elements across your specifications

### [Lesson 2: Functional Component Anatomy](lesson-02-component-anatomy.md)
How to document Functional Components completely

---

## Tutorial

### [Tutorial 12: Extract Your Components](tutorial-12.md)
Hands-on guide to identifying and documenting reusable patterns

---

## Next Module

**[Module 13: Design System →](../module-13-design-system/module-13-design-system-overview.md)**

Choose your design system approach.

---

*Part of the WDS Course: From Designer to Linchpin*
