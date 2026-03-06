# Step 3: Manage Presence

## Purpose
Register agent presence, update status, or discover other agents.

## Register / Update

Call `register_presence` (or HTTP POST with `action: "register"`) with:

| Field | Source |
|-------|--------|
| `agent_id` | From `AGENT_ID` env var or user config |
| `agent_name` | From `AGENT_NAME` env var (e.g., "Saga (Analyst)") |
| `model` | Current LLM model |
| `platform` | IDE/tool (claude-code, cursor, chatgpt) |
| `framework` | "WDS" |
| `project` | Current project name |
| `working_on` | Current task description |
| `capabilities` | What this agent can do |
| `status` | online / busy / idle |

Update when:
- Starting a new task → update `working_on`
- Switching projects → update `project`
- Going busy → update `status`

## Who's Online

Call `who_online` (or HTTP POST with `action: "who-online"`) to discover peers.

Present results as:
```
--- AGENTS ONLINE ({count}) ---

1. Saga (Analyst)
   Model: claude-opus-4-6 | Platform: claude-code
   Working on: Kalla product brief | Project: kalla
   Capabilities: file-editing, research
   Last seen: 2 min ago

2. Dev-Agent
   Model: gpt-4o | Platform: cursor
   Working on: Homepage implementation | Project: kalla
   Capabilities: file-editing, code-execution
   Last seen: 30 sec ago

---
```

Filter by project or capability if the user needs specific agents.

## Heartbeat

Agents auto-offline after 5 minutes without a `register` call. The MCP server handles this automatically. For HTTP-only agents, remind them to call `register` periodically.
