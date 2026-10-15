# Cut

Rewrite a skill's prose into the fewest words that steer the model as far, for a skill built elsewhere or one the user wants tightened. The bar is `canon.md` and `lenses/lens-leanness.md`; this mode applies it file by file and checks that no rule was lost. A skill Smithy writes gets the same pass in `ship.md`. Its outcome: every prompt file of `{target}` rewritten or left as already lean, every rule, convention, reference, protected passage and decision intact, nothing committed, and the user reading the diff beside the before and after table.

## Protected passages

Set `{target}` to the skill folder. Protected by default: each file's frontmatter, which holds the `description`; an agent's `customize.toml`, which holds its persona; and what a shape template put there, a rendered skill's `SKILL.md` and the activation section of its `workflow.md`. `cut_check.py` reports a changed frontmatter itself; pass the rest to it as `--protect <file>` or `--protect <file>#<heading>`. Ask once what else to protect: a passage kept for its voice, a whole file or section, a decision. When the work on this skill comes from a ticket, the `Decision:` lines in its Notes are decisions every cutter keeps.

## Plan

Copy `{target}` to `{reports_folder}/<YYYYMMDD-HHMMSS>-<skill>-before/`; that copy is the old version every later step reads. Count it with `uv run {skill-root}/scripts/count_tokens.py <copy>`. The prompt files are the `.md` files outside `scripts/` and the root `customize.toml`; leave protected files and those under about 150 tokens uncut. Show the plan in chat: each file with its tokens, the files not cut, the protected passages, the decisions. Then wait for the user's go.

## Examples

Before the cutters run, take each worked example (a sample artifact, a filled-in template, a transcript) through test 8 in `canon.md` with the user, settling a doubtful one with a fresh subagent given the rule without the example, and make the agreed edit yourself. Cutters left to it keep examples in.

## Rewrite and check

Launch one subagent per file to cut, in parallel, with the Cutter prompt from `modes/cut-roles.md`, filled with the file, the protected passages in it, and the decisions. Then run `uv run {skill-root}/scripts/cut_check.py <copy> {target} [--protect ...]` and restore, from the copy, every item it lists under a file's `lost` and every file under `missing`. Then one subagent per rewritten file runs the Checker. Restore each loss and meaning change it lists as the shortest sentence that states it, and apply the shorter wordings you agree with.

Run the list under Checks in `ship.md` and fix until clean. When `SKILL.md` calls `render_skill.py`, render the skill with `uv run --no-cache {project-root}/_bmad/scripts/render_skill.py --project-root {project-root} --skill {target}`, once as shipped and once per allowed value of each selector with `--set workflow.<key>=<value>`; each render finishes without error. Where that script does not exist, report the render as not run.

## Hand over

Run `cut_check.py` once more and restore anything it lists. Run `count_tokens.py` on `{target}` and give a table in chat: file, tokens before (from the copy), after, percent, and the total. Under it list the Cutters' doubts and any loss you chose not to restore, with why. Commit nothing; the user reads `diff -ru <copy> {target}` and commits what they accept.

Without subagents, run each role inline, one file at a time, and say so; read the old version again before checking your own rewrite, and name your judgment on test 8 as judgment.
