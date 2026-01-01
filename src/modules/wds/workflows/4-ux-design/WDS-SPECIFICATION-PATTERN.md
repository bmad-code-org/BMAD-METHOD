# WDS Specification Pattern

**Complete specification format for Whiteport Design Studio projects**

---

## Overview

This document defines the **WDS Specification Pattern** used in Phase 4 (UX Design) for all WDS projects.

**Dog Week Start Page** is used as the example implementation to demonstrate the pattern in action.

**Related Documentation:**

- **`SKETCH-TEXT-ANALYSIS-GUIDE.md`** - How sketch analysis values are derived
- **`HTML-VS-VISUAL-STYLES.md`** - HTML tags vs visual text styles
- **`TRANSLATION-ORGANIZATION-GUIDE.md`** - Purpose-based text organization

---

## Key Principles

### 1. Purpose-Based Naming

Text objects are named by **function, not content**:

- ✅ `hero-headline` (describes purpose)
- ❌ `welcome-message` (describes content)

### 2. Grouped Translations

All product languages grouped together per object for coherent review.

### 3. Estimated Values from Sketch Analysis

When text properties are estimated from sketch markers:

- **Spell out the values explicitly** (e.g., `42px (est. from 24px spacing)`)
- **Mark with analysis note** to show reasoning
- **Designer confirms or adjusts** during specification dialog
- **Update with final values** once confirmed

**Analysis methodology:** See `SKETCH-TEXT-ANALYSIS-GUIDE.md` for complete rules on deriving font weight, font size, line-height, and alignment from sketch markers.

This ensures transparency about which values came from AI interpretation vs. designer specification.

---

## The Pattern in Action

### Hero Section Example

```markdown
### Hero Object

**Purpose**: Primary value proposition and main conversion action

#### Primary Headline

**OBJECT ID**: `start-hero-headline`

**HTML Structure:**

- **Tag**: h1
- **Semantic Purpose**: Main page heading for SEO and accessibility

**Visual Style:**

- **Style Name**: Hero headline
- **Font weight**: Bold (from 3px thick line markers in sketch)
- **Font size**: 56px (est. from 32px vertical spacing between line pairs)
- **Line-height**: 1.1 (est. calculated as font-size × 1.1)
- **Color**: #1a1a1a
- **Letter spacing**: -0.02em

**Position**: Center of hero section, above supporting text
**Alignment**: center

**Behavior**: Updates with language toggle

**Content**:

- EN: "Every walk. on time. Every time."
- SE: "Varje promenad. i tid. Varje gång."

> **Sketch Analysis:** Line thickness (3px) → Bold weight. Line spacing (32px) → ~56px font size estimate. Designer should confirm these values.

#### Supporting Text

**OBJECT ID**: `start-hero-supporting`

**HTML Structure:**

- **Tag**: p
- **Semantic Purpose**: Paragraph text providing additional context

**Visual Style:**

- **Style Name**: Body text large
- **Font weight**: Regular (from 1px thin line markers in sketch)
- **Font size**: 18px (est. from 14px vertical spacing between line pairs)
- **Line-height**: 1.5 (est. calculated as font-size × 1.5)
- **Color**: #4a4a4a

**Position**: Below headline, above CTA, center-aligned
**Alignment**: center

**Behavior**: Updates with language toggle

**Content**:

- EN: "Organize your family around dog care. Never miss a walk again."
- SE: "Organisera din familj kring hundvård. Missa aldrig en promenad igen."

> **Sketch Analysis:** Line thickness (1px) → Regular weight. Line spacing (14px) → ~18px font size estimate. Designer should confirm these values.

#### Primary CTA Button

**OBJECT ID**: `start-hero-cta`

- **Component**: [Button Primary Large](/docs/D-Design-System/.../Button-Primary.md)
- **Position**: Center, below supporting text, 24px margin-top
- **Behavior**: Navigate to /auth/signup
- **States**: default, hover, active, loading
- **Content**:
  - EN: "start planning - free forever"
  - SE: "börja planera - gratis för alltid"
```

**Reading in English:**

> **Every walk. on time. Every time.**
> Organize your family around dog care. Never miss a walk again.
> [start planning - free forever]

**Reading in Swedish:**

> **Varje promenad. i tid. Varje gång.**
> Organisera din familj kring hundvård. Missa aldrig en promenad igen.
> [börja planera - gratis för alltid]

---

## The Complete Process

### Step 1: Sketch Analysis (4B)

```
Agent sees sketch with horizontal lines:

═══════════════════════════════  ← Line 1 (thick, 3px)
═══════════════════════════      ← Line 2 (thick, 3px)

─────────────────────────────────────────  ← Line 3 (thin, 1px)
─────────────────────────────────────────  ← Line 4 (thin, 1px)

┌─────────────────────────────┐
│  start planning             │  ← Button
└─────────────────────────────┘

Agent identifies:
1. TEXT GROUP (2 thick lines) - Hero headline
2. TEXT GROUP (2 thin lines) - Supporting text
3. BUTTON - CTA
```

### Step 2: Object Detection (4C-03 + object-router)

```
For Object 1:
  → Detects horizontal lines
  → TEXT DETECTED
  → Routes to heading-text.md

heading-text.md:
  → Asks: "What's the PURPOSE?" → "Primary Headline"
  → Object ID: `start-hero-headline`
  → Sketch analysis: 2 lines, 3px thick, ~50-60 chars
  → Content guidance: Brief heading, 2 short lines
  → Requests content with length validation
```

### Step 3: Content with Grouped Translations

```
Agent asks:

"What's the content for Primary Headline?

Based on sketch: 2 lines, ~50-60 characters total

I found text in your sketch: 'Every walk. on time. Every time.'

Let me suggest translations...

EN: Every walk. on time. Every time.
SE: Varje promenad. i tid. Varje gång.

Do these work? [1] Use these [2] Adjust [3] Manual"

User provides:
1  ← Accepts suggestions!

Agent validates:
✅ EN: 37 chars (fits 60 capacity)
✅ SE: 36 chars (fits 60 capacity)
```

### Step 4: Generate Specification

```markdown
#### Primary Headline

**OBJECT ID**: `start-hero-headline`

- **Component**: H1 heading
- **Position**: Center of hero
- **Style**: Bold, 42px, line-height 1.2
- **Content**:
  - EN: "Every walk. on time. Every time."
  - SE: "Varje promenad. i tid. Varje gång."
```

---

## Key Advantages

### 1. Purpose-Based Object IDs

**Stable Naming:**

- Content changes don't affect Object IDs
- IDs remain semantic and meaningful
- Easy to find by function

**Examples:**

```markdown
`start-hero-headline` ← Purpose clear
`signin-form-email-label` ← Function clear
`profile-success-message` ← Role clear
```

### 2. Separated Concerns

**Structure/Style** (rarely changes):

```markdown
- **Component**: H1 heading
- **Position**: Center of hero
- **Style**: Bold, 42px
```

**Content** (often changes):

```markdown
- **Content**:
  - EN: "..."
  - SE: "..."
```

### 3. Grouped Translations

**Benefits:**

- Each language reads as complete message
- Translator sees full context
- Natural language flow
- Easy to verify coherence

**Format:**

```markdown
### Text Group

#### Element 1

- EN: "..."
- SE: "..."

#### Element 2

- EN: "..."
- SE: "..."

#### Element 3

- EN: "..."
- SE: "..."
```

### 4. Character Capacity Validation

**From Sketch Analysis:**

```
Agent: "Sketch shows 2 lines, ~50-60 chars capacity"

User provides: "Every walk. on time. Every time." (37 chars)

Agent: "✅ Content fits within sketch capacity!"
```

**If too long:**

```
Agent: "⚠️ Your content (85 chars) exceeds capacity (60 chars).
Consider shortening or adjusting font size."
```

---

## Complete Workflow Integration

```
4B: Sketch Analysis
    ↓
    Identifies text groups, estimates capacity
    ↓
4C-03: Components & Objects
    ↓
    object-router.md
        ↓
        STEP 1: TEXT DETECTION (checks horizontal lines)
        ↓
        If text → heading-text.md
            ↓
            1. Ask PURPOSE (not content)
            2. Generate Object ID from purpose
            3. Specify position/style
            4. Request content with grouped translations
            5. Validate against sketch capacity
            6. Generate specification (Dog Week format)
            ↓
        Return to 4C-03
    ↓
4C-04: Content & Languages
    (Already captured in heading-text.md)
    ↓
4C-08: Generate Final Spec
```

---

## Template Structure

**Every text element follows this format:**

```markdown
#### {{Purpose_Title}}

**OBJECT ID**: `{{page-section-purpose}}`

- **Component**: {{type}} ({{class_or_ref}})
- **Position**: {{position_description}}
  {{#if has_behavior}}
- **Behavior**: {{behavior_description}}
  {{/if}}
  {{#if has_style_details}}
- **Style**: {{style_specifications}}
  {{/if}}
  {{#if links_to_input}}
- **For**: {{input_object_id}}
  {{/if}}
- **Content**:
  - EN: "{{english_text}}"
  - SE: "{{swedish_text}}"
    {{#each additional_language}}
  - {{code}}: "{{text}}"
    {{/each}}
```

---

## Real Dog Week Specifications

These follow the exact pattern we're implementing:

**From 1.1-Start-Page.md:**

```markdown
#### Primary Headline

**OBJECT ID**: `start-hero-headline`

- **Component**: H1 heading (`.text-heading-1`)
- **Content**:
  - EN: "Every walk. on time. Every time."
  - SE: "Varje promenad. i tid. Varje gång."

#### Primary CTA Button

**OBJECT ID**: `start-hero-cta`

- **Component**: [Button Primary Large](/docs/D-Design-System/.../Button-Primary.md)
- **Content**:
  - EN: "start planning - free forever"
  - SE: "börja planera - gratis för alltid"
```

**From 1.2-Sign-In.md (Header example):**

```markdown
#### Sign In Button

**OBJECT ID**: `start-header-signin`

- **Component**: [Button Secondary](/docs/D-Design-System/.../Button-Secondary.md)
- **Content**:
  - EN: "Sign in"
  - SE: "Logga in"
- **Behavior**: Navigate to sign-in page
```

---

## Specification Checklist

For each text element:

- [ ] **Purpose-based name** (not content-based)
- [ ] **Object ID** from purpose: `{page}-{section}-{purpose}`
- [ ] **Component** reference specified
- [ ] **Position** clearly described
- [ ] **Style** separated from content
- [ ] **Behavior** specified if applicable
- [ ] **Content** with grouped translations:
  - [ ] EN: "..."
  - [ ] SE: "..."
  - [ ] Additional languages if needed
- [ ] **Character length** validated against sketch
- [ ] **Part of text group** if applicable

---

**This is the WDS standard for text specifications, proven by Dog Week!** 🎨🌍✨
