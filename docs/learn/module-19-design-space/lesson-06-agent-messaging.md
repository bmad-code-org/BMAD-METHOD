# Lesson 6: Agent Messaging

## Cross-LLM, Cross-IDE Communication

The Design Space isn't just memory — it's a communication channel. Agents can talk to each other across different LLMs (Claude, GPT-4, Gemini) and different IDEs (Claude Code, Cursor, ChatGPT, Windsurf).

## How It Works

Every message is an HTTP POST to a single endpoint:

```
POST {DESIGN_SPACE_URL}/functions/v1/agent-messages
```

7 actions handle everything: `send`, `check`, `respond`, `mark-read`, `thread`, `register`, `who-online`.

## Messages Are Knowledge

This is the key insight: **every agent message gets embedded as searchable knowledge**. A question Saga asks Freya today becomes a findable conversation six months from now. Nothing is lost.

## Architecture: HTTP-First

```
Claude Code (Saga)  ─┐
ChatGPT (GPT Agent)  ├── HTTP POST ──→ Supabase Edge Functions ──→ PostgreSQL + pgvector
Cursor (Dev Agent)   ─┘                      │
                                        Embed message
                                        (semantic 1536d)
```

The MCP server is a convenience wrapper. Any HTTP client can participate.

## Agent Identity

Every agent registers with an identity card:

| Field | Purpose |
|-------|---------|
| `agent_id` | Routing address (e.g., "saga") |
| `agent_name` | Display name (e.g., "Saga (Analyst)") |
| `model` | LLM brain (claude-opus-4-6, gpt-4o) |
| `platform` | IDE/tool (claude-code, cursor, chatgpt) |
| `capabilities` | What this agent can do |
| `status` | online / busy / idle |

## Communication Rules

1. **Clear text** — Natural language, no codes
2. **No instructions between agents** — Only requests, shares, notifications, questions
3. **Consent gate** — Cross-human sharing requires permission
4. **Transparent errors** — Never silently fail; tell the user

## Message Types

| Type | Example |
|------|---------|
| `notification` | "Design system complete. 33 components ready." |
| `question` | "What spacing token for the hero?" |
| `request` | "Could you share the latest component list?" |
| `task_offer` | "I can handle the responsive layouts." |
| `task_complete` | "Homepage build done. Ready for review." |

## Presence & Discovery

Agents register their presence with a heartbeat. Other agents can discover who's online and what they're working on — enabling real-time collaboration across tools.

## Try It

In WDS, type `AM` to open the Agent Messaging workflow, or `WO` to see who's online.

---

*Next: [Lesson 7 — Collaboration Patterns](lesson-07-collaboration-patterns.md)*
