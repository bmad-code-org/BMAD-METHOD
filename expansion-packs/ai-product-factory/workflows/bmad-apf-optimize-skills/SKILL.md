---
name: bmad-apf-optimize-skills
description: Audit, rewrite, verify, or benchmark APF skills against the compact skill standard. Use when reducing instruction cost without losing an approved capability.
policy:
  allow_implicit_invocation: false
---

# Outcome

Produce a validated before-and-after skill improvement with no hidden capability loss.

# Use when

- Auditing APF or generated project skills.
- Rewriting a skill that is oversized, duplicated, vendor-bound, or overly expensive.

# Do not use when

- Adding a new professional role without a validated outcome.
- Replacing a product or architecture workflow.

# Inputs

- Selected skill, mode (`audit`, `rewrite`, `verify`, `benchmark`), and migration map.

# Procedure

1. Audit trigger, anti-trigger, outcome, references, execution profile, and BMAD ownership.
2. Rewrite only after a target replacement and compatibility route are explicit.
3. Run the APF linter, trigger checks, artifact checks, and benchmark fixture when applicable.

# Execution defaults

- Artifacts: one audit report or before/after report.
- Subagents: disabled.
- Verification: deterministic first.

# Escalate when

- A change removes a public identifier or a capability used by another workflow.

# Done when

The skill passes lint and its documented capability is preserved or intentionally migrated.
