# Lean

The outcome: the smallest skill that does the job for its consumer, tried once on the user's real input before it is polished, at `{target}`. Bare paths resolve from `{skill-root}`.

## Scaffold

`uv run "{skill-root}/scripts/init_skill.py" --project-root "{project-root}" --name <name> --dest <parent folder> --shape <shape> --description "<approved description>"`, with `--dirs` for only the folders the execution plan listed and `--bmod <record> --source <update_source>` when the execution plan registers it as a member.

Load `shapes/<shape>/shape.md`, then the module shape the registration line names, if any.

## Write the smallest version

Write `SKILL.md` to `canon.md`. Show the draft and the description in chat before writing any further file, because a user who moves the bar now saves every file written after it.

## Try it

When the user has a real input, run the skill on it once through a subagent that sees only `{target}` and the input, and read the trace, not just the output.

What the trace means:

- Several approaches tried before one worked: the instruction is too vague; say what to do.
- Stalling between alternatives: no default named; name one.
- An instruction followed where it does not apply: narrow its condition.
- The same helper rewritten each run: bundle it as a script.
- A line the run never needed: cut it.

Fix what the trace shows, once, and add each fix as a line under `## Changes` in `{reports_folder}/<name>-build/plan.md`, or keep it in the conversation when there is no `_bmad/`.

Where discovery ran the trigger phrase bare, compare against it: a line that changed nothing goes. Otherwise judge the trace against the execution plan's outcome and bar.

Without a real input, ask for one; if none exists, apply the canon's tests line by line and tell the user the skill has not run.

## Then

Load `ship.md`, which runs the lenses and offers evals; run neither here.
