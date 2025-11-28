# Define SLAs Instructions

## Objective
Define Service Level Agreements (SLAs) with clear thresholds, monitoring rules, and escalation procedures to ensure consistent delivery and quality standards.

## Prerequisites
- KPIs defined (run `*define-kpis` first if not done)
- Understanding of team capacity and realistic targets
- Stakeholder agreement on acceptable service levels

---

<step n="1" goal="Understand SLA requirements">

### Understand SLA Context

<ask>What type of SLAs would you like to define?
[d] Delivery SLAs - Story cycle time, sprint completion, release frequency
[q] Quality SLAs - Test coverage, defect rates, review turnaround
[o] Operations SLAs - Uptime, response time, incident resolution
[a] All of the above

Choice: </ask>

<action>Store as {{sla_category}}</action>

<ask>What is the business context for these SLAs?
(e.g., "Client contract requirements", "Internal quality standards", "Compliance requirements")

Context: </ask>

<action>Store as {{sla_context}}</action>

</step>

---

<step n="2" goal="Define delivery SLAs" condition="sla_category in ['d', 'a']">

### Delivery SLAs

| SLA | Description | Typical Target |
|-----|-------------|----------------|
| Story Cycle Time | Max days from start to done | 5 days |
| Sprint Completion Rate | Min % of committed stories completed | 80% |
| Release Frequency | Min releases per period | 1/week |
| PR Review Turnaround | Max hours to first review | 4 hours |
| Bug Fix SLA | Max time to fix by severity | P1: 4h, P2: 24h, P3: 1w |

<ask>Define your delivery SLAs:

**Story Cycle Time**
- Target (green): ___ days
- Warning (yellow): ___ days
- Breach (red): ___ days

**Sprint Completion Rate**
- Target (green): ____%
- Warning (yellow): ____%
- Breach (red): ____%

**PR Review Turnaround**
- Target (green): ___ hours
- Warning (yellow): ___ hours
- Breach (red): ___ hours

Enter values: </ask>

<action>Parse and store as {{delivery_slas}}</action>

<ask>Should delivery SLAs be blocking for releases?
[y] Yes - Breach prevents release
[n] No - Warning only, allow release
[s] Some - Select which are blocking

Response: </ask>

<action>Store blocking configuration</action>

</step>

---

<step n="3" goal="Define quality SLAs" condition="sla_category in ['q', 'a']">

### Quality SLAs

| SLA | Description | Typical Target |
|-----|-------------|----------------|
| Test Coverage | Min code coverage percentage | 80% |
| Test Pass Rate | Min tests passing | 100% |
| Code Review Coverage | % of changes with review | 100% |
| Defect Escape Rate | Max defects escaping to prod | <5% |
| Security Scan Pass | No high/critical vulnerabilities | 0 |

<ask>Define your quality SLAs:

**Test Coverage**
- Target (green): ____%
- Warning (yellow): ____%
- Breach (red): ____%

**Test Pass Rate**
- Target (green): ____%
- Warning (yellow): ____%
- Breach (red): ____%

**Code Review Coverage**
- Required: [y/n]
- Blocking for release: [y/n]

**Security Vulnerabilities**
- Max critical allowed: ___
- Max high allowed: ___

Enter values: </ask>

<action>Parse and store as {{quality_slas}}</action>

</step>

---

<step n="4" goal="Define operations SLAs" condition="sla_category in ['o', 'a']">

### Operations SLAs

| SLA | Description | Typical Target |
|-----|-------------|----------------|
| Service Uptime | Min availability percentage | 99.9% |
| API Response Time | P95 response time | <200ms |
| Incident Response | Max time to acknowledge | P1: 15m, P2: 1h |
| MTTR | Mean time to recovery | <4 hours |
| Error Rate | Max error percentage | <1% |

<ask>Define your operations SLAs:

**Service Uptime**
- Target: ____%
- Measurement window: [daily/weekly/monthly]

**API Response Time (P95)**
- Target: ___ ms
- Warning: ___ ms
- Breach: ___ ms

**Incident Response Time**
- P1 (Critical): ___ minutes
- P2 (High): ___ hours
- P3 (Medium): ___ hours

**MTTR Target**
- Target: ___ hours
- Max allowed: ___ hours

Enter values: </ask>

<action>Parse and store as {{operations_slas}}</action>

</step>

---

<step n="5" goal="Configure alerting rules">

### Configure Alerting

<ask>How should SLA breaches be communicated?

**Warning Level (approaching threshold):**
[a] Dashboard indicator only
[b] Slack/Teams notification
[c] Email notification
[d] All of the above

**Breach Level (threshold exceeded):**
[a] Dashboard indicator only
[b] Slack/Teams notification
[c] Email notification
[d] PagerDuty/On-call alert
[e] All of the above

Warning notification: 
Breach notification: </ask>

<action>Store as {{alerting_config}}</action>

<ask>Who should receive SLA notifications?

- Delivery SLAs: (team/role/email)
- Quality SLAs: (team/role/email)
- Operations SLAs: (team/role/email)

Recipients: </ask>

<action>Store as {{notification_recipients}}</action>

<ask>Set notification timing:
- Warn at ___% of threshold (e.g., 80%)
- Remind every ___ hours if breach persists

Values: </ask>

<action>Store as {{notification_timing}}</action>

</step>

---

<step n="6" goal="Define escalation procedures">

### Escalation Procedures

<ask>Define escalation for persistent breaches:

**Level 1 (Immediate):**
- Who: ___
- Action: ___

**Level 2 (After ___ hours):**
- Who: ___
- Action: ___

**Level 3 (After ___ hours):**
- Who: ___
- Action: ___

Escalation details: </ask>

<action>Store as {{escalation_procedures}}</action>

</step>

---

<step n="7" goal="Generate SLA definition file">

### Generate SLA Definitions

<action>Generate comprehensive SLA definition file</action>

<template-output section="sla-definitions">
Generate a YAML file containing:
- All SLA definitions organized by category
- Each SLA with: name, target, warning_threshold, breach_threshold, blocking status
- Alerting configuration
- Notification recipients
- Escalation procedures
- Measurement methodology
</template-output>

**Generated SLA Definition:**
- File: {{output_file_path}}
- Total SLAs defined: {{total_sla_count}}
- Blocking SLAs: {{blocking_sla_count}}

</step>

---

<step n="8" goal="Publish SLA definition event" critical="true">

### Publish SLA Definition Event

<publish event="metrics.sla.defined">
  <payload>
    <sla_count>{{total_sla_count}}</sla_count>
    <categories>{{categories_list}}</categories>
    <blocking_slas>{{blocking_slas_list}}</blocking_slas>
    <alerting_config>{{alerting_config}}</alerting_config>
    <timestamp>{{current_timestamp}}</timestamp>
  </payload>
</publish>

<action>Log: "SLA definitions created - {{total_sla_count}} SLAs defined"</action>

</step>

---

## Completion

SLA definition complete.

**Summary:**
- **Total SLAs Defined:** {{total_sla_count}}
- **Blocking SLAs:** {{blocking_sla_count}}
- **Categories:** {{categories_list}}
- **Definition File:** {{output_file_path}}

**Next Steps:**
1. Review SLA definitions with stakeholders
2. Configure monitoring dashboards
3. Set up alerting integrations
4. Communicate SLAs to the team

Use `*sla-status` to check current compliance.
