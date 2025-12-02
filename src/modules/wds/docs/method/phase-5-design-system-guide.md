# Phase 5: Design System (Component Design)

**Agent:** Baldr the UX Expert  
**Output:** `D-Design-System/` (or your configured prefix)  
**Duration:** Ongoing (grows with your product)

---

## What This Phase Does

Design System builds your component library following atomic design principles. Working with Baldr, you create reusable patterns that serve user psychology and ensure visual consistency.

The design system grows organically from your Phase 4 specifications - as you design scenarios, components are extracted and documented here.

---

## What You'll Create

Your Design System includes:

- **Design Tokens** - Colors, typography, spacing, shadows
- **Atomic Components** - Buttons, inputs, labels, icons
- **Molecular Components** - Form groups, cards, list items
- **Organism Components** - Headers, footers, complex sections
- **Usage Guidelines** - When and how to use each component
- **Component Variants** - Different states and sizes

---

## Atomic Design Structure

Following Brad Frost's methodology:

### Foundation (Design Tokens)
The values everything else builds on:
- **Colors** - Primary, secondary, semantic (success, error, warning)
- **Typography** - Font families, sizes, weights, line heights
- **Spacing** - Consistent spacing scale
- **Shadows** - Elevation levels
- **Borders** - Radius and stroke styles
- **Breakpoints** - Responsive design points

### Atoms
The smallest building blocks:
- Buttons
- Input fields
- Labels
- Icons
- Badges
- Dividers

### Molecules
Groups of atoms working together:
- Form groups (label + input + error)
- Search bars (input + button)
- Card headers (title + action)
- Navigation items (icon + label)

### Organisms
Complex components made of molecules:
- Page headers
- Navigation bars
- Form sections
- Card layouts
- List views

---

## How It Works

### Component Extraction

As you specify scenarios in Phase 4, components naturally emerge:

1. **Identify patterns** - "This button style appears in multiple places"
2. **Extract to system** - Document the component with all variants
3. **Reference in specs** - Link scenario specs to system components

### Component Documentation

Each component includes:

**Purpose & Usage**
- When to use this component
- When NOT to use it
- Psychological intent (connects to Trigger Map)

**Variants**
- Size options (small, medium, large)
- State options (default, hover, active, disabled)
- Visual variants (primary, secondary, ghost)

**Specifications**
- Design tokens used
- Spacing and sizing
- Responsive behavior

**Implementation Notes**
- Technical guidance for developers
- Accessibility requirements
- Animation/interaction details

---

## Trigger Map Connection

Components aren't just visual - they serve user psychology:

**Example: Primary Button**
- **Serves trigger:** Reduces decision anxiety for professional users
- **Design intent:** Bold, confident, clear
- **Psychological purpose:** Makes taking action feel safe

**Example: Error Message**
- **Serves trigger:** Prevents frustration and abandonment
- **Design intent:** Clear, helpful, non-judgmental
- **Psychological purpose:** Recovery feels possible

---

## Growing the System

The design system is living documentation that grows with your product:

### Starting Point
Begin with what you need for current scenarios:
- Extract components from Phase 4 work
- Document only what you're actually using
- Avoid speculating about future needs

### Evolution
As you design more scenarios:
- New patterns emerge → add to system
- Inconsistencies appear → consolidate
- Components evolve → update documentation

### Maintenance
- Keep specs in sync with implementation
- Remove unused components
- Update when design language evolves

---

## When to Use This Phase

**Build alongside Phase 4:**
- As you design scenarios, extract components
- Design system grows organically with specs

**Dedicated design system work when:**
- Consolidating after multiple scenarios
- Preparing for development sprint
- Onboarding new team members

**Skip formal documentation if:**
- Very small project
- One-off design without reuse
- Using existing design system

---

## What to Prepare

Bring:
- Completed or in-progress scenario specs (Phase 4)
- Any existing brand guidelines
- Technical framework constraints (React components, etc.)

---

## What Comes Next

Your Design System enables:

- **Consistent implementation** - Developers build from clear specs
- **Faster design** - Reuse components across scenarios
- **Phase 6 handoff** - Complete component inventory

---

## Tips for Great Sessions

**Extract, don't invent**
- Components should come from real design needs
- Don't create components "just in case"
- Let the system grow from actual scenarios

**Document the why**
- Why does this button look this way?
- What user trigger does it serve?
- When should developers use variant A vs B?

**Stay consistent**
- Same component = same specification
- Variations should be intentional
- When in doubt, simplify

**Connect to psychology**
- Every design choice serves a purpose
- Reference your Trigger Map
- Components should feel intentional, not arbitrary

---

## Example Output

See: `examples/dog-week-patterns/D-Design-System/` for a complete Design System from a real project.

---

*Phase 5 of the Whiteport Design Studio method*

