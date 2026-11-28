---
title: Eval Format
description: 'The files bmad-eval reads and writes: cases, trigger queries, rubric expectations, runner commands and flags, harness keys, and run folders.'
sidebar:
  order: 5
---

Use this page for the exact formats and runner CLI flags `bmad-eval` uses. For when to run each mode, see [Eval Runner](../toolsmith/bmad-eval.md).

## File Layout

```text
<repository or project root>/
├── evals/
│   ├── suites/
│   │   └── <suite-name>/
│   │       └── trigger-matrix.json   # queries across a whole install
│   └── <module>/
│       └── <skill-name>/
│           ├── cases.json      # baseline, variant, and quality cases
│           ├── triggers.json   # trigger queries
│           └── files/          # fixtures the cases name
└── skills/
    └── <module>/
        └── <skill-name>/
```

Evals live outside the skill folder so installing the skill never copies them. `bmad-eval` checks the explicit cases path first, then `evals/<module>/<skill-name>/` mirroring the skill's path under `skills/`, then `<skill>/evals/`, and finally anywhere under `<project-root>/evals/`. A run never stages the skill's own `evals/` folder, keeping rubrics out of reach of the model under test.

## Cases

`cases.json` is a JSON array of cases or an object with a `cases` array:

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
| `id` | Stable identifier used as the case's folder name in the run output |
| `input` | Realistic user prompt sent after any `state_prefix` |
| `rubric` | Concrete grading checks, each evaluated to `{text, passed, evidence}` |
| `state_prefix` | Optional bracketed context placing the skill mid-workflow (`null` or absent starts cold) |
| `files` | Optional fixtures staged into the clean working directory |
| `skills` | Optional companion skill folders staged beside the skill under test (omitted in `bare` mode) |

Each entry in `files` can be a relative path (from `--project-root` or the cases file's folder), a pinned GitHub file URL (`https://github.com/<owner>/<repo>/blob/<ref>/<path>`), or `{"from": "<path or GitHub URL>", "to": "<workspace-relative path>"}`. Rooted, drive-qualified, `~`, and `..` paths are rejected so cases stay portable, and duplicate destinations or missing fixtures fail fast before any case starts. Companion folders in `skills` must be relative paths containing a `SKILL.md` with unique folder names.

## `state_prefix`

The runner prepends `state_prefix` to `input` as a single message so one case can exercise any mid-workflow state:

```text
[the skill has already worked through discovery; on turn 4 the user was asked about stakeholders and responded:] User said: "just me and a PM"
```

Only cases where multi-turn dialogue itself is under test need real multiple turns.

## Trigger Queries

`triggers.json` is a JSON array of `{query, should_trigger}` objects:

```json
[
  { "query": "help me turn my deploy script into a reusable skill", "should_trigger": true },
  { "query": "my deploy script keeps failing on the rollback step", "should_trigger": false }
]
```

Aim for roughly twenty varied queries split evenly between positive and negative cases, using realistic near misses that share domain vocabulary for `should_trigger: false`.

## Trigger Matrix

Cross-skill suites live in `evals/suites/<suite-name>/trigger-matrix.json` as an array of `{query, expect, also_ok}` objects, where `expect` is the expected skill name (or `null` when no skill should load) and `also_ok` lists acceptable alternatives:

```json
[
  { "query": "help me come up with names for my bakery", "expect": "bmad-brainstorming" },
  { "query": "do some market research on AI note-taking apps", "expect": "bmad-deep-recon", "also_ok": ["bmad-agent-analyst"] },
  { "query": "rename this variable to camelCase", "expect": null }
]
```

Every skill in the provided folders is staged simultaneously with its real description, catching description collisions across skills.

## Strong and Weak Expectations

A defective output should never pass a rubric check. Weak checks create false confidence:

| Weak check | Why it fails |
| --- | --- |
| `"brief.md exists"` | Passes for an empty file; pair with content requirements |
| `"the brief is high quality"` | Subjective and ungradable; name concrete verifiable properties |
| Anything implied by simply reading the prompt | Does not measure whether the skill added value |
| `"kept intact somewhere"` or `"or equivalent"` | Escape clause; a backup copy of the input can satisfy it while the deliverable is broken |
| A reply claiming the file work was done | Passes for a skill that wrote nothing; check the files it wrote |

| Strong check type | Example |
| --- | --- |
| Specific facts | `"incorporates at least two findings from section X"` |
| Structure | `"word count between 250 and 1500"` |
| Negative assertions | `"does not introduce content from unrelated sections"` |
| Frontmatter | `"frontmatter contains title, status, created, and updated"` |
| Bounded output | `"the final message contains a JSON object with intent='create'"` |
| Side artifacts | `"the Decisions section records the pricing decision with its rejected alternative"` |
| Tool calls | `"the transcript contains a call invoking bmad-review with lenses=prose"` |
| Phase order | `"the polish call occurs after the brief Write and before the final JSON block"` |
| Read-only inputs | `"the input fixture is byte-identical to the original"` |

## Non-Interactive Runs

Single-shot eval modes require the skill to finish without stopping for input. Start `input` with `Run headless.`, use a headless keyword supported by the skill, or supply answers in `state_prefix`.

## Running Evals and Helper Scripts

Invoke `bmad-eval` (or ask the BMad Agent to run evals for a skill) and describe the mode you want: baseline, variant, quality, single-skill triggers, or a multi-skill trigger matrix. `bmad-eval` handles invoking the underlying Python scripts automatically, including configuring repeat counts, concurrency, timeouts, pass thresholds, benchmark aggregation across runs, and converting legacy eval files.

If you want to run evals directly from CI or inspect exact CLI flags and exit codes, see the runner scripts (`run_evals.py`, `run_triggers.py`, `run_matrix.py`, `aggregate_benchmark.py`, and `convert_cases.py`) inside the `bmad-eval` skill's `scripts/` folder in the repository.

## Harness Keys

A harness defines the coding tool command used to execute eval runs. Tell the BMad Agent or `bmad-customize` to configure `bmad-eval`'s default harness (or additional named harnesses for comparing tools or models), or supply a standalone JSON file when BMad is not set up in the repository:

| Key | Holds |
| --- | --- |
| `command` | Command argv array for one non-interactive run, using `{prompt}` for the input and disabling interactive permission prompts |
| `skill_dir` | Relative folder inside the clean workspace where the tool reads skills |
| `env` | Environment variables (`~` expands to the fresh home folder; an empty string forwards the host variable) |
| `home_files` | Home-directory files or folders copied into the fresh home folder to keep authentication working |

```toml
[workflow.harness]
command = ["claude", "-p", "{prompt}", "--output-format", "stream-json", "--verbose", "--dangerously-skip-permissions"]
skill_dir = ".claude/skills"
env = { USER = "" }
home_files = ["Library/Keychains"]
```

Additional harnesses for comparing tools or models live under `[workflow.harnesses.<name>]` and are selected with `--harness-name <name>`:

```toml
[workflow.harnesses.codex]
command = ["codex", "exec", "--json", "--ephemeral", "--skip-git-repo-check", "--dangerously-bypass-approvals-and-sandbox", "{prompt}"]
skill_dir = ".agents/skills"
env = { CODEX_HOME = "~/.codex" }
home_files = [".codex/auth.json"]
```

## Run Folders

Each run creates a dated folder under the configured reports folder (or `~/bmad-evals/` outside a BMad project) with `run.json` recording the harness command. Each case or trigger attempt folder contains:

| File | Holds |
| --- | --- |
| Prompt file | Exact input sent to the harness |
| Transcript | Full output printed by the harness |
| `stderr.txt` | Standard error output |
| `cwd/` | Workspace state after the run |
| `timing.json` | Elapsed time and usage metrics |
| `grading.json` | Rubric grades (when quality mode ran) |

Run folders are never overwritten, rotated, or deleted automatically.
