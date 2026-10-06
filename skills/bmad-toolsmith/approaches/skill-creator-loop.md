# Skill-creator loop

Anthropic's skill-creator loop with BMad's shapes, packaging and harness. Its outcome: a skill iterated on measured results, its description tuned by a trigger eval.

## Draft

Scaffold (`uv run {skill-root}/scripts/init_skill.py --name <name> --dest <parent folder> --shape <shape> --description "..."`, with `--bmod <record> --source <update_source>` for a member), load `shapes/<shape>/shape.md` and the module shape the read-back's registration line names, write `SKILL.md` to `canon.md`. Make the description deliberately specific, because widening one that stays quiet is easier than narrowing one that fires everywhere.

## Measure

Write 2 to 3 realistic prompts into `{target}/evals/cases.json` with empty rubrics, from the user's real requests. Load `approaches/eval-loop.md` and run it to a stop condition.

## Description round

If `{target}/evals/triggers.json` is absent, write it to the spec in `ship.md` under Trigger eval. Then invoke the `bmad-eval` skill in trigger mode with its description-optimization loop on `{target}`; it splits, measures, revises and picks. Apply the winning description.

## BMad's step

The customization decision: does a team need to swap a rule or step without forking? Then `customize.toml` and the rendered shape, else nothing. The canon pass is the lens round in `ship.md`.

## Then

Load `ship.md`.
