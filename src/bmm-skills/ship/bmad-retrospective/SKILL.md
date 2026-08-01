---
name: bmad-retrospective
description: 'Review a completed sprint epic or spec-folder epic from its source evidence and render an acceptance verdict. Use when the user says "run a retrospective" or "retro this epic". Supports -H/--headless.'
---

# Retrospective

Review an epic from its declared intent, story records, commits, diffs, verification results, and available session logs. Cite a file, line, commit, diff, or log for every finding. Drop claims that cannot be checked against a source.

## Resolution rules

- Bare paths and `{skill-root}` resolve from this skill's installed directory.
- `{project-root}` is the project working directory.
- `{skill-name}` is the skill directory's basename.

## Modes

There are two peer modes:

- **Sprint mode** uses `{implementation_artifacts}/sprint-status.yaml`, saves a dated retrospective under `{implementation_artifacts}`, and updates sprint status during finalization.
- **Stories mode** uses a folder containing `SPEC.md`, `stories.yaml`, and `stories/<id>-*.md`. It saves `{spec-folder}/RETROSPECTIVE.md` and never reads or writes sprint status after selection.

Runs are interactive unless the invocation includes `-H` or `--headless`. Headless runs skip confirmations and team discussion, decide from the evidence, and record every unattended choice in the document's Assumptions section.

## On Activation

Run these steps in order:

1. Run `uv run --no-cache {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`. If it fails, resolve `{workflow.*}` by reading `{skill-root}/customize.toml`, `{project-root}/_bmad/custom/{skill-name}.toml`, then `.user.toml`, merging base, team, then user. Scalars override earlier values, keyed table arrays merge by `code` or `id`, and other arrays append.
2. Run each `{workflow.activation_steps_prepend}` entry in order.
3. Load every `{workflow.persistent_facts}` entry. A `file:` entry is a path or glob under `{project-root}`; other entries are literal facts.
4. Load `{project-root}/_bmad/bmm/config.yaml`: `project_name`, `user_name`, `communication_language`, `document_output_language`, `user_skill_level`, `planning_artifacts`, and `implementation_artifacts`. Load `output_folder` from `{project-root}/_bmad/core/config.yaml`. Set `date` from the system clock. Speak in `{communication_language}` and write documents in `{document_output_language}`. Do not state time estimates.
5. Resolve the mode and epic using the rules below.
6. In an interactive run, greet `{user_name}`, name the selected epic or spec folder, and ask whether any area needs extra attention. Treat the answer as a focus request, not evidence.
7. Run each `{workflow.activation_steps_append}` entry in order.

## Input resolution

An explicit folder path takes priority over sprint status. When the invocation identifies a folder, run:

```sh
uv run --no-cache {skill-root}/scripts/stories_status.py inspect --folder "<folder>"
```

Use the returned ordered `stories` list and select stories mode. If the command fails, surface its JSON error and stop. Do not fall back to sprint mode for an invalid explicit folder.

When no folder was supplied and `{implementation_artifacts}/sprint-status.yaml` exists, select sprint mode and keep the existing selection behavior:

- If an epic number was supplied, run `uv run --no-cache {skill-root}/scripts/sprint_status.py detect-epic --file "{implementation_artifacts}/sprint-status.yaml" --epic <N>`.
- Otherwise run the same command without `--epic`. It returns the highest epic with a `done` story. Confirm it interactively; accept it and record the assumption headlessly.
- Treat `story_count: 0` for an explicit number as a likely mistake. Confirm interactively; stop headlessly.
- If detection returns JSON with `ok: false`, surface its error. If it returns no JSON, surface stderr. Ask for an epic interactively; stop headlessly.

When an epic number was supplied but sprint status does not exist, surface that the requested sprint epic cannot be resolved and stop. Do not replace it with an auto-detected spec folder.

When neither a folder nor an epic number was supplied and sprint status does not exist, find spec-folder candidates:

```sh
uv run --no-cache {skill-root}/scripts/stories_status.py detect \
  --root "{output_folder}/specs" \
  --root "{planning_artifacts}" \
  --root "{implementation_artifacts}"
```

- No candidates: ask for a spec folder interactively; stop headlessly.
- One candidate: inspect it and select stories mode. If inspection fails, surface the JSON error and stop. Record auto-selection in a headless run.
- Multiple candidates: show the paths and ask the user to choose. In a headless run, stop and require an explicit folder.

Never choose silently among multiple candidates. Once stories mode is selected, do not access sprint status.

## Completeness

The selected detector supplies `pending_stories` in authoritative order. Sprint mode uses sprint-status file order. Stories mode uses `stories.yaml` list order and each uniquely matched story artifact's frontmatter `status`.

When `pending_stories` is non-empty:

- In an interactive run, list the ids and ask whether to inspect the incomplete epic. Stop before Phase 1 if the user declines. If the user continues, record the ids in Epic summary.
- In a headless sprint-mode run, continue under the existing behavior, record the ids in Assumptions, and force the final machine verdict to `rejected`.
- In a headless stories-mode run, create or reconcile `RETROSPECTIVE.md`, record the ordered ids and the forced `rejected` verdict, finalize it without Phase 1 analysis, and stop.

An interactive human may override the machine verdict after seeing the incomplete list. The source inventory and recorded revisions remain read-only.

## Working state and resumption

Create the retrospective skeleton after selection. Sprint mode uses `{implementation_artifacts}/epic-{{epic_number}}-retro-{date}.md`; stories mode uses `{spec-folder}/RETROSPECTIVE.md`. In stories mode, retain the first inspection's `source_hashes` until finalization.

Write each completed phase into the file. Sprint-mode resumption remains unchanged. In stories mode, then add the phase name to frontmatter `completed_phases`. For an existing stories-mode file, first validate that its frontmatter is a mapping for the selected folder and that `completed_phases` contains only `gather`, `analyze`, `discussion`, `decide`, or `finalize`. Stop on malformed or mismatched working state. Reconcile current evidence with recorded content, refresh the stored pre-run hashes, then resume at the first required phase absent from `completed_phases`; discussion remains optional. Current inventory, statuses, revisions, commits, and diffs take precedence over earlier content.

## Flow

Run the phases in order. Team discussion is optional and never runs headlessly.

### Phase 1: Gather

Load `references/evidence-gathering.md`. Record the intent source, ordered story inventory, revisions, commits, diffs, verification evidence, and available session logs. Record missing evidence without guessing.

### Phase 2: Analyze

Produce source-linked findings from these checks:

- Load `references/aggregate-views.md` and compare the full epic result with the declared intent, architecture, repeated code, file growth, and established patterns. Use deterministic tools first.
- Invoke `bmad-review` over the measured epic diff or each stories-mode revision range. Focus on interactions between stories. If the skill is unavailable, run the same review checks inline and record the reduced scope.
- When runtime behavior changed, exercise the changed flow end to end and record the observed result. Tests alone do not replace this check.

Merge duplicate findings and retain their source references.

### Phase 3: Team discussion

Run only when the user asks for a team discussion. Invoke `bmad-party-mode` with the Phase 2 findings and load `references/team-discussion.md`. If unavailable, discuss the findings inline and record the reduced scope. Participants may address only source-linked findings.

### Phase 4: Decide

Compile fix-now findings and process lessons into specific action items with owners. Do not apply fixes or edit source specifications.

Load `references/acceptance-verdict.md`. Render exactly one machine verdict: `accepted`, `accepted-with-open-items`, or `rejected`. A non-empty authoritative pending list forces `rejected`. A human may override interactively.

### Phase 5: Finalize

Load `references/retro-document.md` and follow the section for the selected mode.

- Sprint mode keeps its existing `sprint_status.py update` flow, including action items and confirmed previous-item transitions.
- Stories mode finalizes only `{spec-folder}/RETROSPECTIVE.md`. Do not call `sprint_status.py`, create sprint status, or store action items anywhere else.

Then follow `{workflow.on_complete}` when it is non-empty.
