# BMAD Method - Cursor Instructions

## Activating Agents

BMAD agents are installed in `.cursor/rules/bmad/` as MDC rules.

### How to Use

1. **Reference in Chat**: Use `@{bmad_folder}/{module}/agents/{agent-name}`
2. **Include Entire Module**: Use `@{bmad_folder}/{module}`
3. **Reference Index**: Use `@{bmad_folder}/index` for all available agents

### Examples

```
@{bmad_folder}/core/agents/dev - Activate dev agent
@{bmad_folder}/bmm/agents/architect - Activate architect agent
@{bmad_folder}/core - Include all core agents/tasks
```

### Notes

- Rules are Manual type - only loaded when explicitly referenced
- No automatic context pollution
- Can combine multiple agents: `@{bmad_folder}/core/agents/dev @{bmad_folder}/core/agents/test`
