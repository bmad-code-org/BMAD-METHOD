# Requirements Traceability - Instructions v4.0

**Workflow:** `testarch-trace`
**Purpose:** Generate requirements-to-tests traceability matrix with coverage analysis and gap identification
**Agent:** Test Architect (TEA)
**Format:** Pure Markdown v4.0 (no XML blocks)

---

## Overview

This workflow creates a comprehensive traceability matrix that maps acceptance criteria to implemented tests, identifies coverage gaps, and provides actionable recommendations for improving test coverage. It supports both BMad-integrated mode (with story files and test design) and standalone mode (with inline acceptance criteria).

**Key Capabilities:**

- Map acceptance criteria to specific test cases across all levels (E2E, API, Component, Unit)
- Classify coverage status (FULL, PARTIAL, NONE, UNIT-ONLY, INTEGRATION-ONLY)
- Prioritize gaps by risk level (P0/P1/P2/P3) using test-priorities framework
- Generate gate-ready YAML snippets for CI/CD integration
- Detect duplicate coverage across test levels
- Verify explicit assertions in test cases

---

## Prerequisites

**Required:**

- Acceptance criteria (from story file OR provided inline)
- Implemented test suite (or acknowledge gaps to be addressed)

**Recommended:**

- `test-design.md` (for risk assessment and priority context)
- `tech-spec.md` (for technical implementation context)
- Test framework configuration (playwright.config.ts, jest.config.js, etc.)

**Halt Conditions:**

- If story lacks any implemented tests AND no gaps are acknowledged, recommend running `*atdd` workflow first
- If acceptance criteria are completely missing, halt and request them

---

## Workflow Steps

### Step 1: Load Context and Knowledge Base

**Actions:**

1. Load relevant knowledge fragments from `{project-root}/bmad/bmm/testarch/tea-index.csv`:
   - `traceability.md` - Requirements mapping patterns
   - `test-priorities.md` - P0/P1/P2/P3 risk framework
   - `risk-governance.md` - Risk-based testing approach
   - `test-quality.md` - Definition of Done for tests
   - `selective-testing.md` - Duplicate coverage patterns

2. Read story file (if provided):
   - Extract acceptance criteria
   - Identify story ID (e.g., 1.3)
   - Note any existing test design or priority information

3. Read related BMad artifacts (if available):
   - `test-design.md` - Risk assessment and test priorities
   - `tech-spec.md` - Technical implementation details
   - `PRD.md` - Product requirements context

**Output:** Complete understanding of requirements, priorities, and existing context

---

### Step 2: Discover and Catalog Tests

**Actions:**

1. Auto-discover test files related to the story:
   - Search for test IDs (e.g., `1.3-E2E-001`, `1.3-UNIT-005`)
   - Search for describe blocks mentioning feature name
   - Search for file paths matching feature directory
   - Use `glob` to find test files in `{test_dir}`

2. Categorize tests by level:
   - **E2E Tests**: Full user journeys through UI
   - **API Tests**: HTTP contract and integration tests
   - **Component Tests**: UI component behavior in isolation
   - **Unit Tests**: Business logic and pure functions

3. Extract test metadata:
   - Test ID (if present)
   - Describe/context blocks
   - It blocks (individual test cases)
   - Given-When-Then structure (if BDD)
   - Assertions used
   - Priority markers (P0/P1/P2/P3)

**Output:** Complete catalog of all tests for this feature

---

### Step 3: Map Criteria to Tests

**Actions:**

1. For each acceptance criterion:
   - Search for explicit references (test IDs, describe blocks mentioning criterion)
   - Map to specific test files and it blocks
   - Use Given-When-Then narrative to verify alignment
   - Document test level (E2E, API, Component, Unit)

2. Build traceability matrix:

   ```
   | Criterion ID | Description | Test ID | Test File | Test Level | Coverage Status |
   |--------------|-------------|---------|-----------|------------|-----------------|
   | AC-1         | User can... | 1.3-E2E-001 | e2e/auth.spec.ts | E2E | FULL |
   ```

3. Classify coverage status for each criterion:
   - **FULL**: All scenarios validated at appropriate level(s)
   - **PARTIAL**: Some coverage but missing edge cases or levels
   - **NONE**: No test coverage at any level
   - **UNIT-ONLY**: Only unit tests (missing integration/E2E validation)
   - **INTEGRATION-ONLY**: Only API/Component tests (missing unit confidence)

4. Check for duplicate coverage:
   - Same behavior tested at multiple levels unnecessarily
   - Flag violations of selective testing principles
   - Recommend consolidation where appropriate

**Output:** Complete traceability matrix with coverage classifications

---

### Step 4: Analyze Gaps and Prioritize

**Actions:**

1. Identify coverage gaps:
   - List criteria with NONE, PARTIAL, UNIT-ONLY, or INTEGRATION-ONLY status
   - Assign severity based on test-priorities framework:
     - **CRITICAL**: P0 criteria without FULL coverage (blocks release)
     - **HIGH**: P1 criteria without FULL coverage (PR blocker)
     - **MEDIUM**: P2 criteria without FULL coverage (nightly test gap)
     - **LOW**: P3 criteria without FULL coverage (acceptable gap)

2. Recommend specific tests to add:
   - Suggest test level (E2E, API, Component, Unit)
   - Provide test description (Given-When-Then)
   - Recommend test ID (e.g., `1.3-E2E-004`)
   - Explain why this test is needed

3. Calculate coverage metrics:
   - Overall coverage percentage (criteria with FULL coverage / total criteria)
   - P0 coverage percentage (critical paths)
   - P1 coverage percentage (high priority)
   - Coverage by level (E2E%, API%, Component%, Unit%)

4. Check against quality gates:
   - P0 coverage >= 100% (required)
   - P1 coverage >= 90% (recommended)
   - Overall coverage >= 80% (recommended)

**Output:** Prioritized gap analysis with actionable recommendations

---

### Step 5: Verify Test Quality

**Actions:**

1. For each mapped test, verify:
   - Explicit assertions are present (not hidden in helpers)
   - Test follows Given-When-Then structure
   - No hard waits or sleeps
   - Self-cleaning (test cleans up its data)
   - File size < 300 lines
   - Test duration < 90 seconds

2. Flag quality issues:
   - **BLOCKER**: Missing assertions, hard waits, flaky patterns
   - **WARNING**: Large files, slow tests, unclear structure
   - **INFO**: Style inconsistencies, missing documentation

3. Reference knowledge fragments:
   - `test-quality.md` for Definition of Done
   - `fixture-architecture.md` for self-cleaning patterns
   - `network-first.md` for Playwright best practices
   - `data-factories.md` for test data patterns

**Output:** Quality assessment for each test with improvement recommendations

---

### Step 6: Generate Deliverables

**Actions:**

1. Create traceability matrix markdown file:
   - Use template from `trace-template.md`
   - Include full mapping table
   - Add coverage status section
   - Add gap analysis section
   - Add quality assessment section
   - Add recommendations section
   - Save to `{output_folder}/traceability-matrix.md`

2. Generate gate YAML snippet (if enabled):

   ```yaml
   traceability:
     story_id: '1.3'
     coverage:
       overall: 85%
       p0: 100%
       p1: 90%
       p2: 75%
     gaps:
       critical: 0
       high: 1
       medium: 2
     status: 'PASS' # or "FAIL" if P0 < 100%
   ```

3. Create coverage badge/metric (if enabled):
   - Generate badge markdown: `![Coverage](https://img.shields.io/badge/coverage-85%25-green)`
   - Export metrics to JSON for CI/CD integration

4. Update story file (if enabled):
   - Add "Traceability" section to story markdown
   - Link to traceability matrix
   - Include coverage summary
   - Add gate status

**Output:** Complete traceability documentation ready for review and CI/CD integration

---

## Non-Prescriptive Approach

**Minimal Examples:** This workflow provides principles and patterns, not rigid templates. Teams should adapt the traceability format to their needs.

**Key Patterns to Follow:**

- Map criteria to tests explicitly (don't rely on inference alone)
- Prioritize by risk (P0 gaps are critical, P3 gaps are acceptable)
- Check coverage at appropriate levels (E2E for journeys, Unit for logic)
- Verify test quality (explicit assertions, no flakiness)
- Generate gate-ready artifacts (YAML snippets for CI/CD)

**Extend as Needed:**

- Add custom coverage classifications
- Integrate with code coverage tools (Istanbul, NYC)
- Link to external traceability systems (JIRA, Azure DevOps)
- Add compliance or regulatory requirements

---

## Coverage Classification Details

### FULL Coverage

- All scenarios validated at appropriate test level(s)
- Edge cases considered
- Both happy path and error paths tested
- Assertions are explicit and complete

### PARTIAL Coverage

- Some scenarios validated but missing edge cases
- Only happy path tested (missing error paths)
- Assertions present but incomplete
- Coverage exists but needs enhancement

### NONE Coverage

- No tests found for this criterion
- Complete gap requiring new tests
- Critical if P0/P1, acceptable if P3

### UNIT-ONLY Coverage

- Only unit tests exist (business logic validated)
- Missing integration or E2E validation
- Risk: Implementation may not work end-to-end
- Recommendation: Add integration or E2E tests for critical paths

### INTEGRATION-ONLY Coverage

- Only API or Component tests exist
- Missing unit test confidence for business logic
- Risk: Logic errors may not be caught quickly
- Recommendation: Add unit tests for complex algorithms or state machines

---

## Duplicate Coverage Detection

Use selective testing principles from `selective-testing.md`:

**Acceptable Overlap:**

- Unit tests for business logic + E2E tests for user journey (different aspects)
- API tests for contract + E2E tests for full workflow (defense in depth for critical paths)

**Unacceptable Duplication:**

- Same validation at multiple levels (e.g., E2E testing math logic better suited for unit tests)
- Multiple E2E tests covering identical user path
- Component tests duplicating unit test logic

**Recommendation Pattern:**

- Test logic at unit level
- Test integration at API/Component level
- Test user experience at E2E level
- Avoid testing framework behavior at any level

---

## Integration with BMad Artifacts

### With test-design.md

- Use risk assessment to prioritize gap remediation
- Reference test priorities (P0/P1/P2/P3) for severity classification
- Align traceability with originally planned test coverage

### With tech-spec.md

- Understand technical implementation details
- Map criteria to specific code modules
- Verify tests cover technical edge cases

### With PRD.md

- Understand full product context
- Verify acceptance criteria align with product goals
- Check for unstated requirements that need coverage

---

## Quality Gates

### P0 Coverage (Critical Paths)

- **Requirement:** 100% FULL coverage
- **Severity:** BLOCKER if not met
- **Action:** Do not release until P0 coverage is complete

### P1 Coverage (High Priority)

- **Requirement:** 90% FULL coverage
- **Severity:** HIGH if not met
- **Action:** Block PR merge until addressed

### P2 Coverage (Medium Priority)

- **Requirement:** No strict requirement (recommended 80%)
- **Severity:** MEDIUM if gaps exist
- **Action:** Address in nightly test improvements

### P3 Coverage (Low Priority)

- **Requirement:** No requirement
- **Severity:** LOW if gaps exist
- **Action:** Optional - add if time permits

---

## Example Traceability Matrix

````markdown
# Traceability Matrix - Story 1.3

**Story:** User Authentication
**Date:** 2025-10-14
**Status:** 85% Coverage (1 HIGH gap)

## Coverage Summary

| Priority  | Total Criteria | FULL Coverage | Coverage % | Status  |
| --------- | -------------- | ------------- | ---------- | ------- |
| P0        | 3              | 3             | 100%       | ✅ PASS |
| P1        | 5              | 4             | 80%        | ⚠️ WARN |
| P2        | 4              | 3             | 75%        | ✅ PASS |
| P3        | 2              | 1             | 50%        | ✅ PASS |
| **Total** | **14**         | **11**        | **79%**    | ⚠️ WARN |

## Detailed Mapping

### AC-1: User can login with email and password (P0)

- **Coverage:** FULL ✅
- **Tests:**
  - `1.3-E2E-001` - tests/e2e/auth.spec.ts:12
    - Given: User has valid credentials
    - When: User submits login form
    - Then: User is redirected to dashboard
  - `1.3-UNIT-001` - tests/unit/auth-service.spec.ts:8
    - Given: Valid email and password hash
    - When: validateCredentials is called
    - Then: Returns user object

### AC-2: User sees error for invalid credentials (P0)

- **Coverage:** FULL ✅
- **Tests:**
  - `1.3-E2E-002` - tests/e2e/auth.spec.ts:28
    - Given: User has invalid password
    - When: User submits login form
    - Then: Error message is displayed
  - `1.3-UNIT-002` - tests/unit/auth-service.spec.ts:18
    - Given: Invalid password hash
    - When: validateCredentials is called
    - Then: Throws AuthenticationError

### AC-3: User can reset password via email (P1)

- **Coverage:** PARTIAL ⚠️
- **Tests:**
  - `1.3-E2E-003` - tests/e2e/auth.spec.ts:44
    - Given: User requests password reset
    - When: User clicks reset link
    - Then: User can set new password
- **Gaps:**
  - Missing: Email delivery validation
  - Missing: Expired token handling
  - Missing: Unit test for token generation
- **Recommendation:** Add `1.3-API-001` for email service integration and `1.3-UNIT-003` for token logic

## Gap Analysis

### Critical Gaps (BLOCKER)

- None ✅

### High Priority Gaps (PR BLOCKER)

1. **AC-3: Password reset email edge cases**
   - Missing tests for expired tokens, invalid tokens, email failures
   - Recommend: `1.3-API-001` (email service integration) and `1.3-E2E-004` (error paths)
   - Impact: Users may not be able to recover accounts in error scenarios

### Medium Priority Gaps (Nightly)

1. **AC-7: Session timeout handling** - UNIT-ONLY coverage (missing E2E validation)

## Quality Assessment

### Tests with Issues

- `1.3-E2E-001` ⚠️ - 145 seconds (exceeds 90s target) - Optimize fixture setup
- `1.3-UNIT-005` ⚠️ - 320 lines (exceeds 300 line limit) - Split into multiple test files

### Tests Passing Quality Gates

- 11/13 tests (85%) meet all quality criteria ✅

## Gate YAML Snippet

```yaml
traceability:
  story_id: '1.3'
  coverage:
    overall: 79%
    p0: 100%
    p1: 80%
    p2: 75%
    p3: 50%
  gaps:
    critical: 0
    high: 1
    medium: 1
    low: 1
  status: 'WARN' # P1 coverage below 90% threshold
  recommendations:
    - 'Add 1.3-API-001 for email service integration'
    - 'Add 1.3-E2E-004 for password reset error paths'
    - 'Optimize 1.3-E2E-001 performance (145s → <90s)'
```
````

## Recommendations

1. **Address High Priority Gap:** Add password reset edge case tests before PR merge
2. **Optimize Slow Test:** Refactor `1.3-E2E-001` to use faster fixture setup
3. **Split Large Test:** Break `1.3-UNIT-005` into focused test files
4. **Enhance P2 Coverage:** Add E2E validation for session timeout (currently UNIT-ONLY)

```

---

## Validation Checklist

Before completing this workflow, verify:

- ✅ All acceptance criteria are mapped to tests (or gaps are documented)
- ✅ Coverage status is classified (FULL, PARTIAL, NONE, UNIT-ONLY, INTEGRATION-ONLY)
- ✅ Gaps are prioritized by risk level (P0/P1/P2/P3)
- ✅ P0 coverage is 100% or blockers are documented
- ✅ Duplicate coverage is identified and flagged
- ✅ Test quality is assessed (assertions, structure, performance)
- ✅ Traceability matrix is generated and saved
- ✅ Gate YAML snippet is generated (if enabled)
- ✅ Story file is updated with traceability section (if enabled)
- ✅ Recommendations are actionable and specific

---

## Notes

- **Explicit Mapping:** Require tests to reference criteria explicitly (test IDs, describe blocks) for maintainability
- **Risk-Based Prioritization:** Use test-priorities framework (P0/P1/P2/P3) to determine gap severity
- **Quality Over Quantity:** Better to have fewer high-quality tests with FULL coverage than many low-quality tests with PARTIAL coverage
- **Selective Testing:** Avoid duplicate coverage - test each behavior at the appropriate level only
- **Gate Integration:** Generate YAML snippets that can be consumed by CI/CD pipelines for automated quality gates

---

## Troubleshooting

### "No tests found for this story"
- Run `*atdd` workflow first to generate failing acceptance tests
- Check test file naming conventions (may not match story ID pattern)
- Verify test directory path is correct

### "Cannot determine coverage status"
- Tests may lack explicit mapping to criteria (no test IDs, unclear describe blocks)
- Review test structure and add Given-When-Then narrative
- Add test IDs in format: `{STORY_ID}-{LEVEL}-{SEQ}` (e.g., 1.3-E2E-001)

### "P0 coverage below 100%"
- This is a **BLOCKER** - do not release
- Identify missing P0 tests in gap analysis
- Run `*atdd` workflow to generate missing tests
- Verify with stakeholders that P0 classification is correct

### "Duplicate coverage detected"
- Review selective testing principles in `selective-testing.md`
- Determine if overlap is acceptable (defense in depth) or wasteful (same validation at multiple levels)
- Consolidate tests at appropriate level (logic → unit, integration → API, journey → E2E)

---

## Related Workflows

- **testarch-test-design** - Define test priorities (P0/P1/P2/P3) before tracing
- **testarch-atdd** - Generate failing acceptance tests for gaps identified
- **testarch-automate** - Expand regression suite based on traceability findings
- **testarch-gate** - Use traceability matrix as input for quality gate decisions
- **testarch-test-review** - Review test quality issues flagged in traceability

---

<!-- Powered by BMAD-CORE™ -->
```
