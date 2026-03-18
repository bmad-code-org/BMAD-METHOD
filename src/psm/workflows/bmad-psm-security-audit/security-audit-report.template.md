---
template_name: security-audit-report
template_version: "1.0.0"
created_date: 2026-03-17
description: Security audit report with findings, severity levels, and remediation plan
---

# Security Audit Report

**Service**: {{SERVICE_NAME}}
**Service Owner**: {{SERVICE_OWNER}}
**Auditor**: {{SECURITY_LEAD}} (Hà)
**Audit Date**: {{START_DATE}} — {{END_DATE}}
**Report Date**: {{REPORT_DATE}}
**Scope**: {{SCOPE_DESCRIPTION}}

---

## Executive Summary

This security audit evaluated {{SERVICE_NAME}} against security best practices and compliance requirements. The assessment identified {{X}} findings across {{Y}} security domains.

**Overall Security Posture**: {{COMPLIANT | FINDINGS | CRITICAL}}

{{1-2 paragraph summary of key findings, critical issues if any, and recommendations}}

---

## Audit Scope

### Services Reviewed

- {{Service 1}} ({{Description}})
- {{Service 2}} ({{Description}})
- {{Service 3}} ({{Description}})

### Assessment Domains

- ✅ Authentication & Authorization
- ✅ API Security
- ✅ Secrets Management
- ✅ Encryption (in-transit & at-rest)
- ✅ PII & Data Protection

### Exclusions

{{Any out-of-scope areas:}}
- {{Item}} (reason)
- {{Item}} (reason)

---

## Findings Summary

### By Severity

| Severity | Count | Trend |
|----------|-------|-------|
| **Critical** | {{X}} | {{↑/→/↓}} |
| **High** | {{Y}} | {{↑/→/↓}} |
| **Medium** | {{Z}} | {{↑/→/↓}} |
| **Low** | {{W}} | {{↑/→/↓}} |
| **Total** | {{X+Y+Z+W}} | |

### By Domain

| Domain | Critical | High | Medium | Low | Status |
|--------|----------|------|--------|-----|--------|
| Auth & Authz | {{#}} | {{#}} | {{#}} | {{#}} | ✅/⚠️/❌ |
| API Security | {{#}} | {{#}} | {{#}} | {{#}} | ✅/⚠️/❌ |
| Secrets Mgmt | {{#}} | {{#}} | {{#}} | {{#}} | ✅/⚠️/❌ |
| Encryption | {{#}} | {{#}} | {{#}} | {{#}} | ✅/⚠️/❌ |
| PII & Data | {{#}} | {{#}} | {{#}} | {{#}} | ✅/⚠️/❌ |

---

## Critical Severity Findings

### [F1] {{Finding Title}}

**Severity**: CRITICAL (CVSS {{8.0-10.0}})
**Domain**: {{Which domain}}
**Status**: {{Open | In Progress | Resolved}}

**Description**:
{{Detailed description of the vulnerability, how it could be exploited, and the impact}}

**Evidence**:
- {{Evidence 1}}
- {{Evidence 2}}
- {{Testing confirmation}}

**Impact**:
- {{Business impact}}
- {{Technical impact}}
- {{Compliance impact}}

**Remediation**:
1. {{Step 1}} ({{Estimated time}})
2. {{Step 2}} ({{Estimated time}})
3. {{Step 3}} ({{Estimated time}})

**Owner**: {{Name}}
**Target Fix Date**: {{DATE}}
**Effort**: {{Est. hours/days}}
**Verification**: {{How we'll confirm it's fixed}}

---

### [F2] {{Finding Title}}

{{Repeat Critical severity format}}

---

## High Severity Findings

### [F3] {{Finding Title}}

**Severity**: HIGH (CVSS {{7.0-7.9}})
**Domain**: {{Which domain}}
**Status**: {{Open | In Progress | Resolved}}

**Description**: {{Brief description}}

**Impact**: {{Why it matters}}

**Remediation**:
1. {{Step 1}}
2. {{Step 2}}

**Owner**: {{Name}}
**Target Date**: {{DATE}}

---

### [F4] {{Finding Title}}

{{Repeat High severity format}}

---

## Medium Severity Findings

### [F5] {{Finding Title}}

**Severity**: MEDIUM (CVSS {{4.0-6.9}})
**Domain**: {{Which domain}}
**Description**: {{Brief description}}
**Remediation**: {{Brief fix}}
**Owner**: {{Name}} | **Target Date**: {{DATE}}

---

### [F6] {{Finding Title}}

{{Repeat Medium severity format}}

---

## Low Severity Findings

### [F7] {{Finding Title}}

**Severity**: LOW (CVSS {{0.1-3.9}})
**Description**: {{Brief description}}
**Remediation**: {{Brief fix}}

---

### [F8] {{Finding Title}}

{{Repeat Low severity format}}

---

## Domain-Specific Assessment

### Domain 1: Authentication & Authorization

**Status**: {{COMPLIANT | FINDINGS | CRITICAL}}

**Strengths**:
- {{Positive finding 1}}
- {{Positive finding 2}}

**Gaps**:
- {{Gap 1}} — {{Impact}}
- {{Gap 2}} — {{Impact}}

**Recommendations**:
1. {{Recommendation 1}}
2. {{Recommendation 2}}

---

### Domain 2: API Security

**Status**: {{COMPLIANT | FINDINGS | CRITICAL}}

**Strengths**:
- {{Positive finding 1}}
- {{Positive finding 2}}

**Gaps**:
- {{Gap 1}} — {{Impact}}
- {{Gap 2}} — {{Impact}}

**Recommendations**:
1. {{Recommendation 1}}
2. {{Recommendation 2}}

---

### Domain 3: Secrets Management

**Status**: {{COMPLIANT | FINDINGS | CRITICAL}}

**Strengths**:
- {{Positive finding 1}}
- {{Positive finding 2}}

**Gaps**:
- {{Gap 1}} — {{Impact}}
- {{Gap 2}} — {{Impact}}

**Recommendations**:
1. {{Recommendation 1}}
2. {{Recommendation 2}}

---

### Domain 4: Encryption

**Status**: {{COMPLIANT | FINDINGS | CRITICAL}}

**Strengths**:
- {{Positive finding 1}}
- {{Positive finding 2}}

**Gaps**:
- {{Gap 1}} — {{Impact}}
- {{Gap 2}} — {{Impact}}

**Recommendations**:
1. {{Recommendation 1}}
2. {{Recommendation 2}}

---

### Domain 5: PII & Data Protection

**Status**: {{COMPLIANT | FINDINGS | CRITICAL}}

**Strengths**:
- {{Positive finding 1}}
- {{Positive finding 2}}

**Gaps**:
- {{Gap 1}} — {{Impact}}
- {{Gap 2}} — {{Impact}}

**Recommendations**:
1. {{Recommendation 1}}
2. {{Recommendation 2}}

---

## Compliance Assessment

### GDPR (General Data Protection Regulation)

**Applicable**: {{YES | NO | PARTIAL}}
**Status**: {{COMPLIANT | NON-COMPLIANT | CONDITIONAL}}

| Requirement | Status | Finding | Gap Fix |
|-------------|--------|---------|---------|
| Data Encryption | {{✅/❌}} | {{Description}} | {{Remediation}} |
| Access Control | {{✅/❌}} | {{Description}} | {{Remediation}} |
| Retention Policy | {{✅/❌}} | {{Description}} | {{Remediation}} |
| Right to Deletion | {{✅/❌}} | {{Description}} | {{Remediation}} |
| Data Processing Agreement | {{✅/❌}} | {{Description}} | {{Remediation}} |

**Timeline to Compliance**: {{DATE or "Already compliant"}}

---

### PCI-DSS (Payment Card Industry Data Security Standard)

**Applicable**: {{YES | NO | PARTIAL}}
**Status**: {{COMPLIANT | NON-COMPLIANT | CONDITIONAL}}

| Requirement | Status | Finding | Gap Fix |
|-------------|--------|---------|---------|
| TLS 1.2+ | {{✅/❌}} | {{Description}} | {{Remediation}} |
| Secrets Management | {{✅/❌}} | {{Description}} | {{Remediation}} |
| Input Validation | {{✅/❌}} | {{Description}} | {{Remediation}} |

**Timeline to Compliance**: {{DATE or "Already compliant"}}

---

### SOC 2 Type II

**Applicable**: {{YES | NO | PARTIAL}}
**Status**: {{COMPLIANT | NON-COMPLIANT | CONDITIONAL}}

**Gap Summary**: {{Description of gaps or "No gaps identified"}}

**Timeline**: {{When audit can be conducted}}

---

### Other Regulations

{{Any other applicable standards (HIPAA, FINRA, etc.)}}

---

## Remediation Roadmap

### Critical Path (Week 1-2)

**All Critical findings must be fixed before production deployment.**

- [ ] {{F1}} — Owner: {{Name}}, Deadline: {{DATE}}
- [ ] {{F2}} — Owner: {{Name}}, Deadline: {{DATE}}

**Milestone**: Security re-scan on {{DATE}} to verify fixes

---

### Phase 2 (Week 3-4)

Complete High-severity findings:

- [ ] {{F3}} — Owner: {{Name}}, Deadline: {{DATE}}
- [ ] {{F4}} — Owner: {{Name}}, Deadline: {{DATE}}

**Milestone**: Second security review on {{DATE}}

---

### Phase 3 (Weeks 5-8)

Address Medium-severity findings (can be post-production with monitoring):

- [ ] {{F5}} — Owner: {{Name}}, Target: {{DATE}}
- [ ] {{F6}} — Owner: {{Name}}, Target: {{DATE}}

---

### Backlog (Next Sprint)

Low-severity items:

- [ ] {{F7}} — {{Brief description}}
- [ ] {{F8}} — {{Brief description}}

---

## Remediation Status Tracking

| Finding | Owner | Deadline | Status | Last Update | Notes |
|---------|-------|----------|--------|-------------|-------|
| F1 | {{Name}} | {{Date}} | 🔴 Pending | {{Date}} | {{Notes}} |
| F2 | {{Name}} | {{Date}} | 🟡 In Progress | {{Date}} | {{Notes}} |
| F3 | {{Name}} | {{Date}} | 🟢 Complete | {{Date}} | {{Notes}} |

---

## Post-Audit Monitoring

### Controls to Monitor

{{If service proceeds to production despite findings:}}

- **{{Control 1}}** — Monitor via {{method}}, alert if {{threshold}}
- **{{Control 2}}** — Monitor via {{method}}, alert if {{threshold}}
- **{{Control 3}}** — Monitor via {{method}}, alert if {{threshold}}

### Incident Response

If a security incident occurs:
1. Activate incident response team
2. Notify {{Escalation contacts}}
3. Follow {{Incident response runbook}}
4. Conduct post-incident security review

---

## Risk Assessment Matrix

```
             LIKELIHOOD
             Low    Med    High
    CRITICAL  H      C      C
IMPACT
    HIGH      M      H      C
    MEDIUM    L      M      H
    LOW       L      L      M

Legend: C=Critical, H=High, M=Medium, L=Low
```

**Our findings map**:
- {{F1}} — {{Position on matrix}}
- {{F2}} — {{Position on matrix}}

---

## Positive Findings

**Strengths to maintain:**

- {{Positive 1}} — Keep doing this
- {{Positive 2}} — Keep doing this
- {{Positive 3}} — Keep doing this

---

## Recommendations Summary

### Immediate (Critical)
- {{Fix all Critical findings}} ({{effort}})

### Short-term (High Priority)
- {{Fix all High findings}} ({{effort}})
- {{Implement automated scanning}} ({{effort}})
- {{Setup security monitoring}} ({{effort}})

### Medium-term
- {{Implement {{technology}} for {{purpose}}}} ({{effort}})
- {{Security training for team}} ({{effort}})

### Long-term (Next 6 Months)
- {{Major security initiative}} ({{effort}})
- {{Penetration testing}} ({{effort}})

---

## Sign-offs & Approvals

### Audit Approval

- [ ] **Security Lead** ({{AUDITOR_NAME}})
  - Signature: ________________________ Date: __________
  - Assessment complete and findings documented

### Service Owner Acknowledgment

- [ ] **Service Owner** ({{SERVICE_OWNER}})
  - Signature: ________________________ Date: __________
  - Acknowledged findings and committed to remediation

### Compliance Officer Review

- [ ] **Compliance Officer** ({{NAME}})
  - Signature: ________________________ Date: __________
  - Compliance requirements verified

### Executive Approval (If Production Clearance Needed)

- [ ] **VP Engineering / Security** ({{NAME}})
  - Signature: ________________________ Date: __________
  - Risk accepted; approved for production

---

## Distribution

- [x] Shared with: {{Service team, Leadership, Compliance}}
- [x] Date shared: {{DATE}}
- [x] Follow-up review scheduled: {{DATE}}

---

## Appendix: Testing Evidence

### Code Review Findings

```
{{Code snippets demonstrating vulnerabilities}}
```

### Configuration Issues

```
{{Configuration examples showing gaps}}
```

### Dependencies Scan

```
{{Vulnerable dependencies identified}}
```

---

**Report Prepared By**: {{AUDITOR_NAME}}
**Report Date**: {{DATE}}
**Review Status**: Draft | Final | Approved
