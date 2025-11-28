# Track Metrics Instructions

## Objective
Collect current metric values, calculate KPIs, check SLA compliance, and generate a metrics report with actionable insights.

## Prerequisites
- KPIs defined (via `*define-kpis`)
- SLAs defined (via `*define-slas`)
- Access to source data (stories, sprints, test results)

---

<step n="1" goal="Select tracking scope">

### Select Metrics Scope

<ask>What metrics would you like to track?
[a] All configured metrics
[v] Velocity metrics only
[q] Quality metrics only
[d] Delivery metrics only
[c] Custom selection

Choice: </ask>

<action>Store as {{metric_category}}</action>

<ask>What time period should we report on?
[s] Current sprint
[l] Last 30 days
[w] Last week
[m] Last month
[c] Custom date range

Period: </ask>

<action>Store as {{reporting_period}}</action>
<action>Calculate {{period_start}} and {{period_end}} dates</action>

</step>

---

<step n="2" goal="Load configuration and state">

### Load Configuration

<action>Load KPI definitions from config</action>
<action>Load SLA thresholds from config</action>
<action>Load current state from module-state.yaml</action>

**Active KPIs:** {{active_kpi_count}}
**Active SLAs:** {{active_sla_count}}
**Last Update:** {{last_update_timestamp}}

</step>

---

<step n="3" goal="Collect velocity metrics" condition="metric_category in ['a', 'v']">

### Velocity Metrics

<action>Query completed stories in {{reporting_period}}</action>
<action>Calculate sprint velocity (points or count)</action>
<action>Calculate rolling average velocity</action>

**Current Sprint Velocity:**

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Stories Completed | {{stories_completed}} | {{stories_planned}} | {{completion_status}} |
| Points Completed | {{points_completed}} | {{points_planned}} | {{points_status}} |
| Completion Rate | {{completion_rate}}% | {{target_completion}}% | {{rate_status}} |

**Velocity Trend:**
- Current: {{current_velocity}}
- Rolling Average (6 sprints): {{rolling_average}}
- Trend: {{velocity_trend}}

<check if="completion_rate < sla.sprint_completion.warning">
  <action>Flag velocity warning</action>
</check>

</step>

---

<step n="4" goal="Collect delivery metrics" condition="metric_category in ['a', 'd']">

### Delivery Metrics

<action>Calculate story cycle times for period</action>
<action>Calculate PR review turnaround times</action>
<action>Count deployments in period</action>

**Cycle Time Analysis:**

| Metric | P50 | P90 | Target | Status |
|--------|-----|-----|--------|--------|
| Story Cycle Time | {{cycle_p50}}d | {{cycle_p90}}d | {{cycle_target}}d | {{cycle_status}} |
| PR Review Time | {{pr_p50}}h | {{pr_p90}}h | {{pr_target}}h | {{pr_status}} |

**Deployment Frequency:**
- Deployments this period: {{deployment_count}}
- Average per week: {{deployments_per_week}}
- Target: {{deployment_target}}

<check if="cycle_p90 > sla.story_cycle_time.breach">
  <publish event="metrics.sla.breach">
    <payload>
      <sla_name>story_cycle_time</sla_name>
      <threshold>{{sla.story_cycle_time.breach}}</threshold>
      <actual_value>{{cycle_p90}}</actual_value>
      <severity>warning</severity>
      <period>{{reporting_period}}</period>
    </payload>
  </publish>
</check>

</step>

---

<step n="5" goal="Collect quality metrics" condition="metric_category in ['a', 'q']">

### Quality Metrics

<action>Get current test coverage percentage</action>
<action>Get test pass rate from latest run</action>
<action>Count open defects by severity</action>
<action>Check security scan results</action>

**Quality Dashboard:**

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Test Coverage | {{test_coverage}}% | {{coverage_target}}% | {{coverage_status}} |
| Test Pass Rate | {{test_pass_rate}}% | 100% | {{test_status}} |
| Code Review Coverage | {{review_coverage}}% | 100% | {{review_status}} |

**Defects:**
- Critical: {{critical_defects}}
- High: {{high_defects}}
- Medium: {{medium_defects}}
- Low: {{low_defects}}

**Security:**
- Critical Vulnerabilities: {{critical_vulns}}
- High Vulnerabilities: {{high_vulns}}

<check if="test_coverage < quality_gates.test_coverage.threshold">
  <action>Flag coverage below threshold</action>
</check>

<check if="critical_vulns > 0 or high_vulns > quality_gates.max_high_vulns">
  <publish event="metrics.sla.breach">
    <payload>
      <sla_name>security_vulnerabilities</sla_name>
      <threshold>0 critical, {{quality_gates.max_high_vulns}} high</threshold>
      <actual_value>{{critical_vulns}} critical, {{high_vulns}} high</actual_value>
      <severity>critical</severity>
      <blocking>true</blocking>
    </payload>
  </publish>
</check>

</step>

---

<step n="6" goal="Calculate KPI status">

### KPI Status Summary

<action>For each defined KPI, compare current value to target</action>
<action>Calculate overall KPI health score</action>

**KPI Health Dashboard:**

| KPI | Current | Target | Status | Trend |
|-----|---------|--------|--------|-------|
{{#each kpis}}
| {{name}} | {{current_value}} | {{target}} | {{status_emoji}} {{status}} | {{trend_arrow}} |
{{/each}}

**Overall KPI Health:** {{overall_health_percentage}}%

<action>Categorize KPIs: {{green_count}} on-track, {{yellow_count}} at-risk, {{red_count}} off-track</action>

</step>

---

<step n="7" goal="Check SLA compliance">

### SLA Compliance Check

<action>Check each SLA against current values</action>
<action>Calculate compliance percentage</action>

**SLA Compliance Status:**

| SLA | Threshold | Current | Compliant | Blocking |
|-----|-----------|---------|-----------|----------|
{{#each slas}}
| {{name}} | {{threshold}} | {{current_value}} | {{compliant_emoji}} | {{blocking}} |
{{/each}}

**Overall SLA Compliance:** {{sla_compliance_percentage}}%

<check if="any_sla_breached">
  **SLA Breaches Detected:**
  {{breached_slas_list}}

  <action>Trigger notifications per alerting config</action>
</check>

</step>

---

<step n="8" goal="Update state and publish">

### Update State

<action>Update module-state.yaml with current metric values</action>
<action>Record metric history for trend analysis</action>
<action>Save timestamp of last update</action>

<publish event="metrics.kpi.updated">
  <payload>
    <kpi_count>{{active_kpi_count}}</kpi_count>
    <kpis>{{kpi_values_array}}</kpis>
    <overall_health>{{overall_health_percentage}}</overall_health>
    <sla_compliance>{{sla_compliance_percentage}}</sla_compliance>
    <period>{{reporting_period}}</period>
    <timestamp>{{current_timestamp}}</timestamp>
  </payload>
</publish>

</step>

---

<step n="9" goal="Generate report">

### Generate Metrics Report

<template-output section="metrics-report">
Generate a comprehensive metrics report including:
- Executive summary with health scores
- Velocity section with trends
- Quality section with recommendations
- Delivery section with bottleneck analysis
- SLA compliance summary
- Action items for at-risk metrics
</template-output>

**Report Generated:** {{output_file_path}}

</step>

---

## Completion

Metrics tracking complete for **{{reporting_period}}**.

**Summary:**
- **KPI Health:** {{overall_health_percentage}}%
- **SLA Compliance:** {{sla_compliance_percentage}}%
- **Metrics Updated:** {{metrics_updated_count}}
- **Report:** {{output_file_path}}

**Attention Needed:**
{{#if red_kpis}}
- {{red_count}} KPIs off-track: {{red_kpis_list}}
{{/if}}
{{#if breached_slas}}
- {{breach_count}} SLA breaches: {{breached_slas_list}}
{{/if}}

Use `*metrics-review` for deeper trend analysis.
