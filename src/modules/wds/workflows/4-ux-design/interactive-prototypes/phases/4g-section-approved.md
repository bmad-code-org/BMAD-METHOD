# Phase 4g: Section Approved & Next Steps

**Purpose**: Finalize section approval and determine next action

**Task**: Update status and move forward

---

## When to Use This Phase

- ✅ Section implemented and tested
- ✅ User approved the section

---

## Step 1: Section Approved

**When user says**: "Looks good!" / "Approved" / "Y" / "Perfect!"

**Your response**:
> "✅ **Section [N] approved!**
>
> Updating records..."

---

## Step 2: Update Story File Status

**Actions**:

Update `stories/[View].[N]-[section-name].md`:

```markdown
**Status**: ✅ Complete
**Completed**: [Date]
**Approved by**: User

## Final Notes

[Any important observations from implementation]

## Implementation Summary

- Objects implemented: [N]
- Issues encountered: [N]
- Improvements made: [N]
- Time taken: ~[X] min (estimated: [Y] min)
- Specification updates suggested: [Y/N]

---

*Section approved and complete! ✅*
```

---

## Step 3: Update Work File

**Actions**:

Update `work/[View]-Work.yaml`:

```yaml
sections:
  - id: N
    name: "[Section Name]"
    status: "complete"
    completed_date: "[date]"
    actual_time: "[X] min"
    issues_encountered: N
    improvements_made: N
    spec_updates_needed: [Y/N]
```

---

## Step 4: Check Progress

**Count sections**:
- Total sections: [N]
- Completed: [X]
- Remaining: [Y]

---

## Step 5a: If More Sections Remain

**Your response**:
> "**Progress**: [X]/[N] sections complete! 🎉
>
> **Next: Section [N+1]: [Next Section Name]**
>
> **What I'll build**:
> - [Feature 1]
> - [Feature 2]
> - [Feature 3]
>
> **Estimated time**: ~[X] min
>
> **Ready to continue?** (Y/N)"

**If user says "Y"**: Go back to **Phase 4a** (`4a-announce-and-gather.md`)

**If user says "N"** or wants to pause:
> "No problem! Progress saved. You can resume anytime by asking to continue with Section [N+1].
>
> **Saved state**:
> - ✅ Sections 1-[X] complete
> - ⏸️ Section [N+1] ready to start
> - 📄 All story files and code saved"

---

## Step 5b: If All Sections Complete

**Your response**:
> "🎉 **All [N] sections complete for [Logical View Name]!**
>
> **Sections implemented**:
> - ✅ Section 1: [Name]
> - ✅ Section 2: [Name]
> - ✅ Section [N]: [Name]
>
> **Files created**:
> - ✅ `[View].html` (complete with all states)
> - ✅ `work/[View]-Work.yaml` (complete plan)
> - ✅ `stories/[View].1-[name].md` through `[View].[N]-[name].md`
>
> **Next: Integration test** to verify all states work together correctly.
>
> **Ready for Phase 5?** (Y)"

**Go to**: `5-finalization.md` when user says "Y"

---

## 📊 **Progress Tracking**

**After each section approval**:
- ✅ Story file marked complete
- ✅ Work file updated
- ✅ User sees progress ([X]/[N] sections)
- ✅ Clear next step presented

**This creates momentum and clarity!** 🚀

