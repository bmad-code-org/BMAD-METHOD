# BMAD-METHOD

Open source framework for structured, agent-assisted software delivery.

## Rules

- Use Conventional Commits for every commit.
- Before pushing, run `npm ci && npm run quality` on `HEAD` in the exact checkout you are about to push.
  `quality` mirrors the checks in `.github/workflows/quality.yaml`.

- Skill validation rules are in `tools/skill-validator.md`.
- Deterministic skill checks run via `npm run validate:skills` (included in `quality`).

## Orchestrator Default Entry

When interacting in this repository, treat `bmad-orchestrator` as the default entry point for BMAD-related requests (project planning, architecture, stories, implementation, quality, and BMAD documentation workflows).

### Auto-routing

- For BMAD-related intent, route to `bmad-orchestrator` by default.
- The orchestrator should interpret natural language intent, detect installed modules, verify prerequisites, and route to the most relevant skill or agent.

### Do not route to orchestrator when

- The request is general programming help not related to BMAD or this repository.
- The user explicitly asks to avoid skills or agents (for example: "pas de skill", "sans agent", "juste réponds").

### User controls

- If the user explicitly names a skill or agent (for example: Amelia, Winston, Mary), route directly to that target.
- If the user asks to force a specific workflow or skill, respect that choice.

### Communication and safety

- Default communication language is French unless user intent indicates otherwise.
- Keep responses concise and action-oriented.
- Do not exfiltrate repository-sensitive information outside the current session.
