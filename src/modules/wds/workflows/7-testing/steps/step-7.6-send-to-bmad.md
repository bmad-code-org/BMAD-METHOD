# Step 7.6: Send to BMad

## Your Task

Send test results, issues, and test report to BMad for fixes.

---

## Before You Start

**Ensure you have:**

- ✅ Completed step 7.5 (test report created)
- ✅ All issues documented
- ✅ Test report finalized
- ✅ Clear recommendation

---

## Prepare Notification

### Gather All Artifacts

**Checklist:**

- [ ] Test report: `test-reports/TR-XXX-YYYY-MM-DD.md`
- [ ] Issues list: `issues/issues-list.md`
- [ ] Individual issue files: `issues/ISS-XXX-*.md`
- [ ] Screenshots folder: `testing/DD-XXX/screenshots/`
- [ ] Screen recordings folder: `testing/DD-XXX/screen-recordings/`

---

## Send Notification to BMad

### If Issues Found (NOT APPROVED)

```
WDS Designer → BMad Developer

Subject: Testing Complete for DD-XXX - Issues Found

Hi Developer!

Testing complete for DD-XXX ([Flow Name]).

📊 **Test Results:**
- Overall Result: FAIL
- Issues Found: [number] ([critical], [high], [medium], [low])
- Test Pass Rate: [percentage]%
- Design System Compliance: [percentage]%

❌ **Status:** NOT APPROVED

🐛 **Issues Found:**

**High Severity ([number]):**
- ISS-XXX: [Issue title]
- ISS-XXX: [Issue title]
- ISS-XXX: [Issue title]

**Medium Severity ([number]):**
- ISS-XXX: [Issue title]
- ISS-XXX: [Issue title]

**Low Severity ([number]):**
- ISS-XXX: [Issue title]

📁 **Artifacts:**
- Test Report: test-reports/TR-XXX-2024-12-09.md
- Issues List: issues/issues-list.md
- Issue Files: issues/ISS-XXX-*.md
- Screenshots: testing/DD-XXX/screenshots/
- Recordings: testing/DD-XXX/screen-recordings/

🔧 **Priority Fixes:**
Must fix before release:
1. ISS-XXX: [Issue title] (High)
2. ISS-XXX: [Issue title] (High)
3. ISS-XXX: [Issue title] (High)

Should fix before release:
4. ISS-XXX: [Issue title] (Medium)
5. ISS-XXX: [Issue title] (Medium)

Can fix later:
6. ISS-XXX: [Issue title] (Low)

📅 **Next Steps:**
1. Review test report and all issues
2. Fix high severity issues first
3. Fix medium severity issues
4. Notify me when ready for retest
5. I'll retest and provide updated report

⏱️ **Estimated Fix Time:**
Based on issue complexity, estimate [time] to fix all high/medium issues.

❓ **Questions:**
Let me know if you have questions about any issues. I'm available to clarify!

Thanks,
[Your name]
WDS Designer
```

---

### If No Issues (APPROVED)

```
WDS Designer → BMad Developer

Subject: Testing Complete for DD-XXX - APPROVED ✅

Hi Developer!

Testing complete for DD-XXX ([Flow Name]).

📊 **Test Results:**
- Overall Result: PASS
- Issues Found: 0
- Test Pass Rate: 100%
- Design System Compliance: [percentage]%

✅ **Status:** APPROVED - Ready to ship!

🎉 **What Worked Well:**
- [Positive feedback 1]
- [Positive feedback 2]
- [Positive feedback 3]

📁 **Artifacts:**
- Test Report: test-reports/TR-XXX-2024-12-09.md
- Screenshots: testing/DD-XXX/screenshots/
- Recordings: testing/DD-XXX/screen-recordings/

📝 **Sign-Off:**
I confirm that the implemented feature matches the design
specifications and meets the quality standards defined in
the test scenario.

Designer: [Your name]
Date: 2024-12-09

🚀 **Next Steps:**
1. Feature is approved for production release
2. Deploy to production when ready
3. Monitor user feedback after launch

Excellent work! The implementation matches the design perfectly!

Thanks,
[Your name]
WDS Designer
```

---

### If Minor Issues (APPROVED WITH MINOR ISSUES)

```
WDS Designer → BMad Developer

Subject: Testing Complete for DD-XXX - Approved with Minor Issues

Hi Developer!

Testing complete for DD-XXX ([Flow Name]).

📊 **Test Results:**
- Overall Result: PASS (with minor issues)
- Issues Found: [number] (all low severity)
- Test Pass Rate: [percentage]%
- Design System Compliance: [percentage]%

✅ **Status:** APPROVED - Can ship with minor issues

🐛 **Minor Issues Found:**

**Low Severity ([number]):**
- ISS-XXX: [Issue title]
- ISS-XXX: [Issue title]

These are cosmetic issues that don't block release. Can be fixed in next update.

📁 **Artifacts:**
- Test Report: test-reports/TR-XXX-2024-12-09.md
- Issues: issues/ISS-XXX-*.md
- Screenshots: testing/DD-XXX/screenshots/

📝 **Sign-Off:**
I approve this feature for production release. Minor issues can be addressed in future updates.

Designer: [Your name]
Date: 2024-12-09

🚀 **Next Steps:**
1. Deploy to production (approved)
2. Create tickets for minor issues in backlog
3. Fix minor issues in next sprint

Great work overall!

Thanks,
[Your name]
WDS Designer
```

---

## BMad Acknowledges

**BMad Developer responds:**

### If Issues Found

```
BMad Developer → WDS Designer

Subject: Re: Testing Complete for DD-XXX - Issues Found

Received! Thank you for the thorough testing.

📋 **My Plan:**
1. Review all [number] issues
2. Fix high severity issues first ([number] issues)
3. Fix medium severity issues ([number] issues)
4. Low severity issues: backlog for next sprint

⏱️ **Estimated Fix Time:**
- High severity: [time]
- Medium severity: [time]
- Total: [time]

🔔 **I'll notify you when:**
- Each high severity issue is fixed (for early validation if needed)
- All issues are fixed and ready for retest

❓ **Questions:**
- ISS-XXX: [Question about specific issue]

Thanks for the detailed feedback!

BMad Developer
```

---

### If Approved

```
BMad Developer → WDS Designer

Subject: Re: Testing Complete for DD-XXX - APPROVED ✅

Awesome! Thank you for the approval!

🚀 **Next Steps:**
1. Merging to main branch
2. Deploying to production
3. Monitoring for any issues

Thanks for the great collaboration!

BMad Developer
```

---

## Update Delivery Status

**Update `deliveries/DD-XXX-name.yaml`:**

### If Issues Found

```yaml
delivery:
  status: 'in_testing' # Changed from "in_development"
  tested_at: '2024-12-09T16:00:00Z'
  test_result: 'fail'
  issues_found: 8
  test_report: 'test-reports/TR-001-2024-12-09.md'
  retest_required: true
```

---

### If Approved

```yaml
delivery:
  status: 'complete' # Changed from "in_development"
  tested_at: '2024-12-09T16:00:00Z'
  test_result: 'pass'
  issues_found: 0
  test_report: 'test-reports/TR-001-2024-12-09.md'
  approved_by: '[Your name]'
  approved_at: '2024-12-09T16:00:00Z'
  ready_for_production: true
```

---

## Communication Tips

### DO ✅

**Be clear:**

- State result upfront (PASS/FAIL)
- List issues by severity
- Provide clear next steps

**Be helpful:**

- Offer to clarify issues
- Provide recommendations
- Be available for questions

**Be professional:**

- Objective tone
- Data-driven feedback
- Constructive criticism

**Be appreciative:**

- Acknowledge good work
- Highlight what worked well
- Thank for collaboration

### DON'T ❌

**Don't be vague:**

- "Some issues found" ❌
- "8 issues found (3 high, 3 medium, 2 low)" ✅

**Don't be harsh:**

- "This is terrible" ❌
- "Found some issues that need fixing" ✅

**Don't disappear:**

- Send notification and stay available
- Answer questions promptly
- Be responsive

**Don't delay:**

- Send results within 24 hours of completing testing
- Don't make BMad wait

---

## Next Step

After sending to BMad:

```
[C] Continue to step-7.7-iterate-or-approve.md
```

---

## Success Metrics

✅ Notification sent to BMad
✅ All artifacts included
✅ Clear result stated (PASS/FAIL/PARTIAL)
✅ Issues listed by severity
✅ Next steps provided
✅ BMad acknowledged receipt
✅ Delivery status updated
✅ Available for questions

---

## Failure Modes

❌ Not sending notification
❌ Vague results
❌ Missing artifacts
❌ No next steps
❌ Disappearing after sending
❌ Not updating delivery status

---

**Remember:** Clear communication = fast fixes. Be thorough, helpful, and available!
