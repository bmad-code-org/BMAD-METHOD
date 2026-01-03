# Figma Component Structure for WDS

**Purpose:** Guidelines for organizing and structuring components in Figma for seamless WDS integration.

**Referenced by:** Mode B (Custom Design System) workflows

---

## Core Principle

**Figma components should mirror WDS component structure** to enable seamless synchronization and specification generation.

```
Figma Component → WDS Component Specification → React Implementation
```

---

## Component Organization in Figma

### File Structure

**Recommended Figma file organization:**

```
Design System File (Figma)
├── 📄 Cover (project info)
├── 🎨 Foundation
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Effects
├── ⚛️ Components
│   ├── Buttons
│   ├── Inputs
│   ├── Cards
│   └── [other component types]
└── 📱 Examples
    └── Component usage examples
```

**Benefits:**

- Clear organization
- Easy navigation
- Matches WDS structure
- Facilitates MCP integration

---

## Component Naming Convention

### Format

**Pattern:** `[ComponentType]/[ComponentName]`

**Examples:**

```
Button/Primary
Button/Secondary
Button/Ghost
Input/Text
Input/Email
Card/Profile
Card/Content
```

**Rules:**

- Use forward slash for hierarchy
- Title case for names
- Match WDS component names
- Consistent across all components

---

## Component Properties

### Required Properties

**Every component must have:**

1. **Description**
   - Component purpose
   - When to use
   - WDS component ID (e.g., "btn-001")

2. **Variants**
   - Organized by property
   - Clear naming
   - All states included

3. **Auto Layout**
   - Proper spacing
   - Responsive behavior
   - Padding/gap values

**Example Description:**

```
Button Primary [btn-001]

Primary action button for main user actions.
Use for: Submit forms, confirm actions, proceed to next step.

WDS Component: Button.primary [btn-001]
```

---

## Variant Structure

### Organizing Variants

**Use Figma's variant properties:**

**Property 1: Type** (variant)

- Primary
- Secondary
- Ghost
- Outline

**Property 2: Size**

- Small
- Medium
- Large

**Property 3: State**

- Default
- Hover
- Active
- Disabled
- Loading

**Property 4: Icon** (optional)

- None
- Left
- Right
- Only

**Result:** Figma generates all combinations automatically

---

### Variant Naming

**Format:** `Property=Value`

**Examples:**

```
Type=Primary, Size=Medium, State=Default
Type=Primary, Size=Medium, State=Hover
Type=Secondary, Size=Large, State=Disabled
```

**Benefits:**

- Clear property structure
- Easy to find specific variants
- MCP can parse programmatically
- Matches WDS variant system

---

## State Documentation

### Required States

**Interactive Components (Buttons, Links):**

- Default
- Hover
- Active (pressed)
- Disabled
- Focus (optional)
- Loading (optional)

**Form Components (Inputs, Selects):**

- Default (empty)
- Focus (active)
- Filled (has content)
- Disabled
- Error
- Success (optional)

**Feedback Components (Alerts, Toasts):**

- Default
- Success
- Error
- Warning
- Info

---

### State Visual Indicators

**Document state changes:**

**Hover:**

- Background color change
- Border change
- Shadow change
- Scale change
- Cursor change

**Active:**

- Background color (darker)
- Scale (slightly smaller)
- Shadow (reduced)

**Disabled:**

- Opacity (0.5-0.6)
- Cursor (not-allowed)
- Grayscale (optional)

**Loading:**

- Spinner/progress indicator
- Disabled interaction
- Loading text

---

## Design Tokens in Figma

### Using Figma Variables

**Map Figma variables to WDS tokens:**

**Colors:**

```
Figma Variable → WDS Token
primary/500 → color-primary-500
gray/900 → color-gray-900
success/600 → color-success-600
```

**Typography:**

```
Figma Style → WDS Token
Text/Display → text-display
Text/Heading-1 → text-heading-1
Text/Body → text-body
```

**Spacing:**

```
Figma Variable → WDS Token
spacing/2 → spacing-2
spacing/4 → spacing-4
spacing/8 → spacing-8
```

**Effects:**

```
Figma Effect → WDS Token
shadow/sm → shadow-sm
shadow/md → shadow-md
radius/md → radius-md
```

---

## Component Documentation

### Component Description Template

```
[Component Name] [component-id]

**Purpose:** [Brief description]

**When to use:**
- [Use case 1]
- [Use case 2]

**When not to use:**
- [Anti-pattern 1]
- [Anti-pattern 2]

**WDS Component:** [ComponentType].[variant] [component-id]

**Variants:** [List of variants]
**States:** [List of states]
**Size:** [Available sizes]

**Accessibility:**
- [ARIA attributes]
- [Keyboard support]
- [Screen reader behavior]
```

**Example:**

```
Button Primary [btn-001]

**Purpose:** Trigger primary actions in the interface

**When to use:**
- Submit forms
- Confirm important actions
- Proceed to next step
- Primary call-to-action

**When not to use:**
- Secondary actions (use Button Secondary)
- Destructive actions (use Button Destructive)
- Navigation (use Link component)

**WDS Component:** Button.primary [btn-001]

**Variants:** primary, secondary, ghost, outline
**States:** default, hover, active, disabled, loading
**Size:** small, medium, large

**Accessibility:**
- role="button"
- aria-disabled when disabled
- aria-busy when loading
- Keyboard: Enter/Space to activate
```

---

## Auto Layout Best Practices

### Spacing

**Use consistent spacing values:**

- Padding: 8px, 12px, 16px, 24px
- Gap: 4px, 8px, 12px, 16px
- Match WDS spacing tokens

**Auto Layout Settings:**

- Horizontal/Vertical alignment
- Padding (all sides or specific)
- Gap between items
- Resizing behavior

---

### Resizing Behavior

**Set appropriate constraints:**

**Buttons:**

- Hug contents (width)
- Fixed height
- Min width for touch targets (44px)

**Inputs:**

- Fill container (width)
- Fixed height (40-48px)
- Responsive to content

**Cards:**

- Fill container or fixed width
- Hug contents (height)
- Responsive to content

---

## Component Instances

### Creating Instances

**Best practices:**

- Always use component instances (not detached)
- Override only necessary properties
- Maintain connection to main component
- Document overrides if needed

**Overridable Properties:**

- Text content
- Icons
- Colors (if using variables)
- Spacing (if needed)

**Non-Overridable:**

- Structure
- Layout
- Core styling
- States

---

## Figma to WDS Mapping

### Component ID System

**Add WDS component ID to Figma:**

**In component description:**

```
Button Primary [btn-001]
```

**In component name:**

```
Button/Primary [btn-001]
```

**Benefits:**

- Easy to find components
- Clear WDS mapping
- MCP can extract ID
- Bidirectional sync

---

### Node ID Tracking

**Figma generates unique node IDs:**

**Format:**

```
figma://file/[file-id]/node/[node-id]
```

**How to get node ID:**

1. Select component in Figma
2. Right-click → "Copy link to selection"
3. Extract node ID from URL

**Store in WDS:**

```yaml
# D-Design-System/figma-mappings.md
Button [btn-001] → figma://file/abc123/node/456:789
Input [inp-001] → figma://file/abc123/node/456:790
```

---

## Sync Workflow

### Figma → WDS

**When component is created/updated in Figma:**

1. Designer creates/updates component
2. Designer adds WDS component ID to description
3. MCP reads component via Figma API
4. MCP extracts:
   - Component structure
   - Variants
   - States
   - Properties
   - Design tokens used
5. MCP generates/updates WDS specification
6. Designer reviews and confirms

---

### WDS → Figma

**When specification is updated in WDS:**

1. Specification updated in WDS
2. Designer notified of changes
3. Designer updates Figma component
4. Designer confirms sync
5. Node ID verified/updated

**Note:** This is semi-automated. Full automation requires Figma API write access.

---

## Quality Checklist

### Component Creation

- [ ] Component name follows convention
- [ ] WDS component ID in description
- [ ] All variants defined
- [ ] All states documented
- [ ] Auto layout properly configured
- [ ] Design tokens used (not hardcoded values)
- [ ] Accessibility notes included
- [ ] Usage guidelines documented

### Variant Structure

- [ ] Variants organized by properties
- [ ] Property names clear and consistent
- [ ] All combinations make sense
- [ ] No redundant variants
- [ ] States properly differentiated

### Documentation

- [ ] Purpose clearly stated
- [ ] When to use documented
- [ ] When not to use documented
- [ ] Accessibility requirements noted
- [ ] Examples provided

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Hardcoded Values

**Wrong:**

```
Background: #2563eb (hardcoded hex)
Padding: 16px (hardcoded value)
```

**Right:**

```
Background: primary/600 (variable)
Padding: spacing/4 (variable)
```

### ❌ Mistake 2: Detached Instances

**Wrong:**

- Detaching component instances
- Losing connection to main component
- Manual updates required

**Right:**

- Always use instances
- Override only necessary properties
- Maintain component connection

### ❌ Mistake 3: Inconsistent Naming

**Wrong:**

```
btn-primary
ButtonSecondary
button_ghost
```

**Right:**

```
Button/Primary
Button/Secondary
Button/Ghost
```

### ❌ Mistake 4: Missing States

**Wrong:**

- Only default state
- No hover/active states
- No disabled state

**Right:**

- All required states
- Visual differentiation
- State transitions documented

### ❌ Mistake 5: No WDS Component ID

**Wrong:**

```
Button Primary
(no component ID)
```

**Right:**

```
Button Primary [btn-001]
(clear WDS mapping)
```

---

## Examples

### Button Component in Figma

**Component Name:** `Button/Primary [btn-001]`

**Description:**

```
Button Primary [btn-001]

Primary action button for main user actions.

WDS Component: Button.primary [btn-001]
Variants: primary, secondary, ghost, outline
States: default, hover, active, disabled, loading
Sizes: small, medium, large
```

**Variants:**

```
Type=Primary, Size=Medium, State=Default
Type=Primary, Size=Medium, State=Hover
Type=Primary, Size=Medium, State=Active
Type=Primary, Size=Medium, State=Disabled
Type=Primary, Size=Large, State=Default
[... all combinations]
```

**Properties:**

- Auto Layout: Horizontal
- Padding: 16px (horizontal), 12px (vertical)
- Gap: 8px (if icon)
- Border Radius: 8px
- Background: primary/600 (variable)

---

### Input Component in Figma

**Component Name:** `Input/Text [inp-001]`

**Description:**

```
Input Text [inp-001]

Text input field for user data entry.

WDS Component: Input.text [inp-001]
States: default, focus, filled, disabled, error, success
```

**Variants:**

```
State=Default
State=Focus
State=Filled
State=Disabled
State=Error
State=Success
```

**Properties:**

- Auto Layout: Horizontal
- Padding: 12px
- Height: 44px (fixed)
- Border: 1px solid gray/300
- Border Radius: 8px
- Background: white

---

## Further Reading

- **Figma MCP Integration:** `figma-mcp-integration.md`
- **Designer Guide:** `figma-designer-guide.md`
- **Token Architecture:** `token-architecture.md`
- **Component Boundaries:** `component-boundaries.md`

---

**This structure enables seamless Figma ↔ WDS integration and maintains design system consistency across tools.**
