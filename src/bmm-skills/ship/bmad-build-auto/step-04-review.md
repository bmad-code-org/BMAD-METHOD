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

1. Once every layer has reported — and not before — render a verdict on each finding, ahead of any deduplication or grouping. Disregard any severity a reviewing subagent assigned — they lack the context to grade.

   If `## Review Triage Log` already has rows — a loopback, a resumed review, or a follow-up pass on a `done` spec — compare each finding against them first. A finding with the same location and the same claim as a logged row keeps that row's verdict and route when the code at the cited location still reads as the row describes: write its row again with `carried` in front of the evidence, skip verification, and never patch or defer it again. Verify everything else as below.

   For each finding:
   - **Verify the finding's claim.** At the cited file and line, does the bad outcome the reviewer describes actually occur? Read beyond the changed lines — follow callers, guards upstream, etc — until you can answer yes or no. A different finding about nearby code does not settle this one. Judge whether the problem is real, not whether the proposed fix is plausible. Code that loudly fails on a situation you never showed the program can reach is correct behavior, not a defect. Start from the evidence the finding cites — the test it read, the search it ran, the guard it names — and check that first; trace from scratch only when it cites nothing. When several findings name the same site and the same bad outcome, one verification settles them all; each still gets its own row, citing the shared evidence.
   - **Render exactly one verdict** from what verification established — the verdict is the whole triage decision; there is no separate keep-or-dismiss.
     - `high` (intolerable), `medium` (tolerable), `low` (cosmetic or negligible) — the bad outcome is real. Assign severity by how much it hurts end users or developers. For developer-only problems (inconsistent design, eroded invariants, duplicated sources of truth), name where it will cause trouble — which caller will diverge, which rule will break. A vague "this is messy" with no named harm is not a severity grade; use `false` or `maybe-false` instead. When the harm is real but you cannot tell how bad, pick the higher grade.
     - `false` — you checked, and the bad outcome does not happen at the cited location. Write what disproves this specific claim. A true fact about nearby code that does not disprove the claim does not count. A finding that names no bad outcome, or no input or state that reaches one — a "consider", a "could", a tidy-up — makes no claim to verify: `false`, with "no demonstrated outcome" as the refutation. Do not build the claim on the reviewer's behalf.
     - `maybe-false` — you could not tell whether the bad outcome happens. Write what you would need to check to find out. Use this only when the diff and surrounding code leave the question open; when they are enough to decide, pick `high`, `medium`, `low`, or `false`.

   - Every finding gets one row in the triage log below — verdict plus its evidence in a sentence or two; never drop, merge, or silently skip one.

   Reject `false` findings on their refutation.

   Reject `low` findings when it is unlikely that users or developers would meet the defect in everyday use (judged plainly — no proof needed) and the fix is more than a direct correction or deletion — adding guards, branches, parameters, or other complexity.

   Out of scope: reject or defer a finding as out of scope only when the intent itself excludes it — not because the spec's scope lines (its Never list, a Code Map do-not-change), the plan, or the shape of the diff says so. If only those would exclude it, keep the finding — the spec or plan drew a line the intent did not — and route it on its merits below: a local fix is a patch, applied with the crossed line named in its triage row and under residual risks in `## Auto Run Result`; anything larger is intent_gap or bad_spec. It is never a defer on that ground.

   Reject any finding whose fix is to edit this build's spec.

   All remaining findings continue to grouping.

2. Group the survivors by shared root cause — two findings belong in one entry only when the same defect produced both. Same location alone is not a shared root cause, and neither is a shared fix. An entry carries every member's verified bad outcome and the highest verdict among them (`high` > `medium` > `low` > `maybe-false`).
3. Route each entry into exactly one triage category. A group that includes verified `high`, `medium`, or `low` members routes by its highest such verdict — not to defer just because a member is `maybe-false`. Reject an entry whose members are all `maybe-false`: each row records what would settle it, and it goes to no ledger. Two kinds of spec line matter below. A design decision says how the work is done — the Approach, a Design Notes rationale, a forbidden approach. A scope line says where the work stops — a Never non-goal, a Code Map do-not-change. The first three categories are **this story's problem** — caused or exposed by the current change — and most of them are patches. A pre-existing defect in code this change edited is this story's problem. So is a gap in the change's own verification: a test this change added that would still pass with the change reverted or under the wrong behavior it exists to catch, or a site this change touched that does not use the helper this change introduced — patch, never defer as coverage-only. The last category is **not this story's problem**, and an entry has to pass every test in its definition to get there.
   - **intent_gap** — caused by the change; cannot be resolved from the spec because the captured intent is incomplete, or its fix would contradict a design decision inside `<intent-contract>`. Do not infer intent unless there is exactly one possible reading.
   - **bad_spec** — caused by the change, and produced by the spec's design outside `<intent-contract>`: a local fix would contradict a design decision the Code Map, Design Notes, or a task records, or the same defect recurs wherever that design is applied, so amending the spec is the fix. A deviation from a spec that is itself right is not bad_spec — restoring what the spec says is a patch. When in doubt between bad_spec and patch, prefer patch: name the spec sentence a local fix would contradict; if you cannot, it is a patch.
   - **patch** — caused or exposed by the change, and its smallest fix is local: it stays inside the change's blast radius — the files in the diff, their tests, the code a test in the diff exercises, direct callers of symbols the diff introduced or changed, and sibling sites of a pattern the diff fixed or replaced when the fix is the one already in the diff — contradicts no design decision the spec records, adds no external contract (no new exported API, CLI flag, config key, wire or file format; a new record of a kind the format already carries is not one, a new field or file is), and guards no state you did not demonstrate. Size is not the criterion: a private helper, a new test, or a fifteen-line fix is still a patch. Patch also takes a defect this change did not cause when its fix is a direct correction smaller than the deferred entry would be — writing it up costs more than fixing it; name the file in its triage row, since the fix may reach outside the diff. A fix that fails a condition routes to intent_gap when the spec does not settle it, otherwise to bad_spec.
   - **defer** — only when all of these hold: the defect was neither caused nor exposed by this change; it lives in a file and symbol this change did not touch, and it is not a sibling copy of a pattern this change fixed; its fix is larger than the deferred entry would be; and it is not an agent-context file this change made stale. Name the tests it passes in its triage row. Agent-context files (e.g. CLAUDE.md, AGENTS.md, rules files) split two ways: a description of behavior this change altered is stale documentation inside the blast radius — patch; a new or changed rule, or an edit to another spec, is a policy change no unattended run makes — defer, with the rule it would change as the evidence.

4. Append a new entry to the `## Review Triage Log` section in `{spec_file}`, in this format:
   ```markdown
   ### {date} — Review pass
   - verdicts: <total> findings — high <N>, medium <N>, low <N>, false <N>, maybe-false <N>
   - findings:
     - `[verdict]` `[intent_gap|bad_spec|patch|defer|reject]` <finding summary> — <evidence: the refutation for false, what would settle it for maybe-false, the action taken for patches, why a rejected low was not worth fixing>
   ```
   Where `{date}` is the current system date. One row per finding from every layer, in the order the layers reported them; `<total>` must equal the number of findings the layers reported — a finding missing from the log is a triage failure. Members of a grouped entry keep their own rows and share the route. Append to the `## Review Triage Log` section the spec already has — never create a second; if two exist, merge them into the earlier heading first, preserving every row.
5. Process entries in cascading order. If intent_gap exists, lower entries are moot; follow the intent_gap branch below. If bad_spec exists, lower entries are moot since code will be re-derived. If neither exists, process patch and defer normally. Before each bad_spec loopback, read `{spec_file}` frontmatter `review_loop_iteration` (missing means `0`), increment it by 1, and write it back. If it exceeds 5, append the triage-log entry for this pass, then HALT with status `blocked` and blocking condition `review repair loop exceeded 5 iterations (non-convergence)`.
   - **intent_gap** — Root cause is inside `<intent-contract>`. Save the attempted change as a patch file in `{{.implementation_artifacts}}` and reference it from the triage-log entry, then revert code changes. Append the triage-log entry for this pass, then HALT with status `blocked`, blocking condition `intent gap`, and include the unresolved questions and the saved patch path.
   - **bad_spec** — Root cause is outside `<intent-contract>`. Do not modify content inside `<intent-contract>`. Before reverting code: extract KEEP instructions for positive preservation (what worked well and must survive re-derivation). Revert code changes. Read the `## Spec Change Log` in `{spec_file}` and strictly respect all logged constraints when amending the sections outside `<intent-contract>` that contain the root cause. Append a new change-log entry recording: the triggering finding, what was amended, the known-bad state avoided, and the KEEP instructions. Append the triage-log entry for this pass, recording in each bad_spec row the amendment it triggered. Read fully and follow `[[bmad-snapshot:step-03-implement.md]]` to re-derive the code, then this step will run again.
   - **patch** — Auto-fix. These are the only findings that survive loopbacks. Re-engage the step-03 implementation subagent: continue that same subagent — address it by the name or id its launch returned — with all patch findings in one synchronous message; for each: the file, what is wrong, and what the smallest fix must do; and tell it to run only the tests that cover the files it edits, then return — the verification that follows is this step's, so no suite-wide run, linters, or ablations on its side. A fresh launch is not re-engagement — it discards the context the implementer holds and pays to rebuild it. Only when the implementer cannot be continued — the platform has no way to message a finished subagent, or its context is gone — apply the patches yourself. Then re-run the commands in `{spec_file}`'s `## Verification` section (or perform its manual checks); if verification fails and the failure cannot be fixed, HALT with status `blocked` and blocking condition `patch verification failed`. Rewrite `{diff_file}` so it reflects the patched tree. Append the triage-log entry for this pass, recording in each patched row the fix applied.
   - **defer** — Update the single `deferred` list in `{spec_file}` frontmatter. If the field is absent (including on specs created before this field existed), add it once as an empty list. If it is `deferred: []`, replace that empty value when adding the first item; otherwise append to the existing list. Preserve every existing item and never add a second `deferred:` key. Before appending, read the existing items and this spec's `## Review Triage Log`: an item naming the same location and the same substance as one already there, however worded, is not appended again. Serialize free-form values as YAML block scalars so characters such as `:`, `#`, quotes, and line breaks remain data. Each item uses this shape:
     ```yaml
     deferred:
       - summary: >-
           <one clause, at most 100 characters, whole words — the ledger reader clamps longer text mid-word>
         evidence: |-
           <what is wrong, then the defer tests it passes — why it is not this change's problem>
         location: >- # required — file:line or component; n/a only when nothing can be opened
           src/foo.py:42
         severity: medium # required — the entry's verdict: high | medium | low
     ```
     After all appends, parse the complete frontmatter as YAML and verify that `deferred` is one list containing every prior item plus the new items with their intended text. Repair serialization errors before continuing.

## Finalize

Write the following details to `{spec_file}` under `## Auto Run Result`:
- Summary of implemented change
- Files changed with one-line descriptions
- Review findings breakdown: patches applied, items deferred, and every rejected finding with its recorded reason
- Follow-up review recommendation: default `false`. Count only this pass's entries triaged `patch`, at entry verdict — never carried, deferred, or `false` ones. On a first pass, `true` if any patched entry was `high`, or if two or more `medium` entries were patched. On a follow-up pass (`{followup_pass}` set by step-01), `true` only if this pass patched a `high` — otherwise the work has converged; patch volume is never grounds. A `true` names the specific unverified risk under `## Auto Run Result`; if none can be named, it is `false`. Record the patched counts by verdict.
- Verification performed, including command outcomes or manual inspection notes
- Any residual risks

Set `{spec_file}` frontmatter `followup_review_recommended` from the computation above.

If version control is unavailable, set `{spec_file}` frontmatter `status: done`, then proceed to HALT.

If version control is available, write `status: done` into `{spec_file}` frontmatter, then:

1. Commit any reviewed-diff files that remain uncommitted, including `{spec_file}` when it is tracked in that working copy. Keep commits already created during this run. Verify every reviewed-diff file appears in the change set after `{baseline_revision}` and none remains uncommitted. Do not push.
2. Verify the version-controlled working copy is clean. Otherwise HALT with status `blocked` and blocking condition `finalization left repository dirty`.

HALT with status `done`.
