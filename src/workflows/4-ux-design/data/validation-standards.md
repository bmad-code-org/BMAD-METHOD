# Page Specification Validation Standards

**Purpose:** Reference standards for validating WDS page specifications.

---

## Standard Section Order

Page specifications must follow this section order:

1. **Page Metadata** (after title)
2. **Navigation** (H3 + Next Step + Sketch + Next Step + H1)
3. **Page Description** (1-2 paragraphs)
4. **User Situation**
5. **Page Purpose**
6. **Page Sections**
7. **Object Registry**
8. **Reference Materials** (optional)
9. **Technical Notes** (optional)
10. **Development Checklist** (optional)

---

## Required Sections

### Mandatory
- Page Metadata
- Navigation structure
- Page description
- User Situation
- Page Purpose
- Page Sections
- Object Registry

### Optional
- Reference Materials
- Technical Notes
- Development Checklist
- Responsive Behavior (if responsive platform)

---

## Page Metadata Requirements

**Required Fields:**
- Platform (from Product Brief/Scenario)
- Page Type (Full Page, Modal, Drawer, etc.)
- Primary Viewport (Mobile-first, Desktop-first, etc.)
- Interaction Model (Touch, Mouse/keyboard, etc.)
- Navigation Context (Public, Authenticated, etc.)
- Inherits From (Scenario reference)

**Example:**
```markdown
## Page Metadata

**Platform**: Mobile web app (responsive PWA)
**Page Type**: Full Page
**Primary Viewport**: Mobile-first (< 768px)
**Interaction Model**: Touch-first
**Navigation Context**: Authenticated

**Inherits From**: Scenario 03 Platform Strategy (see scenario overview)
```

---

## Object ID Format

**Standard Format:** `object-name` (lowercase, hyphen-separated)

**Examples:**
- ✅ `booking-detail-header`
- ✅ `calendar-week-navigation`
- ✅ `user-profile-avatar`
- ❌ `bookingDetailHeader` (camelCase)
- ❌ `Booking_Detail_Header` (PascalCase with underscores)

**Component Declaration:**
```markdown
#### Component Name
**OBJECT ID**: `object-name`
- **Component**: [Component Name](link-to-design-system)
- **Content**: Description
- **Behavior**: Interactions
```

---

## Design System Separation

**Forbidden in Page Specs:**
- ❌ CSS classes (`.button-primary`, `.flex-container`)
- ❌ Hex color codes (`#FF5733`, `#000000`)
- ❌ Pixel values (`16px`, `margin: 20px`)
- ❌ Font specifications (`font-size: 14px`, `font-family: Inter`)
- ❌ Layout measurements (`padding: 10px 20px`)
- ❌ CSS properties (`display: flex`, `justify-content: center`)

**Allowed in Page Specs:**
- ✅ Component references with Design System links
- ✅ Design System token references (`primary-color`, `heading-large`)
- ✅ Behavioral descriptions ("button changes to active state")
- ✅ Layout intent ("elements stack vertically on mobile")
- ✅ Content specifications ("displays user's full name")

---

## Responsive Behavior Documentation

**When Required:**
- Platform: Responsive Web Application
- Primary Viewport: Mobile-first or Desktop-first

**What to Document:**
- Layout changes across viewports
- Navigation pattern adaptations
- Content reflow strategies
- Viewport-specific interactions
- Breakpoint behavior

**Example:**
```markdown
**Responsive Behavior:**
- **Mobile (< 768px)**: Navigation collapses to hamburger menu
- **Tablet (768px - 1024px)**: Side-by-side layout with condensed sidebar
- **Desktop (≥ 1024px)**: Full three-column layout with expanded navigation
```

---

## Object Registry Requirements

**Coverage:** 100% of all Object IDs from Page Sections

**Format:**
```markdown
## Object Registry

This registry provides a complete index of all interactive and structural elements on this page, enabling traceability from specification to code to Figma.

| Object ID | Type | Description |
|-----------|------|-------------|
| object-name | Component Type | Brief description |
```

**Validation:**
- Every Object ID in Page Sections must appear in registry
- No orphaned Object IDs (in registry but not in sections)
- Consistent naming across sections and registry

---

## Unnecessary Information

**Should NOT appear in page specs:**
- Implementation code snippets (HTML, CSS, JavaScript)
- Developer setup instructions
- Version control information (commit messages, PR notes)
- Internal project management notes
- Duplicate content across sections
- Outdated/deprecated information
- Design iteration history

**Belongs elsewhere:**
- Code → Implementation files
- Setup → Developer documentation
- Version control → Git history
- Project management → Project management tools
- Design decisions → Design decision log

---

## Navigation Structure

**Required Elements:**
1. H3 header with page number and name
2. "Previous Step" and "Next Step" links before sketch
3. Embedded sketch image
4. "Previous Step" and "Next Step" links after sketch (duplicate)
5. H1 header matching H3

**Format:**
```markdown
### X.X Page Name

**Previous Step**: ← [Link] | **Next Step**: → [Link]

![Sketch Description](Sketches/filename.jpg)

**Previous Step**: ← [Link] | **Next Step**: → [Link]

# X.X Page Name
```

---

## File Size Limits

**Step Files:** < 250 lines (< 200 recommended)
**Reference Documents:** No strict limit (quality-guide.md can be larger)
**Data Files:** < 500 lines (use sharding for larger datasets)

---

## Validation Checklist Template

```yaml
validation_checklist:
  section_exists: [true/false]
  required_fields_present: [true/false]
  format_correct: [true/false]
  standards_compliant: [true/false]
  status: [pass/warning/critical]
```
