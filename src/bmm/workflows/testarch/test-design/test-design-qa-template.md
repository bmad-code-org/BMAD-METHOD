# Test Design for QA: {Feature Name}

**Purpose:** Test execution recipe for QA team. Defines what to test, how to test it, and what QA needs from other teams.

**Date:** {date}
**Author:** {author}
**Status:** Draft
**Project:** {project_name}

**Related:** See Architecture doc (test-design-architecture.md) for testability concerns and architectural blockers.

---

## Executive Summary

**Scope:** {Brief description of testing scope}

**Risk Summary:**
- Total Risks: {N} ({X} high-priority score ≥6, {Y} medium, {Z} low)
- Critical Categories: {Categories with most high-priority risks}

**Coverage Summary:**
- P0 tests: ~{N} (critical paths, security)
- P1 tests: ~{N} (important features, integration)
- P2 tests: ~{N} (edge cases, regression)
- P3 tests: ~{N} (exploratory, benchmarks)
- **Total**: ~{N} tests (~{X}-{Y} weeks with 1 QA)

---

## Dependencies & Test Blockers

**CRITICAL:** QA cannot proceed without these items from other teams.

### Backend/Architecture Dependencies (Sprint 0)

**Source:** See Architecture doc "Quick Guide" for detailed mitigation plans

1. **{Dependency 1}** - {Team} - {Timeline}
   - {What QA needs}
   - {Why it blocks testing}

2. **{Dependency 2}** - {Team} - {Timeline}
   - {What QA needs}
   - {Why it blocks testing}

### QA Infrastructure Setup (Sprint 0)

1. **Test Data Factories** - QA
   - {Entity} factory with faker-based randomization
   - Auto-cleanup fixtures for parallel safety

2. **Test Environments** - QA
   - Local: {Setup details}
   - CI/CD: {Setup details}
   - Staging: {Setup details}

**Example factory pattern:**

```typescript
import { test } from '@seontechnologies/playwright-utils/api-request/fixtures';
import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('example test @p0', async ({ apiRequest }) => {
  const testData = {
    id: `test-${faker.string.uuid()}`,
    email: faker.internet.email(),
  };

  const { status } = await apiRequest({
    method: 'POST',
    path: '/api/resource',
    body: testData,
  });

  expect(status).toBe(201);
});
```

---

## Risk Assessment

**Note:** Full risk details in Architecture doc. This section summarizes risks relevant to QA test planning.

### High-Priority Risks (Score ≥6)

| Risk ID | Category | Description | Score | QA Test Coverage |
|---------|----------|-------------|-------|------------------|
| **{R-ID}** | {CAT} | {Brief description} | **{Score}** | {How QA validates this risk} |

### Medium/Low-Priority Risks

| Risk ID | Category | Description | Score | QA Test Coverage |
|---------|----------|-------------|-------|------------------|
| {R-ID} | {CAT} | {Brief description} | {Score} | {How QA validates this risk} |

---

## Test Coverage Plan

**IMPORTANT:** P0/P1/P2/P3 = **priority and risk level** (what to focus on if time-constrained), NOT execution timing. See "Execution Strategy" for when tests run.

### P0 (Critical)

**Criteria:** Blocks core functionality + High risk (≥6) + No workaround + Affects majority of users

| Test ID | Requirement | Test Level | Risk Link | Notes |
|---------|-------------|------------|-----------|-------|
| **P0-001** | {Requirement} | {Level} | {R-ID} | {Notes} |
| **P0-002** | {Requirement} | {Level} | {R-ID} | {Notes} |

**Total P0:** ~{N} tests

---

### P1 (High)

**Criteria:** Important features + Medium risk (3-4) + Common workflows + Workaround exists but difficult

| Test ID | Requirement | Test Level | Risk Link | Notes |
|---------|-------------|------------|-----------|-------|
| **P1-001** | {Requirement} | {Level} | {R-ID} | {Notes} |
| **P1-002** | {Requirement} | {Level} | {R-ID} | {Notes} |

**Total P1:** ~{N} tests

---

### P2 (Medium)

**Criteria:** Secondary features + Low risk (1-2) + Edge cases + Regression prevention

| Test ID | Requirement | Test Level | Risk Link | Notes |
|---------|-------------|------------|-----------|-------|
| **P2-001** | {Requirement} | {Level} | {R-ID} | {Notes} |

**Total P2:** ~{N} tests

---

### P3 (Low)

**Criteria:** Nice-to-have + Exploratory + Performance benchmarks + Documentation validation

| Test ID | Requirement | Test Level | Notes |
|---------|-------------|------------|-------|
| **P3-001** | {Requirement} | {Level} | {Notes} |

**Total P3:** ~{N} tests

---

## Execution Strategy

**Philosophy:** Run everything in PRs unless there's significant infrastructure overhead. Playwright with parallelization is extremely fast (100s of tests in ~10-15 min).

**Organized by TOOL TYPE:**

### Every PR: Playwright Tests (~10-15 min)

**All functional tests** (from any priority level):
- All E2E, API, integration, unit tests using Playwright
- Parallelized across {N} shards
- Total: ~{N} Playwright tests (includes P0, P1, P2, P3)

**Why run in PRs:** Fast feedback, no expensive infrastructure

### Nightly: k6 Performance Tests (~30-60 min)

**All performance tests** (from any priority level):
- Load, stress, spike, endurance tests
- Total: ~{N} k6 tests (may include P0, P1, P2)

**Why defer to nightly:** Expensive infrastructure (k6 Cloud), long-running (10-40 min per test)

### Weekly: Chaos & Long-Running (~hours)

**Special infrastructure tests** (from any priority level):
- Multi-region failover (requires AWS Fault Injection Simulator)
- Disaster recovery (backup restore, 4+ hours)
- Endurance tests (4+ hours runtime)

**Why defer to weekly:** Very expensive infrastructure, very long-running, infrequent validation sufficient

**Manual tests** (excluded from automation):
- DevOps validation (deployment, monitoring)
- Finance validation (cost alerts)
- Documentation validation

---

## QA Effort Estimate

**QA test development effort only** (excludes DevOps, Backend, Data Eng, Finance work):

| Priority | Count | Effort Range | Notes |
|----------|-------|--------------|-------|
| P0 | ~{N} | ~{X}-{Y} weeks | Complex setup (security, performance, multi-step) |
| P1 | ~{N} | ~{X}-{Y} weeks | Standard coverage (integration, API tests) |
| P2 | ~{N} | ~{X}-{Y} days | Edge cases, simple validation |
| P3 | ~{N} | ~{X}-{Y} days | Exploratory, benchmarks |
| **Total** | ~{N} | **~{X}-{Y} weeks** | **1 QA engineer, full-time** |

**Assumptions:**
- Includes test design, implementation, debugging, CI integration
- Excludes ongoing maintenance (~10% effort)
- Assumes test infrastructure (factories, fixtures) ready

**Dependencies from other teams:**
- See "Dependencies & Test Blockers" section for what QA needs from Backend, DevOps, Data Eng

---

## Appendix A: Code Examples & Tagging

**Playwright Tags for Selective Execution:**

```typescript
import { test } from '@seontechnologies/playwright-utils/api-request/fixtures';
import { expect } from '@playwright/test';

// P0 critical test
test('@P0 @API @Security unauthenticated request returns 401', async ({ apiRequest }) => {
  const { status, body } = await apiRequest({
    method: 'POST',
    path: '/api/endpoint',
    body: { data: 'test' },
    skipAuth: true,
  });

  expect(status).toBe(401);
  expect(body.error).toContain('unauthorized');
});

// P1 integration test
test('@P1 @Integration data syncs correctly', async ({ apiRequest }) => {
  // Seed data
  await apiRequest({
    method: 'POST',
    path: '/api/seed',
    body: { /* test data */ },
  });

  // Validate
  const { status, body } = await apiRequest({
    method: 'GET',
    path: '/api/resource',
  });

  expect(status).toBe(200);
  expect(body).toHaveProperty('data');
});
```

**Run specific tags:**

```bash
# Run only P0 tests
npx playwright test --grep @P0

# Run P0 + P1 tests
npx playwright test --grep "@P0|@P1"

# Run only security tests
npx playwright test --grep @Security

# Run all Playwright tests in PR (default)
npx playwright test
```

---

## Appendix B: Knowledge Base References

- **Risk Governance**: `risk-governance.md` - Risk scoring methodology
- **Test Priorities Matrix**: `test-priorities-matrix.md` - P0-P3 criteria
- **Test Levels Framework**: `test-levels-framework.md` - E2E vs API vs Unit selection
- **Test Quality**: `test-quality.md` - Definition of Done (no hard waits, <300 lines, <1.5 min)

---

**Generated by:** BMad TEA Agent
**Workflow:** `_bmad/bmm/testarch/test-design`
**Version:** 4.0 (BMad v6)
