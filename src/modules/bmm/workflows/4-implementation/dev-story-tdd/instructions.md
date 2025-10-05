# TDD Dev Story Implementation Instructions

## Overview

Execute story implementation using strict Test-Driven Development (TDD) methodology with RED-GREEN-REFACTOR cycles. Every line of production code must be justified by a failing test that proves the need for that code.

## Prerequisites

- Story must be in "Approved" status
- Story Context JSON/XML must be available
- Test framework must be configured in project
- RVTM (optional) for traceability

## TDD Cycle Process

### Phase 1: RED (Write Failing Test)

1. **Select Next Task/AC**
   - Choose an unimplemented acceptance criterion or task
   - Break it down to the smallest testable unit

2. **Write the Test First**
   - Create test that describes the expected behavior
   - Test should fail because the feature doesn't exist yet
   - Use descriptive test names that document intent
   - Example: `test_calculator_adds_two_positive_numbers()`

3. **Run Test to Confirm RED**
   - Execute the test suite
   - Verify the new test FAILS for the right reason
   - If test passes without implementation, the test is wrong

4. **Register Test with RVTM** (if enabled)
   - Link test to requirement/AC
   - Mark test status as "pending"

### Phase 2: GREEN (Make Test Pass)

1. **Write Minimal Implementation**
   - Add ONLY enough code to make the test pass
   - Don't add features not required by current test
   - Resist the urge to generalize prematurely

2. **Run Test Suite**
   - Execute all tests, not just the new one
   - Ensure new code doesn't break existing tests
   - All tests should now be GREEN

3. **Update RVTM Status**
   - Mark test as "passing"
   - Link implementation to requirement

### Phase 3: REFACTOR (Improve Design)

1. **Identify Improvement Opportunities**
   - Remove duplication (DRY)
   - Improve naming and clarity
   - Apply SOLID principles
   - Extract methods/classes if needed

2. **Make ONE Change at a Time**
   - Refactor in small, safe steps
   - Run tests after each change
   - If tests fail, revert immediately

3. **Keep Tests GREEN**
   - Never leave tests failing during refactor
   - Tests are the safety net for refactoring

## Workflow Execution Steps

### Step 1: Initialize Story Context

```
1. Load story markdown file
2. Validate status == "Approved"
3. Load Story Context (JSON/XML)
4. Pin context as authoritative source
```

### Step 2: Extract Implementation Tasks

```
1. Parse acceptance criteria from context
2. Identify testable tasks
3. Order by dependencies
4. Map tasks to test requirements
```

### Step 3: Execute TDD Cycles

For each task/AC:

```
REPEAT:
  RED:
    - Write failing test for next requirement
    - Run test to confirm failure
    - Commit test (message: "RED: Add test for [feature]")

  GREEN:
    - Write minimal code to pass test
    - Run all tests to confirm passing
    - Commit code (message: "GREEN: Implement [feature]")

  REFACTOR:
    - Improve code without changing behavior
    - Run tests after each change
    - Commit improvements (message: "REFACTOR: [improvement]")

UNTIL: All tasks complete
```

### Step 4: Final Validation

```
1. Run complete test suite
2. Calculate coverage metrics
3. Verify all ACs have tests
4. Update RVTM traceability matrix
```

### Step 5: Update Story

```
1. Mark implementation status
2. Document tests created
3. Record coverage percentage
4. Note any remaining work
```

## Key Principles

### Test-First Development

- **Never** write production code without a failing test
- Tests document the specification
- Tests drive the design

### Small Steps

- One test at a time
- One assertion per test (when possible)
- Frequent commits at each phase

### Continuous Validation

- Run tests frequently (every few minutes)
- Keep the feedback loop tight
- Fix failures immediately

### Quality Focus

- Tests are first-class code
- Maintain test readability
- Refactor tests too

## Common Patterns

### Test Structure (AAA)

```
Arrange - Set up test data and context
Act     - Execute the behavior being tested
Assert  - Verify the expected outcome
```

### Test Naming Convention

```
test_[unit]_[scenario]_[expected_result]
Example: test_calculator_dividing_by_zero_raises_error()
```

### Coverage Goals

- Unit tests: 80%+ coverage
- Integration tests: Critical paths
- E2E tests: Happy paths + key edge cases

## Error Handling

### When Tests Won't Go GREEN

1. Re-read the test - is it testing the right thing?
2. Check test setup - are preconditions correct?
3. Simplify implementation - remove complexity
4. Debug step-by-step - use print/log statements

### When Refactoring Breaks Tests

1. Immediately revert the last change
2. Make a smaller change
3. Consider if the test needs updating
4. Never "fix" tests to make them pass

## RVTM Integration

### Automatic Traceability

- Tests linked to requirements on creation
- Status updated after each test run
- Implementation linked when GREEN achieved
- Coverage metrics tracked continuously

### Traceability Benefits

- Stakeholders see real-time progress
- Requirements coverage is visible
- Test status indicates feature readiness
- Gaps are identified immediately

## Success Metrics

### Cycle Metrics

- Time per RED-GREEN-REFACTOR cycle
- Number of cycles per story point
- Test-to-code ratio

### Quality Metrics

- Test coverage percentage
- Test execution time
- Defect escape rate

### Process Metrics

- Requirements with tests: 100%
- Tests written first: 100%
- Refactoring frequency

## Example TDD Session

```python
# RED: Write failing test
def test_user_can_login_with_valid_credentials():
    user = User("alice", "secret123")
    result = login(user.username, user.password)
    assert result.success == True
    assert result.token is not None
# Run test - FAILS (login function doesn't exist)

# GREEN: Minimal implementation
def login(username, password):
    if username == "alice" and password == "secret123":
        return LoginResult(success=True, token="abc123")
    return LoginResult(success=False, token=None)
# Run test - PASSES

# REFACTOR: Improve design
def login(username, password):
    user = authenticate_user(username, password)
    if user:
        token = generate_token(user)
        return LoginResult(success=True, token=token)
    return LoginResult(success=False, token=None)
# Run test - Still PASSES
```

## Completion Criteria

Story implementation is complete when:

- [ ] All acceptance criteria have passing tests
- [ ] No tests are failing
- [ ] Coverage meets project standards
- [ ] Code has been refactored for quality
- [ ] RVTM shows 100% requirement coverage
- [ ] Story status updated to "Implemented"
