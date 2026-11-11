---
title: 'Eval Runner'
description: 'Measure whether a skill works with bmad-eval: baseline, variant, quality, and trigger runs in a clean working directory, with a permanent record of each run.'
sidebar:
  order: 13
---

`bmad-eval` runs a skill through your own coding tool in a clean working directory and reports what came back. Use it to find out whether a skill beats the bare model, whether a change helped, whether the output meets a standard, and whether the description fires on the right requests.

Smithy offers an eval at the end of every build and runs `bmad-eval` from its menu, so you will usually reach it there. Call it directly when you have a skill and cases and want the numbers.

## The Four Modes

| Mode | Question it answers | Use it when |
| --- | --- | --- |
| Baseline | Does the skill beat the bare model on the same input? | You want to know whether a skill is worth keeping, or before a release |
| Variant | Does a section earn its place, or does a stripped or prior version do as well? | You cut or changed something and want to know if it mattered |
| Quality | Does the output meet the case's rubric? | You know what good output looks like and want each case graded |
| Trigger | Does the description fire when it should and stay quiet otherwise? | A skill does not fire, fires on the wrong things, or is newly built |

A skill the bare model matches should be retired, not patched. The bare model improves with each release, so a baseline run is worth repeating.

## Run an Eval

Ask for a run in plain words, naming the skill and the mode.

```text
Run a baseline eval on skills/acme-release-notes with 3 runs per case.
```

`bmad-eval` finds the cases in the skill's `evals/` folder, then in `evals/<skill-name>/` under the project. It will not invent cases. It shows a summary before starting: the skill, cases, modes, output folder, and command.

:::caution[Runs bypass permission prompts]
Nobody is there to answer a prompt, so runs turn them off. They are not contained unless the recorded command wraps your tool in a sandbox.
:::

## Write Cases

A case is an input, a rubric, an optional `state_prefix`, and optional fixture files. Cases live in `evals/cases.json`, and [Eval Format](../reference/eval-format.md) has the full format.

- **Use real inputs.** Copy real requests, with their typos and casual wording. A tidy input tests a situation the skill rarely meets.
- **Write rubric entries a wrong output cannot pass.** "`brief.md` exists" passes for an empty file. "`brief.md` names the mid-market insurer segment" does not.
- **Check process as well as output.** A transcript shows which tools ran and in what order. Most of these checks are simple reads, so they need little judgment.
- **Reach mid-workflow turns with a `state_prefix`.** It tells the skill what already happened, so one message can test a clarifying turn or a correction.

Skills that coach or facilitate are hard to grade. Skip the rubric for these and judge the output yourself. A trigger eval still applies.

## How Many Runs

Firing and output are both probabilistic, so one run proves little. Three runs per case is the floor for a settled result, and a result from fewer is reported as a quick look. More runs give a variance figure, or show a difference between two versions. A pass on every run is a pass. A pass on one run in three is a lead to follow.

## Trigger Evals

The description is a skill's only trigger, so a trigger eval runs queries through your real tool and records whether the skill loaded. Each query is marked should-fire or should-not.

The should-not queries matter most when they are near misses: requests that share words and domain with the real ones but belong elsewhere, such as debugging a workflow when the skill builds one. A query that obviously belongs to another skill teaches nothing.

When queries fail, the description is changed in its situations and boundaries, never by pasting in a failed query. `bmad-eval` can also run an optimization loop that improves the description against a held-out test set, so the rewrite does not overfit.

## What Keeps a Run Clean

Each case runs in a temporary folder outside your project, with a copy of the skill and a fresh home folder. Your own skills, memory, settings, and project instructions do not load, unless the recorded `env` or `home_files` bring them in. To test firing, the staged skill asks for a token at the start of the reply, and seeing that token proves the skill loaded on any tool.

Grading is independent too. The grader reads the output, gives no partial credit, puts the burden of proof on a pass, and flags checks that pass for trivial reasons.

## Which Tool Runs It

Evals run through the coding tool you are already using, such as Claude Code or Codex. `bmad-eval` ships no list of tools. The first time it runs in a project, your agent works out four facts about its own tool and proves them on one case:

- The command for one non-interactive run
- The folder it reads skills from
- The environment variables a run needs
- The files that keep it logged in

These are recorded in `bmad-eval`'s customization through `bmad-customize`, where you can read and change them.

## Read the Results

Every run is a timestamped folder in the eval-reports folder inside your output folder. Each case has a subfolder with its prompt, transcript, working directory, and grades. Runs are never deleted or overwritten, so a skill's history stays comparable.

Read the transcripts as well as the grades:

| What you see | What it suggests |
| --- | --- |
| Several approaches before one works | An instruction is too vague |
| An instruction followed where it does not apply | The instruction is too broad |
| Stalling between alternatives | No default was named |
| The same helper rewritten every run | Bundle a script |

Smithy can use these results to improve a skill. See [The Eval Loop](approaches.md#the-eval-loop).
