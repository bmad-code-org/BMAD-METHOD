---
name: bmad-apf-validate-opportunity
description: Validate a product opportunity with classified evidence and a bounded verdict. Use when deciding whether to experiment, plan, or stop before build investment.
policy:
  allow_implicit_invocation: false
---

# Outcome

Produce an evidence-classified validation verdict: no-go, experiment-required, provisional-go, or validated-go.

# Use when

- Evaluating a new problem, market, ICP, competitor set, business model, or pricing hypothesis.

# Do not use when

- Treating desk research as proof of paid demand.
- Generating a canonical PRD.

# Inputs

- Founder claim, known user evidence, sources, constraints, and prior validation artifacts.

# Procedure

1. Separate declared, observed, verified, inferred, assumption, unknown, and conflicting claims.
2. Identify the riskiest unproven assumption and evidence gaps.
3. Issue a bounded verdict and route unresolved demand to `bmad-apf-design-experiment`.

# Execution defaults

- Artifacts: schema-valid validation report and gate report.
- External claims: source required or marked unknown/assumption.
- Subagents: disabled unless explicitly justified for independent research.

# Escalate when

- The request seeks `validated-go` without a real interview, conversion, preorder, pilot, or usage signal.

# Done when

The verdict, confidence, sources, blockers, and next cheapest experiment are explicit.
