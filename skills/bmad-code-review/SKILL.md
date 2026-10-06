---
name: bmad-code-review
description: 'Review code changes with several independent reviewers in parallel, then triage and present the findings. Use when the user says "run code review" or "review this code"'
---

Run the following command exactly once without changing the current working directory.

Replace `{project-root}` with the absolute path to the project root and `{skill-root}` with the absolute path to this skill's directory.

If the invocation specifies a `quick` or `thorough` review, append `--set workflow.review=<value>` to the command.

```bash
uv run --no-cache "{project-root}/_bmad/scripts/render_skill.py" --project-root "{project-root}" --skill "{skill-root}"
```

- The command should print one line to stdout. `read and follow <rendered workflow.md>`: read that file and follow it. `HALT: <reason>`: report the reason and stop.
- If the script does not exist, BMad is not set up in this project yet. Offer to set it up using `bmad` skill, then run the command again. If you do not have the `bmad` skill, offer to install it first.
- On any other output or failure, including `uv` being unavailable, report the command output and stop. Do not run any workflow source directly.
