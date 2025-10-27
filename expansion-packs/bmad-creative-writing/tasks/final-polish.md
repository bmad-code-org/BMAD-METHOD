<!-- Powered by BMAD™ Core -->

# ------------------------------------------------------------

# 14. Final Polish

# ------------------------------------------------------------

---

task:
id: final-polish
name: Final Polish
description: Line‑edit for style, clarity, grammar.
persona_default: editor
inputs:

- chapter-dialog.md | polished-manuscript.md
  steps:
- Correct grammar and tighten prose.
- Ensure consistent voice.
  output: chapter-final.md | final-manuscript.md
  ...
