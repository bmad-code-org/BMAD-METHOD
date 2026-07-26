---
name: project-add-feature
description: Add a bounded project feature while preserving repository boundaries and proportional verification. Use when a request adds a local page, route, component, endpoint, or feature behavior.
---

# Outcome

Deliver one bounded feature without creating a persistent specification unless risk requires it.

# Use when

- Adding a local page, route, component, endpoint, or feature behavior.

# Do not use when

- Changing public architecture, authentication, payments, or destructive data flows.

# Inputs

- User request, nearest `AGENTS.md`, project contract, and affected module conventions.

# Procedure

1. Determine affected module boundaries and reuse existing patterns.
2. Implement the smallest complete feature loop.
3. Run affected-module verification and summarize skipped expensive checks.

# Execution defaults

- Mode: focused.
- Specification: off.
- Subagents: 0.
- Verification: affected module.

# Escalate when

- The feature changes a public API, database schema, several modules, or user permissions.

# Done when

The feature meets the request and relevant checks pass.
