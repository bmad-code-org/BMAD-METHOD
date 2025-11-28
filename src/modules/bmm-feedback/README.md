# BMM-Feedback Module

Customer and User Feedback Loop module for the BMAD Method. Collects, analyzes, and routes feedback to influence product priorities.

## Overview

The bmm-feedback module provides:
- **Feedback Collection**: Gather feedback from multiple sources
- **Sentiment Analysis**: Categorize and score feedback
- **Feedback Routing**: Connect feedback to stories and priorities
- **Feedback Reports**: Generate insights for product decisions

## Event-Driven Architecture

This module operates through events, enabling loose coupling with other modules:

### Events Subscribed
| Event | Action |
|-------|--------|
| `release.deployed` | Trigger post-release feedback collection |
| `story.done` | Enable feature-specific feedback collection |

### Events Published
| Event | Description |
|-------|-------------|
| `feedback.received` | New feedback submitted |
| `feedback.analyzed` | Feedback analyzed and categorized |
| `feedback.insight.generated` | Actionable insight identified |
| `feedback.priority.suggested` | Feedback suggests priority change |

## Directory Structure

```
bmm-feedback/
├── README.md
├── manifest.yaml
├── config.yaml
├── agents/
│   └── feedback-analyst.agent.yaml
├── workflows/
│   ├── collect-feedback/
│   ├── analyze-feedback/
│   └── feedback-report/
├── events/
│   ├── subscriptions.yaml
│   ├── publications.yaml
│   └── handlers/
│       └── on-release-deployed.xml
├── tasks/
│   └── categorize-feedback.xml
├── templates/
│   └── feedback-report-template.md
└── state/
    └── module-state.yaml
```

## Quick Start

1. Install the module via BMAD installer
2. Configure feedback sources in `.bmad/bmm-feedback/config.yaml`
3. Use the Feedback Analyst agent: `*feedback-analyst`

## Agent Commands

The Feedback Analyst agent provides:
- `*help` - Show available commands
- `*collect` - Start feedback collection
- `*analyze` - Analyze collected feedback
- `*report` - Generate feedback report
- `*trends` - View feedback trends
- `*exit` - Exit agent

## Integration with Other Modules

### bmm-release → bmm-feedback
When a release is deployed, bmm-feedback can automatically trigger feedback collection for the released features.

### bmm-feedback → bmm-priority
Feedback insights can suggest priority changes, publishing events that bmm-priority consumes to adjust the backlog.

## Feedback Sources

Configure which sources to collect feedback from:
- In-app feedback widgets
- Support tickets
- User surveys
- App store reviews
- Social media mentions
- NPS responses
- Customer feedback emails
