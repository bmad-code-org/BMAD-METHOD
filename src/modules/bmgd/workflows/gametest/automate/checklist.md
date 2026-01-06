# Game Test Automation - Validation Checklist

---

## Prerequisites

- [ ] Test framework initialized
- [ ] Game engine detected
- [ ] Source code accessible
- [ ] Test scenarios available (optional)

---

## Analysis

- [ ] Testable systems identified
- [ ] Existing tests located
- [ ] Test patterns understood
- [ ] Coverage gaps identified

---

## Unit Tests

- [ ] Tests follow engine conventions
- [ ] Arrange-Act-Assert pattern used
- [ ] Setup/teardown implemented
- [ ] Parameterized tests where appropriate
- [ ] No external dependencies
- [ ] Tests are deterministic

---

## Integration Tests

- [ ] Scene/level tests created
- [ ] Component interaction tested
- [ ] Async handling correct (await/yield)
- [ ] Cleanup prevents leaks
- [ ] Tests run independently

---

## Smoke Tests

- [ ] Critical path covered
- [ ] Game launch test exists
- [ ] Core loop test exists
- [ ] Save/load test exists
- [ ] Tests complete quickly (< 5 min total)

---

## Code Quality

- [ ] Tests compile without errors
- [ ] No hardcoded values
- [ ] Assertions have messages
- [ ] Test names are descriptive
- [ ] No duplicate test logic

---

## Generated Files

- [ ] Files placed in correct directories
- [ ] Naming conventions followed
- [ ] Engine-specific syntax correct
- [ ] Imports/includes complete

---

## Documentation

- [ ] Automation summary created
- [ ] Test distribution documented
- [ ] Files listed
- [ ] Next steps provided

---

## Completion Criteria

- [ ] All requested tests generated
- [ ] Tests pass initial run
- [ ] No orphan objects after tests
- [ ] Summary report created

---

**Completed by:** {name}
**Date:** {date}
**Tests Generated:** {count}
