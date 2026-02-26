# Module 11: Conceptual Specifications

## Lesson 1: Page-Level Specifications

**Start with the big picture, then work down**

---

## The Hierarchy of Specification

Specifications work from large to small:

```
┌─────────────────────────────────────────────────┐
│ LAYER 1: PAGE                                   │  ← Start here
│ Purpose, Strategy, Context                      │
│  ┌───────────────────────────────────────────┐  │
│  │ LAYER 2: SECTION                          │  │
│  │ Major areas, placement, priority          │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │ LAYER 3: WIDGET                     │  │  │
│  │  │ Reusable components, states         │  │  │
│  │  │  ┌───────────────────────────────┐  │  │  │
│  │  │  │ LAYER 4: CARD                 │  │  │  │
│  │  │  │ Content grouping              │  │  │  │
│  │  │  │  ┌─────────┐  ┌─────────┐    │  │  │  │
│  │  │  │  │ LAYER 5 │  │ LAYER 5 │    │  │  │  │
│  │  │  │  │ ELEMENT │  │ ELEMENT │    │  │  │  │
│  │  │  │  └─────────┘  └─────────┘    │  │  │  │
│  │  │  └───────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

**You cannot specify a button until you understand the page.**

This lesson shows you how to specify each layer, from large to small.

---

## Layer 1: Page-Level Specification

The page is the container for everything. Specify it first.

### What to Specify

Every page specification must answer:

1. **Purpose** — What is this page trying to accomplish?
2. **Personas** — Who is this page for?
3. **Trigger Map Connection** — Which driving forces does it address?
4. **Layout Approach** — Mobile-first? Desktop-first? Responsive strategy?
5. **Accessibility Requirements** — WCAG level, keyboard navigation, screen reader support
6. **Performance Priorities** — What loads first? What can wait?
7. **SEO Requirements** — Meta descriptions, structured data, OG tags

### Page Specification Format

```markdown
# Page: [Page Name]
**ID:** [Page-ID]

## Purpose
[What this page accomplishes for the user]

## Personas Served
- [Persona Name]: [How this page serves them]

## Connects To
- Scenario: [Scenario ID]
- Trigger Map: [Driving Force quote]
- Feature: [Feature ID]

## Layout Strategy
- Primary Platform: [Mobile/Desktop]
- Responsive Approach: [Mobile-first/Desktop-first]
- Breakpoints: [List key breakpoints]

## Accessibility
- WCAG Level: [A/AA/AAA]
- Keyboard Navigation: [Full/Partial]
- Screen Reader: [Fully supported/Basic support]
- Focus Management: [How focus is managed on page load]

## Performance
- Priority Loading: [What loads first]
- Lazy Loading: [What loads on demand]
- Skeleton Screens: [Yes/No, where]

## SEO
- Title Tag: "[Exact title]"
- Meta Description: "[Exact description]"
- OG Tags: [Yes/No]
- Structured Data: [Schema type if applicable]

## Sections
[List of sections, detailed in Section-level specs]
```

### Example: Signup Page Specification

```markdown
# Page: Signup Page
**ID:** P01-signup-page

## Purpose
Enable Felix (persona) to create an account with minimal friction by
collecting only essential information (email + password) so he can start
trying the product immediately without lengthy onboarding.

## Personas Served
- Felix the Full-Stack: Wants to try before committing, fears complicated
  onboarding

## Connects To
- Scenario: S01-User-Registration
- Trigger Map: "I want to try this without jumping through hoops"
- Feature: F03-Quick-Signup

## Layout Strategy
- Primary Platform: Mobile
- Responsive Approach: Mobile-first
- Breakpoints: 640px (tablet), 1024px (desktop)

## Accessibility
- WCAG Level: AA
- Keyboard Navigation: Full (tab order: logo → form fields → CTA → footer links)
- Screen Reader: Fully supported
- Focus Management: Focus moves to email field on page load

## Performance
- Priority Loading: Header, hero section, form (critical path)
- Lazy Loading: Footer, testimonials (below fold)
- Skeleton Screens: No (page loads quickly, < 1s)

## SEO
- Title Tag: "Sign Up - Dog Week | Plan Your Week with Your Dog"
- Meta Description: "Create your free Dog Week account in 60 seconds.
  No credit card required. Start planning activities with your dog today."
- OG Tags: Yes (signup-og.jpg)
- Structured Data: None

## Sections
- S01: Header (Logo, Login link)
- S02: Hero (Value proposition, trust signals)
- S03: Form Area (Signup widget)
- S04: Footer (Legal links)
```

**Notice:** The page spec establishes context. We know WHO it's for (Felix), WHY it exists (minimal friction signup), and HOW it performs (mobile-first, AA accessibility).

Now we can specify sections.

---

## Layer 2: Section-Level Specification

Sections organize the page into major areas.

### What to Specify

For each section:

1. **Purpose** — Why this section exists
2. **Placement** — Where it appears on the page
3. **Behavior** — Responsive behavior, sticky, collapsible
4. **Load Priority** — When it loads relative to other sections
5. **Accessibility** — Landmark role, heading structure

### Section Specification Format

```markdown
## Section: [Section Name]
**ID:** [Page-ID]-[Section-ID]

### Purpose
[Why this section exists]

### Placement
- Position: [Header/Above fold/Below fold/Footer]
- Responsive: [How it adapts across breakpoints]

### Behavior
- Sticky: [Yes/No]
- Collapsible: [Yes/No]
- Animation: [Entry animation if any]

### Load Priority
[Critical/High/Normal/Low]

### Accessibility
- Landmark: [role="banner/main/navigation/contentinfo/complementary"]
- Heading: [h1/h2/h3 - what level starts this section]

### Contains
[List of widgets/cards in this section]
```

### Example: Hero Section Specification

```markdown
## Section: Hero Section
**ID:** P01-S02-hero-section

### Purpose
Communicate value proposition quickly to reduce Felix's hesitation and
make the benefit of signing up immediately clear.

### Placement
- Position: Above fold, immediately after header
- Responsive:
  - Mobile: Stacked vertically (headline → subtext → visual)
  - Tablet: Side-by-side (text left, visual right, 60/40 split)
  - Desktop: Same as tablet

### Behavior
- Sticky: No
- Collapsible: No
- Animation: Fade in on page load (300ms ease-in)

### Load Priority
Critical (above fold, visible immediately)

### Accessibility
- Landmark: role="main"
- Heading: h1 (main page headline)

### Contains
- W01: Value Proposition Widget (headline + subtext)
- No cards or complex widgets, just text + image
```

**Notice:** The section spec explains WHERE it appears and HOW it behaves. We haven't specified the exact content yet — that comes at the widget/element level.

---

## Layer 3: Widget-Level Specification

Widgets are reusable components that can appear in multiple places.

### What to Specify

For each widget:

1. **Reusability** — Where else does this widget appear?
2. **States** — All possible states (default, loading, error, etc.)
3. **Validation** — What rules apply?
4. **Accessibility** — ARIA patterns, keyboard interactions
5. **Content Structure** — What content slots does it have?

### Widget Specification Format

```markdown
## Widget: [Widget Name]
**ID:** [Page-ID]-[Section-ID]-[Widget-ID]

### Purpose
[What this widget accomplishes]

### Used In
- [List of pages/sections where this widget appears]

### States
- [State name]: [Description]

### Validation
[Validation rules if applicable]

### Accessibility
- ARIA Pattern: [Combobox/Dialog/Tabs/etc.]
- Keyboard: [Key interactions]
- Focus: [Focus management]

### Content Structure
[Slots or content areas]

### Elements
[List of child elements, detailed in Element-level specs]
```

### Example: Signup Form Widget

```markdown
## Widget: Signup Form
**ID:** P01-S03-W01-signup-form

### Purpose
Collect minimal information (email + password) to create account
with real-time validation to prevent submission errors.

### Used In
- P01-signup-page (Section S03)
- Modal signup (when triggered from marketing pages)
- Embedded signup (partner sites)

### States
- Default: Empty form, submit button enabled
- Filling: Real-time validation as user types
- Validating: Check email availability (async)
- Invalid: Error messages shown, submit disabled
- Submitting: Loading state, form locked
- Success: Confirmation message, redirect after 1.5s
- Error: Server error message, form re-enabled

### Validation
- Email: Valid format, check availability against database
- Password: Minimum 8 characters, show strength indicator

### Accessibility
- ARIA Pattern: Form with live regions for validation
- Keyboard: Tab order: email → password → show password toggle → submit
- Focus: On error, focus moves to first invalid field
- Screen Reader: Error messages announced via aria-live="assertive"

### Content Structure
- Form heading slot
- Email field slot
- Password field slot
- Submit button slot
- Error message slot
- Terms acceptance slot

### Elements
- E01: Email Field
- E02: Password Field
- E03: Show Password Toggle
- E04: Password Strength Indicator
- E05: Submit Button
- E06: Terms Link
```

**Notice:** The widget spec defines WHAT it does and WHERE it's used. It's specified once but can be reused anywhere. States and validation rules are explicit.

---

## Layer 4: Card-Level Specification

Cards group related content into repeatable patterns.

### What to Specify

For each card:

1. **Content Pattern** — What information does it display?
2. **Data Structure** — What data feeds into it?
3. **Repetition** — How many instances appear?
4. **Interaction** — Is it clickable? Expandable?

### Card Specification Format

```markdown
## Card: [Card Name]
**ID:** [Page-ID]-[Section-ID]-[Card-ID]

### Purpose
[What this card displays]

### Data Structure
[What data it receives]

### Instances
[How many appear, or is it a template]

### Interaction
[Clickable/Static/Expandable]

### Elements
[List of elements within the card]
```

### Example: Feature Card

```markdown
## Card: Feature Card
**ID:** P01-S04-C01-feature-card

### Purpose
Display one product feature with icon, title, and description to
build trust before signup.

### Data Structure
```json
{
  "icon": "string (icon name)",
  "title": "string",
  "description": "string (max 120 chars)"
}
```

### Instances
Template card, rendered 3 times with different data

### Interaction
Static (not clickable)

### Elements
- E01: Feature Icon
- E02: Feature Title
- E03: Feature Description
```

**Notice:** Cards define the PATTERN for grouped content. The data structure shows what feeds into each instance.

---

## Layer 5: Element-Level Specification

Elements are the smallest specifiable units: buttons, fields, icons, labels.

### What to Specify

For each element:

1. **All States** — Every possible state it can be in
2. **Content** — Exact text (not lorem ipsum)
3. **ARIA Attributes** — Specific accessibility properties
4. **Behavior** — What happens on interaction
5. **Translations** — Content in all supported languages

### Element Specification Format

```markdown
## Element: [Element Name]
**ID:** [Full-Hierarchy-ID]

### Type
[Button/Input/Icon/Label/Link]

### States
- Default: [Description]
- [Other states]: [Description]

### Content
- Label: "[Exact text]"
- Translations:
  - ES: "[Spanish text]"
  - DE: "[German text]"

### ARIA
- role: "[Role]"
- aria-label: "[Label]"
- aria-required: "[true/false]"
- [Other ARIA attributes]

### Behavior
[What happens when user interacts]
```

### Example: Email Field Element

```markdown
## Element: Email Field
**ID:** P01-S03-W01-E01-email-field

### Type
Text input (email)

### States
- Default: Empty, placeholder visible
- Focused: Border highlight, placeholder fades
- Typing: Real-time format validation
- Valid: Green checkmark appears
- Invalid: Red border, error message below
- Disabled: Grayed out (during submission)

### Content
- Label: "Email"
- Placeholder: "you@company.com"
- Error Message (invalid format): "Please enter a valid email address"
- Error Message (taken): "This email is already registered. [Log in instead →]"
- Translations:
  - ES:
    - Label: "Correo electrónico"
    - Placeholder: "tu@empresa.com"
    - Error (invalid): "Por favor, introduce una dirección de correo válida"
    - Error (taken): "Este correo ya está registrado. [Iniciar sesión →]"

### ARIA
- role: "textbox"
- aria-label: "Email address for your account"
- aria-required: "true"
- aria-invalid: "false" (default) → "true" (when error)
- aria-describedby: "email-error" (when error message shown)

### Behavior
- On focus: Placeholder fades to 50% opacity
- On blur: Validate email format
- On change (after 1s delay): Check email availability (async)
- On error: Focus remains in field, error announced to screen reader
```

**Notice:** The element spec is COMPLETE. A developer can build this exactly from the specification without asking questions.

---

## The Pattern

Working from large to small ensures:

```
Page establishes:     → WHY this exists, WHO it's for
  ↓
Sections establish:   → WHERE things appear, WHEN they load
  ↓
Widgets establish:    → WHAT can be reused, HOW it validates
  ↓
Cards establish:      → PATTERN for grouped content
  ↓
Elements establish:   → EXACT implementation details
```

**You cannot specify an element without understanding the widget.**
**You cannot specify a widget without understanding the section.**
**You cannot specify a section without understanding the page.**

---

## IDs Connect the Hierarchy

```
P01-signup-page
│
├── P01-S01-header-section
│   └── P01-S01-W01-logo-link
│       └── P01-S01-W01-E01-logo-image
│
├── P01-S02-hero-section
│   └── P01-S02-W01-value-prop-widget
│       ├── P01-S02-W01-E01-headline
│       └── P01-S02-W01-E02-subtext
│
├── P01-S03-form-section
│   └── P01-S03-W01-signup-form
│       ├── P01-S03-W01-E01-email-field
│       ├── P01-S03-W01-E02-password-field
│       ├── P01-S03-W01-E03-show-password-toggle
│       ├── P01-S03-W01-E04-strength-indicator
│       └── P01-S03-W01-E05-submit-button
│
└── P01-S04-footer-section
    ├── P01-S04-W01-legal-links
    └── P01-S04-C01-feature-card (template, 3 instances)
        ├── P01-S04-C01-E01-icon
        ├── P01-S04-C01-E02-title
        └── P01-S04-C01-E03-description
```

Every ID traces from page to element. This is your implementation map.

---

## Completeness Test

Your specification is complete when:

✅ A developer can build the page without asking questions
✅ A translator can extract all content and know where it appears
✅ A tester can verify every state in every element
✅ An accessibility auditor can validate all ARIA attributes
✅ A designer returning 6 months later can understand every decision

**If any role needs to guess, the spec is incomplete.**

---

## Common Mistakes

| Mistake | Why It Fails | Fix |
|---------|--------------|-----|
| Starting with buttons | No context for decisions | Start with page purpose |
| Skipping sections | Don't know where widgets appear | Always specify section first |
| Forgetting states | Bugs in edge cases | Document all states |
| Lorem ipsum content | Can't plan for translations | Write real copy |
| No IDs | Can't trace to implementation | ID everything from page to element |

---

## What's Next

In Lesson 2, you'll learn how to specify sections and widgets in detail, including advanced patterns for complex components.

In Lesson 3, you'll learn how to specify elements and states completely, covering all edge cases and accessibility requirements.

---

**[Continue to Lesson 2: Section & Widget Specifications →](lesson-02-section-widget-specifications.md)**

---

[← Back to Module Overview](module-11-conceptual-specifications-overview.md)

*Part of Module 11: Conceptual Specifications*
