# BMAD Method - Crush Instructions

## Activating Agents

BMAD agents are installed as commands in `.crush/commands/bmad/`.

### How to Use

1. **Open Command Palette**: Use Crush command interface
2. **Navigate**: Browse to `{bmad_folder}/{module}/agents/`
3. **Select Agent**: Choose the agent command
4. **Execute**: Run to activate agent persona

### Command Structure

```
.crush/commands/bmad/
├── agents/          # All agents
├── tasks/           # All tasks
├── core/            # Core module
│   ├── agents/
│   └── tasks/
└── {module}/        # Other modules
```

### Notes

- Commands organized by module
- Can browse hierarchically
- Agent activates for session
