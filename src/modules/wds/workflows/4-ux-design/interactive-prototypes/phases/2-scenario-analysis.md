# Phase 2: Scenario Analysis & Logical View Identification

**Purpose**: Analyze the entire scenario to identify all logical views and map which scenario steps use which views

**Note**: A "logical view" is a conceptual page/screen with multiple states. Multiple scenario steps can use the same logical view.

---

## When to Use This Phase

- ✅ Starting to prototype a new scenario
- ✅ Prototype folder structure exists (from Phase 1)
- ✅ All scenario step specifications exist

---

## Step 1: Read All Scenario Step Specifications

**User says**: "Let's analyze the scenario to identify logical views"

**Your response**:
> "**Analyzing Scenario: [Scenario Number] [Scenario Name]**
>
> Let me read all scenario step specifications to identify logical views..."

**Actions**:
1. List all scenario step folders in `../[Scenario]/`
2. Read each `[Step].md` specification file
3. Note step names, purposes, and any "inherit from" or "base page" references

---

## Step 2: Identify Logical Views

**Actions**:

For each scenario step, determine:
- Is this a **new logical view** (new page/screen)?
- Or does it **reuse an existing logical view** (same page, different state)?

**Key indicators of SAME logical view**:
- Spec says "inherit from [other step]"
- Spec says "same structure as [other step]"
- Same page name (e.g., "Family Page" in 1.5, 1.7, 1.9)
- Overlay/modal/confirmation on existing page

**Key indicators of NEW logical view**:
- Completely different page structure
- Different purpose and user context
- No reference to inheriting from another step

**Your response**:
> "**Logical Views Identified:**
>
> **View 1: [Logical View Name]**
> - Used by: [Step], [Step], [Step]
> - Type: [Full page / Modal / Overlay]
> - States: [List different states]
>
> **View 2: [Logical View Name]**
> - Used by: [Step]
> - Type: [Full page / Form / etc.]
> - States: [List states]
>
> **View 3: [Logical View Name]**
> - Used by: [Step], [Step]
> - Type: [Full page]
> - States: [List states]
>
> **Total**: [N] logical views identified across [M] scenario steps
>
> **Does this mapping look correct?** (Y/N)"

---

## Step 3: User Reviews & Confirms Mapping

**Wait for response**

**If user says "N"**:
- Ask what needs adjustment
- Update logical view mapping
- Re-present for confirmation

**If user says "Y"**:
> "✅ Logical view mapping confirmed!
>
> **Which logical view should we build first?**
>
> (Suggest starting with most foundational view)"

---

## Step 4: Create Logical View Map Document

**Actions**:

Create `work/Logical-View-Map.md` with:

```markdown
# Scenario [N] - Logical View Map

**Scenario**: [Scenario Name]
**Created**: [Date]

## Logical Views

### [View Name]
- **Type**: [Full page / Modal / Overlay]
- **HTML File**: `[file-name].html`
- **Used by**:
  - [Step] [Step Name] - [State description]
  - [Step] [Step Name] - [State description]
- **States**:
  1. [State name] - [Description]
  2. [State name] - [Description]

### [View Name]
...

## Build Order

Suggested order:
1. [View] (foundational)
2. [View] (depends on 1)
3. [View]
...

## Notes

[Any important observations about the scenario structure]
```

**Your response**:
> "✅ Created: `work/Logical-View-Map.md`
>
> This document maps all logical views and their states for reference.
>
> **Ready to proceed to Phase 3?** (Y)"

---

## Next Phase

**Go to**: `3-logical-view-breakdown.md` when user confirms

---

## 📝 **Example Output**

**Scenario 1: Customer Onboarding**

**Logical Views Identified**:

**View 1: Family Overview**
- Used by: 1.5, 1.7, 1.9
- Type: Full page
- States: 
  - Creator only (1.5)
  - With dog (1.7)
  - With dog + member (1.9)

**View 2: Create Family Form**
- Used by: 1.4
- Type: Full page
- States: Create mode, Edit mode

**View 3: Add Dog Form**
- Used by: 1.6
- Type: Full page
- States: Empty form, validation errors

**Total**: 7 logical views across 9 scenario steps

