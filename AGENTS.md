# BMAD-METHOD

Open source framework for structured, agent-assisted software delivery.

## Rules

- Use Conventional Commits for every commit.
- Before pushing, run `HUSKY=0 npm ci --silent && npm run -s quality:gate` on
  `HEAD` in the exact checkout you are about to push; push only on exit 0.
  It mirrors the checks in `.github/workflows/quality.yaml` and prints
  output only on failure.

- Skill validation rules are in `tools/skill-validator.md`.
- Deterministic skill checks run via `npm run validate:skills` (included in `quality`).
