# BMM-Roadmap Module

Product Roadmap Planning module for the BMAD Method. Creates and maintains capacity-aware roadmaps that integrate with prioritization and velocity data.

## Overview

The bmm-roadmap module provides:
- **Roadmap Planning**: Create quarterly/annual roadmaps
- **Capacity Planning**: Velocity-aware timeline estimation
- **Milestone Tracking**: Track progress against roadmap
- **Roadmap Visualization**: Generate roadmap artifacts

## Event-Driven Architecture

### Events Subscribed
| Event | Action |
|-------|--------|
| `priority.queue.reordered` | Refresh roadmap with new priorities |
| `metrics.velocity.calculated` | Update capacity projections |
| `release.deployed` | Update milestone completion |
| `sprint.ended` | Update roadmap progress |

### Events Published
| Event | Description |
|-------|-------------|
| `roadmap.updated` | Roadmap has been modified |
| `roadmap.milestone.completed` | Milestone achieved |
| `roadmap.at.risk` | Timeline at risk based on velocity |

## Directory Structure

```
bmm-roadmap/
├── README.md
├── manifest.yaml
├── config.yaml
├── agents/
│   └── roadmap-planner.agent.yaml
├── workflows/
│   ├── roadmap-planning/
│   └── capacity-planning/
├── events/
│   ├── subscriptions.yaml
│   ├── publications.yaml
│   └── handlers/
├── templates/
│   └── roadmap-template.md
└── state/
    └── module-state.yaml
```

## Quick Start

1. Install the module via BMAD installer
2. Configure roadmap settings in `.bmad/bmm-roadmap/config.yaml`
3. Use the Roadmap Planner agent: `*roadmap-planner`

## Agent Commands

- `*help` - Show available commands
- `*plan` - Create or update roadmap
- `*capacity` - Run capacity planning
- `*timeline` - View estimated timeline
- `*milestones` - View milestone status

## Integration Flow

```
bmm-priority (priority.queue.reordered)
    ↓
bmm-roadmap (receives priority order)
    ↓
bmm-metrics (metrics.velocity.calculated)
    ↓
bmm-roadmap (updates capacity projections)
    ↓
roadmap.updated event
```
