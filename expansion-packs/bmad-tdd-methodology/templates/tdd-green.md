<!-- Powered by BMAD™ Core -->

# TDD Green Phase Prompts

Instructions for Dev agents when implementing minimal code to make tests pass in Test-Driven Development.

## Core Green Phase Mindset

**You are a Dev Agent in TDD GREEN PHASE. Your mission is to write the SIMPLEST code that makes all failing tests pass. Resist the urge to be clever - be minimal.**

### Primary Objectives

1. **Make it work first** - Focus on making tests pass, not perfect design
2. **Minimal implementation** - Write only what's needed for green tests
3. **No feature creep** - Don't add functionality without failing tests
4. **Fast feedback** - Run tests frequently during implementation
5. **Traceability** - Link implementation directly to test requirements

## Implementation Strategy

### The Three Rules of TDD (Uncle Bob)

1. **Don't write production code** unless it makes a failing test pass
2. **Don't write more test code** than necessary to demonstrate failure (QA phase)
3. **Don't write more production code** than necessary to make failing tests pass

### Green Phase Workflow

```yaml
workflow:
  1. read_failing_test: 'Understand what the test expects'
  2. write_minimal_code: 'Simplest implementation to pass'
  3. run_test: 'Verify this specific test passes'
  4. run_all_tests: 'Ensure no regressions'
  5. repeat: 'Move to next failing test'

never_skip:
  - running_tests_after_each_change
  - checking_for_regressions
  - committing_when_green
```

### Minimal Implementation Examples

**Example 1: Start with Hardcoded Values**

```javascript
// Test expects:
it('should return user with ID when creating user', () => {
  const result = userService.createUser({ name: 'Test' });
  expect(result).toEqual({ id: 1, name: 'Test' });
});

// Minimal implementation (hardcode first):
function createUser(userData) {
  return { id: 1, name: userData.name };
}

// Test expects different ID:
it('should return different ID for second user', () => {
  userService.createUser({ name: 'First' });
  const result = userService.createUser({ name: 'Second' });
  expect(result.id).toBe(2);
});

// Now make it dynamic:
let nextId = 1;
function createUser(userData) {
  return { id: nextId++, name: userData.name };
}
```

**Example 2: Validation Implementation**

```javascript
// Test expects validation error:
it('should throw error when email is invalid', () => {
  expect(() => createUser({ email: 'invalid' })).toThrow('Invalid email format');
});

// Minimal validation:
function createUser(userData) {
  if (!userData.email.includes('@')) {
    throw new Error('Invalid email format');
  }
  return { id: nextId++, ...userData };
}
```

## Avoiding Feature Creep

### What NOT to Add (Yet)

```javascript
// Don't add these without failing tests:

// ❌ Comprehensive validation
function createUser(data) {
  if (!data.email || !data.email.includes('@')) throw new Error('Invalid email');
  if (!data.name || data.name.trim().length === 0) throw new Error('Name required');
  if (data.age && (data.age < 0 || data.age > 150)) throw new Error('Invalid age');
  // ... only add validation that has failing tests
}

// ❌ Performance optimizations
function createUser(data) {
  // Don't add caching, connection pooling, etc. without tests
}

// ❌ Future features
function createUser(data) {
  // Don't add roles, permissions, etc. unless tests require it
}
```

### What TO Add

```javascript
// ✅ Only what tests require:
function createUser(data) {
  // Only validate what failing tests specify
  if (!data.email.includes('@')) {
    throw new Error('Invalid email format');
  }

  // Only return what tests expect
  return { id: generateId(), ...data };
}
```

## Test-Code Traceability

### Linking Implementation to Tests

```javascript
// Test ID: UC-001
it('should create user with valid email', () => {
  const result = createUser({ email: 'test@example.com', name: 'Test' });
  expect(result).toHaveProperty('id');
});

// Implementation comment linking to test:
function createUser(data) {
  // UC-001: Return user with generated ID
  return {
    id: generateId(),
    ...data,
  };
}
```

### Commit Messages with Test References

```bash
# Good commit messages:
git commit -m "GREEN: Implement user creation [UC-001, UC-002]"
git commit -m "GREEN: Add email validation for createUser [UC-003]"
git commit -m "GREEN: Handle edge case for empty name [UC-004]"

# Avoid vague messages:
git commit -m "Fixed user service"
git commit -m "Added validation"
```

## Handling Different Test Types

### Unit Tests - Pure Logic

```javascript
// Test: Calculate tax for purchase
it('should calculate 10% tax on purchase amount', () => {
  expect(calculateTax(100)).toBe(10);
});

// Minimal implementation:
function calculateTax(amount) {
  return amount * 0.1;
}
```

### Integration Tests - Component Interaction

```javascript
// Test: Service uses injected database
it('should save user to database when created', async () => {
  const mockDb = { save: jest.fn().mockResolvedValue({ id: 1 }) };
  const service = new UserService(mockDb);

  await service.createUser({ name: 'Test' });

  expect(mockDb.save).toHaveBeenCalledWith({ name: 'Test' });
});

// Minimal implementation:
class UserService {
  constructor(database) {
    this.db = database;
  }

  async createUser(userData) {
    return await this.db.save(userData);
  }
}
```

### Error Handling Tests

```javascript
// Test: Handle database connection failure
it('should throw service error when database is unavailable', async () => {
  const mockDb = { save: jest.fn().mockRejectedValue(new Error('DB down')) };
  const service = new UserService(mockDb);

  await expect(service.createUser({ name: 'Test' }))
    .rejects.toThrow('Service temporarily unavailable');
});

// Minimal error handling:
async createUser(userData) {
  try {
    return await this.db.save(userData);
  } catch (error) {
    throw new Error('Service temporarily unavailable');
  }
}
```

## Fast Feedback Loop

### Test Execution Strategy

```bash
# Run single test file while implementing:
npm test -- user-service.test.js --watch
pytest tests/unit/test_user_service.py -v
go test ./services -run TestUserService

# Run full suite after each feature:
npm test
pytest
go test ./...
```

### IDE Integration

```yaml
recommended_setup:
  - test_runner_integration: 'Tests run on save'
  - live_feedback: 'Immediate pass/fail indicators'
  - coverage_display: 'Show which lines are tested'
  - failure_details: 'Quick access to error messages'
```

## Common Green Phase Mistakes

### Mistake: Over-Implementation

```javascript
// Wrong: Adding features without tests
function createUser(data) {
  // No test requires password hashing yet
  const hashedPassword = hashPassword(data.password);

  // No test requires audit logging yet
  auditLog.record('user_created', data);

  // Only implement what tests require
  return { id: generateId(), ...data };
}
```

### Mistake: Premature Abstraction

```javascript
// Wrong: Creating abstractions too early
class UserValidatorFactory {
  static createValidator(type) {
    // Complex factory pattern without tests requiring it
  }
}

// Right: Keep it simple until tests demand complexity
function createUser(data) {
  if (!data.email.includes('@')) {
    throw new Error('Invalid email');
  }
  return { id: generateId(), ...data };
}
```

### Mistake: Not Running Tests Frequently

```javascript
// Wrong: Writing lots of code before testing
function createUser(data) {
  // 20 lines of code without running tests
  // Many assumptions about what tests expect
}

// Right: Small changes, frequent test runs
function createUser(data) {
  return { id: 1, ...data }; // Run test - passes
}

// Then add next failing test's requirement:
function createUser(data) {
  if (!data.email.includes('@')) throw new Error('Invalid email');
  return { id: 1, ...data }; // Run test - passes
}
```

## Quality Standards in Green Phase

### Acceptable Technical Debt

```javascript
// OK during Green phase (will fix in Refactor):
function createUser(data) {
  // Hardcoded values
  const id = 1;

  // Duplicated validation logic
  if (!data.email.includes('@')) throw new Error('Invalid email');
  if (!data.name || data.name.trim() === '') throw new Error('Name required');

  // Simple algorithm even if inefficient
  return { id: Math.floor(Math.random() * 1000000), ...data };
}
```

### Minimum Standards (Even in Green)

```javascript
// Always maintain:
function createUser(data) {
  // Clear variable names
  const userData = { ...data };
  const userId = generateId();

  // Proper error messages
  if (!userData.email.includes('@')) {
    throw new Error('Invalid email format');
  }

  // Return expected structure
  return { id: userId, ...userData };
}
```

## Green Phase Checklist

Before moving to Refactor phase, ensure:

- [ ] **All tests passing** - No failing tests remain
- [ ] **No regressions** - Previously passing tests still pass
- [ ] **Minimal implementation** - Only code needed for tests
- [ ] **Clear test traceability** - Implementation addresses specific tests
- [ ] **No feature creep** - No functionality without tests
- [ ] **Basic quality standards** - Code is readable and correct
- [ ] **Frequent commits** - Changes committed with test references
- [ ] **Story metadata updated** - TDD status set to 'green'

## Success Indicators

**You know you're succeeding in Green phase when:**

1. **All tests consistently pass**
2. **Implementation is obviously minimal**
3. **Each code block addresses specific test requirements**
4. **No functionality exists without corresponding tests**
5. **Tests run quickly and reliably**
6. **Code changes are small and focused**

**Green phase is complete when:**

- Zero failing tests
- Implementation covers all test scenarios
- Code is minimal but correct
- Ready for refactoring improvements

Remember: Green phase is about making it work, not making it perfect. Resist the urge to optimize or add features - that comes in the Refactor phase!
