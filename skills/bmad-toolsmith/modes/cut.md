# Cut

Rewrite a skill's prose into the fewest words that steer the model as far, for a skill built elsewhere or one the user wants tightened. The bar is `canon.md` and `lenses/lens-leanness.md`; this mode applies it file by file and checks that no rule was lost. A skill Smithy writes gets the same pass in `ship.md`. Its outcome: every prompt file of `{target}` rewritten or left as already lean, every rule, convention, reference, protected passage and decision intact, nothing committed, and the user reading the diff beside the before and after table.

## Protected passages

Set `{target}` to the skill folder. Protected by default: each file's frontmatter, which holds the `description`; an agent's `customize.toml`, which holds its persona; and what a shape template put there, a rendered skill's `SKILL.md` and the activation section of its `workflow.md`. `cut_plan.py` protects all of these itself except that section, which you pass as `--protect workflow.md#<its heading>`. Ask once what else to protect: a passage kept for its voice, a whole file or section, a decision. When the work on this skill comes from a ticket, the `Decision:` lines in its Notes are decisions every cutter keeps.

## Plan

Run `uv run {skill-root}/scripts/cut_plan.py plan {target} [--protect <path>[#<heading>] ...] --out {reports_folder}/<YYYYMMDD-HHMMSS>-<skill>-cut-plan.json`. The saved JSON is the baseline `measure` reads; each file's `old_command` prints its version from before the cut; a file with `cut` false is protected or under the floor. Show the plan in chat: each file with its tokens, the files not cut, the protected passages, the decisions. Then wait for the user's go.

## Examples

Before the cutters run, take each worked example (a sample artifact, a filled-in template, a transcript) through test 8 in `canon.md` with the user, settling a doubtful one with a fresh subagent given the rule without the example, and make the agreed edit yourself. Cutters left to it keep examples in.

## Rewrite and check

Launch one subagent per file with `cut` true, in parallel, with the Cutter prompt from `modes/cut-roles.md`, filled with the file, its `names`, the protected passages in it, and the decisions. Then run `uv run {skill-root}/scripts/cut_plan.py measure {target} --baseline <plan json>` and restore, from each file's `old_command`, every item it lists under `lost` and every file under `missing`. Then one subagent per rewritten file runs the Checker. Restore each loss and meaning change it lists as the shortest sentence that states it, and apply the shorter wordings you agree with.

Run the list under Checks in `ship.md` and fix until clean. When `SKILL.md` calls `render_skill.py`, render the skill with `uv run --no-cache {project-root}/_bmad/scripts/render_skill.py --project-root {project-root} --skill {target}`, once as shipped and once per allowed value of each selector with `--set workflow.<key>=<value>`; each render finishes without error. Where that script does not exist, report the render as not run.

## Hand over

Run `measure` once more and restore anything it lists. Give its numbers in chat as a table: file, before, after, percent, and the total. Under it list the Cutters' doubts and any loss you chose not to restore, with why. Commit nothing; the user reads `git diff -- {target}` or `diff -ru <copy> {target}` and commits what they accept.

Without subagents, run each role inline, one file at a time, and say so; read the old version again before checking your own rewrite, and name your judgment on test 8 as judgment.
