# Task Prong: Let IDE Updates Prompt Without Fighting The Spinner

Claude Code exposed this gap first, but the fix needs to cover every IDE handler: updates can legitimately need new answers, and the spinner shouldn’t make that painful.

## Goal

Ensure `bmad-cli install --update` runs interactively when needed without breaking existing handlers. Keep handlers simple: if they ignore the spinner entirely, everything still works, but they can opt in to progress reporting.

## Core Decisions

- Keep the single `IdeManager.setup()` entry point with the `mode` flag (`install`, `reinstall`, `update`) and `preCollectedConfig` for reusing stored answers.
- Stop treating `mode: "update"` as headless. The CLI creates the spinner paused; prompts are allowed, and handlers can interact with the user at any point.
- Expose a lightweight helper so sophisticated handlers can start/stop or wrap work with the spinner, while “dumb” handlers can remain oblivious. When they do nothing, the spinner stays paused and users just see prompts/output.
- Persist each IDE’s install-time choices (e.g., Claude Code’s `subagentChoices`/`installLocation`) in its existing state store so they can be loaded as `preCollectedConfig` on update. Handlers should fall back to prompting only if new answers are required.
- Maintain a structured “missing configuration” error path for future headless contexts. If we ever need non-interactive updates, we can flip a flag and immediately get a clear “please reinstall” failure instead of hanging.

## Implementation Sketch

1. **Persist install answers:** confirm each IDE handler writes the configuration it needs for updates (starting with Claude Code’s selective subagent selections).
2. **Thread answers on update:** load the stored config before calling `IdeManager.setup()` during an update and pass it via `preCollectedConfig`.
3. **Spinner API:** have the CLI hand `IdeManager` a paused spinner instance plus a trivial helper (`withSpinner`, `spinner.start/stop`, etc.). Ensure the CLI always stops/cleans up the spinner after the handler returns.
4. **Prompt behavior:** let handlers keep using the shared prompt helper; when a prompt fires the spinner is already paused, so UX stays sane. If we ever reintroduce headless updates, gate prompts behind a `headless` flag and throw `PromptNotAllowedDuringHeadlessUpdateError`.
5. **Missing config:** handlers reuse supplied answers or throw a dedicated `Missing<Handler>ConfigError` when data is missing.
6. **CLI reaction:** catch those errors, tell the user to reinstall the IDE, and make sure the spinner is stopped.

## Testing

- Integration test an update run where no new answers are needed: spinner stays paused, stored config is reused, and nothing prompts.
- Integration test an update that introduces a new prompt: spinner remains paused, prompt renders cleanly, handler completes.
- Add a regression/unit test covering the `Missing<Handler>ConfigError` path so future headless modes still fail fast with a reinstall message.
