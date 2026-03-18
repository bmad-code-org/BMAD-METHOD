---
workflow_id: SA001
workflow_name: Security Audit
description: Comprehensive security review using security patterns, config management, and compliance framework
entry_point: steps/step-01-scope.md
phase: 4-cross
lead_agent: "Hà (Security)"
status: "active"
created_date: 2026-03-17
version: "1.0.0"
estimated_duration: "2-3 hours"
outputFile: '{output_folder}/psm-artifacts/security-audit-{{project_name}}-{{date}}.md'
---

# Workflow: Security Audit

## Goal
Perform comprehensive security evaluation using Production Systems BMAD framework, covering threat modeling, vulnerability assessment, compliance, and security controls.

## Overview

Security audit is a critical cross-functional workflow that evaluates service security posture before production deployment or for ongoing compliance verification. The audit:

1. **Scopes** the audit engagement, defines threat model, and identifies compliance requirements
2. **Executes** detailed security assessment across multiple domains (authentication, data protection, infrastructure, API security)
3. **Reports** findings with severity levels, remediation recommendations, and compliance status

## Execution Path

```
START
  ↓
[Step 01] Scope & Threat Model (Define audit scope, identify threats, compliance reqs)
  ↓
[Step 02] Security Assessment (Execute checklist across domains, identify vulns)
  ↓
[Step 03] Security Report (Findings report, severity, recommendations, compliance)
  ↓
END
```

## Key Roles

| Role | Agent | Responsibility |
|------|-------|-----------------|
| Lead | Hà (Security) | Lead audit, coordinate assessment, synthesize findings |
| Subject Matter | Service Owner + Platform Eng | Provide architecture, answer security questions |
| Compliance | Security/Compliance Team | Validate compliance mapping, sign-off |

## Assessment Domains (5)

1. **Authentication & Authorization** — Identity verification, access control, session management
2. **API Security** — Input validation, rate limiting, API key management, CORS
3. **Secrets Management** — Credential storage, rotation, access logging
4. **Encryption** — In-transit (TLS), at-rest, key management
5. **PII & Data Protection** — Classification, access controls, audit logging, retention

## Input Requirements

- **Service architecture diagram** — Components, data flows, external integrations
- **Authentication/authorization approach** — OAuth2, JWT, SAML, custom
- **Secrets storage mechanism** — Vault, cloud provider, environment variables
- **Compliance requirements** — GDPR, CCPA, SOC2, industry-specific
- **Known security controls** — WAF, TLS config, authentication libraries

## Output Deliverable

- **Security Audit Report** (template: `security-audit-report.template.md`)
  - Audit scope and threat model
  - Findings organized by domain with severity (Critical/High/Medium/Low)
  - Remediation recommendations with priority and effort
  - Compliance status matrix
  - Sign-off

## Success Criteria

1. All security domains assessed with clear findings
2. Severity levels assigned (using CVSS or similar framework)
3. Remediation plan with owners and deadlines
4. Compliance requirements verified (if applicable)
5. Team alignment on security posture

## Next Steps After Workflow

- If **COMPLIANT**: Document in security registry; schedule periodic re-audit
- If **NON-COMPLIANT**: Add remediation items to backlog; track closure
- If **CRITICAL ISSUES**: Consider production pause until resolved

---

**Navigation**: [← Back to 4-cross](../), [Next: Step 01 →](steps/step-01-scope.md)
