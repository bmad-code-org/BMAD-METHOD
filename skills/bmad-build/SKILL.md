---
name: bmad-build
description: 'Implements a story, feature, or bug fix end to end: plan, code, review, verify. Use when the user hands one over and leaves the edits to you; a bare ticket id or link counts. Skip obvious, low-risk mechanical maintenance such as small ignore-file, typo-only, formatting-only, or configuration-hygiene edits. Explicit BMAD requests always qualify. Do not volunteer for user-directed interactive edits or version-control operations that only record existing work.'
---

Run the following command exactly once without changing the current working directory.

Replace `{project-root}` with the nearest folder containing `_bmad/`, from the working directory upward.
Replace `{skill-root}` with the absolute path to this skill's directory.

```bash
uv run --cache-dir "{project-root}/.bmad-uv-cache" "{project-root}/_bmad/scripts/render_skill.py" --project-root "{project-root}" --skill "{skill-root}"
```

- When the invocation names a route (`oneshot` or `full`), append `--set workflow.route=<value>` to the command.
- When the invocation names a review selection (`none`, `quick`, or `thorough`; "skip review" or "no review" mean `none`), append `--set workflow.review=<value>` to the command.
- The command prints the skill's workflow: follow it. `HALT: <reason>`: report the reason and stop.
- If the script does not exist, BMad is not set up in this project yet. Offer to set it up using `bmad` skill, then run the command again. If you do not have the `bmad` skill, offer to install it first.
- On any other output or failure, including `uv` being unavailable, report the command output and stop. Do not run any workflow source directly.
