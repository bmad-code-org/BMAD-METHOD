---
failed_layers: '' # set at runtime: comma-separated list of layers that failed or returned empty
---

# Step 2: Review

## RULES

- All review subagents must run at the same model capability as the current session.
- Run subagents synchronously: launch them together as blocking calls awaited in this turn — never backgrounded or detached, never ending the turn to await results.

## INSTRUCTIONS

1. The review layers are listed below. For each layer:
   - `Run only when` present and not satisfied by the current context (`{review_mode}`, `{spec_file}`) → skip the layer and tell the user, e.g. "Acceptance Auditor skipped — no spec file provided."
   - otherwise → the layer is active.

2. Announce skipped layers first, then launch every active layer before handling any layer's result. Try running all active layers simultaneously: substitute the runtime placeholders (`{diff_file}`, `{claims_file}`, `{spec_file}`) into each layer's instruction. `{diff_file}` is a path: substitute the absolute path and let the layer read the file — a launch prompt never carries diff text, and the child's working directory is not yours. When an instruction launches a reviewer subagent, launch that child with the prompt text after placeholder substitution; do not load the reviewer instruction file yourself. For any other customized instruction, execute it as written. When running layers as subagents, spawn every reviewer before reading or reacting to any of their output; begin collection only once all are launched.

{{ workflow.review_layers }}

3. If a layer's instruction requires subagents and none are available, for each such layer write under `{{ config.implementation_artifacts }}` that layer's child prompt with every file it points to — the diff, the claims, the reviewer instruction file — replaced inline by that file's contents, and every other line left exactly as written. That session shares no filesystem with this one, so its prompt has to stand alone; this is the only place you read a reviewer instruction file yourself. Then HALT. Ask the user to run each in a separate session (ideally a different LLM) and paste back the findings. When findings are pasted, treat them as those layers' findings and resume from this point.

4. **Layer failure handling**: If any layer fails, times out, or returns empty results, append the layer's `name` to `failed_layers` (comma-separated) and proceed with findings from the remaining layers.

5. Collect all findings from the completed layers, keeping track of each finding's originating layer `id`.

## NEXT

Read fully and follow `{{ rendered("step-03-triage.md") }}`
