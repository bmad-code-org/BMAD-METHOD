<!-- Powered by BMAD™ Core -->

# ------------------------------------------------------------

# 6. Incorporate Feedback

# ------------------------------------------------------------

---

task:
id: incorporate-feedback
name: Incorporate Feedback
description: Merge beta feedback into manuscript; accept, reject, or revise.
persona_default: editor
inputs:

- draft-manuscript.md
- beta-notes.md
  steps:
- Summarize actionable changes.
- Apply revisions inline.
- Mark resolved comments.
  output: polished-manuscript.md
  ...
