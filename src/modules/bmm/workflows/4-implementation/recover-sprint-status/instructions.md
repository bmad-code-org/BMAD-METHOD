# Sprint Status Recovery - Instructions

**Workflow:** recover-sprint-status
**Purpose:** Fix sprint-status.yaml when tracking has drifted for days/weeks

---

## What This Workflow Does

Analyzes multiple sources to rebuild accurate sprint-status.yaml:

1. **Story File Quality** - Validates size (>=10KB), task lists, checkboxes
2. **Explicit Status: Fields** - Reads story Status: when present
3. **Git Commits** - Searches last 30 days for story references
4. **Autonomous Reports** - Checks .epic-*-completion-report.md files
5. **Task Completion Rate** - Analyzes checkbox completion in story files

**Infers Status Based On:**
- Explicit Status: field (highest priority)
- Git commits referencing story (strong signal)
- Autonomous completion reports (very high confidence)
- Task checkbox completion rate (90%+ = done)
- File quality (poor quality prevents "done" marking)

---

## Step 1: Run Recovery Analysis

```bash
Execute: {recovery_script} --dry-run
```

**This will:**
- Analyze all story files (quality, tasks, status)
- Search git commits for completion evidence
- Check autonomous completion reports
- Infer status from all evidence
- Report recommendations with confidence levels

**No changes** made in dry-run mode - just analysis.

---

## Step 2: Review Recommendations

**Check the output for:**

### High Confidence Updates (Safe)
- Stories with explicit Status: fields
- Stories in autonomous completion reports
- Stories with 3+ git commits + 90%+ tasks complete

### Medium Confidence Updates (Verify)
- Stories with 1-2 git commits
- Stories with 50-90% tasks complete
- Stories with file size >=10KB

### Low Confidence Updates (Question)
- Stories with no Status: field, no commits
- Stories with file size <10KB
- Stories with <5 tasks total

---

## Step 3: Choose Recovery Mode

### Conservative Mode (Safest)
```bash
Execute: {recovery_script} --conservative
```

**Only updates:**
- High/very high confidence stories
- Explicit Status: fields honored
- Git commits with 3+ references
- Won't infer or guess

**Best for:** Quick fixes, first-time recovery, risk-averse

---

### Aggressive Mode (Thorough)
```bash
Execute: {recovery_script} --aggressive --dry-run  # Preview first!
Execute: {recovery_script} --aggressive             # Then apply
```

**Updates:**
- Medium+ confidence stories
- Infers from git commits (even 1 commit)
- Uses task completion rate
- Pre-fills brownfield checkboxes

**Best for:** Major drift (30+ days), comprehensive recovery

---

### Interactive Mode (Recommended)
```bash
Execute: {recovery_script}
```

**Process:**
1. Shows all recommendations
2. Groups by confidence level
3. Asks for confirmation before each batch
4. Allows selective application

**Best for:** First-time use, learning the tool

---

## Step 4: Validate Results

```bash
Execute: ./scripts/sync-sprint-status.sh --validate
```

**Should show:**
- "✓ sprint-status.yaml is up to date!" (success)
- OR discrepancy count (if issues remain)

---

## Step 5: Commit Changes

```bash
git add docs/sprint-artifacts/sprint-status.yaml
git add .sprint-status-backups/  # Include backup for audit trail
git commit -m "fix(tracking): Recover sprint-status.yaml - {MODE} recovery"
```

---

## Recovery Scenarios

### Scenario 1: Autonomous Epic Completed, Tracking Not Updated

**Symptoms:**
- Autonomous completion report exists
- Git commits show work done
- sprint-status.yaml shows "in-progress" or "backlog"

**Solution:**
```bash
{recovery_script} --aggressive
# Will find completion report, mark all stories done
```

---

### Scenario 2: Manual Work Over Past Week Not Tracked

**Symptoms:**
- Story Status: fields updated to "done"
- sprint-status.yaml not synced
- Git commits exist

**Solution:**
```bash
./scripts/sync-sprint-status.sh
# Standard sync (reads Status: fields)
```

---

### Scenario 3: Story Files Missing Status: Fields

**Symptoms:**
- 100+ stories with no Status: field
- Some completed, some not
- No autonomous reports

**Solution:**
```bash
{recovery_script} --aggressive --dry-run  # Preview inference
# Review recommendations carefully
{recovery_script} --aggressive             # Apply if satisfied
```

---

### Scenario 4: Complete Chaos (Mix of All Above)

**Symptoms:**
- Some stories have Status:, some don't
- Autonomous reports for some epics
- Manual work on others
- sprint-status.yaml very outdated

**Solution:**
```bash
# Step 1: Run recovery in dry-run
{recovery_script} --aggressive --dry-run

# Step 2: Review /tmp/recovery_results.json

# Step 3: Apply in conservative mode first (safest updates)
{recovery_script} --conservative

# Step 4: Manually review remaining stories
# Update Status: fields for known completed work

# Step 5: Run sync to catch manual updates
./scripts/sync-sprint-status.sh

# Step 6: Final validation
./scripts/sync-sprint-status.sh --validate
```

---

## Quality Gates

**Recovery script will DOWNGRADE status if:**
- Story file < 10KB (not properly detailed)
- Story file has < 5 tasks (incomplete story)
- No git commits found (no evidence of work)
- Explicit Status: contradicts other evidence

**Recovery script will UPGRADE status if:**
- Autonomous completion report lists story as done
- 3+ git commits + 90%+ tasks checked
- Explicit Status: field says "done"

---

## Post-Recovery Checklist

After running recovery:

- [ ] Run validation: `./scripts/sync-sprint-status.sh --validate`
- [ ] Review backup: Check `.sprint-status-backups/` for before state
- [ ] Check epic statuses: Verify epic-level status matches story completion
- [ ] Spot-check 5-10 stories: Confirm inferred status is accurate
- [ ] Commit changes: Add recovery to version control
- [ ] Document issues: Note why drift occurred, prevent recurrence

---

## Preventing Future Drift

**After recovery:**

1. **Use workflows properly**
   - `/create-story` - Adds to sprint-status.yaml automatically
   - `/dev-story` - Updates both Status: and sprint-status.yaml
   - Autonomous workflows - Now update tracking

2. **Run sync regularly**
   - Weekly: `pnpm sync:sprint-status:dry-run` (check health)
   - After manual Status: updates: `pnpm sync:sprint-status`

3. **CI/CD validation** (coming soon)
   - Blocks PRs with out-of-sync tracking
   - Forces sync before merge

---

## Troubleshooting

### "Recovery script shows 0 updates"

**Possible causes:**
- sprint-status.yaml already accurate
- Story files all have proper Status: fields
- No git commits found (check date range)

**Action:** Run `--dry-run` to see analysis, check `/tmp/recovery_results.json`

---

### "Low confidence on stories I know are done"

**Possible causes:**
- Story file < 10KB (not properly detailed)
- No git commits (work done outside git)
- No explicit Status: field

**Action:** Manually add Status: field to story, then run standard sync

---

### "Recovery marks incomplete stories as done"

**Possible causes:**
- Git commits exist but work abandoned
- Autonomous report lists story but implementation failed
- Tasks pre-checked incorrectly (brownfield error)

**Action:** Use conservative mode, manually verify, fix story files

---

## Output Files

**Created during recovery:**
- `.sprint-status-backups/sprint-status-recovery-{timestamp}.yaml` - Backup
- `/tmp/recovery_results.json` - Detailed analysis
- Updated `sprint-status.yaml` - Recovered status

---

**Last Updated:** 2026-01-02
**Status:** Production Ready
**Works On:** ANY BMAD project with sprint-status.yaml tracking
