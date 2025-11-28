# BMAD SaaS Operations Modules

This directory contains the event-driven SaaS operations modules for the BMAD Method. These modules are designed to operate independently through an event bus, enabling loose coupling and scalable architecture.

## Module Overview

| Module | Description | Agent | Key Events |
|--------|-------------|-------|------------|
| **bmm-metrics** | KPIs, SLAs, and Quality Gates | Metrics Analyst 📊 | `metrics.quality.*`, `metrics.kpi.*` |
| **bmm-release** | Release Management | Release Manager 🚀 | `release.*` |
| **bmm-feedback** | Customer Feedback Loop | Feedback Analyst 📣 | `feedback.*` |
| **bmm-priority** | Backlog Prioritization | Priority Manager 📊 | `priority.*` |
| **bmm-roadmap** | Product Roadmap Planning | Roadmap Planner 🗺️ | `roadmap.*` |

## Event-Driven Architecture

All modules communicate through events, enabling:
- **Loose Coupling**: Modules don't depend on each other directly
- **Async Processing**: Events are processed independently
- **Scalability**: Add new modules without modifying existing ones
- **Auditability**: All events are logged for tracking

### Event Flow Example

```
story.done event
    │
    ├──→ bmm-metrics: Calculate cycle time, update velocity
    │         │
    │         └──→ metrics.kpi.updated event
    │                   │
    │                   └──→ bmm-roadmap: Update capacity projections
    │
    └──→ bmm-release: Add to pending release items
              │
              └──→ release.candidate.created event
                        │
                        └──→ bmm-metrics: Run quality gate check
                                  │
                                  ├──→ metrics.quality.pass
                                  │         │
                                  │         └──→ bmm-release: Proceed with release
                                  │
                                  └──→ metrics.quality.fail
                                            │
                                            └──→ bmm-release: Block release
```

## Core Event Infrastructure

Located in `src/core/events/`:

- **event-schema.yaml**: Canonical event type definitions
- **queue/file-queue-transport.xml**: File-based queue for local development
- **publish-event.xml**: Event publishing task

## Module Installation

Modules are installed to `{project-root}/.bmad/{module-name}/` and include:
- Configuration files
- Agent definitions (compiled to .md)
- Workflow files
- Event handlers
- State files

## Quick Start

1. Install modules via BMAD installer
2. Configure each module in `.bmad/{module}/config.yaml`
3. Activate agents using slash commands or menu

## Event Types Reference

### Story Events (Core)
- `story.started` - Story work begins
- `story.done` - Story completed
- `story.ready` - Story ready for development

### Sprint Events (Core)
- `sprint.started` - Sprint begins
- `sprint.ended` - Sprint completes

### Metrics Events (bmm-metrics)
- `metrics.kpi.defined` - KPIs configured
- `metrics.kpi.updated` - KPI values updated
- `metrics.sla.defined` - SLAs configured
- `metrics.sla.breach` - SLA threshold breached
- `metrics.quality.pass` - Quality gates passed
- `metrics.quality.fail` - Quality gates failed
- `metrics.velocity.calculated` - Sprint velocity calculated

### Release Events (bmm-release)
- `release.candidate.created` - New release candidate
- `release.approved` - Release approved
- `release.deployed` - Release deployed
- `release.failed` - Deployment failed
- `release.rollback.initiated` - Rollback started
- `release.rollback.completed` - Rollback finished

### Feedback Events (bmm-feedback)
- `feedback.received` - New feedback submitted
- `feedback.analyzed` - Feedback analyzed
- `feedback.insight.generated` - Insight identified
- `feedback.priority.suggested` - Priority change suggested

### Priority Events (bmm-priority)
- `priority.updated` - Story priority changed
- `priority.queue.reordered` - Backlog reordered

### Roadmap Events (bmm-roadmap)
- `roadmap.updated` - Roadmap modified
- `roadmap.milestone.completed` - Milestone achieved
- `roadmap.at.risk` - Timeline at risk

## Contributing

When adding new modules:
1. Follow the directory structure pattern
2. Define events in manifest.yaml
3. Register handlers in events/subscriptions.yaml
4. Document published events in events/publications.yaml
5. Create agent with menu and workflows
