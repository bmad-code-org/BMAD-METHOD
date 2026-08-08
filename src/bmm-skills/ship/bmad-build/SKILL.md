---
name: bmad-build
description: 'Implements any user intent, requirement, story, bug fix or change request by producing clean working code artifacts that follow the project''s existing architecture, patterns and conventions. Use when the user wants to build, fix, tweak, refactor, add or modify any code, component or feature.'
---

Before using any tool, choose one initial behavior: direct route, early one-shot probe, or full route. Take the direct route only for a **pointed edit**: the request pins the change to a bounded, colocated span in one file — a word, a phrase, a paragraph or two the user is evidently looking at — whether the user dictates the replacement ("change X to Y") or delegates its authoring within that span ("this paragraph is overprompted"). Applying dispositions from a findings list also qualifies, as does an explicit ask to skip the process. The tell: there is nothing to clarify — target and latitude are both pinned by the request.

Never choose the direct route because a change merely looks trivial or low-risk.

For a clear, explicit, single-goal **new implementation request** that is not a request to resume or act on an existing spec, story, or BMAD artifact, probe for the one-shot route before rendering anything: inspect only the relevant source, tests, and call sites needed to understand the affected surface and plausible consequences. Include the version-control sanity check in the same tool call where practical. If the tree is dirty or the branch is an obvious mismatch, HALT and ask the human before proceeding. Do not scan BMAD artifacts during this probe. The request alone cannot establish one-shot eligibility; the source investigation must do that.

After the probe, take the early one-shot route only when the intent remains clear, no architectural decision is needed, and the evidence shows zero blast radius — no plausible path by which the change causes unintended consequences elsewhere. Otherwise take the full route and carry the probe's findings forward rather than repeating its investigation. For every other request, take the full route immediately.

Once the route is chosen, run exactly one renderer command without changing the current working directory. Replace `{project-root}` with the absolute project root and `{skill-root}` with this skill's absolute directory.

Direct route:

```bash
uv run --no-cache "{project-root}/_bmad/scripts/render_skill.py" --project-root "{project-root}" --skill "{skill-root}" --route direct
```

Early one-shot route, after the probe qualifies it:

```bash
uv run --no-cache "{project-root}/_bmad/scripts/render_skill.py" --project-root "{project-root}" --skill "{skill-root}" --route one-shot
```

Full route:

```bash
uv run --no-cache "{project-root}/_bmad/scripts/render_skill.py" --project-root "{project-root}" --skill "{skill-root}"
```

- On success, follow what stdout gives you: the direct and early one-shot routes print their instructions inline — act on them without reading anything further; the full route prints one absolute instruction file to read and follow.
- On failure (including `uv` being unavailable), report the command output and HALT. Do not run any workflow source directly.
