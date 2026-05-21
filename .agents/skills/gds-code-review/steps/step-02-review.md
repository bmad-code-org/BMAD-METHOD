---
failed_layers: '' # set at runtime: comma-separated list of layers that failed or returned empty
---

# Step 2: Review

## 🧠 Memtrace Context (Self-Contained)

Memtrace structural deep audit is available for independent code review verification.
If activation failed to load persistent_facts, this context is sufficient:

**Blast radius audit:**
`node _bmad/scripts/memtrace/memtrace-adapter.mjs --target <symbol> --query get_impact --check-freshness --summarize`
- Exit 0 → parse `summarized.critical_dependents`, `summarized.module_impact`, `summarized.total_affected`
- Exit 1 + `[FRESHNESS]` in STDERR → stale index, skip
- Exit 1 + `MEMTRACE_MCP_ERROR_TIMEOUT` → server unreachable, skip

**Dead code audit:**
`node _bmad/scripts/memtrace/memtrace-adapter.mjs --target <file> --query find_dead_code --check-freshness`
- Exit 0 → list of dead symbols in that file
- Exit 1 → skip, continue with remaining files

> **Complete Memtrace MCP tool catalog:**
> **Navigation:** find_code, find_symbol, get_source_window, get_directory_tree
> **Architecture:** get_codebase_briefing, list_communities, list_processes, get_process_flow
> **Dependencies:** get_symbol_context, analyze_relationships, get_impact, find_dependency_path, get_api_topology
> **Quality:** find_dead_code, find_most_complex_functions, find_bridge_symbols, find_central_symbols
> **Temporal:** get_evolution, get_changes_since, get_timeline, get_episode_replay
> **Index:** index_directory, list_indexed_repositories, watch_directory, delete_repository

**Rules:**
- All queries are ADVISORY — NEVER block the review on Memtrace availability
- Process STRICTLY SEQUENTIALLY with `for...of` + `await`
- NEVER use `Promise.all` for Memtrace queries
- `--check-freshness` flag is mandatory
- `--summarize` flag required for blast radius to stay under 2000 tokens

**Graceful degradation:**
- Memtrace unavailable or times out → skip blast radius/dead code audit, continue with heuristic review
- Stale index (`[FRESHNESS]` in STDERR) → skip graph queries, proceed with existing review logic
- Partial failure → note diagnostic, apply available data, do not halt the review
- NEVER block the code review workflow on Memtrace availability

---

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`, tailored to `{game_dev_experience}`
- The Blind Hunter subagent receives NO project context — diff only.
- The Edge Case Hunter subagent receives diff and project read access.
- The Acceptance Auditor subagent receives diff, spec, and context docs.
- All review subagents must run at the same model capability as the current session.

## INSTRUCTIONS

1. If `{review_mode}` = `"no-spec"`, note to the user: "Acceptance Auditor skipped — no spec file provided."

2. Launch parallel subagents without conversation context. If subagents are not available, generate prompt files in `{implementation_artifacts}` — one per reviewer role below — and HALT. Ask the user to run each in a separate session (ideally a different LLM) and paste back the findings. When findings are pasted, resume from this point and proceed to step 3.

   - **Blind Hunter** — receives `{diff_output}` only. No spec, no context docs, no project access. Invoke via the `bmad-review-adversarial-general` skill.

   - **Edge Case Hunter** — receives `{diff_output}` and read access to the project. Invoke via the `bmad-review-edge-case-hunter` skill.

     - **Acceptance Auditor** (only if `{review_mode}` = `"full"`) — receives `{diff_output}`, the content of the file at `{spec_file}`, and any loaded context docs. Its prompt:
       > You are an Acceptance Auditor. Review this diff against the spec and context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code.
       >
       > **Quality Gate — Test Coverage Justification:** Check whether the spec/story file or diff commentary includes a "Test Coverage Justification" section that maps impacted modules/nodes to specific test files. Apply these rules:
       > - **If `{review_mode}` = `"full"`** (spec/story file is present) and the spec file lacks a Test Coverage Justification section → raise a `decision_needed` finding: "Missing Test Coverage Justification — blast radius report exists but no test mapping was provided."
       > - **If `{review_mode}` = `"no-spec"`** (diff-only review) → check the diff commentary or commit messages for test coverage evidence. If absent, raise a `patch` finding: "Quality gate artifact missing — no Test Coverage Justification found in diff commentary or commit message."
       > - **If Test Coverage Justification exists** but has any node listed with coverage status `None` or `no coverage found` → raise a separate `decision_needed` finding for each such node: "Uncovered impacted node: [node-name] — tests required before merge."
       > - Reference any blast radius report embedded in the spec/story file to cross-validate the affected modules listed in the justification.
       > - **Fallback detection:** If no section titled "Test Coverage Justification" is found, search for a markdown table with columns containing "Module", "Affected Symbols", "Test Files", and "Coverage". If such a table exists, treat it as meeting the quality gate regardless of section title.
       >
        > **Quality Gate — Mathematical Gate Output:** Check whether the spec/story file includes a "Mathematical Quality Gate Output" section (JSON output from `qa-memtrace.mjs`). Apply these rules:
        > - **If the spec file contains "Mathematical Quality Gate Output"**: use the `uncovered_nodes` from the script's JSON output as the ground truth for uncovered nodes — NOT the agent's textual claims in the justification table. Cross-validate: if the script found a node as uncovered but the justification table lists it as `Yes` coverage → raise a `decision_needed` finding per mismatch: "Coverage mismatch — agent claimed [node] is covered but mathematical gate shows it is not."
        > - **If the spec file contains a blast radius report AND a Test Coverage Justification BUT no "Mathematical Quality Gate Output"**: this is a Phase 1-level story using only textual justification. Flag as `patch` (not `decision_needed`): "Phase 1 story — consider upgrading to mathematical quality gate via qa-memtrace.mjs."
        > - **If the spec file contains only a blast radius report (no test justification, no mathematical gate)**: raise a `decision_needed` finding: "Missing both Test Coverage Justification and Mathematical Quality Gate Output — Phase 2 story must include qa-memtrace.mjs execution results."
        >
        > **Quality Gate — Adapter Usage Verification:** Check whether the spec/story file records indicate use of the `memtrace-adapter.mjs` wrapper (rather than raw MCP tool calls) for blast radius and availability queries. Apply these rules:
        > - **If the spec/story file's Dev Agent Record or diff commentary references `memtrace-adapter.mjs`** for blast radius queries (`--query get_impact`) and availability checks (`--query list_repos`) → pass: adapter usage confirmed.
        > - **If the spec/story file shows `memtrace_get_impact` or `list_indexed_repositories` being called directly** (without the adapter wrapper) for the blast radius step → raise a `patch` finding: "Direct MCP call detected — blast radius step should use `memtrace-adapter.mjs` instead of raw `memtrace_get_impact` or `list_indexed_repositories` for consistent timeout handling and error token emission."
        > - **If the blast radius step is absent or the story doesn't involve code modification (new-file-only stories)** → skip this gate.
        > - **If the spec/story file involves dead-code queries (`find_dead_code`)**: check whether the adapter was used (`--query find_dead_code`) rather than raw `memtrace_find_dead_code` MCP calls. If `memtrace_find_dead_code` was called directly without the adapter → raise a `patch` finding: "Direct MCP call detected — dead-code query should use `memtrace-adapter.mjs --query find_dead_code` instead of raw `memtrace_find_dead_code` for consistent timeout handling and error token emission."
        > - **If the spec/story file shows `--query get_impact` called WITHOUT `--summarize`** in a story that involves code modification → raise a `patch` finding: "Adapter called without --summarize — blast radius output may exceed 2000 token budget. NFR1 requires all Memtrace structural tool outputs to be under 2000 tokens."
        > - **If the spec/story file shows `memtrace-adapter.mjs` called for `get_impact` or `find_dead_code` WITHOUT `--check-freshness`** → raise a `patch` finding: "Adapter called without --check-freshness — architecture requires index freshness verification before trusting graph output (Cross-Cutting Concern: Index Freshness Check)."
        >
        > **Quality Gate — Dead Code Pitfall Validation:** Check whether the spec/story file includes a "Dead Code Pitfall Validation Report" section (JSON output from `validate-dead-code.mjs`). Apply these rules:
        > - **If the spec file contains "Dead Code Pitfall Validation Report"**: verify that the `suspects` list entries were addressed in the implementation (check if corresponding tasks exist in Tasks/Subtasks, or if deleted files match suspect entries). If SUSPECT entries were not addressed → raise a `decision_needed` finding per unaddressed suspect: "SUSPECT dead-code entry not addressed: [name] in [file] — pitfall validation flagged this as truly dead code but no removal task was completed."
        > - **If the story involves dead-code removal (find_dead_code, dead-code in tasks) BUT no "Dead Code Pitfall Validation Report" exists in the spec file** → raise a `patch` finding: "Missing Dead Code Pitfall Validation Report — story involved dead-code removal but no pitfall validation was performed via validate-dead-code.mjs."
        > - **If neither dead-code removal nor a pitfall validation report exists**: skip this gate (story does not involve dead-code).
        >
        > **Structural Deep Audit — Memtrace Verification:**
        >
        > If `{memtrace_blast_radius}` and `{memtrace_dead_code}` are available (not `"unavailable"` or empty), you have access to independently-computed structural data. Use this to verify the diff's claims against the actual codebase graph.
        >
        > **Blast Radius Verification:**
        > - Cross-reference each modified symbol in the diff against `{memtrace_blast_radius}` results.
        > - If a symbol has `critical_dependents` (any depth) that are NOT modified in the diff → raise a `decision_needed` finding: **"Unhandled downstream dependency: `<dependent-name>` depends on modified `<symbol>` — diff does not include test or mitigation."**
        >   - Evidence: list the specific dependent name(s) and the blast radius data
        > - If the blast radius `total_affected` for any symbol exceeds 20 → raise a `patch` finding: **"High blast radius: `<symbol>` affects `<count>` dependents (depth `<N>`) — consider narrower refactor scope or expanded test coverage."**
        > - If the diff or commit message claims "no downstream impact" but blast radius shows dependents → raise a `decision_needed` finding: **"Downstream impact claim falsified: diff claims no impact but blast radius shows `<count>` affected symbols at depth 1+."**
        > - If a blast radius query returned `"partial"` for some symbols: note which symbols were not verified and proceed with available data only.
        >
        > **Dead Code Audit:**
        > - Check whether any `{memtrace_dead_code}` findings overlap with lines ADDED in modified files (new code in `+` lines).
        > - If a modified file introduces a NEW function/method/class that also appears in the dead code results → raise a `patch` finding: **"New dead code introduced: `<symbol>` in `<file>` — added but has zero callers in the codebase graph."**
        > - If a modified file (`+` or `-` lines) contains EXISTING dead code symbols that were NOT removed → raise a `patch` finding: **"Pre-existing dead code unaddressed: `<symbol>` in `<file>` — appears in dead code results but was not cleaned up in this change."**
        > - Do NOT flag dead code in files that the diff did not touch.
        >
        > **If `{memtrace_blast_radius}` or `{memtrace_dead_code}` is `"unavailable"` or empty:**
        > - Note in the review output: "Structural deep audit unavailable — Memtrace not indexed or queries failed. Proceeding with text-based review only."
        > - DO NOT raise any structural-audit-specific findings (no blast radius or dead code flags).
        >
        > **If `{memtrace_blast_radius}` or `{memtrace_dead_code}` is `"partial"`:**
        > - Apply the blast radius rules ONLY if `{memtrace_blast_radius}` has complete data; apply dead code rules ONLY if `{memtrace_dead_code}` has complete data.
        > - Note which symbols were not verified due to query failures.
        >
        > Output findings as a Markdown list. Each finding: one-line title, which quality gate rule it violates, and evidence from the diff/story file.

3. **Subagent failure handling**: If any subagent fails, times out, or returns empty results, append the layer name to `{failed_layers}` (comma-separated) and proceed with findings from the remaining layers.

4. Collect all findings from the completed layers.


## NEXT

Read fully and follow `./step-03-triage.md`
