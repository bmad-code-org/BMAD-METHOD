---
name: bmad-apf-project-contract
description: Create, update, or audit a shared AI operating contract for an existing repository. Use when a team needs reproducible Codex guidance and project-specific skills.
policy:
  allow_implicit_invocation: false
---

# Outcome

Create or audit a Git-ready project contract without silently normalizing conflicting architecture.

# Use when

- Bootstrapping an existing project for a team.
- Updating or auditing project instructions after architectural change.

# Do not use when

- Implementing a normal scoped task.
- Replacing an architecture review or modernization decision.

# Inputs

- Repository files, build scripts, current instructions, and selected mode: `create`, `update`, or `audit`.

# Procedure

1. Discover repository layout, commands, boundaries, generated code, and existing patterns.
2. Mark every rule as declared, observed, inferred, conflict, unknown, or deprecated.
3. Write `.apf/project-contract.yaml` and derive only needed `AGENTS.md`, references, and project skills.
4. Preserve manual blocks, omit secrets and absolute paths, and compare hashes on update or audit.

# Execution defaults

- Mode: planned.
- Repository mutation: only in create or update mode.
- Subagents: 0 unless independent read-only discovery reduces material risk.
- Verification: schema, idempotency, and clean-clone checks.

# Escalate when

- Conflicting patterns require an owner decision.
- Generated instructions would alter architecture rather than record it.

# Done when

The canonical contract is valid, generated output is reproducible, and conflicts are explicit.
