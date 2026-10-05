# The harness

The harness is the agent CLI the evals run through. This skill knows nothing about any harness; the model running the eval knows the one it is sitting in. The first run works out three facts about it and records them in this skill's customization, where the runner reads them back on every later run.

## What is recorded

`[workflow.harness]` in `customize.toml`, written to `{project-root}/_bmad/custom/bmad-eval.toml` by the `bmad-customize` skill:

| Key | Meaning |
|---|---|
| `command` | argv for one non-interactive run. `{prompt}` is replaced with the case input, `{cwd}` with the case's working directory. Include the harness's flag that turns off permission prompts; nobody is there to answer them. |
| `skill_dir` | the folder under the working directory the harness reads skills from. `.agents/skills` is the open-spec default; Claude Code reads `.claude/skills`. |
| `home_env` | env vars the harness takes its config folder from, so the run can point them into a fresh HOME. Claude Code has `CLAUDE_CONFIG_DIR`, Codex `CODEX_HOME`. Empty when the harness only uses HOME. |
| `auth_env` | the env var carrying the credential, forwarded only when the host has it set. Empty when the harness keeps its own login. |
| `env_passthrough` | other host vars to forward. Empty unless the harness cannot start without one. |
| `sandbox` | argv prefix that contains the run. Empty means the run has the host's file access. |

One shape, filled for Claude Code:

```toml
[workflow.harness]
command = ["claude", "-p", "{prompt}", "--output-format", "stream-json", "--verbose", "--dangerously-skip-permissions"]
skill_dir = ".claude/skills"
home_env = ["CLAUDE_CONFIG_DIR"]
auth_env = "ANTHROPIC_API_KEY"
```

## Working the facts out

You know your own CLI. When unsure of a flag, read its `--help`. Then record the table by invoking the `bmad-customize` skill, team layer, naming `bmad-eval` and `workflow.harness`; a user who runs several harnesses on one project puts theirs in the user layer, which wins. Before the full set, run one case: the result says whether the skill loaded and what the harness printed, so a wrong command or folder shows on the first case, not the sixtieth. In a project without BMad, write the same keys as JSON and pass `--harness <file>`.

## What a run does

For each case the runner makes a clean working directory, copies the skill under test into `<cwd>/<skill_dir>/<name>/` (a copy, so a run that edits its skill touches nothing else), stages the fixtures inside the directory and nowhere else, runs `sandbox + command` from it, and keeps what was printed as the transcript. A baseline run issues the same command twice from the same input, once with the skill staged and once with nothing, so the bare-model floor is measured under identical conditions.

The environment is built from scratch: `PATH`, a fresh empty `HOME` at `<case>/.home`, each `home_env` var pointed inside it, `auth_env` when the host has it, `env_passthrough`. Host shell config, installed skills, memory and tokens do not cross. That is isolation of inputs, not containment: the harness runs with permission prompts off and, unless `sandbox` is set, with the host's file access. Say so when confirming the run, and tell the user `sandbox` is where a container or OS sandbox goes. The run folder records the command and whether it was contained.

## Trigger detection

Trigger mode stages a synthetic skill carrying the description under test and one extra line in its body: begin the reply with a token unique to this attempt. The token appearing in what the harness printed is the load. Nothing in the skill's name or description contains the token, so a harness that lists its discovered skills at startup cannot produce a false hit, and no transcript format has to be known. An attempt that does not complete leaves its query unmeasured rather than counted as a quiet pass.

## Transcript and cost

The transcript is what the command printed. When that is line-delimited JSON with usage blocks, the runner records tokens and tool calls per case; otherwise it records elapsed time and `tokens_reported: false`, and the grader works from the final output and the artifacts.
