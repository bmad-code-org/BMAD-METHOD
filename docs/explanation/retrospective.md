---
title: "Retrospective"
description: Review a completed sprint epic or spec-folder epic from its specifications, story records, commits, diffs, and verification evidence.
sidebar:
  order: 15
---

Run `bmad-retrospective` after an epic completes. It records the available evidence, reviews the result across story boundaries, proposes owned action items, and writes an acceptance verdict.

Every finding includes a source reference such as a file, line, commit, diff, test result, or session log. Unsupported claims are excluded.

## Supported epic formats

The skill supports two independent formats.

### Sprint status

Sprint mode selects an epic from `{implementation_artifacts}/sprint-status.yaml`. It saves a dated retrospective under the implementation artifacts, marks the sprint retrospective key `done`, and appends proposed action items through the sprint-status helper.

Existing sprint selection and update behavior is unchanged.

### Spec folder

Stories mode accepts a folder with this structure:

```text
spec-example/
├── SPEC.md
├── stories.yaml
└── stories/
    ├── 1-first-story.md
    └── 2-second-story.md
```

Invoke it by naming the folder, for example:

```text
run a retrospective for _bmad-output/specs/spec-example
```

An explicit folder selects stories mode even when sprint status exists. The `stories.yaml` list order is authoritative. Every id must match exactly one `stories/<id>-*.md` file, and the file's frontmatter `status` supplies its current delivery state.

Stories mode writes and resumes `<spec-folder>/RETROSPECTIVE.md`. It never requires, creates, reads, or updates `sprint-status.yaml`, and it does not edit `SPEC.md`, `stories.yaml`, story files, or recorded revisions.

## Automatic selection

When no epic is supplied and sprint status exists, normal sprint detection runs.

When sprint status is absent, the skill searches configured spec roots. One candidate is selected automatically. Multiple candidates are shown for interactive selection; a headless run stops and requires an explicit folder rather than guessing.

An explicit epic number still means sprint mode. If sprint status is absent, that request stops instead of selecting an unrelated spec folder.

For stable automation, always pass an explicit epic number or spec-folder path:

```text
-H 3
-H _bmad-output/specs/spec-example
```

## Completeness and evidence

An epic is complete only when every selected story has `status: done`. Pending stories are listed in their source order and force the machine verdict to `rejected`. An interactive user may continue inspecting the incomplete epic and may override the verdict. A headless stories-mode run records the rejection and stops before analysis.

For stories mode, each story's recorded `baseline_revision..final_revision` identifies its commits and diff. Missing or `NO_VCS` revisions are recorded as evidence gaps; they are never replaced with `HEAD` or written back to the story.

Missing `SPEC.md`, invalid `stories.yaml`, malformed frontmatter, duplicate or invalid ids, ambiguous file matches, and missing or non-string statuses stop before analysis with a structured error.

## Output

Both modes use the verdict vocabulary `accepted`, `accepted-with-open-items`, and `rejected`. The document includes the evidence inventory, findings, behavior verification, action items, verdict, open questions, and headless assumptions when applicable.

If a stories-mode retrospective already exists, its `completed_phases` frontmatter records where to resume. The skill validates that the file belongs to the selected folder, compares it with the current inventory, and resumes the first incomplete required phase. Current evidence takes precedence over recorded working state.

Stories mode records SHA-256 hashes for `SPEC.md`, `stories.yaml`, and the selected story files at the start of a run. It compares them again before finalization so the read-only guarantee is checked rather than assumed.

## Common invocations

| Goal | Invocation |
| --- | --- |
| Detect a sprint epic | "run a retrospective" |
| Select sprint epic 3 | "retro epic 3" |
| Select a spec folder | "retro `_bmad-output/specs/spec-example`" |
| Run sprint mode headlessly | `-H 3` |
| Run stories mode headlessly | `-H _bmad-output/specs/spec-example` |
| Add an interactive team discussion | Ask to "discuss it as a team" |
