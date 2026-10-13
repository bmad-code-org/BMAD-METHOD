# Step 2: Draft

For a commit message, write the subject and an optional one-to-three
line body that says why, then go to the next step.

For a PR:
{% if workflow.pr_template %}
- Fill `{{ workflow.pr_template }}`. Keep its headings and limits.
{% else %}
- If the repo has `.github/PULL_REQUEST_TEMPLATE.md`, fill it and keep
  its headings and limits.
- Otherwise pick the closest skeleton in `{{ rendered("references/skeletons.md") }}`.
{% endif %}
- Write the title and body to
  `{{ config.output_folder }}/pr-drafts/<branch>.md`.
{% if workflow.reviewer %}
- End with `## @{{ workflow.reviewer }} — what you need to do`:
  numbered steps for what to review, deploy order, settings, and the
  command to re-run with its expected result.
{% else %}
- End with `## Before merging`: numbered steps for what to check,
  deploy order, settings, and the command to re-run with its expected
  result.
{% endif %}

Then check the draft against `{{ rendered("references/style.md") }}` and fix it: a
**Not verified:** line exists, numbers are exact, nothing is
overstated, and no tool or model is credited.

## NEXT

Read fully and follow: `{{ rendered("step-03-publish.md") }}`
