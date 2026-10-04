---
name: {name}
description: '{description}'
---
Run the following command exactly once without changing the current working directory. Replace `{project-root}` with the absolute path to the project root and `{skill-root}` with the absolute path to this skill's directory:

```bash
uv run --no-cache "{project-root}/_bmad/scripts/render_skill.py" --project-root "{project-root}" --skill "{skill-root}"
```

- When the invocation names a {selector} ({the allowed values, and the words that mean each}), append `--set workflow.{selector}=<value>` to the command.
- On success, read and follow the one absolute `workflow.md` instruction printed to stdout.
- If the script is not found, BMad is not set up here. Offer to run the `bmad` skill's setup, installing `bmad` first if you do not have it (`npx skills add bmad-code-org/BMAD-METHOD --skill bmad`), then run the command above once more.
- On any other failure, including `uv` being unavailable, report the command output and halt. Do not run any workflow source directly.
