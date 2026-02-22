# Phase 5 [T] Acceptance Testing (Designer Validation)

**Validate implementation matches design vision and quality standards**

---

## Purpose

Acceptance Testing is where you:

1. Wait for BMad to notify you that a feature is complete
2. Run test scenarios to validate implementation
3. Create issues if problems are found
4. Iterate with BMad until quality meets standards
5. Sign off when approved

**This is Touch Point 3:** BMad → WDS (BMad integrates with WDS testing)

---

## When to Enter Acceptance Testing

**After BMad notifies you:**

```
BMad Developer: "Feature complete: DD-001 Login & Onboarding

                 Implemented:
                 ✓ All 4 scenarios
                 ✓ All error states
                 ✓ All edge cases
                 ✓ Design system components

                 Build: v0.1.0-beta.1
                 Device: Staging environment

                 Ready for designer validation.
                 Test scenario: test-scenarios/TS-001.yaml"
```

**You respond:**

```
WDS Analyst: "Received! Starting validation testing..."
```

---

## Acceptance Testing Steps

### Step 1: Prepare for Testing

**Gather materials:**

- [ ] Test scenario file (TS-XXX.yaml)
- [ ] Design Delivery file (DD-XXX.yaml)
- [ ] Scenario specifications (C-UX-Scenarios/)
- [ ] Design system specs (D-Design-System/)

**Set up environment:**

- [ ] Access to staging build
- [ ] Test devices ready (iOS, Android, etc.)
- [ ] Test data prepared
- [ ] Screen recording tools ready
- [ ] Note-taking tools ready

---

### Step 2: Run Happy Path Tests

**Follow test scenario:**

```yaml
happy_path:
  - id: 'HP-001'
    name: 'New User Complete Onboarding'
    steps:
      - action: 'Open app'
        expected: 'Welcome screen appears'
        design_ref: 'C-UX-Scenarios/01-welcome/Frontend/specifications.md'
```

**For each step:**

1. Perform the action
2. Observe the result
3. Compare to expected result
4. Check design reference
5. Mark as Pass or Fail
6. Take screenshots if issues found
7. Note any deviations

**Record results:**

```
HP-001: New User Complete Onboarding
✓ Step 1: Open app → Welcome screen appears (PASS)
✓ Step 2: Tap "Get Started" → Login/Signup choice (PASS)
✗ Step 3: Tap "Create Account" → Signup form (FAIL)
  Issue: Transition too fast, feels jarring
  Expected: 300ms smooth transition
  Actual: Instant transition
  Screenshot: screenshots/HP-001-step-3.png
```

---

### Step 3: Run Error State Tests

**Test error handling:**

```yaml
error_states:
  - id: 'ES-001'
    name: 'Email Already Exists'
    steps:
      - action: 'Enter existing email'
      - action: "Tap 'Create Account'"
      - expected: "Error message: 'This email is already registered...'"
```

**Verify:**

- Error messages are clear and helpful
- Error states are visually distinct
- Recovery options are provided
- User can retry without losing data

---

### Step 4: Run Edge Case Tests

**Test unusual scenarios:**

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

**Verify:**

- Edge cases are handled gracefully
- No crashes or blank screens
- User experience is smooth

---

### Step 5: Validate Design System Compliance

**Check component usage:**

```yaml
design_system_checks:
  - id: 'DS-001'
    name: 'Button Components'
    checks:
      - component: 'Primary Button'
        instances: ['Get Started', 'Create Account']
        verify:
          - 'Correct size (48px height)'
          - 'Correct color (primary brand color)'
          - 'Correct typography (16px, semibold)'
```

**Verify:**

- Components match design system specs
- Colors are correct
- Typography is correct
- Spacing is correct
- States work correctly (hover, active, disabled)

---

### Step 6: Validate SEO (Public Pages)

**Run SEO validation for all public pages:**

Reference: `../5-agentic-development/guides/SEO-VALIDATION-GUIDE.md`

```yaml
seo_checks:
  - id: 'SEO-001'
    name: 'Title tag correct'
    verify:
      - 'Title matches specification (≤ 60 chars)'
      - 'Contains primary keyword'
      - 'Contains brand name'

  - id: 'SEO-002'
    name: 'Meta description correct'
    verify:
      - 'Meta description matches specification'
      - 'Length 150-160 characters'
      - 'Contains CTA'

  - id: 'SEO-003'
    name: 'Heading structure valid'
    verify:
      - 'Exactly one H1'
      - 'H1 contains primary keyword'
      - 'No skipped heading levels'

  - id: 'SEO-004'
    name: 'Image alt text complete'
    verify:
      - 'All content images have alt text'
      - 'Alt text in correct language'
      - 'No images > 200KB (hero < 400KB)'

  - id: 'SEO-005'
    name: 'Social sharing tags'
    verify:
      - 'og:title, og:description, og:image present'
      - 'twitter:card present'

  - id: 'SEO-006'
    name: 'Structured data valid'
    verify:
      - 'JSON-LD present and parseable'
      - 'Schema type matches plan'

  - id: 'SEO-007'
    name: 'Technical SEO'
    verify:
      - 'Canonical URL present'
      - 'hreflang tags present (if multilingual)'
      - 'robots.txt exists and references sitemap'
      - 'Security headers present'
```

**Verify:**

- All public pages have title, meta description, H1
- All images have alt text in all languages
- Social sharing tags present
- Structured data valid
- No oversized images
- Security headers configured

---

### Step 7: Test Accessibility

**Run accessibility tests:**

```yaml
accessibility:
  - id: 'A11Y-001'
    name: 'Screen Reader Navigation'
    setup: 'Enable VoiceOver (iOS) or TalkBack (Android)'
    verify:
      - 'All buttons have descriptive labels'
      - 'Form fields announce their purpose'
      - 'Error messages are announced'
```

**Verify:**

- Screen reader can navigate
- All interactive elements are accessible
- Color contrast meets WCAG 2.1 AA
- Touch targets are 44×44px minimum

---

### Step 8: Create Issues

**If problems found, create issue tickets:**

**File:** `issues/ISS-XXX-description.md`

**Template:**

````markdown
# Issue: Button Color Incorrect

**ID:** ISS-001
**Severity:** High
**Status:** Open
**Delivery:** DD-001
**Test:** TS-001, Check: DS-001

## Description

Primary button color doesn't match design system specification.

## Expected

Primary button background: #2563EB (brand primary)

## Actual

Primary button background: #3B82F6 (lighter blue)

## Impact

Brand inconsistency, doesn't match design system

## Design Reference

- Design System: D-Design-System/03-Atomic-Components/Buttons/Button-Primary.md
- Design Token: tokens/colors.json → "button.primary.background"

## Steps to Reproduce

1. Open Login screen
2. Observe "Sign In" button color

## Screenshot

![Button color issue](screenshots/ISS-001.png)

## Recommendation

Update button background color to use design token:

```tsx
backgroundColor: tokens.button.primary.background; // #2563EB
```
````

````

**Severity levels:**
- **Critical:** Blocks usage, must fix immediately
- **High:** Major issue, fix before release
- **Medium:** Noticeable issue, fix soon
- **Low:** Minor issue, fix when possible

---

### Step 9: Create Test Report

**File:** `test-reports/TR-XXX-YYYY-MM-DD.md`

**Template:**
```markdown
# Test Report: TS-001 Login & Onboarding

**Date:** 2024-12-09
**Tester:** Sarah (Designer)
**Device:** iPhone 14 Pro (iOS 17)
**Build:** v0.1.0-beta.1

## Summary

**Overall Result:** FAIL (2 issues found, 1 high severity)

**Test Coverage:**
- Happy Path: 12/13 passed (92%)
- Error States: 3/3 passed (100%)
- Edge Cases: 2/2 passed (100%)
- Design System: 8/10 passed (80%)
- Accessibility: 2/2 passed (100%)

## Issues Found

### ISS-001: Button Color Incorrect (HIGH)
[Details...]

### ISS-002: Transition Too Fast (MEDIUM)
[Details...]

## Recommendations

### What Worked Well
- Error handling is clear and helpful
- Accessibility is excellent
- User flow is intuitive

### What Needs Improvement
- Design system compliance (80% → target 95%)
- Transition animations need polish

### Next Steps
1. Fix ISS-001 (button color) - CRITICAL
2. Fix ISS-002 (transition speed)
3. Retest with updated build

## Sign-off

**Status:** NOT APPROVED
**Reason:** High severity issue + design system compliance below threshold
**Retest Required:** Yes
````

---

### Step 10: Send to BMad

**Notify BMad of results:**

```
WDS Analyst: "Testing complete for DD-001.

              Results: 2 issues found
              - ISS-001: Button color incorrect (HIGH)
              - ISS-002: Transition too fast (MEDIUM)

              Test report: test-reports/TR-001-2024-12-09.md
              Issues: issues/ISS-001.md, issues/ISS-002.md

              Please fix and notify when ready for retest."
```

**BMad responds:**

```
BMad Developer: "Issues received. Fixing:
                 - ISS-001: Button color
                 - ISS-002: Transition speed

                 Will notify when ready for retest."
```

---

### Step 11: Iterate Until Approved

**BMad fixes issues:**

```
BMad Developer: "Issues fixed.
                 Build: v0.1.0-beta.2
                 Ready for retest."
```

**You retest:**

- Run test scenarios again
- Verify issues are fixed
- Check for new issues
- Update test report

**If approved:**

```
WDS Analyst: "Retest complete!

              All issues resolved.
              Design system compliance: 98%

              ✅ APPROVED - Ready to ship!

              Test report: test-reports/TR-001-2024-12-15.md"
```

**If not approved:**

- Create new issues
- Send to BMad
- Repeat until approved

---

## Sign-Off Criteria

**Required for approval:**

- [ ] All critical tests pass
- [ ] No critical or high severity issues
- [ ] Design system compliance > 95%
- [ ] Accessibility tests pass
- [ ] SEO validation passes (all public pages)
- [ ] Usability metrics meet targets
- [ ] All acceptance criteria met

**Designer approval:**

```
I confirm that the implemented feature matches the design
specifications and meets the quality standards defined in
the test scenario.

Designer: ________________
Date: ________________
```

---

## Deliverables

### Test Report

**Location:** `test-reports/TR-XXX-YYYY-MM-DD.md`

**Contents:**

- Test summary (date, tester, device, build)
- Overall result (pass/fail/partial)
- Test coverage (happy path, errors, edge cases, etc.)
- Issues found (with severity and details)
- Recommendations (what worked, what needs improvement)
- Sign-off status

---

### Issue Tickets

**Location:** `issues/ISS-XXX-description.md`

**Contents:**

- Issue metadata (id, severity, status, delivery, test)
- Description
- Expected vs Actual
- Impact
- Design reference
- Steps to reproduce
- Screenshot/video
- Recommendation

---

## Common Issues

### Design System Violations

**Button color incorrect:**

- Expected: Design token color
- Actual: Hardcoded color
- Fix: Use design token

**Typography wrong:**

- Expected: 16px, Semibold
- Actual: 14px, Regular
- Fix: Use design system styles

**Spacing inconsistent:**

- Expected: 20px between elements
- Actual: 15px, 18px, 23px
- Fix: Use spacing tokens

---

### Interaction Issues

**Transition too fast:**

- Expected: 300ms smooth transition
- Actual: Instant transition
- Fix: Add transition animation

**Touch target too small:**

- Expected: 44×44px minimum
- Actual: 32×32px
- Fix: Increase button size

**No loading state:**

- Expected: Spinner during load
- Actual: Blank screen
- Fix: Add loading indicator

---

### Accessibility Issues

**Missing labels:**

- Expected: Descriptive button labels
- Actual: Generic "Button" label
- Fix: Add aria-label

**Low contrast:**

- Expected: 4.5:1 contrast ratio
- Actual: 3:1 contrast ratio
- Fix: Increase text color contrast

**Not keyboard accessible:**

- Expected: Can navigate with keyboard
- Actual: Keyboard navigation doesn't work
- Fix: Add keyboard support

---

## Tips for Success

### DO ✅

**Be thorough:**

- Test every step in test scenario
- Check all design references
- Verify all acceptance criteria
- Don't skip edge cases

**Be specific:**

- Clear issue descriptions
- Include screenshots/videos
- Reference design specs
- Provide recommendations

**Be collaborative:**

- Communicate clearly with BMad
- Answer questions promptly
- Appreciate good work
- Focus on quality, not blame

**Be iterative:**

- Expect multiple rounds
- Test quickly and provide feedback
- Don't wait for perfection
- Sign off when quality is good enough

### DON'T ❌

**Don't be vague:**

- "It doesn't look right" ❌
- "Button color is #3B82F6, should be #2563EB" ✅

**Don't be nitpicky:**

- Focus on critical issues first
- Don't block on minor details
- Remember: good enough to ship

**Don't disappear:**

- Respond to BMad questions
- Retest promptly
- Stay engaged until sign-off

**Don't skip documentation:**

- Always create test reports
- Always document issues
- Always provide clear feedback

---

## Next Steps

**After Acceptance Testing (Sign-off):**

1. **Feature ships** to production
2. **Monitor** user feedback and metrics
3. **Iterate** based on real-world usage
4. **Continue** with next delivery (return to Phase 4-5)

**If more flows in progress:**

- Test next completed flow
- Continue parallel work
- Maintain quality standards

---

## Resources

**Templates:**

- `templates/test-scenario.template.yaml`
- `templates/test-report.template.md` (to be created)
- `templates/issue.template.md` (to be created)

**Specifications:**

- `src/core/resources/wds/integration-guide.md`
- Test scenario files in `test-scenarios/`

---

**Acceptance Testing is where you ensure quality! Test thoroughly, communicate clearly, and sign off with confidence!** ✅✨
