{% if workflow.route != "oneshot" %}
---
---

# Step 5: Present

## RULES

- NEVER auto-push.

## INSTRUCTIONS

### Reconcile the Plan

Before changing the status, read the plan's original `baseline_revision` and compare the complete diff since it with `## Tasks & Acceptance` and `## Implementation Notes`. If no diff is available, create one with untracked files included. Include added, modified, deleted, and renamed paths. Attribute changes to this build using the available history and implementation evidence; unrelated, concurrent, or unattributable changes cannot support a task check or note correction. Mark an execution task `[x]` only when this build's diff and applicable verification evidence support its action; leave incomplete or ambiguous tasks `[ ]` and name them in the closing summary. Do not change Acceptance Criteria. In `## Implementation Notes`, correct only explicit `Not edited` path claims contradicted by changes attributable to this build. Leave claims unchanged when attribution is uncertain. Do not change anything inside `<frozen-after-approval>`. If the baseline or diff is unavailable, state that limitation and do not infer path changes.

### Mark Plan Built

Change `{plan_file}` status to `built` in the frontmatter.

### Commit and Complete

If version control is available and the tree is dirty, create a local commit with a conventional message derived from the plan title.

{{ workflow.open_plan }}

### Display Summary

Display a very short completion summary — one or two sentences — including:

- What changed.
- The verification and review result, including whether anything was deferred.
- Any execution tasks left incomplete or ambiguous.
- The commit hash, if one was created.

Do not list changed files, repeat details from the plan, or narrate the process unless the user asks.

Offer applicable next actions in one short line: when version control and a remote are available, create a pull request (and push first if needed); use `bmad-walkthrough`; or make another change.

Workflow complete.

## On Complete

If anything appears below, follow it as the final terminal instruction before exiting; otherwise exit normally.

{{ workflow.on_complete }}
{% endif %}
