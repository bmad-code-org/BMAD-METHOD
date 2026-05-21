# Deep-Dive Documentation Instructions

## 🧠 Memtrace Context (Self-Contained)

Memtrace structural graph queries are available as the PRIMARY discovery mechanism for this workflow.
If activation failed to load persistent_facts, this context is sufficient:

**Available MCP tools (used directly in this workflow):**
- `list_indexed_repositories` — check index freshness and repo availability before EVERY query
- `find_symbol` (kind=Function|Method|Class|Interface, limit=200) — discover exported symbols with kind, file_path, complexity_score
- `get_symbol_context` — callers, callees, type references, community, process per symbol
- `analyze_relationships` (query_type=find_callers|find_callees|imports|exporters) — typed AST dependency edges
- `find_dependency_path` (source, target, max_depth=15, edge_type="calls") — execution path between symbols
- `find_central_symbols` (limit=20) — symbols with highest PageRank (load-bearing code)
- `find_bridge_symbols` (limit=15) — symbols with highest betweenness centrality (architectural chokepoints)
- `get_api_topology` (include_external=true, min_confidence=0.7) — cross-service HTTP call map
- `get_directory_tree` (mode=compact, max_depth=4) — directory structure for target scoping

> **Complete Memtrace MCP tool catalog:**
> **Navigation:** find_code, find_symbol, get_source_window, get_directory_tree
> **Architecture:** get_codebase_briefing, list_communities, list_processes, get_process_flow
> **Dependencies:** get_symbol_context, analyze_relationships, get_impact, find_dependency_path, get_api_topology
> **Quality:** find_dead_code, find_most_complex_functions, find_bridge_symbols, find_central_symbols
> **Temporal:** get_evolution, get_changes_since, get_timeline, get_episode_replay
> **Index:** index_directory, list_indexed_repositories, watch_directory, delete_repository

**Rules:**
- All graph queries MUST use sequential `for...of` with `await` — NEVER `Promise.all`
- Check `list_indexed_repositories` before trusting graph output
- Prefer summarized output to stay under 2000 tokens; cap symbol discovery at 200 per batch
- Enrich top 50 symbols by complexity_score with `get_symbol_context`
- Flag central/bridge symbols with `[CENTRAL]` or `[BRIDGE]` annotations in the deep-dive output

**Graceful degradation:**
- Memtrace unavailable → set `memtrace_available = false`, skip all graph queries, use existing exhaustive file-reading
- Partial query success → apply available data, note partial status in diagnostics
- NEVER block the documentation workflow on Memtrace availability
- Graph data provides the STRUCTURAL skeleton; file-reading provides IMPLEMENTATION detail (comments, TODOs, side effects)

<workflow>

<critical>This workflow performs exhaustive deep-dive documentation of specific areas</critical>
<critical>Handles: deep_dive mode only</critical>
<critical>YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the configured `{communication_language}`</critical>
<critical>YOU MUST ALWAYS WRITE all artifact and document content in `{document_output_language}`</critical>

<step n="13" goal="Deep-dive documentation of specific area" if="workflow_mode == deep_dive">
<critical>Deep-dive mode requires literal full-file review. Sampling, guessing, or relying solely on tooling output is FORBIDDEN.</critical>
<action>Load existing project structure from index.md and project-parts.json (if exists)</action>
<action>Load source tree analysis to understand available areas</action>

<step n="13a" goal="Identify area for deep-dive">
  <action>Analyze existing documentation to suggest deep-dive options</action>

<ask>What area would you like to deep-dive into?

**Suggested Areas Based on Project Structure:**

{{#if has_api_routes}}

## API Routes ({{api_route_count}} endpoints found)

{{#each api_route_groups}}
{{group_index}}. {{group_name}} - {{endpoint_count}} endpoints in `{{path}}`
{{/each}}
{{/if}}

{{#if has_feature_modules}}

## Feature Modules ({{feature_count}} features)

{{#each feature_modules}}
{{module_index}}. {{module_name}} - {{file_count}} files in `{{path}}`
{{/each}}
{{/if}}

{{#if has_ui_components}}

### UI Component Areas

{{#each component_groups}}
{{group_index}}. {{group_name}} - {{component_count}} components in `{{path}}`
{{/each}}
{{/if}}

{{#if has_services}}

### Services/Business Logic

{{#each service_groups}}
{{service_index}}. {{service_name}} - `{{path}}`
{{/each}}
{{/if}}

**Or specify custom:**

- Folder path (e.g., "client/src/features/dashboard")
- File path (e.g., "server/src/api/users.ts")
- Feature name (e.g., "authentication system")

Enter your choice (number or custom path):
</ask>

<action>Parse user input to determine: - target_type: "folder" | "file" | "feature" | "api_group" | "component_group" - target_path: Absolute path to scan - target_name: Human-readable name for documentation - target_scope: List of all files to analyze
</action>

<action>Store as {{deep_dive_target}}</action>

<action>Display confirmation:
Target: {{target_name}}
Type: {{target_type}}
Path: {{target_path}}
Estimated files to analyze: {{estimated_file_count}}

This will read EVERY file in this area. Proceed? [y/n]
</action>

<action if="user confirms 'n'">Return to Step 13a (select different area)</action>
</step>

<step n="13b" goal="Comprehensive exhaustive scan of target area">
  <action>Set scan_mode = "exhaustive"</action>
  <action>Initialize file_inventory = []</action>

  <action>Check Memtrace availability for structural symbol discovery:
  - Use `list_indexed_repositories` to confirm the project repo is indexed
  - If indexed: set `memtrace_available = true`
  - If NOT indexed: skip this section and fall back to file-reading below
</action>

<check if="memtrace_available == true">
  <action>DISPLAY: "Using Memtrace graph for structural symbol discovery..."

  Graph-Based Symbol Discovery (PRIMARY — before file reading):

  **A) Discover Exported Symbols in Target Scope:**
  - Call `find_symbol` (repo_id={{repo_id}}, kind="Function", limit=200) scoped to `{{target_path}}`
  - Call `find_symbol` (repo_id={{repo_id}}, kind="Method", limit=200) scoped to `{{target_path}}`
  - Call `find_symbol` (repo_id={{repo_id}}, kind="Class", limit=100) scoped to `{{target_path}}`
  - Call `find_symbol` (repo_id={{repo_id}}, kind="Interface", limit=100) scoped to `{{target_path}}`
  - Each result includes: name, kind, file_path, start_line, complexity_score, risk_level, exported status
  - Process ALL queries STRICTLY SEQUENTIALLY using `for...of` with `await` — NEVER `Promise.all`
  - De-duplicate symbols (same name + same file_path = same symbol)
  - Store as `{{graph_symbols}}` array

  **B) Enrich with Symbol Context:**
  For each key symbol (limit to top 50 by complexity_score to stay within token budget):
  - Call `get_symbol_context` (repo_id={{repo_id}}, symbol={{symbol.name}}) to get:
    - Direct callers (upstream — who calls this)
    - Direct callees (downstream — what this calls)
    - Type references (where this type/interface is used)
    - Community membership (which logical module this belongs to)
    - Process membership (which execution flows this participates in)
  - Process STRICTLY SEQUENTIALLY — ONE symbol at a time
  - Store enriched data in `{{symbol_contexts}}` map keyed by symbol name

  **C) Merge Graph Data into File Inventory:**
  For each file in the target scope:
  - If graph symbols exist in this file: use graph-provided export data as primary source
  - If `get_symbol_context` data exists: use graph-provided caller/callee data for the file's symbols
  - If NO graph data for this file: use traditional file-reading as fallback
  - The `file_inventory` entry for this file gets enriched with:
    - `graph_exports`: symbols discovered via graph (name, kind, complexity, risk)
    - `graph_callers`: upstream callers from get_symbol_context
    - `graph_callees`: downstream dependencies from get_symbol_context
    - `graph_community`: which logical community this file's symbols belong to

  </action>
</check>

<check if="memtrace_available == false">
  <action>DISPLAY: "Memtrace not available — using traditional file-reading for symbol discovery."
    Continue with existing exhaustive file-reading approach below.
  </action>
</check>

<!-- THEN CONTINUE WITH EXISTING FILE READING LOGIC AS SUPPLEMENTARY/FALLBACK -->

  <critical>You must read every line of every file in scope and capture a plain-language explanation (what the file does, side effects, why it matters) that future developer agents can act on. No shortcuts.</critical>

  <check if="target_type == folder">
    <action>Get complete recursive file list from {{target_path}}</action>
    <action>Filter out: node_modules/, .git/, dist/, build/, coverage/, *.min.js, *.map</action>
    <action>For EVERY remaining file in folder:
      - Read complete file contents (all lines)
      - Extract all exports (functions, classes, types, interfaces, constants)
      - Extract all imports (dependencies)
      - Identify purpose from comments and code structure
      - Write 1-2 sentences (minimum) in natural language describing behaviour, side effects, assumptions, and anything a developer must know before modifying the file
      - Extract function signatures with parameter types and return types
      - Note any TODOs, FIXMEs, or comments
      - Identify patterns (hooks, components, services, controllers, etc.)
      - Capture per-file contributor guidance: `contributor_note`, `risks`, `verification_steps`, `suggested_tests`
      - Store in file_inventory
    </action>
  </check>

  <check if="target_type == file">
    <action>Read complete file at {{target_path}}</action>
    <action>Extract all information as above</action>
    <action>Read all files it imports (follow import chain 1 level deep)</action>
    <action>Find all files that import this file (dependents via grep)</action>
    <action>Store all in file_inventory</action>
  </check>

  <check if="target_type == api_group">
    <action>Identify all route/controller files in API group</action>
    <action>Read all route handlers completely</action>
    <action>Read associated middleware, controllers, services</action>
    <action>Read data models and schemas used</action>
    <action>Extract complete request/response schemas</action>
    <action>Document authentication and authorization requirements</action>
    <action>Store all in file_inventory</action>
  </check>

  <check if="target_type == feature">
    <action>Search codebase for all files related to feature name</action>
    <action>Include: UI components, API endpoints, models, services, tests</action>
    <action>Read each file completely</action>
    <action>Store all in file_inventory</action>
  </check>

  <check if="target_type == component_group">
    <action>Get all component files in group</action>
    <action>Read each component completely</action>
    <action>Extract: Props interfaces, hooks used, child components, state management</action>
    <action>Store all in file_inventory</action>
  </check>

<action>For each file in file\*inventory, document: - **File Path:** Full path - **Purpose:** What this file does (1-2 sentences) - **Lines of Code:** Total LOC - **Exports:** Complete list with signatures

- Functions: `functionName(param: Type): ReturnType` - Description
  - Classes: `ClassName` - Description with key methods
  - Types/Interfaces: `TypeName` - Description
  - Constants: `CONSTANT_NAME: Type` - Description - **Imports/Dependencies:** What it uses and why - **Used By:** Files that import this (dependents) - **Key Implementation Details:** Important logic, algorithms, patterns - **State Management:** If applicable (Redux, Context, local state) - **Side Effects:** API calls, database queries, file I/O, external services - **Error Handling:** Try/catch blocks, error boundaries, validation - **Testing:** Associated test files and coverage - **Comments/TODOs:** Any inline documentation or planned work
    </action>

<template-output>comprehensive_file_inventory</template-output>
</step>

<step n="13c" goal="Analyze relationships and data flow">
<action>Check Memtrace availability (from Step 13b): if `memtrace_available == true`, use graph-based relationship analysis</action>

<check if="memtrace_available == true">
  <action>Graph-Based Relationship Analysis (PRIMARY):

  **A) Dependency Graph from AST Edges:**
  Instead of building the graph from manual import scanning, use Memtrace's typed AST edges:

  - For each key symbol in `{{symbol_contexts}}` (from Step 13b):
    - Callers are already available from `get_symbol_context.direct_callers`
    - Callees are already available from `get_symbol_context.direct_callees`
    - Type references are already available from `get_symbol_context.type_usages`

  - For files where graph data was unavailable (fallback to file-reading in Step 13b):
    - Use `analyze_relationships` (repo_id={{repo_id}}, target={{file_path}}, query_type="imports") to get module-level imports
    - Use `analyze_relationships` (repo_id={{repo_id}}, target={{file_path}}, query_type="exporters") to find which other files import this file

  Process ALL queries SEQUENTIALLY — NEVER `Promise.all`

  **B) Dependency Paths Between Key Nodes:**
  - Identify entry points (highest in-degree from `find_central_symbols`) and leaf nodes (lowest out-degree)
  - For each entry→leaf pair, use `find_dependency_path` (repo_id={{repo_id}}, source={{entry}}, target={{leaf}}, max_depth=15, edge_type="calls")
  - This reveals the actual execution paths the code follows — far more accurate than manual tracing

  **C) Architectural Significance:**
  - Call `find_central_symbols` (repo_id={{repo_id}}, limit=20) to get symbols with highest PageRank in the scanned scope
  - Call `find_bridge_symbols` (repo_id={{repo_id}}, limit=15) to get symbols with highest betweenness centrality
  - These are the "load-bearing" and "chokepoint" symbols that deserve special documentation attention
  - For each central/bridge symbol found in the scanned scope:
    - Document its role in the dependency graph section
    - Flag it with `[CENTRAL]` or `[BRIDGE]` annotation
    - Note: changes to central symbols have the HIGHEST blast radius; changes to bridge symbols can unexpectedly cascade

  **D) Cross-Service Integration:**
  - Call `get_api_topology` (repo_id={{repo_id}}, include_external=true, min_confidence=0.7)
  - Filter to edges touching files in the scanned scope
  - For each edge: it shows which external services are called OR which services call into this scope
  - This replaces manual grep-based external API discovery

  </action>

  <action>Build Dependency Graph from Combined Data:
    - Graph-provided edges (callers, callees, imports, exporters) form the structural skeleton
    - Graph-provided centrality metrics annotate the skeleton with architectural significance
    - File-reading from Step 13b supplements with implementation-level details (e.g., dynamic dispatch, event patterns)
    - Merge into `{{dependency_graph}}` with nodes and annotated edges
  </action>
</check>

<check if="memtrace_available == false">
  <action>DISPLAY: "Memtrace not available — building dependency graph from manual import scanning."
    Build dependency graph with files as nodes and import relationships as edges
    Identify circular dependencies, entry points, leaf nodes
  </action>
</check>

<action>Continue with data flow tracing and integration point identification using the combined graph+file data...</action>

<template-output>dependency_graph</template-output>
<template-output>data_flow_analysis</template-output>
<template-output>integration_points</template-output>
</step>

<step n="13d" goal="Find related code and similar patterns">
  <action>Search codebase OUTSIDE scanned area for:
    - Similar file/folder naming patterns
    - Similar function signatures
    - Similar component structures
    - Similar API patterns
    - Reusable utilities that could be used
  </action>

<action>Identify code reuse opportunities: - Shared utilities available - Design patterns used elsewhere - Component libraries available - Helper functions that could apply
</action>

<action>Find reference implementations: - Similar features in other parts of codebase - Established patterns to follow - Testing approaches used elsewhere
</action>

<template-output>related_code_references</template-output>
<template-output>reuse_opportunities</template-output>
</step>

<step n="13e" goal="Generate comprehensive deep-dive documentation">
  <action>Create documentation filename: deep-dive-{{sanitized_target_name}}.md</action>
  <action>Aggregate contributor insights across files:
    - Combine unique risk/gotcha notes into {{risks_notes}}
    - Combine verification steps developers should run before changes into {{verification_steps}}
    - Combine recommended test commands into {{suggested_tests}}
  </action>

<action>Load complete deep-dive template from: ../templates/deep-dive-template.md</action>
<action>Fill template with all collected data from steps 13b-13d</action>
<action>Write filled template to: {project_knowledge}/deep-dive-{{sanitized_target_name}}.md</action>
<action>Validate deep-dive document completeness</action>

<template-output>deep_dive_documentation</template-output>

<action>Update state file: - Add to deep_dive_targets array: {"target_name": "{{target_name}}", "target_path": "{{target_path}}", "files_analyzed": {{file_count}}, "output_file": "deep-dive-{{sanitized_target_name}}.md", "timestamp": "{{now}}"} - Add output to outputs_generated - Update last_updated timestamp
</action>
</step>

<step n="13f" goal="Update master index with deep-dive link">
  <action>Read existing index.md</action>

<action>Check if "Deep-Dive Documentation" section exists</action>

  <check if="section does not exist">
    <action>Add new section after "Generated Documentation":

## Deep-Dive Documentation

Detailed exhaustive analysis of specific areas:

    </action>

  </check>

<action>Add link to new deep-dive doc:

- [{{target_name}} Deep-Dive](./deep-dive-{{sanitized_target_name}}.md) - Comprehensive analysis of {{target_description}} ({{file_count}} files, {{total_loc}} LOC) - Generated {{date}}
  </action>

  <action>Update index metadata:
  Last Updated: {{date}}
  Deep-Dives: {{deep_dive_count}}
  </action>

  <action>Save updated index.md</action>

  <template-output>updated_index</template-output>
  </step>

<step n="13g" goal="Offer to continue or complete">
  <action>Display summary:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Deep-Dive Documentation Complete! ✓

**Generated:** {project_knowledge}/deep-dive-{{target_name}}.md
**Files Analyzed:** {{file_count}}
**Lines of Code Scanned:** {{total_loc}}
**Time Taken:** ~{{duration}}

**Documentation Includes:**

- Complete file inventory with all exports
- Dependency graph and data flow
- Integration points and API contracts
- Testing analysis and coverage
- Related code and reuse opportunities
- Implementation guidance

**Index Updated:** {project_knowledge}/index.md now includes link to this deep-dive

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</action>

<ask>Would you like to:

1. **Deep-dive another area** - Analyze another feature/module/folder
2. **Finish** - Complete workflow

Your choice [1/2]:
</ask>

  <action if="user selects 1">
    <action>Clear current deep_dive_target</action>
    <action>Go to Step 13a (select new area)</action>
  </action>

  <action if="user selects 2">
    <action>Display final message:

All deep-dive documentation complete!

**Master Index:** {project_knowledge}/index.md
**Deep-Dives Generated:** {{deep_dive_count}}

These comprehensive docs are now ready for:

- Architecture review
- Implementation planning
- Code understanding
- Brownfield PRD creation

Thank you for using the document-project workflow!
</action>
<action>Run: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow.on_complete` — if the resolved value is non-empty, follow it as the final terminal instruction before exiting.</action>
<action>Exit workflow</action>
</action>
</step>
</step>

</workflow>
