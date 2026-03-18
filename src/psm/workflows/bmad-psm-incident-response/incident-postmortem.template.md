---
template_name: incident-postmortem
template_version: "1.0.0"
created_date: 2026-03-17
description: Standard postmortem template for incident analysis and learning
---

# Incident Postmortem: {{INCIDENT_TITLE}}

**Date**: {{INCIDENT_DATE}}
**Duration**: {{START_TIME}} — {{END_TIME}} ({{DURATION_MINUTES}} minutes)
**Severity**: {{SEV1|SEV2|SEV3}} ({{IMPACT_DESCRIPTION}})
**Lead**: {{INCIDENT_COMMANDER_NAME}}
**Facilitator**: {{POSTMORTEM_FACILITATOR_NAME}}

---

## Summary

[1-2 paragraph executive summary of what happened, impact, and resolution]

**Timeline at a glance**:
- T-0:00 — Normal operation
- T-{{TIME1}} — {{EVENT1}}
- T-{{TIME2}} — {{EVENT2}}
- T-{{RESOLUTION_TIME}} — Incident resolved

**Impact**: {{METRIC1}} affected {{X}} users, {{METRIC2}}, {{METRIC3}}

---

## Detailed Timeline

| Time | Event | Notes |
|------|-------|-------|
| {{T}} | {{What happened}} | {{Who detected it}} |
| {{T+X}} | {{Next event}} | {{Action taken}} |
| {{T+Y}} | {{Root cause identified}} | {{By whom}} |
| {{T+Z}} | {{Fix applied}} | {{Verification steps}} |
| {{T+Final}} | {{Incident resolved}} | {{Verification}} |

---

## Root Cause Analysis

### Primary Cause

**{{ROOT_CAUSE_TITLE}}**

{{Detailed explanation of the root cause}}

**How it happened**:
1. {{Precondition 1}} (why the system was vulnerable)
2. {{Trigger event}} (what caused the failure)
3. {{Failure cascade}} (why it got worse)
4. {{Detection lag}} (why it took X minutes to detect)

**Evidence**:
- {{Log entry or metric showing the issue}}
- {{Related system behavior}}
- {{Impact indicator}}

### Contributing Factors

- {{Factor 1}} — {{Brief explanation}}
- {{Factor 2}} — {{Brief explanation}}
- {{Factor 3}} — {{Brief explanation}}

### Why Didn't We Catch This?

- {{Missing monitoring}} — {{What metric would have alerted}}
- {{Testing gap}} — {{What test would have failed}}
- {{Documentation gap}} — {{What runbook would have helped}}
- {{Knowledge gap}} — {{What training would have helped}}

---

## Impact Assessment

### User Impact

- **Duration**: {{START_TIME}} — {{END_TIME}} ({{DURATION}} minutes)
- **Scale**: {{X}}% of {{METRIC}} (e.g., 5% of payment requests)
- **Users Affected**: {{APPROX_COUNT}} users
- **Revenue Impact**: {{$X}} (if applicable)
- **Customer Escalations**: {{NUMBER}} tickets opened

**User-facing symptoms**:
- {{Symptom 1}} (e.g., "Checkout returns 500 error")
- {{Symptom 2}} (e.g., "Page loads slowly")
- {{Symptom 3}}

### Operational Impact

- **System Recovery**: {{SERVICE/METRIC}} took {{TIME}} to recover
- **Cascading Effects**: {{SERVICE_X}} also affected due to {{reason}}
- **On-call Load**: {{NUMBER}} pages, {{NUMBER}} escalations
- **Data Loss**: {{None | {{Description}}}}

---

## Resolution & Recovery

### Immediate Actions Taken

1. **{{Time T+X}}** — {{Action 1}}
   - Rationale: {{Why this helped}}
   - Result: {{What changed}}

2. **{{Time T+Y}}** — {{Action 2}}
   - Rationale: {{Why this helped}}
   - Result: {{What changed}}

3. **{{Time T+Z}}** — {{Root Fix Applied}}
   - Details: {{Technical description}}
   - Verification: {{How we confirmed it worked}}

### Rollback/Rollforward Decision

**Decision**: {{Rollback to version X | Rollforward with fix | Hybrid approach}}

**Rationale**: {{Explain why this was the right choice}}

**Verification**: {{How we confirmed the fix worked}}

---

## Lessons Learned

### What Went Well

- {{Thing we did right}} — This prevented {{worse outcome}}
- {{Thing we did right}} — Team coordination was excellent
- {{Thing we did right}} — Monitoring caught {{something}}

### What We Can Improve

| Issue | Category | Severity | Recommendation | Owner |
|-------|----------|----------|-----------------|-------|
| {{We didn't detect it for X minutes}} | Observability | HIGH | Add alert for {{metric}} when > {{threshold}} | DevOps |
| {{Runbook was outdated}} | Runbooks | MEDIUM | Update {{runbook}} with new architecture | SRE |
| {{New service not in alerting system}} | Process | MEDIUM | Add new services to alert config automatically | Platform |
| {{Team didn't know about new feature}} | Knowledge | LOW | Document new features in wiki | Tech Lead |

---

## Action Items

### Critical (Must Complete Before Similar Incident)

- [ ] **{{Action 1}}** — {{Description}}
  - Owner: {{NAME}}
  - Deadline: {{DATE}} (within 1 week)
  - Acceptance: {{How we verify it's done}}

- [ ] **{{Action 2}}** — {{Description}}
  - Owner: {{NAME}}
  - Deadline: {{DATE}} (within 1 week)
  - Acceptance: {{How we verify it's done}}

### High Priority (Target Next 2 Weeks)

- [ ] {{Action}} — Owner: {{NAME}}, Deadline: {{DATE}}
- [ ] {{Action}} — Owner: {{NAME}}, Deadline: {{DATE}}
- [ ] {{Action}} — Owner: {{NAME}}, Deadline: {{DATE}}

### Medium Priority (Target This Sprint)

- [ ] {{Action}} — Owner: {{NAME}}
- [ ] {{Action}} — Owner: {{NAME}}

### Backlog (Good to Have)

- [ ] {{Action}} — {{Description}}
- [ ] {{Action}} — {{Description}}

---

## Prevention Measures

### Short-term (1-2 Weeks)

1. **{{Mitigation 1}}** — Prevents {{this exact incident}} from happening again
   - How: {{Technical approach}}
   - Effort: {{Estimate}}
   - Timeline: {{When}}

2. **{{Mitigation 2}}** — Catches similar issues earlier
   - How: {{Technical approach}}
   - Effort: {{Estimate}}
   - Timeline: {{When}}

### Long-term (Next Quarter)

1. **{{Large architectural change}}** — Eliminates root cause class
   - Rationale: {{Why this is better}}
   - Effort: {{Estimate}}
   - Timeline: {{When}}

---

## Incident Stats

```
MTTD (Mean Time To Detect): {{MINUTES}} minutes
  - Automatic detection: {{If applicable, how}}
  - Manual detection: {{Who found it}}

MTTR (Mean Time To Resolve): {{MINUTES}} minutes
  - Investigation time: {{MINUTES}}
  - Fix implementation time: {{MINUTES}}
  - Verification time: {{MINUTES}}

Severity: {{SEV1|SEV2|SEV3}} ({{Criteria}})
```

---

## Distribution & Follow-up

- [x] Postmortem shared with: {{TEAM_LIST}}
- [x] Customer communication sent: {{YES|NO|TEMPLATE_USED}}
- [x] Action items tracked in: {{JIRA/BACKLOG}}
- [x] Follow-up review scheduled: {{DATE}}

**Follow-up Review**: {{DATE}} with {{ATTENDEES}}
- Confirm all critical action items completed
- Verify prevention measures working
- Check for recurring patterns

---

## Appendix: Supporting Evidence

### Logs

```
[Relevant log entries showing the incident]

{{TIMESTAMP}} ERROR: {{MESSAGE}}
{{TIMESTAMP}} ERROR: {{MESSAGE}}
```

### Metrics

[Include screenshots or links to metric dashboards showing the incident]

- Error rate spike: [Chart or metric]
- Latency spike: [Chart or metric]
- Traffic pattern: [Chart or metric]

### Configuration Changes

```yaml
# Changes made before incident
- {{Change 1}} ({{TIMESTAMP}})
- {{Change 2}} ({{TIMESTAMP}})
```

---

**Document Completed By**: {{NAME}}
**Date**: {{DATE}}
**Review Status**: Draft | Final | Approved

**Approvals**:
- [ ] Incident Commander: {{NAME}} {{DATE}}
- [ ] Service Owner: {{NAME}} {{DATE}}
- [ ] VP Engineering (if SEV1): {{NAME}} {{DATE}}
