# Edit

Change an existing skill, built by Smithy or not, as the user asked, and disturb nothing else.

## Read

Set `{target}` to the skill folder. Read `SKILL.md` and only the files the change touches; what stays unread stays unchanged.

## Agree the change

One read-back, then wait: what changes, what stays, whether the shape changes (a menu added to a plain skill, memory added to an agent), whether the description changes. A description change is a trigger change; say so.

## Rebuild instead

When the user wants to rethink the skill from its outcomes rather than adjust it, that is a build: say so and load `discover.md` with the old skill as the mined input, not the starting point.

## Apply

Make the change to the standard of `canon.md` and cut any line the change makes dead. Fit the existing voice and structure.

When the change touches the description or adds a capability, write or extend `{target}/evals/triggers.json` with queries for the new ground and near misses, so ship's trigger eval covers the change.

For a rendered skill, edit the sources (`workflow.md`, `step-*.md`, `customize.toml`), never the rendered snapshot.

For an agent, a new capability is a `references/<capability>.md` or a named skill, added to the menu.

## Then

Load `ship.md`.
