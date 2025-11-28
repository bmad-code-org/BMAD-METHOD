# BMM-Priority Module

Backlog Prioritization Engine for the BMAD Method. Provides data-driven prioritization using configurable frameworks and integrates feedback signals.

## Overview

The bmm-priority module provides:
- **Prioritization Frameworks**: WSJF, RICE, MoSCoW, custom scoring
- **Priority Queue Management**: Ordered backlog management
- **Signal Integration**: Incorporates feedback and metrics into priority decisions
- **Priority Reviews**: Periodic re-evaluation of priorities

## Event-Driven Architecture

### Events Subscribed
| Event | Action |
|-------|--------|
| `feedback.priority.suggested` | Evaluate priority adjustment suggestion |
| `feedback.insight.generated` | Consider insight for new backlog items |
| `metrics.velocity.calculated` | Update capacity for prioritization |
| `story.done` | Remove from priority queue |

### Events Published
| Event | Description |
|-------|-------------|
| `priority.updated` | Story priority changed |
| `priority.queue.reordered` | Backlog reordering complete |
| `priority.review.completed` | Priority review session complete |

## Directory Structure

```
bmm-priority/
├── README.md
├── manifest.yaml
├── config.yaml
├── agents/
│   └── priority-manager.agent.yaml
├── workflows/
│   ├── prioritize-backlog/
│   └── priority-review/
├── events/
│   ├── subscriptions.yaml
│   ├── publications.yaml
│   └── handlers/
├── state/
│   └── module-state.yaml
```

## Prioritization Frameworks

### WSJF (Weighted Shortest Job First)
```
WSJF Score = (Business Value + Time Criticality + Risk Reduction) / Job Size
```

### RICE
```
RICE Score = (Reach × Impact × Confidence) / Effort
```

### MoSCoW
- **Must Have**: Critical for release
- **Should Have**: Important but not critical
- **Could Have**: Nice to have
- **Won't Have**: Explicitly excluded

## Quick Start

1. Install the module via BMAD installer
2. Configure prioritization framework in `.bmad/bmm-priority/config.yaml`
3. Use the Priority Manager agent: `*priority-manager`

## Integration with Feedback

When bmm-feedback detects high-impact patterns, it publishes `feedback.priority.suggested` events. This module evaluates these suggestions and can automatically adjust priorities based on configured rules.
