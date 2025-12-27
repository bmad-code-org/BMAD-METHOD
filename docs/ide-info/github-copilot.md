# BMAD Method - GitHub Copilot Instructions

## Activating Agents

BMAD agents are installed in `.github/agents/` with flattened
`bmad-*.agent.md` naming.

### How to Use

1. **Open Chat View**: Click Copilot icon in VS Code sidebar
2. **Select Agent**: Use `@bmad-{module}-agents-{name}` to reference an agent
3. **Chat**: Agent persona is now active for this conversation

### Examples

```
@bmad-bmm-agents-pm - Activate PM agent
@bmad-bmm-agents-architect - Activate architect agent
@bmad-bmm-agents-dev - Activate development agent
```

### VS Code Settings

Configured in `.vscode/settings.json`:

- `chat.agent.enabled` - Enable agent mode
- `chat.agent.maxRequests` - Max requests per session
- `github.copilot.chat.agent.autoFix` - Auto-fix enabled
- `chat.mcp.discovery.enabled` - MCP discovery enabled

### Notes

- All BMAD agents start with `bmad-`
- Agents have access to VS Code tools (edit, search, terminal, etc.)
- Agent persona persists for the chat session
