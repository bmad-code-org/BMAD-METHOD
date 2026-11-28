---
title: 'Eval Runner'
description: 'Measure whether a skill works with bmad-eval: baseline, variant, quality, trigger and trigger-matrix runs in a clean working directory, with a permanent record of each run.'
sidebar:
  order: 13
---

`bmad-eval` runs a skill through your own AI coding tool in a clean temporary workspace and reports what came back. Use it to measure whether a skill beats the bare model, whether an edit actually helped, whether outputs meet a rubric, whether a trigger description fires on the right prompts, and whether installed skills compete for the same user requests.

Smithy offers a trigger eval at the end of every build and runs `bmad-eval` through his `EVAL` mode, so you will often reach it through him. Invoke `bmad-eval` directly whenever you already have a skill and test cases and want measured results.

## The Five Modes

| Mode | Question it answers | Use it when |
| --- | --- | --- |
| Baseline | Does the skill beat the bare model on the same input? | You want to know whether a skill earns its keep, or before a release |
| Variant | Does a section earn its place, or does a stripped or prior version do as well? | You cut or revised something and want proof it mattered |
| Quality | Does the output meet each case's rubric? | You know what good output looks like and want automated grading |
| Trigger | Does the description fire when it should and stay quiet otherwise? | A skill is newly built, fails to fire, or loads on wrong requests |
| Matrix | With every skill of an install staged together, does each prompt load the intended skill? | Before a release, after editing descriptions, or when two skills seem to overlap |

If the bare model matches your skill on real inputs, retire the skill rather than patching it. Because base models improve with every release, re-running baseline evals periodically keeps your catalog lean.

## Run an Eval

Ask for a run in plain English, naming the skill and mode:

```text
Run a baseline eval on skills/acme-release-notes with 3 runs per case.
```

`bmad-eval` looks for cases under `evals/` at the root of the repository or project holding the skill, in a folder mirroring the skill's path below `skills/` (for example `evals/core-tools/bmad-brainstorming/`), keeping test fixtures out of the installed skill folder. It never invents cases silently, and it shows a confirmation summary naming the skill, cases, modes, output folder, and CLI command before executing.

:::caution[Runs bypass permission prompts]
Because evals run unattended with nobody at the keyboard, the recorded CLI command turns permission prompts off. Runs are not sandboxed unless your recorded runner command wraps the CLI inside a sandbox.
:::

## Write Cases

Each test case in `cases.json` holds an input prompt, a grading rubric, an optional `state_prefix` (context prepended to simulate an already-in-progress conversation), and optional fixture files. See [Eval Format](../reference/eval-format.md) for the complete schema.

- Copy real user prompts complete with typos and casual phrasing, because overly polished inputs test situations the skill rarely meets.
- Write falsifiable rubric checks: `"brief.md exists"` passes on an empty file, whereas `"brief.md names the mid-market insurer segment"` actually verifies content.
- Check process alongside output by inspecting transcripts for which tools ran and in what order, since those structural checks need almost no subjective grading.
- Use `state_prefix` to set up what already happened in earlier turns so a single message can test a clarifying question or correction step mid-workflow.

Interactive coaching and facilitation skills are difficult to grade automatically with rubrics; review those outputs by eye and still run trigger evals on their descriptions.

## How Many Runs

Both skill loading and model output are probabilistic, so a single run proves very little. Three runs per case is the floor for a settled result (anything fewer is reported only as a quick look). More runs measure variance or separate close variants. A check that passes on all three runs is a pass, while one passing on one run in three is a signal to investigate.

## Trigger Evals

Because the description is the only text the model sees before loading a skill, a trigger eval sends labeled queries (`should_trigger: true` or `false`) through your real tool and records whether the skill loaded.

The most valuable negative queries are near misses: prompts sharing vocabulary and domain with your skill that still belong elsewhere (such as debugging a workflow when the skill builds one). Obviously unrelated prompts teach nothing.

When trigger queries fail, revise the description's situations and boundaries rather than pasting failed query wording directly into it. `bmad-eval` also supports an optimization loop that tests candidate descriptions against a held-out split so rewrites do not overfit.

Because a single-skill trigger eval stages only one skill, it cannot expose overlap between neighbors. Run **matrix** mode to stage every skill in an install together; its report flags failing queries and prints a confusion table showing which skills repeatedly steal each other's requests.

## What Keeps a Run Clean

Every case runs inside a fresh temporary directory with a fresh home folder and a clean copy of the skill, preventing your personal skills, memory, project instructions, and local settings from biasing the run unless explicitly forwarded through the `workflow.harness` settings (`env` for environment variables to set or forward, and `home_files` for login or credential files copied from your home directory so the CLI stays authenticated; see [Eval Format](../reference/eval-format.md)). The grader gives no partial credit and flags checks that pass for trivial reasons.

## Which Tool Runs It

Evals execute through the coding CLI you already use, such as Claude Code or Codex. On your first run, `bmad-eval` works out the non-interactive command for your CLI, verifies it on one case, and saves the runner configuration through `bmad-customize` so you can inspect or update it later.

To compare tools or models side by side, name additional runner configurations (such as Codex or the same tool on a different model). Each gets its own run folder, and the report highlights where they disagree, since a description that routes cleanly in one tool can miss in another.

## Read the Results

Every run writes to its own timestamped folder inside the `eval-reports` directory of your output folder, with one subfolder per case holding the prompt, transcript, resulting workspace, timing, and grades. Run folders are never deleted or overwritten so historical benchmarks stay comparable.

Inspect the transcripts alongside the final grades:

| What you see in transcripts | What it usually means |
| --- | --- |
| Multiple false starts before one path works | An instruction is too vague |
| An instruction followed where it does not apply | A rule's scope is too broad |
| Stalling between two reasonable choices | No default behavior was named |
| Rewriting the same small helper script on every run | Bundle a tested script with the skill |

Smithy can feed these results straight into his refinement cycle; see [The Eval Loop](approaches.md#the-eval-loop).
