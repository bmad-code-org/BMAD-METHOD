---
name: 'step-02-structural-dna'
description: 'Analyze navigation, layout patterns, and information architecture'
nextStepFile: './step-03-visual-dna.md'
---

# Step 2: Structural DNA

## STEP GOAL
Capture the site's information architecture, navigation patterns, layout structures, and page type taxonomy.

## MANDATORY SEQUENCE

### 1. Navigation Analysis
- Document the navigation structure (primary, secondary, mobile)
- Note anchor links vs. page links
- Identify the navigation pattern: horizontal, hamburger, sidebar, hybrid
- Check sticky behavior, scroll effects
- Capture with `capture_knowledge`:
  ```
  category: "successful_pattern"
  topics: ["navigation", "information-architecture", ...]
  components: ["sticky-header", "horizontal-nav", ...]
  ```

### 2. Page Structure
- Document the section flow: section names, order, approximate heights
- Identify the color rhythm (which sections are light, dark, accent)
- Note separator patterns (wave SVGs, hard lines, gradients)
- Capture the page structure as a knowledge entry

### 3. Layout Patterns
For each distinct section, identify the layout:
- Grid structure (1-col, 2-col, 3-col, 4-col, masonry)
- Content alignment (centered, left, right)
- Max-width constraints
- Responsive breakpoints if detectable
- Card patterns, list patterns, hero patterns

### 4. Page Type Taxonomy
List all page types available on the site:
- Homepage (single-page or multi-section)
- Product/service pages
- Blog/content pages
- Case study/portfolio pages
- Contact/about pages

### 5. Capture Summary
Use `capture_knowledge` with:
```
category: "successful_pattern"
topics: ["structural-dna", "layout", "information-architecture"]
source: "site-analysis"
```

## SUCCESS
- Navigation pattern documented
- Page structure mapped with color rhythm
- Layout patterns identified per section
- Page types catalogued

→ Load next: `./step-03-visual-dna.md`
