# Metrics Review Instructions

## Objective
Perform in-depth analysis of metric trends, identify patterns and anomalies, correlate metrics with events, and generate actionable insights for continuous improvement.

## Prerequisites
- Historical metric data (at least 3 periods recommended)
- Module state with recorded metric history
- Context about recent changes (releases, team changes, process changes)

---

<step n="1" goal="Define review scope">

### Define Review Scope

<ask>What type of metrics review is this?
[s] Sprint retrospective review
[m] Monthly business review
[q] Quarterly planning review
[a] Ad-hoc investigation

Review type: </ask>

<action>Store as {{review_type}}</action>

<ask>Is there a specific focus area for this review?
[v] Velocity and delivery
[q] Quality and testing
[p] Process efficiency
[c] Capacity and planning
[n] No specific focus - comprehensive review

Focus: </ask>

<action>Store as {{focus_area}}</action>

<ask>What period should we analyze?
- From: (date or "last_sprint")
- To: (date or "current")

Period: </ask>

<action>Store as {{analysis_period}}</action>

</step>

---

<step n="2" goal="Load historical data">

### Load Historical Data

<action>Load metric history from module-state.yaml</action>
<action>Load previous {{review_type}} review if exists</action>
<action>Identify comparison baseline period</action>

**Data Loaded:**
- Historical periods available: {{periods_count}}
- Earliest data: {{earliest_date}}
- Latest data: {{latest_date}}
- Baseline period: {{baseline_period}}

</step>

---

<step n="3" goal="Trend analysis">

### Trend Analysis

<action>Calculate trends for each tracked metric</action>
<action>Identify improving, stable, and declining metrics</action>

**Velocity Trends:**

```
Sprint Velocity (Last 6 Sprints)
│
│    ▲
│   ▲ ▲    ▲
│  ▲   ▲  ▲
│ ▲     ▲
├─────────────────
  S1 S2 S3 S4 S5 S6

Rolling Average: {{velocity_avg}}
Trend: {{velocity_trend}} ({{velocity_change}}%)
```

**Quality Trends:**

| Metric | 3 Periods Ago | 2 Periods Ago | Last Period | Current | Trend |
|--------|---------------|---------------|-------------|---------|-------|
| Test Coverage | {{cov_3}}% | {{cov_2}}% | {{cov_1}}% | {{cov_0}}% | {{cov_trend}} |
| Pass Rate | {{pass_3}}% | {{pass_2}}% | {{pass_1}}% | {{pass_0}}% | {{pass_trend}} |
| Defect Rate | {{def_3}} | {{def_2}} | {{def_1}} | {{def_0}} | {{def_trend}} |

**Delivery Trends:**

| Metric | Trend | Change | Assessment |
|--------|-------|--------|------------|
| Cycle Time | {{cycle_trend}} | {{cycle_change}} | {{cycle_assessment}} |
| PR Review Time | {{pr_trend}} | {{pr_change}} | {{pr_assessment}} |
| Deploy Frequency | {{deploy_trend}} | {{deploy_change}} | {{deploy_assessment}} |

</step>

---

<step n="4" goal="Anomaly detection">

### Anomaly Detection

<action>Identify metrics with significant deviations from baseline</action>
<action>Flag sudden changes (>20% swing)</action>
<action>Check for correlation with known events</action>

**Anomalies Detected:**

{{#each anomalies}}
#### {{metric_name}}
- **Current Value:** {{current}}
- **Expected Range:** {{expected_min}} - {{expected_max}}
- **Deviation:** {{deviation_percent}}%
- **First Detected:** {{first_detected}}
- **Possible Causes:** {{possible_causes}}

{{/each}}

<check if="significant_anomaly_detected">
  <publish event="metrics.anomaly.detected">
    <payload>
      <metric_name>{{anomaly_metric}}</metric_name>
      <current_value>{{anomaly_current}}</current_value>
      <expected_value>{{anomaly_expected}}</expected_value>
      <deviation_percent>{{anomaly_deviation}}</deviation_percent>
      <severity>{{anomaly_severity}}</severity>
      <timestamp>{{current_timestamp}}</timestamp>
    </payload>
  </publish>
</check>

</step>

---

<step n="5" goal="Correlation analysis">

### Correlation Analysis

<action>Analyze relationships between metrics</action>
<action>Identify leading and lagging indicators</action>

**Key Correlations Found:**

| Metric A | Metric B | Correlation | Insight |
|----------|----------|-------------|---------|
| Team Size | Velocity | {{team_vel_corr}} | {{team_vel_insight}} |
| PR Review Time | Cycle Time | {{pr_cycle_corr}} | {{pr_cycle_insight}} |
| Test Coverage | Defect Escape | {{cov_def_corr}} | {{cov_def_insight}} |
| Sprint Planning Accuracy | Completion Rate | {{plan_comp_corr}} | {{plan_comp_insight}} |

**Leading Indicators:**
These metrics predict future performance:
{{#each leading_indicators}}
- {{indicator}}: {{prediction}}
{{/each}}

</step>

---

<step n="6" goal="Period comparison">

### Period-over-Period Comparison

<action>Compare current period to baseline</action>
<action>Calculate improvements and regressions</action>

**Comparison: {{current_period}} vs {{baseline_period}}**

| Category | Baseline | Current | Change | Status |
|----------|----------|---------|--------|--------|
| Velocity | {{vel_base}} | {{vel_curr}} | {{vel_change}} | {{vel_status}} |
| Quality | {{qual_base}} | {{qual_curr}} | {{qual_change}} | {{qual_status}} |
| Delivery | {{del_base}} | {{del_curr}} | {{del_change}} | {{del_status}} |
| SLA Compliance | {{sla_base}}% | {{sla_curr}}% | {{sla_change}} | {{sla_status}} |

**Improvements:**
{{#each improvements}}
- {{metric}}: Improved by {{improvement}} ({{cause}})
{{/each}}

**Regressions:**
{{#each regressions}}
- {{metric}}: Declined by {{decline}} ({{cause}})
{{/each}}

</step>

---

<step n="7" goal="Root cause analysis" condition="regressions_exist or anomalies_exist">

### Root Cause Analysis

<ask>For the identified regressions/anomalies, can you provide context?

Recent events to consider:
- Team changes (joiners/leavers)
- Process changes
- Technical changes (new tools, migrations)
- External factors (holidays, incidents)

Context: </ask>

<action>Store as {{external_context}}</action>

**Root Cause Analysis:**

{{#each issues_to_analyze}}
#### {{metric_name}} {{direction}}

**Symptoms:**
- {{symptom_1}}
- {{symptom_2}}

**Potential Root Causes:**
1. {{cause_1}} (likelihood: {{likelihood_1}})
2. {{cause_2}} (likelihood: {{likelihood_2}})
3. {{cause_3}} (likelihood: {{likelihood_3}})

**Recommended Investigation:**
- {{investigation_step_1}}
- {{investigation_step_2}}

{{/each}}

</step>

---

<step n="8" goal="Generate recommendations">

### Recommendations

<action>Generate actionable recommendations based on analysis</action>
<action>Prioritize by impact and effort</action>

**High Priority Recommendations:**

{{#each high_priority_recs}}
#### {{number}}. {{title}}
- **Issue:** {{issue}}
- **Impact:** {{impact}}
- **Recommendation:** {{recommendation}}
- **Expected Outcome:** {{expected_outcome}}
- **Effort:** {{effort_level}}

{{/each}}

**Medium Priority Recommendations:**
{{#each medium_priority_recs}}
- {{recommendation}}
{{/each}}

**Monitoring Suggestions:**
{{#each monitoring_suggestions}}
- {{suggestion}}
{{/each}}

</step>

---

<step n="9" goal="Generate review report">

### Generate Review Report

<template-output section="metrics-review-report">
Generate a comprehensive metrics review report including:
- Executive summary
- Trend analysis with visualizations
- Anomaly findings
- Period comparison
- Root cause analysis (if applicable)
- Prioritized recommendations
- Action items with owners
- Follow-up metrics to watch
</template-output>

**Report Generated:** {{output_file_path}}

</step>

---

<step n="10" goal="Publish review completion">

### Complete Review

<publish event="metrics.review.completed">
  <payload>
    <review_type>{{review_type}}</review_type>
    <period>{{analysis_period}}</period>
    <key_findings>{{key_findings_summary}}</key_findings>
    <recommendations_count>{{recommendations_count}}</recommendations_count>
    <anomalies_count>{{anomalies_count}}</anomalies_count>
    <overall_health_change>{{health_change}}</overall_health_change>
    <report_path>{{output_file_path}}</report_path>
    <timestamp>{{current_timestamp}}</timestamp>
  </payload>
</publish>

<action>Update module state with review timestamp and summary</action>

</step>

---

## Completion

Metrics review complete for **{{analysis_period}}**.

**Key Findings:**
{{#each key_findings}}
- {{finding}}
{{/each}}

**Health Assessment:**
- Overall trend: {{overall_trend}}
- Areas improving: {{improving_count}}
- Areas declining: {{declining_count}}
- Anomalies detected: {{anomalies_count}}

**Next Steps:**
1. Share report with stakeholders
2. Discuss recommendations in retrospective
3. Assign owners to action items
4. Schedule follow-up review: {{next_review_date}}

**Report Location:** {{output_file_path}}
