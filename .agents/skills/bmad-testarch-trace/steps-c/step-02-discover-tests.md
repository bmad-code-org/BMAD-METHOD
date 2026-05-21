---
name: 'step-02-discover-tests'
description: 'Discover and catalog tests by level'
nextStepFile: '{skill-root}/steps-c/step-03-map-criteria.md'
outputFile: '{test_artifacts}/traceability-matrix.md'
---

# Step 2: Discover & Catalog Tests

## STEP GOAL

Identify tests relevant to the resolved coverage oracle and classify by test level.

## 🧠 Memtrace Context (Self-Contained)

Memtrace structural graph queries are available for this workflow.
If activation failed to load persistent_facts, this context is sufficient:

**Available MCP tools:**
- `list_indexed_repositories` — check index freshness and repo availability
- `find_symbol` (kind=Function|Method|Class) — discover exported symbols
- `get_directory_tree` (mode=compact, max_depth=3) — module structure
- `get_source_window` — read symbol source when needed

> **Complete Memtrace MCP tool catalog:**
> **Navigation:** find_code, find_symbol, get_source_window, get_directory_tree
> **Architecture:** get_codebase_briefing, list_communities, list_processes, get_process_flow
> **Dependencies:** get_symbol_context, analyze_relationships, get_impact, find_dependency_path, get_api_topology
> **Quality:** find_dead_code, find_most_complex_functions, find_bridge_symbols, find_central_symbols
> **Temporal:** get_evolution, get_changes_since, get_timeline, get_episode_replay
> **Index:** index_directory, list_indexed_repositories, watch_directory, delete_repository

**Rules:**
- All graph queries are ADVISORY — skip gracefully if Memtrace unavailable
- Process queries STRICTLY SEQUENTIALLY with `for...of` + `await`
- NEVER use `Promise.all` for Memtrace queries
- Check `list_indexed_repositories` before trusting graph output
- Prefer summarized output to stay under 2000 tokens

**Graceful degradation:**
- Memtrace unavailable → set `structural_symbol_inventory` to `"unavailable"`
- Partial query success → set status to `"partial"`, apply to available data
- NEVER block the workflow on Memtrace availability

---

## MANDATORY EXECUTION RULES

- 📖 Read the entire step file before acting
- ✅ Speak in `{communication_language}`

---

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 💾 Record outputs before proceeding
- 📖 Load the next step only when instructed

## CONTEXT BOUNDARIES:

- Available context: config, loaded artifacts, and knowledge fragments
- Focus: this step's goal only
- Limits: do not execute future steps
- Dependencies: prior steps' outputs (if any)

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

## 1. Discover Tests

Search `{test_dir}` for:

- Test IDs (e.g., `1.3-E2E-001`)
- Feature name matches
- Resolved oracle item IDs/titles
- Spec patterns (`*.spec.*`, `*.test.*`)

When the oracle is synthetic (`synthetic_requirements` or `user_journeys`), also search for:

- route/path matches
- page/screen/component names
- visible UI labels and CTA names
- form action verbs (create, edit, save, delete, submit, search, checkout, etc.)
- auth/session/logout flows

---

## 2. Categorize by Level

Classify as:

- E2E
- API
- Component
- Unit

Record test IDs, describe blocks, priority markers, and the per-test identity fields needed for machine-readable output:

- Stable identity fields: `id`, `title`, `file`, `line`, `level`
- Execution state flags: `skipped`, `pending`, `fixme`
- Skip or blocker reason when it can be discovered from the test source or runtime metadata

---

## 3. Build Coverage Heuristics Inventory

Capture explicit coverage signals so Phase 1 can detect common blind spots:

- API endpoint coverage
  - Inventory endpoints referenced by requirements/specs and endpoints exercised by API tests
  - Mark endpoints with no direct tests
- Authentication/authorization coverage
  - Detect tests for login/session/token flows and permission-denied paths
  - Mark auth/authz requirements with missing negative-path tests
- Error-path coverage
  - Detect validation, timeout, network-failure, and server-error scenarios
  - Mark criteria with happy-path-only tests

- UI journey coverage (when tracing UI/source-derived oracle items)
  - Inventory routes/screens/journeys referenced by the oracle and journeys exercised by E2E/component tests
  - Mark journeys with no end-to-end coverage
- UI state coverage
  - Detect loading, empty, validation, error, and permission-denied state assertions
  - Mark journeys that only verify happy-path rendering

Record these findings in step output as `coverage_heuristics` for Step 3/4.

---

### 3.5: Discover Structural Symbols (Memtrace)

If the project repository is indexed by Memtrace, query the graph to discover exported
functional symbols in the target module. This step is ADVISORY — skip if Memtrace is unavailable.

**Check Availability:**
- Use the Memtrace MCP tool `list_indexed_repositories` to confirm the project repo is indexed
- If no indexed repo matches the project root, set `structural_symbol_inventory` to empty/null
  and skip to section 4 (Save Progress) with a diagnostic note: "Structural coverage unavailable —
  no indexed repository found"

**If Available — Discover Exported Symbols:**

1. **Identify target module scope:**
   - Use `{source_dir}` from workflow config as the base search directory
   - If a specific module or file was targeted (from user input or oracle), limit to that scope
   - Use `get_directory_tree` (mode=compact, max_depth=3) to understand the module structure

2. **Query for structural symbols:**
   - Call `find_symbol` with kind="Function" to discover exported functions in the target scope
   - Call `find_symbol` with kind="Method" to discover exported methods
   - Call `find_symbol` with kind="Class" to discover exported classes (if applicable)
   - Process STRICTLY SEQUENTIALLY using `for...of` with `await` — NEVER `Promise.all`
   - For each symbol result, record:
     - `name`: symbol name
     - `kind`: Function | Method | Class
     - `file_path`: source file path
     - `start_line`: line number in source
     - `exported`: whether the symbol is exported (public API surface)
     - `complexity_score`: Memtrace complexity rating (if available)
     - `risk_level`: Memtrace risk level (if available)

3. **Filter and prioritize:**
   - Focus on **exported** symbols first — these are the public API surface that must be tested
   - Include non-exported symbols with high complexity or high risk as secondary coverage targets
   - De-duplicate symbols (same name + same file = same symbol)
   - Cap at 100 symbols per query to avoid context bloat

**Record Structural Inventory:**

Build `structural_symbol_inventory` as a JSON structure:

```javascript
const structural_symbol_inventory = {
  status: "available", // "available" | "partial" | "unavailable"
  source_scope: "{source_dir or targeted module path}",
  total_symbols: /* count */,
  exported_count: /* count */,
  symbols: [
    {
      name: "functionName",
      kind: "Function",
      file_path: "src/module/file.ts",
      start_line: 42,
      exported: true,
      complexity_score: /* number or null */,
      risk_level: "medium"
    },
    // ... more symbols
  ],
  diagnostic: null // set to "Partial — some queries failed" if partial
};
```

**Graceful Degradation:**
- If `list_indexed_repositories` returns empty or the project repo is NOT indexed:
  set `structural_symbol_inventory = { status: "unavailable", symbols: [], diagnostic: "Memtrace not indexed" }`
- If an individual `find_symbol` query times out or fails:
  note the failure, continue with remaining queries, set status to "partial"
- NEVER block the step on Memtrace availability — structural discovery is supplemental

**If Unavailable:**
- Set `structural_symbol_inventory = { status: "unavailable", symbols: [], diagnostic: "Memtrace not available" }`
- Continue to section 4 (Save Progress)
- The remaining steps will skip structural analysis gracefully

---

### 4. Save Progress

**Save this step's accumulated work to `{outputFile}`.**

- **If `{outputFile}` does not exist** (first save), create it using the workflow template (if available) with YAML frontmatter:

  ```yaml
  ---
  stepsCompleted: ['step-02-discover-tests']
  lastStep: 'step-02-discover-tests'
  lastSaved: '{date}'
  ---
  ```

  Then write this step's output below the frontmatter.

- **If `{outputFile}` already exists**, update:
  - Add `'step-02-discover-tests'` to `stepsCompleted` array (only if not already present)
  - Set `lastStep: 'step-02-discover-tests'`
  - Set `lastSaved: '{date}'`
  - Append this step's output to the appropriate section of the document.

Load next step: `{nextStepFile}`

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:

- Step completed in full with required outputs

### ❌ SYSTEM FAILURE:

- Skipped sequence steps or missing outputs
  **Master Rule:** Skipping steps is FORBIDDEN.
