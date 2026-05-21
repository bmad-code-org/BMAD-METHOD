# Command Reference

All operations use the installed helper at `scripts/story-automator` (usually via the `$scripts` variable). **DO NOT construct tmux commands manually.**

## Core Commands

| Script | Purpose |
|--------|---------|
| `$scripts tmux-wrapper` | Session spawning, naming, lifecycle |
| `$scripts monitor-session` | Batched polling (14+ API calls → 1) |
| `$scripts tmux-status-check` | Context-efficient status checking (v2.4.0) |
| `$scripts codex-status-check` | Codex-specific status with heartbeat (v2.4.0) |
| `$scripts heartbeat-check` | CPU-based process heartbeat detection |
| `$scripts orchestrator-helper` | Sprint-status, parsing, markers |
| `$scripts orchestrator-helper verify-step` | Shared success verifier checks per step |
| `$scripts orchestrator-helper agents-build` | Deterministic agents file generation |
| `$scripts orchestrator-helper agents-resolve` | Agent lookup per story/task via state file or direct agents file |
| `$scripts validate-story-creation` | Legacy story file count validation |
| `$scripts commit-story` | Deterministic git commit with JSON output |

## Usage Pattern

> **⚠️ CRITICAL: `--command` IS REQUIRED**
> You MUST pass `--command` with the built command string to `spawn`.
> Without `--command`, the tmux session will be created but NO command runs → `never_active` failure.

```bash
scripts="{scriptsDir}"

# ⚠️ --command is REQUIRED - without it, session sits idle!
# Spawn session
session=$("$scripts" tmux-wrapper spawn {type} {epic} {story_id} \
  --agent "$agent" \
  --command "$("$scripts" tmux-wrapper build-cmd {type} {story_id} --agent "$agent")")

# Monitor session
result=$("$scripts" monitor-session "$session" --json --agent "$agent")

# Parse output
parsed=$("$scripts" orchestrator-helper parse-output "$(printf '%s' "$result" | jq -r '.output_file')" {type})

# Cleanup
"$scripts" tmux-wrapper kill "$session"
```

## Deterministic Agent Selection

Agent selection is driven by the agents file created during preflight:
`_bmad-output/story-automator/agents/agents-{state_filename}.md`

To resolve agents for a specific story/task:
```bash
selection=$("$scripts" orchestrator-helper agents-resolve --state-file "$state_file" --story "{story_id}" --task "{task}")
primary=$(echo "$selection" | jq -r '.primary')
fallback=$(echo "$selection" | jq -r '.fallback')
```

Direct agents-file resolution is also supported when you already know the generated agents plan path:
```bash
selection=$("$scripts" orchestrator-helper agents-resolve --agents-file "$agents_file" --story "{story_id}" --task "{task}")
primary=$(echo "$selection" | jq -r '.primary')
fallback=$(echo "$selection" | jq -r '.fallback')
```

## Step Types

| Type | Description | Agent Support |
|------|-------------|---------------|
| `create` | Create story from epic | Claude, Codex |
| `dev` | Implement story tasks | Claude, Codex |
| `auto` | Test automation | Claude, Codex |
| `review` | Code review with auto-fix | Claude, Codex |
| `retro` | Retrospective (YOLO mode) | Claude, Codex |

## Retrospective Commands (v1.5.0)

**CRITICAL:** Retrospectives use a special step type that:
- Resolves the retro agent from `agentConfig`
- Returns full YOLO mode prompt with doc verification instructions
- Uses epic_number instead of story_id

```bash
# For retro, "story_id" parameter is actually the epic_number
retro_agent=$("$scripts" orchestrator-helper retro-agent --state-file "{state_file}" | jq -r '.primary')
cmd=$("$scripts" tmux-wrapper build-cmd retro {epic_number} --agent "$retro_agent")
session=$("$scripts" tmux-wrapper spawn retro "" {epic_number} --agent "$retro_agent" --command "$cmd")

# Monitor (retrospectives never block, failures just logged)
result=$("$scripts" monitor-session "$session" --json --agent "$retro_agent")
"$scripts" tmux-wrapper kill "$session"
```

The `build-cmd retro` command automatically includes:
- The bmad-retrospective skill invocation prompt
- Full YOLO mode instructions (no user input expected)
- Key autonomous behaviors for menus/prompts
- Doc verification instructions with subagent patterns
- Instructions to update docs that have verified discrepancies

## Binary Location

The installed helper lives at `../scripts/story-automator` relative to step files.
