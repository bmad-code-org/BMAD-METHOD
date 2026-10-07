---
name: bmad-qa-generate-e2e-tests
description: 'Add end-to-end and API tests for features that already work, following the project''s existing test harness. Use when the user asks for e2e tests, API tests, or automated coverage of an existing feature, or says "create qa automated tests for [feature]". Not for unit tests on work in flight, which the build writes.'
---

Run the following command exactly once without changing the current working directory.

Replace `{project-root}` with the nearest folder containing `_bmad/`, from the working directory upward.
Replace `{skill-root}` with the absolute path to this skill's directory.

```bash
uv run --no-cache "{project-root}/_bmad/scripts/render_skill.py" --project-root "{project-root}" --skill "{skill-root}"
```

- The command should print one line to stdout. `read and follow <rendered workflow.md>`: read that file and follow it. `HALT: <reason>`: report the reason and stop.
- If the script does not exist, BMad is not set up in this project yet. Offer to set it up using `bmad` skill, then run the command again. If you do not have the `bmad` skill, offer to install it first.
- On any other output or failure, including `uv` being unavailable, report the command output and stop. Do not run any workflow source directly.
