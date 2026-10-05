# Eval-first

For an output that can be checked objectively and a user who wants proof. Its outcome: the cases exist before the skill does, so the skill is built to pass them and the passing run is on record.

## Cases before code

From the discovery, write `{target}/evals/cases.json` (`{id, input, rubric[], state_prefix, files[]}`). Inputs are the user's real requests where they exist, as messy as they were typed. Each rubric entry is a PASS or FAIL condition over the output, the transcript or the files, never a quality adjective. A `state_prefix` reaches a mid-flow turn in one shot. Show the file and confirm it with the user, because cases they do not believe in prove nothing to them.

## Smallest skill

Scaffold with `uv run {skill-root}/scripts/init_skill.py --name <name> --dest <parent folder> --shape <shape> --description "<approved description>"`, adding `--bmod <record> --source <update_source>` when the read-back registers it as a member, and load `shapes/<shape>/shape.md`, then the module shape the registration line names, if any. Write `SKILL.md` to `canon.md`, aimed at the cases, never to the rubric word for word, because a skill that quotes its grader passes the test and fails the user.

## Loop

Load `approaches/eval-loop.md` and run it to a stop condition.

## Then

Tell the user which run folder holds the passing run, and which cases still fail if they stopped early. Load `ship.md`.
