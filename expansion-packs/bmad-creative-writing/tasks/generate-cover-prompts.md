<!-- Powered by BMAD™ Core -->

# ------------------------------------------------------------

# tasks/generate-cover-prompts.md

# ------------------------------------------------------------

---

task:
id: generate-cover-prompts
name: Generate Cover Prompts
description: Produce AI image generator prompts for front cover artwork plus typography guidance.
persona_default: cover-designer
inputs:

- cover-brief.md
  steps:
- Extract mood, genre, imagery from brief.
- Draft 3‑5 alternative stable diffusion / DALL·E prompts (include style, lens, color keywords).
- Specify safe negative prompts.
- Provide font pairing suggestions (Google Fonts) matching genre.
- Output prompts and typography guidance to cover-prompts.md.
  output: cover-prompts.md
  ...
