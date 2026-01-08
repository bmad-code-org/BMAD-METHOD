# Figma Designer Guide for WDS

**Purpose:** Step-by-step instructions for designers creating components in Figma for WDS projects.

**Audience:** Visual designers, UX designers, design system maintainers

---

## Getting Started

### Prerequisites

- Figma account with edit access to design system file
- Understanding of WDS component structure
- Familiarity with Figma components and variants
- Access to WDS project repository

---

## Step 1: Set Up Your Figma File

### Create Design System File

**File structure:**

```
[Project Name] Design System
├── 📄 Cover
├── 🎨 Foundation
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Effects
├── ⚛️ Components
│   ├── Buttons
│   ├── Inputs
│   ├── Cards
│   └── [more types]
└── 📱 Examples
```

**Tips:**

- Use clear page names
- Organize by component type
- Keep foundation separate
- Include usage examples

---

### Set Up Design Tokens

**Create Figma variables:**

**Colors:**

```
Collection: Colors
├── primary/50
├── primary/100
├── primary/500
├── primary/600
├── gray/50
├── gray/900
└── [more colors]
```

**Spacing:**

```
Collection: Spacing
├── spacing/1 = 4px
├── spacing/2 = 8px
├── spacing/4 = 16px
├── spacing/6 = 24px
└── [more spacing]
```

**Typography:**

```
Styles: Typography
├── Display/Large
├── Heading/1
├── Heading/2
├── Body/Regular
└── [more styles]
```

---

## Step 2: Create Your First Component

### Example: Button Component

**1. Create Base Frame**

```
Frame name: Button/Primary [btn-001]
Size: Hug contents (width), Fixed 44px (height)
Auto Layout: Horizontal
Padding: 16px (horizontal), 12px (vertical)
Gap: 8px
```

**2. Add Content**

```
├── Icon (optional)
│   └── Size: 20x20px
└── Text
    └── Style: Body/Medium
    └── Content: "Button Text"
```

**3. Apply Design Tokens**

```
Background: primary/600 (variable)
Text Color: white (variable)
Border Radius: 8px
```

**4. Create Component**

```
Select frame → Create Component
Name: Button/Primary [btn-001]
```

---

### Add Component Description

**In component description field:**

```
Button Primary [btn-001]

Primary action button for main user actions.

**When to use:**
- Submit forms
- Confirm actions
- Proceed to next step

**When not to use:**
- Secondary actions (use Button/Secondary)
- Navigation (use Link component)

**WDS Component:** Button.primary [btn-001]
**Variants:** primary, secondary, ghost
**States:** default, hover, active, disabled, loading
**Sizes:** small, medium, large

**Accessibility:**
- role="button"
- aria-disabled when disabled
- Keyboard: Enter/Space to activate
```

---

## Step 3: Add Variants

### Create Variant Properties

**Select component → Add variant property:**

**Property 1: Type**

```
Values: Primary, Secondary, Ghost, Outline
```

**Property 2: Size**

```
Values: Small, Medium, Large
```

**Property 3: State**

```
Values: Default, Hover, Active, Disabled, Loading
```

---

### Design Each Variant

**Type=Primary, Size=Medium, State=Default:**

```
Background: primary/600
Text: white
Padding: 16px × 12px
```

**Type=Primary, Size=Medium, State=Hover:**

```
Background: primary/700 (darker)
Text: white
Scale: 1.02 (slightly larger)
```

**Type=Primary, Size=Medium, State=Active:**

```
Background: primary/800 (darkest)
Text: white
Scale: 0.98 (slightly smaller)
```

**Type=Primary, Size=Medium, State=Disabled:**

```
Background: gray/300
Text: gray/500
Opacity: 0.6
Cursor: not-allowed
```

**Type=Primary, Size=Medium, State=Loading:**

```
Background: primary/600
Text: white
Add: Spinner icon
Opacity: 0.8
```

---

### Adjust for Sizes

**Small:**

```
Padding: 12px × 8px
Text: Body/Small
Icon: 16x16px
Height: 36px
```

**Medium (default):**

```
Padding: 16px × 12px
Text: Body/Medium
Icon: 20x20px
Height: 44px
```

**Large:**

```
Padding: 20px × 16px
Text: Body/Large
Icon: 24x24px
Height: 52px
```

---

## Step 4: Document States

### Visual State Indicators

**Create a documentation frame:**

```
Frame: Button States Documentation
├── Default
│   └── Normal appearance
├── Hover
│   └── Background darker, slight scale
├── Active
│   └── Background darkest, scale down
├── Disabled
│   └── Grayed out, reduced opacity
└── Loading
    └── Spinner, disabled interaction
```

**Add annotations:**

- State name
- Visual changes
- Interaction behavior
- Transition duration

---

## Step 5: Get Figma Node ID

### Copy Component Link

**1. Select component in Figma**

**2. Right-click → "Copy link to selection"**

**3. Extract node ID from URL:**

```
URL: https://www.figma.com/file/abc123/Design-System?node-id=456:789

File ID: abc123
Node ID: 456:789

Full reference: figma://file/abc123/node/456:789
```

**4. Add to WDS mapping file:**

```yaml
# D-Design-System/figma-mappings.md
Button [btn-001] → figma://file/abc123/node/456:789
```

---

## Step 6: Sync with WDS

### Manual Sync Process

**1. Create component in Figma** (steps above)

**2. Notify WDS system:**

- Add component ID to Figma description
- Copy Figma node ID
- Update `figma-mappings.md`

**3. Generate WDS specification:**

- Use Figma MCP to read component
- Generate component specification
- Review and confirm

**4. Verify sync:**

- Check WDS component file created
- Verify all variants captured
- Confirm states documented
- Test component reference

---

### Using Figma MCP (Automated)

**If Figma MCP is configured:**

**1. Create/update component in Figma**

**2. Run MCP sync command:**

```bash
# In WDS project
wds figma sync Button/Primary
```

**3. MCP will:**

- Read component from Figma
- Extract variants and states
- Generate WDS specification
- Update figma-mappings.md

**4. Review generated spec:**

- Check accuracy
- Add missing details
- Confirm and commit

---

## Step 7: Maintain Components

### Updating Existing Components

**When updating a component:**

**1. Update in Figma:**

- Modify component
- Update description if needed
- Maintain component ID

**2. Sync to WDS:**

- Run MCP sync (if available)
- Or manually update WDS spec
- Update version history

**3. Notify team:**

- Document changes
- Update affected pages
- Test implementations

---

### Version Control

**Track component changes:**

**In Figma:**

- Use Figma version history
- Add version notes
- Tag major changes

**In WDS:**

```markdown
## Version History

**Created:** 2024-12-09
**Last Updated:** 2024-12-15

**Changes:**

- 2024-12-09: Created component
- 2024-12-12: Added loading state
- 2024-12-15: Updated hover animation
```

---

## Best Practices

### DO ✅

**1. Use Design Tokens**

- Always use variables for colors
- Use variables for spacing
- Apply text styles consistently

**2. Document Thoroughly**

- Clear component descriptions
- Usage guidelines
- Accessibility notes

**3. Maintain Consistency**

- Follow naming conventions
- Use consistent spacing
- Apply standard states

**4. Test Instances**

- Create example instances
- Test all variants
- Verify responsive behavior

**5. Keep Organized**

- Logical component grouping
- Clear page structure
- Clean component hierarchy

---

### DON'T ❌

**1. Hardcode Values**

- Don't use hex colors directly
- Don't use pixel values without variables
- Don't skip design tokens

**2. Detach Instances**

- Don't break component connections
- Don't create one-off variations
- Don't lose main component link

**3. Skip Documentation**

- Don't leave descriptions empty
- Don't forget WDS component ID
- Don't skip usage guidelines

**4. Ignore States**

- Don't create only default state
- Don't forget hover/active
- Don't skip disabled state

**5. Break Naming Conventions**

- Don't use inconsistent names
- Don't forget component IDs
- Don't use unclear abbreviations

---

## Common Workflows

### Creating a New Component Type

**1. Research:**

- Check if similar component exists
- Review WDS component boundaries guide
- Decide: new component or variant?

**2. Design:**

- Create base component
- Add all required states
- Apply design tokens

**3. Document:**

- Write clear description
- Add WDS component ID
- Document usage guidelines

**4. Sync:**

- Get Figma node ID
- Update WDS mappings
- Generate specification

**5. Test:**

- Create example instances
- Test all variants
- Verify responsive behavior

---

### Adding a Variant to Existing Component

**1. Assess:**

- Is this truly a variant?
- Or should it be a new component?
- Check with WDS assessment flow

**2. Add Variant:**

- Add new variant property value
- Design variant appearance
- Document differences

**3. Update Documentation:**

- Update component description
- Add variant to list
- Document when to use

**4. Sync:**

- Update WDS specification
- Add variant to component file
- Update version history

---

### Updating Component Styling

**1. Plan Change:**

- Document what's changing
- Check impact on instances
- Notify team

**2. Update Component:**

- Modify main component
- Test all variants
- Verify instances update

**3. Sync to WDS:**

- Update WDS specification
- Document changes
- Update version history

**4. Verify:**

- Check all instances
- Test in examples
- Confirm with team

---

## Troubleshooting

### Component Not Syncing

**Problem:** MCP can't read component

**Solutions:**

- Check component name format
- Verify WDS component ID in description
- Ensure component is published
- Check Figma API access

---

### Variants Not Appearing

**Problem:** Some variants missing in WDS

**Solutions:**

- Check variant property names
- Verify all combinations exist
- Ensure consistent naming
- Re-sync component

---

### Design Tokens Not Applied

**Problem:** Hardcoded values instead of variables

**Solutions:**

- Replace hex colors with variables
- Use spacing variables
- Apply text styles
- Re-sync component

---

### Instance Overrides Lost

**Problem:** Updates break instance overrides

**Solutions:**

- Don't change component structure
- Add new properties instead
- Maintain backward compatibility
- Communicate changes to team

---

## Checklist

### Before Creating Component

- [ ] Checked if similar component exists
- [ ] Reviewed component boundaries guide
- [ ] Decided on component vs variant
- [ ] Prepared design tokens
- [ ] Planned all required states

### During Component Creation

- [ ] Used design tokens (no hardcoded values)
- [ ] Created all required states
- [ ] Applied auto layout properly
- [ ] Added clear description
- [ ] Included WDS component ID
- [ ] Documented usage guidelines

### After Component Creation

- [ ] Copied Figma node ID
- [ ] Updated figma-mappings.md
- [ ] Generated WDS specification
- [ ] Created example instances
- [ ] Tested all variants
- [ ] Notified team

---

## Resources

- **Figma Component Structure:** `data/design-system/figma-component-structure.md`
- **Token Architecture:** `data/design-system/token-architecture.md`
- **Component Boundaries:** `data/design-system/component-boundaries.md`
- **Figma MCP Integration:** `figma-mcp-integration.md`

---

**Following this guide ensures your Figma components integrate seamlessly with WDS and maintain design system consistency.**
