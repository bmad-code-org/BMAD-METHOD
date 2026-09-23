# BMAD-METHOD

Open source framework for structured, agent-assisted software delivery.

## Rules

- Use Conventional Commits for every commit.
- Before pushing, run `uv sync --frozen && (cd docs-site && npm ci) && uv run --frozen tools/quality.py` on `HEAD`
  in the exact checkout you are about to push. It mirrors the checks in `.github/workflows/quality.yaml`.
- Run `uv run pre-commit install` once per clone; the commit hook runs the Python-side lint and validation from the quality script.

- Skill validation rules are in `tools/skill-validator.md`.
- Deterministic skill checks run via `uv run tools/validate_skills.py --strict` (included in the quality script).
- Documentation conventions are in `docs/_STYLE_GUIDE.md`.

## Writing prompts

Skills, workflows, tasks, and agent definitions are prompt text that an agent reads in full on every run. Length and
ambiguity are paid on every run; a corner case is paid only when it occurs. So do not add instructions for exotic
cases — the model usually handles them from context, and the reviewing human can correct it when it does not.

## Skill activation

`bmad-build`, `bmad-build-auto`, `bmad-code-review`, `bmad-retrospective`, and `bmad-walkthrough` activate through
the shared `_bmad/scripts/render_skill.py`, which publishes an immutable, content-addressed snapshot of the merged
config under `_bmad/render/` with a `manifest.json` of renderer and source hashes instead of re-resolving
customization on every read (#2601, #2657). `bmad-correct-course` and `bmad-deep-recon` still call
`resolve_customization.py` and `resolve_config.py` directly, while `bmad-review` calls `resolve_customization.py`
and falls back to `customize.toml` — an older path kept for now and pending migration to `render_skill.py`. New
skills should default to `render_skill.py`.

## Testing

Automated tests assert outcomes produced by deterministic code. Do not write automated tests for LLM output or for
static source text.

## Releases

Read `tools/release.md` before cutting a release. Stamp on `dev`, fast-forward
`main` with `git push origin dev:main`, tag that commit, then stamp the next
placeholder on `dev`. No release PR or back-merge. The 6.12 npm installer is
maintained separately on `V6.12`.
