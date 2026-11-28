# Ship

Outcome: the skill at `{target}` has been through the lenses and improved from them, is valid, installable, measured for cost and offered a trigger eval, and the user knows where it is and what to do next.

`{target}` is the skill folder, or the module folder after package or migrate: then the per-skill checks and the cost run for each member, and the manifest check for the record. Bare paths resolve from `{skill-root}`.

`{reports_folder}` was set at activation; if this session no longer holds it, run that step again. When the conversation no longer holds the execution plan, read it from `{reports_folder}/<name>-build/plan.md`.

Run `uv run "{skill-root}/scripts/prepass.py" "{target}"`, for a module on the record and on each member; the sections below read its JSON.

## Manifest

The pre-pass `bmod_kind` must match the execution plan's registration line: `skill` for a member, `record` for a module's record folder, `record+skill` for a single-skill module, `none` for a plain skill.

Fix a mismatch here: write the missing `bmod.toml`, help and record edits from the shape the line names, `shapes/single-skill-module/shape.md` or `shapes/multi-skill-module/shape.md`. Dependencies and install below fills the dependency lists.

Never write `module.yaml`, `module-help.csv` or a setup skill; those are the old format.

## Refine

Run this section for a skill Smithy wrote or rewrote this session (a build, a conversion). Skip it for a scaffold that still has `[TODO:` markers and for a skill the user owns (after edit, package or migrate); Handoff offers the review instead.

A small skill, whose only prompt files are `SKILL.md` and `help/help.md` and which has no scripts and no `customize.toml`, gets only the leanness and trigger lenses, one round, and no Checker; `cut_check.py` and every other section still run.

Copy `{target}` to `{reports_folder}/<YYYYMMDD-HHMMSS>-<skill>-before/`, unless convert already made that copy this session, then launch one subagent per lens in parallel: `lenses/lens-architecture.md`, `lenses/lens-determinism.md`, `lenses/lens-leanness.md`, `lenses/lens-customization.md`, `lenses/lens-trigger.md`. Give each the pre-pass JSON and the absolute paths of `{target}`, its lens file, `canon.md`, `lenses/lens-contract.md` and `lenses/standards.md`. Inline, one at a time, when subagents are unavailable; say so.

Apply without asking what changes no behavior: a defect against the standards or the canon's tests, and a leanness finding whose `proposed_smallest` keeps every rule; the lean version is the default, and the check below guards it. Put the rest to the user in one list, each with its fix, before applying any of it: a finding that changes what the skill does or how it sounds (a cut rule, a persona line, a split into two skills) or undoes the approved execution plan (name, purpose, shape, location). When the user asked to move fast, apply none of these and list them in the summary.

When a high or critical finding was fixed, rerun the pre-pass and the lenses once more; stop after two rounds.

Then run `uv run "{skill-root}/scripts/cut_check.py" <copy> "{target}"`, adding `--protect-text` with the `<YYYYMMDD-HHMMSS>-<skill>-protected.txt` file in `{reports_folder}` when the execution plan named passages to keep word for word. Restore, from the copy, each item under `lost` that no finding meant to remove. One subagent per changed prose file runs the Checker from `modes/cut-roles.md`, with `<protected>` as none, since the script compared them, and the plan's decisions; restore each loss and meaning change it lists as the shortest sentence that states it.

Last, say in chat what changed, one line per file; the token table from `cut_check.py`'s `tokens` (before, after and percent per file, and the total); and what was left for the user, with its why.

## Checks

Run the commands under Checks in `modes/validate.md` on `{target}` and fix until clean; after three failed fixes on one finding, stop and show it. After a scaffold, the `[TODO:` findings are the user's to fill; leave them.

## Cost

Rerun the pre-pass when anything changed since it ran. From it, tell the user what `SKILL.md` costs per load (`skill_md_tokens`) and how long the description is (`description_chars`).

Name any part of `SKILL.md` that only some runs use; it belongs in a reference. A `SKILL.md` that every run needs whole stays whole, whatever its size: the count is evidence for that judgment, not a limit.

For a description past its two parts, or with a phrase that is not an anchor, name what to cut.

## Trigger eval

Offer it once, unless it ran this session; run it on a yes. If `{evals}/triggers.json` is absent, write it from the discovery: 8 to 10 queries that should fire, varied in wording and buried in larger requests, and 8 to 10 near misses that share vocabulary but should not. Then invoke the `bmad-eval` skill in trigger mode on `{target}` with `{evals}/triggers.json`.

When the description is revised from failures, change its contexts and anchors, never paste a failed query's words into it, and show the revision before applying it.

## Dependencies and install

See what is installed:

- Agents: `uv run "{project-root}/_bmad/scripts/roster.py" --skill "{skill-root}" --project-root "{project-root}"`.
- Modules and their help: `uv run "{project-root}/_bmad/scripts/knowledge.py" --root "<skills root>"`.
- Everything else: list the user's agent's skills folder; open a `SKILL.md` only when the name is unclear.

From the discovery, decide for each installed skill: `required_skills` when the new skill invokes it, `recommended_skills` when it helps beside it, nothing otherwise.

Write them into `bmod.toml`: under `[bmod]` for a single-skill module or a need of the whole module, under the member's `[skill]` for one member's need. Use a plain name for a skill from the same source, `{ skill = "<name>", source = "<source>", version = "<min>" }` for another, version optional.

For anything named but not installed, offer `npx skills add <repo> --skill <name>`; never run it unasked.

When the built skill replaces another, record the old name in the module record's `retired.toml`: `renamed = [{ from, to }]` for a successor, `removed` for a skill that is gone. `bmad setup` then deletes the stale install and moves its `_bmad/custom/` files.

Smithy does not publish. When the user names a marketplace or registry, fetch its current docs.

## Handoff

Tell the user:

- Where the skill is.
- When it was written where their agent reads skills: that it is live now, and that updates are theirs to make because the skills CLI will not track it. Otherwise, how to make it live: a symlink into that folder, or `npx skills add <repo> --skill <name>` once it is pushed.
- One request to try first.
- How it is registered. For its own record: ask `bmad setup <code>`, which creates the module's scripts folder and asks its questions. For a member: the record files that changed. For a plain skill, once: `bmad` help, setup and update checks will not see it.

Offer, not run: a review (`modes/review.md`) and a baseline eval with the `bmad-eval` skill on the user's own cases.

When a module plan is recorded at `{reports_folder}/bmod-<code>-build/plan.md`, mark this member built there, run the checks on the record, and offer the next member in its build order; on a yes, load `discover.md` for it.
