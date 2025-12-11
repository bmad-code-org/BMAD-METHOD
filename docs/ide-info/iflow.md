# BMAD Method - iFlow CLI Instructions

## Activating Agents

BMAD agents are installed as commands in `.iflow/commands/bmad/`.

### How to Use

1. **Access Commands**: Use iFlow command interface
2. **Navigate**: Browse to `.bmad/agents/` or `.bmad/tasks/`
3. **Select**: Choose the agent or task command
4. **Execute**: Run to activate

### Command Structure

```
.iflow/commands/bmad/
├── agents/     # Agent commands
└── tasks/      # Task commands
```

### Examples

```
/.bmad/agents/core-dev - Activate dev agent
/.bmad/tasks/core-setup - Execute setup task
```

### Notes

- Commands organized by type (agents/tasks)
- Agent activates for session
- Similar to Crush command structure
