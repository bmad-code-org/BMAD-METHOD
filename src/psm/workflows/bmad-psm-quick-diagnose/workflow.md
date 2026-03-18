---
workflow_id: QD001
workflow_name: Quick Diagnose
description: Fast diagnosis of production issue with root cause and fix suggestion
entry_point: steps/step-01-gather.md
phase: quick-flow
lead_agent: "Minh (SRE)"
status: "active"
created_date: 2026-03-17
version: "1.0.0"
estimated_duration: "15-25 minutes"
outputFile: '{output_folder}/psm-artifacts/quick-diagnose-{{date}}.md'
---

# Workflow: Quick Diagnose Production Issue

## Goal
Rapidly diagnose production issues by gathering symptom data, checking metrics, and suggesting fixes.

## Overview

Quick Diagnose is a lightweight workflow for time-sensitive production troubleshooting:

1. **Gathers** symptom description and quick metrics check
2. **Diagnoses** root cause using observability data
3. **Suggests** fix or mitigation immediately

## Execution Path

```
START
  ↓
[Step 01] Gather Context (What's broken? Check metrics)
  ↓
[Step 02] Diagnose & Fix (Root cause analysis → fix suggestion → verify)
  ↓
END
```

## Key Roles

| Role | Agent |
|------|-------|
| Lead | Minh (SRE) |

## Input Requirements

- **Symptom description** — What is failing? (error message, behavior, timeline)
- **Affected service/component** — What system is broken?
- **Timeline** — When did it start? Is it ongoing?
- **Impact** — How many users affected? Is revenue impacted?

## Output Deliverable

- **Quick Diagnosis Report** (markdown, 1-2 pages)
  - Symptom analysis
  - Root cause hypothesis
  - Immediate mitigation (if needed)
  - Fix suggestion with effort
  - Follow-up actions

## Success Criteria

1. Root cause identified within 15-20 minutes
2. Immediate mitigation available (if needed)
3. Fix suggestion documented with clear steps
4. Team knows what to do next

## Quick Diagnose vs Full Production Readiness Review

| Aspect | Quick Diagnose | Full PRR |
|--------|---|---|
| Trigger | Active incident | Pre-deployment |
| Duration | 15-25 min | 2-3 hours |
| Scope | Single issue | All 9 dimensions |
| Goal | Fix now | Prevent issues |

---

**Navigation**: [← Back to quick-flow](../), [Next: Step 01 →](steps/step-01-gather.md)
