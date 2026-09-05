# BMAD-METHOD

Open source framework for structured, agent-assisted software delivery.

## Rules

- Use Conventional Commits for every commit.
- Before pushing, run `npm ci && npm run quality` on `HEAD` in the exact checkout you are about to push.
  `quality` mirrors the checks in `.github/workflows/quality.yaml`.
- Run `uv run pre-commit install` once per clone; the commit hook runs the Python-side lint and validation from `quality`.

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

## Releases

Read `tools/release.md` before cutting a release. Stamp on `dev`, fast-forward
`main` with `git push origin dev:main`, tag that commit, then stamp the next
placeholder on `dev`. No release PR or back-merge. The 6.12 npm installer is
maintained separately on `V6.12`.
