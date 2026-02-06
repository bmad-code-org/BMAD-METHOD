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

**Your role during fixes:**
- Be available for questions
- Clarify issues if needed
- Review fixes if BMad requests early feedback

### Step 2: BMad Notifies Ready for Retest

BMad notifies when all high-severity issues fixed and build ready.

### Step 3: Retest

**Focus on:**
1. **Fixed issues** - Verify actually fixed
2. **Regression testing** - Fixes didn't break anything
3. **Related areas** - Check affected parts

**Abbreviated testing:**
- Don't rerun all tests
- Focus on affected areas
- Verify fixes work

### Step 4: Update Issues

For each fixed issue:
```markdown
**Status:** Closed
**Fixed in:** v0.1.0-beta.2
**Verified:** 2024-12-10
**Verified by:** [Your name]
```

### Step 5: Create Retest Report

**See:** [substeps/issue-templates.md](substeps/issue-templates.md) for retest report template

### Step 6: Decision Point

**If all high-severity fixed:** → Path B (Approve)
**If issues remain:** → Repeat iteration

---

## Path B: Approve (No Blocking Issues)

### Step 1: Create Sign-Off Document

**See:** [substeps/issue-templates.md](substeps/issue-templates.md) for sign-off template

### Step 2: Notify BMad

```
WDS UX Expert → BMad Architect

Subject: DD-XXX APPROVED for Production

🎉 Design Delivery DD-XXX is approved!

✅ All tests passed
✅ Design system compliant
✅ Accessibility verified
✅ Ready for production

Sign-off document: testing/DD-XXX/sign-off.md

Congratulations on a great implementation!
```

### Step 3: Update Status

```yaml
delivery:
  status: 'approved'
  approved_at: '[timestamp]'
  approved_by: '[your name]'
```

---

## Iteration Limits

**Maximum iterations:** 3

If after 3 iterations issues persist:
1. Escalate to leads
2. Review requirements
3. Consider scope reduction

---

## Next Step

After approval:

```
[C] Return to Phase 6 to continue next flow
    OR Phase 8 for ongoing development
```

---

## Success Metrics

✅ All high-severity issues fixed
✅ Retesting complete
✅ Sign-off document created
✅ BMad notified of approval
✅ Status updated to approved

---

## Failure Modes

❌ Approving with unfixed high-severity issues
❌ No sign-off document
❌ Status not updated
❌ BMad not notified
❌ Endless iteration loop
