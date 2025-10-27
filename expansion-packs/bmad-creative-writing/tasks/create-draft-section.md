<!-- Powered by BMAD™ Core -->

# ------------------------------------------------------------

# 4. Create Draft Section (Chapter)

# ------------------------------------------------------------

---

task:
id: create-draft-section
name: Create Draft Section
description: Draft a complete chapter or scene using the chapter-draft-tmpl.
persona_default: editor
inputs:

- story-outline.md | snowflake-outline.md | scene-list.md | release-plan.md
  parameters:
  chapter_number: integer
  steps:
- Extract scene beats for the chapter.
- Draft chapter using template placeholders.
- Highlight dialogue blocks for later polishing.
  output: chapter-{{chapter_number}}-draft.md
  ...
