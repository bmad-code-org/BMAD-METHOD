<!-- Powered by BMAD™ Core -->

# ------------------------------------------------------------

# 11. Outline Scenes

# ------------------------------------------------------------

---

task:
id: outline-scenes
name: Outline Scenes
description: Group scene list into chapters with act structure.
persona_default: plot-architect
inputs:

- scene-list.md
  steps:
- Assign scenes to chapters.
- Produce snowflake-outline.md with headings per chapter.
  output: snowflake-outline.md
  ...
