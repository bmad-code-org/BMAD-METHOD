---
title: 'Eval Runner'
description: 'Measure whether a skill works with bmad-eval: baseline, variant, quality, trigger and trigger-matrix runs in a clean working directory, with a permanent record of each run.'
sidebar:
  order: 13
---

`bmad-eval` runs a skill through your own coding tool in a clean working directory and reports what came back. Use it to find out whether a skill beats the bare model, whether a change helped, whether the output meets a standard, whether the description fires on the right requests, and whether the skills of a whole install compete for the same requests.

Smithy offers an eval at the end of every build and runs `bmad-eval` from its menu, so you will usually reach it there. Call it directly when you have a skill and cases and want the numbers.

## The Five Modes

| Mode | Question it answers | Use it when |
| --- | --- | --- |
| Baseline | Does the skill beat the bare model on the same input? | You want to know whether a skill is worth keeping, or before a release |
| Variant | Does a section earn its place, or does a stripped or prior version do as well? | You cut or changed something and want to know if it mattered |
| Quality | Does the output meet the case's rubric? | You know what good output looks like and want each case graded |
| Trigger | Does the description fire when it should and stay quiet otherwise? | A skill does not fire, fires on the wrong things, or is newly built |
| Matrix | With every skill of an install present, does each request load the skill meant for it? | Before a release, after a description changes, or when two skills seem to compete |

A skill the bare model matches should be retired, not patched. The bare model improves with each release, so a baseline run is worth repeating.

## Run an Eval

Ask for a run in plain words, naming the skill and the mode.

```text
Run a baseline eval on skills/acme-release-notes with 3 runs per case.
```

`bmad-eval` finds the cases under `evals/` at the root of the repository or project holding the skill, in a folder mirroring the skill's path below `skills/` (`evals/core-tools/bmad-brainstorming/`), outside the skill so they never install with it. It will not invent cases. It shows a summary before starting: the skill, cases, modes, output folder, and command.

:::caution[Runs bypass permission prompts]
Nobody is there to answer a prompt, so runs turn them off. They are not contained unless the recorded command wraps your tool in a sandbox.
:::

## Write Cases

A case is an input, a rubric, an optional `state_prefix`, and optional fixture files. Cases live in that folder's `cases.json`, and [Eval Format](../reference/eval-format.md) has the full format.

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

A trigger eval stages the skill alone, so it cannot show two skills competing. The trigger matrix stages every skill of an install at once and records which one each query loads. Its report lists the failing queries and a table of which skill loaded in place of which, so overlapping descriptions show up as a recurring pair.

## What Keeps a Run Clean

Each case runs in a temporary folder with a copy of the skill and a fresh home folder, so your own skills, memory, settings, and project instructions do not load. The grader gives no partial credit and flags checks that pass for trivial reasons.

## Which Tool Runs It

Evals run through the coding tool you already use, such as Claude Code or Codex. The first time, your agent works out how to run its own tool unattended, proves it on one case, and records it in `bmad-eval`'s customization, where you can change it.

To compare tools or models, name them, such as Codex or the same tool with another model. Each gets its own run folder, and the report shows where they disagree. Tools route skills differently, so a description that loads well in one can miss in another.

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
