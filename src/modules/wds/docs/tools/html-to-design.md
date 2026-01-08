# html.to.design

**Category:** Conversion Tool  
**Purpose:** Convert HTML prototypes to Figma (fallback method)  
**Website:** <https://html.to.design>

---

## What It Is

html.to.design is a web-based tool that converts HTML/CSS to Figma files. In WDS, it serves as a fallback method when MCP server is unavailable for extracting prototypes to Figma.

---

## Why WDS Recommends It

**Fallback Option:**
- When MCP server not configured
- For full-page extraction
- Quick one-off conversions
- Exploring design possibilities

**Conversion Capabilities:**
- HTML structure → Figma frames
- CSS styles → Figma styling
- Layout (Flexbox/Grid) → Auto Layout
- Text content → Text layers

---

## Setup Instructions

### 1. Access

No installation required - web-based tool:
1. Go to <https://html.to.design>
2. No account needed for basic use
3. Premium features available with account

### 2. Prepare Prototype

Before uploading:

```html
<!-- Ensure clean HTML structure -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Page Title</title>
  <style>
    /* Include all CSS inline or in <style> tag */
  </style>
</head>
<body>
  <!-- Semantic HTML -->
  <header data-object-id="header-main">
    <h1 data-object-id="heading-title">Title</h1>
  </header>
  <!-- Use Flexbox/Grid for layouts -->
</body>
</html>
```

---

## WDS Best Practices

### DO ✅

**1. Clean HTML Before Upload**
- Use semantic HTML elements
- Remove debug code
- Simplify complex nesting
- Use Flexbox/Grid layouts

**2. Include Object IDs**
```html
<button data-object-id="btn-login-submit">Log In</button>
```

**3. Use Standard CSS**
- Avoid complex positioning
- Use standard properties
- Keep selectors simple

### DON'T ❌

**1. Don't Use When MCP Available**
- MCP server is preferred method
- Better Object ID preservation
- Automated workflow integration

**2. Don't Expect Perfect Conversion**
- Manual cleanup may be needed
- Complex layouts may not convert perfectly
- Review and refine in Figma

---

## Usage Workflow

### 1. Upload HTML

```
1. Go to https://html.to.design
2. Upload HTML file
3. Include associated CSS
4. Select target: Figma
```

### 2. Configure

```
Options:
- Preserve layout structure: Yes
- Convert to components: Yes (if available)
```

### 3. Download and Import

```
1. Download Figma file
2. Open in Figma
3. Manually add Object IDs to layers
4. Begin refinement
```

---

## Limitations

### What Works Well

- Standard layouts
- Flexbox and Grid
- Text content
- Basic styling

### What May Need Manual Adjustment

- Complex animations
- JavaScript-driven content
- Custom SVG graphics
- Advanced CSS effects

---

## When to Use

### Use html.to.design when:

- MCP server not configured
- Need full-page extraction
- Quick one-off conversion
- Exploring design possibilities

### Use MCP server instead when:

- MCP server available
- Need component-level precision
- Require Object ID traceability
- Planning iterative refinement

---

## Resources

- Website: <https://html.to.design>
- Documentation: Check website for latest guides

**Related WDS Documentation:**
- [Figma MCP](figma-mcp.md) - Recommended automated method
- Prototype to Figma Workflow: `workflows/5-design-system/figma-integration/prototype-to-figma-workflow.md`

---

[← Back to Tools](wds-tools-guide.md)
