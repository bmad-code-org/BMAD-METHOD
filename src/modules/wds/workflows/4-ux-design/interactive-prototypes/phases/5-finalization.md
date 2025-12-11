# Phase 5: Finalization

**Purpose**: Complete integration test and final approval for the logical view

---

## When to Use This Phase

- ✅ All sections of the logical view are implemented and approved

---

## Step 1: Announce Completion

**Your response**:
> "🎉 **All [N] sections complete for [Logical View Name]!**
>
> **Sections implemented**:
> - ✅ Section 1: [Name]
> - ✅ Section 2: [Name]
> - ✅ Section [N]: [Name]
>
> **Files created**:
> - `[View].html` (complete with all states)
> - `stories/[View].1-[name].md` (✅)
> - `stories/[View].[N]-[name].md` (✅)
> - `work/[View]-Work.yaml` (complete plan)
>
> **States covered**:
> - [State 1] ([Step])
> - [State 2] ([Step])
> - [State 3] ([Step])
>
> **Now let's do a complete integration test** to verify all states work correctly."

---

## Step 2: Integration Test Instructions

**Your response**:
> "**Complete Integration Test**:
>
> **Test each state**:
>
> **State 1: [State name]** ([Step])
> 1. Clear browser data
> 2. Open `[View].html`
> 3. [Actions to trigger this state]
> 4. Verify: [Expected result]
>
> **State 2: [State name]** ([Step])
> 1. [Actions to trigger this state]
> 2. Verify: [Expected result]
>
> **State 3: [State name]** ([Step])
> 1. [Actions to trigger this state]
> 2. Verify: [Expected result]
>
> **Check**:
> - All Object IDs present
> - State transitions work smoothly
> - No console errors
> - Responsive at 375px
>
> **Do all states work correctly? (Y/N)**"

---

## Step 3: Handle Final Issues or Approve

**If user reports issues**:
- Fix issues
- Update relevant story files with learnings
- Update specifications if needed
- Re-test
- Loop until approved

**If user approves**:

**Your response**:
> "✅ **Logical View Complete!**
>
> **Summary**:
> - **View**: [Logical View Name]
> - **HTML File**: `[View].html`
> - **Sections**: [N]/[N] complete
> - **Object IDs**: [Count] implemented
> - **States**: [N] states working
> - **Device**: [Device type] optimized
> - **Status**: Ready for user testing & developer handoff
>
> **Quality Checklist**:
> - [x] All sections implemented
> - [x] All states tested
> - [x] All Object IDs present
> - [x] Mobile viewport tested
> - [x] State transitions work
> - [x] No console errors
> - [x] Tailwind classes properly used
> - [x] Story files document all sections
> - [x] Learnings captured in docs
>
> **Files**:
> - ✅ `[View].html` (handles all states)
> - ✅ `work/[View]-Work.yaml` (plan)
> - ✅ `work/Logical-View-Map.md` (scenario map)
> - ✅ `stories/[View].[1-N]-*.md` (section docs)
>
> **Would you like to**:
> - Build another logical view in this scenario?
> - Start a new scenario?
> - Refine this view?"

---

## Next Steps

**If building another logical view**: Go back to **Phase 3** (select next view)

**If all logical views in scenario complete**: Scenario prototype complete! 🎉

**If starting new scenario**: Go back to **Phase 1** (Prototype Setup)

**If done**: Celebrate! Your prototype is ready for:
- User testing
- Stakeholder demos  
- Developer handoff
- Design validation

---

## 📝 **Scenario Completion Check**

**When all logical views complete**:

Review `work/Logical-View-Map.md`:
- Are all logical views built?
- Are all scenario steps covered?
- Are all states working?

**If YES**: **Scenario prototype complete!** 🎉

> "✅ **Scenario [N] prototype complete!**
>
> **Logical views built**: [N]/[N]
> **Scenario steps covered**: [M]/[M]
> **Total HTML files**: [N]
> **Total story files**: [X]
>
> All scenario steps can now be demonstrated in the prototype!
>
> **Ready for**:
> - User testing
> - Stakeholder presentations
> - Developer handoff
>
> **What's next?**"

