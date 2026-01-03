# Language Flow: Setup to Specification

**How Language Configuration Flows Through WDS**

---

## 1. Workflow Initialization

**File:** `workflows/workflow-init/instructions.md` (Step 4)

**User is asked:**

```
Specification Language - What language should WDS write the design specifications in?

1. English (EN)
2. Swedish (SE)
3. Norwegian (NO)
4. Danish (DK)
5. Other

Choice: 1

Product Languages - What languages will the final product support?

(e.g., "EN, SE" or "EN, SE, NO, DK")

Product languages: EN, SE
```

**Agent stores:**

- `specification_language = "EN"`
- `product_languages = ["EN", "SE"]`

---

## 2. Config File Creation

**File:** `docs/wds-workflow-status.yaml`

**Generated from template:**

```yaml
# WDS Workflow Status
generated: "2025-12-05"
project: "Dog Week"
project_type: "full-product"

config:
  folder_prefix: "letters"
  folder_case: "title"
  brief_level: "complete"
  include_design_system: true
  component_library: "custom"
  specification_language: "EN"     ← Stored here
  product_languages:                ← Stored here
    - EN
    - SE
```

---

## 3. Phase 4 Agent Reads Config

**Agent:** Freya (WDS Designer)

**When starting Phase 4:**

```xml
<action>Load {output_folder}/wds-workflow-status.yaml</action>
<action>Extract config.specification_language → "EN"</action>
<action>Extract config.product_languages → ["EN", "SE"]</action>
<action>Store in session context</action>
```

**Agent now knows:**

- Write specs in English
- Request content in English AND Swedish for all text

---

## 4. Sketch Analysis (4B)

**File:** `substeps/4b-sketch-analysis.md`

**Agent analyzes sketch:**

```
Detected text placeholder:
- 2 horizontal lines
- ~50-60 characters capacity
- Appears to be headline

→ Routes to heading-text.md
```

**Language not needed yet** - analyzing visual structure only.

---

## 5. Object Documentation (heading-text.md)

**File:** `object-types/heading-text.md`

### Step 1: Purpose-Based Naming

```
What is the PURPOSE of this text on the page?

User: "Primary headline"

→ Generates Object ID: start-hero-headline
```

### Step 2: Position & Style

```
Text element specifications:

Type: H1
Position: Center of hero
Font size: 42px
Line height: 1.2
...
```

_Spec written in English (specification_language)_

### Step 3: Content with Translations

**Agent reads config:**

```xml
<action>Load product_languages from config → ["EN", "SE"]</action>
```

**Agent asks:**

```
Content for this Primary Headline:

Based on sketch: 2 lines, ~50-60 characters total
Project languages: EN, SE

EN:

SE:
```

**User provides:**

```
EN: Every walk. on time. Every time.

SE: Varje promenad. i tid. Varje gång.
```

**Agent validates:**

```
✅ EN content: 37 characters (fits 60 capacity)
✅ SE content: 36 characters (fits 60 capacity)
```

---

## 6. Generate Specification

**Agent writes to:** `docs/C-Scenarios/01-Customer-Onboarding/1.1-Start-Page/1.1-Start-Page.md`

```markdown
# 1.1 Start Page

The start page serves as the primary entry point... ← English (spec language)

## Page Sections

### Hero Object

**Purpose**: Primary value proposition ← English (spec language)

#### Primary Headline

**OBJECT ID**: `start-hero-headline`

- **Component**: H1 heading (`.text-heading-1`)
- **Position**: Center of hero section ← English (spec language)
- **Style**: Bold, 42px, line-height 1.2 ← English (spec language)
- **Behavior**: Updates with language toggle ← English (spec language)
- **Content**: ← Product languages
  - EN: "Every walk. on time. Every time."
  - SE: "Varje promenad. i tid. Varje gång."
```

---

## 7. Complete Text Group

**For a full section with multiple text elements:**

```markdown
### Hero Object

**Purpose**: Primary value proposition ← Spec language

#### Primary Headline

**OBJECT ID**: `start-hero-headline`

- **Component**: H1 heading
- **Position**: Center of hero, top ← Spec language
- **Content**:
  - EN: "Every walk. on time. Every time." ← Product languages
  - SE: "Varje promenad. i tid. Varje gång."

#### Supporting Text

**OBJECT ID**: `start-hero-supporting`

- **Component**: Body text
- **Position**: Below headline ← Spec language
- **Content**:
  - EN: "Never miss a walk again." ← Product languages
  - SE: "Missa aldrig en promenad."

#### Primary CTA

**OBJECT ID**: `start-hero-cta`

- **Component**: Button Primary
- **Position**: Center, below text ← Spec language
- **Content**:
  - EN: "Get Started" ← Product languages
  - SE: "Kom Igång"
```

**Reading in English:**

> Every walk. on time. Every time.
> Never miss a walk again.
> [Get Started]

**Reading in Swedish:**

> Varje promenad. i tid. Varje gång.
> Missa aldrig en promenad.
> [Kom Igång]

---

## 8. Developer Handoff

**Developer reads:** `docs/wds-workflow-status.yaml`

```yaml
config:
  product_languages:
    - EN
    - SE
```

**Developer implements:**

```typescript
// i18n config
const supportedLanguages = ['en', 'se'];

// Text content from specs
const translations = {
  'start-hero-headline': {
    en: 'Every walk. on time. Every time.',
    se: 'Varje promenad. i tid. Varje gång.',
  },
  'start-hero-supporting': {
    en: 'Never miss a walk again.',
    se: 'Missa aldrig en promenad.',
  },
  'start-hero-cta': {
    en: 'Get Started',
    se: 'Kom Igång',
  },
};

// Language toggle
function setLanguage(lang: 'en' | 'se') {
  // All translations ready to use!
}
```

---

## Flow Diagram

```
┌─────────────────────────────────────┐
│  1. Workflow Init (Step 4)          │
│  User selects:                      │
│  - Spec Language: EN                │
│  - Product Languages: EN, SE        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  2. Generate Config File            │
│  docs/wds-workflow-status.yaml      │
│  config:                            │
│    specification_language: "EN"     │
│    product_languages: [EN, SE]      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  3. Phase 4: UX Design              │
│  Freya agent loads config           │
│  Knows: Specs in EN, Content in     │
│         EN + SE                     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  4. Sketch Analysis                 │
│  Analyze visual structure           │
│  (Language-agnostic)                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  5. Text Object Documentation       │
│  heading-text.md                    │
│  - Purpose naming (in spec lang)    │
│  - Position/style (in spec lang)    │
│  - Content (in ALL product langs)   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  6. Generate Page Specification     │
│  docs/C-Scenarios/.../page.md       │
│  - Structure/logic in EN            │
│  - All text in EN + SE              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  7. Developer Implementation        │
│  - Read config                      │
│  - Extract translations             │
│  - Implement i18n                   │
│  - All languages ready!             │
└─────────────────────────────────────┘
```

---

## Key Principles

### ✅ Two Distinct Languages

**Specification Language:**

- Documentation language
- For designers, PMs, developers
- Describes structure, behavior, logic

**Product Languages:**

- User-facing content
- What end users see
- Can be multiple languages

### ✅ Early Configuration

**Set during workflow init** - before any design work

- No mid-project surprises
- All stakeholders aligned
- Complete from day one

### ✅ Automatic Propagation

**Config flows through all phases:**

- Phase 1: Brief in spec language
- Phase 2: Trigger Map in spec language
- Phase 4: Specs in spec language, content in ALL product languages
- Phase 5: Design System docs in spec language, examples in all product languages
- Phase 6: PRD in spec language

### ✅ Grouped for Coherence

**Each text group reads naturally in each language:**

```markdown
### Hero Object

#### Headline + Body + CTA

EN reads: "Every walk. Never miss a walk. Get Started"
SE reads: "Varje promenad. Missa aldrig. Kom Igång"
```

Each language complete and coherent!

---

## Example: Adding Norwegian Mid-Project

**Original config:**

```yaml
product_languages:
  - EN
  - SE
```

**User needs Norwegian:**

1. **Update config:**

```yaml
product_languages:
  - EN
  - SE
  - NO # Added
```

2. **Add to existing specs:**

```markdown
#### Primary Headline

- **Content**:
  - EN: "Every walk. on time."
  - SE: "Varje promenad. i tid."
  - NO: "Hver tur. i tide." ← Add to all text objects
```

3. **Future text objects automatically include NO**

Agents read updated config and request 3 languages going forward.

---

**Language configuration ensures complete, production-ready translations from the very beginning!** 🌍✨
