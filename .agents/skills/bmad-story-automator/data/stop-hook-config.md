# Stop Hook Configuration

This document defines the Stop hook required for the story-automator to prevent premature stopping during orchestration in Claude or Codex.

**Related:** See `stop-hook-troubleshooting.md` for child session handling, manual override, and troubleshooting.

---

## Overview

The Stop hook uses a **marker file approach**:
1. When story-automator starts → Creates marker file with orchestration context
2. When the active agent tries to stop → Hook script checks marker file
3. If no marker or completed → Allow stop (normal agent usage)
4. If marker exists with pending stories → Block stop with continuation guidance
5. When story-automator completes → Removes marker file

**Important (v2 fix):** The hook intentionally does NOT check the `stop_hook_active` flag. This flag stays `true` for the entire session after one blocked stop, which caused premature exits in long orchestrations. The marker file alone is the source of truth.

---

## Multi-Project Support (v2.0)

**CRITICAL:** The marker file is now PROJECT-SCOPED to support running story-automator on multiple projects simultaneously.

**Old location (DEPRECATED):** `/tmp/.story-automator-active`
**New location:** runtime-specific project marker resolved by `orchestrator-helper marker path`

### Why Project-Scoped?

When running story-automator on multiple projects at the same time:
- Old: All projects shared `/tmp/.story-automator-active` → Cross-project interference
- New: Each project has its own marker in the active runtime layout. The marker follows the active installed skill root parent, for example `.claude/`, `.agents/`, or `.codex/`.

### How It Works

1. The installed hook command exports `PROJECT_ROOT` for the target project before invoking `story-automator stop-hook`
2. The stop hook resolves the marker from `PROJECT_ROOT`, not from the caller's ambient working directory
3. Project A's stop hook only sees Project A's marker
4. Project B's stop hook only sees Project B's marker

Do not hard-code the marker path. Use `orchestrator-helper marker path`; this keeps Claude, `.agents`-based Codex, and `.codex`-based Codex installs consistent with the active skill root.

### State Files Also Scoped

The status check script state files are also project-scoped:
- **Old:** `/tmp/.tmux-session-{SESSION}-state.json`
- **New:** `/tmp/.sa-{project_hash}-session-{SESSION}-state.json`

Where `project_hash` = first 8 chars of MD5 hash of project root path.

---

## Hook Configuration

### Runtime Selection

The helper selects hook configuration syntax from the active provider:
- `BMAD_RUNTIME_PROVIDER`
- `STORY_AUTOMATOR_RUNTIME_PROVIDER`

Set one of these to `claude` or `codex` to force the provider. If none is set, the helper infers the provider from the installed skill root.

`AI_AGENT` only selects child-agent runtime for spawned work. It does not decide which top-level hook files are written.

The provider decides which hook files are written. Marker location is resolved separately and follows the active installed story-automator skill root when possible. For example, a Codex run using a migrated `.claude/skills/bmad-story-automator` install still uses the `.claude/.story-automator-active` marker so the hook and orchestrator read the same file.

For Claude, add this to the target project's `.claude/settings.json`:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "/absolute/path/to/scripts/story-automator stop-hook",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

For Codex, enable hooks in the target project's `.codex/config.toml`:

```toml
[features]
codex_hooks = true
```

Then add this to `.codex/hooks.json`:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "/absolute/path/to/scripts/story-automator stop-hook",
            "timeout": 10,
            "statusMessage": "Checking story automator state"
          }
        ]
      }
    ]
  }
}
```

Codex trust is separate from hook configuration. A project can have the Story Automator hook written to disk and still require trust approval before Codex will run it. `ensure-stop-hook` now reports that state as pending trust instead of verified.

### Binary Path is Always Absolute

**The stop hook binary resolves itself to an absolute path.** Regardless of how the caller passes the `--command` argument (relative, project-relative, or absolute), the helper stores a consistent absolute path in `.claude/settings.json` or `.codex/hooks.json`.

This prevents the inconsistency where the AI agent resolves frontmatter paths differently across sessions, which previously caused repeated hook installations and unnecessary restart loops.

**Migration:** If an existing hook config contains a relative or project-relative path, `ensure-stop-hook` will normalize it to absolute in-place without triggering a restart (`reason: "hook_normalized"`).

**When hook fails with "no such file or directory":**
- Verify BMAD is installed in the target project
- Check the binary exists in the active runtime skills tree, for example: `test -x <installed-skill-root>/bmad-story-automator/scripts/story-automator`
- Ensure binary is executable: `chmod +x <installed-skill-root>/bmad-story-automator/scripts/story-automator`

---

## Marker File Format

**Location (v2.0):** resolved by `orchestrator-helper marker path`

*Note: The orchestrator adds the active marker entry returned by `orchestrator-helper marker path` to `.gitignore`. Common entries are `.claude/.story-automator-active`, `.agents/.story-automator-active`, and `.codex/.story-automator-active`.*

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
1. Resolve active runtime provider
2. For Claude, check `.claude/settings.json`; for Codex, check `.codex/hooks.json` and `.codex/config.toml`
3. Parse hook JSON and look for hooks.Stop array
4. Check if any hook command contains "story-automator stop-hook"

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
