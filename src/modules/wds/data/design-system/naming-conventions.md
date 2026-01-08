# Design System Naming Conventions

**Purpose:** Consistent naming across design system components and tokens.

**Referenced by:** Component-type instructions, design system operations

---

## Component IDs

**Format:** `[type-prefix]-[number]`

**Prefixes:**

- btn = Button
- inp = Input Field
- chk = Checkbox
- rad = Radio
- tgl = Toggle
- drp = Dropdown
- mdl = Modal
- crd = Card
- alt = Alert
- bdg = Badge
- tab = Tab
- acc = Accordion

**Examples:**

- `btn-001` = First button component
- `inp-002` = Second input field component
- `mdl-001` = First modal component

**Rules:**

- Always lowercase
- Always hyphenated
- Always zero-padded (001, not 1)
- Sequential within type

---

## Component Names

**Format:** `[Type] [Descriptor]` or just `[Type]`

**Examples:**

- `Button` (generic)
- `Navigation Button` (specific)
- `Primary Button` (variant-focused)
- `Icon Button` (visual-focused)

**Rules:**

- Title case
- Descriptive but concise
- Avoid redundancy (not "Button Button")

---

## Variant Names

**Format:** Lowercase, hyphenated

**Purpose-Based:**

- `primary` - Main action
- `secondary` - Secondary action
- `destructive` - Delete/remove
- `success` - Positive confirmation
- `warning` - Caution
- `navigation` - Navigation action

**Visual-Based:**

- `outlined` - Border, no fill
- `ghost` - Transparent background
- `solid` - Filled background

**Size-Based:**

- `small` - Compact
- `medium` - Default
- `large` - Prominent

**Rules:**

- Lowercase
- Hyphenated for multi-word
- Semantic over visual when possible

---

## State Names

**Standard States:**

- `default` - Normal state
- `hover` - Mouse over
- `active` - Being clicked/pressed
- `focus` - Keyboard focus
- `disabled` - Cannot interact
- `loading` - Processing
- `error` - Error state
- `success` - Success state
- `warning` - Warning state

**Rules:**

- Lowercase
- Single word preferred
- Use standard names when possible

---

## Design Token Names

**Format:** `--{category}-{property}-{variant}`

**Color Tokens:**

```
--color-primary-500
--color-gray-900
--color-success-600
--color-error-500
```

**Typography Tokens:**

```
--text-xs
--text-base
--text-4xl
--font-normal
--font-bold
```

**Spacing Tokens:**

```
--spacing-1
--spacing-4
--spacing-8
```

**Component Tokens:**

```
--button-padding-x
--input-border-color
--card-shadow
```

**Rules:**

- Kebab-case
- Hierarchical (general → specific)
- Semantic names preferred

---

## File Names

**Component Files:**

```
button.md
navigation-button.md
input-field.md
```

**Rules:**

- Lowercase
- Hyphenated
- Match component name (simplified)

---

## Folder Names

```
components/
design-tokens/
operations/
assessment/
templates/
```

**Rules:**

- Lowercase
- Hyphenated
- Plural for collections

---

**Consistency in naming makes the design system easier to navigate and maintain.**
