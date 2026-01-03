# Phase 4c: Implement Section

**Purpose**: Implement the section following the story file precisely

**Task**: Linear code generation - AI's strength!

---

## When to Use This Phase

- ✅ Story file created (Phase 4b complete)
- ✅ User approved story (or chose to proceed)

---

## Step 1: Begin Implementation

**Your response**:
> "📝 **Implementing Section [N]: [Section Name]**
>
> Following the story file instructions..."

---

## Step 2: Create or Update HTML File

**Actions**:

**For Section 1 ONLY**: 
- Create new HTML file from `templates/page-template.html`
- Name it: `[View].html`
- Place in prototype root folder

**For Sections 2+**:
- Open existing `[View].html` file
- Find insertion point (after previous section or before placeholder)

---

## Step 3: Add HTML Structure

**Follow story file precisely**:

1. Add HTML structure with Tailwind classes from story
2. Add all Object IDs on interactive elements
3. Add state-specific classes/attributes
4. Add placeholder content where specified

**Console logging**:
```
📝 Implementing Section [N]: [Section Name]
✅ Added HTML structure
✅ Added object: [object-id]
✅ Added object: [object-id]
```

---

## Step 4: Add JavaScript

**If section needs JavaScript**:

1. Add functions specified in story file
2. Add event listeners for interactive elements
3. Add state handling logic
4. Add console logging for debugging
5. Load demo data from `data/demo-data.json`

**Console logging**:
```
✅ Added JavaScript function: [function-name]
✅ Added state handling for: [states]
```

---

## Step 5: Add Placeholder for Remaining Sections

**If more sections remain**:

Add at the bottom of the HTML:

```html
<!-- 🚧 Coming Next: Section [N+1] -->
<div class="p-8 text-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
  <p class="text-lg">🚧 Section [N+1]: [Section Name]</p>
  <p class="text-sm">Coming next in development...</p>
</div>
```

---

## Step 6: Final Check

**Before presenting to user, verify**:
- [ ] All Object IDs from story file are present
- [ ] Tailwind classes match story file
- [ ] JavaScript functions implemented
- [ ] Console logging added
- [ ] Code is clean and readable
- [ ] No syntax errors

**Console logging**:
```
✅ Section [N] implementation complete!
```

---

## Next Phase

**Go to**: `4d-present-for-testing.md`

