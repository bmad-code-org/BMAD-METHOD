<!-- Powered by BMAD™ Core -->

# tdd-refactor

Safely refactor code while keeping all tests green - the "Refactor" phase of TDD.

## Purpose

Improve code quality, eliminate duplication, and enhance design while maintaining all existing functionality. This is the "Refactor" phase of TDD where we make the code clean and maintainable.

## Prerequisites

- All tests are passing (tdd.status: green)
- Implementation is complete and functional
- Test suite provides safety net for refactoring
- Code follows basic project standards

## Inputs

```yaml
required:
  - story_id: '{epic}.{story}' # e.g., "1.3"
  - story_path: '{devStoryLocation}/{epic}.{story}.*.md' # Path from core-config.yaml
  - passing_tests: # All tests should be green
      - id: test identifier
      - status: passing
  - implementation_files: # Source files to potentially refactor
      - path: file path
      - purpose: what it does
```

## Process

### 1. Identify Refactoring Opportunities

**Code Smells to Look For:**

```yaml
common_smells:
  duplication:
    - Repeated code blocks
    - Similar logic in different places
    - Copy-paste patterns

  complexity:
    - Long methods/functions (>10-15 lines)
    - Too many parameters (>3-4)
    - Nested conditions (>2-3 levels)
    - Complex boolean expressions

  naming:
    - Unclear variable names
    - Non-descriptive function names
    - Inconsistent naming conventions

  structure:
    - God objects/classes doing too much
    - Primitive obsession
    - Feature envy (method using more from other class)
    - Long parameter lists
```

### 2. Plan Refactoring Steps

**Refactoring Strategy:**

- **One change at a time:** Make small, atomic improvements
- **Run tests after each change:** Ensure no functionality breaks
- **Commit frequently:** Create checkpoints for easy rollback
- **Improve design:** Move toward better architecture

**Common Refactoring Techniques:**

```yaml
extract_methods:
  when: 'Function is too long or doing multiple things'
  technique: 'Extract complex logic into named methods'

rename_variables:
  when: "Names don't clearly express intent"
  technique: 'Use intention-revealing names'

eliminate_duplication:
  when: 'Same code appears in multiple places'
  technique: 'Extract to shared function/method'

simplify_conditionals:
  when: 'Complex boolean logic is hard to understand'
  technique: 'Extract to well-named boolean methods'

introduce_constants:
  when: 'Magic numbers or strings appear repeatedly'
  technique: 'Create named constants'
```

### 3. Execute Refactoring

**Step-by-Step Process:**

1. **Choose smallest improvement**
2. **Make the change**
3. **Run all tests**
4. **Commit if green**
5. **Repeat**

**Example Refactoring Sequence:**

```javascript
// Before refactoring
function createUser(data) {
  if (!data.email.includes('@') || data.email.length < 5) {
    throw new Error('Invalid email format');
  }
  if (!data.name || data.name.trim().length === 0) {
    throw new Error('Name is required');
  }
  return {
    id: Math.floor(Math.random() * 1000000),
    ...data,
    createdAt: new Date().toISOString(),
  };
}

// After refactoring - Step 1: Extract validation
function validateEmail(email) {
  return email.includes('@') && email.length >= 5;
}

function validateName(name) {
  return name && name.trim().length > 0;
}

function createUser(data) {
  if (!validateEmail(data.email)) {
    throw new Error('Invalid email format');
  }
  if (!validateName(data.name)) {
    throw new Error('Name is required');
  }
  return {
    id: Math.floor(Math.random() * 1000000),
    ...data,
    createdAt: new Date().toISOString(),
  };
}

// After refactoring - Step 2: Extract ID generation
function generateUserId() {
  return Math.floor(Math.random() * 1000000);
}

function createUser(data) {
  if (!validateEmail(data.email)) {
    throw new Error('Invalid email format');
  }
  if (!validateName(data.name)) {
    throw new Error('Name is required');
  }
  return {
    id: generateUserId(),
    ...data,
    createdAt: new Date().toISOString(),
  };
}
```

### 4. Test After Each Change

**Critical Rule:** Never proceed without green tests

```bash
# Run tests after each refactoring step
npm test
pytest
go test ./...

# If tests fail:
# 1. Undo the change
# 2. Understand what broke
# 3. Try smaller refactoring
# 4. Fix tests if they need updating (rare)
```

### 5. Collaborate with QA Agent

**When to involve QA:**

- Tests need updating due to interface changes
- New test cases identified during refactoring
- Questions about test coverage adequacy
- Validation of refactoring safety

### 6. Update Story Documentation

Track refactoring progress:

```yaml
tdd:
  status: refactor # or done if complete
  cycle: 1
  refactoring_notes:
    - extracted_methods: ['validateEmail', 'validateName', 'generateUserId']
    - eliminated_duplication: 'Email validation logic'
    - improved_readability: 'Function names now express intent'
```

## Output Requirements

### 1. Improved Code Quality

**Measurable Improvements:**

- Reduced code duplication
- Clearer naming and structure
- Smaller, focused functions
- Better separation of concerns

### 2. Maintained Test Coverage

```bash
# All tests still passing
✅ UserService > should create user with valid email
✅ UserService > should reject user with invalid email
✅ UserService > should require valid name

3 passing, 0 failing
```

### 3. Story File Updates

Append to TDD section:

```markdown
## TDD Progress

### Refactor Phase - Cycle 1

**Date:** {current_date}
**Agents:** James (Dev) & Quinn (QA)

**Refactoring Completed:**

- ✅ Extracted validation functions for better readability
- ✅ Eliminated duplicate email validation logic
- ✅ Introduced generateUserId() for testability
- ✅ Simplified createUser() main logic

**Code Quality Improvements:**

- Function length reduced from 12 to 6 lines
- Three reusable validation functions created
- Magic numbers eliminated
- Test coverage maintained at 100%

**Files Modified:**

- src/services/user-service.js (refactored)

**All Tests Passing:** ✅

**Next Step:** Story ready for review or next TDD cycle
```

## Refactoring Guidelines

### Safe Refactoring Practices

**Always Safe:**

- Rename variables/functions
- Extract methods
- Inline temporary variables
- Replace magic numbers with constants

**Potentially Risky:**

- Changing method signatures
- Modifying class hierarchies
- Altering error handling
- Changing async/sync behavior

**Never Do During Refactor:**

- Add new features
- Change external behavior
- Remove existing functionality
- Skip running tests

### Code Quality Metrics

**Before/After Comparison:**

```yaml
metrics_to_track:
  cyclomatic_complexity: 'Lower is better'
  function_length: 'Shorter is generally better'
  duplication_percentage: 'Should decrease'
  test_coverage: 'Should maintain 100%'

acceptable_ranges:
  function_length: '5-15 lines for most functions'
  parameters: '0-4 parameters per function'
  nesting_depth: 'Maximum 3 levels'
```

## Advanced Refactoring Techniques

### Design Pattern Introduction

**When appropriate:**

- Template Method for algorithmic variations
- Strategy Pattern for behavior selection
- Factory Pattern for object creation
- Observer Pattern for event handling

**Caution:** Only introduce patterns if they simplify the code

### Architecture Improvements

```yaml
layering:
  - Separate business logic from presentation
  - Extract data access concerns
  - Isolate external dependencies

dependency_injection:
  - Make dependencies explicit
  - Enable easier testing
  - Improve modularity

error_handling:
  - Consistent error types
  - Meaningful error messages
  - Proper error propagation
```

## Error Handling

**If tests fail during refactoring:**

1. **Undo immediately** - Use git to revert
2. **Analyze the failure** - What assumption was wrong?
3. **Try smaller steps** - More atomic refactoring
4. **Consider test updates** - Only if interface must change

**If code becomes more complex:**

- Refactoring went wrong direction
- Revert and try different approach
- Consider if change is actually needed

## Completion Criteria

- [ ] All identified code smells addressed or documented
- [ ] All tests remain green throughout process
- [ ] Code is more readable and maintainable
- [ ] No new functionality added during refactoring
- [ ] Story TDD status updated appropriately
- [ ] Refactoring changes committed with clear messages
- [ ] Code quality metrics improved or maintained
- [ ] Ready for story completion or next TDD cycle

## Key Principles

- **Green Bar:** Never proceed with failing tests
- **Small Steps:** Make incremental improvements
- **Behavior Preservation:** External behavior must remain identical
- **Frequent Commits:** Create rollback points
- **Test First:** Let tests guide refactoring safety
- **Collaborative:** Work with QA when test updates needed
