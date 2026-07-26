---
name: bmad-apf-launch-product
description: Route a product initiative through the appropriate APF execution track and gated lifecycle DAG. Use when starting or resuming a product lifecycle.
policy:
  allow_implicit_invocation: false
---

# Outcome

Choose an execution track and a minimal gated lifecycle route.

# Use when

- Starting or resuming a new product, experiment, prototype, MVP, production release, or brownfield initiative.

# Do not use when

- Executing one project task; use `bmad-apf-execute`.

# Inputs

- Product state, evidence, existing artifacts, constraints, and requested outcome.

# Procedure

1. Select experiment, prototype, MVP, production, or brownfield track.
2. Build a DAG from only relevant lifecycle workflows.
3. Save a versioned run manifest and block transitions on failed gates.

# Execution defaults

- Artifacts: run manifest and required gate reports.
- Subagents: explicit only.
- Verification: gate-driven.

# Escalate when

- A track changes from prototype to production or introduces critical data, payment, or security scope.

# Done when

The next gated workflow and all required inputs are explicit.
