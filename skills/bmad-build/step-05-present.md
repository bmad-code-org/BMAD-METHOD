{% if workflow.route != "oneshot" %}
---
---

# Step 5: Present

## RULES

- NEVER auto-push.

## INSTRUCTIONS

### Mark Plan Built

Change `{plan_file}` status to `built` in the frontmatter.

### Commit and Complete

{% if workflow.commit == "auto" %}
If version control is available and the tree is dirty, create a local commit with a conventional message derived from the plan title.
{% elif workflow.commit == "stage" %}
If version control is unavailable, HALT with status `blocked` and record that staging requires version control. Otherwise, stage every file in the reviewed diff since `{baseline_revision}`, including untracked files. Verify no reviewed change remains unstaged or untracked. Do not commit automatically. Run `git write-tree` and include its tree id in the summary. After `workflow.open_plan` and `workflow.on_complete`, run `git write-tree` again and offer the commit only if it still matches. The caller must repeat that check immediately before committing; if the id differs, do not offer or commit, and require the changed index to be reviewed again.
{% else %}
If version control is unavailable, HALT with status `blocked` and record that the handoff recipe requires version control. Otherwise, follow this recipe to create a local commit before continuing:

{{ workflow.commit_handoff }}

Verify the local commit exists before continuing.
{% endif %}

{{ workflow.open_plan }}

### Display Summary

Display a very short completion summary — one or two sentences — including:

- What changed.
- The verification and review result, including whether anything was deferred.
- The commit hash, if one was created.

Do not list changed files, repeat details from the plan, or narrate the process unless the user asks.

Offer applicable next actions in one short line: when version control and a remote are available, create a pull request (and push first if needed); use `bmad-walkthrough`; or make another change.

Workflow complete.

## On Complete

If anything appears below, follow it as the final terminal instruction before exiting; otherwise exit normally.

{{ workflow.on_complete }}
{% endif %}
