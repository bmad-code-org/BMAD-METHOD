# Evidence Gathering

Phase 1 records what the selected epic produced and what evidence is unavailable. Use the selected mode's inventory as the source of truth.

## Sprint mode

Collect these items:

- The epic file under `{planning_artifacts}`, including declared acceptance criteria.
- The epic's story files under `{implementation_artifacts}`.
- `{implementation_artifacts}/sprint-status.yaml`, including the ordered story states and retrospective key.
- The previous epic's retrospective, when present.
- Available session logs for the epic's stories.

Establish a diff range from the first and last story commits. Include the first commit by using `<first-commit>^..<last-commit>`. Run:

```sh
uv run --no-cache {skill-root}/scripts/git_evidence.py \
  --repo "{project-root}" --range "<range>" --stories "<comma-separated-story-ids>"
```

Keep sprint selection, evidence, and status behavior unchanged.

## Stories mode

Use the successful `stories_status.py inspect` result as the inventory. Record:

- `{spec-folder}/SPEC.md` as the declared epic intent.
- Every returned story record in `stories.yaml` order, including its artifact path and current status.
- Each available `baseline_revision..final_revision` returned as `revision_range`.
- `{spec-folder}/RETROSPECTIVE.md` when resuming.
- Available session logs for each story.

Group stories that share the same non-null revision range. For each distinct range, pass every story id in that group and collect its commits and file changes once:

```sh
uv run --no-cache {skill-root}/scripts/git_evidence.py \
  --repo "{project-root}" --range "<baseline_revision>..<final_revision>" \
  --stories "<comma-separated-story-ids>"
git -C "{project-root}" diff --no-ext-diff \
  "<baseline_revision>..<final_revision>" --
```

If `git_evidence.py` rejects a range, record it as unavailable and surface the error; do not replace an endpoint with `HEAD`. If a story has `NO_VCS` or lacks a complete range, record that its commit and diff evidence is unavailable. Do not write revisions back to the story file.

Compare distinct ranges before aggregating results. Record gaps or branch divergence as limits on the epic-wide diff. When ranges overlap, count shared commits and file changes once in aggregate views while retaining each story's range as provenance.

## Reading git evidence

Read the JSON fields as follows:

- Each commit includes `is_merge` and every matching story id in `stories`.
- `files` reports non-merge change volume.
- `merge_files` measures selected merges against their first parent and repeats the merged change; do not add it to `files`.
- A gap between `merge_count` and `merges_measured` means some merges were not measured.
- `binary_revisions` is unmeasured change, not zero change.

## Missing evidence

State each gap and narrow later analysis accordingly:

- Missing session logs means process analysis excludes session decisions.
- No declared acceptance criteria means Phase 4 profiles criteria from the intent, stories, and diff and labels them `profiled`.
- No usable revision range means code analysis excludes that story's commit and diff history.
- If delegated review is unavailable, run the checks inline and record the reduced scope.

The final document must distinguish evidence that was checked from evidence that was unavailable.
