<!-- Powered by BMAD-CORE™ -->

# Test Review

**Workflow ID**: `_bmad/bmgd/gametest/test-review`
**Version**: 1.0 (BMad v6)

---

## Overview

Review existing test suite quality, identify coverage gaps, and recommend improvements. Regular test review prevents test rot and maintains test value over time.

**Knowledge Base Reference**: `knowledge/regression-testing.md`, `knowledge/test-priorities.md`

---

## Preflight Requirements

- ✅ Test suite exists (some tests to review)
- ✅ Access to test execution results
- ✅ Understanding of game features

---

## Step 1: Gather Test Suite Metrics

### Actions

1. **Count Tests by Type**

   | Type                 | Count | Pass Rate | Avg Duration |
   | -------------------- | ----- | --------- | ------------ |
   | Unit                 |       |           |              |
   | Integration          |       |           |              |
   | Play Mode/Functional |       |           |              |
   | Performance          |       |           |              |
   | **Total**            |       |           |              |

2. **Analyze Test Results**
   - Recent pass rate (last 10 runs)
   - Flaky tests (inconsistent results)
   - Slow tests (> 30s individual)
   - Disabled/skipped tests

3. **Map Coverage**
   - Features with tests
   - Features without tests
   - Critical paths covered

---

## Step 2: Assess Test Quality

### Quality Criteria

For each test, evaluate:

| Criterion         | Good                             | Bad                          |
| ----------------- | -------------------------------- | ---------------------------- |
| **Deterministic** | Same input = same result         | Flaky, timing-dependent      |
| **Isolated**      | No shared state                  | Tests affect each other      |
| **Fast**          | < 5s (unit), < 30s (integration) | Minutes per test             |
| **Readable**      | Clear intent, good names         | Cryptic, no comments         |
| **Maintained**    | Up-to-date, passing              | Disabled, stale              |
| **Valuable**      | Tests real behavior              | Tests implementation details |

### Anti-Pattern Detection

Look for these common issues:

```
❌ Hard-coded waits
   await Task.Delay(5000);  // Bad
   await WaitUntil(() => condition);  // Good

❌ Shared test state
   static bool wasSetup;  // Dangerous
   [SetUp] void Setup() { /* fresh state */ }  // Good

❌ Testing private implementation
   var result = obj.GetPrivateField();  // Bad
   var result = obj.PublicBehavior();  // Good

❌ Missing cleanup
   var go = Instantiate(prefab);  // Leaks
   var go = Instantiate(prefab);
   AddCleanup(() => Destroy(go));  // Good

❌ Assertion-free tests
   void Test() { DoSomething(); }  // What does it test?
   void Test() { DoSomething(); Assert.That(...); }  // Clear
```

---

## Step 3: Identify Coverage Gaps

### Critical Areas to Verify

| Area          | P0 Coverage | P1 Coverage | Gap? |
| ------------- | ----------- | ----------- | ---- |
| Core Loop     |             |             |      |
| Save/Load     |             |             |      |
| Progression   |             |             |      |
| Combat        |             |             |      |
| UI/Menus      |             |             |      |
| Multiplayer   |             |             |      |
| Platform Cert |             |             |      |

### Gap Identification Process

1. List all game features
2. Check if each feature has tests
3. Assess test depth (happy path only vs edge cases)
4. Prioritize gaps by risk

---

## Step 4: Review Test Infrastructure

### Framework Health

- [ ] Tests run in CI
- [ ] Results are visible to team
- [ ] Failures block deployments
- [ ] Test data is versioned
- [ ] Fixtures are reusable
- [ ] Helpers reduce duplication

### Maintenance Burden

- How often do tests need updates?
- Are updates proportional to code changes?
- Do refactors break tests unnecessarily?

---

## Step 5: Generate Recommendations

### Priority Matrix

| Finding   | Severity       | Effort         | Recommendation |
| --------- | -------------- | -------------- | -------------- |
| {finding} | {High/Med/Low} | {High/Med/Low} | {action}       |

### Common Recommendations

**For Flaky Tests**:

- Replace `Thread.Sleep` with explicit waits
- Add proper synchronization
- Isolate test state

**For Slow Tests**:

- Move to nightly builds
- Optimize test setup
- Mock expensive dependencies

**For Coverage Gaps**:

- Prioritize P0/P1 features
- Add smoke tests first
- Use test-design workflow

**For Maintenance Issues**:

- Refactor common patterns
- Create test utilities
- Improve documentation

---

## Step 6: Generate Test Review Report

### Report Structure

```markdown
# Test Review Report: {Project Name}

## Executive Summary

- Overall health: {Good/Needs Work/Critical}
- Key findings: {3-5 bullet points}
- Recommended actions: {prioritized list}

## Metrics

### Test Suite Statistics

[Tables from Step 1]

### Recent History

[Pass rates, trends]

## Quality Assessment

### Strengths

- {What's working well}

### Issues Found

| Issue | Severity | Tests Affected | Fix |
| ----- | -------- | -------------- | --- |
|       |          |                |     |

## Coverage Analysis

### Current Coverage

[Feature coverage table]

### Critical Gaps

[Prioritized list of missing coverage]

## Recommendations

### Immediate (This Sprint)

1. {Fix critical issues}

### Short-term (This Milestone)

1. {Address major gaps}

### Long-term (Ongoing)

1. {Improve infrastructure}

## Appendix

### Flaky Tests

[List with failure patterns]

### Slow Tests

[List with durations]

### Disabled Tests

[List with reasons]
```

---

## Review Frequency

| Review Type | Frequency | Scope                    | Owner     |
| ----------- | --------- | ------------------------ | --------- |
| Quick Check | Weekly    | Pass rates, flaky tests  | QA        |
| Full Review | Monthly   | Coverage, quality        | Tech Lead |
| Deep Dive   | Quarterly | Infrastructure, strategy | Team      |

---

## Deliverables

1. **Test Review Report** - Comprehensive analysis
2. **Action Items** - Prioritized improvements
3. **Coverage Matrix** - Visual gap identification
4. **Technical Debt List** - Tests needing refactor

---

## Validation

Refer to `checklist.md` for validation criteria.
