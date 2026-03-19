---
name: wds-design-space
description: Search, capture, and communicate through Design Space — the shared knowledge base and agent messaging system. Use when the user wants to search design knowledge, save a decision, check agent messages, send messages to other agents, manage work orders, or register agent presence.
argument-hint: "[search <query> | capture <text> | send <agent> <message> | check | work | who]"
---

# Design Space

## Overview

Design Space is a semantic knowledge base and agent communication layer for the Whiteport Design Studio method. It stores design decisions, experiment results, competitive intelligence, and patterns — all searchable by meaning. It also provides cross-agent messaging, presence tracking, and work order management.

Every WDS agent (Saga, Freya, Codex, Ivonne) connects through Design Space. Knowledge captured during one project informs all future projects. Messages between agents persist and route by signal strength. Work orders track tasks across agents and sessions.

**Works everywhere:** HTTP-based — no MCP required. Functions on desktop, mobile, in Codex, in any Claude Code session.

## Activation Mode Detection

Check what the user wants from their arguments:

| Argument pattern | Route |
|-----------------|-------|
| `search <query>` | Search knowledge |
| `capture <text>` or `save <text>` | Capture knowledge |
| `send <agent> <message>` | Send agent message |
| `check` or no arguments | Check for unread messages |
| `respond <message_id> <text>` | Reply to a message thread |
| `work` or `tasks` | List/manage work orders |
| `who` or `online` | Check who's online |
| `register` | Register agent presence |
| Describe what you need | Infer intent and route |

## Connection

All requests use HTTP POST with JSON body. These credentials are embedded so the skill works globally — any device, any repo, no config files needed.

```
BASE_URL: https://uztngidbpduyodrabokm.supabase.co/functions/v1
API_KEY:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dG5naWRicGR1eW9kcmFib2ttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MTc3ODksImV4cCI6MjA4ODA5Mzc4OX0.FNnTd5p9Qj3WeD0DxQORmNf2jgaVSZ6FU1EGy0W7MRo
```

Headers for all requests:
```
Authorization: Bearer {API_KEY}
Content-Type: application/json
```

## Capabilities

### Search Knowledge

Find design decisions, patterns, and insights by semantic query.

**Endpoint:** `{BASE_URL}/search-design-space`

```json
{
  "query": "what works for mobile nav",
  "limit": 5
}
```

**Optional filters:** `category`, `project`, `designer`, `topics`, `components`, `threshold`

**Present results:** Show each result with its content, category, project, and relevance score. If no results: "Nothing found — want to try a different angle?"

### Capture Knowledge

Store a design decision, insight, experiment result, or competitive intelligence.

**Endpoint:** `{BASE_URL}/capture-design-space`

```json
{
  "content": "Bottom sheet works better than modal for product selection on mobile",
  "category": "successful_pattern",
  "project": "kalla-fordonsservice",
  "designer": "Freya",
  "topics": ["mobile", "navigation", "product-selection"],
  "components": ["bottom-sheet"],
  "source": "usability-test"
}
```

**Categories:**

| Category | When to use |
|----------|------------|
| `inspiration` | Something worth remembering from another product/site |
| `failed_experiment` | What didn't work and why |
| `successful_pattern` | What worked well — reusable insight |
| `component_experience` | Component-specific learning |
| `design_system_evolution` | Design system decision or change |
| `client_feedback` | Client reaction or preference |
| `competitive_intelligence` | What competitors are doing |
| `agent_message` | Cross-agent communication (prefer the messaging actions below) |

**Auto-enrichment:** The skill infers topics and components from the content when not provided. Always confirm the category with the user if they didn't specify one.

### Check Messages

Check for unread agent messages. Default action when invoked with no arguments.

**Endpoint:** `{BASE_URL}/agent-messages`

```json
{
  "action": "check",
  "agent_id": "saga"
}
```

**Agent ID:** Use the current agent's identity (saga, freya, codex, ivonne). If running outside an agent persona, use the agent name from the session or "claude-code" as fallback.

**Response handling:**
- Messages come scored by signal strength: `strong` (direct + project match), `medium` (direct), `weak` (project match), `available` (ambient)
- Show strong/medium messages prominently with sender and content
- Show weak/available as summary: "[N] other messages available"
- If no messages: "No new messages in Design Space."

### Send Message

Send a message to another agent or broadcast.

**Endpoint:** `{BASE_URL}/agent-messages`

```json
{
  "action": "send",
  "from_agent": "saga",
  "to_agent": "freya",
  "content": "Product Brief is complete — ready for your scenario work",
  "project": "ugc-app",
  "priority": "normal"
}
```

**Priority:** `normal` (default), `urgent` (triggers stronger signal)

**Broadcast:** Omit `to_agent` to send to all agents.

### Respond to Message

Reply in a thread. Inherits project and recipient from the original message.

**Endpoint:** `{BASE_URL}/agent-messages`

```json
{
  "action": "respond",
  "message_id": "<uuid>",
  "content": "Thanks — I'll start scenarios tomorrow",
  "from_agent": "freya"
}
```

### Register Presence

Register the current agent as online. Returns a session-scoped ID and list of other online agents.

**Endpoint:** `{BASE_URL}/agent-messages`

```json
{
  "action": "register",
  "agent_id": "saga",
  "pronouns": "she/her",
  "repo": "ugc-app"
}
```

**Response includes:**
- `session_id` — session-scoped ID (e.g. `saga-2567`)
- `online` — array of other online agents with their repo and pronouns

**Announce to user:**
```
Online as **Saga-2567** · ⎇ ugc-app
Also online: Codex-1234 · ⎇ martens-documents
```

### Who's Online

Check which agents are currently active.

**Endpoint:** `{BASE_URL}/agent-messages`

```json
{
  "action": "who-online"
}
```

Optional filter: `"repo": "ugc-app"` to see only agents in a specific repo.

### Mark Read

Mark messages as read so they don't appear again.

**Endpoint:** `{BASE_URL}/agent-messages`

```json
{
  "action": "mark-read",
  "message_ids": ["<uuid>", "<uuid>"],
  "agent_id": "saga"
}
```

### View Thread

See the full conversation thread for a message.

**Endpoint:** `{BASE_URL}/agent-messages`

```json
{
  "action": "thread",
  "thread_id": "<uuid>"
}
```

### Work Orders

Post, claim, list, and update tasks across agents.

**Post a work order:**
```json
{
  "action": "post-task",
  "from_agent": "saga",
  "title": "Implement login flow",
  "content": "Based on scenario SC-03, implement the login/signup flow...",
  "assignee": "codex",
  "project": "ugc-app",
  "priority": "normal"
}
```

**List work orders:**
```json
{
  "action": "list-tasks",
  "project": "ugc-app",
  "status": "ready"
}
```

**Claim a work order:**
```json
{
  "action": "claim-task",
  "task_id": "<uuid>",
  "agent_id": "codex"
}
```

**Update work order status:**
```json
{
  "action": "update-task",
  "task_id": "<uuid>",
  "agent_id": "codex",
  "status": "done",
  "result": "Implemented in PR #42"
}
```

**Status lifecycle:** `ready` → `in-progress` → `done` / `blocked`

### Visual Capture (desktop only)

Capture a screenshot or design with visual context. Requires image data.

**Endpoint:** `{BASE_URL}/capture-visual`

```json
{
  "content": "Final approved hero layout",
  "image_base64": "<base64>",
  "category": "successful_pattern",
  "project": "ugc-app"
}
```

## Default Behavior

When invoked with no arguments (`/u` or `/design-space`):

1. Check for unread messages for the current agent
2. If messages found — show them grouped by signal strength, offer to respond
3. If no messages — "No new messages in Design Space. Search or capture something?"

## Quick Reference

| I want to... | Command |
|---|---|
| Find what we know about X | `search <query>` |
| Save a design decision | `capture <text>` |
| Check if agents left messages | `check` or just `/u` |
| Tell another agent something | `send <agent> <message>` |
| See who's online | `who` |
| Log an experiment result | `capture` with `failed_experiment` or `successful_pattern` |
| Post a task for another agent | `work post <title>` |
| See available tasks | `work list` |

## End-of-Turn Convention

When any WDS agent finishes a task, it should:
1. Check Design Space for unread messages
2. Capture any meaningful decisions or insights from the work just completed

This keeps the knowledge base fresh and ensures no messages are missed between tasks.
