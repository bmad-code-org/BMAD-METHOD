# BMAD Method - Trae Instructions

## Activating Agents

BMAD agents are installed as rules in `.trae/rules/`.

### How to Use

1. **Type Trigger**: Use `@{agent-name}` in your prompt
2. **Activate**: Agent persona activates automatically
3. **Continue**: Agent remains active for conversation

### Examples

```bash
@dev - Activate development agent
@architect - Activate architect agent
@task-setup - Execute setup task
```

### Notes

- Rules auto-load from `.trae/rules/` directory
- Multiple agents can be referenced: `@dev and @test`
- Agent follows YAML configuration in rule file
