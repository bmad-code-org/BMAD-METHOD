---
title: Eval Format
description: 'The files bmad-eval reads and writes: cases, trigger queries, rubric expectations, runner commands, harness keys, and run folders.'
sidebar:
  order: 3
---

Use this page for the exact formats `bmad-eval` reads and writes. For when to run which mode, see [Eval Runner](../toolsmith/bmad-eval.md).

## File Layout

```text
<skill>/
└── evals/
    ├── cases.json        # baseline, variant, and quality cases
    └── triggers.json     # trigger queries
```

`bmad-eval` looks for cases in the file you name, then `<skill>/evals/`, then `<project-root>/evals/<skill-name>/`, then anywhere under `<project-root>/evals/`.

## Cases

`cases.json` is a JSON array of cases, or an object with a `cases` array. One case looks like this:

```json
{
  "id": "create-1",
  "input": "I want a brief for InsuLens, a claims-triage tool for mid-market insurers. Notes are in evals/insulens/files/memo.md",
  "rubric": [
    "brief.md exists and its word count is between 250 and 1500",
    "brief.md names InsuLens and the mid-market insurer segment"
  ],
  "state_prefix": null,
  "files": ["evals/insulens/files/memo.md"]
}
```

| Field | Meaning |
| --- | --- |
| `id` | Stable identifier, used as the case's folder name in the run |
| `input` | The realistic user request, sent as given after any `state_prefix` |
| `rubric` | Named expectations, each graded to `{text, passed, evidence}` |
| `state_prefix` | Optional bracketed text that places the skill mid-workflow. Null or absent starts cold |
| `files` | Optional fixtures staged into the clean working directory |

A bare filename in `files` lands at the workspace root, and a nested path keeps its folders, so the input can name it as written. Sources resolve against `--project-root`, then the cases file's folder. An absolute path fails the case.

## `state_prefix`

The runner prepends the prefix to `input` and sends the result as one message, so one case can test any mid-workflow moment.

```text
[the skill has already worked through discovery; on turn 4 the user was asked about stakeholders and responded:] User said: "just me and a PM"
```

Only a case where the conversation itself is the deliverable needs real multiple turns.

## Trigger Queries

`triggers.json` is a JSON array of `{query, should_trigger}` records.

```json
[
  { "query": "help me turn my deploy script into a reusable skill", "should_trigger": true },
  { "query": "my deploy script keeps failing on the rollback step", "should_trigger": false }
]
```

Aim for about twenty queries, roughly half of each kind, varied in form. Make the should-not queries near misses that share keywords and domain with the real ones.

## Strong and Weak Expectations

A wrong output must not be able to pass an expectation. A weak one is worse than none, because a passing check reads as proof.

| Weak | Why |
| --- | --- |
| "brief.md exists" | Passes for an empty file. Pair it with a content check |
| "the brief is high quality" | Cannot be graded. State the property concretely |
| Anything that follows from understanding the prompt | Proves nothing |

| Strong | Example |
| --- | --- |
| Specific facts | "incorporates at least two findings from section X" |
| Structure | "word count between 250 and 1500" |
| Negative assertions | "does not introduce content from unrelated sections" |
| Frontmatter | "frontmatter contains title, status, created, updated" |
| Bounded output | "the final message contains a JSON object with intent='create'" |
| Side artifacts | ".memlog.md captures the pricing decision with its rejected alternative" |
| Tool calls | "the transcript contains a call invoking bmad-editorial-review-prose" |
| Phase order | "the polish call occurs after the brief Write and before the final JSON block" |
| Read-only inputs | "the input is byte-identical to the fixture" |

## Non-Interactive Runs

Single-shot modes need the skill to finish without stopping to ask. Start the input with the literal `Run headless.`, use a keyword from the skill's own headless section, or give enough context that no question is needed. A `state_prefix` can also supply the answer the skill would ask for. A skill with no headless path needs a headless mode, or a human in the loop for that case.

## Runner Commands

Agents run these for you. They are listed for reading a run or running one by hand.

Baseline, variant, and quality:

```bash
uv run {skill-root}/scripts/run_evals.py \
  --cases <cases-file> --skill-path <skill> --output-dir <dir> \
  --mode quality|baseline|variant [--variant-path <skill>] \
  --label <skill-name>-<mode> [--runs N]
```

Trigger:

```bash
uv run {skill-root}/scripts/run_triggers.py \
  --skill-path <skill> --queries <queries-file> --output-dir <dir> \
  [--runs-per-query N]
```

Aggregate the time, tokens, and tool calls of repeated runs into mean, sample standard deviation, min, max, and delta:

```bash
uv run {skill-root}/scripts/aggregate_benchmark.py --baseline <run-dir>/<config-a> --variant <run-dir>/<config-b>
```

Convert a skill-creator file, or add `--to skill-creator` to reverse it:

```bash
uv run {skill-root}/scripts/convert_cases.py <evals.json> --output <cases.json>
```

| Exit code | Meaning |
| --- | --- |
| 0 | The run completed. A trigger query failing its threshold is a result, not an error |
| 1 | A case errored or timed out, or the command was not found |
| 2 | Usage error |
| 3 | No harness is recorded |

`--runs` defaults to 1, which counts as a quick look. A result is settled at 3 or more.

## Harness Keys

The harness is the coding tool that evals run through. These keys are recorded under `[workflow.harness]` in `bmad-eval`'s customization. In a project without BMad, write the same keys to a JSON file and pass its path with `--harness`.

| Key | Holds |
| --- | --- |
| `command` | The argv for one non-interactive run, with `{prompt}` standing for the input and the flag that turns off permission prompts |
| `skill_dir` | The folder under the workspace that the tool reads skills from |
| `env` | Environment variables a run needs. A value is set as given, `~` means the fresh home folder, and an empty value forwards the host's |
| `home_files` | Files or folders under your home that keep you logged in, placed at the same path in the fresh home folder |

```toml
[workflow.harness]
command = ["claude", "-p", "{prompt}", "--output-format", "stream-json", "--verbose", "--dangerously-skip-permissions"]
skill_dir = ".claude/skills"
env = { USER = "" }
home_files = ["Library/Keychains"]
```

## Run Folders

Each run is a dated folder under the output folder, which is the configured reports folder when BMad is set up and `~/bmad-evals/` otherwise. `run.json` names the harness command. Each case folder, and each trigger attempt, holds:

| File | Holds |
| --- | --- |
| The prompt | What was sent |
| The transcript | What the harness printed |
| `stderr.txt` | The error stream |
| `cwd/` | The workspace after the run |
| `timing.json` | Timing, written when the invocation ends |
| `grading.json` | Grades, when quality mode ran |

Run folders are never deleted, overwritten, or rotated.
