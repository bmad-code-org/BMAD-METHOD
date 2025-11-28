# Contractor Standup Workflow

## Overview

This workflow generates a daily standup summary by collecting status from all active contractors via SMTP email communication. The summary is distributed back to the team via email, ensuring async-first coordination.

## Prerequisites

- At least one active contractor with assigned work
- SMTP configuration complete
- Email inbox accessible for status parsing

---

## Workflow Stages

### Stage 1: Collect Status

**Objective:** Gather current status from all active contractors by parsing recent emails.

**Status Sources:**

1. **Email Replies** - Parse recent contractor replies for:
   - PROGRESS commands with status updates
   - SUBMITTED commands indicating completed work
   - BLOCKED commands with impediments
   - QUESTION commands awaiting answers

2. **Assignment Records** - Check module state for:
   - Active assignments per contractor
   - Days since assignment
   - Expected completion dates

3. **PR Status** - Query Git for:
   - Open PRs per contractor
   - PR review status
   - CI/CD status

**Contractor Status Collection:**

```yaml
contractor_statuses:
  - contractor_id: "backend-001"
    name: "Backend Developer"
    status: "active"
    current_assignments:
      - story_id: "STORY-123"
        title: "Implement user authentication API"
        assigned_at: "2025-11-25"
        days_in_progress: 3
        last_update: "PROGRESS - 70% complete"
        last_update_at: "2025-11-27T14:00:00Z"
        pr_status: "draft"
    blockers: []
    questions: []

  - contractor_id: "frontend-001"
    name: "Frontend Developer"
    status: "blocked"
    current_assignments:
      - story_id: "STORY-124"
        title: "Login form component"
        assigned_at: "2025-11-26"
        days_in_progress: 2
        last_update: "BLOCKED - Waiting on API endpoint"
        last_update_at: "2025-11-27T10:00:00Z"
        pr_status: null
    blockers:
      - "Waiting on STORY-123 API endpoint"
    questions: []
```

**Parse Recent Emails:**

```yaml
email_scan:
  timeframe: "last_24_hours"
  filter:
    - from: "{contractor_emails}"
    - to: "{coordinator_email}"

  extract:
    - command: "PROGRESS|SUBMITTED|BLOCKED|QUESTION"
    - story_reference: "STORY-\\d+"
    - content: "message body after command"
```

**Output:** Complete status for all contractors

---

### Stage 2: Aggregate Blockers

**Objective:** Compile all blockers requiring attention.

**Blocker Classification:**

| Type | Description | Priority |
|------|-------------|----------|
| Dependency | Waiting on another story | Medium |
| Technical | System/environment issue | High |
| Clarification | Needs requirements clarity | Medium |
| Access | Permission/resource issue | High |
| External | Third-party dependency | Variable |

**Blocker Aggregation:**

```yaml
blockers_summary:
  total_blockers: 2
  critical: 0
  high: 1
  medium: 1

  blockers:
    - id: "BLK-001"
      contractor: "frontend-001"
      story_id: "STORY-124"
      type: "dependency"
      description: "Waiting on STORY-123 API endpoint"
      blocked_since: "2025-11-27T10:00:00Z"
      hours_blocked: 24
      priority: "medium"
      resolution_owner: "backend-001"

    - id: "BLK-002"
      contractor: "mobile-001"
      story_id: "STORY-125"
      type: "access"
      description: "Cannot access staging Firebase"
      blocked_since: "2025-11-27T08:00:00Z"
      hours_blocked: 26
      priority: "high"
      resolution_owner: "coordinator"
```

**Dependency Graph:**

```
STORY-124 (Frontend) ──depends on──▶ STORY-123 (Backend)
                                           │
STORY-125 (Mobile) ──depends on────────────┘
```

**Output:** Prioritized blocker list

---

### Stage 3: Check Deadlines

**Objective:** Identify approaching or missed deadlines.

**Deadline Categories:**

| Status | Definition | Action |
|--------|------------|--------|
| 🔴 Overdue | Past deadline | Immediate attention |
| 🟠 At Risk | < 1 day to deadline, < 80% complete | Escalate |
| 🟡 Approaching | 1-2 days to deadline | Monitor |
| 🟢 On Track | > 2 days or near completion | Continue |

**Deadline Analysis:**

```yaml
deadline_analysis:
  overdue: 0
  at_risk: 1
  approaching: 2
  on_track: 3

  details:
    - story_id: "STORY-123"
      contractor: "backend-001"
      deadline: "2025-11-29"
      days_remaining: 1
      progress: "70%"
      status: "at_risk"
      recommendation: "Escalate - unlikely to complete on time"

    - story_id: "STORY-126"
      contractor: "qa-001"
      deadline: "2025-11-30"
      days_remaining: 2
      progress: "50%"
      status: "approaching"
      recommendation: "Monitor - may need support"
```

**SLA Check:**

```yaml
sla_status:
  acknowledgment_sla:
    - contractor: "researcher-001"
      story_id: "STORY-127"
      assigned_at: "2025-11-27T09:00:00Z"
      hours_since_assignment: 25
      sla_hours: 24
      status: "breached"
      action: "Send reminder"

  response_sla:
    pending_questions: 1
    oldest_unanswered_hours: 18
```

**Output:** Deadline status and SLA report

---

### Stage 4: Generate Summary

**Objective:** Create comprehensive standup summary document.

**Summary Template:**

```markdown
# Daily Standup Summary
**Date:** {date}
**Generated:** {timestamp}
**Coordinator:** Contractor Coordinator

---

## 📊 Team Overview

| Metric | Value |
|--------|-------|
| Active Contractors | {active_count} |
| Stories In Progress | {in_progress_count} |
| Stories Blocked | {blocked_count} |
| Pending Reviews | {pending_reviews} |
| Open PRs | {open_prs} |

---

## 👥 Contractor Status

### ☕ Backend Developer (backend-001)
**Status:** 🟢 Active
**Current Work:** STORY-123 - Implement user authentication API
**Progress:** 70% complete
**Last Update:** "Making good progress on JWT implementation" (2h ago)
**PR:** Draft - story/STORY-123-implement-user-auth
**Blockers:** None

---

### ⚛️ Frontend Developer (frontend-001)
**Status:** 🔴 Blocked
**Current Work:** STORY-124 - Login form component
**Progress:** 40% complete
**Last Update:** "Waiting on API endpoint" (14h ago)
**PR:** Not started
**Blockers:**
- ⚠️ Dependency on STORY-123 API endpoint

---

### 📱 Mobile Developer (mobile-001)
**Status:** 🔴 Blocked
**Current Work:** STORY-125 - Mobile authentication
**Progress:** 20% complete
**Last Update:** "Cannot access staging Firebase" (26h ago)
**PR:** Not started
**Blockers:**
- 🚨 Cannot access staging Firebase project

---

### 🧪 QA Engineer (qa-001)
**Status:** 🟢 Active
**Current Work:** STORY-126 - Auth test automation
**Progress:** 50% complete
**Last Update:** "Writing integration tests" (4h ago)
**PR:** Not started
**Blockers:** None

---

### 📚 Researcher (researcher-001)
**Status:** 🟡 Pending Acknowledgment
**Current Work:** STORY-127 - API documentation
**Progress:** Not started
**Last Update:** None (assigned 25h ago)
**PR:** Not started
**Blockers:** None
**⚠️ Awaiting acknowledgment (SLA breached)**

---

## 🚧 Blockers Requiring Attention

| Priority | Contractor | Story | Blocker | Hours Blocked |
|----------|------------|-------|---------|---------------|
| 🔴 HIGH | mobile-001 | STORY-125 | Firebase access | 26h |
| 🟡 MED | frontend-001 | STORY-124 | Waiting on STORY-123 | 24h |

### Recommended Actions:
1. **[URGENT]** Grant mobile-001 Firebase staging access
2. **[MEDIUM]** Check STORY-123 progress for frontend unblock

---

## ⏰ Deadline Status

| Status | Story | Contractor | Deadline | Progress |
|--------|-------|------------|----------|----------|
| 🟠 At Risk | STORY-123 | backend-001 | Nov 29 | 70% |
| 🟡 Approaching | STORY-126 | qa-001 | Nov 30 | 50% |

---

## 📋 Action Items

1. [ ] Resolve Firebase access for mobile-001
2. [ ] Follow up with researcher-001 on STORY-127 acknowledgment
3. [ ] Monitor STORY-123 for on-time delivery
4. [ ] Prepare STORY-124 unblock once STORY-123 completes

---

## 📧 Pending Communications

| Type | Contractor | Subject | Hours Pending |
|------|------------|---------|---------------|
| Question | frontend-001 | API response format | 18h |
| Reminder | researcher-001 | Acknowledgment needed | Due now |

---

*This summary was generated automatically. Reply with questions or updates.*
*Correlation ID: standup-{date}*
```

**Output:** Complete standup summary document

---

### Stage 5: Distribute Summary

**Objective:** Send standup summary via SMTP to all participants.

**Email Distribution:**

1. **Full Summary Email** (to all active contractors):
   ```
   Subject: [PROJECT] Daily Standup - {date}

   Team,

   Here's today's standup summary.

   {full_summary}

   Please reply with any updates or corrections.

   --
   Project Coordinator
   ```

2. **Individual Status Email** (to each contractor):
   ```
   Subject: [PROJECT] Your Status - {date}

   Hi {contractor_name},

   Your current status:
   - Story: {story_id} - {story_title}
   - Progress: {progress}
   - {blocker_section_if_any}

   {action_items_for_this_contractor}

   Reply with PROGRESS, SUBMITTED, or BLOCKED to update your status.

   --
   Project Coordinator
   Correlation ID: standup-{date}-{contractor_id}
   ```

3. **Blocker Digest Email** (to coordinator/stakeholders):
   ```
   Subject: [PROJECT] 🚧 Blockers Digest - {date}

   {blocker_count} blockers require attention:

   {blocker_list_with_actions}

   Please address or delegate these items.

   --
   Automated Standup System
   ```

**Send Emails:**

Use `send-email` task for each recipient:

```yaml
emails_to_send:
  - template: "standup-team-summary"
    to: "{all_contractor_emails}"
    subject: "[PROJECT] Daily Standup - {date}"

  - template: "standup-individual"
    to: "{each_contractor_email}"
    subject: "[PROJECT] Your Status - {date}"
    variables:
      contractor_id: "{id}"

  - template: "standup-blocker-digest"
    to: "{coordinator_email}"
    subject: "[PROJECT] 🚧 Blockers Digest - {date}"
    condition: "blockers.length > 0"
```

**Output:** All standup emails sent

---

### Stage 6: Escalate If Needed

**Objective:** Trigger escalations for critical blockers or SLA breaches.

**Escalation Triggers:**

| Condition | Action |
|-----------|--------|
| Blocker > 48 hours | Escalate to coordinator |
| Deadline missed | Immediate escalation |
| No response > 72 hours | Reassignment consideration |
| Critical blocker | Urgent escalation email |

**Escalation Process:**

```yaml
escalations:
  - trigger: "blocker_duration > 48h"
    action: "escalate-blocker workflow"
    parameters:
      blocker_id: "{blocker_id}"
      urgency: "high"

  - trigger: "deadline_missed"
    action: "escalate-blocker workflow"
    parameters:
      story_id: "{story_id}"
      urgency: "critical"

  - trigger: "no_response > 72h"
    action: "send reminder"
    parameters:
      contractor_id: "{contractor_id}"
      escalation_level: 2
```

**Escalation Email:**

```
Subject: [PROJECT] 🚨 ESCALATION - {blocker_description}

This blocker has exceeded acceptable duration:

**Blocker:** {description}
**Contractor:** {contractor_name}
**Story:** {story_id}
**Blocked Since:** {blocked_since}
**Duration:** {hours} hours

**Impact:**
- {downstream_impacts}

**Recommended Action:**
{recommended_action}

Please respond within 4 hours.

--
Automated Escalation System
Correlation ID: escalation-{id}
```

**Output:** Escalations triggered where needed

---

## Events Published

**contractor.standup.completed:**
```yaml
date: "2025-11-28"
summary:
  active_contractors: 5
  stories_in_progress: 6
  blockers: 2
  at_risk_deadlines: 1
emails_sent: 8
escalations_triggered: 1
generated_at: "2025-11-28T09:15:00Z"
```

---

## Scheduling

### Automated Runs

```yaml
schedule:
  daily_standup:
    cron: "0 9 * * 1-5"  # 9 AM UTC, weekdays
    timezone: "UTC"

  weekly_summary:
    cron: "0 9 * * 1"    # Monday 9 AM
    include_weekly_metrics: true
```

### Manual Trigger

Use `*standup` command from Contractor Coordinator to generate on-demand.

---

## Configuration Options

```yaml
standup:
  # Recipients
  include_all_contractors: true
  include_coordinator: true
  additional_recipients: []

  # Content
  include_blockers: true
  include_deadlines: true
  include_pending_reviews: true
  include_pr_status: true

  # Thresholds
  blocker_warning_hours: 24
  blocker_critical_hours: 48
  deadline_warning_days: 2

  # Email settings
  send_team_summary: true
  send_individual_status: true
  send_blocker_digest: true
```

---

## Tips for Effective Standups

1. **Keep it async** - Email summaries respect timezone differences
2. **Highlight blockers** - Make impediments visible immediately
3. **Track patterns** - Watch for recurring blockers
4. **Follow up** - Use escalation for unresolved issues
5. **Be consistent** - Run at the same time daily
