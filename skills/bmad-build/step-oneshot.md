{% if workflow.route != "full" %}
{% if workflow.review == "auto" %}
{% set review = "quick" %}
{% else %}
{% set review = workflow.review %}
{% endif %}
# Step One-Shot: Implement, Review, Present

You reach this step from step 2, or from step 1 when resuming a spec whose `route` is `oneshot`. `{spec_file}` already exists.

## RULES

- Do not push to a remote unless the user asks.
- Do not edit anything inside `<frozen-after-approval>` in `{spec_file}`.

## INSTRUCTIONS

### Implement

If `{story_key}` is not empty and `{{ config.implementation_artifacts }}/sprint-status.yaml` exists, read `{{ rendered("sync-sprint-status.md") }}` with `{target_status}` = `in-progress`.

If intent gaps remain, present each as a numbered question with its options and what each option means, HALT for the human's answers, and fold the answers into the Intent.

Capture `baseline_commit` (current HEAD, or `NO_VCS` if version control is unavailable) into `{spec_file}` frontmatter before changing anything.

Build the change from `{spec_file}`. The Intent section is what you implement. As you work, add notes to `## Implementation Notes`: decisions you made, files you changed, surprises.

{% if workflow.route == "oneshot" %}
**When to stop.** Stop coding if the request left out something the user would notice in the result. Write the gap in `## Implementation Notes`, then ask the human — do not guess.
{% else %}
**When to stop and replan.** Stop coding if the request left out something the user would notice in the result. Write the gap in `## Implementation Notes`. Then update `{spec_file}`: add back `## Code Map` (filled in from what you learned while implementing) and `## Open Questions` (one question per gap), set `route: 'full'` and `status: 'draft'`. Go back to `{{ rendered("step-02-plan.md") }}` step 6.
{% endif %}

{% if workflow.review == "auto" %}
Write `review: 'quick'` and `review_source: 'auto'` to `{spec_file}` frontmatter.
{% elif workflow.review == "none" %}
Write `review: 'none'`, `review_source: 'pinned'`, and `lenses_ran: []` to `{spec_file}` frontmatter.
{% else %}
Write `review: '{{ workflow.review }}'` and `review_source: 'pinned'` to `{spec_file}` frontmatter.
{% endif %}
{% if review != "none" %}

### Stage the Diff

Read `{baseline_commit}` from `{spec_file}` frontmatter. If it is missing or `NO_VCS`, write what changed into `{diff_file}` by best effort. Otherwise write a unified diff of all changes since `{baseline_commit}`, untracked files included, to `{diff_file}` — a uniquely-named file in the system temp directory. `bmad-code-review`'s lenses read that file; never paste the diff into a prompt. Do not `git add` anything.

### Review

Invoke the `bmad-code-review` skill with review `{{ review }}`, diff file `{diff_file}`, and story file `{spec_file}`, in this session. It launches the lenses, triages, and returns the surviving findings as a Markdown list, each carrying its class: `patch`, `defer`, or `decision_needed`. Then write `lenses_ran` — the ids launched, in launch order — to `{spec_file}` frontmatter, and append the returned list under `## Review Triage Log` in `{spec_file}`.

### Act on the Findings

- **decision_needed** — Present the finding with its options and stop for the human's answer. The answer makes it `patch` or `defer`, or rejects it.
- **patch** — Fix it now.
- **defer** — Add one entry to `{{ config.implementation_artifacts }}/deferred-work.md`:

  ```markdown
  - source_spec: `{spec_file}`
    summary: <one sentence>
    evidence: <why this is real; for maybe-false, what would prove it>
  ```

  Do not edit old entries or check for duplicates.
{% endif %}

### Finalize Spec

Set `status: 'done'` in `{spec_file}` frontmatter.

If `{story_key}` is not empty and `{{ config.implementation_artifacts }}/sprint-status.yaml` exists, read `{{ rendered("sync-sprint-status.md") }}` with `{target_status}` = `review`.

### Commit

If git is available and there are uncommitted changes, commit with a conventional message based on the Intent. If git is not available, skip.

### Present

{{ workflow.open_spec }}

Give the user a short summary — one or two sentences:

- What changed.
- Review result, including anything deferred.
- Commit hash, if you made one.

Do not list files, repeat the spec, or walk through what you did unless asked.

Offer next steps in one line: create a PR (push first if needed) when git and a remote exist; use `bmad-walkthrough`; or make another change.

Stop and wait for the user.

Workflow complete.

## On Complete

If anything appears below, do it before exiting. Otherwise exit.

{{ workflow.on_complete }}
{% endif %}
