<!-- Powered by BMAD™ Core -->

# ------------------------------------------------------------

# 12. Select Next Arc (Serial)

# ------------------------------------------------------------

---

task:
id: select-next-arc
name: Select Next Arc
description: Choose the next 2–4‑chapter arc for serial publication.
persona_default: plot-architect
inputs:

- retrospective data (retro.md) | snowflake-outline.md
  steps:
- Analyze reader feedback.
- Update release-plan.md with upcoming beats.
  output: release-plan.md
  ...
