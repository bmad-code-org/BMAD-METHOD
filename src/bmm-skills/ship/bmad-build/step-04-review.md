# Step 4: Review

## RULES

- **Language** — Speak in `{{.communication_language}}`. Write any file output in `{{.document_output_language}}`.
- All review subagents must run at the same model capability as the current session.
- Run subagents synchronously: launch them together, then wait for all results before continuing.

## INSTRUCTIONS

Change `{spec_file}` status to `in-review` in the frontmatter before continuing.

### Construct Diff

When `manifest_story_mode` is true, read `{baseline_revision}` from `{spec_file}` frontmatter; otherwise read `{baseline_commit}`. If the selected field is missing or `NO_VCS`, use best effort to determine what changed. Otherwise, construct `{diff_output}` covering all changes — tracked and untracked — since the selected revision.

Do NOT `git add` anything — this is read-only inspection.

### Review

Execute these review layers in parallel wherever their execution methods allow: substitute the runtime placeholders (e.g. `{diff_output}`) into each layer's instruction. When an instruction launches a reviewer subagent, launch that child with the prompt text after placeholder substitution; do not load the reviewer instruction file yourself. For any other customized instruction, execute it as written. Parallel means several blocking calls awaited together in this turn — never backgrounded or detached, never ending the turn to await results. When running layers as subagents, spawn every reviewer before reading or reacting to any of their output; begin collection and triage only once all are launched.

{workflow.review_layers}

If a layer's instruction requires subagents and none are available, for each such layer read its reviewer instruction file, write a self-contained prompt under `{{.implementation_artifacts}}` (full instruction body + `## REVIEW TARGET` with the review content — not a path-only pointer), then HALT. Ask the human to run each in a separate session (ideally a different LLM) and paste back the findings. This is the only allowed parent-side read of a reviewer instruction file.

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
   - **intent_gap** — Root cause is inside the selected immutable intent boundary: `<intent-contract>` in manifest-story mode or `<frozen-after-approval>` in standalone mode. Revert code changes. Loop back to the human to resolve. Once resolved, set `{spec_file}` status to `draft` before reading and fully following `./step-02-plan.md`; the draft-resume check must preserve the human-edited selected intent boundary while re-running steps 2–4.
   - **bad_spec** — Root cause is outside the selected immutable intent boundary. Before reverting code: extract KEEP instructions for positive preservation (what worked well and must survive re-derivation). Revert code changes. Read the `## Spec Change Log` in `{spec_file}` and strictly respect all logged constraints when amending the non-frozen sections that contain the root cause. Append a new change-log entry recording: the triggering finding, what was amended, the known-bad state avoided, and the KEEP instructions. Read fully and follow `./step-03-implement.md` to re-derive the code, then this step will run again.
   - **patch** — Auto-fix. These are the only findings that survive loopbacks. If the step-03 implementation subagent can be re-engaged with its context intact, send it all patch findings in one synchronous message — for each: the file, what is wrong, and what the fix must do. If it cannot be re-engaged, apply the patches yourself. Then re-run the checks in `{spec_file}`'s `## Verification` section, if present; if verification fails and the failure cannot be fixed, HALT and escalate to the human.
   - **defer** — In standalone mode, append one new entry to `{{.deferred_work_file}}` using the format below. Do not modify existing entries or look for duplicates.
     ```markdown
     - source_spec: `{spec_file}`
       summary: <one sentence>
       evidence: <why this is real>
     ```
     In manifest-story mode, preserve Build Auto interoperability instead: update the single `deferred` list in `{spec_file}` frontmatter. Initialize an absent field once, preserve all existing items, never add a second `deferred:` key, and append each finding with `summary`, `evidence`, and optional `location` and `severity`. Serialize free-form values as YAML block scalars, then parse the complete frontmatter as YAML and verify `deferred` is one list containing every prior and new item with its intended text.
   - **reject** — Drop silently.

### Manifest-story review record

When `manifest_story_mode` is true, append an entry to `## Review Triage Log` on every review pass before that pass completes, loops back, or halts. Record the current date; counts for `intent_gap`, `bad_spec`, `patch`, `defer`, and `reject` with high/medium/low breakdowns where nonzero; and each addressed `patch` or `bad_spec` finding with severity and action. Record `addressed_findings: none` when neither category was addressed. Keep the log append-only.

For a manifest story that is proceeding to step 5, set frontmatter `followup_review_recommended` using Build Auto's patched-finding formula for this pass only: `true` if any patched finding was high severity, or if `3 × medium patches + low patches` is at least 5; otherwise `false`. Deferred and rejected findings never contribute.

## NEXT

Read fully and follow `./step-05-present.md`
