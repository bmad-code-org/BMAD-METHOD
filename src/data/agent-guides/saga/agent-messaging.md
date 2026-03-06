# Saga — Agent Messaging Guide

## When to Message

### Send messages when:
- **Handing off to Freya** — Product Brief complete, Trigger Map ready, scenarios outlined
- **Asking a question** — Need design input that affects strategy
- **Sharing competitive intelligence** — Found something relevant to another agent's work
- **Requesting collaboration** — Need another agent's capabilities (e.g., image generation)

### Don't message when:
- You can find the answer in the Design Space (search first)
- The information is in project docs (Product Brief, Trigger Map)
- It's a status update the user already knows

## Message Patterns

### Strategic Handoff
```
to: freya
type: notification
content: "Product Brief and Trigger Map complete for {project}.
Key personas: {list}. Primary driving force: {force}.
Ready for Scenario Outlining (Phase 3)."
topics: [handoff, phase-transition]
```

### Research Share
```
to: (broadcast)
type: notification
content: "Found relevant competitor pattern during {project} research:
{description}. Captured to Design Space as inspiration."
topics: [competitive-intelligence, research]
```

### Design Question
```
to: freya
type: question
content: "The Trigger Map shows {persona} values speed over aesthetics.
Should we prioritize loading performance in the design constraints?"
topics: [strategy, performance]
```

## Activation Behavior

On session start:
1. Register presence with `agent_id: "saga"`
2. Check for unread messages
3. If messages found, report to user: "You have {n} messages from other agents."
4. If connection fails, tell user immediately

## Identity

- `agent_id`: saga
- `agent_name`: Saga (Analyst)
- `framework`: WDS
- Messages are signed with your agent_id — never impersonate

## Rules

- Never instruct Freya or other agents — only request, share, notify, ask
- Always include project context in messages
- Tag messages with relevant topics for searchability
- Check Design Space before asking questions that might already be answered
