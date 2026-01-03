# Object Router Flow Diagram

**Updated with Text-First Detection**

---

## Complete Flow

```
┌─────────────────────────────────────────────────────────┐
│  4C-03: Components & Objects                            │
│  (For each object, top-left to bottom-right)            │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  OBJECT-ROUTER.MD                                       │
│  Step 1: TEXT DETECTION FIRST                           │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │ Horizontal lines       │
         │ detected in sketch?    │
         └────────┬───────┬───────┘
                  │       │
        YES ◄─────┘       └─────► NO
         │                        │
         ▼                        ▼
┌──────────────────────┐  ┌──────────────────────────┐
│ ✓ TEXT DETECTED      │  │ Step 2: ANALYZE          │
│                      │  │ OTHER OBJECT TYPE        │
│ Quick Analysis:      │  │                          │
│ - Line count         │  │ Check for:               │
│ - Thickness          │  │ - Button shapes          │
│ - Spacing            │  │ - Input boxes            │
│ - Alignment          │  │ - Image placeholders     │
│                      │  │ - Containers             │
│ Appears to be:       │  │ - Interactive elements   │
│ {{text_type}}        │  └────────┬─────────────────┘
└──────┬───────────────┘           │
       │                           ▼
       │              ┌────────────────────────────┐
       │              │ Agent suggests             │
       │              │ interpretation with        │
       │              │ reasoning                  │
       │              └────────┬───────────────────┘
       │                       │
       │                       ▼
       │              ┌────────────────────────────┐
       │              │ User confirms:             │
       │              │ 1. Yes                     │
       │              │ 2. Close - clarify         │
       │              │ 3. No - different          │
       │              └────────┬───────────────────┘
       │                       │
       │                       ▼
       │              ┌────────────────────────────┐
       │              │ Confirmed object type      │
       │              └────────┬───────────────────┘
       │                       │
       ▼                       ▼
┌─────────────────────────────────────────────────────────┐
│  ROUTE TO OBJECT-SPECIFIC INSTRUCTION FILE              │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┴─────────────────────┐
        │                                   │
        ▼                                   ▼
┌──────────────────┐            ┌──────────────────────┐
│ heading-text.md  │            │ Other object files:  │
│                  │            │                      │
│ Complete text    │            │ • button.md          │
│ analysis:        │            │ • text-input.md      │
│                  │            │ • link.md            │
│ 1. Object ID     │            │ • image.md           │
│ 2. Text type     │            │ • card.md            │
│ 3. Sketch        │            │ • modal-dialog.md    │
│    analysis:     │            │ • table.md           │
│    - Lines       │            │ • list.md            │
│    - Thickness   │            │ • navigation.md      │
│    - Spacing     │            │ • badge.md           │
│    - Capacity    │            │ • alert-toast.md     │
│ 4. Content       │            │ • progress.md        │
│    guidance      │            │ • video.md           │
│ 5. Styling       │            │ • custom.md          │
│ 6. Responsive    │            │                      │
│ 7. Generate      │            │ Each with:           │
│    spec          │            │ - Object ID          │
└────────┬─────────┘            │ - Type-specific      │
         │                      │   analysis           │
         │                      │ - Complete examples  │
         │                      │ - Generate spec      │
         │                      └──────────┬───────────┘
         │                                 │
         └─────────────┬───────────────────┘
                       │
                       ▼
         ┌─────────────────────────────┐
         │ Specification Complete      │
         │                             │
         │ Object documented with:     │
         │ - Object ID assigned        │
         │ - Complete specification    │
         │ - Examples included         │
         │ - Consistent format         │
         └─────────────┬───────────────┘
                       │
                       ▼
         ┌─────────────────────────────┐
         │ Return to 4C-03             │
         │                             │
         │ Next object? [Y/N]          │
         │ - YES: Loop back to router  │
         │ - NO: Section complete      │
         └─────────────────────────────┘
```

---

## Key Changes

### OLD: Generic Object Detection

```
1. Ask user "What type is this?" [list of 20 options]
2. User selects from list
3. Route to file
```

### NEW: Text-First with Intelligence

```
1. Check for horizontal lines FIRST
   ├─ YES → Text detected → Route to heading-text.md
   └─ NO → Continue analysis
2. Agent analyzes and suggests with reasoning
3. User confirms quickly
4. Route to appropriate file
```

---

## Text Detection Flow (Detailed)

```
Object Router detects horizontal lines:

═══════════════════════════════
═══════════════════════════

         ↓

Agent says:
"✓ TEXT ELEMENT DETECTED

I see 2 thick horizontal lines - text content.

Quick Analysis:
- 2 lines (text placeholders)
- Thickness: 3px
- Spacing: 3px
- Alignment: Center

This appears to be HEADING (H2).

→ Loading text-specific instructions..."

         ↓

Routes to heading-text.md

         ↓

heading-text.md executes:
1. Confirms text type
2. Analyzes sketch in detail:
   - Estimates font size (28-32px)
   - Estimates line-height (1.3)
   - Calculates capacity (50-60 chars)
3. Requests content with guidance
4. Validates content length
5. Specifies styling
6. Generates complete spec

         ↓

Returns to 4c-03 with completed specification
```

---

## Benefits

### 1. Efficiency

- Text detected immediately (no menu selection)
- Most common object type caught first
- Reduces decision points

### 2. Accuracy

- Text has unique signature (horizontal lines)
- Clear visual indicator
- Hard to misidentify

### 3. Completeness

- Routes to specialized text analysis
- Character capacity automatic
- Content guidance immediate

### 4. Intelligence

- Agent demonstrates understanding
- Natural interpretation flow
- Trust-the-agent philosophy

---

## Example Scenarios

### Scenario 1: Page with Heading + Paragraph + Button

```
Sketch shows (top to bottom):

═══════════════════════════════  ← 1. Text: pair of THICK lines (1 line of text)
═══════════════════════════════     = Heading (bold font weight)

─────────────────────────────────  ← 2. Text: 2 pairs of THIN lines (2 lines of text)
─────────────────────────────────     = Body paragraph (regular font weight)

─────────────────────────────────     Large spacing between pairs = larger font
─────────────────────────────────

┌──────────────────┐
│  Get Started     │  ← 3. Button
└──────────────────┘

Router processes:
1. Object 1: Detects 1 pair of thick lines → heading-text.md → H2 heading (bold, ~1 line)
2. Object 2: Detects 2 pairs of thin lines → heading-text.md → Body paragraph (~2 lines)
3. Object 3: Detects button shape → button.md → Primary button
```

### Scenario 2: Form with Labels + Inputs

```
Sketch shows:

══════════                         ← 1. Text: pair of thin lines (1 line = label)
══════════                            Small spacing = smaller font

┌───────────────────────────────┐
│                               │  ← 2. Input box
└───────────────────────────────┘

──────────                         ← 3. Text: pair of thin lines (1 line = label)
──────────                            Small spacing = smaller font

┌───────────────────────────────┐
│                               │  ← 4. Input box
└───────────────────────────────┘

Router processes:
1. Object 1: Detects pair of lines → heading-text.md → Label text (~20-30 chars)
2. Object 2: Detects input box → text-input.md → Email input
3. Object 3: Detects pair of lines → heading-text.md → Label text (~20-30 chars)
4. Object 4: Detects input box → text-input.md → Password input
```

---

**Text-first detection ensures accurate routing and complete text analysis!** 📝✨
