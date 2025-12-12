# BMAD Method - Cursor Instructions

## Activating Agents

BMAD agents are installed in `.cursor/rules/bmad/` as MDC rules.

### How to Use

1. **Reference in Chat**: Use `@.bmad/{module}/agents/{agent-name}`
2. **Include Entire Module**: Use `@.bmad/{module}`
3. **Reference Index**: Use `@.bmad/index` for all available agents

### Examples

```
@.bmad/core/agents/dev - Activate dev agent
@.bmad/bmm/agents/architect - Activate architect agent
@.bmad/core - Include all core agents/tasks
```

### Notes

- Rules are Manual type - only loaded when explicitly referenced
- No automatic context pollution
- Can combine multiple agents: `@.bmad/core/agents/dev @.bmad/core/agents/test`
