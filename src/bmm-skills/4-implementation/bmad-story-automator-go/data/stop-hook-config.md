# Stop Hook Configuration

This document defines the Claude Code Stop hook required for the story-automator to prevent premature stopping during orchestration.

**Related:** See `stop-hook-troubleshooting.md` for child session handling, manual override, and troubleshooting.

---

## Overview

The Stop hook uses a **marker file approach**:
1. When story-automator starts → Creates marker file with orchestration context
2. When Claude tries to stop → Hook script checks marker file
3. If no marker or completed → Allow stop (normal Claude usage)
4. If marker exists with pending stories → Block stop with continuation guidance
5. When story-automator completes → Removes marker file

**Important (v2 fix):** The hook intentionally does NOT check the `stop_hook_active` flag. This flag stays `true` for the entire session after one blocked stop, which caused premature exits in long orchestrations. The marker file alone is the source of truth.

---

## Multi-Project Support (v2.0)

**CRITICAL:** The marker file is now PROJECT-SCOPED to support running story-automator on multiple projects simultaneously.

**Old location (DEPRECATED):** `/tmp/.story-automator-active`
**New location:** `{project_root}/.claude/.story-automator-active`

### Why Project-Scoped?

When running story-automator on multiple projects at the same time:
- Old: All projects shared `/tmp/.story-automator-active` → Cross-project interference
- New: Each project has its own marker in `.claude/` → Full isolation

### How It Works

1. Stop hook uses `$PWD` to determine current project root
2. Marker file is read from `{PWD}/.claude/.story-automator-active`
3. Project A's stop hook only sees Project A's marker
4. Project B's stop hook only sees Project B's marker

### State Files Also Scoped

The status check script state files are also project-scoped:
- **Old:** `/tmp/.tmux-session-{SESSION}-state.json`
- **New:** `/tmp/.sa-{project_hash}-session-{SESSION}-state.json`

Where `project_hash` = first 8 chars of MD5 hash of project root path.

---

## Hook Configuration

Add this to the target project's `.claude/settings.json`:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "/absolute/path/to/bin/story-automator stop-hook",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

### Binary Path is Always Absolute

**The stop hook binary resolves itself to an absolute path via `os.Executable()`.** Regardless of how the caller passes the `--command` argument (relative, project-relative, or absolute), the binary self-resolves and stores a consistent absolute path in settings.json.

This prevents the inconsistency where the AI agent resolves frontmatter paths differently across sessions, which previously caused repeated hook installations and unnecessary restart loops.

**Migration:** If an existing settings.json contains a relative or project-relative path, `ensure-stop-hook` will normalize it to absolute in-place without triggering a restart (`reason: "path_normalized"`).

**When hook fails with "no such file or directory":**
- Verify BMAD is installed in the target project
- Check the binary exists: `ls -la _bmad/bmm/4-implementation/bmad-story-automator-go/bin/story-automator`
- Ensure binary is executable: `chmod +x _bmad/bmm/4-implementation/bmad-story-automator-go/bin/story-automator`

---

## Marker File Format

**Location (v2.0):** `{project_root}/.claude/.story-automator-active`

*Note: Ensure `.claude/.story-automator-active` is in your `.gitignore`*

Content (JSON - v1.2.0 with heartbeat):
```json
{
  "epic": "epic-01",
  "currentStory": "story-01",
  "storiesRemaining": 3,
  "stateFile": "/path/to/orchestration-epic01.md",
  "startedAt": "2026-01-13T10:00:00Z",
  "heartbeat": "2026-01-13T10:30:00Z",
  "pid": 12345
}
```

### Fields (v1.2.0):
- `heartbeat`: Last activity timestamp, updated periodically during execution
- `pid`: Process ID of the orchestrator (helps detect crashed sessions)

### Staleness Check

The stop hook checks if marker heartbeat is older than 30 minutes (stale = orchestrator crashed). If stale, allow stop. See `story-automator stop-hook` for implementation.

---

## Verification Logic

The orchestrator verifies hook installation at startup:

```
1. Check if .claude/settings.json exists
2. Parse JSON and look for hooks.Stop array
3. Check if any hook command contains "story-automator stop-hook"

IF found → Continue
IF not found → Add hook, instruct restart
```

---

## Hook Behavior

| Scenario | Action |
|----------|--------|
| `STORY_AUTOMATOR_CHILD=true` | `exit 0` → Always allow (child session) |
| No marker file | `exit 0` → Allow stop |
| Marker exists, `storiesRemaining=0` | `exit 0` → Allow stop |
| Marker exists, `storiesRemaining > 0` | Output JSON → Block stop with reason |

**Key fix (Session 10):** The hook no longer checks `stop_hook_active`. This flag was causing premature exits in long orchestrations because it stays `true` for the entire session after the first blocked stop.
