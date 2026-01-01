# Step 8.6: Validate Implementation

## Your Task

Validate that the Design Delivery (small scope) was implemented correctly.

---

## Before You Start

**Ensure you have:**

- ✅ Completed step 8.5 (handed off to BMad)
- ✅ BMad notified you implementation is complete
- ✅ Test scenario file ready

---

## BMad Notifies

**BMad Developer:**

```
BMad Developer → WDS Designer

Subject: Design Delivery Complete: DD-XXX

Hi Designer!

Design Delivery DD-XXX is complete and ready for validation.

✅ **Implemented:**
- [Feature/change 1]
- [Feature/change 2]
- [Feature/change 3]

📦 **Build:** v2.1.0
🌐 **Environment:** Staging
📱 **Device:** [Platform details]

📝 **Test Scenario:** test-scenarios/TS-XXX.yaml

Ready for your validation!

Thanks,
BMad Developer
```

---

## Validation Process

**This is similar to Phase 7, but focused on the specific update:**

### 1. Review Test Scenario

**Load:** `test-scenarios/TS-XXX.yaml`

**Focus on:**

- New functionality (what changed)
- Regression testing (what should stay the same)
- Edge cases specific to the update

---

### 2. Run Tests

**Follow Phase 7 testing process, but abbreviated:**

#### Test New Functionality

```markdown
## New Functionality Tests

### HP-001: [New feature works]

- Action: [Test new feature]
- Expected: [New behavior]
- Actual: [What happened]
- Result: [PASS | FAIL]
```

#### Test for Regressions

```markdown
## Regression Tests

### REG-001: [Existing feature unchanged]

- Action: [Use existing feature]
- Expected: [Works as before]
- Actual: [What happened]
- Result: [PASS | FAIL]
```

---

### 3. Document Results

**Create:** `test-reports/TR-XXX-DD-XXX-validation.md`

```markdown
# Validation Report: DD-XXX [Name]

**Date:** 2024-12-13
**Tester:** [Your name]
**Build:** v2.1.0
**Type:** Design Delivery Validation (Incremental Improvement)

---

## Result

**Status:** [PASS | FAIL]

---

## New Functionality

### Test HP-001: [Name]

- Status: [PASS | FAIL]
- Notes: [Any observations]

[Repeat for each new functionality test]

---

## Regression Testing

### Test REG-001: [Name]

- Status: [PASS | FAIL]
- Notes: [Any observations]

[Repeat for each regression test]

---

## Issues Found

**Total:** [Number]

[If any issues, list them]

---

## Recommendation

[APPROVED | NOT APPROVED]

[Brief explanation]
```

---

### 4. Send Results to BMad

**If APPROVED:**

```
WDS Designer → BMad Developer

Subject: DD-XXX Validation Complete - APPROVED ✅

Hi Developer!

Validation complete for DD-XXX!

✅ **Status:** APPROVED - Ready to ship!

📊 **Test Results:**
- New functionality: All tests passed
- Regression tests: No issues
- Issues found: 0

📁 **Validation Report:**
test-reports/TR-XXX-DD-XXX-validation.md

🚀 **Next Steps:**
Deploy to production and start measuring impact!

Great work!

Thanks,
[Your name]
WDS Designer
```

---

**If ISSUES FOUND:**

```
WDS Designer → BMad Developer

Subject: DD-XXX Validation Complete - Issues Found

Hi Developer!

Validation complete for DD-XXX.

❌ **Status:** NOT APPROVED (issues found)

🐛 **Issues:**
- ISS-XXX: [Issue description]
- ISS-XXX: [Issue description]

📁 **Validation Report:**
test-reports/TR-XXX-DD-XXX-validation.md

🔧 **Next Steps:**
Please fix issues, then notify for retest.

Thanks,
[Your name]
```

---

## Update Delivery Status

**If approved:**

```yaml
delivery:
  status: 'complete'
  validated_at: '2024-12-13T16:00:00Z'
  approved_by: '[Your name]'
  ready_for_production: true
```

**If issues found:**

```yaml
delivery:
  status: 'in_testing'
  issues_found: 2
  retest_required: true
```

---

## Next Step

After validation:

```
[C] Continue to step-8.7-monitor.md
```

---

## Success Metrics

✅ All tests executed
✅ Results documented
✅ BMad notified
✅ Delivery status updated
✅ Ready for production (if approved)

---

**Remember:** Thorough validation ensures quality improvements!
