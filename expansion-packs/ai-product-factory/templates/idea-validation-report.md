# Opportunity Validation Report Template

Save to `{apf_artifacts}/evidence/opportunity-validation.md`.

```yaml
---
artifact_type: opportunity-validation
schema_version: 1
status: draft # draft | validated | blocked | stale | superseded
generated_by: bmad-apf-validate-opportunity
source_artifacts: []
evidence: []
open_questions: []
---
```

## Problem and target user

State the problem and target user. Mark each claim with its evidence classification.

## Evidence register

| Claim | Classification | Source or signal | Confidence |
| --- | --- | --- | --- |
| | declared | | low |

## Riskiest assumptions

| Assumption | Cheapest test | Decision signal |
| --- | --- | --- |
| | | |

## Verdict

Choose one: `no-go`, `experiment-required`, `provisional-go`, or `validated-go`.

`validated-go` requires a real user or revenue signal. If that signal is missing, select `experiment-required` or `provisional-go`.

## Gate report

List checks, evidence, blocking findings, and any waiver owner/reason/expiry.
