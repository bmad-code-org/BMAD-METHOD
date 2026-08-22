# BMAD-METHOD

Open source framework for structured, agent-assisted software delivery.

## Rules

- Use Conventional Commits for every commit.
- Before pushing, run `npm ci && npm run quality` on `HEAD` in the exact checkout you are about to push.
  `quality` mirrors the checks in `.github/workflows/quality.yaml`.

- Skill validation rules are in `tools/skill-validator.md`.
- Deterministic skill checks run via `npm run validate:skills` (included in `quality`).

## Releases

Release and npx distribution work on this branch is a rehearsal against a
disposable mirror, not a real ship. Read `TEMP-RELEASE-PROCESS.md` before
pushing to the mirror or cutting a release.
