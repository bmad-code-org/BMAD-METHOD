# Test Review Report: {PROJECT_NAME}

**Review Date**: {DATE}
**Reviewer**: {REVIEWER}
**Period Covered**: {START_DATE} to {END_DATE}

---

## Executive Summary

### Overall Health: {Good | Needs Work | Critical}

### Key Findings

1. {Finding 1}
2. {Finding 2}
3. {Finding 3}

### Recommended Actions

1. {High priority action}
2. {Medium priority action}
3. {Ongoing improvement}

---

## Test Suite Metrics

### Test Distribution

| Type                 | Count | % of Total |
| -------------------- | ----- | ---------- |
| Unit Tests           |       |            |
| Integration Tests    |       |            |
| Play Mode/Functional |       |            |
| Performance Tests    |       |            |
| **Total**            |       | 100%       |

### Execution Metrics

| Metric         | Current | Previous | Trend |
| -------------- | ------- | -------- | ----- |
| Pass Rate      |         |          | {↑↓→} |
| Avg Duration   |         |          | {↑↓→} |
| Flaky Tests    |         |          | {↑↓→} |
| Disabled Tests |         |          | {↑↓→} |

### Recent Run History

| Date | Passed | Failed | Skipped | Duration |
| ---- | ------ | ------ | ------- | -------- |
|      |        |        |         |          |
|      |        |        |         |          |
|      |        |        |         |          |

---

## Quality Assessment

### Strengths

- {What the test suite does well}
- {Good patterns observed}
- {Areas of strong coverage}

### Issues Found

| Issue              | Severity | Count | Example | Recommended Fix |
| ------------------ | -------- | ----- | ------- | --------------- |
| Flaky tests        | High     |       |         |                 |
| Slow tests         | Medium   |       |         |                 |
| Missing cleanup    | Medium   |       |         |                 |
| Hard-coded waits   | Low      |       |         |                 |
| Unclear assertions | Low      |       |         |                 |

### Anti-Patterns Detected

| Pattern   | Occurrences | Impact | Fix Effort |
| --------- | ----------- | ------ | ---------- |
| {pattern} |             |        |            |

---

## Coverage Analysis

### Feature Coverage Matrix

| Feature       | P0 Tests | P1 Tests | P2 Tests | Gap? |
| ------------- | -------- | -------- | -------- | ---- |
| Core Loop     |          |          |          |      |
| Combat/Action |          |          |          |      |
| Movement      |          |          |          |      |
| UI/Menus      |          |          |          |      |
| Save/Load     |          |          |          |      |
| Progression   |          |          |          |      |
| Multiplayer   |          |          |          |      |
| Audio         |          |          |          |      |
| Platform      |          |          |          |      |

### Critical Gaps

| Gap                     | Risk         | Impact      | Priority to Fix |
| ----------------------- | ------------ | ----------- | --------------- |
| {feature without tests} | {risk level} | {if breaks} | P{0-3}          |

### Coverage by Priority

```
P0 Coverage: {X}% ████████░░
P1 Coverage: {X}% ██████░░░░
P2 Coverage: {X}% ████░░░░░░
P3 Coverage: {X}% ██░░░░░░░░
```

---

## Infrastructure Review

### CI/CD Integration

| Aspect            | Status  | Notes |
| ----------------- | ------- | ----- |
| Tests in CI       | {✅/❌} |       |
| Results visible   | {✅/❌} |       |
| Failures block    | {✅/❌} |       |
| Nightly runs      | {✅/❌} |       |
| Performance tests | {✅/❌} |       |

### Test Infrastructure Quality

| Component      | Quality          | Notes |
| -------------- | ---------------- | ----- |
| Fixtures       | {Good/Fair/Poor} |       |
| Helpers        | {Good/Fair/Poor} |       |
| Data factories | {Good/Fair/Poor} |       |
| Documentation  | {Good/Fair/Poor} |       |

### Maintenance Burden

- Test update frequency: {high/medium/low}
- Brittleness score: {high/medium/low}
- Developer friction: {high/medium/low}

---

## Recommendations

### Immediate (This Sprint)

| Action                    | Effort  | Impact | Owner |
| ------------------------- | ------- | ------ | ----- |
| {fix critical flaky test} | {hours} | High   |       |
| {add P0 test for X}       | {hours} | High   |       |

### Short-term (This Milestone)

| Action                        | Effort | Impact | Owner |
| ----------------------------- | ------ | ------ | ----- |
| {refactor slow tests}         | {days} | Medium |       |
| {add integration tests for Y} | {days} | Medium |       |

### Long-term (Ongoing)

| Action                        | Effort  | Impact | Notes |
| ----------------------------- | ------- | ------ | ----- |
| {improve test infrastructure} | {weeks} | High   |       |
| {expand coverage to Z}        | {weeks} | Medium |       |

---

## Appendices

### Appendix A: Flaky Tests

| Test Name | Failure Rate | Failure Pattern | Fix Priority |
| --------- | ------------ | --------------- | ------------ |
|           |              |                 |              |

### Appendix B: Slow Tests

| Test Name | Duration | Type | Action                     |
| --------- | -------- | ---- | -------------------------- |
|           |          |      | {optimize/move to nightly} |

### Appendix C: Disabled Tests

| Test Name | Disabled Since | Reason | Action       |
| --------- | -------------- | ------ | ------------ |
|           |                |        | {fix/delete} |

### Appendix D: Technical Debt

| Item | Description | Effort | Priority |
| ---- | ----------- | ------ | -------- |
|      |             |        |          |

---

## Next Review

**Scheduled**: {DATE}
**Focus Areas**: {areas to pay attention to}
**Success Criteria**: {what would make next review "green"}
