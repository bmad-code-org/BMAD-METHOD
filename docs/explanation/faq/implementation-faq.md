---
title: "Implementation FAQ"
description: Common questions about implementation in the BMad Method
---


Quick answers to common questions about implementation in the BMad Method.

---

## Q: Does create-story include implementation context?

**A:** Yes! The create-story workflow generates story files that include implementation-specific guidance, references existing patterns from your documentation, and provides technical context. The workflow loads your architecture, PRD, and existing project documentation to create comprehensive stories. For Quick Flow projects using tech-spec, the tech-spec itself is already comprehensive, so stories can be simpler.

## Q: How do I mark a story as done?

**A:** After dev-story completes and code-review passes:

1. Open `sprint-status.yaml` (created by sprint-planning)
2. Change the story status from `review` to `done`
3. Save the file

## Q: Can I work on multiple stories at once?

**A:** Yes, if you have capacity! Stories within different epics can be worked in parallel. However, stories within the same epic are usually sequential because they build on each other.

## Q: What if my story takes longer than estimated?

**A:** That's normal! Stories are estimates. If implementation reveals more complexity:

1. Continue working until DoD is met
2. Consider if story should be split
3. Document learnings in retrospective
4. Adjust future estimates based on this learning

## Q: When should I run retrospective?

**A:** After completing all stories in an epic (when epic is done). Retrospectives capture:

- What went well
- What could improve
- Technical insights
- Learnings for future epics

Don't wait until project end - run after each epic for continuous improvement.

---

## Related Documentation

- [Quick Start Guide](../../tutorials/getting-started/getting-started-bmadv6.md) - Get started with BMM
- [Glossary](../../reference/glossary/index.md) - Terminology reference

---

**Have a question not answered here?** Please [open an issue](https://github.com/bmad-code-org/BMAD-METHOD/issues) or ask in [Discord](https://discord.gg/gk8jAdXWmj) so we can add it!
