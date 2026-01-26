---
name: 'step-06a-queue-commit'
description: 'Queued git commit with file-based locking for parallel safety'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-06a-queue-commit.md'
nextStepFile: '{workflow_path}/steps/step-07-summary.md'

# Role
role: dev
requires_fresh_context: false
---

# Step 6a: Queued Git Commit (Parallel-Safe)

## STEP GOAL

Execute git commit with file-based locking to prevent concurrent commit conflicts in parallel batch mode.

**Problem Solved:**
- Multiple parallel agents trying to commit simultaneously
- Git lock file conflicts (.git/index.lock)
- "Another git process seems to be running" errors
- Commit failures requiring manual intervention

**Solution:**
- File-based commit queue using .git/bmad-commit.lock
- Automatic retry with exponential backoff
- Lock cleanup on success or failure
- Maximum wait time enforcement

## EXECUTION SEQUENCE

### 1. Check if Commit Queue is Needed

```
If mode == "batch" AND execution_mode == "parallel":
  use_commit_queue = true
  Display: "🔒 Using commit queue (parallel mode)"
Else:
  use_commit_queue = false
  Display: "Committing directly (sequential mode)"
  goto Step 3 (Direct Commit)
```

### 2. Acquire Commit Lock (Parallel Mode Only)

**Lock file:** `.git/bmad-commit.lock`

**Acquisition algorithm:**
```
max_wait_time = 300 seconds (5 minutes)
retry_delay = 1 second (exponential backoff)
start_time = now()

WHILE elapsed_time < max_wait_time:

  IF lock file does NOT exist:
    Create lock file with content:
      locked_by: {{story_key}}
      locked_at: {{timestamp}}
      worker_id: {{worker_id}}
      pid: {{process_id}}

    Display: "🔓 Lock acquired for {{story_key}}"
    BREAK (proceed to commit)

  ELSE:
    Read lock file to check who has it
    Display: "⏳ Waiting for commit lock... (held by {{locked_by}}, {{wait_duration}}s elapsed)"

    Sleep retry_delay seconds
    retry_delay = min(retry_delay * 1.5, 30)  # Exponential backoff, max 30s

    Check if lock is stale (>5 minutes old):
      IF lock_age > 300 seconds:
        Display: "⚠️ Stale lock detected ({{lock_age}}s old) - removing"
        Delete lock file
        Continue (try again)
```

**Timeout handling:**
```
IF elapsed_time >= max_wait_time:
  Display:
  ❌ TIMEOUT: Could not acquire commit lock after 5 minutes

  Lock held by: {{locked_by}}
  Lock age: {{lock_age}} seconds

  Possible causes:
  - Another agent crashed while holding lock
  - Commit taking abnormally long
  - Lock file not cleaned up

  HALT - Manual intervention required:
  - Check if lock holder is still running
  - Delete .git/bmad-commit.lock if safe
  - Retry this story
```

### 3. Execute Git Commit

**Stage changes:**
```bash
git add {files_changed_for_this_story}
```

**Generate commit message:**
```
feat: implement story {{story_key}}

{{implementation_summary_from_dev_agent_record}}

Files changed:
{{#each files_changed}}
- {{this}}
{{/each}}

Tasks completed: {{checked_tasks}}/{{total_tasks}}
Story status: {{story_status}}
```

**Commit:**
```bash
git commit -m "$(cat <<'EOF'
{commit_message}
EOF
)"
```

**Verification:**
```bash
git log -1 --oneline
```

Confirm commit SHA returned.

### 4. Release Commit Lock (Parallel Mode Only)

```
IF use_commit_queue == true:
  Delete lock file: .git/bmad-commit.lock

  Verify lock removed:
    IF lock file still exists:
      Display: "⚠️ WARNING: Could not remove lock file"
      Try force delete
    ELSE:
      Display: "🔓 Lock released for {{story_key}}"
```

**Error handling:**
```
IF commit failed:
  Release lock (if held)
  Display:
  ❌ COMMIT FAILED: {{error_message}}

  Story implemented but not committed.
  Changes are staged but not in git history.

  HALT - Fix commit issue before continuing
```

### 5. Update State

Update state file:
- Add `6a` to `stepsCompleted`
- Set `lastStep: 6a`
- Record `commit_sha`
- Record `committed_at` timestamp

### 6. Present Summary

Display:
```
✅ Story {{story_key}} Committed

Commit: {{commit_sha}}
Files: {{files_count}} changed
{{#if use_commit_queue}}Lock wait: {{lock_wait_duration}}s{{/if}}
```

**Interactive Mode Menu:**
```
[C] Continue to Summary
[P] Push to remote
[H] Halt pipeline
```

**Batch Mode:** Auto-continue to step-07-summary.md

## CRITICAL STEP COMPLETION

Load and execute `{nextStepFile}` for summary.

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS
- Changes committed to git
- Commit SHA recorded
- Lock acquired and released cleanly (parallel mode)
- No lock file remaining
- State updated

### ❌ FAILURE
- Commit timed out
- Lock acquisition timed out (>5 min)
- Lock not released (leaked lock)
- Commit command failed
- Stale lock not cleaned up

---

## LOCK FILE FORMAT

`.git/bmad-commit.lock` contains:
```yaml
locked_by: "2-7-image-file-handling"
locked_at: "2026-01-07T18:45:32Z"
worker_id: 3
pid: 12345
story_file: "docs/sprint-artifacts/2-7-image-file-handling.md"
```

This allows debugging if lock gets stuck.

---

## QUEUE BENEFITS

**Before (No Queue):**
```
Worker 1: git commit → acquires .git/index.lock
Worker 2: git commit → ERROR: index.lock exists
Worker 3: git commit → ERROR: index.lock exists
Worker 2: retries → ERROR: index.lock exists
Worker 3: retries → ERROR: index.lock exists
Workers 2 & 3: HALT - manual intervention needed
```

**After (With Queue):**
```
Worker 1: acquires bmad-commit.lock → git commit → releases lock
Worker 2: waits for lock → acquires → git commit → releases
Worker 3: waits for lock → acquires → git commit → releases
All workers: SUCCESS ✅
```

**Throughput Impact:**
- Implementation: Fully parallel (no blocking)
- Commits: Serialized (necessary to prevent conflicts)
- Overall: Still much faster than sequential mode (implementation is 90% of the time)

---

## STALE LOCK RECOVERY

**Automatic cleanup:**
- Locks older than 5 minutes are considered stale
- Automatically removed before retrying
- Prevents permanent deadlock from crashed agents

**Manual recovery:**
```bash
# If workflow stuck on lock acquisition:
rm .git/bmad-commit.lock

# Check if any git process is actually running:
ps aux | grep git

# If no git process, safe to remove lock
```
