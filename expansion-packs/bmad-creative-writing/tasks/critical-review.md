<!-- Powered by BMAD™ Core -->

# ------------------------------------------------------------

# Critical Review Task

# ------------------------------------------------------------

---

task:
id: critical-review
name: Critical Review
description: Comprehensive professional critique using critic-review-tmpl and rubric checklist.
persona_default: book-critic
inputs:

- manuscript file (e.g., draft-manuscript.md or chapter file)
  steps:
- If audience/genre not provided, prompt user for details.
- Read manuscript (or excerpt) for holistic understanding.
- Fill **critic-review-tmpl** with category scores and commentary.
- Execute **checklists/critic-rubric-checklist** to spot omissions; revise output if any boxes unchecked.
- Present final review to user.
  output: critic-review.md
  ...
