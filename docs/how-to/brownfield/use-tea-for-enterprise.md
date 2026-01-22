---
title: "Running TEA for Enterprise Projects"
description: Use TEA with compliance, security, and regulatory requirements in enterprise environments
---

# Running TEA for Enterprise Projects

Use TEA on enterprise projects with compliance, security, audit, and regulatory requirements. This guide covers NFR assessment, audit trails, and evidence collection.

## When to Use This

- Enterprise track projects (not Quick Flow or simple BMad Method)
- Compliance requirements (SOC 2, HIPAA, GDPR, etc.)
- Security-critical applications (finance, healthcare, government)
- Audit trail requirements
- Strict NFR thresholds (performance, security, reliability)

## Prerequisites

- BMad Method installed (Enterprise track selected)
- TEA agent available
- Compliance requirements documented
- Stakeholders identified (who approves gates)

## Enterprise-Specific TEA Workflows

### NFR Assessment (*nfr-assess)

**Purpose:** Validate non-functional requirements with evidence.

**When:** Phase 2 (early) and Release Gate

**Why Enterprise Needs This:**
- Compliance mandates specific thresholds
- Audit trails required for certification
- Security requirements are non-negotiable
- Performance SLAs are contractual

**Example:**
```
*nfr-assess

Categories: Security, Performance, Reliability, Maintainability

Security thresholds:
- Zero critical vulnerabilities (required by SOC 2)
- All endpoints require authentication
- Data encrypted at rest (FIPS 140-2)
- Audit logging on all data access

Evidence:
- Security scan: reports/nessus-scan.pdf
- Penetration test: reports/pentest-2026-01.pdf
- Compliance audit: reports/soc2-evidence.zip
```

**Output:** NFR assessment with PASS/CONCERNS/FAIL for each category.

### Trace with Audit Evidence (*trace)

**Purpose:** Requirements traceability with audit trail.

**When:** Phase 2 (baseline), Phase 4 (refresh), Release Gate

**Why Enterprise Needs This:**
- Auditors require requirements-to-test mapping
- Compliance certifications need traceability
- Regulatory bodies want evidence

**Example:**
```
*trace Phase 1

Requirements: PRD.md (with compliance requirements)
Test location: tests/

Output: traceability-matrix.md with:
- Requirement-to-test mapping
- Compliance requirement coverage
- Gap prioritization
- Recommendations
```

**For Release Gate:**
```
*trace Phase 2

Generate gate-decision-{gate_type}-{story_id}.md with:
- Evidence references
- Approver signatures
- Compliance checklist
- Decision rationale
```

### Test Design with Compliance Focus (*test-design)

**Purpose:** Risk assessment with compliance and security focus.

**When:** Phase 3 (system-level), Phase 4 (epic-level)

**Why Enterprise Needs This:**
- Security architecture alignment required
- Compliance requirements must be testable
- Performance requirements are contractual

**Example:**
```
*test-design

Mode: System-level

Focus areas:
- Security architecture (authentication, authorization, encryption)
- Performance requirements (SLA: P99 <200ms)
- Compliance (HIPAA PHI handling, audit logging)

Output: TWO documents (system-level):
- `test-design-architecture.md`: Security gaps, compliance requirements, performance SLOs for Architecture team
- `test-design-qa.md`: Security testing strategy, compliance test mapping, performance testing plan for QA team
- Audit logging validation
```

## Enterprise TEA Lifecycle

### Phase 1: Discovery (Optional but Recommended)

**Research compliance requirements:**
```
Analyst: *research

Topics:
- Industry compliance (SOC 2, HIPAA, GDPR)
- Security standards (OWASP Top 10)
- Performance benchmarks (industry P99)
```

### Phase 2: Planning (Required)

**1. Define NFRs early:**
```
PM: *prd

Include in PRD:
- Security requirements (authentication, encryption)
- Performance SLAs (response time, throughput)
- Reliability targets (uptime, RTO, RPO)
- Compliance mandates (data retention, audit logs)
```

**2. Assess NFRs:**
```
TEA: *nfr-assess

Categories: All (Security, Performance, Reliability, Maintainability)

Output: nfr-assessment.md
- NFR requirements documented
- Acceptance criteria defined
- Test strategy planned
```

**3. Baseline (brownfield only):**
```
TEA: *trace Phase 1

Establish baseline coverage before new work
```

### Phase 3: Solutioning (Required)

**1. Architecture with testability review:**
```
Architect: *architecture

TEA: *test-design (system-level)

Focus:
- Security architecture testability
- Performance testing strategy
- Compliance requirement mapping
```

**2. Test infrastructure:**
```
TEA: *framework

Requirements:
- Separate test environments (dev, staging, prod-mirror)
- Secure test data handling (PHI, PII)
- Audit logging in tests
```

**3. CI/CD with compliance:**
```
TEA: *ci

Requirements:
- Secrets management (Vault, AWS Secrets Manager)
- Test isolation (no cross-contamination)
- Artifact retention (compliance audit trail)
- Access controls (who can run production tests)
```

### Phase 4: Implementation (Required)

**Per epic:**
```
1. TEA: *test-design (epic-level)
   Focus: Compliance, security, performance for THIS epic

2. TEA: *atdd (optional)
   Generate tests including security/compliance scenarios

3. DEV: Implement story

4. TEA: *automate
   Expand coverage including compliance edge cases

5. TEA: *test-review
   Audit quality (score >80 per epic, rises to >85 at release)

6. TEA: *trace Phase 1
   Refresh coverage, verify compliance requirements tested
```

### Release Gate (Required)

**1. Final NFR assessment:**
```
TEA: *nfr-assess

All categories (if not done earlier)
Latest evidence (performance tests, security scans)
```

**2. Final quality audit:**
```
TEA: *test-review tests/

Full suite review
Quality target: >85 for enterprise
```

**3. Gate decision:**
```
TEA: *trace Phase 2

Evidence required:
- traceability-matrix.md (from Phase 1)
- test-review.md (from quality audit)
- nfr-assessment.md (from NFR assessment)
- Test execution results (must have test results available)

Decision: PASS/CONCERNS/FAIL/WAIVED

Archive all artifacts for compliance audit
```

**Note:** Phase 2 requires test execution results. If results aren't available, Phase 2 will be skipped.

**4. Archive for audit:**
```
Archive:
- All test results
- Coverage reports
- NFR assessments
- Gate decisions
- Approver signatures

Retention: Per compliance requirements (7 years for HIPAA)
```

## Enterprise-Specific Requirements

### Evidence Collection

**Required artifacts:**
- Requirements traceability matrix
- Test execution results (with timestamps)
- NFR assessment reports
- Security scan results
- Performance test results
- Gate decision records
- Approver signatures

**Storage:**
```
compliance/
├── 2026-Q1/
│   ├── release-1.2.0/
│   │   ├── traceability-matrix.md
│   │   ├── test-review.md
│   │   ├── nfr-assessment.md
│   │   ├── gate-decision-release-v1.2.0.md
│   │   ├── test-results/
│   │   ├── security-scans/
│   │   └── approvals.pdf
```

**Retention:** 7 years (HIPAA), 3 years (SOC 2), per your compliance needs

### Approver Workflows

**Multi-level approval required:**

```markdown
## Gate Approvals Required

### Technical Approval
- [ ] QA Lead - Test coverage adequate
- [ ] Tech Lead - Technical quality acceptable
- [ ] Security Lead - Security requirements met

### Business Approval
- [ ] Product Manager - Business requirements met
- [ ] Compliance Officer - Regulatory requirements met

### Executive Approval (for major releases)
- [ ] VP Engineering - Overall quality acceptable
- [ ] CTO - Architecture approved for production
```

### Compliance Checklists

**SOC 2 Example:**
```markdown
## SOC 2 Compliance Checklist

### Access Controls
- [ ] All API endpoints require authentication
- [ ] Authorization tested for all protected resources
- [ ] Session management secure (token expiration tested)

### Audit Logging
- [ ] All data access logged
- [ ] Logs immutable (append-only)
- [ ] Log retention policy enforced

### Data Protection
- [ ] Data encrypted at rest (tested)
- [ ] Data encrypted in transit (HTTPS enforced)
- [ ] PII handling compliant (masking tested)

### Testing Evidence
- [ ] Test coverage >80% (verified)
- [ ] Security tests passing (100%)
- [ ] Traceability matrix complete
```

**HIPAA Example:**
```markdown
## HIPAA Compliance Checklist

### PHI Protection
- [ ] PHI encrypted at rest (AES-256)
- [ ] PHI encrypted in transit (TLS 1.3)
- [ ] PHI access logged (audit trail)

### Access Controls
- [ ] Role-based access control (RBAC tested)
- [ ] Minimum necessary access (tested)
- [ ] Authentication strong (MFA tested)

### Breach Notification
- [ ] Breach detection tested
- [ ] Notification workflow tested
- [ ] Incident response plan tested
```

## Enterprise Tips

### Start with Security

**Priority 1:** Security requirements
```
1. Document all security requirements
2. Generate security tests with *atdd
3. Run security test suite
4. Pass security audit BEFORE moving forward
```

**Why:** Security failures block everything in enterprise.

**Example: RBAC Testing**

**Vanilla Playwright:**
```typescript
test('should enforce role-based access', async ({ request }) => {
  // Login as regular user
  const userResp = await request.post('/api/auth/login', {
    data: { email: 'user@example.com', password: 'pass' }
  });
  const { token: userToken } = await userResp.json();

  // Try to access admin endpoint
  const adminResp = await request.get('/api/admin/users', {
    headers: { Authorization: `Bearer ${userToken}` }
  });

  expect(adminResp.status()).toBe(403);  // Forbidden
});
```

**With Playwright Utils (Cleaner, Reusable):**
```typescript
import { test as base, expect } from '@playwright/test';
import { test as apiRequestFixture } from '@seontechnologies/playwright-utils/api-request/fixtures';
import { createAuthFixtures } from '@seontechnologies/playwright-utils/auth-session';
import { mergeTests } from '@playwright/test';

const authFixtureTest = base.extend(createAuthFixtures());
export const testWithAuth = mergeTests(apiRequestFixture, authFixtureTest);

testWithAuth('should enforce role-based access', async ({ apiRequest, authToken }) => {
  // Auth token from fixture (configured for 'user' role)
  const { status } = await apiRequest({
    method: 'GET',
    path: '/api/admin/users',  // Admin endpoint
    headers: { Authorization: `Bearer ${authToken}` }
  });

  expect(status).toBe(403);  // Regular user denied
});

testWithAuth('admin can access admin endpoint', async ({ apiRequest, authToken, authOptions }) => {
  // Override to admin role
  authOptions.userIdentifier = 'admin';

  const { status, body } = await apiRequest({
    method: 'GET',
    path: '/api/admin/users',
    headers: { Authorization: `Bearer ${authToken}` }
  });

  expect(status).toBe(200);  // Admin allowed
  expect(body).toBeInstanceOf(Array);
});
```

**Note:** Auth-session requires provider setup in global-setup.ts. See [auth-session configuration](https://seontechnologies.github.io/playwright-utils/auth-session.html).

**Playwright Utils Benefits for Compliance:**
- Multi-user auth testing (regular, admin, etc.)
- Token persistence (faster test execution)
- Consistent auth patterns (audit trail)
- Automatic cleanup

### Set Higher Quality Thresholds

**Enterprise quality targets:**
- Test coverage: >85% (vs 80% for non-enterprise)
- Quality score: >85 (vs 75 for non-enterprise)
- P0 coverage: 100% (non-negotiable)
- P1 coverage: >95% (vs 90% for non-enterprise)

**Rationale:** Enterprise systems affect more users, higher stakes.

### Document Everything

**Auditors need:**
- Why decisions were made (rationale)
- Who approved (signatures)
- When (timestamps)
- What evidence (test results, scan reports)

**Use TEA's structured outputs:**
- Reports have timestamps
- Decisions have rationale
- Evidence is referenced
- Audit trail is automatic

### Budget for Compliance Testing

**Enterprise testing costs more:**
- Penetration testing: $10k-50k
- Security audits: $5k-20k
- Performance testing tools: $500-5k/month
- Compliance consulting: $200-500/hour

**Plan accordingly:**
- Budget in project cost
- Schedule early (3+ months for SOC 2)
- Don't skip (non-negotiable for compliance)

### Use External Validators

**Don't self-certify:**
- Penetration testing: Hire external firm
- Security audits: Independent auditor
- Compliance: Certification body
- Performance: Load testing service

**TEA's role:** Prepare for external validation, don't replace it.

## Related Guides

**Workflow Guides:**
- [How to Run NFR Assessment](/docs/how-to/workflows/run-nfr-assess.md) - Deep dive on NFRs
- [How to Run Trace](/docs/how-to/workflows/run-trace.md) - Gate decisions with evidence
- [How to Run Test Review](/docs/how-to/workflows/run-test-review.md) - Quality audits
- [How to Run Test Design](/docs/how-to/workflows/run-test-design.md) - Compliance-focused planning

**Use-Case Guides:**
- [Using TEA with Existing Tests](/docs/how-to/brownfield/use-tea-with-existing-tests.md) - Brownfield patterns

**Customization:**
- [Integrate Playwright Utils](/docs/how-to/customization/integrate-playwright-utils.md) - Production-ready utilities

## Understanding the Concepts

- [Engagement Models](/docs/explanation/tea/engagement-models.md) - Enterprise model explained
- [Risk-Based Testing](/docs/explanation/tea/risk-based-testing.md) - Probability × impact scoring
- [Test Quality Standards](/docs/explanation/tea/test-quality-standards.md) - Enterprise quality thresholds
- [TEA Overview](/docs/explanation/features/tea-overview.md) - Complete TEA lifecycle

## Reference

- [TEA Command Reference](/docs/reference/tea/commands.md) - All 8 workflows
- [TEA Configuration](/docs/reference/tea/configuration.md) - Enterprise config options
- [Knowledge Base Index](/docs/reference/tea/knowledge-base.md) - Testing patterns
- [Glossary](/docs/reference/glossary/index.md#test-architect-tea-concepts) - TEA terminology

---

Generated with [BMad Method](https://bmad-method.org) - TEA (Test Architect)
