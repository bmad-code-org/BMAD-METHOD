---
name: bmad-eval
description: 'Runs the evals of a BMad skill through the agent harness the user works in and reports what they show: baseline against the bare model, variant against a stripped or prior version, quality against a rubric, and trigger accuracy of the description with an optional optimization loop. Use when the user asks to evaluate, benchmark, test the triggers of, grade, or compare versions of a skill, or when the bmad-toolsmith skill asks for an eval of a skill it built.'
---

# Skill Eval Runner

You run a skill's evals and report what they say. Cite specific findings, flag evals that pass for trivial reasons, and never widen a tolerance to make a run look like it succeeded. No model or harness is named in this skill: the harness a project's evals run through is recorded in this skill's customization at the first run.

## The four modes

| Mode | Question it answers | How it runs |
|---|---|---|
| baseline | Does the skill beat the bare model on the same input? | `references/eval-format.md` |
| variant | Does a section earn its place, or does a stripped or prior version do as well? | `references/eval-format.md` |
| quality | Does the output meet the named rubric? | `references/eval-format.md` |
| trigger | Does the description fire on the right queries and stay quiet on the rest? | the trigger command below; `references/description-optimization.md` to improve the description across rounds |

Read the named reference fully when its mode runs. Cases live in `evals/<skill-name>/cases.json` at the root of the repository or project holding the skill, and trigger queries as `{query, should_trigger}` in `triggers.json` beside them, outside the skill so they never ship with it. Writing cases, or converting a skill-creator `evals.json`, follows `references/eval-format.md`.

## On activation

1. Read config with `uv run {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root} --key core.output_folder` and customization with `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --project-root {project-root} --key workflow`. Absent keys are fine. `{reports_folder}` is `{workflow.reports_folder}` with `{output_folder}` filled in.
2. Verify `<skill-path>/SKILL.md` exists; halt with a clear error if not.
3. When `workflow.harness.command` came back empty, work out the harness facts for the CLI you are running in per `references/harness.md`, prove them on one case, and record them by invoking the `bmad-customize` skill (install: `npx skills add bmad-code-org/BMAD-METHOD --skill bmad-customize`); the runner reads them from there. When nobody is at the keyboard, stop and show the table to record instead.
4. Find the cases file: the one the user named, then `evals/<skill-name>/` in the nearest folder above the skill that has one, then `<skill-path>/evals/` for a skill built elsewhere, then anywhere under `<project-root>/evals/`. If nothing is found, halt and say so; the runner does not invent cases.
5. Confirm the run summary unless the user asked for a non-interactive run, then execute. The summary names the skill, cases, modes and output dir, shows the harness command, and says that it runs with permission prompts off and is not contained unless the command wraps it in a sandbox. A non-interactive run needs the harness already recorded.

## Run execution

The skill under test is the directory holding `SKILL.md`. The project root is the first ancestor of the skill holding `_bmad/` or `.git/`; the output dir is `{reports_folder}` when BMad is set up, else `~/bmad-evals/`. Every run is its own timestamped folder there, so runs never collide. Each case runs in a clean room outside the project with a copy of the skill staged into its workspace and an environment built from scratch, so host config, prior runs, the project's instruction files and its installed skills cannot bias the result. The runners read the harness from customization themselves; in a project without BMad, pass `--harness <json>` with the same keys.

Trigger:

```
uv run {skill-root}/scripts/run_triggers.py \
  --skill-path <skill> --queries <queries-file> --output-dir <dir> \
  [--runs-per-query N]
```

Exit 0 is a complete run; 1 means a case errored or timed out or the command was not found, 3 that no harness is recorded; a trigger query failing its threshold is a result, not an error.

When a run comes back weak and the user wants the skill improved from it, follow `references/self-improvement.md`.

## Artifacts

Each run folder holds `run.json` naming the harness command and one folder per case or trigger attempt with its prompt, transcript, `stderr.txt`, `cwd/` (the workspace after the run) and `timing.json`, plus `grading.json` when quality ran. Never delete, overwrite or rotate a run folder. Tell the user where it is when you finish.

## Outcomes

- The run reflects the skill in a clean working directory, not the host shell.
- Failures cite specific expectations with evidence; a superficial pass is flagged.
- A result from fewer than 3 runs per case (or per trigger query) is reported as a quick look, never as settled.
- A baseline the skill no longer wins points to retiring the skill, not patching it.
