# Expert Agent Reference: Personal Journal Keeper (Whisper)

This folder contains a complete reference implementation of a **BMAD Expert Agent** - an agent with persistent memory and domain-specific resources via a sidecar folder.

## Overview

**Agent Name:** Whisper
**Type:** Expert Agent
**Purpose:** Personal journal companion that remembers your entries, tracks mood patterns, and notices themes over time

This reference demonstrates:

- Expert Agent with focused sidecar resources
- Embedded prompts PLUS sidecar file references (hybrid pattern)
- Persistent memory across sessions
- Domain-restricted file access
- Pattern tracking and recall
- Simple, maintainable architecture

## Directory Structure

```
agent-with-memory/
├── README.md                          # This file
├── journal-keeper.agent.yaml          # Main agent definition
└── journal-keeper-sidecar/            # Agent's private workspace
    ├── instructions.md                # Core directives
    ├── memories.md                    # Persistent session memory
    ├── mood-patterns.md               # Emotional tracking data
    ├── breakthroughs.md               # Key insights recorded
    └── entries/                       # Individual journal entries
```

**Simple and focused!** Just 4 core files + a folder for entries.

## Key Architecture Patterns

### 1. Hybrid Command Pattern

Expert Agents can use BOTH:

- **Embedded prompts** via `action: "#prompt-id"` (like Simple Agents)
- **Sidecar file references** via direct paths

```yaml
menu:
  # Embedded prompt (like Simple Agent)
  - trigger: 'write'
    action: '#guided-entry'
    description: "Write today's journal entry"

  # Direct sidecar file action
  - trigger: 'insight'
    action: 'Document this breakthrough in ./journal-keeper-sidecar/breakthroughs.md'
    description: 'Record a meaningful insight'
```

This hybrid approach gives you the best of both worlds!

### 2. Mandatory Critical Actions

Expert Agents MUST load sidecar files explicitly:

```yaml
critical_actions:
  - 'Load COMPLETE file ./journal-keeper-sidecar/memories.md'
  - 'Load COMPLETE file ./journal-keeper-sidecar/instructions.md'
  - 'ONLY read/write files in ./journal-keeper-sidecar/'
```

**Key points:**

- Files are loaded at startup
- Domain restriction is enforced
- Agent knows its boundaries

### 3. Persistent Memory Pattern

The `memories.md` file stores:

- User preferences and patterns
- Session notes and observations
- Recurring themes discovered
- Growth markers tracked

**Critically:** This is updated EVERY session, creating continuity.

### 4. Domain-Specific Tracking

Different files track different aspects:

- **memories.md** - Qualitative insights and observations
- **mood-patterns.md** - Quantitative emotional data
- **breakthroughs.md** - Significant moments
- **entries/** - The actual content (journal entries)

This separation makes data easy to reference and update.

### 5. Simple Sidecar Structure

Unlike modules with complex folder hierarchies, Expert Agent sidecars are flat and focused:

- Just the files the agent needs
- No nested workflows or templates
- Easy to understand and maintain
- All domain knowledge in one place

## Comparison: Simple vs Expert vs Module

| Feature       | Simple Agent         | Expert Agent               | Module Agent           |
| ------------- | -------------------- | -------------------------- | ---------------------- |
| Architecture  | Single YAML          | YAML + sidecar folder      | YAML + module system   |
| Memory        | Session only         | Persistent (sidecar files) | Config-driven          |
| Prompts       | Embedded only        | Embedded + external files  | Workflow references    |
| Dependencies  | None                 | Sidecar folder             | Module workflows/tasks |
| Domain Access | None                 | Restricted to sidecar      | Full module access     |
| Complexity    | Low                  | Medium                     | High                   |
| Use Case      | Self-contained tools | Domain experts with memory | Full workflow systems  |

## The Sweet Spot

Expert Agents are the middle ground:

- **More powerful** than Simple Agents (persistent memory, domain knowledge)
- **Simpler** than Module Agents (no workflow orchestration)
- **Focused** on specific domain expertise
- **Personal** to the user's needs

## When to Use Expert Agents

**Perfect for:**

- Personal assistants that need memory (journal keeper, diary, notes)
- Domain specialists with knowledge bases (specific project context)
- Agents that track patterns over time (mood, habits, progress)
- Privacy-focused tools with restricted access
- Tools that learn and adapt to individual users

**Key indicators:**

- Need to remember things between sessions
- Should only access specific folders/files
- Tracks data over time
- Adapts based on accumulated knowledge

## File Breakdown

### journal-keeper.agent.yaml

- Standard agent metadata and persona
- **Embedded prompts** for guided interactions
- **Menu commands** mixing both patterns
- **Critical actions** that load sidecar files

### instructions.md

- Core behavioral directives
- Journaling philosophy and approach
- File management protocols
- Tone and boundary guidelines

### memories.md

- User profile and preferences
- Recurring themes discovered
- Session notes and observations
- Accumulated knowledge about the user

### mood-patterns.md

- Quantitative tracking (mood scores, energy, etc.)
- Trend analysis data
- Pattern correlations
- Emotional landscape map

### breakthroughs.md

- Significant insights captured
- Context and meaning recorded
- Connected to broader patterns
- Milestone markers for growth

### entries/

- Individual journal entries saved here
- Each entry timestamped and tagged
- Raw content preserved
- Agent observations separate from user words

## Pattern Recognition in Action

Expert Agents excel at noticing patterns:

1. **Reference past sessions:** "Last week you mentioned feeling stuck..."
2. **Track quantitative data:** Mood scores over time
3. **Spot recurring themes:** Topics that keep surfacing
4. **Notice growth:** Changes in language, perspective, emotions
5. **Connect dots:** Relationships between entries

This pattern recognition is what makes Expert Agents feel "alive" and helpful.

## Usage Notes

### Starting Fresh

The sidecar files are templates. A new user would:

1. Start journaling with the agent
2. Agent fills in memories.md over time
3. Patterns emerge from accumulated data
4. Insights build from history

### Building Your Own Expert Agent

1. **Define the domain** - What specific area will this agent focus on?
2. **Choose sidecar files** - What data needs to be tracked/remembered?
3. **Mix command patterns** - Use embedded prompts + sidecar references
4. **Enforce boundaries** - Clearly state domain restrictions
5. **Design for accumulation** - How will memory grow over time?

### Adapting This Example

- **Personal Diary:** Similar structure, different prompts
- **Code Review Buddy:** Track past reviews, patterns in feedback
- **Project Historian:** Remember decisions and their context
- **Fitness Coach:** Track workouts, remember struggles and victories

The pattern is the same: focused sidecar + persistent memory + domain restriction.

## Key Takeaways

- **Expert Agents** bridge Simple and Module complexity
- **Sidecar folders** provide persistent, domain-specific memory
- **Hybrid commands** use both embedded prompts and file references
- **Pattern recognition** comes from accumulated data
- **Simple structure** keeps it maintainable
- **Domain restriction** ensures focused expertise
- **Memory is the superpower** - remembering makes the agent truly useful

---

_This reference shows how Expert Agents can be powerful memory-driven assistants while maintaining architectural simplicity._
