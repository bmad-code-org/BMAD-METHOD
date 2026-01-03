# Save Conversation - Instructions

**When to save**: When valuable context needs to be preserved

**Purpose**: Capture important discussions so they can be resumed later

---

## When to Save Conversations

Save a conversation when:

1. **Context window getting full** - User mentions context is crowded or you detect it's getting long
2. **User explicitly requests** - "Let me pick this up later", "I need to close this session"
3. **Natural break point** - After completing a significant discussion/task
4. **Switching to different work** - Before starting something completely different
5. **Multi-user scenario** - When another user might need to pick up the work

**Don't save**:
- Very brief exchanges
- Conversations that are clearly complete/finished
- Trivial discussions with no valuable context

---

## How to Save

### Step 1: Create Conversation File

**File location**: `docs/.conversations/`

**File name**: `[timestamp]-[agent]-[topic].md`

**Timestamp format**: `YYYY-MM-DD-HHMM` (current date/time)

**Example**: `2025-01-15-1430-saga-pitch-module.md`

### Step 2: Fill in Template

Use the template from `conversation-template.md`:

```markdown
---
status: active
agent: [your-agent-name]
topic: [brief-topic]
created: [YYYY-MM-DD HH:MM]
last_updated: [YYYY-MM-DD HH:MM]
context_summary: [one-line summary]
---

# Conversation: [Topic]

## Context Summary

[What was discussed - 2-3 sentences]

## Key Decisions & Understandings

- [Important decision 1]
- [Important understanding 2]
- [Key insight 3]

## Where We Left Off

[Last thing discussed, current state]

## Next Steps

- [What needs to happen next]
- [User's intent]

## Important Details

[Specific context, constraints, preferences]

## Conversation Thread

[Key parts of conversation if needed for context]
```

### Step 3: Inform User

After saving, let the user know:

"I've saved our conversation about [topic] so you can pick it up later. The file is at `docs/.conversations/[filename].md`"

---

## What to Include

**Essential**:
- What was discussed (summary)
- Key decisions made
- Where conversation left off
- What needs to happen next

**Valuable**:
- User's preferences or constraints
- Important context that might be forgotten
- Specific details about approach or direction

**Skip**:
- Full conversation transcript (unless critical)
- Trivial back-and-forth
- Information already documented elsewhere

---

## File Naming Guidelines

- **Timestamp first** - For chronological sorting
- **Agent name** - Who was having the conversation
- **Topic** - Brief, descriptive (2-4 words)
- **Use hyphens** - No spaces in filename
- **Lowercase** - Keep it simple

**Good examples**:
- `2025-01-15-1430-saga-pitch-module.md`
- `2025-01-15-1500-freya-login-wireframes.md`
- `2025-01-15-1600-idunn-api-architecture.md`

**Bad examples**:
- `pitch-module.md` (no timestamp)
- `Saga Pitch Module.md` (spaces, uppercase)
- `2025-01-15-saga-discussion.md` (too vague)

---

## Status Management

**When creating**: Set `status: active`

**When resuming**: Update to `status: picked-up` and update `last_updated`

**When archiving**: Update to `status: archived` (for old conversations)

---

## Multi-User Considerations

- Files are visible to all users working on the repo
- Anyone can pick up any active conversation
- Status field helps track what's been resumed
- Timestamp helps identify most recent discussions

