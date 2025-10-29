# BMAD Method - Qwen Code Instructions

## Activating Agents

BMAD agents are concatenated in `.qwen/bmad-method/QWEN.md`.

### How to Use

1. **Type Trigger**: Use `*{agent-name}` in your prompt
2. **Activate**: Agent persona activates from the concatenated file
3. **Continue**: Agent remains active for conversation

### Examples

```bash
*dev - Activate development agent
*architect - Activate architect agent
*test - Activate test agent
```

### Notes

- All agents loaded from single QWEN.md file
- Triggers with asterisk: `*{agent-name}`
- Similar to Gemini CLI setup
