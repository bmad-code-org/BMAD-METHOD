---
---

# Step 3: Implement

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

2. **Verify Memtrace availability**: Check if Memtrace MCP tools are reachable (call `list_indexed_repositories` or equivalent). If unavailable, HALT: "Memtrace MCP server is not available. Structural blast radius verification cannot be performed. Please start the Memtrace server or explicitly override this safety check."

3. **Calculate blast radius**: For each target symbol, call `memtrace_get_impact`. Process targets SEQUENTIALLY using `for...of` — NEVER use `Promise.all`. Extract `risk_level`, `affected_symbols`, and `affected_files`.

4. **Summarize for token budget**: Keep the final report under 2000 tokens:
   - Collapse depth &gt; 3 into module-level counts only
   - Deduplicate shared dependencies (show once under highest-depth occurrence)
   - Report only top 20 most-critical symbols by risk
   - Use concise bullet format, no prose paragraphs

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
