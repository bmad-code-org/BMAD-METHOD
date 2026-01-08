# Step 7.3: Run Test Scenarios

## Your Task

Execute all test scenarios defined in the test scenario file and document results.

---

## Before You Start

**Ensure you have:**

- ✅ Completed step 7.2 (preparation complete)
- ✅ Test scenario file open
- ✅ Environment accessible
- ✅ Recording tools ready

---

## Testing Order

**Follow this sequence:**

1. **Happy Path Tests** (Most important)
2. **Error State Tests**
3. **Edge Case Tests**
4. **Design System Validation**
5. **Accessibility Tests**

**Why this order?**

- Happy path must work first
- Errors and edge cases build on happy path
- Design system and accessibility are final polish

---

## 1. Happy Path Tests

### For Each Happy Path Test

**Load test from TS-XXX.yaml:**

```yaml
happy_path:
  - id: 'HP-001'
    name: 'New User Complete Onboarding'
    steps:
      - action: 'Open app'
        expected: 'Welcome screen appears'
        design_ref: 'C-Scenarios/01-welcome/Frontend/specifications.md'
```

---

### Execute Test Steps

**For each step:**

1. **Start screen recording** (for full flow)

2. **Perform the action**
   - Follow exactly as written
   - Use prepared test data
   - Note any deviations

3. **Observe the result**
   - What actually happened?
   - Does it match expected result?
   - Any delays or glitches?

4. **Compare to design reference**
   - Open design specification
   - Check every detail
   - Note any differences

5. **Mark as Pass or Fail**

   ```
   ✓ PASS: Matches expected result
   ✗ FAIL: Doesn't match expected result
   ```

6. **Take screenshot if FAIL**
   - Capture the issue
   - Annotate if needed
   - Save with clear name: `HP-001-step-3-FAIL.png`

7. **Document in notes**

   ```markdown
   ## HP-001: New User Complete Onboarding

   ### Step 1: Open app

   - Action: Opened app
   - Expected: Welcome screen appears
   - Actual: Welcome screen appears ✓
   - Result: PASS

   ### Step 2: Tap "Get Started"

   - Action: Tapped "Get Started" button
   - Expected: Login/Signup choice appears
   - Actual: Login/Signup choice appears ✓
   - Result: PASS

   ### Step 3: Tap "Create Account"

   - Action: Tapped "Create Account"
   - Expected: Signup form with smooth 300ms transition
   - Actual: Signup form appears instantly (no transition)
   - Result: FAIL ✗
   - Issue: Transition too fast, feels jarring
   - Screenshot: HP-001-step-3-FAIL.png
   ```

---

### Record Results

**Create results summary:**

```markdown
# Happy Path Test Results

## HP-001: New User Complete Onboarding

- Status: FAIL
- Steps: 9 total
- Passed: 8/9 (89%)
- Failed: 1/9 (11%)
- Issues: 1 (transition animation missing)
- Duration: 2 minutes 15 seconds
- Recording: happy-path-HP-001.mov

## HP-002: Returning User Login

- Status: PASS
- Steps: 5 total
- Passed: 5/5 (100%)
- Failed: 0/5 (0%)
- Issues: 0
- Duration: 45 seconds
- Recording: happy-path-HP-002.mov

## Summary

- Total Tests: 2
- Passed: 1/2 (50%)
- Failed: 1/2 (50%)
- Total Issues: 1
```

---

## 2. Error State Tests

### For Each Error State Test

**Load test from TS-XXX.yaml:**

```yaml
error_states:
  - id: 'ES-001'
    name: 'Email Already Exists'
    steps:
      - action: 'Enter existing email'
      - action: "Tap 'Create Account'"
      - expected: "Error message: 'This email is already registered...'"
```

---

### Execute Error Tests

**For each error test:**

1. **Set up error condition**
   - Use prepared test data
   - Example: Use `existing@example.com`

2. **Trigger the error**
   - Perform action that causes error
   - Example: Try to create account with existing email

3. **Verify error handling**
   - Is error message shown?
   - Is error message clear and helpful?
   - Is error styling correct?
   - Can user recover?

4. **Check against design spec**
   - Open error state specification
   - Verify exact error message
   - Verify error styling
   - Verify recovery options

5. **Document results**

   ```markdown
   ## ES-001: Email Already Exists

   - Setup: Used test2@example.com (existing account)
   - Action: Entered email, tapped "Create Account"
   - Expected: Error: "This email is already registered. Try logging in instead."
   - Actual: Error: "Email exists" (too brief)
   - Result: FAIL ✗
   - Issue: Error message not helpful enough
   - Screenshot: ES-001-error-message-FAIL.png
   ```

---

### Record Error Test Results

```markdown
# Error State Test Results

## ES-001: Email Already Exists

- Status: FAIL
- Issue: Error message too brief
- Severity: Medium

## ES-002: Invalid Email Format

- Status: PASS
- Real-time validation works correctly

## ES-003: Weak Password

- Status: PASS
- Password strength indicator works

## ES-004: Network Timeout

- Status: FAIL
- Issue: No timeout handling, app hangs
- Severity: High

## Summary

- Total Tests: 4
- Passed: 2/4 (50%)
- Failed: 2/4 (50%)
- Total Issues: 2
```

---

## 3. Edge Case Tests

### For Each Edge Case Test

**Load test from TS-XXX.yaml:**

```yaml
edge_cases:
  - id: 'EC-001'
    name: 'User Closes App Mid-Onboarding'
    steps:
      - action: 'Start onboarding, complete signup'
      - action: 'Close app (force quit)'
      - action: 'Reopen app'
      - expected: 'Resume at Family Setup'
```

---

### Execute Edge Case Tests

**For each edge case:**

1. **Set up unusual scenario**
   - Follow setup instructions
   - Create edge condition

2. **Perform edge case action**
   - Example: Force quit app
   - Example: Enter 100-character name
   - Example: Navigate back

3. **Verify graceful handling**
   - Does app crash? ✗
   - Does app handle gracefully? ✓
   - Is user experience smooth?

4. **Document results**

   ```markdown
   ## EC-001: User Closes App Mid-Onboarding

   - Setup: Completed signup, at Family Setup screen
   - Action: Force quit app, reopened
   - Expected: Resume at Family Setup (progress saved)
   - Actual: Started at Welcome screen (progress lost)
   - Result: FAIL ✗
   - Issue: Progress not saved
   - Severity: High
   - Screenshot: EC-001-progress-lost-FAIL.png
   ```

---

### Record Edge Case Results

```markdown
# Edge Case Test Results

## EC-001: User Closes App Mid-Onboarding

- Status: FAIL
- Issue: Progress not saved
- Severity: High

## EC-002: User Navigates Back

- Status: PASS
- Confirmation dialog works correctly

## EC-003: Very Long Family Name

- Status: PASS
- Field truncates at 50 characters

## Summary

- Total Tests: 3
- Passed: 2/3 (67%)
- Failed: 1/3 (33%)
- Total Issues: 1
```

---

## 4. Design System Validation

### For Each Component

**Load design system checks from TS-XXX.yaml:**

```yaml
design_system_checks:
  - id: 'DS-001'
    name: 'Button Components'
    checks:
      - component: 'Primary Button'
        instances: ['Get Started', 'Create Account']
        verify:
          - 'Height: 48px'
          - 'Background: #2563EB'
          - 'Text: #FFFFFF'
          - 'Typography: 16px, semibold'
```

---

### Validate Component Usage

**For each component instance:**

1. **Locate component**
   - Find all instances in the flow
   - Example: "Get Started" button, "Create Account" button

2. **Measure dimensions**
   - Use browser dev tools or design tools
   - Check height, width, padding

3. **Check colors**
   - Use color picker tool
   - Compare to design tokens
   - Check hex values exactly

4. **Check typography**
   - Font size
   - Font weight
   - Line height
   - Letter spacing

5. **Check spacing**
   - Padding inside component
   - Margin around component
   - Spacing between elements

6. **Check states**
   - Default state
   - Hover state (if applicable)
   - Active/pressed state
   - Disabled state
   - Focus state

7. **Document results**

   ```markdown
   ## DS-001: Button Components

   ### Primary Button: "Get Started"

   - Height: 48px ✓
   - Background: #3B82F6 ✗ (Expected: #2563EB)
   - Text: #FFFFFF ✓
   - Typography: 16px, semibold ✓
   - Border radius: 8px ✓
   - Padding: 12px 24px ✓
   - Result: FAIL (wrong background color)
   - Screenshot: DS-001-button-color-FAIL.png

   ### Primary Button: "Create Account"

   - Height: 48px ✓
   - Background: #3B82F6 ✗ (Expected: #2563EB)
   - Text: #FFFFFF ✓
   - Typography: 16px, semibold ✓
   - Result: FAIL (same color issue)
   ```

---

### Record Design System Results

```markdown
# Design System Validation Results

## DS-001: Button Components

- Status: FAIL
- Issue: Primary button color incorrect (#3B82F6 vs #2563EB)
- Instances: All primary buttons affected
- Severity: High

## DS-002: Input Components

- Status: PASS
- All input fields match specifications

## DS-003: Spacing and Layout

- Status: PASS
- Screen padding: 20px ✓
- Element spacing: 16px ✓

## Summary

- Total Components: 3 types
- Compliant: 2/3 (67%)
- Non-compliant: 1/3 (33%)
- Target: >95% compliance
- Result: FAIL (below threshold)
```

---

## 5. Accessibility Tests

### Screen Reader Testing

**Enable screen reader:**

- iOS: VoiceOver (Settings → Accessibility)
- Android: TalkBack (Settings → Accessibility)

**Test navigation:**

1. **Navigate through flow using only screen reader**
   - Can you complete the flow?
   - Are all elements announced?
   - Is navigation order logical?

2. **Check button labels**
   - Are buttons descriptive?
   - "Button" vs "Get Started button"

3. **Check form field labels**
   - Are fields announced with purpose?
   - "Text field" vs "Email address text field"

4. **Check error announcements**
   - Are errors announced?
   - Are they clear?

5. **Document results**

   ```markdown
   ## A11Y-001: Screen Reader Navigation

   - Setup: Enabled VoiceOver on iOS
   - Test: Navigated through onboarding
   - Result: PARTIAL PASS

   Issues:

   - "Get Started" button announced as just "Button" ✗
   - Email field announced correctly ✓
   - Password field announced correctly ✓
   - Error messages not announced ✗

   Severity: Medium
   ```

---

### Color Contrast Testing

**Use contrast checker tool:**

1. **Check text on background**
   - Body text: 4.5:1 minimum (WCAG AA)
   - Large text: 3:1 minimum

2. **Check button text**
   - Button text on button background: 4.5:1 minimum

3. **Check error text**
   - Error text on background: 4.5:1 minimum

4. **Document results**

   ```markdown
   ## A11Y-002: Color Contrast

   - Body text on white: 7.2:1 ✓ (PASS)
   - Button text on primary: 5.1:1 ✓ (PASS)
   - Error text on white: 4.8:1 ✓ (PASS)
   - Link text on white: 3.9:1 ✗ (FAIL - below 4.5:1)

   Result: FAIL (link contrast too low)
   ```

---

### Touch Target Testing

**Measure interactive elements:**

1. **Check all buttons**
   - Minimum: 44×44px
   - Measure actual size

2. **Check all input fields**
   - Minimum height: 44px
   - Measure actual height

3. **Check spacing**
   - Minimum 8px between targets
   - Measure actual spacing

4. **Document results**

   ```markdown
   ## A11Y-003: Touch Targets

   - Primary buttons: 48×120px ✓ (PASS)
   - Input fields: 48px height ✓ (PASS)
   - Text links: 32px height ✗ (FAIL - below 44px)
   - Spacing between buttons: 16px ✓ (PASS)

   Result: FAIL (text links too small)
   ```

---

### Record Accessibility Results

```markdown
# Accessibility Test Results

## A11Y-001: Screen Reader Navigation

- Status: PARTIAL PASS
- Issues: 2 (button labels, error announcements)
- Severity: Medium

## A11Y-002: Color Contrast

- Status: FAIL
- Issue: Link contrast too low (3.9:1)
- Severity: Medium

## A11Y-003: Touch Targets

- Status: FAIL
- Issue: Text links too small (32px)
- Severity: Low

## Summary

- Total Tests: 3
- Passed: 0/3 (0%)
- Partial: 1/3 (33%)
- Failed: 2/3 (67%)
- Total Issues: 4
```

---

## Overall Test Summary

**Compile all results:**

```markdown
# Test Summary: DD-XXX [Flow Name]

**Date:** 2024-12-09
**Tester:** [Your name]
**Build:** v0.1.0-beta.1
**Device:** iPhone 14 Pro (iOS 17)

## Overall Result

**Status:** FAIL (8 issues found, 3 high severity)

## Test Coverage

- Happy Path: 8/9 passed (89%)
- Error States: 2/4 passed (50%)
- Edge Cases: 2/3 passed (67%)
- Design System: 2/3 compliant (67%)
- Accessibility: 0/3 passed (0%)

## Issues Summary

**Total Issues:** 8

**By Severity:**

- Critical: 0
- High: 3
- Medium: 3
- Low: 2

**By Category:**

- Functionality: 3
- Design System: 1
- Accessibility: 4

## Next Steps

1. Create issue tickets for all 8 issues
2. Create detailed test report
3. Send to BMad for fixes
4. Schedule retest after fixes
```

---

## Next Step

After completing all tests:

```
[C] Continue to step-7.4-create-issues.md
```

---

## Success Metrics

✅ All happy path tests executed
✅ All error state tests executed
✅ All edge case tests executed
✅ Design system validation complete
✅ Accessibility tests complete
✅ All results documented
✅ Screenshots captured for issues
✅ Screen recordings saved

---

## Failure Modes

❌ Skipping test categories
❌ Not documenting results
❌ No screenshots for issues
❌ Not checking design references
❌ Rushing through tests
❌ Not measuring design system compliance

---

**Remember:** Be thorough! Every issue you find now prevents problems in production!
