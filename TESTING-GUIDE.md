# Testing Guide: Gap Analysis Features

## Setup Complete ✅

Your project (`~/git/your-project`) is configured to use the dev version via symlink:

```
~/git/your-project/_bmad/bmm → ~/git/BMAD-METHOD/src/modules/bmm
```

All changes from `feature/gap-analysis-dev-time` branch are **live and testable**.

---

## Test Scenarios

### Test 1: Basic Gap Analysis (Recommended First)

**Goal:** Verify gap analysis runs and proposes task updates

```bash
cd ~/git/your-project

# Load PM or Dev agent
# Run:
/dev-story

# Expected:
# → Loads next ready-for-dev story
# → Step 1.5 runs automatically
# → Shows "📊 Gap Analysis Complete"
# → Presents task updates
# → Asks: "Approve these task updates? [Y/A/n/e/s/r]"

# Test each option:
# [Y] - Approve and proceed
# [A] - Auto-accept mode
# [n] - Keep draft tasks
# [e] - Edit manually
# [r] - Review details
# [s] - Skip story
```

**Success Criteria:**
- ✅ Gap analysis runs automatically
- ✅ Scans codebase with Glob/Grep/Read
- ✅ Proposes accurate task updates
- ✅ Updates story file when approved
- ✅ Adds "Gap Analysis" section to story

---

### Test 2: Batch Planning Staleness Detection

**Goal:** Verify gap analysis catches code from earlier stories

```bash
# Create 3 stories in batch
/create-story  # Story 1.1
/create-story  # Story 1.2
/create-story  # Story 1.3

# All will have "DRAFT TASKS" notation

# Develop Story 1.1
/dev-story
# Gap analysis: likely finds nothing (first story)
# Approve and implement

# Develop Story 1.2
/dev-story
# Gap analysis: should detect Story 1.1's code!
# Proposes task refinements: "Extend X" instead of "Create X"

# Develop Story 1.3
/dev-story
# Gap analysis: should detect Stories 1.1-1.2's code!
# Proposes even more refinements
```

**Success Criteria:**
- ✅ Story 1.1: Gap analysis finds minimal existing code
- ✅ Story 1.2: Gap analysis detects Story 1.1's implementations
- ✅ Story 1.3: Gap analysis detects Stories 1.1-1.2's work
- ✅ Tasks get refined based on cumulative codebase state

---

### Test 3: Standalone Gap Analysis (Audit Tool)

**Goal:** Audit completed stories without starting development

```bash
# Load any agent
/gap-analysis

# When prompted, try:

# Option 1: Audit by status
Enter: "done"
# Should list all done stories, ask which to validate

# Option 2: Audit specific story
Enter: "1-2-auth"
# Should validate that specific story

# Option 3: Audit by file path
Enter: "docs/sprint-artifacts/1-2-auth.md"
# Should validate that story file

# Expected output:
# → Scans codebase
# → Shows "What Exists" vs "What's Missing"
# → Detects false positives (marked done but code missing)
# → Presents options: [U]pdate, [A]udit report, [N]o changes, [R]eview, [Q]uit
```

**Success Criteria:**
- ✅ Can audit stories by status
- ✅ Can audit specific story
- ✅ Detects false positives
- ✅ Can update story file with findings
- ✅ Can generate audit reports

---

### Test 4: Super-Dev-Story (Enhanced Quality)

**Goal:** Verify comprehensive quality workflow

```bash
# Load any agent
/super-dev-story

# Expected flow:
# 1. Executes dev-story Steps 1-8 (including pre-dev gap analysis)
# 2. After all tasks complete...
# 3. Step 9.5: Post-dev gap analysis runs
#    - Re-scans codebase
#    - Verifies all checked tasks actually implemented
#    - If gaps: adds tasks, loops back to step 5
# 4. Step 9.6: Auto code review runs
#    - Reviews all changed files
#    - Finds security/quality issues
#    - If critical/high: adds tasks, loops back to step 5
#    - If medium/low: asks to fix or document
# 5. Story marked "review" only after passing all gates
```

**Success Criteria:**
- ✅ Executes all dev-story steps
- ✅ Runs post-dev gap analysis
- ✅ Runs code review automatically
- ✅ Loops back if issues found
- ✅ Only marks done after validation passes

---

### Test 5: Auto-Accept Mode

**Goal:** Verify automation-friendly flow

```bash
/dev-story

# When gap analysis prompts:
Select: [A] Auto-accept

# Continue developing more stories:
/dev-story  # Story 2
/dev-story  # Story 3

# Expected:
# → Gap analysis runs for each
# → No prompts after first [A]
# → All refinements auto-applied
# → Still documented in Change Log
```

**Success Criteria:**
- ✅ First prompt allows [A] selection
- ✅ Future stories auto-apply without prompting
- ✅ All changes documented
- ✅ Can be used for CI/CD automation

---

## Edge Cases to Test

### Edge Case 1: Greenfield First Story

```bash
# Brand new project, no code yet
/dev-story  # Story 1.1

# Expected:
# → Gap analysis scans
# → Finds nothing (empty project)
# → Proposes no changes
# → Auto-proceeds to implementation
```

### Edge Case 2: Everything Already Exists

```bash
# Story tasks say "Create X"
# But X already fully implemented

# Expected:
# → Gap analysis detects X exists
# → Proposes removing "Create X" task
# → Story might be already complete!
```

### Edge Case 3: Partial Implementation

```bash
# Story says "Create auth service"
# But partial auth service exists (50% complete)

# Expected:
# → Gap analysis detects partial implementation
# → Proposes: "Complete auth service implementation"
# → Notes what exists vs what's missing
```

## Validation Checks

After each test, verify:

- [ ] Story file updated with "Gap Analysis" section
- [ ] Change Log includes gap analysis entry
- [ ] Tasks reflect codebase reality
- [ ] False positives caught and corrected
- [ ] Duplicate implementations prevented

## Performance Benchmarks

Track these metrics:

| Workflow | Tokens | Time | Quality Score |
|----------|--------|------|---------------|
| dev-story (no gap) | Baseline | Baseline | ? |
| dev-story (with gap) | +5-10K | +10s | Higher |
| super-dev-story | +30-50K | +20-30% | Highest |

## Rollback (If Issues Found)

```bash
cd ~/git/your-project/_bmad
rm bmm
mv bmm.backup bmm

# Report issues found
```

## Reporting Issues

If you find problems:

1. **Note the scenario** - What story, what workflow, what happened
2. **Check logs** - Any errors in Dev Agent Record
3. **Save examples** - Story files before/after gap analysis
4. **Report in Discord** - #general-dev channel
5. **Or open issue** - Use bug report template

Include:
- Story file (before gap analysis)
- Gap analysis output
- Expected vs actual behavior
- BMAD version (`npx bmad-method@alpha --version`)

## Success Indicators

You'll know it's working when:

- ✅ Story 1.2 detects Story 1.1's code and refines tasks
- ✅ Duplicate implementations prevented
- ✅ False positive completions caught
- ✅ Story accuracy improves over time
- ✅ Less rework needed during human review

## Next Steps After Testing

1. Gather feedback from real usage
2. Note any false positives/negatives in scanning
3. Identify improvements to gap analysis logic
4. Document any edge cases found
5. Ready to create PR if working well!

---

**Testing is the critical step before contribution!** 🧪
