---
name: bmad-memtrace-fallback
description: 'Memtrace MCP fallback override. Use when server recovery has failed and the Human Developer EXPLICITLY grants permission to use legacy text-search tools (grep, glob, rg, find) instead of Memtrace structural queries.'
---

# Memtrace Manual Fallback Override

## When to Use

Activate this skill after ALL the following have been attempted and failed:

1. **Timeout detected** — The MCP connection failed, timed out, or a specific tool call returned an error (see the timeout detection and recovery workflow).
2. **Auto-recovery attempted** — `npm run memtrace:restart` was executed and the adapter `--check-freshness` was re-run.
3. **Manual restart attempted** — The recovery command was typed directly in the system terminal (by the developer or at their request).
4. **Still failing** — After all the above, the Memtrace server or specific tools remain unavailable.

**Pre-condition check before activating this skill:**
- Verify that `npm run memtrace:restart` exists in `package.json` (script from the recovery workflow). If it does not exist, the recovery attempt was incomplete — do not enter fallback mode.

**DO NOT** activate this skill:
- Before attempting the full recovery chain (restart + reindex + manual terminal attempt)
- When the Memtrace server is simply slow (wait for timeout first)
- When you suspect the server might recover with another retry
- Preemptively "just in case" the server goes down

## Permission Protocol

### Step 1: Halt Execution + Verify

Before asking the developer, run a final verification: call `list_indexed_repositories` via MCP. If it succeeds, the server is operational — abort this skill and resume normal Memtrace operation. If it fails or hangs, proceed below.

Immediately stop the current task. Do NOT attempt to continue with any code-discovery or code-modification operations.

Output a clear status message to the Human Developer:

> **Memtrace MCP server is unrecoverable.**
>
> Recovery script (`npm run memtrace:restart`) failed with exit code 1.
> The graph engine is permanently inoperable for this session.
>
> **I need your explicit permission to continue using legacy text-search heuristics** (`grep`, `glob`, `rg`, `find`) instead of Memtrace structural queries.
>
> **WARNING:** Without Memtrace, structural verification (blast radius, dead code detection, dependency analysis) will NOT be performed. Quality gates that require structural data (`qa-memtrace.mjs`) cannot run. Code changes made in this mode carry higher risk of unintended breakage.
>
> **Do you authorize me to proceed with legacy text-search tools?** [yes / no]

### Step 2: Wait for Explicit Response

- **ONLY** "yes" (English) is accepted as explicit permission. Any other response ("no", "maybe", "I guess so", "whatever", "if you must", silence, non-English) is treated as NOT granted.
- **Timeout:** Wait up to 5 minutes for a response. After 2 minutes of silence, re-prompt once. After 3 total timeouts with no response, treat as permission denied.
- **If the developer asks clarifying questions**, answer honestly but do NOT proceed until a clear "yes" is given.
- **If the agent session restarts** (crash, disconnect), re-request permission — fallback state is not persisted across sessions.

### Step 3a: Permission GRANTED

If the developer responds with "yes":

1. **Acknowledge the authorization**: "Proceeding with legacy text-search heuristics as authorized. Structural verification via Memtrace will be skipped."
2. **Disable Memtrace tools**: Do NOT call any Memtrace MCP tools (`find_code`, `find_symbol`, `get_impact`, `find_dead_code`, `list_indexed_repositories`, etc.) for the remainder of this session. These will fail (connection refused).
3. **Use legacy tools instead**:
   - `grep` (or `rg`) for content search
   - `glob` for cross-platform file-pattern matching
   - `Get-ChildItem` (PowerShell) or `ls` (Unix) for directory listing
   - `read` for reading file contents
   - `write` / `edit` for modifying files (standard agent tools — unaffected by Memtrace)
4. **Follow all other architectural constraints**: Anti-Promise.all, JSON mutation safety, file location rules, naming conventions — these still apply.
5. **Tools not listed in the equivalences table**: For any Memtrace tool without a legacy equivalent listed below, use `grep` + `glob` where applicable, or skip the operation entirely. Document which tools were skipped.
6. **Quality gates**: For quality gates (`qa-memtrace.mjs`) that require structural data, produce a textual best-effort analysis using grep results. Explain to the developer that the gate cannot run without Memtrace and ask whether to proceed or skip.
7. **Document the fallback**: In completion notes, explicitly state that legacy fallback was used and Memtrace structural verification was NOT performed. Record who granted permission, when, and what task was affected. Include the specific grep/glob patterns used.
8. **Re-check periodically**: Every 15 minutes, attempt one `list_indexed_repositories` call. If it succeeds, the server has recovered — exit legacy mode, notify the developer, and resume normal Memtrace operation.

### Step 3b: Permission DENIED

If the developer denies permission, does not respond, or gives any response other than "yes":

1. **Acknowledge the decision**: "Understood. Abandoning task since Memtrace MCP server is unavailable and legacy fallback was not authorized."
2. **Abandon the task**: Do NOT attempt to work around the denial. Do NOT use grep/glob secretly. Do NOT "try anyway."
3. **Discard partial results**: Any grep/glob results collected before the halt should be discarded (not trusted without Memtrace verification).
4. **Document the abort**: Record that the task was abandoned due to unrecoverable Memtrace failure and denied fallback authorization. Include who made the decision, the timestamp, and the task description.

## Legacy Tool Equivalents

When using legacy tools, map Memtrace operations to their text-search equivalents. For any tool not listed here, use `grep` + `glob` where applicable or skip the operation:

| Memtrace Tool | Legacy Equivalent |
|---------------|-------------------|
| **Discovery** | |
| `find_code` / `find_symbol` | `grep` / `rg` for name; `glob` for file patterns |
| `get_source_window` | `read` with offset/limit at known file |
| `get_directory_tree` | `Get-ChildItem -Recurse` / `ls -R` |
| **Dependency** | |
| `get_impact` | Manual grep for callers/references (less reliable, no transitive analysis) |
| `get_symbol_context` | Read surrounding file context; grep for imports and callers |
| `analyze_relationships` | Manual grep for callers/callees (no graph traversal) |
| `find_dependency_path` | Manual path tracing via grep (error-prone) |
| `get_api_topology` | Not available — document as skipped |
| **Quality** | |
| `find_dead_code` | Manual reference counting via grep (error-prone, misses dynamic dispatch) |
| `find_most_complex_functions` | Not available — document as skipped |
| `find_bridge_symbols` | Not available — document as skipped |
| `find_central_symbols` | Not available — document as skipped |
| **Temporal** | |
| `get_evolution` | Not available in single snapshot — document as skipped |
| `get_changes_since` | `git log --oneline` (file-level, not symbol-level) |
| `get_timeline` | `git log --follow <file>` (file-level only) |
| `get_episode_replay` | Not available — document as skipped |
| **Process / Community** | |
| `list_communities` | Manual directory inspection |
| `list_processes` | Not available — document as skipped |
| `get_process_flow` | Manual code reading (no call-graph traversal) |
| **Index Management** | |
| `list_indexed_repositories` | Not applicable — no index available |
| `get_codebase_briefing` | Manual `glob` + directory tree inspection |
| `index_directory` | Not available — document as skipped |
| `watch_directory` | Not available — document as skipped |
| `delete_repository` | Not applicable |

## Confinement Rules

- **ALWAYS** request explicit permission before using legacy tools
- **ALWAYS** verify server is unreachable via `list_indexed_repositories` before halting
- **ALWAYS** wait up to 5 minutes for a clear "yes" (English only) — any other response denies permission
- **ALWAYS** document that legacy fallback was used, structural verification was skipped, and who/when/what authorized it
- **ALWAYS** re-check server availability every 15 minutes and exit legacy mode if it recovers
- **ALWAYS** re-request permission if the agent session restarts (state is not persisted)
- **NEVER** silently fall back to grep/glob without permission
- **NEVER** use this skill preemptively — the full recovery chain must be attempted first
- **NEVER** call Memtrace MCP tools after entering legacy fallback mode (they will fail)
