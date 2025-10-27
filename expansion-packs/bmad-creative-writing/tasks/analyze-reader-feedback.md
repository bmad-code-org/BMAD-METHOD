<!-- Powered by BMAD™ Core -->

# ------------------------------------------------------------

# 16. Analyze Reader Feedback

# ------------------------------------------------------------

---

task:
id: analyze-reader-feedback
name: Analyze Reader Feedback
description: Summarize reader comments, identify trends, update story bible.
persona_default: beta-reader
inputs:

- publication-log.md
  steps:
- Cluster comments by theme.
- Suggest course corrections.
  output: retro.md
  ...
