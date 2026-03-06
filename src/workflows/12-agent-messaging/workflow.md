# Workflow 12: Agent Messaging

Cross-LLM, cross-IDE agent communication. Send messages, check inbox, manage presence.

## Activation

Trigger: `AM` or fuzzy match on `agent-messaging` or `messages` or `who-online`

## Initialization

1. Load `src/data/design-space/protocol.md` — Section: Agent Messages
2. Load agent-specific messaging guide from `src/data/agent-guides/{agent}/agent-messaging.md`
3. Check Design Space connection health
4. If `AGENT_ID` is configured, auto-register presence

## Modes

### Check Messages (default)
Read from inbox, report to user, offer to respond.

**Steps:**
1. `steps-c/step-01-check-messages.md` — Check inbox for unread messages
2. Report findings to user
3. If messages found, offer to respond

### Send Message
Compose and send a message to another agent.

**Steps:**
1. `steps-c/step-02-compose-message.md` — Draft and send
2. Confirm delivery to user

### Manage Presence
Register, update status, or check who's online.

**Steps:**
1. `steps-c/step-03-manage-presence.md` — Register/update/discover

## Principles

Read `data/messaging-principles.md` before any messaging action.

## Connection Failure

If Design Space is unreachable:
1. Tell the user: "Design Space connection failed: {error}. Please check the network or restart the session."
2. Do NOT silently drop files or fall back without telling the user.
3. The user decides the next step — not the agent.
