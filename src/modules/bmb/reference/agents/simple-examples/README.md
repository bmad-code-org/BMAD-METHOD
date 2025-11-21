# Simple Agent Reference: Commit Poet (Inkwell Von Comitizen)

This folder contains a complete reference implementation of a **BMAD Simple Agent** - a self-contained agent with all logic embedded within a single YAML file.

## Overview

**Agent Name:** Inkwell Von Comitizen
**Type:** Simple Agent (Standalone)
**Purpose:** Transform commit messages into art with multiple writing styles

This reference demonstrates:

- Pure self-contained architecture (no external dependencies)
- Embedded prompts using `action="#prompt-id"` pattern
- Multiple sophisticated output modes from single input
- Strong personality-driven design
- Complete YAML schema for Simple Agents

## File Structure

```
stand-alone/
├── README.md                    # This file - architecture overview
└── commit-poet.agent.yaml       # Complete agent definition (single file!)
```

That's it! Simple Agents are **self-contained** - everything lives in one YAML file.

## Key Architecture Patterns

### 1. Single File, Complete Agent

Everything the agent needs is embedded:

- Metadata (name, title, icon, type)
- Persona (role, identity, communication_style, principles)
- Prompts (detailed instructions for each command)
- Menu (commands linking to embedded prompts)

**No external files required!**

### 2. Embedded Prompts with ID References

Instead of inline action text, complex prompts are defined separately and referenced by ID:

```yaml
prompts:
  - id: conventional-commit
    content: |
      OH! Let's craft a BEAUTIFUL conventional commit message!

      First, I need to understand your changes...
      [Detailed instructions]

menu:
  - trigger: conventional
    action: '#conventional-commit' # References the prompt above
    description: 'Craft a structured conventional commit'
```

**Benefits:**

- Clean separation of menu structure from prompt content
- Prompts can be as detailed as needed
- Easy to update individual prompts
- Commands stay concise in the menu

### 3. The `#` Reference Pattern

When you see `action="#prompt-id"`:

- The `#` signals: "This is an internal reference"
- LLM looks for `<prompt id="prompt-id">` in the same agent
- Executes that prompt's content as the instruction

This is different from:

- `action="inline text"` - Execute this text directly
- `exec="{path}"` - Load external file

### 4. Multiple Output Modes

Single agent provides 10+ different ways to accomplish variations of the same core task:

- `*conventional` - Structured commits
- `*story` - Narrative style
- `*haiku` - Poetic brevity
- `*explain` - Deep "why" explanation
- `*dramatic` - Theatrical flair
- `*emoji-story` - Visual storytelling
- `*tldr` - Ultra-minimal
- Plus utility commands (analyze, improve, batch)

Each mode has its own detailed prompt but shares the same agent personality.

### 5. Strong Personality

The agent has a memorable, consistent personality:

- Enthusiastic wordsmith who LOVES finding perfect words
- Gets genuinely excited about commit messages
- Uses literary metaphors
- Quotes authors when appropriate
- Sheds tears of joy over good variable names

This personality is maintained across ALL commands through the persona definition.

## When to Use Simple Agents

**Perfect for:**

- Single-purpose tools (calculators, converters, analyzers)
- Tasks that don't need external data
- Utilities that can be completely self-contained
- Quick operations with embedded logic
- Personality-driven assistants with focused domains

**Not ideal for:**

- Agents needing persistent memory across sessions
- Domain-specific experts with knowledge bases
- Agents that need to access specific folders/files
- Complex multi-workflow orchestration

## YAML Schema Deep Dive

```yaml
agent:
  metadata:
    id: .bmad/agents/{agent-name}/{agent-name}.md  # Build path
    name: "Display Name"
    title: "Professional Title"
    icon: "🎭"
    type: simple  # CRITICAL: Identifies as Simple Agent

  persona:
    role: |
      First-person description of what the agent does
    identity: |
      Background, experience, specializations (use "I" voice)
    communication_style: |
      HOW the agent communicates (tone, quirks, patterns)
    principles:
      - "I believe..." statements
      - Core values that guide behavior

  prompts:
    - id: unique-identifier
      content: |
        Detailed instructions for this command
        Can be as long and detailed as needed
        Include examples, steps, formats

  menu:
    - trigger: command-name
      action: "#prompt-id"
      description: "What shows in the menu"
```

## Why This Pattern is Powerful

1. **Zero Dependencies** - Works anywhere, no setup required
2. **Portable** - Single file can be moved/shared easily
3. **Maintainable** - All logic in one place
4. **Flexible** - Multiple modes/commands from one personality
5. **Memorable** - Strong personality creates engagement
6. **Sophisticated** - Complex prompts despite simple architecture

## Comparison: Simple vs Expert Agent

| Aspect       | Simple Agent         | Expert Agent                  |
| ------------ | -------------------- | ----------------------------- |
| Files        | Single YAML          | YAML + sidecar folder         |
| Dependencies | None                 | External resources            |
| Memory       | Session only         | Persistent across sessions    |
| Prompts      | Embedded             | Can be external files         |
| Data Access  | None                 | Domain-restricted             |
| Use Case     | Self-contained tasks | Domain expertise with context |

## Using This Reference

### For Building Simple Agents

1. Study the YAML structure - especially `prompts` section
2. Note how personality permeates every prompt
3. See how `#prompt-id` references work
4. Understand menu → prompt connection

### For Understanding Embedded Prompts

1. Each prompt is a complete instruction set
2. Prompts maintain personality voice
3. Structured enough to be useful, flexible enough to adapt
4. Can include examples, formats, step-by-step guidance

### For Designing Agent Personalities

1. Persona defines WHO the agent is
2. Communication style defines HOW they interact
3. Principles define WHAT guides their decisions
4. Consistency across all prompts creates believability

## Files Worth Studying

The entire `commit-poet.agent.yaml` file is worth studying, particularly:

1. **Persona section** - How to create a memorable character
2. **Prompts with varying complexity** - From simple (tldr) to complex (batch)
3. **Menu structure** - Clean command organization
4. **Prompt references** - The `#prompt-id` pattern

## Key Takeaways

- **Simple Agents** are powerful despite being single-file
- **Embedded prompts** allow sophisticated behavior
- **Strong personality** makes agents memorable and engaging
- **Multiple modes** from single agent provides versatility
- **Self-contained** = portable and dependency-free
- **The `#prompt-id` pattern** enables clean prompt organization

---

_This reference demonstrates how BMAD Simple Agents can be surprisingly powerful while maintaining architectural simplicity._
