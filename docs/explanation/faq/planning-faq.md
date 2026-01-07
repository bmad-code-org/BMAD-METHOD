---
title: "Planning Documents FAQ"
description: Common questions about planning documents in the BMad Method
---


Quick answers to common questions about planning documents in the BMad Method.

---

## Q: Why no tech-spec at Level 2+?

**A:** Level 2+ projects need product-level planning (PRD) and system-level design (Architecture), which tech-spec doesn't provide. Tech-spec is too narrow for coordinating multiple features. Instead, Level 2-4 uses:

- PRD (product vision, functional requirements, non-functional requirements)
- Architecture (system design)
- Epics+Stories (created AFTER architecture is complete)

## Q: Do I need a PRD for a bug fix?

**A:** No! Bug fixes are typically Level 0 (single atomic change). Use Quick Spec Flow:

- Load PM agent
- Run tech-spec workflow
- Implement immediately

PRDs are for Level 2-4 projects with multiple features requiring product-level coordination.

## Q: Can I skip the product brief?

**A:** Yes, product brief is always optional. It's most valuable for:

- Level 3-4 projects needing strategic direction
- Projects with stakeholders requiring alignment
- Novel products needing market research
- When you want to explore solution space before committing

---

## Related Documentation

- [Quick Start Guide](../../tutorials/getting-started/getting-started-bmadv6.md) - Get started with BMM
- [Glossary](../../reference/glossary/index.md) - Terminology reference

---

**Have a question not answered here?** Please [open an issue](https://github.com/bmad-code-org/BMAD-METHOD/issues) or ask in [Discord](https://discord.gg/gk8jAdXWmj) so we can add it!
