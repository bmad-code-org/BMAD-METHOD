# Retry & Fallback Strategy

**Purpose:** Universal retry and fallback agent pattern for all workflow steps (create, dev, auto, review).

**Version:** 2.0.0

---

## Core Principle

**NEVER escalate to user on first failure.** Exhaust all retry options first:
1. Try fallback agent (if configured for this task)
2. Retry with alternating agents up to 5 total attempts
3. Sleep between retries if network issues detected
4. Only escalate after all attempts exhausted

---

## Agent Configuration (v3.0.0)

**Deterministic agent resolution via agents file:**

```bash
# Resolve agent for a specific task (create, dev, auto, review)
# Uses agents file generated during preflight (complexity-aware)
resolve_agent_for_task() {
    local task="$1"
    local state_file="$2"
    local story_id="$3"

    result=$("$scripts" orchestrator-helper agents-resolve \
        --state-file "$state_file" \
        --story "$story_id" \
        --task "$task")

    primary_agent=$(echo "$result" | jq -r '.primary')
    fallback_agent=$(echo "$result" | jq -r '.fallback')

    # Handle "false"/null meaning disabled
    [ "$fallback_agent" = "false" ] && fallback_agent=""
}

# Usage:
resolve_agent_for_task "review" "$state_file" "{story_id}"
echo "Review task: primary=$primary_agent, fallback=$fallback_agent"
```

**Fallback behavior:**
- If `fallback_agent` is empty, "false", or same as primary → retry with primary only
- If `fallback_agent` differs → alternate between agents on retries
- Complexity overrides win per task, then per-task overrides, then defaults

---

## Retry Sequence (5 Attempts Max)

| Attempt | Agent | Delay Before | Notes |
|---------|-------|--------------|-------|
| 1 | primary | none | Initial attempt |
| 2 | fallback | 0-60s | Switch agent; delay if network error |
| 3 | primary | 0-60s | Back to primary |
| 4 | fallback | 60s | Always delay by attempt 4 |
| 5 | primary | 60s | Final attempt |

**If no fallback configured:** All 5 attempts use primary agent.

---

## Network Error Detection

**Indicators of network/transient issues:**
- Session output contains: "connection refused", "timeout", "rate limit", "503", "502"
- Session crashed with zero output
- `story-automator monitor-session` returns `final_state: "crashed"` with empty output
- Session stuck at "never_active" state (no response from API)

**On network error detection:**
- Sleep 60 seconds before next attempt
- Log: "Network issue detected, waiting 60s before retry..."

---

## Implementation & Validation Examples

Detailed bash patterns and step-specific validation examples are moved to:

- **`retry-fallback-implementation.md`** (implementation wrapper + per-step validation)

---

## Escalation (After All Attempts)

Only after exhausting all 5 attempts:

1. Update state: `status = "AWAITING_DECISION"`
2. Log all attempt details:
   ```
   [timestamp] ESCALATION: {step} failed after 5 attempts
   - Attempt 1 (primary): {result}
   - Attempt 2 (fallback): {result}
   - Attempt 3 (primary): {result}
   - Attempt 4 (fallback): {result}
   - Attempt 5 (primary): {result}
   ```
3. Present options to user:
   - Retry with different settings
   - Skip this story
   - Abort orchestration

---

## Integration with Adaptive Retry

This strategy **replaces** the simple retry logic. The adaptive-retry.md plateau detection still applies within this framework:

- If same task plateau detected across 3+ attempts → DEFER instead of escalate
- Plateau detection runs AFTER agent switching (so both agents hit same wall)

---

## Logging

All retry attempts should be logged in the action log:
```
[timestamp] {step} attempt {N}/{max} with {agent}: {result}
```

On success after retry:
```
[timestamp] {step} succeeded on attempt {N} with {agent} (after {N-1} failures)
```
