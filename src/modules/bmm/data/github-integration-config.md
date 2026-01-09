# GitHub Integration Configuration Guide

This document explains how to configure BMAD's enterprise GitHub integration for team coordination.

## Overview

The GitHub integration enables:
- **Story Locking** - Prevents duplicate work when multiple developers work in parallel
- **Real-time Progress Sync** - POs see task completion in GitHub Issues within seconds
- **Epic Context Pre-fetching** - Fast LLM access to related stories via local cache
- **PO Workflows** - Product Owners manage backlog via Claude Desktop + GitHub

## Prerequisites

1. **GitHub MCP Server** - Must be configured in Claude settings
2. **Repository Access** - Token with `repo` scope (read/write issues)
3. **Issues Enabled** - GitHub Issues must be enabled for the repository

## Configuration

### During Installation

When running BMAD installation, you'll be prompted for GitHub integration settings:

```
Enable GitHub Integration for enterprise team coordination? [y/N]
> y

GitHub username or organization name:
> myorg

GitHub repository name:
> myproject

Story lock timeout in hours (default: 8):
> 8

Minutes before cache is stale (default: 5):
> 5

Scrum Master usernames (comma-separated):
> alice-sm,bob-sm
```

### Manual Configuration

Add to your `_bmad/bmm/config.yaml`:

```yaml
# GitHub Integration for Enterprise Teams
github_integration_enabled: true

github_owner: "myorg"          # GitHub username or org
github_repo: "myproject"       # Repository name

github_lock_timeout_hours: 8   # Lock duration (workday)
github_cache_staleness_minutes: 5

github_scrum_masters: "alice-sm,bob-sm"  # Can force-unlock
```

## How It Works

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ TIER 1: GitHub Issues (Source of Truth)                     │
│ - Centralized coordination                                  │
│ - Story assignment = lock                                   │
│ - Real-time status labels                                   │
└────────────┬────────────────────────────────────────────────┘
             │ Smart Sync (incremental)
┌────────────┴────────────────────────────────────────────────┐
│ TIER 2: Local Cache (Performance)                           │
│ - Fast LLM Read tool access (<100ms)                       │
│ - Full 12-section story content                            │
│ - Epic context pre-fetch                                    │
└────────────┬────────────────────────────────────────────────┘
             │ Committed after completion
┌────────────┴────────────────────────────────────────────────┐
│ TIER 3: Git Repository (Audit Trail)                        │
│ - Historical story files                                    │
│ - Implementation code                                       │
└─────────────────────────────────────────────────────────────┘
```

### Story Locking Flow

1. **Developer A** runs `/checkout-story story_key=2-5-auth`
2. System assigns GitHub Issue to Developer A
3. System adds `status:in-progress` label
4. System creates local lock file with 8-hour timeout
5. System pre-fetches all Epic 2 stories to cache

6. **Developer B** tries `/checkout-story story_key=2-5-auth`
7. System sees issue assigned to Developer A
8. Returns error: "Story locked by @developerA"

### Progress Sync Flow

1. Developer completes task 3 of 10
2. Workflow marks task `[x]` in story file
3. Workflow updates sprint-status.yaml with progress
4. **NEW:** Workflow posts comment to GitHub Issue:
   ```
   📊 Task 3/10 complete (30%)
   > Implement OAuth token refresh

   _Progress synced at 2026-01-08T15:30:00Z_
   ```
5. PO sees progress in GitHub within seconds

## Workflows

### For Developers

| Command | Description |
|---------|-------------|
| `/checkout-story story_key=X-Y-slug` | Lock story for development |
| `/unlock-story story_key=X-Y-slug` | Release lock when done/blocked |
| `/available-stories` | See unlocked stories |
| `/lock-status` | View who's working on what |

### For Scrum Masters

| Command | Description |
|---------|-------------|
| `/lock-status` | View all locks, identify stale ones |
| `/unlock-story story_key=X-Y-slug --force` | Force-unlock stale story |

### For Product Owners

| Command | Description |
|---------|-------------|
| `/new-story` | Create story in GitHub Issues |
| `/update-story` | Modify ACs |
| `/dashboard` | Sprint progress overview |
| `/approve-story` | Sign off completed work |

### PRD Crowdsourcing (Async Requirements)

| Command | Description |
|---------|-------------|
| `/my-tasks` | View PRDs/Epics needing your attention |
| `/prd-dashboard` | View all PRDs and their status |
| `/create-prd` | Create new PRD draft |
| `/open-feedback` | Open feedback round for PRD |
| `/submit-feedback` | Submit feedback on PRD/Epic |
| `/view-feedback` | View all feedback on PRD/Epic |
| `/synthesize` | LLM synthesizes feedback into new version |
| `/request-signoff` | Request stakeholder sign-off |
| `/signoff` | Submit your sign-off decision |

### Epic Crowdsourcing (Story Breakdown)

| Command | Description |
|---------|-------------|
| `/create-epic` | Create epic from approved PRD |
| `/open-epic-feedback` | Open feedback round for epic |
| `/synthesize-epic` | Synthesize epic feedback |
| `/epic-dashboard` | View epics with PRD lineage |

## Cache Location

Stories are cached in: `{output_folder}/cache/stories/`

Cache metadata in: `{output_folder}/cache/.bmad-cache-meta.json`

## Lock Files

Local locks stored in: `.bmad/locks/{story_key}.lock`

Lock file format:
```yaml
story_key: 2-5-auth
github_issue: 105
locked_by: developer-username
locked_at: 2026-01-08T10:00:00Z
timeout_at: 2026-01-08T18:00:00Z
last_heartbeat: 2026-01-08T12:30:00Z
epic_number: 2
```

## Troubleshooting

### "GitHub MCP not accessible"

1. Verify GitHub MCP is configured in Claude settings
2. Check token has `repo` scope
3. Test with: `mcp__github__get_me()`

### "Story not found in GitHub"

Run `/migrate-to-github` to sync local stories to GitHub Issues.

### "Lock stolen"

Another user was assigned in GitHub UI. Coordinate with your team.

### Stale locks blocking sprint

Scrum Master can force-unlock:
```
/unlock-story story_key=2-5-auth --force reason="Developer unavailable"
```

## Performance

| Operation | Without Cache | With Cache | Improvement |
|-----------|---------------|------------|-------------|
| Read story | 2-3 seconds | <100ms | 20-30x faster |
| Epic context | 16 seconds | 650ms | 25x faster |
| API calls/hour | 500+ | <50 | 90% reduction |

## Security

- Lock verification before each task prevents unauthorized changes
- GitHub assignment is source of truth (verified against)
- Scrum Master override requires explicit permission
- All operations use authenticated GitHub MCP

## PRD & Epic Crowdsourcing

GitHub Integration enables async stakeholder collaboration on requirements:

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│              CROWDSOURCE HIERARCHY                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📄 PRD (Product Requirements)                              │
│      └── Feedback on: vision, goals, FRs, NFRs             │
│          Sign-off: All key stakeholders                     │
│                                                             │
│  📦 EPIC (Feature Breakdown)                                │
│      └── Feedback on: scope, story split, priorities       │
│          Sign-off: Tech Lead + PO + domain expert          │
│                                                             │
│  📝 STORY (Implementation Detail)                           │
│      └── Refinement: Developer adjusts during checkout     │
│          Major issues escalate to epic revision             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Storage Architecture

PRD content lives in markdown files, coordination happens via GitHub Issues:

| Artifact | Where It Lives | Can Close? |
|----------|---------------|------------|
| PRD Document | `docs/prd/{prd-key}.md` | Never (it's a doc) |
| Review Round | Issue: "PRD Review v2" | ✅ Yes, when round ends |
| Feedback Item | Issue: linked to review | ✅ Yes, when processed |
| Epic Document | `docs/epics/epic-{n}.md` | Never (it's a doc) |

### Feedback Types

| Type | Emoji | Description |
|------|-------|-------------|
| clarification | 📋 | Something is unclear |
| concern | ⚠️ | Potential issue/risk |
| suggestion | 💡 | Improvement idea |
| addition | ➕ | Missing requirement |
| priority | 🔢 | Disagree with prioritization |
| scope | 📐 | Epic scope concern |
| dependency | 🔗 | Blocking relationship |
| technical_risk | 🔧 | Architectural concern |
| story_split | ✂️ | Different breakdown suggested |

### Sign-off Configuration

PRDs support flexible sign-off thresholds:

```yaml
signoff_config:
  threshold_type: "required_approvers"  # or "count" or "percentage"
  required: ["@po", "@tech-lead", "@security"]
  optional: ["@ux", "@qa"]
  minimum_optional: 1
  block_threshold: 1
```

### Notification Channels

Configure notifications in `module.yaml`:

```yaml
prd_notifications:
  github_mentions:
    enabled: true  # Always on as baseline

  slack:
    enabled: false
    webhook_url: ""
    channel: "#prd-updates"

  email:
    enabled: false
    smtp_config: ""
```

### Workflow Example

1. **PO creates PRD** → Markdown file + Draft status
2. **Open feedback round** → Creates GitHub Issue, notifies stakeholders
3. **Stakeholders submit feedback** → Linked issues with labels
4. **PO synthesizes feedback** → LLM merges input, resolves conflicts
5. **Request sign-off** → Updates status, tracks approvals
6. **All signed off** → PRD approved, ready for epic breakdown
