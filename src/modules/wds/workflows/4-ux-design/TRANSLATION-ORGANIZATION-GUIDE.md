# Translation Organization Guide

**Part of WDS Specification Pattern**

**Purpose-Based Naming with Grouped Translations**

---

## Overview

This guide explains how to organize text content and translations in WDS specifications using **purpose-based naming** and **grouped translation** patterns.

**Related Documentation:**

- **`SKETCH-TEXT-ANALYSIS-GUIDE.md`** - How to analyze text markers in sketches
- **`HTML-VS-VISUAL-STYLES.md`** - HTML tags vs visual text styles
- **`WDS-SPECIFICATION-PATTERN.md`** - Complete specification format with examples

---

## Core Principles

### 1. Name by PURPOSE, Not Content

**❌ WRONG:**

```markdown
#### Welcome Heading

**OBJECT ID**: `start-hero-welcome-heading`

- Content: "Welcome to Dog Week"
```

**✅ CORRECT:**

```markdown
#### Primary Headline

**OBJECT ID**: `start-hero-headline`

- Content:
  - EN: "Welcome to Dog Week"
  - SE: "Välkommen till Dog Week"
```

**Why:** If content changes to "Every walk. on time.", the Object ID still makes sense.

---

### 2. Separate Structure from Content

**Structure (Position/Style):**

```markdown
- **HTML Tag**: h1 (semantic structure for SEO/accessibility)
- **Visual Style**: Hero headline (from Design System)
- **Position**: Center of hero section, above CTA
- **Style**:
  - Font weight: Bold (from 3px thick line markers)
  - Font size: 42px (est. from 24px spacing between line pairs)
  - Line-height: 1.2 (est. calculated from font size)
- **Behavior**: Updates with language toggle
```

> **Important:** HTML tags (h1-h6) define semantic structure for SEO/accessibility. Visual styles (Hero headline, Main header, Sub header, etc.) define appearance and can be applied to any HTML tag.

> **Note:** Values marked `(est. from...)` show sketch analysis reasoning. Designer should confirm or adjust these values, then update with actual specifications.

````

**Content (Translations):**
```markdown
- **Content**:
  - EN: "Every walk. on time. Every time."
  - SE: "Varje promenad. i tid. Varje gång."
````

**Why:** Structure rarely changes, content often does. Keeps specs clean.

---

### 3. Group Related Translations

**❌ WRONG (Scattered):**

```markdown
#### Headline EN

"Every walk. on time."

#### Headline SE

"Varje promenad. i tid."

#### Body EN

"Organize your family..."

#### Body SE

"Organisera din familj..."
```

**✅ CORRECT (Grouped):**

```markdown
### Hero Object

**Purpose**: Primary value proposition

#### Primary Headline

**OBJECT ID**: `start-hero-headline`

- **Content**:
  - EN: "Every walk. on time. Every time."
  - SE: "Varje promenad. i tid. Varje gång."

#### Supporting Text

**OBJECT ID**: `start-hero-supporting`

- **Content**:
  - EN: "Organize your family around dog care."
  - SE: "Organisera din familj kring hundvård."
```

**Why:** Each language reads as complete, coherent message.

---

## Dog Week Examples

### Example 1: Hero Section (Text Group)

```markdown
### Hero Object

**Purpose**: Primary value proposition and main conversion action

#### Primary Headline

**OBJECT ID**: `start-hero-headline`

- **Component**: H1 heading (`.text-heading-1`)
- **Position**: Center of hero, top of section
- **Style**: Bold, no italic, 42px, line-height 1.2
- **Behavior**: Updates with language toggle
- **Content**:
  - EN: "Every walk. on time. Every time."
  - SE: "Varje promenad. i tid. Varje gång."

#### Supporting Text

**OBJECT ID**: `start-hero-supporting`

- **Component**: Body text (`.text-body`)
- **Position**: Below headline, above CTA
- **Style**: Regular, 16px, line-height 1.5
- **Behavior**: Updates with language toggle
- **Content**:
  - EN: "Organize your family around dog care. Never miss a walk again."
  - SE: "Organisera din familj kring hundvård. Missa aldrig en promenad igen."

#### Primary CTA Button

**OBJECT ID**: `start-hero-cta`

- **Component**: [Button Primary Large](/docs/D-Design-System/.../Button-Primary.md)
- **Position**: Center, below supporting text
- **Behavior**: Navigate to registration
- **Content**:
  - EN: "start planning - free forever"
  - SE: "börja planera - gratis för alltid"
```

**Reading Experience:**

**English:**

> Every walk. on time. Every time.
> Organize your family around dog care. Never miss a walk again.
> [start planning - free forever]

**Swedish:**

> Varje promenad. i tid. Varje gång.
> Organisera din familj kring hundvård. Missa aldrig en promenad igen.
> [börja planera - gratis för alltid]

Each language flows naturally as a complete message!

---

### Example 2: Form Labels (Individual Elements)

```markdown
### Sign In Form

**Purpose**: User authentication

#### Email Label

**OBJECT ID**: `signin-form-email-label`

- **Component**: Label text (`.text-label`)
- **Position**: Above email input field
- **For**: `signin-form-email-input`
- **Content**:
  - EN: "Email Address"
  - SE: "E-postadress"

#### Email Input

**OBJECT ID**: `signin-form-email-input`

- **Component**: [Text Input](/docs/.../text-input.md)
- **Placeholder**:
  - EN: "your@email.com"
  - SE: "din@epost.com"

#### Password Label

**OBJECT ID**: `signin-form-password-label`

- **Component**: Label text (`.text-label`)
- **Position**: Above password input
- **For**: `signin-form-password-input`
- **Content**:
  - EN: "Password"
  - SE: "Lösenord"

#### Password Input

**OBJECT ID**: `signin-form-password-input`

- **Component**: [Password Input](/docs/.../password-input.md)
- **Placeholder**:
  - EN: "Enter your password"
  - SE: "Ange ditt lösenord"
```

---

### Example 3: Error Messages

```markdown
### Validation Messages

**Purpose**: User feedback on form errors

#### Email Required Error

**OBJECT ID**: `signin-form-email-error-required`

- **Component**: Error text (`.text-error`)
- **Position**: Below email input field
- **Trigger**: When email field is empty on submit
- **Content**:
  - EN: "Email address is required"
  - SE: "E-postadress krävs"

#### Email Invalid Error

**OBJECT ID**: `signin-form-email-error-invalid`

- **Component**: Error text (`.text-error`)
- **Position**: Below email input field
- **Trigger**: When email format is invalid
- **Content**:
  - EN: "Please enter a valid email address"
  - SE: "Ange en giltig e-postadress"

#### Auth Failed Error

**OBJECT ID**: `signin-form-auth-error`

- **Component**: Alert banner (`.alert-error`)
- **Position**: Above form, below page heading
- **Trigger**: When authentication fails
- **Content**:
  - EN: "Invalid email or password. Please try again."
  - SE: "Ogiltig e-post eller lösenord. Försök igen."
```

---

## Object ID Naming Patterns

### Format: `{page}-{section}-{purpose}`

**Page Examples:**

- `start` (start/landing page)
- `signin` (sign in page)
- `profile` (profile page)
- `calendar` (calendar page)

**Section Examples:**

- `hero` (hero section)
- `header` (page header)
- `form` (form section)
- `features` (features section)
- `footer` (page footer)

**Purpose Examples:**

- `headline` (main heading)
- `subheading` (secondary heading)
- `description` (descriptive text)
- `cta` (call-to-action button)
- `label` (form label)
- `error` (error message)
- `success` (success message)
- `supporting` (supporting/helper text)

**Complete Examples:**

- `start-hero-headline`
- `signin-form-email-label`
- `profile-success-message`
- `calendar-header-title`
- `features-description-text`

---

## Content Structure

### Required Fields

```markdown
#### {{Purpose_Title}}

**OBJECT ID**: `{{page-section-purpose}}`

- **Component**: {{component_type}} ({{class_or_reference}})
- **Position**: {{position_description}}
- **Content**:
  - EN: "{{english_content}}"
  - SE: "{{swedish_content}}"
    {{#if additional_languages}}
  - {{lang}}: "{{content}}"
    {{/if}}
```

### Optional Fields

```markdown
- **Behavior**: {{behavior_description}}
- **Style**: {{style_specifications}}
- **For**: {{linked_input_id}} (for labels)
- **Trigger**: {{when_shown}} (for conditional text)
```

---

## Multi-Language Support

### 2 Languages (Dog Week)

```markdown
- **Content**:
  - EN: "Welcome to Dog Week"
  - SE: "Välkommen till Dog Week"
```

### 3+ Languages

```markdown
- **Content**:
  - EN: "Welcome to Dog Week"
  - SE: "Välkommen till Dog Week"
  - DE: "Willkommen bei Dog Week"
  - FR: "Bienvenue à Dog Week"
```

### Language Codes

- **EN** = English
- **SE** = Swedish (Svenska)
- **NO** = Norwegian
- **DK** = Danish
- **FI** = Finnish
- **DE** = German
- **FR** = French
- **ES** = Spanish
- **IT** = Italian

---

## Benefits of This Pattern

### ✅ For Translators

```markdown
**Hero Object Translations:**

#### Primary Headline

- EN: "Every walk. on time. Every time."
- SE: "Varje promenad. i tid. Varje gång."

#### Supporting Text

- EN: "Organize your family around dog care."
- SE: "Organisera din familj kring hundvård."
```

Translator can:

- Read entire section in each language
- Ensure translations flow together
- See context immediately
- Verify character lengths

### ✅ For Developers

```typescript
// Object ID makes purpose clear
const headline = document.getElementById('start-hero-headline');
const supportingText = document.getElementById('start-hero-supporting');

// Content referenced by language
const content = {
  'start-hero-headline': {
    en: 'Every walk. on time. Every time.',
    se: 'Varje promenad. i tid. Varje gång.',
  },
};
```

### ✅ For Maintainability

**Content changes:**

```markdown
#### Primary Headline

**OBJECT ID**: `start-hero-headline` ← Stays same

- **Content**:
  - EN: "NEW CONTENT HERE" ← Easy to update
  - SE: "NYTT INNEHÅLL HÄR"
```

**No Object ID changes needed!**

---

## Text Group Examples

### Hero Group (Headline + Body + CTA)

All translations grouped so each language reads coherently:

```markdown
### Hero Object

#### Headline

- EN: "Every walk. on time."
- SE: "Varje promenad. i tid."

#### Body

- EN: "Never miss a walk again."
- SE: "Missa aldrig en promenad."

#### CTA

- EN: "Get Started"
- SE: "Kom Igång"
```

**English reads:** "Every walk. on time. / Never miss a walk again. / [Get Started]"
**Swedish reads:** "Varje promenad. i tid. / Missa aldrig en promenad. / [Kom Igång]"

### Feature Group (Icon + Title + Description)

```markdown
### Feature Card 1

#### Feature Title

- EN: "Smart Scheduling"
- SE: "Smart Schemaläggning"

#### Feature Description

- EN: "Automatically assign walks based on family availability."
- SE: "Tilldela promenader automatiskt baserat på familjetillgänglighet."
```

---

## Validation Checklist

Before finalizing text specifications:

- [ ] Object IDs use purpose-based naming (not content)
- [ ] Structure (position/style) separated from content
- [ ] All languages included for each text element
- [ ] Text groups keep translations together
- [ ] Each language reads coherently as a group
- [ ] Character lengths validated against sketch analysis
- [ ] Component references included
- [ ] Behavior specified (if applicable)

---

**This pattern ensures professional, maintainable, translation-friendly specifications across all WDS projects!** 🌍✨
