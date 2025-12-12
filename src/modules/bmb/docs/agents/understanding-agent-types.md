# Understanding Agent Types: Architecture, Not Capability

**CRITICAL DISTINCTION:** Agent types define **architecture and integration**, NOT capability limits.

ALL agent types can:

- ✓ Write to {output_folder}, {project-root}, or anywhere on system
- ✓ Update artifacts and files
- ✓ Execute bash commands
- ✓ Use core variables (.bmad, {output_folder}, etc.)
- ✓ Have complex prompts and logic
- ✓ Invoke external tools

## What Actually Differs

| Feature                | Simple        | Expert                | Module             |
| ---------------------- | ------------- | --------------------- | ------------------ |
| **Self-contained**     | ✓ All in YAML | Sidecar files         | Sidecar optional   |
| **Persistent memory**  | ✗ Stateless   | ✓ memories.md         | ✓ If needed        |
| **Knowledge base**     | ✗             | ✓ sidecar/knowledge/  | Module/shared      |
| **Domain restriction** | ✗ System-wide | ✓ Sidecar only        | Optional           |
| **Personal workflows** | ✗             | ✓ Sidecar workflows\* | ✗                  |
| **Module workflows**   | ✗             | ✗                     | ✓ Shared workflows |
| **Team integration**   | Solo utility  | Personal assistant    | Team member        |

\*Expert agents CAN have personal workflows in sidecar if critical_actions loads workflow engine

## The Same Agent, Three Ways

**Scenario:** Code Generator Agent

### As Simple Agent (Architecture: Self-contained)

```yaml
agent:
  metadata:
    name: CodeGen
    type: simple

  prompts:
    - id: generate
      content: |
        Ask user for spec details. Generate code.
        Write to {output_folder}/generated/

  menu:
    - trigger: generate
      action: '#generate'
      description: Generate code from spec
```

**What it can do:**

- ✓ Writes files to output_folder
- ✓ Full I/O capability
- ✗ No memory of past generations
- ✗ No personal coding style knowledge

**When to choose:** Each run is independent, no need to remember previous sessions.

### As Expert Agent (Architecture: Personal sidecar)

```yaml
agent:
  metadata:
    name: CodeGen
    type: expert

  critical_actions:
    - Load my coding standards from sidecar/knowledge/
    - Load memories from sidecar/memories.md
    - RESTRICT: Only operate within sidecar folder

  prompts:
    - id: generate
      content: |
        Reference user's coding patterns from knowledge base.
        Remember past generations from memories.
        Write to sidecar/generated/
```

**What it can do:**

- ✓ Remembers user preferences
- ✓ Personal knowledge base
- ✓ Domain-restricted for safety
- ✓ Learns over time

**When to choose:** Need persistent memory, learning, or domain-specific restrictions.

### As Module Agent (Architecture: Team integration)

```yaml
agent:
  metadata:
    name: CodeGen
    module: bmm

  menu:
    - trigger: implement-story
      workflow: '.bmad/bmm/workflows/dev-story/workflow.yaml'
      description: Implement user story

    - trigger: refactor
      workflow: '.bmad/bmm/workflows/refactor/workflow.yaml'
      description: Refactor codebase
```

**What it can do:**

- ✓ Orchestrates full dev workflows
- ✓ Coordinates with other BMM agents
- ✓ Shared team infrastructure
- ✓ Professional operations

**When to choose:** Part of larger system, orchestrates workflows, team coordination.

## Important: Any Agent Can Be Added to a Module

**CLARIFICATION:** The "Module Agent" type is about **design intent and ecosystem integration**, not just file location.

### The Reality

- **Any agent type** (Simple, Expert, Module) can be bundled with or added to a module
- A Simple agent COULD live in `.bmad/bmm/agents/`
- An Expert agent COULD be included in a module bundle

### What Makes a "Module Agent" Special

A **Module Agent** is specifically:

1. **Designed FOR** a particular module ecosystem (BMM, CIS, BMB, etc.)
2. **Uses or contributes** that module's workflows
3. **Included by default** in that module's bundle
4. **Coordinates with** other agents in that module

### Examples

**Simple Agent added to BMM:**

- Lives in `.bmad/bmm/agents/formatter.agent.yaml`
- Bundled with BMM for convenience
- But still stateless, self-contained
- NOT a "Module Agent" - just a Simple agent in a module

**Module Agent in BMM:**

- Lives in `.bmad/bmm/agents/tech-writer.agent.yaml`
- Orchestrates BMM documentation workflows
- Coordinates with other BMM agents (PM, Dev, Analyst)
- Included in default BMM bundle
- IS a "Module Agent" - designed for BMM ecosystem

**The distinction:** File location vs design intent and integration.

## Choosing Your Agent Type

### Choose Simple when:

- Single-purpose utility (no memory needed)
- Stateless operations (each run is independent)
- Self-contained logic (everything in YAML)
- No persistent context required

### Choose Expert when:

- Need to remember things across sessions
- Personal knowledge base (user preferences, domain data)
- Domain-specific expertise with restricted scope
- Learning/adapting over time

### Choose Module when:

- Designed FOR a specific module ecosystem (BMM, CIS, etc.)
- Uses or contributes that module's workflows
- Coordinates with other module agents
- Will be included in module's default bundle
- Part of professional team infrastructure

## The Golden Rule

**Choose based on state and integration needs, NOT on what the agent can DO.**

All three types are equally powerful. The difference is how they manage state, where they store data, and how they integrate with your system.
