# Step 6.3: Create Test Scenario

## Your Task

Create a test scenario file that defines how to validate this Design Delivery after implementation.

---

## Before You Start

**Ensure you have:**

- ✅ Completed step 6.2 (Design Delivery created)
- ✅ Design Delivery file: `deliveries/DD-XXX-name.yaml`
- ✅ Clear understanding of what needs testing

---

## Create Test Scenario File

### Step 1: Choose Test Scenario ID

**Format:** `TS-XXX-name.yaml`

**Match the Design Delivery ID:**

- DD-001 → TS-001
- DD-002 → TS-002
- DD-003 → TS-003

**Examples:**

- `TS-001-login-onboarding.yaml`
- `TS-002-morning-dog-care.yaml`
- `TS-003-calendar-view.yaml`

---

### Step 2: Copy Template

**Template location:** `templates/test-scenario.template.yaml`

**Create file:** `test-scenarios/TS-XXX-name.yaml`

```bash
# Create test-scenarios directory if it doesn't exist
mkdir -p test-scenarios

# Copy template
cp templates/test-scenario.template.yaml test-scenarios/TS-001-login-onboarding.yaml
```

---

### Step 3: Fill Out Test Metadata

```yaml
test_scenario:
  id: 'TS-001'
  name: 'Login & Onboarding Testing'
  delivery_id: 'DD-001'
  status: 'ready' # ready | in_progress | complete
  version: '1.0'
  created_at: '2024-12-09T12:00:00Z'
```

---

### Step 4: Define Test Objectives

```yaml
test_objectives:
  - 'Verify complete onboarding flow works end-to-end'
  - 'Validate design system compliance'
  - 'Ensure accessibility standards are met'
  - 'Confirm error handling is clear and helpful'
  - 'Measure onboarding completion rate and time'
```

---

### Step 5: Define Happy Path Tests

**Test the main user flow:**

```yaml
happy_path:
  - id: 'HP-001'
    name: 'New User Complete Onboarding'
    description: 'User creates account and completes onboarding'
    steps:
      - action: 'Open app'
        expected: 'Welcome screen appears with value proposition'
        design_ref: 'C-Scenarios/01-welcome/Frontend/specifications.md'

      - action: "Tap 'Get Started' button"
        expected: 'Login/Signup choice screen appears'
        design_ref: 'C-Scenarios/02-login/Frontend/specifications.md'

      - action: "Tap 'Create Account'"
        expected: 'Signup form appears'
        design_ref: 'C-Scenarios/03-signup/Frontend/specifications.md'

      - action: 'Enter email: test@example.com'
        expected: 'Email field validates format in real-time'
        design_ref: 'C-Scenarios/03-signup/Frontend/specifications.md#validation'

      - action: 'Enter password: SecurePass123!'
        expected: 'Password field shows strength indicator'
        design_ref: 'C-Scenarios/03-signup/Frontend/specifications.md#password'

      - action: "Tap 'Create Account' button"
        expected: 'Loading state, then success message'
        design_ref: 'C-Scenarios/03-signup/Frontend/specifications.md#submit'

      - action: 'Navigate to Family Setup'
        expected: 'Family setup screen appears'
        design_ref: 'C-Scenarios/04-family-setup/Frontend/specifications.md'

      - action: "Enter family name: 'The Smiths'"
        expected: 'Family name field accepts input'
        design_ref: 'C-Scenarios/04-family-setup/Frontend/specifications.md'

      - action: "Tap 'Continue'"
        expected: 'Onboarding complete, navigate to dashboard'
        design_ref: 'C-Scenarios/04-family-setup/Frontend/specifications.md#complete'

    success_criteria:
      - 'All steps complete without errors'
      - 'User reaches dashboard'
      - 'Time to complete < 2 minutes'

  - id: 'HP-002'
    name: 'Returning User Login'
    description: 'Existing user logs in'
    steps:
      - action: 'Open app'
        expected: 'Welcome screen appears'

      - action: "Tap 'Get Started'"
        expected: 'Login/Signup choice appears'

      - action: "Tap 'Log In'"
        expected: 'Login form appears'

      - action: 'Enter email and password'
        expected: 'Fields accept input'

      - action: "Tap 'Log In' button"
        expected: 'Loading state, then navigate to dashboard'

    success_criteria:
      - 'User successfully logs in'
      - 'Session persists'
      - 'Login time < 3 seconds'
```

---

### Step 6: Define Error State Tests

**Test error handling:**

```yaml
error_states:
  - id: 'ES-001'
    name: 'Email Already Exists'
    steps:
      - action: 'Enter email that already exists'
      - action: "Tap 'Create Account'"
      - expected: "Error message: 'This email is already registered. Try logging in instead.'"
      - expected: "Helpful action: 'Go to Login' button"

    validation:
      - 'Error message is clear and actionable'
      - 'User can recover without losing data'
      - 'Error styling matches design system'

  - id: 'ES-002'
    name: 'Invalid Email Format'
    steps:
      - action: "Enter invalid email: 'notanemail'"
      - action: 'Tap outside field (blur)'
      - expected: "Real-time validation error: 'Please enter a valid email'"

    validation:
      - 'Error appears immediately on blur'
      - 'Error clears when valid email entered'

  - id: 'ES-003'
    name: 'Weak Password'
    steps:
      - action: "Enter weak password: '123'"
      - expected: "Password strength indicator shows 'Weak'"
      - expected: "Helper text: 'Password must be at least 8 characters'"

    validation:
      - 'Strength indicator updates in real-time'
      - 'Submit button disabled until password is strong'

  - id: 'ES-004'
    name: 'Network Timeout'
    steps:
      - setup: 'Simulate slow/no network'
      - action: "Tap 'Create Account'"
      - expected: 'Loading state for 5 seconds'
      - expected: "Timeout error: 'Connection timeout. Please try again.'"
      - expected: 'Retry button available'

    validation:
      - 'User is informed of network issue'
      - 'User can retry without re-entering data'
```

---

### Step 7: Define Edge Case Tests

**Test unusual scenarios:**

```yaml
edge_cases:
  - id: 'EC-001'
    name: 'User Closes App Mid-Onboarding'
    steps:
      - action: 'Start onboarding, complete signup'
      - action: 'Close app (force quit)'
      - action: 'Reopen app'
      - expected: 'Resume at Family Setup (last incomplete step)'

    validation:
      - 'Progress is saved'
      - "User doesn't have to start over"

  - id: 'EC-002'
    name: 'User Navigates Back During Onboarding'
    steps:
      - action: 'Complete signup'
      - action: 'Tap back button on Family Setup'
      - expected: "Confirmation: 'Are you sure? Progress will be saved.'"

    validation:
      - 'User is warned before going back'
      - 'Progress is not lost'

  - id: 'EC-003'
    name: 'Very Long Family Name'
    steps:
      - action: 'Enter 100-character family name'
      - expected: 'Field truncates at 50 characters'
      - expected: "Character count: '50/50'"

    validation:
      - 'Field has reasonable limit'
      - 'User is informed of limit'
```

---

### Step 8: Define Design System Validation

**Check component compliance:**

```yaml
design_system_checks:
  - id: 'DS-001'
    name: 'Button Components'
    checks:
      - component: 'Primary Button'
        instances: ['Get Started', 'Create Account', 'Continue']
        verify:
          - 'Height: 48px'
          - 'Background: tokens.button.primary.background (#2563EB)'
          - 'Text: tokens.button.primary.text (#FFFFFF)'
          - 'Typography: 16px, semibold'
          - 'Border radius: 8px'
          - 'Padding: 12px 24px'
        design_ref: 'D-Design-System/03-Atomic-Components/Buttons/Button-Primary.md'

      - component: 'Secondary Button'
        instances: ['Log In']
        verify:
          - 'Height: 48px'
          - 'Background: transparent'
          - 'Border: 2px solid tokens.button.secondary.border'
          - 'Text: tokens.button.secondary.text'
        design_ref: 'D-Design-System/03-Atomic-Components/Buttons/Button-Secondary.md'

  - id: 'DS-002'
    name: 'Input Components'
    checks:
      - component: 'Text Input'
        instances: ['Email', 'Password', 'Family Name']
        verify:
          - 'Height: 48px'
          - 'Border: 1px solid tokens.input.border'
          - 'Focus border: 2px solid tokens.input.focus'
          - 'Error border: 2px solid tokens.input.error'
          - 'Typography: 16px, regular'
        design_ref: 'D-Design-System/03-Atomic-Components/Inputs/Input-Text.md'

  - id: 'DS-003'
    name: 'Spacing and Layout'
    checks:
      - verify:
          - 'Screen padding: 20px (tokens.spacing.screen)'
          - 'Element spacing: 16px (tokens.spacing.md)'
          - 'Section spacing: 32px (tokens.spacing.xl)'
        design_ref: 'D-Design-System/02-Foundation/Spacing/tokens.json'
```

---

### Step 9: Define Accessibility Tests

```yaml
accessibility:
  - id: 'A11Y-001'
    name: 'Screen Reader Navigation'
    setup: 'Enable VoiceOver (iOS) or TalkBack (Android)'
    verify:
      - 'All buttons have descriptive labels'
      - 'Form fields announce their purpose'
      - 'Error messages are announced'
      - 'Navigation order is logical'

    success_criteria:
      - 'User can complete onboarding using only screen reader'

  - id: 'A11Y-002'
    name: 'Color Contrast'
    verify:
      - 'Text on background: 4.5:1 minimum (WCAG AA)'
      - 'Button text on button background: 4.5:1 minimum'
      - 'Error text on background: 4.5:1 minimum'

    tools:
      - 'Use contrast checker tool'
      - 'Test in grayscale mode'

  - id: 'A11Y-003'
    name: 'Touch Targets'
    verify:
      - 'All buttons: 44×44px minimum'
      - 'All input fields: 44px height minimum'
      - 'Spacing between targets: 8px minimum'

    success_criteria:
      - 'All interactive elements are easily tappable'
```

---

### Step 10: Define Sign-Off Criteria

```yaml
sign_off_criteria:
  required:
    - 'All happy path tests pass (100%)'
    - 'All error state tests pass (100%)'
    - 'All edge case tests pass (100%)'
    - 'Design system compliance > 95%'
    - 'All accessibility tests pass (100%)'
    - 'No critical or high severity issues'

  metrics:
    - name: 'Onboarding Completion Rate'
      target: '> 90%'
      measurement: 'Users who complete onboarding / Users who start'

    - name: 'Time to Complete'
      target: '< 2 minutes'
      measurement: 'Average time from app open to dashboard'

    - name: 'User Satisfaction'
      target: '> 4.5/5'
      measurement: 'Post-onboarding survey'

    - name: 'Error Rate'
      target: '< 5%'
      measurement: 'Users who encounter errors / Total users'
```

---

## Validation

**Before proceeding, verify:**

- [ ] Test Scenario ID matches Design Delivery ID
- [ ] All happy paths are covered
- [ ] All error states are tested
- [ ] Edge cases are identified
- [ ] Design system checks are complete
- [ ] Accessibility tests are defined
- [ ] Sign-off criteria are clear

---

## Next Step

After creating the Test Scenario file:

```
[C] Continue to step-6.4-handoff-dialog.md
```

---

## Success Metrics

✅ Test Scenario file created
✅ Happy path tests defined
✅ Error state tests defined
✅ Edge case tests defined
✅ Design system validation defined
✅ Accessibility tests defined
✅ Sign-off criteria clear

---

## Failure Modes

❌ Incomplete test coverage
❌ Vague test steps
❌ Missing design references
❌ No sign-off criteria
❌ Accessibility tests missing

---

**Remember:** These test scenarios will be used by the designer to validate implementation. Be thorough!
