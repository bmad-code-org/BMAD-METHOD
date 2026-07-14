---
name: bmad-dev-auto
description: 'One iteration of an unattended development loop. Use when invoked by name.'
---

Run this, substituting `{skill-root}` with the absolute path to this skill's base directory, without changing the cwd:

```bash
uv run {skill-root}/render.py
```

- **On success:** follow the instruction it prints to stdout; ignore stderr.
- **On any failure** (including `uv` not being installed): report what it printed and HALT.
