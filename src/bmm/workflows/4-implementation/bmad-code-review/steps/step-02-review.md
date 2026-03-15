---
name: Review
description: 'Launch parallel adversarial review layers and collect findings.'
---

# Step 2: Review

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- The Blind Hunter subagent receives NO project context — diff only.
- The Edge Case Hunter subagent receives diff and project read access.
- The Acceptance Auditor subagent receives diff, spec, and context docs.

## INSTRUCTIONS

1. Launch parallel subagents. Each subagent gets NO conversation history from this session:

   - **Blind Hunter** -- Invoke the `bmad-review-adversarial-general` skill in a subagent. Pass `content` = `{diff_output}` only. No spec, no project access.

   - **Edge Case Hunter** -- Invoke the `bmad-review-edge-case-hunter` skill in a subagent. Pass `content` = `{diff_output}`. This subagent has read access to the project.

   - **Acceptance Auditor** (only if `{review_mode}` = `"full"`) -- A subagent that receives `{diff_output}`, the content of the file at `{spec_file}`, and any loaded context docs. Its prompt:
     > You are an Acceptance Auditor. Review this diff against the spec and context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code. Output findings as a markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

2. **Subagent failure handling**: If any subagent fails, times out, or returns empty results, note the failed layer and proceed with findings from the remaining layers. Report the failure to the user in the next step.

3. **Fallback** (if subagents are not available): Generate prompt files in `{implementation_artifacts}` -- one per active reviewer:
   - `review-blind-hunter.md` (always)
   - `review-edge-case-hunter.md` (always)
   - `review-acceptance-auditor.md` (only if `{review_mode}` = `"full"`)

   HALT. Tell the user to run each prompt in a separate session and paste back findings. When findings are pasted, resume from this point and proceed to step 3.

4. Collect all findings from the completed layers.


## NEXT

Read fully and follow `./step-03-triage.md`
