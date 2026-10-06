# Plain skill

Read this when the user asks what a plain skill contains or how one is laid out. It is the shape most needs land in, and the one Smithy picks when nothing points elsewhere.

## What is in it

- `SKILL.md`: frontmatter with `name` and `description` only, then the body. The description is the whole trigger; the body never repeats when to use it. The body says what the skill produces, for whom, and what must be true of the output, with exact steps only where a wrong move costs something.
- `references/<topic>.md`: a branch the body names and loads only when that branch is reached, one level deep, never a reference that loads another. A skill small enough to be one file is one file.
- `scripts/<name>.py`: work with one right answer per input, run as `uv run`, with a test beside it (`help/craft-scripts.md`).
- `assets/`: templates or files the skill emits or shows as examples.
- `customize.toml`: present when a team will change something without forking: activation hooks, standing facts, a completion hook, an output path, the skill's own settings (`help/craft-customization.md`).
- `bmod.toml`: present when the skill registers with BMad, as a member of a module or as its own single-skill module; absent for a plain skill outside the registry (`help/registration.md`).

## How it behaves

On activation a BMad skill resolves its config and customization through the project's `_bmad/scripts`, then does its job. A skill outside BMad has no activation section at all: plain paths, no config reads. A skill is one or the other, never both; Smithy asks which during discovery.

## Size

The entry file aims near 800 tokens. A complex workflow is still a plain skill when each branch sits in its own reference and loads only when reached (`help/craft-progressive-disclosure.md`).
