# Tutorial 13: Apply Your Mode

**Hands-on guide to working effectively in your design system mode**

---

## Overview

This tutorial helps you verify your mode choice and work effectively within it.

**Time:** 15-20 minutes
**Prerequisites:** Visual designs completed (Module 13)
**Agent:** Freya
**What you'll do:** Review and optimize your design system approach

---

## Before You Start

**Know your mode:**

- Mode 1: None (inline styling)
- Mode 2: Building (extracting components)
- Mode 3: Library (using external library)
- Mode 4: Existing (importing previous system)

**If unsure, ask Freya:**
> "What design system mode are we using for this project?"

---

## Mode 1: None — Tutorial

### Verify inline specifications are complete:

**Check each page spec:**

```markdown
### Submit Button
- Style: bg #0066FF, text white, 16px, rounded 6px
- Padding: 14px vertical, 24px horizontal
- States: hover (darken 10%), active (scale 98%), loading (spinner), disabled (opacity 50%)
- Label: "Create Free Account"
```

### Consistency check:

**Freya asks:**
> "I notice you have similar buttons on 3 pages. Their styling is slightly different:
> - P01: rounded 6px
> - P02: rounded 8px
> - P03: rounded 6px
>
> Should these be consistent?"

**Resolve inconsistencies manually** since there's no central component.

### When to upgrade:

If you find yourself fixing the same inconsistency repeatedly, consider upgrading to Mode 2.

---

## Mode 2: Building — Tutorial

### Review extracted components:

**Freya summarizes:**
> "Your design system has grown to include:
>
> **Components:**
> - Button (3 variants, 5 states)
> - Input (3 types, 4 states)
> - Card (2 variants)
>
> **Tokens:**
> - 6 colors defined
> - Typography scale
> - Spacing scale
>
> All page specs reference these components."

### Check for missing patterns:

**Freya:**
> "Looking at your specs, I see a repeated pattern that isn't extracted yet:
>
> Form Field Group (label + input + error message) appears 8 times.
>
> Should we extract this as a component?"

**You decide:**
> "Yes, let's extract it."

**Freya creates:**
```markdown
# FormField Component

## Description
Container for label, input, helper text, and error message.
Provides consistent spacing and error handling.

## Props
| Prop | Type | Description |
|------|------|-------------|
| label | string | Field label |
| input | Input | The input component |
| helper | string | Helper text (optional) |
| error | string | Error message (optional) |

## States
- Default: Label + input visible
- With helper: Helper text below input
- Error: Error message replaces helper, input bordered red
```

### Update specs to use new component:

**Before:**
```markdown
### Email Section
- Label: "Email" (above, 14px, #374151)
- Input: email type, placeholder "you@example.com"
- Helper: none
- Error: "Please enter a valid email" (when invalid)
```

**After:**
```markdown
### Email Section
- Component: FormField
- Label: "Email"
- Input: Input (email)
- Placeholder: "you@example.com"
- Error: "Please enter a valid email"
```

---

## Mode 3: Library — Tutorial

### Verify library component usage:

**Freya checks:**
> "You're using shadcn components. Let me verify your usage:
>
> **Correctly used:**
> - Button (default, destructive, outline variants)
> - Input (with FormField wrapper)
> - Card (default)
>
> **Token overrides:**
> - Primary color: #0066FF (applied)
> - Border radius: 6px (applied)
> - Font: Inter (applied)
>
> **Custom additions:**
> - TaskCard (extends shadcn/Card) — documented
> - StrengthIndicator — custom component
>
> Everything looks aligned."

### Check token application:

```yaml
# D-Design-System/tokens/colors.yaml
colors:
  background: "#FFFFFF"
  foreground: "#111827"
  primary: "#0066FF"
  primary-foreground: "#FFFFFF"
  secondary: "#F3F4F6"
  secondary-foreground: "#374151"
  destructive: "#DC2626"
  destructive-foreground: "#FFFFFF"
  muted: "#F9FAFB"
  muted-foreground: "#6B7280"
```

### Document custom components:

If you created components beyond the library, document them:

```markdown
# StrengthIndicator (Custom)

## Description
Password strength feedback component.
Not from shadcn — custom for this project.

## Props
| Prop | Type | Description |
|------|------|-------------|
| strength | number | 0-4 strength level |

## Visual
- 4 bars, filling based on strength
- Colors: red (1), orange (2), yellow (3), green (4)
```

---

## Mode 4: Existing — Tutorial

### Review imported components:

**Freya:**
> "Importing design system from Acme Project v2...
>
> **Available components:**
> - Button (4 variants)
> - Input (5 types)
> - Card, Modal, Toast
> - Form patterns
>
> **Token values:**
> - Brand colors (Acme palette)
> - Typography (Inter scale)
> - Spacing (8px base)
>
> Ready to use. Any extensions needed?"

### Extend for new project:

**You say:**
> "This project needs a new Button variant: 'outline-primary' — blue border, transparent background."

**Freya extends:**
```markdown
# Button Component (Extended)

## New Variant: outline-primary
- Border: 1px solid #0066FF
- Background: transparent
- Text: #0066FF
- Hover: Background #0066FF/10%

Added for: New Project
Reason: Secondary CTAs need brand color visibility
```

### Track extensions:

```markdown
# Design System Extensions — New Project

## New Variants
- Button: outline-primary

## New Components
- None yet

## Token Overrides
- None (using Acme palette)
```

---

## All Modes: Final Check

### Verify alignment:

| Check | Action |
|-------|--------|
| All page specs use correct component references | Review each spec |
| No orphan inline styles (Mode 2-4) | Search for inline definitions |
| Tokens applied consistently | Check visual prototypes |
| New patterns documented | Add to design system |

### Document your mode:

Add to project README or design system index:

```markdown
# Design System

## Mode: Building (Mode 2)

## Components
See: C-UX-Scenarios/Functional-Components/

## Tokens
See: D-Design-System/tokens/

## Usage
All page specifications reference components from this system.
Do not use inline styles for elements that have component definitions.
```

---

## What You've Accomplished

### By mode:

**Mode 1:** Verified all inline specs are complete and consistent

**Mode 2:** Components extracted, patterns identified, specs updated

**Mode 3:** Library components correctly used, tokens applied, customs documented

**Mode 4:** System imported, extensions added, tracking in place

---

## Tips for Success

**DO:**

- Review mode choice periodically
- Extract patterns when they repeat 3+ times
- Document deviations and extensions
- Keep tokens in sync with visuals

**DON'T:**

- Mix approaches (inline + components randomly)
- Forget to update specs when extracting
- Over-engineer for small projects
- Ignore library conventions in Mode 3

---

## You've Completed Module 13!

**Your design system mode is optimized.** You understand:
- How your mode works
- Where components live
- How to extend the system
- How to maintain consistency

---

## Next Module

**[Module 14: Agentic Development →](../module-14-agentic-development/module-14-agentic-development-overview.md)**

Generate working prototypes from your specifications.

---

[← Back to Lesson 1](lesson-01-understanding-modes.md) | [Back to Module Overview](module-13-design-system-overview.md)

*Part of Module 13: Design System*
