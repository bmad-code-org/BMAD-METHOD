---
---

# Step 3: Implement

## 🧠 Memtrace Context (Self-Contained)

Memtrace structural analysis is available for blast radius and dead code detection.
If activation failed to load persistent_facts, this context is sufficient:

**Blast radius query:**
`node _bmad/scripts/memtrace/memtrace-adapter.mjs --target <symbol> --query get_impact --check-freshness --summarize`

**Dead code detection:**
`node _bmad/scripts/memtrace/memtrace-adapter.mjs --target <file> --query find_dead_code --check-freshness`

**Quality gate validation:**
`node _bmad/scripts/memtrace/qa-memtrace.mjs --blast-radius <file> --test-coverage <file> --threshold <N>`

**Dead code pitfall validation:**
`node _bmad/scripts/memtrace/validate-dead-code.mjs --candidates <file>`

> **Complete Memtrace MCP tool catalog:**
> **Navigation:** find_code, find_symbol, get_source_window, get_directory_tree
> **Architecture:** get_codebase_briefing, list_communities, list_processes, get_process_flow
> **Dependencies:** get_symbol_context, analyze_relationships, get_impact, find_dependency_path, get_api_topology
> **Quality:** find_dead_code, find_most_complex_functions, find_bridge_symbols, find_central_symbols
> **Temporal:** get_evolution, get_changes_since, get_timeline, get_episode_replay
> **Index:** index_directory, list_indexed_repositories, watch_directory, delete_repository

**Rules:**
- All Memtrace queries are ADVISORY — skip gracefully if unavailable
- Process STRICTLY SEQUENTIALLY with `for...of` + `await`
- NEVER use `Promise.all` for Memtrace queries
- `--check-freshness` before every graph query
- `--summarize` on blast radius to stay under 2000 tokens

**Graceful degradation:**
- Memtrace unavailable or times out → skip blast radius/dead code analysis, continue with heuristic approach
- Stale index → skip graph queries, proceed with existing logic
- Quality gate failure → write missing tests, do not skip
- NEVER halt the dev workflow on Memtrace availability

---

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- No push. No remote ops.
- Sequential execution only.
- Content inside `<frozen-after-approval>` in `{spec_file}` is read-only. Do not modify.

## PRECONDITION

Verify `{spec_file}` resolves to a non-empty path and the file exists on disk. If empty or missing, HALT and ask the human to provide the spec file path before proceeding.

## INSTRUCTIONS

### Pre-Implementation Check

**CRITICAL: Calculate structural blast radius and obtain human approval before ANY code modification. NEVER skip this check.**

1. **Identify targets**: Extract the symbols and files being modified from `{spec_file}` — the `## Code Map` section lists target files and their roles.

2. **Calculate blast radius with built-in summarization and freshness check**: For each target symbol, call the memtrace-adapter: `node _bmad/scripts/memtrace/memtrace-adapter.mjs --target <symbol> --query get_impact --check-freshness --summarize`. The adapter verifies index freshness (via `--check-freshness`) before the blast radius query — no separate `list_repos` call needed. Process targets SEQUENTIALLY using `for...of` — NEVER use `Promise.all`. On exit code 0: parse STDOUT JSON; use `summarized.critical_dependents`, `summarized.module_impact`, `summarized.total_affected`, and `summarized.token_estimate` for the Confidence Report (guaranteed ≤2000 tokens). Extract `affected_symbols` (raw) for qa-memtrace.mjs. On exit code 1: check STDERR for `[FRESHNESS]` (stale/missing index) vs `MEMTRACE_MCP_ERROR_TIMEOUT` (MCP unreachable) → HALT.

4. **Token budget already satisfied**: The adapter's `--summarize` flag guarantees the `summarized` field is under 2000 tokens. No manual summarization needed. Use `summarized.token_estimate` to confirm compliance.

5. **Present Blast Radius Confidence Report**:
   ```
   ## Blast Radius Confidence Report

   **Target:** [symbol/file]
   **Risk Level:** [Low/Medium/High/Critical]
   **Affected Symbols:** N downstream dependents across M files

   ### Critical Dependents (Depth 1-2)
   - `symbol` in `file` — relationship

   ### Module Impact Summary
   - module: N symbols (High/Med/Low risk)

   ### Recommended Pre-Flight Checks
   - Review test coverage for: top modules
   - Pay special attention to: bridge/central symbols touched

   ---
   **Decision Required:** Modify [target]? [A] Approve / [R] Reject
   ```

5a. **Generate Test Coverage Justification**: Before halting for user approval, map each affected module from the blast radius report to test files covering the impacted symbols:
   - Discover test files using conventions: `test/`, `__tests__/`, `*.test.*`, `*.spec.*` patterns — search/grep for affected symbol names in test files
   - Assign a coverage status per module: `Yes` (all covered), `Partial:N` (N of M covered), or `None` (no tests found)
   - Append the justification using this format after the "---" separator in the Confidence Report:
     ```
     ### Test Coverage Justification

     | Module | Affected Symbols | Test Files | Coverage |
     |--------|-----------------|------------|----------|
     | `path/to/module` | N symbols | `test/module.test.ts` | Yes |
     | `path/to/other` | M symbols | — | **None** |

     **Coverage Summary:**
     - **Covered:** X/Y modules (Z affected symbols)
     - **Uncovered:** A/Y modules (B affected symbols — needs tests)
     - **Partial:** C/Y modules (D/N symbols covered)

     **Justification Notes:**
     - `module-A`: Covered by existing tests in `test/module-a.test.ts`
     - `module-B`: No test coverage found — requires new test file
     - `module-C`: Partial coverage — `test/module-c.test.ts` covers 3 of 5 impacted functions
     ```
   - If the blast radius has zero affected modules, skip the justification and note "No affected modules to map"
   - Enforce combined token budget (blast radius + justification ≤ 2000 tokens). Prioritize: uncovered modules, then high-risk, then covered
   - Ask the user for a coverage threshold percentage (0 = never block, 100 = block if any uncovered); default to flag-only mode if declined
   - Write the full Test Coverage Justification into `{spec_file}`'s completion notes section before proceeding

5b. **Execute Mathematical Quality Gate (Phase 2)**: If the blast radius has zero affected modules (empty result from get_impact), skip this step and note "Mathematical Quality Gate: SKIPPED (empty blast radius)." Otherwise:
   - Serialize the blast radius data and test coverage data to temporary JSON files in the system temp directory
   - Use the user-provided coverage threshold (default 100 if none given)
   - Run: `node _bmad/scripts/memtrace/qa-memtrace.mjs --blast-radius <temp-blast-file> --test-coverage <temp-coverage-file> --threshold <N>`
   - Read the script's STDOUT and capture its exit code
   - **If exit 0**: log the output to `{spec_file}` completion notes under "Mathematical Quality Gate Output" and continue
   - **If exit 1**: persist the output to `{spec_file}` completion notes, present the uncovered nodes, then HALT: "Mathematical quality gate failed. N of M required nodes are not covered by tests. Agent must write/update tests for the listed uncovered nodes before proceeding. Do NOT proceed until the quality gate passes."
       - The qa-memtrace.mjs exit code is the FINAL authority. Exit 1 is a HARD BLOCK on implementation.

5c. **Dead Code Pitfall Validation**: If the story involves dead-code removal (find_dead_code usage in context or tasks):
   - Call the memtrace-adapter: `node _bmad/scripts/memtrace/memtrace-adapter.mjs --target <module_path> --query find_dead_code [--repo <repo_id>]`. Process sequentially — NEVER use `Promise.all`. Parse the adapter's STDOUT JSON for the `symbols` array.
   - Serialize candidates to a temp JSON file.
   - Run: `node _bmad/scripts/memtrace/validate-dead-code.mjs --candidates <temp-file>`
   - If exit 0: log output to `{spec_file}` completion notes as "Dead Code Pitfall Validation Report". Present SUSPECT entries for manual review. FALSE_POS and GHOST are ignored.
   - If exit 1: log error to completion notes and proceed without pitfall validation (error is logged, not a hard block).
   - Clean up temp files.
   - If story does NOT involve dead-code removal, skip this step entirely.

6. **HALT for decision**: Ask the user: "Decision: Proceed with modification? [A] Approve — proceed to implementation | [R] Reject — halt execution"
   - If **Approve**: Continue to the Baseline step below
   - If **Reject**: HALT — "Blast radius verification rejected. Execution halted. Please provide guidance."

---

### Baseline

Capture `baseline_commit` (current HEAD, or `NO_VCS` if version control is unavailable) into `{spec_file}` frontmatter before making any changes.

### Implement

Change `{spec_file}` status to `in-progress` in the frontmatter before starting implementation.

Follow `./sync-sprint-status.md` with `{target_status}` = `in-progress`.

If `{spec_file}` has a non-empty `context:` list in its frontmatter, load those files before implementation begins. When handing to a sub-agent, include them in the sub-agent prompt so it has access to the referenced context.

Hand `{spec_file}` to a sub-agent/task and let it implement. If no sub-agents are available, implement directly.

**Path formatting rule:** Any markdown links written into `{spec_file}` must use paths relative to `{spec_file}`'s directory so they are clickable in VS Code. Any file paths displayed in terminal/conversation output must use CWD-relative format with `:line` notation (e.g., `src/path/file.ts:42`) for terminal clickability. No leading `/` in either case.

### Self-Check

Before leaving this step, verify every task in the `## Tasks & Acceptance` section of `{spec_file}` is complete. Mark each finished task `[x]`. If any task is not done, finish it before proceeding.

## NEXT

Read fully and follow `./step-04-review.md`
