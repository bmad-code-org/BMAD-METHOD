<!-- Powered by BMAD™ Core -->

# Create E2E Test Suite Task

## Purpose

To analyze a story file and create comprehensive end-to-end test scenarios that validate the complete user workflow described in the story. This task generates detailed, tool-agnostic test specifications that can be implemented using any E2E testing framework (Playwright, Cypress, Selenium, etc.).

## SEQUENTIAL Task Execution (Do not proceed until current Task is complete)

### 1. Load and Analyze Story File

- Load the specified story file from `{devStoryLocation}/{story}.story.md`
- Extract key information:
  - Story statement (As a... I want... So that...)
  - Acceptance criteria
  - User workflow described
  - Any existing test requirements
- If story file not found, HALT and inform user: "Story file not found. Please specify the correct story file path."

### 2. Identify User Journeys

- Break down the story into distinct user journeys
- For each journey, identify:
  - Entry point (where user starts)
  - Key actions user must perform
  - Expected outcomes at each step
  - Exit criteria (successful completion)
- Map journeys to acceptance criteria numbers

### 3. Generate Test Scenarios

#### 3.1 Happy Path Scenarios
- Create primary success scenarios for each user journey
- Include all critical user actions from start to finish
- Verify expected outcomes at each step

#### 3.2 Edge Case Scenarios
- Identify boundary conditions and edge cases
- Create scenarios for:
  - Invalid inputs
  - Network failures
  - Browser compatibility issues
  - Different screen sizes (if UI-related)

#### 3.3 Error Handling Scenarios
- Create scenarios that test error conditions
- Verify appropriate error messages are shown
- Test error recovery mechanisms

### 4. Ask User for Testing Framework Preference

```
I need to generate E2E tests for this story. What testing framework would you like me to use?

1. Playwright (recommended for modern web apps)
2. Cypress (great developer experience)
3. Selenium (cross-browser support)
4. WebdriverIO (flexible ecosystem)
5. Other (please specify)

Please select a number or specify your preference:
```

### 5. Generate Framework-Specific Test Structure

Based on user's framework choice, create appropriate test file structure and syntax.

#### For Playwright:
```typescript
// test/e2e/{story-number}-{story-name}.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Story {story-number}: {story-title}', () => {
  // Test scenarios here
});
```

#### For Cypress:
```javascript
// cypress/e2e/{story-number}-{story-name}.cy.js
describe('Story {story-number}: {story-title}', () => {
  // Test scenarios here
});
```

### 6. Create Test Implementation

#### 6.1 Generate Test Code
- Create complete test implementation for each scenario
- Include proper setup and teardown
- Add data-testid selectors for reliable element targeting
- Include appropriate assertions for each expected outcome

#### 6.2 Add Test Data and Fixtures
- Generate required test data
- Create data fixtures if needed
- Include environment-specific configurations

### 7. Create Test Documentation

- Generate test documentation including:
  - Test purpose and coverage
  - Prerequisites and setup requirements
  - How to run the tests
  - Expected results and reporting
  - Maintenance notes

### 8. Output Test Files

Create the following files:
- `tests/e2e/{story-number}-{story-name}.spec.{ext}` - Main test file
- `tests/fixtures/{story-name}-data.json` - Test data (if needed)
- `tests/e2e/README-{story-name}.md` - Test documentation

### 9. Update Story File with Test Information

Add the following section to the story file:

```markdown
## E2E Test Coverage
- Test File: `tests/e2e/{story-number}-{story-name}.spec.{ext}`
- Framework: {selected-framework}
- Scenarios Covered: {number} scenarios
- Coverage: {acceptance-criteria-covered}

### Test Scenarios:
- ✅ Happy path: {scenario-description}
- ✅ Edge cases: {edge-case-descriptions}
- ✅ Error handling: {error-scenarios}
```

### 10. Provide Execution Instructions

Provide user with:
- Commands to run the tests
- How to view test results
- Integration with CI/CD pipeline instructions
- Debugging tips for test failures

## Example Output Summary

```
✅ E2E Test Suite Created for Story {story-number}

📁 Files Created:
- tests/e2e/{story-name}.spec.{ext}
- tests/fixtures/{story-name}-data.json
- tests/e2e/README-{story-name}.md

🎯 Coverage:
- 5 test scenarios generated
- All acceptance criteria covered
- Happy path, edge cases, and error handling included

🚀 Next Steps:
1. Run: npm run test:e2e
2. View results in test-reports/
3. Add to CI/CD pipeline

Story file updated with test coverage information.
```