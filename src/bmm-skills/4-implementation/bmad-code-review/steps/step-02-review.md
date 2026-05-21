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
      >
      > Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

3. **Subagent failure handling**: If any subagent fails, times out, or returns empty results, append the layer name to `{failed_layers}` (comma-separated) and proceed with findings from the remaining layers.

4. Collect all findings from the completed layers.


## NEXT

Read fully and follow `./step-03-triage.md`
