---
name: 'step-03-write-tests'
description: 'Write comprehensive tests BEFORE implementation (TDD approach)'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-03-write-tests.md'
stateFile: '{state_file}'
storyFile: '{story_file}'

# Next step
nextStep: '{workflow_path}/steps/step-04-implement.md'
---

# Step 3: Write Tests (TDD Approach)

**Goal:** Write comprehensive tests that validate story acceptance criteria BEFORE writing implementation code.

## Why Test-First?

1. **Clear requirements**: Writing tests forces clarity about what "done" means
2. **Better design**: TDD leads to more testable, modular code
3. **Confidence**: Know immediately when implementation is complete
4. **Regression safety**: Tests catch future breakage

## Principles

- **Test acceptance criteria**: Each AC should have corresponding tests
- **Test behavior, not implementation**: Focus on what, not how
- **Red-Green-Refactor**: Tests should fail initially (red), then pass when implemented (green)
- **Comprehensive coverage**: Unit tests, integration tests, and E2E tests as needed

---

## Process

### 1. Analyze Story Requirements

```
Read {storyFile} completely.

Extract:
- All Acceptance Criteria
- All Tasks and Subtasks
- All Files in File List
- Definition of Done requirements
```

### 2. Determine Test Strategy

For each acceptance criterion, determine:
```
Testing Level:
- Unit tests: For individual functions/components
- Integration tests: For component interactions
- E2E tests: For full user workflows

Test Framework:
- Jest (JavaScript/TypeScript)
- PyTest (Python)
- xUnit (C#/.NET)
- JUnit (Java)
- Etc. based on project stack
```

### 3. Write Test Stubs

Create test files FIRST (before implementation):

```bash
Example for React component:
__tests__/components/UserDashboard.test.tsx

Example for API endpoint:
__tests__/api/users.test.ts

Example for service:
__tests__/services/auth.test.ts
```

### 4. Write Test Cases

For each acceptance criterion:

```typescript
// Example: React component test
describe('UserDashboard', () => {
  describe('AC1: Display user profile information', () => {
    it('should render user name', () => {
      render(<UserDashboard user={mockUser} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should render user email', () => {
      render(<UserDashboard user={mockUser} />);
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('should render user avatar', () => {
      render(<UserDashboard user={mockUser} />);
      expect(screen.getByAltText('User avatar')).toBeInTheDocument();
    });
  });

  describe('AC2: Allow user to edit profile', () => {
    it('should show edit button when not in edit mode', () => {
      render(<UserDashboard user={mockUser} />);
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });

    it('should enable edit mode when edit button clicked', () => {
      render(<UserDashboard user={mockUser} />);
      fireEvent.click(screen.getByRole('button', { name: /edit/i }));
      expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
    });

    it('should save changes when save button clicked', async () => {
      const onSave = vi.fn();
      render(<UserDashboard user={mockUser} onSave={onSave} />);

      fireEvent.click(screen.getByRole('button', { name: /edit/i }));
      fireEvent.change(screen.getByRole('textbox', { name: /name/i }), {
        target: { value: 'Jane Doe' }
      });
      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith({ ...mockUser, name: 'Jane Doe' });
      });
    });
  });
});
```

### 5. Verify Tests Fail (Red Phase)

```bash
# Run tests - they SHOULD fail because implementation doesn't exist yet
npm test

# Expected output:
# ❌ FAIL  __tests__/components/UserDashboard.test.tsx
#   UserDashboard
#     AC1: Display user profile information
#       ✕ should render user name (5ms)
#       ✕ should render user email (3ms)
#       ✕ should render user avatar (2ms)
#
# This is GOOD! Tests failing = requirements are clear
```

**If tests pass unexpectedly:**
```
⚠️ WARNING: Some tests are passing before implementation!

This means either:
1. Functionality already exists (brownfield - verify and document)
2. Tests are not actually testing the new requirements
3. Tests have mocking issues (testing mocks instead of real code)

Review and fix before proceeding.
```

### 6. Document Test Coverage

Create test coverage report:
```yaml
Test Coverage Summary:
  Acceptance Criteria: {total_ac_count}
  Acceptance Criteria with Tests: {tested_ac_count}
  Coverage: {coverage_percentage}%

  Tasks: {total_task_count}
  Tasks with Tests: {tested_task_count}
  Coverage: {task_coverage_percentage}%

Test Files Created:
  - {test_file_1}
  - {test_file_2}
  - {test_file_3}

Total Test Cases: {test_case_count}
```

### 7. Commit Tests

```bash
git add {test_files}
git commit -m "test(story-{story_id}): add tests for {story_title}

Write comprehensive tests for all acceptance criteria:
{list_of_acs}

Test coverage:
- {tested_ac_count}/{total_ac_count} ACs covered
- {test_case_count} test cases
- Unit tests: {unit_test_count}
- Integration tests: {integration_test_count}
- E2E tests: {e2e_test_count}

Tests currently failing (red phase) - expected behavior.
Will implement functionality in next step."
```

### 8. Update State

```yaml
# Update {stateFile}
current_step: 3
tests_written: true
test_files: [{test_file_list}]
test_coverage: {coverage_percentage}%
tests_status: "failing (red phase - expected)"
ready_for_implementation: true
```

---

## Quality Checks

Before proceeding to implementation:

✅ **All acceptance criteria have corresponding tests**
✅ **Tests are comprehensive (happy path + edge cases + error cases)**
✅ **Tests follow project testing conventions**
✅ **Tests are isolated and don't depend on each other**
✅ **Tests have clear, descriptive names**
✅ **Mock data is realistic and well-organized**
✅ **Tests are failing for the right reasons (not implemented yet)**

---

## Skip Conditions

This step can be skipped if:
- Complexity level = "micro" AND tasks ≤ 2
- Story is documentation-only (no code changes)
- Story is pure refactoring with existing comprehensive tests

---

## Next Step

Proceed to **Step 4: Implement** ({nextStep})

Now that tests are written and failing (red phase), implement the functionality to make them pass (green phase).
