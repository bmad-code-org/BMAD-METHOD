# Step 4: Page Sections Structure

**Purpose:** Organize all page elements into logical sections with clear hierarchy and Object IDs.

---

## What Page Sections Provide

**For Designers:**
- Clear visual hierarchy
- Section-level organization
- Understanding of page flow

**For Developers:**
- Component boundaries
- Implementation order
- Semantic HTML structure

**For Everyone:**
- Shared vocabulary
- Clear references ("update the hero section")
- Traceability

---

## Standard Format

### Required Structure

```markdown
## Page Sections

### [Section Name] Object
**Purpose**: [One sentence explaining section's role]

#### [Component Name]
**OBJECT ID**: `page-section-component`
- **Component**: [Link to design system component if exists]
- **Content**: [What text/media this contains]
- **Behavior**: [What happens on interaction]
- **Position**: [Where it's located]
- **[Other relevant specs]**: [Values]
```

---

## Format Example (Fictional Project)

```markdown
## Page Sections

### Header Object
**Purpose**: Navigation and user access

#### Company Logo
**OBJECT ID**: `home-header-logo`
- **Component**: [Logo Component](/docs/design-system/components/Logo.md)
- **Content**: "TaskFlow" logotype
- **Behavior**: Links to home page
- **Position**: Left-aligned

#### Sign In Button  
**OBJECT ID**: `home-header-signin`
- **Component**: [Button Secondary](/docs/design-system/components/Buttons/Button-Secondary.md)
- **Content**: "Sign in"
- **Behavior**: Navigate to sign-in page
- **Color**: `var(--primary-600)`
- **Position**: Right side
```

---

## Hierarchy Rules

### Section Types

**H3 Level (###): Section Objects**
- Major visual sections (Header, Hero, Footer, etc.)
- Each section has a **Purpose** statement
- Sections contain multiple components

**H4 Level (####): Components**
- Individual interactive or visual elements
- Each has an **OBJECT ID**
- Components can reference design system

**Object ID Naming Convention:**
```
{page-prefix}-{section}-{component}
```

Examples:
- `start-header-logo`
- `start-hero-cta`
- `start-footer-newsletter-button`

---

## Creation Instructions

<if condition="Creating new specification">

### Analyze Sketch

1. **Identify visual sections from top to bottom:**
   - Header/Navigation
   - Hero/Main message
   - Content sections (Features, Benefits, etc.)
   - Footer

2. **For each section, list all components:**
   - Text elements (headlines, paragraphs)
   - Interactive elements (buttons, inputs, links)
   - Visual elements (images, icons, illustrations)
   - Containers (cards, panels, modals)

3. **Determine section purpose:**
   - Why does this section exist?
   - What user need does it serve?

### Generate Section Specifications

<output>
For each section, generate:

**Section Header:**
```markdown
### [Section Name] Object
**Purpose**: [Clear, one-sentence purpose]
```

**For each component in section:**
```markdown
#### [Component Name]
**OBJECT ID**: `{page}-{section}-{component}`
- **Component**: [Link if design system exists, or "TBD"]
- **Content**: [Actual text or description]
- **Behavior**: [User interaction or static]
- **Position**: [Location within section]
- **[Relevant specs]**: [Values specific to this component]
```

**Spec Fields by Component Type:**

**Buttons:**
- Component, Content (with translations), Behavior, Colors, Position

**Text Elements:**
- Component (H1, H2, body, etc.), Content (with translations), Behavior (if clickable), Style

**Images:**
- Component, Content (description), Behavior, Layout, Image Source, Dimensions

**Inputs:**
- Component, API Data Field, Placeholder (with translations), Validation

**Links:**
- Component, Content (with translations), Behavior (destination)

</output>

</if>

---

## Quality Check Instructions

<if condition="Analyzing existing specification">

### Sections Checklist

**Structure Validation:**

- [ ] **"## Page Sections"** heading present
- [ ] Each section uses **H3** (`###`) with "Object" suffix
- [ ] Each section has **Purpose** statement
- [ ] Each component uses **H4** (`####`)
- [ ] Every component has **OBJECT ID**

**Object ID Validation:**

- [ ] Object IDs follow naming convention: `{page}-{section}-{component}`
- [ ] Object IDs are **unique** across entire page
- [ ] Object IDs use **lowercase** with hyphens
- [ ] Object IDs are **descriptive** (not generic like `button-1`)

**Component Specification:**

- [ ] Each component has **minimum required fields**:
  - OBJECT ID (always)
  - Content or description
  - Behavior (if interactive)
  
- [ ] **Multilingual content** marked with language codes (EN:, SE:, etc.)
- [ ] **Design system links** present where components exist
- [ ] **Position** information provided
- [ ] **Color variables** used (not hex codes directly)

**Completeness:**

- [ ] **All visible elements** in sketch have specs
- [ ] **All interactive elements** have behavior defined
- [ ] **All text content** is specified (not "lorem ipsum")
- [ ] **All images** have source paths or descriptions

### Report Format

<output>
**Page Sections Quality Report**

**Status:** ✅ PASS / ❌ FAIL

**Structure Issues:**
- [Missing "Page Sections" header?]
- [Wrong heading levels?]
- [Missing Purpose statements?]

**Object ID Issues:**
- [List any components without Object IDs]
- [List duplicate Object IDs]
- [List incorrectly formatted Object IDs]

**Specification Gaps:**
- [Components missing behavior specs]
- [Missing multilingual content]
- [Missing position information]

**Sketch Coverage:**
- [List visible elements in sketch not specified]

**Recommendations:**
- [Specific fixes needed]
</output>

</if>

---

## Common Errors to Avoid

**❌ Don't:**
- Skip Object IDs ("we'll add them later")
- Use generic Object IDs (`button-1`, `text-2`)
- Mix heading levels incorrectly
- Forget the "Object" suffix on section headers
- Leave content as placeholders ("TBD", "Lorem ipsum")
- Use absolute URLs for design system links

**✅ Do:**
- Give every interactive element an Object ID
- Use descriptive, semantic Object IDs
- Maintain consistent hierarchy (H3 → H4)
- Write clear, one-sentence Purpose statements
- Specify actual content (even if it might change)
- Use relative paths for all internal links

---

## Example Fixes

### ❌ Incorrect: Missing Object IDs, wrong hierarchy

```markdown
## Header

### Logo
- Component: Logo
- Content: TaskFlow

### Button
- Content: Sign in
- Behavior: Go to sign-in page
```

**Issues:**
- No "Page Sections" header
- "Header" should be H3, components H4
- Missing "Object" suffix
- No Purpose statement
- No Object IDs
- Vague component names

### ✅ Correct: Proper hierarchy and Object IDs

```markdown
## Page Sections

### Header Object
**Purpose**: Navigation and user access

#### Company Logo
**OBJECT ID**: `home-header-logo`
- **Component**: [Logo Component](/docs/design-system/components/Logo.md)
- **Content**: "TaskFlow" logotype
- **Behavior**: Links to home page
- **Position**: Left-aligned

#### Sign In Button  
**OBJECT ID**: `home-header-signin`
- **Component**: [Button Secondary](/docs/design-system/components/Buttons/Button-Secondary.md)
- **Content**: "Sign in"
- **Behavior**: Navigate to sign-in page
- **Position**: Right side
```

**Strengths:**
- Clear hierarchy (H2 → H3 → H4)
- Purpose statement at section level
- Unique, descriptive Object IDs
- Design system links
- Multilingual content
- Position information

---

## Next Step

<action>Load and execute: step-05-object-registry.md</action>

