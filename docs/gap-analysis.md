# Gap Analysis: Codebase-Reality Task Validation

## Overview

Gap Analysis is a critical feature in BMAD v6 that ensures story implementation tasks accurately reflect the current state of your codebase. By scanning your project before development begins, it prevents duplicate implementations, identifies missing dependencies, and adapts tasks to leverage existing code.

## The Problem

### Before Gap Analysis

**Batch Planning Scenario:**
```
Day 1: Plan all stories
- Story 1.1: "Create validation.ts with EmailValidator"
- Story 1.2: "Create user service using validation"
- Story 1.3: "Add signup with validation"

Day 2: Develop Story 1.1
- Creates validation.ts ✅

Day 3: Develop Story 1.2
- Story still says "Create validation.ts"
- Dev agent creates it AGAIN ❌
- Now have duplicate code
```

**Result:** Wasted time, duplicate implementations, confusion about which code to use.

### The Root Cause

Stories planned ahead of time become **stale** the moment you implement earlier stories. The codebase evolves, but static story files don't adapt.

## The Solution

Gap Analysis happens at **dev-time** (when `dev-story` runs) to ensure tasks reflect **current codebase reality**.

### How It Works

```
┌─────────────────────────────────────────────┐
│  create-story                               │
│  • Requirements analysis                     │
│  • DRAFT tasks (requirements-based)         │
│  • Status: ready-for-dev                    │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  dev-story                                   │
│  Step 1.5: GAP ANALYSIS                     │
│  • Scan codebase (Glob/Grep/Read)           │
│  • Document What Exists vs What's Missing   │
│  • Propose task refinements                 │
│  • Get user approval                         │
│  • Update story with refined tasks          │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
          Implementation begins
          with ACCURATE tasks
```

## Usage

### Standard Workflow

1. **Plan Stories** (same as before):
   ```bash
   /create-story
   ```
   - Generates requirements, acceptance criteria
   - Creates **DRAFT tasks** based on requirements
   - Status: `ready-for-dev`

2. **Develop Story**:
   ```bash
   /dev-story
   ```
   - Step 1.5 runs **automatically**
   - Scans codebase
   - Shows findings and proposed task updates
   - Asks for approval

### Approval Options

When gap analysis presents findings, you have 6 options:

| Option | Description | When to Use |
|--------|-------------|-------------|
| **[Y]** Yes | Approve and proceed | Trust the analysis |
| **[A]** Auto-accept | Apply + auto-accept future refinements | Full automation mode |
| **[n]** No | Keep draft tasks | You know better than the scan |
| **[e]** Edit | Manually adjust proposed tasks | Want custom changes |
| **[s]** Skip | Halt development | Something looks wrong |
| **[r]** Review | Deeper inspection first | Need more details |

### Example Session

```
📊 Gap Analysis Complete

Codebase Scan Results:

✅ What Exists:
- src/lib/validation.ts (EmailValidator implemented)
- src/api/user.routes.ts (basic CRUD endpoints)
- 15 existing test files with 82% coverage

❌ What's Missing:
- No authentication service layer
- No PhoneValidator
- No auth-related tests

---

📝 Proposed Task Updates:

ADDED TASKS (new prerequisites discovered):
+ Create src/services/auth.service.ts (dependency found)

MODIFIED TASKS (adjusted for codebase reality):
- [ORIGINAL] Create src/lib/validation.ts
+ [UPDATED]  Extend validation.ts with PhoneValidator (file exists)

REMOVED TASKS (already complete):
× Setup testing framework (jest.config.js exists)

Approve these task updates? [Y/A/n/e/s/r]
```

## Auto-Accept Mode

For full automation, use **[A] Auto-accept** option:

```bash
User: "Yes, just auto-accept whatever tasks you discover"
```

Benefits:
- No repeated prompts for remaining stories
- All refinements applied automatically
- Still documented in Change Log
- Perfect for CI/CD or batch processing

## Planning Styles Supported

### 1. Just-in-Time Planning

```
Day 1: Plan Story 1.1 → Develop Story 1.1
Day 2: Plan Story 1.2 → Develop Story 1.2
```

**Gap Analysis Impact:** Minimal changes (tasks stay mostly accurate)

### 2. Batch Planning

```
Day 1: Plan Stories 1.1, 1.2, 1.3, 1.4, 1.5
Day 2-5: Develop all stories sequentially
```

**Gap Analysis Impact:** Critical (prevents duplicate code from stale plans)

### 3. Mid-Sprint Planning

```
Week 1: Stories 1.1-1.3 completed
Week 2: Plan Stories 1.4-1.7 (codebase has evolved)
```

**Gap Analysis Impact:** Adapts to new foundation built by earlier stories

## Story File Updates

### Draft Tasks (from create-story)

```markdown
## Tasks / Subtasks

⚠️ **DRAFT TASKS** - Generated from requirements analysis.
Will be validated and refined against actual codebase when dev-story runs.

- [ ] Create src/lib/validation.ts
- [ ] Implement EmailValidator
- [ ] Write validator tests
```

### After Gap Analysis (from dev-story)

```markdown
## Gap Analysis

Scanned: 2025-01-18 at 10:00 AM

✅ What Exists:
- src/lib/validation.ts (EmailValidator)
- 15 test files with 82% coverage

❌ What's Missing:
- No PhoneValidator
- No validation tests for phone numbers

Task Changes Applied:
- MODIFIED: "Create validation.ts" → "Extend validation.ts with PhoneValidator"
- MODIFIED: "Write tests" → "Add PhoneValidator tests to validation.test.ts"
- REMOVED: "Set up testing framework" (already configured)

---

## Tasks / Subtasks

- [ ] Extend src/lib/validation.ts with PhoneValidator
- [ ] Add PhoneValidator tests to validation.test.ts
```

## Benefits

### 1. Prevents Duplicate Code
- Scans before creating files
- Suggests "extend" instead of "create"
- Identifies reusable code

### 2. Discovers Missing Dependencies
- Identifies prerequisites stories assumed exist
- Adds missing tasks automatically
- Prevents mid-implementation blockers

### 3. Removes Completed Work
- Detects features already implemented
- Removes redundant tasks
- Saves development time

### 4. Works for All Planning Styles
- Just-in-time: Validates assumptions
- Batch planning: Corrects staleness
- Mid-sprint: Adapts to evolved codebase

### 5. Maintains Story Accuracy
- Documents scan results
- Updates Change Log
- Preserves decision history

## Migration Guide

### Existing Projects

If you have stories created before this feature:

1. **No action required** - gap analysis runs automatically when you use `dev-story`
2. **First story per epic** will perform full analysis
3. **User approval required** before tasks change
4. **Opt-out available** with [n] option if needed

### For Custom Workflows

If you've customized `create-story` or `dev-story`:

1. **Merge carefully** - gap analysis is in Step 1.5
2. **Preserve custom logic** - gap analysis is self-contained
3. **Test thoroughly** - validate with your customizations

## Technical Details

### Scan Targets

Gap analysis uses:
- **Glob** - Find files matching patterns (`**/*.ts`, `**/*.test.ts`)
- **Grep** - Search for classes, functions, components
- **Read** - Verify implementation details

### Performance

- Typical scan: **5-10 seconds** for medium codebase
- Runs **once per story** at dev-time
- No performance impact on `create-story`

### Safety

- **Read-only scans** - never modifies codebase
- **User approval required** - no automatic rewrites
- **Documented changes** - all modifications tracked
- **Reversible** - can reject refinements

## Troubleshooting

### "Tasks keep changing every time I run dev-story"

**Cause:** Codebase evolving between attempts
**Solution:** This is expected! Gap analysis adapts to current state. If unwanted, use [n] to keep original tasks.

### "Gap analysis removed a task I need"

**Cause:** Scan detected the task is already complete
**Solution:** Use [e] Edit option to manually add the task back, or verify the feature truly exists.

### "Scan found files but doesn't recognize they're complete"

**Cause:** Implementation doesn't match task description
**Solution:** Gap analysis is conservative. Use [e] Edit to refine, or [n] to keep original tasks.

### "I want to skip gap analysis entirely"

**Not recommended**, but possible:
- Select [n] No to keep draft tasks
- Risk: Duplicate implementations, wasted time

## FAQ

### Q: Does gap analysis slow down development?

**A:** Minimal impact (5-10 seconds). Prevents hours of duplicate work and debugging.

### Q: Can I disable gap analysis?

**A:** Select [n] when prompted. Not recommended for batch planning.

### Q: What if scan misses something?

**A:** Use [e] Edit to manually adjust tasks before proceeding.

### Q: Does this work with custom workflows?

**A:** Yes. Gap analysis is self-contained in Step 1.5 of dev-story.

### Q: What about greenfield projects?

**A:** Gap analysis runs but finds nothing (instant). Confirms blank slate. No harm done.

### Q: Can I auto-accept for just this session?

**A:** Yes! Use [A] Auto-accept. Preference doesn't persist across sessions.

## Best Practices

1. **Trust the analysis** - It's based on actual code scans, not guesses
2. **Use auto-accept for known-good repos** - Speeds up batch development
3. **Review findings on first use** - Understand what gap analysis detects
4. **Edit when needed** - You know your codebase better than scans
5. **Don't skip for batch planning** - This is when gap analysis shines

## Contributing

Found an issue or want to improve gap analysis?

1. Open an issue in [BMAD-METHOD repo](https://github.com/bmad-code-org/BMAD-METHOD)
2. Discuss in Discord #general-dev
3. Submit PR following [contribution guidelines](../CONTRIBUTING.md)

---

**Gap Analysis ensures BMAD stories reflect reality, not aspirations.**
