---
title: Gap Analysis Migration Guide
description: Migration guide for existing BMAD users transitioning to automatic gap analysis in v6
---

# Gap Analysis Migration Guide

## Quick Start

**For existing BMAD users:** Gap analysis is now automatic. No changes required to your workflow!

## What Changed

### Before (BMAD v6.0.0-alpha.21 and earlier)

```
create-story → generates complete story with "verified" tasks
dev-story → blindly follows tasks as written
```

**Problem:** Tasks become stale in batch planning scenarios

### After (BMAD v6.0.0-alpha.22+)

```
create-story → generates requirements + DRAFT tasks
dev-story → validates tasks against codebase → implementation
```

**Solution:** Tasks always reflect current codebase state

## For Existing Stories

### Stories Already Created

**Option 1: No action needed**
- Gap analysis runs automatically when you use `dev-story`
- You'll be prompted to approve task updates
- Select [Y] to proceed with refinements

**Option 2: Regenerate stories** (optional)
- Delete existing story files
- Run `create-story` again
- New stories will have "DRAFT TASKS" notation

### Stories In Progress

**If you've already started development:**
- Gap analysis detects partial implementations
- Proposes tasks for remaining work only
- Use [e] Edit to manually adjust if needed

## New Workflow Steps

### When Planning (create-story)

**No changes to your workflow!** Just be aware:
- Tasks are now marked as "DRAFT"
- They'll be validated at dev-time
- This is expected behavior

### When Developing (dev-story)

**New Step 1.5 (automatic):**

1. Gap analysis runs
2. Shows findings (What Exists / What's Missing)
3. Proposes task updates
4. Waits for your approval

**Your options:**
- [Y] Yes - approve and proceed (recommended)
- [A] Auto-accept - apply + auto-accept future (automation)
- [n] No - keep draft tasks (not recommended)
- [e] Edit - manually adjust
- [s] Skip - halt development
- [r] Review - more details first

## Common Scenarios

### Scenario 1: Just-in-Time Planning

**Before:**
```bash
/create-story  # Story 1.1
/dev-story     # Implement immediately
```

**After:**
```bash
/create-story  # Story 1.1 with DRAFT tasks
/dev-story     # Gap analysis → minimal changes → implement
```

**Impact:** Minimal. Tasks stay mostly accurate.

### Scenario 2: Batch Planning (This is the game-changer!)

**Before:**
```bash
Day 1:
/create-story  # Story 1.1 says "Create validation.ts"
/create-story  # Story 1.2 says "Create validation.ts" (duplicate!)

Day 2:
/dev-story     # Implements 1.1, creates validation.ts
/dev-story     # Implements 1.2, creates validation.ts AGAIN ❌
```

**After:**
```bash
Day 1:
/create-story  # Story 1.1 DRAFT: "Create validation.ts"
/create-story  # Story 1.2 DRAFT: "Create validation.ts"

Day 2:
/dev-story     # Gap analysis: nothing exists → creates validation.ts ✅
/dev-story     # Gap analysis: validation.ts exists!
               # Updated task: "Extend validation.ts" ✅
```

**Impact:** Massive! Prevents all duplicate implementations.

## For Custom Workflows

### If You've Customized create-story

**Changes you need to merge:**
1. Step labels changed (removed "EXHAUSTIVE ANALYSIS")
2. Focus shifted to requirements (not codebase scanning)
3. Tasks marked as "DRAFT" in story files

**Compatibility:** High. Changes are mostly textual.

### If You've Customized dev-story

**Changes you need to merge:**
1. New Step 1.5 (gap analysis) between Step 1 and 2
2. Step numbers shifted (old Step 2 is now Step 2, but Step 1.5 added)
3. Story file updates (Gap Analysis section, Change Log)

**Compatibility:** Medium. Review carefully if you have custom logic.

### If You've Customized Both

**Recommendation:**
1. Review changes in both workflows
2. Test with a sample story
3. Merge your customizations carefully
4. Validate with your use cases

## Rollback Instructions

If gap analysis causes issues, you can temporarily revert:

### Temporary Workaround (keep updated workflows)

When dev-story prompts for gap analysis approval:
- Select [n] No to keep original draft tasks
- Development proceeds without task refinement

### Full Rollback (revert to old workflows)

```bash
# In BMAD-METHOD repo
git checkout v6.0.0-alpha.21 -- src/modules/bmm/workflows/4-implementation/
git checkout v6.0.0-alpha.21 -- src/modules/bmgd/workflows/4-production/

# Reinstall in your project
cd ~/git/your-project
rm -rf _bmad
npx bmad-method@alpha install
```

**Note:** Report issues to help us improve gap analysis!

## Testing Checklist

Before fully adopting gap analysis, test these scenarios:

- [ ] **Just-in-time planning** - Create + develop story immediately
- [ ] **Batch planning** - Create 3-5 stories, develop sequentially
- [ ] **Auto-accept mode** - Use [A] option for automation
- [ ] **Edit mode** - Use [e] to manually adjust tasks
- [ ] **Existing codebase** - Develop story in project with existing code
- [ ] **Greenfield project** - Develop first story (nothing exists)

## FAQ

### Q: Do I need to regenerate existing stories?

**A:** No. Gap analysis works with any story format. It will validate tasks regardless of when the story was created.

### Q: Will this break my CI/CD pipeline?

**A:** Only if your pipeline auto-runs dev-story. Add [A] auto-accept flag or pre-approve in your automation.

### Q: Can I keep the old behavior?

**A:** Select [n] when prompted. But you'll lose the benefits of gap analysis.

### Q: What if gap analysis is wrong?

**A:** Use [e] Edit to manually correct, or [n] to keep original tasks. Also report the issue so we can improve detection.

## Getting Help

**Issues or questions?**
1. Join [Discord #general-dev](https://discord.gg/gk8jAdXWmj)
2. Open issue in [BMAD-METHOD repo](https://github.com/bmad-code-org/BMAD-METHOD)
3. Check [full gap analysis documentation](./gap-analysis.md)

## Feedback Welcome

This is a new feature in BMAD v6. We'd love your feedback!

**What we want to know:**
- Does gap analysis work correctly for your use case?
- Are the proposed task updates accurate?
- Any false positives/negatives in codebase scanning?
- Feature requests or improvements?

Share in Discord or open a GitHub issue.

---

**Gap Analysis: Keeping BMAD stories grounded in reality since v6.0.0-alpha.22**
