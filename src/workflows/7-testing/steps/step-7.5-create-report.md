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

**File:** `testing/DD-XXX/TR-XXX-[flow-name].md`

**See:** [substeps/issue-templates.md](substeps/issue-templates.md) for complete test report template

---

## Report Sections

1. **Summary** - Overall result, total issues, blocking status
2. **Test Coverage** - Pass/fail by category
3. **Issues Found** - Table of all issues
4. **Sign-Off Recommendation** - Ready or needs fixes
5. **Next Steps** - What happens next
6. **Attachments** - Recordings, screenshots, issue files

---

## Overall Result Determination

**PASS if:**
- All Critical issues: 0
- All High issues: Fixed or accepted risk
- Happy path: 100% pass
- Design system: > 95% compliant

**FAIL if:**
- Any Critical issues unfixed
- Any High issues blocking
- Happy path failures
- Design system < 95% compliant

---

## Attach Supporting Files

Organize testing folder:

```
testing/DD-XXX/
├── TR-XXX-flow-name.md (this report)
├── screenshots/
│   ├── ISS-001.png
│   ├── ISS-002.png
├── recordings/
│   ├── happy-path-HP-001.mov
│   ├── happy-path-HP-002.mov
└── test-data/
    └── test-accounts.md
```

---

## Next Step

After creating test report:

```
[C] Continue to step-7.6-send-to-bmad.md
```

---

## Success Metrics

✅ Test report created with all sections
✅ Test coverage complete
✅ Issues list accurate
✅ Clear recommendation
✅ All attachments organized

---

## Failure Modes

❌ Missing test categories
❌ Incorrect issue counts
❌ Unclear recommendation
❌ Missing attachments
❌ Incomplete coverage data
