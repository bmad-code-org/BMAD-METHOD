# Finalize the Retrospective

The retrospective file is both working state and final output. Create its skeleton after selecting the epic, update it after each phase, and reconcile it with current evidence before resuming.

## Frontmatter

Sprint mode retains this frontmatter:

```yaml
---
epic: <epic number>
date: <date>
verdict: accepted | accepted-with-open-items | rejected
criteria: declared | profiled
headless: true | false
---
```

Stories mode uses:

```yaml
---
spec_folder: "<spec-folder path>"
mode: stories
date: <date>
verdict: accepted | accepted-with-open-items | rejected
criteria: declared | profiled
headless: true | false
completed_phases: []
source_hashes: {}
---
```

Serialize frontmatter as YAML and parse it again after each write. Store the exact selected folder path as a YAML string rather than interpolating it into the example. Keep `verdict` consistent with the Acceptance verdict section.

In stories mode, add a phase to `completed_phases` only after its section is written. Allowed values are `gather`, `analyze`, `discussion`, `decide`, and `finalize`; discussion is optional. Copy the first inspection's `source_hashes` into the working state. On resumption, validate `mode: stories`, the exact selected `spec_folder`, the terminal verdict vocabulary when one is present, the phase list, and the hash mapping. Stop if the file is malformed or belongs to another folder. After reconciling current evidence, replace `source_hashes` with the new pre-run values.

## Sections

Include these sections:

- **Epic summary**: selected epic, ordered stories and statuses, revision or diff ranges, and available and missing evidence.
- **Findings**: source-linked findings and their dispositions.
- **Behavior verification**: exercised flows and observed results, or a statement that runtime behavior was not exercised.
- **Previous-retro follow-through**: sprint-mode status evidence, or relevant earlier lessons available in stories mode.
- **Action items**: proposed items with owners.
- **Acceptance verdict**: verdict, criteria source, and supporting evidence.
- **Open questions**: unanswered questions that could change the result.
- **Assumptions**: headless selections, completeness results, machine verdict, and proposed items. Omit in interactive runs.

Do not state time estimates.

## Sprint mode finalization

Save `{implementation_artifacts}/epic-{{epic_number}}-retro-{date}.md`. Do not hand-edit sprint status. Run the existing comment-preserving, atomic update:

```sh
uv run --no-cache {skill-root}/scripts/sprint_status.py update \
  --file "{implementation_artifacts}/sprint-status.yaml" \
  --epic {{epic_number}} --set-retro-done \
  --add-action '[{"action":"...","owner":"..."}, ...]' \
  --ref "{implementation_artifacts}/epic-{{epic_number}}-retro-{date}.md" \
  --verdict "<accepted | accepted-with-open-items | rejected>" \
  --date "{date}"
```

Pass `--date` only as `MM-DD-YYYY HH:MM`; otherwise omit it so the script supplies the current time. Keep path and date arguments quoted.

On success, report `retro_key_found`, `action_items_added`, `action_items_updated`, and the echoed `verdict`. The retro key is marked `done` even for a rejected verdict because it records that the retrospective ran. The verdict remains only in this document. Each new action item has `status: open`, a stable id, and a retrospective `ref`; reruns use these fields to avoid duplicate items.

On failure, surface the JSON error and do not hand-edit the file. `restored: true` means the original bytes were restored. `restored: false` means restoration also failed and the file may be damaged. A missing `restored` means the parser rejected the command before a write.

Report `retro_key_found: false` as a missing sprint retrospective key that needs attention. `retro_key_found: null` means `--set-retro-done` was not requested.

When the user confirms previous-item transitions, add:

```sh
--set-action-status '[{"id":"<exact-id>","status":"done"}]'
```

Legacy selectors use the exact `epic` integer and `action` text. Matching does not trim or fold case. A selector with an id uses the id, and `--epic` does not scope selectors. Valid statuses are `open`, `in-progress`, and `done`; both `open` and `in-progress` remain open work.

Every selector must match exactly one existing item. A missing, duplicate, or colliding selector aborts the full invocation and restores the original bytes, including any retro-key or appended-item changes in the same command. New items in the same invocation cannot be selected and always start `open`. Apply only user-confirmed transitions and do not pass this flag headlessly.

## Stories mode finalization

Save and finalize `{spec-folder}/RETROSPECTIVE.md`. This is the only retrospective and action-item artifact for the run. If that path already exists as a symlink or is not a regular file, stop without writing it.

Before reporting completion:

1. Run `stories_status.py inspect --folder "{spec-folder}"` again and reconcile the document with its current ordered inventory.
2. Ensure a non-empty `pending_stories` list produces `verdict: rejected` unless an interactive human explicitly overrode it.
3. Record headless assumptions and the standard terminal verdict.
4. Compare the final inspection's `source_hashes` with the pre-run mapping. Stop and report every changed path if they differ; otherwise the source artifacts are byte-identical.
5. Add `finalize` to `completed_phases`, write the file, and parse the frontmatter again before reporting success.

Do not run `sprint_status.py`, read or write sprint status, create sprint status, edit source story artifacts, or persist action items elsewhere.

## Finish

Report the saved document path, verdict, and action-item count. Then follow `{workflow.on_complete}` when it is non-empty.
