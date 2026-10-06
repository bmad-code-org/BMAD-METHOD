# The harness

The harness is the agent CLI the evals run through: yours, the one you are running in. The runner starts it once per case from an empty workspace in a fresh HOME, with the skill under test copied where the CLI reads skills, stdin closed and output captured. It needs four facts, recorded once per project in this skill's customization under `[workflow.harness]` through the `bmad-customize` skill:

| Key | What to work out |
|---|---|
| `command` | argv for one non-interactive run, `{prompt}` standing for the input, with your flag that turns off permission prompts. `--help` has it. |
| `skill_dir` | the folder under the workspace you read skills from. |
| `env` | env vars the run needs: a value is set as given, `~` meaning the fresh HOME; an empty value forwards the host's. Your config-folder variable, if you have one, and whatever the login needs. |
| `home_files` | files or folders under your home that must come along for you to stay logged in, placed at the same path in the fresh HOME. Look in your config folder; on a Mac it may be the keychain. |

Two shapes that have run, as evidence of the form rather than a catalog:

```toml
command = ["codex", "exec", "--json", "--ephemeral", "--skip-git-repo-check", "--dangerously-bypass-approvals-and-sandbox", "{prompt}"]
skill_dir = ".agents/skills"
env = { CODEX_HOME = "~/.codex" }
home_files = [".codex/auth.json"]
```

```toml
command = ["claude", "-p", "{prompt}", "--output-format", "stream-json", "--verbose", "--dangerously-skip-permissions"]
skill_dir = ".claude/skills"
env = { USER = "" }
home_files = ["Library/Keychains"]
```

Prove the facts on one case before the set; a wrong flag, folder or login shows there. A run bypasses your permission prompts and is not contained unless the command wraps it in a sandbox, so say that when confirming a run. When nobody is at the keyboard and nothing is recorded, stop and show the table to record. In a project without BMad, write the same keys as JSON and pass `--harness <file>`.

Trigger mode detects a load with a canary: the staged skill's body asks for a token at the start of the reply, and the token in the output is the load, on any CLI. Token counts are read when the output is line-delimited JSON with usage blocks; otherwise elapsed time is the measure.
