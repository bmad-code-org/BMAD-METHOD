# Crash Recovery Pattern

**Purpose:** Handle sessions that crash or disappear unexpectedly.

---

## Detection

The status script returns `session_state` in CSV column 6:
- `crashed` - Session exited with non-zero exit code (column 5 = exit code, column 4 = output file)
- `not_found` - Session disappeared (killed, crashed without trace)

---

## Recovery Logic

| Condition | Action |
|-----------|--------|
| `crashed` with output file | Read output, check partial progress, retry |
| `not_found` (no output) | Session died silently, retry immediately |
| Retry 1 failed | Retry with `-r2` suffix in session name |
| Retry 2 failed | Escalate to user with diagnostics |

---

## Retry Pattern

```bash
# On crash/not_found, spawn retry with unique suffix
project_slug=$(basename "$PWD" | tr '[:upper:]' '[:lower:]' | tr -cd '[:alnum:]' | cut -c1-8)
timestamp=$(date +%y%m%d-%H%M%S)
session_name="sa-${project_slug}-${timestamp}-e{epic}-s{story_suffix}-{step}-r2"

# Clear stale state (project-scoped v2.0)
PROJECT_HASH=$(echo -n "$PWD" | md5sum 2>/dev/null | cut -c1-8 || echo -n "$PWD" | md5 -q 2>/dev/null | cut -c1-8)
rm -f "/tmp/.sa-${PROJECT_HASH}-session-${session_name}-state.json"
# ... spawn and monitor as normal
```

---

## Agent Fallback (v3.0.0)

**Before escalating**, check if fallback agent is configured:

```bash
# Resolve agents for this story/task from agents file
selection=$("$scripts" orchestrator-helper agents-resolve \
  --state-file "$state_file" --story "{story_id}" --task "{task}")
primary=$(echo "$selection" | jq -r '.primary')
fallback=$(echo "$selection" | jq -r '.fallback')

if [ "$fallback" != "false" ] && [ -n "$fallback" ]; then
  if [ "$current_agent" = "$primary" ]; then
    export AI_AGENT="$fallback"
    retry_count=0
    session=$("$scripts" tmux-wrapper spawn dev {epic} {story_id} \
      --command "$("$scripts" tmux-wrapper build-cmd dev {story_id})")
    # Continue monitoring...
  fi
fi
```

**Fallback flow:**
1. Primary agent crashes after 2 retries
2. IF `fallback != "false"` AND haven't tried fallback yet
3. Switch `AI_AGENT` to fallback agent
4. Reset retry counter to 0
5. Retry with fallback agent (gets 2 more attempts)
6. IF fallback also fails after 2 retries → CRITICAL escalation

**Log message:**
"Primary agent (claude) failed after 2 attempts. Switching to fallback agent (codex)..."

---

## Escalation (after exhausting all retries)

Display:
```
**Session crashed for Story {N}**

Primary agent: {primary} - Failed after 2 attempts
Fallback agent: {fallback} - Failed after 2 attempts

Exit code: {exit_code}
Partial progress: {tasks_completed}/{tasks_total}

[R]etry with primary
[F]allback retry
[S]kip story (mark deferred)
[A]bort orchestration
```

Show any partial output captured for diagnostics.

---

## Integration with Adaptive Retry

Crash recovery is SEPARATE from adaptive retry:
- **Adaptive retry** = session completed but FAILED (wrong output, tests failed)
- **Crash recovery** = session DIED unexpectedly (context limit, API error, kill)

Both can occur: a session might crash on attempt 1, then fail normally on attempt 2.
Track both counters independently.

---

## Orchestrator Monitoring Task Crash (v1.9.0)

### The Problem

When the orchestrator uses background tasks (e.g., Bash with `run_in_background`) to monitor tmux sessions, the monitoring task itself can crash. This is **different** from the tmux session crashing.

**Observed failure mode:**
1. Orchestrator spawns background task to run create+dev+monitor loop
2. Background task crashes after dev-story completes
3. TaskOutput shows "running" but task is dead
4. Tmux session actually completed successfully
5. Orchestrator waits forever on dead monitoring task
6. Code-review never runs because monitoring never returned

### Detection

Signs that your monitoring task has crashed (not the tmux session):

| Signal | Meaning |
|--------|---------|
| `TaskOutput` returns empty 2+ times | Task may be dead |
| Output file path doesn't exist | Task never wrote results |
| "running" status but no progress | Task is stuck or dead |
| Background task ID invalid | Task crashed |

### Recovery Sequence

**See `monitoring-fallback.md` for detailed fallback patterns.**

Quick reference:
1. Stop waiting on dead monitoring task
2. Find tmux sessions: `tmux list-sessions | grep "sa-.*e{epic}-s{story}"`
3. Check session status directly: `story-automator tmux-status-check`
4. Verify source of truth: story file, sprint-status.yaml
5. Resume based on verified state

### Prevention

**NEVER chain multiple workflow steps in a single background task:**

```bash
# ❌ WRONG - If this task crashes, all subsequent steps are lost
for step in create dev review; do
    session=$(...spawn...)
    result=$(...monitor...)
done

# ✅ CORRECT - Each step is monitored separately
# Step 1
session=$(...spawn create...)
result=$(...monitor...)
# Verify state

# Step 2 (only after Step 1 verified)
session=$(...spawn dev...)
result=$(...monitor...)
# Verify state
```

### Key Principle

**The tmux session is the source of truth for session state.**
**The story file and sprint-status.yaml are the source of truth for workflow state.**

Monitoring is just observation - if monitoring fails, verify from source of truth and continue.
