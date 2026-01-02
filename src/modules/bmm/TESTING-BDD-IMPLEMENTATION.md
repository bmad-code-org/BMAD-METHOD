# Testing BDD + Pyramid/Trophy Implementation

This guide walks through testing all BDD best practices and pyramid/trophy test strategy changes across BMM workflows.

## Quick Validation Checklist

- [ ] SM agent has ATDD workflow in menu
- [ ] Epic creation identifies E2E vs unit test scenarios
- [ ] ATDD workflow applies pyramid/trophy decision tree
- [ ] ATDD enforces Gherkin format for ALL Playwright tests
- [ ] Dev story validates BDD tests exist before implementation
- [ ] Dev story enforces Gherkin format for ALL Playwright tests
- [ ] TEA agent can load BDD standards knowledge
- [ ] Test Design workflow applies pyramid/trophy strategy

## Test 1: SM Agent Menu Includes ATDD

**Objective:** Verify Scrum Master agent now offers ATDD workflow for test-first approach.

### Steps:

```bash
# 1. Activate SM agent
/bmm:agents:sm

# 2. Look for ATDD in the menu output
# Expected: You should see "*atdd" in the menu with description
# "Define BDD acceptance tests BEFORE implementation (test-first approach)"
```

### Expected Result:
```
Available Commands:
...
  *create-story-context - Generate Story Context XML...
  *atdd - Define BDD acceptance tests BEFORE implementation (test-first approach)
  *dev-story - Execute story implementation...
...
```

### Validation:
- ATDD appears in SM agent menu
- Description emphasizes test-first approach
- Menu item positioned between story-context and dev-story

---

## Test 2: Epic Creation - Test Strategy Planning (Step 4.5)

**Objective:** Verify epic creation workflow now categorizes acceptance criteria into E2E vs unit tests.

### Setup:
Create a sample epic with mixed acceptance criteria:
- User-facing ACs (should become E2E candidates)
- Technical ACs (should become unit tests)

### Steps:

```bash
# 1. Run epic creation workflow (or manually test Step 4.5)
/bmm:workflows:create-epics-and-stories

# 2. When you reach Step 4.5, provide sample ACs like:
# - "User can register with email and password"
# - "User receives confirmation email after registration"
# - "Registration validates email format"
# - "Backend rate-limits registration attempts"
# - "Frontend displays password strength indicator"
```

### Expected Behavior:

The workflow should analyze each AC using the decision tree:

**AC: "User can register with email and password"**
```
1. User-facing? YES
2. Needs FE+BE integration? YES
3. Critical gate? YES
→ E2E BDD Test (Playwright+Gherkin, real backend)
```

**AC: "Registration validates email format"**
```
1. User-facing? YES
2. Needs FE+BE integration? NO (frontend only)
3. Critical gate? NO
→ Frontend BDD Test (Playwright+Gherkin, mocked backend) OR Frontend Unit Test
```

**AC: "Backend rate-limits registration attempts"**
```
1. User-facing? NO (technical)
→ Backend Unit Test
```

### Expected Output:

```markdown
## Epic 1 Test Strategy

**E2E BDD Test Scenarios (2):**
1. User registration happy path (email → confirmation → login)
2. User receives confirmation email after registration

**Frontend BDD Test Scenarios (1):**
1. Registration form validates email format (mocked backend)

**Unit Test Coverage (5):**
- Backend: Rate limiting (3 tests)
- Backend: Email validation edge cases (2 tests)
- Frontend: Password strength indicator states (2 tests)

**Test Distribution:**
- E2E BDD: 2 tests (critical paths)
- Frontend BDD: 1 test (frontend integration)
- Unit: 7 tests (variations, edge cases)
```

### Validation:
- Step 4.5 exists and runs
- Decision tree correctly categorizes user-facing vs technical ACs
- E2E BDD reserved for critical full-stack flows
- Frontend BDD mentioned with Gherkin format
- Unit tests recommended for variations/edge cases
- Test counts provided (target: 5-10 E2E per epic)

---

## Test 3: ATDD Workflow - Pyramid/Trophy Strategy (Step 2)

**Objective:** Verify ATDD workflow applies pyramid/trophy decision tree and enforces Gherkin format for ALL Playwright tests.

### Steps:

```bash
# 1. Run ATDD workflow
/bmm:workflows:atdd

# 2. When prompted for story, provide one with user-facing ACs like:
# Story: User Login
# AC1: User can log in with valid email and password
# AC2: User sees error message for invalid credentials
# AC3: User account locks after 5 failed attempts
# AC4: User can reset forgotten password
```

### Expected Behavior:

**Step 2 should apply the 3-question decision tree:**

**AC1: "User can log in with valid email and password"**
```
Question 1: User-facing? YES
Question 2: Needs FE+BE integration? YES
Question 3: Critical gate? YES
→ E2E BDD Test (root tests/ directory)
  Format: Playwright with Gherkin (Given/When/Then)
```

**AC2: "User sees error message for invalid credentials"**
```
Question 1: User-facing? YES
Question 2: Needs FE+BE integration? YES
Question 3: Critical gate? NO (variation, not critical path)
→ Frontend BDD Test (frontend/tests/ directory)
  Format: Playwright with Gherkin (Given/When/Then)
  OR Backend Unit Test (faster)
```

**AC3: "User account locks after 5 failed attempts"**
```
Question 1: User-facing? YES (affects user)
Question 2: Needs FE+BE integration? YES
Question 3: Critical gate? NO (security feature, but not critical happy path)
→ Backend Unit Test (preferred - faster, more edge cases to cover)
```

### Expected Output:

```markdown
## Test Strategy

**E2E BDD Tests (1) - Playwright with Gherkin:**

### Test: User Login Happy Path
**Location:** `tests/features/auth/login.feature`
**Format:** Gherkin/BDD (Given/When/Then)

Scenario: User logs in with valid credentials
  Given user has registered account with email "user@example.com"
  When user logs in with email "user@example.com" and password "validPass123"
  Then user sees their dashboard

**Frontend BDD Tests (1) - Playwright with Gherkin:**

### Test: Invalid Credentials Error Message
**Location:** `frontend/tests/features/auth/login-errors.feature`
**Format:** Gherkin/BDD (Given/When/Then)

Scenario: User sees error for invalid credentials
  Given user is on login page
  When user enters invalid credentials
  Then user sees error message "Invalid email or password"

**Backend Unit Tests (3):**
- Account locking after 5 failed attempts
- Account locking timer (30 minutes)
- Concurrent login attempt handling
```

### Key Validations:

**CRITICAL: Gherkin Format Enforcement**
- E2E BDD section says "Playwright with Gherkin"
- Frontend BDD section says "Playwright with Gherkin"
- Both sections specify "Format: Gherkin/BDD (Given/When/Then)"
- Workflow states: "ALL Playwright tests use Gherkin/BDD format"
- Clarifies: "The ONLY difference: E2E uses real backend, frontend uses mocked backend"

**Pyramid/Trophy Strategy**
- Only 1 E2E test (critical happy path)
- Edge cases (locking, errors) at unit level
- Decision tree applied to each AC
- No duplicate coverage

**BDD Principles**
- ONE When per scenario
- Declarative language (user "logs in", not "clicks button")
- Specific entity names ("user@example.com")

---

## Test 4: Dev Story - BDD Test Validation (Step 4.5)

**Objective:** Verify dev-story workflow checks for BDD tests BEFORE implementation and enforces Gherkin format.

### Setup:
You'll need a story file without E2E BDD tests defined.

### Steps:

```bash
# 1. Create a story with user-facing ACs but NO E2E tests
# 2. Run dev-story workflow
/bmm:workflows:dev-story

# Provide story path when prompted
```

### Expected Behavior at Step 4.5:

**If E2E BDD tests are MISSING:**
```
⚠️ **BDD TESTS NOT DEFINED**

This story has user-facing acceptance criteria but no E2E BDD tests defined.

**RECOMMENDED APPROACH (Test-First):**
Run `*atdd` workflow to define BDD acceptance tests BEFORE implementation.
- E2E BDD tests act as acceptance gates (if they pass, ship to production)
- Tests replace manual testing
- Following pyramid/trophy strategy prevents test explosion

**OPTIONS:**
1. **HALT** - Run ATDD workflow first (recommended for test-first approach)
2. **CONTINUE** - Implement now, add tests during implementation (less ideal)
3. **SKIP** - Story has no user-facing behavior requiring E2E tests

Choose approach:
```

**If E2E BDD tests EXIST:**
```
✅ **E2E BDD TESTS FOUND**

Test-first approach detected! E2E BDD acceptance tests are defined.

**Your implementation will be validated against:**
- E2E BDD tests in root `tests/` directory (acceptance gates)
- Unit tests you create during implementation (edge cases, variations)

Proceeding with implementation...
```

**If story is TECHNICAL (no user-facing ACs):**
```
ℹ️ **TECHNICAL STORY - NO E2E TESTS REQUIRED**

This story has only technical acceptance criteria (not user-facing).
Unit tests will be sufficient for validation.

Proceeding with implementation...
```

### Validation:
- Step 4.5 executes before implementation
- Warns when E2E tests missing for user-facing ACs
- Offers HALT option to run ATDD first
- Confirms when E2E tests found
- Recognizes technical stories don't need E2E

---

## Test 5: Dev Story - Test Authoring with Gherkin (Step 6)

**Objective:** Verify dev-story Step 6 guides developers to use Gherkin format for ALL Playwright tests.

### Expected Guidance in Step 6:

```markdown
**CRITICAL: ALL PLAYWRIGHT TESTS USE GHERKIN/BDD FORMAT**
- Both root `tests/` and `frontend/tests/` use Playwright with Gherkin
- Same BDD principles apply to both (ONE When, declarative, specific entities)
- The ONLY difference: E2E uses real backend, frontend uses mocked backend

**E2E BDD Tests (root `tests/` directory) - Playwright with Gherkin**:
- **Format**: Playwright with Gherkin/BDD (Given/When/Then)
- ONLY if defined in ATDD workflow (should already exist if needed)
- ONLY for user-facing acceptance criteria requiring full stack integration

**Frontend BDD Tests (`frontend/tests/` directory) - Playwright with Gherkin**:
- **Format**: Playwright with Gherkin/BDD (Given/When/Then)
- Frontend component integration tests
- UI workflows that don't need real backend (mocked API)
- Visual validation
```

### Test Scenario:
Developer needs to add a frontend integration test for form validation.

### Expected Developer Action:
```gherkin
# File: frontend/tests/features/forms/registration-validation.feature

Feature: Registration Form Validation

  Scenario: Email format validation
    Given user is on registration page
    When user enters invalid email "notanemail"
    And user clicks submit
    Then user sees error "Please enter a valid email address"
```

**NOT this (pure Playwright without Gherkin):**
```typescript
// WRONG - Missing Gherkin format
test('validates email format', async ({ page }) => {
  await page.goto('/register');
  await page.fill('[name="email"]', 'notanemail');
  await page.click('button[type="submit"]');
  await expect(page.locator('.error')).toHaveText('Please enter a valid email address');
});
```

### Validation:
- Step 6 emphasizes ALL Playwright tests use Gherkin
- Clear distinction: real backend (E2E) vs mocked (frontend)
- Format specification for both E2E and Frontend sections
- BDD principles referenced (ONE When, declarative)

---

## Test 6: TEA Agent - BDD Knowledge Loading

**Objective:** Verify TEA agent can load BDD standards knowledge fragment.

### Steps:

```bash
# 1. Activate TEA agent
/bmm:agents:tea

# 2. Ask TEA to load BDD knowledge
# You can ask: "What are the BDD standards?"
# Or: "Load bdd-standards knowledge"
# Or: "Tell me about the one-when-per-scenario rule"
```

### Expected Behavior:

TEA agent should:
1. Search its knowledge index (`tea-index.csv`)
2. Find the `bdd-standards` entry
3. Load `testarch/knowledge/bdd-standards.md`
4. Respond with BDD principles

### Expected Response Content:

Should include:
- **One When Per Scenario** rule and examples
- **Declarative vs Imperative** style guide with comparison table
- **Specific Entity Names** when 2+ entities exist
- **Combinatorial Explosion Prevention** strategies
- Examples of CORRECT vs INCORRECT test scenarios

### Validation:
- `bdd-standards` entry exists in `testarch/tea-index.csv`
- Knowledge file exists at `testarch/knowledge/bdd-standards.md`
- TEA agent can discover and load the knowledge
- Content includes all 6 core BDD principles

---

## Test 7: Test Design Workflow - Pyramid/Trophy Strategy

**Objective:** Verify test-design workflow applies pyramid/trophy strategy with Gherkin format enforcement.

### Steps:

```bash
# Run test design workflow
/bmm:workflows:test-design
```

### Expected Step 3 Guidance:

Should include the same 3-question decision tree as ATDD:
1. User-facing?
2. Needs FE+BE integration?
3. Critical acceptance gate?

Should include Gherkin format enforcement:
```markdown
**CRITICAL: ALL PLAYWRIGHT TESTS USE GHERKIN/BDD FORMAT**
- Both root `tests/` (E2E) and `frontend/tests/` use Gherkin syntax
- The ONLY difference: E2E uses real backend, frontend uses mocked backend
- Same BDD principles apply to both: ONE When, declarative, specific entities
```

Should include test distribution targets:
- E2E BDD: 5-10 tests per epic
- Frontend BDD: 15-25% of total tests (Playwright+Gherkin)
- Unit Tests: 70-80% of total tests

### Validation:
- Step 3 section 2 has pyramid/trophy strategy
- Gherkin format emphasized for ALL Playwright tests
- Decision tree matches ATDD workflow
- Test distribution percentages provided
- Real-world example included

---

## Integration Test: Complete Workflow End-to-End

**Objective:** Test the complete flow from epic planning through implementation.

### Complete Flow:

```bash
# 1. Epic Planning - Identify test strategy
/bmm:workflows:create-epics-and-stories
# → Verify Step 4.5 categorizes ACs
# → Note which ACs become E2E vs unit tests

# 2. Sprint Planning - SM offers ATDD
/bmm:agents:sm
# → Verify *atdd appears in menu

# 3. Define BDD Tests FIRST
# Run *atdd from SM agent
# → Verify pyramid/trophy decision tree applied
# → Verify Gherkin format enforced for ALL Playwright tests
# → Verify E2E tests created in root tests/ directory
# → Verify unit test stubs created

# 4. Implement Story
/bmm:workflows:dev-story
# → Step 4.5 should find E2E BDD tests
# → Step 6 should guide proper test placement
# → Step 6 should enforce Gherkin for ALL Playwright tests
# → Should NOT duplicate E2E tests at unit level

# 5. Verify all tests pass
# Run test suite
# → E2E BDD tests pass = ready to ship
```

### Success Criteria:

- Test strategy planned at epic level
- BDD tests defined BEFORE implementation
- ALL Playwright tests use Gherkin format
- Pyramid/trophy strategy followed (few E2E, many unit)
- No duplicate coverage across test levels
- Developer guided at every step

---

## Automated Validation Script

You can also run this automated check:

```bash
# Check all critical files have been updated
echo "Checking BDD implementation files..."

# 1. SM agent has ATDD in menu
grep -q "atdd" src/modules/bmm/agents/sm.agent.yaml && echo "✅ SM agent menu" || echo "❌ SM agent menu"

# 2. Epic creation has Step 4.5
grep -q "4.5" src/modules/bmm/workflows/3-solutioning/create-epics-and-stories/steps/step-03-create-stories.md && echo "✅ Epic Step 4.5" || echo "❌ Epic Step 4.5"

# 3. ATDD has pyramid/trophy in Step 2
grep -q "PYRAMID/TROPHY" src/modules/bmm/workflows/testarch/atdd/instructions.md && echo "✅ ATDD pyramid/trophy" || echo "❌ ATDD pyramid/trophy"

# 4. ATDD enforces Gherkin for ALL Playwright
grep -q "ALL PLAYWRIGHT TESTS USE GHERKIN" src/modules/bmm/workflows/testarch/atdd/instructions.md && echo "✅ ATDD Gherkin enforcement" || echo "❌ ATDD Gherkin enforcement"

# 5. Dev story has Step 4.5
grep -q "4.5" src/modules/bmm/workflows/4-implementation/dev-story/instructions.xml && echo "✅ Dev story Step 4.5" || echo "❌ Dev story Step 4.5"

# 6. Dev story enforces Gherkin for ALL Playwright
grep -q "ALL PLAYWRIGHT TESTS USE GHERKIN" src/modules/bmm/workflows/4-implementation/dev-story/instructions.xml && echo "✅ Dev story Gherkin enforcement" || echo "❌ Dev story Gherkin enforcement"

# 7. Test Design has Gherkin enforcement
grep -q "ALL PLAYWRIGHT TESTS USE GHERKIN" src/modules/bmm/workflows/testarch/test-design/instructions.md && echo "✅ Test Design Gherkin enforcement" || echo "❌ Test Design Gherkin enforcement"

# 8. BDD knowledge exists
test -f src/modules/bmm/testarch/knowledge/bdd-standards.md && echo "✅ BDD knowledge file" || echo "❌ BDD knowledge file"

# 9. BDD knowledge indexed
grep -q "bdd-standards" src/modules/bmm/testarch/tea-index.csv && echo "✅ BDD knowledge indexed" || echo "❌ BDD knowledge indexed"

echo ""
echo "Testing complete!"
```

---

## Common Issues & Troubleshooting

### Issue: ATDD workflow not appearing in SM menu
**Cause:** Menu item not added to sm.agent.yaml
**Fix:** Verify `trigger: AT or fuzzy match on atdd` exists in menu section

### Issue: Step 4.5 not running in epic creation
**Cause:** Step numbering might be off
**Fix:** Check that Step 4.5 exists between Step 4 and Step 5

### Issue: BDD knowledge not loading for TEA
**Cause:** Either CSV index or knowledge file missing
**Fix:** Verify both files exist:
- `testarch/tea-index.csv` (has bdd-standards entry)
- `testarch/knowledge/bdd-standards.md` (knowledge content)

### Issue: Workflow still suggests "Playwright" without "Gherkin"
**Cause:** Old terminology not corrected
**Fix:** Search for "Playwright Tests" and update to "Frontend BDD Tests - Playwright with Gherkin"

---

## Summary: What Should Work

After implementing this BDD strategy:

1. **Epic Planning** - ACs categorized into E2E vs unit tests
2. **SM Agent** - Offers ATDD workflow for test-first approach
3. **ATDD Workflow** - Creates BDD tests BEFORE implementation using pyramid/trophy strategy
4. **ALL Playwright tests** - Use Gherkin/BDD format (Given/When/Then)
5. **Dev Story** - Validates BDD tests exist, guides proper test placement
6. **TEA Agent** - Has BDD expertise via knowledge base
7. **Test Strategy** - 5-10 E2E, 15-25% frontend BDD, 70-80% unit tests

**Key Success Metric:** If E2E BDD tests pass, you can ship to production with confidence.
