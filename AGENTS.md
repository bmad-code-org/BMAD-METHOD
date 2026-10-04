<!-- bmad:context -->
<!-- Verified 2026-10-04 against 3cae711e. Managed by bmad-project-context; edits inside this block are replaced on refresh. Keep anything you want preserved outside the markers. -->

# BMAD-METHOD

Open source framework for structured, agent-assisted software delivery. Skills live in `skills/`, Python tooling in `tools/`, the Astro docs site in `docs-site/`, and documentation in `docs/`.

## Policy

- Use Conventional Commits for every commit.
- No tool or model attribution, anywhere.
- Push only when explicitly requested. Commit first; the worktree must be clean with no untracked files.
- Pull requests: branch from and target `dev` branch. Verify with `gh pr view` after creating.
- Never push to `main` except by following `tools/release.md`. Legacy npm installer is maintained separately on `V6.12` branch.

## Where things are

- Skill validation rules: `tools/skill-validator.md`.
- Rules shared by every skill that reads or writes the ticket tree: `tools/ticket-tree-rules.md`.
- Documentation conventions: `docs/_STYLE_GUIDE.md`.

## Running and verifying

- To validate skills: `uv run tools/validate_skills.py --strict`.
- To run the Python tests: `uv run --frozen python -B -m pytest`.

## Conventions that differ from defaults

- Skills, workflows, tasks, and agent definitions are prompt text an agent reads in full on every run. Length and ambiguity are paid on every run; a corner case is paid only when it occurs. So do not add instructions for exotic cases — the model usually handles them from context, and the reviewing human can correct it when it does not.
- Write template conditionals as block-level `{% if %}` on their own lines, never inside a sentence; a whitespace-only difference in one rendered variant is an acceptable price for readable source.
- Leave runtime choices as prose: when the model decides a value while running, the alternatives stay in the text. Render-time conditionals are only for values fixed before the render.
- Prefer deleting an instruction to hedging it.
- Automated tests assert outcomes produced by deterministic code. Do not write automated tests for LLM output or for static source text.

<!-- /bmad:context -->
