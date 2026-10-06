---
name: bmad-retrospective
description: 'Review a finished epic folder in the ticket tree against the evidence it left behind — the epic file, each ticket plan, diffs, commits — and produce a retrospective with sourced findings, action items, and an acceptance decision. Use when the user says "run a retrospective" or "lets retro the epic [epic]". Supports -H/--headless'
---

Run the following command exactly once without changing the current working directory. Replace `{project-root}` with the absolute path to the project root and `{skill-root}` with the absolute path to this skill's directory:

```bash
uv run --no-cache "{project-root}/_bmad/scripts/render_skill.py" --project-root "{project-root}" --skill "{skill-root}"
```

- The command should print one line to stdout. `read and follow <rendered workflow.md>`: read that file and follow it. `HALT: <reason>`: report the reason and stop.
- If the script does not exist, BMad is not set up in this project yet. Offer to set it up using `bmad` skill, then run the command again. If you do not have the `bmad` skill, offer to install it first.
- On any other output or failure, including `uv` being unavailable, report the command output and stop. Do not run any workflow source directly.
