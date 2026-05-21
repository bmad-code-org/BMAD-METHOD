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
- Document the workaround used by the agent (or "None available — task blocked" if no workaround existed)
- Group related instances of the same underlying cause into a single friction point, reporting the cumulative impact rather than each occurrence separately

#### Severity Assessment
For each friction point, assess its severity using this scale:

| Severity | Label | Criteria |
|----------|-------|----------|
| 1 | Cosmetic | Minor inconvenience. No work blocked or delayed. Example: tool name was slightly confusing but still found the right one. |
| 2 | Minor | Slight friction with trivial workaround. Task completed normally. Example: had to retry a query once due to brief timeout. |
| 3 | Moderate | Noticeable delay or rework required. Task still completable within sprint. Example: had to chunk queries manually because batch mode was unavailable. |
| 4 | Severe | Significant rework or alternative approach required. Task was at risk of slipping. Example: stale index forced full re-index before any graph queries could run. |
| 5 | Critical | Task blocked entirely until resolved. Required recovery, fallback, or human intervention. Example: MCP server was unreachable and recovery failed, forcing legacy fallback with human permission. |

When a friction point could fit two adjacent levels, choose the lower severity. If friction exceeds the Critical definition (e.g., data corruption), score as 5 and note "exceeds scale" in the justification.

After assigning severity, write a brief justification (1-2 sentences) that references concrete impact on the task. The justification must answer: "What did this friction actually prevent or delay?" If severity is 1 (Cosmetic), justification may state: "No measurable impact — cosmetic only." If tool-call history was unavailable, mark the severity as `~estimated` and note reduced confidence in the section header.

**Good justification:** "Had to restart the MCP server before blast-radius analysis, delaying the quality gate by 15 minutes. Without the restart, the story could not be verified." (ties to concrete action + delay)
**Bad justification:** "Had a timeout which was a severe issue." (states symptom but doesn't answer *what it prevented or delayed*)

### Step 6: Prepare Comparative Analysis
- Contrast graph-based execution (Memtrace) against any legacy text-search heuristics (`grep`, `glob`, `rg`, `find`) that were used
- If no legacy tools were used (Memtrace was exclusively relied upon), note that explicitly
- Assess the net impact of structural verification on the sprint's outcomes

### Step 7: Formulate Feature Requests

#### 7a: Read Historical Reports

Read all prior telemetry reports from `_bmad-output/telemetry/`. Focus specifically on the
"Feature Requests & Feedback" section of each report. Build a consolidated list of all prior
feature requests across all historical reports found. Include only entries with `Status: Active`
— skip Implemented, Rejected, or otherwise retired entries.

If the `_bmad-output/telemetry/` directory does not exist or is empty, skip to 7c (all
requests are new) — this is normal for the first-ever telemetry run.

#### 7b: Detect Duplicates

For each candidate feature request from this sprint, compare against the consolidated list
of prior requests. Two feature requests are HIGHLY SIMILAR (should be merged) when they
satisfy ANY of these criteria:

| Criterion | Example |
|-----------|---------|
| Same tool or capability being requested | Two reports both request "batch mode for get_impact" |
| Same underlying problem or root cause | Two reports describe timeout issues, even with different wording |
| Same category of improvement | Both request "better error messages for stale index" |
| Semantic overlap (different words, same intent) | "parallel queries" vs "concurrent tool execution" |

PREFER CONSOLIDATION. When uncertain whether two requests are similar enough to merge,
err on the side of merging them and note in the context field that the request has been
raised in multiple sprints. Only treat a request as truly distinct when it targets a
different tool, a different problem category, or a substantively different improvement.

#### 7c: Build Consolidated Ledger

For each entry in your consolidated ledger:
- **Prior request, no new match:** Carry forward with its existing ID, priority, and
  upvote count unchanged.
- **Prior request, new match found:** Carry forward with upvote count incremented by +1.
  Update the Context field to note the most recent occurrence.
- **New request (no prior match):** Assign a new FR-{n} ID (sequential, continuing from
  the highest prior ID found). Set `Status=Active` and upvotes to 1.

Also draft any genuinely new feature requests from this sprint's friction points using
the same format. Priority should reflect the highest severity of the friction points
that motivated the request.

**FR ID assignment:** Scan all historical FR tables across prior reports. Extract the
integer `n` from each `FR-{n}` ID using regex `FR-(\d+)`. The new FR ID is `max(n) + 1`.

**Intra-sprint dedup:** After building the consolidated ledger, run a final consolidation
pass — if two entries within the current sprint's ledger are highly similar (same criteria
as 7b), merge them into a single entry and sum their upvote counts.

**Priority elevation:** If a carried-forward FR has accumulated upvotes ≥ 3, consider
elevating priority (e.g., L → M). If upvotes ≥ 6, consider elevating again (M → H).
Document any priority changes in the Context field.

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
 encountered during the sprint. The same event may appear in both Errors & Failures (technical
 event) and Friction Points (agent experience/impact) with different framing.}

### Connection & Recovery Events

| Timestamp | Error Type | Detail | Recovery Action | Outcome |
|-----------|------------|--------|-----------------|---------|
| {time} | TIMEOUT / STALE_INDEX / CONNECTION_REFUSED | {detail} | {action taken} | {outcome} |

### Tool-Specific Failures

| Tool | Target/Query | Error | Impact |
|------|-------------|-------|--------|
| {tool} | {query} | {error_message} | {what was blocked} |

## Friction Points

{Each friction point encountered. Assign a severity score (1-5) and concrete justification. If no friction points were encountered, write "None" rather than omitting the section.}

| Friction | Context | Severity (1-5) | Justification | Workaround Used |
|----------|---------|----------------|---------------|-----------------|
| {description} | {when/where} | {3 (Moderate)} | {why this severity — reference concrete task impact} | {how agent adapted — or "None available — task blocked" if no workaround exists} |

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

{Cumulative feature requests across ALL sprints. Carry forward only Active prior requests with accumulated
 upvote counts. New requests start at 1 upvote with Status=Active. The latest report is the canonical Feature Request ledger.}

| ID | Request | Priority (H/M/L) | Status | Upvotes | Context |
|----|---------|-------------------|--------|---------|---------|
| FR-{n} | {description} | {priority} | Active | {count} | {situation that prompted this} |

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
- **Historical report reading:** When reading prior reports for deduplication, target ONLY
  the "Feature Requests & Feedback" section of each file. Do not re-read entire reports.
  Use bounded reads — load the Feature Requests table content, not the full file.

## Confinement Rules

- **ALWAYS** follow the introspection protocol before writing — do not guess tool usage
- **ALWAYS** check every tool against the catalog before writing its name in the report
- **ALWAYS** include ALL required sections — omit data rather than omit sections
- **ALWAYS** save the report to `_bmad-output/telemetry/` with the timestamped naming convention
- **NEVER** create Node.js scripts or modify existing code during telemetry generation
- **NEVER** make live MCP calls during report generation — introspection only (consult your existing tool-call history)
- **NEVER** modify `memtrace-adapter.mjs`, `package.json`, or any existing files
- **NEVER** require or rely on internet access — this is an offline introspection workflow
- **ALWAYS** assign a severity score AND justification to every friction entry — no blank severity fields
- **ALWAYS** use the defined 1-5 severity scale (Cosmetic→Critical) — do not invent custom scales or labels
- **NEVER** assign severity without a justification that references concrete task impact (blocks, delays, rework required)
- **ALWAYS** keep justifications to 1-2 sentences — do not write paragraph-length justifications
- **ALWAYS** read all existing telemetry reports from `_bmad-output/telemetry/` before writing the Feature Requests section — this is mandatory even if you believe no prior reports exist
- **NEVER** create a duplicate feature request if a highly similar entry already exists in prior reports — increment the upvote count on the carried-forward entry instead
- **ALWAYS** carry forward all Active prior feature requests with their accumulated upvote counts — the latest report is the canonical Feature Request ledger; do not silently drop prior requests. Skip entries with Status=Implemented or Status=Rejected.
