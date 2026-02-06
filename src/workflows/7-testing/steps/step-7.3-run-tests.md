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

**Why this order?** Happy path must work first. Errors and edge cases build on happy path. Design system and accessibility are final polish.

---

## Test Result Templates

**See:** [substeps/test-result-templates.md](substeps/test-result-templates.md) for all documentation templates

---

## 1. Happy Path Tests

**For each test in TS-XXX.yaml `happy_path` section:**

1. Start screen recording
2. Perform action exactly as written
3. Observe result, compare to expected
4. Compare to design reference
5. Mark PASS or FAIL
6. Take screenshot if FAIL (naming: `HP-XXX-step-X-FAIL.png`)
7. Document using template

---

## 2. Error State Tests

**For each test in TS-XXX.yaml `error_states` section:**

1. Set up error condition using test data
2. Trigger the error
3. Verify error handling (message, styling, recovery)
4. Check against design spec
5. Document results using template

---

## 3. Edge Case Tests

**For each test in TS-XXX.yaml `edge_cases` section:**

1. Set up unusual scenario
2. Perform edge case action
3. Verify graceful handling (no crash, smooth UX)
4. Document results using template

---

## 4. Design System Validation

**For each component in TS-XXX.yaml `design_system_checks` section:**

1. Locate all component instances
2. Measure dimensions (height, width, padding)
3. Check colors against design tokens
4. Check typography (size, weight, line height)
5. Check spacing
6. Check all states (default, hover, active, disabled, focus)
7. Document results using template

---

## 5. Accessibility Tests

### Screen Reader Testing
- Enable VoiceOver (iOS) or TalkBack (Android)
- Navigate through flow using only screen reader
- Check button labels, form field labels, error announcements

### Color Contrast Testing
- Use contrast checker tool
- Body text: 4.5:1 minimum (WCAG AA)
- Large text: 3:1 minimum

### Touch Target Testing
- Measure all interactive elements
- Minimum: 44×44px
- Minimum 8px spacing between targets

---

## Compile Overall Summary

After all tests complete, create overall test summary using template in substeps.

Include:
- Overall result (PASS/FAIL)
- Test coverage percentages
- Issues by severity
- Issues by category
- Next steps

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
