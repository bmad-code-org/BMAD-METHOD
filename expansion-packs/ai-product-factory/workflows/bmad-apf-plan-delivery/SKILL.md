---
name: bmad-apf-plan-delivery
description: Plan risk-proportional delivery by delegating canonical architecture and story work to BMAD core. Use when an approved product scope needs an implementation route.
policy:
  allow_implicit_invocation: false
---

# Outcome

Produce an approved delivery route with architecture depth, vertical slices, verification, and rollback constraints.

# Use when

- Planning an MVP, production hardening, brownfield migration, or cross-service change.

# Do not use when

- Implementing a local task that `bmad-apf-execute` classifies as patch or focused.
- Replacing BMAD's architecture ownership.

# Inputs

- Canonical product artifacts, project contract, risks, and current architecture.

# Procedure

1. Select delivery track and architecture depth.
2. Delegate canonical architecture and stories to BMAD core when required.
3. Define reversible vertical slices, capability needs, verification, and rollback.

# Execution defaults

- Mode: planned or critical.
- Subagents: read-only analysis only when critical scope justifies it.
- Security: load `knowledge/security-shift-left.md` for critical scope.

# Escalate when

- Data ownership, public API, authentication, payments, or destructive migration changes.

# Done when

The first reversible vertical slice and its verification gate are explicit.
