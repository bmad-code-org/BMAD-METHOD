# Module 11: Conceptual Specifications

**Time: 60 min | Agent: Freya | Phase: Design | Focus: UX**

---

## Every Decision Documented

This is where design becomes specification.

This is the core of WDS.

**Specifications are the new code.**

In an AI-powered world, well-structured specifications get transformed into working software. The clearer and more complete your specifications, the better the code that gets generated from them.

WDS specifications provide what sketches and mockups cannot:

- **[Unique IDs](#ids-are-the-key)** — Every object traceable from spec to code to test
- **[Real Content](#why-content-isnt-lorem-ipsum)** — Actual copy with translations ready
- **[Functional Objects](#design-system-terminology)** — Reusable components identified and specified
- **[The Invisible Layer](#multiple-dimensions)** — SEO, accessibility, performance, analytics
- **[Strategic Context](#why-start-with-page-purpose)** — Every decision connected to user needs
- **[Complete Behavior](#why-elements-need-states)** — All states, all interactions, all edge cases

**Sketches show what you see. Specifications define what gets built.**

---

## Why Specifications Matter

A sketch can be interpreted 10 different ways.

A specification has one meaning.

When you specify, you decide:
- No ambiguity
- No guessing
- No "I thought you meant..."
- No developer questions
- No implementation drift

**If they need to ask, your spec is incomplete.**


 
---

## The Hierarchy

Specifications work from big to small:

```
┌─────────────────────────────────────────────────┐
│ PAGE                                            │
│ Purpose, Layout, Accessibility                  │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │ SECTION                                   │  │
│  │ Purpose, Placement, Behavior              │  │
│  │                                           │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │ WIDGET                              │  │  │
│  │  │ Reusable component, States          │  │  │
│  │  │                                     │  │  │
│  │  │  ┌───────────────────────────────┐  │  │  │
│  │  │  │ CARD                          │  │  │  │
│  │  │  │ Content grouping              │  │  │  │
│  │  │  │                               │  │  │  │
│  │  │  │  ┌─────────┐  ┌─────────┐    │  │  │  │
│  │  │  │  │ BUTTON  │  │  FIELD  │    │  │  │  │
│  │  │  │  └─────────┘  └─────────┘    │  │  │  │
│  │  │  │  Individual elements          │  │  │  │
│  │  │  └───────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

**You don't specify a button until you understand the page.**

---

## Design System Terminology

Specifications use consistent terminology:

| Term | What It Means | Example |
|------|---------------|---------|
| **Page** | Complete view in scenario | Signup page, Dashboard |
| **Section** | Major area of page | Header, Hero, Form area, Footer |
| **Widget** | Reusable component | Navigation bar, User menu, Search box |
| **Card** | Grouped content container | Profile card, Feature card, Stat card |
| **Element** | Individual UI piece | Button, Input field, Icon, Label |

**Use these terms consistently across all specifications.**

---

## IDs Are the Key

Every object has two IDs:

1. **Instance ID** — unique on the page: `hem-trust-cards:pos-1`
2. **DS Type** — defined in the design system: `article-card`

The Instance ID tells you WHERE this specific object is. The DS Type tells you WHAT kind of object it is.

```markdown
### Trust Card 1

**OBJECT ID:** `hem-trust-cards:pos-1`
**DS TYPE:** `article-card`
```

### Positional IDs for Lists

When a page has multiple instances of the same component, use positional identifiers:

```
hem-trust-cards:pos-1
hem-trust-cards:pos-2
hem-trust-cards:pos-3
```

Child elements use colon-separated hierarchy:

```
hem-trust-cards:pos-1:image
hem-trust-cards:pos-1:heading
hem-trust-cards:pos-1:teaser
```

Use positional IDs (`pos-1`, `pos-2`) instead of semantic names when content order can change dynamically.

**Why IDs matter:**

1. **Traceability** — From spec → code → test
2. **Maintenance** — Find exactly what needs updating
3. **Translation** — Map content to language files
4. **Accessibility** — Reference specific elements for ARIA
5. **Analytics** — Track interactions precisely
6. **Testing** — Target elements for automation
7. **Design System** — Link page instances to reusable types

**Without IDs, specifications are just documentation. With IDs, they're implementation maps.**

---

## Multiple Dimensions

Every specification addresses:

### 1. Structure & Behavior
What appears, what happens, what changes

### 2. Content & Copy
Actual text, not placeholders, in all languages

### 3. Accessibility
Screen reader labels, keyboard navigation, focus management

### 4. Internationalization
Text expansion, RTL support, locale formats

### 5. Performance
Loading priorities, lazy loading, skeleton screens

**A complete specification covers all dimensions.**

---

## Why Start with Page Purpose

Before you specify anything, answer:

**What is this page trying to accomplish?**

```
BAD:
"This is the signup page."

GOOD:
"This page lets Felix (persona) create an account with
minimal friction (driving force) by asking only for
essential information (email + password) so he can
start trying the product immediately."
```

**Purpose connects specification to strategy.**

Every element on the page must serve this purpose. If it doesn't, it shouldn't be there.

---

## Why Section Structure Matters

Sections organize the page:

```
Signup Page Sections:
┌─────────────────────────────────────┐
│ S01: Header (Logo, Login link)     │
├─────────────────────────────────────┤
│ S02: Hero (Value prop)             │
├─────────────────────────────────────┤
│ S03: Form Area (Signup widget)     │
├─────────────────────────────────────┤
│ S04: Trust Signals (Testimonials)  │
├─────────────────────────────────────┤
│ S05: Footer (Legal links)          │
└─────────────────────────────────────┘
```

**Each section has:**
- Purpose (why it exists)
- Placement (where it appears)
- Behavior (responsive, sticky, collapsible)
- Priority (load order, importance)

**Sections before widgets. Structure before details.**

---

## Why Widgets Are Reusable

A widget is a component that appears in multiple places:

```
signup-form widget:
- Used on: Signup page, Modal signup, Embedded signup
- Same behavior everywhere
- Same validation everywhere
- Specify once, use many times
```

**Widgets enforce consistency.**

---

## Why Cards Group Content

Cards contain related information:

```
feature-card:
┌───────────────────┐
│ [Icon]            │
│ Feature Title     │
│ Description here  │
│ [Learn More →]    │
└───────────────────┘
```

**Cards make content scannable and repeatable.**

---

## Why Elements Need States

An element isn't just one thing. It transforms:

```
Button States:
Default  → Hover → Active → Loading → Success → Error
                                    → Disabled

Each state needs:
- Visual appearance
- Behavior
- Accessibility label
- Content (if changes)
```

**Incomplete state specifications = bugs.**

---

## Why Content Isn't Lorem Ipsum

Actual copy affects design:

```
BAD:
Button: "Lorem ipsum"

GOOD:
Button: "Create Free Account"
Translation (ES): "Crear Cuenta Gratuita"
Translation (DE): "Kostenloses Konto erstellen"
```

**Real content reveals:**
- Length constraints
- Wrapping issues
- Translation expansion
- Tone and voice

**Write real copy in specifications.**

---

## Why Accessibility Isn't Optional

Every element needs:

```
email-field:
- Label: "Email" (visible)
- aria-label: "Email address for your account"
- aria-required: "true"
- aria-invalid: "false" (default) → "true" (on error)
- aria-describedby: "email-error" (when error shown)
```

**Accessibility is part of the specification, not added later.**

---

## Why Translations Matter Early

Content expands in translation:

```
English:  "Sign up" (7 chars)
German:   "Registrieren" (13 chars)
Finnish:  "Rekisteröidy" (13 chars)

English:  "Delete account" (14 chars)
German:   "Konto löschen" (13 chars)
Russian:  "Удалить аккаунт" (15 chars)
```

**Design for expansion. Specify content constraints.**

---

## The Specification Layers

```
Layer 1: PAGE LEVEL
- Purpose
- Personas served
- Trigger Map connections
- Layout approach (mobile-first, responsive)
- Accessibility requirements
- Performance priorities

Layer 2: SECTION LEVEL
- Purpose of each section
- Placement and hierarchy
- Responsive behavior
- Load priority

Layer 3: WIDGET LEVEL
- Reusable components
- States and interactions
- Validation rules
- Accessibility patterns

Layer 4: CARD LEVEL
- Content grouping
- Repeatable patterns
- Data structure

Layer 5: ELEMENT LEVEL
- Individual buttons, fields, icons
- States, content, behavior
- Specific ARIA attributes
```

**Start at Layer 1. Work down to Layer 5.**

**The lessons teach HOW to specify each layer.**

---

## The Completeness Test

Your specification is complete when:

✅ A developer can build it without asking questions
✅ A translator can extract all content
✅ A tester can verify every state
✅ An accessibility auditor can validate ARIA
✅ A designer can maintain it 6 months later

**If any role needs to guess, the spec is incomplete.**

---

## Common Mistakes

| Mistake | Why It Fails | Fix |
|---------|--------------|-----|
| Starting with buttons | No context for decisions | Start with page purpose |
| Lorem ipsum content | Can't plan for translations | Write real copy |
| Missing states | Bugs in edge cases | Document all states |
| No IDs | Can't trace implementation | ID everything |
| Vague descriptions | Multiple interpretations | Be specific |
| Skipping accessibility | Fails audits | Specify ARIA from start |

---

## Output Structure

```
C-UX-Scenarios/
└── S01-User-Registration/
    ├── scenario-overview.md
    ├── pages/
    │   ├── P01-signup-page.md       ← Complete page spec
    │   └── P02-welcome-screen.md
    ├── widgets/
    │   ├── W01-signup-form.md       ← Reusable component
    │   └── W02-header-nav.md
    └── content/
        ├── copy-en.md               ← English content
        ├── copy-es.md               ← Spanish content
        └── copy-de.md               ← German content
```

**Organized by hierarchy, not by feature.**

---

## What You'll Learn

**Lesson 1: Hierarchical Specification**
Learn the 5-layer pattern (Page → Section → Widget → Card → Element) and how to work from large to small

**Lesson 2: Section & Widget Specifications**
Deep dive on specifying sections (placement, responsive behavior) and widgets (reusability, states, validation)

**Lesson 3: Element & State Specifications**
Complete element specifications with all states, exact content, ARIA attributes, edge cases, and translations

**Lesson 4: Spacing as First-Class Objects**
Every gap between sections gets an ID, a type, and a value — the invisible layer that holds everything together

**Lesson 5: Typography Tokens — Size Is Not Structure**
Decouple visual size from semantic meaning. An H2 can be `heading-xl` on the homepage and `heading-sm` in a sidebar.

**Tutorial: Specify Your Pages**
Hands-on practice with Freya creating complete specifications

---

## The Freya Method

Freya ensures completeness:

> "You specified the page purpose, but which persona is this for?"
> "This section appears on mobile — what's the responsive behavior?"
> "Your button has a default state but no disabled state. When is it disabled?"
> "This error message is in English. What about Spanish users?"
> "Where's the ID for this widget? How will developers reference it?"

**She won't let you ship incomplete specs.**

---

## Lessons

### [Lesson 1: Page-Level Specifications](lesson-01-design-is-specification.md)
Start with the big picture, then work down

### [Lesson 2: Section & Widget Specifications](lesson-02-section-widget-specifications.md)
Deep dive on Layers 2 & 3 of the hierarchy

### [Lesson 3: Element & State Specifications](lesson-03-element-state-specifications.md)
Deep dive on Layers 4 & 5 — Complete implementation details

### [Lesson 4: Spacing as First-Class Objects](lesson-04-spacing-objects.md)
The invisible layer — every gap gets an ID, a type, and a value

### [Lesson 5: Typography Tokens — Size Is Not Structure](lesson-05-typography-tokens.md)
Decouple visual size from semantic meaning

---

## Tutorial

### [Tutorial 11: Write Your Specifications](tutorial-11.md)
Hands-on guide to creating complete page specifications with Freya

---

## Next Module

**[Module 12: Functional Components →](../module-12-functional-components/module-12-functional-components-overview.md)**

Time to identify reusable patterns across your specifications.

---

*Part of the WDS Course: From Designer to Linchpin*
