# ATDD Checklist

Use this checklist for test generation in Step 4.
Tests are written BEFORE implementation (RED phase).

## Test Architecture

### File Organization
- [ ] Tests in appropriate directory (src/tests/{feature}/)
- [ ] E2E tests separate from unit tests
- [ ] Fixtures in dedicated fixtures/ directory
- [ ] Factories in dedicated factories/ directory

### Naming Conventions
- [ ] Test files: `{feature}.test.ts` or `{feature}.spec.ts`
- [ ] Factory files: `{entity}.factory.ts`
- [ ] Fixture files: `{feature}.fixture.ts`
- [ ] Descriptive test names matching AC

## Test Coverage

For EACH acceptance criterion:
- [ ] At least one test exists
- [ ] Happy path tested
- [ ] Error path tested
- [ ] Edge cases from validation covered

## Test Structure

### Given/When/Then Pattern
```typescript
test("Given X, When Y, Then Z", async () => {
  // Arrange (Given)
  // Act (When)
  // Assert (Then)
});
```

- [ ] Each section clearly separated
- [ ] Arrange sets up realistic state
- [ ] Act performs single action
- [ ] Assert checks specific outcome

### Assertions
- [ ] Specific assertions (not just "toBeTruthy")
- [ ] Error messages are helpful
- [ ] Multiple assertions when appropriate
- [ ] No flaky timing assertions

## Data Management

### Factories
- [ ] Use faker for realistic data
- [ ] Support partial overrides
- [ ] No hardcoded values
- [ ] Proper TypeScript types

```typescript
// Good
const user = createUser({ email: "test@example.com" });

// Bad
const user = { id: "123", email: "test@test.com", name: "Test" };
```

### Fixtures
- [ ] Auto-cleanup after tests
- [ ] Reusable across tests
- [ ] Proper TypeScript types
- [ ] No shared mutable state

### data-testid Attributes
- [ ] Document all required data-testids
- [ ] Naming convention: `{feature}-{element}`
- [ ] Unique within component
- [ ] Stable (not based on dynamic content)

## Test Levels

### E2E Tests (Playwright)
- [ ] Full user flows
- [ ] Network interception before navigation
- [ ] Wait for proper selectors (not timeouts)
- [ ] Screenshot on failure

### API Tests
- [ ] Direct server action calls
- [ ] Mock external services
- [ ] Test error responses
- [ ] Verify Result type usage

### Component Tests
- [ ] Isolated component rendering
- [ ] Props variations
- [ ] Event handling
- [ ] Accessibility (when applicable)

### Unit Tests
- [ ] Pure function testing
- [ ] Edge cases
- [ ] Error conditions
- [ ] Type checking

## RED Phase Verification

Before proceeding:
- [ ] Run all tests: `npm test -- --run`
- [ ] ALL tests FAIL (expected - nothing implemented)
- [ ] Failure reasons are clear (not cryptic errors)
- [ ] Test structure is correct

## ATDD Checklist Document

Create `atdd-checklist-{story_id}.md` with:
- [ ] List of test files created
- [ ] List of factories created
- [ ] List of fixtures created
- [ ] Required data-testid attributes table
- [ ] Implementation requirements for DEV
- [ ] Test status (all FAILING)

## Quality Gate

Ready for implementation when:
- [ ] Test for every AC
- [ ] All tests FAIL (red phase)
- [ ] Factories use faker
- [ ] Fixtures have cleanup
- [ ] data-testids documented
- [ ] ATDD checklist complete
