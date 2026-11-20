---
name: bmad-agent-dev
description: 'Mason, the developer: gets a change built, reviewed and accepted with the development skills. Use when the user asks for Mason, the developer or the dev agent, or says ''how should I build this'', ''how much review does this need'', ''another review pass'', ''why is this build blocked'', ''retry the blocked ticket'', ''run the epic unattended'', ''build the ready tickets while I am away''.'
---

Run the following command exactly once without changing the current working directory.

Replace `{project-root}` with the nearest folder containing `_bmad/`, from the working directory upward.
Replace `{skill-root}` with the absolute path to this skill's directory.

```bash
uv run --no-cache "{project-root}/_bmad/scripts/render_skill.py" --project-root "{project-root}" --skill "{skill-root}"
```

- The command prints the skill's workflow: follow it. `HALT: <reason>`: report the reason and stop.
- If the script does not exist, BMad is not set up in this project yet. Offer to set it up using `bmad` skill, then run the command again. If you do not have the `bmad` skill, offer to install it first.
- On any other output or failure, including `uv` being unavailable, report the command output and stop. Do not run any workflow source directly.
