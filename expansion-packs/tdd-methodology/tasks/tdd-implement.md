<!-- Powered by BMAD™ Core -->

# tdd-implement

Implement minimal code to make failing tests pass - the "Green" phase of TDD.

## Purpose

Write the simplest possible implementation that makes all failing tests pass. This is the "Green" phase of TDD where we focus on making tests pass with minimal, clean code.

## Prerequisites

- Story has failing tests (tdd.status: red)
- All tests fail for correct reasons (missing implementation, not bugs)
- Test runner is configured and working
- Dev agent has reviewed failing tests and acceptance criteria

## Inputs

```yaml
required:
  - story_id: '{epic}.{story}' # e.g., "1.3"
  - story_path: '{devStoryLocation}/{epic}.{story}.*.md' # Path from core-config.yaml
  - failing_tests: # List from story TDD metadata
      - id: test identifier
      - file_path: path to test file
      - status: failing
```

## Process

### 1. Review Failing Tests

Before writing any code:

- Read each failing test to understand expected behavior
- Identify the interfaces/classes/functions that need to be created
- Note expected inputs, outputs, and error conditions
- Understand the test's mocking strategy

### 2. Design Minimal Implementation

**TDD Green Phase Principles:**

- **Make it work first, then make it right**
- **Simplest thing that could possibly work**
- **No feature without a failing test**
- **Avoid premature abstraction**
- **Prefer duplication over wrong abstraction**

### 3. Implement Code

**Implementation Strategy:**

```yaml
approach: 1. Start with simplest happy path test
  2. Write minimal code to pass that test
  3. Run tests frequently (after each small change)
  4. Move to next failing test
  5. Repeat until all tests pass

avoid:
  - Adding features not covered by tests
  - Complex algorithms when simple ones suffice
  - Premature optimization
  - Over-engineering the solution
```

**Example Implementation Progression:**

```javascript
// First test: should return user with id
// Minimal implementation:
function createUser(userData) {
  return { id: 1, ...userData };
}

// Second test: should validate email format
// Expand implementation:
function createUser(userData) {
  if (!userData.email.includes('@')) {
    throw new Error('Invalid email format');
  }
  return { id: 1, ...userData };
}
```

### 4. Run Tests Continuously

**Test-Driven Workflow:**

1. Run specific failing test
2. Write minimal code to make it pass
3. Run that test again to confirm green
4. Run full test suite to ensure no regressions
5. Move to next failing test

**Test Execution Commands:**

```bash
# Run specific test file
npm test -- user-service.test.js
pytest tests/unit/test_user_service.py
go test ./services/user_test.go

# Run full test suite
npm test
pytest
go test ./...
```

### 5. Handle Edge Cases

Implement only edge cases that have corresponding tests:

- Input validation as tested
- Error conditions as specified in tests
- Boundary conditions covered by tests
- Nothing more, nothing less

### 6. Maintain Test-Code Traceability

**Commit Strategy:**

```bash
git add tests/ src/
git commit -m "GREEN: Implement user creation [UC-001, UC-002]"
```

Link implementation to specific test IDs in commits for traceability.

### 7. Update Story Metadata

Update TDD status to green:

```yaml
tdd:
  status: green
  cycle: 1
  tests:
    - id: 'UC-001'
      name: 'should create user with valid email'
      type: unit
      status: passing
      file_path: 'tests/unit/user-service.test.js'
    - id: 'UC-002'
      name: 'should reject user with invalid email'
      type: unit
      status: passing
      file_path: 'tests/unit/user-service.test.js'
```

## Output Requirements

### 1. Working Implementation

Create source files that:

- Make all failing tests pass
- Follow project coding standards
- Are minimal and focused
- Have clear, intention-revealing names

### 2. Test Execution Report

```bash
Running tests...
✅ UserService > should create user with valid email
✅ UserService > should reject user with invalid email

2 passing, 0 failing
```

### 3. Story File Updates

Append to TDD section:

```markdown
## TDD Progress

### Green Phase - Cycle 1

**Date:** {current_date}
**Agent:** James (Dev Agent)

**Implementation Summary:**

- Created UserService class with create() method
- Added email validation for @ symbol
- All tests now passing ✅

**Files Modified:**

- src/services/user-service.js (created)

**Test Results:**

- UC-001: should create user with valid email (PASSING ✅)
- UC-002: should reject user with invalid email (PASSING ✅)

**Next Step:** Review implementation for refactoring opportunities
```

## Implementation Guidelines

### Code Quality Standards

**During Green Phase:**

- **Readable:** Clear variable and function names
- **Simple:** Avoid complex logic when simple works
- **Testable:** Code structure supports the tests
- **Focused:** Each function has single responsibility

**Acceptable Technical Debt (to be addressed in Refactor phase):**

- Code duplication if it keeps tests green
- Hardcoded values if they make tests pass
- Simple algorithms even if inefficient
- Minimal error handling beyond what tests require

### Common Patterns

**Factory Functions:**

```javascript
function createUser(data) {
  // Minimal validation
  return { id: generateId(), ...data };
}
```

**Error Handling:**

```javascript
function validateEmail(email) {
  if (!email.includes('@')) {
    throw new Error('Invalid email');
  }
}
```

**State Management:**

```javascript
class UserService {
  constructor(database) {
    this.db = database; // Accept injected dependency
  }
}
```

## Error Handling

**If tests still fail after implementation:**

- Review test expectations vs actual implementation
- Check for typos in function/method names
- Verify correct imports/exports
- Ensure proper handling of async operations

**If tests pass unexpectedly without changes:**

- Implementation might already exist
- Test might be incorrect
- Review git status for unexpected changes

**If new tests start failing:**

- Implementation may have broken existing functionality
- Review change impact
- Fix regressions before continuing

## Anti-Patterns to Avoid

**Feature Creep:**

- Don't implement features without failing tests
- Don't add "obviously needed" functionality

**Premature Optimization:**

- Don't optimize for performance in green phase
- Focus on correctness first

**Over-Engineering:**

- Don't add abstraction layers without tests requiring them
- Avoid complex design patterns in initial implementation

## Completion Criteria

- [ ] All previously failing tests now pass
- [ ] No existing tests broken (regression check)
- [ ] Implementation is minimal and focused
- [ ] Code follows project standards
- [ ] Story TDD status updated to 'green'
- [ ] Files properly committed with test traceability
- [ ] Ready for refactor phase assessment

## Validation Commands

```bash
# Verify all tests pass
npm test
pytest
go test ./...
mvn test
dotnet test

# Check code quality (basic)
npm run lint
flake8 .
golint ./...
```

## Key Principles

- **Make it work:** Green tests are the only measure of success
- **Keep it simple:** Resist urge to make it elegant yet
- **One test at a time:** Focus on single failing test
- **Fast feedback:** Run tests frequently during development
- **No speculation:** Only implement what tests require
