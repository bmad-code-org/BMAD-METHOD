# Test Design for QA: {Feature Name}

**Purpose:** Test execution recipe for QA team. Defines test scenarios, coverage plan, tooling, and Sprint 0 setup requirements. Use this as your implementation guide after architectural blockers are resolved.

**Date:** {date}
**Author:** {author}
**Status:** Draft / Ready for Implementation
**Project:** {project_name}
**PRD Reference:** {prd_link}
**ADR Reference:** {adr_link}

---

## Quick Reference for QA

**Before You Start:**
- [ ] Review Architecture doc (test-design-architecture.md) - understand blockers and risks
- [ ] Verify Sprint 0 blockers resolved (see Sprint 0 section below)
- [ ] Confirm test infrastructure ready (factories, fixtures, environments)

**Test Execution Order:**
1. **Smoke tests** (<5 min) - Fast feedback on critical paths
2. **P0 tests** (~{X} min) - Critical paths, security-critical flows
3. **P1 tests** (~{X} min) - Important features, algorithm accuracy
4. **P2/P3 tests** (~{X} min) - Edge cases, performance, NFR

**Need Help?**
- Blockers: See Architecture doc "Quick Guide" for mitigation plans
- Test scenarios: See "Test Coverage Plan" section below
- Sprint 0 setup: See "Sprint 0 Setup Requirements" section

---

## System Architecture Summary

**Data Pipeline:**
{Brief description of system flow}

**Key Services:**
- **{Service 1}**: {Purpose and key responsibilities}
- **{Service 2}**: {Purpose and key responsibilities}
- **{Service 3}**: {Purpose and key responsibilities}

**Data Stores:**
- **{Database 1}**: {What it stores}
- **{Database 2}**: {What it stores}

**Expected Scale** (from ADR):
- {Key metrics: RPS, volume, users, etc.}

---

## Test Environment Requirements

**{Company} Standard:** Shared DB per Environment with Randomization (Shift-Left)

| Environment | Database | Test Data Strategy | Purpose |
|-------------|----------|-------------------|---------|
| **Local** | {DB} (shared) | Randomized (faker), auto-cleanup | Local development |
| **Dev (CI)** | {DB} (shared) | Randomized (faker), auto-cleanup | PR validation |
| **Staging** | {DB} (shared) | Randomized (faker), auto-cleanup | Pre-production, E2E |

**Key Principles:**
- **Shared database per environment** (no ephemeral)
- **Randomization for isolation** (faker-based unique IDs)
- **Parallel-safe** (concurrent test runs don't conflict)
- **Self-cleaning** (tests delete their own data)
- **Shift-left** (test against real DBs early)

**Example:**

```typescript
import { faker } from "@faker-js/faker";

test("example with randomized test data @p0", async ({ apiRequest }) => {
  const testData = {
    id: `test-${faker.string.uuid()}`,
    customerId: `test-customer-${faker.string.alphanumeric(8)}`,
    // ... unique test data
  };

  // Seed, test, cleanup
});
```

---

## Testability Assessment

**Prerequisites from Architecture Doc:**

Verify these blockers are resolved before test development:
- [ ] {Blocker 1} (see Architecture doc Quick Guide → 🚨 BLOCKERS)
- [ ] {Blocker 2}
- [ ] {Blocker 3}

**If Prerequisites Not Met:** Coordinate with Architecture team (see Architecture doc for mitigation plans and owner assignments)

---

## Test Levels Strategy

**System Type:** {API-heavy / UI-heavy / Mixed backend system}

**Recommended Split:**
- **Unit Tests: {X}%** - {What to unit test}
- **Integration/API Tests: {X}%** - ⭐ **PRIMARY FOCUS** - {What to integration test}
- **E2E Tests: {X}%** - {What to E2E test}

**Rationale:** {Why this split makes sense for this system}

**Test Count Summary:**
- P0: ~{N} tests - Critical paths, run on every commit
- P1: ~{N} tests - Important features, run on PR to main
- P2: ~{N} tests - Edge cases, run nightly/weekly
- P3: ~{N} tests - Exploratory, run on-demand
- **Total: ~{N} tests** (~{X} weeks for 1 QA, ~{Y} weeks for 2 QAs)

---

## Test Coverage Plan

**Repository Note:** {Where tests live - backend repo, admin panel repo, etc. - and how CI pipelines are organized}

### P0 (Critical) - Run on every commit (~{X} min)

**Execution:** CI/CD on every commit, parallel workers, smoke tests first (<5 min)

**Purpose:** Critical path validation - catch build-breaking changes and security violations immediately

**Criteria:** Blocks core functionality OR High risk (≥6) OR No workaround

**Key Smoke Tests** (subset of P0, run first for fast feedback):
- {Smoke test 1} - {Duration}
- {Smoke test 2} - {Duration}
- {Smoke test 3} - {Duration}

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
|-------------|------------|-----------|------------|-------|-------|
| {Requirement 1} | {Level} | {R-ID} | {N} | QA | {Notes} |
| {Requirement 2} | {Level} | {R-ID} | {N} | QA | {Notes} |

**Total P0:** ~{N} tests (~{X} weeks)

#### P0 Test Scenarios (Detailed)

**1. {Test Category} ({N} tests) - {CRITICALITY if applicable}**

- [ ] {Scenario 1 with checkbox}
- [ ] {Scenario 2}
- [ ] {Scenario 3}

**2. {Test Category 2} ({N} tests)**

- [ ] {Scenario 1}
- [ ] {Scenario 2}

{Continue for all P0 categories}

---

### P1 (High) - Run on PR to main (~{X} min additional)

**Execution:** CI/CD on pull requests to main branch, runs after P0 passes, parallel workers

**Purpose:** Important feature coverage - algorithm accuracy, complex workflows, Admin Panel interactions

**Criteria:** Important features OR Medium risk (3-4) OR Common workflows

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
|-------------|------------|-----------|------------|-------|-------|
| {Requirement 1} | {Level} | {R-ID} | {N} | QA | {Notes} |
| {Requirement 2} | {Level} | {R-ID} | {N} | QA | {Notes} |

**Total P1:** ~{N} tests (~{X} weeks)

#### P1 Test Scenarios (Detailed)

**1. {Test Category} ({N} tests)**

- [ ] {Scenario 1}
- [ ] {Scenario 2}

{Continue for all P1 categories}

---

### P2 (Medium) - Run nightly/weekly (~{X} min)

**Execution:** Scheduled nightly run (or weekly for P3), full infrastructure, sequential execution acceptable

**Purpose:** Edge case coverage, error handling, data integrity validation - slow feedback acceptable

**Criteria:** Secondary features OR Low risk (1-2) OR Edge cases

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
|-------------|------------|-----------|------------|-------|-------|
| {Requirement 1} | {Level} | {R-ID} | {N} | QA | {Notes} |
| {Requirement 2} | {Level} | {R-ID} | {N} | QA | {Notes} |

**Total P2:** ~{N} tests (~{X} weeks)

---

### P3 (Low) - Run on-demand (exploratory)

**Execution:** Manual trigger or weekly scheduled run, performance testing

**Purpose:** Full regression, performance benchmarks, accessibility validation - no time pressure

**Criteria:** Nice-to-have OR Exploratory OR Performance benchmarks

| Requirement | Test Level | Test Count | Owner | Notes |
|-------------|------------|------------|-------|-------|
| {Requirement 1} | {Level} | {N} | QA | {Notes} |
| {Requirement 2} | {Level} | {N} | QA | {Notes} |

**Total P3:** ~{N} tests (~{X} days)

---

### Coverage Matrix (Requirements → Tests)

| Requirement | Test Level | Priority | Risk Link | Test Count | Owner |
|-------------|------------|----------|-----------|------------|-------|
| {Requirement 1} | {Level} | {P0-P3} | {R-ID} | {N} | {Owner} |
| {Requirement 2} | {Level} | {P0-P3} | {R-ID} | {N} | {Owner} |

---

## Sprint 0 Setup Requirements

**IMPORTANT:** These items **BLOCK test development**. Complete in Sprint 0 before QA can write tests.

### Architecture/Backend Blockers (from Architecture doc)

**Source:** See Architecture doc "Quick Guide" for detailed mitigation plans

1. **{Blocker 1}** 🚨 **BLOCKER** - {Owner}
   - {What needs to be provided}
   - **Details:** Architecture doc {Risk-ID} mitigation plan

2. **{Blocker 2}** 🚨 **BLOCKER** - {Owner}
   - {What needs to be provided}
   - **Details:** Architecture doc {Risk-ID} mitigation plan

### QA Test Infrastructure

1. **{Factory/Fixture Name}** - QA
   - Faker-based generator: `{function_signature}`
   - Auto-cleanup after tests

2. **{Entity} Fixtures** - QA
   - Seed scripts for {states/scenarios}
   - Isolated {id_pattern} per test

### Test Environments

**Local:** {Setup details - Docker, LocalStack, etc.}

**CI/CD:** {Setup details - shared infrastructure, parallel workers, artifacts}

**Staging:** {Setup details - shared multi-tenant, nightly E2E}

**Production:** {Setup details - feature flags, canary transactions}

**Sprint 0 NFR Gates** (MUST complete before integration testing):
- [ ] {Gate 1}: {Description} (Owner) 🚨
- [ ] {Gate 2}: {Description} (Owner) 🚨
- [ ] {Gate 3}: {Description} (Owner) 🚨

### Sprint 1 Items (Not Sprint 0)

- **{Item 1}** ({Owner}): {Description}
- **{Item 2}** ({Owner}): {Description}

**Sprint 1 NFR Gates** (MUST complete before GA):
- [ ] {Gate 1}: {Description} (Owner)
- [ ] {Gate 2}: {Description} (Owner)

---

## NFR Readiness Summary

**Based on Architecture Doc Risk Assessment**

| NFR Category | Status | Evidence Status | Blocker | Next Action |
|--------------|--------|-----------------|---------|-------------|
| **Testability & Automation** | {Status} | {Evidence} | {Sprint} | {Action} |
| **Test Data Strategy** | {Status} | {Evidence} | {Sprint} | {Action} |
| **Scalability & Availability** | {Status} | {Evidence} | {Sprint} | {Action} |
| **Disaster Recovery** | {Status} | {Evidence} | {Sprint} | {Action} |
| **Security** | {Status} | {Evidence} | {Sprint} | {Action} |
| **Monitorability, Debuggability & Manageability** | {Status} | {Evidence} | {Sprint} | {Action} |
| **QoS & QoE** | {Status} | {Evidence} | {Sprint} | {Action} |
| **Deployability** | {Status} | {Evidence} | {Sprint} | {Action} |

**Total:** {N} PASS, {N} CONCERNS across {N} categories

---

**End of QA Document**

**Next Steps for QA Team:**
1. Verify Sprint 0 blockers resolved (coordinate with Architecture team if not)
2. Set up test infrastructure (factories, fixtures, environments)
3. Begin test implementation following priority order (P0 → P1 → P2 → P3)
4. Run smoke tests first for fast feedback
5. Track progress using test scenario checklists above

**Next Steps for Architecture Team:**
1. Monitor Sprint 0 blocker resolution
2. Provide support for QA infrastructure setup if needed
3. Review test results and address any newly discovered testability gaps
