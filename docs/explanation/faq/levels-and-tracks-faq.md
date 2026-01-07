---
title: "Levels and Tracks FAQ"
description: Common questions about choosing the right level for your project
---


Quick answers to common questions about choosing the right level for your BMad Method project.

---

## Q: How do I know which level my project is?

**A:** Use workflow-init for automatic detection, or self-assess using these keywords:

- **Level 0:** "fix", "bug", "typo", "small change", "patch" → 1 story
- **Level 1:** "simple", "basic", "small feature", "add" → 1-10 stories
- **Level 2:** "dashboard", "several features", "admin panel" → 5-15 stories
- **Level 3:** "platform", "integration", "complex", "system" → 12-40 stories
- **Level 4:** "enterprise", "multi-tenant", "multiple products" → 40+ stories

When in doubt, start smaller. You can always run create-prd later if needed.

## Q: Can I change levels mid-project?

**A:** Yes! If you started at Level 1 but realize it's Level 2, you can run create-prd to add proper planning docs. The system is flexible - your initial level choice isn't permanent.

## Q: What if workflow-init suggests the wrong level?

**A:** You can override it! workflow-init suggests a level but always asks for confirmation. If you disagree, just say so and choose the level you think is appropriate. Trust your judgment.

## Q: Do I always need architecture for Level 2?

**A:** No, architecture is **optional** for Level 2. Only create architecture if you need system-level design. Many Level 2 projects work fine with just PRD created during planning.

## Q: What's the difference between Level 1 and Level 2?

**A:**

- **Level 1:** 1-10 stories, uses tech-spec (simpler, faster), no architecture
- **Level 2:** 5-15 stories, uses PRD (product-focused), optional architecture

The overlap (5-10 stories) is intentional. Choose based on:

- Need product-level planning? → Level 2
- Just need technical plan? → Level 1
- Multiple epics? → Level 2
- Single epic? → Level 1

---

## Related Documentation

- [Quick Start Guide](../../tutorials/getting-started/getting-started-bmadv6.md) - Get started with BMM
- [Glossary](../../reference/glossary/index.md) - Terminology reference

---

**Have a question not answered here?** Please [open an issue](https://github.com/bmad-code-org/BMAD-METHOD/issues) or ask in [Discord](https://discord.gg/gk8jAdXWmj) so we can add it!
