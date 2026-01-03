# Autonomous Epic Processing v2.0

**"Do Epic 4 for me" - Full automation of epic completion with anti-vibe-coding enforcement**

## What It Does

Autonomous epic processing combines just-in-time planning with disciplined automated development:

```
/autonomous-epic 2

→ Creates Story 2.1 (if backlog) → super-dev-pipeline → Commits → Done ✅
→ Develops Story 2.2 → super-dev-pipeline → Commits → Done ✅
→ Develops Story 2.3 → super-dev-pipeline → Commits → Done ✅
...
→ Entire Epic 2 complete! 🎉
```

## How It Works

```
┌──────────────────────────────────────────────────┐
│  Autonomous Epic Processor v2.0                   │
│                                                   │
│  For each story in epic (sequential):             │
│  ┌─────────────────────────────────────────────┐ │
│  │ 1. create-story (if backlog)                 │ │
│  │    ↓                                         │ │
│  │ 2. super-dev-pipeline (step-file discipline) │ │
│  │    ├─ Pre-gap analysis (validate existing)   │ │
│  │    ├─ Adaptive implementation (TDD/refactor) │ │
│  │    ├─ Post-validation (catch false positives)│ │
│  │    ├─ Code review (find 3-10 issues)         │ │
│  │    └─ Complete (commit + push)               │ │
│  │    ↓                                         │ │
│  │ 3. Verify completion (task-based)            │ │
│  │    ↓                                         │ │
│  │ 4. Save progress                             │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  Epic completion report generated                 │
└──────────────────────────────────────────────────┘
```

## Usage

### Basic Usage

```bash
# Load any BMAD agent
/autonomous-epic

# Will prompt for epic number:
Enter epic number: 2

# Or provide directly:
/autonomous-epic epic-2
```

### With Defaults

```bash
/autonomous-epic 3

# Uses default settings:
# ✅ super-dev-story (comprehensive quality)
# ✅ Auto-accept gap analysis
# ✅ Create git commits
# ✅ Continue on errors
```

### With Custom Settings

```bash
/autonomous-epic 3

# When prompted:
[C] Custom settings

# Then configure:
# - dev-story or super-dev-story?
# - Auto-accept gap analysis?
# - Create git commits?
# - Halt on error or continue?
```

## Configuration

### Default Settings (workflow.yaml)

```yaml
autonomous_settings:
  use_super_dev_pipeline: true     # Use super-dev-pipeline (step-file discipline)
  pipeline_mode: "batch"           # Batch mode for autonomous execution
  halt_on_error: false             # Continue even if story fails
  max_retry_per_story: 2           # Retry failed stories
  create_git_commits: true         # Commit after each story
  git_branch_prefix: "auto-epic-"  # Branch: auto-epic-{epic_num}

# super-dev-pipeline features
super_dev_pipeline_features:
  token_efficiency: "40-60K per story (vs 100-150K)"
  works_for: "Both greenfield AND brownfield"
  anti_vibe_coding: "Step-file architecture prevents deviation"
  brownfield_support: "Validates existing code before implementation"

# Task-based completion verification
completion_verification:
  task_based_completion: true       # Check actual tasks, not just status
  process_review_with_unchecked: true  # Process "review" stories with unchecked tasks
  process_done_with_unchecked: true    # Process "done" stories if tasks remain
  verify_after_development: true    # Re-check after each story
  strict_epic_completion: true      # Epic only done when ALL tasks complete
```

### Task-Based Completion (Important!)

**The autonomous epic workflow now uses TASK-BASED completion**, not just status-based:

| What Changed | Old Behavior | New Behavior |
|--------------|--------------|--------------|
| "review" status | ⏭️ Skipped | ✅ Processed if unchecked tasks exist |
| "done" status | ⏭️ Skipped | ✅ Verified, processed if tasks remain |
| Completion check | Status-based | Task-based (count `- [ ]`) |
| Epic marked done | When all stories "done" | When ALL tasks `- [x]` |

**Why this matters:** Code reviews often add new tasks (CR-1, CR-2, etc.) that need implementation. The old workflow would skip these stories because they were marked "review". Now we scan for actual unchecked tasks.

```
📊 Epic 4 Status (Task-Based Analysis)

By Actual Task Completion:
- ✅ Truly Done: 0 (all tasks checked, will skip)
- 🔧 Needs Work: 7 (has unchecked tasks)
    4-1: 6 unchecked (CR tasks)
    4-2: 4 unchecked (original work)
    4-3: 7 unchecked (CR tasks)
    ...
- 📝 Backlog: 0 (will create + develop)
```

### Per-Epic Override

```yaml
# In sprint-status.yaml or epic frontmatter
epic-3:
  autonomous_settings:
    use_super_dev: false  # Use dev-story (faster)
    halt_on_error: true   # Stop on first failure
```

## Time & Cost Estimates (v2.0)

### Time per Story

| Workflow | Avg Time per Story | Token Usage |
|----------|-------------------|-------------|
| **super-dev-pipeline** (default) | 20-45 minutes | 40K-60K |
| story-pipeline (greenfield only) | 15-30 minutes | 25K-30K |
| super-dev-story (legacy) | 25-50 minutes | 100K-150K |

### Epic Estimates (using super-dev-pipeline)

| Epic Size | Time Estimate | Token Estimate |
|-----------|--------------|----------------|
| Small (3-5 stories) | 2-5 hours | 120K-300K |
| Medium (6-10 stories) | 5-10 hours | 400K-600K |
| Large (11-20 stories) | 10-20 hours | 880K-1.2M |

**Savings vs v1.0:** ~50% token reduction, ~25% time reduction

**Recommendation:** Run overnight for large epics

## Example Session

```
🤖 Autonomous Epic Processing

Enter epic number: 2

📊 Epic 2 Status
Total stories: 8
- Backlog: 5 (will create + develop)
- Ready-for-dev: 2 (will develop)
- In-progress: 1 (will resume)
- Review: 0
- Done: 0

Work Remaining: 8 stories
Estimated Time: 4-6 hours
Estimated Tokens: ~800K-1.2M

Proceed? [Y/C/n]: Y

✅ Starting autonomous epic processing...

📝 Created git branch: auto-epic-2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Story 1/8: 2-1-user-registration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: backlog

📝 Creating story 2-1-user-registration...
✅ Story created

💻 Developing story using super-dev-pipeline...
  Init: ✅ Greenfield detected
  Pre-gap: ✅ 2 tasks refined, 1 added
  Implementation: ✅ 9 tasks completed (TDD)
  Post-validation: ✅ All verified
  Code review: ✅ 4 issues found and fixed
  Complete: ✅ Committed + pushed
✅ Story complete (38 minutes, 48K tokens)

📝 Committed: a1b2c3d

Progress: 1 ✅ | 0 ❌ | 7 pending

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Story 2/8: 2-2-user-login
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Creating story 2-2-user-login...
✅ Story created

💻 Developing story using super-dev-story...
  Pre-gap: ✅ Reusing registration code (3 tasks refined)
  Development: ✅ 6 tasks completed
  Post-gap: ✅ All verified
  Code review: ⚠️ 1 medium issue found
  Code review: ✅ Issue fixed
✅ Story complete (38 minutes, 110K tokens)

📝 Committed: d4e5f6g

Progress: 2 ✅ | 0 ❌ | 6 pending

[... continues for all 8 stories ...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 EPIC 2 AUTONOMOUS PROCESSING COMPLETE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Results:
✅ Stories completed: 8/8
❌ Stories failed: 0

Statistics:
- Total time: 5h 23m
- Files created/modified: 47
- Test coverage: 94%
- Code review issues: 6 (all fixed)

Git Branch: auto-epic-2
Commits: 8

Next Steps:
1. Review completion report
2. Run human code review
3. Merge auto-epic-2
```

## Progress Tracking

### Progress File

Autonomous epic maintains state in `.autonomous-epic-{{epic_num}}-progress.yaml`:

> **Note:** Each epic gets its own tracking file to support parallel epic processing.
> For example: `.autonomous-epic-02-progress.yaml` for epic 02.
>
> **Backwards Compatibility:** The workflow checks for both the new format
> (`.autonomous-epic-02-progress.yaml`) and legacy format
> (`.autonomous-epic-progress-epic-02.yaml`) when looking for existing progress files.

```yaml
epic_num: 2
started: 2025-01-18T10:00:00Z
total_stories: 8
completed_stories:
  - 2-1-user-registration
  - 2-2-user-login
failed_stories: []
current_story: 2-3-password-reset
status: running
```

### Resume from Interruption

If interrupted (crash, manual stop, timeout):

```bash
/autonomous-epic 2

# Detects existing progress file
# Shows: "Found in-progress epic processing. Resume? [Y/n]"
# Continues from last completed story
```

## Error Handling

### Story Failures

**With `halt_on_error: false` (default):**
```
Story 2.3 fails
→ Logged in failed_stories
→ Continue to Story 2.4
→ Report failures at end
```

**With `halt_on_error: true`:**
```
Story 2.3 fails
→ Stop processing immediately
→ Report error
→ User fixes manually
→ Resume from Story 2.3
```

### Retry Logic

Each story gets {{max_retry_per_story}} attempts (default: 2):

```
Story 2.5 fails
→ Retry 1/2: Attempt again
→ Retry 2/2: Attempt again
→ Max retries: Mark failed, continue to next story
```

## Git Integration

### Automatic Branching

```bash
# Autonomous epic creates:
Branch: auto-epic-{epic_num}

# Example:
/autonomous-epic 3
→ Creates branch: auto-epic-3
```

### Commits per Story

Each story gets its own commit:

```
feat(epic-2): complete story 2-1-user-registration
feat(epic-2): complete story 2-2-user-login
feat(epic-2): complete story 2-3-password-reset
...
```

### Merge When Done

```bash
# After autonomous epic completes:
git checkout main
git merge auto-epic-2

# Or create PR:
gh pr create --base main --head auto-epic-2 --title "Epic 2: User Management"
```

## Completion Report

Generated at: `{{story_dir}}/epic-{{epic_num}}-completion-report.md`

```markdown
# Epic 2 Completion Report

**Generated:** 2025-01-18
**Processing Time:** 5h 23m
**Success Rate:** 100% (8/8 stories)

## Story Summary

| Story | Status | Time | Files | Coverage | Issues |
|-------|--------|------|-------|----------|--------|
| 2.1   | ✅ Done | 42m  | 6     | 95%      | 0      |
| 2.2   | ✅ Done | 38m  | 5     | 92%      | 1      |
| 2.3   | ✅ Done | 45m  | 7     | 96%      | 2      |
...

## Epic Statistics

- Total files: 47 (35 created, 12 modified)
- Average coverage: 94%
- Code review issues: 6 (all resolved)
- Total commits: 8

## Quality Metrics

- Stories passing first time: 6/8 (75%)
- Average fix iterations: 0.25
- Zero critical issues escaped

## Git Branch

Branch: auto-epic-2
Ready to merge

## Recommendations

- All stories met acceptance criteria
- Test coverage exceeds 90% target
- Code review found minimal issues
- Ready for human review and merge
```

## Best Practices

### 1. Epic Sizing

**Recommended epic sizes:**
- **Small (3-5 stories):** Can complete in single session
- **Medium (6-10 stories):** Overnight processing ideal
- **Large (11+ stories):** Consider breaking into sub-epics

### 2. Choosing dev-story vs super-dev-story

**Use super-dev-story for:**
- Security-critical epics
- Customer-facing features
- Complex business logic
- High-stakes production releases

**Use dev-story for:**
- Internal tools
- Experimental features
- Non-critical improvements
- When speed matters more than extra validation

### 3. Monitoring Progress

```bash
# In another terminal, watch progress:
watch -n 10 'cat _bmad-output/implementation-artifacts/.autonomous-epic-progress.yaml'

# Or tail completion report:
tail -f _bmad-output/implementation-artifacts/epic-2-completion-report.md
```

### 4. Interruption Handling

**Safe to interrupt:**
- Ctrl+C between stories (progress saved)
- Terminal disconnect (can resume)
- Timeout (restarts from last completed)

**Not safe to interrupt:**
- During story development (may leave partial work)
- During git commit (may corrupt repository)

### 5. Resource Management

**Token budgets:**
- Set LLM API limits to prevent runaway costs
- Monitor token usage in real-time
- Consider using dev-story for token savings

**Time management:**
- Run overnight for large epics
- Schedule during low-activity periods
- Use CI/CD for completely automated runs

## Troubleshooting

### "Autonomous epic stuck on one story"

**Cause:** Story has issues preventing completion
**Solution:**
- Check progress file for current_story
- Review that story's dev log
- May need manual intervention

### "Epic processing stopped mid-story"

**Cause:** Interruption during development
**Solution:**
- Check progress file status
- Resume with `/autonomous-epic {epic_num}`
- May need to manually clean up partial work

### "Too many token failures"

**Cause:** Hitting API rate limits
**Solution:**
- Reduce concurrent processing
- Use dev-story instead of super-dev-story
- Increase API tier/limits

### "Git merge conflicts after autonomous epic"

**Cause:** Other changes merged to main during processing
**Solution:**
- Rebase auto-epic branch on latest main
- Resolve conflicts manually
- This is expected for long-running processes

## Safety Features

### Max Retry Protection

Prevents infinite loops:
- Each story: max 2 retries (default)
- After max retries: skip to next story
- Report failures at end

### Progress Checkpoints

After each story:
- Progress file updated
- Git commit created (if enabled)
- Can resume from this point

### Fail-Safe Modes

```yaml
# Conservative (halt on first problem):
halt_on_error: true
max_retry_per_story: 0

# Aggressive (push through everything):
halt_on_error: false
max_retry_per_story: 3

# Balanced (default):
halt_on_error: false
max_retry_per_story: 2
```

## Use Cases

### Use Case 1: Overnight Epic Completion

```bash
# Before leaving office:
/autonomous-epic 4

# Next morning:
# → Epic 100% complete
# → All stories developed
# → All commits created
# → Ready for review
```

### Use Case 2: CI/CD Integration

```bash
# In GitHub Actions:
name: Auto Epic Processing
on:
  workflow_dispatch:
    inputs:
      epic_number:
        required: true

jobs:
  process-epic:
    steps:
      - run: npx bmad-method@alpha autonomous-epic ${{ inputs.epic_number }}
```

### Use Case 3: Sprint Automation

```bash
# Monday: Plan all epics for sprint
/sprint-planning

# Tuesday: Auto-process Epic 1
/autonomous-epic 1

# Wednesday: Auto-process Epic 2
/autonomous-epic 2

# Thursday-Friday: Human review and merge
```

## Comparison to Manual Processing

### Manual Workflow

```
Day 1: Create Story 2.1 → Review → Approve (30m)
Day 2: Develop Story 2.1 → Test → Review → Fix → Done (4h)
Day 3: Create Story 2.2 → Review → Approve (30m)
Day 4: Develop Story 2.2 → Test → Review → Fix → Done (3h)
...

8 stories = 16 days minimum (with human bottlenecks)
```

### Autonomous Workflow

```
Day 1 (evening): /autonomous-epic 2
Day 2 (morning): Epic complete, review ready

8 stories = 6 hours machine time + 1-2 days human review
```

**Savings:** ~14 days, 90% reduction in calendar time

## Limitations

### What Autonomous Epic CAN'T Do

- **Complex requirement clarifications** - Needs human for ambiguous requirements
- **Architectural decisions** - Major tech choices need human input
- **UX design decisions** - Visual/interaction design needs human creativity
- **Business logic validation** - Domain expertise often needs human verification

### When to Use Manual Processing

- First epic in new project (learning patterns)
- Experimental features (high uncertainty)
- Stories requiring extensive research
- Complex integrations with unknowns

## Monitoring Output

### Real-Time Progress

```bash
# Terminal output shows:
Story 3/8: 2-3-password-reset
  Pre-gap: ✅ 2 tasks refined
  Development: ⏳ 2/6 tasks complete
  ...
```

### Progress File

```bash
# Check progress programmatically:
cat _bmad-output/implementation-artifacts/.autonomous-epic-progress.yaml

# Example:
epic_num: 2
status: running
completed_stories: [2-1-user-registration, 2-2-user-login]
current_story: 2-3-password-reset
```

### Completion Report

```bash
# Generated when epic completes:
cat _bmad-output/implementation-artifacts/epic-2-completion-report.md
```

## Advanced: Batch Epic Processing

Process multiple epics:

```bash
# Sequential processing:
/autonomous-epic 1
/autonomous-epic 2
/autonomous-epic 3

# Or create meta-workflow for parallel processing
```

## FAQ

### Q: Can I stop autonomous processing mid-epic?

**A:** Yes, Ctrl+C between stories. Progress saved. Resume with `/autonomous-epic {num}`

### Q: What if a story fails?

**A:** Logged in failed_stories. By default, continues to next story. Fix manually later.

### Q: Does this work with existing stories?

**A:** Yes! Picks up any ready-for-dev or in-progress stories and develops them.

### Q: Can I customize per story?

**A:** Not currently. All stories in epic use same settings. Manual development for custom needs.

### Q: What about dependencies between stories?

**A:** Stories processed sequentially, so Story 2.2 can leverage Story 2.1's code (gap analysis handles this!)

### Q: Token budget concerns?

**A:** Use dev-story instead of super-dev-story to reduce token usage by ~30%

## See Also

- [super-dev-story](../super-dev-story/) - Enhanced quality workflow
- [dev-story](../dev-story/) - Standard development workflow
- [gap-analysis](../gap-analysis/) - Standalone audit tool
- [Autonomous Epic Concept](../../../../docs/autonomous-epic-processing.md) - Vision document

---

**Autonomous Epic Processing: "Do Epic 4 for me" is now reality** ✨
