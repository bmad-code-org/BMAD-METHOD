# Step 7.4: Create Issues

## Your Task

Document all problems found during testing as issue tickets that BMad can fix.

---

## Before You Start

**Ensure you have:**

- ✅ Completed step 7.3 (all tests executed)
- ✅ Test results documented
- ✅ Screenshots captured
- ✅ Issues identified

---

## Issue Creation Process

### For Each Issue Found

**Create issue file:** `issues/ISS-XXX-description.md`

**Numbering:** Start at ISS-001, increment for each issue, use leading zeros.

**See:** [substeps/issue-templates.md](substeps/issue-templates.md) for complete issue template

---

## Severity Levels

| Severity | Description | Fix Timeline |
|----------|-------------|--------------|
| **Critical** | App crashes, data loss, security | Immediate |
| **High** | Major functionality broken | This release |
| **Medium** | Feature wrong, confusing UX | This release |
| **Low** | Minor polish, nice to have | Future release |

---

## Issue Writing Best Practices

**Be specific:**
- ❌ "Button looks wrong"
- ✅ "Primary button background #3B82F6, should be #2563EB per tokens/colors.json"

**Be actionable:**
- ❌ "Fix the transition"
- ✅ "Add 300ms fade transition per specifications.md line 45"

**Be visual:**
- Include screenshots
- Annotate key areas
- Show expected vs actual

---

## Create Issues Summary

After creating all issues:

```markdown
# Issues Summary: DD-XXX

**Total Issues:** X

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| ISS-001 | High | [Description] | Open |
| ISS-002 | Medium | [Description] | Open |

**By Severity:**
- Critical: X
- High: X
- Medium: X
- Low: X
```

---

## Next Step

After creating all issues:

```
[C] Continue to step-7.5-create-report.md
```

---

## Success Metrics

✅ All issues documented with correct template
✅ Severity levels assigned appropriately
✅ Design references included
✅ Screenshots attached
✅ Recommendations provided
✅ Issues summary created

---

## Failure Modes

❌ Vague descriptions
❌ Missing severity
❌ No screenshots
❌ No design reference
❌ No steps to reproduce
❌ Not actionable
