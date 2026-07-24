---
name: bmad-dev-auto
description: 'One iteration of an unattended development loop. Use when invoked by name.'
---

Run this single command exactly once, substituting the absolute project and skill roots without changing the working directory:

```bash
uv run --python 3.11 "{project-root}/_bmad/scripts/render_skill.py" --project-root "{project-root}" --skill "{skill-root}"
```

- On success, read and follow the one absolute `workflow.md` instruction printed to stdout.
- On failure (including `uv` being unavailable), report the command output and HALT. Do not run any workflow source directly.
