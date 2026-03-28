# Monitoring Failure Fallback (v1.9.0)

**Purpose:** Recovery patterns when primary monitoring fails.

---

## When Primary Monitoring Fails

Primary monitoring can fail in several ways:
- Background task crashes (TaskOutput returns empty/error)
- Network timeout during monitoring
- Process killed unexpectedly
- Output file missing or corrupted

**Key insight:** The tmux session may have completed successfully even if monitoring died.

---

## Fallback Sequence

When `story-automator monitor-session` fails or background monitoring task dies:

```bash
# STEP 1: Check if tmux session still exists
sessions=$(tmux list-sessions -F '#{session_name}' 2>/dev/null | grep "sa-.*{story_pattern}" || true)

# STEP 2: If session exists, check its status directly
if [ -n "$sessions" ]; then
    while IFS= read -r session; do
        status=$("$scripts" tmux-status-check "$session")
        session_state=$(echo "$status" | cut -d',' -f6)
        # Act based on direct status
    done <<< "$sessions"
fi

# STEP 3: ALWAYS verify source of truth regardless of session status
# Story file check:
story_file=$(ls _bmad-output/implementation-artifacts/{story_prefix}-*.md 2>/dev/null | head -1)
if [ -f "$story_file" ]; then
    # Story file exists - check its status field
fi

# Sprint-status check:
status=$("$scripts" orchestrator-helper sprint-status get "{story_key}")
is_done=$(echo "$status" | jq -r '.done')
```

---

## Detection: Monitoring Task Crashed

Signs that your monitoring task has crashed:

| Signal | Meaning |
|--------|---------|
| `TaskOutput` returns empty 2+ times | Task may be dead |
| Output file path doesn't exist | Task never wrote results |
| "running" status but no progress | Task is stuck or dead |

**Recovery:**
1. Do NOT wait indefinitely for dead monitoring task
2. After 2+ empty TaskOutput results, switch to direct verification
3. Use tmux session checks + source of truth verification
4. Resume workflow based on verified state, not monitoring state

---

## Integration with Retry Logic

**If fallback verification shows step succeeded:**
- Proceed to next step (monitoring failed but workflow succeeded)
- Log: "Monitoring failed but direct verification confirmed success"

**If fallback verification shows step failed/incomplete:**
- Apply normal retry/fallback strategy
- Do NOT treat monitoring failure as step failure

---

## Key Principle

**The tmux session is the source of truth for session state.**
**The story file and sprint-status.yaml are the source of truth for workflow state.**

Monitoring is just observation - if monitoring fails, verify from source of truth and continue.
