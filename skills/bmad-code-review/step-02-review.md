---
failed_layers: '' # set at runtime: comma-separated list of lenses that failed or returned empty
---

# Step 2: Review

## RULES

- All review subagents must run at the same model capability as the current session.
- Run subagents synchronously: launch them together as blocking calls awaited in this turn — never backgrounded or detached, never ending the turn to await results.

## INSTRUCTIONS

1. The review lenses are listed below. For each lens:
   - `Run only when` present and not satisfied by the current context (`{review_mode}`, `{spec_file}`) → skip the lens and tell the user which lens was skipped and why.
   - otherwise → the lens is active.

2. Announce skipped lenses first, then launch every active lens before handling any lens's result. Try running all active lenses simultaneously: substitute the runtime placeholders (`{diff_file}`, `{claims_file}`, `{spec_file}`, `{verbatim_intent}`) into each lens's instruction. `{diff_file}`, `{claims_file}`, and `{spec_file}` are paths: substitute the absolute path and let the lens read the file — a launch prompt never carries diff text, and the child's working directory is not yours. `{verbatim_intent}` is the original intent text as the invocation or conversation supplied it, else the intent section of `{spec_file}`, substituted inline as text. When an instruction launches a reviewer subagent, launch that child with the prompt text after placeholder substitution; do not load the reviewer instruction file yourself. For any other customized instruction, execute it as written. When running lenses as subagents, spawn every reviewer before reading or reacting to any of their output; begin collection only once all are launched.

{% if workflow.review == "quick" %}
{{ workflow.quick_lenses }}
{% else %}
{{ workflow.thorough_lenses }}
{% endif %}

3. If a lens's instruction requires subagents and none are available, for each such lens write under `{{ config.implementation_artifacts }}` that lens's child prompt with every file it points to — the diff, the claims, the reviewer instruction file — replaced inline by that file's contents, and every other line left exactly as written. That session shares no filesystem with this one, so its prompt has to stand alone; this is the only place you read a reviewer instruction file yourself. Then HALT. Ask the user to run each in a separate session (ideally a different LLM) and paste back the findings. When findings are pasted, treat them as those lenses' findings and resume from this point.

4. **Lens failure handling**: If any lens fails, times out, or returns empty results, append the lens's `name` to `failed_layers` (comma-separated) and proceed with findings from the remaining lenses.

5. Collect all findings from the completed lenses, keeping track of each finding's originating lens `id`.

## NEXT

Read fully and follow `{{ rendered("step-03-triage.md") }}`
