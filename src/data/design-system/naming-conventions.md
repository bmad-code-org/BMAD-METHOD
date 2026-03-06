# Design System Naming Conventions

**Purpose:** Consistent naming across design system components and tokens.

**Referenced by:** Component-type instructions, design system operations

---

## Component IDs

**Format:** `[type-prefix]-[descriptor]`

Component IDs should be **logical and readable** — you should know what the component is from its ID alone.

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
- hdr = Header
- ftr = Footer
- nav = Navigation
- lbl = Label
- lnk = Link
- sec = Section element
- lay = Layout
- grd = Grid
- crsl = Carousel

**Examples:**

- `btn-primary-cta` = Primary call-to-action button
- `btn-phone-desktop` = Desktop phone button
- `crd-trust` = Trust card
- `hdr-mobile` = Mobile header
- `nav-service-menu` = Service navigation menu
- `lay-two-col` = Two-column layout

**Rules:**

- Always lowercase
- Always hyphenated
- Descriptive — the ID IS documentation
- Group by type prefix for scannability

> **Why not numbered IDs?** `btn-primary-cta` tells you what the component is. `btn-001` tells you nothing — you have to look it up. In a 33-component design system, readable IDs save time for every agent and human who touches the code.
>
> *Validated on Källa Fordonservice (33 components, 2026-03).*

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

> **Tailwind CSS collision:** Tailwind's built-in `text-xs`, `text-sm`, `text-lg`, `text-xl` utilities set font-size. If your project uses Tailwind, use `heading-*` as the prefix instead of `text-*` to avoid class conflicts:
>
> ```
> heading-3xs, heading-2xs, heading-xs, heading-sm, heading-md,
> heading-lg, heading-xl, heading-2xl, heading-3xl
> ```
>
> The S/M/L scale stays identical — only the prefix changes.
>
> *Discovered on Källa Fordonservice (Astro + Tailwind 3, 2026-03).*

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
