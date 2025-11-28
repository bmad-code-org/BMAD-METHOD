# Contractor Report Workflow

## Overview

This workflow generates comprehensive contractor performance reports and distributes them via SMTP email. Reports include velocity metrics, quality indicators, collaboration scores, and actionable insights.

## Prerequisites

- At least one sprint's worth of data
- Completed stories available for analysis
- Module state with historical data

---

## Report Types

| Type | Frequency | Scope | Recipients |
|------|-----------|-------|------------|
| Individual | On-demand | Single contractor | Coordinator |
| Team | Weekly | All contractors | Coordinator, PM |
| Weekly | Every Monday | Previous week | All stakeholders |
| Monthly | 1st of month | Previous month | Leadership |

---

## Workflow Stages

### Stage 1: Collect Metrics

**Objective:** Gather performance data from all sources.

**Data Sources:**

1. **Module State** - Historical tracking data
2. **Git** - Commits, PRs, merge activity
3. **Email Logs** - Communication patterns
4. **Story Completions** - Velocity data

**Metrics to Collect:**

```yaml
metrics_collection:
  period:
    start: "2025-11-01T00:00:00Z"
    end: "2025-11-30T23:59:59Z"
    type: "monthly"

  per_contractor:
    backend-001:
      # Velocity
      stories_assigned: 8
      stories_completed: 7
      stories_in_progress: 1
      story_points_completed: 34

      # Quality
      submissions_approved_first_try: 4
      submissions_requiring_revision: 3
      total_revision_iterations: 5
      blockers_reported: 2
      blockers_resolved: 2

      # Timing
      average_cycle_time_hours: 72
      average_acknowledgment_time_hours: 4
      sla_breaches: 0
      on_time_delivery_rate: 0.86

      # Communication
      emails_sent: 45
      emails_received: 52
      questions_asked: 6
      response_time_avg_hours: 8

      # Git
      commits: 156
      prs_opened: 8
      prs_merged: 7
      lines_added: 4520
      lines_removed: 890
```

**Team Aggregates:**

```yaml
team_metrics:
  total_contractors: 5
  active_contractors: 5

  # Velocity
  total_stories_completed: 24
  total_story_points: 112
  average_velocity_per_contractor: 22.4

  # Quality
  first_try_approval_rate: 0.58
  average_revision_iterations: 1.3
  total_blockers: 8
  blocker_resolution_rate: 0.875

  # Timing
  team_average_cycle_time_hours: 68
  sla_compliance_rate: 0.92

  # Git
  total_prs_merged: 24
  total_commits: 412
```

**Output:** Complete metrics dataset

---

### Stage 2: Calculate Performance

**Objective:** Compute performance indicators and trends.

**Performance Indicators:**

```yaml
performance_scores:
  backend-001:
    # Overall Score (0-100)
    overall_score: 82

    # Component Scores
    velocity_score: 85
    quality_score: 75
    reliability_score: 90
    communication_score: 80

    # Breakdown
    velocity:
      points_delivered: 34
      target: 36
      achievement_rate: 0.94
      trend: "+5% vs last month"

    quality:
      first_try_rate: 0.57
      revision_rate: 0.43
      avg_revisions: 1.5
      trend: "-10% vs last month"

    reliability:
      on_time_rate: 0.86
      sla_compliance: 1.0
      acknowledgment_speed: "4h avg"
      trend: "stable"

    communication:
      response_time: "8h avg"
      question_rate: "0.75 per story"
      progress_updates: "2.1 per story"
      trend: "+15% responsiveness"
```

**Trend Analysis:**

```yaml
trends:
  backend-001:
    velocity_trend:
      current: 34
      previous: 32
      change: "+6.25%"
      direction: "improving"

    quality_trend:
      current: 0.57
      previous: 0.63
      change: "-9.5%"
      direction: "declining"
      alert: true
      alert_reason: "First-try approval rate declining"

    cycle_time_trend:
      current: 72
      previous: 78
      change: "-7.7%"
      direction: "improving"
```

**Comparisons:**

```yaml
rankings:
  by_velocity:
    1: {id: "qa-001", points: 42}
    2: {id: "backend-001", points: 34}
    3: {id: "frontend-001", points: 28}
    4: {id: "mobile-001", points: 22}
    5: {id: "researcher-001", points: 18}

  by_quality:
    1: {id: "qa-001", first_try_rate: 0.83}
    2: {id: "frontend-001", first_try_rate: 0.71}
    3: {id: "mobile-001", first_try_rate: 0.67}
    4: {id: "backend-001", first_try_rate: 0.57}
    5: {id: "researcher-001", first_try_rate: 0.50}

  by_reliability:
    1: {id: "backend-001", on_time_rate: 0.86}
    2: {id: "qa-001", on_time_rate: 0.83}
    3: {id: "frontend-001", on_time_rate: 0.80}
    4: {id: "mobile-001", on_time_rate: 0.75}
    5: {id: "researcher-001", on_time_rate: 0.70}
```

**Output:** Performance scores and trends calculated

---

### Stage 3: Generate Report

**Objective:** Create formatted report document.

**Monthly Team Report Template:**

```markdown
# Contractor Performance Report
**Period:** November 2025
**Generated:** December 1, 2025 09:00 UTC
**Report Type:** Monthly Team Summary

---

## Executive Summary

| Metric | Value | vs Last Month | Target |
|--------|-------|---------------|--------|
| Stories Completed | 24 | +15% | 22 |
| Story Points | 112 | +10% | 100 |
| First-Try Approval | 58% | -5% | 70% |
| On-Time Delivery | 82% | +3% | 85% |
| SLA Compliance | 92% | stable | 95% |
| Active Blockers | 2 | -3 | 0 |

**Overall Team Health:** 🟢 Good (78/100)

---

## Team Overview

```
Contractors: 5 active
├── ☕ Backend Developer (backend-001)  - 82/100
├── ⚛️ Frontend Developer (frontend-001) - 79/100
├── 📱 Mobile Developer (mobile-001)    - 74/100
├── 🧪 QA Engineer (qa-001)             - 88/100
└── 📚 Researcher (researcher-001)      - 71/100
```

---

## Individual Performance

### ☕ Backend Developer (backend-001)

**Overall Score:** 82/100 🟢

| Metric | Value | Trend |
|--------|-------|-------|
| Stories Completed | 7/8 | ↑ |
| Story Points | 34 | ↑ +6% |
| First-Try Approval | 57% | ↓ -10% |
| Cycle Time | 72h | ↑ -8% |
| On-Time Delivery | 86% | → stable |

**Strengths:**
- Excellent reliability and communication
- Improving velocity trend
- Zero SLA breaches

**Areas for Improvement:**
- First-try approval rate declining (57% → target 70%)
- Common revision reasons: security issues, missing edge cases

**Recommendation:**
Consider adding security review checklist to workflow. May benefit from
additional guidance on edge case testing.

---

### ⚛️ Frontend Developer (frontend-001)

**Overall Score:** 79/100 🟢

| Metric | Value | Trend |
|--------|-------|-------|
| Stories Completed | 5/6 | → |
| Story Points | 28 | ↑ +12% |
| First-Try Approval | 71% | ↑ +8% |
| Cycle Time | 64h | ↑ -12% |
| On-Time Delivery | 80% | ↓ -5% |

**Strengths:**
- Excellent code quality, improving first-try rate
- Fast cycle times
- Good UI/UX implementation

**Areas for Improvement:**
- On-time delivery slipping
- 2 deadline extensions requested

**Recommendation:**
Review estimation accuracy. Consider breaking larger stories into
smaller chunks.

---

### 📱 Mobile Developer (mobile-001)

**Overall Score:** 74/100 🟡

| Metric | Value | Trend |
|--------|-------|-------|
| Stories Completed | 4/5 | → |
| Story Points | 22 | → stable |
| First-Try Approval | 67% | → stable |
| Cycle Time | 84h | ↓ +10% |
| On-Time Delivery | 75% | ↓ -8% |

**Strengths:**
- Consistent quality
- Good Android expertise
- Thorough testing

**Areas for Improvement:**
- Cycle time increasing
- More blockers reported than average
- On-time delivery declining

**Recommendation:**
Investigate environment/tooling issues causing delays. Consider
providing additional mobile-specific infrastructure support.

---

### 🧪 QA Engineer (qa-001)

**Overall Score:** 88/100 🟢

| Metric | Value | Trend |
|--------|-------|-------|
| Stories Completed | 5/5 | → |
| Story Points | 42 | ↑ +20% |
| First-Try Approval | 83% | ↑ +5% |
| Cycle Time | 48h | ↑ -15% |
| On-Time Delivery | 83% | → stable |

**Strengths:**
- Highest velocity on team
- Best first-try approval rate
- Fast turnaround on reviews

**Areas for Improvement:**
- None significant

**Recommendation:**
Consider expanding QA role to mentor others on testing practices.
Top performer - recognize contributions.

---

### 📚 Researcher (researcher-001)

**Overall Score:** 71/100 🟡

| Metric | Value | Trend |
|--------|-------|-------|
| Stories Completed | 3/4 | ↓ |
| Story Points | 18 | ↓ -10% |
| First-Try Approval | 50% | ↓ -15% |
| Cycle Time | 96h | ↓ +20% |
| On-Time Delivery | 70% | ↓ -10% |

**Strengths:**
- Thorough research when completed
- Good documentation quality

**Areas for Improvement:**
- Declining across all metrics
- Slowest acknowledgment times
- Most revision iterations

**Recommendation:**
Send detailed email to discuss workload and blockers. May need
clearer requirements or reduced scope on research tasks.

---

## Quality Analysis

### Revision Reasons (All Contractors)

| Reason | Occurrences | % of Revisions |
|--------|-------------|----------------|
| Missing edge cases | 8 | 24% |
| Security issues | 6 | 18% |
| Code style violations | 5 | 15% |
| Incomplete requirements | 5 | 15% |
| Test coverage gaps | 4 | 12% |
| Performance issues | 3 | 9% |
| Documentation gaps | 2 | 6% |

**Top Action Items:**
1. Add edge case checklist to story template
2. Require security self-review before submission
3. Clarify code style guide and add linting

---

## Blocker Analysis

### Blockers This Period

| Type | Count | Avg Resolution Time |
|------|-------|---------------------|
| Infrastructure | 3 | 12h |
| Dependencies | 3 | 24h |
| Requirements | 2 | 8h |
| **Total** | **8** | **16h avg** |

**Recurring Issues:**
- Staging database access (2 occurrences)
- Cross-team dependencies causing delays

**Recommendations:**
1. Implement staging environment health monitoring
2. Improve cross-team dependency visibility

---

## Velocity Trends

```
Story Points by Week (November 2025)

Week 1: ████████████████████ 28 pts
Week 2: ██████████████████████████ 32 pts
Week 3: ████████████████████████ 30 pts
Week 4: ██████████████████ 22 pts (holiday week)

Monthly Total: 112 pts (Target: 100 pts) ✅
```

---

## Communication Metrics

| Contractor | Emails | Avg Response | Questions | Updates |
|------------|--------|--------------|-----------|---------|
| backend-001 | 45 | 8h | 6 | 14 |
| frontend-001 | 38 | 6h | 4 | 10 |
| mobile-001 | 42 | 12h | 8 | 12 |
| qa-001 | 52 | 4h | 2 | 18 |
| researcher-001 | 28 | 18h | 10 | 6 |

**Observations:**
- QA most responsive, provides most progress updates
- Researcher slowest response, most questions (may indicate unclear requirements)

---

## Recommendations Summary

### Team-Wide
1. **Improve first-try approval rate** - Add pre-submission checklist
2. **Reduce blocker frequency** - Proactive infrastructure monitoring
3. **Clarify requirements** - More detailed acceptance criteria

### Individual
| Contractor | Primary Recommendation |
|------------|----------------------|
| backend-001 | Security review checklist |
| frontend-001 | Estimation training |
| mobile-001 | Infrastructure support |
| qa-001 | Peer mentoring role |
| researcher-001 | Workload review via email |

---

## Next Period Goals

| Goal | Target | Owner |
|------|--------|-------|
| Team first-try rate | 70% | All |
| Zero SLA breaches | 100% | All |
| Reduce avg cycle time | 60h | All |
| Blocker resolution < 12h | 90% | Coordinator |

---

*Report generated automatically by Contractor Coordinator*
*Correlation ID: report-monthly-2025-11*
```

**Output:** Formatted report document

---

### Stage 4: Identify Insights

**Objective:** Extract actionable insights and recommendations.

**Automated Insights:**

```yaml
insights:
  alerts:
    - type: "quality_decline"
      contractor: "backend-001"
      metric: "first_try_rate"
      current: 0.57
      previous: 0.63
      threshold: 0.70
      severity: "warning"
      recommendation: "Review common revision reasons, add checklist"

    - type: "performance_decline"
      contractor: "researcher-001"
      metric: "overall_score"
      current: 71
      previous: 78
      severity: "attention"
      recommendation: "Send detailed email to discuss challenges"

  achievements:
    - type: "top_performer"
      contractor: "qa-001"
      metric: "overall_score"
      value: 88
      message: "Highest performer this month"

    - type: "improvement"
      contractor: "frontend-001"
      metric: "first_try_rate"
      improvement: "+8%"
      message: "Significant quality improvement"

  patterns:
    - type: "recurring_blocker"
      issue: "staging_database_access"
      frequency: 2
      recommendation: "Systemic fix needed"

    - type: "revision_pattern"
      issue: "missing_edge_cases"
      frequency: 8
      recommendation: "Add edge case checklist to stories"

  risks:
    - type: "capacity_risk"
      description: "Holiday season may reduce availability"
      likelihood: "high"
      mitigation: "Confirm December availability"
```

**Output:** Insights and recommendations

---

### Stage 5: Distribute Report

**Objective:** Send report via SMTP email.

**Report Distribution:**

```yaml
distribution:
  # Stakeholder summary email
  stakeholders:
    to:
      - "pm@yourcompany.com"
      - "lead@yourcompany.com"
    subject: "[PROJECT] November 2025 Contractor Performance Report"
    body: "{executive_summary + key_metrics + recommendations}"
    attachments:
      - name: "contractor-report-2025-11.md"
        content: "{full_report}"

  # Individual contractor summaries (optional)
  contractors:
    send_individual: false  # Configurable
    template: "individual-performance-summary"

  # Coordinator detailed report
  coordinator:
    to: "coordinator@yourcompany.com"
    subject: "[PROJECT] Detailed Contractor Report - November 2025"
    body: "{full_report}"
    include_raw_metrics: true
```

**Stakeholder Email:**

```markdown
Subject: [PROJECT] November 2025 Contractor Performance Report

Hi Team,

Here's the monthly contractor performance summary for November 2025.

## Quick Stats

- **Stories Delivered:** 24 (+15% vs October)
- **Story Points:** 112 (Target: 100) ✅
- **Team Health Score:** 78/100 🟢

## Highlights

✅ QA Engineer (qa-001) top performer with 88/100 score
✅ Frontend Developer quality improving (+8% first-try rate)
✅ Team exceeded story point target by 12%

## Attention Needed

⚠️ Backend Developer first-try rate declining (57% → target 70%)
⚠️ Researcher performance declining, recommend email follow-up
⚠️ Staging database access causing recurring blockers

## Key Recommendations

1. Add pre-submission security checklist for backend
2. Send researcher performance email
3. Implement staging environment monitoring

Full report attached.

---
Report ID: report-monthly-2025-11
```

**Output:** Report emails sent

---

### Stage 6: Archive Report

**Objective:** Save report to file system and update state.

**Save Report File:**

```yaml
archive:
  path: ".bmad/bmm-contractors/reports/2025-11-monthly.md"
  content: "{full_report}"
  metadata:
    report_type: "monthly"
    period_start: "2025-11-01"
    period_end: "2025-11-30"
    generated_at: "2025-12-01T09:00:00Z"
    metrics_snapshot: "{raw_metrics}"
```

**Update Module State:**

```yaml
state_update:
  reports:
    latest:
      type: "monthly"
      period: "2025-11"
      generated_at: "2025-12-01T09:00:00Z"
      file: "reports/2025-11-monthly.md"
      team_score: 78
      stories_completed: 24

    history:
      - {period: "2025-11", type: "monthly", score: 78}
      - {period: "2025-10", type: "monthly", score: 75}
      - {period: "2025-09", type: "monthly", score: 72}

  metrics_history:
    "2025-11":
      team_velocity: 112
      first_try_rate: 0.58
      avg_cycle_time: 68
      sla_compliance: 0.92
```

**Output:** Report archived

---

## Events Published

**contractor.report.generated:**
```yaml
report_type: "monthly"
period: "2025-11"
team_score: 78
stories_completed: 24
story_points: 112
insights_count: 8
alerts_count: 2
generated_at: "2025-12-01T09:00:00Z"
correlation_id: "report-monthly-2025-11"
```

---

## Report Schedule

```yaml
schedule:
  weekly:
    cron: "0 9 * * 1"  # Monday 9 AM
    recipients: ["coordinator", "pm"]
    include: ["velocity", "blockers", "upcoming_deadlines"]

  monthly:
    cron: "0 9 1 * *"  # 1st of month 9 AM
    recipients: ["coordinator", "pm", "lead"]
    include: ["full_analysis", "trends", "recommendations"]

  quarterly:
    cron: "0 9 1 */3 *"  # 1st of quarter 9 AM
    recipients: ["coordinator", "pm", "lead", "management"]
    include: ["strategic_review", "capacity_planning", "contracts"]
```

---

## Custom Reports

**On-Demand Report Request:**

```yaml
custom_report:
  # Single contractor deep-dive
  individual:
    contractor_id: "backend-001"
    period: "last_90_days"
    include_all_stories: true
    include_revision_details: true

  # Specific metric focus
  focused:
    metric: "quality"
    breakdown_by: "revision_reason"
    period: "last_30_days"

  # Comparison report
  comparison:
    contractors: ["backend-001", "frontend-001"]
    metrics: ["velocity", "quality", "reliability"]
    period: "last_60_days"
```

---

## Configuration

```yaml
reporting:
  # Thresholds
  score_thresholds:
    excellent: 85
    good: 70
    needs_improvement: 55
    concern: 0

  # Targets
  targets:
    first_try_rate: 0.70
    on_time_rate: 0.85
    sla_compliance: 0.95
    avg_cycle_time_hours: 72

  # Alerts
  alert_on:
    - metric: "score"
      condition: "decline > 10%"
    - metric: "first_try_rate"
      condition: "< 0.60"
    - metric: "sla_breaches"
      condition: "> 0"

  # Distribution
  auto_distribute: true
  archive_reports: true
  retention_months: 24
```
