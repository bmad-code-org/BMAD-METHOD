# Site Analysis Categories

Reference for what to capture and how to tag it during site analysis.

## DNA Layers

| Layer | What It Captures | Primary Category |
|-------|-----------------|-----------------|
| Structural DNA | Navigation, layout, IA, page types | `successful_pattern` |
| Visual DNA | Colors, typography, spacing, imagery | `design_system_evolution` |
| Content DNA | Voice, messaging, CTAs, content blocks | `successful_pattern` |

## Tagging Convention

### Topics (always include)
- `site-analysis` — marks this as analysis-derived
- `structural-dna` / `visual-dna` / `content-dna` — which layer
- Domain-specific: `navigation`, `typography`, `color-palette`, `cta`, `brand-voice`, etc.

### Components (when applicable)
- `hero-banner`, `sticky-header`, `card-grid`, `testimonial`, `footer`, etc.
- Use the component name as it appears in the design, not generic terms

### Pattern Type
- `baseline` — the current state of the analyzed site
- `inspiration` — a pattern worth borrowing for other projects

### Source
- Always: `source: "site-analysis"`
- Include `source_file` with the URL analyzed

## Quality Examples

### Good Visual Capture
```
content: "Hero section uses full-width navy (#0a1628) background with centered
  white text. H1 is Rubik Light (300) at ~48px, creating an elegant weight
  contrast against the dark background. CTA button uses coral accent (#e8734a)
  with generous padding (16px 32px) and subtle border-radius (4px). The
  breathing room between heading, subtext, and CTA creates a calm, confident
  hierarchy. Works because the light font weight signals sophistication while
  the coral CTA creates a clear focal point."
category: "successful_pattern"
pattern_type: "baseline"
topics: ["hero", "visual-dna", "dark-theme", "site-analysis"]
components: ["hero-banner", "cta-button", "heading-h1"]
```

### Good Knowledge Capture
```
content: "Whiteport uses a deliberate color rhythm across sections: dark navy
  → light grey → white → navy → grey. This creates natural visual breaks
  without separator elements. The rhythm feels intentional, not random —
  each color shift signals a new topic area. The alternation prevents
  visual fatigue on what is a long single-page site (6000px+)."
category: "successful_pattern"
topics: ["color-rhythm", "structural-dna", "site-analysis", "visual-pacing"]
```
