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

**Message to BMad Developer:**

```
WDS UX Expert → BMad Developer

Subject: Test Results for DD-XXX - [X] Issues Found

Hi Developer!

I've completed testing for DD-XXX ([Flow Name]).

📊 **Test Summary:**
- Overall Result: [PASS/FAIL]
- Total Issues: [X]
- High Severity: [X]
- Blocking: [Yes/No]

📋 **Artifacts:**
- Test Report: testing/DD-XXX/TR-XXX-flow-name.md
- Issues: issues/ISS-001 through ISS-XXX
- Screenshots: testing/DD-XXX/screenshots/
- Recordings: testing/DD-XXX/recordings/

🎯 **Priority Issues:**
1. ISS-XXX: [High] [Description]
2. ISS-XXX: [High] [Description]

📌 **Next Steps:**
[If FAIL] Please fix high severity issues and notify me for retest.
[If PASS] Ready for production deployment!

Questions? I'm available to clarify any issues.

Thanks,
[Your name]
```

---

## BMad Acknowledges

**Expected response:**

```
BMad Developer → WDS UX Expert

Thanks for the thorough testing!

Reviewing the issues now. Will prioritize:
1. [High severity issues]
2. [Medium severity issues]

Low severity issues moved to backlog.

Estimated fix time: [X days]
Will notify when ready for retest.
```

---

## Track Status

**Update delivery status:**

```yaml
delivery:
  status: 'in_testing_iteration'
  test_result: 'FAIL'
  issues_count: X
  issues_high: X
  retest_pending: true
```

---

## Next Step

After sending to BMad:

```
[C] Continue to step-7.7-iterate-or-approve.md
```

---

## Success Metrics

✅ Notification sent to BMad
✅ All artifacts referenced
✅ Priority issues highlighted
✅ Clear next steps provided
✅ BMad acknowledged receipt
✅ Status updated

---

## Failure Modes

❌ Incomplete notification
❌ Missing artifact links
❌ Unclear priorities
❌ No next steps
❌ Status not updated
