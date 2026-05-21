# Session Monitoring Pattern

## Quick Reference

**All monitoring is handled by the installed helper (`$scripts`, usually `scripts/story-automator`). DO NOT manually construct tmux commands.**

### Binary Location

```
scripts/
└── story-automator  # single Python helper (use subcommands below)
```

---

## 🚨 FORBIDDEN PATTERNS (NO EXCEPTIONS)

| Pattern | Why Forbidden |
|---------|---------------|
| `tmux capture-pane` directly | Context bloat, use status script |
| `while true` loops in LLM context | Session crash, use `$scripts monitor-session` |
| Manual session name construction | Error-prone, use `$scripts tmux-wrapper` |
| Parsing raw output yourself | Use `$scripts orchestrator-helper parse-output` |

---

## Standard Workflow: Spawn + Monitor + Verify (Create Example)

```bash
# STEP 1: Spawn session (use $scripts tmux-wrapper)
session_name=$("$scripts" tmux-wrapper spawn create 5 5.3 \
  --command "$("$scripts" tmux-wrapper build-cmd create 5.3 --state-file "$state_file")")

# STEP 2: Monitor until completion (SINGLE API CALL)
result=$("$scripts" monitor-session "$session_name" \
  --verbose --json \
  --workflow create --story-key 5.3 --state-file "$state_file")

# STEP 3: Verify success against the shared create contract
validation=$("$scripts" orchestrator-helper verify-step create 5.3 --state-file "$state_file")
verified=$(echo "$validation" | jq -r '.verified')

# STEP 4: Act on verifier result
[ "$verified" = "true" ] || echo "retry-or-escalate"

# STEP 5: ALWAYS cleanup session (v1.2.0)
"$scripts" tmux-wrapper kill "$session_name"
```

**Context savings:** This entire cycle is 5 bash calls instead of 15+ API roundtrips.

**Session Cleanup (v1.2.0):** ALWAYS kill the session after processing, regardless of success or failure. Orphaned sessions consume resources and cause confusion.

---

## Script Quick Reference

### $scripts tmux-wrapper

```bash
# Spawn session
"$scripts" tmux-wrapper spawn <step> <epic> <story_id> [--command "..."] [--cycle N]

# Generate session name only
"$scripts" tmux-wrapper name <step> <epic> <story_id> [--cycle N]

# Build workflow command
"$scripts" tmux-wrapper build-cmd <step> <story_id> [extra_instruction]

# List/kill sessions
"$scripts" tmux-wrapper list [--project-only]
"$scripts" tmux-wrapper kill <session_name>
"$scripts" tmux-wrapper kill-all [--project-only]
```

### $scripts monitor-session

```bash
# Monitor until completion (returns when session ends)
"$scripts" monitor-session <session_name> [options]

# Options:
#   --max-polls N     Maximum iterations (default: 30)
#   --timeout MIN     Overall timeout in minutes (default: 60)
#   --verbose         Print progress to stderr
#   --json            Output as JSON instead of CSV

# Output (JSON):
# {"final_state":"completed|crashed|stuck|timeout|incomplete|not_found","output_file":"/tmp/...","exit_reason":"..."}
```

### $scripts orchestrator-helper

```bash
# Check sprint status
"$scripts" orchestrator-helper sprint-status get <story_key>

# Parse session output with sub-agent (haiku)
"$scripts" orchestrator-helper parse-output <file> <step_type>

# Marker file operations
"$scripts" orchestrator-helper marker create --epic E --story S --remaining N
"$scripts" orchestrator-helper marker remove
"$scripts" orchestrator-helper marker check

# Escalation checks
"$scripts" orchestrator-helper escalate <trigger> <context>
```

### $scripts orchestrator-helper verify-step

```bash
# Validate create-story via the shared success verifier
"$scripts" orchestrator-helper verify-step create 5.3 --state-file "$state_file"
```

---

## Decision Flow

After `$scripts monitor-session` returns:

| final_state | Action |
|-------------|--------|
| `completed` | Run step verifier or parser for the active workflow |
| `incomplete` | **(v2.2)** Session idle but workflow NOT verified → Escalate immediately |
| `crashed` | Check retry count → retry or escalate |
| `stuck` | Get output → investigate → may need restart |
| `timeout` | Get output → escalate to user |
| `not_found` | Session gone → check for partial work |

---

## Monitoring Failure Fallback (v1.9.0)

**See `monitoring-fallback.md` for complete fallback patterns when monitoring fails.**

Key points:
- If monitoring crashes, tmux session may have completed successfully
- Fall back to direct session checks + source of truth verification
- Do NOT treat monitoring failure as step failure

---

## Statusline Time Gate (v2.6.0)

**Purpose:** Prevent ALL false "stuck" escalations by using the Claude Code statusline as definitive proof-of-life.

### How It Works

Claude Code displays a statusline at the bottom of the terminal:
```
folder | ctx(N%) | HH:MM:SS
                   ^^^^^^^^ <- This time updates continuously while Claude runs
```

The installed helper's `$scripts tmux-status-check` command:
1. Parses the statusline time from the tmux pane
2. Stores it in the session state file
3. Compares with previous poll's time
4. **If time has advanced → session is ALIVE → DO NOT escalate**

### Decision Matrix

| Previous Time | Current Time | Other Checks Say | Result |
|---------------|--------------|------------------|--------|
| 10:00:00 | 10:01:00 | stuck | `just_started` (time advanced = alive) |
| 10:00:00 | 10:00:00 | stuck | `stuck` (time unchanged) |
| (none) | 10:00:00 | stuck | `just_started` (first observation = alive) |
| (none) | (none) | stuck | `stuck` (no statusline data) |

### Key Principle

**The statusline time gate is the FINAL AUTHORITY.** Even if all other detection methods (process checks, activity indicators, heartbeat) suggest the session is stuck, if the statusline time has advanced, the session is definitively alive and MUST NOT be escalated.

This prevents false escalations for:
- Complex sessions in long thinking phases
- Sessions with unusual output patterns
- Edge cases where other detection fails

---

## References

- **Codex monitoring details:** `monitoring-codex.md`
- **Output parsing + review handling:** `monitoring-pattern-parsing.md`
