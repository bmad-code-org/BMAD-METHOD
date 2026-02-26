# Module 13: Design System

## Lesson 1: Understanding the Four Modes

**How component management affects your workflow**

---

## What Are Design System?

When you set up WDS, you chose a mode for handling design components.

This choice affects:
- How Freya works with you
- Where components are documented
- How visuals are generated
- What you deliver to developers

---

## The Four Modes

| Mode | Description | Best For |
|------|-------------|----------|
| **1. None** | No design system | Quick projects, one-offs |
| **2. Building** | System grows from work | First project for client |
| **3. Library** | External library + tokens | Using shadcn/Radix/MUI |
| **4. Existing** | Import from previous | Second+ project, same client |

Each mode has different implications for how you work.

---

## Mode 1: None

### What It Means

No formal design system. Styling is ad-hoc.

### How Freya Works

- Styles defined inline in page specifications
- No component extraction
- Each element is self-contained

### Example

```markdown
### Submit Button
- Type: Button
- Style: Blue background (#0066FF), white text, 14px rounded
- States: Default, Hover (darker), Loading (spinner), Disabled (gray)
- Label: "Create Free Account"
```

Everything is specified inline. No separate component document.

### Best For

- Landing pages
- Quick prototypes
- One-time projects
- Tight deadlines

### Trade-off

Consistency is manual. If you want the same button elsewhere, you copy-paste.

---

## Mode 2: Building

### What It Means

Design system grows organically from your work.

As you design, patterns emerge. When they appear 3+ times, you extract them as components.

### How Freya Works

She notices patterns:

> "This button appears in three specifications. Should we extract it as a component?"

You say yes → Goes into `C-UX-Scenarios/Functional-Components/`

### Example

After extraction:

```markdown
### Submit Button
- Component: Button (primary, lg)
- Label: "Create Free Account"
```

The component definition lives separately. Page specs reference it.

### The Evolution

```
Project 1: Mode 2 (Building)
    ↓
You create components
    ↓
Project 2: Mode 4 (Existing)
    ↓
You reuse what you built
```

Your work compounds. Each project builds on the last.

### Best For

- First project for new client
- Greenfield products
- When brand is still forming

---

## Mode 3: Component Library

### What It Means

Using an external library (shadcn, Radix, MUI, etc.) with your branding.

The library provides base components. You apply your tokens on top.

### How Freya Works

She references library components:

> "This matches shadcn's Button component. Use the default variant with primary color?"

### Example

```markdown
### Submit Button
- Component: shadcn/Button
- Variant: default
- Size: lg
- Class: Custom styles from tokens
- Label: "Create Free Account"
```

```yaml
# tokens/colors.yaml - Your brand applied to library
colors:
  primary: "#0066FF"  # Your blue
  destructive: "#DC2626"  # Your red
```

### Best For

- Speed to market
- Consistent base components
- Teams familiar with the library
- When you don't need custom patterns

### Trade-off

You get the library's patterns, not your own. Customization has limits.

---

## Mode 4: Existing

### What It Means

Import design system from a previous project.

You've built components before. Now you reuse them.

### How Freya Works

She loads your existing components:

> "You have a Button component from the Acme project. Use it here?"

You can extend with new variants:

```markdown
### Submit Button
- Component: Button
- Variant: "outline" (NEW)
```

### Best For

- Second+ project for same client
- Product families
- Brand consistency across projects

### The Power

Your work compounds. Each project starts with a foundation.

---

## Mode Selection Flow

```
New Project Setup
        ↓
Do you need reusable components?
        ↓
    No → Mode 1: None
        ↓
    Yes → Do you have an existing system?
              ↓
          Yes → Mode 4: Existing
              ↓
          No → External library or custom?
                    ↓
                External → Mode 3: Library
                    ↓
                Custom → Mode 2: Building
```

---

## Changing Modes

You can upgrade modes as projects evolve:

**Mode 1 → Mode 2**

Start with no system, extract components as patterns emerge.

**Mode 2 → Mode 4**

Complete first project, import system to second project.

**Mode 3 → Mode 2**

Start with library, add custom components as needs grow.

---

## What Each Mode Creates

| Mode | Output |
|------|--------|
| None | Inline styles only |
| Building | `D-Design-System/` folder grows |
| Library | `D-Design-System/tokens/` only |
| Existing | `D-Design-System/` extended |

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Building when Library works | Evaluate existing options first |
| None when project will grow | Anticipate future needs |
| Existing when brand changed | Start fresh with Building |
| Over-engineering early | Start None, upgrade later |

---

## What's Next

Understanding your mode helps you work with Freya effectively. In the tutorial, you'll review your mode choice and ensure you're using it correctly.

---

**[Continue to Tutorial: Apply Your Mode →](tutorial-13.md)**

---

[← Back to Module Overview](module-13-design-system-overview.md)

*Part of Module 13: Design System*
