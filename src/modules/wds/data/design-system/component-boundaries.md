# Component Boundaries

**Purpose:** Guidelines for determining what constitutes a component.

**Referenced by:** Design system router, assessment flow

---

## The Core Question

**"Is this one component or multiple components?"**

This is the most common design system challenge.

---

## Guiding Principles

### Principle 1: Single Responsibility

**A component should do one thing well.**

✅ **Good:** Button component triggers actions
❌ **Bad:** Button component that also handles forms, navigation, and modals

### Principle 2: Reusability

**A component should be reusable across contexts.**

✅ **Good:** Input Field used in login, signup, profile forms
❌ **Bad:** Login-Specific Input Field that only works on login page

### Principle 3: Independence

**A component should work independently.**

✅ **Good:** Card component that can contain any content
❌ **Bad:** Card component that requires specific parent container

---

## Common Boundary Questions

### Q1: Icon in Button

**Question:** Is the icon part of the button or separate?

**Answer:** Depends on usage:

**Part of Button (Variant):**

```yaml
Button Component:
  variants:
    - with-icon-left
    - with-icon-right
    - icon-only
```

**When:** Icon is always the same type (e.g., always arrow for navigation)

**Separate Components:**

```yaml
Button Component: (text only)
Icon Component: (standalone)
Composition: Button + Icon
```

**When:** Icons vary widely, button can exist without icon

**Recommendation:** Start with variant, split if complexity grows.

---

### Q2: Label with Input

**Question:** Is the label part of the input or separate?

**Answer:** Usually part of Input Field component:

```yaml
Input Field Component:
  includes:
    - Label
    - Input element
    - Helper text
    - Error message
```

**Reason:** These always appear together in forms, form a semantic unit.

---

### Q3: Card with Button

**Question:** Is the button part of the card?

**Answer:** Usually separate:

```yaml
Card Component: (container)
Button Component: (action)
Composition: Card contains Button
```

**Reason:** Card is a container, button is an action. Different purposes.

---

### Q4: Navigation Bar Items

**Question:** Is each nav item a component?

**Answer:** Depends on complexity:

**Simple (Single Component):**

```yaml
Navigation Bar Component:
  includes: All nav items as configuration
```

**Complex (Composition):**

```yaml
Navigation Bar: (container)
Navigation Item: (individual item)
Composition: Nav Bar contains Nav Items
```

**Threshold:** If nav items have complex individual behavior, split them.

---

## Decision Framework

### Step 1: Ask These Questions

1. **Can it exist independently?**
   - Yes → Probably separate component
   - No → Probably part of parent

2. **Does it have its own states/behaviors?**
   - Yes → Probably separate component
   - No → Probably part of parent

3. **Is it reused in different contexts?**
   - Yes → Definitely separate component
   - No → Could be part of parent

4. **Does it have a clear single purpose?**
   - Yes → Good component candidate
   - No → Might need to split further

### Step 2: Consider Complexity

**Low Complexity:** Keep together

- Icon in button
- Label with input
- Simple list items

**High Complexity:** Split apart

- Complex nested structures
- Independent behaviors
- Different lifecycle

### Step 3: Think About Maintenance

**Together:**

- ✅ Easier to keep consistent
- ❌ Component becomes complex

**Apart:**

- ✅ Simpler components
- ❌ More components to manage

---

## Composition Patterns

### Pattern 1: Container + Content

**Container provides structure, content is flexible.**

```yaml
Card Component: (container)
  - Can contain: text, images, buttons, etc.
  - Provides: padding, border, shadow
```

### Pattern 2: Compound Component

**Multiple parts that work together.**

```yaml
Accordion Component:
  - Accordion Container
  - Accordion Item
  - Accordion Header
  - Accordion Content
```

### Pattern 3: Atomic Component

**Single, indivisible unit.**

```yaml
Button Component:
  - Cannot be broken down further
  - Self-contained
```

---

## Red Flags

### Too Many Variants

**Warning:** Component has 10+ variants

**Problem:** Probably multiple components disguised as variants

**Solution:** Split into separate components based on purpose

### Conditional Complexity

**Warning:** Component has many "if this, then that" rules

**Problem:** Component doing too many things

**Solution:** Split into simpler, focused components

### Context-Specific Behavior

**Warning:** Component behaves differently in different contexts

**Problem:** Not truly reusable

**Solution:** Create context-specific components or use composition

---

## Examples

### Example 1: Button

**One Component:**

```yaml
Button:
  variants: primary, secondary, ghost
  states: default, hover, active, disabled, loading
```

**Reason:** All variants serve same purpose (trigger action), share behavior

### Example 2: Input Types

**Multiple Components:**

```yaml
Text Input: (text entry)
Select Dropdown: (choose from list)
Checkbox: (toggle option)
Radio: (choose one)
```

**Reason:** Different purposes, different behaviors, different HTML elements

### Example 3: Modal

**Compound Component:**

```yaml
Modal: (overlay + container)
Modal Header: (title + close button)
Modal Body: (content area)
Modal Footer: (actions)
```

**Reason:** Complex structure, but parts always used together

---

## When in Doubt

**Start simple:**

1. Create as single component
2. Add variants as needed
3. Split when complexity becomes painful

**It's easier to split later than merge later.**

---

## Company Customization

Companies can define their own boundary rules:

```markdown
# Acme Corp Component Boundaries

**Rule 1:** Icons are always separate components
**Rule 2:** Form fields include labels (never separate)
**Rule 3:** Cards never include actions (composition only)
```

**Consistency within a company matters more than universal rules.**

---

**Use this guide when the design system router detects similarity and you need to decide: same component, variant, or new component?**
