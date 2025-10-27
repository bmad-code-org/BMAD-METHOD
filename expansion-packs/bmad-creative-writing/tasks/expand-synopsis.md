<!-- Powered by BMAD™ Core -->

# ------------------------------------------------------------

# 8. Expand Synopsis (Snowflake Step 4)

# ------------------------------------------------------------

---

task:
id: expand-synopsis
name: Expand Synopsis
description: Build a 1‑page synopsis from the paragraph summary.
persona_default: plot-architect
inputs:

- premise-paragraph.md
  steps:
- Outline three‑act structure in prose.
- Keep under 700 words.
  output: synopsis.md
  ...
