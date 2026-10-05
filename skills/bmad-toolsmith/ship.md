# Ship

The tail every build and every file-writing mode ends with. Its outcome: the skill at `{target}` has been through the lenses and improved from them, is valid, installable, measured for cost, offered a trigger eval, and the user knows where it is and what to do next.

`{target}` is the skill folder, or the module folder after package or migrate: then the per-skill checks and the cost run for each member skill, and the manifest check for the record. `{reports_folder}` was set at activation; if this session no longer holds it, run that step again.

## Manifest

The pre-pass reports `bmod_kind`. It must match the read-back's registration line: `skill` for a member, `record+skill` for a single-skill module, `none` for a plain skill. A mismatch is fixed here, not noted: write the missing `bmod.toml`, help and record edits from the shape the line names, `shapes/single-skill-module/shape.md` or `shapes/multi-skill-module/shape.md`. `ecosystem.md` fills the dependency lists below. Never write `module.yaml`, `module-help.csv` or a setup skill; those are the old format.

## Refine

For a skill Smithy wrote or rewrote this session (a build, a conversion), not a scaffold with `[TODO:` markers and not a skill the user owns after edit, package or migrate, where the review is offered instead. Run `uv run {skill-root}/scripts/prepass.py {target}`, then one subagent per lens in parallel: `lenses/lens-architecture.md`, `lenses/lens-determinism.md`, `lenses/lens-leanness.md`, `lenses/lens-customization.md`, `lenses/lens-trigger.md`, each given the pre-pass JSON, `{target}`, its lens file, `lenses/lens-contract.md` and `lenses/standards.md`. Inline, one at a time, when subagents are unavailable; say so.

Apply what is a defect against the standards or the canon's tests: a path that does not resolve, a description without its `Use when` or its exclusions, a declared customization value the body never reads, prose doing a script's work, a line a capable model follows unasked. Leave what is a judgment call: a cut whose value is uncertain, a persona line, a split into two skills; a cut is a hypothesis for a variant eval, not a verdict. Never apply a finding that undoes the approved read-back (name, purpose, shape, location) without asking. When a high or critical finding was fixed, run the lenses once more; stop after two rounds. Then say in chat what changed, by file in one line each, and what was left for the user with its why.

## Checks

Run and fix until clean; after three failed fixes on one finding, stop and show it.

- `uv run {skill-root}/scripts/init_skill.py --check {target}` (`--any-name` outside the BMAD-METHOD repo)
- `uv run {skill-root}/scripts/scan_paths.py {target}`
- `uv run {skill-root}/scripts/scan_scripts.py {target}` and the skill's tests, when it has scripts
- `uv run {project-root}/_bmad/scripts/validate_manifests.py --project-root <repo root>` in a repository with `skills/*/bmod.toml`

`modes/validate.md` says what each covers; it is not needed here.

## Cost

`uv run {skill-root}/scripts/count_tokens.py {target}`. Tell the user what `SKILL.md` costs per load and how long the description is; the description is paid on every session whether the skill fires or not. Over about 800 tokens in a plain skill's `SKILL.md`, or 1,200 in an agent's, name what could move to a reference; the measure is what a run loads, not the skill's total. Over 500 characters of description, name the clauses that are not anchors.

## Trigger eval

Offer it once; run it on a yes. If `{target}/evals/triggers.json` is absent, write it from the discovery: 8 to 10 queries that should fire, varied in wording and buried in larger requests, and 8 to 10 near misses that share vocabulary but should not. Then invoke the `bmad-eval` skill in trigger mode on `{target}`. When the description is revised from failures, change its contexts and anchors, never paste a failed query's words into it.

## Dependencies and install

Load `ecosystem.md`: it settles what the skill requires or recommends, writes that into `bmod.toml`, and gives the install command for anything missing.

## Handoff

Tell the user: where the skill is; that it is live now when it was written where their agent reads skills (the skills CLI will not track it, so updates are theirs to make), or how to make it live otherwise (a symlink into that folder, or `npx skills add <repo> --skill <name>` once it is pushed); one request to try first; how it is registered: for its own record, ask `bmad setup <code>`, which creates the module's scripts folder and asks its questions; for a member, the record files that changed; for a plain skill, once, that `bmad` help, setup and update checks will not see it. Offer, not run: a review (`modes/review.md`) and a baseline eval with the `bmad-eval` skill, which measures the skill against the bare model on the user's own cases; this is where that question is answered, with numbers rather than one run, and for a skill that will be distributed it is the only place it can be.
