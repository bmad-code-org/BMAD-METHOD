# Conversation Persistence System

**Purpose**: Preserve valuable conversation context across sessions and enable multi-user collaboration

---

## Overview

This system allows agents to:
- Save valuable conversations when context gets full or sessions close
- Resume conversations later without losing context
- Enable multiple users to see and continue discussions on the same repo

---

## Components

1. **conversation-template.md** - File format and structure
2. **save-conversation.md** - Instructions for saving conversations
3. **check-conversations.md** - Instructions for checking/resuming on wake-up

---

## File Structure

**Location**: `docs/.conversations/`

**Naming**: `[timestamp]-[agent]-[topic].md`

**Example**: `2025-01-15-1430-saga-pitch-module.md`

---

## Status Values

- **active** - Waiting to be picked up
- **picked-up** - Conversation has been resumed
- **archived** - Old conversation, kept for history

---

## Usage Flow

### Saving a Conversation

1. Agent detects need to save (context full, user closing session, etc.)
2. Creates file using template
3. Fills in context summary, key decisions, where left off
4. Sets status to `active`
5. Informs user where file is saved

### Resuming a Conversation

1. Agent wakes up
2. Checks `docs/.conversations/` for `status: active` files
3. Filters by relevance (topic, recency, agent)
4. Presents options to user
5. If resuming: loads file, updates status to `picked-up`, continues

---

## Integration Points

**Agents should**:
- Check conversations on wake-up (reference `check-conversations.md`)
- Save conversations when needed (reference `save-conversation.md`)
- Use template format (reference `conversation-template.md`)

**Agent definitions should include**:
- Reference to check conversations on activation
- Reference to save conversations when context full

---

## Benefits

- **No lost context** - Valuable discussions preserved
- **Session continuity** - Pick up where you left off
- **Multi-user collaboration** - Team members can see and continue discussions
- **History** - All conversations kept for reference/backup

