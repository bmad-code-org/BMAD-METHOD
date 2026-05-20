---
name: bmad-memtrace-recovery
description: 'Memtrace MCP server recovery workflow. Use when the adapter emits MEMTRACE_MCP_ERROR_TIMEOUT (connection failure or timeout) to autonomously restart the server.'
---

# Memtrace MCP Server Recovery

## When to Use

Activate this skill when:
- The `memtrace-adapter.mjs` script exits with code 1 AND emits `MEMTRACE_MCP_ERROR_TIMEOUT` on STDOUT
- An MCP tool call fails with a connection/timeout error
- The Memtrace MCP server is unresponsive or hung

## Recovery Protocol

### Step 1: Run the Restart Script

Execute from the project root:
```bash
npm run memtrace:restart
```

**DO NOT** use raw OS commands (`taskkill`, `kill -9`, `pkill`). These are prohibited. Only `npm run memtrace:restart` is permitted.

### Step 2: Evaluate Result

**If exit code 0 (SUCCESS):**
- The stale processes were terminated
- A fresh memtrace instance is verified operational
- Proceed to Step 3

**If exit code 1 (FAILURE):**
- The server could not be recovered
- Halt the current task immediately
- Notify the Human Developer: "Memtrace MCP server recovery failed. Manual intervention required."
- Check that the file `.agents/skills/bmad-memtrace-fallback/SKILL.md` exists. If it does, load the `bmad-memtrace-fallback` skill and follow its Permission Protocol (Steps 1-3: Halt → Wait → Permission/Abandon). If the file does not exist, the fallback skill is missing — notify the developer: "Fallback skill file not found. Cannot proceed with legacy mode without the approved protocol."

### Step 3: Verify Index Freshness

After successful restart, verify the index is up-to-date. Run from the project root:
```bash
node _bmad/scripts/memtrace/memtrace-adapter.mjs --query list_repos
```

**If the adapter fails (exit code 1):** The restart may not have been sufficient. Halt and notify: "Memtrace server responded to initialize but adapter query failed. Manual investigation needed."

If the index is stale, re-index from the project root:
```bash
memtrace index --path .
```
Ensure you are in the project root directory before running this command (the path `.` is relative to CWD).

### Step 4: Resume Task

Once the server is verified online and the index is fresh, resume the original task from the last checkpoint. Do NOT restart the entire workflow — continue from where the timeout occurred.

## Confinement Rules

- **NEVER** use `taskkill`, `kill`, `pkill`, `tasklist`, or any raw OS process command
- **ALWAYS** use `npm run memtrace:restart` as the sole recovery interface
- **ALWAYS** halt and escalate to manual intervention if recovery fails
