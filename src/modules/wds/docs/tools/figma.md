# Figma

**Category:** Design Tool  
**Purpose:** Visual design refinement and design system documentation  
**Website:** <https://figma.com>

---

## What It Is

Figma is a collaborative design tool used in WDS for visual design refinement when prototypes need polish. It's where designers refine components extracted from HTML prototypes and define design tokens.

---

## Why WDS Recommends It

**Visual Design Refinement:**
- Polish components extracted from prototypes
- Define design tokens (colors, spacing, typography)
- Create component variants and states
- Document design decisions

**Collaboration:**
- Real-time collaboration with team
- Share designs with stakeholders
- Comment and feedback system
- Version history

**WDS Integration:**
- MCP server integration for component injection
- Bidirectional sync with design system
- Page structure mirrors WDS specifications
- Component traceability via Object IDs

---

## Setup Instructions

### 1. Account Creation

1. Go to <https://figma.com>
2. Sign up for free account
3. Install desktop app (recommended) or use web version

### 2. WDS Project Setup

Create Figma file structure:

```
[Project Name] Design Refinement
├── 01-Customer-Onboarding/
│   ├── 1.1-Start-Page
│   ├── 1.2-Sign-In
│   └── 1.3-Sign-Up
├── 02-Product-Catalog/
│   ├── 2.1-Product-List
│   └── 2.2-Product-Detail
└── Components/
    ├── Buttons
    ├── Inputs
    └── Cards
```

### 3. Design Tokens Setup

Create Figma variables:

**Colors:**
```
Collection: Colors
├── primary/50
├── primary/600
├── primary/700
├── neutral/50
└── neutral/900
```

**Spacing:**
```
Collection: Spacing
├── xs = 4px
├── sm = 8px
├── md = 16px
└── lg = 24px
```

**Typography:**
```
Styles: Typography
├── Heading/1
├── Heading/2
├── Body/Regular
└── Body/Bold
```

---

## WDS Best Practices

### DO ✅

**1. Match WDS Structure**
- Page names: `[Scenario-Number]-[Scenario-Name] / [Page-Number]-[Page-Name]`
- Example: `01-Customer-Onboarding / 1.2-Sign-In`
- Mirrors `docs/C-Scenarios/` structure

**2. Preserve Object IDs**
- Include Object IDs in layer names
- Example: Layer name "btn-login-submit"
- Maintains traceability to code

**3. Use Design Tokens**
- Always use variables for colors
- Use variables for spacing
- Apply text styles consistently
- Don't hardcode values

**4. Document Decisions**
- Add descriptions to components
- Document when to use each variant
- Note accessibility requirements
- Include usage examples

### DON'T ❌

**1. Don't Diverge from Specs**
- If design changes, update specification
- Keep Figma and specs in sync
- Notify team of design evolution

**2. Don't Skip Component Documentation**
- Always add WDS component ID
- Document variants and states
- Include usage guidelines

**3. Don't Hardcode Values**
- Use variables, not hex colors
- Use spacing variables
- Apply text styles

---

## WDS-Specific Workflows

### Receiving Components from Freya

1. Freya injects components via MCP server
2. Components appear in designated page
3. Layer names include Object IDs
4. Basic styling applied

### Refining Components

1. Apply design tokens (colors, spacing, typography)
2. Create component variants (primary, secondary, etc.)
3. Define states (default, hover, active, disabled)
4. Add visual polish (shadows, borders, effects)
5. Document in component description

### Sending Back to WDS

1. Notify Freya when refinement complete
2. Freya reads components via MCP server
3. Design tokens extracted automatically
4. Design system updated
5. Prototype re-rendered with refined design

---

## Keyboard Shortcuts

**Essential for WDS:**

| Action | Shortcut |
|--------|----------|
| Frame | F |
| Component | Ctrl/Cmd+Alt+K |
| Text | T |
| Rectangle | R |
| Duplicate | Ctrl/Cmd+D |
| Group | Ctrl/Cmd+G |
| Auto Layout | Shift+A |
| Copy Properties | Ctrl/Cmd+Alt+C |
| Paste Properties | Ctrl/Cmd+Alt+V |

---

## Troubleshooting

### Issue: Components not syncing with WDS

**Solution:**
- Check Object IDs in layer names
- Verify Figma file ID in project config
- Ensure MCP server configured
- Check Figma API access token

---

## Resources

- Help Center: <https://help.figma.com>
- Community: <https://forum.figma.com>
- API Documentation: <https://www.figma.com/developers/api>

**Related WDS Documentation:**
- [Figma MCP](figma-mcp.md) - Automated integration
- Figma Designer Guide: `workflows/5-design-system/figma-integration/figma-designer-guide.md`

---

[← Back to Tools](wds-tools-guide.md)
