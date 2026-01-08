# Prototype to Figma Workflow

**Purpose:** Extract working HTML prototypes into Figma for visual design refinement when the design system is incomplete.

**When to Use:** When prototypes look incomplete or not visually appealing because design system components aren't fully developed yet.

---

## Overview

This workflow enables iterative visual refinement:

```
Sketch → Spec → Prototype (basic) → Figma (refine) → Design System (extend) → Re-render → Iterate
```

**Key Principle:** Code prototypes are functional but may lack visual polish. Extract to Figma for design refinement, then feed improvements back to design system.

---

## When to Extract to Figma

### Extract When:

✅ **Visual refinement needed**
- Prototype works but looks unpolished
- Design system lacks components for this view
- Spacing/typography needs fine-tuning
- Color palette needs expansion

✅ **Design system gaps identified**
- Missing component variants
- Incomplete state definitions
- Need new design tokens
- Pattern library needs expansion

✅ **Stakeholder presentation**
- Need polished visuals for approval
- Client review requires high-fidelity
- Marketing materials needed

### Don't Extract When:

❌ **Prototype is sufficient**
- Design system already covers all needs
- Visual quality meets requirements
- Focus is on functionality, not aesthetics

❌ **Early exploration**
- Still validating concepts
- Rapid iteration needed
- Design decisions not finalized

---

## The Iterative Refinement Loop

### Iteration 1: Basic Prototype

**Input:** Specification from Phase 4C

**Phase 4D: Create Prototype**
```
Sketch → Spec → Generate HTML/CSS/JS
Result: Functional but basic-looking prototype
```

**Assessment:**
- Does it work functionally? ✅
- Does it look polished? ❌ (Design system incomplete)

**Decision:** Extract to Figma for visual refinement

---

### Iteration 2: Visual Refinement

**Step 1: Extract to Figma**

Use MCP server to inject components directly into Figma:

```bash
# MCP server enables precise component injection
# Select specific components to extract
# Inject directly into Figma view
# Maintain Object ID traceability
```

**What gets extracted:**
- Specific components (not entire page)
- Layout structure (frames, auto-layout)
- Text content (converted to text layers)
- Colors (as fills)
- Spacing (as padding/gaps)
- Component boundaries preserved

**Step 2: Refine in Figma**

Designer works in Figma to:
- Apply proper typography styles
- Refine color palette
- Adjust spacing/padding
- Add visual polish (shadows, borders, effects)
- Create missing component variants
- Define proper states

**Step 3: Document Design Decisions**

Capture in Figma:
- Design tokens (colors, spacing, typography)
- Component specifications
- State definitions
- Variant rules

**Step 4: Extract Design System Updates**

From refined Figma design:
- New design tokens → `D-Design-System/design-tokens.md`
- New components → `D-Design-System/components/`
- Updated variants → Existing component files
- New states → Component state definitions

---

### Iteration 3: Re-render with Enhanced Design System

**Step 5: Update Design System**

Apply Figma refinements to design system:

```yaml
# D-Design-System/design-tokens.md

Colors:
  primary:
    50: "#f0f9ff"
    600: "#2563eb"  # From Figma refinement
    700: "#1d4ed8"  # New from Figma
    
Spacing:
  xs: 4px
  sm: 8px
  md: 16px   # Refined in Figma
  lg: 24px   # New from Figma
  
Typography:
  heading-1:
    font: "Inter"
    size: 32px    # Refined in Figma
    weight: 700
    line-height: 1.2
```

**Step 6: Re-render Prototype**

Regenerate prototype with enhanced design system:

```
Same HTML structure + Enhanced design system = Polished prototype
```

**Assessment:**
- Does it work functionally? ✅
- Does it look polished? ✅ (Design system now complete)

**Decision:** Prototype complete, or iterate again if needed

---

## Detailed Workflow Steps

### Phase 1: Identify Need for Figma Refinement

**After Phase 4D prototype creation:**

<ask>
**Prototype Assessment**

Your prototype is functional! Now let's assess visual quality:

1. **Looks good** - Design system covers everything needed
2. **Needs refinement** - Missing components/polish, extract to Figma
3. **Needs minor tweaks** - Quick CSS adjustments sufficient

Choice [1/2/3]:
</ask>

<check if="choice == 2">
  <action>Proceed to Figma extraction workflow</action>
</check>

---

### Phase 2: Extract Prototype to Figma

**Agent:** Freya WDS Designer Agent (automated)

**Freya's Process:**

**1. Analyze prototype components**

Freya automatically:
- Scans prototype for all components with Object IDs
- Identifies components that need visual refinement
- Compares against existing design system
- Determines which components are missing or incomplete

**2. Present extraction options**

<ask>
I've analyzed the prototype and identified components that could benefit from visual refinement:

**Missing from design system:**
- Login button (btn-login-submit)
- Email input (input-email)
- Password input (input-password)

**Incomplete in design system:**
- Forgot password link (link-forgot-password) - needs hover state

Would you like me to inject these into Figma for refinement?

[A] All components (4 total)
[S] Select specific components
[N] No, continue as-is

Choice:
</ask>

**3. Inject via MCP server (automated)**

Freya automatically:
- Determines target Figma file from project config
- Creates/navigates to page matching scenario/page structure
- Page naming: `[Scenario-Number]-[Scenario-Name] / [Page-Number]-[Page-Name]`
- Example: `01-Customer-Onboarding / 1.2-Sign-In`
- Injects selected components via MCP server
- Preserves Object IDs in layer names
- Maintains component boundaries

<output>
✓ Injecting components to Figma...
✓ Target: [Project] Design Refinement / 01-Customer-Onboarding / 1.2-Sign-In
✓ btn-login-submit → Injected at (100, 200)
✓ input-email → Injected at (100, 300)

All components injected successfully!

Figma link: <https://figma.com/file/abc123?node-id=...>

You can now refine these components in Figma. Let me know when you're ready to read them back.
</output>

**4. Wait for designer refinement**

Freya pauses workflow and waits for user to:
- Open Figma
- Refine visual design
- Apply design tokens
- Create component variants
- Define states
- Notify when complete

**Output:**
- Specific components injected into Figma
- Layers named with Object IDs
- Page structure matches specification
- Figma link provided to designer
- Freya ready to read refined components back

**Advantages:**
- ✅ Fully automated by Freya
- ✅ Component-level precision
- ✅ Automatic Object ID mapping
- ✅ Page structure matches specs
- ✅ No manual commands needed
- ✅ Seamless workflow integration

---

### Phase 3: Refine Design in Figma

**Designer tasks:**

**1. Apply Design Tokens**

Convert extracted values to proper tokens:

```
Before (extracted):
- Fill: #2563eb (hardcoded)

After (refined):
- Fill: {primary.600} (design token)
```

**2. Create/Update Components**

Identify reusable patterns:

```
Extracted button → Create Figma component
- Name: Button/Primary [btn-001]
- Add variants: primary, secondary, ghost
- Add states: default, hover, active, disabled
- Document in description
```

**3. Refine Visual Design**

Polish the design:
- Typography hierarchy
- Spacing consistency
- Color harmony
- Visual effects (shadows, borders)
- Responsive behavior

**4. Document Decisions**

In Figma file, create documentation frame:

```
Design Decisions:
├── Color Palette (with token names)
├── Typography Scale (with token names)
├── Spacing System (with token names)
├── Component Specifications
└── State Definitions
```

**Important:** If you discover better design solutions during refinement:
- ✅ Explore new ideas and improvements
- ✅ Document design decisions in Figma
- ✅ **Update specifications to match new design**
- ✅ Notify Freya of specification changes needed
- ❌ Don't let Figma and specs diverge

**Workflow for design changes:**
1. Refine design in Figma (explore improvements)
2. Document what changed and why
3. Update specification to reflect new design
4. Freya reads refined design from Figma
5. Design system updated
6. Re-render prototype matches updated spec

---

### Phase 4: Extract Design System Updates

**Agent:** Freya WDS Designer Agent (automated)

**Freya's Process:**

**1. User notifies completion**

<ask>
Have you finished refining the components in Figma?

[Y] Yes, read them back
[N] Not yet, still working

Choice:
</ask>

**2. Read refined components (automated)**

Freya automatically:
- Connects to Figma via MCP server
- Reads all injected components from target page
- Extracts design tokens (colors, spacing, typography)
- Identifies component variants and states
- Analyzes design decisions

<output>
✓ Reading refined components from Figma...
✓ btn-login-submit → Read successfully
✓ input-email → Read successfully
✓ input-password → Read successfully
✓ link-forgot-password → Read successfully

Analyzing design refinements...
</output>

**3. Extract and present design tokens**

<output>
**Design tokens extracted:**

Colors:
- primary.600: #2563eb (new)
- primary.700: #1d4ed8 (new)
- neutral.50: #ffffff

Spacing:
- spacing.md: 12px (refined from 16px)
- spacing.lg: 16px (new)

Typography:
- button.font-size: 16px (new)
- button.font-weight: 600 (new)

**Component updates:**
- Button component: Added primary variant, hover/active states
- Input component: Added focus state, error state
- Link component: Created new component with hover state
</output>

<ask>
Did you make any design changes that differ from the original specification?

[Y] Yes, I improved the design
[N] No, stayed true to spec

Choice:
</ask>

<check if="yes">
  <ask>Please describe what changed in the design and why:
  
  (This helps me update the specification to match your refined design)
  </ask>
  
  <output>Thank you! I'll note these changes for the specification update.
  
**Specification updates needed:**
- {list design changes that differ from original spec}

After updating the design system, we should update the specification to reflect these improvements.</output>
</check>

<ask>
Would you like me to update the design system with these changes?

[Y] Yes, update design system
[R] Review changes first
[C] Customize before updating

Choice:
</ask>

**4. Update design system (automated)**

Freya automatically updates `D-Design-System/design-tokens.md`:

```markdown
## Colors (Updated from Figma)

### Primary
- primary.50: #f0f9ff
- primary.600: #2563eb (refined)
- primary.700: #1d4ed8 (new)

### Spacing (Updated from Figma)
- xs: 4px
- sm: 8px  
- md: 16px (refined from 12px)
- lg: 24px (new)
```

**2. Component Specifications**

Create/update component files:

```markdown
# D-Design-System/components/button.md

Button Component [btn-001]

**Figma Reference:** [Link to Figma component]

## Variants (From Figma refinement)
- primary (updated styling)
- secondary (new variant)
- ghost (new variant)

## States (From Figma refinement)
- default
- hover (updated animation)
- active (new state)
- disabled (updated opacity)

## Styling (From Figma)
- Background: {primary.600}
- Text: {neutral.50}
- Padding: {spacing.md} {spacing.lg}
- Border-radius: {radius.md}
```

**3. Update Figma Mappings**

```yaml
# D-Design-System/figma-mappings.md

Button [btn-001] → figma://file/abc123/node/456:789
Input [inp-001] → figma://file/abc123/node/456:790
Card [crd-001] → figma://file/abc123/node/456:791
```

---

### Phase 5: Re-render Prototype with Enhanced Design System

**Back to Phase 4D:**

**1. Update prototype templates**

Apply new design tokens:

```html
<!-- Before -->
<button style="background: #2563eb; padding: 12px 16px;">

<!-- After (with design system) -->
<button class="btn-primary">
  <!-- Styled via design system tokens -->
</button>
```

**2. Regenerate or update prototype**

<ask>
**Re-render approach:**

1. **Regenerate** - Create fresh prototype with new design system
2. **Update** - Apply design system to existing prototype
3. **Hybrid** - Update critical sections, regenerate others

Choice [1/2/3]:
</ask>

**3. Test updated prototype**

Verify:
- Visual quality improved ✅
- Functionality preserved ✅
- Design system applied correctly ✅
- All Object IDs maintained ✅

---

### Phase 6: Iterate or Complete

**Assessment:**

<ask>
**Prototype quality check:**

1. **Complete** - Looks polished, ready for development
2. **Iterate** - Needs another refinement cycle
3. **Minor tweaks** - Small adjustments needed

Choice [1/2/3]:
</ask>

<check if="choice == 2">
  <action>Return to Phase 2 (Extract to Figma again)</action>
  <output>Starting iteration 2 with enhanced design system as baseline</output>
</check>

<check if="choice == 1">
  <output>✅ Prototype complete and polished!</output>
  <action>Mark prototype as final</action>
  <action>Update scenario tracking</action>
</check>

---

## Tools Integration

### html.to.design

**Purpose:** Convert HTML prototypes to Figma

**Features:**
- Preserves layout structure
- Converts CSS to Figma styles
- Maintains element hierarchy
- Extracts design tokens
- Creates Figma components

**Usage:**
```
1. Upload HTML file
2. Configure conversion options
3. Download Figma file
4. Import to Figma workspace
```

**Best Practices:**
- Clean HTML structure before extraction
- Use semantic HTML elements
- Include Object IDs in data attributes
- Document area tags for image sections
### NanoBanana (Optional)

**Purpose:** Agent-driven asset creation and design inspiration tool

**Website:** <https://nanobanana.com>

**Use Case in WDS:** Create visual assets, design inspiration, and possibly export design elements

**Description:** Think of it as "agent-driven Photoshop" - an AI-powered tool for creating visual design assets and exploring design possibilities.

### Features

**Asset Creation:**
- Visual design generation
- Design inspiration and variations
- Asset creation (images, graphics, icons)
- Design exploration
- Possibly code export for certain elements

### Integration with WDS

**Workflow:**
```
Design Concept
    → NanoBanana (create assets/inspiration)
    → Visual Assets
    → Use in Figma or Prototypes
    → Refine and integrate
```

**When to use:**
- Need visual design inspiration
- Creating custom graphics/assets
- Exploring design variations
- Generating design ideas
- Creating placeholder assets

**When to Skip:**
- Have existing design assets
- Working with established brand guidelines
- Simple text/layout-only designs
- Using stock assets

### Best Practices

**DO ✅**
- Use for design exploration and inspiration
- Generate multiple variations
- Refine AI-generated assets in Figma
- Use as creative starting point
- Export and integrate into design system

**DON'T ❌**
- Use as replacement for design thinking
- Skip refinement of generated assets
- Ignore brand guidelines
- Use without customization
- Rely solely on AI-generated designs
### Design System Updates

```
D-Design-System/
  design-tokens.md              ← Updated from Figma
  components/
    button.md                   ← Updated from Figma
    input.md                    ← New from Figma
  figma-mappings.md             ← Figma node references
  refinement-history.md         ← Track iterations
```

---

## Decision Framework

### When to Extract to Figma?

**Extract if ANY of these are true:**

1. **Visual Quality Gap**
   - Prototype looks unpolished
   - Design system incomplete
   - Missing visual hierarchy

2. **Design System Gaps**
   - Need new components
   - Missing variants/states
   - Token palette incomplete

3. **Stakeholder Needs**
   - Client presentation required
   - High-fidelity mockups needed
   - Marketing materials

**Don't extract if ALL of these are true:**

1. Prototype looks good enough
2. Design system covers all needs
3. Focus is on functionality
4. Rapid iteration more important

---

## Best Practices

### DO ✅

1. **Maintain Object IDs**
   - Keep Object IDs through extraction
   - Use as Figma layer names
   - Enables traceability

2. **Document Iterations**
   - Track version history
   - Note design decisions
   - Record token changes
   - **Update specifications when design evolves**
   - Document why design changed from original spec

3. **Sync Bidirectionally**
   - Figma → Design System
   - Design System → Prototype
   - Keep everything aligned

4. **Iterate Incrementally**
   - Small refinement cycles
   - Test after each iteration
   - Don't over-polish early

### DON'T ❌

1. **Don't Extract Too Early**
   - Wait until concept is validated
   - Ensure functionality works first
   - Don't polish throwaway work

2. **Don't Lose Traceability**
   - Maintain Object ID connections
   - Document Figma references
   - Track design system changes

3. **Don't Diverge Without Updating Specs**
   - New design ideas during Figma refinement are welcome
   - **BUT:** Update specifications to match new design decisions
   - Keep Figma, specs, and code in sync
   - Update design system consistently
   - Specifications remain the source of truth

4. **Don't Over-Iterate**
   - Know when "good enough" is sufficient
   - Balance polish with progress
   - Ship working products

---

## Troubleshooting

### Extraction Issues

**Problem:** html.to.design doesn't preserve layout

**Solution:**
- Use semantic HTML structure
- Avoid complex CSS positioning
- Simplify before extraction
- Use Flexbox/Grid layouts

---

**Problem:** Object IDs lost in extraction

**Solution:**
- Add Object IDs to data attributes
- Use as CSS classes
- Include in element IDs
- Document mapping separately

---

### Figma Refinement Issues

**Problem:** Can't match design system tokens

**Solution:**
- Create Figma variables first
- Map extracted values to variables
- Document token mappings
- Use consistent naming

---

**Problem:** Components don't match code structure

**Solution:**
- Align Figma component hierarchy with HTML
- Use same naming conventions
- Document component boundaries
- Keep structures parallel

---

### Re-rendering Issues

**Problem:** Design system changes break prototype

**Solution:**
- Test incrementally
- Update one token at a time
- Verify after each change
- Keep rollback version

---

**Problem:** Prototype loses functionality after re-render

**Solution:**
- Preserve JavaScript logic
- Don't change HTML structure
- Only update styling
- Test all interactions

---

## Success Metrics

**Quality Indicators:**

✅ Prototype looks polished
✅ Design system is comprehensive
✅ Figma and code are in sync
✅ Object IDs maintained throughout
✅ Iterations are productive
✅ Team alignment on visual direction

**Efficiency Indicators:**

✅ Fewer refinement cycles needed
✅ Design system grows organically
✅ Reusable components identified
✅ Faster subsequent prototypes
✅ Reduced rework

---

## Example: Complete Iteration Cycle

### Iteration 1: Basic Prototype

**Input:** Login page specification

**Output:** Functional HTML prototype
- Form works
- Validation functions
- But looks basic (incomplete design system)

**Assessment:** Needs visual refinement

---

### Iteration 2: Figma Refinement

**Extract to Figma:**
- Upload to html.to.design
- Import to Figma
- Structure preserved

**Refine in Figma:**
- Apply proper typography (Inter font)
- Refine color palette (brand colors)
- Add button variants (primary, secondary)
- Define input states (default, focus, error)
- Add visual polish (shadows, borders)

**Extract to Design System:**
- New tokens: colors, spacing, typography
- New components: Button [btn-001], Input [inp-001]
- Updated: design-tokens.md, components/

---

### Iteration 3: Re-render

**Update Prototype:**
- Apply new design tokens
- Use new component classes
- Regenerate with design system

**Result:**
- Same functionality ✅
- Polished visuals ✅
- Design system extended ✅

**Assessment:** Complete! Ready for development

---

## Integration with Existing Workflows

### Phase 4D: Prototype

**Updated decision point:**

```markdown
After prototype creation:

1. Test functionality
2. Assess visual quality
3. If needs refinement → Extract to Figma
4. If sufficient → Complete
```

### Phase 5: Design System

**New workflow branch:**

```markdown
Design System can be populated via:

A. Component specification (existing)
B. Figma manual creation (existing)
C. Prototype extraction (NEW - this workflow)
```

---

## Next Steps

**To implement this workflow:**

1. ✅ Read this guide
2. ✅ Set up html.to.design account
3. ✅ Create test prototype
4. ✅ Practice extraction process
5. ✅ Refine in Figma
6. ✅ Update design system
7. ✅ Re-render and compare
8. ✅ Iterate until comfortable

---

**This workflow completes the WDS design refinement loop, enabling iterative improvement from functional prototypes to polished, production-ready designs.**
