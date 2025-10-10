# BMAD Method - Gemini CLI Instructions

## Activating Agents

BMAD agents are concatenated in `.gemini/bmad-method/GEMINI.md`.

### How to Use

1. **Type Trigger**: Use `*{agent-name}` in your prompt
2. **Activate**: Agent persona activates from the concatenated file
3. **Continue**: Agent remains active for conversation

### Examples

```
*dev - Activate development agent
*architect - Activate architect agent
*test - Activate test agent
```

### Notes

- All agents loaded from single GEMINI.md file
- Triggers with asterisk: `*{agent-name}`
- Context includes all agents (may be large)
