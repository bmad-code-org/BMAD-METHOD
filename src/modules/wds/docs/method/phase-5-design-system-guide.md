# Phase 5: Design System (Component Library)

**Agent:** Baldr the UX Expert  
**Output:** `D-Design-System/` (or your configured prefix)

---

## What This Phase Does

Design System builds your component library following atomic design principles. Working with Baldr, you create reusable patterns that serve user psychology and ensure visual consistency.

**The key approach:** The design system grows **alongside** Phase 4 work. As you sketch and specify pages, you simultaneously extract and document components. By the time your scenarios are complete, your design system is already built.

---

## What You'll Create

Your Design System includes:

- **Visual Design (01-Visual-Design/)** - Early design exploration before scenarios
  - Mood boards and style direction
  - NanoBanana design concepts
  - Color and typography exploration
  - Visual inspiration and references
- **Assets (02-Assets/)** - Final production assets
  - Logos and brand elements
  - Icon sets
  - Photography and illustrations
  - Custom graphics
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

### The Parallel Workflow

Phase 5 isn't a separate phase you do _after_ Phase 4 - it happens **during** Phase 4:

```
Phase 4 Page Design          →    Phase 5 Design System
─────────────────                  ─────────────────
Sketch button for Page 1.1   →    Create "Primary Button" atom
Reuse button on Page 1.2     →    Reference existing atom
Sketch input for Page 2.1    →    Create "Text Input" atom
Create form on Page 2.2      →    Create "Form Group" molecule
Notice pattern across pages  →    Extract as reusable component
```

**The rhythm:**

1. Design a page/component in Phase 4
2. Notice "This could be reusable"
3. Extract to Design System
4. Next page references the system component
5. Repeat

### Visual Design Exploration (01-Visual-Design/)

**Independent Design Phase - Can Start Anytime:**

**Key Insight:** Brand identity and visual design are NOT tied to the product! You can establish your visual identity at any time - before, during, or after product strategy work.

**Purpose:** Establish the visual language that will tie UX to Brand. This is where you define how your brand's personality will be expressed visually across all touchpoints.

**Timing Options:**
- **Before product work:** Establish brand identity first, then build products around it
- **Parallel to strategy:** Develop visual identity while defining product strategy
- **After strategy:** Use strategic insights to inform visual direction

Before diving into scenario-specific design (Phase 4), establish your visual direction:

**Mood Boards:**
- Collect visual inspiration
- Define style direction (modern, playful, professional, etc.)
- Establish visual tone and personality
- Reference examples from similar products

**Design Concepts (NanoBanana):**
- Generate design variations using NanoBanana
- Explore different visual approaches
- Create custom graphics and illustrations
- Generate placeholder assets for prototypes

**Color Exploration:**
- Test color palette options
- Define primary, secondary, and semantic colors
- Ensure accessibility (contrast ratios)
- Document color psychology and usage

**Typography Tests:**
- Experiment with font pairings
- Define hierarchy (headings, body, labels)
- Test readability at different sizes
- Document font usage guidelines

**When to Use:**
- **AFTER Phase 1 & 2** (Product Brief and Trigger Map must be complete first!)
- When establishing brand identity (with strategic context)
- When exploring multiple visual directions (informed by user psychology)
- Before committing to design tokens
- Before Phase 4 scenarios (but after strategic foundation)

**Output Location:** `D-Design-System/01-Visual-Design/`

---

### Production Assets (02-Assets/)

**Later in Design Process - As Design Solidifies:**

Once your visual direction is established and scenarios are designed:

**Logos:**
- Final logo files (SVG, PNG)
- Logo variations (light/dark, horizontal/vertical)
- Brand mark and wordmark
- Usage guidelines

**Icons:**
- Icon sets for UI elements
- Custom icons for product features
- Consistent style and sizing
- Multiple formats (SVG, PNG)

**Images:**
- Photography for product pages
- Illustrations for empty states
- Hero images and backgrounds
- Optimized for web

**Graphics:**
- Custom graphics and elements
- Decorative elements
- Patterns and textures
- Exported from NanoBanana or Figma

**When to Add:**
- After visual direction is established
- When design is near completion
- Before development handoff
- As final assets are created

**Output Location:** `D-Design-System/02-Assets/`

---

### Figma Integration (Optional)

**Automated Visual Refinement:**

WDS supports automated Figma integration via MCP server for visual design refinement:

**Workflow:**
1. Create functional prototype in Phase 4D
2. Freya identifies components needing visual polish
3. Freya injects components to Figma automatically (via MCP server)
4. Designer refines visual design in Figma
5. Freya reads refined components back automatically
6. Design system updated with new tokens/components
7. Prototype re-rendered with polished design

**Benefits:**
- Build design system organically (no upfront investment)
- Component-level precision (not full-page extraction)
- Automated Object ID traceability
- Bidirectional sync (Prototype ↔ Figma ↔ Design System)

**Tools:**
- **Figma MCP** (recommended): Automated integration via MCP server
- **Figma**: Visual design tool for refinement
- See: [Figma Integration Guide](../../workflows/5-design-system/figma-integration/prototype-to-figma-workflow.md)

---

### Component Extraction

As you specify scenarios in Phase 4, components naturally emerge:

1. **Identify patterns** - "This button style appears in multiple places"
2. **Extract to system** - Document the component with all variants
3. **Reference in specs** - Link scenario specs to system components

---

## Creating Your Design System Documentation

### The Extraction Process

**Step 1: Spot the Pattern**

While working on Phase 4 scenarios, notice when you're designing something reusable:

- "I just designed this button for Page 1.1... and I need it again on Page 1.2"
- "This form input pattern will be used everywhere"
- "We have 3 different card layouts, but they share the same structure"

**Step 2: Create the Component Document**

In your `D-Design-System/` folder, create a component file:

```
D-Design-System/
├── 01-design-tokens.md
├── 02-atoms/
│   ├── primary-button.md          ← Create this
│   ├── text-input.md
│   └── ...
├── 03-molecules/
│   └── form-group.md
└── 04-organisms/
    └── page-header.md
```

**Step 3: Document the Component**

Use this template for each component:

````markdown
# Primary Button

## Overview

The primary button is used for the main call-to-action on any page or section.

## Component Details

**Category:** Atom
**Object ID Pattern:** `*-primary-button`
**Component Library:** [If using one, e.g., "Chakra UI Button"]
**Figma Component:** Primary Button

## Variants

### Size

- **Small:** Compact spaces, secondary actions
- **Medium:** Default size for most use cases
- **Large:** Hero sections, important CTAs

### State

- **Default:** Ready for interaction
- **Hover:** Visual feedback on mouse over
- **Active:** Currently being clicked
- **Disabled:** Action not available
- **Loading:** Processing user action

## Visual Specifications

**Design Tokens:**

- Background: `color-primary-500`
- Text: `color-white`
- Border Radius: `radius-md`
- Padding: `spacing-3` (vertical), `spacing-6` (horizontal)
- Font: `font-semibold`, `text-base`

**States:**

- Hover: `color-primary-600`
- Active: `color-primary-700`
- Disabled: `color-gray-300`, opacity 50%

## Usage Guidelines

**When to use:**

- Primary action on a page or modal
- Main CTA in hero sections
- Form submissions
- Confirmation actions

**When NOT to use:**

- Multiple primary actions (use secondary instead)
- Destructive actions (use danger variant)
- Navigation (use links or secondary buttons)

## Accessibility

- Minimum contrast ratio: 4.5:1
- Keyboard accessible (Enter/Space)
- Focus visible indicator
- ARIA label when icon-only

## Example Usage

**In specifications:**

```markdown
### Submit Button

**Object ID:** `contact-form-submit-button`
**Component:** primary-button
**Variant:** size=large
**State:** default → loading → success
```
````

**In Figma:**
Use "Primary Button" component from library

**In Code (if using Chakra):**

```jsx
<Button colorScheme="blue" size="lg">
  Submit
</Button>
```

## Used In

- 1.1-Start-Page: Hero CTA
- 1.2-Sign-Up: Submit registration
- 2.1-Contact-Form: Send message
- [Update as you use the component]

```

**Step 4: Update as You Go**

Each time you use this component in a new scenario:
1. Add it to the "Used In" section
2. Note any new variants discovered
3. Update specifications if the component evolves

### Interactive Component Gathering

**As you work through Phase 4:**

```

Design Page 1.1
↓
Notice: "This button is reusable"
↓
Create: primary-button.md in Design System
↓
Reference in 1.1 spec: component=primary-button
↓
Design Page 1.2
↓
Need same button: Reference existing component
↓
Design Page 2.1
↓
Need slightly different: Add variant to component doc
↓
Update all references with new variant option

```

---

## Interactive HTML Component Showcase

Beyond documentation, create an **interactive HTML guide** where stakeholders and developers can see and interact with all components.

### Structure

```

D-Design-System/
├── component-showcase.html ← Interactive guide
├── component-showcase.css
├── component-showcase.js
├── 01-design-tokens.md
├── 02-atoms/
│ ├── primary-button.md
│ └── ...

````

### What the Showcase Includes

**For each component:**
1. **Live rendered examples** - See the actual component
2. **All variants** - Size, state, and style options
3. **Interactive states** - Hover, click, focus to see behavior
4. **Visual specifications** - Design tokens, spacing, colors used
5. **Usage notes** - When to use this component

### Building the Showcase

**As you document each component:**

1. **Add to showcase HTML** - Create a card with live examples
2. **Show all variants** - Size, state, visual options
3. **Make it interactive** - Buttons click, inputs accept text, states change
4. **Display tokens** - Show the actual colors, fonts, spacing
5. **Keep it synced** - Update when components evolve

**Use the provided templates:**

Find ready-to-use templates in:
- `reference/templates/component-showcase-template.html`
- `reference/templates/component-card-template.html`

See complete examples in:
- `examples/dog-week-patterns/D-Design-System/component-showcase.html`

### Benefits

**For Designers:**
- Visual inventory of all components
- See components in isolation
- Test interactions and states
- Share with stakeholders for feedback

**For Developers:**
- Visual reference for implementation
- Understand variant options
- See all states and interactions
- Check responsive behavior

**For Stakeholders:**
- See the design language
- Review consistency
- Experience interactive components
- Provide informed feedback

**For QA:**
- Test all component states
- Verify accessibility
- Check responsive behavior
- Document expected behavior

### Maintaining the Showcase

**Keep it current:**
- Add new components as they're documented
- Update when variants change
- Remove deprecated components
- Sync with Figma library updates

**Single source of truth:**
- Markdown docs = specifications and usage
- HTML showcase = visual reference and interaction
- Figma = design source
- Code = implementation

All four should stay aligned.

---

## Component Documentation

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

## Choosing a Component Library

### Build vs. Use Existing

**Build your own Design System when:**
- Unique brand identity required
- Custom interactions not available in libraries
- Full control over every detail needed
- Have design resources to maintain system

**Use existing component library when:**
- Fast time to market
- Standard UI patterns sufficient
- Limited design resources
- Want battle-tested accessibility

**WDS supports both approaches** - you can document either custom components or library components using the same structure.

---

## Recommended Component Libraries

These libraries work well with WDS's specification approach:

### React Ecosystem

**Shadcn/ui** (Recommended for flexibility)
- Not a library, but a collection of copy-paste components
- Built on Radix UI primitives (excellent accessibility)
- [ui.shadcn.com](https://ui.shadcn.com)

*Pros:*
- Full component ownership - code lives in your repo
- Easy to customize without fighting library constraints
- No package bloat or version conflicts
- Perfect for WDS documentation (you own the code)

*Cons:*
- Manual updates when new versions release
- Need to maintain copied code yourself
- Requires understanding of component internals

---

**Chakra UI** (Recommended for speed)
- Comprehensive component library
- Excellent TypeScript support
- Built-in dark mode and theming
- [chakra-ui.com](https://chakra-ui.com)

*Pros:*
- Fast to get started - works out of the box
- Excellent accessibility defaults
- Great developer experience
- Active community and good documentation

*Cons:*
- Less control over internals
- Can be opinionated about styling approach
- Larger bundle size than headless options

---

**Radix UI** (Recommended for headless)
- Unstyled, accessible components
- Complete control over styling
- Composable primitives
- [radix-ui.com](https://radix-ui.com)

*Pros:*
- Best-in-class accessibility built-in
- Total styling freedom
- Small bundle size (only import what you need)
- No design opinions forced on you

*Cons:*
- Requires you to style everything yourself
- Steeper learning curve than styled libraries
- More initial setup work

---

**Material UI (MUI)**
- Mature, comprehensive library
- Material Design by default (can customize)
- Large ecosystem of additional packages
- [mui.com](https://mui.com)

*Pros:*
- Battle-tested with large community
- Very comprehensive component set
- Good documentation and examples
- Material Design is familiar to users

*Cons:*
- Heavy bundle size
- Material Design aesthetic hard to override
- Can feel dated for modern designs
- Customization can be complex

### Vue Ecosystem

**Nuxt UI**
- Built for Nuxt/Vue 3
- Modern, fast, accessible
- [ui.nuxt.com](https://ui.nuxt.com)

*Pros:*
- Optimized specifically for Nuxt
- Modern design aesthetics
- Good performance
- Growing ecosystem

*Cons:*
- Nuxt-specific (not for plain Vue)
- Younger library with smaller community
- Less comprehensive than mature alternatives

---

**PrimeVue**
- Rich component set
- Multiple themes available
- Enterprise-focused
- [primevue.org](https://primevue.org)

*Pros:*
- Very comprehensive component library
- Multiple pre-built themes
- Good for complex enterprise UIs
- Active development

*Cons:*
- Can feel corporate/dated
- Larger bundle size
- Theme customization can be complex

### Framework-Agnostic

**Tailwind CSS** (Recommended for design freedom)
- Utility-first CSS framework
- Combine with headless components
- Maximum flexibility
- [tailwindcss.com](https://tailwindcss.com)

*Pros:*
- Complete design freedom
- Small production bundle (unused styles purged)
- Fast prototyping with utility classes
- Pairs perfectly with WDS specifications

*Cons:*
- Not a component library (need to build or combine)
- HTML can get verbose
- Learning curve for utility-first approach
- Need separate component primitives (e.g., Radix)

### Selection Criteria

**Choose based on:**

| Priority | Consider |
|----------|----------|
| **Speed** | Chakra UI, MUI, PrimeVue (ready-to-use) |
| **Customization** | Shadcn/ui, Radix UI, Tailwind (full control) |
| **Accessibility** | Radix UI, Chakra UI (built-in a11y) |
| **Design System** | Shadcn/ui, custom components (full documentation) |
| **Team Familiarity** | What your dev team already knows |

### WDS Integration Pattern

**With existing library:**
1. Document library components in your WDS Design System
2. Reference library component names in specifications
3. Add project-specific variants/customizations
4. Maintain consistency across your product

**Example WDS entry for library component:**
```markdown
## Primary Button

**Library Component:** Chakra UI Button
**Import:** `import { Button } from '@chakra-ui/react'`

**Usage in WDS:**
- Object ID suffix: `-primary-button`
- Figma Component: Primary Button
- Props: `colorScheme="blue" size="lg"`

**Variants:**
- Default: `variant="solid"`
- Secondary: `variant="outline"`
- Ghost: `variant="ghost"`

**When to use:**
Primary call-to-action buttons...
````

---

## Design Application Integration

Your WDS component system connects to your visual design tools (Figma, Sketch, Adobe XD):

### Unified Naming Convention

**Use the exact same names across all tools:**

| WDS Component Name | Figma Component | Code Component  | Object ID          |
| ------------------ | --------------- | --------------- | ------------------ |
| `primary-button`   | Primary Button  | `PrimaryButton` | `*-primary-button` |
| `text-input`       | Text Input      | `TextInput`     | `*-text-input`     |
| `form-group`       | Form Group      | `FormGroup`     | `*-form-group`     |

### The Workflow

```
WDS Specification → Figma Design → Code Implementation
─────────────────    ─────────     ──────────────────
1. Document          2. Create      3. Build with
   "primary-button"     component      same name
   in Design System     in Figma       in code

Object IDs reference the same names:
signin-form-submit-primary-button (everywhere)
```

### Figma/Design Tool Setup

**Component Library Structure:**

Match your WDS atomic design structure:

```
Design File/
├── 🎨 Design Tokens
│   ├── Colors
│   ├── Typography
│   └── Spacing
├── ⚛️ Atoms
│   ├── primary-button
│   ├── text-input
│   └── ...
├── 🧬 Molecules
│   ├── form-group
│   ├── search-bar
│   └── ...
└── 🧩 Organisms
    ├── page-header
    └── ...
```

**Naming in Figma:**

- Component names match WDS names (kebab-case or Title Case)
- Variants match WDS variants (Primary, Secondary, Disabled)
- Properties match WDS states (default, hover, active, error)

### Benefits of Unified Naming

- **Designers:** Find components easily in Figma library
- **Developers:** No translation needed from design to code
- **Testers:** Object IDs make sense and are predictable
- **Documentation:** Single source of truth for naming
- **Handoff:** Zero ambiguity about which component to use

### When You Design in Figma

1. **Reference your WDS Design System** for component names and structure
2. **Create visual designs** using those exact names
3. **Export/handoff** with matching naming to developers
4. **Specifications remain in WDS** - Figma provides the pixels, WDS provides the logic

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

**Enable Design System phase if:**

- Building reusable component library
- Multiple pages/scenarios with shared patterns
- Need design consistency across product
- Handoff requires component documentation

**Work in parallel with Phase 4 when enabled:**

- As you sketch, identify component patterns
- As you specify, extract to Design System
- Design System grows with each page completed
- No separate "design system phase" at the end

**Skip this phase if:**

- Small project (single landing page)
- Using existing design system (Material, Chakra, etc.)
- One-off designs without reuse
- Quick prototype or MVP without component library needs

**Dedicated consolidation when:**

- Multiple scenarios complete, need cleanup
- Preparing for development handoff
- Found inconsistencies to resolve
- Onboarding new team members

> **Note:** You'll choose whether to enable the Design System phase during project setup (`workflow-init`). This decision can be revisited as your project grows.

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

_Phase 5 of the Whiteport Design Studio method_
