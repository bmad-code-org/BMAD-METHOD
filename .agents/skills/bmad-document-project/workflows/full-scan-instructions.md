# Full Project Scan Instructions

## 🧠 Memtrace Context (Self-Contained)

Memtrace structural graph queries are available as the PRIMARY discovery mechanism for this workflow.
If activation failed to load persistent_facts, this context is sufficient:

**Available MCP tools (used directly in this workflow):**
- `list_indexed_repositories` — check index freshness and repo availability before EVERY query
- `get_directory_tree` (mode=compact/verbose, max_depth=4-6) — project directory structure from File-kind graph nodes
- `list_communities` (min_size=3) — Louvain community clusters as logical module boundaries
- `find_symbol` (kind=Function|Method|Class|Interface, limit=200) — discover exported symbols with kind, file_path, complexity_score
- `find_api_endpoints` (limit=200) — all HTTP endpoints with method, path template, handler function
- `get_api_topology` (include_external=false, min_confidence=0.7) — cross-service HTTP call map
- `get_symbol_context` — callers, callees, type references, community, process per symbol
- `analyze_relationships` (query_type=find_callers|find_callees|imports|exporters) — typed AST dependency edges
- `find_dependency_path` (source, target, max_depth=15, edge_type="calls") — execution path between symbols
- `find_central_symbols` (limit=20) — symbols with highest PageRank (load-bearing code)
- `find_bridge_symbols` (limit=15) — symbols with highest betweenness centrality (architectural chokepoints)
- `get_source_window` — read bounded source for request/response type extraction from handlers

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
- Graph data is PRIMARY source when available; existing heuristic file-reading is preserved as fallback

**Graceful degradation:**
- Memtrace unavailable → set `memtrace_available = false`, skip all graph queries, use existing heuristic file-reading
- Partial query success → apply available data, note partial status in diagnostics
- NEVER block the documentation workflow on Memtrace availability
- Graph data provides STRUCTURAL accuracy; file-reading provides IMPLEMENTATION detail (comments, TODOs, side effects)

<workflow>

<critical>This workflow performs complete project documentation (Steps 1-12)</critical>
<critical>Handles: initial_scan and full_rescan modes</critical>
<critical>YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the configured `{communication_language}`</critical>
<critical>YOU MUST ALWAYS WRITE all artifact and document content in `{document_output_language}`</critical>

<step n="0.5" goal="Load documentation requirements data for fresh starts (not needed for resume)" if="resume_mode == false">
<critical>DATA LOADING STRATEGY - Understanding the Documentation Requirements System:</critical>

<action>Display explanation to user:

**How Project Type Detection Works:**

This workflow uses a single comprehensive CSV file to intelligently document your project:

**documentation-requirements.csv** (../documentation-requirements.csv)

- Contains 12 project types (web, mobile, backend, cli, library, desktop, game, data, extension, infra, embedded)
- 24-column schema combining project type detection AND documentation requirements
- **Detection columns**: project_type_id, key_file_patterns (used to identify project type from codebase)
- **Requirement columns**: requires_api_scan, requires_data_models, requires_ui_components, etc.
- **Pattern columns**: critical_directories, test_file_patterns, config_patterns, etc.
- Acts as a "scan guide" - tells the workflow WHERE to look and WHAT to document
- Example: For project_type_id="web", key_file_patterns includes "package.json;tsconfig.json;\*.config.js" and requires_api_scan=true

**When Documentation Requirements are Loaded:**

- **Fresh Start (initial_scan)**: Load all 12 rows → detect type using key_file_patterns → use that row's requirements
- **Resume**: Load ONLY the doc requirements row(s) for cached project_type_id(s)
- **Full Rescan**: Same as fresh start (may re-detect project type)
- **Deep Dive**: Load ONLY doc requirements for the part being deep-dived
  </action>

<action>Now loading documentation requirements data for fresh start...</action>

<action>Load documentation-requirements.csv from: ../documentation-requirements.csv</action>
<action>Store all 12 rows indexed by project_type_id for project detection and requirements lookup</action>
<action>Display: "Loaded documentation requirements for 12 project types (web, mobile, backend, cli, library, desktop, game, data, extension, infra, embedded)"</action>

<action>Display: "✓ Documentation requirements loaded successfully. Ready to begin project analysis."</action>
</step>

<step n="0.6" goal="Check for existing documentation and determine workflow mode">
<action>Check if {project_knowledge}/index.md exists</action>

<check if="index.md exists">
  <action>Read existing index.md to extract metadata (date, project structure, parts count)</action>
  <action>Store as {{existing_doc_date}}, {{existing_structure}}</action>

<ask>I found existing documentation generated on {{existing_doc_date}}.

What would you like to do?

1. **Re-scan entire project** - Update all documentation with latest changes
2. **Deep-dive into specific area** - Generate detailed documentation for a particular feature/module/folder
3. **Cancel** - Keep existing documentation as-is

Your choice [1/2/3]:
</ask>

  <check if="user selects 1">
    <action>Set workflow_mode = "full_rescan"</action>
    <action>Continue to scan level selection below</action>
  </check>

  <check if="user selects 2">
    <action>Set workflow_mode = "deep_dive"</action>
    <action>Set scan_level = "exhaustive"</action>
    <action>Initialize state file with mode=deep_dive, scan_level=exhaustive</action>
    <action>Jump to Step 13</action>
  </check>

  <check if="user selects 3">
    <action>Display message: "Keeping existing documentation. Exiting workflow."</action>
    <action>Exit workflow</action>
  </check>
</check>

<check if="index.md does not exist">
  <action>Set workflow_mode = "initial_scan"</action>
  <action>Continue to scan level selection below</action>
</check>

<action if="workflow_mode != deep_dive">Select Scan Level</action>

<check if="workflow_mode == initial_scan OR workflow_mode == full_rescan">
  <ask>Choose your scan depth level:

**1. Quick Scan** (2-5 minutes) [DEFAULT]

- Pattern-based analysis without reading source files
- Scans: Config files, package manifests, directory structure
- Best for: Quick project overview, initial understanding
- File reading: Minimal (configs, README, package.json, etc.)

**2. Deep Scan** (10-30 minutes)

- Reads files in critical directories based on project type
- Scans: All critical paths from documentation requirements
- Best for: Comprehensive documentation for brownfield PRD
- File reading: Selective (key files in critical directories)

**3. Exhaustive Scan** (30-120 minutes)

- Reads ALL source files in project
- Scans: Every source file (excludes node_modules, dist, build)
- Best for: Complete analysis, migration planning, detailed audit
- File reading: Complete (all source files)

Your choice [1/2/3] (default: 1):
</ask>

  <action if="user selects 1 OR user presses enter">
    <action>Set scan_level = "quick"</action>
    <action>Display: "Using Quick Scan (pattern-based, no source file reading)"</action>
  </action>

  <action if="user selects 2">
    <action>Set scan_level = "deep"</action>
    <action>Display: "Using Deep Scan (reading critical files per project type)"</action>
  </action>

  <action if="user selects 3">
    <action>Set scan_level = "exhaustive"</action>
    <action>Display: "Using Exhaustive Scan (reading all source files)"</action>
  </action>

<action>Initialize state file: {project_knowledge}/project-scan-report.json</action>
<critical>Every time you touch the state file, record: step id, human-readable summary (what you actually did), precise timestamp, and any outputs written. Vague phrases are unacceptable.</critical>
<action>Write initial state:
{
"workflow_version": "1.2.0",
"timestamps": {"started": "{{current_timestamp}}", "last_updated": "{{current_timestamp}}"},
"mode": "{{workflow_mode}}",
"scan_level": "{{scan_level}}",
"project_root": "{{project_root_path}}",
"project_knowledge": "{{project_knowledge}}",
"completed_steps": [],
"current_step": "step_1",
"findings": {},
"outputs_generated": ["project-scan-report.json"],
"resume_instructions": "Starting from step 1"
}
</action>
<action>Continue with standard workflow from Step 1</action>
</check>
</step>

<step n="1" goal="Detect project structure and classify project type" if="workflow_mode != deep_dive">
<action>Ask user: "What is the root directory of the project to document?" (default: current working directory)</action>
<action>Store as {{project_root_path}}</action>

<action>Scan {{project_root_path}} for key indicators:

- Directory structure (presence of client/, server/, api/, src/, app/, etc.)
- Key files (package.json, go.mod, requirements.txt, etc.)
- Technology markers matching detection_keywords from project-types.csv
  </action>

<action>Detect if project is:

- **Monolith**: Single cohesive codebase
- **Monorepo**: Multiple parts in one repository
- **Multi-part**: Separate client/server or similar architecture
  </action>

<check if="multiple distinct parts detected (e.g., client/ and server/ folders)">
  <action>List detected parts with their paths</action>
  <ask>I detected multiple parts in this project:
  {{detected_parts_list}}

Is this correct? Should I document each part separately? [y/n]
</ask>

<action if="user confirms">Set repository_type = "monorepo" or "multi-part"</action>
<action if="user confirms">For each detected part: - Identify root path - Run project type detection using key_file_patterns from documentation-requirements.csv - Store as part in project_parts array
</action>

<action if="user denies or corrects">Ask user to specify correct parts and their paths</action>
</check>

<check if="single cohesive project detected">
  <action>Set repository_type = "monolith"</action>
  <action>Create single part in project_parts array with root_path = {{project_root_path}}</action>
  <action>Run project type detection using key_file_patterns from documentation-requirements.csv</action>
</check>

<action>For each part, match detected technologies and file patterns against key_file_patterns column in documentation-requirements.csv</action>
<action>Assign project_type_id to each part</action>
<action>Load corresponding documentation_requirements row for each part</action>

<ask>I've classified this project:
{{project_classification_summary}}

Does this look correct? [y/n/edit]
</ask>

<template-output>project_structure</template-output>
<template-output>project_parts_metadata</template-output>

<action>IMMEDIATELY update state file with step completion:

- Add to completed_steps: {"step": "step_1", "status": "completed", "timestamp": "{{now}}", "summary": "Classified as {{repository_type}} with {{parts_count}} parts"}
- Update current_step = "step_2"
- Update findings.project_classification with high-level summary only
- **CACHE project_type_id(s)**: Add project_types array: [{"part_id": "{{part_id}}", "project_type_id": "{{project_type_id}}", "display_name": "{{display_name}}"}]
- This cached data prevents reloading all CSV files on resume - we can load just the needed documentation_requirements row(s)
- Update last_updated timestamp
- Write state file
  </action>

<action>PURGE detailed scan results from memory, keep only summary: "{{repository_type}}, {{parts_count}} parts, {{primary_tech}}"</action>
</step>

<step n="2" goal="Discover existing documentation and gather user context" if="workflow_mode != deep_dive">
<action>For each part, scan for existing documentation using patterns:
- README.md, README.rst, README.txt
- CONTRIBUTING.md, CONTRIBUTING.rst
- ARCHITECTURE.md, ARCHITECTURE.txt, docs/architecture/
- DEPLOYMENT.md, DEPLOY.md, docs/deployment/
- API.md, docs/api/
- Any files in docs/, documentation/, .github/ folders
</action>

<action>Create inventory of existing_docs with:

- File path
- File type (readme, architecture, api, etc.)
- Which part it belongs to (if multi-part)
  </action>

<ask>I found these existing documentation files:
{{existing_docs_list}}

Are there any other important documents or key areas I should focus on while analyzing this project? [Provide paths or guidance, or type 'none']
</ask>

<action>Store user guidance as {{user_context}}</action>

<template-output>existing_documentation_inventory</template-output>
<template-output>user_provided_context</template-output>

<action>Update state file:

- Add to completed_steps: {"step": "step_2", "status": "completed", "timestamp": "{{now}}", "summary": "Found {{existing_docs_count}} existing docs"}
- Update current_step = "step_3"
- Update last_updated timestamp
  </action>

<action>PURGE detailed doc contents from memory, keep only: "{{existing_docs_count}} docs found"</action>
</step>

<step n="3" goal="Analyze technology stack for each part" if="workflow_mode != deep_dive">
<action>Check Memtrace availability for structural technology discovery:
  - Use `list_indexed_repositories` to confirm the project repo is indexed
  - If indexed: set `memtrace_available = true` and proceed with graph-based discovery
  - If NOT indexed: set `memtrace_available = false` and skip to traditional file-pattern scanning
</action>

<check if="memtrace_available == true">
  <action>DISPLAY: "Memtrace graph detected — enriching technology analysis with structural data..."

  Graph-Based Technology Stack Discovery:

  **A) Directory Structure via Graph:**
  - Use `get_directory_tree` (repo_id={{repo_id}}, mode=compact, max_depth=4) to get the complete project tree
  - The tree is built from Memtrace's File-kind nodes — it automatically respects .gitignore
  - Cross-reference detected directories against `critical_directories` from documentation_requirements
  - This provides structural validation of the project layout BEFORE any file reading

  **B) Logical Module Boundaries:**
  - Use `list_communities` (repo_id={{repo_id}}, min_size=3) to discover Louvain community clusters
  - Communities represent tightly-coupled symbol groups — these are the natural subsystem boundaries
  - Map communities to directory paths using the community symbols' file_path fields
  - Store as `{{memtrace_communities}}` for later use in Steps 5 and 8

  **C) Technology Surface Indicators:**
  - Use `find_symbol` (repo_id={{repo_id}}, kind="Function", limit=30) to sample exported functions
  - Use `find_symbol` (repo_id={{repo_id}}, kind="Class", limit=20) to sample exported classes
  - Analyze symbol patterns for technology indicators:
    - Express/Connect middleware signatures → Node.js API framework
    - React component patterns (capitalized, returns JSX) → Frontend framework
    - Axum handler fn signatures → Rust web framework
    - FastAPI/Flask route decorators → Python web framework
  - Process ALL queries SEQUENTIALLY — NEVER parallelize

  **D) Endpoint Discovery (preview):**
  - Use `find_api_endpoints` (repo_id={{repo_id}}, limit=10) to sample the API surface
  - The endpoint paths and HTTP methods indicate the API framework in use
  - Store endpoint sample for cross-validation in Step 4

  </action>

  <action>Merge Graph Data with Traditional Analysis:
    - Graph data provides structural validation of file-pattern-based detection
    - Community boundaries confirm or correct the multi-part structure detected in Step 1
    - Symbol patterns provide secondary technology indicators alongside package manifest parsing
    - Store `{{memtrace_tech_insights}}` as structured enrichment data
  </action>
</check>

<check if="memtrace_available == false">
  <action>DISPLAY: "Memtrace not available — using traditional file-pattern technology detection."
    Continue with existing key_file_patterns scanning below.
  </action>
</check>

<action>For each part in project_parts:
  - Load key_file_patterns from documentation_requirements
  - Scan part root for these patterns
  - Parse technology manifest files (package.json, go.mod, requirements.txt, etc.)
  - Extract: framework, language, version, database, dependencies
  - Build technology_table with columns: Category, Technology, Version, Justification
</action>

<action>Determine architecture pattern based on detected tech stack:

- Use project_type_id as primary indicator (e.g., "web" → layered/component-based, "backend" → service/API-centric)
- Consider framework patterns (e.g., React → component hierarchy, Express → middleware pipeline)
- Note architectural style in technology table
- Store as {{architecture_pattern}} for each part
  </action>

<template-output>technology_stack</template-output>
<template-output>architecture_patterns</template-output>

<action>Update state file:

- Add to completed_steps: {"step": "step_3", "status": "completed", "timestamp": "{{now}}", "summary": "Tech stack: {{primary_framework}}"}
- Update current_step = "step_4"
- Update findings.technology_stack with summary per part
- Update last_updated timestamp
  </action>

<action>PURGE detailed tech analysis from memory, keep only: "{{framework}} on {{language}}"</action>
</step>

<step n="4" goal="Perform conditional analysis based on project type requirements" if="workflow_mode != deep_dive">

<critical>BATCHING STRATEGY FOR DEEP/EXHAUSTIVE SCANS</critical>

<check if="scan_level == deep OR scan_level == exhaustive">
  <action>This step requires file reading. Apply batching strategy:</action>

<action>Identify subfolders to process based on: - scan_level == "deep": Use critical_directories from documentation_requirements - scan_level == "exhaustive": Get ALL subfolders recursively (excluding node_modules, .git, dist, build, coverage)
</action>

<action>For each subfolder to scan: 1. Read all files in subfolder (consider file size - use judgment for files >5000 LOC) 2. Extract required information based on conditional flags below 3. IMMEDIATELY write findings to appropriate output file 4. Validate written document (section-level validation) 5. Update state file with batch completion 6. PURGE detailed findings from context, keep only 1-2 sentence summary 7. Move to next subfolder
</action>

<action>Track batches in state file:
findings.batches_completed: [
{"path": "{{subfolder_path}}", "files_scanned": {{count}}, "summary": "{{brief_summary}}"}
]
</action>
</check>

<check if="scan_level == quick">
  <action>Use pattern matching only - do NOT read source files</action>
  <action>Use glob/grep to identify file locations and patterns</action>
  <action>Extract information from filenames, directory structure, and config files only</action>
</check>

<action>For each part, check documentation_requirements boolean flags and execute corresponding scans:</action>

<check if="requires_api_scan == true">
  <action>Check Memtrace availability (from Step 3): if `memtrace_available == true`, use graph-based API discovery as the PRIMARY method</action>

  <check if="memtrace_available == true">
    <action>Graph-Based API Discovery (PRIMARY):

    **A) Discover All HTTP Endpoints:**
    - Call `find_api_endpoints` (repo_id={{repo_id}}, limit=200) to get every HTTP endpoint
    - Each result includes: handler function name, HTTP method (GET/POST/PUT/DELETE/etc.), path template, file_path, line number
    - Group endpoints by: file_path (which file defines them), community (from Step 3 data), path prefix (e.g., /api/users, /api/products)
    - Process STRICTLY SEQUENTIALLY — do NOT parallelize endpoint queries

    **B) Cross-Service Topology:**
    - Call `get_api_topology` (repo_id={{repo_id}}, include_external=false, min_confidence=0.7) for cross-service HTTP calls
    - This reveals which other services call this repo's endpoints AND which services this repo calls
    - Filter to edges where THIS repo is EITHER the source OR target
    - Store as `{{memtrace_api_topology}}` for Step 7 (integration architecture) and Step 8 (architecture docs)

    **C) Build API Contracts from Graph Data:**
    For each endpoint group:
    - HTTP method + path template → API contract entry
    - handler function name → link to implementation location
    - community membership → which subsystem owns this endpoint
    - cross-service callers (from topology) → external consumers of this endpoint

    **D) Fallback to file scanning for request/response schemas:**
    - The graph provides endpoint location and routing — but request/response TYPE information requires source reading
    - Use `get_source_window` on each handler function to extract type annotations/schemas
    - Process SEQUENTIALLY — one handler at a time

    </action>

    <action>IMMEDIATELY write graph-sourced API contracts to: {project_knowledge}/api-contracts-{part_id}.md</action>
    <action>Validate document completeness — ensure each endpoint has: method, path, handler, community, cross-service callers</action>
  </check>

  <check if="memtrace_available == false">
    <action>Memtrace not available — falling back to heuristic file scanning for API discovery:</action>
    <action>Scan for API routes and endpoints using integration_scan_patterns</action>
    <action>Look for: controllers/, routes/, api/, handlers/, endpoints/</action>

    <check if="scan_level == quick">
      <action>Use glob to find route files, extract patterns from filenames and folder structure</action>
    </check>

    <check if="scan_level == deep OR scan_level == exhaustive">
      <action>Read files in batches (one subfolder at a time)</action>
      <action>Extract: HTTP methods, paths, request/response types from actual code</action>
    </check>
  </check>

<action>Build API contracts catalog</action>
<action>IMMEDIATELY write to: {project_knowledge}/api-contracts-{part_id}.md</action>
<action>Validate document has all required sections</action>
<action>Update state file with output generated</action>
<action>PURGE detailed API data, keep only: "{{api_count}} endpoints documented"</action>
<template-output>api_contracts\*{part_id}</template-output>
</check>

<check if="requires_data_models == true">
  <action>Scan for data models using schema_migration_patterns</action>
  <action>Look for: models/, schemas/, entities/, migrations/, prisma/, ORM configs</action>

  <check if="scan_level == quick">
    <action>Identify schema files via glob, parse migration file names for table discovery</action>
  </check>

  <check if="scan_level == deep OR scan_level == exhaustive">
    <action>Read model files in batches (one subfolder at a time)</action>
    <action>Extract: table names, fields, relationships, constraints from actual code</action>
  </check>

<action>Build database schema documentation</action>
<action>IMMEDIATELY write to: {project_knowledge}/data-models-{part_id}.md</action>
<action>Validate document completeness</action>
<action>Update state file with output generated</action>
<action>PURGE detailed schema data, keep only: "{{table_count}} tables documented"</action>
<template-output>data_models\*{part_id}</template-output>
</check>

<check if="requires_state_management == true">
  <action>Analyze state management patterns</action>
  <action>Look for: Redux, Context API, MobX, Vuex, Pinia, Provider patterns</action>
  <action>Identify: stores, reducers, actions, state structure</action>
  <template-output>state_management_patterns_{part_id}</template-output>
</check>

<check if="requires_ui_components == true">
  <action>Inventory UI component library</action>
  <action>Scan: components/, ui/, widgets/, views/ folders</action>
  <action>Categorize: Layout, Form, Display, Navigation, etc.</action>
  <action>Identify: Design system, component patterns, reusable elements</action>
  <template-output>ui_component_inventory_{part_id}</template-output>
</check>

<check if="requires_hardware_docs == true">
  <action>Look for hardware schematics using hardware_interface_patterns</action>
  <ask>This appears to be an embedded/hardware project. Do you have:
  - Pinout diagrams
  - Hardware schematics
  - PCB layouts
  - Hardware documentation

If yes, please provide paths or links. [Provide paths or type 'none']
</ask>
<action>Store hardware docs references</action>
<template-output>hardware*documentation*{part_id}</template-output>
</check>

<check if="requires_asset_inventory == true">
  <action>Scan and catalog assets using asset_patterns</action>
  <action>Categorize by: Images, Audio, 3D Models, Sprites, Textures, etc.</action>
  <action>Calculate: Total size, file counts, formats used</action>
  <template-output>asset_inventory_{part_id}</template-output>
</check>

<action>Scan for additional patterns based on doc requirements:

- config_patterns → Configuration management
- auth_security_patterns → Authentication/authorization approach
- entry_point_patterns → Application entry points and bootstrap
- shared_code_patterns → Shared libraries and utilities
- async_event_patterns → Event-driven architecture
- ci_cd_patterns → CI/CD pipeline details
- localization_patterns → i18n/l10n support
  </action>

<action>Apply scan_level strategy to each pattern scan (quick=glob only, deep/exhaustive=read files)</action>

<template-output>comprehensive*analysis*{part_id}</template-output>

<action>Update state file:

- Add to completed_steps: {"step": "step_4", "status": "completed", "timestamp": "{{now}}", "summary": "Conditional analysis complete, {{files_generated}} files written"}
- Update current_step = "step_5"
- Update last_updated timestamp
- List all outputs_generated
  </action>

<action>PURGE all detailed scan results from context. Keep only summaries:

- "APIs: {{api_count}} endpoints"
- "Data: {{table_count}} tables"
- "Components: {{component_count}} components"
  </action>
  </step>

<step n="5" goal="Generate source tree analysis with annotations" if="workflow_mode != deep_dive">
<action>Check Memtrace availability: if `memtrace_available == true`, use graph-based tree generation</action>

<check if="memtrace_available == true">
  <action>Graph-Based Source Tree (PRIMARY):

  **A) Generate Tree from Graph:**
  - Call `get_directory_tree` (repo_id={{repo_id}}, mode=verbose, max_depth=6)
  - The tree is built from Memtrace's File-kind graph nodes
  - It automatically respects .gitignore and .memtraceignore
  - This returns a compact, bounded tree — no manual file-system traversal needed

  **B) Annotate with Community Boundaries:**
  - Cross-reference tree directories against `{{memtrace_communities}}` from Step 3
  - For each directory that contains symbols from a community, annotate: `# Community: "community_label" (size: N symbols)`
  - This shows the logical subsystem boundaries overlaid on the physical directory structure

  **C) Annotate with Critical Directories:**
  - For each directory matching critical_directories from documentation_requirements:
    - Mark as: `[CRITICAL]` with the requirement's purpose annotation
    - Example: `src/controllers/     [CRITICAL] API route handlers — 12 endpoints`
  - Use `find_api_endpoints` data from Step 4 to provide endpoint counts per directory

  **D) Entry Point Markers:**
  - Use the entry_point_patterns from documentation_requirements
  - Cross-reference with `find_symbol` (kind=Function) results from Step 3 to identify entry point symbols
  - Annotate entry point files with `[ENTRY]` marker
  </action>

  <action>IMMEDIATELY write source-tree-analysis.md to disk with graph-sourced annotations</action>
  <action>Validate document structure</action>
</check>

<check if="memtrace_available == false">
  <action>Memtrace not available — falling back to manual directory tree generation:</action>
  <action>For each part, generate complete directory tree using critical_directories from doc requirements</action>
  <action>Annotate the tree with purpose, entry points, key files, integration points</action>
  <action>IMMEDIATELY write source-tree-analysis.md to disk</action>
</check>

<template-output>source_tree_analysis</template-output>
<template-output>critical_folders_summary</template-output>

<action>Update state file:
- Add to completed_steps: {"step": "step_5", "status": "completed", "timestamp": "{{now}}", "summary": "Source tree documented"}
- Update current_step = "step_6"
- Add output: "source-tree-analysis.md"
</action>
<action>PURGE detailed tree from context, keep only: "Source tree with {{folder_count}} critical folders"</action>
</step>

<step n="6" goal="Extract development and operational information" if="workflow_mode != deep_dive">
<action>Scan for development setup using key_file_patterns and existing docs:
- Prerequisites (Node version, Python version, etc.)
- Installation steps (npm install, etc.)
- Environment setup (.env files, config)
- Build commands (npm run build, make, etc.)
- Run commands (npm start, go run, etc.)
- Test commands using test_file_patterns
</action>

<action>Look for deployment configuration using ci_cd_patterns:

- Dockerfile, docker-compose.yml
- Kubernetes configs (k8s/, helm/)
- CI/CD pipelines (.github/workflows/, .gitlab-ci.yml)
- Deployment scripts
- Infrastructure as Code (terraform/, pulumi/)
  </action>

<action if="CONTRIBUTING.md or similar found">
  <action>Extract contribution guidelines:
    - Code style rules
    - PR process
    - Commit conventions
    - Testing requirements
  </action>
</action>

<template-output>development_instructions</template-output>
<template-output>deployment_configuration</template-output>
<template-output>contribution_guidelines</template-output>

<action>Update state file:

- Add to completed_steps: {"step": "step_6", "status": "completed", "timestamp": "{{now}}", "summary": "Dev/deployment guides written"}
- Update current_step = "step_7"
- Add generated outputs to list
  </action>
  <action>PURGE detailed instructions, keep only: "Dev setup and deployment documented"</action>
  </step>

<step n="7" goal="Detect multi-part integration architecture" if="workflow_mode != deep_dive and project has multiple parts">
<action>Analyze how parts communicate:
- Scan integration_scan_patterns across parts
- Identify: REST calls, GraphQL queries, gRPC, message queues, shared databases
- Document: API contracts between parts, data flow, authentication flow
</action>

<action>Create integration_points array with:

- from: source part
- to: target part
- type: REST API, GraphQL, gRPC, Event Bus, etc.
- details: Endpoints, protocols, data formats
  </action>

<action>IMMEDIATELY write integration-architecture.md to disk</action>
<action>Validate document completeness</action>

<template-output>integration_architecture</template-output>

<action>Update state file:

- Add to completed_steps: {"step": "step_7", "status": "completed", "timestamp": "{{now}}", "summary": "Integration architecture documented"}
- Update current_step = "step_8"
  </action>
  <action>PURGE integration details, keep only: "{{integration_count}} integration points"</action>
  </step>

<step n="8" goal="Generate architecture documentation for each part" if="workflow_mode != deep_dive">
<action>For each part in project_parts:
  - Use matched architecture template from Step 3 as base structure
  - Fill in all sections with discovered information:
    * Executive Summary
    * Technology Stack (from Step 3)
    * Architecture Pattern (from registry match)
    * Data Architecture (from Step 4 data models scan)
    * API Design (from Step 4 API scan if applicable)
    * Component Overview (from Step 4 component scan if applicable)
    * Source Tree (from Step 5)
    * Development Workflow (from Step 6)
    * Deployment Architecture (from Step 6)
    * Testing Strategy (from test patterns)
</action>

<action if="single part project">
  - Generate: architecture.md (no part suffix)
</action>

<action if="multi-part project">
  - Generate: architecture-{part_id}.md for each part
</action>

<action>For each architecture file generated:

- IMMEDIATELY write architecture file to disk
- Validate against architecture template schema
- Update state file with output
- PURGE detailed architecture from context, keep only: "Architecture for {{part_id}} written"
  </action>

<template-output>architecture_document</template-output>

<action>Update state file:

- Add to completed_steps: {"step": "step_8", "status": "completed", "timestamp": "{{now}}", "summary": "Architecture docs written for {{parts_count}} parts"}
- Update current_step = "step_9"
  </action>
  </step>

<step n="9" goal="Generate supporting documentation files" if="workflow_mode != deep_dive">
<action>Generate project-overview.md with:
- Project name and purpose (from README or user input)
- Executive summary
- Tech stack summary table
- Architecture type classification
- Repository structure (monolith/monorepo/multi-part)
- Links to detailed docs
</action>

<action>Generate source-tree-analysis.md with:

- Full annotated directory tree from Step 5
- Critical folders explained
- Entry points documented
- Multi-part structure (if applicable)
  </action>

<action>IMMEDIATELY write project-overview.md to disk</action>
<action>Validate document sections</action>

<action>Generate source-tree-analysis.md (if not already written in Step 5)</action>
<action>IMMEDIATELY write to disk and validate</action>

<action>Generate component-inventory.md (or per-part versions) with:

- All discovered components from Step 4
- Categorized by type
- Reusable vs specific components
- Design system elements (if found)
  </action>
  <action>IMMEDIATELY write each component inventory to disk and validate</action>

<action>Generate development-guide.md (or per-part versions) with:

- Prerequisites and dependencies
- Environment setup instructions
- Local development commands
- Build process
- Testing approach and commands
- Common development tasks
  </action>
  <action>IMMEDIATELY write each development guide to disk and validate</action>

<action if="deployment configuration found">
  <action>Generate deployment-guide.md with:
    - Infrastructure requirements
    - Deployment process
    - Environment configuration
    - CI/CD pipeline details
  </action>
  <action>IMMEDIATELY write to disk and validate</action>
</action>

<action if="contribution guidelines found">
  <action>Generate contribution-guide.md with:
    - Code style and conventions
    - PR process
    - Testing requirements
    - Documentation standards
  </action>
  <action>IMMEDIATELY write to disk and validate</action>
</action>

<action if="API contracts documented">
  <action>Generate api-contracts.md (or per-part) with:
    - All API endpoints
    - Request/response schemas
    - Authentication requirements
    - Example requests
  </action>
  <action>IMMEDIATELY write to disk and validate</action>
</action>

<action if="Data models documented">
  <action>Generate data-models.md (or per-part) with:
    - Database schema
    - Table relationships
    - Data models and entities
    - Migration strategy
  </action>
  <action>IMMEDIATELY write to disk and validate</action>
</action>

<action if="multi-part project">
  <action>Generate integration-architecture.md with:
    - How parts communicate
    - Integration points diagram/description
    - Data flow between parts
    - Shared dependencies
  </action>
  <action>IMMEDIATELY write to disk and validate</action>

<action>Generate project-parts.json metadata file:
`json
    {
      "repository_type": "monorepo",
      "parts": [ ... ],
      "integration_points": [ ... ]
    }
    `
</action>
<action>IMMEDIATELY write to disk</action>
</action>

<template-output>supporting_documentation</template-output>

<action>Update state file:

- Add to completed_steps: {"step": "step_9", "status": "completed", "timestamp": "{{now}}", "summary": "All supporting docs written"}
- Update current_step = "step_10"
- List all newly generated outputs
  </action>

<action>PURGE all document contents from context, keep only list of files generated</action>
</step>

<step n="10" goal="Generate master index as primary AI retrieval source" if="workflow_mode != deep_dive">

<critical>INCOMPLETE DOCUMENTATION MARKER CONVENTION:
When a document SHOULD be generated but wasn't (due to quick scan, missing data, conditional requirements not met):

- Use EXACTLY this marker: _(To be generated)_
- Place it at the end of the markdown link line
- Example: - [API Contracts - Server](./api-contracts-server.md) _(To be generated)_
- This allows Step 11 to detect and offer to complete these items
- ALWAYS use this exact format for consistency and automated detection
  </critical>

<action>Create index.md with intelligent navigation based on project structure</action>

<action if="single part project">
  <action>Generate simple index with:
    - Project name and type
    - Quick reference (tech stack, architecture type)
    - Links to all generated docs
    - Links to discovered existing docs
    - Getting started section
  </action>
</action>

<action if="multi-part project">
  <action>Generate comprehensive index with:
    - Project overview and structure summary
    - Part-based navigation section
    - Quick reference by part
    - Cross-part integration links
    - Links to all generated and existing docs
    - Getting started per part
  </action>
</action>

<action>Include in index.md:

## Project Documentation Index

### Project Overview

- **Type:** {{repository_type}} {{#if multi-part}}with {{parts.length}} parts{{/if}}
- **Primary Language:** {{primary_language}}
- **Architecture:** {{architecture_type}}

### Quick Reference

{{#if single_part}}

- **Tech Stack:** {{tech_stack_summary}}
- **Entry Point:** {{entry_point}}
- **Architecture Pattern:** {{architecture_pattern}}
  {{else}}
  {{#each parts}}

#### {{part_name}} ({{part_id}})

- **Type:** {{project_type}}
- **Tech Stack:** {{tech_stack}}
- **Root:** {{root_path}}
  {{/each}}
  {{/if}}

### Generated Documentation

- [Project Overview](./project-overview.md)
- [Architecture](./architecture{{#if multi-part}}-{part\*id}{{/if}}.md){{#unless architecture_file_exists}} (To be generated) {{/unless}}
- [Source Tree Analysis](./source-tree-analysis.md)
- [Component Inventory](./component-inventory{{#if multi-part}}-{part\*id}{{/if}}.md){{#unless component_inventory_exists}} (To be generated) {{/unless}}
- [Development Guide](./development-guide{{#if multi-part}}-{part\*id}{{/if}}.md){{#unless dev_guide_exists}} (To be generated) {{/unless}}
  {{#if deployment_found}}- [Deployment Guide](./deployment-guide.md){{#unless deployment_guide_exists}} (To be generated) {{/unless}}{{/if}}
  {{#if contribution_found}}- [Contribution Guide](./contribution-guide.md){{/if}}
  {{#if api_documented}}- [API Contracts](./api-contracts{{#if multi-part}}-{part_id}{{/if}}.md){{#unless api_contracts_exists}} (To be generated) {{/unless}}{{/if}}
  {{#if data_models_documented}}- [Data Models](./data-models{{#if multi-part}}-{part_id}{{/if}}.md){{#unless data_models_exists}} (To be generated) {{/unless}}{{/if}}
  {{#if multi-part}}- [Integration Architecture](./integration-architecture.md){{#unless integration_arch_exists}} (To be generated) {{/unless}}{{/if}}

### Existing Documentation

{{#each existing_docs}}

- [{{title}}]({{relative_path}}) - {{description}}
  {{/each}}

### Getting Started

{{getting_started_instructions}}
</action>

<action>Before writing index.md, check which expected files actually exist:

- For each document that should have been generated, check if file exists on disk
- Set existence flags: architecture_file_exists, component_inventory_exists, dev_guide_exists, etc.
- These flags determine whether to add the _(To be generated)_ marker
- Track which files are missing in {{missing_docs_list}} for reporting
  </action>

<action>IMMEDIATELY write index.md to disk with appropriate _(To be generated)_ markers for missing files</action>
<action>Validate index has all required sections and links are valid</action>

<template-output>index</template-output>

<action>Update state file:

- Add to completed_steps: {"step": "step_10", "status": "completed", "timestamp": "{{now}}", "summary": "Master index generated"}
- Update current_step = "step_11"
- Add output: "index.md"
  </action>

<action>PURGE index content from context</action>
</step>

<step n="11" goal="Validate and review generated documentation" if="workflow_mode != deep_dive">
<action>Show summary of all generated files:
Generated in {{project_knowledge}}/:
{{file_list_with_sizes}}
</action>

<action>Run validation checklist from ../checklist.md</action>

<critical>INCOMPLETE DOCUMENTATION DETECTION:

1. PRIMARY SCAN: Look for exact marker: _(To be generated)_
2. FALLBACK SCAN: Look for fuzzy patterns (in case agent was lazy):
   - _(TBD)_
   - _(TODO)_
   - _(Coming soon)_
   - _(Not yet generated)_
   - _(Pending)_
3. Extract document metadata from each match for user selection
   </critical>

<action>Read {project_knowledge}/index.md</action>

<action>Scan for incomplete documentation markers:
Step 1: Search for exact pattern "_(To be generated)_" (case-sensitive)
Step 2: For each match found, extract the entire line
Step 3: Parse line to extract:

- Document title (text within [brackets] or **bold**)
- File path (from markdown link or inferable from title)
- Document type (infer from filename: architecture, api-contracts, data-models, component-inventory, development-guide, deployment-guide, integration-architecture)
- Part ID if applicable (extract from filename like "architecture-server.md" → part_id: "server")
  Step 4: Add to {{incomplete_docs_strict}} array
  </action>

<action>Fallback fuzzy scan for alternate markers:
Search for patterns: _(TBD)_, _(TODO)_, _(Coming soon)_, _(Not yet generated)_, _(Pending)_
For each fuzzy match:

- Extract same metadata as strict scan
- Add to {{incomplete_docs_fuzzy}} array with fuzzy_match flag
  </action>

<action>Combine results:
Set {{incomplete_docs_list}} = {{incomplete_docs_strict}} + {{incomplete_docs_fuzzy}}
For each item store structure:
{
"title": "Architecture – Server",
"file\*path": "./architecture-server.md",
"doc_type": "architecture",
"part_id": "server",
"line_text": "- [Architecture – Server](./architecture-server.md) (To be generated)",
"fuzzy_match": false
}
</action>

<ask>Documentation generation complete!

Summary:

- Project Type: {{project_type_summary}}
- Parts Documented: {{parts_count}}
- Files Generated: {{files_count}}
- Total Lines: {{total_lines}}

{{#if incomplete_docs_list.length > 0}}
⚠️ **Incomplete Documentation Detected:**

I found {{incomplete_docs_list.length}} item(s) marked as incomplete:

{{#each incomplete_docs_list}}
{{@index + 1}}. **{{title}}** ({{doc_type}}{{#if part_id}} for {{part_id}}{{/if}}){{#if fuzzy_match}} ⚠️ [non-standard marker]{{/if}}
{{/each}}

{{/if}}

Would you like to:

{{#if incomplete_docs_list.length > 0}}

1. **Generate incomplete documentation** - Complete any of the {{incomplete_docs_list.length}} items above
2. Review any specific section [type section name]
3. Add more detail to any area [type area name]
4. Generate additional custom documentation [describe what]
5. Finalize and complete [type 'done']
   {{else}}
6. Review any specific section [type section name]
7. Add more detail to any area [type area name]
8. Generate additional documentation [describe what]
9. Finalize and complete [type 'done']
   {{/if}}

Your choice:
</ask>

<check if="user selects option 1 (generate incomplete)">
  <ask>Which incomplete items would you like to generate?

{{#each incomplete_docs_list}}
{{@index + 1}}. {{title}} ({{doc_type}}{{#if part_id}} - {{part_id}}{{/if}})
{{/each}}
{{incomplete_docs_list.length + 1}}. All of them

Enter number(s) separated by commas (e.g., "1,3,5"), or type 'all':
</ask>

<action>Parse user selection:

- If "all", set {{selected_items}} = all items in {{incomplete_docs_list}}
- If comma-separated numbers, extract selected items by index
- Store result in {{selected_items}} array
  </action>

  <action>Display: "Generating {{selected_items.length}} document(s)..."</action>

  <action>For each item in {{selected_items}}:

1. **Identify the part and requirements:**
   - Extract part_id from item (if exists)
   - Look up part data in project_parts array from state file
   - Load documentation_requirements for that part's project_type_id

2. **Route to appropriate generation substep based on doc_type:**

   **If doc_type == "architecture":**
   - Display: "Generating architecture documentation for {{part_id}}..."
   - Load architecture_match for this part from state file (Step 3 cache)
   - Re-run Step 8 architecture generation logic ONLY for this specific part
   - Use matched template and fill with cached data from state file
   - Write architecture-{{part_id}}.md to disk
   - Validate completeness

   **If doc_type == "api-contracts":**
   - Display: "Generating API contracts for {{part_id}}..."
   - Load part data and documentation_requirements
   - Re-run Step 4 API scan substep targeting ONLY this part
   - Use scan_level from state file (quick/deep/exhaustive)
   - Generate api-contracts-{{part_id}}.md
   - Validate document structure

   **If doc_type == "data-models":**
   - Display: "Generating data models documentation for {{part_id}}..."
   - Re-run Step 4 data models scan substep targeting ONLY this part
   - Use schema_migration_patterns from documentation_requirements
   - Generate data-models-{{part_id}}.md
   - Validate completeness

   **If doc_type == "component-inventory":**
   - Display: "Generating component inventory for {{part_id}}..."
   - Re-run Step 9 component inventory generation for this specific part
   - Scan components/, ui/, widgets/ folders
   - Generate component-inventory-{{part_id}}.md
   - Validate structure

   **If doc_type == "development-guide":**
   - Display: "Generating development guide for {{part_id}}..."
   - Re-run Step 9 development guide generation for this specific part
   - Use key_file_patterns and test_file_patterns from documentation_requirements
   - Generate development-guide-{{part_id}}.md
   - Validate completeness

   **If doc_type == "deployment-guide":**
   - Display: "Generating deployment guide..."
   - Re-run Step 6 deployment configuration scan
   - Re-run Step 9 deployment guide generation
   - Generate deployment-guide.md
   - Validate structure

   **If doc_type == "integration-architecture":**
   - Display: "Generating integration architecture..."
   - Re-run Step 7 integration analysis for all parts
   - Generate integration-architecture.md
   - Validate completeness

3. **Post-generation actions:**
   - Confirm file was written successfully
   - Update state file with newly generated output
   - Add to {{newly_generated_docs}} tracking list
   - Display: "✓ Generated: {{file_path}}"

4. **Handle errors:**
   - If generation fails, log error and continue with next item
   - Track failed items in {{failed_generations}} list
     </action>

<action>After all selected items are processed:

**Update index.md to remove markers:**

1. Read current index.md content
2. For each item in {{newly_generated_docs}}:
   - Find the line containing the file link and marker
   - Remove the _(To be generated)_ or fuzzy marker text
   - Leave the markdown link intact
3. Write updated index.md back to disk
4. Update state file to record index.md modification
   </action>

<action>Display generation summary:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ **Documentation Generation Complete!**

**Successfully Generated:**
{{#each newly_generated_docs}}

- {{title}} → {{file_path}}
  {{/each}}

{{#if failed_generations.length > 0}}
**Failed to Generate:**
{{#each failed_generations}}

- {{title}} ({{error_message}})
  {{/each}}
  {{/if}}

**Updated:** index.md (removed incomplete markers)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</action>

<action>Update state file with all generation activities</action>

<action>Return to Step 11 menu (loop back to check for any remaining incomplete items)</action>
</check>

<action if="user requests other changes (options 2-3)">Make requested modifications and regenerate affected files</action>
<action if="user selects finalize (option 4 or 5)">Proceed to Step 12 completion</action>

<check if="not finalizing">
  <action>Update state file:
- Add to completed_steps: {"step": "step_11_iteration", "status": "completed", "timestamp": "{{now}}", "summary": "Review iteration complete"}
- Keep current_step = "step_11" (for loop back)
- Update last_updated timestamp
  </action>
  <action>Loop back to beginning of Step 11 (re-scan for remaining incomplete docs)</action>
</check>

<check if="finalizing">
  <action>Update state file:
- Add to completed_steps: {"step": "step_11", "status": "completed", "timestamp": "{{now}}", "summary": "Validation and review complete"}
- Update current_step = "step_12"
  </action>
  <action>Proceed to Step 12</action>
</check>
</step>

<step n="12" goal="Finalize and provide next steps" if="workflow_mode != deep_dive">
<action>Create final summary report</action>
<action>Compile verification recap variables:
  - Set {{verification_summary}} to the concrete tests, validations, or scripts you executed (or "none run").
  - Set {{open_risks}} to any remaining risks or TODO follow-ups (or "none").
  - Set {{next_checks}} to recommended actions before merging/deploying (or "none").
</action>

<action>Display completion message:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Project Documentation Complete! ✓

**Location:** {{project_knowledge}}/

**Master Index:** {{project_knowledge}}/index.md
👆 This is your primary entry point for AI-assisted development

**Generated Documentation:**
{{generated_files_list}}

**Next Steps:**

1. Review the index.md to familiarize yourself with the documentation structure
2. When creating a brownfield PRD, point the PRD workflow to: {{project_knowledge}}/index.md
3. For UI-only features: Reference {{project_knowledge}}/architecture-{{ui_part_id}}.md
4. For API-only features: Reference {{project_knowledge}}/architecture-{{api_part_id}}.md
5. For full-stack features: Reference both part architectures + integration-architecture.md

**Verification Recap:**

- Tests/extractions executed: {{verification_summary}}
- Outstanding risks or follow-ups: {{open_risks}}
- Recommended next checks before PR: {{next_checks}}

**Brownfield PRD Command:**
When ready to plan new features, run the PRD workflow and provide this index as input.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</action>

<action>FINALIZE state file:

- Add to completed_steps: {"step": "step_12", "status": "completed", "timestamp": "{{now}}", "summary": "Workflow complete"}
- Update timestamps.completed = "{{now}}"
- Update current_step = "completed"
- Write final state file
  </action>

<action>Display: "State file saved: {{project_knowledge}}/project-scan-report.json"</action>
<action>Run: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow.on_complete` — if the resolved value is non-empty, follow it as the final terminal instruction before exiting.</action>

</workflow>
