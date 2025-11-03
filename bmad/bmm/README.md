# BMM - BMad Method Module

Core orchestration system for AI-driven agile development, providing comprehensive lifecycle management through specialized agents and workflows.

## Table of Contents

- [Essential Reading](#essential-reading)
- [Documentation](#documentation)
- [Module Structure](#module-structure)
- [Quick Start](#quick-start)
- [Key Concepts](#key-concepts)
- [Scale Levels](#scale-levels)
- [Story Lifecycle](#story-lifecycle)
- [Best Practices](#best-practices)

## Essential Reading

**[📖 BMM v6 Workflows Guide](./workflows/README.md)** - Required reading before using BMM. Explains the revolutionary workflow system and component integration.

## Documentation

All BMM-specific documentation is organized in the `docs/` folder:

### Getting Started

- **[Quick Start Guide](./docs/quick-start.md)** - Step-by-step guide to building your first project with BMM
- **[Quick Spec Flow](./docs/quick-spec-flow.md)** - Rapid Level 0-1 development for bug fixes and small features

### Core Concepts

- **[Scale Adaptive System](./docs/scale-adaptive-system.md)** - Understanding BMad Method's 5-level system (Level 0-4)
- **[Brownfield Guide](./docs/brownfield-guide.md)** - Guidance for working with existing codebases

### Workflows & Reference

- **[Workflows Guide](./workflows/README.md)** - Complete v6 workflow system (ESSENTIAL)
- **[Test Architect Guide](@bmad/bmm/docs/tea-README.md)** - Testing strategy and quality assurance

## Module Structure

### 🤖 Agents

**Core Development Roles:**

- **PM** - Product Manager for planning and requirements
- **Analyst** - Business analysis and research
- **Architect** - Technical architecture and design
- **SM** - Scrum Master for sprint and story management
- **DEV** - Developer for implementation
- **TEA** - Test Architect for quality assurance
- **UX** - User experience design

**Game Development** (Optional):

- **Game Designer** - Creative vision and GDD creation
- **Game Developer** - Game-specific implementation
- **Game Architect** - Game systems and infrastructure

### 📋 Workflows

Four-phase methodology adapting to project complexity:

**1. Analysis** (Optional)

- `brainstorm-project` - Project ideation
- `research` - Market/technical research
- `product-brief` - Product strategy

**2. Planning** (Required)

- `prd` - Scale-adaptive planning
- Routes to appropriate documentation level

**3. Solutioning** (Level 3-4)

- `architecture` - System design
- `tech-spec` - Epic technical specifications

**4. Implementation** (Iterative)

- `create-story` - Draft stories
- `story-context` - Inject expertise
- `dev-story` - Implement
- `code-review` - Validate quality

### 👥 Teams

Pre-configured agent groups for coordinated complex tasks.

### 📝 Tasks

Atomic work units composing into larger workflows.

### 🏗️ Test Architecture

**[TEA Guide](@bmad/bmm/docs/tea-README.md)** - Comprehensive testing strategy across 9 specialized workflows.

## Quick Start

1. **Load PM agent** in your IDE
2. **Wait for menu** to appear
3. **Run workflow:**
   ```
   *prd
   ```

**IDE Instructions:**

- [Claude Code](../../../docs/ide-info/claude-code.md)
- [Cursor](../../../docs/ide-info/cursor.md)
- [VS Code](../../../docs/ide-info/windsurf.md)
- [Others](../../../docs/ide-info/)

## Key Concepts

### Scale Levels

BMM automatically adapts complexity:

| Level | Stories       | Documentation     |
| ----- | ------------- | ----------------- |
| 0     | Single change | Minimal           |
| 1     | 1-10          | Light PRD         |
| 2     | 5-15          | Focused PRD       |
| 3     | 12-40         | Full architecture |
| 4     | 40+           | Enterprise scale  |

### Story Lifecycle

Four-state machine tracked in status file:

```
BACKLOG → TODO → IN PROGRESS → DONE
```

- **BACKLOG** - Ordered stories to draft
- **TODO** - Ready for SM drafting
- **IN PROGRESS** - Approved for DEV
- **DONE** - Completed with metrics

### Just-In-Time Design

Technical specifications created per epic during implementation, enabling learning and adaptation.

### Context Injection

Dynamic technical guidance generated for each story, providing exact expertise when needed.

## Best Practices

1. **Start with workflows** - Let process guide you
2. **Respect scale** - Don't over-document small projects
3. **Trust the process** - Methodology carefully designed
4. **Use status file** - Single source of truth for stories

## Related Documentation

- **[Complete Documentation Index](./docs/)** - All BMM guides and references
- **[Quick Start Guide](./docs/quick-start.md)** - Getting started with BMM
- **[Quick Spec Flow](./docs/quick-spec-flow.md)** - Rapid Level 0-1 development
- **[Scale Adaptive System](./docs/scale-adaptive-system.md)** - Understanding project levels
- **[Brownfield Guide](./docs/brownfield-guide.md)** - Working with existing code
- **[Workflows Guide](./workflows/README.md)** - Complete workflow reference
- **[Test Architect Guide](@bmad/bmm/docs/tea-README.md)** - Testing strategy
- **[IDE Setup](../../../docs/ide-info/)** - Environment configuration

---

For complete BMad Method workflow system details, see the [BMM Workflows README](./workflows/README.md).
