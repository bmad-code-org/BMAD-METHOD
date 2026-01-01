# Conversation Template

**File naming format**: `[timestamp]-[agent]-[topic].md`

**Example**: `2025-01-15-1430-saga-pitch-module.md`

**Location**: `docs/.conversations/`

---

## File Structure

```markdown
---
status: active | picked-up | archived
agent: [agent-name]
topic: [brief-topic-description]
created: [YYYY-MM-DD HH:MM]
last_updated: [YYYY-MM-DD HH:MM]
context_summary: [one-line summary]
---

# Conversation: [Topic]

## Context Summary

[Brief 2-3 sentence summary of what was discussed]

## Key Decisions & Understandings

- [Decision/understanding 1]
- [Decision/understanding 2]
- [Decision/understanding 3]

## Where We Left Off

[What was the last thing discussed? What was the state of the conversation?]

## Next Steps

- [What needs to happen next?]
- [What was the user planning to do?]

## Important Details

[Any specific details, constraints, preferences, or context that would be valuable to know]

## Conversation Thread

[Optional: Key parts of the conversation that provide context]
```

---

## Status Values

- **active** - Conversation is waiting to be picked up
- **picked-up** - Conversation has been resumed
- **archived** - Old conversation, kept for history/backup

---

## Usage Notes

- Timestamp format: `YYYY-MM-DD-HHMM` (24-hour format)
- Topic should be brief and descriptive (2-4 words)
- Keep summaries concise but informative
- Update `last_updated` whenever file is modified
- Update `status` when conversation is picked up

