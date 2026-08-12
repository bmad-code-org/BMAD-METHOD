---
name: bmad-build
description: 'Turns a work item — feature, story, bug fix, change request — into working code, reviewed and verified. Use when the user hands over an outcome and leaves the edits to you; a bare story or issue link counts. Also use whenever the user asks BMAD by name — then any change qualifies, even a tiny fully-specified edit. Do not volunteer for interactive edits the user directs and reviews themselves, or for version-control operations that record existing work without changing it.'
---

Run the following command exactly once without changing the current working directory. Replace `{project-root}` with the absolute path to the project root and `{skill-root}` with the absolute path to this skill's directory:

```bash
uv run --no-cache "{project-root}/_bmad/scripts/render_skill.py" --project-root "{project-root}" --skill "{skill-root}"
```

- On success, read and follow the one absolute `workflow.md` instruction printed to stdout.
- On failure (including `uv` being unavailable), report the command output and HALT. Do not run any workflow source directly.
