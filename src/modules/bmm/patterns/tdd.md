# Test-Driven Development Pattern

<overview>
TDD is about design quality, not coverage metrics. Writing tests first forces you to think about behavior before implementation.

**Principle:** If you can describe behavior as `expect(fn(input)).toBe(output)` before writing `fn`, TDD improves the result.
</overview>

<when_to_use>
## When TDD Improves Quality

**Use TDD for:**
- Business logic with defined inputs/outputs
- API endpoints with request/response contracts
- Data transformations, parsing, formatting
- Validation rules and constraints
- Algorithms with testable behavior

**Skip TDD for:**
- UI layout and styling
- Configuration changes
- Glue code connecting existing components
- One-off scripts
- Simple CRUD with no business logic
</when_to_use>

<red_green_refactor>
## Red-Green-Refactor Cycle

**RED - Write failing test:**
1. Create test describing expected behavior
2. Run test - it MUST fail
3. If test passes: feature exists or test is wrong

**GREEN - Implement to pass:**
1. Write minimal code to make test pass
2. No cleverness, no optimization - just make it work
3. Run test - it MUST pass

**REFACTOR (if needed):**
1. Clean up implementation
2. Run tests - MUST still pass
3. Only commit if changes made
</red_green_refactor>

<test_quality>
## Good Tests vs Bad Tests

**Test behavior, not implementation:**
```typescript
// GOOD: Tests observable behavior
expect(formatDate(new Date('2024-01-15'))).toBe('Jan 15, 2024')

// BAD: Tests implementation details
expect(formatDate).toHaveBeenCalledWith(expect.any(Date))
```

**One concept per test:**
```typescript
// GOOD: Separate tests
it('accepts valid email', () => { ... })
it('rejects empty email', () => { ... })
it('rejects malformed email', () => { ... })

// BAD: Multiple assertions
it('validates email', () => {
  expect(validate('test@example.com')).toBe(true)
  expect(validate('')).toBe(false)
  expect(validate('invalid')).toBe(false)
})
```

**Descriptive names:**
```typescript
// GOOD
it('returns null for invalid user ID')
it('should reject empty email')

// BAD
it('test1')
it('handles error')
it('works')
```
</test_quality>

<coverage_targets>
## Coverage Targets

- **90%+ line coverage** for new code
- **100% branch coverage** for critical paths (auth, payments)
- **Every error path** has at least one test
- **Edge cases** explicitly tested
</coverage_targets>
