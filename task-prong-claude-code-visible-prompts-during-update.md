# Task Prong: Surface Claude Code Prompts During Update

## Goal

Prevent the Claude Code update flow from hanging when it legitimately needs to show an interactive prompt (e.g., enabling Claude Code during an update) by guaranteeing the prompt remains visible and responsive.

## Context

- During updates the core installer wraps IDE setup in a spinner and temporarily sets `console.log = () => {}`.
- If an IDE handler invokes Inquirer while logs are suppressed, the prompt never renders, leaving the process waiting on stdin.
- This surfaced because the Claude Code handler re-prompts for subagents, but the visibility bug would affect any handler that prompts during update.

## Requirements

- Adjust the update pathway so interactive prompts emitted by IDE handlers remain visible. Options include pausing spinner/log suppression around interactive sections or providing a handler hook to request unsuppressed output.
- Confirm Claude Code (and any other IDE that prompts) displays its questions during update flows.
- Ensure spinner/log behaviour still suppresses routine logging when no prompts are involved.
- Add regression coverage (automated or reproducible manual script) demonstrating that an update with a newly added IDE cleanly shows the prompt and completes once answered.

## Acceptance Criteria

- Running an update that adds Claude Code (or any prompt-driven IDE) shows the interactive questions and does not hang.
- Fresh installs retain existing logging/spinner ergonomics.
- No regression to non-interactive updates (they remain quiet while spinner runs).
