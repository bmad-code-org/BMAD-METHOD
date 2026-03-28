# T-Mux Commands Reference

**Related:** See `workflow-commands.md` for BMAD workflow invocation commands.

---

## Session Names

**Pattern (v3.0 - MULTI-PROJECT):** `sa-{project_slug}-{YYMMDD}-{HHMMSS}-e{epic}-s{story}-{step}`

**Examples:**
- `sa-myproj-260114-223045-e6-s64-dev` (Project "myproject", Epic 6, Story 6.4, dev step)
- `sa-webapp-260114-223512-e6-s64-review-1` (Project "webapp", review cycle 1)

### Project Slug for Multi-Project Support

**Why project slug (v3.0):**
- **Isolates sessions per project** - List only current project's sessions
- **Prevents cross-project interference** - Won't kill another project's sessions
- **Enables parallel orchestration** - Run story-automator on multiple projects simultaneously

**Generate project slug:**
```bash
# First 8 chars of project directory name (lowercase, alphanumeric only)
project_slug=$(basename "$PWD" | tr '[:upper:]' '[:lower:]' | tr -cd '[:alnum:]' | cut -c1-8)
```

**Example:** Project at `./my-awesome-project` → `project_slug="myawesom"`

**Why timestamps with seconds (v2.1):**
- Prevents collisions when multiple sessions spawn in same minute
- Easier debugging across multiple orchestration runs
- Session names are unique even if re-running same story
- Can identify stale sessions from crashed runs

**Generate full session name:**
```bash
project_slug=$(basename "$PWD" | tr '[:upper:]' '[:lower:]' | tr -cd '[:alnum:]' | cut -c1-8)
timestamp=$(date +%y%m%d-%H%M%S)  # Returns "260114-223045"
session_name="sa-${project_slug}-${timestamp}-e{epic}-s{story_suffix}-{step}"
```

### Listing/Killing Project-Specific Sessions

**List only current project's sessions:**
```bash
project_slug=$(basename "$PWD" | tr '[:upper:]' '[:lower:]' | tr -cd '[:alnum:]' | cut -c1-8)
tmux list-sessions 2>/dev/null | grep "^sa-${project_slug}-"
```

**Kill only current project's sessions:**
```bash
project_slug=$(basename "$PWD" | tr '[:upper:]' '[:lower:]' | tr -cd '[:alnum:]' | cut -c1-8)
tmux list-sessions -F '#{session_name}' 2>/dev/null | grep "^sa-${project_slug}-" | xargs -I {} tmux kill-session -t {}
```

### No Dots in Session Names

**T-Mux session names CANNOT contain dots (`.`).** Story IDs like "6.2" must be converted to hyphens.

```bash
# Story ID to session name conversion
# Story ID "6.2" → session suffix "s6-2" (NOT "s6.2")
session_suffix=$(echo "{story_id}" | tr '.' '-')
```

**WRONG:** `sa-epic6-s6.2-review-1` ← Will fail with "can't find pane" error
**RIGHT:** `sa-epic6-s6-2-review-1` ← Works correctly

---

## Status Check Script (PREFERRED)

**ALWAYS use the status check script instead of raw pane capture.**

Script: `{project_root}/_bmad/bmm/4-implementation/bmad-story-automator-go/bin/story-automator tmux-status-check`

```bash
# ALWAYS use absolute path - relative paths break when directory changes
{project_root}/_bmad/bmm/4-implementation/bmad-story-automator-go/bin/story-automator tmux-status-check "SESSION_NAME"
```

**Returns CSV:** `status,todos_done,todos_total,active_task,wait_estimate,session_state`

```
active,3,7,Running tests,90,in_progress
idle,0,0,,0,just_started
idle,0,0,,0,completed
not_found,0,0,,0,not_found
error,0,0,capture_failed,30,error
```

**CSV Columns:**
1. `status` - "active" | "idle" | "not_found" | "error" | "crashed"
2. `todos_done` - completed todo count (Claude only; Codex returns 0)
3. `todos_total` - total todo count (Claude only; Codex returns 0)
4. `active_task` - current task (truncated, no commas) OR output file path (for --full/crashed)
5. `wait_estimate` - seconds to wait before next check (heuristic-based). For crashed: exit code.
6. `session_state` - **KEY COLUMN** for decision making:
   - `just_started` - Session spawned, agent loading
   - `in_progress` - Actively working
   - `completed` - Was active, now finished cleanly
   - `crashed` - Session exited with non-zero status (v2)
   - `stuck` - Never became active after multiple polls
   - `not_found` / `error` - Problem states

**Agent Detection (v1.3.0):**
The status check script automatically detects Claude vs Codex sessions:
- **Claude:** Looks for `ctrl+c to interrupt`, `☒`/`☐` checkboxes
- **Codex:** Looks for `OpenAI Codex`, `codex exec`, `codex-cli`, `gpt-*-codex`, `tokens used`
- **Codex completion cues:** `tokens used` line, shell prompt return (e.g., `❯`, `$`, `#`), or clean tmux exit
- Codex sessions get 1.5x longer wait estimates (90s vs 60s default); "succeeded" alone is not treated as active

**For full output (when completed/stuck):**
```bash
{project_root}/_bmad/bmm/4-implementation/bmad-story-automator-go/bin/story-automator tmux-status-check "SESSION_NAME" --full
```
Returns: `idle,0,0,/tmp/sa-output-SESSION_NAME.txt,0,completed`

---

## Polling Pattern (for step-03-execute)

**Use `wait_estimate` from CSV - heuristic estimates optimal interval.**

| status | Action |
|--------|--------|
| `active` | Log: "{todos_done}/{todos_total} - {active_task}". Sleep `wait_estimate` seconds, re-poll |
| `idle` | Run `--full`, parse output per success-patterns.md |
| `crashed` | Session crashed! Column 4 = output file, Column 5 = exit code. Apply adaptive retry strategy. |
| `not_found` | Session ended unexpectedly, escalate |
| `error` | Retry once, then escalate |

**Crashed vs Completed (v2):**
- `completed` = session was active, then exited cleanly (exit code 0)
- `crashed` = session exited with non-zero exit code (context limit, API error, etc.)
- Always check session_state to distinguish between success and failure!

---

## Core Commands

### Create Session + Run Command

**CRITICAL: All child sessions MUST set `STORY_AUTOMATOR_CHILD=true`**

This environment variable tells the stop hook to allow the session to complete normally.
Without it, the stop hook will block child sessions from stopping, causing infinite loops.

```bash
# CRITICAL: Always use -x 200 -y 50 for wide terminal (prevents line-wrap issues with long commands)
tmux new-session -d -s "SESSION_NAME" -x 200 -y 50 -c "PROJECT_PATH" -e STORY_AUTOMATOR_CHILD=true
tmux send-keys -t "SESSION_NAME" "COMMAND_HERE" Enter
```

**Terminal Dimensions:** The `-x 200 -y 50` flags create a wider terminal window. This is **REQUIRED** for commands longer than 80 characters (e.g., YOLO mode retrospective prompts ~1500 chars). Without this, line-wrapping causes shell parsing failures and silent command execution failures.

**Long Command Script Files:** Commands exceeding 500 characters are written to `/tmp/sa-cmd-{session}.sh` and executed via `bash /tmp/sa-cmd-{session}.sh`. The `bash` prefix is critical — without it, the shell receives a raw path and silently fails. These script files are not auto-cleaned; they persist in `/tmp/` until system cleanup.

See `data/tmux-long-command-debugging.md` for detailed troubleshooting.

### Other Commands

```bash
tmux has-session -t "SESSION" 2>/dev/null  # Check exists
tmux kill-session -t "SESSION"              # Kill session
tmux list-sessions                          # List all
tmux capture-pane -t "SESSION" -p -S -100   # Raw capture (use sparingly)
```

---

## Variables

**Agent Configuration (v1.3.0):**

| Variable | Claude | Codex |
|----------|--------|-------|
| CLI | `claude --dangerously-skip-permissions` | `codex exec --full-auto` |
| Prompt Style | `/bmad-bmb-workflow` command | Natural language |
| Timeout Multiplier | 1x (60min) | 1.5x (90min) |
| Todo Tracking | ☒/☐ checkboxes | Not supported |

**Environment Variables:**
- `AI_AGENT` = `claude` or `codex` (used by story-automator tmux-wrapper and story-automator monitor-session)
- `AI_COMMAND` = Full CLI (legacy, deprecated)

`{projectPath}` = project root

*See `workflow-commands.md` for BMAD workflow command patterns (including Codex natural language prompts).*
