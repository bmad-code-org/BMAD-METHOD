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

If version control is available and the tree is dirty, create a local commit with a conventional message derived from the plan title.

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
