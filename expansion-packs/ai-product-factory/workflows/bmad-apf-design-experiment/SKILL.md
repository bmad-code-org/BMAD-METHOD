---
name: bmad-apf-design-experiment
description: Design the cheapest evidence-producing experiment for a product hypothesis. Use when demand, usability, pricing, or feasibility remains unproven.
---

# Outcome

Define one measurable experiment with a decision rule and minimal implementation scope.

# Use when

- A validation gate exposes an assumption about demand, usability, pricing, or feasibility.

# Do not use when

- A full product build is already justified and approved.

# Inputs

- Hypothesis, target user, evidence gap, constraints, and available channels.

# Procedure

1. Choose interview, waitlist, fake door, landing, concierge, paid pilot, prototype, or technical spike.
2. Define success signal, sample, stop rule, and evidence collection method.
3. Route only required delivery work through `bmad-apf-execute`.

# Execution defaults

- Track: experiment or prototype.
- Architecture: none unless the experiment requires it.
- Verification: measure the declared signal.

# Escalate when

- The experiment processes payments, sensitive data, or public commitments.

# Done when

The hypothesis, minimal build scope, metric, and decision rule are explicit.
