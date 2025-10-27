<!-- Powered by BMAD™ Core -->

# ------------------------------------------------------------

# 15. Publish Chapter

# ------------------------------------------------------------

---

task:
id: publish-chapter
name: Publish Chapter
description: Format and log a chapter release.
persona_default: editor
inputs:

- chapter-final.md
  steps:
- Generate front/back matter as needed.
- Append entry to publication-log.md (date, URL).
  output: publication-log.md
  ...
