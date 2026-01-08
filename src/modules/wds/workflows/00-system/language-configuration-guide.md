# Language Configuration Guide

**Setting Up Multi-Language Projects in WDS**

---

## Overview

WDS supports two distinct language configurations:

1. **Specification Language** - Language used to WRITE the design specifications
2. **Product Languages** - Languages the final PRODUCT will support

These are configured during workflow initialization and stored in `wds-workflow-status.yaml`.

---

## Configuration During Setup

### Workflow Init (Step 4)

During WDS project setup, you'll be asked:

**Question 1: Specification Language**

```
What language should WDS write the design specifications in?

1. English (EN)
2. Swedish (SE)
3. Norwegian (NO)
4. Danish (DK)
5. Other
```

**Question 2: Product Languages**

```
What languages will the final product support?

List them separated by commas (e.g., "EN, SE" or "EN, SE, NO, DK")

Product languages: _____________
```

---

## Storage in Config

Settings are stored in `docs/wds-workflow-status.yaml`:

```yaml
config:
  specification_language: 'EN'
  product_languages:
    - EN
    - SE
    - NO
```

---

## How It Works

### Specification Language

**Used for:**

- Instructions and guidance text in specs
- Section descriptions
- Comments and annotations
- PRD documentation
- Design system documentation

**Example:**

```markdown
# 1.1 Start Page

## Page Purpose

Convert visitors into users by addressing... ← Written in spec language

## User Situation

Family members experiencing daily stress... ← Written in spec language
```

### Product Languages

**Used for:**

- All user-facing text content
- Button labels
- Form labels
- Error messages
- Help text
- Any text the END USER sees

**Example:**

```markdown
#### Primary CTA Button

**OBJECT ID**: `start-hero-cta`

- **Component**: Button Primary
- **Content**: ← Product languages
  - EN: "Get Started"
  - SE: "Kom Igång"
  - NO: "Kom i Gang"
```

---

## Common Configurations

### Dog Week Example

```yaml
config:
  specification_language: 'EN' # Specs written in English
  product_languages:
    - EN # Product supports English
    - SE # and Swedish
```

**Result:**

- Design specs written in English
- All text objects have EN and SE translations

### Nordic SaaS Example

```yaml
config:
  specification_language: 'EN' # Specs in English
  product_languages:
    - EN
    - SE
    - NO
    - DK
    - FI # 5 Nordic languages
```

### Internal Swedish Tool

```yaml
config:
  specification_language: 'SE' # Specs in Swedish
  product_languages:
    - SE # Only Swedish product
```

### Global Product

```yaml
config:
  specification_language: 'EN'
  product_languages:
    - EN
    - SE
    - DE
    - FR
    - ES
    - IT
```

---

## Impact on Workflows

### Phase 1: Product Brief

**Written in:** `specification_language`

```markdown
# Product Brief

## Vision

Create a platform that... ← Spec language

## Target Users

Swedish families with... ← Spec language
```

### Phase 2: Trigger Map

**Written in:** `specification_language`

Personas and triggers documented in spec language.

### Phase 4: UX Design

**Specs in:** `specification_language`
**Text content in:** `product_languages` (all of them)

```markdown
## Hero Object

**Purpose**: Primary value proposition ← Spec language

#### Primary Headline

**OBJECT ID**: `start-hero-headline`

- **Component**: H1 heading
- **Position**: Center of hero ← Spec language
- **Content**: ← Product languages
  - EN: "Every walk. on time."
  - SE: "Varje promenad. i tid."
```

### Phase 5: Design System

**Documentation in:** `specification_language`
**Component examples in:** All `product_languages`

```markdown
## Button Component

### Usage ← Spec language

Use this button for primary actions...

### Examples ← Product languages

- EN: "Submit", "Save", "Continue"
- SE: "Skicka", "Spara", "Fortsätt"
```

### Phase 6: PRD Finalization

**Written in:** `specification_language`

PRD is technical documentation for developers.

---

## Text Object Pattern

Every text object follows this pattern:

```markdown
#### {{Purpose_Name}}

**OBJECT ID**: `{{id}}`

- **Component**: {{type}}
- **Position**: {{description}} ← Spec language
- **Style**: {{specifications}} ← Spec language
- **Behavior**: {{description}} ← Spec language
- **Content**: ← Product languages
  {{#each product_languages}}
  - {{this}}: "{{content}}"
    {{/each}}
```

**Real Example:**

```markdown
#### Email Label

**OBJECT ID**: `signin-form-email-label`

- **Component**: Label text
- **Position**: Above email input field
- **For**: signin-form-email-input
- **Content**:
  - EN: "Email Address"
  - SE: "E-postadress"
  - NO: "E-postadresse"
```

---

## Agent Behavior

### During Phase 4

When documenting text objects, agents will:

1. **Read config** from `wds-workflow-status.yaml`
2. **Extract** `product_languages` array
3. **Request content** for EACH language
4. **Group translations** so each language reads coherently

**Agent prompt:**

```markdown
**Content for this Primary Headline:**

**EN:**

**SE:**

**NO:**
```

User provides all translations, agent validates and documents.

---

## Benefits

### ✅ Flexibility

- Spec language can differ from product languages
- Teams can work in their native language
- Product can target different markets

### ✅ Consistency

- All text objects have all languages
- No missing translations
- Complete from the start

### ✅ Clarity

- Spec readers understand documentation
- End users see their language
- Translators see all languages together

### ✅ Developer-Friendly

Config provides:

```yaml
product_languages:
  - EN
  - SE
  - NO
```

Developers know exactly what languages to implement.

---

## Language Codes Reference

**Nordic:**

- EN = English
- SE = Swedish (Svenska)
- NO = Norwegian (Norsk)
- DK = Danish (Dansk)
- FI = Finnish (Suomi)

**Western Europe:**

- DE = German (Deutsch)
- FR = French (Français)
- ES = Spanish (Español)
- IT = Italian (Italiano)
- NL = Dutch (Nederlands)
- PT = Portuguese (Português)

**Eastern Europe:**

- PL = Polish (Polski)
- CZ = Czech (Čeština)
- RU = Russian (Русский)

**Asia:**

- JA = Japanese (日本語)
- ZH = Chinese (中文)
- KO = Korean (한국어)

**Other:**

- AR = Arabic (العربية)
- TR = Turkish (Türkçe)

---

## Example: Dog Week Configuration

### During Setup

```
Specification Language: EN
Product Languages: EN, SE
```

### Stored Config

```yaml
# docs/wds-workflow-status.yaml
config:
  specification_language: 'EN'
  product_languages:
    - EN
    - SE
```

### In Specifications

```markdown
# 1.1 Start Page

The start page serves as the primary entry point... ← Written in EN

#### Primary Headline

**OBJECT ID**: `start-hero-headline`

- **Component**: H1 heading
- **Position**: Center of hero section ← Written in EN
- **Content**:
  - EN: "Every walk. on time. Every time." ← Product language 1
  - SE: "Varje promenad. i tid. Varje gång." ← Product language 2
```

### For Developers

```typescript
// Read from config
const languages = ['EN', 'SE'];

// All text has both languages
const content = {
  'start-hero-headline': {
    en: 'Every walk. on time. Every time.',
    se: 'Varje promenad. i tid. Varje gång.',
  },
};
```

---

## Updating Language Configuration

If you need to add/change languages mid-project:

1. **Update** `docs/wds-workflow-status.yaml`
2. **Add missing translations** to existing text objects
3. **Continue** with new language config

**Before:**

```yaml
product_languages:
  - EN
  - SE
```

**After:**

```yaml
product_languages:
  - EN
  - SE
  - NO # Added Norwegian
```

**Update existing specs:**

```markdown
#### Primary Headline

- **Content**:
  - EN: "Every walk. on time."
  - SE: "Varje promenad. i tid."
  - NO: "Hver tur. i tide." ← Add new language
```

---

**Language configuration ensures complete, translation-ready specifications from day one!** 🌍✨
