# Skill-creator loop

The outcome: a skill iterated on measured results, its description tuned by a trigger eval. Bare paths resolve from `{skill-root}`.

## Draft

Scaffold (`uv run "{skill-root}/scripts/init_skill.py" --name <name> --dest <parent folder> --shape <shape> --description "..."`, with `--bmod <record> --source <update_source>` for a member), load `shapes/<shape>/shape.md` and the module shape the execution plan's registration line names, write `SKILL.md` to `canon.md`.

Make the description deliberately specific: widening is easier than narrowing.

## Measure

Load `approaches/eval-loop.md` for the case format. Write two or three cases into `{evals}/cases.json` with empty rubrics, seeded from the user's real requests and transcripts before inventing any, because invented cases come out homogeneous and easy; the loop writes each rubric after the first outputs. Run the loop to a stop condition.

## Description round

If `{evals}/triggers.json` is absent, write it from the discovery: 8 to 10 queries that should fire, varied in wording and buried in larger requests, and 8 to 10 near misses that share vocabulary but should not. Then copy `{target}` to `{reports_folder}/<YYYYMMDD-HHMMSS>-<skill>-trial/` and invoke the `bmad-eval` skill in trigger mode with its description-optimization loop on that copy and `{evals}/triggers.json`, since the loop rewrites the description it measures. Show the winning description and write it into `{target}/SKILL.md` on a yes.

## Then

Load `ship.md`.
