---
workflow_id: PRR001
workflow_name: Production Readiness Review
description: Validate service is ready for production using comprehensive readiness checklist
entry_point: steps/step-01-init-checklist.md
phase: 3-run
lead_agent: "Minh (SRE)"
status: "active"
created_date: 2026-03-17
version: "1.0.0"
estimated_duration: "2-3 hours"
outputFile: '{output_folder}/psm-artifacts/prr-{{project_name}}-{{date}}.md'
---

# Workflow: Production Readiness Review (PRR)

## Goal
Validate and certify that a service meets production readiness standards across 9 key dimensions before deployment.

## Overview

This workflow systematically evaluates a service against production readiness criteria defined in the Production Systems BMAD skill framework. Using SRE expertise and architectural patterns, the workflow:

1. **Initializes** the PRR process with service context and dimensional overview
2. **Deep reviews** each dimension (reliability, observability, performance, security, capacity, data, runbooks, dependencies, rollback)
3. **Renders final decision** with GO/NO-GO/CONDITIONAL-GO recommendation

## Execution Path

```
START
  ↓
[Step 01] Init Checklist (Load framework, gather service context, present dimensions)
  ↓
[Step 02] Deep Review (Score each dimension, identify blockers, recommendations)
  ↓
[Step 03] Final Decision (Scorecard, decision, action items, DONE)
  ↓
END
```

## Key Roles

| Role | Agent | Responsibility |
|------|-------|-----------------|
| Lead | Minh (SRE) | Navigate workflow, coordinate review, make final call |
| Subject Matter | Service Owner | Provide service context, clarify architecture |
| Review Committee | Arch, SecOps, MLOps | Contribute expertise on specific dimensions |

## Dimensions Evaluated (9)

1. **Reliability** — SLA/SLO definition, error budgets, failure modes, incident response
2. **Observability** — Logging, metrics, tracing, dashboards, alerting
3. **Performance** — Latency targets, throughput, P99 tail behavior, optimization opportunities
4. **Security** — Auth/authz, secrets management, encryption, audit logging, compliance
5. **Capacity** — Resource limits, scaling policies, burst capacity, cost projections
6. **Data** — Schema versioning, backup/restore, data governance, retention policies
7. **Runbooks** — Incident runbooks, operational playbooks, troubleshooting guides
8. **Dependencies** — External services, internal libraries, database versioning, API contracts
9. **Rollback** — Rollback strategy, canary deployment, feature flags, smoke tests

## Input Requirements

- **Service name and owner** — Which service are we evaluating?
- **Current architecture** — High-level design, tech stack, topology
- **Existing metrics/dashboards** — Links to monitoring, SLO definitions
- **Known gaps/risks** — Already identified issues to address

## Output Deliverable

- **Production Readiness Checklist** (template: `production-readiness.template.md`)
  - Scorecard with 9 dimensions (red/yellow/green)
  - Blockers and recommendations per dimension
  - Final GO/NO-GO/CONDITIONAL-GO decision
  - Explicit action items with owners and deadlines

## Success Criteria

1. All 9 dimensions evaluated with clear rationale
2. Blockers categorized as P0 (must fix) or P1 (should fix)
3. Team alignment on decision (documented in PRR report)
4. Action plan with clear accountability and timeline

## Next Steps After Workflow

- If **GO**: Proceed to deployment; document in CHANGELOG
- If **NO-GO**: Reschedule PRR once blockers addressed; track in backlog
- If **CONDITIONAL-GO**: Deploy with documented caveats; setup monitoring for risk areas

---

**Navigation**: [← Back to 3-run](../), [Next: Step 01 →](steps/step-01-init-checklist.md)
