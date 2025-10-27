<!-- Powered by BMAD™ Core -->

# ------------------------------------------------------------

# tasks/generate-cover-brief.md

# ------------------------------------------------------------

---

task:
id: generate-cover-brief
name: Generate Cover Brief
description: Interactive questionnaire that captures all creative and technical parameters for the cover.
persona_default: cover-designer
steps:

- Ask for title, subtitle, author name, series info.
- Ask for genre, target audience, comparable titles.
- Ask for trim size (e.g., 6"x9"), page count, paper color.
- Ask for mood keywords, primary imagery, color palette.
- Ask what should appear on back cover (blurb, reviews, author bio, ISBN location).
- Fill cover-design-brief-tmpl with collected info.
  output: cover-brief.md
  ...
