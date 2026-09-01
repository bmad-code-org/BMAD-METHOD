# BMAD-METHOD

Open source framework for structured, agent-assisted software delivery.

## Rules

- Use Conventional Commits for every commit.
- Before pushing, run `npm ci && npm run quality` on `HEAD` in the exact checkout you are about to push.
  `quality` mirrors the checks in `.github/workflows/quality.yaml`.

- Skill validation rules are in `tools/skill-validator.md`.
- Deterministic skill checks run via `npm run validate:skills` (included in `quality`).
- Documentation conventions are in `docs/_STYLE_GUIDE.md`.

## Writing prompts

Skills, workflows, tasks, and agent definitions are prompt text that an agent reads in full on every run. Length and
ambiguity are paid on every run; a corner case is paid only when it occurs. So do not add instructions for exotic
cases — the model usually handles them from context, and the reviewing human can correct it when it does not.

## Testing

Automated tests assert outcomes produced by deterministic code. Do not write automated tests for LLM output or for
static source text.
