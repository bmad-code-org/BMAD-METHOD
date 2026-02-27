# Module 11: Conceptual Specifications

## Lesson 5: Typography Tokens — Size Is Not Structure

**Decoupling visual size from semantic meaning**

---

## The Problem

Most design systems conflate two things:

- **Visual size** — how big text looks
- **Semantic level** — what the text means (H1, H2, H3, p)

This creates rigid rules like "H1 is always 48px" or "H2 is always 32px." But reality doesn't work that way.

A landing page H1 might be a serif display font at 56px italic.
An admin page H1 might be clean sans-serif at 20px medium.
A sidebar H2 might be 14px.

The semantic level is for accessibility and SEO. The visual token is for hierarchy.

---

## The WDS Approach

Two independent systems:

### Heading Scale (Visual Size)

| Token | Size | Weight | Example Use |
|-------|------|--------|-------------|
| `heading-xxs` | 14px | 700 | Smallest sub-headers |
| `heading-xs` | 16px | 700 | Minor headings, labels |
| `heading-sm` | 18px | 700 | Card sub-headings |
| `heading-md` | 20px | 800 | Card headings |
| `heading-lg` | 24px | 800 | Section sub-headers |
| `heading-xl` | 30px | 900 | Section headers |
| `heading-2xl` | 36px | 900 | Major section headers |
| `heading-3xl` | 44px | 900 | Hero headings (tablet) |
| `heading-4xl` | 56px | 900 | Hero headings (desktop) |

### Semantic Level (Document Structure)

`<h1>`, `<h2>`, `<h3>`, `<p>` — these define the document outline for accessibility and SEO.

### How They Combine

```html
<h2 class="text-heading-lg md:text-heading-xl lg:text-heading-2xl">
  Our Services
</h2>
```

This `<h2>` is `heading-lg` on mobile, `heading-xl` on tablet, `heading-2xl` on desktop. The semantic level stays H2 on all devices. The visual size adapts.

---

## The Responsive Scaling Rule

Step up one token size per breakpoint:

```
Mobile:  heading-lg   (24px)
Tablet:  heading-xl   (30px)
Desktop: heading-2xl  (36px)
```

In code:
```html
<h2 class="text-heading-lg md:text-heading-xl lg:text-heading-2xl">
```

In specifications:
```markdown
| Visual size | heading-lg / heading-xl / heading-2xl |
```

Always use token names — never arbitrary pixel values per breakpoint.

---

## Body Type Scale

The same principle applies to body text:

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `text-body` | 16px | 400 | Body text |
| `text-body-small` | 14px | 400 | Captions, metadata |
| `text-body-large` | 18px | 400 | Lead paragraphs |
| `text-label` | 14px | 600 | Labels, badges |
| `text-phone` | 24px | 700 | Phone number CTA |

---

## Why Tokens Beat Pixel Values

### 1. Single Point of Change

Bump `heading-xl` from 30px to 32px and every section header on the site adjusts. No hunting through files.

### 2. Shared Vocabulary

"Change the heading from `heading-lg` to `heading-xl`" is precise. "Make it bigger" is not.

### 3. Consistent Hierarchy

Tokens enforce a scale. You can't accidentally use 31px when the scale goes 30, 36, 44.

### 4. Responsive by Default

Each token has responsive variants built in. No reinventing breakpoint behavior per element.

---

## When Tokens Emerge

Don't create the full type scale before building any pages.

Build pages first. Notice that you keep using the same sizes. Extract the scale from real usage.

On the Kalla project, the heading scale emerged after the homepage was built and refined through browser review. The same heading sizes appeared 3+ times in different sections — that's when they became tokens.

---

## Specifying Typography in Page Specs

```markdown
### Section Heading

**OBJECT ID:** `hem-trust-heading`
**DS TYPE:** `section-heading`

| Property | Value |
|----------|-------|
| Tag | h2 |
| Visual size | heading-xl / heading-xl / heading-2xl |
| Font family | font-headline (Inter) |
| Font weight | 900 |
| Color | text-primary (#141414) |
```

Notice: the semantic tag (`h2`) and the visual size (`heading-xl`) are independent. The same component template can be used for an H2 on one page and an H3 on another.

---

## What's Next

You now understand the three invisible specification layers: spacing objects (Lesson 4), typography tokens (this lesson), and the dual-ID system that connects them to the design system (Module 12).

---

[← Back to Lesson 4](lesson-04-spacing-objects.md) | [Back to Module Overview](module-11-conceptual-specifications-overview.md)

*Part of Module 11: Conceptual Specifications*
