# Quick Reference: Sketch Text Analysis

**The Correct Interpretation**

---

## Step 0: Establish Scale (Holistic View)

**Before analyzing specific text, scan the ENTIRE sketch to establish scale.**

1. **Find UI Anchors:** Look for standard UI elements (Browser chrome, Scrollbars, Buttons, Icons).
2. **Check Project References:** Look at other sketches in the same project for established text styles.
3. **Determine Base Unit:** If a Scrollbar is "Standard Width" (e.g., 16px), how big is everything else relative to it?
4. **Calibrate:** Use these known objects to calibrate your eye for this specific image resolution.

### Cross-Page Reference Strategy

**If body text was defined on the Start Page:**

- Start Page body text: Spacing matches icon size → 16px Regular
- **Current page:** Similar thin lines with icon-sized spacing → **Same: 16px Regular**

**Benefits:**

- ✅ Maintains visual consistency across pages
- ✅ Builds design system patterns naturally
- ✅ Reduces guesswork on subsequent pages
- ✅ Creates coherent user experience

**When to use:**

- Body text, captions, button labels (common across pages)
- Navigation items (should be identical)
- Form labels and inputs (standardized patterns)

---

## The Two Key Measurements

### 1. Line Thickness = Font Weight (Relative)

**Compare lines against each other in the sketch:**

```
═══════════════════  ← Thicker than others = Bold (700)
───────────────────  ← Medium thickness = Medium (500)
─────────────────────  ← Thinnest lines = Regular (400)
```

**Rule:** Relative thickness indicates hierarchy, not absolute pixels.

### 2. Vertical Spacing = Font Size (Context-Based)

**Estimate size by comparing to known UI elements:**

```
[ Button ]           ← Standard height ref (~40-48px)
   ↕
═══════════════════  ← Matches button height? ~40-48px (Large Heading)
      ↕
═══════════════════
```

**Context Anchors:**

- **Browser Address Bar**: ~40px height
- **Standard Button**: ~40-48px height
- **Cursor/Icon**: ~16-24px size
- **Scrollbar**: ~16px width

**Rule:** Use these anchors to estimate the scale of text spacing.

**Note:** Visual size ≠ Semantic HTML (H1/H2/H3). Heading levels are determined by document structure, not appearance.

---

## Complete Analysis Pattern

### Example: Hero Headline

**Sketch:**

```
═══════════════════════════════  ← Line 1: Thickest lines in sketch
                                  ↕ Spacing ≈ Same as button height
═══════════════════              ← Line 2: Thickest lines in sketch
```

**Analysis:**

- **Context:** Spacing looks similar to the "Sign In" button height nearby.
- **Inference:** If button is ~48px, this font is ~48px (Large Heading).
- **Weight:** Thicker than body text markers → **Bold**.
- **Result:** `font: bold 48px / 1.2`

---

## Common Patterns

### Large Heading (Page Title)

```
═══════════════════  ← Thickest lines
      ↕
═══════════════════
```

- **Clue:** Spacing matches Address Bar height (~40px)
- **Est:** ~40-48px, Bold

### Medium Heading (Section Title)

```
═══════════════════  ← Medium-Thick lines
      ↕
═══════════════════
```

- **Clue:** Spacing is slightly less than button height
- **Est:** ~32px, Semibold

### Body Text (Paragraph)

```
─────────────────────  ← Thinnest lines
    ↕
─────────────────────
```

- **Clue:** Spacing matches scrollbar width or small icon (~16-24px)
- **Est:** ~16px, Regular

---

## ⚠️ Confusion Warning

### Text (Normal)

```
═══════════════════
    ↕ Spacing < 2x Button Height
═══════════════════
```

✅ Likely TEXT

### Image/Box (Too Large)

```
═══════════════════


    ↕ Spacing > 2x Button Height


═══════════════════
```

❓ Likely IMAGE or CONTAINER

**Rule:** If spacing seems disproportionately large compared to UI elements, verify!

---

## Quick Decision Tree

```
See horizontal lines?
    │
    ├─ Compare THICKNESS (Relative)
    │   └─ Thicker than avg? → Bold
    │   └─ Thinner than avg? → Regular
    │
    ├─ Compare DISTANCE (Context)
    │   └─ Matches Button Height? → Large Heading (~40-48px)
    │   └─ Matches Icon Size? → Body Text (~16-24px)
    │   └─ Huge Gap? → Image/Container
    │
    └─ Check Context Anchors
        └─ Address Bar, Scrollbar, Buttons
```

---

## Memory Aid

**THICKNESS = RELATIVE WEIGHT**
**CONTEXT = SCALE**

Think of it like looking at a map:

- Use the scale key (buttons, bars) to measure distances.
- Don't guess miles (pixels) without a reference!

---

## Real Dog Week Example

```
═══════════════════════════════  ← Thickest lines
                                  ↕ Matches "Sign In" button height
═══════════════════              ← Thickest lines
```

**Analysis:**

- Thickness: Bold (relative to body lines)
- Distance: Matches button (~48px)
- Result: `font: bold 48px / 1.2`

**Content:**

```
EN: "Every walk. on time. Every time."
SE: "Varje promenad. i tid. Varje gång."
```

Both fit in ~50-60 character capacity! ✅

---

**Remember: Context is King! Compare, don't just measure.** 📏✨
