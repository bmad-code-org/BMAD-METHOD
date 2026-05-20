---
name: bmad-memtrace-telemetry
description: 'Memtrace usage telemetry report. Use at sprint conclusion or on human request to generate a structured Markdown report detailing tool usage, omissions, errors, and comparative graph-vs-legacy analysis.'
---

# Memtrace Telemetry Report Generation

## When to Use

Activate this skill when:
- A sprint cycle has completed (all sprint stories are `done`)
- A significant development milestone has been reached (e.g., release tag, major feature branch merged to main)
- The Human Developer explicitly requests: "generate telemetry report" or "run telemetry"
- A sprint or milestone had **at least one Memtrace MCP tool invocation** in the agent's session history (check your tool-call log for any `find_code`, `get_impact`, `find_dead_code`, `index_directory`, or other memtrace tool calls)

**DO NOT** activate this skill:
- Mid-sprint (the report covers completed work, not in-progress)
- When zero Memtrace MCP tools were invoked during the sprint period (no telemetry to report)
- For individual story completions (wait for the full sprint cycle)

## Introspection Protocol

Before writing the report, review your tool-call history to identify every Memtrace MCP tool interaction during the sprint.

**If tool-call history is unavailable** (session restart, context window cleared, or log truncated): note `history_unavailable` in the Executive Summary. Populate sections with what you can recall from memory. Do NOT fabricate invocation counts or tool names — use approximate counts labeled `~estimated` rather than specific numbers.

If you cannot recall any tool usage but know the sprint had Memtrace-relevant work, state: "Tool-call history unavailable — report is based on recollection and may be incomplete."

### Step 1: Inventory Tools Used
Scan your conversation and tool-call history for each Memtrace MCP tool invocation. For each tool used, capture:
- **Tool name** — exact name from the catalog below
- **Invocation count** — how many times it was called
- **Primary use case** — what task the tool served (e.g., "blast radius for refactor of auth module")
- **Result** — whether each call succeeded, returned mixed results (partial data), or failed

### Step 2: Identify Tools Omitted
Consult the Complete Tool Catalog Reference (Appendix) and identify tools that were available but NOT used. For each omitted tool:
- **Category** — which group it belongs to (Discovery, Dependency, Quality, etc.)
- **Reason omitted** — why the tool wasn't needed (e.g., "no dead-code analysis performed this sprint", "module was too small for summarization to matter")

If a tool has zero omissions because ALL tools were used, still document that explicitly: "All 24 Memtrace MCP tools were used this sprint — no omissions."

### Step 3: Collect Errors & Failures
Review your session logs for:
- Timeout errors (`MEMTRACE_MCP_ERROR_TIMEOUT`)
- Connection drops or refused connections
- Stale index warnings (`[FRESHNESS] fresh=false`)
- Tool-specific failures (any Memtrace MCP tool that returned an error)
- Recovery events (was `npm run memtrace:restart` executed? Did it succeed or fail?)

### Step 4: Gather Sprint Context
- Which epic(s) were worked on this sprint
- Which stories were completed
- The primary agent model used

### Step 5: Identify Friction Points
For each friction point encountered during the sprint:
- Describe the friction (e.g., "query returned too many results before summarization existed")
- Note the context (when/where it happened)
- Document the workaround used by the agent

### Step 6: Prepare Comparative Analysis
- Contrast graph-based execution (Memtrace) against any legacy text-search heuristics (`grep`, `glob`, `rg`, `find`) that were used
- If no legacy tools were used (Memtrace was exclusively relied upon), note that explicitly
- Assess the net impact of structural verification on the sprint's outcomes

### Step 7: Formulate Feature Requests
Based on the friction points identified, draft actionable feature requests for maintainers. Each request should include:
- A clear description of the desired improvement
- Priority (High / Medium / Low)
- Context of the situation that motivated the request

## Template Format

Generate the report as a Markdown file following this exact structure. Every section must be present. If a section has no data, write "None" or "N/A" rather than omitting the section.

```markdown
# Memtrace Telemetry Report

**Generated:** {timestamp}
**Sprint/Epic:** {epic_identifier}
**Agent:** {agent_name}

## Executive Summary

{Brief 2-3 sentence summary of Memtrace usage during this sprint: overall reliability, key successes,
 critical failures, and whether structural verification was consistently achieved.}

## Sprint Context

| Field | Value |
|-------|-------|
| Epic(s) worked | {epic_list} |
| Stories completed | {story_count} |
| Primary agent | {agent_name} |
| Repository | bmad-memtrace |

## Memtrace Tools Used

{For each Memtrace MCP tool invoked during the sprint, record:}

| Tool | Invocations | Primary Use Case | Result |
|------|-------------|------------------|--------|
| {tool_name} | {count} | {why this tool was needed} | {success/mixed/failure} |

### Tool Usage Distribution

{Brief narrative of which tool categories were most used: Discovery, Dependency Analysis,
 Quality, Temporal, Index Management — and why.}

## Memtrace Tools Omitted

{List Memtrace tools that were available but NOT used during this sprint, with justification
 for why they weren't needed or why the agent chose alternatives.}

| Tool | Category | Reason Omitted |
|------|----------|----------------|
| {tool_name} | {category} | {justification} |

## Errors & Failures

{Record every Memtrace-related error, timeout, stale index warning, and connection failure
 encountered during the sprint.}

### Connection & Recovery Events

| Timestamp | Error Type | Detail | Recovery Action | Outcome |
|-----------|------------|--------|-----------------|---------|
| {time} | TIMEOUT / STALE_INDEX / CONNECTION_REFUSED | {detail} | {action taken} | {outcome} |

### Tool-Specific Failures

| Tool | Target/Query | Error | Impact |
|------|-------------|-------|--------|
| {tool} | {query} | {error_message} | {what was blocked} |

## Friction Points

{Each friction point encountered. Note: future stories may add severity (1-5) and justification fields.}

| Friction | Context | Workaround Used |
|----------|---------|-----------------|
| {description} | {when/where} | {how agent adapted} |

## Comparative Analysis: Graph vs Legacy

{Contrast the experiences and outcomes of using Memtrace structural queries against any
 legacy text-search heuristics used (grep, glob, rg, find).}

### Graph-Based Execution (Memtrace)

- **Successes:** {where structural verification provided certainty}
- **Limitations:** {where graph queries were insufficient or failed}

### Legacy Execution (Text-Search)

- **When used:** {contexts where grep/glob were used instead of or alongside Memtrace}
- **Limitations experienced:** {missed dependencies, false positives, manual effort}

### Net Impact Assessment

{Was the sprint MORE or LESS efficient with Memtrace? Were there fewer or more regressions?
 Did structural verification meaningfully prevent breakage?}

## Feature Requests & Feedback

{Actionable feature requests or improvement suggestions for the Memtrace maintainers.
 Note: future stories will add autonomous +1 upvote deduplication.}

| ID | Request | Priority (H/M/L) | Context |
|----|---------|-------------------|---------|
| FR-{n} | {description} | {priority} | {situation that prompted this} |

## Appendix: Complete Tool Catalog Reference

{Reference list of all Memtrace MCP tools — the agent consults this to populate the
 "Tools Omitted" section accurately.}

### Discovery
- `find_code` — Semantic + full-text search across indexed codebase
- `find_symbol` — Exact/fuzzy symbol lookup by name
- `get_source_window` — Bounded source-code read with context lines
- `get_directory_tree` — Compact directory structure overview

### Architecture & Mapping
- `get_codebase_briefing` — Repository scale, modules, endpoints, risk summary
- `list_communities` — Louvain community clusters (bounded contexts)
- `list_processes` — Detected execution processes (HTTP handlers, jobs, CLI)
- `get_process_flow` — End-to-end call-chain trace from entry point

### Dependency Analysis
- `get_symbol_context` — 360° view: callers, callees, community, process, cross-repo API
- `analyze_relationships` — Callers, callees, class hierarchy, imports, type usages
- `get_impact` — Blast radius (upstream/downstream transitive)
- `find_dependency_path` — Shortest call/dependency path between two symbols
- `get_api_topology` — Cross-repo HTTP call topology (service dependencies)
- `find_api_calls` — Outbound HTTP calls made by a service
- `find_api_endpoints` — HTTP endpoints exposed by a service
- `get_service_diagram` — Mermaid service-dependency diagram

### Quality Analysis
- `find_dead_code` — Zero-caller function/method candidates
- `find_most_complex_functions` — Top-N cyclomatic complexity hotspots
- `find_bridge_symbols` — High-betweenness architectural chokepoints
- `find_central_symbols` — High-PageRank structurally important symbols
- `calculate_cyclomatic_complexity` — Approximate complexity of a function

### Temporal Analysis
- `get_evolution` — Change timeline between two timepoints
- `get_changes_since` — Incremental diff since a session anchor
- `get_timeline` — Version history of a single symbol across episodes
- `get_episode_replay` — Full add/modify/remove diff of one episode
- `get_cochange_context` — Symbols that historically change together

### Change Detection
- `detect_changes` — Affected symbols from a git diff or file list

### Index Management
- `index_directory` — Parse and index a local directory into the graph
- `list_indexed_repositories` — List indexed repos with freshness timestamps
- `watch_directory` — Enable live incremental re-indexing on file save
- `unwatch_directory` — Stop watching a directory for changes
- `list_jobs` — List indexing jobs with status and timestamps
- `list_watched_paths` — Currently watched directories
- `list_worktrees` — Known worktree overlays
- `cleanup_episodes` — Delete historical episode snapshots
- `cleanup_stale_records` — Scrub orphan node/edge records
- `cleanup_worktrees` — Sweep stale worktree overlays
- `replay_history` — Re-run git history replay without re-indexing HEAD
- `link_repositories` — Add a typed LINKED_TO edge between repos
- `record_external_episode` — Persist externally-authored episodes
- `delete_repository` — Remove all nodes, edges, and episodes for a repo

### Operational
- `embed_diag` — Embed pipeline diagnostics snapshot
- `embed_reset_breaker` — Reset embed circuit breaker
```

## Output Conventions

- **Save location:** `_bmad-output/telemetry/` (relative to project root)
- **File naming:** `telemetry-YYYY-MM-DD-HHmmss.md` (local timestamp at generation time)
- **Format:** Valid Markdown with all required sections present
- **Tool names:** Must match the Complete Tool Catalog Reference exactly — no hallucinated tool names
- **Directory creation:** If `_bmad-output/telemetry/` does not exist, create it before saving
- **File collision:** If a file with the exact timestamp already exists, increment the timestamp by 1 second until unique
- **Permission failure:** If the agent cannot write to the output directory, output the report to STDOUT with a clear warning and do NOT lose the report data
- **Only create the report file** — do NOT create or modify any other files during this workflow

## Confinement Rules

- **ALWAYS** follow the introspection protocol before writing — do not guess tool usage
- **ALWAYS** check every tool against the catalog before writing its name in the report
- **ALWAYS** include ALL required sections — omit data rather than omit sections
- **ALWAYS** save the report to `_bmad-output/telemetry/` with the timestamped naming convention
- **NEVER** create Node.js scripts or modify existing code during telemetry generation
- **NEVER** make live MCP calls during report generation — introspection only (consult your existing tool-call history)
- **NEVER** modify `memtrace-adapter.mjs`, `package.json`, or any existing files
- **NEVER** require or rely on internet access — this is an offline introspection workflow
