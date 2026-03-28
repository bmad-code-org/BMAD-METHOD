# Agent Fallback Troubleshooting

### Issue: Session spawns Claude instead of Codex

**Symptoms:**
- Output shows Claude-specific messages (e.g., "You've used 84% of your weekly limit")
- Expected Codex but got Claude

**Cause:** The `--agent` flag must be passed to `story-automator tmux-wrapper spawn`, not to `build-cmd`.

**Correct Usage (v1.4.0+):**
```bash
# Method 1: Use --agent flag on spawn (RECOMMENDED)
session=$("$scripts" tmux-wrapper spawn dev "$epic" "$story_id" \
  --agent codex \
  --command "$("$scripts" tmux-wrapper build-cmd dev "$story_id")")

# Method 2: Set environment variable before spawn
export AI_AGENT="codex"
session=$("$scripts" tmux-wrapper spawn dev "$epic" "$story_id" \
  --command "$("$scripts" tmux-wrapper build-cmd dev "$story_id")")
```

**Wrong Usage:**
```bash
# WRONG - this doesn't work
session=$("$scripts" tmux-wrapper spawn dev "$epic" "$story_id" \
  --command "$("$scripts" tmux-wrapper build-cmd dev "$story_id" --agent codex)")
```

### Issue: Monitor reports "stuck" but Codex is active

**Symptoms:**
- `story-automator monitor-session` returns `stuck` state after 4 polls
- Manual inspection shows Codex still producing output (no prompt, output continues to grow)

**Cause:** The monitoring script relied on marker detection instead of output freshness.

**Fixed in v2.4.0:**
- Output freshness tracking (no marker reliance)
- `CODEX_OUTPUT_STALE_SECONDS` controls how long Codex can be silent before "stuck"
- Codex still gets 6 poll grace period before "stuck"

**Verification:**
```bash
# Check if session has AI_AGENT set
tmux show-environment -t "session-name" AI_AGENT

# Manual session status check
"$scripts" tmux-status-check "session-name" --project-root "$PWD"
```

### Issue: log command error when using --agent flag

**Symptoms:**
```
log: Unknown subcommand 'Codex agent detected - applying 1.5x timeout (90min)'
```

**Cause:** macOS has `/usr/bin/log` system command. If the `log()` bash function wasn't defined before first use, bash fell through to the system command.

**Fixed in v1.4.0:** The `log()` function is now defined before argument parsing in `story-automator monitor-session`.

### Issue: Manual polling required as workaround

**If monitoring still fails**, use this manual polling approach:
```bash
for i in {1..60}; do
    sleep 30
    # Check if session still exists
    if ! tmux has-session -t "session-name" 2>/dev/null; then
        echo "Session ended"
        break
    fi
    # Check for shell prompt (completion indicator)
    last_line=$(tmux capture-pane -t "session-name" -p | tail -1)
    if echo "$last_line" | grep -qE '❯$|\$$|#$'; then
        echo "Session complete (shell prompt detected)"
        break
    fi
done
```

### Issue: Codex sessions explore files but don't execute full workflow (v1.4.0)

**Symptoms:**
- Session output shows file exploration (`sed`, `rg`, `cat` commands)
- No actual review findings or story updates
- Sprint-status never changes from "review" to "done"
- Session completes but workflow steps 1-5 weren't followed

**Cause:** Codex uses natural language prompts and may not follow structured workflow instructions as reliably as Claude.

**Mitigation strategies:**
1. **Use Claude for code-review by default** - More reliable at following multi-step workflows
2. **Add explicit step markers** - Tell Codex to output "STEP 1 COMPLETE", "STEP 2 COMPLETE" etc.
3. **Verify after session** - Check story file Status field, not just sprint-status

**Recommended agent configuration for reliability:**
```yaml
agentConfig:
  defaultPrimary: "claude"
  defaultFallback: "codex"
  perTask:
    # create-story: Either agent works well
    create:
      primary: "claude"
    # dev-story: Either agent works, Codex may be faster for simple tasks
    dev:
      primary: "codex"
    # code-review: Claude recommended - more reliable at following workflow
    review:
      primary: "claude"
      fallback: false
```

### Issue: Code-review doesn't update sprint-status.yaml

**Symptoms:**
- Code-review session completes
- Story file shows review was done (Dev Agent Record updated)
- But sprint-status.yaml still shows "review" instead of "done"

**Cause:** Code-review workflow step 5 updates sprint-status, but session may not reach step 5 or may use wrong story key format.

**Verification (v1.4.0):**
```bash
# Check story file status directly
"$scripts" orchestrator-helper story-file-status 8.2

# Compare with sprint-status
"$scripts" orchestrator-helper sprint-status get "8-2-flipside-crypto-provider"

# If story file shows "done" but sprint-status doesn't, manually sync:
# Edit _bmad-output/implementation-artifacts/sprint-status.yaml and change "8-2-story-name: review" to "done"
```

### When to manually intervene

**Intervene immediately if:**
1. **5 code-review cycles with no progress** - Agent likely stuck in a loop
2. **Story file shows "done" but sprint-status doesn't** - Sync issue, manual fix is faster
3. **Tests passing but review keeps finding issues** - May be false positives
4. **Codex sessions consistently incomplete** - Switch to Claude for that workflow

**Steps for manual intervention:**
```bash
# 1. Check actual story status
"$scripts" orchestrator-helper story-file-status {story_id}

# 2. Run tests to verify code quality
go test ./src/... || npm test

# 3. If tests pass, manually update sprint-status
# Edit: _bmad-output/implementation-artifacts/sprint-status.yaml
# Change: "8-2-story-name: review" to "8-2-story-name: done"

# 4. Resume orchestration - it will see "done" and proceed to commit
```

### Debugging Agent Detection

```bash
# Check current agent type detection
"$scripts" tmux-wrapper agent-type

# Check what CLI command would be used
"$scripts" tmux-wrapper agent-cli

# Check what command prefix would be used
"$scripts" tmux-wrapper skill-prefix

# View session environment
tmux show-environment -t "session-name"

# Check story key normalization (v1.4.0)
"$scripts" orchestrator-helper normalize-key "8.2"
"$scripts" orchestrator-helper normalize-key "8-2-flipside-crypto-provider"
```
