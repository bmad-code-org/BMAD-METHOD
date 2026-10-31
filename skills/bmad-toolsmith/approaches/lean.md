# Lean

The outcome: the smallest skill that does the job, tried once on the user's real input before it is polished, at `{target}`.

## Scaffold

`uv run {skill-root}/scripts/init_skill.py --name <name> --dest <parent folder> --shape <shape> --description "<approved description>"`, with `--dirs` for only the folders the read-back listed and `--bmod <record> --source <update_source>` when the read-back registers it as a member.

A single-skill module, the default, gets its `bmod.toml` and `help/help.md` from `shapes/single-skill-module/shape.md` at the write step.

Then load `shapes/<shape>/shape.md`.

## Write the smallest version

Write `SKILL.md` to `canon.md`. Show the draft and the description in chat before writing any further file, because a user who moves the bar now saves every file written after it.

## Try it

When the user has a real input, run the skill on it once through a subagent that sees only `{target}` and the input, and read the trace, not just the output.

What the trace means:

- Several approaches tried before one worked, or stalling between alternatives: no default was named. Name one.
- An instruction followed where it did not apply: narrow its condition.
- The same helper rewritten each run: bundle it as a script.
- A line the run never needed: cut it.

Fix what the trace shows, once, and record the decision.

Where discovery ran the trigger phrase bare, compare against it: a line that changed nothing goes. Otherwise judge the trace against the read-back's outcome and bar.

Without a real input, ask for one; if none exists, apply the canon's tests line by line and tell the user the skill has not run.

## Then

Load `ship.md`, which runs the lenses and offers evals; run neither here.
