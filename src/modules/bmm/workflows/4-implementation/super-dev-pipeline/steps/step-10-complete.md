---
name: 'step-10-complete'
description: 'Complete story with MANDATORY sprint-status.yaml update and verification'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-10-complete.md'
nextStepFile: '{workflow_path}/steps/step-11-summary.md'
stateFile: '{state_file}'
sprint_status: '{sprint_artifacts}/sprint-status.yaml'

# Role Switch
role: sm
---

# Step 10: Complete Story (v1.5.0: Mandatory Status Update)

## ROLE SWITCH

**Switching to SM (Scrum Master) perspective.**

You are now completing the story and preparing changes for git commit.

## STEP GOAL

Complete the story with safety checks and MANDATORY status updates:
1. Extract file list from story
2. Stage only story-related files
3. Generate commit message
4. Create commit
5. Push to remote (if configured)
6. Update story file status to "done"
7. **UPDATE sprint-status.yaml (MANDATORY - NO EXCEPTIONS)**
8. **VERIFY sprint-status.yaml update persisted (CRITICAL)**

## MANDATORY EXECUTION RULES

### Completion Principles

- **TARGETED COMMIT** - Only files from this story's File List
- **SAFETY CHECKS** - Verify no secrets, proper commit message
- **STATUS UPDATE** - Mark story as "review" (ready for human review)
- **NO FORCE PUSH** - Normal push only

## EXECUTION SEQUENCE

### 1. Extract File List from Story

Read story file and find "File List" section:

```markdown
## File List
- src/components/UserProfile.tsx
- src/actions/updateUser.ts
- tests/user.test.ts
```

Extract all file paths.
Add story file itself to the list.

Store as `{story_files}` (space-separated list).

### 2. Verify Files Exist

For each file in list:
```bash
test -f "{file}" && echo "✓ {file}" || echo "⚠️  {file} not found"
```

### 3. Check Git Status

```bash
git status --short
```

Display files changed.

### 4. Stage Story Files Only

```bash
git add {story_files}
```

**This ensures parallel-safe commits** (other agents won't conflict).

### 5. Generate Commit Message

Based on story title and changes:

```
feat(story-{story_id}): {story_title}

Implemented:
{list acceptance criteria or key changes}

Files changed:
- {file_1}
- {file_2}

Story: {story_file}
```

### 6. Create Commit (With Queue for Parallel Mode)

**Check execution mode:**
```
If mode == "batch" AND parallel execution:
  use_commit_queue = true
Else:
  use_commit_queue = false
```

**If use_commit_queue == true:**

```bash
# Commit queue with file-based locking
lock_file=".git/bmad-commit.lock"
max_wait=300  # 5 minutes
wait_time=0
retry_delay=1

while [ $wait_time -lt $max_wait ]; do
  if [ ! -f "$lock_file" ]; then
    # Acquire lock
    echo "locked_by: {{story_key}}
locked_at: $(date -u +%Y-%m-%dT%H:%M:%SZ)
worker_id: {{worker_id}}
pid: $$" > "$lock_file"

    echo "🔒 Commit lock acquired for {{story_key}}"

    # Execute commit
    git commit -m "$(cat <<'EOF'
{commit_message}
EOF
)"

    commit_result=$?

    # Release lock
    rm -f "$lock_file"
    echo "🔓 Lock released"

    if [ $commit_result -eq 0 ]; then
      git log -1 --oneline
      break
    else
      echo "❌ Commit failed"
      exit $commit_result
    fi
  else
    # Lock exists, check if stale
    lock_age=$(( $(date +%s) - $(date -r "$lock_file" +%s) ))
    if [ $lock_age -gt 300 ]; then
      echo "⚠️  Stale lock detected (${lock_age}s old) - removing"
      rm -f "$lock_file"
      continue
    fi

    locked_by=$(grep "locked_by:" "$lock_file" | cut -d' ' -f2-)
    echo "⏳ Waiting for commit lock... (held by $locked_by, ${wait_time}s elapsed)"
    sleep $retry_delay
    wait_time=$(( wait_time + retry_delay ))
    retry_delay=$(( retry_delay < 30 ? retry_delay * 3 / 2 : 30 ))  # Exponential backoff, max 30s
  fi
done

if [ $wait_time -ge $max_wait ]; then
  echo "❌ TIMEOUT: Could not acquire commit lock after 5 minutes"
  echo "Lock holder: $(cat $lock_file)"
  exit 1
fi
```

**If use_commit_queue == false (sequential mode):**

```bash
# Direct commit (no queue needed)
git commit -m "$(cat <<'EOF'
{commit_message}
EOF
)"

git log -1 --oneline
```

### 7. Push to Remote (Optional)

**If configured to push:**
```bash
git push
```

**If push succeeds:**
```
✅ Changes pushed to remote
```

**If push fails (e.g., need to pull first):**
```
⚠️  Push failed - changes committed locally
You can push manually when ready
```

### 8. Update Story Status (File + Sprint-Status)

**CRITICAL: Two-location update with verification**

#### 8.1: Update Story File

Update story file frontmatter:
```yaml
status: done  # Story completed (v1.5.0: changed from "review" to "done")
completed_date: {date}
```

#### 8.2: Update sprint-status.yaml (MANDATORY - NO EXCEPTIONS)

**This is CRITICAL and CANNOT be skipped.**

```bash
# Read current sprint-status.yaml
sprint_status_file="{sprint_artifacts}/sprint-status.yaml"
story_key="{story_id}"

# Update development_status section
# Change status from whatever it was to "done"

development_status:
  {story_id}: done  # ✅ COMPLETED: {story_title}
```

**Implementation:**
```bash
# Read current status
current_status=$(grep "^\s*{story_id}:" "$sprint_status_file" | awk '{print $2}')

# Update to done
sed -i'' "s/^\s*{story_id}:.*/  {story_id}: done  # ✅ COMPLETED: {story_title}/" "$sprint_status_file"

echo "✅ Updated sprint-status.yaml: {story_id} → done"
```

#### 8.3: Verify Update Persisted (CRITICAL)

```bash
# Re-read sprint-status.yaml to verify change
verification=$(grep "^\s*{story_id}:" "$sprint_status_file" | awk '{print $2}')

if [ "$verification" != "done" ]; then
  echo "❌ CRITICAL: sprint-status.yaml update FAILED!"
  echo "Expected: done"
  echo "Got: $verification"
  echo ""
  echo "HALTING pipeline - status update is MANDATORY"
  exit 1
fi

echo "✅ Verified: sprint-status.yaml correctly updated"
```

**NO EXCEPTIONS:** If verification fails, pipeline MUST HALT.

### 9. Update Pipeline State

Update state file:
- Add `6` to `stepsCompleted`
- Set `lastStep: 6`
- Set `steps.step-06-complete.status: completed`
- Record commit hash

### 10. Display Summary

```
Story Completion

✅ Files staged: {file_count}
✅ Commit created: {commit_hash}
✅ Status updated: review
{if pushed}✅ Pushed to remote{endif}

Commit: {commit_hash_short}
Message: {commit_title}

Ready for Summary Generation
```

**Interactive Mode Menu:**
```
[C] Continue to Summary
[P] Push to remote (if not done)
[H] Halt pipeline
```

**Batch Mode:** Auto-continue

## QUALITY GATE

**MANDATORY AUTO-FIX VERIFICATION:**

<critical>🚨 DETECT FAILURES AND FIX THEM - DO NOT HALT</critical>

```bash
story_file="{story_file}"

# 1. Check if tasks were checked off
checked_tasks=$(grep -c "^- \[x\]" "$story_file" || echo "0")
total_tasks=$(grep -c "^- \[[x ]\]" "$story_file" || echo "0")

if [ "$checked_tasks" -eq 0 ] && [ "$total_tasks" -gt 0 ]; then
  echo "❌ FAILURE DETECTED: $total_tasks tasks exist but ZERO checked"
  echo ""
  echo "🔧 EXECUTING AUTO-FIX RECONCILIATION:"
  echo "   1. Reading git commit to see what was built"
  echo "   2. Comparing to story tasks"
  echo "   3. Checking off tasks with matching code"
  echo ""
fi

# AUTO-FIX: For each unchecked task, check if code exists, then check it off
# (Actual implementation: Use Edit tool iteratively for each task)
# (Verify after each edit, retry if failed, continue until all viable tasks checked)

# Re-count after auto-fix
checked_tasks=$(grep -c "^- \[x\]" "$story_file" || echo "0")
completion_pct=$((checked_tasks * 100 / total_tasks))

echo "✅ After auto-fix: $checked_tasks/$total_tasks tasks checked ($completion_pct%)"

# 2. Check if Dev Agent Record empty
if grep -q "To be filled by dev agent" "$story_file"; then
  echo "❌ FAILURE DETECTED: Dev Agent Record is empty"
  echo ""
  echo "🔧 EXECUTING AUTO-FIX:"
  echo "   Extracting commit details"
  echo "   Populating Dev Agent Record section"
  echo ""

  # AUTO-FIX: Fill in Dev Agent Record
  # - Agent Model Used: Get from context
  # - File List: Extract from git diff --name-only
  # - Completion Notes: Extract from commit message
  # Use Edit tool to replace "To be filled" sections

  echo "✅ Dev Agent Record populated"
fi

# After all auto-fixes, verify minimum standards met
if [ "$checked_tasks" -eq 0 ]; then
  echo "❌ CRITICAL: Auto-fix could not check any tasks"
  echo "   Story implementation may be empty or broken"
  echo "   Marking story as 'in-progress' (not done)"
  # Override status but continue (don't halt)
fi
```

Before proceeding (BLOCKING - ALL must pass):
- [ ] **Tasks verified: checked_tasks > 0 (HALT if zero)**
- [ ] **Dev Agent Record filled (HALT if empty)**
- [ ] Targeted files staged (from File List)
- [ ] Commit message generated
- [ ] Commit created successfully
- [ ] Story file status updated to "done"
- [ ] **sprint-status.yaml updated to "done" (MANDATORY)**
- [ ] **sprint-status.yaml update VERIFIED (CRITICAL)**

**If ANY check fails, pipeline MUST HALT.**

## CRITICAL STEP COMPLETION

**ONLY WHEN** [commit created],
load and execute `{nextStepFile}` for summary generation.

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS
- Only story files committed
- Commit message is clear
- Status updated properly
- No secrets committed
- Push succeeded or skipped safely

### ❌ FAILURE
- Committing unrelated files
- Generic commit message
- Not updating story status
- Pushing secrets
- Force pushing
