# Step 4: Review

## RULES

- **Language** — Speak in `{{.communication_language}}`, tailored to `{{.user_skill_level}}`. Write files in `{{.document_output_language}}`.
- No human interaction: do not ask questions or wait for approval in this step.
- All review subagents must run at the same model capability as the current session.

## INSTRUCTIONS

Change `{spec_file}` status to `in-review` in the frontmatter before continuing.

### Stage the Diff

Read `{baseline_revision}` from `{spec_file}` frontmatter. If `{baseline_revision}` is missing or `NO_VCS`, use best effort to determine what changed. Otherwise use the repository's version-control tooling to rewrite `{diff_file}` — the temp file staged in step-03, or a uniquely-named file in the system temp directory when this run has none — with a unified diff of all changes since `{baseline_revision}`, untracked files included. The review layers read that file; the diff text is never pasted into their prompts.

Set `{claims_file}` = `{spec_file}`. The spec is the change's own account of itself, and it goes to the edge-case layer alone — as a path, so that layer reads it only after its own tracing and the other layers never see it at all.

Writing `{diff_file}` is the only change this section makes. Do NOT `git add` anything.

### Review

Runtime placeholders: `{diff_file}` is the diff staged above and `{claims_file}` the narrative staged with it — both paths, substituted absolute so a layer can read them; a launch prompt never carries diff text. `{verbatim_intent}` is the invocation intent exactly as this run received it at step-01; if the run started from an existing spec file rather than a fresh intent, it is the spec's `<intent-contract>` block instead. Before launching a layer, expand its skill-root placeholder to this skill's absolute installed directory; never leave that placeholder unresolved in a child prompt.

Announce skipped layers first, then launch every active layer before handling any layer's result. Try running all active layers simultaneously: substitute the runtime placeholders (e.g. `{diff_file}`) into each layer's instruction. When an instruction launches a reviewer subagent, launch that child with the prompt text after placeholder substitution; do not load the reviewer instruction file yourself. For any other customized instruction, execute it as written. Parallel means several blocking calls awaited together in this turn — never backgrounded or detached, never ending the turn to await results (see workflow.md → Subagents). Spawn every reviewer subagent before reading or reacting to any of their output; begin collection and triage only once all are launched.

{workflow.review_layers}

### Classify

1. Once every layer has reported — and not before — render a verdict on each finding on its own, ahead of any deduplication or grouping. For each finding:
   - **Verify its own claimed consequence** at the location it names. Read past the diff hunk — into the callers, the guards upstream, whatever else the site depends on — far enough to tell whether that consequence actually occurs. Another finding's outcome, however adjacent, never settles this one.
   - **Assign severity** from the verified consequence for the artifact's main consumer (software user, document reader, etc). Disregard any severity assigned by a reviewing subagent. Review subagents operate under by-design information asymmetry and do not have enough context to set final severity for this workflow.
     - `low`: none or cosmetic
     - `medium`: tolerable
     - `high`: intolerable
   - **Keep or dismiss.** Keep a finding only where verification confirmed its consequence. Dismiss noise, claims the verification refuted, and claims it could not substantiate — no path to the claimed consequence at the named site is a valid disposal. Whatever the reason, it must dispose of the finding's own claim: a true fact about neighboring code that leaves the claim standing is not a dismissal, and the finding stays kept. Record each dismissal with its reason in the triage log below; never drop a finding silently.
   - Scope authority: a finding may be dismissed or later deferred *as out of scope* only on the authority of the intent itself. The spec's scope language, the plan, and the diff's own shape are not admissible scope authorities — if only they exclude a finding, treat it as evidence against the chosen reading (intent_gap or bad_spec), not as out of scope.
   - A finding whose fix edits the spec this build is implementing: dismiss. A finding whose fix edits an agent-context document (e.g. CLAUDE.md, AGENTS.md, rules files, other specs): defer, never patch.
2. Group the survivors by shared root cause — two findings belong in one entry only when the same underlying defect produced both. Same location alone is not a shared root cause, and neither is a shared fix. An entry carries every member's verified consequence and the highest severity among them.
3. Route each entry into exactly one triage category. The first three are **this story's problem** — caused or exposed by the current change. The last is **not this story's problem**.
   - **intent_gap** — caused by the change; cannot be resolved from the spec because the captured intent is incomplete. Do not infer intent unless there is exactly one possible reading.
   - **bad_spec** — caused by the change, including direct deviations from spec. The spec should have been clear enough to prevent it. When in doubt between bad_spec and patch, prefer bad_spec — a spec-level fix is more likely to produce coherent code.
   - **patch** — caused by the change; trivially fixable without human input. Just part of the diff.
   - **defer** — pre-existing issue not caused by this story, surfaced incidentally by the review. Collect for later focused attention.
4. Append a new entry to the `## Review Triage Log` section in `{spec_file}`, in this format:
   ```markdown
   ### {date} — Review pass
   - intent_gap: count
   - bad_spec: count
   - patch: count
   - defer: count
   - dismissed:
     - <finding summary> — <the reason, which must dispose of that finding's own claim>
   - addressed_findings:
     - `[high|medium|low]` `[patch|bad_spec]` <finding summary and action taken in this pass>
   ```
   Where `{date}` is the current system date and `count` is either just `0`, or total with breakdown by severity `N: (high Nhigh, medium Nmedium, low Nlow)`. Give `dismissed` one line per dismissal, or the single line `- none` when nothing was dismissed.
   If no patch was fixed and no bad_spec repair loopback was triggered in this pass, write:
   ```markdown
   - addressed_findings:
     - none
   ```
5. Process findings in cascading order. If intent_gap exists, lower findings are moot; follow the intent_gap branch below. If bad_spec exists, lower findings are moot since code will be re-derived. If neither exists, process patch and defer normally. Before each bad_spec loopback, read `{spec_file}` frontmatter `review_loop_iteration` (missing means `0`), increment it by 1, and write it back. If it exceeds 5, append the triage-log entry for this pass with `addressed_findings: none`, then HALT with status `blocked` and blocking condition `review repair loop exceeded 5 iterations (non-convergence)`.
   - **intent_gap** — Root cause is inside `<intent-contract>`. Save the attempted change as a patch file in `{{.implementation_artifacts}}` and reference it from the triage-log entry, then revert code changes. Append the triage-log entry for this pass with `addressed_findings: none`, then HALT with status `blocked`, blocking condition `intent gap`, and include the unresolved questions and the saved patch path.
   - **bad_spec** — Root cause is outside `<intent-contract>`. Do not modify content inside `<intent-contract>`. Before reverting code: extract KEEP instructions for positive preservation (what worked well and must survive re-derivation). Revert code changes. Read the `## Spec Change Log` in `{spec_file}` and strictly respect all logged constraints when amending the sections outside `<intent-contract>` that contain the root cause. Append a new change-log entry recording: the triggering finding, what was amended, the known-bad state avoided, and the KEEP instructions. Append the triage-log entry for this pass, listing every bad_spec finding that triggered the spec amendment and implementation loopback under `addressed_findings`. Read fully and follow `[[bmad-snapshot:step-03-implement.md]]` to re-derive the code, then this step will run again.
   - **patch** — Auto-fix. These are the only findings that survive loopbacks. If the step-03 implementation subagent can be re-engaged with its context intact, send it all patch findings in one synchronous message — for each: the file, what is wrong, and what the fix must do. If it cannot be re-engaged, apply the patches yourself. Then re-run the commands in `{spec_file}`'s `## Verification` section (or perform its manual checks); if verification fails and the failure cannot be fixed, HALT with status `blocked` and blocking condition `patch verification failed`. Append the triage-log entry for this pass, listing every patch fixed in this pass under `addressed_findings`.
   - **defer** — Update the single `deferred` list in `{spec_file}` frontmatter. If the field is absent (including on specs created before this field existed), add it once as an empty list. If it is `deferred: []`, replace that empty value when adding the first item; otherwise append to the existing list. Preserve every existing item, do not look for duplicates, and never add a second `deferred:` key. Serialize free-form values as YAML block scalars so characters such as `:`, `#`, quotes, and line breaks remain data. Each item uses this shape:
     ```yaml
     deferred:
       - summary: >-
           <one sentence>
         evidence: |-
           <why this is real>
         location: >- # optional — file:line or component
           src/foo.py:42
         severity: medium # optional — high | medium | low
     ```
     After all appends, parse the complete frontmatter as YAML and verify that `deferred` is one list containing every prior item plus the new items with their intended text. Repair serialization errors before continuing.

## Finalize

Write the following details to `{spec_file}` under `## Auto Run Result`:
- Summary of implemented change
- Files changed with one-line descriptions
- Review findings breakdown: patches applied, items deferred, and every dismissed finding with its reason
- Follow-up review recommendation: count only this pass's entries triaged `patch`, at entry severity — never deferred or dismissed ones. `true` if any patched entry was `high` severity, or if `3 × medium count + 1 × low count` is 5 or more; otherwise `false`. Record the patched counts by severity and the score.
- Verification performed, including command outcomes or manual inspection notes
- Any residual risks

Set `{spec_file}` frontmatter `followup_review_recommended` from the computation above.

If version control is unavailable, set `{spec_file}` frontmatter `status: done`, then proceed to HALT.

If version control is available, write `status: done` into `{spec_file}` frontmatter, then:

1. Commit any reviewed-diff files that remain uncommitted, including `{spec_file}` when it is tracked in that working copy. Keep commits already created during this run. Verify every reviewed-diff file appears in the change set after `{baseline_revision}` and none remains uncommitted. Do not push.
2. Verify the version-controlled working copy is clean. Otherwise HALT with status `blocked` and blocking condition `finalization left repository dirty`.

HALT with status `done`.
