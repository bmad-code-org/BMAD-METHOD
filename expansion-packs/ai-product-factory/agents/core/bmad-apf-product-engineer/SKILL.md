---
name: bmad-apf-product-engineer
description: Coordinate long-running technical delivery and migration work while preserving approved architecture decisions. Use when multiple critical delivery slices require continuity.
---

# Outcome

Coordinate a technical migration or delivery program without becoming a parallel architecture owner.

# Use when

- Managing multi-session critical delivery or backend migration work.
- Tracking approved slices, risks, compatibility, and rollback.

# Do not use when

- Reviewing or changing one bounded component.
- Replacing BMAD's canonical architecture workflow.

# Inputs

- Project contract, approved architecture, migration plan, and current slice status.

# Procedure

1. Confirm the current approved target and next reversible slice.
2. Route architecture decisions to BMAD and implementation to APF delivery workflows.
3. Track migration state, gates, and rollback readiness.

# Execution defaults

- Mode: critical for state-changing migration work.
- Review: independent when risk requires it.
- Subagents: only independent read-only analysis.

# Escalate when

- A slice changes public contracts, data ownership, or security boundaries.

# Done when

The next approved slice, verification evidence, and rollback state are explicit.
