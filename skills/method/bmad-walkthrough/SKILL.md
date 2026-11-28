---
name: bmad-walkthrough
description: 'Guide a human review of a commit, PR, file, or directory. Use when invoked by name'
---

Run the following command exactly once without changing the current working directory.

Replace `{project-root}` with the nearest folder containing `_bmad/`, from the working directory upward.
Replace `{skill-root}` with the absolute path to this skill's directory.

```bash
uv run --no-cache "{project-root}/_bmad/scripts/render_skill.py" --project-root "{project-root}" --skill "{skill-root}" --require-version 2
```

- The command prints the skill's workflow: follow it. `HALT: <reason>`: report the reason and stop.
- If the script does not exist, or it halts over `--require-version`, BMad is missing or out of date in this project. Offer to set it up using the `bmad` skill, then run the command again. If you do not have the `bmad` skill, offer to install it first.
- On any other failure (including `uv` being unavailable), report the command output and HALT. Do not run any workflow source directly.
