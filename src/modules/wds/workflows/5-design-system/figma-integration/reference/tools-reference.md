# Design Tools Reference for WDS

**Purpose:** Quick reference for design tools used in WDS workflows, particularly for prototype-to-Figma extraction.

---

## MCP Server (Primary Method)

**Purpose:** Precise component injection from HTML prototypes to Figma

**Use Case in WDS:** Extract specific components for visual refinement with full traceability

**See:** `mcp-server-integration.md` for complete documentation

### Features

**Component-Level Precision:**
- Select specific components by Object ID
- Inject individual components or sections
- Batch component extraction
- Granular control over what gets refined

**Conversion Capabilities:**
- HTML structure → Figma frames
- CSS styles → Figma styling
- Layout (Flexbox/Grid) → Auto Layout
- Text content → Text layers
- Colors → Color fills
- Spacing → Padding/gaps

**Preservation:**
- Object IDs maintained in layer names
- Element hierarchy preserved
- Component boundaries respected
- Traceability throughout workflow

### How to Use

**1. Prepare Prototype**
```
Ensure your HTML prototype:
- Uses semantic HTML elements
- Has Object IDs on all components (data-object-id)
- Uses Flexbox or Grid for layouts
- Has clean CSS structure
```

**2. Inject via MCP Server**
```bash
# Single component
wds figma inject btn-login-submit --file abc123

# Multiple components
wds figma batch inject --list components.txt --file abc123

# Entire section
wds figma inject-section login-form --file abc123
```

**3. Verify in Figma**
```
- Open target Figma file
- Navigate to injection page
- Verify components injected correctly
- Check Object IDs preserved
```

**4. Read Refined Components Back**
```bash
# After designer refines in Figma
wds figma read btn-login-submit --file abc123 --update-design-system
```

### Advantages over Manual Upload

✅ **Component-level precision** - Inject only what needs refinement  
✅ **Object ID preservation** - Automatic mapping maintained  
✅ **Bidirectional sync** - Read refined components back  
✅ **Batch operations** - Efficient multi-component extraction  
✅ **Direct integration** - Seamless WDS workflow  
✅ **Automated token extraction** - Design system updates automatic

---

## html.to.design (Alternative Method)

**Purpose:** Manual HTML to Figma conversion (fallback option)

**Website:** <https://html.to.design>

**Use Case in WDS:** When MCP server unavailable or for full-page extraction

**Note:** MCP server approach is preferred for component-level precision and traceability.

### When to Use html.to.design

**Use when:**
- MCP server not configured
- Need to extract entire page at once
- Quick one-off conversion needed
- Exploring design possibilities

**Don't use when:**
- MCP server available (use MCP instead)
- Need component-level precision
- Require Object ID traceability
- Planning iterative refinement

### How to Use

**1. Prepare Prototype**
```
Ensure your HTML prototype:
- Uses semantic HTML elements
- Has clean CSS structure
- Uses Flexbox or Grid for layouts
```

**2. Upload to html.to.design**
```
1. Go to https://html.to.design
2. Upload HTML file
3. Include associated CSS files
4. Select target: Figma
```

**3. Import to Figma**
```
1. Download converted Figma file
2. Open in Figma
3. Manually add Object IDs to layers
4. Begin refinement
```

**Limitations:**
- No automatic Object ID preservation
- Entire page extraction (less precise)
- Manual token extraction required
- No automated design system sync

### Best Practices

**DO ✅**
- Use semantic HTML (header, nav, main, section, article)
- Apply consistent class naming
- Use Flexbox/Grid for layouts
- Include Object IDs for traceability
- Clean up HTML before extraction
- Test prototype before extracting

**DON'T ❌**
- Use complex CSS positioning (absolute, fixed)
- Rely on JavaScript-generated content
- Use inline styles excessively
- Have deeply nested structures
- Include debug/test code
- Extract incomplete prototypes

### Limitations

**What Works Well:**
- Standard layouts (header, content, footer)
- Flexbox and Grid layouts
- Text content and typography
- Basic styling (colors, spacing, borders)
- Image placeholders
- Component-based structures

**What May Need Manual Adjustment:**
- Complex animations
- JavaScript-driven interactions
- Dynamic content
- Custom SVG graphics
- Advanced CSS effects
- Responsive breakpoints

### Tips for Better Extraction

**1. Simplify Structure**
```html
<!-- Before: Complex nesting -->
<div class="wrapper">
  <div class="container">
    <div class="inner">
      <div class="content">Text</div>
    </div>
  </div>
</div>

<!-- After: Simplified -->
<div class="content-wrapper">
  <p>Text</p>
</div>
```

**2. Use Flexbox/Grid**
```css
/* Preferred: Flexbox */
.container {
  display: flex;
  gap: 16px;
  padding: 24px;
}

/* Avoid: Absolute positioning */
.item {
  position: absolute;
  top: 50px;
  left: 100px;
}
```

**3. Include Object IDs**
```html
<!-- Good: Object ID for traceability -->
<button data-object-id="btn-login-submit" class="btn-primary">
  Log In
</button>
```

**4. Clean CSS**
```css
/* Preferred: Token-based */
.button {
  background: var(--color-primary-600);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
}

/* Avoid: Hardcoded values scattered -->
.button {
  background: #2563eb;
  padding: 12px 16px;
  border-radius: 8px;
}
```

---

## NanoBanana

**Purpose:** Agent-driven asset creation, design inspiration, and sketch envisioning tool

**Website:** <https://nanobanana.com>

**Use Cases in WDS:** 
1. Create visual design assets and explore design concepts
2. Convert sketches/specifications to visual designs (images or code)
3. Generate design inspiration and placeholder assets

**Output Formats:**
- Images (visual designs, graphics)
- Code snippets (HTML/CSS/React)

**Description:** Agent-driven Photoshop - AI-powered tool for visual asset creation and design exploration

### Features

**Asset Creation Capabilities:**
- Visual design generation
- Design inspiration and variations
- Custom graphics and icons
- Image assets
- Design concept exploration
- Possibly code export for certain elements

### Integration with WDS

**Workflow:**
```
Design Concept
    → NanoBanana (create assets/inspiration)
    → Visual Assets/Design Ideas
    → Import to Figma for refinement
    → Integrate into Design System
    → Use in Prototypes
```

**When to Use:**
- Need visual design inspiration
- Creating custom graphics/assets
- Exploring design variations
- Generating design concepts
- Creating placeholder visuals
- Brand identity exploration

**When to Skip:**
- Have existing design assets
- Working with established brand
- Simple text/layout designs
- Using stock assets
- Strict brand guidelines

### Best Practices

**DO ✅**
- Use for creative exploration
- Generate multiple variations
- Refine AI-generated assets
- Use as inspiration starting point
- Integrate refined assets into design system
- Document asset sources

**DON'T ❌**
- Replace human design thinking
- Skip refinement process
- Ignore brand guidelines
- Use without customization
- Rely solely on AI output
- Skip quality review

---

## Area Tag System

**Purpose:** Precise region mapping in HTML prototypes for interactive hotspots

**Use Case in WDS:** Map clickable regions on image-based prototypes or complex UI elements

### What Are Area Tags?

HTML `<area>` elements within `<map>` tags that define clickable regions on images:

```html
<img src="prototype-screenshot.png" usemap="#prototype-map" alt="Prototype">

<map name="prototype-map">
  <area shape="rect" 
        coords="100,50,300,150" 
        data-object-id="btn-login"
        alt="Login Button"
        href="#login">
  <area shape="rect" 
        coords="100,200,300,250" 
        data-object-id="link-signup"
        alt="Sign Up Link"
        href="#signup">
</map>
```

### When to Use Area Tags

**Use When:**
- Working with image-based prototypes
- Need precise click mapping
- Complex UI with overlapping elements
- Screenshot-based specifications
- Testing click regions

**Don't Use When:**
- HTML elements are clickable directly
- Simple button/link interactions
- Fully interactive prototype exists
- Accessibility is primary concern

### Integration with Dev Mode

The dev-mode.js component can extract area tag coordinates:

```javascript
// Dev mode detects area tags
document.querySelectorAll('area').forEach(area => {
  const coords = area.coords;
  const objectId = area.dataset.objectId;
  console.log(`${objectId}: ${coords}`);
});
```

### Creating Area Tags

**1. Get Coordinates**
```
Use image editor or browser dev tools:
- Top-left corner: (x1, y1)
- Bottom-right corner: (x2, y2)
- Format: "x1,y1,x2,y2"
```

**2. Define Area**
```html
<area shape="rect" 
      coords="x1,y1,x2,y2"
      data-object-id="unique-id"
      alt="Description"
      href="#target">
```

**3. Link to Map**
```html
<img src="image.png" usemap="#mapname">
<map name="mapname">
  <!-- area tags here -->
</map>
```

### Best Practices

**DO ✅**
- Include Object IDs in data attributes
- Provide descriptive alt text
- Test all clickable regions
- Document area mappings
- Use for image-based prototypes

**DON'T ❌**
- Use for fully interactive HTML prototypes
- Forget accessibility considerations
- Overlap areas without purpose
- Skip testing on different screen sizes
- Use as replacement for proper HTML

### Accessibility Considerations

Area tags have limitations:
- Not keyboard accessible by default
- Screen readers may not announce properly
- Better to use actual HTML elements when possible

**Workaround:**
```html
<!-- Add keyboard support -->
<area shape="rect" 
      coords="100,50,300,150"
      data-object-id="btn-login"
      alt="Login Button"
      href="#login"
      tabindex="0"
      role="button">
```

---

## Dev Mode Component

**Purpose:** Interactive tool for extracting Object IDs and area coordinates from prototypes

**Location:** `workflows/4-ux-design/interactive-prototypes/templates/components/dev-mode.js`

### Features

**Object ID Extraction:**
- Hold Shift + Click to copy Object IDs
- Visual highlights when Shift held
- Tooltip display on hover
- Success feedback when copied
- Form field protection

**Area Tag Extraction:**
- Detect area tags in prototype
- Extract coordinates
- Map to Object IDs
- Export for documentation

### Usage

**1. Include in Prototype**
```html
<script src="shared/dev-mode.js"></script>
```

**2. Activate Dev Mode**
```
- Click "Dev Mode" button, or
- Press Ctrl+E (Cmd+E on Mac)
```

**3. Extract Object IDs**
```
- Hold Shift
- Click on element
- Object ID copied to clipboard
```

**4. Extract Area Coordinates**
```
- Dev mode detects area tags
- Displays coordinates
- Exports mapping data
```

### Integration with html.to.design

**Workflow:**
```
1. Create prototype with Object IDs
2. Use dev mode to verify Object IDs
3. Extract to Figma via html.to.design
4. Object IDs preserved in layer names
5. Maintain traceability
```

---

## Tool Comparison

| Tool | Category | Primary Use | Input | Output | WDS Use Case |
|------|----------|-------------|-------|--------|--------------|
| **MCP Server** | Figma Integration | Automated sync | HTML + Object ID | Figma components | Precise refinement (PRIMARY) |
| **html.to.design** | HTML → Figma | Full-page conversion | HTML/CSS | Figma file | Fallback method (OPTIONAL) |
| **NanoBanana** | AI Design | Asset creation + Sketch envisioning | Text/Sketch/Spec | Images or Code | Early exploration OR sketch-to-design (OPTIONAL) |
| **Area Tags** | Region mapping | Clickable regions | Image + coords | Clickable map | Image prototypes |
| **Dev Mode** | ID extraction | Object ID tracking | Prototype | Object IDs | Traceability |

---

## Recommended Workflow

### Standard Flow (MCP Server - Recommended)

```
1. Create specification (Phase 4C)
2. Build HTML prototype manually (Phase 4D)
3. Add Object IDs to all components
4. Test functionality
5. Inject specific components to Figma via MCP server (if needed)
6. Refine in Figma
7. Read refined components via MCP server
8. Design system auto-updated
9. Re-render prototype
```

**Advantages:**
- Component-level precision
- Object ID traceability maintained
- Automated design system updates
- Bidirectional sync

### Alternative Flow (Manual Upload - Fallback)

```
1. Create specification (Phase 4C)
2. Build HTML prototype manually (Phase 4D)
3. Add Object IDs to all elements
4. Test functionality
5. Upload to html.to.design (if MCP unavailable)
6. Manually add Object IDs to Figma layers
7. Refine in Figma
8. Manually extract design tokens
9. Update design system manually
10. Re-render prototype
```

**Use when:** MCP server not available

### With Asset Creation (NanoBanana - Optional)

```
1. Create specification (Phase 4C)
2. Use NanoBanana for design inspiration/assets (optional)
3. Import assets to Figma
4. Build HTML prototype manually (Phase 4D)
5. Add Object IDs to all components
6. Test functionality
7. Inject to Figma via MCP server (if needed)
8. Refine in Figma (with NanoBanana assets)
9. Read back via MCP server
10. Design system auto-updated
11. Re-render prototype
```

**Use NanoBanana for:**
- Creating custom graphics/icons
- Generating design inspiration
- Exploring visual concepts
- Creating placeholder assets

### Image-Based Flow (With Area Tags)

```
1. Create specification (Phase 4C)
2. Create image-based prototype
3. Add area tags for clickable regions
4. Include Object IDs in area tags
5. Test click regions
6. Extract to Figma via html.to.design
7. Refine in Figma
8. Convert to HTML prototype
9. Update design system
```

---

## Cost Considerations

### html.to.design
- Free tier available
- Paid plans for advanced features
- Check current pricing at website

### NanoBanana
- Pricing varies by usage
- Check current pricing at website
- Consider cost vs time savings

### Area Tags
- Free (standard HTML)
- No additional cost

### Dev Mode
- Free (included in WDS)
- No additional cost

---

## Troubleshooting

### html.to.design Issues

**Problem:** Layout not preserved
**Solution:** Use Flexbox/Grid, simplify structure

**Problem:** Styles not converted
**Solution:** Use standard CSS properties, avoid complex selectors

**Problem:** Text content missing
**Solution:** Ensure text is in HTML, not JavaScript-generated

### NanoBanana Issues

**Problem:** Generated code doesn't match design system
**Solution:** Customize output, apply design system manually

**Problem:** Complex interactions not generated correctly
**Solution:** Review and rewrite interaction logic

### Area Tag Issues

**Problem:** Clicks not registering
**Solution:** Verify coordinates, check map name matches

**Problem:** Accessibility concerns
**Solution:** Add keyboard support, use actual HTML when possible

### Dev Mode Issues

**Problem:** Object IDs not copying
**Solution:** Check Shift key, verify Object IDs exist

**Problem:** Dev mode not activating
**Solution:** Check script loaded, try Ctrl+E

---

## Resources

**html.to.design:**
- Website: <https://html.to.design>
- Documentation: Check website for latest docs

**NanoBanana:**
- Website: <https://nanobanana.com>
- Documentation: Check website for latest docs

**HTML Area Tags:**
- MDN Reference: <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/area>
- W3C Spec: <https://www.w3.org/TR/html52/semantics-embedded-content.html#the-area-element>

**WDS Documentation:**
- Prototype Workflow: `workflows/4-ux-design/interactive-prototypes/`
- Figma Integration: `workflows/5-design-system/figma-integration/`
- Dev Mode: `workflows/4-ux-design/interactive-prototypes/templates/components/`

---

**This reference provides quick access to tool information for WDS design workflows. For detailed workflows, see the specific workflow documentation files.**
