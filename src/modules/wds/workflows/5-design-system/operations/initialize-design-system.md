# Operation: Initialize Design System

**Purpose:** Create design system folder structure for the first component.

**When:** First component in project with design system enabled

**Input:** First component specification + design system mode

**Output:** Design system folder structure + first component

---

## Step 1: Confirm Initialization

<output>
```
🎉 Initializing Design System!

This is your first design system component.
I'll create the folder structure and add this component.

Design System Mode: [Custom/Library]
Component Library: [shadcn/Radix/etc. if applicable]

```
</output>

---

## Step 2: Create Folder Structure

<action>
Create design system folders:
```

D-Design-System/
├── components/
├── design-tokens.md (placeholder)
├── component-library-config.md (if Mode C)
└── figma-mappings.md (if Mode B)

```
</action>

<output>
```

📁 Created Design System Structure:

D-Design-System/
├── components/ (empty, ready for first component)
├── design-tokens.md (placeholder)
└── [mode-specific files]

✅ Folder structure ready!

````
</output>

---

## Step 3: Create Design Tokens Placeholder

<action>
Create initial design tokens file:
</action>

**File:** `D-Design-System/design-tokens.md`

```markdown
# Design Tokens

**Status:** To be defined

Design tokens will be extracted as components are added to the design system.

## Token Categories

### Colors
- Primary colors
- Secondary colors
- Semantic colors (success, error, warning, info)
- Neutral colors

### Typography
- Font families
- Font sizes
- Font weights
- Line heights
- Letter spacing

### Spacing
- Spacing scale
- Padding values
- Margin values
- Gap values

### Layout
- Breakpoints
- Container widths
- Grid columns

### Effects
- Shadows
- Border radius
- Transitions
- Animations

---

**Tokens will be populated as components are specified.**
````

---

## Step 4: Create Mode-Specific Files

### If Mode B: Custom Design System

<action>
Create Figma mappings file:
</action>

**File:** `D-Design-System/figma-mappings.md`

```markdown
# Figma Component Mappings

**Figma File:** [To be specified]
**Last Updated:** [Date]

## Component Mappings

Components in this design system are linked to Figma components for visual reference and design handoff.

### Format
```

Component ID → Figma Node ID
[component-id] → figma://file/[file-id]/node/[node-id]

```

## Mappings

[To be populated as components are added]

---

**How to find Figma node IDs:**
1. Select component in Figma
2. Right-click → Copy link to selection
3. Extract node ID from URL
```

### If Mode C: Component Library

<action>
Create component library config:
</action>

**File:** `D-Design-System/component-library-config.md`

````markdown
# Component Library Configuration

**Library:** [shadcn/Radix/MUI/etc.]
**Version:** [Version]
**Installation:** [Installation command]

## Library Components Used

This design system uses components from [Library Name].

### Component Mappings

Format: `WDS Component → Library Component`

[To be populated as components are added]

## Customizations

### Theme Configuration

```json
{
  "colors": {},
  "typography": {},
  "spacing": {},
  "borderRadius": {}
}
```
````

[To be updated as design system grows]

## Installation Instructions

```bash
[Installation commands]
```

---

**Library documentation:** [Link]

````

---

## Step 5: Create Component Index

<action>
Create components README:
</action>

**File:** `D-Design-System/components/README.md`

```markdown
# Design System Components

**Total Components:** 1
**Last Updated:** [Date]

## Component List

### Interactive Components
- [First component will be listed here]

### Form Components
[None yet]

### Layout Components
[None yet]

### Content Components
[None yet]

---

## Component Naming Convention

**Format:** `[type]-[number]`

Examples:
- btn-001 (Button)
- inp-001 (Input Field)
- crd-001 (Card)

## Component File Structure

Each component file includes:
- Component ID
- Type and purpose
- Variants (if any)
- States
- Styling/tokens
- Usage tracking

---

**Components are added automatically as they're discovered during specification.**
````

---

## Step 6: Add First Component

<action>
Route to create-new-component operation:
- Pass component specification
- Generate first component ID
- Create component file
</action>

**Route to:** `create-new-component.md`

---

## Step 7: Generate Initial Catalog

<action>
Create interactive HTML catalog:
</action>

**Load and execute:** `operations/generate-catalog.md`

**Initial catalog includes:**

- Project introduction
- Design tokens (if defined)
- First component showcase
- Getting started guide
- Empty changelog

**Output:**

```
✅ Initial catalog generated

File: D-Design-System/catalog.html
Components: 1
View: file:///path/to/catalog.html
```

---

## Step 8: Update Project Config

<action>
Mark design system as initialized:
</action>

**Update project config:**

```yaml
design_system:
  enabled: true
  mode: [mode]
  initialized: true
  initialized_date: [date]
  folder: D-Design-System/
  first_component: [component-id]
  catalog: D-Design-System/catalog.html
```

---

## Success Message

```
✅ Design system initialized

Mode: [mode]
Folder: D-Design-System/
First component: [ComponentType] [[component-id]]
Catalog: D-Design-System/catalog.html

Design system is ready to use.
Components will be extracted automatically as discovered.
Interactive catalog available for viewing.
added to the design system if they're reusable.

Next: Continue with component specification in Phase 4
```

</output>

---

## Validation

<action>
Validate initialization:
- ✓ D-Design-System/ folder exists
- ✓ components/ subfolder exists
- ✓ design-tokens.md created
- ✓ Mode-specific files created
- ✓ Component index created
- ✓ First component added
- ✓ Project config updated
</action>

**If validation fails:**

```
⚠️ Initialization Warning

Some files may not have been created successfully.
Please check:
- [List of missing files]

Would you like to retry initialization? (y/n)
```

---

## Error Handling

**If folder already exists:**

```
⚠️ D-Design-System/ folder already exists.

This shouldn't happen for first component initialization.

Options:
1. Use existing structure (merge)
2. Backup and recreate
3. Cancel initialization

Your choice:
```

**If component creation fails:**

```
❌ Error creating first component.

Error: [error message]

Design system structure was created, but component addition failed.
You can add components manually or retry.
```

**If mode not specified:**

```
⚠️ Design system mode not specified in project config.

Please specify:
1. Custom (Figma-based)
2. Component Library (shadcn/Radix/etc.)

Your choice:
```

---

## Post-Initialization

### Designer Guidance

<output>
```
💡 Design System Tips:

**What happens next:**

- As you specify components, I'll check for similarities
- Reusable components will be added to the design system
- You'll make decisions about variants vs new components

**Best practices:**

- Be consistent with component boundaries
- Think about reusability early
- Don't over-engineer - start simple

**You can always:**

- Add components manually
- Refactor the design system
- Merge or split components later

Design systems evolve - this is just the beginning!

```
</output>

---

## Return to Workflow

<action>
Return to design system router:
- Signal initialization complete
- Pass first component reference
- Continue with component addition
</action>

**Router continues with:** Adding first component to design system

---

**This operation runs once per project. Subsequent components use create-new-component or add-variant operations.**
```
