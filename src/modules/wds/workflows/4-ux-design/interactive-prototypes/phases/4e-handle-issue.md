# Phase 4e: Handle Issue

**Purpose**: Fix reported issues in the section

**Task**: Identify, fix, document, and re-test

---

## When to Use This Phase

- ✅ User reported an issue with the implemented section

---

## Step 1: Acknowledge Issue

**Your response**:
> "I see the issue with [specific problem].
>
> **Analysis**: [Why it's happening]
> **Fix**: [What needs to change]
>
> Let me fix that now..."

---

## Step 2: Fix the Issue

**Actions**:

1. Identify the root cause
2. Make the specific fix in the code
3. Test the fix mentally (does it solve the problem?)
4. Keep the fix focused and local

**Console logging**:
```
🔧 Fixing issue: [description]
✅ Fixed: [what was changed]
```

---

## Step 3: Update Story File with Learning

**Add to story file** `stories/[View].[N]-[section-name].md`:

```markdown
## Changes Made

**[Date]**: Fixed [issue]
- **Problem**: [What was wrong]
- **Root cause**: [Why it happened]
- **Solution**: [What was changed]
- **Code change**: [Specific change made]
- **Learned**: [What to do differently next time]
```

---

## Step 4: Re-present for Testing

**Your response**:
> "✅ **Issue fixed!**
>
> **What changed**:
> - [Specific change made]
>
> **Why it works now**:
> - [Explanation of fix]
>
> Please test again:
> 1. [Specific test for the fix]
> 2. [General retest]
>
> **Working correctly now?**"

---

## Next Phase

**Loop**: Go back to `4d-present-for-testing.md` (user tests again)

**Note**: This may loop multiple times until issue is resolved

