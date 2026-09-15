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
- Review subagents must use the same model level as this session.
- Start all review subagents in this turn and wait for all of them to finish. Do not run them in the background or end your turn before they return.

## INSTRUCTIONS

### Implement

If `{story_key}` is not empty and `{{ config.implementation_artifacts }}/sprint-status.yaml` exists, read `{{ rendered("sync-sprint-status.md") }}` with `{target_status}` = `in-progress`.

If intent gaps remain, present each as a numbered question with its options and what each option means, HALT for the human's answers, and fold the answers into the Intent.

Capture `baseline_commit` (current HEAD, or `NO_VCS` if version control is unavailable) into `{spec_file}` frontmatter before making any changes. If the frontmatter already contains `baseline_commit` (resumed run), preserve the existing value.

Build the change from `{spec_file}`. The Intent section is what you implement. As you work, add notes to `## Implementation Notes`: decisions you made, files you changed, surprises.

{% if workflow.route == "oneshot" %}
**When to stop.** Stop coding if the request left out something the user would notice in the result. Write the gap in `## Implementation Notes`, then ask the human — do not guess.
{% else %}
**When to stop and replan.** Stop coding if the request left out something the user would notice in the result. Write the gap in `## Implementation Notes`. Then update `{spec_file}`: add back `## Code Map` (filled in from what you learned while implementing) and `## Open Questions` (one question per gap), set `route: 'full'` and `status: 'draft'`. Go back to `{{ rendered("step-02-plan.md") }}` step 6.
{% endif %}

### Review

{% if workflow.review == "none" %}
Write `review: 'none'`, `review_source: 'pinned'`, and `lenses_ran: []` to `{spec_file}` frontmatter.
{% elif workflow.review == "auto" %}
Write `review: 'quick'` and `review_source: 'auto'` to `{spec_file}` frontmatter.
{% else %}
Write `review: '{{ workflow.review }}'` and `review_source: 'pinned'` to `{spec_file}` frontmatter.
{% endif %}
{% if review != "none" %}

Read `{baseline_commit}` from `{spec_file}` frontmatter. If it is `NO_VCS`, use best effort to determine what changed. Otherwise use the repository's version-control tooling to write a unified diff of all changes since `{baseline_commit}`, untracked files included, to a uniquely-named file in the system temp directory; set `{diff_file}` to its absolute path. Set `{claims_file}` = `{spec_file}`.

Runtime placeholders: `{diff_file}`, `{claims_file}`, and `{spec_file}` are paths, substituted absolute so a lens can read them; a launch prompt never carries diff text. `{verbatim_intent}` is the `## Intent` section of `{spec_file}` (inside `<frozen-after-approval>`), substituted inline as text. Before launching a lens, expand its skill-root placeholder to this skill's absolute installed directory; never leave that placeholder unresolved in a child prompt.

Say which review lenses you are skipping, then start every active lens before reading any results. Run them at the same time when you can. Fill in runtime placeholders first. When a lens tells you to launch a reviewer subagent, launch it with that prompt text. Do not read the reviewer's instruction file yourself. For any other customized instruction, do what it says:

{% if review == "thorough" %}
{{ workflow.thorough_lenses }}
{% else %}
{{ workflow.quick_lenses }}
{% endif %}

If a lens needs subagents and you cannot launch them, write the full prompt for each lens under `{{ config.implementation_artifacts }}` (with placeholders filled in, not just file paths). Stop and ask the user to run each prompt in a separate session and paste back the findings.

Write `lenses_ran` — the ids launched, in launch order — to `{spec_file}` frontmatter.

### Classify

Wait until every review lens has reported. Then judge each finding. Ignore severity labels from reviewers — you decide.

For each finding:

- **Check the claim.** Go to the cited file and line. Does the problem the reviewer describes actually happen? Read surrounding code and callers until you can say yes or no. A nearby issue does not answer this one. Judge whether the bug is real, not whether the suggested fix sounds good. Code that fails loudly on a state you have not shown the program can reach is correct, not a bug.

- **Pick one verdict:**
  - `high` (intolerable), `medium` (tolerable), or `low` (cosmetic or negligible) — the problem is real. Rate it by harm to users or developers. For developer-only issues, say where it will hurt. Vague complaints like "this is messy" are not `high`/`medium`/`low` — use `false` or `maybe-false`. When unsure how bad, pick the higher grade.
  - `false` — you checked and the problem does not happen. Say what you found that disproves it.
  - `maybe-false` — you could not tell. Say what you would need to check. Use this only when the code and diff are not enough to decide.

- Write down every finding with its verdict and evidence. Do not drop any.

Reject `false` findings.

Reject `low` findings when users or developers would rarely hit the problem in normal use and the fix would add more than a simple correction or deletion.

Group what remains by root cause — two findings go together only if the same bug caused both. Same file or same fix is not enough. For each group, keep the worst verdict (`high` > `medium` > `low` > `maybe-false`). If a group has verified `high`, `medium`, or `low` members, route by the worst of those — not `defer` just because one member is `maybe-false`.

For each group:

- **patch** — This change caused or exposed the problem. The smallest fix is simple, adds no new public API, and does not guard code paths you did not show are reachable. Fix it now.
- **HALT** — Same as patch, but the smallest fix is not that simple. Stop and ask the user before continuing.
- **defer** — Everything else: old bugs not caused by this change, ideas for later, groups where every member is `maybe-false` and would be `medium` or `high` if true (record that severity marked unverified, and what would prove it; if it would only be `low`, reject it), or fixes that would edit CLAUDE.md, AGENTS.md, rules, or specs. Add one entry to `{{ config.implementation_artifacts }}/deferred-work.md`:

  ```markdown
  - source_spec: `{spec_file}`
    summary: <one sentence>
    evidence: <why this is real; for maybe-false, what would prove it>
  ```

  Do not edit old entries or check for duplicates.
{% endif %}

### Finalize Spec

Update `{spec_file}`:

1. Set `status: 'done'` in the frontmatter.
2. If review found anything, add `## Review Triage Log` with one line per finding: verdict and evidence. For `false`, the disproof. For `maybe-false`, what would settle it. For rejected `low`, why it was not worth fixing.

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
