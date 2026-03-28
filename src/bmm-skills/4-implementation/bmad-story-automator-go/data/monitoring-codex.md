# Codex-Specific Monitoring (v2.4.0)

**Purpose:** Special handling for Codex CLI sessions in story-automator monitor-session

---

## Agent Detection

Codex sessions are detected by:
1. `AI_AGENT` environment variable (most reliable)
2. Explicit Codex CLI identifiers: `OpenAI Codex`, `codex exec`, `codex-cli`, `gpt-*-codex`, `tokens used`

---

## Session States for Codex

| State | Meaning | Detection |
|-------|---------|-----------|
| `in_progress` | Codex actively working | Heartbeat alive OR output changed recently |
| `idle` | Session alive but no prompt yet | Heartbeat idle + output stale (pre-stuck window) |
| `completed` | CLI has exited | Prompt returned, pane exited, or `tokens used` |
| `stuck` | No recent output for too long | Output stale beyond threshold |

**Key Difference:** For Codex, "idle" is NOT the same as "completed". The CLI may have stopped but the workflow might not have finished.

---

## Output Freshness vs Completed Detection

```
output_fresh():   Output hash changed within CODEX_OUTPUT_STALE_SECONDS
codex_completed(): Prompt returned, pane exited, or "tokens used"
```

**Priority:** `completed` > `active` > `idle` > `stuck`

### Output Staleness Window

`CODEX_OUTPUT_STALE_SECONDS` (default: 300) defines how long Codex can be silent
before the session is considered `stuck`. Any output change refreshes the timer.

---

## Code-Review Workflow Verification

For code-review with Codex, story-automator monitor-session verifies completion:

```bash
# Must pass --workflow and --story-key for verification
result=$("$scripts" monitor-session "$session" --json \
  --workflow review --story-key {story_id})
```

**Verification checks:**
1. Sprint-status.yaml shows "done" for story
2. OR story file Status field shows "done"
3. If neither → `final_state: "incomplete"`

---

## Fake Todo Progress

Codex doesn't use TodoWrite, so `story-automator tmux-status-check` fakes progress:
- Start: `todos_total=1, todos_done=0`
- While running: Keep `0/1`
- On idle after activity: Set `1/1` (signals "done, needs verification")
