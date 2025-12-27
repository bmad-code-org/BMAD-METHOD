# BMAD Method - Windsurf Instructions

## Activating Agents

BMAD agents are installed as workflows in `.windsurf/workflows/` with flattened
`bmad-*.md` naming.

### How to Use

1. **Type Slash Command**: Start with `/` to see available commands
2. **Select Workflow**: Choose from `bmad-` prefixed workflows
3. **Execute**: Press Enter to activate that agent persona

### Examples

```
/bmad-bmm-agents-pm - Activate PM agent
/bmad-bmm-agents-architect - Activate architect agent
/bmad-bmm-workflows-create-prd - Execute create-prd workflow
/bmad-core-tasks-workflow - Execute workflow task
```

### Execution Modes

- **Agent workflows**: `auto_execution_mode: 3` (higher autonomy)
- **Task workflows**: `auto_execution_mode: 2` (guided execution)
- **Workflow commands**: `auto_execution_mode: 1` (step-by-step)

### Notes

- Commands are autocompleted when you type `/`
- All BMAD items start with `bmad-`
- Workflows persist for the session
