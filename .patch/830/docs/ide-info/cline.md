# BMAD Method - Cline Instructions

## Activating Agents

BMAD agents are installed as **toggleable rules** in `.clinerules/` directory.

### Important: Rules are OFF by default

- Rules are NOT automatically loaded to avoid context pollution
- You must manually enable the agent you want to use

### How to Use

1. **Open Rules Panel**: Click the rules icon below the chat input
2. **Enable an Agent**: Toggle ON the specific agent rule you need (e.g., `01-core-dev`)
3. **Activate in Chat**: Type `@{agent-name}` to activate that persona
4. **Disable When Done**: Toggle OFF to free up context

### Best Practices

- Only enable 1-2 agents at a time to preserve context
- Disable agents when switching tasks
- Rules are numbered (01-, 02-) for organization, not priority

### Example

```bash
Toggle ON: 01-core-dev.md
In chat: "@dev help me refactor this code"
When done: Toggle OFF the rule
```
