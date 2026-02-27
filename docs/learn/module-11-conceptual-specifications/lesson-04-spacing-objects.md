# Module 11: Conceptual Specifications

## Lesson 4: Spacing as First-Class Objects

**The invisible layer that holds everything together**

---

## The Gap Is Not Empty

Look at a well-designed page. Between the header and the hero. Between the cards in a grid. Between a heading and the paragraph below it.

That space is not "nothing." It's a design decision.

In WDS, **spacing is a first-class object** — it has an ID, a type, and a value, just like a button or a card.

---

## Why Spacing Gets an ID

Without IDs, spacing conversations sound like this:

> "Add more space between the trust section and the seasons section"

With IDs, they sound like this:

> "Change `hem-v-space-3xl` to `space-4xl`"

The second version is precise, traceable, and can be found in the design system. The first version requires the developer to figure out which space you mean.

---

## The Naming Convention

```
{page}-{v|h}-{type}-{size}
```

| Part | Meaning | Examples |
|------|---------|---------|
| `{page}` | Which page | `hem`, `nyheter`, `om-oss` |
| `{v\|h}` | Direction | `v` = vertical, `h` = horizontal |
| `{type}` | What kind | `space`, `separator`, `line` |
| `{size}` | Token value | `zero`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `flex` |

**The ID describes WHAT the spacing IS, not what it sits between.**

### Examples

```markdown
#### ↕ `hem-v-space-zero` — header and service menu form one continuous nav unit
#### ↕ `hem-v-separator-2xl` — gray line, space-2xl above and below
#### ↕ `hem-v-space-3xl` — major section boundary between seasons and footer
```

---

## Zero Spacing Is a Decision

When two objects touch with no gap, that's a deliberate design choice:

```markdown
#### ↕ `hem-v-space-zero` — hero sits flush below navigation, background color shift provides visual separation
```

If you don't document this, a future developer might "fix" it by adding spacing. Zero spacing says: "This is intentional. Don't add a gap."

---

## How Spacing Appears in Page Specs

Between each section, an explicit spacing object:

```
┌──────────────────────────┐
│  Site Header             │
├──────────────────────────┤
│ ↕ hem-v-space-zero       │  ← spacing object
├──────────────────────────┤
│  Service Menu            │
├──────────────────────────┤
│ ↕ hem-v-space-zero       │  ← spacing object
├──────────────────────────┤
│  Hero Section            │
├──────────────────────────┤
│ ↕ hem-v-space-zero       │  ← spacing object (bg color shift)
├──────────────────────────┤
│  About Section           │
├──────────────────────────┤
│ ↕ hem-v-separator-2xl    │  ← gray line with equal spacing
├──────────────────────────┤
│  Trust Cards             │
├──────────────────────────┤
│ ↕ hem-v-space-3xl        │  ← major boundary
├──────────────────────────┤
│  Season Cards            │
└──────────────────────────┘
```

---

## Group-Level vs. Individual Spacing

When all items in a grid share the same spacing, define it **on the container**:

```markdown
| Grid gap | h-space-lg / v-space-lg (24px) |
```

Don't create separate spacing objects between card 1 and card 2, card 2 and card 3. The grid gap handles it.

Individual spacing objects are for **between sections** and **non-uniform gaps**.

---

## Internal Spacing

Spacing inside a component (image-to-heading, heading-to-teaser inside a card) is NOT specified upfront. It's added only when the designer explicitly requests it during visual review.

```markdown
<!-- Internal spacing (image->heading, heading->teaser, content padding)
     is NOT specified yet. Add here only when the designer requests it. -->
```

This follows the emergent principle: don't design what hasn't been needed yet.

---

## Spacing in the Design System

Spacing objects go to the design system **immediately on first use** — unlike regular objects which extract on second use.

Why? Because spacing is relational. When you decide that a heading needs `space-xl` above a card grid, that's a universal design principle, not a page-specific detail.

The design system organizes patterns by spacing value:

```markdown
### v-space-3xl
| Above | Below | Why |
|-------|-------|-----|
| `trust-section` | `seasons-section` | Major section boundary |
| `seasons-section` | `site-footer` | Major section boundary |

### v-space-zero
| Above | Below | Why |
|-------|-------|-----|
| `site-header` | `service-menu` | One continuous nav unit |
| `service-menu` | `hero` | Flush below navigation |
```

As more pages are designed, each spacing value accumulates more situations. The pattern table grows from real decisions.

---

## How Many Spacing Objects Per Page?

On a typical homepage with 8 sections:

- **6 spacing objects** between sections
- **4 sections** with internal spacing properties (padding, grid gap)
- **10 total** spacing declarations

That's lean. One or two per section boundary. Not dozens.

---

## The Communication Pattern

Always use token names when discussing spacing:

```
BAD:  "Add 48 pixels above the footer"
GOOD: "Change hem-v-space-3xl to space-4xl above the footer"
```

This builds a shared vocabulary. Over time, the designer and developer both think in tokens.

---

## What's Next

In the next module, you'll learn how patterns emerge across pages and when to extract them into reusable components.

---

**[Continue to Lesson 5: Typography Tokens →](lesson-05-typography-tokens.md)**

---

[← Back to Lesson 3](lesson-03-element-state-specifications.md) | [Back to Module Overview](module-11-conceptual-specifications-overview.md)

*Part of Module 11: Conceptual Specifications*
