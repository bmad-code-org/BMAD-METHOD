# Phase 4 Documentation Architecture

## Problem: Redundant Information

Currently sketch text analysis rules are duplicated across multiple files, making maintenance difficult and increasing risk of inconsistency.

## Solution: Single Source of Truth Pattern

### Core Documentation (Single Source of Truth)

1. **`SKETCH-TEXT-ANALYSIS-GUIDE.md`** ← **MASTER GUIDE**
   - Complete rules for analyzing text markers
   - Line thickness → font weight
   - Line spacing → font size
   - Line position → text alignment
   - Line count → text lines
   - Line length → character capacity
   - All visual examples and edge cases

2. **`SKETCH-TEXT-QUICK-REFERENCE.md`**
   - One-page summary of the guide
   - Quick lookup table
   - References master guide for details

3. **`SKETCH-TEXT-STRATEGY.md`**
   - When to use actual text vs. line markers
   - Proactive translation workflow
   - References master guide for analysis rules

### Specialized Documentation (References Core)

4. **`object-types/TEXT-DETECTION-PRIORITY.md`**
   - Why text detection is first
   - PAIRS = text, SINGLE = decorative
   - References master guide for analysis
   - Focus: Detection logic only

5. **`object-types/heading-text.md`**
   - Instruction file for AI agent
   - References master guide
   - Focus: Workflow and user interaction
   - Does NOT duplicate analysis rules

6. **`object-types/object-router.md`**
   - Routes to appropriate object type
   - References TEXT-DETECTION-PRIORITY.md
   - Does NOT duplicate analysis rules

### Supporting Documentation

7. **`HTML-VS-VISUAL-STYLES.md`**
   - HTML tags vs visual styles
   - No sketch analysis (different topic)

8. **`IMAGE-SKETCHING-BEST-PRACTICES.md`**
   - How to sketch images
   - No text analysis (different topic)

9. **`WDS-SPECIFICATION-PATTERN.md`**
   - Shows complete specification format
   - Examples reference the guides
   - Does NOT teach analysis rules

10. **`TRANSLATION-ORGANIZATION-GUIDE.md`**
    - Purpose-based naming
    - Grouped translations
    - References guides for text detection

---

## Refactoring Plan

### Keep As-Is (Single Source of Truth)

✅ `SKETCH-TEXT-ANALYSIS-GUIDE.md` - Master guide with all rules
✅ `SKETCH-TEXT-QUICK-REFERENCE.md` - Quick reference
✅ `SKETCH-TEXT-STRATEGY.md` - Strategy guide

### Refactor (Remove Duplication, Add References)

**`TEXT-DETECTION-PRIORITY.md`:**

- Keep: Detection logic (pairs vs single)
- Remove: Detailed analysis rules (thickness → weight, spacing → size)
- Add: Reference to master guide

**`heading-text.md`:**

- Keep: Workflow steps
- Remove: Duplicate explanations of analysis rules
- Add: Reference to master guide
- Show: Example output only

**`object-router.md`:**

- Keep: Routing logic
- Remove: Any duplicate analysis
- Add: Reference to TEXT-DETECTION-PRIORITY.md

**`WDS-SPECIFICATION-PATTERN.md`:**

- Keep: Examples
- Add: Note "See SKETCH-TEXT-ANALYSIS-GUIDE.md for how these values were derived"

**`TRANSLATION-ORGANIZATION-GUIDE.md`:**

- Keep: Organization patterns
- Add: Reference to master guide for analysis

---

## Benefits

✅ **Single Source of Truth** - One place to update analysis rules
✅ **No Redundancy** - Each file has clear purpose
✅ **Easy Maintenance** - Update once, references everywhere
✅ **Clear Hierarchy** - Master guide → specialized docs
✅ **Reduced File Size** - Instruction files become smaller and focused

---

## Reference Pattern

In instruction files, use this pattern:

```markdown
<output>Analyzing text markers in sketch...</output>

<action>Apply text marker analysis rules from SKETCH-TEXT-ANALYSIS-GUIDE.md:

- Count pairs → number of lines
- Measure thickness → font weight
- Measure spacing → font size estimate
- Check position → alignment
- Calculate length → character capacity
  </action>

<output>**Sketch Analysis:**

- 2 line pairs → 2 lines of text
- Thick lines (3px) → Bold weight
- Spacing (24px) → ~42px font size estimate
- Centered position → Center alignment
- ~35 characters per line

For detailed analysis rules, see: SKETCH-TEXT-ANALYSIS-GUIDE.md</output>
```

---

## Status

**To Do:**

- [ ] Refactor TEXT-DETECTION-PRIORITY.md
- [ ] Refactor heading-text.md
- [ ] Refactor object-router.md
- [ ] Add references in WDS-SPECIFICATION-PATTERN.md
- [ ] Add references in TRANSLATION-ORGANIZATION-GUIDE.md

**Result:** Clean, maintainable documentation architecture! 🎯
