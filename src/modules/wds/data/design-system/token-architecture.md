# Design Token Architecture

**Purpose:** Core principles for separating semantic structure from visual style.

**Referenced by:** All component-type instructions

---

## Core Principle

**Separate semantic structure from visual style.**

```
HTML/Structure = Meaning (what it is)
Design Tokens = Appearance (how it looks)

They should be independent!
```

---

## The Problem

**Bad Practice:**

```html
<h2 class="text-4xl font-bold text-blue-600">Heading</h2>
```

**Issues:**

- Visual styling mixed with semantic HTML
- Can't change h2 appearance without changing all h2s
- h2 means "second-level heading" but looks like "display large"
- Breaks separation of concerns

---

## The Solution

**Good Practice:**

**HTML (Semantic):**

```html
<h2 class="heading-section">Heading</h2>
```

**Design Tokens (Visual):**

```css
.heading-section {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--color-primary-600);
}
```

**Benefits:**

- Semantic HTML stays semantic
- Visual style is centralized
- Can change appearance without touching HTML
- Clear separation of concerns

---

## Token Hierarchy

### Level 1: Raw Values

```css
--spacing-4: 1rem;
--color-blue-600: #2563eb;
--font-size-4xl: 2.25rem;
```

### Level 2: Semantic Tokens

```css
--text-heading-large: var(--font-size-4xl);
--color-primary: var(--color-blue-600);
--spacing-section: var(--spacing-4);
```

### Level 3: Component Tokens

```css
--button-padding-x: var(--spacing-section);
--button-color-primary: var(--color-primary);
--heading-size-section: var(--text-heading-large);
```

**Use Level 2 or 3 in components, never Level 1 directly.**

---

## Application to WDS

### In Page Specifications

**Specify semantic structure:**

```yaml
Page Structure:
  - Section Heading (h2)
  - Body text (p)
  - Primary button (button)
```

**NOT visual styling:**

```yaml
# ❌ Don't do this
Page Structure:
  - Large blue bold text
  - 16px gray text
  - Blue rounded button
```

### In Design System

**Specify visual styling:**

```yaml
Section Heading:
  html_element: h2
  design_token: heading-section

Design Token Definition:
  heading-section:
    font-size: text-4xl
    font-weight: bold
    color: primary-600
```

---

## Component-Type Instructions

### Text Heading Example

**When specifying a heading:**

1. **Identify semantic level** (h1-h6)
   - h1 = Page title
   - h2 = Section heading
   - h3 = Subsection heading
   - etc.

2. **Map to design token**
   - h1 → display-large
   - h2 → heading-section
   - h3 → heading-subsection

3. **Store separately**
   - Page spec: `<h2>` (semantic)
   - Design system: `heading-section` token (visual)

**Example Output:**

**Page Spec:**

```yaml
Hero Section:
  heading:
    element: h2
    token: heading-section
    content: 'Welcome to Our Product'
```

**Design System:**

```yaml
Tokens:
  heading-section:
    font-size: 2.25rem
    font-weight: 700
    line-height: 1.2
    color: gray-900
```

---

## Button Example

**When specifying a button:**

1. **Identify semantic element**
   - `<button>` for actions
   - `<a>` for navigation (even if styled as button)

2. **Map to component**
   - Action → Button component
   - Navigation → Link component (button variant)

3. **Store separately**
   - Page spec: `<button>` + purpose
   - Design system: Button component styling

**Example Output:**

**Page Spec:**

```yaml
Login Form:
  submit_button:
    element: button
    type: submit
    component: Button.primary
    label: 'Log in'
```

**Design System:**

```yaml
Button Component:
  variants:
    primary:
      background: primary-600
      color: white
      padding: spacing-2 spacing-4
      border-radius: radius-md
```

---

## Input Field Example

**When specifying an input:**

1. **Identify semantic type**
   - `<input type="text">` for text
   - `<input type="email">` for email
   - `<input type="password">` for password

2. **Map to component**
   - Text input → Input Field component
   - Email input → Input Field.email variant

3. **Store separately**
   - Page spec: Input type + validation + labels
   - Design system: Input Field styling

**Example Output:**

**Page Spec:**

```yaml
Login Form:
  email_field:
    element: input
    type: email
    component: InputField.email
    label: 'Email address'
    placeholder: 'you@example.com'
    required: true
    validation: email_format
```

**Design System:**

```yaml
Input Field Component:
  base_styling:
    height: 2.5rem
    padding: spacing-2 spacing-3
    border: 1px solid gray-300
    border-radius: radius-md
    font-size: text-base

  variants:
    email:
      icon: envelope
      autocomplete: email
```

---

## Why This Matters

### For Designers

✅ **Consistency:** All h2s can look the same without manual styling
✅ **Flexibility:** Change all section headings by updating one token
✅ **Clarity:** Semantic meaning preserved
✅ **Scalability:** Easy to maintain as design system grows

### For Developers

✅ **Semantic HTML:** Proper HTML structure
✅ **Accessibility:** Screen readers understand structure
✅ **Maintainability:** Styling centralized
✅ **Performance:** Reusable styles

### For Design Systems

✅ **Single Source of Truth:** Tokens define appearance
✅ **Easy Updates:** Change tokens, not components
✅ **Consistency:** Automatic consistency across pages
✅ **Documentation:** Clear token → component mapping

---

## Common Mistakes

### Mistake 1: Mixing Structure and Style

**❌ Bad:**

```yaml
Page:
  - "Large blue heading" (h2)
```

**✅ Good:**

```yaml
Page:
  - Section heading (h2 → heading-section token)
```

### Mistake 2: Hardcoding Visual Values

**❌ Bad:**

```yaml
Button:
  background: #2563eb
  padding: 16px
```

**✅ Good:**

```yaml
Button:
  background: primary-600
  padding: spacing-4
```

### Mistake 3: Using Visual Names for Semantic Elements

**❌ Bad:**

```yaml
<h2 class="big-blue-text">
```

**✅ Good:**

```yaml
<h2 class="section-heading">
```

---

## Token Naming Conventions

### Colors

```
--color-{category}-{shade}
--color-primary-600
--color-gray-900
--color-success-500
```

### Typography

```
--text-{size}
--text-base
--text-lg
--text-4xl
```

### Spacing

```
--spacing-{scale}
--spacing-2
--spacing-4
--spacing-8
```

### Component-Specific

```
--{component}-{property}-{variant}
--button-padding-primary
--input-border-error
--card-shadow-elevated
```

---

## Implementation in WDS

### Phase 4: Page Specification

**Agent specifies:**

- Semantic HTML elements
- Component references
- Content and labels

**Agent does NOT specify:**

- Exact colors
- Exact sizes
- Exact spacing

### Phase 5: Design System

**Agent specifies:**

- Design tokens
- Component styling
- Visual properties

**Agent does NOT specify:**

- Page-specific content
- Semantic structure

### Integration

**Page spec references design system:**

```yaml
Hero:
  heading:
    element: h2
    token: heading-hero  ← Reference to design system
    content: 'Welcome'
```

**Design system defines token:**

```yaml
Tokens:
  heading-hero:
    font-size: 3rem
    font-weight: 800
    color: gray-900
```

---

## Company Customization

**Companies can fork WDS and customize tokens:**

```
Company Fork:
├── data/design-system/
│   ├── token-architecture.md (this file - keep principles)
│   ├── company-tokens.md (company-specific token values)
│   └── token-mappings.md (h2 → company-heading-large)
```

**Result:** Every project uses company's design tokens automatically.

---

## Further Reading

- **Naming Conventions:** `naming-conventions.md`
- **Component Boundaries:** `component-boundaries.md`
- **State Management:** `state-management.md`

---

**This is a core principle. Reference this document from all component-type instructions.**
