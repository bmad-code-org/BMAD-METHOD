# Stop Hook Troubleshooting

**Related:** See `stop-hook-config.md` for core configuration.

---

## Child Session Handling (Session 19 Fix)

**CRITICAL:** The stop hook is installed at the PROJECT level. When the orchestrator spawns T-Mux sessions (create-story, dev-story, code-review), those child agent instances:
1. Run in the same project directory
2. Read the same project-level hook configuration
3. Have the same stop hook configured
4. See the same marker file

**Problem:** Without distinction, the stop hook blocks child sessions from completing, creating infinite loops.

**Solution:** All T-Mux child sessions MUST be spawned with:

```bash
tmux new-session -d -s "SESSION_NAME" -e STORY_AUTOMATOR_CHILD=true
```

The `-e STORY_AUTOMATOR_CHILD=true` flag exports the environment variable to the session. The stop hook checks this FIRST and immediately allows stop if set.

**Who gets blocked vs allowed:**

| Session Type | STORY_AUTOMATOR_CHILD | Stop Hook Behavior |
|--------------|----------------------|-------------------|
| Orchestrator | not set | BLOCKED (if marker + stories remaining) |
| create-story | `true` | ALLOWED (always) |
| dev-story | `true` | ALLOWED (always) |
| code-review | `true` | ALLOWED (always) |
| testarch-automate | `true` | ALLOWED (always) |
| Internal scripts (e.g., haiku calls) | `true` | ALLOWED (always) |

---

## Internal Nested Agent Calls (Session 20 Fix)

### Claude

**CRITICAL:** Scripts that internally call `claude` (like `story-automator tmux-status-check` using Haiku for wait estimation) while an orchestration marker is active MUST prefix the call with the environment variable.

```bash
# WRONG - will hang when stop hook blocks the claude exit
RESULT=$(claude -p --model haiku "..." 2>/dev/null)

# CORRECT - allows claude to exit normally
RESULT=$(STORY_AUTOMATOR_CHILD=true claude -p --model haiku "..." 2>/dev/null)
```

**Why:** Even non-interactive `claude -p` calls trigger the stop hook when they exit. Without the env var, the hook sees the marker file and blocks, causing the script to hang indefinitely.

### Codex

For Codex, apply the same `STORY_AUTOMATOR_CHILD=true` convention to any future internal non-interactive Codex calls that run inside an active story-automator project.

---

## Stop Hook Messages Are NOT User Input

**When you present a menu and wait for user input, the stop hook may fire with messages like:**
> "Story Automator is running with N stories remaining. Continue processing..."

**THIS IS NOT USER INPUT.** Do not interpret stop hook feedback as a menu selection.

- NEVER treat "continue processing" as selecting [R]esume
- NEVER proceed past a menu because the stop hook fired
- ALWAYS wait for ACTUAL user input (typed response)
- Stop hook messages are about STOPPING behavior only

**Why this happens:** The stop hook fires when the agent pauses, not just when explicitly stopping. During menu waits, it may fire repeatedly. Ignore these messages when waiting for user input.

---

## Manual Override

If the orchestrator gets stuck, users can:
1. Remove the marker file from the project root using the installed story-automator helper: `orchestrator-helper marker remove`
2. Stop the active agent normally
3. Resume later with the continue flow

**For multi-project cleanup:**
```bash
# Remove marker for current project only
helper="<installed-skill-root>/bmad-story-automator/scripts/story-automator"
[ -x "$helper" ] || { echo "story-automator helper not found: $helper" >&2; exit 1; }
"$helper" orchestrator-helper marker remove

# Clean up project-scoped state files (optional)
PROJECT_HASH=$(echo -n "$PWD" | md5sum | cut -c1-8)
rm -f /tmp/.sa-${PROJECT_HASH}-session-*
rm -f /tmp/sa-${PROJECT_HASH}-output-*
```

---

## Troubleshooting

| Issue | Check |
|-------|-------|
| Hook not running | Valid hook config? For Codex, is `[features].codex_hooks = true` set and is the project trusted? Script executable? Session restarted? |
| "no such file" | BMAD installed? Path correct in the active runtime skills tree? Check each installed root, for example `.claude/skills`, `.agents/skills`, or `.codex/skills`. |
| Premature stops | Marker exists? `storiesRemaining > 0`? v2 fix applied? |
| Child sessions blocked | `STORY_AUTOMATOR_CHILD=true` set? Check spawn command. |
| Script hangs | Internal agent calls missing env var? See Session 20 Fix. |
| Hook fires during menus | Normal behavior - ignore messages, wait for real input. |
