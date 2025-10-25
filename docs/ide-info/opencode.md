# BMAD Method - OpenCode Instructions

## Activating Agents

BMAD agents are installed as OpenCode agents in `.opencode/agent/BMAD/{module_name}` and workflow commands in `.opencode/command/BMAD/{module_name}`.

### How to Use

1. **Switch Agents**: Press **Tab** to cycle through primary agents or select using the `/agents`
2. **Activate Agent**: Once the Agent is selected say `hello` or any prompt to activate that agent persona
3. **Execute Commands**: Type `/bmad` to see and execute bmad workflow commands (commands allow for fuzzy matching)

### Examples

```
/agents - to see a list of agents and switch between them
/bmad/bmm/workflows/workflow-init - Activate the workflow-init command
```

### Notes

- Press **Tab** to switch between primary agents (Analyst, Architect, Dev, etc.)
- Commands are autocompleted when you type `/` and allow for fuzzy matching
- Workflow commands execute in current agent context, make sure you have the right agent activated before running a command
