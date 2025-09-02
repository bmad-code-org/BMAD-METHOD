<!-- Powered by BMAD™ Core -->

# write-failing-tests

Write failing tests first to drive development using Test-Driven Development (TDD) Red phase.

## Purpose

Generate failing unit tests that describe expected behavior before implementation. This is the "Red" phase of TDD where we define what success looks like through tests that initially fail.

## Prerequisites

- Story status must be "InProgress" or "Ready"
- TDD must be enabled in core-config.yaml (`tdd.enabled: true`)
- Acceptance criteria are clearly defined
- Test runner is configured or auto-detected

## Inputs

```yaml
required:
  - story_id: '{epic}.{story}' # e.g., "1.3"
  - story_path: '{devStoryLocation}/{epic}.{story}.*.md' # Path from core-config.yaml
  - story_title: '{title}' # If missing, derive from story file H1
  - story_slug: '{slug}' # If missing, derive from title (lowercase, hyphenated)
```

## Process

### 1. Analyze Story Requirements

Read the story file and extract:

- Acceptance criteria (AC) that define success
- Business rules and constraints
- Edge cases and error conditions
- Data inputs and expected outputs

### 2. Design Test Strategy

For each acceptance criterion:

- Identify the smallest testable unit
- Choose appropriate test type (unit/integration/e2e)
- Plan test data and scenarios
- Consider mocking strategy for external dependencies

### 3. Detect/Configure Test Runner

```yaml
detection_order:
  - Check project files for known patterns
  - JavaScript: package.json dependencies (jest, vitest, mocha)
  - Python: requirements files (pytest, unittest)
  - Java: pom.xml, build.gradle (junit, testng)
  - Go: go.mod (built-in testing)
  - .NET: *.csproj (xunit, nunit, mstest)
  - Fallback: tdd.test_runner.custom_command from config
```

### 4. Write Failing Tests

**Test Quality Guidelines:**

- **Deterministic**: No random values, dates, or network calls
- **Isolated**: Each test is independent and can run alone
- **Fast**: Unit tests should run in milliseconds
- **Readable**: Test names describe the behavior being tested
- **Focused**: One assertion per test when possible

**Mocking Strategy:**

```yaml
mock_vs_fake_vs_stub:
  mock: 'Verify interactions (calls, parameters)'
  fake: 'Simplified working implementation'
  stub: 'Predefined responses to calls'

use_mocks_for:
  - External APIs and web services
  - Database connections
  - File system operations
  - Time-dependent operations
  - Random number generation
```

**Test Structure (Given-When-Then):**

```typescript
// Example structure
describe('UserService', () => {
  it('should create user with valid email', async () => {
    // Given (Arrange)
    const userData = { email: 'test@example.com', name: 'Test User' };
    const mockDb = jest.fn().mockResolvedValue({ id: 1, ...userData });

    // When (Act)
    const result = await userService.create(userData);

    // Then (Assert)
    expect(result).toEqual({ id: 1, ...userData });
    expect(mockDb).toHaveBeenCalledWith(userData);
  });
});
```

### 5. Create Test Files

**Naming Conventions:**

```yaml
patterns:
  javascript: '{module}.test.js' or '{module}.spec.js'
  python: 'test_{module}.py' or '{module}_test.py'
  java: '{Module}Test.java'
  go: '{module}_test.go'
  csharp: '{Module}Tests.cs'
```

**File Organization:**

```
tests/
├── unit/           # Fast, isolated tests
├── integration/    # Component interaction tests
└── e2e/           # End-to-end user journey tests
```

### 6. Verify Tests Fail

**Critical Step:** Run tests to ensure they fail for the RIGHT reason:

- ✅ Fail because functionality is not implemented
- ❌ Fail because of syntax errors, import issues, or test bugs

**Test Run Command:** Use auto-detected or configured test runner

### 7. Update Story Metadata

Update story file frontmatter:

```yaml
tdd:
  status: red
  cycle: 1
  tests:
    - id: 'UC-001'
      name: 'should create user with valid email'
      type: unit
      status: failing
      file_path: 'tests/unit/user-service.test.js'
    - id: 'UC-002'
      name: 'should reject user with invalid email'
      type: unit
      status: failing
      file_path: 'tests/unit/user-service.test.js'
```

## Output Requirements

### 1. Test Files Created

Generate test files with:

- Clear, descriptive test names
- Proper setup/teardown
- Mock configurations
- Expected assertions

### 2. Test Execution Report

```bash
Running tests...
❌ UserService > should create user with valid email
❌ UserService > should reject user with invalid email

2 failing, 0 passing
```

### 3. Story File Updates

Append to TDD section:

```markdown
## TDD Progress

### Red Phase - Cycle 1

**Date:** {current_date}
**Agent:** Quinn (QA Agent)

**Tests Written:**

- UC-001: should create user with valid email (FAILING ✅)
- UC-002: should reject user with invalid email (FAILING ✅)

**Test Files:**

- tests/unit/user-service.test.js

**Next Step:** Dev Agent to implement minimal code to make tests pass
```

## Constraints & Best Practices

### Constraints

- **Minimal Scope:** Write tests for the smallest possible feature slice
- **No Implementation:** Do not implement the actual functionality
- **External Dependencies:** Always mock external services, databases, APIs
- **Deterministic Data:** Use fixed test data, mock time/random functions
- **Fast Execution:** Unit tests must complete quickly (< 100ms each)

### Anti-Patterns to Avoid

- Testing implementation details instead of behavior
- Writing tests after the code is written
- Complex test setup that obscures intent
- Tests that depend on external systems
- Overly broad tests covering multiple behaviors

## Error Handling

**If tests pass unexpectedly:**

- Implementation may already exist
- Test may be testing wrong behavior
- HALT and clarify requirements

**If tests fail for wrong reasons:**

- Fix syntax/import errors
- Verify mocks are properly configured
- Check test runner configuration

**If no test runner detected:**

- Fallback to tdd.test_runner.custom_command
- If not configured, prompt user for test command
- Document setup in story notes

## Completion Criteria

- [ ] All planned tests are written and failing
- [ ] Tests fail for correct reasons (missing implementation)
- [ ] Story TDD metadata updated with test list
- [ ] Test files follow project conventions
- [ ] All external dependencies are properly mocked
- [ ] Tests run deterministically and quickly
- [ ] Ready to hand off to Dev Agent for implementation

## Key Principles

- **Fail First:** Tests must fail before any implementation
- **Describe Behavior:** Tests define what "done" looks like
- **Start Small:** Begin with simplest happy path scenario
- **Isolate Dependencies:** External systems should be mocked
- **Fast Feedback:** Tests should run quickly to enable rapid iteration
