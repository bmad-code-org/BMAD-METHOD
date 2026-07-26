---
name: bmad-apf-release-product
description: Prepare a product release by selecting only relevant deployment, observability, rollback, and launch gates. Use when an approved product is ready for release planning.
policy:
  allow_implicit_invocation: false
---

# Outcome

Produce a release decision with auditable gates, rollout, rollback, and only relevant launch capabilities.

# Use when

- Releasing an MVP, production increment, mobile app, web product, or launch experiment.

# Do not use when

- Deploying a local patch without a release decision.
- Assuming every release requires all store, SEO, or marketing work.

# Inputs

- Approved release scope, deployment target, verification evidence, and operational constraints.

# Procedure

1. Select applicable release, security, observability, rollback, store, and launch gates.
2. Record failed checks, waivers, owners, and expiry.
3. Execute only selected release capabilities and publish the release decision.

# Execution defaults

- Mode: critical for production release changes.
- Verification: full-relevant release pipeline.
- Marketing claims: evidence-classified.

# Escalate when

- A blocking gate fails or a waiver has no owner, reason, or expiry.

# Done when

The release decision, evidence, rollout, and rollback state are explicit.
