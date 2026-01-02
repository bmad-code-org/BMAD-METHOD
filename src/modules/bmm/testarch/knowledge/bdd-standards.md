# BDD Test Standards Reference

## Core Rules

### One When Per Scenario
- Each scenario tests exactly ONE behavior
- Use only ONE "When" statement per test
- Use "And" to extend Given, When, or Then steps
- Never use multiple When-Then-When-Then patterns
- Split scenarios immediately if testing multiple behaviors

### Declarative Style (WHAT not HOW)
Describe what the user wants to achieve, not how the UI implements it.

| Imperative (Avoid) | Declarative (Use) |
|----------------------|---------------------|
| taps the 'Save' button | saves the changes |
| navigates to Settings screen | accesses settings |
| the Login screen is displayed | user can log in |
| sees the Submit button | user can submit the form |
| enters "john@example.com" in email field | provides email "john@example.com" |

### Given-When-Then Structure
- **Given** = Preconditions/setup (use "And" for multiple conditions)
- **When** = The ONE action being tested (use "And" only for action details)
- **Then** = Expected outcomes (use "And" for multiple assertions)

## Entity Naming

### Use Specific Values When:
- Multiple entities of same type (2+ users, groups, items)
- Complex scenarios with relationships (owner-admin-member)
- Need to track which entity performs which action
- Test involves entity names being displayed
- Business rules about specific entities (last admin, single owner)

### Generic is Acceptable When:
- Single entity where name doesn't matter for the test
- Very short scenario (3-4 lines total)
- No ambiguity about which entity acts
- Simple CRUD operation on one entity

### Naming Patterns:
- **People**: Sarah, Mike, Aisha, Chen, Maria, Raj (realistic, diverse)
- **Groups**: "Family", "Work Team", "Book Club", "Grade 5A" (descriptive)
- **Counts**: "2 admins", "3 members" (specific, never "multiple" or "several")

## Test Architecture

### Combinatorial Explosion Prevention

**Recognize the problem:**
- 3+ entry points × 3+ sub-flow variations = separate them
- Same sub-flow steps repeated across multiple entry point tests
- Sub-flows can be tested independently of entry points
- Changes to one sub-flow would require updating 5+ tests
- About to write 50+ tests for one feature = stop and restructure

**Solution: Separate Concerns**

```gherkin
## Entry Point Tests (focus on flow differences)
Scenario: Add member via email invitation
  Given... (references: KYC sub-flow, Payment sub-flow)
  When user invites via email...
  Then...

Scenario: Add member via invitation code
  Given... (references: KYC sub-flow, Payment sub-flow)
  When user shares invitation code...
  Then...

## Sub-Flow Tests (reusable variations)
Scenario: KYC - Already verified within 12 months
  Given user completed KYC 6 months ago...
  When user proceeds...
  Then existing verification confirmed...

Scenario: KYC - First time verification
  Given user has never completed KYC...
  When user submits identification...
  Then verification completed...
```

### Priority Model
- **P0**: Critical E2E smoke tests (5-10 tests maximum)
- **P1**: Entry point tests
- **P2**: Variation/sub-flow tests

### Permission Tests
Always separate from happy path:
- Happy path scenario tests the action succeeds
- Separate scenario tests unauthorized user cannot perform action

## Pyramid/Trophy Test Strategy

### Test Level Decision Tree

For EVERY Acceptance Criterion:

```
Is this user-facing?
├─ NO → Unit Test (technical/internal)
└─ YES → Does this REQUIRE frontend + backend integration?
    ├─ NO → Unit Test (can test in isolation)
    └─ YES → Is this CRITICAL (ship-to-production gate)?
        ├─ NO → Playwright Test (frontend integration only)
        └─ YES → E2E BDD Test (root tests/ directory)
```

### Strategic Test Placement

**E2E BDD Tests (root `tests/` directory)**:
- ONLY for true backend + frontend integration
- ONLY for critical acceptance criteria (if these pass, ship to production)
- REPLACES manual testing - these are the production gates
- User-facing happy paths that cross the full stack
- **Characteristics**: Highest confidence, slowest, most brittle
- **Target**: 5-10 smoke tests per epic maximum

**Playwright Tests (`frontend/tests/` directory)**:
- Frontend component integration (multiple components working together)
- UI workflows that don't need real backend (can use mocked API)
- Visual validation and interaction testing
- **Characteristics**: Fast, stable, frontend-focused

**Backend Unit Tests (`backend/tests/` directory)**:
- API contract validation
- Business logic variations and ALL edge cases
- Error handling and negative cases
- Data transformations
- **Characteristics**: Fastest, most stable

**Frontend Unit Tests (`frontend/src/components/*/tests/` directory)**:
- Component behavior (buttons, forms, modals)
- Interaction edge cases
- Rendering logic
- **Characteristics**: Fast, isolated, granular

### Avoid Duplicate Coverage

**DO NOT test the same behavior at multiple levels:**
- CORRECT: E2E for critical happy path, unit tests for variations
- WRONG: E2E + API + component tests for same behavior

### Example: Login Feature

**E2E BDD (1 test):**
- User logs in with valid credentials → sees dashboard

**Backend Unit (5 tests):**
- Invalid password, expired token, account locked, rate limiting, 2FA flow

**Frontend Unit (3 tests):**
- Form validation, password visibility toggle, error message display

**Total**: 9 tests, only 1 slow E2E

## Quality Checklist

Before finalizing any test suite:
- [ ] Every scenario has exactly ONE When statement
- [ ] All language is declarative (no UI element references)
- [ ] Multi-entity scenarios use specific, named values
- [ ] Entry points and sub-flows are separated (no explosion)
- [ ] Entry point tests reference applicable sub-flow tests
- [ ] E2E smoke suite identified (5-10 P0 tests)
- [ ] Priorities assigned correctly (P0/P1/P2)
- [ ] Permission scenarios separate from happy paths
- [ ] Test distribution follows pyramid (most tests at unit level)
- [ ] No duplicate coverage across test levels
