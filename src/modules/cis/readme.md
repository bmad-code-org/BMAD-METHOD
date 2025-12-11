# CIS - Creative Intelligence Suite

AI-powered creative facilitation transforming strategic thinking through expert coaching across five specialized domains.

## Table of Contents

- [Core Capabilities](#core-capabilities)
- [Specialized Agents](#specialized-agents)
- [Interactive Workflows](#interactive-workflows)
- [Quick Start](#quick-start)
- [Key Differentiators](#key-differentiators)
- [Configuration](#configuration)

## Core Capabilities

CIS provides structured creative methodologies through distinctive agent personas who act as master facilitators, drawing out insights through strategic questioning rather than generating solutions directly.

## Specialized Agents

[View detailed agent descriptions →](./agents/README.md)

- **Carson** - Brainstorming Specialist (energetic facilitator)
- **Maya** - Design Thinking Maestro (jazz-like improviser)
- **Dr. Quinn** - Problem Solver (detective-scientist hybrid)
- **Victor** - Innovation Oracle (bold strategic precision)
- **Sophia** - Master Storyteller (whimsical narrator)

## Interactive Workflows

[View all workflows →](./workflows/README.md)

**5 Workflows** with **150+ Creative Techniques:**

### Brainstorming

36 techniques across 7 categories for ideation

- Divergent/convergent thinking
- Lateral connections
- Forced associations

### Design Thinking

Complete 5-phase human-centered process

- Empathize → Define → Ideate → Prototype → Test
- User journey mapping
- Rapid iteration

### Problem Solving

Systematic root cause analysis

- 5 Whys, Fishbone diagrams
- Solution generation
- Impact assessment

### Innovation Strategy

Business model disruption

- Blue Ocean Strategy
- Jobs-to-be-Done
- Disruptive innovation patterns

### Storytelling

25 narrative frameworks

- Hero's Journey
- Story circles
- Compelling pitch structures

## Quick Start

### Direct Workflow

```bash
# Start interactive session
workflow brainstorming

# With context document
workflow design-thinking --data /path/to/context.md
```

### Agent-Facilitated

```bash
# Load agent
agent cis/brainstorming-coach

# Start workflow
> *brainstorm
```

## Key Differentiators

- **Facilitation Over Generation** - Guides discovery through questions
- **Energy-Aware Sessions** - Adapts to engagement levels
- **Context Integration** - Domain-specific guidance support
- **Persona-Driven** - Unique communication styles
- **Rich Method Libraries** - 150+ proven techniques

## Configuration

Edit `/.bmad/cis/config.yaml`:

```yaml
output_folder: ./creative-outputs
user_name: Your Name
communication_language: english
```

## Module Structure

```
cis/
├── agents/              # 5 specialized facilitators
├── workflows/           # 5 interactive processes
│   ├── brainstorming/
│   ├── design-thinking/
│   ├── innovation-strategy/
│   ├── problem-solving/
│   └── storytelling/
├── tasks/              # Supporting operations
└── teams/              # Agent collaborations
```

## Integration Points

CIS workflows integrate with:

- **BMM** - Powers project brainstorming
- **BMB** - Creative module design
- **Custom Modules** - Shared creative resource

## Best Practices

1. **Set clear objectives** before starting sessions
2. **Provide context documents** for domain relevance
3. **Trust the process** - Let facilitation guide you
4. **Take breaks** when energy flags
5. **Document insights** as they emerge

## Related Documentation

- **[Workflow Guide](./workflows/README.md)** - Detailed workflow instructions
- **[Agent Personas](./agents/README.md)** - Full agent descriptions
- **[BMM Integration](../bmm/README.md)** - Development workflow connection

---

Part of BMad Method v6.0 - Transform creative potential through expert AI facilitation.
