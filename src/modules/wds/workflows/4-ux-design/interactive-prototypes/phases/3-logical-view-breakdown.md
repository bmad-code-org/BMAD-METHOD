# Phase 3: Logical View Selection & Section Breakdown

**Purpose**: Select a logical view to build and break it into implementable sections

**Note**: This creates the work plan, but NOT the story files yet (those are created just-in-time)

---

## When to Use This Phase

- ✅ Logical view mapping complete (Phase 2)
- ✅ User has selected which logical view to build

---

## Step 1: Confirm Logical View Selection

**User says**: "Let's build [Logical View Name]" or selects from list

**Your response**:
> "**Building Logical View: [View Name]**
>
> This view is used by: [List scenario steps]
>
> Let me analyze all specifications for this view..."

---

## Step 2: Gather All Specifications

**Actions**:

1. **Read all scenario step specs** that use this logical view
2. **Extract all Object IDs** across all states
3. **Identify unique objects** vs **state-specific objects**
4. **Note functional requirements** from all specs

**Your response**:
> "**Objects identified across all states:**
>
> **Shared across all states** ([N] objects):
> - [Object ID] [Description]
> - [Object ID] [Description]
> ...
>
> **State-specific** ([N] objects):
> - [Object ID] [Description] (only in [state])
> - [Object ID] [Description] (only in [state])
> ...
>
> **Total**: [N] unique objects
>
> **Does this match your expectations?** (Y/N)"

---

## Step 3: User Confirms Objects

**Wait for response**

**If user says "N"**:
- Ask what's missing or should be removed
- Update object list
- Re-present

**If user says "Y"**: Continue to section breakdown

---

## Step 4: Propose Section Breakdown

**Actions**:

1. **Group objects logically** into 4-8 sections
2. **Consider all states** when grouping
3. **Estimate time** per section

**Your response**:
> "**Proposed Section Breakdown:**
>
> **Section 1: [Section Name]** (~X min)
> - Objects: [Object IDs]
> - States covered: [All / Specific states]
>
> **Section 2: [Section Name]** (~X min)
> - Objects: [Object IDs]
> - States covered: [All / Specific states]
>
> **Section 3: [Section Name]** (~X min)
> - Objects: [Object IDs]
> - States covered: [All / Specific states]
>
> ...
>
> **Total**: [N] sections, ~[X] hours
>
> **Approve this breakdown?** (Y/N)"

---

## Step 5: User Reviews Section Breakdown

**Wait for response**

**If user says "N"**:
- Ask what needs adjustment
- Revise section breakdown
- Re-present

---

## Step 6: Create Work File

**When user approves**:

**Actions**:

Create `work/[View-Name]-Work.yaml` with:

```yaml
logical_view: "[View Name]"
html_file: "[file-name].html"
scenario_steps:
  - step: "1.5"
    state: "Creator only"
  - step: "1.7"
    state: "With dog"
  - step: "1.9"
    state: "With dog + member"

sections:
  - id: 1
    name: "[Section Name]"
    objects:
      - "[object-id]"
      - "[object-id]"
    states: "all"
    estimated_time: "X min"
    status: "pending"
    
  - id: 2
    name: "[Section Name]"
    objects:
      - "[object-id]"
    states: "1.7, 1.9 only"
    estimated_time: "X min"
    status: "pending"

total_sections: N
total_estimated_time: "X hours"
created: "[date]"
status: "ready_to_build"
```

**Your response**:
> "✅ Work File created: `work/[View-Name]-Work.yaml`
>
> **Build plan complete!**
>
> **Next**: We'll build section-by-section. For each section:
> 1. Create focused story file
> 2. Implement section
> 3. You test & approve
> 4. Move to next section
>
> **Ready to start Section 1?** (Y)"

---

## Next Phase

**Go to**: `4-section-story-and-implementation.md` when user says "Y"

---

## 📝 **Example: Dog Family Overview**

**Section Breakdown:**

**Section 1: Header & Family Info** (~15 min)
- Objects: `family-picture`, `family-dropdown`, `family-description`, `edit-btn`
- States: All states

**Section 2: Dogs Section** (~20 min)
- Objects: `dogs-section-header`, `dog-card`, `add-dog-btn`, `dog-menu`
- States: Empty (1.5), With dog (1.7, 1.9)

**Section 3: Members Section** (~20 min)
- Objects: `members-section-header`, `member-card`, `add-member-btn`, `pending-badge`
- States: Creator only (1.5, 1.7), With pending member (1.9)

**Section 4: Bottom Navigation** (~10 min)
- Objects: `bottom-nav`, `nav-items` × 5
- States: All states

**Total**: 4 sections, ~65 min

