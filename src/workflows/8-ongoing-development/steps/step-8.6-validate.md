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

Design Delivery DD-XXX is complete and ready for validation.

✅ **Implemented:** [Features/changes]
📦 **Build:** v2.1.0
🌐 **Environment:** Staging
📝 **Test Scenario:** test-scenarios/TS-XXX.yaml

Ready for your validation!
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

**See:** [substeps/delivery-templates.md](substeps/delivery-templates.md) for Validation Report template

---

### 4. Send Results to BMad

**If APPROVED:**

```
WDS Designer → BMad Developer

Subject: DD-XXX Validation Complete - APPROVED ✅

✅ **Status:** APPROVED - Ready to ship!

📊 **Test Results:**
- New functionality: All tests passed
- Regression tests: No issues
- Issues found: 0

🚀 **Next Steps:** Deploy to production!
```

**If ISSUES FOUND:**

```
WDS Designer → BMad Developer

Subject: DD-XXX Validation Complete - Issues Found

❌ **Status:** NOT APPROVED (issues found)

🐛 **Issues:**
- ISS-XXX: [Issue description]

🔧 **Next Steps:** Please fix issues, notify for retest.
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
