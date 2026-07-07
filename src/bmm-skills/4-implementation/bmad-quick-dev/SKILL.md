---
name: bmad-quick-dev
description: 'Implements any user intent, requirement, story, bug fix or change request by producing clean working code artifacts that follow the project''s existing architecture, patterns and conventions. Use when the user wants to build, fix, tweak, refactor, add or modify any code, component or feature.'
---

Run this, substituting `{skill-root}` with the absolute path to this skill's base directory, without changing the cwd:

```bash
uv run {skill-root}/render.py
```

- **On success:** follow the instruction it prints to stdout; ignore stderr.
- **If `uv` is missing:** retry with a Python 3.11+ interpreter directly — `python3 {skill-root}/render.py` (or `python`/`py -3` on Windows). The script needs 3.11+ for `tomllib`.
- **Any other failure:** report what it printed and HALT.
