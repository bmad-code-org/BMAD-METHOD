# Escalation Message Templates

Use these templates when an escalation trigger fires.

## 1. Code Review Loop Exceeded

**Pre-Escalation Verification:**
```bash
file_status=$("$scripts" orchestrator-helper story-file-status {story_id})
file_done=$(echo "$file_status" | jq -r '.status')
if [ "$file_done" = "done" ]; then
    echo "✅ Story file shows done - sprint-status out of sync"
fi

test_result=$(cd "$PROJECT_ROOT" && go test ./src/... 2>&1 || npm test 2>&1 || true)
tests_pass=$([[ "$test_result" != *"FAIL"* ]] && echo "true" || echo "false")
```

**Diagnostic Summary (required):**
| Cycle | Agent | Issues Found | Fixed | Duration |
|-------|-------|--------------|-------|----------|
{cycle_history_table}

**Escalation message:**
```
🔔 DECISION NEEDED: Code Review Loop (5 cycles exhausted)

Story: {story_name}
Story ID: {story_id}
```

---

## 2. Cannot Parse Session Output

**Escalation message:**
```
🔔 DECISION NEEDED: Ambiguous Session Output

Story: {story_name}
Step: {step_name}
Session: {session_id}

Unable to determine if step succeeded or failed.

Last 20 lines of output:
{output_snippet}

Options:
[1] Mark as success and proceed
[2] Mark as failure and retry
[3] View full session output
[4] Pause for manual inspection

Select option:
```

---

## 3. Session Spawn Failure

**Escalation message:**
```
🔔 DECISION NEEDED: Session Spawn Failed

Story: {story_name}
Step: {step_name}
Error: {error_message}

Unable to spawn tmux session after retry.

Options:
[1] Retry again
[2] Skip this step
[3] Abort story
[4] Pause orchestration

Select option:
```

---

## 4. Git Commit Failure

**Escalation message:**
```
🔔 DECISION NEEDED: Git Commit Failed

Story: {story_name}
Error: {error_message}

Unable to commit changes for this story.

Options:
[1] Retry commit
[2] Skip commit and proceed (changes remain uncommitted)
[3] Pause for manual git resolution
[4] Abort story

Select option:
```

---
