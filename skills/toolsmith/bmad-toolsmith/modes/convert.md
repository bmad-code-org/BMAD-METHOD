# Convert

A skill or prompt from another tool becomes the smallest BMad skill that holds the same know-how, in the shape it needs.

## Read and extract

Read the source whole. Extract its outcome, who consumes it, when the author meant it to fire, the know-how a model would not have, any scripts, and what it depends on from its host.

## Drop

The canon's core test decides; keep only what prevents a failure. That drops:

- The host tool's mechanics, slash-command syntax and `$ARGUMENTS` included.
- Instructions the model already follows unasked.

## Frontmatter

BMad uses `name` and `description` only, not the agentskills.io spec's optional `license`, `compatibility`, `metadata` or `allowed-tools`: `description` is the whole trigger and `allowed-tools` is a host concern.

## Shape

Say the shape and the one line of why:

- A persona with a menu: an agent.
- Scripts doing most of the work: a script utility.
- A set of related commands: a module.
- Anything else, as most sources are: a plain skill.

## In place

When the source is already a skill folder and the user wants it brought to BMad rather than rebuilt beside it, work in that folder.

The execution plan lists what will change, and nothing is touched before approval:

- The name, kept unless the user wants their prefix on it.
- The description, rewritten to the canon.
- Paths and config reads, brought to `lenses/standards.md`.
- `bmod.toml` with both tables when the user wants a single-skill module, from `shapes/single-skill-module/shape.md`.
- What is dropped, by file.
- The passages the user wants kept word for word.

Then `ship.md`, where the lenses run over the result and their leanness findings are applied.

Skip discovery; the skill as it stands answers discovery's five questions.

## Hand-off

Load `discover.md` with the extraction as the mined input: discovery confirms the outcome, consumer and trigger phrases and asks only for what the source never said, usually the consumer, the near misses, and the name, since a source is usually named for its host.

From the execution plan on, the approach is lean.

Leave the source untouched; the user may still run it where it lives.
