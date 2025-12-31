# Step 2: Check for Active Conversations

**Purpose**: Discover if there are conversations waiting to be resumed

---

## Instruction

Check if there are active conversations to resume.

**Reference**: `src/modules/wds/workflows/project-analysis/conversation-persistence/check-conversations.md`

**What to do**:
1. Check `docs/.conversations/` folder for files with `status: active`
2. Filter by relevance (topic, recency, agent)
3. If conversations found, present options to user
4. If no conversations found, proceed to next step

---

## Decision Point

**If active conversations found**:

Present options to user:
- "I see there's an active conversation about [topic] from [time]. Should I pick up from there, or start fresh?"

**If user wants to resume**:
- Load the conversation file
- Update status to `picked-up`
- Continue from where conversation left off
- **STOP** - Don't proceed to next activation steps

**If user wants to start fresh OR no conversations found**:
- Continue to next step

---

## Next Step

If no conversations found OR user wants to start fresh:
→ `step-03-check-activation-context.md`

