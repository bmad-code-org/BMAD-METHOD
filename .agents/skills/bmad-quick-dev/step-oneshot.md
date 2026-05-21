---
deferred_work_file: '{implementation_artifacts}/deferred-work.md'
---

# Step One-Shot: Implement, Review, Present

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
- NEVER auto-push.

## INSTRUCTIONS

### Pre-Implementation Check

**CRITICAL: Calculate structural blast radius and obtain human approval before ANY code modification. NEVER skip this check.**

1. **Identify targets**: Derive the symbols/files being modified from the clarified user intent. If ambiguous, ask the user for explicit targets.

2. **Calculate blast radius with built-in summarization and freshness check**: For each target symbol, call the memtrace-adapter: `node _bmad/scripts/memtrace/memtrace-adapter.mjs --target <symbol> --query get_impact --check-freshness --summarize`. The adapter verifies index freshness before the blast radius query — no separate `list_repos` call needed. Process targets SEQUENTIALLY — NEVER use `Promise.all`. On exit code 0: parse STDOUT JSON; use `summarized.critical_dependents`, `summarized.module_impact`, `summarized.total_affected`, and `summarized.token_estimate` for the Confidence Report. Extract `affected_symbols` (raw) for qa-memtrace.mjs. On exit code 1: check STDERR for `[FRESHNESS]` (stale/missing index) vs `MEMTRACE_MCP_ERROR_TIMEOUT` (MCP unreachable) → HALT.

4. **Token budget already satisfied**: The adapter's `--summarize` flag guarantees ≤2000 tokens. No manual summarization needed.

5. **Present Blast Radius Confidence Report**:
   ```
   ## Blast Radius Confidence Report

   **Target:** [symbol/file]
   **Risk Level:** [Low/Medium/High/Critical]
   **Affected Symbols:** N across M files
   ### Critical Dependents (Depth 1-2)
   - `symbol` in `file` — relationship
   ### Module Impact Summary
   - module: N symbols
   ---
   **Decision Required:** [A] Approve / [R] Reject
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
   - Write the full Test Coverage Justification into `{spec_file}`'s completion notes before proceeding

5b. **Execute Mathematical Quality Gate (Phase 2)**: If the blast radius has zero affected modules, skip this step and note "Mathematical Quality Gate: SKIPPED (empty blast radius)." Otherwise:
   - Serialize the blast radius data and test coverage data to temporary JSON files in the system temp directory
   - Use the user-provided coverage threshold (default 100 if none given)
   - Run: `node _bmad/scripts/memtrace/qa-memtrace.mjs --blast-radius <temp-blast-file> --test-coverage <temp-coverage-file> --threshold <N>`
   - Read the script's STDOUT and capture its exit code
   - **If exit 0**: log the output to `{spec_file}` completion notes under "Mathematical Quality Gate Output" and continue
   - **If exit 1**: persist the output to `{spec_file}` completion notes, present the uncovered nodes, then HALT: "Mathematical quality gate failed. N of M required nodes are not covered by tests. Agent must write/update tests before proceeding."
    - The qa-memtrace.mjs exit code is the FINAL authority. Exit 1 is a HARD BLOCK on implementation.

5c. **Dead Code Pitfall Validation**: If the story involves dead-code removal (find_dead_code usage):
   - Call the memtrace-adapter: `node _bmad/scripts/memtrace/memtrace-adapter.mjs --target <module_path> --query find_dead_code [--repo <repo_id>]`. Process sequentially — NEVER use `Promise.all`. Parse the adapter's STDOUT JSON for the `symbols` array.
   - Serialize candidates to a temp JSON file.
   - Run: `node _bmad/scripts/memtrace/validate-dead-code.mjs --candidates <temp-file>`
   - If exit 0: log output to `{spec_file}` completion notes as "Dead Code Pitfall Validation Report". Present SUSPECT entries for manual review. Ignore FALSE_POS and GHOST.
   - If exit 1: log error and proceed (error is logged, not a hard block).
   - Clean up temp files.
   - If story does NOT involve dead-code removal, skip this step entirely.

6. **HALT for decision**: Ask user: "[A] Approve — proceed | [R] Reject — halt"
   - Approve → continue to Implement below
   - Reject → HALT

---

### Implement

Follow `./sync-sprint-status.md` with `{target_status}` = `in-progress`.

Implement the clarified intent directly.

### Review

Invoke the `bmad-review-adversarial-general` skill in a subagent with the changed files. The subagent gets NO conversation context — to avoid anchoring bias. Launch at the same model capability as the current session. If no sub-agents are available, write the changed files to a review prompt file in `{implementation_artifacts}` and HALT. Ask the human to run the review in a separate session and paste back the findings.

### Classify

Deduplicate all review findings. Three categories only:

- **patch** — trivially fixable. Auto-fix immediately.
- **defer** — pre-existing issue not caused by this change. Append to `{deferred_work_file}`.
- **reject** — noise. Drop silently.

If a finding is caused by this change but too significant for a trivial patch, HALT and present it to the human for decision before proceeding.

### Generate Spec Trace

Set `{title}` = a concise title derived from the clarified intent.

Write `{spec_file}` using `./spec-template.md`. Fill only these sections — delete all others:

1. **Frontmatter** — set `title: '{title}'`, `type`, `created`, `status: 'done'`. Add `route: 'one-shot'`.
2. **Title and Intent** — `# {title}` heading and `## Intent` with **Problem** and **Approach** lines. Reuse the summary you already generated for the terminal.
3. **Suggested Review Order** — append after Intent. Build using the same convention as `./step-05-present.md` § "Generate Suggested Review Order" (spec-file-relative links, concern-based ordering, ultra-concise framing).

Follow `./sync-sprint-status.md` with `{target_status}` = `review`.

### Commit

If version control is available and the tree is dirty, create a local commit with a conventional message derived from the intent. If VCS is unavailable, skip.

### Present

1. Open the spec in the user's editor so they can click through the Suggested Review Order:
   - Resolve two absolute paths: (1) the repository root (`git rev-parse --show-toplevel` — returns the worktree root when in a worktree, project root otherwise; if this fails, fall back to the current working directory), (2) `{spec_file}`. Run `code -r "{absolute-root}" "{absolute-spec-file}"` — the root first so VS Code opens in the right context, then the spec file. Always double-quote paths to handle spaces and special characters.
   - If `code` is not available (command fails), skip gracefully and tell the user the spec file path instead.
2. Display a summary in conversation output, including:
   - The commit hash (if one was created).
   - List of files changed with one-line descriptions. Any file paths shown in conversation/terminal output must use CWD-relative format (no leading `/`) with `:line` notation (e.g., `src/path/file.ts:42`) for terminal clickability — this differs from spec-file links which use spec-file-relative paths.
   - Review findings breakdown: patches applied, items deferred, items rejected. If all findings were rejected, say so.
   - A note that the spec is open in their editor (or the file path if it couldn't be opened). Mention that `{spec_file}` now contains a Suggested Review Order.
   - **Navigation tip:** "Ctrl+click (Cmd+click on macOS) the links in the Suggested Review Order to jump to each stop."
3. Offer to push and/or create a pull request.

HALT and wait for human input.

Workflow complete.

## On Complete

Run: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow.on_complete`

If the resolved `workflow.on_complete` is non-empty, follow it as the final terminal instruction before exiting.
