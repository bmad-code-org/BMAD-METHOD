# Tutorial 12: Extract Your Components

**Hands-on guide to identifying and documenting reusable patterns**

---

## Overview

This tutorial walks you through identifying reusable patterns in your specifications and documenting them as components.

**Time:** 30-40 minutes
**Prerequisites:** Page specifications completed (Module 11)
**Agent:** Freya
**What you'll create:** Component documentation in `C-UX-Scenarios/Functional-Components/`

---

## Before You Start

**You'll need:**

- Your completed page specifications
- Understanding of common UI patterns
- Your Design System mode (None, Building, Library, Existing)

**Note on modes:**

- **Mode 1 (None):** You can still identify patterns but keep them inline
- **Mode 2 (Building):** Extract components to separate files
- **Mode 3 (Library):** Reference external library components
- **Mode 4 (Existing):** Import and extend from previous project

---

## Step 1: Identify Repeated Patterns (10 min)

### Ask Freya to scan your specs:

**You say:**
> "Review my page specifications and identify elements that appear 2 or more times. Which patterns should we consider extracting as components?"

**Freya analyzes:**
> "Scanning your specifications... I found these repeated patterns:
>
> **Buttons (7 occurrences)**
> - Signup submit, Login submit, Settings save, Profile update...
> - Variants: primary (5), secondary (2)
> - States: loading appears 4 times
>
> **Input Fields (12 occurrences)**
> - Email (3), Password (2), Text (7)
> - Validation patterns consistent
>
> **Cards (4 occurrences)**
> - Task cards, Profile card, Summary cards
> - Structure: image + title + description
>
> Recommend starting with Button — highest usage, clear patterns."

### Pattern Discovery Visualization

```
FREYA'S ANALYSIS: Scanning Page Specifications
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ P01-landing │  │ P02-signup  │  │ P03-settings│  │ P04-profile │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
      ↓                ↓                ↓                ↓
      └────────────────┴────────────────┴────────────────┘
                              ↓
                    PATTERN DETECTION
                              ↓
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Button       │    │ Input        │    │ Card         │
│ 7 instances  │    │ 12 instances │    │ 4 instances  │
├──────────────┤    ├──────────────┤    ├──────────────┤
│ ✓ Primary(5) │    │ ✓ Email(3)   │    │ ✓ Task cards │
│ ✓ Second.(2) │    │ ✓ Password(2)│    │ ✓ Profile    │
│ ✓ Loading(4) │    │ ✓ Text(7)    │    │ ✓ Summary    │
└──────────────┘    └──────────────┘    └──────────────┘
   HIGH PRIORITY       HIGH PRIORITY       MED PRIORITY
        ↓
  START HERE (most used, clearest pattern)
```

---

## Step 2: Document First Component (10 min)

### Start with Button:

**Freya:**
> "Let's document the Button component. First, what variants have you used across your specs?"

**You respond:**
> "Primary for main actions, secondary for alternatives. I also used a ghost style for inline actions."

**Freya continues:**
> "And what states appear in your storyboards?"

**You respond:**
> "Default, hover, active, loading, disabled. The loading state shows a spinner."

**Freya builds the component:**

```markdown
# Button Component

## Description
Action trigger used throughout the application.
Communicates importance through visual hierarchy.

## Variants
| Variant | Use Case |
|---------|----------|
| Primary | Main action per screen |
| Secondary | Alternative actions |
| Ghost | Inline/tertiary actions |

## States
| State | Trigger | Behavior |
|-------|---------|----------|
| Default | Initial | Standard appearance |
| Hover | Mouse over | Darkens 10% |
| Active | Mouse down | Scale 98% |
| Loading | loading=true | Spinner, disabled |
| Disabled | disabled=true | 50% opacity |

## Props
| Prop | Type | Default |
|------|------|---------|
| variant | string | "primary" |
| size | string | "md" |
| loading | boolean | false |
| disabled | boolean | false |
| fullWidth | boolean | false |
```

### Add usage rules:

**Freya:**
> "Based on your specs, what usage rules should we document?"

**You respond:**
> "One primary per screen. Always has text label. Loading replaces text but keeps width."

**Freya adds:**
```markdown
## Usage Rules
- One primary button per screen
- Always include text label
- Loading state: spinner replaces text, width unchanged
- Minimum touch target: 44px
```

---

## Step 3: Continue with Other Components (10 min)

### Move to Input:

**Freya:**
> "Button is complete. Next, let's document Input. What types have you used?"

**You respond:**
> "Text, email, password. Password has the show/hide toggle."

**Work through:**
- Types: text, email, password
- States: default, focus, filled, error, disabled
- Features: validation, error messages, helper text

**Freya documents:**
```markdown
# Input Component

## Description
Text entry field with validation and error handling.

## Types
| Type | Features |
|------|----------|
| text | Standard input |
| email | Email validation |
| password | Masked, show/hide toggle |

## States
| State | Visual |
|-------|--------|
| Default | Gray border |
| Focus | Blue border |
| Filled | Content visible |
| Error | Red border, error message |
| Disabled | Grayed out |

## Props
| Prop | Type | Description |
|------|------|-------------|
| type | string | text, email, password |
| label | string | Above field |
| placeholder | string | In field when empty |
| error | string | Error message |
| required | boolean | Required indicator |
```

### Repeat for Card and other patterns...

---

## Step 4: Update Page Specifications (5 min)

### Replace inline definitions with references:

**Before (inline):**
```markdown
### Submit Button
- Type: Button
- Style: Primary, blue background, white text
- States: Default, Hover, Active, Loading, Disabled
- Label: "Create Account"
- Loading: Shows spinner
- OnClick: Submit form
```

**After (reference):**
```markdown
### Submit Button
- Component: Button (primary, lg)
- Label: "Create Account"
- OnClick: Submit form
- See: [Button Component](../../C-UX-Scenarios/Functional-Components/button.md)
```

The component definition handles the states and styling. The page spec only needs to specify what's unique to this instance.

### Transformation Visualization

```
BEFORE: Inline Specifications (Repetitive)
┌──────────────────────────────────────────────────────────────┐
│ P02-signup-page/specification.md                             │
├──────────────────────────────────────────────────────────────┤
│ Submit Button:                                               │
│ - Type: Button                                               │
│ - Style: Primary, blue background, white text                │
│ - States: Default, Hover, Active, Loading, Disabled          │
│ - Hover: Darkens 10%, subtle shadow                          │
│ - Loading: Spinner replaces text                             │
│ - Disabled: 50% opacity, cursor not-allowed                  │
│ - Accessibility: role=button, keyboard navigation            │
│ - Label: "Create Account"                                    │
│ - OnClick: Submit form                                       │
│                                                              │
│ 9 lines of specification (7 are repeated elsewhere)         │
└──────────────────────────────────────────────────────────────┘
                              ↓
                    EXTRACT TO COMPONENT
                              ↓
┌──────────────────────────────────────────────────────────────┐
│ C-UX-Scenarios/Functional-Components/button.md                         │
├──────────────────────────────────────────────────────────────┤
│ All variants, states, props, rules, accessibility defined    │
│ (Single source of truth for all buttons)                     │
└──────────────────────────────────────────────────────────────┘
                              ↓
AFTER: Component References (Concise)
┌──────────────────────────────────────────────────────────────┐
│ P02-signup-page/specification.md                             │
├──────────────────────────────────────────────────────────────┤
│ Submit Button:                                               │
│ - Component: Button (primary, lg)                            │
│ - Label: "Create Account"                                    │
│ - OnClick: Submit form                                       │
│                                                              │
│ 4 lines of specification (only instance-specific details)   │
│ All behavior inherited from Button component ✓               │
└──────────────────────────────────────────────────────────────┘
```

**Result:** 9 lines → 4 lines. Clearer, more maintainable, single source of truth.

---

## Step 5: Verify Consistency (5 min)

### Check for inconsistencies:

**Freya:**
> "Let me check your specs for consistency against the new components..."

> "Found 2 issues:
> 1. P03-settings uses 'Cancel' as secondary button, but P02-signup uses 'Back' — should terminology be consistent?
> 2. P04-profile has a button without specified variant — which should it be?"

**Resolve:**
> "Back for navigation, Cancel for canceling an action. The profile button should be primary."

**Freya updates the specs accordingly.**

---

## Step 6: Save Component Documentation (2 min)

### Organize files:

```
C-UX-Scenarios/Functional-Components/
└── components/
    ├── button.md
    ├── input.md
    ├── card.md
    └── ...
```

### Update component index:

```markdown
# Component Library

## Core Components
- [Button](components/button.md) - Action triggers
- [Input](components/input.md) - Text entry
- [Card](components/card.md) - Content containers

## Status
| Component | Status | Usage |
|-----------|--------|-------|
| Button | Complete | 7 instances |
| Input | Complete | 12 instances |
| Card | Complete | 4 instances |
```

---

## What You've Created

### Component documentation with:

- Description and purpose
- Variants for different use cases
- States with triggers and visuals
- Props with types and defaults
- Usage rules
- Accessibility requirements

### Updated page specifications:

- Reference components instead of inline definitions
- Only specify instance-specific details
- Consistent terminology

---

## Tips for Success

**DO:**

- Wait for 2+ usages before extracting
- Keep components generic enough to reuse
- Document usage rules clearly
- Update all page specs to reference components

**DON'T:**

- Extract everything
- Make components too specific
- Forget to document states
- Leave page specs with outdated inline definitions

---

## Common Questions

**Q: What if a component has a unique state in one place?**
A: Document it as a variant or extension. Or question whether it's really the same component.

**Q: Should I extract a pattern that's only used once?**
A: No. Wait for the second usage. Once is an instance, twice or more is a pattern.

**Q: What about third-party library components (Mode 3)?**
A: Document your customizations and token overrides, not the full component spec.

---

## You've Completed Module 12!

**Your reusable patterns are documented.** You have:
- Components extracted from specifications
- Consistent terminology across pages
- A foundation for design system growth

---

## Next Module

**[Module 13: Design System →](../module-13-design-system/module-13-design-system-overview.md)**

Choose your design system approach.

---

[← Back to Lesson 2](lesson-02-component-anatomy.md) | [Back to Module Overview](module-12-functional-components-overview.md)

*Part of Module 12: Functional Components*
