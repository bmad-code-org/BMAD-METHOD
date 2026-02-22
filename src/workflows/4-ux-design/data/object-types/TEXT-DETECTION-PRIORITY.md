# Text Detection Priority Rules

**For Object Router - Always Check for Text FIRST**

---

## Critical Rule: Text Markers = PAIRS of Lines

**✅ Text = Two horizontal lines together** (representing one line of text)

```
═══════════════════════════  ← Line 1 of pair
═══════════════════════════  ← Line 2 of pair = ONE line of text
```

**❌ Single line alone = NOT text** (it's a decorative element)

```
═══════════════════════════  ← SINGLE LINE = divider, border, underline (NOT text)
```

**Important Exception:** Very schematic sketches or miniatures (rare cases) might use single lines for text, but the default assumption should be: **single line = decorative element**.

---

## Why Text Detection is First

Text elements are the most common objects in sketches, and they have a distinctive visual signature (horizontal line pairs). Detecting them first:

- ✅ Reduces confusion
- ✅ Routes to text-specific analysis immediately
- ✅ Ensures character capacity is calculated
- ✅ Prevents misidentification as other elements

---

## Text Detection Signatures

### Text Markers (Paired Lines)

**1 line of heading text (ONE PAIR = ONE TEXT LINE):**

```
═══════════════════════════  ← Thick pair line 1
═══════════════════════════  ← Thick pair line 2 = ONE text line
```

**2 lines of heading text (TWO PAIRS = TWO TEXT LINES):**

```
═══════════════════════════  ← Pair 1 line 1
═══════════════════════════  ← Pair 1 line 2 = Text line 1
                                Small gap
═══════════════════════════  ← Pair 2 line 1
═══════════════════════════  ← Pair 2 line 2 = Text line 2
```

**4 lines of body text (FOUR PAIRS = FOUR TEXT LINES):**

```
─────────────────────────────  ← Pair 1
─────────────────────────────

─────────────────────────────  ← Pair 2
─────────────────────────────

─────────────────────────────  ← Pair 3
─────────────────────────────

─────────────────────────────  ← Pair 4
─────────────────────────────
```

**Label (short text, ONE PAIR = ONE TEXT LINE):**

```
══════════  ← Short pair line 1
══════════  ← Short pair line 2 = ONE short text line
```

### NOT Text Markers (Single Lines = Decorative Elements)

**❌ Horizontal divider (`<hr>`):**

```
═══════════════════════════  ← SINGLE LINE = section divider
```

**❌ Underline (decorative):**

```
Main Heading
─────────────────────────────  ← SINGLE LINE = decorative underline
```

**❌ Border line:**

```
___________________________  ← SINGLE LINE = top/bottom border
```

**❌ Separator:**

```
Section 1 content...

───────────────────────────── ← SINGLE LINE = visual separator

Section 2 content...
```

---

## Detection Logic

### Step 1: Look for Paired Horizontal Lines

```
IF horizontal lines come in pairs (2 lines close together):
  → TEXT MARKER
  → Count pairs to get number of text lines
  → Route to heading-text.md

ELSE IF single horizontal line:
  → DECORATIVE ELEMENT (divider, border, underline)
  → Document as visual element, not text

ELSE IF sees button shape (box with text):
  → BUTTON
  → Route to button.md

ELSE IF sees input box (rectangular border):
  → INPUT FIELD
  → Route to text-input.md

... etc
```

### Step 2: Analyze Text Marker Pairs

**Once text markers are detected, route to `heading-text.md` for complete analysis.**

The detailed analysis rules are documented in **`guides/SKETCH-TEXT-ANALYSIS-GUIDE.md`**, which covers:

- Line thickness → font weight
- Line spacing between pairs → font size
- Line position in container → text alignment
- Line count → number of text lines
- Line length → character capacity

**This file focuses on DETECTION only. For ANALYSIS, see `guides/SKETCH-TEXT-ANALYSIS-GUIDE.md`.**

---

## Text vs. Other Elements

### ✅ Text Element (Horizontal Line PAIRS)

```
═══════════════════════════  ← Pair indicating text
═══════════════════════════

─────────────────────────────  ← Another pair
─────────────────────────────
```

**Detection:** Lines come in pairs, parallel, evenly spaced
**Route to:** `heading-text.md`

### ❌ NOT Text - Decorative Line (SINGLE)

```
═══════════════════════════  ← Single line alone
```

**Detection:** Single horizontal line, no pair
**Type:** Divider, border, separator, underline
**Action:** Document as decorative visual element

### ❌ NOT Text - Button

```
┌─────────────────┐
│  Button Label   │  ← Box with centered text inside
└─────────────────┘
```

**Detection:** Rectangle with text inside, clickable appearance
**Route to:** `button.md`

### ❌ NOT Text - Input Field

```
┌───────────────────────────┐
│ Placeholder text...       │  ← Box with light text inside
└───────────────────────────┘
```

**Detection:** Rectangle with subtle border, input appearance
**Route to:** `text-input.md`

### ❌ NOT Text - Image

**WDS Best Practice: Sketch the actual image content**

```
┌─────────────────┐
│   ~  ~  ~       │  ← Sketch of clouds (hero image background)
│  ~     ~    ~   │
└─────────────────┘

┌─────────────────┐
│   ◠  ◠          │  ← Sketch of face/person (profile photo)
│     ᵕ           │
└─────────────────┘

┌─────────────────┐
│    /\  /\       │  ← Sketch of mountains/landscape
│   /  \/  \      │
└─────────────────┘
```

**WDS Recommends:**

- ✅ **Draw what the image shows** - Sketch the actual content (person, landscape, product)
- ✅ **Use soft shapes** - Clouds, waves, organic shapes for abstract images
- ❌ **Avoid "X" markers** - Too intrusive and provides no content guidance

**Why?** Sketching actual image content:

- Provides visual direction and context
- Helps with AI interpretation of image purpose
- Guides content selection and art direction
- More inspiring and communicative than placeholder X

**Detection:** Rectangle containing sketch/drawing, not text markers
**Route to:** `image.md`

### ❌ NOT Text - Link (Often With Text)

```
══════════  ← Text pair (the link text)
══════════
    ↑ underline indicator or different color
```

**Detection:** Text with underline or special formatting indicating clickability
**Route to:** `link.md` (which handles the text content)

---

## Detection Algorithm (Pseudo-code)

```python
def detect_object_type(sketch_element):
    """
    Always check for text FIRST before other object types
    """

    # Step 1: Check for horizontal line pairs (TEXT)
    if has_horizontal_lines(sketch_element):
        lines = get_horizontal_lines(sketch_element)
        pairs = group_lines_into_pairs(lines, max_distance=4px)

        if len(pairs) > 0:
            # This is text! Count pairs = text lines
            text_line_count = len(pairs)

            # Analyze each pair
            for pair in pairs:
                thickness = measure_line_thickness(pair)
                spacing = measure_spacing_between_pairs(pairs)

                font_weight = thickness_to_weight(thickness)
                font_size = spacing_to_size(spacing)

            return route_to("heading-text.md", {
                "line_count": text_line_count,
                "font_weight": font_weight,
                "font_size_estimate": font_size
            })

        elif len(lines) == 1:
            # Single line = decorative element
            return {
                "type": "decorative_line",
                "purpose": "divider or border"
            }

    # Step 2: Check for other object types
    if has_button_shape(sketch_element):
        return route_to("button.md")

    if has_input_box_shape(sketch_element):
        return route_to("text-input.md")

    if has_image_placeholder(sketch_element):
        return route_to("image.md")

    # ... etc
```

---

## Examples from Dog Week

### Example 1: Hero Headline

**Sketch:**

```
═══════════════════════════════  ← Thick pair detected
═══════════════════════════════
```

**Detection:**

- ✅ **Pair detected** → This is TEXT
- **Route to:** `heading-text.md` for detailed analysis

**For complete analysis of thickness, spacing, size, see:** `guides/SKETCH-TEXT-ANALYSIS-GUIDE.md`

---

### Example 2: Supporting Paragraph

**Sketch:**

```
─────────────────────────────────────────  ← Thin pairs detected
─────────────────────────────────────────

─────────────────────────────────────────
─────────────────────────────────────────
```

**Detection:**

- ✅ **2 pairs detected** → This is TEXT (2 lines)
- **Route to:** `heading-text.md` for detailed analysis

**For complete analysis of thickness, spacing, size, see:** `guides/SKETCH-TEXT-ANALYSIS-GUIDE.md`

---

### Example 3: Divider Line (NOT TEXT)

**Sketch:**

```
Section 1 content...

───────────────────────────────────────── ← Single line

Section 2 content...
```

**Detection:**

- ❌ **Single line detected** (no pair) → NOT text
- **Type:** Decorative `<hr>` element

---

## Key Takeaways

### Detection Rules (This File)

1. **Text markers ALWAYS come in pairs** (two lines = one text line)
2. **Single lines are decorative** (dividers, borders, underlines)
3. **Detect text FIRST** before checking for other object types
4. **Count pairs to get text line count** (3 pairs = 3 lines of text)

### Analysis Rules (See guides/SKETCH-TEXT-ANALYSIS-GUIDE.md)

5. **Line thickness → font weight**
6. **Spacing between pairs → font size**
7. **Line position → text alignment**
8. **Line length → character capacity**

---

## Related Documentation

- **`guides/SKETCH-TEXT-ANALYSIS-GUIDE.md`** ← Complete analysis rules (MASTER GUIDE)
- **`heading-text.md`** ← Text object instruction file (uses analysis rules)
- **`guides/SKETCH-TEXT-QUICK-REFERENCE.md`** ← Quick lookup table

---

**This file: DETECTION logic. For detailed ANALYSIS rules, see guides/SKETCH-TEXT-ANALYSIS-GUIDE.md** 🎯
