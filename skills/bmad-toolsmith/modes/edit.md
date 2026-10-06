# Edit

Change a skill that exists, built by Smithy or not. Its outcome: the change the user asked for, applied to the canon's standard, with nothing else disturbed.

## Read

Set `{target}` to the skill folder. Read `SKILL.md` and only the files the change touches; the rest stays unread so it stays unchanged.

## Agree the change

One read-back, then wait: what changes, what stays, whether the shape changes (a menu added to a plain skill, memory added to an agent), whether the description changes. A description change is a trigger change; say so.

## Rebuild instead

When the user wants to rethink the skill from its outcomes rather than adjust it, that is a build: say so and load `discover.md` with the old skill as the mined input. Its files are reference material, not the starting point.

## Apply

Make the change to `canon.md` and cut any line the change makes dead. Fit the existing voice and structure, so a reader sees no seam. When the change touches the description or adds a capability, write or extend `{target}/evals/triggers.json` with queries for the new ground and near misses beside it, so ship's trigger eval covers what changed. For a rendered skill, edit the sources (`workflow.md`, `step-*.md`, `customize.toml`), never the rendered snapshot. For an agent, a new capability is a `references/<capability>.md` or a named skill, added to the menu.

## Then

Load `ship.md`.
