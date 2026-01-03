# Step 7.7: Iterate or Approve

## Your Task

Either iterate with BMad to fix issues, or approve the feature for production.

---

## Before You Start

**Ensure you have:**

- ✅ Completed step 7.6 (sent to BMad)
- ✅ BMad acknowledged receipt
- ✅ Clear on next steps

---

## Two Paths

### Path A: Issues Found → Iterate

**If test result was FAIL:**

- BMad fixes issues
- You retest
- Repeat until approved

### Path B: No Issues → Approve

**If test result was PASS:**

- Feature approved
- Ready for production
- Phase 7 complete!

---

## Path A: Iterate (Issues Found)

### Step 1: Wait for BMad Fixes

**BMad is fixing issues:**

```
BMad Developer: "Working on fixes for DD-XXX.

                 Progress:
                 ✓ ISS-002: Button color fixed
                 ✓ ISS-003: Button labels added
                 ⏳ ISS-004: Progress save in progress
                 ⏳ ISS-005: Network timeout handling in progress

                 Will notify when all fixes complete."
```

**Your role during fixes:**

- Be available for questions
- Clarify issues if needed
- Review fixes if BMad requests early feedback

---

### Step 2: BMad Notifies Ready for Retest

**BMad notifies:**

```
BMad Developer: "All issues fixed for DD-XXX!

                 Fixed:
                 ✓ ISS-002: Button color (now using design token)
                 ✓ ISS-003: Button labels (accessibility improved)
                 ✓ ISS-004: Progress save (state persists)
                 ✓ ISS-005: Network timeout (30s timeout + retry)
                 ✓ ISS-001: Transition animation (300ms fade)
                 ✓ ISS-006: Error message (more helpful)

                 Low severity issues (ISS-007, ISS-008) moved to backlog.

                 Build: v0.1.0-beta.2
                 Environment: Staging

                 Ready for retest!"
```

---

### Step 3: Retest

**Run tests again:**

**Focus on:**

1. **Fixed issues** (verify they're actually fixed)
2. **Regression testing** (ensure fixes didn't break anything)
3. **Related areas** (check if fixes affected other parts)

**Abbreviated testing:**

- Don't need to run ALL tests again
- Focus on areas that were fixed
- Spot-check other areas for regression

**Example retest plan:**

```markdown
# Retest Plan: DD-XXX (v0.1.0-beta.2)

## Fixed Issues to Verify

### ISS-002: Button Color

- [ ] Check all primary buttons
- [ ] Verify color is #2563EB
- [ ] Check on all screens

### ISS-003: Button Labels

- [ ] Enable VoiceOver
- [ ] Verify all buttons have descriptive labels
- [ ] Check all interactive elements

### ISS-004: Progress Save

- [ ] Complete signup
- [ ] Force quit app
- [ ] Reopen app
- [ ] Verify resumes at Family Setup

[Continue for each fixed issue]

## Regression Testing

- [ ] Run happy path HP-001 (full flow)
- [ ] Spot-check error states
- [ ] Verify design system compliance

## New Issues

- [ ] Watch for any new issues introduced by fixes
```

---

### Step 4: Document Retest Results

**Create retest report:** `test-reports/TR-XXX-YYYY-MM-DD-retest.md`

```markdown
# Retest Report: DD-XXX (Build v0.1.0-beta.2)

**Date:** 2024-12-15
**Tester:** [Your name]
**Build:** v0.1.0-beta.2
**Original Test:** TR-001-2024-12-09.md
**Issues Fixed:** 6

---

## Fixed Issues Verification

### ISS-002: Button Color

- **Status:** FIXED ✅
- **Verification:** All primary buttons now use #2563EB
- **Result:** PASS

### ISS-003: Button Labels

- **Status:** FIXED ✅
- **Verification:** VoiceOver announces descriptive labels
- **Result:** PASS

### ISS-004: Progress Save

- **Status:** FIXED ✅
- **Verification:** App resumes at correct point after force quit
- **Result:** PASS

### ISS-005: Network Timeout

- **Status:** FIXED ✅
- **Verification:** 30s timeout with retry button
- **Result:** PASS

### ISS-001: Transition Animation

- **Status:** FIXED ✅
- **Verification:** 300ms fade transition working
- **Result:** PASS

### ISS-006: Error Message

- **Status:** FIXED ✅
- **Verification:** Error message now helpful and actionable
- **Result:** PASS

---

## Regression Testing

### Happy Path HP-001

- **Status:** PASS ✅
- **No regressions detected**

### Error States

- **Status:** PASS ✅
- **No regressions detected**

### Design System

- **Compliance:** 98% (up from 67%)
- **Status:** PASS ✅

---

## New Issues Found

None! All fixes implemented correctly with no regressions.

---

## Overall Result

**Status:** PASS ✅

All issues fixed successfully. Feature is ready for production.

---

## Recommendation

**APPROVED** - Ready to ship!

**Sign-off:**
Designer: [Your name]
Date: 2024-12-15
```

---

### Step 5: Send Retest Results

**If all issues fixed:**

```
WDS Designer → BMad Developer

Subject: Retest Complete for DD-XXX - APPROVED ✅

Hi Developer!

Retest complete for DD-XXX!

✅ **Result:** APPROVED - Ready to ship!

🎉 **All Issues Fixed:**
- ISS-002: Button color ✓
- ISS-003: Button labels ✓
- ISS-004: Progress save ✓
- ISS-005: Network timeout ✓
- ISS-001: Transition animation ✓
- ISS-006: Error message ✓

📊 **Retest Results:**
- Fixed issues: 6/6 (100%)
- Regression tests: All passed
- Design system compliance: 98% (target: >95%)
- New issues: 0

📁 **Retest Report:**
test-reports/TR-001-2024-12-15-retest.md

📝 **Sign-Off:**
I confirm that all issues have been fixed and the feature
is ready for production release.

Designer: [Your name]
Date: 2024-12-15

🚀 **Next Steps:**
Deploy to production!

Excellent work on the fixes!

Thanks,
[Your name]
WDS Designer
```

---

**If new issues found:**

```
WDS Designer → BMad Developer

Subject: Retest Complete for DD-XXX - New Issues Found

Hi Developer!

Retest complete for DD-XXX.

📊 **Result:** FAIL (new issues found)

✅ **Original Issues Fixed:**
- ISS-002: Button color ✓
- ISS-003: Button labels ✓
- [etc...]

❌ **New Issues Found:**
- ISS-009: [New issue description]
- ISS-010: [New issue description]

📁 **Retest Report:**
test-reports/TR-001-2024-12-15-retest.md

🔧 **Next Steps:**
1. Fix new issues
2. Retest again

Sorry for the additional issues! Let me know if you have questions.

Thanks,
[Your name]
```

---

### Step 6: Repeat Until Approved

**Keep iterating:**

- BMad fixes issues
- You retest
- Report results
- Repeat until all issues resolved

**Typical iteration:**

```
Round 1: 8 issues found
Round 2: 2 new issues found (6 fixed)
Round 3: All issues fixed ✅
```

---

## Path B: Approve (No Issues)

### Step 1: Final Sign-Off

**Create sign-off document:** `deliveries/DD-XXX-sign-off.md`

```markdown
# Design Sign-Off: DD-XXX [Flow Name]

**Delivery ID:** DD-XXX
**Delivery Name:** [Flow Name]
**Build Version:** v0.1.0-beta.1
**Test Date:** 2024-12-09
**Sign-Off Date:** 2024-12-09

---

## Certification

I, [Your name], as the WDS Designer for this project, hereby
certify that:

1. ✅ The implemented feature matches the design specifications
   defined in Design Delivery DD-XXX

2. ✅ All scenarios have been implemented correctly according
   to the specifications in C-Scenarios/

3. ✅ All design system components have been used correctly
   according to D-Design-System/ specifications

4. ✅ All acceptance criteria defined in DD-XXX.yaml have
   been met

5. ✅ All test scenarios defined in TS-XXX.yaml have passed

6. ✅ Design system compliance exceeds 95% threshold

7. ✅ Accessibility standards (WCAG 2.1 AA) have been met

8. ✅ The feature meets the quality standards required for
   production release

---

## Test Results Summary

- **Test Report:** test-reports/TR-XXX-2024-12-09.md
- **Test Pass Rate:** 100%
- **Issues Found:** 0
- **Design System Compliance:** [percentage]%
- **Accessibility Compliance:** 100%

---

## Approval

**Status:** APPROVED FOR PRODUCTION RELEASE

**Designer Signature:** [Your name]
**Date:** 2024-12-09

---

## Production Release Authorization

This feature is authorized for production deployment.

**Next Steps:**

1. Merge to main branch
2. Deploy to production
3. Monitor user feedback
4. Address any post-launch issues in future updates

---

**Congratulations to the team on successful delivery!** 🎉
```

---

### Step 2: Celebrate!

**You did it!**

```
WDS Designer → BMad Developer

Subject: DD-XXX Approved - Great Work! 🎉

Hi Developer!

DD-XXX is officially approved and ready for production!

🎉 **Congratulations!**

The implementation is excellent and matches the design
perfectly. Great collaboration throughout!

📝 **Sign-Off Document:**
deliveries/DD-XXX-sign-off.md

🚀 **Ready for Production:**
Feature is approved for deployment.

Thanks for the great work!

[Your name]
WDS Designer
```

---

## Update Delivery Status

### If Approved

```yaml
delivery:
  status: 'complete'
  approved_at: '2024-12-09T16:00:00Z'
  approved_by: '[Your name]'
  ready_for_production: true
  sign_off_document: 'deliveries/DD-XXX-sign-off.md'
```

---

### If Still Iterating

```yaml
delivery:
  status: 'in_testing'
  retest_count: 2
  last_retest_at: '2024-12-15T14:00:00Z'
  issues_remaining: 2
```

---

## Phase 7 Complete!

**When feature is approved:**

✅ Testing complete
✅ All issues resolved
✅ Feature approved
✅ Sign-off documented
✅ Ready for production

**What happens next:**

- BMad deploys to production
- Feature goes live
- Users start using it
- Monitor feedback
- Plan next delivery

---

## Return to Phase 6

**While this feature ships, design the next one!**

```
[D] Return to Phase 6 for next Design Delivery
```

**Or if all deliveries complete:**

```
[C] All deliveries complete! Product shipped! 🚀
```

---

## Success Metrics

✅ Issues fixed and verified
✅ Retest completed (if needed)
✅ Feature approved
✅ Sign-off documented
✅ Delivery status updated
✅ BMad notified
✅ Ready for production

---

## Failure Modes

❌ Endless iteration (not converging)
❌ Approving with unresolved issues
❌ Not documenting sign-off
❌ Not updating delivery status
❌ Disappearing after approval

---

## Tips

### DO ✅

**Be patient:**

- Iteration is normal
- Quality takes time
- Don't rush approval

**Be thorough:**

- Verify all fixes
- Check for regressions
- Don't skip retest

**Be appreciative:**

- Acknowledge good work
- Celebrate success
- Thank the team

### DON'T ❌

**Don't approve prematurely:**

- All issues must be fixed
- Quality standards must be met
- Don't compromise

**Don't iterate forever:**

- If stuck, discuss with team
- Find pragmatic solutions
- Know when "good enough"

**Don't forget documentation:**

- Sign-off is required
- Update delivery status
- Document everything

---

**Remember:** Quality is the goal. Iterate until it's right, then celebrate success!\*\* 🎉✨
