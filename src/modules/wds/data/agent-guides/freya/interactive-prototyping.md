# Freya's Interactive Prototyping Guide

**When to load:** When creating HTML prototypes or interactive mockups

---

## Core Principle

**HTML prototypes are THINKING TOOLS, not final products.**

Prototypes let users FEEL the design before we commit to production code. They reveal gaps in logic that static specs might miss.

---

## Why HTML Prototypes?

### Static Specs Can't Show
- ❌ How it FEELS to interact
- ❌ Where users get confused
- ❌ What's missing in the flow
- ❌ If the pacing feels right
- ❌ Whether copy actually works

### HTML Prototypes Reveal
- ✅ Interaction feels natural or awkward
- ✅ Information appears when needed
- ✅ Flow has logical gaps
- ✅ Users understand next steps
- ✅ Content triggers emotions

---

## Prototypes as Validation

**Think of prototypes as:**
- **Thinking tools** - Help us understand what we're building
- **Communication tools** - Show stakeholders/users the vision
- **Validation tools** - Catch problems before coding
- **Specification supplements** - Demonstrate what words can't

**NOT:**
- ❌ Production code (that's Phase 4 → BMM handoff)
- ❌ Pixel-perfect mockups (that's Figma's job)
- ❌ Final design (they're meant to evolve)

---

## When to Create Prototypes

### Always Create For
- Complex interactions (multi-step forms, wizards)
- Novel UI patterns (users haven't seen before)
- Critical flows (signup, purchase, onboarding)
- Content-heavy pages (validate information hierarchy)

### Optional For
- Simple pages (standard layouts)
- Repetitive patterns (once validated, reuse)
- Admin interfaces (if similar to known patterns)

**When in doubt → Prototype.** 30 minutes of HTML saves hours of rework.

---

## Prototype Fidelity Levels

### 1. Wireframe Prototype (Fastest)
- Basic HTML structure
- Placeholder content
- No styling (browser defaults)
- Focus: Information architecture

**Use when:** Testing flow logic only

---

### 2. Interactive Prototype (Standard)
- Structured HTML
- Actual content (multi-language)
- Basic CSS (layout, spacing, typography)
- Interactive elements (buttons, forms, navigation)

**Use when:** Validating user experience

---

### 3. Design System Prototype (If Enabled)
- Component-based HTML
- Design System classes
- Design tokens (colors, spacing)
- Real interactions

**Use when:** Phase 5 (Design System) is enabled

---

## Using Design System Components

### If Design System Enabled (Phase 5)

**Check first:**
1. Does this component exist in the Design System?
2. If yes → Use it
3. If similar → Assess opportunity/risk of creating variant
4. If no → Mark for future extraction

**In prototype:**
```html
<!-- Reference existing component -->
<button class="ds-button ds-button--primary">
  Sign Up
</button>

<!-- Or note for future -->
<!-- TODO: Extract as ds-card-feature component -->
<div class="temp-feature-card">
  ...
</div>
```

---

### If Design System Disabled

**Use page-specific classes:**
```html
<!-- Page-specific, won't be reused -->
<button class="landing-cta-primary">
  Sign Up
</button>
```

**Developers know:** No design system = implement as-is, no abstraction needed.

---

## What to Include in Prototypes

### Must Have
- ✅ All sections in correct order
- ✅ Actual content (headlines, copy, CTAs)
- ✅ Multi-language versions (separate HTML files or language toggle)
- ✅ Interactive elements (buttons, forms, links)
- ✅ Key states (default, hover, active, disabled)

### Optional
- Form validation (unless testing UX)
- Backend integration (never)
- Pixel-perfect design (Figma's job)
- Production-quality code (it's a prototype!)

---

## Prototype Validation Process

### 1. Internal Check
- Click through the flow yourself
- Does it feel natural?
- Any confusing moments?
- Missing information?
- Logical gaps?

### 2. Stakeholder Review
- Show prototype in conversation
- Watch where they pause or ask questions
- Note confusion points
- Validate assumptions

### 3. User Testing (Optional)
- If critical flow, test with 3-5 users
- Watch, don't explain
- Note where they struggle
- Identify patterns

### 4. Iterate
- Fix gaps revealed by validation
- Update specification accordingly
- Re-prototype if major changes

---

## Prototype → Specification Flow

**Prototypes inform specs, not replace them:**

1. **Create prototype** - Think through interaction
2. **Validate prototype** - Catch issues early
3. **Update specification** - Document what works
4. **Generate final spec** - With prototype insights

**Result:** Specification is battle-tested before development.

---

## Common Prototype Mistakes

### ❌ Over-Engineering
"Let me make this perfect production code..."
- **Why bad:** Wastes time, misses the point
- **Instead:** Quick and dirty is fine - it's a prototype

### ❌ Under-Engineering
"Just some divs with text..."
- **Why bad:** Can't validate actual experience
- **Instead:** Make it interactive enough to feel real

### ❌ Skipping Validation
"I know this works, no need to test..."
- **Why bad:** Your assumptions might be wrong
- **Instead:** Always validate with at least one other person

### ❌ Treating as Final
"This prototype IS the spec..."
- **Why bad:** Missing critical specification details
- **Instead:** Prototype → insights → specification

---

## Technical Notes

### File Structure
```
docs/C-Scenarios/[scenario-name]/prototypes/
├── landing-page-en.html
├── landing-page-se.html
├── signup-flow-en.html
└── styles.css (shared)
```

### Basic Template
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Page Name] - Prototype</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- Prototype content -->
  
  <!-- Note: This is a UX prototype, not production code -->
</body>
</html>
```

---

## Related Resources

- **Phase 4 Workflow:** `../../workflows/4-ux-design/`
- **Design System:** `../../workflows/5-design-system/`
- **Page Specification Template:** `../../workflows/4-ux-design/templates/page-specification.template.md`

---

*Show, don't tell. Let users FEEL the design before we build it.*

