# BMM-Metrics Module

KPI/SLA tracking and quality gate management for production SaaS operations.

## Overview

The BMM-Metrics module provides comprehensive metrics tracking, quality gate validation, and SLA monitoring to enable data-driven product decisions and ensure release quality.

## Key Capabilities

- **KPI Definition & Tracking**: Define and monitor product and engineering KPIs
- **SLA Management**: Set thresholds and alert on breaches
- **Quality Gates**: Validate releases against quality criteria
- **Metrics Review**: Periodic analysis and trend identification
- **Event-Driven Integration**: Subscribes to story/sprint events, publishes quality status

## Module Structure

```
bmm-metrics/
├── README.md
├── config.yaml
├── agents/
│   └── metrics-analyst.agent.yaml
├── events/
│   ├── subscriptions.yaml      # Events this module listens to
│   ├── publications.yaml       # Events this module emits
│   └── handlers/
│       ├── on-story-done.xml
│       ├── on-story-ready.xml
│       ├── on-sprint-ended.xml
│       └── on-code-reviewed.xml
├── workflows/
│   ├── define-kpis/            # Define product and engineering KPIs
│   ├── define-slas/            # Set SLA thresholds
│   ├── track-metrics/          # Collect and report metrics
│   ├── quality-gate-check/     # Pre-release quality validation
│   └── metrics-review/         # Weekly/monthly analysis
├── tasks/
│   ├── calculate-velocity.xml
│   ├── generate-dashboard.xml
│   └── check-sla-breach.xml
├── data/
│   ├── metric-types.csv
│   └── sla-thresholds.yaml
└── state/
    └── module-state.yaml       # Private module state
```

## Agent

### Metrics Analyst

**Role**: KPI definition, SLA monitoring, dashboard generation, quality gate validation

**Responsibilities**:
- Define meaningful KPIs aligned with business objectives
- Set realistic SLA thresholds based on baseline data
- Monitor metric trends and identify anomalies
- Validate quality gates before releases
- Generate periodic metrics reports

## Workflows

### define-kpis
Define product and engineering KPIs with targets and measurement frequency.

**Inputs**: PRD success metrics, business objectives
**Outputs**: KPI definitions document

### define-slas
Set SLA thresholds for critical metrics with alerting rules.

**Inputs**: KPI definitions, baseline data
**Outputs**: SLA configuration

### track-metrics
Periodic collection and reporting of metric values.

**Inputs**: Source data (stories, sprints, code)
**Outputs**: Metrics report, SLA breach alerts

### quality-gate-check
Validate a release candidate against quality criteria.

**Inputs**: Story ID, quality gate definitions
**Outputs**: Pass/fail status, detailed gate results
**Events Published**: `metrics.quality.pass` or `metrics.quality.fail`

### metrics-review
Weekly or monthly analysis of metric trends.

**Inputs**: Historical metric data
**Outputs**: Trend analysis, recommendations

## Event Integration

### Subscriptions (Listens To)

| Event | Handler | Purpose |
|-------|---------|---------|
| `story.done` | on-story-done.xml | Track story completion metrics |
| `story.ready` | on-story-ready.xml | Track cycle time from created to ready |
| `sprint.ended` | on-sprint-ended.xml | Calculate sprint velocity |
| `code.reviewed` | on-code-reviewed.xml | Track code quality metrics |

### Publications (Emits)

| Event | Trigger | Purpose |
|-------|---------|---------|
| `metrics.kpi.defined` | define-kpis workflow | Notify KPIs are defined |
| `metrics.kpi.updated` | track-metrics workflow | Notify KPI value changes |
| `metrics.sla.breach` | track-metrics workflow | Alert on SLA violations |
| `metrics.quality.pass` | quality-gate-check | Release can proceed |
| `metrics.quality.fail` | quality-gate-check | Release blocked |

## Configuration

```yaml
# config.yaml
module_name: bmm-metrics
module_version: "1.0.0"

# Metric collection settings
collection:
  frequency: daily
  retention_days: 90

# Quality gate defaults
quality_gates:
  test_coverage_min: 80
  code_review_required: true
  no_critical_issues: true
  no_security_vulnerabilities: true

# SLA defaults
sla_defaults:
  warning_threshold_percent: 80
  critical_threshold_percent: 95

# Dashboard settings
dashboard:
  refresh_interval_minutes: 15
  default_time_range: 30d
```

## Cross-Module Integration

- **bmm-release**: Quality gate status triggers release decisions
- **bmm-roadmap**: Velocity metrics inform capacity planning
- **bmm-priority**: Delivered value feeds prioritization scoring
- **bmm-feedback**: Usage metrics inform feedback analysis

## Quick Start

1. **Initialize metrics tracking**:
   ```
   /bmad:bmm-metrics:workflows:define-kpis
   ```

2. **Set SLA thresholds**:
   ```
   /bmad:bmm-metrics:workflows:define-slas
   ```

3. **Run quality gate** (typically automated):
   ```
   /bmad:bmm-metrics:workflows:quality-gate-check
   ```

## Dependencies

- **BMM Module**: Story and sprint data
- **Core Events**: Event publishing infrastructure

## Author

Created as part of BMAD SaaS Extension - November 2024
