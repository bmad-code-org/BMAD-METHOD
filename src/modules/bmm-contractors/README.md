# BMM-Contractors Module

Distributed team coordination through SMTP email and Git operations. This module enables asynchronous management of outsourced contractors without requiring real-time communication.

## Overview

The BMM-Contractors module bridges the gap between your BMAD-powered product management and a distributed team of contractors who communicate exclusively through email and Git.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           YOUR CONTROL PLANE                                 │
│                      (BMAD Agents + Coordinator)                            │
│                                                                             │
│  📡 Contractor Coordinator                                                  │
│  • Assign stories via email                                                 │
│  • Track progress asynchronously                                            │
│  • Review submissions                                                       │
│  • Manage blockers and escalations                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                 📧 SMTP                          🔀 Git
                 (Commands)                      (Code)
                    │                               │
     ┌──────────────┼──────────────┬───────────────┼──────────────┐
     │              │              │               │              │
     ▼              ▼              ▼               ▼              ▼
┌─────────┐   ┌─────────┐   ┌─────────┐     ┌─────────┐   ┌─────────┐
│ ☕      │   │ ⚛️      │   │ 📱      │     │ 🧪      │   │ 📚      │
│ Backend │   │Frontend │   │ Mobile  │     │   QA    │   │Researcher│
│  Dev    │   │  Dev    │   │  Dev    │     │         │   │         │
└─────────┘   └─────────┘   └─────────┘     └─────────┘   └─────────┘
```

## Features

### Communication
- **SMTP-based assignment** - Stories assigned via structured emails
- **Command parsing** - Contractors reply with commands (SUBMITTED, BLOCKED, etc.)
- **Auto-reminders** - SLA-based follow-ups
- **Template system** - Consistent, professional communication

### Git Integration
- **Auto branch creation** - Branches created on assignment
- **PR tracking** - Monitor contractor pull requests
- **Git polling** - Periodic Git event processing via scheduled jobs
- **Merge automation** - Auto-merge on approval (optional)

### Contractor Management
- **Role-based profiles** - Backend, Frontend, Mobile, QA, Researcher
- **Capacity tracking** - Story points per contractor
- **Performance metrics** - Velocity, cycle time, rejection rate
- **Availability management** - Handle contractor unavailability

---

## Quick Start

### 1. Install the Module

```bash
npm run bmad:install
# Select bmm-contractors
```

### 2. Configure SMTP

Edit `.bmad/bmm-contractors/config.yaml`:

```yaml
smtp:
  host: "smtp.yourprovider.com"
  port: 587
  secure: true
  auth:
    user: "${SMTP_USER}"
    pass: "${SMTP_PASS}"
  from_address: "project@yourcompany.com"
  from_name: "Project Coordinator"
```

### 3. Configure Git

```yaml
git:
  provider: "github"
  organization: "your-org"
  repository: "your-repo"
  main_branch: "main"
  develop_branch: "develop"
```

### 4. Add Contractors

```yaml
contractors:
  - id: "backend-001"
    name: "Backend Developer"
    email: "backend@contractor.example"
    role: "backend-dev"
    tech_stack: ["Java 21", "Spring Boot", "PostgreSQL"]
    availability: "full-time"
    timezone: "UTC+0"
```

### 5. Activate Coordinator

```
/bmad:bmm-contractors:agents:contractor-coordinator
```

---

## Agent: Contractor Coordinator 📡

The Contractor Coordinator manages all contractor interactions.

### Commands

| Command | Description |
|---------|-------------|
| `*dashboard` | View team status dashboard |
| `*assign` | Assign a story to a contractor |
| `*review` | Review a contractor submission |
| `*standup` | Generate standup summary |
| `*onboard` | Onboard a new contractor |
| `*revise` | Request revisions on submission |
| `*escalate` | Escalate a blocker |
| `*report` | Generate performance report |
| `*inbox` | Process incoming emails |
| `*prs` | List open pull requests |
| `*blocked` | View blockers |
| `*contractors` | List all contractors |

---

## Contractor Profiles

### ☕ Backend Developer
- **Tech Stack:** Java 21, Spring Boot, PostgreSQL, Redis
- **Story Types:** backend, api, database, integration
- **Quality:** 80% test coverage, Google Java Style

### ⚛️ Frontend Developer
- **Tech Stack:** React, TypeScript, Tailwind CSS
- **Story Types:** frontend, ui, component
- **Quality:** WCAG 2.1 AA, Core Web Vitals

### 📱 Mobile Developer
- **Tech Stack:** Kotlin, Jetpack Compose, Android
- **Story Types:** mobile, android, offline
- **Quality:** Offline-first, low-cost device optimization

### 🧪 QA Engineer
- **Tech Stack:** Selenium, Appium, Jest, k6
- **Story Types:** qa, testing, automation
- **Quality:** Review all PRs, test automation

### 📚 Researcher
- **Tech Stack:** Technical writing, documentation
- **Story Types:** documentation, research, analysis
- **Quality:** Clear, accurate, well-sourced

---

## Communication Protocol

### Email Commands

Contractors include these commands in email replies:

| Command | Usage | Example |
|---------|-------|---------|
| `ACKNOWLEDGED` | Confirm receipt | "ACKNOWLEDGED - Starting tomorrow" |
| `SUBMITTED` | Work complete | "SUBMITTED - PR #123 ready" |
| `BLOCKED` | Need help | "BLOCKED - Can't access database" |
| `QUESTION` | Need clarification | "QUESTION - Should use JWT or session?" |
| `PROGRESS` | Status update | "PROGRESS - 60% complete" |
| `ESTIMATE` | Update ETA | "ESTIMATE - Done by Friday" |
| `UNAVAILABLE` | Going offline | "UNAVAILABLE - Dec 24-26" |

### Email Flow

```
1. Story Ready
       │
       ▼
2. Coordinator assigns via email
       │
       ▼
3. Contractor: ACKNOWLEDGED
       │
       ▼
4. Contractor works, may send PROGRESS/QUESTION/BLOCKED
       │
       ▼
5. Contractor: SUBMITTED (includes PR number)
       │
       ▼
6. QA reviews, may request revisions
       │
       ▼
7. Approved → PR merged → Story complete
```

---

## Git Branch Strategy

```
main
  │
  └── develop
        │
        ├── story/STORY-123-backend-auth     ← Backend Dev
        │     └── PR → develop
        │
        ├── story/STORY-124-frontend-login   ← Frontend Dev
        │     └── PR → develop
        │
        └── story/STORY-125-mobile-auth      ← Mobile Dev
              └── PR → develop
```

### Branch Naming

Pattern: `story/{story_id}-{slug}`

Examples:
- `story/STORY-123-implement-user-auth`
- `story/STORY-124-login-form-component`

---

## Event Integration

### Events Published

| Event | Description |
|-------|-------------|
| `contractor.story.assigned` | Story assigned to contractor |
| `contractor.email.sent` | Email sent to contractor |
| `contractor.submission.received` | Contractor submitted work |
| `contractor.submission.approved` | Submission approved |
| `contractor.blocked` | Contractor is blocked |
| `contractor.pr.merged` | PR was merged |

### Events Subscribed

| Event | Source | Action |
|-------|--------|--------|
| `story.ready` | bmm | Suggest assignment |
| `story.done` | bmm | Update metrics |
| `metrics.quality.fail` | bmm-metrics | Notify contractor |

---

## SLA Management

### Response SLAs

| Action | Default SLA | Reminder | Escalation |
|--------|-------------|----------|------------|
| Acknowledge assignment | 24 hours | 48 hours | 72 hours |
| Answer question | 24 hours | 48 hours | 72 hours |
| Review submission | 24 hours | 36 hours | 48 hours |
| Resolve blocker | 4 hours | 12 hours | 24 hours |

### Escalation Flow

```
SLA breach detected
       │
       ▼
Send reminder email
       │
       ▼ (no response)
Send 2nd reminder
       │
       ▼ (no response)
Escalate to coordinator
       │
       ▼ (still no response)
Consider reassignment
```

---

## Reporting

### Daily Standup

Auto-generated summary of:
- Active assignments and status
- Blockers
- Submissions pending review
- Approaching deadlines

### Weekly Report

Comprehensive metrics:
- Stories completed per contractor
- Story points delivered
- Average cycle time
- Rejection rate
- Blocker frequency

---

## Configuration Reference

### SMTP Settings

```yaml
smtp:
  host: string              # SMTP server
  port: number              # Default: 587
  secure: boolean           # Use TLS
  auth:
    user: string            # Username
    pass: string            # Password (use env var)
  from_address: string      # Sender email
  from_name: string         # Sender name
  reply_to: string          # Reply-to address
```

### Git Settings

```yaml
git:
  provider: github|gitlab|bitbucket
  organization: string
  repository: string
  main_branch: string       # Default: main
  develop_branch: string    # Default: develop
  branch_pattern: string    # Default: story/{story_id}-{slug}
  require_pr: boolean       # Default: true
  require_review: boolean   # Default: true
  min_reviewers: number     # Default: 1
```

### Contractor Settings

```yaml
contractors:
  - id: string              # Unique identifier
    name: string            # Display name
    email: string           # Email address
    role: string            # backend-dev, frontend-dev, etc.
    tech_stack: string[]    # Skills/technologies
    availability: string    # full-time, part-time, on-call
    timezone: string        # e.g., UTC+0
    response_sla_hours: number  # Default: 24
    capacity_story_points_per_sprint: number
    active: boolean
```

---

## Troubleshooting

### Email Not Sending

1. Check SMTP credentials
2. Verify port and TLS settings
3. Check rate limits
4. Review email logs in state file

### Contractor Not Responding

1. Check spam/junk folder suggestion
2. Verify email address
3. Check timezone (might be outside working hours)
4. Send manual follow-up

### Git Branch Issues

1. Verify Git credentials/tokens
2. Check branch protection rules
3. Verify base branch exists
4. Check polling configuration

---

## Security Considerations

- Store SMTP credentials in environment variables
- Use app-specific passwords where possible
- Review contractor email domains
- Audit email logs regularly
- Use branch protection rules
- Require PR reviews

---

## File Structure

```
bmm-contractors/
├── manifest.yaml
├── config.yaml
├── README.md
├── agents/
│   ├── contractor-coordinator.agent.yaml
│   └── profiles/
│       ├── backend-dev.profile.yaml
│       ├── frontend-dev.profile.yaml
│       ├── mobile-dev.profile.yaml
│       ├── qa-engineer.profile.yaml
│       └── researcher.profile.yaml
├── events/
│   ├── publications.yaml
│   ├── subscriptions.yaml
│   └── handlers/
├── workflows/
│   ├── assign-story/
│   ├── review-submission/
│   ├── contractor-standup/
│   └── onboard-contractor/
├── tasks/
│   ├── send-email.xml
│   ├── parse-email-reply.xml
│   ├── create-branch.xml
│   └── check-pr-status.xml
├── templates/
│   └── email/
│       ├── story-assignment.md
│       ├── revision-request.md
│       ├── submission-approved.md
│       └── ...
└── state/
    └── module-state.yaml
```

---

## Version History

- **1.0.0** - Initial release
