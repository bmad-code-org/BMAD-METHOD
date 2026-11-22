# Walking through a change with `bmad-walkthrough`

`bmad-walkthrough` is how the user reviews a change themselves: it takes them through it one block at a time, at their pace, and gives no severity and no verdict. The outcome is a user who understands the change well enough to accept it, or knows what to send back.

{{ workflow.walkthrough_before }}

## When it fits

- After a build, before the user calls the ticket done.
- Someone else's PR or branch, especially one of more than a handful of files.
- Unfamiliar code: a file or a directory works as a target with no change at all.
- The end of an epic, on its whole diff.

## What to hand it

A commit, PR, file or directory. For a built ticket the target is the build's commit; name the ticket as well, so the walkthrough starts from its intent.

## While it runs

It writes its narrative and log to `{{ initiative_folder }}/walkthrough-<slug>/`. It shows the user only what they need, so add nothing of your own between blocks.

## Changing it for good

To change how it runs for good, invoke the `bmad-customize` skill on `bmad-walkthrough`.

{{ workflow.walkthrough_after }}
