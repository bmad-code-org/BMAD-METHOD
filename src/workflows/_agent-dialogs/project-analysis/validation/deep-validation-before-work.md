# Deep Validation Before Work (Tier 2)

**Purpose**: Thoroughly validate selected section before starting work  
**When**: User has selected a task, before agent begins working  
**Time**: 5-10 seconds  
**Scope**: ONLY the selected phase/scenario

---

## Why Deep Validation?

**Problem**: User selects "Continue Scenario 03" but:

- Outline says 8 pages, reality has 6
- 2 pages deleted since outline update
- Files modified recently, outline outdated
- Dependencies changed

**Solution**: Deep check ensures agent has accurate context before work starts.

---

## What to Check

### 1. File Existence & Completeness

**Check ALL files** claimed by outline for this section:

```
Outline claims for Scenario 03:
  - 00-Scenario-Overview.md
  - 3.1-Landing-Page.md
  - 3.2-Feature-List.md
  - 3.3-Pricing.md
  - 3.4-FAQ.md
  - Prototypes/sketch-landing.html

Reality check:
✅ 00-Scenario-Overview.md exists (2.3 KB)
✅ 3.1-Landing-Page.md exists (15 KB)
⚠️  3.2-Feature-List.md MISSING
✅ 3.3-Pricing.md exists (8 KB)
❌ 3.4-FAQ.md exists but EMPTY (0 KB)
✅ Prototypes/ folder exists
❌ sketch-landing.html MISSING from Prototypes/
```

### 2. File Count & Unexpected Files

**Check for NEW files** not in outline:

```
Scanning docs/4-ux-design/03-pricing-page/...

Found 7 files, outline claims 6:
✅ Expected: 6 files
⚠️  Found: 7 files
📄 NEW: 3.5-Contact-Form.md (not in outline)
```

### 3. Modification Dates

**Compare outline update vs file changes**:

```
Outline last updated: 2024-11-15
Files modified:
  - 3.1-Landing-Page.md: 2024-12-01 (AFTER outline)
  - 3.3-Pricing.md: 2024-12-08 (AFTER outline)

⚠️  Files changed since outline updated
```

### 4. Dependencies

**For scenarios, check**:

- Related scenarios referenced
- Shared components mentioned
- Design system dependencies

```
Scenario 03 references:
  - Component: PricingCard (from Design System)
  - Dependency: Scenario 01 (User auth flow)

Checking dependencies:
✅ docs/7-design-system/components/PricingCard.md exists
⚠️  Scenario 01 shows "in_progress" but outline claims "complete"
```

---

## Report Format

```
🎨 Freya WDS Designer Agent

You selected: "Continue Scenario 03"

Deep validation of Scenario 03... ⚠️ Issues found

Validation Results:

📁 Folder: docs/4-ux-design/03-pricing-page/
✅ Folder exists and accessible

📄 Files (Outline claims 6, found 7):
✅ 00-Scenario-Overview.md (complete, 2.3 KB)
✅ 3.1-Landing-Page.md (complete, 15 KB)
❌ 3.2-Feature-List.md MISSING
✅ 3.3-Pricing.md (complete, 8 KB, modified after outline)
⚠️  3.4-FAQ.md exists but EMPTY (0 KB)
📄 3.5-Contact-Form.md NEW (not in outline)

🔗 Dependencies:
✅ PricingCard component (Design System)
⚠️  Scenario 01 dependency shows mismatch

🕒 Timeline:
Outline updated: 2024-11-15
Files modified: 2024-12-01, 2024-12-08 (2 files changed after)

💡 Before we continue, would you like to:

1. **Update outline first** (recommended)
   - Add 3.5-Contact-Form.md to outline
   - Mark 3.2-Feature-List.md as missing/deleted
   - Update page count (6 → 5 existing + 1 new)
   - Refresh last_updated date

2. **Fix missing/empty files**
   - Recreate 3.2-Feature-List.md
   - Complete 3.4-FAQ.md content
   - Then continue work

3. **Proceed anyway**
   - I'll work with current state
   - Update outline after work complete

Which approach would you prefer?
```

---

## Decision Tree

```
After deep validation:

All valid? ✅
    ↓
Start work immediately

Minor issues? ⚠️
    ↓
Ask user:
  - Update outline?
  - Proceed anyway?
    ↓
User chooses → Continue

Major issues? ❌
    ↓
Strongly recommend:
  - Fix missing files
  - Update outline
  - Review dependencies
    ↓
Don't start work until resolved
```

---

## After Validation

**If user chooses "Update outline first"**:

1. Agent updates `.wds-project-outline.yaml`
2. Reflects current reality
3. Then starts work

**If user chooses "Fix missing files"**:

1. Agent helps recreate/complete files
2. Updates outline
3. Then continues with original task

**If user chooses "Proceed anyway"**:

1. Agent works with current state
2. Updates outline AFTER work complete
3. Documents what was found vs expected

---

## Example: Freya Deep Validation

```
User: "Continue Scenario 03"

Freya: "Let me validate Scenario 03 before we start..."

[5 seconds of checking]

Freya: "I found the scenario folder with 5 pages:
- Landing page (complete)
- Pricing tiers (complete)
- FAQ (in progress)
- Contact form (not in outline - did you add this recently?)
- Missing: Feature comparison page

The outline expected 6 pages but I found 5 (one missing, one new).

Before designing more pages, shall I:
1. Update the outline to reflect these 5 pages?
2. Recreate the missing feature comparison page?
3. Continue with existing pages as-is?

What would work best for you?"
```

---

## Benefits

✅ **Prevents wasted work** - Agent knows true state  
✅ **Catches drift early** - Before it compounds  
✅ **Keeps outline accurate** - Forces sync with reality  
✅ **User stays informed** - Knows what's actually there  
✅ **Reduces confusion** - No surprises mid-work

---

**This is the second safety net after Tier 1 fast check!** 🛡️
