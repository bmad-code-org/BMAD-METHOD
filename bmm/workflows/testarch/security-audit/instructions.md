# Security Audit Workflow Instructions

## Overview

Conduct a comprehensive security audit of the codebase covering OWASP Top 10 vulnerabilities, dependency security, secret detection, and authentication/authorization patterns.

## Workflow Steps

### Step 1: Scope Determination

**Ask user for audit scope:**
```
Security Audit Scope Selection

Available scopes:
1. [full] Complete security audit (recommended)
2. [owasp] OWASP Top 10 vulnerability focus
3. [deps] Dependency vulnerabilities only
4. [secrets] Secret detection only
5. [auth] Authentication/authorization review
6. [api] API security assessment

Select scope [1-6] or enter scope name:
```

### Step 2: Context Loading

**Load project context:**
1. Load architecture document for understanding system design
2. Load project-context.md for coding standards and patterns
3. Identify technology stack (framework, language, dependencies)
4. Note any existing security configurations

### Step 3: OWASP Top 10 Assessment

**For each vulnerability category:**

#### A01:2021 - Broken Access Control
- [ ] Check for missing access controls on functions
- [ ] Review CORS configuration
- [ ] Verify principle of least privilege
- [ ] Check for insecure direct object references (IDOR)
- [ ] Review JWT/session validation

#### A02:2021 - Cryptographic Failures
- [ ] Check for hardcoded secrets
- [ ] Verify HTTPS enforcement
- [ ] Review encryption algorithms used
- [ ] Check password hashing (bcrypt, argon2)
- [ ] Verify secure random number generation

#### A03:2021 - Injection
- [ ] SQL injection in database queries
- [ ] NoSQL injection patterns
- [ ] Command injection in system calls
- [ ] LDAP injection
- [ ] XPath injection

#### A04:2021 - Insecure Design
- [ ] Review authentication flows
- [ ] Check for business logic flaws
- [ ] Verify rate limiting implementation
- [ ] Review error handling patterns

#### A05:2021 - Security Misconfiguration
- [ ] Default credentials check
- [ ] Unnecessary features enabled
- [ ] Error messages exposing info
- [ ] Security headers missing
- [ ] Debug mode in production

#### A06:2021 - Vulnerable Components
- [ ] Outdated dependencies
- [ ] Known CVEs in dependencies
- [ ] Unmaintained packages
- [ ] License compliance issues

#### A07:2021 - Authentication Failures
- [ ] Weak password policies
- [ ] Missing brute-force protection
- [ ] Session management issues
- [ ] Multi-factor authentication gaps

#### A08:2021 - Software Integrity Failures
- [ ] CI/CD pipeline security
- [ ] Unsigned code/packages
- [ ] Insecure deserialization
- [ ] Missing integrity checks

#### A09:2021 - Logging & Monitoring Failures
- [ ] Insufficient logging
- [ ] Missing audit trails
- [ ] No alerting mechanisms
- [ ] Log injection vulnerabilities

#### A10:2021 - Server-Side Request Forgery
- [ ] Unvalidated URL parameters
- [ ] Internal service exposure
- [ ] DNS rebinding risks

### Step 4: Dependency Vulnerability Scan

**Scan dependencies for known vulnerabilities:**

```bash
# Node.js
npm audit
npx better-npm-audit audit

# Python
pip-audit
safety check

# Go
govulncheck ./...

# General
trivy fs .
grype .
```

**Document findings:**
- CVE identifier
- Severity (Critical/High/Medium/Low)
- Affected package and version
- Fix version available
- Remediation path

### Step 5: Secret Detection

**Scan for exposed secrets:**

Patterns to detect:
- API keys (AWS, GCP, Azure, etc.)
- Database connection strings
- Private keys (RSA, SSH)
- OAuth tokens
- JWT secrets
- Password literals
- Environment variable leaks

**Tools:**
```bash
# Gitleaks
gitleaks detect --source . --verbose

# TruffleHog
trufflehog filesystem .

# detect-secrets
detect-secrets scan
```

**Check locations:**
- Source code files
- Configuration files
- Environment files (.env, .env.*)
- Docker files
- CI/CD configurations
- Git history

### Step 6: Authentication/Authorization Review

**Authentication checks:**
- Password storage mechanism
- Session management
- Token handling (JWT, OAuth)
- MFA implementation
- Password reset flow
- Account lockout policy

**Authorization checks:**
- Role-based access control (RBAC)
- Attribute-based access control (ABAC)
- API endpoint protection
- Resource-level permissions
- Admin panel security

### Step 7: API Security Assessment

**Review API endpoints for:**
- Authentication requirements
- Rate limiting
- Input validation
- Output encoding
- CORS configuration
- API versioning
- Documentation exposure

**Check for:**
- Mass assignment vulnerabilities
- Excessive data exposure
- Broken function level authorization
- Improper inventory management

### Step 8: Generate Report

**Create security audit report with:**

```markdown
# Security Audit Report

**Date:** {{date}}
**Scope:** {{audit_scope}}
**Auditor:** {{user_name}} + TEA Agent

## Executive Summary
{{executive_summary}}

## Risk Summary
| Severity | Count |
|----------|-------|
| Critical | {{critical_count}} |
| High | {{high_count}} |
| Medium | {{medium_count}} |
| Low | {{low_count}} |

## Findings

### Critical Findings
{{detailed_critical_issues}}

### High Severity Findings
{{detailed_high_issues}}

### Medium Severity Findings
{{detailed_medium_issues}}

### Low Severity Findings
{{detailed_low_issues}}

## Recommendations
{{prioritized_remediation_steps}}

## Appendix
- Full OWASP checklist results: {{owasp_results}}
- Dependency scan output: {{dependency_scan_output}}
- Secret detection results: {{secret_detection_results}}
```

### Step 9: Remediation Guidance

**For each finding, provide:**
1. Clear description of the vulnerability
2. Location in codebase (file:line)
3. Risk assessment (likelihood + impact)
4. Remediation steps
5. Code example of fix (where applicable)
6. References (CWE, OWASP, CVE)

### Step 10: Validation Checklist

Before completing audit:
- [ ] All scope items assessed
- [ ] Findings documented with evidence
- [ ] Severity ratings justified
- [ ] Remediation steps actionable
- [ ] Report saved to output location
- [ ] No false positives in critical findings

## Output

Save report to: `{{output_file}}`

Notify user of completion with:
- Summary of findings
- Link to full report
- Top 3 priority items to address
- Offer to help with remediation
