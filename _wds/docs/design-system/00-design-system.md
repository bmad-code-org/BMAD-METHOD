# WDS Design System Standards

**Version:** 1.0
**For:** Freya UX Designer Agent
**Purpose:** Complete reference for creating project design systems following WDS methodology

---

## 1. Atomic Design Methodology

Design systems are built using atomic design principles - organizing components by complexity.

### Hierarchy

```
Design Tokens (colors, typography, spacing)
  ↓
Atoms (basic building blocks)
  ↓
Molecules (simple combinations of atoms)
  ↓
Organisms (complex combinations of atoms + molecules)
  ↓
Patterns (page-level compositions)
```

### Atoms

**Definition:** Basic building blocks that cannot be broken down further without losing meaning.

**Examples:**
- Button
- Input field
- Icon
- Label
- Badge
- Avatar
- Link

**Characteristics:**
- Single-purpose elements
- No child components
- Highly reusable
- Configured through props

### Molecules

**Definition:** Simple combinations of atoms that work together as a unit.

**Examples:**
- Form Field (Label + Input + Helper text)
- Search Field (Input + Search icon + Clear button)
- Message Bubble (Avatar + Text + Timestamp)
- Nav Item (Icon + Label)
- Stat Card (Label + Value + Icon/Badge)

**Characteristics:**
- Combine 2-4 atoms
- Single functional purpose
- Reusable across contexts
- Document which atoms used (composition)

### Organisms

**Definition:** Complex components combining atoms and molecules into distinct sections.

**Examples:**
- Card (Header + Media + Content + Actions)
- Chat Interface (Header + Message Bubbles + Input Field)
- Navigation Header (Logo + Nav Items + User Menu)
- Modal (Overlay + Card + Actions)
- Data Table (Headers + Rows + Pagination)

**Characteristics:**
- Combine atoms + molecules
- Complex functionality
- Often context-specific
- Document complete composition tree

### Patterns

**Definition:** Page-level compositions and recurring design solutions.

**Examples:**
- Navigation patterns (header nav, sidebar nav, mobile menu)
- Form patterns (single-step, multi-step, inline validation)
- Layout patterns (dashboard, list-detail, content+sidebar)

**Characteristics:**
- Combine organisms
- Solve specific UX problems
- Context-dependent
- Document usage guidelines

---

## 2. Component Anatomy

Anatomy describes the structural parts that make up a component.

### Anatomy Documentation

Every component should document its anatomy:

**Example: Button Anatomy**

```
┌─────────────────────────────┐
│  [icon] Label Text [badge]  │  ← Container
└─────────────────────────────┘
     ↑        ↑         ↑
  Leading   Label   Trailing
   icon      text    element
```

**Parts:**
1. **Container** - Clickable surface (padding, background, border)
2. **Leading Icon** (optional) - Icon before label
3. **Label** (required) - Text describing action
4. **Trailing Element** (optional) - Icon, badge, or indicator after label

### Anatomy Standards

**Part Naming:**
- Use descriptive names (header, content, actions - not top, middle, bottom)
- Indicate optionality (required vs optional parts)
- Use consistent terminology across components

**Visual Representation:**
- Use ASCII diagrams for structure
- Label each part clearly
- Show hierarchy (container > children)

**Documentation:**
- List all parts
- Describe purpose of each
- Note which are required vs optional
- Include spacing between parts

---

## 3. Slots (Content Placeholders)

**Key Principle:** Structure is shared, content is page-specific.

### What Are Slots?

Slots are flexible content placeholders within components. The component defines WHERE content goes (slot architecture), but each page fills those slots with DIFFERENT content.

**Example: Button**

```yaml
# Component structure (shared):
Button:
  anatomy:
    - container
    - leadingIcon slot
    - label slot
    - trailingIcon slot

# Page 1 usage (content page-specific):
slots:
  label: "Download Report"
  leadingIcon: download-icon

# Page 2 usage (different content, same structure):
slots:
  label: "Submit"
  trailingIcon: arrow-right-icon
```

The button anatomy/structure never changes. Only the slot content changes per page.

### Slot Documentation Format

```markdown
## Slots

### 1. [Slot Name] (required/optional)
- **Type:** Text | Icon | Image | Component
- **Position:** [Where in anatomy]
- **Purpose:** [What it's for]
- **Examples:**
  - Page 1: [example content]
  - Page 2: [example content]
```

### Slot Naming Conventions

**Content Slots:**
- `label` - Primary text content
- `title` - Heading text
- `body` - Paragraph content
- `description` - Supporting text

**Media Slots:**
- `media` - Image, video, or chart area
- `icon` - Icon placeholder
- `avatar` - User image
- `thumbnail` - Preview image

**Positional Slots:**
- `leadingIcon` / `trailingIcon` - Icons before/after content
- `header` / `footer` - Top/bottom sections
- `actions` - Button/link area

**Complex Slots:**
- `children` - Default slot for nested content
- `items` - Array/list of content
- `[role]Content` - Role-specific content (e.g., `headerContent`)

### Slots vs Nested Components

**Slots:** Placeholders for content (text, icons, images)
**Nested Components:** When one component contains another component

Example - Card organism:
- **Slots:** title (text), body (text), media (image)
- **Nested Components:** contains Button atoms in actions area

---

## 4. Props (Configuration)

**Key Principle:** Props configure HOW a component looks and behaves (not WHAT content it shows).

### Props vs Slots

| Aspect | Props | Slots |
|--------|-------|-------|
| **Purpose** | Configure appearance/behavior | Fill with content |
| **Type** | Boolean, string, number, enum | Text, elements, components |
| **Example** | `size="large"`, `disabled=true` | `label="Submit"`, `icon=checkmark` |
| **Shared?** | Define available options | Content varies per usage |

### Standard Props

#### Visual Props
- `variant` - Visual style (primary, secondary, ghost, outlined, filled)
- `size` - Size variation (small, medium, large)
- `color` - Color theme (default, accent, success, warning, error)

#### State Props
- `disabled` - Boolean, disables interaction
- `loading` - Boolean, shows loading state
- `error` - Boolean, shows error state
- `active` - Boolean, active/selected state

#### Layout Props
- `fullWidth` - Boolean, expand to container width
- `padding` - Spacing inside component
- `margin` - Spacing outside component
- `alignment` - Text/content alignment

#### Behavior Props
- `onClick` - Function, click handler
- `onChange` - Function, change handler
- `placeholder` - String, placeholder text
- `required` - Boolean, required field

### Props Documentation Format

```markdown
## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'secondary' \| 'ghost' | 'primary' | Visual style |
| size | 'small' \| 'medium' \| 'large' | 'medium' | Component size |
| disabled | boolean | false | Disables interaction |
| fullWidth | boolean | false | Expand to container width |
```

---

## 5. States

Interactive states show how components respond to user interaction.

### Standard States

#### Default State
- Initial appearance
- No user interaction yet
- Resting state

#### Hover State
- Mouse over component
- Visual feedback (color shift, elevation)
- Indicates interactivity

#### Active/Pressed State
- User clicking/tapping
- Visual depression or color change
- Confirms interaction received

#### Focused State
- Keyboard focus
- Visible focus ring/outline
- Critical for accessibility

#### Disabled State
- Component non-interactive
- Reduced opacity/color
- Cursor: not-allowed
- No hover/active states

#### Loading State
- Async action in progress
- Spinner or skeleton
- Disabled interaction
- Indicates wait time

#### Error State
- Validation failure
- Red color, error icon
- Error message shown
- Highlights problem area

#### Success State
- Action completed successfully
- Green color, check icon
- Confirmation message
- Positive feedback

### State Documentation

```markdown
## States

### Default
- Background: [color]
- Text: [color]
- Border: [style]
- Elevation: [value]

### Hover
- Background: [color + overlay]
- Elevation: [increased]
- Cursor: pointer

### Active
- Background: [color + overlay]
- Elevation: [decreased]
- Scale: [slightly smaller]

### Disabled
- Background: [muted color]
- Text: [reduced opacity]
- Cursor: not-allowed
- No hover/active states
```

---

## 6. Variants

Variants are visual style variations of the same component.

### When to Create Variants

**Create variant when:**
- Visual style differs significantly
- Semantic meaning differs (primary vs secondary action)
- Context requires different emphasis

**Don't create variant when:**
- Only content changes (use slots instead)
- Only size changes (use size prop instead)
- Could be handled by props/states

### Standard Variant Types

#### Button Variants
- `primary` - Main actions (filled, high emphasis)
- `secondary` - Secondary actions (outlined, medium emphasis)
- `ghost` - Tertiary actions (text only, low emphasis)
- `text` - Minimal actions (no background)

#### Card Variants
- `elevated` - Shadow/elevation for depth
- `outlined` - Border, no shadow
- `filled` - Background color, no border/shadow

#### Alert/Badge Variants
- `info` - Informational (blue)
- `success` - Positive outcome (green)
- `warning` - Caution needed (yellow)
- `error` - Problem/failure (red)

### Variant Documentation

```markdown
## Variants

### Primary
- **Use:** Main call-to-action
- **Visual:** Filled background, brand color
- **Example:** "Submit", "Get Started", "Buy Now"

### Secondary
- **Use:** Secondary actions
- **Visual:** Outlined, no fill
- **Example:** "Cancel", "Learn More", "Back"

### Ghost
- **Use:** Tertiary/subtle actions
- **Visual:** No background or border, text only
- **Example:** "Skip", "Dismiss", "Not now"
```

---

## 7. Specifications

Technical measurements and implementation details.

### What to Specify

#### Dimensions
- Width (fixed, min, max, or fluid)
- Height (fixed, min, max, or auto)
- Aspect ratio (for media)

#### Spacing
- Padding (internal spacing)
- Margin (external spacing)
- Gap (space between child elements)

#### Typography
- Font family
- Font size
- Font weight
- Line height
- Letter spacing

#### Colors
- Background colors
- Text colors
- Border colors
- State color overlays

#### Borders
- Border width
- Border radius (corner rounding)
- Border style (solid, dashed, none)

#### Elevation
- Box shadow
- Z-index
- Layering order

### Specifications Documentation

```markdown
## Specifications

### Dimensions
- Min width: 64px
- Height: 40px (medium), 32px (small), 48px (large)
- Padding: 16px horizontal, 8px vertical

### Typography
- Font: Body-Medium
- Size: 14px
- Weight: 500
- Letter spacing: 0.1px

### Colors
- Background (primary): brand-500
- Text (primary): white
- Border: none
- Hover overlay: black 8% opacity

### Border
- Radius: 4px
- Width: 0px (no border for primary variant)

### Elevation
- Default: 0dp
- Hover: 2dp shadow
- Active: 0dp
```

---

## 8. Pattern Recognition (Freya's Workflow)

How Freya builds the design system incrementally during page design.

### Second-Occurrence Trigger

**Rule:** Document a component in the design system when it appears for the **second time** across pages.

**Rationale:**
- First occurrence: Might be one-off, wait and see
- Second occurrence: Pattern emerging, worth documenting
- Prevents premature abstraction

### Pattern Recognition Workflow

```
Page 1.1: Uses Button component
  → Freya: Notes first occurrence, continues

Page 1.2: Uses Button again (second occurrence)
  → Freya: "I've used 'Button' twice now. Should I document this in the design system?"
  → User: "Yes"
  → Freya: Creates atoms/button/ with complete documentation

Page 1.3: Uses Button + Card
  → Button: Already documented
  → Card: Second occurrence
  → Freya: "Card appears second time, adding to design system..."
  → Creates organisms/card/

Page 1.4: Uses Button + Card + Input
  → Button: Already documented
  → Card: Already documented
  → Input: Second occurrence
  → Freya: Documents Input component
```

### Component Classification

**Determining atom vs molecule vs organism:**

**Atom if:**
- Cannot be broken down further
- Single-purpose element
- No child components
- Examples: Button, Input, Icon, Label

**Molecule if:**
- Combines 2-4 atoms
- Simple functional unit
- Clear single purpose
- Examples: Form Field (Label + Input), Search Field (Input + Icon + Button)

**Organism if:**
- Combines atoms + molecules
- Complex functionality
- Multiple purposes/sections
- Examples: Card, Chat Interface, Navigation Header

**When uncertain:**
- Start with molecule
- Can promote to organism if complexity increases
- Better to start simpler, increase complexity as needed

### Incremental Documentation

**First documentation (second occurrence):**
- Create folder structure
- Document anatomy
- Document slots
- Document basic props/states
- Create 00-overview, 01-anatomy, 02-slots

**Subsequent occurrences:**
- Add new variants discovered
- Add new states observed
- Refine prop definitions
- Add usage examples
- Update existing files

### Documentation Checklist

When documenting a component on second occurrence:

- [ ] Create component folder (atoms/molecules/organisms/[component-name]/)
- [ ] Create 00-[name].md (overview)
- [ ] Create 01-anatomy.md (structural breakdown)
- [ ] Create 02-slots.md (content placeholders)
- [ ] Create 03-props.md or 03-composition.md
  - Atoms: props (configuration)
  - Molecules/Organisms: composition (which atoms/molecules used)
- [ ] Create 04-states.md (interactive states)
- [ ] Create 05-variants.md (visual variations)
- [ ] Create 06-specs.md (measurements) - if needed
- [ ] Update component index (04-components.md)

---

## 9. Component Documentation Template

### Atoms Template

```markdown
# [Component Name]

## Overview
[Brief description - what it is, primary purpose]

## Anatomy
[ASCII diagram showing structural parts]

**Parts:**
1. **[Part name]** (required/optional) - [Purpose]
2. **[Part name]** (required/optional) - [Purpose]

## Slots

### 1. [Slot Name] (required/optional)
- **Type:** [Text | Icon | Image | Component]
- **Position:** [Where in anatomy]
- **Purpose:** [What it's for]
- **Examples:**
  - [Example 1]
  - [Example 2]

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| [prop] | [type] | [default] | [description] |

## States

### [State Name]
- Background: [value]
- Text: [value]
- Border: [value]
- [Other properties]

## Variants

### [Variant Name]
- **Use:** [When to use]
- **Visual:** [How it looks]
- **Example:** [Example usage]

## Specifications

### Dimensions
- Width: [value]
- Height: [value]
- Padding: [value]

### Typography
- Font: [value]
- Size: [value]
- Weight: [value]

### Colors
- Background: [value]
- Text: [value]

### Border
- Radius: [value]
- Width: [value]

### Elevation
- Shadow: [value]
```

### Molecules/Organisms Template

Same as atoms template, but add:

```markdown
## Composition

This [molecule/organism] combines the following components:

### Atoms Used
| Atom | From | Role |
|------|------|------|
| [Component] | atoms/[name]/ | [Purpose in this molecule] |

### Molecules Used (organisms only)
| Molecule | From | Role |
|----------|------|------|
| [Component] | molecules/[name]/ | [Purpose in this organism] |

## Composition Diagram

```
┌─────────────────────────────────┐
│ [Molecule/Organism]             │
│  ├─ [Atom 1]                    │
│  ├─ [Atom 2]                    │
│  └─ [Molecule 1]                │
│      ├─ [Atom 3]                │
│      └─ [Atom 4]                │
└─────────────────────────────────┘
```
```

---

## 10. Complete Examples

### Example 1: Button (Atom)

**File:** `atoms/button/02-slots.md`

```markdown
# Button Slots

## Overview

Slots are content placeholders. Button structure is shared, content is page-specific.

## Slot Architecture

```
┌─────────────────────────────┐
│  [leadingIcon] [label] [trailingIcon]  │
└─────────────────────────────┘
      ↑           ↑          ↑
    Slot 1     Slot 2     Slot 3
```

## Available Slots

### 1. leadingIcon (optional)
- **Type:** Icon
- **Position:** Before label
- **Purpose:** Visual context for action
- **Examples:**
  - Download button: Download icon
  - Delete button: Trash icon
  - Submit button: Checkmark icon

### 2. label (required)
- **Type:** Text
- **Position:** Center
- **Purpose:** Describes the action
- **Examples:**
  - "Get Personalized Advice"
  - "Submit"
  - "Cancel"

### 3. trailingIcon (optional)
- **Type:** Icon or Badge
- **Position:** After label
- **Purpose:** Additional context
- **Examples:**
  - External link: Arrow-out icon
  - Loading: Spinner
  - Badge: Notification count

## Implementation

**Structure is shared:**
- Button anatomy (container, padding, border radius)
- States (hover, active, disabled)
- Visual style (colors, typography)

**Content is page-specific:**
- Each page fills slots with different content
- Same button component, different label/icons
```

---

### Example 2: Form Field (Molecule)

**File:** `molecules/form-field/03-composition.md`

```markdown
# Form Field Composition

## Overview

Form Field is a **molecule** that combines 3 atoms into a functional input unit.

## Composition Diagram

```
┌─────────────────────────────────┐
│ Form Field (molecule)           │
│  ├─ Label (atom)                │
│  ├─ Input (atom)                │
│  └─ Helper Text (atom)          │
└─────────────────────────────────┘
```

## Components Used

### Atoms
| Atom | From | Role |
|------|------|------|
| **Label** | `atoms/label/` | Field name, required indicator |
| **Input** | `atoms/input/` | Text entry field |
| **Helper Text** | `atoms/typography/` | Instructions or error messages |

## Composition Rules

1. **Label** is always above Input
2. **Helper Text** appears below Input
3. Spacing: 4px between Label and Input, 4px between Input and Helper
4. Error state: Helper Text turns red, Input gets red border

## Variants

### Standard
- Label + Input + Helper text (optional)

### Required
- Label + Required indicator (*) + Input + Helper text

### Error
- Label + Input (red border) + Error message (red)

### Disabled
- All atoms use disabled state
```

---

### Example 3: Card (Organism)

**File:** `organisms/card/02-slots.md`

```markdown
# Card Slots

## Overview

Card structure is reusable. Content filling each slot is page-specific.

## Slot Architecture

```
┌─────────────────────────────────┐
│ [header]                        │ ← Slot 1
├─────────────────────────────────┤
│ [media]                         │ ← Slot 2
├─────────────────────────────────┤
│ [title]                         │ ← Slot 3
│ [body]                          │ ← Slot 4
├─────────────────────────────────┤
│ [actions]                       │ ← Slot 5
└─────────────────────────────────┘
```

## Available Slots

### 1. header (optional)
- **Type:** Component (Avatar + Title + Subtitle + Menu)
- **Content Examples:**
  - User profile: Avatar, "John Doe", "2 hours ago"
  - Article card: Category badge, "Investments", "5 min read"

### 2. media (optional)
- **Type:** Image, Chart, or Video
- **Content Examples:**
  - Portfolio card: Performance chart
  - Article card: Hero image

### 3. title (required)
- **Type:** Text (Headline)
- **Content Examples:**
  - "Your Recommended Allocation"
  - "Getting Started with Investing"

### 4. body (optional)
- **Type:** Text (Paragraph)
- **Content Examples:**
  - "Based on your goals, we recommend..."
  - "Learn the fundamentals..."

### 5. actions (optional)
- **Type:** Buttons
- **Content Examples:**
  - Single: ["Learn More"]
  - Dual: ["Dismiss", "View Details"]

## Key Principle

**Shared:**
- Card anatomy (container, spacing, elevation)
- Visual style (colors, borders, shadows)
- Behavior (clickable, states)

**Page-Specific:**
- Content filling each slot
- Which slots are used
- How actions behave
```

---

## Summary

### Core Principles

1. **Atomic Design** - Organize by complexity (atoms → molecules → organisms)
2. **Anatomy** - Document structural parts clearly
3. **Slots** - Structure shared, content page-specific
4. **Props** - Configure appearance/behavior
5. **States** - Document all interactive states
6. **Variants** - Visual style variations
7. **Specifications** - Technical measurements
8. **Pattern Recognition** - Second occurrence triggers documentation
9. **Templates** - Use consistent documentation format
10. **Examples** - Learn from complete examples

### For Freya

**When designing pages:**
- Use components from existing design system
- Track component usage
- On second occurrence → ask to document
- Classify as atom/molecule/organism
- Document comprehensively using templates
- Extract design tokens (colors, typography, spacing)
- Build design system incrementally as patterns emerge

**Goal:** Every project gets a complete, well-documented design system that grows naturally from the actual page designs created.

---

**End of WDS Design System Standards**
