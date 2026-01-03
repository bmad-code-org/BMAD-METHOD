# Sprint Status Sync - Complete Guide

**Created:** 2026-01-02
**Purpose:** Prevent drift between story files and sprint-status.yaml
**Status:** PRODUCTION READY

---

## 🚨 THE PROBLEM WE SOLVED

**Before Fix (2026-01-02):**
- 78% of story files (435/552) had NO `Status:` field
- 30+ completed stories not reflected in sprint-status.yaml
- Epic 19: 28 stories done, sprint-status said "in-progress"
- Epic 16d: 3 stories done, sprint-status said "backlog"
- Last verification: 32+ hours old

**Root Cause:**
- Autonomous workflows prioritized velocity over tracking
- Manual workflows didn't enforce status updates
- No automated sync mechanism
- sprint-status.yaml manually maintained

---

## ✅ THE SOLUTION (Full Workflow Fix)

### Component 1: Automated Sync Script

**Script:** `scripts/sync-sprint-status.sh`
**Purpose:** Scan story Status: fields → Update sprint-status.yaml

**Usage:**
```bash
# Update sprint-status.yaml
pnpm sync:sprint-status

# Preview changes (no modifications)
pnpm sync:sprint-status:dry-run

# Validate only (exit 1 if out of sync)
pnpm validate:sprint-status
```

**Features:**
- Only updates stories WITH explicit Status: fields
- Skips stories without Status: (trusts sprint-status.yaml)
- Creates automatic backups (.sprint-status-backups/)
- Preserves all comments and structure
- Returns clear pass/fail exit codes

---

### Component 2: Workflow Enforcement

**Modified Files:**
1. `_bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
2. `_bmad/bmm/workflows/4-implementation/autonomous-epic/instructions.xml`

**Changes:**
- ✅ HALT if story not found in sprint-status.yaml (was: warning)
- ✅ Verify sprint-status.yaml update persisted (new validation)
- ✅ Update both story Status: field AND sprint-status.yaml
- ✅ Fail loudly if either update fails

**Before:** Workflows logged warnings, continued anyway
**After:** Workflows HALT if tracking update fails

---

### Component 3: CI/CD Validation

**Workflow:** `.github/workflows/validate-sprint-status.yml`
**Trigger:** Every PR touching docs/sprint-artifacts/

**Checks:**
1. sprint-status.yaml exists
2. All changed story files have Status: fields
3. sprint-status.yaml is in sync (runs validation)
4. Blocks merge if validation fails

**How to fix CI failures:**
```bash
# See what's wrong
./scripts/sync-sprint-status.sh --dry-run

# Fix it
./scripts/sync-sprint-status.sh

# Commit
git add docs/sprint-artifacts/sprint-status.yaml
git commit -m "chore: sync sprint-status.yaml"
git push
```

---

### Component 4: pnpm Scripts

**Added to package.json:**
```json
{
  "scripts": {
    "sync:sprint-status": "./scripts/sync-sprint-status.sh",
    "sync:sprint-status:dry-run": "./scripts/sync-sprint-status.sh --dry-run",
    "validate:sprint-status": "./scripts/sync-sprint-status.sh --validate"
  }
}
```

**When to run:**
- `pnpm sync:sprint-status` - After manually updating story Status: fields
- `pnpm validate:sprint-status` - Before committing changes
- Automatically in CI/CD - Validates on every PR

---

## 🎯 NEW WORKFLOW (How It Works Now)

### When Creating a Story

```
/create-story workflow
  ↓
1. Generate story file with Status: ready-for-dev
  ↓
2. Add entry to sprint-status.yaml with status "ready-for-dev"
  ↓
3. HALT if sprint-status.yaml update fails
  ↓
✅ Story file and sprint-status.yaml both updated
```

### When Implementing a Story

```
/dev-story workflow
  ↓
1. Load story, start work
  ↓
2. Mark tasks complete [x]
  ↓
3. Run tests, validate
  ↓
4. Update story Status: "in-progress" → "review"
  ↓
5. Update sprint-status.yaml: "in-progress" → "review"
  ↓
6. VERIFY sprint-status.yaml update persisted
  ↓
7. HALT if verification fails
  ↓
✅ Both updated and verified
```

### When Running Autonomous Epic

```
/autonomous-epic workflow
  ↓
For each story:
  1. Run super-dev-pipeline
  ↓
  2. Check all tasks complete
  ↓
  3. Update story Status: "done"
  ↓
  4. Update sprint-status.yaml entry to "done"
  ↓
  5. Verify update persisted
  ↓
  6. Log failure if verification fails (don't halt - continue)
  ↓
After all stories:
  7. Mark epic "done" in sprint-status.yaml
  ↓
  8. Verify epic status persisted
  ↓
✅ All stories and epic status updated
```

---

## 🛡️ ENFORCEMENT MECHANISMS

### 1. Required Fields (Create-Story)
- **Enforcement:** Story MUST be added to sprint-status.yaml during creation
- **Validation:** Workflow HALTS if story not found after creation
- **Result:** No orphaned stories

### 2. Status Updates (Dev-Story)
- **Enforcement:** Both Status: field AND sprint-status.yaml MUST update
- **Validation:** Re-read sprint-status.yaml to verify update
- **Result:** No silent failures

### 3. Verification (Autonomous-Epic)
- **Enforcement:** Sprint-status.yaml updated after each story
- **Validation:** Verify update persisted, log failure if not
- **Result:** Tracking stays in sync even during autonomous runs

### 4. CI/CD Gates (GitHub Actions)
- **Enforcement:** PR merge blocked if validation fails
- **Validation:** Runs `pnpm validate:sprint-status` on every PR
- **Result:** Drift cannot be merged

---

## 📋 MANUAL SYNC PROCEDURES

### If sprint-status.yaml Gets Out of Sync

**Scenario 1: Story Status: fields updated but sprint-status.yaml not synced**
```bash
# See what needs updating
pnpm sync:sprint-status:dry-run

# Apply updates
pnpm sync:sprint-status

# Verify
pnpm validate:sprint-status

# Commit
git add docs/sprint-artifacts/sprint-status.yaml
git commit -m "chore: sync sprint-status.yaml with story updates"
```

**Scenario 2: sprint-status.yaml has truth, story files missing Status: fields**
```bash
# Create script to backfill Status: fields FROM sprint-status.yaml
./scripts/backfill-story-status-fields.sh  # (To be created if needed)

# This would:
# 1. Read sprint-status.yaml
# 2. For each story entry, find the story file
# 3. Add/update Status: field to match sprint-status.yaml
# 4. Preserve all other content
```

**Scenario 3: Massive drift after autonomous work**
```bash
# Option A: Trust sprint-status.yaml (if it was manually verified)
# - Backfill story Status: fields from sprint-status.yaml
# - Don't run sync (sprint-status.yaml is source of truth)

# Option B: Trust story Status: fields (if recently updated)
# - Run sync to update sprint-status.yaml
pnpm sync:sprint-status

# Option C: Manual audit (when both are uncertain)
# - Review SPRINT-STATUS-AUDIT-2026-01-02.md
# - Check git commits for completion evidence
# - Manually correct both files
```

---

## 🧪 TESTING

### Test 1: Validate Current State
```bash
pnpm validate:sprint-status
# Should exit 0 if in sync, exit 1 if discrepancies
```

### Test 2: Dry Run (No Changes)
```bash
pnpm sync:sprint-status:dry-run
# Shows what WOULD change without applying
```

### Test 3: Apply Sync
```bash
pnpm sync:sprint-status
# Updates sprint-status.yaml, creates backup
```

### Test 4: CI/CD Simulation
```bash
# Simulate PR validation
.github/workflows/validate-sprint-status.yml
# (Run via act or GitHub Actions)
```

---

## 📊 METRICS & MONITORING

### How to Check Sprint Health

**Check 1: Discrepancy Count**
```bash
pnpm sync:sprint-status:dry-run 2>&1 | grep "discrepancies"
# Should show: "0 discrepancies" if healthy
```

**Check 2: Last Verification Timestamp**
```bash
head -5 docs/sprint-artifacts/sprint-status.yaml | grep last_verified
# Should be within last 24 hours
```

**Check 3: Stories Missing Status: Fields**
```bash
grep -L "^Status:" docs/sprint-artifacts/*.md | wc -l
# Should decrease over time as stories get Status: fields
```

### Alerts to Set Up (Future)

- ⚠️ If last_verified > 7 days old → Manual audit recommended
- ⚠️ If discrepancy count > 10 → Investigate why sync not running
- ⚠️ If stories without Status: > 50 → Backfill campaign needed

---

## 🎓 BEST PRACTICES

### For Story Creators
1. Always use `/create-story` workflow (adds to sprint-status.yaml automatically)
2. Never create story .md files manually
3. Always include Status: field in story template

### For Story Implementers
1. Use `/dev-story` workflow (updates both Status: and sprint-status.yaml)
2. If manually updating Status: field, run `pnpm sync:sprint-status` after
3. Before marking "done", verify sprint-status.yaml reflects your work

### For Autonomous Workflows
1. autonomous-epic workflow now includes sprint-status.yaml updates
2. Verifies updates persisted after each story
3. Logs failures but continues (doesn't halt entire epic for tracking issues)

### For Code Reviewers
1. Check that PR includes sprint-status.yaml update if stories changed
2. Verify CI/CD validation passes
3. If validation fails, request sync before approving

---

## 🔧 MAINTENANCE

### Weekly Tasks
- [ ] Review discrepancy count: `pnpm sync:sprint-status:dry-run`
- [ ] Run sync if needed: `pnpm sync:sprint-status`
- [ ] Check backup count: `ls -1 .sprint-status-backups/ | wc -l`
- [ ] Clean old backups (keep last 30 days)

### Monthly Tasks
- [ ] Full audit: Review SPRINT-STATUS-AUDIT template
- [ ] Backfill missing Status: fields (reduce count to <10)
- [ ] Verify all epics have correct status
- [ ] Update this guide based on learnings

---

## 📝 FILE REFERENCE

**Core Files:**
- `docs/sprint-artifacts/sprint-status.yaml` - Single source of truth
- `scripts/sync-sprint-status.sh` - Bash wrapper script
- `scripts/lib/sprint-status-updater.py` - Python updater logic

**Workflow Files:**
- `_bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
- `_bmad/bmm/workflows/4-implementation/autonomous-epic/instructions.xml`
- `_bmad/bmm/workflows/4-implementation/create-story-with-gap-analysis/step-03-generate-story.md`

**CI/CD:**
- `.github/workflows/validate-sprint-status.yml`

**Documentation:**
- `SPRINT-STATUS-AUDIT-2026-01-02.md` - Initial audit findings
- `docs/workflows/SPRINT-STATUS-SYNC-GUIDE.md` - This file

---

## 🐛 TROUBLESHOOTING

### Issue: "Story not found in sprint-status.yaml"

**Cause:** Story file created outside of /create-story workflow
**Fix:**
```bash
# Manually add to sprint-status.yaml under correct epic
vim docs/sprint-artifacts/sprint-status.yaml
# Add line:   story-id: ready-for-dev

# Or re-run create-story workflow
/create-story
```

### Issue: "sprint-status.yaml update failed to persist"

**Cause:** File system permissions or concurrent writes
**Fix:**
```bash
# Check file permissions
ls -la docs/sprint-artifacts/sprint-status.yaml

# Check for file locks
lsof | grep sprint-status.yaml

# Manual update if needed
vim docs/sprint-artifacts/sprint-status.yaml
```

### Issue: "85 discrepancies found"

**Cause:** Story Status: fields not updated after completion
**Fix:**
```bash
# Review discrepancies
pnpm sync:sprint-status:dry-run

# Apply updates (will update sprint-status.yaml to match story files)
pnpm sync:sprint-status

# If story files are WRONG (Status: ready-for-dev but actually done):
#   Manually update story Status: fields first
#   Then run sync
```

---

## 🎯 SUCCESS CRITERIA

**System is working correctly when:**
- ✅ `pnpm validate:sprint-status` exits 0 (no discrepancies)
- ✅ Last verified timestamp < 24 hours old
- ✅ Stories with missing Status: fields < 10
- ✅ CI/CD validation passes on all PRs
- ✅ New stories automatically added to sprint-status.yaml

**System needs attention when:**
- ❌ Discrepancy count > 10
- ❌ Last verified > 7 days old
- ❌ CI/CD validation failing frequently
- ❌ Stories missing Status: fields > 50

---

## 🔄 MIGRATION CHECKLIST (One-Time)

If implementing this on an existing project:

- [x] Create scripts/sync-sprint-status.sh
- [x] Create scripts/lib/sprint-status-updater.py
- [x] Modify dev-story workflow (add enforcement)
- [x] Modify autonomous-epic workflow (add verification)
- [x] Add CI/CD validation workflow
- [x] Add pnpm scripts
- [x] Run initial sync: `pnpm sync:sprint-status`
- [ ] Backfill missing Status: fields (optional, gradual)
- [x] Document in this guide
- [ ] Train team on new workflow
- [ ] Monitor for 2 weeks, adjust as needed

---

## 📈 EXPECTED OUTCOMES

**Immediate (Week 1):**
- sprint-status.yaml stays in sync
- New stories automatically tracked
- Autonomous work properly recorded

**Short-term (Month 1):**
- Discrepancy count approaches zero
- CI/CD catches drift before merge
- Team trusts sprint-status.yaml as source of truth

**Long-term (Month 3+):**
- Zero manual sprint-status.yaml updates needed
- Automated reporting reliable
- Velocity metrics accurate

---

**Last Updated:** 2026-01-02
**Status:** Active - Production Ready
**Maintained By:** Platform Team
