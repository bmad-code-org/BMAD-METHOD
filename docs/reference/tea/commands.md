---
title: "TEA Command Reference"
description: Complete reference for all TEA (Test Architect) workflows and commands
---

# TEA Command Reference

Complete reference for all 8 TEA (Test Architect) workflows. Use this for quick lookup of commands, parameters, and outputs.

## Quick Index

- [*framework](#framework) - Scaffold test framework
- [*ci](#ci) - Setup CI/CD pipeline
- [*test-design](#test-design) - Risk-based test planning
- [*atdd](#atdd) - Acceptance TDD (failing tests first)
- [*automate](#automate) - Test automation expansion
- [*test-review](#test-review) - Test quality audit
- [*nfr-assess](#nfr-assess) - Non-functional requirements assessment
- [*trace](#trace) - Coverage traceability and gate decisions

**Note:** `*workflow-status` is a shared BMM workflow available to all agents, not TEA-specific. See [Core Workflows](/docs/reference/workflows/core-workflows.md).

---

## *framework

Scaffold production-ready test framework (Playwright or Cypress).

### Purpose

Initialize test infrastructure with best practices, environment configuration, and sample tests.

### Phase

Phase 3 (Solutioning) - Run once per project after architecture is complete.

### Frequency

Once per project (one-time setup).

### When to Use

- No existing test framework in your project
- Current test setup isn't production-ready
- Starting new project needing test infrastructure
- Want to adopt Playwright or Cypress with proper structure

### Inputs

TEA will ask:

| Question | Example Answer | Notes |
|----------|----------------|-------|
| Tech stack | "React web application" | Helps determine test approach |
| Test framework | "Playwright" | Playwright or Cypress |
| Testing scope | "E2E and API testing" | E2E, integration, unit, or mix |
| CI/CD platform | "GitHub Actions" | For future `*ci` setup |

### Outputs

**Generated Files:**
```
tests/
├── e2e/                     # E2E test directory
│   └── example.spec.ts      # Sample E2E test
├── api/                     # API test directory (if requested)
│   └── example.spec.ts      # Sample API test
├── support/                 # Support directory
│   ├── fixtures/            # Shared fixtures
│   │   └── index.ts         # Fixture composition
│   └── helpers/             # Pure utility functions
│       └── api-request.ts   # Example helper
├── playwright.config.ts     # Framework configuration
└── README.md                # Testing documentation

.env.example                 # Environment variable template
.nvmrc                       # Node version specification
```

**Configuration Includes:**
- Multiple environments (dev, staging, prod)
- Timeout standards
- Retry logic
- Artifact collection (screenshots, videos, traces)
- Reporter configuration

**Sample Tests Include:**
- Network-first patterns (no hard waits)
- Proper fixture usage
- Explicit assertions
- Deterministic test structure

**Framework-Specific Examples:**

**Vanilla Playwright:**
```typescript
// tests/e2e/example.spec.ts
import { test, expect } from '@playwright/test';

test('example test', async ({ page, request }) => {
  // Manual API call
  const response = await request.get('/api/data');
  const data = await response.json();

  await page.goto('/');
  await expect(page.locator('h1')).toContainText(data.title);
});
```

**With Playwright Utils:**
```typescript
// tests/e2e/example.spec.ts
import { test } from '@seontechnologies/playwright-utils/api-request/fixtures';
import { expect } from '@playwright/test';

test('example test', async ({ page, apiRequest }) => {
  // Utility handles status/body separation
  const { status, body } = await apiRequest({
    method: 'GET',
    path: '/api/data'
  });

  expect(status).toBe(200);
  await page.goto('/');
  await expect(page.locator('h1')).toContainText(body.title);
});
```

### Optional Integrations

**Playwright Utils:**
If `tea_use_playwright_utils: true` in config:
- Includes `@seontechnologies/playwright-utils` in scaffold
- Adds fixture composition examples
- Provides utility import examples

See [Integrate Playwright Utils](/docs/how-to/customization/integrate-playwright-utils.md)

### Related Commands

- `*ci` - Run after framework to setup CI/CD
- `*test-design` - Run concurrently or after for test planning

### How-To Guide

[How to Set Up a Test Framework](/docs/how-to/workflows/setup-test-framework.md)

---

## *ci

Setup CI/CD quality pipeline with selective testing and burn-in loops.

### Purpose

Scaffold production-ready CI/CD configuration for automated test execution.

### Phase

Phase 3 (Solutioning) - Run once per project after framework setup.

### Frequency

Once per project (one-time setup).

### When to Use

- Need to automate test execution in CI/CD
- Want selective testing (only run affected tests)
- Need burn-in loops for flakiness detection
- Setting up new CI/CD pipeline

### Inputs

TEA will ask:

| Question | Example Answer | Notes |
|----------|----------------|-------|
| CI/CD platform | "GitHub Actions" | GitHub Actions, GitLab CI, Circle CI, Jenkins |
| Repository structure | "Monorepo with multiple apps" | Affects test selection strategy |
| Sharding strategy | "Yes, run tests in parallel" | Shard across multiple workers |
| Burn-in loops | "Yes, for flakiness detection" | Run tests multiple times |

### Outputs

**Platform-Specific Workflow:**

**GitHub Actions** (`.github/workflows/test.yml`):
```yaml
name: Test Suite

on:
  pull_request:
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npx playwright test --shard=${{ matrix.shard }}/4

      - name: Upload artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results-${{ matrix.shard }}
          path: test-results/

  burn-in:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - name: Run burn-in loop
        run: |
          for i in {1..5}; do
            npx playwright test --grep-invert @skip
          done
```

**Also Generates:**
- **Test scripts** (`package.json`) - Selective testing commands
- **Secrets checklist** - Required environment variables
- **Sharding configuration** - Parallel execution setup
- **Artifact collection** - Save screenshots, videos, traces

### Selective Testing

Generated CI includes selective test execution:

```bash
# Run only tests affected by changes
npm run test:selective

# Run specific tags
npm run test:smoke      # @smoke tagged tests
npm run test:critical   # @critical tagged tests
```

### Burn-in Loops

Detects flaky tests by running multiple times:

```bash
# Run tests 5 times to detect flakiness
npm run test:burn-in

# Run specific test file 10 times
npm run test:burn-in -- tests/e2e/checkout.spec.ts --repeat 10
```

### Optional Integrations

**Playwright Utils:**
If `tea_use_playwright_utils: true`:
- Includes `burn-in` utility for smart test selection
- Adds git diff-based selective testing
- Provides test prioritization

See [Integrate Playwright Utils](/docs/how-to/customization/integrate-playwright-utils.md)

### Related Commands

- `*framework` - Run before CI setup
- `*test-review` - Run to ensure CI-ready tests

### How-To Guide

[How to Set Up CI Pipeline](/docs/how-to/workflows/setup-ci.md)

---

## *test-design

Create comprehensive test scenarios with risk assessment and coverage strategies.

### Purpose

Risk-based test planning that identifies what to test, at what level, and with what priority.

### Phase

**Dual Mode:**
- **Phase 3:** System-level (architecture testability review)
- **Phase 4:** Epic-level (per-epic test planning)

### Frequency

- **System-level:** Once per project (or when architecture changes)
- **Epic-level:** Per epic in implementation cycle

### When to Use

**System-level:**
- After architecture is complete
- Before implementation-readiness gate
- To validate architecture testability
- When ADRs (Architecture Decision Records) are updated

**Epic-level:**
- At the start of each epic
- Before implementing stories in the epic
- To identify epic-specific testing needs
- When planning sprint work

### Inputs

TEA will ask:

**Mode Selection:**
| Question | Example Answer | Notes |
|----------|----------------|-------|
| System or epic level? | "Epic-level" | Determines scope |

**System-Level Inputs:**
- Architecture document location
- ADRs (if available)
- PRD with FRs/NFRs
- Technology stack decisions

**Epic-Level Inputs:**
- Epic description and goals
- Stories with acceptance criteria
- Related PRD sections
- Integration points with existing system

### Outputs

**System-Level Output** (`test-design-system.md`):

```markdown
# Test Design - System Level

## Architecture Testability Review

### Strengths
- Microservices architecture enables API-level testing
- Event-driven design allows message interception
- Clear service boundaries support contract testing

### Concerns
- Complex distributed tracing may be hard to test
- No test environment for third-party integrations
- Database migrations need test data management

## ADR → Test Mapping

| ADR | Decision | Test Impact | Test Strategy |
|-----|----------|-------------|---------------|
| ADR-001 | Use PostgreSQL | Data integrity critical | API tests + DB assertions |
| ADR-002 | Event sourcing | Event replay testing | Integration tests for event handlers |
| ADR-003 | OAuth2 authentication | Auth flows complex | E2E + API tests for all flows |

## Architecturally Significant Requirements (ASRs)

### Performance
- API response time < 200ms (P99)
- Test strategy: Load testing with k6, API response time assertions

### Security
- All endpoints require authentication
- Test strategy: Security testing suite, unauthorized access scenarios

### Reliability
- 99.9% uptime requirement
- Test strategy: Chaos engineering, failover testing

## Environment Needs

- **Dev:** Local Docker compose setup
- **Staging:** Replica of production
- **Production:** Read-only test accounts

## Test Infrastructure Recommendations

- [ ] Set up contract testing with Pact
- [ ] Create test data factories
- [ ] Implement API mocking for third-party services
- [ ] Add performance test suite
```

**Epic-Level Output** (`test-design-epic-N.md`):

```markdown
# Test Design - Epic 1: User Profile Management

## Risk Assessment

| Risk Category | Probability | Impact | Score | Mitigation |
|---------------|-------------|--------|-------|------------|
| DATA | 3 (High) | 3 (High) | 9 | Validate all profile updates, test data corruption scenarios |
| SEC | 2 (Medium) | 3 (High) | 6 | Test authorization (users can only edit own profiles) |
| BUS | 2 (Medium) | 2 (Medium) | 4 | Verify profile data appears correctly across app |
| PERF | 1 (Low) | 2 (Medium) | 2 | Profile load should be < 500ms |

## Test Priorities

### P0 - Critical Path (Must Test)
- User can view their own profile
- User can update profile fields
- Changes are persisted correctly
- **Coverage Target:** 100% (all scenarios)

### P1 - High Value (Should Test)
- Validation prevents invalid data (email format, etc.)
- Unauthorized users cannot edit profiles
- Profile updates trigger notifications
- **Coverage Target:** 80% (major scenarios)

### P2 - Medium Value (Nice to Test)
- Profile picture upload and display
- Profile history/audit log
- **Coverage Target:** 50% (happy path)

### P3 - Low Value (Optional)
- Advanced profile customization
- Profile export functionality
- **Coverage Target:** 20% (smoke test)

## Coverage Strategy

### E2E Tests (5 tests)
- View profile page (P0)
- Edit and save profile (P0)
- Profile validation errors (P1)
- Unauthorized access prevented (P1)
- Profile picture upload (P2)

### API Tests (8 tests)
- GET /api/profile returns profile (P0)
- PATCH /api/profile updates profile (P0)
- Validation for each field (P1)
- Authorization checks (P1)
- Profile picture upload API (P2)
- Profile history endpoint (P2)

### Component Tests (3 tests)
- ProfileForm component renders (P1)
- ProfileForm validation (P1)
- ProfilePictureUpload component (P2)

## Integration Risks

- Profile data stored in PostgreSQL - ensure transaction integrity
- Profile updates trigger notification service - test event propagation
- Profile pictures stored in S3 - test upload/download flows

## Regression Hotspots (Brownfield)

N/A - New feature

## Implementation Order

1. API tests for profile CRUD (P0)
2. E2E test for viewing profile (P0)
3. E2E test for editing profile (P0)
4. Validation tests API + E2E (P1)
5. Authorization tests (P1)
6. Profile picture tests (P2)
```

### Optional: Exploratory Mode

If MCP enhancements enabled (`tea_use_mcp_enhancements: true` in config):

When prompted, select "exploratory mode" to:
- Open live browser for UI discovery
- Validate test scenarios against real behavior
- Capture accurate selectors interactively

See [Enable MCP Enhancements](/docs/how-to/customization/enable-tea-mcp-enhancements.md)

### Related Commands

- `*atdd` - Generate tests based on test design
- `*automate` - Generate tests based on test design
- `*framework` - Run first if no test infrastructure

### How-To Guide

[How to Run Test Design](/docs/how-to/workflows/run-test-design.md)

---

## *atdd

Generate failing acceptance tests BEFORE implementation (TDD red phase).

### Purpose

Create failing tests that guide feature implementation following test-driven development.

### Phase

Phase 4 (Implementation) - Before implementing each story.

### Frequency

Per story (optional - only if practicing TDD).

### When to Use

- Feature doesn't exist yet
- Want tests to guide implementation
- Practicing test-driven development
- Want clear success criteria before coding

**Don't use if:**
- Feature already exists (use `*automate` instead)
- Want tests that pass immediately

### Inputs

TEA will ask:

| Question | Example Answer | Notes |
|----------|----------------|-------|
| Story/feature details | "User profile page with CRUD ops" | What are you building? |
| Acceptance criteria | "User can view, edit, save profile" | What defines "done"? |
| Reference docs | "test-design-epic-1.md, story-123.md" | Optional context |
| Test levels | "API + E2E tests, focus P0/P1" | Which test types? |

### Outputs

**Failing Tests:**
- API tests (`tests/api/`) - Backend endpoint tests
- E2E tests (`tests/e2e/`) - Full user workflow tests
- Component tests (`tests/component/`) - UI component tests (if requested)
- All tests fail initially (red phase)

### Component Testing by Framework

TEA generates component tests using framework-appropriate tools:

| Your Framework | Component Testing Tool | What TEA Generates |
|----------------|----------------------|-------------------|
| **Cypress** | Cypress Component Testing | Cypress component specs (*.cy.tsx) |
| **Playwright** | Vitest + React Testing Library | Vitest component tests (*.test.tsx) |

**Note:** Component tests use separate tooling:
- Cypress: Run with `cypress run-ct`
- Vitest: Run with `vitest` or `npm run test:unit`

**Implementation Checklist:**
```markdown
## Implementation Checklist

### Backend
- [ ] Create endpoints
- [ ] Add validation
- [ ] Write unit tests

### Frontend
- [ ] Create components
- [ ] Add form handling
- [ ] Handle errors

### Tests
- [x] API tests generated (failing)
- [x] E2E tests generated (failing)
- [ ] Make tests pass
```

**Test Structure:**

```typescript
// tests/api/profile.spec.ts
import { test, expect } from '@playwright/test';

test('should fetch user profile', async ({ request }) => {
  const response = await request.get('/api/profile');
  expect(response.status()).toBe(200);  // FAILS - endpoint doesn't exist yet
});

// tests/e2e/profile.spec.ts
test('should display profile page', async ({ page }) => {
  await page.goto('/profile');
  await expect(page.getByText('Profile')).toBeVisible();  // FAILS - page doesn't exist
});
```

### Recording Mode Note

**Recording mode is NOT typically used with ATDD** because ATDD generates tests for features that don't exist yet.

Use `*automate` with recording mode for existing features instead. See [`*automate`](#automate).

**Only use recording mode with ATDD if:**
- You have skeleton/mockup UI implemented
- You want to verify selectors before full implementation
- You're doing UI-first development (rare for TDD)

For typical ATDD (feature doesn't exist), skip recording mode.

### TDD Workflow

1. **Red**: Run `*atdd` → tests fail
2. **Green**: Implement feature → tests pass
3. **Refactor**: Improve code → tests still pass

### Related Commands

- `*test-design` - Run first for better test generation
- `*automate` - Use after implementation for additional tests
- `*test-review` - Audit generated test quality

### How-To Guide

[How to Run ATDD](/docs/how-to/workflows/run-atdd.md)

---

## *automate

Expand test automation coverage after story implementation.

### Purpose

Generate comprehensive tests for existing features, avoiding duplicate coverage.

### Phase

Phase 4 (Implementation) - After implementing each story.

### Frequency

Per story or feature (after implementation complete).

### When to Use

- Feature already exists and works
- Want to add test coverage
- Need tests that pass immediately
- Expanding existing test suite

**Don't use if:**
- Feature doesn't exist yet (use `*atdd` instead)
- Want failing tests to guide development

### Inputs

TEA will ask:

| Question | Example Answer | Notes |
|----------|----------------|-------|
| What are you testing? | "TodoMVC React app" | Feature/app description |
| Reference docs | "test-design-epic-1.md" | Optional test design |
| Specific scenarios | "Cover P0 and P1 from test design" | Focus areas |
| Existing tests | "tests/e2e/basic.spec.ts" | Avoid duplication |

### Modes

**BMad-Integrated Mode:**
- Works with story, tech-spec, PRD, test-design
- Comprehensive context for test generation
- Recommended for BMad Method projects

**Standalone Mode:**
- Analyzes codebase independently
- Works without BMad artifacts
- Good for TEA Solo usage

### Outputs

**Comprehensive Test Suite:**

```
tests/
├── e2e/
│   ├── profile-view.spec.ts      # View profile tests
│   ├── profile-edit.spec.ts      # Edit profile tests
│   └── profile-validation.spec.ts # Validation tests
├── api/
│   ├── profile-crud.spec.ts      # CRUD operations
│   └── profile-auth.spec.ts      # Authorization tests
└── component/
    ├── ProfileForm.test.tsx      # Component tests (Vitest for Playwright)
    └── ProfileForm.cy.tsx        # Component tests (Cypress CT)
```

**Component Testing Note:** Framework-dependent - Cypress users get Cypress CT, Playwright users get Vitest tests.

**Test Quality Features:**
- Network-first patterns (waits for responses, not timeouts)
- Explicit assertions (no conditionals)
- Self-cleaning (tests clean up after themselves)
- Deterministic (no flakiness)

**Additional Artifacts:**
- **Updated fixtures** - Shared test utilities
- **Updated factories** - Test data generation
- **README updates** - How to run new tests
- **Definition of Done summary** - Quality checklist

### Prioritization

TEA generates tests based on:
- Test design priorities (P0 → P1 → P2 → P3)
- Risk assessment scores
- Existing test coverage (avoids duplication)

**Example:**
```
Generated 12 tests:
- 4 P0 tests (critical path)
- 5 P1 tests (high value)
- 3 P2 tests (medium value)
- Skipped P3 (low value)
```

### Optional: Healing Mode

If MCP enhancements enabled (`tea_use_mcp_enhancements: true` in config):

When prompted, select "healing mode" to:
- Fix broken selectors with visual debugging
- Update outdated assertions interactively
- Enhance tests with trace viewer insights

See [Enable MCP Enhancements](/docs/how-to/customization/enable-tea-mcp-enhancements.md)

### Optional: Recording Mode

If MCP enhancements enabled:

When prompted, select "recording mode" to verify tests with live browser for accurate selectors.

### Related Commands

- `*test-design` - Run first for prioritized test generation
- `*atdd` - Use before implementation (TDD approach)
- `*test-review` - Audit generated test quality

### How-To Guide

[How to Run Automate](/docs/how-to/workflows/run-automate.md)

---

## *test-review

Review test quality using comprehensive knowledge base and best practices.

### Purpose

Audit test suite quality with 0-100 scoring and actionable feedback.

### Phase

- **Phase 4:** Optional per-story review
- **Release Gate:** Final audit before release

### Frequency

- Per story (optional)
- Per epic (recommended)
- Before release (recommended for quality gates, required if using formal gate process)

### When to Use

- Want to validate test quality
- Need objective quality metrics
- Preparing for release gate
- Reviewing team-written tests
- Auditing AI-generated tests

### Inputs

TEA will ask:

| Question | Example Answer | Notes |
|----------|----------------|-------|
| Review scope | "tests/e2e/ directory" | File, directory, or entire suite |
| Focus areas | "Check for flakiness patterns" | Optional specific concerns |
| Strictness level | "Standard" | Relaxed, standard, or strict |

### Review Criteria

TEA reviews against knowledge base patterns:

**Determinism (35 points):**
- No hard waits (`waitForTimeout`)
- No conditionals (if/else) for flow control
- No try-catch for flow control
- Network-first patterns used

**Isolation (25 points):**
- Self-cleaning (cleanup after test)
- No global state dependencies
- Can run in parallel
- Independent of execution order

**Assertions (20 points):**
- Explicit in test body (not abstracted)
- Specific and meaningful
- Covers actual behavior
- No weak assertions (`toBeTrue`, `toBeDefined`)

**Structure (10 points):**
- Test size < 300 lines
- Clear describe/test names
- Proper setup/teardown
- Single responsibility per test

**Performance (10 points):**
- Execution time < 1.5 minutes
- Efficient selectors
- Minimal redundant actions

### Outputs

**Quality Report** (`test-review.md`):

```markdown
# Test Quality Review Report

**Date:** 2026-01-13
**Scope:** tests/e2e/
**Score:** 78/100

## Summary

- **Tests Reviewed:** 15
- **Passing Quality:** 12 tests (80%)
- **Needs Improvement:** 3 tests (20%)
- **Critical Issues:** 2
- **Recommendations:** 8

## Critical Issues

### 1. Hard Waits Detected (tests/e2e/checkout.spec.ts:45)

**Issue:** Using `waitForTimeout(3000)`
**Impact:** Flakiness, slow execution
**Fix:**
```typescript
// ❌ Bad
await page.waitForTimeout(3000);

// ✅ Good
await page.waitForResponse(resp => resp.url().includes('/api/checkout'));
```

### 2. Conditional Flow Control (tests/e2e/profile.spec.ts:28)

**Issue:** Using if/else to handle optional elements
**Impact:** Non-deterministic behavior
**Fix:**
```typescript
// ❌ Bad
if (await page.locator('.banner').isVisible()) {
  await page.click('.dismiss');
}

// ✅ Good
// Make test deterministic - either banner always shows or doesn't
await expect(page.locator('.banner')).toBeVisible();
await page.click('.dismiss');
```

## Recommendations

1. **Extract repeated setup** (tests/e2e/login.spec.ts) - Consider using fixtures
2. **Add network assertions** (tests/e2e/api-calls.spec.ts) - Verify API responses
3. **Improve test names** (tests/e2e/checkout.spec.ts) - Use descriptive names
4. **Reduce test size** (tests/e2e/full-flow.spec.ts) - Split into smaller tests

## Quality Scores by Category

| Category | Score | Status |
|----------|-------|--------|
| Determinism | 28/35 | ⚠️ Needs Improvement |
| Isolation | 22/25 | ✅ Good |
| Assertions | 18/20 | ✅ Good |
| Structure | 7/10 | ⚠️ Needs Improvement |
| Performance | 3/10 | ❌ Critical |

## Next Steps

1. Fix critical issues (hard waits, conditionals)
2. Address performance concerns (slow tests)
3. Apply recommendations
4. Re-run `*test-review` to verify improvements
```

### Review Scope Options

**Single File:**
```
*test-review tests/e2e/checkout.spec.ts
```

**Directory:**
```
*test-review tests/e2e/
```

**Entire Suite:**
```
*test-review tests/
```

### Related Commands

- `*atdd` - Review tests generated by ATDD
- `*automate` - Review tests generated by automate
- `*trace` - Coverage analysis complements quality review

### How-To Guide

[How to Review Test Quality](/docs/how-to/workflows/run-test-review.md)

---

## *nfr-assess

Validate non-functional requirements before release.

### Purpose

Assess security, performance, reliability, and maintainability with evidence-based decisions.

### Phase

- **Phase 2:** Optional (enterprise, capture NFRs early)
- **Release Gate:** Validate before release

### Frequency

- Per epic (optional)
- Per release (mandatory for enterprise/compliance)

### When to Use

- Enterprise projects with compliance needs
- Projects with strict NFRs
- Before production release
- When NFRs are critical to success

### Inputs

TEA will ask:

| Question | Example Answer | Notes |
|----------|----------------|-------|
| NFR focus areas | "Security, Performance" | Categories to assess |
| Thresholds | "API < 200ms P99, 0 critical vulns" | Specific requirements |
| Evidence location | "Load test results in /reports" | Where to find data |

### NFR Categories

**Security:**
- Authentication/authorization
- Data encryption
- Vulnerability scanning
- Security headers
- Input validation

**Performance:**
- Response time (P50, P95, P99)
- Throughput (requests/second)
- Resource usage (CPU, memory)
- Database query performance
- Frontend load time

**Reliability:**
- Error handling
- Recovery mechanisms
- Availability/uptime
- Failover testing
- Data backup/restore

**Maintainability:**
- Code quality metrics
- Test coverage
- Technical debt tracking
- Documentation completeness
- Dependency health

### Outputs

**NFR Assessment Report** (`nfr-assessment.md`):

```markdown
# Non-Functional Requirements Assessment

**Date:** 2026-01-13
**Epic:** User Profile Management
**Decision:** CONCERNS ⚠️

## Summary

- **Security:** PASS ✅
- **Performance:** CONCERNS ⚠️
- **Reliability:** PASS ✅
- **Maintainability:** PASS ✅

## Security Assessment

**Status:** PASS ✅

**Requirements:**
- All endpoints require authentication: ✅ Verified
- Data encryption at rest: ✅ PostgreSQL TDE enabled
- Input validation: ✅ Zod schemas on all endpoints
- No critical vulnerabilities: ✅ npm audit clean

**Evidence:**
- Security scan report: `/reports/security-scan.pdf`
- Auth tests: 15/15 passing
- Penetration test results: No critical findings

## Performance Assessment

**Status:** CONCERNS ⚠️

**Requirements:**
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| API response (P99) | < 200ms | 350ms | ❌ |
| API response (P95) | < 150ms | 180ms | ⚠️ |
| Throughput | > 1000 rps | 850 rps | ⚠️ |
| Frontend load | < 2s | 1.8s | ✅ |

**Issues:**
1. **P99 latency exceeds target** - Database queries not optimized
2. **Throughput below target** - Missing database indexes

**Mitigation Plan:**
- Add indexes to profile queries (owner: backend team, deadline: before release)
- Implement query caching (owner: backend team, deadline: before release)
- Re-run load tests after optimization

**Evidence:**
- Load test report: `/reports/k6-load-test.json`
- APM data: Datadog dashboard link

## Reliability Assessment

**Status:** PASS ✅

**Requirements:**
- Error handling: ✅ All endpoints return structured errors
- Recovery: ✅ Graceful degradation tested
- Database failover: ✅ Tested successfully

**Evidence:**
- Chaos engineering test results
- Error rate in staging: 0.01% (target < 0.1%)

## Maintainability Assessment

**Status:** PASS ✅

**Requirements:**
- Test coverage: ✅ 85% (target > 80%)
- Code quality: ✅ SonarQube grade A
- Documentation: ✅ API docs complete

**Evidence:**
- Coverage report: `/reports/coverage/index.html`
- SonarQube: Link to project dashboard

## Gate Decision

**Decision:** CONCERNS ⚠️

**Rationale:**
- Performance metrics below target (P99, throughput)
- Mitigation plan in place with clear owners and deadlines
- Security and reliability meet requirements

**Actions Required:**
1. Optimize database queries (backend team, 3 days)
2. Re-run performance tests (QA team, 1 day)
3. Update this assessment with new results

**Waiver Option:**
If business approves deploying with current performance:
- Document waiver justification
- Set monitoring alerts for P99 latency
- Plan optimization for next release
```

### Decision Rules

**PASS** ✅: All NFRs met, no concerns
**CONCERNS** ⚠️: Some NFRs not met, mitigation plan exists
**FAIL** ❌: Critical NFRs not met, blocks release
**WAIVED** ⏭️: Business-approved waiver with documented justification

### Critical Principle

**Never guess thresholds.** If you don't know the NFR target, mark as CONCERNS and request clarification.

### Related Commands

- `*trace` - Coverage traceability complements NFR assessment
- `*test-review` - Quality assessment complements NFR

### How-To Guide

[How to Run NFR Assessment](/docs/how-to/workflows/run-nfr-assess.md)

---

## *trace

Map requirements to tests (Phase 1) and make quality gate decision (Phase 2).

### Purpose

Two-phase workflow: traceability analysis followed by go/no-go gate decision.

### Phase

- **Phase 2 (Baseline):** Brownfield projects establishing baseline
- **Phase 4 (Refresh):** After each story/epic to update coverage
- **Release Gate:** Final gate decision before deployment

### Frequency

- Brownfield Phase 2: Once (baseline)
- Phase 4: Per story or epic (refresh)
- Release Gate: Once (final gate decision)

### Two-Phase Workflow

### Phase 1: Requirements Traceability

Map acceptance criteria to implemented tests.

**Inputs:**

| Question | Example Answer | Notes |
|----------|----------------|-------|
| Requirements source | "story-123.md, test-design-epic-1.md" | Where are acceptance criteria? |
| Test location | "tests/" | Where are tests? |
| Focus areas | "Profile CRUD operations" | Optional scope |

**Outputs:**

**Coverage Matrix** (`traceability-matrix.md`):

```markdown
# Requirements Traceability Matrix

**Date:** 2026-01-13
**Scope:** Epic 1 - User Profile Management

## Coverage Summary

- **Total Requirements:** 12
- **Full Coverage:** 8 (67%)
- **Partial Coverage:** 3 (25%)
- **No Coverage:** 1 (8%)

## Detailed Traceability

### Requirement 1: User can view their profile

**Acceptance Criteria:**
- User navigates to /profile
- Profile displays name, email, avatar

**Test Coverage:** FULL ✅

**Tests:**
- `tests/e2e/profile-view.spec.ts:10` - "should display profile page"
- `tests/api/profile.spec.ts:5` - "should fetch user profile"

### Requirement 2: User can edit profile

**Acceptance Criteria:**
- User clicks "Edit Profile"
- Can modify name and email
- Can upload avatar
- Changes are saved

**Test Coverage:** PARTIAL ⚠️

**Tests:**
- `tests/e2e/profile-edit.spec.ts:15` - "should edit and save profile" (name/email only)
- `tests/api/profile.spec.ts:20` - "should update profile via API"

**Missing Coverage:**
- Avatar upload not tested

### Requirement 3: Invalid email shows error

**Acceptance Criteria:**
- Enter invalid email format
- See error message
- Cannot save

**Test Coverage:** FULL ✅

**Tests:**
- `tests/e2e/profile-edit.spec.ts:35` - "should show validation error"
- `tests/api/profile.spec.ts:40` - "should validate email format"

### Requirement 12: Profile history

**Acceptance Criteria:**
- View audit log of profile changes

**Test Coverage:** NONE ❌

**Gap Analysis:**
- Priority: P2 (medium)
- Risk: Low (audit feature, not critical path)
- Recommendation: Add in next iteration

## Gap Prioritization

| Gap | Priority | Risk | Recommendation |
|-----|----------|------|----------------|
| Avatar upload not tested | P1 | Medium | Add before release |
| Profile history not tested | P2 | Low | Add in next iteration |

## Recommendations

1. **Add avatar upload tests** (High priority)
   - E2E test for upload flow
   - API test for image validation

2. **Add profile history tests** (Medium priority)
   - Can defer to next release
   - Low risk (non-critical feature)
```

### Phase 2: Quality Gate Decision

Make go/no-go decision for release.

**Inputs:**
- Phase 1 traceability results
- Test review results (if available)
- NFR assessment results (if available)
- Business context (deadlines, criticality)

**Gate Decision Rules:**

| Coverage | Test Quality | NFRs | Decision |
|----------|--------------|------|----------|
| >95% P0/P1 | >80 score | PASS | PASS ✅ |
| >85% P0/P1 | >70 score | CONCERNS | CONCERNS ⚠️ |
| <85% P0/P1 | <70 score | FAIL | FAIL ❌ |
| Any | Any | Any | WAIVED ⏭️ (with approval) |

**Outputs:**

**Gate Decision** (written to traceability-matrix.md or separate gate file):

```yaml
decision: PASS
date: 2026-01-13
epic: User Profile Management
release: v1.2.0

summary:
  total_requirements: 12
  covered_requirements: 11
  coverage_percentage: 92%
  critical_gaps: 0
  test_quality_score: 82

criteria:
  p0_coverage: 100%
  p1_coverage: 90%
  test_quality: 82
  nfr_assessment: PASS

rationale: |
  All P0 requirements have full test coverage.
  One P1 gap (avatar upload) has low risk.
  Test quality exceeds 80% threshold.
  NFR assessment passed.

actions:
  - Add avatar upload tests in next iteration (P1)
  - Monitor profile performance in production

approvers:
  - name: Product Manager
    approved: true
    date: 2026-01-13
  - name: Tech Lead
    approved: true
    date: 2026-01-13

next_steps:
  - Deploy to staging
  - Run smoke tests
  - Deploy to production
```

### Usage Patterns

**Greenfield:**
- Run Phase 1 after Phase 3 (system-level test design)
- Run Phase 1 refresh in Phase 4 (per epic)
- Run Phase 2 at release gate

**Brownfield:**
- Run Phase 1 in Phase 2 (establish baseline)
- Run Phase 1 refresh in Phase 4 (per epic)
- Run Phase 2 at release gate

### Related Commands

- `*test-design` - Provides requirements for traceability
- `*test-review` - Quality scores feed gate decision
- `*nfr-assess` - NFR results feed gate decision

### How-To Guide

[How to Run Trace](/docs/how-to/workflows/run-trace.md)

---

## Summary Table

| Command | Phase | Frequency | Purpose | Output |
|---------|-------|-----------|---------|--------|
| `*framework` | 3 | Once | Scaffold test framework | Config, sample tests |
| `*ci` | 3 | Once | Setup CI/CD pipeline | Workflow files, scripts |
| `*test-design` | 3, 4 | Once (system), Per epic | Risk-based test planning | Test design documents |
| `*atdd` | 4 | Per story (optional) | Generate failing tests (TDD) | Failing tests, checklist |
| `*automate` | 4 | Per story/feature | Generate passing tests | Passing tests, fixtures |
| `*test-review` | 4, Gate | Per epic/release | Audit test quality | Quality report (0-100) |
| `*nfr-assess` | 2, Gate | Per release | Validate NFRs | NFR assessment report |
| `*trace` | 2, 4, Gate | Baseline, refresh, gate | Coverage + gate decision | Coverage matrix, gate YAML |

---

## See Also

### How-To Guides
- [Set Up Test Framework](/docs/how-to/workflows/setup-test-framework.md)
- [Run Test Design](/docs/how-to/workflows/run-test-design.md)
- [Run ATDD](/docs/how-to/workflows/run-atdd.md)
- [Run Automate](/docs/how-to/workflows/run-automate.md)
- [Run Test Review](/docs/how-to/workflows/run-test-review.md)
- [Set Up CI Pipeline](/docs/how-to/workflows/setup-ci.md)
- [Run NFR Assessment](/docs/how-to/workflows/run-nfr-assess.md)
- [Run Trace](/docs/how-to/workflows/run-trace.md)

### Explanation
- [TEA Overview](/docs/explanation/features/tea-overview.md)
- [Risk-Based Testing](/docs/explanation/tea/risk-based-testing.md)
- [Test Quality Standards](/docs/explanation/tea/test-quality-standards.md)

### Reference
- [TEA Configuration](/docs/reference/tea/configuration.md)
- [Knowledge Base Index](/docs/reference/tea/knowledge-base.md)
- [Glossary](/docs/reference/glossary/index.md)

---

Generated with [BMad Method](https://bmad-method.org) - TEA (Test Architect)
