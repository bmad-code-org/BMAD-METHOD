# Step 7.5: Create Test Report

## Your Task

Create a comprehensive test report summarizing all testing results.

---

## Before You Start

**Ensure you have:**

- ✅ Completed step 7.4 (all issues created)
- ✅ Test results compiled
- ✅ Issues list created
- ✅ Screenshots organized

---

## Create Test Report File

**File:** `test-reports/TR-XXX-YYYY-MM-DD.md`

**Example:** `test-reports/TR-001-2024-12-09.md`

---

## Test Report Template

```markdown
# Test Report: TS-XXX [Flow Name]

**Date:** 2024-12-09
**Tester:** [Your name] (Designer)
**Device:** [Device details]
**Build:** v0.1.0-beta.1
**Environment:** Staging
**Duration:** [Testing duration]

---

## Executive Summary

**Overall Result:** [PASS | FAIL | PARTIAL PASS]

**Quick Summary:**
[2-3 sentences summarizing the test results]

**Recommendation:**
[APPROVED | NOT APPROVED | APPROVED WITH MINOR ISSUES]

---

## Test Coverage

### Happy Path Tests

- **Total:** [number] tests
- **Passed:** [number]/[total] ([percentage]%)
- **Failed:** [number]/[total] ([percentage]%)
- **Status:** [PASS | FAIL]

### Error State Tests

- **Total:** [number] tests
- **Passed:** [number]/[total] ([percentage]%)
- **Failed:** [number]/[total] ([percentage]%)
- **Status:** [PASS | FAIL]

### Edge Case Tests

- **Total:** [number] tests
- **Passed:** [number]/[total] ([percentage]%)
- **Failed:** [number]/[total] ([percentage]%)
- **Status:** [PASS | FAIL]

### Design System Validation

- **Components Checked:** [number]
- **Compliant:** [number]/[total] ([percentage]%)
- **Non-compliant:** [number]/[total] ([percentage]%)
- **Target:** >95% compliance
- **Status:** [PASS | FAIL]

### Accessibility Tests

- **Total:** [number] tests
- **Passed:** [number]/[total] ([percentage]%)
- **Failed:** [number]/[total] ([percentage]%)
- **Status:** [PASS | FAIL]

---

## Issues Found

**Total Issues:** [number]

### By Severity

- **Critical:** [number]
- **High:** [number]
- **Medium:** [number]
- **Low:** [number]

### By Category

- **Functionality:** [number]
- **Design System:** [number]
- **Accessibility:** [number]
- **Performance:** [number]

### Issue List

#### Critical Issues (0)

None

#### High Severity Issues ([number])

**ISS-XXX: [Issue Title]**

- **Category:** [Functionality | Design System | Accessibility]
- **Impact:** [Brief impact description]
- **Status:** Open
- **Details:** [Link to issue file]

[Repeat for each high severity issue]

#### Medium Severity Issues ([number])

**ISS-XXX: [Issue Title]**

- **Category:** [Category]
- **Impact:** [Brief impact]
- **Status:** Open
- **Details:** [Link to issue file]

[Repeat for each medium severity issue]

#### Low Severity Issues ([number])

**ISS-XXX: [Issue Title]**

- **Category:** [Category]
- **Impact:** [Brief impact]
- **Status:** Open
- **Details:** [Link to issue file]

[Repeat for each low severity issue]

---

## Detailed Test Results

### Happy Path Tests

**HP-001: [Test Name]**

- **Status:** [PASS | FAIL]
- **Steps:** [number] total
- **Passed:** [number]/[total]
- **Failed:** [number]/[total]
- **Duration:** [time]
- **Issues:** [List issue IDs if any]
- **Notes:** [Any additional notes]

[Repeat for each happy path test]

### Error State Tests

**ES-001: [Test Name]**

- **Status:** [PASS | FAIL]
- **Expected Behavior:** [Description]
- **Actual Behavior:** [Description]
- **Issues:** [List issue IDs if any]

[Repeat for each error state test]

### Edge Case Tests

**EC-001: [Test Name]**

- **Status:** [PASS | FAIL]
- **Scenario:** [Description]
- **Result:** [Description]
- **Issues:** [List issue IDs if any]

[Repeat for each edge case test]

### Design System Validation

**DS-001: [Component Name]**

- **Instances Checked:** [number]
- **Compliant:** [number]/[total]
- **Issues:** [List issue IDs if any]
- **Details:** [Specific non-compliance]

[Repeat for each component type]

### Accessibility Tests

**A11Y-001: [Test Name]**

- **Status:** [PASS | FAIL]
- **Standard:** WCAG 2.1 AA
- **Result:** [Description]
- **Issues:** [List issue IDs if any]

[Repeat for each accessibility test]

---

## What Worked Well

### Strengths

- [Positive observation 1]
- [Positive observation 2]
- [Positive observation 3]

### Highlights

- [Specific thing that exceeded expectations]
- [Specific thing that worked perfectly]

---

## What Needs Improvement

### Areas of Concern

- [Issue category 1]: [Brief description]
- [Issue category 2]: [Brief description]
- [Issue category 3]: [Brief description]

### Recommendations

1. [Specific recommendation 1]
2. [Specific recommendation 2]
3. [Specific recommendation 3]

---

## Metrics

### Performance Metrics

- **Average screen load time:** [time]
- **Form submission time:** [time]
- **Animation frame rate:** [fps]

### User Experience Metrics

- **Flow completion time:** [time]
- **Number of taps:** [number]
- **Error rate:** [percentage]%

### Quality Metrics

- **Test pass rate:** [percentage]%
- **Design system compliance:** [percentage]%
- **Accessibility compliance:** [percentage]%

---

## Sign-Off Criteria

### Required for Approval

- [ ] All critical tests pass
- [ ] No critical or high severity issues
- [ ] Design system compliance > 95%
- [ ] All accessibility tests pass
- [ ] All acceptance criteria met

### Current Status

- **Critical tests:** [PASS | FAIL]
- **Critical/High issues:** [number] found
- **Design system compliance:** [percentage]%
- **Accessibility tests:** [PASS | FAIL]
- **Acceptance criteria:** [number]/[total] met

---

## Recommendation

**Status:** [APPROVED | NOT APPROVED | APPROVED WITH MINOR ISSUES]

**Reason:**
[Detailed explanation of recommendation]

**Next Steps:**

1. [Step 1]
2. [Step 2]
3. [Step 3]

---

## Retest Required

**Retest:** [YES | NO]

**If YES:**

- **Issues to fix:** [List critical/high issues]
- **Expected fix time:** [Estimate]
- **Retest date:** [Date]

**If NO:**

- **Approval:** Ready to ship ✅
- **Sign-off:** [Your name], [Date]

---

## Attachments

### Screenshots

- [Link to screenshots folder]
- Total screenshots: [number]

### Screen Recordings

- [Link to recordings folder]
- Total recordings: [number]

### Test Data

- [Link to test data used]

### Issue Tickets

- [Link to issues folder]
- Total issues: [number]

---

## Notes

[Any additional notes, observations, or context]

---

**Report prepared by:** [Your name]
**Role:** WDS Designer
**Date:** 2024-12-09
**Signature:** **\*\***\_\_\_\_**\*\***
```

---

## Example Test Report

See `testing-guide.md` for complete example.

---

## Next Step

After creating the test report:

```
[C] Continue to step-7.6-send-to-bmad.md
```

---

## Success Metrics

✅ Test report created
✅ All sections filled out
✅ Executive summary clear
✅ All test results documented
✅ All issues listed
✅ Metrics calculated
✅ Recommendation provided
✅ Sign-off criteria evaluated

---

## Failure Modes

❌ Incomplete test report
❌ Missing test results
❌ No recommendation
❌ Vague summary
❌ Missing metrics
❌ No sign-off criteria evaluation

---

## Tips

### DO ✅

**Be comprehensive:**

- Include all test results
- Document everything
- Provide context

**Be clear:**

- Executive summary first
- Clear recommendation
- Specific next steps

**Be professional:**

- Objective tone
- Data-driven
- Constructive feedback

### DON'T ❌

**Don't be vague:**

- Provide specific numbers
- Reference exact issues
- Give clear recommendations

**Don't sugarcoat:**

- Be honest about issues
- Don't hide problems
- Be direct but professional

**Don't skip sections:**

- Complete all sections
- Even if "no issues"
- Document everything

---

**Remember:** This report is the official record of testing. Be thorough and professional!
