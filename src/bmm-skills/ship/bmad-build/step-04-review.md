# Step 4: Review

## RULES

- **Language** — Speak in `{{.communication_language}}`. Write any file output in `{{.document_output_language}}`.
- All review subagents must run at the same model capability as the current session.
- Run subagents synchronously: launch them together, then wait for all results before continuing.

## INSTRUCTIONS

Change `{spec_file}` status to `in-review` in the frontmatter before continuing.

### Stage the Diff

Read `{baseline_commit}` from `{spec_file}` frontmatter. If `{baseline_commit}` is missing or `NO_VCS`, use best effort to determine what changed. Otherwise use the repository's version-control tooling to rewrite `{diff_file}` — the temp file staged in step-03, or a uniquely-named file in the system temp directory when this run has none — with a unified diff of all changes since `{baseline_commit}`, untracked files included. The review layers read that file; the diff text is never pasted into their prompts.

Set `{claims_file}` = `{spec_file}`. The spec is the change's own account of itself, and it goes to the edge-case layer alone — as a path, so that layer reads it only after its own tracing and the other layers never see it at all.

Writing `{diff_file}` is the only change this section makes. Do NOT `git add` anything.

### Review

Announce skipped layers first, then launch every active layer before handling any layer's result. Try running all active layers simultaneously: substitute the runtime placeholders (`{diff_file}`, `{claims_file}`) into each layer's instruction. `{diff_file}` is a path: substitute the absolute path and let the layer read the file — a launch prompt never carries diff text. When an instruction launches a reviewer subagent, launch that child with the prompt text after placeholder substitution; do not load the reviewer instruction file yourself. For any other customized instruction, execute it as written. Parallel means several blocking calls awaited together in this turn — never backgrounded or detached, never ending the turn to await results. When running layers as subagents, spawn every reviewer before reading or reacting to any of their output; begin collection and triage only once all are launched.

{workflow.review_layers}

If a layer's instruction requires subagents and none are available, for each such layer write under `{{.implementation_artifacts}}` that layer's child prompt with every file it points to — the diff, the claims, the reviewer instruction file — replaced inline by that file's contents, and every other line left exactly as written. That session shares no filesystem with this one, so its prompt has to stand alone; this is the only place you read a reviewer instruction file yourself. Then HALT. Ask the human to run each in a separate session (ideally a different LLM) and paste back the findings.

### Classify

1. Deduplicate only findings with the same claim and same required action. Then evaluate each remaining finding independently. Do not reject a finding because a related finding was rejected.
2. Assign severity to each finding by consequence for the artifact's main consumer (software user, document reader, etc).
   Disregard any severity assigned by a reviewing subagent. Review subagents operate under by-design information asymmetry and do not have enough context to set final severity for this workflow.
   - `low`: none or cosmetic
   - `medium`: tolerable
   - `high`: intolerable
3. Route each finding into exactly one triage category. The first three categories are **this story's problem** — caused or exposed by the current change. The last two are **not this story's problem**.
   - **intent_gap** — caused by the change; cannot be resolved from the spec because the captured intent is incomplete. Do not infer intent unless there is exactly one possible reading.
   - **bad_spec** — caused by the change, including direct deviations from spec. The spec should have been clear enough to prevent it. When in doubt between bad_spec and patch, prefer bad_spec — a spec-level fix is more likely to produce coherent code.
   - **patch** — caused by the change; trivially fixable without human input. Just part of the diff.
   - **defer** — pre-existing issue not caused by this story, surfaced incidentally by the review. Collect for later focused attention.
   - **reject** — noise. Drop silently. When unsure between defer and reject, prefer reject — only defer findings you are confident are real.
4. Process findings in cascading order. If intent_gap or bad_spec findings exist, they trigger a loopback — lower findings are moot since code will be re-derived. If neither exists, process patch and defer normally. Before each loopback, read `{spec_file}` frontmatter `review_loop_iteration` (missing means `0`), increment it by 1, and write it back. If it exceeds 5, HALT and escalate to the human.
   - **intent_gap** — Root cause is inside `<frozen-after-approval>`. Revert code changes. Loop back to the human to resolve. Once resolved, read fully and follow `[[bmad-snapshot:step-02-plan.md]]` to re-run steps 2–4.
   - **bad_spec** — Root cause is outside `<frozen-after-approval>`. Before reverting code: extract KEEP instructions for positive preservation (what worked well and must survive re-derivation). Revert code changes. Read the `## Spec Change Log` in `{spec_file}` and strictly respect all logged constraints when amending the non-frozen sections that contain the root cause. Append a new change-log entry recording: the triggering finding, what was amended, the known-bad state avoided, and the KEEP instructions. Read fully and follow `[[bmad-snapshot:step-03-implement.md]]` to re-derive the code, then this step will run again.
   - **patch** — Auto-fix. These are the only findings that survive loopbacks. If the step-03 implementation subagent can be re-engaged with its context intact, send it all patch findings in one synchronous message — for each: the file, what is wrong, and what the fix must do. If it cannot be re-engaged, apply the patches yourself. Then re-run the checks in `{spec_file}`'s `## Verification` section, if present; if verification fails and the failure cannot be fixed, HALT and escalate to the human.
   - **defer** — Append one new entry to `{{.implementation_artifacts}}/deferred-work.md` using this format. Do not modify existing entries or look for duplicates.
     ```markdown
     - source_spec: `{spec_file}`
       summary: <one sentence>
       evidence: <why this is real>
     ```
   - **reject** — Drop silently.

## NEXT

Read fully and follow `[[bmad-snapshot:step-05-present.md]]`
