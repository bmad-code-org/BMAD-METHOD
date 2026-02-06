# Issue Templates

Templates for creating issue tickets and test reports.

---

## Issue File Template

**File:** `issues/ISS-XXX-description.md`

```markdown
# Issue: [Short Description]

**ID:** ISS-XXX
**Severity:** [Critical | High | Medium | Low]
**Status:** Open
**Delivery:** DD-XXX
**Test:** TS-XXX, Check: [Test ID]
**Created:** [Date]
**Assigned:** BMad Developer

## Description

[Clear description of the problem]

## Expected

[What should happen according to design]

## Actual

[What actually happens]

## Impact

[Why this matters - user impact, business impact]

## Design Reference

- Design Spec: [Path to specification]
- Design Token: [Path to token if applicable]
- Component Spec: [Path to component spec if applicable]

## Steps to Reproduce

1. [Step 1]
2. [Step 2]
3. [Step 3]

## Screenshot/Video

![Issue screenshot](../testing/DD-XXX/screenshots/ISS-XXX.png)

## Recommendation

[How to fix this - be specific]

## Related Issues

- [Link to related issues if any]

---

**Priority for fix:** [Next release | This release | Future]
```

---

## Severity Levels

| Severity | Description | Fix Timeline |
|----------|-------------|--------------|
| **Critical** | App crashes, data loss, security issue | Immediate |
| **High** | Major functionality broken, blocking | This release |
| **Medium** | Feature works but wrong, confusing UX | This release |
| **Low** | Minor polish, nice to have | Future release |

---

## Test Report Template

**File:** `testing/DD-XXX/TR-XXX-[flow-name].md`

```markdown
# Test Report: DD-XXX [Flow Name]

**Report ID:** TR-XXX
**Date:** [Date]
**Tester:** [Your name]
**Build:** [Version]
**Device:** [Device/Browser]
**Status:** PASS / FAIL

## Summary

**Overall Result:** [PASS/FAIL]
**Total Issues:** [X]
**High Severity:** [X]
**Blocking:** [Yes/No]

## Test Coverage

| Category | Passed | Failed | Total |
|----------|--------|--------|-------|
| Happy Path | X | X | X |
| Error States | X | X | X |
| Edge Cases | X | X | X |
| Design System | X | X | X |
| Accessibility | X | X | X |
| **Total** | X | X | X |

## Issues Found

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| ISS-001 | High | [Description] | Open |
| ISS-002 | Medium | [Description] | Open |

## Sign-Off Recommendation

- [ ] Ready for production
- [x] Needs fixes before production

## Next Steps

1. [Next step 1]
2. [Next step 2]

## Attachments

- Screen recordings: [List]
- Screenshots: [List]
- Issue files: [List]
```

---

## Retest Report Template

```markdown
# Retest Report: DD-XXX

**Date:** [Date]
**Build:** [New version]
**Previous Build:** [Previous version]

## Fixed Issues Verification

| ID | Description | Fixed? |
|----|-------------|--------|
| ISS-001 | [Description] | ✓ Yes |
| ISS-002 | [Description] | ✓ Yes |

## Regression Check

- [ ] Happy path still works
- [ ] Error handling still works
- [ ] No new issues introduced

## Result

**Retest Status:** PASS / FAIL

## Recommendation

[Approve for production / Need more fixes]
```

---

## Sign-Off Document Template

```markdown
# Sign-Off: DD-XXX [Flow Name]

**Date:** [Date]
**Approved By:** [Your name], WDS UX Expert

## Approval Summary

I certify that Design Delivery DD-XXX has been:

- ✅ Tested against all test scenarios
- ✅ Verified against design specifications
- ✅ Validated for accessibility requirements
- ✅ Confirmed ready for production

## Test Summary

- **Total Tests:** X
- **Passed:** X/X (XX%)
- **Issues Found:** X
- **Issues Fixed:** X
- **Test Iterations:** X

## Quality Gate

- [x] All Critical issues fixed
- [x] All High severity issues fixed
- [x] Medium/Low issues accepted or deferred
- [x] Design system compliance > 95%
- [x] No accessibility blockers

## Approved

**Signature:** [Your name]
**Date:** [Date]
**Role:** WDS UX Expert

---

_This feature is approved for production deployment._
```
