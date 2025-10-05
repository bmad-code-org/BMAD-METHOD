---
last-redoc-date: 2025-09-28
---

# CIS Workflows

The Creative Intelligence System includes five interactive workflows that facilitate different creative and strategic processes. Each workflow uses curated technique libraries and structured facilitation to guide users through proven methodologies.

## Available Workflows

### [Brainstorming](./brainstorming)

Facilitates interactive ideation sessions using 36 creative techniques across 7 categories. AI acts as master facilitator using "Yes, and..." methodology. Supports user-selected, AI-recommended, random, or progressive technique flows.

**Key Feature:** Comprehensive technique library spanning collaborative, structured, creative, deep, theatrical, wild, and introspective approaches.

### [Design Thinking](./design-thinking)

Guides human-centered design through the complete five-phase methodology: Empathize, Define, Ideate, Prototype, and Test. Emphasizes divergent thinking before convergent action with rapid prototyping focus.

**Key Feature:** Phase-specific method library and systematic user empathy development.

### [Innovation Strategy](./innovation-strategy)

Identifies disruption opportunities and architects business model innovation. Analyzes markets, competitive dynamics, and value chains using frameworks like Jobs-to-be-Done and Blue Ocean Strategy.

**Key Feature:** Strategic focus on sustainable competitive advantage over feature innovation.

### [Problem Solving](./problem-solving)

Applies systematic problem-solving methodologies combining TRIZ, Theory of Constraints, Systems Thinking, and Root Cause Analysis. Detective approach treats challenges as elegant puzzles.

**Key Feature:** Relentless root cause focus using framework-driven analysis.

### [Storytelling](./storytelling)

Crafts compelling narratives using proven story frameworks (Hero's Journey, Three-Act Structure, Story Brand). Tailors emotional psychology and structure to platform and audience.

**Key Feature:** Whimsical facilitation style that embodies master storytelling craft.

## Common Patterns

All CIS workflows share these characteristics:

- **Interactive Facilitation**: AI guides rather than generates, asking questions to draw out user insights
- **Technique Libraries**: CSV databases of methods, frameworks, and approaches
- **Context Awareness**: Accept optional context documents via data attribute
- **Structured Output**: Comprehensive reports capturing insights, decisions, and action plans
- **Energy Monitoring**: Check-ins throughout to adapt pace and approach

## Usage

```bash
# Basic invocation
workflow [workflow-name]

# With context document
workflow [workflow-name] --data /path/to/context.md
```

## Configuration

All workflows reference `/bmad/cis/config.yaml` for:

- `output_folder` - Where workflow results are saved
- `user_name` - Session participant identification
- `communication_language` - Facilitation language preference
