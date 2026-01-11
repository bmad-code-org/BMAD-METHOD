---
name: 'step-04-atdd'
description: 'Generate failing acceptance tests before implementation (RED phase)'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/story-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-04-atdd.md'
nextStepFile: '{workflow_path}/steps/step-05-implement.md'
checklist: '{workflow_path}/checklists/atdd.md'

# Role Switch
role: tea
agentFile: '{project-root}/_bmad/bmm/agents/tea.md'
---

# Step 4: ATDD - Acceptance Test-Driven Development

## ROLE SWITCH

**Switching to TEA (Test Engineering Architect) perspective.**

You are now the Test Engineering Architect. Your expertise:
- Test strategy and design
- Playwright and Vitest patterns
- Data factories and fixtures
- Test-first development methodology

## STEP GOAL

Generate FAILING acceptance tests BEFORE implementation (RED phase):
1. Research test patterns for the technology stack
2. Analyze each acceptance criterion
3. Determine appropriate test level (E2E, API, Component, Unit)
4. Write tests in Given/When/Then format
5. Create data factories and fixtures
6. Verify tests FAIL (they should - nothing is implemented yet)
7. Generate implementation checklist for DEV

## MANDATORY EXECUTION RULES

### ATDD Principles

- **TESTS FIRST** - Write tests before any implementation
- **TESTS MUST FAIL** - If tests pass, something is wrong
- **ONE AC = ONE TEST** (minimum) - More for complex scenarios
- **REALISTIC DATA** - Use factories, not hardcoded values

### Test Architecture Rules

- Use `data-testid` selectors for stability
- Network-first pattern (route interception before navigation)
- Auto-cleanup fixtures
- No flaky timing-based assertions

## EXECUTION SEQUENCE

### 1. Research Test Patterns

Use MCP tools:

```
mcp__exa__web_search_exa:
  query: "playwright acceptance test best practices Next.js TypeScript 2025"

mcp__exa__get_code_context_exa:
  query: "vitest playwright test fixtures factories faker patterns"
```

**Extract:**
- Current best practices for Next.js testing
- Fixture and factory patterns
- Common pitfalls to avoid

### 2. Analyze Acceptance Criteria

From cached story file, for EACH acceptance criterion:

```yaml
ac_analysis:
  - ac_id: AC1
    title: "{ac_title}"
    given: "{given clause}"
    when: "{when clause}"
    then: "{then clause}"
    test_level: E2E|API|Component|Unit
    test_file: "{proposed test file path}"
    requires_fixtures: [list]
    requires_factories: [list]
    data_testids_needed: [list]
```

### 3. Determine Test Levels

For each AC, determine appropriate level:

| Level | When to Use |
|-------|-------------|
| E2E | Full user flows, UI interactions |
| API | Server actions, API endpoints |
| Component | React component behavior |
| Unit | Pure business logic, utilities |

### 4. Create Data Factories

For each entity needed in tests:

```typescript
// src/tests/factories/{entity}.factory.ts
import { faker } from "@faker-js/faker";

export function create{Entity}(overrides: Partial<{Entity}> = {}): {Entity} {
  return {
    id: faker.string.uuid(),
    // ... realistic fake data
    ...overrides,
  };
}
```

### 5. Create Test Fixtures

For each test setup pattern:

```typescript
// src/tests/fixtures/{feature}.fixture.ts
import { test as base } from "vitest";
// or for E2E:
import { test as base } from "@playwright/test";

export const test = base.extend<{
  // fixture types
}>({
  // fixture implementations with auto-cleanup
});
```

### 6. Write Acceptance Tests

For EACH acceptance criterion:

```typescript
// src/tests/{appropriate-dir}/{feature}.test.ts

describe("AC{N}: {ac_title}", () => {
  test("Given {given}, When {when}, Then {then}", async () => {
    // Arrange (Given)
    const data = createTestData();

    // Act (When)
    const result = await performAction(data);

    // Assert (Then)
    expect(result).toMatchExpectedOutcome();
  });

  // Additional scenarios from story
  test("Edge case: {scenario}", async () => {
    // ...
  });
});
```

### 7. Document Required data-testids

Create list of data-testids that DEV must implement:

```markdown
## Required data-testid Attributes

| Element | data-testid | Purpose |
|---------|-------------|---------|
| Submit button | submit-{feature} | Test form submission |
| Error message | error-{feature} | Verify error display |
| ... | ... | ... |
```

### 8. Verify Tests FAIL

Run tests and verify they fail:

```bash
npm test -- --run {test-file}
```

**Expected:** All tests should FAIL (RED phase)
- "Cannot find element with data-testid"
- "Function not implemented"
- "Route not found"

**If tests PASS:** Something is wrong - investigate

### 9. Create ATDD Checklist

Create: `{sprint_artifacts}/atdd-checklist-{story_id}.md`

```markdown
# ATDD Checklist for Story {story_id}

## Test Files Created
- [ ] {test_file_1}
- [ ] {test_file_2}

## Factories Created
- [ ] {factory_1}
- [ ] {factory_2}

## Fixtures Created
- [ ] {fixture_1}

## Implementation Requirements for DEV

### Required data-testid Attributes
| Element | Attribute |
|---------|-----------|
| ... | ... |

### API Endpoints Needed
- [ ] {endpoint_1}
- [ ] {endpoint_2}

### Database Changes
- [ ] {migration_1}

## Test Status (RED Phase)
All tests should FAIL until implementation:
- [ ] {test_1}: FAILING ✓
- [ ] {test_2}: FAILING ✓
```

### 10. Update Pipeline State

Update state file:
- Add `4` to `stepsCompleted`
- Set `lastStep: 4`
- Set `steps.step-04-atdd.status: completed`
- Record test file paths created

### 11. Present Summary and Menu

Display:
```
ATDD Complete - RED Phase Verified

Tests Created: {count}
All Tests FAILING: ✓ (as expected)

Test Files:
- {test_file_1}
- {test_file_2}

Factories: {count}
Fixtures: {count}
data-testids Required: {count}

ATDD Checklist: {checklist_path}

Next: DEV will implement to make tests GREEN
```

**Interactive Mode Menu:**
```
[C] Continue to Implementation
[T] Run tests again
[E] Edit tests
[H] Halt pipeline
```

**Batch Mode:** Auto-continue

## QUALITY GATE

Before proceeding:
- [ ] Test file created for each AC
- [ ] All tests FAIL (RED phase verified)
- [ ] Factories created for test data
- [ ] data-testid requirements documented
- [ ] ATDD checklist created

## MCP TOOLS AVAILABLE

- `mcp__exa__web_search_exa` - Test pattern research
- `mcp__exa__get_code_context_exa` - Framework-specific patterns

## CRITICAL STEP COMPLETION

**ONLY WHEN** [tests created AND all tests FAIL AND checklist created],
load and execute `{nextStepFile}` for implementation.

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS
- Tests written for all AC
- All tests FAIL (red phase)
- Factories use faker, not hardcoded data
- Fixtures have auto-cleanup
- data-testid requirements documented
- ATDD checklist complete

### ❌ FAILURE
- Tests PASS before implementation
- Hardcoded test data
- Missing edge case tests
- No data-testid documentation
- Skipping to implementation without tests
