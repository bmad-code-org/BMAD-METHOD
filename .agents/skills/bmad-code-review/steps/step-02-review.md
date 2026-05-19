---
failed_layers: '' # set at runtime: comma-separated list of layers that failed or returned empty
---

# Step 2: Review

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
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
        > Output findings as a Markdown list. Each finding: one-line title, which quality gate rule it violates, and evidence from the diff/story file.

3. **Subagent failure handling**: If any subagent fails, times out, or returns empty results, append the layer name to `{failed_layers}` (comma-separated) and proceed with findings from the remaining layers.

4. Collect all findings from the completed layers.


## NEXT

Read fully and follow `./step-03-triage.md`
