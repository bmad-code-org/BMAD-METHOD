<!-- Powered by BMAD™ Core -->

# TDD Refactor Phase Prompts

Instructions for Dev and QA agents when refactoring code while maintaining green tests in Test-Driven Development.

## Core Refactor Phase Mindset

**You are in TDD REFACTOR PHASE. Your mission is to improve code quality while keeping ALL tests green. Every change must preserve existing behavior.**

### Primary Objectives

1. **Preserve behavior** - External behavior must remain exactly the same
2. **Improve design** - Make code more readable, maintainable, and extensible
3. **Eliminate technical debt** - Remove duplication, improve naming, fix code smells
4. **Maintain test coverage** - All tests must stay green throughout
5. **Small steps** - Make incremental improvements with frequent test runs

## Refactoring Safety Rules

### The Golden Rule

**NEVER proceed with a refactoring step if tests are red.** Always revert and try smaller changes.

### Safe Refactoring Workflow

```yaml
refactoring_cycle:
  1. identify_smell: 'Find specific code smell to address'
  2. plan_change: 'Decide on minimal improvement step'
  3. run_tests: 'Ensure all tests are green before starting'
  4. make_change: 'Apply single, small refactoring'
  5. run_tests: 'Verify tests are still green'
  6. commit: 'Save progress if tests pass'
  7. repeat: 'Move to next improvement'

abort_conditions:
  - tests_turn_red: 'Immediately revert and try smaller step'
  - behavior_changes: 'Revert if external interface changes'
  - complexity_increases: 'Revert if code becomes harder to understand'
```

## Code Smells and Refactoring Techniques

### Duplication Elimination

**Before: Repeated validation logic**

```javascript
function createUser(data) {
  if (!data.email.includes('@')) {
    throw new Error('Invalid email format');
  }
  return { id: generateId(), ...data };
}

function updateUser(id, data) {
  if (!data.email.includes('@')) {
    throw new Error('Invalid email format');
  }
  return { id, ...data };
}
```

**After: Extract validation function**

```javascript
function validateEmail(email) {
  if (!email.includes('@')) {
    throw new Error('Invalid email format');
  }
}

function createUser(data) {
  validateEmail(data.email);
  return { id: generateId(), ...data };
}

function updateUser(id, data) {
  validateEmail(data.email);
  return { id, ...data };
}
```

### Long Method Refactoring

**Before: Method doing too much**

```javascript
function processUserRegistration(userData) {
  // Validation (5 lines)
  if (!userData.email.includes('@')) throw new Error('Invalid email');
  if (!userData.name || userData.name.trim().length === 0) throw new Error('Name required');
  if (userData.age < 18) throw new Error('Must be 18 or older');

  // Data transformation (4 lines)
  const user = {
    id: generateId(),
    email: userData.email.toLowerCase(),
    name: userData.name.trim(),
    age: userData.age,
  };

  // Business logic (3 lines)
  if (userData.age >= 65) {
    user.discountEligible = true;
  }

  return user;
}
```

**After: Extract methods**

```javascript
function validateUserData(userData) {
  if (!userData.email.includes('@')) throw new Error('Invalid email');
  if (!userData.name || userData.name.trim().length === 0) throw new Error('Name required');
  if (userData.age < 18) throw new Error('Must be 18 or older');
}

function normalizeUserData(userData) {
  return {
    id: generateId(),
    email: userData.email.toLowerCase(),
    name: userData.name.trim(),
    age: userData.age,
  };
}

function applyBusinessRules(user) {
  if (user.age >= 65) {
    user.discountEligible = true;
  }
  return user;
}

function processUserRegistration(userData) {
  validateUserData(userData);
  const user = normalizeUserData(userData);
  return applyBusinessRules(user);
}
```

### Magic Numbers and Constants

**Before: Magic numbers scattered**

```javascript
function calculateShipping(weight) {
  if (weight < 5) {
    return 4.99;
  } else if (weight < 20) {
    return 9.99;
  } else {
    return 19.99;
  }
}
```

**After: Named constants**

```javascript
const SHIPPING_RATES = {
  LIGHT_WEIGHT_THRESHOLD: 5,
  MEDIUM_WEIGHT_THRESHOLD: 20,
  LIGHT_SHIPPING_COST: 4.99,
  MEDIUM_SHIPPING_COST: 9.99,
  HEAVY_SHIPPING_COST: 19.99,
};

function calculateShipping(weight) {
  if (weight < SHIPPING_RATES.LIGHT_WEIGHT_THRESHOLD) {
    return SHIPPING_RATES.LIGHT_SHIPPING_COST;
  } else if (weight < SHIPPING_RATES.MEDIUM_WEIGHT_THRESHOLD) {
    return SHIPPING_RATES.MEDIUM_SHIPPING_COST;
  } else {
    return SHIPPING_RATES.HEAVY_SHIPPING_COST;
  }
}
```

### Variable Naming Improvements

**Before: Unclear names**

```javascript
function calc(u, p) {
  const t = u * p;
  const d = t * 0.1;
  return t - d;
}
```

**After: Intention-revealing names**

```javascript
function calculateNetPrice(unitPrice, quantity) {
  const totalPrice = unitPrice * quantity;
  const discount = totalPrice * 0.1;
  return totalPrice - discount;
}
```

## Refactoring Strategies by Code Smell

### Complex Conditionals

**Before: Nested conditions**

```javascript
function determineUserType(user) {
  if (user.age >= 18) {
    if (user.hasAccount) {
      if (user.isPremium) {
        return 'premium-member';
      } else {
        return 'basic-member';
      }
    } else {
      return 'guest-adult';
    }
  } else {
    return 'minor';
  }
}
```

**After: Guard clauses and early returns**

```javascript
function determineUserType(user) {
  if (user.age < 18) {
    return 'minor';
  }

  if (!user.hasAccount) {
    return 'guest-adult';
  }

  return user.isPremium ? 'premium-member' : 'basic-member';
}
```

### Large Classes (God Object)

**Before: Class doing too much**

```javascript
class UserManager {
  validateUser(data) {
    /* validation logic */
  }
  createUser(data) {
    /* creation logic */
  }
  sendWelcomeEmail(user) {
    /* email logic */
  }
  logUserActivity(user, action) {
    /* logging logic */
  }
  calculateUserStats(user) {
    /* analytics logic */
  }
}
```

**After: Single responsibility classes**

```javascript
class UserValidator {
  validate(data) {
    /* validation logic */
  }
}

class UserService {
  create(data) {
    /* creation logic */
  }
}

class EmailService {
  sendWelcome(user) {
    /* email logic */
  }
}

class ActivityLogger {
  log(user, action) {
    /* logging logic */
  }
}

class UserAnalytics {
  calculateStats(user) {
    /* analytics logic */
  }
}
```

## Collaborative Refactoring (Dev + QA)

### When to Involve QA Agent

**QA Agent should participate when:**

```yaml
qa_involvement_triggers:
  test_modification_needed:
    - 'Test expectations need updating'
    - 'New test cases discovered during refactoring'
    - 'Mock strategies need adjustment'

  coverage_assessment:
    - 'Refactoring exposes untested code paths'
    - 'New methods need test coverage'
    - 'Test organization needs improvement'

  design_validation:
    - 'Interface changes affect test structure'
    - 'Mocking strategy becomes complex'
    - 'Test maintainability concerns'
```

### Dev-QA Collaboration Workflow

```yaml
collaborative_steps:
  1. dev_identifies_refactoring: 'Dev spots code smell'
  2. assess_test_impact: 'Both agents review test implications'
  3. plan_refactoring: 'Agree on approach and steps'
  4. dev_refactors: 'Dev makes incremental changes'
  5. qa_validates_tests: 'QA ensures tests remain valid'
  6. both_review: 'Joint review of improved code and tests'
```

## Advanced Refactoring Patterns

### Extract Interface for Testability

**Before: Hard to test due to dependencies**

```javascript
class OrderService {
  constructor() {
    this.emailSender = new EmailSender();
    this.paymentProcessor = new PaymentProcessor();
  }

  processOrder(order) {
    const result = this.paymentProcessor.charge(order.total);
    this.emailSender.sendConfirmation(order.customerEmail);
    return result;
  }
}
```

**After: Dependency injection for testability**

```javascript
class OrderService {
  constructor(emailSender, paymentProcessor) {
    this.emailSender = emailSender;
    this.paymentProcessor = paymentProcessor;
  }

  processOrder(order) {
    const result = this.paymentProcessor.charge(order.total);
    this.emailSender.sendConfirmation(order.customerEmail);
    return result;
  }
}

// Usage in production:
const orderService = new OrderService(new EmailSender(), new PaymentProcessor());

// Usage in tests:
const mockEmail = { sendConfirmation: jest.fn() };
const mockPayment = { charge: jest.fn().mockReturnValue('success') };
const orderService = new OrderService(mockEmail, mockPayment);
```

### Replace Conditional with Polymorphism

**Before: Switch statement**

```javascript
function calculateArea(shape) {
  switch (shape.type) {
    case 'circle':
      return Math.PI * shape.radius * shape.radius;
    case 'rectangle':
      return shape.width * shape.height;
    case 'triangle':
      return 0.5 * shape.base * shape.height;
    default:
      throw new Error('Unknown shape type');
  }
}
```

**After: Polymorphic classes**

```javascript
class Circle {
  constructor(radius) {
    this.radius = radius;
  }

  calculateArea() {
    return Math.PI * this.radius * this.radius;
  }
}

class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  calculateArea() {
    return this.width * this.height;
  }
}

class Triangle {
  constructor(base, height) {
    this.base = base;
    this.height = height;
  }

  calculateArea() {
    return 0.5 * this.base * this.height;
  }
}
```

## Refactoring Safety Checks

### Before Each Refactoring Step

```bash
# 1. Ensure all tests are green
npm test
pytest
go test ./...

# 2. Consider impact
# - Will this change external interfaces?
# - Are there hidden dependencies?
# - Could this affect performance significantly?

# 3. Plan the smallest possible step
# - What's the minimal change that improves code?
# - Can this be broken into smaller steps?
```

### After Each Refactoring Step

```bash
# 1. Run tests immediately
npm test

# 2. If tests fail:
git checkout -- .  # Revert changes
# Plan smaller refactoring step

# 3. If tests pass:
git add .
git commit -m "REFACTOR: Extract validateEmail function [maintains UC-001, UC-002]"
```

## Refactoring Anti-Patterns

### Don't Change Behavior

```javascript
// Wrong: Changing logic during refactoring
function calculateDiscount(amount) {
  // Original: 10% discount
  return amount * 0.1;

  // Refactored: DON'T change the discount rate
  return amount * 0.15; // This changes behavior!
}

// Right: Only improve structure
const DISCOUNT_RATE = 0.1; // Extract constant
function calculateDiscount(amount) {
  return amount * DISCOUNT_RATE; // Same behavior
}
```

### Don't Add Features

```javascript
// Wrong: Adding features during refactoring
function validateUser(userData) {
  validateEmail(userData.email); // Existing
  validateName(userData.name); // Existing
  validateAge(userData.age); // DON'T add new validation
}

// Right: Only improve existing code
function validateUser(userData) {
  validateEmail(userData.email);
  validateName(userData.name);
  // Age validation needs its own failing test first
}
```

### Don't Make Large Changes

```javascript
// Wrong: Massive refactoring in one step
class UserService {
  // Completely rewrite entire class structure
}

// Right: Small, incremental improvements
class UserService {
  // Extract one method at a time
  // Rename one variable at a time
  // Improve one code smell at a time
}
```

## Refactor Phase Checklist

Before considering refactoring complete:

- [ ] **All tests remain green** - No test failures introduced
- [ ] **Code quality improved** - Measurable improvement in readability/maintainability
- [ ] **No behavior changes** - External behavior is identical
- [ ] **Technical debt reduced** - Specific code smells addressed
- [ ] **Small commits made** - Each improvement committed separately
- [ ] **Documentation updated** - Comments and docs reflect changes
- [ ] **Performance maintained** - No significant performance degradation
- [ ] **Story metadata updated** - Refactoring notes and improvements documented

## Success Indicators

**Refactoring is successful when:**

1. **All tests consistently pass** throughout the process
2. **Code is noticeably easier to read** and understand
3. **Duplication has been eliminated** or significantly reduced
4. **Method/class sizes are more reasonable** (functions < 15 lines)
5. **Variable and function names clearly express intent**
6. **Code complexity has decreased** (fewer nested conditions)
7. **Future changes will be easier** due to better structure

**Refactoring is complete when:**

- No obvious code smells remain in the story scope
- Code quality metrics show improvement
- Tests provide comprehensive safety net
- Ready for next TDD cycle or story completion

Remember: Refactoring is about improving design, not adding features. Keep tests green, make small changes, and focus on making the code better for the next developer!
