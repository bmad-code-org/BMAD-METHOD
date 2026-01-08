# Sketch Text Strategy: Actual Text vs. Markers

**Guidance for Creating WDS Sketches**

---

## The Two Approaches

### 1. Actual Text (Recommended for Headlines)

**Draw readable text directly in sketch**

```
┌─────────────────────────────────────┐
│                                     │
│    Every walk. on time.             │
│    Every time.                      │
│                                     │
│    [Get Started - Free Forever]    │
│                                     │
└─────────────────────────────────────┘
```

**When to use:**

- Headlines (H1, H2, H3)
- Button labels
- Navigation items
- CTAs (calls-to-action)
- Any short, important text

**Why:**
✅ Agent can read and interpret text
✅ Provides content context
✅ Shows character count naturally
✅ Guides design decisions
✅ Can still be refined during specification

### 2. Horizontal Line Markers (For Body Text)

**Draw lines to indicate text blocks**

```
┌─────────────────────────────────────┐
│                                     │
│ ─────────────────────────────────── │ ← Body text
│ ─────────────────────────────────── │
│ ─────────────────────────────────── │
│ ─────────────────────────────────── │
│                                     │
└─────────────────────────────────────┘
```

**When to use:**

- Body paragraphs
- Long descriptions
- Feature lists (when wording TBD)
- Content where you want to show SIZE, not specific text

**Why:**
✅ Faster to sketch
✅ Shows font size (distance between lines)
✅ Shows font weight (line thickness)
✅ Indicates capacity without committing to content
✅ Focuses on layout, not copywriting

---

## Mixed Approach (Recommended)

**Combine both methods for best results:**

```
┌──────────────────────────────────────────┐
│                                          │
│        Welcome to Dog Week               │  ← ACTUAL TEXT (H1)
│                                          │
│ ─────────────────────────────────────── │  ← LINE MARKERS
│ ─────────────────────────────────────── │  ← (Body paragraph)
│ ─────────────────────────────────────── │
│ ─────────────────────────────────────── │
│                                          │
│        [Start Planning]                  │  ← ACTUAL TEXT (CTA)
│                                          │
└──────────────────────────────────────────┘
```

**Result:**

- Headlines provide content guidance
- Body text shows sizing and capacity
- Buttons show clear actions
- Fast to sketch, still informative

---

## Dog Week Example

### Start Page Hero Sketch

```
┌─────────────────────────────────────────────┐
│                                             │
│     🐕 Dog Week                             │  ← Logo (actual)
│                          [Sign In]  SE ▼    │  ← Buttons (actual)
│                                             │
│                                             │
│       Every walk. on time.                  │  ← H1 (actual text)
│       Every time.                           │
│                                             │
│  ────────────────────────────────────────  │  ← Subtext (markers)
│  ────────────────────────────────────────  │
│                                             │
│  [start planning - free forever]            │  ← CTA (actual)
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │                                       │ │
│  │      [Person with dog image]          │ │  ← Image placeholder
│  │                                       │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  Never ask whose turn it is again           │  ← Small text (actual)
│                                             │
│  ─────────────────────────────────────────│  ← Feature description
│  ─────────────────────────────────────────│  ← (markers)
│  ─────────────────────────────────────────│
│                                             │
└─────────────────────────────────────────────┘
```

### Agent Analysis

**Agent reads:**

1. **Logo text:** "Dog Week" → suggests as logo content
2. **H1 actual text:** "Every walk. on time. Every time." → suggests as starting headline
3. **Marker analysis:** 2 thin lines → body text, spacing matches icon size (~16-20px), ~120-140 chars
4. **CTA actual text:** "start planning - free forever" → suggests as button label
5. **Small actual text:** "Never ask whose turn it is again" → suggests as supporting text
6. **Marker analysis:** 3 thin lines → feature description, spacing matches icon size (~16-20px), ~180-210 chars

**Agent output:**

```
I found text in your sketch: "Every walk. on time. Every time."

Would you like to use this for the Primary Headline, or change it?

EN: Every walk. on time. Every time.
SE: [Your Swedish translation]
```

**User can:**

- ✅ Keep the sketch text
- ✅ Change it completely
- ✅ Refine it slightly

---

## Technical Details for Markers

### Line Thickness → Font Weight (Relative)

```
═══════════════════  ← Thickest = Bold (700)
───────────────────  ← Medium = Medium (500)
─────────────────────  ← Thinnest = Regular (400)
```

**Compare relative thickness within the sketch, not absolute pixels.**

### Distance Between Lines → Font Size (Context-Based)

```
═══════════════════
      ↕ ~Button Height  ← H1 (~40-48px)
═══════════════════

───────────────────
    ↕ ~Icon Size        ← Body (~16-20px)
───────────────────
```

**Use UI elements (buttons, icons, scrollbars) as scale references.**

### Complete Example

```
═══════════════════  ← Thickest lines in sketch
      ↕ ~Button Height
═══════════════════  ← Thickest lines in sketch
```

**Analysis:**

- Thickness: Bold (relative to other text)
- Distance: Matches button height (~40-48px)
- Lines: 2
- Capacity: ~50-60 chars

---

## Agent Behavior

### When Sketch Has Actual Text

**Agent says:**

```
I found text in your sketch: "Every walk. on time."

Content for Primary Headline:

EN: Every walk. on time.
SE:

(You can keep the sketch text or change it)
```

**Benefits:**

- Pre-filled starting point
- Still editable
- Saves time
- Provides context

### When Sketch Has Line Markers

**Agent says:**

```
Text placeholder detected:
- 4 horizontal lines
- Line thickness: Thinnest → Regular weight
- Distance: Matches icon/scrollbar size → ~16-20px font
- Capacity: ~240-280 characters

Content for Feature Description:

Please provide content in one language, and I'll suggest translations!

EN:
```

**User provides:**

```
EN: Organize your family around dog care. Assign walks, track feeding schedules, and never miss a walk again.
```

**Agent suggests:**

```
Great! Here are translation suggestions:

SE: Organisera din familj kring hundvård. Tilldela promenader, spåra matscheman och missa aldrig en promenad igen.

Does this work, or would you like to adjust it?
```

**Benefits:**

- Clear capacity guidance
- Agent suggests translations
- User reviews and confirms
- Helps with content length

---

## Workflow: From Analysis to Specification

When AI analyzes sketch text markers, the workflow is:

### Step 1: AI Analyzes Sketch

Agent detects text markers and estimates properties:

```
Line thickness: Thicker than body text → Bold font weight
Spacing between pairs: Similar to button height → ~40-48px font size estimate
Line-height: ~1.2 (calculated from font size)
Character capacity: ~35 characters per line
```

### Step 2: AI Presents Estimates with Reasoning

Agent shows analysis WITH explanation of how estimates were derived:

```markdown
- **Style**:
  - Font weight: Bold (from thick line markers, relative to body text)
  - Font size: 42px (est. from spacing matching button height)
  - Line-height: 1.2 (est. calculated as font-size × 1.2)
```

**Why show reasoning?**

- Designer understands **how** AI interpreted the sketch
- Designer can judge if estimation logic makes sense
- Makes it easy to adjust if sketch measurements were different
- Builds trust through transparency

### Step 3: Designer Confirms/Adjusts

Designer reviews estimates and either:

1. **Confirms** - "Yes, 42px based on button-height spacing is correct"
2. **Adjusts** - "Actually, the spacing is larger, make it 48px instead"
3. **Overrides** - "Ignore the sketch measurements, I want it to be 56px"

### Step 4: Finalize Specification

Agent updates spec with confirmed values, removes estimation notes:

```markdown
- **Style**:
  - Font weight: Bold
  - Font size: 48px
  - Line-height: 1.15
```

Clean, production-ready specification with no estimation artifacts.

**Key Principle:**

- **All estimated values are spelled out explicitly** (not hidden)
- **Marked with (est.) label** to indicate AI interpretation
- **Designer confirms or adjusts** each estimated value
- **Label removed** once designer specifies actual values

This ensures **transparency** about which values came from AI sketch analysis vs. designer specification.

---

## Best Practices

### ✅ DO:

1. **Use actual text for headlines**
   - Provides content direction
   - Agent can read and suggest
   - Still changeable during spec

2. **Use markers for body text**
   - Shows sizing without committing
   - Faster to sketch
   - Focuses on layout

3. **Mix both approaches**
   - Headlines = actual text
   - Body = markers
   - Best of both worlds

4. **Keep sketch text informal**
   - It's a suggestion, not final
   - Can be refined later
   - Agent will ask to confirm/change

### ❌ DON'T:

1. **Don't use Lorem Ipsum**
   - Not helpful for context
   - Agent can't interpret
   - Use real(ish) content or markers

2. **Don't commit too early**
   - Sketch text is guidance
   - Refinement happens in spec phase
   - Stay flexible

3. **Don't mix for same element**
   - Either actual text OR markers
   - Not both for one text block
   - Confuses analysis

---

## Workflow Integration

### During Sketching

**Designer:**

```
1. Draw page layout
2. Add ACTUAL TEXT for headlines/buttons
3. Add LINE MARKERS for body paragraphs
4. Show font weight (thickness)
5. Show font size (distance)
```

### During Specification (Phase 4)

**Agent:**

```
1. Analyze sketch
2. Read any actual text found
3. Suggest sketch text as starting point
4. Analyze markers for sizing
5. Request final content
6. Allow refinement
7. Document in spec
```

**User:**

```
1. See sketch text as suggestion
2. Keep, change, or refine
3. Add translations
4. Confirm length fits capacity
```

---

## Real Dog Week Flow

### Sketch Shows:

```
Every walk. on time. Every time.  ← Actual text in sketch
```

### Agent Says:

```
I found text in your sketch: "Every walk. on time. Every time."

Let me suggest translations...

Suggested content for Primary Headline:

EN: Every walk. on time. Every time.
SE: Varje promenad. i tid. Varje gång.

These are my suggestions. Do they work?

1. Use these translations
2. Adjust translations
3. Manual input

Choice [1/2/3]:
```

### User Says:

```
1  ← Accepts!
```

Or refines:

```
2

SE: Varje promenad. Punktligt. Varje gång.  ← Adjusted
```

EN: Every walk. on time. Every time. ← Keeps it!
SE: Varje promenad. i tid. Varje gång.

````

### Specification Result:

```markdown
#### Primary Headline
**OBJECT ID**: `start-hero-headline`
- **Component**: H1 heading
- **Position**: Center of hero
- **Style**: Bold, 42px, line-height 1.2
- **Content**:
  - EN: "Every walk. on time. Every time."
  - SE: "Varje promenad. i tid. Varje gång."
````

**Result:** Sketch text became final content! ✅

---

## Summary

| Element Type        | Sketch Method | Agent Behavior                               |
| ------------------- | ------------- | -------------------------------------------- |
| **Headlines**       | Actual text   | Reads & suggests as starting content         |
| **Buttons**         | Actual text   | Reads & suggests as button label             |
| **Navigation**      | Actual text   | Reads & suggests as nav items                |
| **Body paragraphs** | Line markers  | Analyzes for size/capacity, requests content |
| **Descriptions**    | Line markers  | Analyzes for size/capacity, requests content |

**Golden Rule:**

- **Important/short text** = Draw actual text
- **Long/placeholder text** = Use line markers
- **Mix both** for best results

**Remember:**

- Sketch text is a suggestion, not final
- Agent will ask to confirm or change
- Refinement happens during specification
- Stay flexible, iterate as needed

---

**Use actual text for headlines, markers for body text!** 📝✨
