# Traceability Matrix - Story {STORY_ID}

**Story:** {STORY_TITLE}
**Date:** {DATE}
**Status:** {OVERALL_COVERAGE}% Coverage ({GAP_COUNT} {GAP_SEVERITY} gap{s})

---

## Coverage Summary

| Priority  | Total Criteria | FULL Coverage | Coverage % | Status       |
| --------- | -------------- | ------------- | ---------- | ------------ |
| P0        | {P0_TOTAL}     | {P0_FULL}     | {P0_PCT}%  | {P0_STATUS}  |
| P1        | {P1_TOTAL}     | {P1_FULL}     | {P1_PCT}%  | {P1_STATUS}  |
| P2        | {P2_TOTAL}     | {P2_FULL}     | {P2_PCT}%  | {P2_STATUS}  |
| P3        | {P3_TOTAL}     | {P3_FULL}     | {P3_PCT}%  | {P3_STATUS}  |
| **Total** | **{TOTAL}**    | **{FULL}**    | **{PCT}%** | **{STATUS}** |

**Legend:**

- ✅ PASS - Coverage meets quality gate threshold
- ⚠️ WARN - Coverage below threshold but not critical
- ❌ FAIL - Coverage below minimum threshold (blocker)

---

## Detailed Mapping

### {CRITERION_ID}: {CRITERION_DESCRIPTION} ({PRIORITY})

- **Coverage:** {COVERAGE_STATUS} {STATUS_ICON}
- **Tests:**
  - `{TEST_ID}` - {TEST_FILE}:{LINE}
    - **Given:** {GIVEN}
    - **When:** {WHEN}
    - **Then:** {THEN}
  - `{TEST_ID_2}` - {TEST_FILE_2}:{LINE}
    - **Given:** {GIVEN_2}
    - **When:** {WHEN_2}
    - **Then:** {THEN_2}

- **Gaps:** (if PARTIAL or UNIT-ONLY or INTEGRATION-ONLY)
  - Missing: {MISSING_SCENARIO_1}
  - Missing: {MISSING_SCENARIO_2}

- **Recommendation:** {RECOMMENDATION_TEXT}

---

### Example: AC-1: User can login with email and password (P0)

- **Coverage:** FULL ✅
- **Tests:**
  - `1.3-E2E-001` - tests/e2e/auth.spec.ts:12
    - **Given:** User has valid credentials
    - **When:** User submits login form
    - **Then:** User is redirected to dashboard
  - `1.3-UNIT-001` - tests/unit/auth-service.spec.ts:8
    - **Given:** Valid email and password hash
    - **When:** validateCredentials is called
    - **Then:** Returns user object

---

### Example: AC-3: User can reset password via email (P1)

- **Coverage:** PARTIAL ⚠️
- **Tests:**
  - `1.3-E2E-003` - tests/e2e/auth.spec.ts:44
    - **Given:** User requests password reset
    - **When:** User clicks reset link in email
    - **Then:** User can set new password

- **Gaps:**
  - Missing: Email delivery validation
  - Missing: Expired token handling (error path)
  - Missing: Invalid token handling (security test)
  - Missing: Unit test for token generation logic

- **Recommendation:** Add `1.3-API-001` for email service integration testing and `1.3-UNIT-003` for token generation logic. Add `1.3-E2E-004` for error path validation (expired/invalid tokens).

---

### Example: AC-7: Session timeout handling (P2)

- **Coverage:** UNIT-ONLY ⚠️
- **Tests:**
  - `1.3-UNIT-006` - tests/unit/session-manager.spec.ts:42
    - **Given:** Session has expired timestamp
    - **When:** isSessionValid is called
    - **Then:** Returns false

- **Gaps:**
  - Missing: E2E validation of timeout behavior in UI
  - Missing: API test for session refresh flow

- **Recommendation:** Add `1.3-E2E-005` to validate that user sees timeout message and is redirected to login. Add `1.3-API-002` to validate session refresh endpoint behavior.

---

## Gap Analysis

### Critical Gaps (BLOCKER) ❌

{CRITICAL_GAP_COUNT} gaps found. **Do not release until resolved.**

1. **{CRITERION_ID}: {CRITERION_DESCRIPTION}** (P0)
   - Current Coverage: {COVERAGE_STATUS}
   - Missing Tests: {MISSING_TEST_DESCRIPTION}
   - Recommend: {RECOMMENDED_TEST_ID} ({RECOMMENDED_TEST_LEVEL})
   - Impact: {IMPACT_DESCRIPTION}

---

### High Priority Gaps (PR BLOCKER) ⚠️

{HIGH_GAP_COUNT} gaps found. **Address before PR merge.**

1. **{CRITERION_ID}: {CRITERION_DESCRIPTION}** (P1)
   - Current Coverage: {COVERAGE_STATUS}
   - Missing Tests: {MISSING_TEST_DESCRIPTION}
   - Recommend: {RECOMMENDED_TEST_ID} ({RECOMMENDED_TEST_LEVEL})
   - Impact: {IMPACT_DESCRIPTION}

---

### Medium Priority Gaps (Nightly) ⚠️

{MEDIUM_GAP_COUNT} gaps found. **Address in nightly test improvements.**

1. **{CRITERION_ID}: {CRITERION_DESCRIPTION}** (P2)
   - Current Coverage: {COVERAGE_STATUS}
   - Recommend: {RECOMMENDED_TEST_ID} ({RECOMMENDED_TEST_LEVEL})

---

### Low Priority Gaps (Optional) ℹ️

{LOW_GAP_COUNT} gaps found. **Optional - add if time permits.**

1. **{CRITERION_ID}: {CRITERION_DESCRIPTION}** (P3)
   - Current Coverage: {COVERAGE_STATUS}

---

## Quality Assessment

### Tests with Issues

**BLOCKER Issues** ❌

- `{TEST_ID}` - {ISSUE_DESCRIPTION} - {REMEDIATION}

**WARNING Issues** ⚠️

- `{TEST_ID}` - {ISSUE_DESCRIPTION} - {REMEDIATION}

**INFO Issues** ℹ️

- `{TEST_ID}` - {ISSUE_DESCRIPTION} - {REMEDIATION}

---

### Example Quality Issues

**WARNING Issues** ⚠️

- `1.3-E2E-001` - 145 seconds (exceeds 90s target) - Optimize fixture setup to reduce test duration
- `1.3-UNIT-005` - 320 lines (exceeds 300 line limit) - Split into multiple focused test files

**INFO Issues** ℹ️

- `1.3-E2E-002` - Missing Given-When-Then structure - Refactor describe block to use BDD format

---

### Tests Passing Quality Gates

**{PASSING_TEST_COUNT}/{TOTAL_TEST_COUNT} tests ({PASSING_PCT}%) meet all quality criteria** ✅

---

## Duplicate Coverage Analysis

### Acceptable Overlap (Defense in Depth)

- {CRITERION_ID}: Tested at unit (business logic) and E2E (user journey) ✅

### Unacceptable Duplication ⚠️

- {CRITERION_ID}: Same validation at E2E and Component level
  - Recommendation: Remove {TEST_ID} or consolidate with {OTHER_TEST_ID}

---

## Coverage by Test Level

| Test Level | Tests             | Criteria Covered     | Coverage %       |
| ---------- | ----------------- | -------------------- | ---------------- |
| E2E        | {E2E_COUNT}       | {E2E_CRITERIA}       | {E2E_PCT}%       |
| API        | {API_COUNT}       | {API_CRITERIA}       | {API_PCT}%       |
| Component  | {COMP_COUNT}      | {COMP_CRITERIA}      | {COMP_PCT}%      |
| Unit       | {UNIT_COUNT}      | {UNIT_CRITERIA}      | {UNIT_PCT}%      |
| **Total**  | **{TOTAL_TESTS}** | **{TOTAL_CRITERIA}** | **{TOTAL_PCT}%** |

---

## Gate YAML Snippet

```yaml
traceability:
  story_id: "{STORY_ID}"
  date: "{DATE}"
  coverage:
    overall: {OVERALL_PCT}%
    p0: {P0_PCT}%
    p1: {P1_PCT}%
    p2: {P2_PCT}%
    p3: {P3_PCT}%
  gaps:
    critical: {CRITICAL_COUNT}
    high: {HIGH_COUNT}
    medium: {MEDIUM_COUNT}
    low: {LOW_COUNT}
  quality:
    passing_tests: {PASSING_COUNT}
    total_tests: {TOTAL_TESTS}
    blocker_issues: {BLOCKER_COUNT}
    warning_issues: {WARNING_COUNT}
  status: "{STATUS}" # PASS / WARN / FAIL
  recommendations:
    - "{RECOMMENDATION_1}"
    - "{RECOMMENDATION_2}"
    - "{RECOMMENDATION_3}"
```

---

## Recommendations

### Immediate Actions (Before PR Merge)

1. **{ACTION_1}** - {DESCRIPTION}
2. **{ACTION_2}** - {DESCRIPTION}

### Short-term Actions (This Sprint)

1. **{ACTION_1}** - {DESCRIPTION}
2. **{ACTION_2}** - {DESCRIPTION}

### Long-term Actions (Backlog)

1. **{ACTION_1}** - {DESCRIPTION}

---

### Example Recommendations

### Immediate Actions (Before PR Merge)

1. **Add P1 Password Reset Tests** - Implement `1.3-API-001` for email service integration and `1.3-E2E-004` for error path validation. P1 coverage currently at 80%, target is 90%.
2. **Optimize Slow E2E Test** - Refactor `1.3-E2E-001` to use faster fixture setup. Currently 145s, target is <90s.

### Short-term Actions (This Sprint)

1. **Enhance P2 Coverage** - Add E2E validation for session timeout (`1.3-E2E-005`). Currently UNIT-ONLY coverage.
2. **Split Large Test File** - Break `1.3-UNIT-005` (320 lines) into multiple focused test files (<300 lines each).

### Long-term Actions (Backlog)

1. **Enrich P3 Coverage** - Add tests for edge cases in P3 criteria if time permits.

---

## Related Artifacts

- **Story File:** {STORY_FILE_PATH}
- **Test Design:** {TEST_DESIGN_PATH} (if available)
- **Tech Spec:** {TECH_SPEC_PATH} (if available)
- **Test Files:** {TEST_DIR_PATH}

---

## Sign-Off

**Traceability Assessment:**

- Overall Coverage: {OVERALL_PCT}%
- P0 Coverage: {P0_PCT}% {P0_STATUS}
- P1 Coverage: {P1_PCT}% {P1_STATUS}
- Critical Gaps: {CRITICAL_COUNT}
- High Priority Gaps: {HIGH_COUNT}

**Gate Status:** {STATUS} {STATUS_ICON}

**Next Steps:**

- If PASS ✅: Proceed to `*gate` workflow or PR merge
- If WARN ⚠️: Address HIGH priority gaps, re-run `*trace`
- If FAIL ❌: Run `*atdd` to generate missing P0 tests, re-run `*trace`

**Generated:** {DATE}
**Workflow:** testarch-trace v4.0

---

<!-- Powered by BMAD-CORE™ -->
