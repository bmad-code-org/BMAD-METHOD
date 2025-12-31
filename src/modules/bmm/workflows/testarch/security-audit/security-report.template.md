# Security Audit Report

**Project:** {{project_name}}
**Date:** {{date}}
**Scope:** {{audit_scope}}
**Auditor:** {{user_name}} + TEA Agent

---

## Executive Summary

{{executive_summary}}

---

## Risk Summary

| Severity | Count | Status |
|----------|-------|--------|
| Critical | {{critical_count}} | {{critical_status}} |
| High | {{high_count}} | {{high_status}} |
| Medium | {{medium_count}} | {{medium_status}} |
| Low | {{low_count}} | {{low_status}} |

**Overall Risk Level:** {{overall_risk}}

---

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | {{framework}} | {{framework_version}} |
| Language | {{language}} | {{language_version}} |
| Database | {{database}} | {{database_version}} |
| Authentication | {{auth_method}} | - |

---

## Critical Findings

{{#each critical_findings}}
### {{this.id}}: {{this.title}}

**Severity:** CRITICAL
**Category:** {{this.category}}
**Location:** `{{this.location}}`

**Description:**
{{this.description}}

**Evidence:**
```
{{this.evidence}}
```

**Impact:**
{{this.impact}}

**Remediation:**
{{this.remediation}}

**References:**
- {{this.references}}

---
{{/each}}

## High Severity Findings

{{#each high_findings}}
### {{this.id}}: {{this.title}}

**Severity:** HIGH
**Category:** {{this.category}}
**Location:** `{{this.location}}`

**Description:**
{{this.description}}

**Remediation:**
{{this.remediation}}

---
{{/each}}

## Medium Severity Findings

{{#each medium_findings}}
### {{this.id}}: {{this.title}}

**Severity:** MEDIUM
**Category:** {{this.category}}
**Location:** `{{this.location}}`

**Description:**
{{this.description}}

**Remediation:**
{{this.remediation}}

---
{{/each}}

## Low Severity Findings

{{#each low_findings}}
### {{this.id}}: {{this.title}}

**Severity:** LOW
**Category:** {{this.category}}

**Description:**
{{this.description}}

**Remediation:**
{{this.remediation}}

---
{{/each}}

## Dependency Vulnerabilities

| Package | Version | CVE | Severity | Fix Version |
|---------|---------|-----|----------|-------------|
{{#each dependency_vulns}}
| {{this.package}} | {{this.version}} | {{this.cve}} | {{this.severity}} | {{this.fix_version}} |
{{/each}}

---

## Secret Detection Results

| Type | File | Line | Status |
|------|------|------|--------|
{{#each secrets_found}}
| {{this.type}} | {{this.file}} | {{this.line}} | {{this.status}} |
{{/each}}

---

## OWASP Coverage

| Category | Status | Findings |
|----------|--------|----------|
| A01 - Broken Access Control | {{a01_status}} | {{a01_count}} |
| A02 - Cryptographic Failures | {{a02_status}} | {{a02_count}} |
| A03 - Injection | {{a03_status}} | {{a03_count}} |
| A04 - Insecure Design | {{a04_status}} | {{a04_count}} |
| A05 - Security Misconfiguration | {{a05_status}} | {{a05_count}} |
| A06 - Vulnerable Components | {{a06_status}} | {{a06_count}} |
| A07 - Authentication Failures | {{a07_status}} | {{a07_count}} |
| A08 - Software Integrity Failures | {{a08_status}} | {{a08_count}} |
| A09 - Logging & Monitoring Failures | {{a09_status}} | {{a09_count}} |
| A10 - SSRF | {{a10_status}} | {{a10_count}} |

---

## Recommendations

### Immediate Actions (Critical/High)

1. {{immediate_action_1}}
2. {{immediate_action_2}}
3. {{immediate_action_3}}

### Short-term Actions (Medium)

1. {{short_term_action_1}}
2. {{short_term_action_2}}

### Long-term Improvements (Low/Hardening)

1. {{long_term_action_1}}
2. {{long_term_action_2}}

---

## Appendix A: Tools Used

- Dependency Scanner: {{dep_scanner}}
- Secret Scanner: {{secret_scanner}}
- Static Analysis: {{static_analysis}}

## Appendix B: Files Reviewed

{{#each files_reviewed}}
- `{{this}}`
{{/each}}

---

**Report Generated:** {{timestamp}}
**Next Audit Recommended:** {{next_audit_date}}
