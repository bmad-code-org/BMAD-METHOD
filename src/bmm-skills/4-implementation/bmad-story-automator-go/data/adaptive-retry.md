# Adaptive Retry Strategy

**Purpose:** Handle dev-story failures intelligently based on progress patterns and agent switching.

**Version:** 2.0.0

**See also:** `retry-fallback-strategy.md` for the universal retry/fallback pattern.

---

## Agent Alternation

This strategy works WITH the retry-fallback pattern:
- Odd attempts (1, 3, 5): Use primary agent
- Even attempts (2, 4): Use fallback agent (if configured)
- Plateau detection applies ACROSS agents (same task across both agents = complexity issue)

---

## Progress Tracking

Track failure patterns across retries (per agent):

```
attempt_1_progress = {agent: primary, tasks: 5/9}
attempt_2_progress = {agent: fallback, tasks: 4/9}
attempt_3_progress = {agent: primary, tasks: 5/9}  # same as attempt 1
attempt_4_progress = {agent: fallback, tasks: 5/9} # plateau detected
attempt_5_progress = {agent: primary, tasks: 5/9}  # confirmed plateau
```

---

## Decision Logic

| Attempt | Condition | Action |
|---------|-----------|--------|
| 1 | FAILURE | Switch to fallback agent, retry |
| 2 | FAILURE, progress > attempt_1 | Switch back to primary, retry with 2x poll interval |
| 2 | FAILURE, progress ≤ attempt_1 | Switch back to primary, analyze if same plateau point |
| 3 | FAILURE, plateau at same task (any agent) | Continue to attempt 4 (confirm with other agent) |
| 4 | FAILURE, plateau confirmed across agents | **DEFER** story (complexity/context limit hit) |
| 4 | FAILURE, variable progress | One more retry with extended timeout |
| 5 | FAILURE, plateau confirmed | **DEFER** story |
| 5 | FAILURE, zero progress all attempts | **ESCALATE** (likely API/connection issue) |
| 5 | FAILURE, variable but incomplete | **ESCALATE** (all retries exhausted) |

---

## Plateau Detection

If `tasks_completed` is identical across 2+ attempts AND the session crashed/stopped at the same task, this indicates a complexity or context limit.

**Indicators:**
- Same task number across multiple attempts
- Session crashes at same point
- No progress despite retries

**Action:** Mark story as "deferred" and continue with next story.

---

## DEFER Action

When a story is deferred (not failed):

1. **Update state:** Mark story as "deferred" in progress table
2. **Log:** "Story {N} deferred - dev-story hit complexity limit at {tasks_completed}/{tasks_total}"
3. **Continue:** Proceed to next story (do not escalate to user unless custom instructions say otherwise)

**Why defer vs fail?**
- Deferred stories can be revisited manually
- Doesn't block automation of remaining stories
- Distinguishes from actual errors (API failures, etc.)

---

## Integration with Crash Recovery

Adaptive retry works WITH crash recovery AND agent fallback:

| Type | Trigger | Handling |
|------|---------|----------|
| **Adaptive Retry** | Session completed but FAILED (wrong output, tests failed) | Progress-based retry with agent alternation |
| **Crash Recovery** | Session DIED unexpectedly (context limit, API error, kill) | Switch agent, retry with new session |
| **Agent Fallback** | Primary agent fails | Automatic switch to fallback agent on next attempt |

All three mechanisms work together:
1. Primary crashes → switch to fallback, new session
2. Fallback fails at task 5 → switch to primary, retry
3. Primary fails at task 5 → plateau detected across agents → DEFER

**Single attempt counter across all failure types.**

---

## Network Error Handling

On network-related failures (see `retry-fallback-strategy.md`):
- Sleep 60 seconds before next attempt
- Network errors do NOT count toward plateau detection
- Always retry after network error (up to max attempts)
