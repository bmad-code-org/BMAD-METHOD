<!-- Powered by BMAD™ Core -->

# ------------------------------------------------------------

# 7. Expand Premise (Snowflake Step 2)

# ------------------------------------------------------------

---

task:
id: expand-premise
name: Expand Premise
description: Turn a 1‑sentence idea into a 1‑paragraph summary.
persona_default: plot-architect
inputs:

- premise.txt
  steps:
- Ask for genre confirmation.
- Draft one paragraph (~5 sentences) covering protagonist, conflict, stakes.
  output: premise-paragraph.md
  ...
