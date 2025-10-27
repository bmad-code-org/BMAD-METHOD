<!-- Powered by BMAD™ Core -->

# ------------------------------------------------------------

# 5. Provide Feedback (Beta)

# ------------------------------------------------------------

---

task:
id: provide-feedback
name: Provide Feedback (Beta)
description: Simulate beta‑reader feedback using beta-feedback-form-tmpl.
persona_default: beta-reader
inputs:

- draft-manuscript.md | chapter-draft.md
  steps:
- Read provided text.
- Fill feedback form objectively.
- Save as beta-notes.md or chapter-notes.md.
  output: beta-notes.md
  ...
