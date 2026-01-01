# Check Conversations - Instructions

**When**: On agent wake-up/activation

**Purpose**: Discover if there are active conversations to resume

---

## When to Check

**Always check** when:
- Agent is activated/awakened
- Starting a new conversation
- User asks "what were we working on?"

**Don't check**:
- Mid-conversation (unless user asks)
- When conversation is clearly continuing

---

## How to Check

### Step 1: Look in Conversations Folder

**Location**: `docs/.conversations/`

**Look for**: Files with `status: active` in frontmatter

### Step 2: Filter by Relevance

**Consider relevant if**:
- Topic matches what user is asking about
- Recent timestamp (within last few days/weeks)
- Same agent (if user was working with you before)
- Related domain/phase

**Don't show**:
- Very old conversations (unless explicitly relevant)
- Conversations marked `archived`
- Conversations already `picked-up` (unless user asks)

### Step 3: Present Options

If relevant conversations found:

```
"I see there's an active conversation about [topic] from [time]. 
Should I pick up from there, or start fresh?"
```

**If multiple conversations**:
```
"I found a few active conversations:
1. [Topic 1] from [time]
2. [Topic 2] from [time]
3. [Topic 3] from [time]

Which would you like to continue, or start something new?"
```

### Step 4: Load Context if Resuming

**If user says yes**:
1. Read the conversation file
2. Update status to `picked-up`
3. Update `last_updated` timestamp
4. Summarize: "We were discussing [topic]. [Brief summary]. Where would you like to continue?"

**If user says no**:
- Acknowledge and start fresh
- Keep the file available (don't delete)

---

## Conversation File Format

Check frontmatter for:
- `status: active` (what to look for)
- `topic` (to match relevance)
- `created` (to check recency)
- `context_summary` (quick preview)

---

## Relevance Matching

**High relevance**:
- Exact topic match
- Same agent
- Recent (within 1-2 days)
- Related to current request

**Medium relevance**:
- Related topic/domain
- Same phase/work type
- Recent (within a week)

**Low relevance**:
- Different topic
- Old (weeks/months old)
- Different domain

**Show high/medium relevance conversations, skip low relevance unless user asks**

---

## Status Updates

**When resuming conversation**:
- Update `status: active` → `status: picked-up`
- Update `last_updated: [current timestamp]`
- Optionally add note: "Resumed on [date]"

**Don't delete files** - Keep for history/backup

---

## Example Flow

**Agent wakes up**:
```
[Agent checks docs/.conversations/]

"I see there's an active conversation about 'pitch module' from yesterday. 
Should I pick up from there, or are we starting something new?"
```

**User says "pick it up"**:
```
[Agent reads file, updates status]

"Perfect! We were discussing adding a pitch module to the Project Brief workflow. 
You wanted it to be a prerequisite step that establishes why the project matters 
before diving into strategy.

Where would you like to continue? We had started designing the step structure..."
```

**User says "start fresh"**:
```
"Got it! Starting fresh. What would you like to work on?"
```

---

## Multi-User Scenarios

- All users can see all conversations
- Anyone can pick up any active conversation
- Status helps track what's been resumed
- Useful for team collaboration on same repo

---

## Cleanup (Optional)

**Old conversations** can be marked `archived`:
- After being picked up and completed
- After being inactive for extended period
- But keep them - don't delete (valuable history)

