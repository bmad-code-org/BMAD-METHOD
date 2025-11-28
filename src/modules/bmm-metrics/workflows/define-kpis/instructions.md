# Define KPIs Instructions

## Objective
Define meaningful Key Performance Indicators (KPIs) for product and engineering metrics that align with business objectives and drive actionable improvements.

## Prerequisites
- Understanding of business objectives and success criteria
- Access to historical data for baseline calculation (if available)
- Stakeholder input on what matters most

---

<step n="1" goal="Understand KPI context">

### Understand Business Context

<ask>What type of KPIs would you like to define?
[p] Product KPIs - User engagement, adoption, retention
[e] Engineering KPIs - Velocity, quality, DORA metrics
[q] Quality KPIs - Test coverage, defect rates, SLA compliance
[a] All of the above

Choice: </ask>

<action>Store selection as {{kpi_category}}</action>

<ask>What are the primary business objectives these KPIs should support?
(e.g., "Improve user retention", "Increase deployment frequency", "Reduce defect escape rate")

Objectives: </ask>

<action>Store as {{business_objectives}}</action>

</step>

---

<step n="2" goal="Define product KPIs" condition="kpi_category in ['p', 'a']">

### Product KPIs

<template-guidance>
For each product KPI, we need:
- Name and description
- Formula/calculation method
- Target value and threshold levels
- Measurement frequency
- Owner responsible for tracking
</template-guidance>

**Recommended Product KPIs:**

| KPI | Description | Typical Target |
|-----|-------------|----------------|
| User Activation Rate | % of new users completing key action | 40-60% |
| Feature Adoption Rate | % of users using new features | 20-40% |
| User Retention (D7/D30) | % of users returning after 7/30 days | 40%/20% |
| NPS Score | Net Promoter Score | >30 |
| Time to Value | Time for user to achieve first success | <5 min |

<ask>Which product KPIs would you like to track?
Select by letter or provide custom KPIs:

[a] User Activation Rate
[b] Feature Adoption Rate
[c] User Retention
[d] NPS Score
[e] Time to Value
[f] Custom (describe)

Selection: </ask>

<action>For each selected KPI, gather target and threshold values</action>

<ask>For each selected KPI, provide:
- Target value (green zone)
- Warning threshold (yellow zone)
- Critical threshold (red zone)

Format: KPI: target / warning / critical</ask>

<action>Store as {{product_kpis}}</action>

</step>

---

<step n="3" goal="Define engineering KPIs" condition="kpi_category in ['e', 'a']">

### Engineering KPIs

**DORA Metrics (Industry Standard):**

| Metric | Description | Elite | High | Medium | Low |
|--------|-------------|-------|------|--------|-----|
| Deployment Frequency | How often code deploys to production | On-demand | Daily-Weekly | Weekly-Monthly | Monthly+ |
| Lead Time for Changes | Time from commit to production | <1 hour | 1 day-1 week | 1 week-1 month | 1-6 months |
| Change Failure Rate | % of deployments causing failures | 0-15% | 16-30% | 31-45% | 46-60% |
| Mean Time to Recovery | Time to restore service | <1 hour | <1 day | <1 week | 1 week+ |

**Velocity Metrics:**

| Metric | Description | Typical Range |
|--------|-------------|---------------|
| Sprint Velocity | Story points completed per sprint | Varies by team |
| Story Cycle Time | Days from start to done | 2-5 days |
| PR Review Time | Hours to first review | <4 hours |
| Build Success Rate | % of builds that pass | >95% |

<ask>Which engineering KPIs would you like to track?

[a] All DORA metrics
[b] Deployment Frequency only
[c] Lead Time for Changes only
[d] Change Failure Rate only
[e] MTTR only
[f] Sprint Velocity
[g] Story Cycle Time
[h] PR Review Time
[i] Build Success Rate
[j] Custom (describe)

Selection (comma-separated): </ask>

<action>Store as {{engineering_kpis}}</action>

<ask>What performance tier are you targeting?
[e] Elite
[h] High
[m] Medium

Target tier: </ask>

<action>Set thresholds based on selected tier</action>

</step>

---

<step n="4" goal="Define quality KPIs" condition="kpi_category in ['q', 'a']">

### Quality KPIs

| Metric | Description | Typical Target |
|--------|-------------|----------------|
| Test Coverage | % of code covered by tests | >80% |
| Test Pass Rate | % of tests passing | 100% |
| Defect Escape Rate | Defects found in production vs total | <5% |
| Code Review Coverage | % of PRs with reviews | 100% |
| Security Vulnerability Count | Open high/critical vulns | 0 |
| Technical Debt Ratio | Debt time vs dev time | <5% |

<ask>Which quality KPIs would you like to track?

[a] Test Coverage
[b] Test Pass Rate
[c] Defect Escape Rate
[d] Code Review Coverage
[e] Security Vulnerabilities
[f] Technical Debt Ratio
[g] All of the above

Selection: </ask>

<action>Store as {{quality_kpis}}</action>

<ask>Set targets for selected quality KPIs:
Format: KPI: target

Example:
- Test Coverage: 85%
- Defect Escape Rate: <3%

Your targets: </ask>

<action>Parse and store quality KPI targets</action>

</step>

---

<step n="5" goal="Establish baselines">

### Establish Baselines

<ask>Do you have historical data to establish baselines?
[y] Yes - I can provide historical values
[n] No - Start fresh and establish baselines over time
[p] Partial - Some metrics have history

Response: </ask>

<check if="response == 'y' or response == 'p'">
<ask>Please provide baseline values for metrics with historical data:
Format: metric_name: baseline_value

Example:
- deployment_frequency: 2/week
- test_coverage: 72%

Baselines: </ask>

<action>Store as {{baselines}}</action>
</check>

<check if="response == 'n'">
<action>Mark all KPIs as "baseline_pending"</action>
<action>Set baseline_period to {{baseline_period}} for automatic calculation</action>
</check>

</step>

---

<step n="6" goal="Assign ownership">

### Assign KPI Ownership

<template-guidance>
Each KPI needs:
- An owner who monitors and reports on it
- A frequency of measurement
- An action plan when thresholds are breached
</template-guidance>

<ask>Who should own each category of KPIs?
- Product KPIs owner:
- Engineering KPIs owner:
- Quality KPIs owner:

(Enter names or roles): </ask>

<action>Store as {{kpi_owners}}</action>

<ask>How frequently should KPIs be reviewed?
[d] Daily dashboard updates
[w] Weekly review meetings
[s] Sprint-based review
[m] Monthly business review

Frequency: </ask>

<action>Store as {{review_frequency}}</action>

</step>

---

<step n="7" goal="Generate KPI definition file">

### Generate KPI Definitions

<action>Generate KPI definition YAML file with all collected information</action>

<template-output section="kpi-definitions">
Generate a YAML file containing:
- All defined KPIs organized by category
- Each KPI with: name, description, formula, target, warning_threshold, critical_threshold
- Baseline values where available
- Ownership assignments
- Review frequency
- Business objectives alignment
</template-output>

**Generated KPI Definition:**
- File: {{output_file_path}}
- Total KPIs defined: {{total_kpi_count}}
- Categories: {{categories_list}}

</step>

---

<step n="8" goal="Publish KPI definition event" critical="true">

### Publish KPI Definition Event

<publish event="metrics.kpi.defined">
  <payload>
    <kpi_count>{{total_kpi_count}}</kpi_count>
    <categories>{{categories_list}}</categories>
    <kpis>{{kpis_array}}</kpis>
    <baselines>{{baselines}}</baselines>
    <owners>{{kpi_owners}}</owners>
    <review_frequency>{{review_frequency}}</review_frequency>
    <timestamp>{{current_timestamp}}</timestamp>
  </payload>
</publish>

<action>Log: "KPI definitions created - {{total_kpi_count}} KPIs across {{categories_list}}"</action>

</step>

---

## Completion

KPI definition complete.

**Summary:**
- **Total KPIs Defined:** {{total_kpi_count}}
- **Categories:** {{categories_list}}
- **Review Frequency:** {{review_frequency}}
- **Definition File:** {{output_file_path}}

**Next Steps:**
1. Share KPI definitions with stakeholders for review
2. Configure dashboards to display KPI values
3. Set up alerting for threshold breaches
4. Begin baseline measurement period if needed

Use `*track-metrics` to start collecting KPI values.
