# Step 2: Page Visualization

**Purpose:** Ensure the sketch/visualization is present, properly referenced, and analyzed for completeness.

---

## What Page Visualization Provides

**For Designers:**
- Visual reference for all specifications
- Clear picture of layout and composition
- Design intent and aesthetic direction

**For Developers:**
- Visual target for implementation
- Layout and spacing reference
- Component placement understanding

**For Team Communication:**
- Shared visual language
- Quick page understanding without reading full spec
- Design evolution documentation

---

## Standard Format

### Required Elements

**Sketch Location:**
- Embedded in navigation section (Step 1)
- Located in `/sketches/` subfolder
- Named following convention: `[scenario]-[page]-[variant]-[device].jpg`

**Sketch Reference:**
```markdown
![Descriptive Alt Text](sketches/sketch-filename.jpg)
```

**Additional Sketch Documentation (Optional):**
```markdown
## Sketch Information

**Sketch File:** `sketches/[filename].jpg`  
**Device:** Desktop / Mobile / Tablet  
**Variant:** Concept / Iteration 1 / Final  
**Date:** YYYY-MM-DD  
**Designer:** [Name]

**Sketch Notes:**
- [Any specific notes about the sketch]
- [Incomplete sections marked as TBD]
- [Design decisions or rationale]
```

---

## Format Example (Fictional Project)

```markdown
### 1.1 Home Page

**Next Step**: → [1.2 Features](../1.2-features/1.2-features.md)

![Home Page Desktop Concept](sketches/1-1-home-page-desktop-concept.jpg)

**Next Step**: → [1.2 Features](../1.2-features/1.2-features.md)

# 1.1 Home Page
```

**Note:** The sketch is embedded in the navigation section without additional documentation. This is the minimal acceptable format.

---

## Creation Instructions

<if condition="Creating new specification">

### Ensure Sketch Exists

1. **Check for sketch file:**
   - Look in `/sketches/` subfolder of page directory
   - Verify file exists and is accessible
   - Check file format (JPG, PNG acceptable)

2. **Verify sketch is embedded in navigation:**
   - Already handled in Step 1
   - Sketch should be between the two "Next Step" links

3. **Analyze sketch completeness:**
   - Is entire page visible or only sections?
   - Are all sections clearly defined?
   - Is text readable or represented?
   - Are states/variants shown (hover, active, etc.)?

### Document Sketch Status (Optional)

<output>
If sketch is incomplete or requires notes, add a sketch documentation section after navigation:

```markdown
## Sketch Information

**Sketch File:** `sketches/{filename}.jpg`  
**Device:** {Desktop/Mobile/Tablet}  
**Variant:** {Concept/Iteration/Final}  
**Date:** {YYYY-MM-DD}

**Sketch Notes:**
- {Note about incomplete sections}
- {Note about design decisions}
- {Note about variants or states not shown}
```

**Most projects:** Skip this optional section unless sketch requires clarification.
</output>

</if>

---

## Quality Check Instructions

<if condition="Analyzing existing specification">

### Visualization Checklist

Run through each item. Report any failures.

**Sketch File Validation:**

- [ ] **Sketch file exists** in specified location
- [ ] **Sketch path is correct** in navigation section (from Step 1)
- [ ] **File format is appropriate** (JPG, PNG, WebP acceptable)
- [ ] **File size is reasonable** (<5MB for web viewing)
- [ ] **Sketch is embedded** between the two "Next Step" links (validated in Step 1)

**Sketch Quality:**

- [ ] **Image is viewable** (not corrupted)
- [ ] **Resolution is sufficient** (text readable, elements identifiable)
- [ ] **Full page visible** or clearly marked sections
- [ ] **Device/viewport clear** (desktop, mobile, tablet)

**Sketch Completeness:**

- [ ] All major **sections are visible**
- [ ] **Layout and spacing** are clear
- [ ] **Text content** is readable or clearly represented
- [ ] **Interactive elements** (buttons, inputs) are identifiable
- [ ] **Incomplete sections** are marked or noted

**Documentation (Optional):**

- [ ] If sketch incomplete: **Notes explain what's TBD**
- [ ] If multiple variants exist: **Which variant this represents**
- [ ] If design evolved: **Version or iteration number**

### Sketch Analysis Output

<output>
**Sketch Analysis:**

**Visible Sections:**
1. [List all sections visible in sketch]
2. [E.g., Header, Hero, Features, Footer]

**Incomplete or Unclear Elements:**
- [List any elements that are unclear or missing]
- [E.g., "Right column content is blank"]
- [E.g., "Footer text not readable"]

**Sketch Completeness:** {X}% (estimated coverage of full page)

**Recommendation:**
- [Suggest if sketch is sufficient for specification]
- [Note if updated sketch is needed before proceeding]
</output>

### Report Format

<output>
**Page Visualization Quality Report**

**Status:** ✅ PASS / ⚠️ INCOMPLETE SKETCH / ❌ FAIL

**File Issues:**
- [Sketch file missing?]
- [Path incorrect?]
- [File corrupted?]

**Quality Issues:**
- [Resolution too low?]
- [Elements not identifiable?]

**Completeness Issues:**
- [Sections missing or blank?]
- [Text not readable?]
- [States/variants needed but not shown?]

**Recommendations:**
- [Specific actions needed]
</output>

</if>

---

## Common Errors to Avoid

**❌ Don't:**
- Proceed without a sketch (specifications need visual reference)
- Use sketches with unreadable text or unclear elements
- Forget to place sketch in `/sketches/` subfolder
- Use inconsistent naming (breaks path references)
- Include multiple pages in one sketch (confuses specifications)
- Use extremely large files (>5MB, slows down viewing)

**✅ Do:**
- Ensure sketch exists before creating specifications
- Use clear, readable sketches (sufficient resolution)
- Follow naming convention consistently
- Keep one page per sketch file
- Optimize file size for web viewing
- Mark incomplete sections clearly in sketch or notes

---

## Example Scenarios

### ❌ Incorrect: Missing sketch

```markdown
### 1.1 Home Page

**Next Step**: → [1.2 Features](../1.2-features/1.2-features.md)

# 1.1 Home Page

The home page serves as...
```

**Issues:**
- No sketch embedded between "Next Step" links
- Specifications will be created without visual reference
- Team has no shared visual understanding

### ✅ Correct: Sketch properly embedded

```markdown
### 1.1 Home Page

**Next Step**: → [1.2 Features](../1.2-features/1.2-features.md)

![Home Page Desktop Concept](sketches/1-1-home-page-desktop-concept.jpg)

**Next Step**: → [1.2 Features](../1.2-features/1.2-features.md)

# 1.1 Home Page
```

**Strengths:**
- Sketch properly embedded
- Descriptive alt text
- Follows naming convention
- Located in `/sketches/` subfolder

---

### ⚠️ Acceptable: Incomplete sketch with documentation

```markdown
### 2.1 Dashboard

**Next Step**: → [2.2 Analytics](../2.2-analytics/2.2-analytics.md)

![Dashboard Page - Partial](sketches/2-1-dashboard-desktop-concept.jpg)

**Next Step**: → [2.2 Analytics](../2.2-analytics/2.2-analytics.md)

# 2.1 Dashboard

## Sketch Information

**Sketch File:** `sketches/2-1-dashboard-desktop-concept.jpg`  
**Device:** Desktop  
**Variant:** Initial Concept  
**Date:** 2025-12-28

**Sketch Notes:**
- Header and navigation fully defined
- Main widget area is placeholder - to be defined in next iteration
- Sidebar navigation complete
- Footer section not yet sketched - TBD

**Completeness:** ~65% - Sufficient to begin header and navigation specifications
```

**When to use:**
- Sketch is incomplete but sufficient to start specs
- Clear documentation of what's TBD
- Team agreement to proceed incrementally

---

## Next Step

<action>Load and execute: step-03-page-overview.md</action>

