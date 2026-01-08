# Cross-Page Consistency Strategy

**Maintaining Visual Coherence Across Project Sketches**

---

## Core Principle

**Text that looks similar and serves the same role should have the same specification across all pages.**

This creates:

- ✅ Consistent user experience
- ✅ Natural design system patterns
- ✅ Faster specification process
- ✅ Professional, cohesive design

---

## Workflow: Multi-Page Projects

### Page 1: Start Page (Establish Baseline)

**First page analyzed - establish reference patterns:**

```
Start Page Analysis:
├─ Body Text: Thin lines, icon-sized spacing → 16px Regular
├─ Button Labels: Medium lines → 16px Semibold
├─ Page Title: Thick lines, button-height spacing → 48px Bold
├─ Navigation: Medium lines, small spacing → 14px Medium
└─ Caption: Thinnest lines, half-icon spacing → 12px Regular
```

**These become your reference anchors for subsequent pages.**

---

### Page 2: About Page (Apply Patterns)

**When analyzing the About Page sketch:**

#### Step 1: Check Previous Pages

```
Agent: "I see you've already analyzed the Start Page.
I'll use those text styles as reference points."
```

#### Step 2: Match Visual Patterns

```
About Page body text:
- Thin lines ✓
- Icon-sized spacing ✓
- Left-aligned ✓

→ Matches Start Page body text pattern
→ Apply same spec: 16px Regular
```

#### Step 3: Confirm with Designer

```
Agent: "This body text looks identical to Start Page body text.
Should I use the same specification (16px Regular)?"

Designer: "Yes!" or "No, make it 18px"
```

---

## Pattern Matching Rules

### When to Apply Same Specification

**Match if ALL criteria align:**

1. **Visual Similarity**
   - Line thickness matches (relative to other elements)
   - Spacing matches (relative to UI anchors)
   - Alignment matches

2. **Functional Role**
   - Serves same purpose (e.g., both are body paragraphs)
   - Same content type (e.g., both are descriptions)
   - Same hierarchy level

3. **Context**
   - Similar page sections (e.g., both in main content area)
   - Similar surrounding elements

### When to Create New Specification

**Create new spec if:**

- Visual appearance differs (thicker lines, different spacing)
- Functional role differs (e.g., one is a quote, one is body text)
- Designer explicitly requests different styling
- Context requires emphasis/de-emphasis

---

## Design System Integration

### Automatic Pattern Building

As you analyze pages, WDS naturally builds design system patterns:

```
Project: Dog Week

Text Styles Identified:
├─ heading-xl: 48px Bold (Page titles)
├─ heading-lg: 36px Bold (Section headings)
├─ heading-md: 24px Semibold (Subsection headings)
├─ body-text: 16px Regular (Paragraphs)
├─ button-label: 16px Semibold (All buttons)
├─ caption: 12px Regular (Helper text)
└─ nav-item: 14px Medium (Navigation)

Components Identified:
├─ Feature Card (used on Start, Features, About pages)
├─ Navigation Bar (used on all pages)
├─ Footer (used on all pages)
└─ CTA Button (used on Start, Pricing pages)
```

### Benefits

**Without explicit design system:**

- Maintains consistency through pattern recognition
- Reduces specification time (reference previous pages)
- Creates professional, cohesive experience

**With explicit design system:**

- Automatically maps to existing components
- Validates sketch against design system
- Suggests design system updates when new patterns emerge

---

## Agent Behavior Examples

### Example 1: Exact Match

```
Agent: "I'm analyzing the Contact Page body text.

Visual Analysis:
- Line thickness: Thinnest (matches Start Page body text)
- Spacing: Icon-sized (matches Start Page body text)
- Alignment: Left (matches Start Page body text)

Pattern Match: Start Page body text (16px Regular)

Should I use the same specification?"

Designer: "Yes, keep it consistent."

Agent: "✅ Applied: 16px Regular (consistent with Start Page)"
```

### Example 2: Intentional Variation

```
Agent: "I'm analyzing the Testimonial Quote text.

Visual Analysis:
- Line thickness: Medium (thicker than body text)
- Spacing: Slightly larger than body text
- Alignment: Center (different from body text)

This looks different from body text. Should this be:
1. New style: 18px Medium, center-aligned (emphasis)
2. Same as body: 16px Regular (consistency)

Your choice?"

Designer: "Option 1 - quotes should stand out."

Agent: "✅ Created new style: testimonial-quote (18px Medium)"
```

### Example 3: Component Recognition

```
Agent: "I'm analyzing the Features section on the Pricing Page.

Component Match Detected:
- Layout: 3-column card grid ✓
- Card structure: Icon + Title + Description ✓
- Visual style: Matches Features section from Start Page ✓

This looks like the same 'Feature Card' component.
Should I:
1. Reference existing component (recommended)
2. Create page-specific version

Your choice?"

Designer: "Option 1 - it's the same component."

Agent: "✅ Referenced: Feature Card component (defined on Start Page)"
```

---

## Best Practices

### For Designers

1. **Be Consistent in Sketches**
   - Use same line thickness for same text types
   - Use same spacing patterns across pages
   - Helps AI recognize patterns automatically

2. **Confirm Pattern Matches**
   - When AI suggests pattern match, verify it's intentional
   - Speak up if variation is desired

3. **Build Design System Gradually**
   - First few pages establish patterns
   - Later pages reference patterns
   - Natural evolution into design system

### For AI Agents

1. **Always Check Previous Pages First**
   - Before analyzing text, look for established patterns
   - Show detected patterns to designer for transparency

2. **Ask, Don't Assume**
   - Even if visual match is strong, confirm with designer
   - Designer may have intentional variation

3. **Track Pattern Usage**
   - Note which pages use which patterns
   - Helps identify true design system components

---

## Implementation in WDS Workflow

### Step 1: Holistic Sketch Reading

```
<action>
1. Check if other pages in project have been analyzed
2. Load established text style patterns
3. Identify UI anchors in current sketch
4. Use previous pages + UI elements to calibrate scale
</action>
```

### Step 2: Pattern Detection

```
<action>
For each text element in current sketch:
1. Analyze visual properties (thickness, spacing, alignment)
2. Compare to established patterns from previous pages
3. If match found → suggest applying same specification
4. If no match → analyze using UI anchors + relative measurements
</action>
```

### Step 3: Designer Confirmation

```
<output>
Text Element: Body paragraph in "About Us" section

Pattern Match: Start Page body text
- Visual: Thin lines, icon-sized spacing ✓
- Functional: Paragraph description ✓
- Specification: 16px Regular

Apply same specification?
</output>

<ask>
1. Yes - Use 16px Regular (consistent)
2. No - I want different styling
</ask>
```

---

## Summary

**Cross-page consistency is achieved through:**

1. **Pattern Recognition** - AI identifies similar visual patterns across pages
2. **Reference Anchors** - First pages establish baseline specifications
3. **Designer Confirmation** - AI suggests matches, designer validates
4. **Natural Design System** - Patterns emerge organically from consistent application

**Result:** Professional, cohesive multi-page designs with minimal specification overhead.
