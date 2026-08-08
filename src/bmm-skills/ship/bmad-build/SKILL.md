---
name: bmad-build
description: 'Implements any user intent, requirement, story, bug fix or change request by producing clean working code artifacts that follow the project''s existing architecture, patterns and conventions. Use when the user wants to build, fix, tweak, refactor, add or modify any code, component or feature.'
---

Before using any tool, choose the route. Take the direct route only for a **pointed edit**: the request pins the change to a bounded, colocated span in one file — a word, a phrase, a paragraph or two the user is evidently looking at — whether the user dictates the replacement ("change X to Y") or delegates its authoring within that span ("this paragraph is overprompted"). Applying dispositions from a findings list also qualifies, as does an explicit ask to skip the process. The tell: there is nothing to clarify — target and latitude are both pinned by the request.

Never choose the direct route because a change merely looks trivial or low-risk; absent the tell, take the full route and let the workflow route after intent is clarified.

Without changing the current working directory, run exactly one command. Replace `{project-root}` with the absolute project root and `{skill-root}` with this skill's absolute directory.

Direct route:

```bash
uv run --no-cache "{project-root}/_bmad/scripts/render_skill.py" --project-root "{project-root}" --skill "{skill-root}" --route direct
```

Full route:

```bash
uv run --no-cache "{project-root}/_bmad/scripts/render_skill.py" --project-root "{project-root}" --skill "{skill-root}"
```

- On success, follow what stdout gives you: the direct route prints its instructions inline — act on them without reading anything further; the full route prints one absolute instruction file to read and follow.
- On failure (including `uv` being unavailable), report the command output and HALT. Do not run any workflow source directly.
