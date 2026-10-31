# Ship

Outcome: the skill at `{target}` has been through the lenses and improved from them, is valid, installable, measured for cost and offered a trigger eval, and the user knows where it is and what to do next.

`{target}` is the skill folder, or the module folder after package or migrate: then the per-skill checks and the cost run for each member, and the manifest check for the record.

`{reports_folder}` was set at activation; if this session no longer holds it, run that step again.

## Manifest

The pre-pass `bmod_kind` must match the read-back's registration line: `skill` for a member, `record+skill` for a single-skill module, `none` for a plain skill.

Fix a mismatch here: write the missing `bmod.toml`, help and record edits from the shape the line names, `shapes/single-skill-module/shape.md` or `shapes/multi-skill-module/shape.md`. Dependencies and install below fills the dependency lists.

Never write `module.yaml`, `module-help.csv` or a setup skill; those are the old format.

## Refine

For a skill Smithy wrote or rewrote this session (a build, a conversion), not a scaffold with `[TODO:` markers and not a skill the user owns after edit, package or migrate, where the review is offered instead.

Copy `{target}` to `{reports_folder}/<YYYYMMDD-HHMMSS>-<skill>-before/`, then `uv run {skill-root}/scripts/prepass.py {target}`, then one subagent per lens in parallel: `lenses/lens-architecture.md`, `lenses/lens-determinism.md`, `lenses/lens-leanness.md`, `lenses/lens-customization.md`, `lenses/lens-trigger.md`, each given the pre-pass JSON, `{target}`, its lens file, `lenses/lens-contract.md` and `lenses/standards.md`. Inline, one at a time, when subagents are unavailable; say so.

Apply what is a defect against the standards or the canon's tests. Apply every leanness finding too, its `proposed_smallest` included: the lean version is the default, and the check below guards it. Leave what is a judgment call: a persona line, a split into two skills. Ask before applying a finding that undoes the approved read-back (name, purpose, shape, location).

When a high or critical finding was fixed, run the lenses once more; stop after two rounds.

Then run `uv run {skill-root}/scripts/cut_check.py <copy> {target}` and restore, from the copy, each item under `lost` that no finding meant to remove. One subagent per changed prose file runs the Checker from `modes/cut-roles.md`, with what the read-back fixed as its protected passages; restore each loss and meaning change it lists as the shortest sentence that states it.

Last, say in chat what changed, one line per file; the tokens before and after, from `count_tokens.py` on the copy and on `{target}`; and what was left for the user, with its why.

## Checks

Run and fix until clean; after three failed fixes on one finding, stop and show it.

- `uv run {skill-root}/scripts/init_skill.py --check {target}` (`--any-name` outside the BMAD-METHOD repo)
- `uv run {skill-root}/scripts/scan_paths.py {target}`
- `uv run {skill-root}/scripts/scan_scripts.py {target}` and the skill's tests, when it has scripts
- `uv run {project-root}/_bmad/scripts/validate_manifests.py --project-root <repo root>` in a repository with `skills/*/bmod.toml`

`modes/validate.md` says what each covers; it is not needed here.

## Cost

`uv run {skill-root}/scripts/count_tokens.py {target}`. Tell the user what `SKILL.md` costs per load and how long the description is.

Over about 800 tokens in a plain skill's `SKILL.md`, or 1,200 in an agent's, name what could move to a reference; the measure is what a run loads, not the skill's total.

For a description past its two parts, or with a phrase that is not an anchor, name what to cut.

## Trigger eval

Offer it once; run it on a yes. If `{target}/evals/triggers.json` is absent, write it from the discovery: 8 to 10 queries that should fire, varied in wording and buried in larger requests, and 8 to 10 near misses that share vocabulary but should not. Then invoke the `bmad-eval` skill in trigger mode on `{target}`.

When the description is revised from failures, change its contexts and anchors, never paste a failed query's words into it.

## Dependencies and install

See what is installed:

- Agents: `uv run {project-root}/_bmad/scripts/roster.py --skill {skill-root} --project-root {project-root}`.
- Modules and their help: `uv run {project-root}/_bmad/scripts/knowledge.py --root <skills root>`.
- Everything else: list the user's agent's skills folder; open a `SKILL.md` only when the name is unclear.

From the discovery, decide for each installed skill: `required_skills` when the new skill invokes it, `recommended_skills` when it helps beside it, nothing otherwise.

Write them into `bmod.toml` under `[skill]`: a plain name for a skill from the same source, `{ skill = "<name>", source = "<source>", version = "<min>" }` for another, version optional.

For anything named but not installed, offer `npx skills add <repo> --skill <name>`; never run it unasked.

When the built skill replaces another, record the old name in the module record's `retired.toml`: `renamed = [{ from, to }]` for a successor, `removed` for a skill that is gone. `bmad setup` then deletes the stale install and moves its `_bmad/custom/` files.

When the skill sits beside others in a module, add it in place to the record's `skills` list, and to `roster.toml` when it is an agent, matching the existing entries.

Smithy builds and packages offline. The install path from a public repo is `npx skills add <repo> --skill <name>`; say that and no more. When the user names a marketplace or registry, fetch its current docs.

## Handoff

Tell the user:

- Where the skill is.
- When it was written where their agent reads skills: that it is live now, and that updates are theirs to make because the skills CLI will not track it. Otherwise, how to make it live: a symlink into that folder, or `npx skills add <repo> --skill <name>` once it is pushed.
- One request to try first.
- How it is registered. For its own record: ask `bmad setup <code>`, which creates the module's scripts folder and asks its questions. For a member: the record files that changed. For a plain skill, once: `bmad` help, setup and update checks will not see it.

Offer, not run: a review (`modes/review.md`) and a baseline eval with the `bmad-eval` skill, which measures the skill against the bare model on the user's own cases; a distributed skill can answer that nowhere else.
