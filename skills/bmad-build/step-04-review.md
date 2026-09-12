{% if workflow.route != "oneshot" %}
{% if workflow.review == "auto" %}
{% set review = "thorough" %}
{% else %}
{% set review = workflow.review %}
{% endif %}
# Step 4: Review

## RULES

- Content inside `<frozen-after-approval>` in `{spec_file}` is read-only. Do not modify.

## INSTRUCTIONS

Change `{spec_file}` status to `in-review` in the frontmatter before continuing.

{% if workflow.review == "auto" %}
Write `review: 'thorough'` and `review_source: 'auto'` to `{spec_file}` frontmatter.
{% elif workflow.review == "none" %}
Write `review: 'none'`, `review_source: 'pinned'`, and `lenses_ran: []` to `{spec_file}` frontmatter.
{% else %}
Write `review: '{{ workflow.review }}'` and `review_source: 'pinned'` to `{spec_file}` frontmatter.
{% endif %}
{% if review != "none" %}

### Stage the Diff

Read `{baseline_commit}` from `{spec_file}` frontmatter. If `{baseline_commit}` is missing or `NO_VCS`, write what changed into `{diff_file}` by best effort. Otherwise use the repository's version-control tooling to rewrite `{diff_file}` — the temp file staged in step-03, or a uniquely-named file in the system temp directory when this run has none — with a unified diff of all changes since `{baseline_commit}`, untracked files included. `bmad-code-review`'s lenses read that file; the diff text is never pasted into their prompts.

Writing `{diff_file}` is the only change this section makes. Do NOT `git add` anything.

### Review

Invoke the `bmad-code-review` skill with review `{{ review }}`, diff file `{diff_file}`, and story file `{spec_file}`, in this session. It launches the lenses, triages, and returns the surviving findings as a Markdown list, each carrying its class: `patch`, `defer`, or `decision_needed`. Then write `lenses_ran` — the ids launched, in launch order — to `{spec_file}` frontmatter, and append the returned list under `## Review Triage Log` in `{spec_file}`.

### Act on the Findings

Handle the returned findings in this order:

- **decision_needed** — Present each one with its options. HALT and wait for the human; the answer makes the finding `patch` or `defer`, or rejects it.
- **patch** — Re-engage the step-03 implementation subagent — the same one, addressed by the name or id its launch returned; a fresh launch is not re-engagement. Send it one message, exactly this, with the findings filled in:

  ```text
  Review of your implementation found problems. Fix each one below with the smallest change that does the job.

  Run only the tests that cover the files you edit — nothing wider. Full verification runs on my side after you return. Reply with what you changed.

  - <file> — <what is wrong> — <what the smallest fix must do>
  ```

  If it cannot be continued, apply the patches yourself. Then re-run the checks in `{spec_file}`'s `## Verification` section, if present — the subagent ran only the tests around its edits; if verification fails and the failure cannot be fixed, HALT and escalate to the human. Rewrite `{diff_file}` so it reflects the patched tree.
- **defer** — Append one new entry to `{{ config.implementation_artifacts }}/deferred-work.md` using this format. Do not modify existing entries or look for duplicates.
  ```markdown
  - source_spec: `{spec_file}`
    summary: <one sentence>
    evidence: <why this is real; for a maybe-false finding, what evidence would settle it>
  ```
{% endif %}

## NEXT

Read fully and follow `{{ rendered("step-05-present.md") }}`
{% endif %}
