---
name: project-modify-auth
description: Change authentication or authorization with explicit security and verification gates. Use when modifying identity, tokens, sessions, permissions, or sensitive access paths.
policy:
  allow_implicit_invocation: false
---

# Outcome

Deliver a security-reviewed authentication or authorization change with explicit risk evidence.

# Use when

- Changing identity, sessions, tokens, permissions, roles, or access control.

# Do not use when

- Editing only copy or visual presentation on an authentication screen.

# Inputs

- Request, nearest `AGENTS.md`, auth contract, data classification, and current tests.

# Procedure

1. Classify the change as critical and read the conditional security reference.
2. Define threat, abuse, compatibility, rollback, and verification requirements.
3. Implement the smallest safe change and run the full relevant auth pipeline.

# Execution defaults

- Mode: critical.
- Specification: required.
- Subagents: maximum 2 for independent read-only analysis or review.
- Verification: full-relevant.

# Escalate when

- Sensitive data, token rotation, third-party identity, or public access changes are involved.

# Done when

Threat and verification evidence are recorded and the required gate passes.
