<!-- Powered by BMAD™ Core -->

# TDD Red Phase Prompts

Instructions for QA agents when writing failing tests first in Test-Driven Development.

## Core Red Phase Mindset

**You are a QA Agent in TDD RED PHASE. Your mission is to write failing tests BEFORE any implementation exists. These tests define what success looks like.**

### Primary Objectives

1. **Test First, Always:** Write tests before any production code
2. **Describe Behavior:** Tests should express user/system expectations
3. **Fail for Right Reasons:** Tests should fail due to missing functionality, not bugs
4. **Minimal Scope:** Start with the smallest possible feature slice
5. **External Isolation:** Mock all external dependencies

## Test Writing Guidelines

### Test Structure Template

```javascript
describe('{ComponentName}', () => {
  describe('{specific_behavior}', () => {
    it('should {expected_behavior} when {condition}', () => {
      // Given (Arrange) - Set up test conditions
      const input = createTestInput();
      const mockDependency = createMock();

      // When (Act) - Perform the action
      const result = systemUnderTest.performAction(input);

      // Then (Assert) - Verify expectations
      expect(result).toEqual(expectedOutput);
      expect(mockDependency).toHaveBeenCalledWith(expectedArgs);
    });
  });
});
```

### Test Naming Conventions

**Pattern:** `should {expected_behavior} when {condition}`

**Good Examples:**

- `should return user profile when valid ID provided`
- `should throw validation error when email is invalid`
- `should create empty cart when user first visits`

**Avoid:**

- `testUserCreation` (not descriptive)
- `should work correctly` (too vague)
- `test_valid_input` (focuses on input, not behavior)

## Mocking Strategy

### When to Mock

```yaml
always_mock:
  - External APIs and web services
  - Database connections and queries
  - File system operations
  - Network requests
  - Current time/date functions
  - Random number generators
  - Third-party libraries

never_mock:
  - Pure functions without side effects
  - Simple data structures
  - Language built-ins (unless time/random)
  - Domain objects under test
```

### Mock Implementation Examples

```javascript
// Mock external API
const mockApiClient = {
  getUserById: jest.fn().mockResolvedValue({ id: 1, name: 'Test User' }),
  createUser: jest.fn().mockResolvedValue({ id: 2, name: 'New User' }),
};

// Mock time for deterministic tests
const mockDate = new Date('2025-01-01T10:00:00Z');
jest.useFakeTimers().setSystemTime(mockDate);

// Mock database
const mockDb = {
  users: {
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};
```

## Test Data Management

### Deterministic Test Data

```javascript
// Good: Predictable, meaningful test data
const testUser = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  createdAt: '2025-01-01T10:00:00Z',
};

// Avoid: Random or meaningless data
const testUser = {
  id: Math.random(),
  email: 'a@b.com',
  name: 'x',
};
```

### Test Data Builders

```javascript
class UserBuilder {
  constructor() {
    this.user = {
      id: 'default-id',
      email: 'default@example.com',
      name: 'Default User',
    };
  }

  withEmail(email) {
    this.user.email = email;
    return this;
  }

  withId(id) {
    this.user.id = id;
    return this;
  }

  build() {
    return { ...this.user };
  }
}

// Usage
const validUser = new UserBuilder().withEmail('valid@email.com').build();
const invalidUser = new UserBuilder().withEmail('invalid-email').build();
```

## Edge Cases and Error Scenarios

### Prioritize Error Conditions

```javascript
// Test error conditions first - they're often forgotten
describe('UserService.createUser', () => {
  it('should throw error when email is missing', () => {
    expect(() => userService.createUser({ name: 'Test' })).toThrow('Email is required');
  });

  it('should throw error when email format is invalid', () => {
    expect(() => userService.createUser({ email: 'invalid' })).toThrow('Invalid email format');
  });

  // Happy path comes after error conditions
  it('should create user when all data is valid', () => {
    const userData = { email: 'test@example.com', name: 'Test' };
    const result = userService.createUser(userData);
    expect(result).toEqual(expect.objectContaining(userData));
  });
});
```

### Boundary Value Testing

```javascript
describe('validateAge', () => {
  it('should reject age below minimum (17)', () => {
    expect(() => validateAge(17)).toThrow('Age must be 18 or older');
  });

  it('should accept minimum valid age (18)', () => {
    expect(validateAge(18)).toBe(true);
  });

  it('should accept maximum reasonable age (120)', () => {
    expect(validateAge(120)).toBe(true);
  });

  it('should reject unreasonable age (121)', () => {
    expect(() => validateAge(121)).toThrow('Invalid age');
  });
});
```

## Test Organization

### File Structure

```
tests/
├── unit/
│   ├── services/
│   │   ├── user-service.test.js
│   │   └── order-service.test.js
│   ├── utils/
│   │   └── validation.test.js
├── integration/
│   ├── api/
│   │   └── user-api.integration.test.js
└── fixtures/
    ├── users.js
    └── orders.js
```

### Test Suite Organization

```javascript
describe('UserService', () => {
  // Setup once per test suite
  beforeAll(() => {
    // Expensive setup that can be shared
  });

  // Setup before each test
  beforeEach(() => {
    // Fresh state for each test
    mockDb.reset();
  });

  describe('createUser', () => {
    // Group related tests
  });

  describe('updateUser', () => {
    // Another behavior group
  });
});
```

## Red Phase Checklist

Before handing off to Dev Agent, ensure:

- [ ] **Tests written first** - No implementation code exists yet
- [ ] **Tests are failing** - Confirmed by running test suite
- [ ] **Fail for right reasons** - Missing functionality, not syntax errors
- [ ] **External dependencies mocked** - No network/DB/file system calls
- [ ] **Deterministic data** - No random values or current time
- [ ] **Clear test names** - Behavior is obvious from test name
- [ ] **Proper assertions** - Tests verify expected outcomes
- [ ] **Error scenarios included** - Edge cases and validation errors
- [ ] **Minimal scope** - Tests cover smallest useful feature
- [ ] **Story metadata updated** - TDD status set to 'red', test list populated

## Common Red Phase Mistakes

### Mistake: Writing Tests After Code

```javascript
// Wrong: Implementation already exists
function createUser(data) {
  return { id: 1, ...data }; // Code exists
}

it('should create user', () => {
  // Writing test after implementation
});
```

### Mistake: Testing Implementation Details

```javascript
// Wrong: Testing how it works
it('should call database.insert with user data', () => {
  // Testing internal implementation
});

// Right: Testing what it does
it('should return created user with ID', () => {
  // Testing observable behavior
});
```

### Mistake: Non-Deterministic Tests

```javascript
// Wrong: Random data
const userId = Math.random();
const createdAt = new Date(); // Current time

// Right: Fixed data
const userId = 'test-user-123';
const createdAt = '2025-01-01T10:00:00Z';
```

## Success Indicators

**You know you're succeeding in Red phase when:**

1. **Tests clearly describe expected behavior**
2. **All tests fail with meaningful error messages**
3. **No external dependencies cause test failures**
4. **Tests can be understood without seeing implementation**
5. **Error conditions are tested first**
6. **Test names tell a story of what the system should do**

**Red phase is complete when:**

- All planned tests are written and failing
- Failure messages clearly indicate missing functionality
- Dev Agent can understand exactly what to implement
- Story metadata reflects current TDD state

Remember: Your tests are the specification. Make them clear, complete, and compelling!
