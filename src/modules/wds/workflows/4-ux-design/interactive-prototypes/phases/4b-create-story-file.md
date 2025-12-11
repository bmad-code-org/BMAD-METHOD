# Phase 4b: Create Story File

**Purpose**: Create the focused story file for this section with all implementation details

**Task**: Use story template to create complete, clear instructions for implementation

---

## When to Use This Phase

- ✅ Requirements gathered (Phase 4a complete)

---

## Step 1: Create Story File

**Actions**:

Create `stories/[View].[N]-[section-name].md` using this structure:

```markdown
# [View Name] - Section [N]: [Section Name]

**Status**: 🔨 In Progress
**Estimated Time**: ~X min
**Created**: [Date]

## Purpose

[Why this section exists, what it accomplishes]

## Specifications Reference

**Source specs**:
- [Step] [Step Name] - [Relevant sections]
- [Step] [Step Name] - [Relevant sections]

## Objects in This Section

### [Object ID]
- **Type**: [Button / Input / Card / etc.]
- **Label/Content**: [Text or description]
- **Behavior**: [What it does]
- **States**: [Which states show/hide/modify this]
- **Spec reference**: [Step].[Section]

[... repeat for each object]

## HTML Structure to Build

```html
<div data-object-id="section-container" class="[tailwind-classes]">
  <!-- Section content -->
</div>
```

## Tailwind Classes to Use

**Container**: `[classes]`
**Elements**: `[classes]`
**States**: `[classes for different states]`

## JavaScript Requirements

**Functions needed**:
```javascript
function [functionName]() {
  // [What it does]
}
```

**State handling**:
```javascript
if (state === '[state-name]') {
  // Show/hide/modify elements
}
```

## Demo Data Requirements

**Data needed**: `data/demo-data.json` → `[path.to.data]`

## Acceptance Criteria

- [ ] All objects visible and positioned correctly
- [ ] All Object IDs present
- [ ] Responsive at 375px
- [ ] State handling works
- [ ] Console shows logs
- [ ] Matches spec

## Test Instructions

1. Open `[View].html`
2. [Action] → Expected: [Result]
3. [Action] → Expected: [Result]
4. Console shows: "[Expected log]"
5. Test at 375px

## Notes

[Important considerations for implementation]
```

---

## Step 2: Present Story to User

**Your response**:
> "✅ Story file created: `stories/[View].[N]-[section-name].md`
>
> **Summary**:
> - Objects: [N] objects defined
> - Functions: [N] JavaScript functions needed
> - States: [List which states this section handles]
> - Estimated time: ~[X] min
>
> This story has everything needed to implement this section correctly.
>
> **Would you like to**:
> - Review the story first? (I'll show you the key parts)
> - Trust the plan and start implementing? (faster)
>
> **Your choice?** (review/implement)"

---

## Step 3: Handle User Response

**If user says "review"**:
- Show key sections of the story file
- Answer any questions
- Make adjustments if needed
- Ask: "Ready to implement now? (Y)"

**If user says "implement"** or "Y":
> "Perfect! Moving to implementation..."

---

## Next Phase

**Go to**: `4c-implement-section.md`

