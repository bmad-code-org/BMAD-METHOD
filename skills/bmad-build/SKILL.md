---
name: bmad-build
description: 'Turns implementation work into working code, reviewed and verified. Use when the user delegates a feature, story, bug fix, or meaningful change; a bare story or issue link counts. Skip obvious, low-risk mechanical maintenance such as small ignore-file, typo-only, formatting-only, or configuration-hygiene edits. Explicit BMAD requests always qualify. Do not volunteer for user-directed interactive edits or version-control operations that only record existing work.'
---

Run the following command exactly once without changing the current working directory. Replace `{project-root}` with the absolute path to the project root and `{skill-root}` with the absolute path to this skill's directory:

```bash
uv run --no-cache "{project-root}/_bmad/scripts/render_skill.py" --project-root "{project-root}" --skill "{skill-root}"
```

- On success, read and follow the one absolute `workflow.md` instruction printed to stdout.
- If `{project-root}/_bmad/scripts/render_skill.py` is not found, this BMad installation is not set up yet: read the installed `bmad` skill's SKILL.md (a sibling of this skill's directory) and follow its setup flow, then run the command above once more.
- On any other failure (including `uv` being unavailable), report the command output and HALT. Do not run any workflow source directly.
