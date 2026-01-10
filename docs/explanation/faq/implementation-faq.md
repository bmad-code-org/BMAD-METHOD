---
title: "Implementation FAQ"
description: Common questions about implementation in the BMad Method
---

Quick answers to common questions about implementation in the BMad Method.

## Questions

- [Does create-story include implementation context?](#does-create-story-include-implementation-context)
- [How do I mark a story as done?](#how-do-i-mark-a-story-as-done)
- [Can I work on multiple stories at once?](#can-i-work-on-multiple-stories-at-once)
- [What if my story takes longer than estimated?](#what-if-my-story-takes-longer-than-estimated)
- [When should I run retrospective?](#when-should-i-run-retrospective)

### Does create-story include implementation context?

Yes! The create-story workflow generates story files that include implementation-specific guidance, references existing patterns from your documentation, and provides technical context. The workflow loads your architecture, PRD, and existing project documentation to create comprehensive stories. For Quick Flow projects using tech-spec, the tech-spec itself is already comprehensive, so stories can be simpler.

### How do I mark a story as done?

After dev-story completes and code-review passes:

1. Open `sprint-status.yaml` (created by sprint-planning)
2. Change the story status from `review` to `done`
3. Save the file

### Can I work on multiple stories at once?

Yes, if you have capacity! Stories within different epics can be worked in parallel. However, stories within the same epic are usually sequential because they build on each other.

### What if my story takes longer than estimated?

That's normal! Stories are estimates. If implementation reveals more complexity:

1. Continue working until DoD is met
2. Consider if story should be split
3. Document learnings in retrospective
4. Adjust future estimates based on this learning

### When should I run retrospective?

After completing all stories in an epic (when epic is done). Retrospectives capture:

- What went well
- What could improve
- Technical insights
- Learnings for future epics

Don't wait until project end — run after each epic for continuous improvement.

**Have a question not answered here?** Please [open an issue](https://github.com/bmad-code-org/BMAD-METHOD/issues) or ask in [Discord](https://discord.gg/gk8jAdXWmj) so we can add it!
