---
failed_layers: '' # set at runtime: comma-separated list of lenses that failed or returned empty
---

# Step 2: Review

## RULES

- All review subagents must run at the same model capability as the current session.
- Launch subagents so you can keep working while they run. Do not stop and hand control back to the user while one is still running, and do not move to the next step until every launched subagent has finished and you have read its result.

## INSTRUCTIONS

1. The review lenses are listed below. For each lens:
   - `Run only when` present and not satisfied by the current context (`{review_mode}`, `{plan_file}`, `{verbatim_intent}`) → skip the lens and tell the user which lens was skipped and why.
   - otherwise → the lens is active.

2. Announce skipped lenses first. Substitute the runtime placeholders (`{diff_file}`, `{claims_file}`, `{plan_file}`, `{verbatim_intent}`) into each active lens's instruction. `{diff_file}`, `{claims_file}`, and `{plan_file}` are paths: substitute the absolute path and let the lens read the file — a launch prompt never carries diff text, and the child's working directory is not yours. `{verbatim_intent}` is the intent section of `{plan_file}` if it has one, else the user's or conversation's own words on what the change is for, substituted inline as text; a request to review something is not an intent.

3. Launch every active lens but the first, all together, before reading anything they return. When an instruction launches a reviewer subagent, launch that child with the substituted prompt text; do not load its instruction file yourself. For any other customized instruction, execute it as written.

4. The first active lens below is yours: run it in this session while the others work. Where its instruction launches a subagent, skip the launch and follow the prompt text as your own instructions, reading any instruction file it names. State its findings in full before reading any other lens's output. The reading this forces is what triage needs later.

{% if workflow.review == "quick" %}
{{ workflow.quick_lenses }}
{% else %}
{{ workflow.thorough_lenses }}
{% endif %}

5. If a lens's instruction requires subagents and none are available, for each such lens write that lens's child prompt beside `{plan_file}`, named after it with the lens id appended (in `{{ initiative_folder }}/` when there is no plan), with every file it points to — the diff, the claims, the reviewer instruction file — replaced inline by that file's contents, and every other line left exactly as written. That session shares no filesystem with this one, so its prompt has to stand alone; apart from your own lens, this is the only place you read a reviewer instruction file yourself. Then HALT. Ask the user to run each in a separate session (ideally a different LLM) and paste back the findings. When findings are pasted, treat them as those lenses' findings and resume from this point.

6. **Lens failure handling**: If any lens fails, times out, or returns empty results, append the lens's `name` to `failed_layers` (comma-separated) and proceed with findings from the remaining lenses.

7. Roll call: name every lens you launched, and for each one wait for and read its result before going on. Then collect all findings from the completed lenses, keeping track of each finding's originating lens `id`.

## NEXT

Read fully and follow `{{ rendered("step-03-triage.md") }}`
