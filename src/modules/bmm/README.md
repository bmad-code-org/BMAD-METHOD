# BMM - BMad Method Module

The BMM (BMad Method Module) is the core orchestration system for the BMad Method v6a, providing comprehensive software development lifecycle management through specialized agents, workflows, teams, and tasks.

## 📚 Essential Reading

**Before using BMM, you MUST read the [BMM v6 Workflows Guide](./workflows/README.md).** This document explains the revolutionary v6a workflow system and how all components work together.

## Module Structure

### 🤖 `/agents`

Specialized AI agents for different development roles:

- **PM** (Product Manager) - Product planning and requirements
- **Analyst** - Business analysis and research
- **Architect** - Technical architecture and design
- **SM** (Scrum Master) - Sprint and story management
- **DEV** (Developer) - Code implementation
- **TEA** (Test Architect) - Test Architect
- **UX** - User experience design
- And more specialized roles

### 📋 `/workflows`

The heart of BMM - structured workflows for the four development phases:

1. **Analysis Phase** (Optional)
   - `brainstorm-project` - Project ideation
   - `research` - Market/technical research
   - `product-brief` - Product strategy

2. **Planning Phase** (Required)
   - `prd` - Scale-adaptive project planning
   - Routes to appropriate documentation based on project complexity

3. **Solutioning Phase** (Level 3-4 projects)
   - `3-solutioning` - Architecture design
   - `tech-spec` - Epic-specific technical specifications

4. **Implementation Phase** (Iterative)
   - `create-story` - Story drafting (SM agent)
   - `story-ready` - Approve story for development (SM agent)
   - `story-context` - Expertise injection (SM agent)
   - `dev-story` - Implementation (DEV agent)
   - `story-done` - Mark story done (DEV agent)
   - `review-story` - Quality validation (DEV/SR agent)
   - `correct-course` - Issue resolution
   - `retrospective` - Continuous improvement

### 👥 `/teams`

Pre-configured agent teams for different project types and phases. Teams coordinate multiple agents working together on complex tasks.

### 📝 `/tasks`

Reusable task definitions that agents execute within workflows. These are the atomic units of work that compose into larger workflows.

### 🔧 `/sub-modules`

Extension modules that add specialized capabilities to BMM.

### 🏗️ `/testarch`

Test architecture and quality assurance components. The **[Test Architect (TEA) Guide](./testarch/README.md)** provides comprehensive testing strategy across 9 workflows: framework setup, CI/CD, test design, ATDD, automation, traceability, NFR assessment, quality gates, and test review.

## Quick Start

```bash
# Load the PM agent - either via slash command or drag and drop or @ the agent file.
# Once loaded, the agent should greet you and offer a menu of options. You can enter:
`*prd`
```

## Key Concepts

### Scale Levels

BMM automatically adapts to project complexity:

- **Level 0**: Single atomic change
- **Level 1**: 1-10 stories, minimal documentation
- **Level 2**: 5-15 stories, focused PRD
- **Level 3**: 12-40 stories, full architecture
- **Level 4**: 40+ stories, enterprise scale

### Just-In-Time Design

Technical specifications are created one epic at a time during implementation, not all upfront, allowing for learning and adaptation.

### Story State Machine

Stories flow through a 4-state lifecycle tracked in the status file:

```
BACKLOG → TODO → IN PROGRESS → DONE
```

- **BACKLOG**: Ordered list of stories to be drafted (populated at phase transition)
- **TODO**: Single story ready for SM to draft (or drafted, awaiting approval)
- **IN PROGRESS**: Single story approved for DEV to implement
- **DONE**: Completed stories with dates and points

Agents never search for "next story" - they always read the exact story from the status file. Simple workflows (`story-ready`, `story-done`) advance the queue automatically.

### Context Injection

Story-specific technical guidance is generated dynamically, providing developers with exactly the expertise needed for each task.

## Integration with BMad Core

BMM integrates seamlessly with the BMad Core framework, leveraging:

- The agent execution engine
- Workflow orchestration
- Task management
- Team coordination

## Related Documentation

- [BMM Workflows Guide](./workflows/README.md) - **Start here!**
- [Test Architect (TEA) Guide](./testarch/README.md) - Quality assurance and testing strategy
- [Agent Documentation](./agents/README.md) - Individual agent capabilities
- [Team Configurations](./teams/README.md) - Pre-built team setups
- [Task Library](./tasks/README.md) - Reusable task components

## Best Practices

1. **Always start with the workflows** - Let workflows guide your process
2. **Respect the scale** - Don't over-document small projects
3. **Embrace iteration** - Use retrospectives to continuously improve
4. **Trust the process** - The v6a methodology has been carefully designed

---

For detailed information about the complete BMad Method v6a workflow system, see the [BMM Workflows README](./workflows/README.md).
