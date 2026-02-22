# Figma Specification Preparation

Reference for analyzing code and creating specifications with OBJECT IDs for Figma export.

---

## 1. Analyze Code

Extract component information from code to create specifications:

**Component Structure:**
- Identify component name and file location
- Map parent/child relationships
- Note component hierarchy

**Props & States:**
- Extract available props
- Identify state variations (hover, active, disabled, focus, etc.)
- Note conditional rendering logic

**Visual Properties:**
- Extract CSS classes used
- Note inline styles
- Identify design tokens/CSS variables referenced
- Document colors, spacing, typography

**Content:**
- Extract text content
- Note language variations (if i18n present)
- Identify dynamic vs. static content

**Behavior:**
- Document event handlers
- Note interactive elements
- Identify navigation/routing

---

## 2. Generate OBJECT IDs

Create OBJECT IDs following project naming conventions. Determine the pattern by analyzing existing IDs in specifications:

**Pattern A - Page-based:**
- Format: `{page}-{section}-{element}`
- Example: `start-hero-cta`, `start-message-headline`
- Use when: Exporting full pages or page sections

**Pattern B - Component-based:**
- Format: `{component}-{variant}-{state}`
- Example: `btn-cta-primary-hover`, `input-text-disabled`
- Use when: Exporting design system components

**Pattern C - Hierarchical:**
- Format: `{parent}-{child}-{grandchild}`
- Example: `header-nav-menu-item`, `footer-social-icon-twitter`
- Use when: Exporting component blocks with nested elements

**For each component without OBJECT ID:**
1. Identify component type and context
2. Apply naming pattern
3. Ensure uniqueness
4. Add state suffix if applicable

---

## 3. Create Specification Document

Generate a specification document with the generated OBJECT IDs.

**Determine location:**
- Design system component: `docs/D-Design-System/03-Atomic-Components/{category}/`
- Page component: `docs/C-UX-Scenarios/{scenario}/{page}/`
- Shared component: `docs/D-Design-System/04-Molecules/` or `05-Organisms/`

**Specification structure:**

```markdown
# {Component/Page Name}

**OBJECT ID**: `{primary-object-id}`

## Purpose
{Brief description from code analysis}

## Structure
- **HTML Tag**: `<{tag}>`
- **CSS Class**: `.{class-name}`
- **Component File**: `{file-path}`
- **OBJECT ID**: `{object-id}`

## Visual Style
- **Typography**: {font-family}, {size}, {weight}, {color}
- **Colors**: Background, Border, Text
- **Spacing**: Padding, Margin
- **Layout**: {display}, {positioning}

## States
### {State Name}
- **OBJECT ID**: `{component-id-state}`
- **Visual Changes**: {description}
- **Trigger**: {user action or condition}

## Behavior
{Interactive behavior description}

## Content
- **EN**: "{english-content}"
- **SE**: "{swedish-content}" (if applicable)
```

---

## 4. Review with User

Present the generated specification for approval:

**Present:**
- Location of specification document
- Generated OBJECT IDs with descriptions
- Naming pattern used
- Component coverage count

**User options:**
1. **Approve and proceed** - Use these OBJECT IDs for export
2. **Modify IDs** - Adjust naming before proceeding
3. **Review document** - See full specification first

Once approved, proceed to HTML generation with finalized OBJECT IDs.
