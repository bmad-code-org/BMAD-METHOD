# Execution Patterns (v1.9.0)

**Purpose:** Critical execution patterns and anti-patterns for the orchestrator.

---

## 🚨 FORBIDDEN EXECUTION PATTERNS (NO EXCEPTIONS)

### NEVER Chain Multiple Workflow Steps

**FORBIDDEN:**
```bash
# ❌ WRONG - Chaining steps in a loop bypasses per-step error handling
for step in create dev; do
  session=$("$scripts" tmux-wrapper spawn "$step" ...)
  result=$("$scripts" monitor-session "$session" ...)
done
```

**WHY:** If the monitoring task crashes mid-loop, ALL subsequent steps are lost. The orchestrator loses visibility even though tmux sessions may have completed successfully.

**REQUIRED:**
```bash
# ✅ CORRECT - Each step is a separate operation with its own error handling
# Step A: Create
session=$("$scripts" tmux-wrapper spawn create ...)
result=$("$scripts" monitor-session "$session" ...)
"$scripts" tmux-wrapper kill "$session"
# VERIFY state before proceeding

# Step B: Dev (only after create verified)
session=$("$scripts" tmux-wrapper spawn dev ...)
result=$("$scripts" monitor-session "$session" ...)
"$scripts" tmux-wrapper kill "$session"
# VERIFY state before proceeding
```

---

## ALWAYS Verify State After Each Step

After each workflow step completes (create/dev/auto/review), **VERIFY state from source of truth** before proceeding to the next step:

1. **Story file exists and has expected content** (for create-story)
2. **Sprint-status.yaml shows correct status** (for dev-story, code-review)
3. **DO NOT rely solely on monitoring output** - if monitoring fails, verify directly

---

## IF Monitoring Fails

If `story-automator monitor-session` or background task monitoring fails:

1. Check if tmux session still exists: `tmux list-sessions | grep {pattern}`
2. Check session status directly: `"$scripts" tmux-status-check "$session"`
3. Verify story file / sprint-status regardless of monitoring output
4. Only escalate after direct verification confirms failure

**See also:** `monitoring-fallback.md` for detailed fallback patterns.
