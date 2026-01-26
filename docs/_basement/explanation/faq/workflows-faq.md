---
title: "Workflows FAQ"
description: Common questions about BMad Method workflows and phases
---

Quick answers to common questions about BMad Method workflows and phases.

## Questions

- [What's the difference between workflow-status and workflow-init?](#whats-the-difference-between-workflow-status-and-workflow-init)
- [Can I skip Phase 1 (Analysis)?](#can-i-skip-phase-1-analysis)
- [When is Phase 3 (Architecture) required?](#when-is-phase-3-architecture-required)
- [What happens if I skip a recommended workflow?](#what-happens-if-i-skip-a-recommended-workflow)
- [How do I know when Phase 3 is complete?](#how-do-i-know-when-phase-3-is-complete)
- [Can I run workflows in parallel?](#can-i-run-workflows-in-parallel)

### What's the difference between workflow-status and workflow-init?

- **workflow-status** — Checks existing status and tells you what's next (use when continuing work)
- **workflow-init** — Creates new status file and sets up project (use when starting new project)

If status file exists, use workflow-status. If not, use workflow-init.

### Can I skip Phase 1 (Analysis)?

Yes! Phase 1 is optional for all levels, though recommended for complex projects. Skip if:

- Requirements are clear
- No research needed
- Time-sensitive work
- Small changes (Level 0-1)

### When is Phase 3 (Architecture) required?

- **Level 0-1** — Never (skip entirely)
- **Level 2** — Optional (only if system design needed)
- **Level 3-4** — Required (comprehensive architecture mandatory)

### What happens if I skip a recommended workflow?

Nothing breaks! Workflows are guidance, not enforcement. However, skipping recommended workflows (like architecture for Level 3) may cause:

- Integration issues during implementation
- Rework due to poor planning
- Conflicting design decisions
- Longer development time overall

### How do I know when Phase 3 is complete?

For Level 3-4, run the implementation-readiness workflow. It validates PRD + Architecture + Epics + UX (optional) are aligned before implementation. Pass the gate check = ready for Phase 4.

### Can I run workflows in parallel?

Most workflows must be sequential within a phase:

- **Phase 1** — brainstorm → research → product-brief (optional order)
- **Phase 2** — PRD must complete before moving forward
- **Phase 3** — architecture → epics+stories → implementation-readiness (sequential)
- **Phase 4** — Stories within an epic should generally be sequential, but stories in different epics can be parallel if you have capacity

**Have a question not answered here?** Please [open an issue](https://github.com/bmad-code-org/BMAD-METHOD/issues) or ask in [Discord](https://discord.gg/gk8jAdXWmj) so we can add it!
