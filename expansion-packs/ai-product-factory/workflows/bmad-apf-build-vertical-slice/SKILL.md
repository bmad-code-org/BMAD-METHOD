---
name: bmad-apf-build-vertical-slice
description: Deliver one approved end-to-end value slice with only required capabilities. Use when a delivery plan defines a bounded, reversible implementation increment.
---

# Outcome

Implement one verified value loop without automatically adding database, auth, backend, analytics, payments, or deployment work.

# Use when

- An approved delivery plan identifies the next vertical slice.

# Do not use when

- The target architecture or product scope is still undecided.
- The task is a standalone patch or focused change.

# Inputs

- Approved slice, project contract, canonical architecture/stories, and selected capabilities.

# Procedure

1. Confirm acceptance criteria, compatibility constraints, and rollback path.
2. Route implementation through `bmad-apf-execute` using the slice risk mode.
3. Verify only the capabilities and integrations the slice changes.

# Execution defaults

- Artifacts: update migration state only when the slice is part of a long-running plan.
- Verification: relevant or full-relevant according to risk.
- Subagents: governed by the routed task mode.

# Escalate when

- The slice invalidates an approved contract, migration, or security boundary.

# Done when

The slice meets acceptance criteria, rollback state is known, and the next slice is unblocked.
