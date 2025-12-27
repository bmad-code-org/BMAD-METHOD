# BMAD Method - Cursor Instructions

## Activating Agents

BMAD agents are installed as MDC rules in `.cursor/rules/` with flattened
`bmad-*.mdc` naming.

### How to Use

1. **Reference in Chat**: Use `@bmad-{module}-{type}-{name}`
2. **Browse Available**: Type `@bmad-` to see autocomplete options
3. **Reference Index**: Use `@bmad-index` for installation summary

### Examples

```
@bmad-bmm-agents-dev - Activate development agent
@bmad-bmm-agents-architect - Activate architect agent
@bmad-bmm-workflows-create-prd - Execute create-prd workflow
@bmad-core-tasks-workflow - Reference workflow task
```

### Notes

- Rules are Manual type (alwaysApply: false) - only loaded when explicitly referenced
- No automatic context pollution
- All BMAD items start with `bmad-`
- Can combine multiple references: `@bmad-bmm-agents-dev @bmad-bmm-agents-architect`
