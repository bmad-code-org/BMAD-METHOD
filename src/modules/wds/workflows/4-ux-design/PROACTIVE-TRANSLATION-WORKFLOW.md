# Proactive Translation Workflow

**Agent Always Suggests Translations**

---

## The Principle

**Agent is proactive, not passive**

- Don't just ask for translations
- **Suggest them!**
- Let user accept, refine, or override

---

## Workflow Examples

### Example 1: Sketch Has Actual Text

**Sketch shows:**

```
Every walk. on time. Every time.
```

**Agent says:**

```
I found text in your sketch: "Every walk. on time. Every time."

Let me suggest translations...

Suggested content for Primary Headline:

EN: Every walk. on time. Every time.
SE: Varje promenad. i tid. Varje gång.
NO: Hver tur. i tide. Hver gang.

These are my suggestions. Do they work?

1. Use these translations
2. Adjust translations
3. Manual input

Choice [1/2/3]:
```

**User response options:**

**Option A: Accept (Fast!)**

```
1
```

→ Done! All translations accepted.

**Option B: Adjust specific**

```
2

Which language(s) need adjustment?

EN: Every walk. on time. Every time.  ← Keep
SE: Varje promenad. i tid. Varje gång.  ← Change this
NO: Hver tur. i tide. Hver gang.  ← Keep

SE: Varje promenad. Punktligt. Varje gång.
```

→ Done! One adjusted, others kept.

**Option C: Manual**

```
3

EN:
SE:
NO:
```

→ User provides all manually.

---

### Example 2: No Sketch Text (Markers Only)

**Sketch shows:**

```
─────────────────────────────────  ← Line markers
─────────────────────────────────  ← (no actual text)
─────────────────────────────────
```

**Agent says:**

```
Text placeholder detected:
- 3 horizontal lines
- Regular weight, 16px font
- Capacity: ~180-210 characters

Content for Feature Description:

Please provide content in one language, and I'll suggest translations!

EN:
```

**User provides:**

```
EN: Organize your family around dog care. Assign walks and never miss one again.
```

**Agent immediately suggests:**

```
Great! Here are translation suggestions:

SE: Organisera din familj kring hundvård. Tilldela promenader och missa aldrig en igen.
NO: Organiser familien din rundt hundepass. Tildel turer og gå aldri glipp av en.

Do these work?

1. Use these translations
2. Adjust translations
3. Manual input

Choice [1/2/3]:
```

**Result:** Agent is proactive even without sketch text!

---

## Benefits

### ✅ Speed

- User accepts = instant completion
- No typing all translations manually
- Saves significant time

### ✅ Accuracy

- Agent uses context for better translations
- Considers character capacity
- Maintains tone and style

### ✅ Flexibility

- Can accept all suggestions
- Can adjust specific ones
- Can override completely
- Full user control

### ✅ Consistency

- Translations match style
- Terminology stays consistent
- Professional quality

---

## Technical Implementation

### Agent Logic

```xml
<action>Read sketch for text</action>

<check if="sketch_has_text">
  <action>Extract text: "Every walk. on time."</action>
  <action>Translate to all product_languages</action>

  <output>
  I found text in your sketch: "{{text}}"

  Suggested translations:
  {{#each product_languages}}
  {{this}}: {{translated_content}}
  {{/each}}

  Do these work? [1] Use [2] Adjust [3] Manual
  </output>
</check>

<check if="!sketch_has_text">
  <ask>Provide content in {{primary_language}}:</ask>
  <action>After receiving, translate to remaining languages</action>

  <output>
  Translation suggestions:
  {{#each remaining_languages}}
  {{this}}: {{translated_content}}
  {{/each}}

  Do these work? [1] Use [2] Adjust [3] Manual
  </output>
</check>
```

### Translation Quality

**Agent considers:**

- Character capacity from sketch
- Tone and style of original
- Context from page purpose
- Previous translations in project
- Language-specific conventions

---

## Real Dog Week Examples

### Example: Hero Headline

**Sketch:**

```
Every walk. on time. Every time.
```

**Agent:**

```
Suggested content for Primary Headline:

EN: Every walk. on time. Every time.
SE: Varje promenad. i tid. Varje gång.

Do these work? [1] Use [2] Adjust [3] Manual
```

**User:**

```
1
```

**Result:** ✅ Complete in seconds!

### Example: Button Label

**Sketch:**

```
[Get Started - Free Forever]
```

**Agent:**

```
Suggested content for Primary CTA:

EN: Get Started - Free Forever
SE: Kom Igång - Gratis För Alltid

Do these work? [1] Use [2] Adjust [3] Manual
```

**User:**

```
2

SE: börja planera - gratis för alltid  ← lowercase, different verb
```

**Result:** ✅ Refined and complete!

### Example: Form Label

**Sketch:**

```
Email Address:
```

**Agent:**

```
Suggested content for Email Label:

EN: Email Address
SE: E-postadress

Do these work? [1] Use [2] Adjust [3] Manual
```

**User:**

```
1
```

**Result:** ✅ Instant!

---

## Multi-Language Example (3+ Languages)

**Project Config:**

```yaml
product_languages:
  - EN
  - SE
  - NO
  - DK
```

**Sketch:**

```
Welcome Home
```

**Agent:**

```
I found text in your sketch: "Welcome Home"

Suggested translations:

EN: Welcome Home
SE: Välkommen Hem
NO: Velkommen Hjem
DK: Velkommen Hjem

Do these work? [1] Use [2] Adjust [3] Manual
```

**User:**

```
1
```

**Result:** ✅ 4 languages in one click!

---

## Error Handling

### Translation Confidence

**High confidence:**

```
✅ These translations look good!

Do they work? [1] Use [2] Adjust [3] Manual
```

**Low confidence:**

```
⚠️ I'm less confident about these translations. Please review carefully!

Suggestions:
EN: [original]
SE: [suggested]

Do they work? [1] Use [2] Adjust [3] Manual
```

### Character Capacity Warning

**If translation exceeds capacity:**

```
⚠️ Translation length warning:

EN: "Every walk. on time." (23 chars) ✅
SE: "Varje promenad i tid hela tiden." (33 chars) ⚠️
    → Exceeds capacity (30 chars)

Suggested shorter version:
SE: "Varje promenad. I tid." (24 chars) ✅

Use shorter version? (y/n)
```

---

## User Experience

### Before (Passive):

```
EN:                           ← User types
SE:                           ← User types
NO:                           ← User types

Slow, tedious, error-prone
```

### After (Proactive):

```
Suggested translations:
EN: Every walk. on time.
SE: Varje promenad. i tid.
NO: Hver tur. i tide.

[1] Use these  ← ONE CLICK!

Fast, accurate, professional
```

---

## Summary

### Agent Behavior

**Always suggest translations:**

1. Read sketch text (if present)
2. Generate suggestions for ALL languages
3. Present with options: Accept / Adjust / Manual
4. Validate character capacity
5. Warn if low confidence

**Never:**

- Present blank fields for translations
- Make user type everything
- Provide only one language at a time

### User Benefits

✅ **Speed** - Accept in one click
✅ **Quality** - Professional translations
✅ **Control** - Can adjust or override
✅ **Confidence** - AI-assisted, human-verified

---

**Proactive translation = better UX, faster workflow, higher quality!** 🌍⚡✨
