<!-- Powered by BMAD™ Core -->

# ------------------------------------------------------------

# 10. Generate Scene List

# ------------------------------------------------------------

---

task:
id: generate-scene-list
name: Generate Scene List
description: Break synopsis into a numbered list of scenes.
persona_default: plot-architect
inputs:

- synopsis.md | story-outline.md
  steps:
- Identify key beats.
- Fill scene-list-tmpl table.
  output: scene-list.md
  ...
