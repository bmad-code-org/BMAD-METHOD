# Convert

A skill, prompt, custom command, Cursor rule, GPT or system prompt from another tool becomes a BMad skill. Its outcome: the same know-how as the smallest BMad skill, in the shape it needs.

## Read and extract

Read the source whole. Pull out the outcome it produces, who consumes it, the triggers (when the author meant it to fire), the know-how a model would not have, and any scripts. Note what it depends on from its host: tools, variables, other files.

## Drop

The host tool's mechanics: its frontmatter keys (`globs`, `alwaysApply`, `argument-hint`, `model`), slash-command syntax and `$ARGUMENTS`, GPT conversation starters, knowledge-file uploads. And the instructions the model already follows unasked: be helpful, think step by step, format as markdown. The canon's core test decides; keep only what prevents a failure.

## Frontmatter

The agentskills.io spec allows `name` and `description`, and optionally `license`, `compatibility`, `metadata` and `allowed-tools`. BMad uses the first two only: `description` is the whole trigger and `allowed-tools` is a host concern.

## Shape

Most sources land on a plain skill. A persona with a menu of things it does lands on an agent; a source whose scripts do most of the work on a script utility; a set of related commands on a module. Say the shape and the one line of why.

## In place

When the source is already a skill folder and the user wants it brought to BMad rather than rebuilt beside it, work in that folder. The read-back lists what will change and nothing is touched before approval: the name, kept unless the user wants their prefix on it; the description, rewritten to the canon; paths and config reads, brought to `lenses/standards.md`; `bmod.toml` with both tables when the user wants a single-skill module, from `shapes/single-skill-module/shape.md`; what is dropped, by file. Then `ship.md`, where the lenses run over the result. Discovery itself is skipped; its five questions are answered by the skill as it stands.

## Hand-off

Load `discover.md` with the extraction as the mined input: discovery confirms the outcome, consumer and trigger phrases from it and asks only for what the source never said, usually the consumer, the near misses, and the name, since a source is usually named for its host. From the read-back on, the approach is lean. Leave the source untouched; the user may still run it where it lives.
