# Test Result Templates

Templates for documenting test execution results.

---

## Test Step Documentation Template

```markdown
## [Test-ID]: [Test Name]

### Step X: [Step Name]

- Action: [What was done]
- Expected: [What should happen]
- Actual: [What actually happened]
- Result: PASS/FAIL
- Issue: [If FAIL, describe the issue]
- Screenshot: [filename if FAIL]
```

---

## Happy Path Results Template

```markdown
# Happy Path Test Results

## HP-001: [Test Name]

- Status: PASS/FAIL
- Steps: X total
- Passed: X/X (XX%)
- Failed: X/X (XX%)
- Issues: X ([brief description])
- Duration: X minutes X seconds
- Recording: happy-path-HP-001.mov

## Summary

- Total Tests: X
- Passed: X/X (XX%)
- Failed: X/X (XX%)
- Total Issues: X
```

---

## Error State Results Template

```markdown
# Error State Test Results

## ES-001: [Error Scenario Name]

- Status: PASS/FAIL
- Issue: [Brief description if FAIL]
- Severity: Critical/High/Medium/Low

## Summary

- Total Tests: X
- Passed: X/X (XX%)
- Failed: X/X (XX%)
- Total Issues: X
```

---

## Edge Case Results Template

```markdown
# Edge Case Test Results

## EC-001: [Edge Case Name]

- Status: PASS/FAIL
- Issue: [Brief description if FAIL]
- Severity: Critical/High/Medium/Low

## Summary

- Total Tests: X
- Passed: X/X (XX%)
- Failed: X/X (XX%)
- Total Issues: X
```

---

## Design System Validation Template

```markdown
# Design System Validation Results

## DS-001: [Component Type]

### [Component Instance]: "[Label]"

- Height: Xpx ✓/✗
- Background: #XXXXXX ✓/✗ (Expected: #XXXXXX)
- Text: #XXXXXX ✓/✗
- Typography: Xpx, weight ✓/✗
- Border radius: Xpx ✓/✗
- Padding: Xpx Xpx ✓/✗
- Result: PASS/FAIL ([issue if FAIL])

## Summary

- Total Components: X types
- Compliant: X/X (XX%)
- Non-compliant: X/X (XX%)
- Target: >95% compliance
- Result: PASS/FAIL
```

---

## Accessibility Results Template

```markdown
# Accessibility Test Results

## A11Y-001: Screen Reader Navigation

- Status: PASS/PARTIAL PASS/FAIL
- Issues: X ([brief description])
- Severity: Critical/High/Medium/Low

## A11Y-002: Color Contrast

- Body text: X:1 ✓/✗ (min 4.5:1)
- Button text: X:1 ✓/✗ (min 4.5:1)
- Error text: X:1 ✓/✗ (min 4.5:1)
- Link text: X:1 ✓/✗ (min 4.5:1)
- Result: PASS/FAIL

## A11Y-003: Touch Targets

- Buttons: Xpx height ✓/✗ (min 44px)
- Input fields: Xpx height ✓/✗ (min 44px)
- Text links: Xpx height ✓/✗ (min 44px)
- Spacing: Xpx ✓/✗ (min 8px)
- Result: PASS/FAIL

## Summary

- Total Tests: X
- Passed: X/X (XX%)
- Partial: X/X (XX%)
- Failed: X/X (XX%)
- Total Issues: X
```

---

## Overall Test Summary Template

```markdown
# Test Summary: DD-XXX [Flow Name]

**Date:** [Date]
**Tester:** [Your name]
**Build:** [Version]
**Device:** [Device/Browser]

## Overall Result

**Status:** PASS/FAIL ([X] issues found, [X] high severity)

## Test Coverage

- Happy Path: X/X passed (XX%)
- Error States: X/X passed (XX%)
- Edge Cases: X/X passed (XX%)
- Design System: X/X compliant (XX%)
- Accessibility: X/X passed (XX%)

## Issues Summary

**Total Issues:** X

**By Severity:**
- Critical: X
- High: X
- Medium: X
- Low: X

**By Category:**
- Functionality: X
- Design System: X
- Accessibility: X

## Next Steps

1. Create issue tickets for all issues
2. Create detailed test report
3. Send to BMad for fixes
4. Schedule retest after fixes
```

---

## Screenshot Naming Convention

- Happy Path: `HP-XXX-step-X-FAIL.png`
- Error State: `ES-XXX-[description]-FAIL.png`
- Edge Case: `EC-XXX-[description]-FAIL.png`
- Design System: `DS-XXX-[component]-FAIL.png`
- Accessibility: `A11Y-XXX-[issue]-FAIL.png`
