---
name: 'step-03-visual-dna'
description: 'Analyze colors, typography, spacing, imagery, and component visual styles'
nextStepFile: './step-04-content-dna.md'
---

# Step 3: Visual DNA

## STEP GOAL
Extract the complete visual language: color palette, typography scale, spacing rhythm, imagery style, and component visual patterns. Capture each section with dual embeddings.

## MANDATORY SEQUENCE

### 1. Color Palette Extraction
Extract computed styles via JavaScript:
- All unique background colors
- All unique text colors
- Section-by-section color mapping
- Identify: primary, secondary, accent, neutral colors
- Note the color rhythm across sections

Capture with `capture_knowledge`:
```
category: "design_system_evolution"
topics: ["color-palette", "visual-dna", "design-tokens"]
```

### 2. Typography Scale
Extract font information:
- Font families (primary, secondary, accent)
- Weight scale (which weights are used where)
- Size scale (H1, H2, body, nav, small text)
- Line heights and letter-spacing
- Any notable anti-patterns or distinctive choices

Capture as knowledge entry.

### 3. Spacing & Rhythm
Analyze spacing patterns:
- Section vertical padding
- Grid gaps
- Content max-width
- Breathing room patterns
- Separator styles (waves, lines, gradients)

### 4. Section-by-Section Visual Capture
For EACH major section, scroll to it and:

a. Take a screenshot (1440px wide, clip to section height or 900px max)
b. Write a 200-400 word semantic description covering:
   - Layout structure
   - Color usage
   - Typography choices
   - Component patterns
   - Visual hierarchy
   - Design decisions and WHY they work
c. Capture with `capture_visual`:
   ```
   content: "[detailed description]"
   image_base64: "[screenshot]"
   category: "successful_pattern"
   pattern_type: "baseline" or "inspiration"
   topics: [section-specific tags]
   components: [section-specific components]
   ```

**IMPORTANT:** Wait 25 seconds between `capture_visual` calls to respect Voyage AI rate limits on free tier.

### 5. Icon & Illustration System
If the site uses icons or illustrations:
- Document the style (line-art, filled, hand-drawn, 3D)
- Note consistency patterns
- Identify brand personality expressed through illustration style

## SUCCESS
- Complete color palette documented with RGB values
- Typography scale extracted
- Every section captured with dual embedding
- Visual patterns identified and tagged

→ Load next: `./step-04-content-dna.md`
