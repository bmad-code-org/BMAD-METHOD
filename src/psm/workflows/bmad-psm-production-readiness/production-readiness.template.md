---
template_name: production-readiness-checklist
template_version: "1.0.0"
created_date: 2026-03-17
description: Production Readiness Review checklist and report template
---

# Production Readiness Review (PRR)

**Service**: {{SERVICE_NAME}}
**Owner**: {{SERVICE_OWNER}}
**Reviewer**: {{SRE_LEAD}} (Minh)
**Review Date**: {{DATE}}
**Target Go-Live**: {{TARGET_DATE}}

---

## Executive Summary

{{1-2 paragraphs summarizing the readiness assessment, decision, and key findings}}

**Overall Assessment**: {{READY | CONDITIONAL | NOT_READY}}

**Timeline**: Service {{can | can conditionally | cannot}} proceed to production {{on {{DATE}}}}

---

## Production Readiness Scorecard

### 9-Dimension Assessment

| # | Dimension | Score | Status | Key Finding |
|---|-----------|-------|--------|-------------|
| 1 | Reliability | {{GREEN|YELLOW|RED}} | ✅/⚠️/❌ | {{Brief finding}} |
| 2 | Observability | {{GREEN|YELLOW|RED}} | ✅/⚠️/❌ | {{Brief finding}} |
| 3 | Performance | {{GREEN|YELLOW|RED}} | ✅/⚠️/❌ | {{Brief finding}} |
| 4 | Security | {{GREEN|YELLOW|RED}} | ✅/⚠️/❌ | {{Brief finding}} |
| 5 | Capacity | {{GREEN|YELLOW|RED}} | ✅/⚠️/❌ | {{Brief finding}} |
| 6 | Data | {{GREEN|YELLOW|RED}} | ✅/⚠️/❌ | {{Brief finding}} |
| 7 | Runbooks | {{GREEN|YELLOW|RED}} | ✅/⚠️/❌ | {{Brief finding}} |
| 8 | Dependencies | {{GREEN|YELLOW|RED}} | ✅/⚠️/❌ | {{Brief finding}} |
| 9 | Rollback | {{GREEN|YELLOW|RED}} | ✅/⚠️/❌ | {{Brief finding}} |

**Summary**: {{X}} GREEN, {{Y}} YELLOW, {{Z}} RED

---

## Detailed Findings by Dimension

### 1. Reliability

**Goal**: Service meets SLO targets with documented failure modes and incident response plan.

**Findings**:

- [ ] {{Finding 1}} ({{Status}})
- [ ] {{Finding 2}} ({{Status}})
- [ ] {{Finding 3}} ({{Status}})

**Assessment**: {{Detailed narrative, 3-5 sentences}}

**Score**: {{GREEN|YELLOW|RED}}

---

### 2. Observability

**Goal**: Service has comprehensive logging, metrics, tracing, and dashboards for operational visibility.

**Findings**:

- [ ] {{Finding 1}} ({{Status}})
- [ ] {{Finding 2}} ({{Status}})
- [ ] {{Finding 3}} ({{Status}})

**Assessment**: {{Detailed narrative, 3-5 sentences}}

**Score**: {{GREEN|YELLOW|RED}}

---

### 3. Performance

**Goal**: Service meets latency/throughput targets and scales under expected load.

**Findings**:

- [ ] {{Finding 1}} ({{Status}})
- [ ] {{Finding 2}} ({{Status}})
- [ ] {{Finding 3}} ({{Status}})

**Assessment**: {{Detailed narrative, 3-5 sentences}}

**Score**: {{GREEN|YELLOW|RED}}

---

### 4. Security

**Goal**: Authentication, authorization, encryption, and secrets management are implemented.

**Findings**:

- [ ] {{Finding 1}} ({{Status}})
- [ ] {{Finding 2}} ({{Status}})
- [ ] {{Finding 3}} ({{Status}})

**Assessment**: {{Detailed narrative, 3-5 sentences}}

**Score**: {{GREEN|YELLOW|RED}}

---

### 5. Capacity

**Goal**: Resource requirements defined with growth headroom and cost acceptable.

**Findings**:

- [ ] {{Finding 1}} ({{Status}})
- [ ] {{Finding 2}} ({{Status}})
- [ ] {{Finding 3}} ({{Status}})

**Assessment**: {{Detailed narrative, 3-5 sentences}}

**Score**: {{GREEN|YELLOW|RED}}

---

### 6. Data

**Goal**: Data governance, backup, retention, and disaster recovery documented and tested.

**Findings**:

- [ ] {{Finding 1}} ({{Status}})
- [ ] {{Finding 2}} ({{Status}})
- [ ] {{Finding 3}} ({{Status}})

**Assessment**: {{Detailed narrative, 3-5 sentences}}

**Score**: {{GREEN|YELLOW|RED}}

---

### 7. Runbooks

**Goal**: Incident response, deployment, troubleshooting procedures documented and drilled.

**Findings**:

- [ ] {{Finding 1}} ({{Status}})
- [ ] {{Finding 2}} ({{Status}})
- [ ] {{Finding 3}} ({{Status}})

**Assessment**: {{Detailed narrative, 3-5 sentences}}

**Score**: {{GREEN|YELLOW|RED}}

---

### 8. Dependencies

**Goal**: External/internal dependencies mapped, versioned, with fallback strategies.

**Findings**:

- [ ] {{Finding 1}} ({{Status}})
- [ ] {{Finding 2}} ({{Status}})
- [ ] {{Finding 3}} ({{Status}})

**Assessment**: {{Detailed narrative, 3-5 sentences}}

**Score**: {{GREEN|YELLOW|RED}}

---

### 9. Rollback

**Goal**: Safe rollback strategy tested; deployment is reversible.

**Findings**:

- [ ] {{Finding 1}} ({{Status}})
- [ ] {{Finding 2}} ({{Status}})
- [ ] {{Finding 3}} ({{Status}})

**Assessment**: {{Detailed narrative, 3-5 sentences}}

**Score**: {{GREEN|YELLOW|RED}}

---

## Critical Blockers (P0)

{{If any P0 blockers exist:}}

Service **CANNOT** proceed to production until these are resolved:

### P0 Blocker #1: {{ISSUE_TITLE}}

- **Dimension**: {{Which dimension}}
- **Description**: {{What's the problem}}
- **Impact**: {{Why it's critical}}
- **Resolution**: {{How to fix}}
- **Owner**: {{Who must fix it}}
- **Deadline**: {{When it must be done}}
- **Acceptance**: {{How we verify it's fixed}}

### P0 Blocker #2: {{ISSUE_TITLE}}

{{Repeat format}}

---

## Risks to Manage (P1)

Service can proceed with documented monitoring and contingency plans:

### P1 Risk #1: {{ISSUE_TITLE}}

- **Dimension**: {{Which dimension}}
- **Description**: {{What's the problem}}
- **Impact**: {{If it happens, what's the consequence}}
- **Likelihood**: {{HIGH|MEDIUM|LOW}}
- **Mitigation**: {{How we'll manage it}}
- **Monitoring**: {{What metrics to watch}}
- **Contingency**: {{What we'll do if it occurs}}
- **Owner**: {{Who owns this risk}}
- **Target Fix**: {{Timeline to resolve permanently}}

### P1 Risk #2: {{ISSUE_TITLE}}

{{Repeat format}}

---

## Recommendations

**High Priority** (Next sprint):
- {{Recommendation 1}}
- {{Recommendation 2}}

**Medium Priority** (Within 1 month):
- {{Recommendation 1}}
- {{Recommendation 2}}

**Nice to Have** (Backlog):
- {{Recommendation 1}}
- {{Recommendation 2}}

---

## Final Decision

### Decision

**{{ ✅ GO | ⚠️ CONDITIONAL-GO | ❌ NO-GO }}**

### Rationale

{{Explain the decision. Why can/can't we proceed?}}

### Conditions (If CONDITIONAL-GO)

If proceeding despite P1 risks, document conditions:

1. **{{Condition 1}}**: {{Description}}
   - Owner: {{Who oversees this}}
   - Success Criteria: {{How we verify it}}
   - Escalation: {{Who to contact if issues}}

2. **{{Condition 2}}**: {{Description}}
   - Owner: {{Who oversees this}}
   - Success Criteria: {{How we verify it}}
   - Escalation: {{Who to contact if issues}}

### Deployment Timeline

{{If GO or CONDITIONAL-GO:}}

- **Approved for deployment**: {{DATE}}
- **Earliest go-live**: {{DATE}}
- **Recommended window**: {{DATE/TIME}}
- **On-call coverage required**: {{YES|NO}}
- **Emergency rollback plan**: {{REFERENCE TO RUNBOOK}}

---

## Sign-offs & Approvals

### Approval Chain

- [ ] **SRE Lead** ({{NAME}}) — Review completed and findings approved
  - Signature: ________________________ Date: __________

- [ ] **Architecture Lead** ({{NAME}}) — Architecture validated
  - Signature: ________________________ Date: __________

- [ ] **Service Owner** ({{NAME}}) — Acknowledged findings and committed to actions
  - Signature: ________________________ Date: __________

- [ ] **VP Engineering** ({{NAME}}) — Risk accepted (if CONDITIONAL-GO)
  - Signature: ________________________ Date: __________

---

## Post-Production Plan

### First 24 Hours

- [ ] SRE on-call monitoring closely
- [ ] Daily standup with service team
- [ ] Monitor for any unusual patterns
- [ ] Be ready to rollback if needed

### First Week

- [ ] Daily metrics review
- [ ] Watch for data drift or unusual behavior
- [ ] Follow up on any P1 risks

### Ongoing

- [ ] Monthly PRR follow-ups to verify improvements
- [ ] Track action items to completion
- [ ] Update this PRR if significant changes made

---

## Action Items

| ID | Action | Owner | Deadline | Type | Status |
|----|--------|-------|----------|------|--------|
| A1 | {{Action}} | {{Name}} | {{Date}} | {{BLOCKER|RISK|RECOMMENDATION}} | ☐ |
| A2 | {{Action}} | {{Name}} | {{Date}} | {{BLOCKER|RISK|RECOMMENDATION}} | ☐ |
| A3 | {{Action}} | {{Name}} | {{Date}} | {{BLOCKER|RISK|RECOMMENDATION}} | ☐ |

---

## Appendix

### A. Load Test Results

[Link to or summary of load test results showing service meets performance targets]

### B. Security Review Results

[Link to or summary of security audit findings]

### C. Architecture Diagrams

[Include or link to system architecture, data flow, and deployment topology]

### D. SLO Definition

[Document the agreed-upon SLO targets for availability, latency, error rate]

### E. Runbooks

[Link to or list of key runbooks: incident response, deployment, rollback, troubleshooting]

---

**Report prepared by**: {{SRE_LEAD}}
**Report date**: {{DATE}}
**Last updated**: {{DATE}}
