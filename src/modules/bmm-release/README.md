# BMM-Release Module

Release Management module for the BMAD Method. Handles release planning, candidate validation, release notes generation, and rollback procedures.

## Overview

The bmm-release module provides:
- **Release Planning**: Create and manage release candidates
- **Release Notes Generation**: Auto-generate release notes from completed stories
- **Rollback Planning**: Define and execute rollback procedures
- **Release Validation**: Coordinate with bmm-metrics for quality gate checks

## Event-Driven Architecture

This module operates through events, making it completely decoupled from other modules:

### Events Subscribed
| Event | Action |
|-------|--------|
| `metrics.quality.pass` | Proceeds with release if quality gates pass |
| `metrics.quality.fail` | Blocks release and notifies stakeholders |
| `story.done` | Adds story to pending release items |
| `sprint.ended` | Triggers release candidate creation (if configured) |

### Events Published
| Event | Description |
|-------|-------------|
| `release.candidate.created` | New release candidate ready for validation |
| `release.approved` | Release approved after all gates pass |
| `release.deployed` | Release successfully deployed |
| `release.failed` | Release deployment failed |
| `release.rollback.initiated` | Rollback procedure started |
| `release.rollback.completed` | Rollback completed successfully |

## Directory Structure

```
bmm-release/
├── README.md
├── manifest.yaml
├── config.yaml
├── agents/
│   └── release-manager.agent.yaml
├── workflows/
│   ├── release-planning/
│   ├── release-notes/
│   └── rollback-planning/
├── events/
│   ├── subscriptions.yaml
│   ├── publications.yaml
│   └── handlers/
│       ├── on-quality-pass.xml
│       └── on-quality-fail.xml
├── tasks/
│   ├── create-release-candidate.xml
│   └── validate-release.xml
├── templates/
│   └── release-notes-template.md
└── state/
    └── module-state.yaml
```

## Quick Start

1. Install the module via BMAD installer
2. Configure release settings in `.bmad/bmm-release/config.yaml`
3. Use the Release Manager agent: `*release-manager`

## Agent Commands

The Release Manager agent provides:
- `*help` - Show available commands
- `*plan-release` - Create a new release candidate
- `*release-notes` - Generate release notes
- `*rollback-plan` - Create rollback procedure
- `*release-status` - Check current release status
- `*exit` - Exit agent

## Integration with bmm-metrics

The release workflow integrates with bmm-metrics through events:

1. Release candidate created → `release.candidate.created`
2. bmm-metrics receives event → runs quality gate check
3. Quality gate result → `metrics.quality.pass` or `metrics.quality.fail`
4. bmm-release receives result → proceeds or blocks release

This event-driven approach means modules are completely independent and can operate asynchronously.

## Configuration

```yaml
# .bmad/bmm-release/config.yaml
project_name: "My Project"
user_name: "Developer"

release:
  versioning: "semver"  # semver, calver, custom
  auto_create_on_sprint_end: true
  require_quality_gates: true
  require_changelog: true
  
deployment:
  environments:
    - staging
    - production
  approval_required:
    staging: false
    production: true
    
rollback:
  auto_rollback_on_failure: true
  health_check_timeout: 300  # seconds
```
