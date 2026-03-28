# Agent Fallback Strategy (v3.0.0)

**Multi-Agent Support:** The orchestrator can use Claude or Codex as AI coding agents, with automatic fallback on failure.

## Configuration

From state document (v3.0.0):
```yaml
agentConfig:
  defaultPrimary: "claude"
  defaultFallback: "codex"
  perTask:
    dev:
      primary: "codex"
      fallback: "claude"
  complexityOverrides:
    low:
      dev:
        primary: "claude"
        fallback: false
```

Agent selection is resolved via the deterministic agents file created in preflight:
`_bmad-output/story-automator/agents/agents-{state_filename}.md`

## Agent Differences

| Agent | CLI | Prompt Style | Timeout | Todo Tracking |
|-------|-----|--------------|---------|---------------|
| Claude | `claude --dangerously-skip-permissions` | `bmad-` command syntax | 60min | ☒/☐ checkboxes |
| Codex | `codex exec --full-auto` | Natural language prompt | 90min (1.5x) | Not supported |

**CRITICAL: Claude and Codex use DIFFERENT prompt styles:**
- **Claude:** `bmad-dev-story 6.1` (command syntax)
- **Codex:** Natural language explaining the workflow to execute

The `story-automator tmux-wrapper build-cmd` function automatically generates the correct prompt format based on `AI_AGENT` environment variable.

**See `workflow-commands.md` for complete Codex prompt templates.**

## Fallback Behavior

**When to fallback:**
- Primary agent session crashes (non-zero exit)
- Retries exhausted with primary agent
- `fallback` is configured for the task and not disabled ("false")

**Fallback procedure:**
1. Log: "Primary agent ({primary}) failed after {retries} attempts. Trying fallback ({fallback})..."
2. Set environment: `AI_AGENT={fallback}`
3. Respawn session with fallback agent
4. Monitor as normal (timeouts auto-adjust based on agent type)
5. If fallback also fails → CRITICAL escalation

**Environment Variable:**
```bash
# Set before spawning session
export AI_AGENT="codex"  # or "claude"

# story-automator tmux-wrapper reads this automatically and generates correct prompt format
session=$("$scripts" tmux-wrapper spawn dev {epic} {story_id} \
  --command "$("$scripts" tmux-wrapper build-cmd dev {story_id})")
```

## Codex Monitoring Notes

- **No native todo checkboxes:** Codex doesn't emit ☒/☐, so active sessions report `0/0`
- **Longer waits:** Status check script returns 90s wait estimate for Codex (vs 60s for Claude)
- **Different activity detection:** Uses output freshness + heartbeat (no marker reliance)
- **Output staleness window:** `CODEX_OUTPUT_STALE_SECONDS` (default: 300)
- **1.5x timeout multiplier:** `story-automator monitor-session` applies 1.5x multiplier when `--agent codex`
- **Output-fresh idle normalization:** If heartbeat is idle but output is still fresh, Codex reports `0/1` while work is still considered in progress
- **Completion normalization (v2.2):** When Codex finishes or prompt returns after activity, it reports `1/1` to indicate "work done, needs verification"
- **Idle vs Completed (v2.2):** Codex sessions report "idle" instead of "completed" when CLI stops but no terminal markers

## ⚠️ Codex Code-Review Limitations (v1.5.0)

**CRITICAL: Codex is NOT recommended for code-review workflow.**

### Known Issue: Sprint-Status Not Updated

Codex code-review sessions often complete (CLI exits) WITHOUT updating `sprint-status.yaml` to "done". This causes:
- Monitor reports "completed" but sprint-status unchanged
- Orchestrator loops indefinitely, spawning new review cycles
- 8+ cycles with 0 progress (observed in Story 8.2)

### Root Cause

Codex runs non-interactively via `codex exec`. When it finishes:
1. Tmux session goes idle (no active CLI process)
2. Monitor sees "idle" and marks as "completed"
3. But workflow step 5 (update sprint-status) may not have executed
4. No way to verify workflow actually finished

### Recommended Configuration

```yaml
agentConfig:
  defaultPrimary: "codex"
  defaultFallback: "claude"
  perTask:
    review:
      primary: "claude"   # Never use Codex for code-review
      fallback: false
```

### "incomplete" State (v2.2)

The monitoring system now detects when Codex finishes but sprint-status wasn't updated:
- `final_state: "completed"` → Verified: sprint-status shows "done"
- `final_state: "incomplete"` → Session idle but sprint-status NOT "done"

When "incomplete" is detected:
- **Do NOT retry automatically** (prevents infinite loop)
- Escalate to user with options:
  1. Manual fix (update sprint-status yourself)
  2. Run code-review with Claude
  3. Skip this story

### Verification Command (v2.2)

Check if code-review actually completed:
```bash
"$scripts" orchestrator-helper verify-code-review {story_id}
# Returns: {"verified":true/false, "sprint_status":"...", ...}
```

## Backwards Compatibility

- If `agentConfig` is missing, default to Claude-only (no fallback)
- If `aiCommand` is set (legacy), use it directly with `bmad-` prefix
- New orchestrations should use `agentConfig` instead of `aiCommand`
- Agents file is authoritative when present

---

## Troubleshooting

See `agent-fallback-troubleshooting.md` for detailed troubleshooting steps.
