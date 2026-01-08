# Phase 5: Design System Workflow

## Overview

**Purpose:** Extract, organize, and maintain reusable design components as they're discovered during Phase 4 specification work.

**Key Principle:** Design system is **optional** and **on-demand**. Components are added as they surface, not created upfront.

---

## When This Workflow Runs

**Triggered from Phase 4:**

- After component specification is complete
- Only if design system is enabled in project
- First component triggers automatic initialization

**Not a Separate Phase:**

- Runs in parallel with Phase 4
- Integrated into component specification flow
- Designer doesn't "switch" to design system mode

---

## Three Design System Modes

**Chosen during Phase 1 (Project Exploration):**

### Mode A: No Design System

- Components stay page-specific
- AI/dev team handles consistency
- Faster for simple projects
- **This workflow doesn't run**

### Mode B: Custom Design System

- Designer defines components in Figma
- Components extracted as discovered
- Figma MCP endpoints for integration
- **This workflow extracts and links to Figma**
- **See:** `figma-integration/` folder for complete Figma workflow

### Mode C: Component Library Design System

- Uses shadcn/Radix/etc.
- Library chosen during setup
- Components mapped to library defaults
- **This workflow maps to library components**

---

## Architecture

### Three-Way Split

```
Page Specification (Logical View)
├── Component references
├── Page-specific content
└── Layout/structure

Design System (Visual/Component Library)
├── Component definitions
├── States & variants
└── Styling/tokens

Functionality/Storyboards (Behavior)
├── Interactions
├── State transitions
└── User flows
```

### Clean Separation

**Specification = Content** (what the component is)
**Organization = Structure** (where it lives)
**Design System = Optional** (chosen in Phase 1)

---

## Workflow Components

### 1. Design System Router

**File:** `design-system-router.md`

**Purpose:** Identify if component is new, similar, or duplicate

**Flow:**

```
Component specified → Router checks design system
├── No similar component → Create new
└── Similar component found → Opportunity/Risk Assessment
```

### 2. Opportunity/Risk Assessment

**Folder:** `assessment/`

**Purpose:** Help designer make informed decisions about component reuse

**7 Micro-Instructions:**

1. Scan existing components
2. Compare attributes
3. Calculate similarity
4. Identify opportunities
5. Identify risks
6. Present decision to designer
7. Execute decision

### 3. Component Operations

**Folder:** `operations/`

**Purpose:** Execute design system actions

**4 Operations:**

- Initialize design system (first component)
- Create new component
- Add variant to existing component
- Update component definition

### 4. Output Templates

**Folder:** `templates/`

**Purpose:** Consistent design system file structure

**3 Templates:**

- Component specification
- Design tokens
- Component library config

---

## Integration with Phase 4

**Called from:** `workflows/4-ux-design/substeps/4c-03-components-objects.md`

**Integration Point:**

```
For each component:
1. Specify component (Phase 4)
2. Component specification complete
3. → Check: Design system enabled?
4. → YES: Call design-system-router.md
5. → Router extracts component-level info
6. → Router returns reference
7. Update page spec with reference
8. Continue to next component
```

**Result:**

- Page spec contains references + page-specific content
- Design system contains component definitions
- Clean separation maintained

---

## Key Risks & Mitigation

### 1. Component Matching

**Risk:** How to recognize "same" vs "similar" vs "different"

**Mitigation:** Similarity scoring + designer judgment via assessment flow

### 2. Circular References

**Risk:** Page → Component → Functionality → Component

**Mitigation:** Clear hierarchy (Page → Component → Functionality)

### 3. Sync Problems

**Risk:** Component evolves, references may break

**Mitigation:** Reference IDs + update notifications

### 4. Component Boundaries

**Risk:** Icon in button? Nested components?

**Mitigation:** Designer conversation + guidelines in shared knowledge

### 5. First Component

**Risk:** When to initialize design system?

**Mitigation:** Auto-initialize on first component if enabled

### 6. Storyboard Granularity

**Risk:** Component behavior vs page flow

**Mitigation:** Clear separation guidelines in shared knowledge

---

## Shared Knowledge

**Location:** `data/design-system/`

**Purpose:** Centralized design system principles referenced by all component types

**Documents:**

- `token-architecture.md` - Structure vs style separation
- `naming-conventions.md` - Token naming rules
- `state-management.md` - Component states
- `validation-patterns.md` - Form validation
- `component-boundaries.md` - What's a component?
- `figma-component-structure.md` - Figma component organization (Mode B)

**Usage:** Component-type instructions reference these documents as needed

---

## Figma Integration (Mode B)

**Location:** `figma-integration/`

**Purpose:** Enable seamless Figma ↔ WDS synchronization for custom design systems

**Documents:**

- `figma-designer-guide.md` - Step-by-step guide for designers
- `figma-mcp-integration.md` - Technical MCP integration guide
- `figma-component-structure.md` - Component organization in Figma (in data/design-system/)
- `prototype-to-figma-workflow.md` - **NEW:** Extract HTML prototypes to Figma for visual refinement
- `when-to-extract-decision-guide.md` - **NEW:** Decision framework for prototype extraction

**Workflows:**

**A. Figma → WDS (Existing):**
1. Designer creates/updates component in Figma
2. Designer adds WDS component ID to description
3. MCP reads component via Figma API
4. Agent generates/updates WDS specification
5. Designer reviews and confirms

**B. Prototype → Figma → WDS (NEW):**
1. HTML prototype created (Phase 4D)
2. Extract to Figma using html.to.design
3. Designer refines visual design in Figma
4. Extract design system updates (tokens, components)
5. Re-render prototype with enhanced design system
6. Iterate until polished

**Key Features:**

- Component structure guidelines
- Design token mapping
- Variant and state organization
- Node ID tracking
- Bidirectional sync workflow
- **Iterative visual refinement** (prototype → Figma → design system → re-render)

---

## Company Customization

**Key Feature:** Companies can fork WDS and customize design system standards

**Customization Points:**

- `data/design-system/` - Company-specific principles
- `object-types/` - Company component patterns
- `templates/` - Company output formats

**Result:** Every project automatically uses company standards

---

## Output Structure

```
D-Design-System/
├── 01-Visual-Design/          [Early design exploration - pre-scenario]
│   ├── mood-boards/           [Visual inspiration, style exploration]
│   ├── design-concepts/       [NanoBanana outputs, design explorations]
│   ├── color-exploration/     [Color palette experiments]
│   └── typography-tests/      [Font pairing and hierarchy tests]
├── 02-Assets/                 [Final production assets]
│   ├── logos/                 [Brand logos and variations]
│   ├── icons/                 [Icon sets]
│   ├── images/                [Photography, illustrations]
│   └── graphics/              [Custom graphics and elements]
├── components/
│   ├── button.md              [Component ID: btn-001]
│   ├── input-field.md         [Component ID: inp-001]
│   ├── card.md                [Component ID: crd-001]
│   └── ...
├── design-tokens.md           Colors, spacing, typography
├── component-library-config.md Which library (if Mode C)
└── figma-mappings.md          Figma endpoints (if Mode B)
```

**Component File Structure:**

```markdown
# Button Component [btn-001]

**Type:** Interactive
**Library:** shadcn/ui Button (if Mode C)
**Figma:** [Link] (if Mode B)

## Variants

- primary
- secondary
- ghost

## States

- default
- hover
- active
- disabled

## Styling

[Design tokens or Figma reference]

## Used In

- Login page (login button)
- Signup page (create account button)
- Dashboard (action buttons)
```

---

## Next Steps

1. Read `design-system-router.md` to understand routing logic
2. Review `assessment/` folder for decision-making process
3. Check `operations/` for available actions
4. Reference `data/design-system/` for principles
5. Use `templates/` for consistent output

---

**This workflow is called automatically from Phase 4. You don't need to run it manually.**
