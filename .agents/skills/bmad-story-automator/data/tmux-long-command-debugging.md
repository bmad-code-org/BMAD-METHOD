# Tmux Long Command Debugging Guide

**Created:** 2026-01-21
**Context:** Debugging retrospective session failures in story-automator
**Root Cause:** Terminal width causes line-wrap corruption of long commands

**Related:** See `tmux-long-command-testing.md` for detailed investigation steps and test scripts.

---

## Problem Summary

Tmux sessions spawned via `tmux send-keys` were failing silently when commands exceeded ~1000 characters. Sessions would spawn successfully but the command would never execute, resulting in `stuck/never_active` status.

**Symptoms:**
- Session spawns successfully (tmux session exists)
- Command appears in terminal output (visible in capture-pane)
- No child processes running (Claude never starts)
- No error messages visible
- Monitor reports `stuck` or `never_active`

---

## Root Cause

**Default tmux terminal dimensions:** 80 columns × 24 rows

When `tmux send-keys` sends a command longer than the terminal width:
1. The command wraps across multiple lines in the terminal buffer
2. The shell receives the wrapped input as if it were multiple lines
3. Shell parsing fails or behaves unexpectedly with multi-line wrapped input
4. The command silently fails or produces syntax errors

**Critical insight:** This is NOT a tmux bug or a shell bug individually - it's an interaction problem between how `tmux send-keys` delivers characters and how the shell's line editor handles wrapped input.

---

## Solution

Add explicit dimensions when creating tmux sessions:

```bash
# Before (BROKEN for long commands):
tmux new-session -d -s "$session_name" -c "$PROJECT_ROOT"

# After (FIXED):
tmux new-session -d -s "$session_name" -x 200 -y 50 -c "$PROJECT_ROOT"
```

**Why 200×50:**
- 200 columns handles commands up to ~3000 chars without wrapping
- 50 rows provides adequate scrollback for monitoring
- These dimensions don't affect the actual terminal the user might attach to

---

## Key Insights

### 1. Silent Failures are Deceptive

The command appears in the terminal output but never executes. This makes debugging difficult because:
- `tmux capture-pane` shows the command was "sent"
- No error message is visible
- The session exists and appears healthy

**Lesson:** Always verify command execution by checking for child processes or activity indicators, not just command presence.

### 2. Length Threshold is Approximate

The exact failure point depends on:
- Terminal width (obviously)
- Command content (special characters, quotes)
- Shell type (bash vs zsh)
- tmux version

**Lesson:** Use generous margins. If your longest expected command is 1500 chars, use 200+ column width.

### 3. Quote Escaping is NOT the Issue

Initial hypothesis was that escaped quotes (`\"`) or special characters caused parsing failures. Testing proved this wrong:

```bash
# This works fine with wide terminal:
cmd='claude "test with \"quotes\" inside"'
tmux send-keys -t "$sess" "$cmd" Enter  # SUCCESS at 200 cols
```

**Lesson:** Don't chase red herrings. Test the simplest hypothesis (length/width) before investigating complex escaping issues.

### 4. Process Detection is Reliable

The most reliable way to verify command execution:

```bash
PANE_PID=$(tmux display -t "$session" -p '#{pane_pid}')
if pgrep -P "$PANE_PID" >/dev/null 2>&1; then
    echo "Command is running"
else
    echo "No child processes - command failed"
fi
```

---

## Checklist for Future Debugging

When tmux commands fail silently:

- [ ] Check command length: `echo ${#cmd}`
- [ ] Check terminal dimensions: `tmux display -t "$sess" -p '#{pane_width}'`
- [ ] Test with wider terminal: `-x 200 -y 50`
- [ ] Verify with process check: `pgrep -P $PANE_PID`
- [ ] Check pane status: `tmux display -t "$sess" -p '#{pane_dead}'`
- [ ] Capture full output: `tmux capture-pane -t "$sess" -p -S -100`

---

## Bug: Script File Path Not Executed (2026-02-09)

**Symptoms identical to the terminal-width issue**, but with a different root cause.

When `spawn` receives a command longer than 500 characters, it writes the command to a script file (`/tmp/sa-cmd-{session}.sh`) and sends the path via `tmux send-keys`. However, the path was sent **without the `bash` prefix**, so the shell received a raw file path instead of an executable command.

**Affected commands:** Retrospective prompts (~1577 chars) — all other steps (create-story, dev-story, code-review) are under 500 chars and use direct `send-keys`.

**Fix:** `src/story_automator/commands/tmux.py` — changed the long-command fallback to send `bash /tmp/sa-cmd-{session}.sh` instead of a raw script path, and fail fast if the temp script write or `tmux send-keys` path breaks.

**Lesson:** Two independent failure modes can produce identical symptoms (`never_active`). The `-x 200 -y 50` fix handles line-wrapping for direct `send-keys`, but the script-file fallback path had its own bug. Always check both paths when debugging.

---

## Related Files

- `scripts/story-automator tmux-wrapper` - Session spawning with `-x 200 -y 50` fix + script file `bash` prefix fix
- `scripts/story-automator monitor-session` - Polling loop that detects stuck sessions
- `scripts/story-automator tmux-status-check` - Status detection with activity indicators
- `data/monitoring-pattern.md` - Overall monitoring architecture
- `data/tmux-long-command-testing.md` - Detailed investigation and test scripts
