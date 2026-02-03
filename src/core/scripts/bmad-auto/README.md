# BMAD Auto - Automated Development Loop for Claude Code

This folder contains automation scripts that run the complete BMAD story development
cycle automatically using Claude Code CLI.

## What It Does

The automation loop continuously:
1. Reads `sprint-status.yaml` to determine story states
2. Executes the appropriate BMAD workflow command:
   - `backlog` stories → `/bmad-bmm-create-story`
   - `ready-for-dev` stories → `/bmad-bmm-dev-story`
   - `review` stories → `/bmad-bmm-code-review`
3. Auto-commits code after successful code reviews
4. Repeats until all stories are `done`

## Files

| File | Description |
|------|-------------|
| `bmad-loop.ps1` | Windows PowerShell automation script |
| `bmad-loop.sh` | Linux/macOS Bash automation script |
| `bmad-prompt.md` | Prompt template sent to Claude Code |
| `bmad-auto-config.yaml` | Configuration file (auto-generated) |
| `bmad-progress.log` | Execution log (created on first run) |

## Usage

### Windows (PowerShell)

```powershell
# Navigate to your project root
cd C:\path\to\your\project

# Run with default settings (30 max iterations)
.\.scripts\bmad-auto\claude\bmad-loop.ps1

# Run with custom max iterations
.\.scripts\bmad-auto\claude\bmad-loop.ps1 -MaxIterations 50

# Run with verbose logging
.\.scripts\bmad-auto\claude\bmad-loop.ps1 -Verbose
```

### Linux/macOS (Bash)

```bash
# Navigate to your project root
cd /path/to/your/project

# Make script executable (first time only)
chmod +x ./.scripts/bmad-auto/claude/bmad-loop.sh

# Run with default settings (30 max iterations)
./.scripts/bmad-auto/claude/bmad-loop.sh

# Run with custom max iterations
./.scripts/bmad-auto/claude/bmad-loop.sh 50

# Run with verbose logging
./.scripts/bmad-auto/claude/bmad-loop.sh 50 --verbose
```

## Prerequisites

Before running the automation:

1. **Claude Code CLI** must be installed and in your system PATH
   - Test with: `claude --version`

2. **BMAD installed** with Claude Code support
   - Run: `npx bmad-method install` and select Claude Code

3. **Sprint planning completed** - you must have a `sprint-status.yaml` file
   - Run: `/bmad-bmm-sprint-planning` in Claude Code

## Configuration

The `bmad-auto-config.yaml` file is automatically generated during BMAD installation.
It contains:

```yaml
project_root: "/path/to/your/project"
output_folder: "_bmad-output"
implementation_artifacts: "_bmad-output/implementation-artifacts"
```

If you change your output folder after installation, update this file accordingly.

## Safety Features

- **Max iterations limit**: Prevents infinite loops (default: 30)
- **Git status check**: Only commits if there are actual changes
- **Error handling**: Logs errors and continues to next iteration
- **Progress logging**: All actions logged to `bmad-progress.log`

## Troubleshooting

### "Configuration file not found"
Re-run `npx bmad-method install` and select Claude Code.

### "sprint-status.yaml not found"
Run `/bmad-bmm-sprint-planning` to create the sprint status file.

### "Claude Code not found"
Ensure Claude Code CLI is installed and in your PATH.
