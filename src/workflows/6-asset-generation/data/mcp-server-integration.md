# MCP Server Integration for Prototype-to-Figma Workflow

**Purpose:** Enable precise component injection from HTML prototypes into Figma using MCP server.

**Key Advantage:** Component-level precision - inject exactly what needs refinement, not entire pages.

---

## Overview

The MCP (Model Context Protocol) server integration enables WDS to communicate directly with Figma, allowing:

- **Selective component extraction** from HTML prototypes
- **Direct injection** into specific Figma files/pages
- **Object ID preservation** for traceability
- **Automated mapping** between code and design
- **Batch operations** for multiple components

---

## Architecture

### Component Flow

```
HTML Prototype (with Object IDs)
    ↓
WDS Agent identifies components to extract
    ↓
MCP Server reads HTML/CSS for selected components
    ↓
Converts to Figma-compatible format
    ↓
Injects into target Figma file/page
    ↓
Designer refines in Figma
    ↓
MCP Server reads refined design
    ↓
Updates WDS Design System
    ↓
Re-render prototype with enhanced design system
```

### MCP Server Role

**Bidirectional Bridge:**
- **WDS → Figma:** Inject components for refinement
- **Figma → WDS:** Read refined components back

**Capabilities:**
- Read HTML/CSS structure
- Convert to Figma nodes
- Create frames, auto-layout, text layers
- Apply styling (colors, spacing, typography)
- Preserve Object IDs in layer names
- Read Figma component definitions
- Extract design tokens
- Map component variants

---

## Commands

### Extract Component to Figma

**Command:**
```bash
wds figma inject <component-id> [options]
```

**Parameters:**
- `component-id`: Object ID of component to extract (e.g., "btn-login-submit")
- `--file <file-id>`: Target Figma file ID
- `--page <page-name>`: Target page within Figma file
- `--position <x,y>`: Position to inject component (optional)
- `--batch <file>`: Extract multiple components from list

**Example:**
```bash
# Inject single component (page name matches specification)
wds figma inject btn-login-submit --file abc123 --page "01-Customer-Onboarding / 1.2-Sign-In"

# Inject multiple components to same scenario/page
wds figma inject --batch components-to-refine.txt --file abc123 --page "01-Customer-Onboarding / 1.2-Sign-In"
```

**Page Naming Convention:**
- Format: `[Scenario-Number]-[Scenario-Name] / [Page-Number]-[Page-Name]`
- Example: `01-Customer-Onboarding / 1.2-Sign-In`
- Matches WDS specification structure in `docs/C-UX-Scenarios/`
- Maintains traceability from spec → prototype → Figma

**Output:**
```
✓ Component btn-login-submit extracted from prototype
✓ Converted to Figma format
✓ Injected into Figma file abc123, page "Login Components"
✓ Object ID preserved in layer name
✓ Position: (100, 200)
```

---

### Extract Section to Figma

**Command:**
```bash
wds figma inject-section <section-name> [options]
```

**Parameters:**
- `section-name`: Section identifier from specification
- `--file <file-id>`: Target Figma file ID
- `--page <page-name>`: Target page within Figma file
- `--include-children`: Include all child components

**Example:**
```bash
# Inject entire login form section
wds figma inject-section login-form --file abc123 --include-children
```

---

### Read Refined Component from Figma

**Command:**
```bash
wds figma read <component-id> [options]
```

**Parameters:**
- `component-id`: Object ID of component in Figma
- `--file <file-id>`: Source Figma file ID
- `--extract-tokens`: Extract design tokens
- `--update-design-system`: Automatically update design system

**Example:**
```bash
# Read refined component and update design system
wds figma read btn-login-submit --file abc123 --extract-tokens --update-design-system
```

**Output:**
```
✓ Component btn-login-submit read from Figma
✓ Design tokens extracted:
  - Background: primary.600
  - Text: neutral.50
  - Padding: spacing.md spacing.lg
  - Border-radius: radius.md
✓ Design system updated: D-Design-System/components/button.md
```

---

### Batch Operations

**Command:**
```bash
wds figma batch <operation> --list <file>
```

**Operations:**
- `inject`: Inject multiple components
- `read`: Read multiple refined components
- `sync`: Bidirectional sync

**Example batch file (components-to-refine.txt):**
```
btn-login-submit
btn-signup-cta
input-email
input-password
link-forgot-password
```

**Command:**
```bash
wds figma batch inject --list components-to-refine.txt --file abc123
```

---

## Workflow Integration

### Phase 4D: After Prototype Creation

**Agent workflow:**

```markdown
1. Prototype created and tested
2. Visual quality assessment
3. If needs refinement:
   a. Identify components that need polish
   b. Generate component list
   c. Offer to inject to Figma
   d. Execute MCP injection
   e. Provide Figma link to designer
```

**Agent dialogue:**

```
I've identified 5 components that could benefit from visual refinement:
- Login button (btn-login-submit)
- Email input (input-email)
- Password input (input-password)
- Forgot password link (link-forgot-password)
- Sign up CTA (btn-signup-cta)

Would you like me to inject these into Figma for refinement?

[Y] Yes, inject all
[S] Select specific components
[N] No, continue as-is

Choice:
```

---

### Phase 5: Reading Refined Components

**Agent workflow:**

```markdown
1. Designer completes refinement in Figma
2. Designer notifies agent
3. Agent reads refined components via MCP
4. Extracts design tokens
5. Updates design system
6. Offers to re-render prototype
```

**Agent dialogue:**

```
I see you've refined the components in Figma. Let me read them back:

Reading btn-login-submit... ✓
Reading input-email... ✓
Reading input-password... ✓
Reading link-forgot-password... ✓
Reading btn-signup-cta... ✓

Design tokens extracted:
- 3 new colors added to palette
- 2 new spacing values defined
- 1 new typography style created

Design system updated:
- Button component enhanced
- Input component refined
- Link component created

Would you like me to re-render the prototype with these improvements?

[Y] Yes, re-render now
[R] Review changes first
[L] Re-render later

Choice:
```

---

## MCP Server Configuration

### Setup

**1. Install MCP Server**
```bash
npm install -g @wds/figma-mcp-server
```

**2. Configure Figma API Access**
```bash
# Set Figma personal access token
export FIGMA_ACCESS_TOKEN="your-token-here"

# Or in .env file
FIGMA_ACCESS_TOKEN=your-token-here
```

**3. Initialize MCP Server**
```bash
wds figma init
```

**4. Test Connection**
```bash
wds figma test-connection
```

---

### Configuration File

**Location:** `.wds/figma-mcp-config.yaml`

```yaml
figma:
  access_token: ${FIGMA_ACCESS_TOKEN}
  default_file_id: "abc123def456"
  default_page: "WDS Components"
  
extraction:
  preserve_object_ids: true
  extract_design_tokens: true
  convert_to_components: true
  maintain_hierarchy: true
  
injection:
  auto_layout: true
  responsive_constraints: true
  component_naming: "object-id"
  page_naming: "scenario-page"  # Matches WDS spec structure
  
sync:
  bidirectional: true
  auto_update_design_system: false
  conflict_resolution: "manual"

naming_conventions:
  page_format: "{scenario-number}-{scenario-name} / {page-number}-{page-name}"
  example: "01-Customer-Onboarding / 1.2-Sign-In"
  source: "docs/C-UX-Scenarios/"
```

---

## Figma File Organization

### Recommended Structure

**Figma file should mirror WDS specification structure:**

```
[Project Name] Design Refinement
├── 01-Customer-Onboarding/
│   ├── 1.1-Start-Page
│   ├── 1.2-Sign-In
│   ├── 1.3-Sign-Up
│   └── ...
├── 02-Family-Management/
│   ├── 2.1-Family-Dashboard
│   ├── 2.2-Add-Member
│   └── ...
└── Components/
    ├── Buttons
    ├── Inputs
    └── Cards
```

**Benefits:**
- Direct mapping to WDS specifications
- Easy to locate components by scenario/page
- Maintains project structure consistency
- Clear handoff to developers

**Page Naming:**
- Use exact scenario and page numbers from specs
- Format: `[Number]-[Name]` (e.g., `1.2-Sign-In`)
- Matches folder structure in `docs/C-UX-Scenarios/`

---

## Component Selection Strategies

### Strategy 1: Individual Components

**When to use:** Specific components need refinement

**Process:**
```bash
# Inject one component at a time
wds figma inject btn-login-submit --file abc123
wds figma inject input-email --file abc123
```

**Advantages:**
- Precise control
- Focused refinement
- Easy to track changes

---

### Strategy 2: Component Groups

**When to use:** Related components need consistent refinement

**Process:**
```bash
# Create component group file
echo "btn-login-submit
btn-signup-cta
btn-cancel" > login-buttons.txt

# Inject group
wds figma batch inject --list login-buttons.txt --file abc123
```

**Advantages:**
- Consistent design decisions
- Efficient batch processing
- Related components together

---

### Strategy 3: Section-Based

**When to use:** Entire section needs refinement

**Process:**
```bash
# Inject entire section with all components
wds figma inject-section login-form --file abc123 --include-children
```

**Advantages:**
- Complete context
- Layout refinement
- Holistic design decisions

---

### Strategy 4: Iterative Refinement

**When to use:** Multiple refinement cycles needed

**Process:**
```bash
# Iteration 1: Inject basic components
wds figma inject btn-login-submit --file abc123

# Designer refines in Figma

# Read back refined version
wds figma read btn-login-submit --file abc123 --update-design-system

# Iteration 2: Re-inject with design system updates
wds figma inject btn-login-submit --file abc123 --version 2

# Continue until satisfied
```

**Advantages:**
- Incremental improvement
- Design system grows with each iteration
- Reduced rework

---

## Object ID Mapping

### Preservation Strategy

**In HTML Prototype:**
```html
<button data-object-id="btn-login-submit" class="btn-primary">
  Log In
</button>
```

**In Figma (after injection):**
```
Layer name: "btn-login-submit"
Description: "Object ID: btn-login-submit"
```

**In Design System:**
```yaml
# D-Design-System/components/button.md
Button Component [btn-001]

Object ID Mapping:
- btn-login-submit → Login page submit button
- btn-signup-cta → Signup page CTA button
```

---

### Traceability

**Benefits:**
- Track component from spec → prototype → Figma → design system
- Identify which Figma components map to which code elements
- Update specific components without affecting others
- Maintain consistency across iterations

**Workflow:**
```
Specification: "Login button" (conceptual)
    ↓
Prototype: data-object-id="btn-login-submit" (code)
    ↓
Figma: Layer "btn-login-submit" (design)
    ↓
Design System: Button.primary [btn-001] (documentation)
    ↓
Re-rendered Prototype: class="btn-primary" (enhanced code)
```

---

## Design Token Extraction

### Automatic Token Detection

**MCP Server analyzes:**
- Colors used in component
- Spacing/padding values
- Typography styles
- Border radius
- Shadows/effects

**Example extraction:**

**From Figma component:**
```
Background: #2563eb
Text: #ffffff
Padding: 12px 16px
Border-radius: 8px
Font: Inter, 16px, 600
```

**To Design Tokens:**
```yaml
colors:
  primary:
    600: "#2563eb"
  neutral:
    50: "#ffffff"

spacing:
  md: 12px
  lg: 16px

radius:
  md: 8px

typography:
  button:
    font-family: "Inter"
    font-size: 16px
    font-weight: 600
```

---

### Token Mapping

**MCP Server can:**
- Detect similar colors and suggest token names
- Identify spacing patterns
- Recognize typography scales
- Propose token structure

**Agent dialogue:**

```
I've analyzed the refined button component and detected these values:

Colors:
- Background: #2563eb → Suggest: primary.600
- Text: #ffffff → Suggest: neutral.50

Spacing:
- Padding horizontal: 16px → Suggest: spacing.lg
- Padding vertical: 12px → Suggest: spacing.md

Would you like to:
[A] Accept all suggestions
[C] Customize token names
[R] Review each token

Choice:
```

---

## Error Handling

### Common Issues

**Issue: Component not found in prototype**
```
Error: Component with Object ID "btn-login-submit" not found in prototype

Solution:
- Verify Object ID exists in HTML
- Check data-object-id attribute
- Ensure prototype file is current
```

**Issue: Figma file access denied**
```
Error: Cannot access Figma file abc123

Solution:
- Verify Figma access token
- Check file permissions
- Ensure file ID is correct
```

**Issue: Component structure too complex**
```
Warning: Component has deeply nested structure (8 levels)
This may not convert cleanly to Figma

Suggestion:
- Simplify HTML structure
- Extract sub-components separately
- Use flatter hierarchy
```

---

### Conflict Resolution

**Scenario: Component exists in both prototype and Figma**

**Options:**
```
Component btn-login-submit already exists in Figma.

[O] Overwrite with new version
[M] Merge changes
[V] Create new version
[S] Skip this component

Choice:
```

**Merge strategy:**
- Preserve Figma refinements
- Apply new structural changes
- Prompt for conflicts

---

## Best Practices

### DO ✅

**1. Use Object IDs consistently**
```html
<!-- Good: Clear, consistent Object IDs -->
<button data-object-id="btn-login-submit">
<input data-object-id="input-email">
<a data-object-id="link-forgot-password">
```

**2. Extract components incrementally**
```bash
# Start with critical components
wds figma inject btn-login-submit --file abc123

# Then expand to related components
wds figma inject input-email --file abc123
```

**3. Document extraction decisions**
```markdown
# extraction-log.md

## 2026-01-08: Login Page Components

Extracted to Figma:
- btn-login-submit: Needs brand color refinement
- input-email: Needs focus state design
- input-password: Needs show/hide icon

Skipped:
- link-terms: Standard link, no refinement needed
```

**4. Sync regularly**
```bash
# After designer completes refinement
wds figma read btn-login-submit --file abc123 --update-design-system

# Re-render to verify
wds prototype render login-page --with-design-system
```

---

### DON'T ❌

**1. Don't inject entire pages**
```bash
# Avoid: Too broad, loses precision
wds figma inject-page login --file abc123

# Better: Specific components
wds figma inject btn-login-submit --file abc123
```

**2. Don't skip Object ID mapping**
```html
<!-- Avoid: No traceability -->
<button class="btn-primary">

<!-- Better: Clear Object ID -->
<button data-object-id="btn-login-submit" class="btn-primary">
```

**3. Don't forget to read back**
```bash
# Incomplete workflow
wds figma inject btn-login-submit --file abc123
# Designer refines...
# ❌ Never read back refined version

# Complete workflow
wds figma inject btn-login-submit --file abc123
# Designer refines...
wds figma read btn-login-submit --file abc123 ✅
```

---

## Advanced Features

### Variant Detection

**MCP Server can detect component variants:**

```
Analyzing button components in Figma...

Found 3 button variants:
- btn-login-submit (primary variant)
- btn-cancel (secondary variant)
- btn-delete (danger variant)

Suggest creating Button component with variants?
[Y/N]:
```

---

### State Extraction

**MCP Server extracts component states:**

```
Reading btn-login-submit from Figma...

States detected:
- Default: #2563eb background
- Hover: #1d4ed8 background (darker)
- Active: #1e40af background (darkest)
- Disabled: #9ca3af background (gray)

Add all states to design system?
[Y/N]:
```

---

### Responsive Constraints

**MCP Server preserves responsive behavior:**

```
Component has responsive constraints:
- Width: Fill container
- Height: Hug contents
- Min width: 120px
- Max width: 400px

Apply constraints in re-rendered prototype?
[Y/N]:
```

---

## Integration with Existing Figma Workflow

### Compatibility

**Works with existing Figma → WDS workflow:**

**Workflow A (Existing):** Designer creates in Figma → MCP reads → WDS spec
**Workflow B (New):** Prototype → MCP injects → Figma → MCP reads → WDS spec

**Both workflows use same MCP server, same token extraction, same design system updates.**

---

### Unified Design System

**All paths lead to design system:**

```
Path 1: Manual Figma design → MCP → Design System
Path 2: Prototype → MCP → Figma → MCP → Design System
Path 3: Specification → Prototype → Design System (no Figma)

Result: Single source of truth in Design System
```

---

## Performance Considerations

### Batch Processing

**Efficient for multiple components:**

```bash
# Sequential (slower)
wds figma inject btn-1 --file abc123
wds figma inject btn-2 --file abc123
wds figma inject btn-3 --file abc123

# Batch (faster)
wds figma batch inject --list buttons.txt --file abc123
```

**Performance:**
- Sequential: ~5 seconds per component
- Batch: ~2 seconds per component (parallel processing)

---

### Caching

**MCP Server caches:**
- Figma file structure
- Component definitions
- Design tokens
- Object ID mappings

**Benefits:**
- Faster subsequent operations
- Reduced API calls
- Offline capability (limited)

---

## Security

### API Token Management

**Best practices:**
```bash
# Never commit tokens to git
echo "FIGMA_ACCESS_TOKEN=*" >> .gitignore

# Use environment variables
export FIGMA_ACCESS_TOKEN="token"

# Or use secure credential storage
wds figma set-token --secure
```

---

### Access Control

**Figma file permissions:**
- MCP server requires edit access to inject components
- Read-only access sufficient for reading refined components
- Consider separate files for WDS injection vs production design

---

## Troubleshooting

### Debug Mode

```bash
# Enable verbose logging
wds figma inject btn-login-submit --file abc123 --debug

# Output shows:
# - HTML parsing steps
# - Figma API calls
# - Conversion process
# - Injection details
# - Error stack traces
```

---

### Validation

```bash
# Validate before injection
wds figma validate btn-login-submit

# Checks:
# - Object ID exists
# - HTML structure valid
# - CSS parseable
# - Figma file accessible
```

---

## Summary

**MCP Server integration enables:**

✅ **Precision:** Inject specific components, not entire pages  
✅ **Automation:** Automated Object ID mapping and token extraction  
✅ **Bidirectional:** Prototype → Figma → Design System → Prototype  
✅ **Traceability:** Maintain Object ID connections throughout  
✅ **Efficiency:** Batch operations and caching  
✅ **Integration:** Works with existing Figma workflows

**Result:** Seamless, precise component refinement workflow that maintains traceability and enables iterative design improvement.

---

**This MCP server integration is the key to making the prototype-to-Figma workflow practical and efficient for production use.**
