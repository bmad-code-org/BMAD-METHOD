---
name: 'step-06-complete'
description: 'Commit and push story changes with targeted file list'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-06-complete.md'
nextStepFile: '{workflow_path}/steps/step-07-summary.md'

# Role Switch
role: sm
---

# Step 6: Complete Story

## ROLE SWITCH

**Switching to SM (Scrum Master) perspective.**

You are now completing the story and preparing changes for git commit.

## STEP GOAL

Complete the story with safety checks:
1. Extract file list from story
2. Stage only story-related files
3. Generate commit message
4. Create commit
5. Push to remote (if configured)
6. Update story status

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

### 8. Update Story Status

Update story file frontmatter:
```yaml
status: review  # Ready for human review
```

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

Before proceeding:
- [ ] Targeted files staged (from File List)
- [ ] Commit message generated
- [ ] Commit created successfully
- [ ] Story status updated to "review"

## CRITICAL STEP COMPLETION

**ONLY WHEN** [commit created]:

1. **Check GitHub Integration:**
   ```
   IF github_integration.enabled == true:
     load and execute `{workflow_path}/steps/step-06b-sync-github.md`
   ELSE:
     load and execute `{nextStepFile}` for summary generation
   ```

2. **Continue Pipeline:**
   - If GitHub sync enabled: Create PR, update issue, then summary
   - If GitHub sync disabled: Direct to summary generation

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
