---
failed_layers: '' # set at runtime: comma-separated list of layers that failed or returned empty
---

# Step 2: Review

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- All review subagents must run at the same model capability as the current session.

## INSTRUCTIONS

1. If `{review_mode}` = `"no-spec"`, note to the user: "Acceptance Auditor skipped — no spec file provided."

2. Launch Blind Hunter and Edge Case Hunter in parallel without prior conversation context. If `{review_mode}` = `"full"`, include the Acceptance Auditor in the same parallel launch. If subagents are not available, generate prompt files in `{implementation_artifacts}` for each applicable reviewer role and HALT. Ask the user to run each in a separate session (ideally a different LLM) and paste back the findings. When findings are pasted, resume from this point and proceed to step 3.

   - **Blind Hunter** — prompt:
     > Invoke the `bmad-review-adversarial-general` skill on this diff:
     >
     > {diff_output}

   - **Edge Case Hunter** — prompt:
     > Invoke the `bmad-review-edge-case-hunter` skill on this diff:
     >
     > {diff_output}

   - **Acceptance Auditor** (only if `{review_mode}` = `"full"`) — prompt:
     > You are an Acceptance Auditor. Review the provided diff against `{spec_file}` and any loaded context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code. Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.
     >
     > Diff:
     > {diff_output}

3. **Subagent failure handling**: If any subagent fails, times out, or returns empty results, append the layer name to `{failed_layers}` (comma-separated) and proceed with findings from the remaining layers.

4. Collect all findings from the completed layers.


## NEXT

Read fully and follow `./step-03-triage.md`
