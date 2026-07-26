---
name: bmad-apf-execute
description: Route a task in an existing project to the smallest safe APF, project, or BMAD process. Use for the normal entry point for implementation, review, and scoped project work.
---

# Outcome

Select and execute a risk-proportional task mode with a compact execution contract.

# Use when

- Working inside an existing repository.
- The requester has not selected a more specific approved workflow.

# Do not use when

- Starting a new product lifecycle without a project context.
- The user explicitly invokes a dedicated BMAD or APF workflow.

# Inputs

- User request, nearest `AGENTS.md`, project contract if present, and explicit overrides.

# Procedure

1. Classify the request as `patch`, `focused`, `planned`, or `critical`.
2. Print one compact execution contract before expensive work.
3. Load only task-relevant instructions and route to a project skill, BMAD capability, or direct implementation.
4. Apply the selected verification level and stop after acceptance criteria are met.

# Execution defaults

- Mode: auto.
- Specification: off for patch and focused.
- Subagents: 0 for patch and focused.
- Verification: follow `policies/verification.yaml`.

# Escalate when

- Authentication, payments, sensitive data, destructive migration, infrastructure, security, or public contracts are affected.
- Scope crosses services or requires a durable decision.

# Done when

The requested outcome is delivered and the final response lists validation run and expensive checks intentionally skipped.
