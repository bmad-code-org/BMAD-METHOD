<!-- Powered by BMAD™ Core -->

# ------------------------------------------------------------

# tasks/assemble-kdp-package.md

# ------------------------------------------------------------

---

task:
id: assemble-kdp-package
name: Assemble KDP Cover Package
description: Compile final instructions, assets list, and compliance checklist for Amazon KDP upload.
persona_default: cover-designer
inputs:

- cover-brief.md
- cover-prompts.md
  steps:
- Calculate full‑wrap cover dimensions (front, spine, back) using trim size & page count.
- List required bleed and margin values.
- Provide layout diagram (ASCII or Mermaid) labeling zones.
- Insert ISBN placeholder or user‑supplied barcode location.
- Populate back‑cover content sections (blurb, reviews, author bio).
- Export combined PDF instructions (design-package.md) with link placeholders for final JPEG/PNG.
- Execute kdp-cover-ready-checklist; flag any unmet items.
  output: design-package.md
  ...
