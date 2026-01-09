# NanoBanana

**Category:** AI Design Tool  
**Purpose:** Agent-driven asset creation and design inspiration  
**Website:** <https://nanobanana.com>

---

## What It Is

NanoBanana is an AI-powered design tool (think "agent-driven Photoshop") that creates visual design assets and generates design inspiration. It's used in WDS for:

1. **Early design exploration** - Creating custom graphics, mood boards, visual concepts
2. **Sketch envisioning** - Converting sketches/specifications into visual designs (images or code)
3. **Asset creation** - Generating placeholder assets and custom graphics

**Output formats:**
- **Images** - Visual designs, graphics, illustrations
- **Code snippets** - HTML/CSS/React code for designs

---

## Why WDS Recommends It

**Asset Creation:**
- Generate custom graphics and icons
- Create design inspiration and variations
- Explore visual concepts
- Generate placeholder assets
- Brand identity exploration

**Design Exploration:**
- Multiple design variations quickly
- Explore different visual directions
- Generate creative ideas
- Inspire design decisions

---

## Setup Instructions

### 1. Account Creation

1. Go to <https://nanobanana.com>
2. Sign up for account
3. Choose plan (free tier available)

### 2. WDS Integration

NanoBanana has two integration workflows in WDS:

#### **Workflow A: Early Design Exploration**

**Key Insight:** Brand identity is INDEPENDENT of product! You can establish visual identity anytime - before, during, or after product strategy.

```
Phase 5: Visual Design Exploration (can happen ANYTIME)
    ↓
NanoBanana (create brand assets/visual identity)
    ↓
Save to D-Design-System/01-Visual-Design/
    ↓
Refine concepts → Establish visual direction
    ↓
Define design tokens (colors, typography)
    ↓
Phase 4: Create scenarios with established style
    ↓
Export final assets → D-Design-System/02-Assets/
```

#### **Workflow B: Sketch Envisioning (Alternative to Figma)**

```
Phase 4: Create specification
    ↓
NanoBanana (sketch/spec → design as image or code)
    ↓
Freya interprets output (no Object IDs - manual process)
    ↓
Extract design tokens and components
    ↓
Update design system manually
    ↓
Create/update prototype with refined design
```

**Key Difference from Figma MCP:**
- ❌ No Object ID preservation (manual interpretation required)
- ❌ No automated bidirectional sync
- ✅ Can generate code snippets directly
- ✅ Can produce visual designs from text descriptions
- ✅ Faster for exploration (no Figma setup needed)

**Folder Structure:**
- **01-Visual-Design/** - Early exploration, mood boards, NanoBanana outputs
- **02-Assets/** - Final logos, icons, images (added later)

---

## WDS Best Practices

### DO 

**1. Use for Creative Exploration**
- Generate multiple variations
- Explore different styles
- Create mood boards
- Inspire design direction

**2. Refine AI Output**
- Don't use raw AI output
- Refine in Figma
- Align with brand guidelines
- Ensure consistency

**3. Document Asset Sources**
- Track AI-generated assets
- Note generation prompts
- Maintain asset library
- Document usage rights

**4. Integrate into Design System**
- Export refined assets
- Add to design system
- Create reusable components
- Document usage guidelines

### DON'T ❌

**1. Don't Replace Human Design**
- Use as inspiration, not replacement
- Apply design thinking
- Ensure brand alignment
- Review quality

**2. Don't Skip Refinement**
- Always refine AI output
- Ensure consistency
- Match brand guidelines
- Test usability

**3. Don't Use Without Customization**
- Customize for your brand
- Adapt to design system
- Ensure uniqueness
- Avoid generic output

---

## Usage Workflow

### 1. Generate Assets

```
1. Describe desired asset
2. Generate multiple variations
3. Select best options
4. Download assets
```

### 2. Refine in Figma

```
1. Import to Figma
2. Apply brand colors
3. Adjust to design system
4. Create variants if needed
```

### 3. Integrate into WDS

```
1. Add to design system
2. Document usage
3. Use in prototypes
4. Share with team
```

### 4. Sketch Envisioning (Alternative Workflow)

**For converting sketches/specs to designs:**

```
1. Provide sketch or specification to NanoBanana
2. Receive output (image or code)
3. Freya interprets output:
   - Extract design tokens (colors, spacing, typography)
   - Identify components and patterns
   - Map to design system (manually - no Object IDs)
4. Update design system files
5. Create/update prototype
6. Test and refine
```

**Important Notes:**
- **No Object IDs** - Manual interpretation required
- **No automation** - Freya must manually extract and map components
- **Code snippets** - Need integration into WDS structure
- **Images** - Need manual component extraction

---

## When to Use

### Use NanoBanana for:

**Early Design Exploration:**
- **ANYTIME** - Brand identity is independent of product strategy!
- When establishing brand identity (can be before, during, or after product work)
- When exploring multiple visual directions
- Before committing to design tokens
- Can happen before Phase 1, parallel to strategy work, or after Phase 4

**Sketch Envisioning (Alternative to Figma):**
- Converting sketches to visual designs quickly
- Generating code snippets from design concepts
- When Figma/MCP server not available
- Rapid prototyping without design system
- Exploring multiple design variations

### Don't use for:

- **Automated workflows** - No MCP integration (manual interpretation needed)
- **Object ID traceability** - Outputs lack Object IDs (use Figma MCP for this)
- **Final production code** - Code snippets need refinement and integration
- **Replacing design process** - Use as tool, not replacement
- **Bypassing brand guidelines** - Always align with brand standards

---

## Resources

- Website: <https://nanobanana.com>
- Documentation: Check website for latest guides
- Support: Contact via website

---

[← Back to Tools](wds-tools-guide.md)
