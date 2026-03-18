---
workflow_id: MLOPS001
workflow_name: MLOps Deployment
description: Deploy ML model to production with validation, serving, and monitoring
entry_point: steps/step-01-model-validation.md
phase: 5-specialized
lead_agent: "Linh (MLOps)"
status: "active"
created_date: 2026-03-17
version: "1.0.0"
estimated_duration: "3-4 hours"
outputFile: '{output_folder}/psm-artifacts/mlops-deploy-{{project_name}}-{{date}}.md'
---

# Workflow: MLOps Deployment

## Goal
Deploy machine learning models to production with comprehensive validation, infrastructure setup, and post-deployment monitoring.

## Overview

MLOps deployment ensures ML models are production-ready and continuously monitored for performance and data drift. The workflow:

1. **Validates** model quality, performance metrics, and data drift detection
2. **Deploys** model to serving infrastructure with versioning and A/B testing
3. **Monitors** model performance, data drift, and cost metrics post-deployment

## Execution Path

```
START
  ↓
[Step 01] Model Validation (Check metrics, data drift, A/B test plan)
  ↓
[Step 02] Deploy Model (Setup serving, infrastructure, GPU optimization)
  ↓
[Step 03] Monitor (Langfuse/MLflow, drift detection, cost tracking)
  ↓
END
```

## Key Roles

| Role | Agent | Responsibility |
|------|-------|-----------------|
| Lead | Linh (MLOps) | Coordinate deployment, monitor model health |
| Data Scientist | Data Lead | Validate model quality, approve for production |
| DevOps | Platform Eng | Setup infrastructure, manage resources |

## Validation Gates (3)

1. **Model Quality** — Accuracy, precision, recall metrics meet SLO
2. **Data Quality** — No data drift detected; training/production data distribution aligned
3. **Business Readiness** — A/B test plan ready, rollback strategy defined

## Input Requirements

- **Trained model artifact** — Model checkpoint, weights, configuration
- **Performance metrics** — Baseline accuracy, latency, throughput expectations
- **Data validation** — Training dataset description, expected data distribution
- **Serving infrastructure** — Compute requirements (GPU/CPU), latency targets

## Output Deliverable

- **MLOps Deployment Report**
  - Model version and metadata
  - Performance validation summary
  - Serving infrastructure setup
  - Monitoring dashboard and alerts
  - Data drift detection configuration

## Success Criteria

1. Model passes all quality gates before deployment
2. Serving infrastructure deployed and load-tested
3. Monitoring and alerting configured and validated
4. Rollback strategy tested and documented
5. Team trained on model updates and incident response

## Next Steps After Workflow

- Monitor model performance daily for first week
- Track data drift metrics; alert if detected
- Plan model retraining based on performance degradation
- Document lessons learned in MLOps runbook

---

**Navigation**: [← Back to 5-specialized](../), [Next: Step 01 →](steps/step-01-model-validation.md)
