<!-- Powered by BMAD™ Core -->

# ------------------------------------------------------------

# 2. Build World

# ------------------------------------------------------------

---

task:
id: build-world
name: Build World
description: Create a concise world guide covering geography, cultures, magic/tech, and history.
persona_default: world-builder
inputs:

- concept-brief.md
  steps:
- Summarize key themes from concept.
- Draft World Guide using world-guide-tmpl.
- Execute tasks#advanced-elicitation.
  output: world-guide.md
  ...
