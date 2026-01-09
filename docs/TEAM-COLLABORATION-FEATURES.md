# BMAD Team Collaboration Features

This document explains the new collaboration features added to our version of BMAD that enable multi-developer workflows and asynchronous stakeholder collaboration.

---

## Quick Start: What's New?

We've added three major capabilities:

1. **PRD/Epic Crowdsourcing** - Async collaboration on requirements with feedback synthesis
2. **Story Locking** - Prevent two developers from working on the same story
3. **Multi-Channel Notifications** - Get notified via GitHub, Slack, or Email

**Important:** These features are **optional**. If you're working solo or on a local project, BMAD works exactly as before. Enable GitHub integration when your project reaches a point where team coordination is needed.

---

## Feature 1: PRD/Epic Crowdsourcing

### The Problem This Solves

Before:
- Synchronous meetings to collect feedback
- Feedback scattered across email, Slack, docs
- No structured way to track who has reviewed
- Conflicting feedback hard to reconcile
- No audit trail of how requirements evolved

After:
- Stakeholders give feedback asynchronously on their own schedule
- All feedback tracked in GitHub Issues with structured labels
- LLM synthesizes conflicting feedback with rationale
- Clear sign-off tracking (who approved, who hasn't, who blocked)
- Full version history in the PRD document

### Workflow Overview

```
                    ┌─────────────────────────────────────────┐
                    │              PRD LIFECYCLE              │
                    ├─────────────────────────────────────────┤
                    │  📝 Draft → 💬 Feedback → 🔄 Synthesis  │
                    │            ↑             ↓              │
                    │            └──(iterate)──┘              │
                    │                    ↓                    │
                    │              ✍️ Sign-off → ✅ Approved   │
                    └─────────────────────────────────────────┘
```

### Key Commands

| Command | Who | What It Does |
|---------|-----|--------------|
| `/my-tasks` | Everyone | See what PRDs/Epics need your input |
| `/prd-dashboard` | PO | See status of all PRDs |
| `/create-prd-draft` | PO | Start a new PRD |
| `/open-feedback-round` | PO | Request feedback from stakeholders |
| `/submit-feedback` | Stakeholder | Provide feedback on a PRD section |
| `/synthesize-feedback` | PO | Use LLM to process feedback |
| `/request-signoff` | PO | Move to approval phase |
| `/submit-signoff` | Stakeholder | Approve or block the PRD |

### Feedback Types

When submitting feedback, you categorize it:
- **Clarification**: Something is unclear
- **Concern**: Potential issue or risk
- **Suggestion**: Improvement idea
- **Addition**: Missing requirement
- **Priority**: Disagree with prioritization

### Sign-off Configuration

PRDs can have different approval requirements:

```yaml
# Example: Require 3 approvals from anyone
signoff_config:
  threshold_type: count
  minimum_approvals: 3

# Example: Require specific people
signoff_config:
  threshold_type: required_approvers
  required: ["@po", "@tech-lead", "@security"]
  optional: ["@ux", "@qa"]
  minimum_optional: 1  # At least 1 optional must approve
```

---

## Feature 2: Story Locking

### The Problem This Solves

When multiple developers work from the same backlog:
- Two developers might accidentally work on the same story
- No visibility into who is working on what
- Story updates might conflict

### How Story Locking Works

```
Developer A: /checkout-story 2-5-auth-login
→ Story locked to @alice for 8 hours
→ Story file copied to local cache
→ Developer starts working

Developer B: /checkout-story 2-5-auth-login
→ ⚠️ Story is locked by @alice (expires in 7h)
→ Developer picks a different story

Developer A finishes and completes story
→ Lock automatically released
→ Story pushed back to GitHub
```

### Key Commands

| Command | What It Does |
|---------|--------------|
| `/available-stories` | See stories ready for development (with lock status) |
| `/checkout-story` | Lock a story and start working on it |
| `/lock-status` | See all currently locked stories |
| `/unlock-story` | Release a lock (if you're done or abandoning) |

### Lock Expiration

- Default lock duration: 8 hours
- Locks auto-expire (prevents abandoned locks)
- PO can force-unlock stories if needed

---

## Feature 3: Multi-Channel Notifications

### Notification Channels

1. **GitHub @mentions** (always on)
   - Comments on PRD/Epic issues when feedback needed
   - @mentions for specific stakeholders

2. **Slack** (optional)
   - Webhook integration to a team channel
   - Rich formatted messages with actions

3. **Email** (optional)
   - Supports SMTP, SendGrid, or Amazon SES
   - For stakeholders who don't check GitHub/Slack

### Notification Events

| Event | Notification |
|-------|--------------|
| Feedback round opened | "📣 PRD 'User Auth' is open for feedback until Jan 15" |
| Feedback submitted | "💬 New feedback on 'User Auth' from @mike: Concern" |
| Synthesis complete | "🔄 PRD 'User Auth' v2 synthesized with 8 feedback items" |
| Sign-off requested | "✍️ Sign-off requested for 'User Auth' - deadline: Jan 20" |
| PRD approved | "✅ PRD 'User Auth' approved! All sign-offs received." |
| PRD blocked | "🚫 PRD 'User Auth' blocked by @security: Missing compliance section" |

### Configuration

Notifications are configured in `module.yaml`:

```yaml
notifications:
  github_mentions:
    enabled: true  # Always on

  slack:
    enabled: true
    webhook_url: "https://hooks.slack.com/..."
    channel: "#prd-updates"

  email:
    enabled: false  # Enable when needed
```

---

## Getting Started

### For Existing Local Projects

Nothing changes! Continue using BMAD as before. GitHub integration is disabled by default.

### Enabling GitHub Integration

When your project needs team coordination:

1. Set `github_integration_enabled: true` in `module.yaml`
2. Configure your GitHub repo details
3. Optionally configure Slack/Email notifications
4. Start using the collaboration commands

### Day-to-Day Usage

**As a Developer:**
```
1. Check in: /my-tasks
2. Pick a story: /available-stories
3. Lock it: /checkout-story 2-5-auth
4. Work on it...
5. Complete it: (story syncs to GitHub)
```

**As a Product Owner:**
```
1. Create PRD: /create-prd-draft
2. Request feedback: /open-feedback-round
3. Wait for stakeholders...
4. Synthesize: /synthesize-feedback
5. Request approval: /request-signoff
6. Track progress: /prd-dashboard
```

**As a Stakeholder:**
```
1. Check tasks: /my-tasks
2. View PRD and give feedback: /submit-feedback
3. Later, sign off: /submit-signoff
```

---

## Architecture: Where Data Lives

| Data Type | Location | Why |
|-----------|----------|-----|
| PRD/Epic Documents | `docs/prd/*.md`, `docs/epics/*.md` | Living documents, version controlled |
| Review Rounds | GitHub Issues | Closeable coordination (round complete = close) |
| Feedback Items | GitHub Issues (linked) | Closeable (incorporated = close) |
| Story Lock Status | Issue labels + local cache | Real-time coordination |
| Local Cache | `.bmad-cache/` | Fast <100ms access for LLM tools |

---

## Questions?

- Review the detailed config guide: `src/modules/bmm/data/github-integration-config.md`
- Check available workflows in the PO or Stakeholder agent menus
- All 673 tests pass - the feature is thoroughly tested

---

*Last updated: January 2026*
