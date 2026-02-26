# Module 12: Functional Components

## Lesson 2: Functional Component Anatomy

**How to document Functional Components completely**

---

## The Functional Component Template

Every Functional Component follows this structure:

```markdown
## [Component Name]

### Description
What this Functional Component is and when to use it.

### Variants
Different visual styles.

### States
Behavioral states.

### Props
Configurable options.

### Usage Rules
When and how to use it correctly.

### Accessibility
Keyboard, screen reader, and focus requirements.
```

### Component Structure Visualized

```
┌──────────────────────────────────────────────────────────────┐
│                FUNCTIONAL COMPONENT DEFINITION                │
│      (weather-widget.md in C-UX-Scenarios/Functional-Components/)  │
└──────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ↓                     ↓                     ↓
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ WHAT         │    │ HOW          │    │ WHEN         │
│ Description  │    │ Variants     │    │ Usage Rules  │
│              │    │ States       │    │              │
│ Purpose &    │    │ Props        │    │ DO/DON'T     │
│ use cases    │    │              │    │ guidelines   │
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ↓
                    ┌──────────────────┐
                    │ WHO              │
                    │ Accessibility    │
                    │                  │
                    │ Screen readers,  │
                    │ keyboard, ARIA   │
                    └──────────────────┘
                              │
                              ↓
        ╔═══════════════════════════════════════════╗
        ║      COMPLETE FUNCTIONAL COMPONENT        ║
        ║                                           ║
        ║  Ready to be referenced by page specs    ║
        ║  All behavior defined, no ambiguity      ║
        ╚═══════════════════════════════════════════╝
                              │
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Page 1       │    │ Page 2       │    │ Page 3       │
│ Instance A   │    │ Instance B   │    │ Instance C   │
│              │    │              │    │              │
│ Button       │    │ Button       │    │ Button       │
│ (primary,lg) │    │ (secondary)  │    │ (primary,md) │
└──────────────┘    └──────────────┘    └──────────────┘
```

**Each section serves a purpose:** Description explains WHY, Variants/States/Props explain HOW, Usage Rules explain WHEN, Accessibility explains WHO can use it.

---

## Section: Description

One paragraph explaining what the Functional Component is and its purpose.

```markdown
### Description
Primary action trigger used throughout the application.
Communicates importance through visual weight and draws
user attention to key actions.
```

Keep it concise. This is the "why this exists" summary.

---

## Section: Variants

Different visual styles for different purposes.

```markdown
### Variants

| Variant | Use Case | Visual |
|---------|----------|--------|
| Primary | Main action on page | Blue bg, white text |
| Secondary | Alternative action | White bg, blue border |
| Ghost | Tertiary action | Transparent, text only |
| Danger | Destructive action | Red bg, white text |
```

**Rule:** One primary action per screen. Everything else is secondary or lower.

---

## Section: States

How the Functional Component looks in different conditions.

```markdown
### States

| State | Trigger | Visual Change |
|-------|---------|---------------|
| Default | Initial load | Standard appearance |
| Hover | Mouse over | Slight darkening, shadow |
| Active | Mouse down | Pressed appearance (scale 98%) |
| Focused | Keyboard focus | Blue outline, 2px offset |
| Disabled | disabled=true | Grayed out, no interactions |
| Loading | loading=true | Spinner replaces text |
```

Include the trigger (what causes this state) and the visual change.

---

## Section: Props

Configurable options for instances.

```markdown
### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | string | "primary" | Visual style: primary, secondary, ghost, danger |
| size | string | "md" | Size: sm (32px), md (40px), lg (48px) |
| disabled | boolean | false | Disables interaction |
| loading | boolean | false | Shows loading spinner |
| icon | node | null | Optional leading icon |
| iconPosition | string | "left" | Icon position: left, right |
| fullWidth | boolean | false | Spans full container width |
| type | string | "button" | HTML type: button, submit, reset |
```

**Important:** Specify the exact values, not just the types.

---

## Section: Usage Rules

When and how to use the Functional Component correctly.

```markdown
### Usage Rules

**DO:**
- Use primary variant for the main action on each screen
- Always include text label (icon optional)
- Ensure minimum touch target of 44px
- Use loading state during async operations
- Position primary action prominently

**DON'T:**
- Use multiple primary buttons on one screen
- Use icon-only buttons without aria-label
- Disable buttons without explanation
- Use ghost variant for primary actions
- Mix variants in a single button group
```

These rules prevent misuse.

---

## Section: Accessibility

Requirements for keyboard, screen reader, and focus management.

```markdown
### Accessibility

**Semantic:**
- Element: `<button>` (or `<a>` if navigating)
- Role: Implicit from element

**Keyboard:**
- Focusable: Yes (when not disabled)
- Activation: Enter or Space
- Focus visible: 2px blue outline with 2px offset

**Screen Reader:**
- Announces: "[label], button"
- Loading: aria-busy="true", announce "Loading"
- Disabled: aria-disabled="true", announce "disabled"

**ARIA (when needed):**
- Icon-only: aria-label="[action description]"
- Opens dialog: aria-haspopup="dialog"
- Expanded state: aria-expanded="true/false"
```

---

## Complete Example: Button Component

```markdown
# Button Component

## Description
Primary action trigger used throughout the application.
Communicates importance through visual weight and guides
users toward key actions.

## Variants

| Variant | Use Case | Visual |
|---------|----------|--------|
| Primary | Main page action | Blue bg (#0066FF), white text |
| Secondary | Alternative action | White bg, blue border |
| Ghost | Tertiary/inline action | Transparent, blue text |
| Danger | Destructive action | Red bg (#DC2626), white text |

## States

| State | Trigger | Visual |
|-------|---------|--------|
| Default | Initial | Standard appearance |
| Hover | Mouse over | 10% darker, subtle shadow |
| Active | Mouse down | Scale 98%, darker still |
| Focused | Keyboard | Blue 2px outline |
| Disabled | prop | 50% opacity, cursor not-allowed |
| Loading | prop | Spinner replaces text |

## Props

| Prop | Type | Default | Options |
|------|------|---------|---------|
| variant | string | "primary" | primary, secondary, ghost, danger |
| size | string | "md" | sm (32px), md (40px), lg (48px) |
| disabled | boolean | false | |
| loading | boolean | false | |
| icon | node | null | Any icon Functional Component |
| iconPosition | string | "left" | left, right |
| fullWidth | boolean | false | |

## Usage Rules

**One primary per screen.** Secondary and ghost for other actions.

**Always has text.** Icon-only requires aria-label.

**Loading replaces text.** Button stays same size.

**Touch target: 44px minimum.** Even if visually smaller.

## Accessibility

- Element: `<button type="button">`
- Keyboard: Enter/Space activates
- Focus: Visible blue outline
- Loading: aria-busy="true"
- Disabled: aria-disabled="true"
- Icon-only: aria-label required
```

---

## The Freya Method

Freya notices patterns as you specify:

> "This is the third time you've specified a card with image, title, and description. Should we extract it as a Functional Component?"

> "Your submit buttons are inconsistent — some say 'Submit', others say 'Save'. Should we standardize?"

She helps you see what's becoming a pattern before you realize it.

---

## File Organization

```
C-UX-Scenarios/Functional-Components/
├── Functional Components/
│   ├── button.md
│   ├── input.md
│   ├── card.md
│   ├── modal.md
│   └── toast.md
├── tokens/
│   ├── colors.yaml
│   ├── typography.yaml
│   └── spacing.yaml
└── patterns/
    ├── form-layout.md
    └── page-structure.md
```

Components go in `Functional Components/`. Design tokens (colors, fonts, spacing) go in `tokens/`.

---

## What's Next

In the tutorial, you'll identify Functional Components from your existing specifications and document them using this anatomy.

---

**[Continue to Tutorial: Extract Your Components →](tutorial-12.md)**

---

[← Back to Lesson 1](lesson-01-patterns-emerge.md) | [Back to Module Overview](module-12-functional-components-overview.md)

*Part of Module 12: Functional Components*
