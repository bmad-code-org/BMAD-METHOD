# Step 5: Security & Compliance Framework

## Purpose

Define security, authentication, and compliance through detailed discussion.

## Context for Agent

Go through each security area methodically. Document all business rules and requirements.

## Instructions

### 5A: Authentication

1. Methods: email/password, OAuth, SSO, passwordless, biometric
2. Multi-factor authentication needs
3. Session management: lifetime, remember me, concurrent sessions
4. Business rules: password requirements, lockout policies, reset flow, timeout

### 5B: Authorization

1. User roles (admin, user, moderator, etc.)
2. Per-role capabilities
3. Row-level security (can users only see their own data?)
4. API access control
5. Business rules: permission matrix, data visibility, rate limiting per role

### 5C: Data Protection

1. Encryption at rest: passwords, PII, payment data, other sensitive fields
2. TLS/HTTPS for all traffic
3. Backup strategy: frequency, retention, RTO, RPO
4. Business rules: encryption algorithms, key management, deletion policies

### 5D: Compliance & Regulations

1. **GDPR** (if EU users):
   - Consent: cookie consent, processing consent, withdrawal
   - User rights: access, deletion, rectification, portability, objection
   - Protection: privacy policy, breach notification (72h), DPIA
   - Business rules: consent tracking, retention periods, export format

2. **Other regulations:** CCPA, HIPAA, PCI-DSS, COPPA — document applicable ones

3. **Data residency:** Geographic storage requirements, cross-border restrictions

4. **Industry-specific:** Financial, healthcare, education compliance

5. **Audit logging:** Events to log, retention period, access controls, tamper-proofing

## After All Sections

Summarize and ask: "Anything about security, privacy, or compliance we should add?"

**Output:** Create `03-Security-Framework.md`

## Next Step

Proceed to step-06-api-specifications.md

## State Update

```yaml
stepsCompleted: ['step-01-welcome.md', 'step-02-platform-architecture.md', 'step-03-integration-mapping.md', 'step-04-technical-validation.md', 'step-05-security-framework.md']
```
