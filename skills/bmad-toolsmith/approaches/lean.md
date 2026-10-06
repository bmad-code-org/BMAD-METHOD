# Lean

The default approach. Its outcome: the smallest skill that does the job, tried once on the user's real input before it is polished, at `{target}`.

## Scaffold

`uv run {skill-root}/scripts/init_skill.py --name <name> --dest <parent folder> --shape <shape> --description "<approved description>"`, with `--dirs` for only the folders the read-back listed and `--bmod <record> --source <update_source>` when the read-back registers it as a member; a single-skill module's record and help come from `shapes/single-skill-module/shape.md` at the write step. Then load `shapes/<shape>/shape.md` for the files the shape emits and the rules they follow.

## Write the smallest version

Write `SKILL.md` to `canon.md`. Show the draft and the description in chat before writing any further file, because a user who moves the bar now saves every file written after it.

## Try it

When the user has a real input (a request they made by hand, a file, a transcript), run the skill on it once in a fresh context, a subagent that sees only `{target}` and the input, and read the transcript, not just the output. What the trace means:

- Several approaches tried before one worked: an instruction is too vague. Name the default.
- An instruction followed where it did not apply: too broad. Narrow its condition.
- Stalling between alternatives: no default was named. Name one.
- The same helper rewritten each run: bundle it as a script.
- A line the run never needed: cut it.

Fix what the trace shows, once, and record the decision. Where discovery ran the trigger phrase bare, compare against it: what the skill changed is what it is for, and a line that changed nothing goes. Otherwise judge the trace against the read-back's outcome and bar. Without a real input, ask for one; if none exists, apply the canon's tests line by line and tell the user the skill has not run.

## Then

Load `ship.md`. The lenses run there and the skill improves from them; evals are offered there, not run here.
