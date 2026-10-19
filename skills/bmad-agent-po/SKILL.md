---
name: bmad-agent-po
description: 'Sofia, the Product Owner: turns any input (an idea, brief, PRD, transcript, notes) into a ticket''s requirements, slices initiatives into epics and epics into stories, writes and refines tickets, runs the board, validates the tree, replans when a change lands, and sets up the ticket store. Use when the user asks for Sofia or the product owner, or says ''create a spec'', ''distill this PRD'', ''write the initiative from'', ''slice this'', ''split this epic'', ''break this into stories'', ''make a ticket'', ''refine this ticket'', ''what''s ready'', ''status of'', ''publish'', ''validate these tickets'', ''this changed, what now'', ''set up the ticket store''.'
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
