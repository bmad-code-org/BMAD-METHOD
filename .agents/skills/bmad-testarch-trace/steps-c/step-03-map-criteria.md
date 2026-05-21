---
name: 'step-03-map-criteria'
description: 'Map coverage oracle items to tests and build traceability matrix'
nextStepFile: '{skill-root}/steps-c/step-04-analyze-gaps.md'
outputFile: '{test_artifacts}/traceability-matrix.md'
---

# Step 3: Map Coverage Oracle to Tests

## STEP GOAL

Create the traceability matrix linking the resolved oracle items to tests.

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

## 1. Build Matrix

For each resolved oracle item (formal requirement, endpoint/spec item, or synthetic journey):

- Map to matching tests
- Mark coverage status: FULL / PARTIAL / NONE / UNIT-ONLY / INTEGRATION-ONLY
- Record test level and priority
- Preserve each mapped test's stable identity fields (`id`, `title`, `file`, `line`, `level`, status flags) so Phase 1 can deduplicate unique tests before JSON export
- Record heuristic signals:
  - Endpoint coverage present/missing (for API-impacting items)
  - Auth/authz coverage present/missing (positive and negative paths)
  - Error-path coverage present/missing (validation, timeout, network/server failures)
  - UI journey E2E coverage present/missing (for source-derived journeys)
  - UI state coverage present/missing (loading, empty, validation, error, permission-denied)

---

### 1.5: Map Structural Symbols to Tests (Memtrace)

If `structural_symbol_inventory` is available (status = "available" or "partial"),
cross-reference each discovered symbol against the test inventory from Step 2 to build a
structural coverage dimension. This runs alongside the requirements-based matrix from section 1.

**Skip this entire subsection if:** `structural_symbol_inventory.status` is `"unavailable"` or `structural_symbol_inventory.symbols` is empty.

**Cross-Reference Process:**

For each symbol in `structural_symbol_inventory.symbols`:

1. **Search test files for symbol references:**
   - Search discovered test files (from Step 2) for the symbol's `name` as text
   - Look for imports of the symbol's file, function calls, class instantiations, or type references
   - Use the naming conventions from `test-priorities-matrix.md` (loaded in Step 1) to identify related test patterns
   - Process STRICTLY SEQUENTIALLY — do NOT parallelize test file searches

2. **Determine coverage status per symbol:**

   | Condition | Coverage Status |
   |-----------|----------------|
   | Symbol found in test file(s) with assertions/exercises | `FULL` |
   | Symbol referenced in test file(s) but only imported/mocked | `PARTIAL` |
   | Symbol not found in any test file | `NONE` |
   | Symbol only in unit test, missing E2E/integration | `UNIT-ONLY` |
   | Symbol only in E2E test, missing unit test | `INTEGRATION-ONLY` |

3. **Assign priority based on symbol characteristics:**

   ```javascript
   const structuralPriority = (symbol) => {
     if (symbol.exported && symbol.complexity_score >= 10) return 'P0';
     if (symbol.exported) return 'P1';
     if (symbol.complexity_score >= 10) return 'P2';
     return 'P3';
   };
   ```

**Build `structural_coverage_matrix`:**

```javascript
const structural_coverage_matrix = structural_symbol_inventory.symbols.map(symbol => ({
  id: `SYM-${symbol.file_path}:${symbol.name}`,
  type: 'structural_symbol',
  description: `${symbol.kind} \`${symbol.name}\` in ${symbol.file_path}:${symbol.start_line}`,
  priority: structuralPriority(symbol),
  coverage: /* determined coverage status */,
  tests: [
    {
      id: /* test ID */,
      file: /* test file path */,
      title: /* test description */,
      level: /* E2E | API | Component | Unit */
    }
  ],
  exported: symbol.exported,
  complexity_score: symbol.complexity_score,
  risk_level: symbol.risk_level
}));
```

**Integration with requirements matrix:**
- The `structural_coverage_matrix` is a SEPARATE array from the requirements-based `traceabilityMatrix`
- Both feed into Step 4 independently
- Do NOT merge structural symbols into the requirements-based matrix — they are different dimensions

**Graceful Degradation:**
- If `structural_symbol_inventory.status` is `"partial"`: apply cross-reference only to symbols that were successfully discovered, note which were missed
- If test file search for a symbol fails: mark that symbol's coverage as `"unknown"` with a diagnostic note
- NEVER block or halt on structural mapping failures

---

## 2. Validate Coverage Logic

Ensure:

- P0/P1 items have coverage
- No duplicate coverage across levels without justification
- Items are not happy-path-only when the oracle implies error handling or alternate states
- API items are not marked FULL if endpoint-level checks are missing
- Auth/authz items include at least one denied/invalid-path test where applicable
- Synthetic UI journeys are not marked FULL when no E2E or component test asserts the critical path and key failure states

---

### 3. Save Progress

**Save this step's accumulated work to `{outputFile}`.**

- **If `{outputFile}` does not exist** (first save), create it using the workflow template (if available) with YAML frontmatter:

  ```yaml
  ---
  stepsCompleted: ['step-03-map-criteria']
  lastStep: 'step-03-map-criteria'
  lastSaved: '{date}'
  ---
  ```

  Then write this step's output below the frontmatter.

- **If `{outputFile}` already exists**, update:
  - Add `'step-03-map-criteria'` to `stepsCompleted` array (only if not already present)
  - Set `lastStep: 'step-03-map-criteria'`
  - Set `lastSaved: '{date}'`
  - Append this step's output to the appropriate section of the document.

Load next step: `{nextStepFile}`

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:

- Step completed in full with required outputs

### ❌ SYSTEM FAILURE:

- Skipped sequence steps or missing outputs
  **Master Rule:** Skipping steps is FORBIDDEN.
